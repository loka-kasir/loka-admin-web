"""Memindahkan jadwal posting sesuai moves.json supaya kalender maksimal dua posting per hari.

Hanya jadwal yang berubah: caption, teks Threads, dan media dikirim ulang persis seperti yang tersimpan.
Berjalan di server lewat SSH dan masuk ke API admin di 127.0.0.1 memakai kredensial di .env server;
kredensial tidak dicetak dan tidak keluar dari server.

Pemakaian:  python3 apply.py --dry-run   lalu   python3 apply.py
Aman diulang: posting yang sudah berada di jadwal barunya dilewati. Posting dilewati bila sudah tayang,
jadwalnya bukan jadwal asal di moves.json, atau jadwal asal/tujuannya kurang dari 30 menit lagi.
"""
from pathlib import Path
import json
import shlex
import subprocess
import sys

ROOT = Path(__file__).resolve().parent
HOST = 'tencent-lighthouse'
REMOTE_DIR = '/tmp/loka-kalender-2x-20261122'
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
        body = json.dumps(body, ensure_ascii=False).encode('utf-8'); headers['Content-Type'] = 'application/json'
    if token: headers['Authorization'] = 'Bearer ' + token
    for attempt in range(6):
        try:
            with urlopen(Request(BASE + path, data=body, method=method, headers=headers), timeout=60) as response:
                result = json.load(response)
            break
        except HTTPError as error:
            if error.code == 429 and attempt < 5:
                sleep(15); continue
            try: message = json.load(error).get('message', '')
            except ValueError: message = ''
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
            if len(value) >= 2 and value[0] in ('"', "'") and value[0] == value[-1]: value = value[1:-1]
            config[key.strip()] = value
    token = api('POST', '/admin/login', {'username': config['ADMIN_USERNAME'], 'password': config['ADMIN_PASSWORD']})['token']

def ts(raw):
    return datetime.fromisoformat(raw.replace('Z', '+00:00')).astimezone(WIB)

def calendar():
    query = urlencode({'from': '2026-11-21T00:00:00+07:00', 'to': '2027-02-01T00:00:00+07:00'})
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
    if not post: skipped.append((move['code'], 'tidak ada di kalender')); continue
    now_at = ts(post['scheduled_at'])
    if now_at == ts(move['to']) and post['status'] == 'scheduled': done.append(move['code']); continue
    if post['status'] != 'scheduled' or 'edit' not in post['allowed_actions']: skipped.append((move['code'], 'status ' + post['status'])); continue
    if now_at != ts(move['from']): skipped.append((move['code'], 'jadwal asal berbeda')); continue
    if now_at < soon or ts(move['to']) < soon: skipped.append((move['code'], 'terlalu dekat dengan jam tayang')); continue
    todo.append(move)

# Keadaan akhir yang diharapkan: tidak ada slot ganda dan tidak ada hari dengan lebih dari dua posting.
final = {key: ts(p['scheduled_at']) for key, p in start.items() if p['status'] == 'scheduled' and p.get('scheduled_at')}
for move in todo: final[move['id']] = ts(move['to'])
per_day = Counter(t.strftime('%Y-%m-%d') for t in final.values())
for slot in PLAN['billing_slots']: per_day[slot[:10]] += 1
over = {day: n for day, n in per_day.items() if n > 2 and day > datetime.now(WIB).strftime('%Y-%m-%d')}
print(json.dumps({'in_calendar': len(start), 'to_move': len(todo), 'already_moved': len(done), 'skipped': skipped, 'days_over_two': over}, ensure_ascii=False), flush=True)
assert len(set(final.values())) == len(final), 'ada dua posting di slot yang sama'
if DRY_RUN or over:
    sys.exit(1 if over else 0)

moved = set(m['id'] for m in PLAN['moves'] if m['code'] in done)
for count, move in enumerate(todo, 1):
    path = '/admin/social/posts/' + move['id']
    post = api('GET', path)
    if post['status'] != 'scheduled' or post['updated_at'] != start[move['id']]['updated_at']:
        skipped.append((move['code'], 'berubah saat proses')); continue
    media_ids = [m['id'] for m in ordered(post)]
    saved = api('PUT', path, {'caption': post['caption'], 'threads_text': post['threads_text'], 'threads_enabled': post['threads_enabled'],
                              'media_ids': media_ids, 'schedule': True, 'scheduled_at': move['to']})
    assert saved['status'] == 'scheduled' and ts(saved['scheduled_at']) == ts(move['to']) and [m['id'] for m in ordered(saved)] == media_ids, move['code']
    assert (saved['caption'], saved['threads_text'], saved['threads_enabled']) == (post['caption'], post['threads_text'], post['threads_enabled']), move['code']
    moved.add(move['id'])
    print(f"{count}/{len(todo)} {move['code']} {move['from'][:16]} -> {move['to'][:16]}", flush=True)

end = calendar()
assert end.keys() == start.keys()
strip = lambda p: {k: v for k, v in p.items() if k not in ('scheduled_at', 'updated_at', 'threads_status', 'allowed_actions')}
for key, post in start.items():
    if key in moved: assert strip(end[key]) == strip(post), key        # hanya jadwal yang berubah
    else: assert end[key] == post or end[key]['status'] != post['status'], key
per_day = Counter(ts(p['scheduled_at']).strftime('%Y-%m-%d') for p in end.values() if p['status'] == 'scheduled')
print('RECEIPT ' + json.dumps({'account': '@lokakasir.id', 'verified_at': datetime.now(WIB).isoformat(), 'moved': len(moved), 'skipped': skipped,
      'other_posts_unchanged': len(end) - len(moved), 'scheduled_total': sum(per_day.values()),
      'max_per_day_before_billing': max(n for day, n in per_day.items() if day > datetime.now(WIB).strftime('%Y-%m-%d')),
      'posts': sorted(({'id': key, 'scheduled_at': ts(end[key]['scheduled_at']).isoformat(), 'title': end[key]['caption'].splitlines()[0][:80]} for key in moved), key=lambda v: v['scheduled_at'])}, ensure_ascii=False), flush=True)
'''
header = f'REMOTE_DIR = {REMOTE_DIR!r}\nDRY_RUN = {dry_run!r}\nimport json as _j\nPLAN = _j.loads({json.dumps(plan, ensure_ascii=False)!r})\n'
ssh = ['ssh', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10', '-o', 'ServerAliveInterval=30', HOST]
subprocess.run(ssh + [f'umask 077; mkdir -p {shlex.quote(REMOTE_DIR)}; cat > {shlex.quote(REMOTE_DIR)}/apply.py'], input=(header + remote).encode('utf-8'), check=True)
process = subprocess.Popen(ssh + [f'python3 {shlex.quote(REMOTE_DIR)}/apply.py'], stdout=subprocess.PIPE)
for raw in process.stdout:
    line = raw.decode('utf-8').rstrip('\n')
    if line.startswith('RECEIPT '):
        receipt = json.loads(line[8:])
        (ROOT / 'verifikasi-jadwal.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=1) + '\n')
        print(f"Terverifikasi: {receipt['moved']} posting pindah jadwal, {receipt['other_posts_unchanged']} posting lain tidak berubah, "
              f"paling banyak {receipt['max_per_day_before_billing']} posting per hari sebelum Billing, {len(receipt['skipped'])} dilewati.", flush=True)
    else:
        print(line, flush=True)
sys.exit(process.wait())
