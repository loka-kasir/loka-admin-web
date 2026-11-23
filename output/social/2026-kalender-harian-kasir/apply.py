"""Memindahkan jadwal posting sesuai moves.json lewat API Loka Admin.

Hanya jadwal tayang (scheduled_at) yang berubah: caption, teks Threads, dan media
dikirim ulang persis seperti yang tersimpan. Berjalan di server lewat SSH dan
memakai API lokal 127.0.0.1 dengan kredensial .env server.

Pemakaian:
  python3 apply.py --dry-run
  python3 apply.py
"""
from pathlib import Path
import json
import shlex
import subprocess
import sys

ROOT = Path(__file__).resolve().parent
HOST = 'tencent-lighthouse'
REMOTE_DIR = '/tmp/loka-kalender-harian-kasir-20261123'
dry_run = '--dry-run' in sys.argv
plan = json.loads((ROOT / 'moves.json').read_text())

remote = r'''
from collections import Counter
from datetime import datetime, timedelta
from pathlib import Path
from time import sleep
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo
import json, os, sys

os.umask(0o077)
WIB = ZoneInfo('Asia/Jakarta')
BASE = 'http://127.0.0.1:8080'
root = Path(REMOTE_DIR); root.mkdir(parents=True, exist_ok=True)
token = None

def api(method, path, body=None):
    headers = {'Accept': 'application/json'}
    if body is not None:
        body = json.dumps(body, ensure_ascii=False).encode('utf-8')
        headers['Content-Type'] = 'application/json'
    if token:
        headers['Authorization'] = 'Bearer ' + token
    for attempt in range(6):
        try:
            with urlopen(Request(BASE + path, data=body, method=method, headers=headers), timeout=60) as response:
                result = json.load(response)
            break
        except HTTPError as error:
            if error.code == 429 and attempt < 5:
                sleep(15); continue
            try:
                message = json.load(error).get('message', '')
            except ValueError:
                message = ''
            raise RuntimeError(f'{method} {path}: HTTP {error.code}. {message}') from None
    if not result.get('status') or 'data' not in result:
        raise RuntimeError(f'{method} {path}: respons API tidak sesuai')
    return result['data']

def login():
    global token
    config = {}
    for line in Path('/home/ubuntu/loka-kasir-service/.env').read_text().splitlines():
        key, sep, value = line.partition('=')
        if sep and key.strip() in ('ADMIN_USERNAME', 'ADMIN_PASSWORD'):
            value = value.strip()
            if len(value) >= 2 and value[0] in ('"', "'") and value[0] == value[-1]:
                value = value[1:-1]
            config[key.strip()] = value
    token = api('POST', '/admin/login', {'username': config['ADMIN_USERNAME'], 'password': config['ADMIN_PASSWORD']})['token']

def ts(raw):
    return datetime.fromisoformat(raw.replace('Z', '+00:00')).astimezone(WIB)

def calendar():
    query = urlencode({'from': '2026-11-22T00:00:00+07:00', 'to': '2027-02-01T00:00:00+07:00'})
    return {p['id']: p for p in (api('GET', '/admin/social/posts?' + query) or [])}

def ordered(post):
    return sorted(post['media'], key=lambda m: m['position'])

login()
start = calendar()
if not (root / 'before-live.json').exists():
    (root / 'before-live.json').write_text(json.dumps(list(start.values()), ensure_ascii=False))
soon = datetime.now(WIB) + timedelta(minutes=30)
todo, done, skipped = [], [], []
for move in PLAN['moves']:
    post = start.get(move['id'])
    if not post:
        skipped.append((move['id'][:8], 'tidak ada di kalender')); continue
    now_at = ts(post['scheduled_at'])
    if now_at == ts(move['to']) and post['status'] == 'scheduled':
        done.append(move['id']); continue
    if post['status'] != 'scheduled' or 'edit' not in post['allowed_actions']:
        skipped.append((move['id'][:8], 'status ' + post['status'])); continue
    if now_at != ts(move['from']):
        skipped.append((move['id'][:8], f"jadwal asal berbeda ({now_at.isoformat()} != {move['from']})")); continue
    if now_at < soon or ts(move['to']) < soon:
        skipped.append((move['id'][:8], 'terlalu dekat dengan jam tayang')); continue
    todo.append(move)

final = {key: ts(p['scheduled_at']) for key, p in start.items() if p['status'] == 'scheduled' and p.get('scheduled_at')}
for move in todo:
    final[move['id']] = ts(move['to'])
per_day = Counter(t.strftime('%Y-%m-%d') for t in final.values())
# Slot 23 Nov 20:00 disiapkan untuk video bot baru.
bot_slot = ts(PLAN['new_bot_slot'])
assert bot_slot not in final.values(), 'Slot video bot masih terisi!'
per_day[bot_slot.strftime('%Y-%m-%d')] += 1
over = {day: n for day, n in per_day.items() if n > 2}
assert len(set(final.values())) == len(final), 'ada dua posting di slot yang sama'
print(json.dumps({
    'in_calendar': len(start),
    'to_move': len(todo),
    'already_moved': len(done),
    'skipped': skipped,
    'days_over_two': over,
    'bot_slot_free': bot_slot not in final.values(),
}, ensure_ascii=False), flush=True)
if DRY_RUN or over or skipped:
    sys.exit(1 if (over or skipped) else 0)

moved = set(done)
for count, move in enumerate(todo, 1):
    path = '/admin/social/posts/' + move['id']
    post = api('GET', path)
    if post['status'] != 'scheduled' or post['updated_at'] != start[move['id']]['updated_at']:
        skipped.append((move['id'][:8], 'berubah saat proses')); continue
    media_ids = [m['id'] for m in ordered(post)]
    saved = api('PUT', path, {
        'caption': post['caption'],
        'threads_text': post['threads_text'],
        'threads_enabled': post['threads_enabled'],
        'media_ids': media_ids,
        'schedule': True,
        'scheduled_at': move['to'],
    })
    assert saved['status'] == 'scheduled' and ts(saved['scheduled_at']) == ts(move['to'])
    assert [m['id'] for m in ordered(saved)] == media_ids
    assert (saved['caption'], saved['threads_text'], saved['threads_enabled']) == (post['caption'], post['threads_text'], post['threads_enabled'])
    moved.add(move['id'])
    if count % 15 == 0 or count == len(todo):
        print(f"{count}/{len(todo)} dipindah ({move['from'][:16]} -> {move['to'][:16]})", flush=True)

end = calendar()
assert end.keys() == start.keys()
strip = lambda p: {k: v for k, v in p.items() if k not in ('scheduled_at', 'updated_at', 'threads_status', 'allowed_actions')}
for key, post in start.items():
    if key in moved:
        assert strip(end[key]) == strip(post), key
    else:
        assert end[key] == post or end[key]['status'] != post['status'], key
per_day = Counter(ts(p['scheduled_at']).strftime('%Y-%m-%d') for p in end.values() if p['status'] == 'scheduled')
print('RECEIPT ' + json.dumps({
    'account': '@lokakasir.id',
    'verified_at': datetime.now(WIB).isoformat(),
    'moved': len(moved),
    'skipped': skipped,
    'other_posts_unchanged': len(end) - len(moved),
    'scheduled_total': sum(per_day.values()),
    'max_per_day': max(per_day.values()),
    'bot_slot_free': bot_slot not in {ts(p['scheduled_at']) for p in end.values() if p['status'] == 'scheduled'},
    'posts': sorted(
        ({
            'id': key,
            'scheduled_at': ts(end[key]['scheduled_at']).isoformat(),
            'title': end[key]['caption'].splitlines()[0][:80],
        } for key in moved),
        key=lambda v: v['scheduled_at'],
    ),
}, ensure_ascii=False), flush=True)
'''

header = f'REMOTE_DIR = {REMOTE_DIR!r}\nDRY_RUN = {dry_run!r}\nimport json as _j\nPLAN = _j.loads({json.dumps(plan, ensure_ascii=False)!r})\n'
ssh = ['ssh', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10', '-o', 'ServerAliveInterval=30', HOST]
subprocess.run(
    ssh + [f'umask 077; mkdir -p {shlex.quote(REMOTE_DIR)}; cat > {shlex.quote(REMOTE_DIR)}/apply.py'],
    input=(header + remote).encode('utf-8'),
    check=True,
)
process = subprocess.Popen(ssh + [f'python3 {shlex.quote(REMOTE_DIR)}/apply.py'], stdout=subprocess.PIPE)
assert process.stdout is not None
for raw in process.stdout:
    line = raw.decode('utf-8').rstrip('\n')
    if line.startswith('RECEIPT '):
        receipt = json.loads(line[8:])
        (ROOT / 'verifikasi-jadwal.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n')
        print(
            f"Terverifikasi: {receipt['moved']} posting pindah jadwal, "
            f"{receipt['other_posts_unchanged']} lain tidak berubah, "
            f"maks {receipt['max_per_day']}/hari, slot bot bebas={receipt['bot_slot_free']}.",
            flush=True,
        )
    else:
        print(line, flush=True)
sys.exit(process.wait())
