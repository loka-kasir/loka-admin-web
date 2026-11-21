"""Mengunggah media dan menjadwalkan 14 posting kampanye ini di Loka Admin.

Mengikuti cara kampanye sebelumnya: skrip dijalankan di server lewat SSH dan masuk ke API admin
di 127.0.0.1 memakai kredensial admin yang ada di .env server. Kredensial tidak pernah keluar
dari server dan tidak dicetak. Yang dilakukan hanya: membaca status akun dan kalender, mengunggah
media, membuat posting BARU, lalu membaca ulang. Posting yang sudah ada tidak diubah.

Pemakaian:  python3 tools/schedule.py --dry-run   (cek slot dan akun, tanpa mengunggah)
            python3 tools/schedule.py             (unggah dan jadwalkan)
Aman diulang: posting dengan caption dan jadwal yang sama dilewati, unggahan yang sudah selesai dipakai lagi.
"""
from datetime import datetime, timedelta
from hashlib import sha256
from pathlib import Path
from zoneinfo import ZoneInfo
import io
import json
import shlex
import subprocess
import sys
import tarfile

ROOT = Path(__file__).resolve().parent.parent
HOST = 'tencent-lighthouse'
REMOTE_DIR = '/tmp/loka-viral-accounting-hris'
WIB = ZoneInfo('Asia/Jakarta')
dry_run = '--dry-run' in sys.argv

campaign = json.loads((ROOT / 'campaign.json').read_text())
plan = []
archive = io.BytesIO()
with tarfile.open(fileobj=archive, mode='w') as bundle:
    for post in campaign:
        folder = ROOT / post['folder']
        caption = (folder / 'caption.txt').read_text().strip()
        threads = (folder / 'threads.txt').read_text().strip()
        assert caption == post['caption'].strip() and threads == post['threads'].strip(), post['code']
        assert len(caption) <= 2200 and len(threads) <= 500, post['code']
        media = []
        for name in post['media']:
            data = (folder / name).read_bytes()
            path = f"{post['folder']}/{name}"
            media.append({'path': path, 'kind': 'video' if name.endswith('.mp4') else 'image', 'sha256': sha256(data).hexdigest()})
            if not dry_run:
                info = tarfile.TarInfo(path); info.size = len(data)
                bundle.addfile(info, io.BytesIO(data))
        assert len(media) == (1 if post['format'] == 'video' else 4), post['code']
        plan.append({'code': post['code'], 'title': post['title'], 'format': post['format'], 'scheduled_at': post['scheduled_at'],
                     'caption': caption, 'threads_text': threads, 'media': media})
assert len(plan) == 14 and len({row['scheduled_at'] for row in plan}) == 14
first = min(datetime.fromisoformat(row['scheduled_at']) for row in plan)
assert first > datetime.now(WIB) + timedelta(minutes=15), 'Slot pertama terlalu dekat atau sudah lewat.'

remote = r'''
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta
from hashlib import sha256
from pathlib import Path
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

def api(method, path, body=None, content_type=None, timeout=60):
    headers = {'Accept': 'application/json'}
    if isinstance(body, dict):
        body = json.dumps(body, ensure_ascii=False).encode('utf-8'); content_type = 'application/json'
    if content_type: headers['Content-Type'] = content_type
    if token: headers['Authorization'] = 'Bearer ' + token
    try:
        with urlopen(Request(BASE + path, data=body, method=method, headers=headers), timeout=timeout) as response:
            result = json.load(response)
    except HTTPError as error:
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
    query = urlencode({'from': '2026-11-21T00:00:00+07:00', 'to': '2026-12-07T00:00:00+07:00'})
    return api('GET', '/admin/social/posts?' + query) or []

def save(path, value):
    tmp = path.with_suffix('.tmp'); tmp.write_text(json.dumps(value, ensure_ascii=False, indent=1)); tmp.replace(path)

def available(url):
    with urlopen(Request(url, method='HEAD'), timeout=30) as response:
        return response.status == 200

files = {}
if not DRY_RUN:
    with tarfile.open(fileobj=sys.stdin.buffer, mode='r|') as bundle:
        files = {m.name: bundle.extractfile(m).read() for m in bundle if m.isfile()}
    assert all(sha256(files[m['path']]).hexdigest() == m['sha256'] for row in PLAN for m in row['media'])

login()
accounts = api('GET', '/admin/social/status')
last = max(ts(row['scheduled_at']) for row in PLAN)
for platform in ('instagram', 'threads'):
    account = accounts[platform]
    assert account['connected'] and account.get('username') == 'lokakasir.id', f'{platform} tidak terhubung ke @lokakasir.id'
    expires = ts(account.get('expires_at'))
    assert not expires or expires > last + timedelta(days=1), f'token {platform} habis sebelum posting terakhir'
before = calendar()
taken = {ts(p['scheduled_at']): p for p in before if p.get('scheduled_at') and p['status'] in ('scheduled', 'publishing', 'published')}
mine = {}
for row in PLAN:
    slot = ts(row['scheduled_at'])
    other = taken.get(slot)
    if other and other['caption'] == row['caption']:
        mine[row['code']] = other['id']          # sudah dibuat pada percobaan sebelumnya
    elif other:
        sys.exit(f"Slot {row['scheduled_at']} sudah dipakai posting lain ({other['id']}). Tidak ada yang diubah.")
    # Jarak ke posting lain minimal 2 jam supaya feed tidak bertumpuk.
    for when, p in taken.items():
        if p['id'] != mine.get(row['code']) and abs((when - slot).total_seconds()) < 2 * 3600:
            sys.exit(f"Slot {row['scheduled_at']} terlalu dekat dengan posting {p['id']} ({when.isoformat()}).")
print(json.dumps({'accounts': {k: accounts[k].get('username') for k in ('instagram', 'threads')}, 'existing_in_range': len(before),
                  'already_created': len(mine), 'to_create': len(PLAN) - len(mine)}), flush=True)
if DRY_RUN:
    sys.exit(0)

progress_path = root / 'progress.json'
progress = json.loads(progress_path.read_text()) if progress_path.exists() else {}
def upload(media):
    data = files[media['path']]
    boundary = uuid4().hex
    mime = 'video/mp4' if media['kind'] == 'video' else 'image/jpeg'
    head = (f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="{Path(media["path"]).name}"\r\n'
            f'Content-Type: {mime}\r\n\r\n').encode('ascii')
    got = api('POST', '/admin/social/media', head + data + f'\r\n--{boundary}--\r\n'.encode('ascii'),
              f'multipart/form-data; boundary={boundary}', timeout=300)
    want = ('video', 1080, 1920) if media['kind'] == 'video' else ('image', 1080, 1350)
    assert (got['kind'], got['width'], got['height']) == want, media['path']
    return got['id']

for row in PLAN:
    if row['code'] in mine:
        print(f"lewati {row['code']} (sudah terjadwal)", flush=True); continue
    ids = progress.setdefault(row['code'], [])
    for offset, media in enumerate(row['media']):
        if offset == len(ids):
            ids.append(upload(media)); save(progress_path, progress)
    post = api('POST', '/admin/social/posts', {'caption': row['caption'], 'threads_text': row['threads_text'], 'threads_enabled': True,
                                               'media_ids': ids, 'schedule': True, 'scheduled_at': row['scheduled_at']})
    mine[row['code']] = post['id']
    print(f"{row['scheduled_at'][:16]} · {row['format']} · {row['title']}", flush=True)

after = {p['id']: p for p in calendar()}
old = {p['id']: p for p in before}
assert all(after.get(key) == value for key, value in old.items() if key not in mine.values()), 'Posting lain berubah.'
verified, urls = [], []
for row in PLAN:
    post = api('GET', '/admin/social/posts/' + mine[row['code']])
    assert post['status'] == 'scheduled' and post['threads_enabled'] and post['threads_status'] == 'waiting', row['code']
    assert ts(post['scheduled_at']) == ts(row['scheduled_at']), row['code']
    assert post['caption'] == row['caption'] and post['threads_text'] == row['threads_text'], row['code']
    assert [m['kind'] for m in post['media']] == [m['kind'] for m in row['media']], row['code']
    urls += [m['url'] for m in post['media']]
    verified.append({'code': row['code'], 'id': post['id'], 'title': row['title'], 'format': row['format'], 'scheduled_at': row['scheduled_at'],
                     'media_ids': [m['id'] for m in post['media']], 'instagram_status': post['status'], 'threads_status': post['threads_status']})
with ThreadPoolExecutor(max_workers=5) as pool:
    assert all(pool.map(available, urls)), 'Ada media yang tidak dapat diakses.'
print('RECEIPT ' + json.dumps({'account': '@lokakasir.id', 'verified_at': datetime.now(WIB).isoformat(), 'created': len(verified),
      'media_reachable': len(urls), 'scheduled_in_range': sum(1 for p in after.values() if p['status'] == 'scheduled'), 'posts': verified}, ensure_ascii=False), flush=True)
'''
header = f'REMOTE_DIR = {REMOTE_DIR!r}\nDRY_RUN = {dry_run!r}\nPLAN = {json.dumps(plan, ensure_ascii=False)!r}\nimport json as _j\nPLAN = _j.loads(PLAN)\n'
# Skrip dikirim sebagai berkas (bukan argumen) karena memuat seluruh naskah; media menyusul lewat stdin.
script = (header + remote).encode('utf-8')
subprocess.run(['ssh', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10', HOST, f'umask 077; mkdir -p {shlex.quote(REMOTE_DIR)}; cat > {shlex.quote(REMOTE_DIR)}/apply.py'], input=script, check=True)
result = subprocess.run(['ssh', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10', HOST, f'python3 {shlex.quote(REMOTE_DIR)}/apply.py'],
                        input=archive.getvalue() if not dry_run else b'', stdout=subprocess.PIPE, check=False)
out = result.stdout.decode('utf-8')
for line in out.splitlines():
    if line.startswith('RECEIPT '):
        receipt = json.loads(line[8:])
        (ROOT / 'verifikasi-jadwal.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=1) + '\n')
        print(f"Terverifikasi: {receipt['created']} posting terjadwal, {receipt['media_reachable']} media dapat diakses.")
    else:
        print(line)
sys.exit(result.returncode)
