"""Memasang slide v4 ke 84 posting Loka Kasir yang masih antre di Loka Admin.

Yang berubah hanya media: sampul lama dipertahankan (kecuali dua posting gaya lama), slide berikutnya
diganti. Caption, teks Threads, ID, dan jadwal dikirim ulang persis seperti yang tersimpan.
Skrip berjalan di server lewat SSH dan masuk ke API admin di 127.0.0.1 memakai kredensial di .env
server; kredensial tidak dicetak dan tidak keluar dari server.

Pemakaian:  python3 tools/apply.py --dry-run   (cek keadaan antrean, tanpa mengunggah)
            python3 tools/apply.py             (unggah dan pasang)
Aman diulang: unggahan yang selesai dipakai lagi dan posting yang sudah memakai media baru dilewati.
Posting dilewati (tidak diubah) bila sudah tayang, sedang tayang, kurang dari 30 menit lagi, atau
isinya berbeda dari before.json.
"""
from hashlib import sha256
from pathlib import Path
import io
import json
import shlex
import subprocess
import sys
import tarfile

ROOT = Path(__file__).resolve().parent.parent
HOST = 'tencent-lighthouse'
REMOTE_DIR = '/tmp/loka-social-v4-20261121'
dry_run = '--dry-run' in sys.argv

before = {p['id']: p for p in json.loads((ROOT / 'before.json').read_text())['posts']}
plan = []
archive = io.BytesIO()
with tarfile.open(fileobj=archive, mode='w') as bundle:
    for post in json.loads((ROOT / 'plan.json').read_text()):
        old = before[post['id']]
        assert len(old['media']) == post['slides_after'] == len(post['files']) + (1 if post['keep_cover'] else 0), post['code']
        media = []
        for name in post['files']:
            data = (ROOT / name).read_bytes()
            assert data[:2] == b'\xff\xd8', name
            media.append({'path': name, 'sha256': sha256(data).hexdigest()})
            if not dry_run:
                info = tarfile.TarInfo(name); info.size = len(data)
                bundle.addfile(info, io.BytesIO(data))
        plan.append({'id': post['id'], 'code': post['code'], 'title': post['title'], 'keep_cover': post['keep_cover'], 'media': media,
                     'caption': old['caption'], 'threads_enabled': old['threads_enabled'], 'threads_text': old['threads_text'],
                     'scheduled_at': old['scheduled_at'], 'old_urls': [m['url'] for m in old['media']]})
assert len(plan) == 84 and len({row['id'] for row in plan}) == 84

remote = r'''
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta
from hashlib import sha256
from pathlib import Path
from time import sleep
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from uuid import uuid4
from zoneinfo import ZoneInfo
import json, os, sys, tarfile

os.umask(0o077)
WIB = ZoneInfo('Asia/Jakarta')
BASE = 'http://127.0.0.1:8080'
root = Path(REMOTE_DIR); root.mkdir(parents=True, exist_ok=True)
token = None

def api(method, path, body=None, content_type=None, timeout=90):
    headers = {'Accept': 'application/json'}
    if isinstance(body, dict):
        body = json.dumps(body, ensure_ascii=False).encode('utf-8'); content_type = 'application/json'
    if content_type: headers['Content-Type'] = content_type
    if token: headers['Authorization'] = 'Bearer ' + token
    for attempt in range(6):
        try:
            with urlopen(Request(BASE + path, data=body, method=method, headers=headers), timeout=timeout) as response:
                result = json.load(response)
            break
        except HTTPError as error:
            if error.code == 429 and attempt < 5:   # batas 300 permintaan per menit untuk rute admin
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
    return datetime.fromisoformat(raw.replace('Z', '+00:00')).astimezone(WIB) if raw else None

def calendar():
    query = urlencode({'from': '2026-11-21T00:00:00+07:00', 'to': '2027-01-10T00:00:00+07:00'})
    return {p['id']: p for p in (api('GET', '/admin/social/posts?' + query) or [])}

def save(path, value):
    tmp = path.with_suffix('.tmp'); tmp.write_text(json.dumps(value, ensure_ascii=False, indent=1)); tmp.replace(path)

def ordered(post):
    return sorted(post['media'], key=lambda m: m['position'])

def available(url):
    for attempt in range(3):
        try:
            with urlopen(Request(url, method='HEAD'), timeout=30) as response:
                return response.status == 200
        except OSError:
            if attempt == 2: return False
            sleep(2)

progress_path = root / 'progress.json'
progress = json.loads(progress_path.read_text()) if progress_path.exists() else {}
files = {}
if not DRY_RUN:
    with tarfile.open(fileobj=sys.stdin.buffer, mode='r|') as bundle:
        files = {m.name: bundle.extractfile(m).read() for m in bundle if m.isfile()}
    assert all(sha256(files[m['path']]).hexdigest() == m['sha256'] for row in PLAN for m in row['media'])

login()
start = calendar()
if not (root / 'before-live.json').exists():
    save(root / 'before-live.json', list(start.values()))
now = datetime.now(WIB)
todo, skipped, done = [], [], []
for row in PLAN:
    post = start.get(row['id'])
    new_ids = progress.get(row['id'], [])
    if not post:
        skipped.append((row['code'], 'tidak ada di kalender')); continue
    media = ordered(post)
    if len(new_ids) == len(row['media']) and [m['id'] for m in media][-len(new_ids):] == new_ids:
        done.append(row['code']); continue
    reason = None
    if post['status'] != 'scheduled' or 'edit' not in post['allowed_actions']: reason = 'status ' + post['status']
    elif ts(post['scheduled_at']) < now + timedelta(minutes=30): reason = 'tayang kurang dari 30 menit lagi'
    elif ts(post['scheduled_at']) != ts(row['scheduled_at']): reason = 'jadwal berubah'
    elif post['caption'] != row['caption'] or post['threads_text'] != row['threads_text'] or post['threads_enabled'] != row['threads_enabled']: reason = 'naskah berubah'
    elif [m['url'] for m in media] != row['old_urls']: reason = 'media berubah sejak tinjauan'
    if reason: skipped.append((row['code'], reason))
    else: todo.append(row)
print(json.dumps({'in_calendar': len(start), 'to_update': len(todo), 'already_done': len(done), 'skipped': skipped}, ensure_ascii=False), flush=True)
if DRY_RUN:
    sys.exit(0)

def upload(media):
    data = files[media['path']]
    boundary = uuid4().hex
    head = (f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="{Path(media["path"]).name}"\r\n'
            'Content-Type: image/jpeg\r\n\r\n').encode('ascii')
    got = api('POST', '/admin/social/media', head + data + f'\r\n--{boundary}--\r\n'.encode('ascii'), f'multipart/form-data; boundary={boundary}')
    assert (got['kind'], got['width'], got['height']) == ('image', 1080, 1350), media['path']
    return got['id']

changed = set(done_id for done_id in [row['id'] for row in PLAN if row['code'] in done])
for count, row in enumerate(todo, 1):
    ids = progress.setdefault(row['id'], [])
    for offset, media in enumerate(row['media']):
        if offset == len(ids):
            ids.append(upload(media)); save(progress_path, progress)
    path = '/admin/social/posts/' + row['id']
    post = api('GET', path)                     # baca ulang tepat sebelum mengubah
    current = ordered(post)
    if post['status'] != 'scheduled' or post['updated_at'] != start[row['id']]['updated_at'] or [m['url'] for m in current] != row['old_urls']:
        skipped.append((row['code'], 'berubah saat proses')); continue
    media_ids = ([current[0]['id']] if row['keep_cover'] else []) + ids
    saved = api('PUT', path, {'caption': row['caption'], 'threads_text': row['threads_text'], 'threads_enabled': row['threads_enabled'],
                              'media_ids': media_ids, 'schedule': True, 'scheduled_at': post['scheduled_at']})
    assert [m['id'] for m in ordered(saved)] == media_ids and saved['status'] == 'scheduled', row['code']
    changed.add(row['id'])
    print(f"{count}/{len(todo)} {row['code']} · {row['title'][:60]}", flush=True)

final = calendar()
assert final.keys() == start.keys(), 'Jumlah posting di kalender berubah.'
targets = {row['id']: row for row in PLAN}
for key, post in start.items():                # posting di luar target tidak boleh berubah
    if key not in changed:
        assert final[key] == post or final[key]['status'] != post['status'], f'Posting {key} berubah.'
verified, urls = [], []
for key in changed:
    row, post, old = targets[key], final[key], start[key]
    media = ordered(post)
    assert post['status'] == 'scheduled' and ts(post['scheduled_at']) == ts(row['scheduled_at']), row['code']
    assert post['caption'] == row['caption'] and post['threads_text'] == row['threads_text'] and post['threads_enabled'] == row['threads_enabled'], row['code']
    assert post['threads_status'] == old['threads_status'], row['code']
    assert len(media) == len(row['old_urls']) and all(m['kind'] == 'image' and (m['width'], m['height']) == (1080, 1350) for m in media), row['code']
    if row['keep_cover']: assert media[0]['url'] == row['old_urls'][0], row['code']
    assert [m['id'] for m in media][-len(row['media']):] == progress[key], row['code']
    urls += [m['url'] for m in media]
    verified.append({'id': key, 'code': row['code'], 'title': row['title'], 'scheduled_at': row['scheduled_at'], 'cover_kept': row['keep_cover'],
                     'media_ids': [m['id'] for m in media]})
with ThreadPoolExecutor(max_workers=6) as pool:
    assert all(pool.map(available, urls)), 'Ada media yang tidak dapat diakses.'
verified.sort(key=lambda v: v['scheduled_at'])
print('RECEIPT ' + json.dumps({'account': '@lokakasir.id', 'verified_at': datetime.now(WIB).isoformat(), 'updated_posts': len(verified),
      'new_slides': sum(len(targets[v['id']]['media']) for v in verified), 'media_reachable': len(urls),
      'captions_threads_schedule_preserved': True, 'other_posts_unchanged': len(final) - len(verified), 'total_in_calendar': len(final),
      'skipped': skipped, 'posts': verified}, ensure_ascii=False), flush=True)
'''
header = f'REMOTE_DIR = {REMOTE_DIR!r}\nDRY_RUN = {dry_run!r}\nimport json as _j\nPLAN = _j.loads({json.dumps(plan, ensure_ascii=False)!r})\n'
ssh = ['ssh', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10', '-o', 'ServerAliveInterval=30', HOST]
subprocess.run(ssh + [f'umask 077; mkdir -p {shlex.quote(REMOTE_DIR)}; cat > {shlex.quote(REMOTE_DIR)}/apply.py'], input=(header + remote).encode('utf-8'), check=True)
process = subprocess.Popen(ssh + [f'python3 {shlex.quote(REMOTE_DIR)}/apply.py'], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
process.stdin.write(archive.getvalue() if not dry_run else b''); process.stdin.close()
for raw in process.stdout:
    line = raw.decode('utf-8').rstrip('\n')
    if line.startswith('RECEIPT '):
        receipt = json.loads(line[8:])
        (ROOT / 'release-verification.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=1) + '\n')
        print(f"Terverifikasi: {receipt['updated_posts']} posting, {receipt['new_slides']} slide baru, {receipt['media_reachable']} media dapat diakses, "
              f"{receipt['other_posts_unchanged']} posting lain tidak berubah, {len(receipt['skipped'])} dilewati.", flush=True)
    else:
        print(line, flush=True)
sys.exit(process.wait())
