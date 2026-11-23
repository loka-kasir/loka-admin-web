"""Mengunggah video Reels Tanya Loka dan menjadwalkannya ke 23 Nov 2026 20:00 WIB lewat API Loka Admin.

Pemakaian:
  python3 schedule.py --dry-run
  python3 schedule.py
"""
from datetime import datetime, timedelta
from hashlib import sha256
from pathlib import Path
from zoneinfo import ZoneInfo
import json
import re
import shlex
import subprocess
import sys

ROOT = Path(__file__).resolve().parent
HOST = 'tencent-lighthouse'
REMOTE_DIR = '/tmp/loka-tanya-loka-bot-20261123'
WIB = ZoneInfo('Asia/Jakarta')
SCHEDULED_AT = '2026-11-23T20:00:00+07:00'
dry_run = '--dry-run' in sys.argv

caption = (ROOT / 'caption.txt').read_text(encoding='utf-8').strip()
threads = (ROOT / 'threads.txt').read_text(encoding='utf-8').strip()
video_path = ROOT / 'video.mp4'

hashtags = re.findall(r'#[\w]+', caption, re.UNICODE)
assert 0 < len(caption) <= 2200, len(caption)
assert len(hashtags) <= 5, hashtags
assert 0 < len(threads) <= 500, len(threads)
assert video_path.exists(), f'Video belum ada: {video_path}'
video_bytes = video_path.read_bytes()
video_sha = sha256(video_bytes).hexdigest()
assert len(video_bytes) <= 100 * 1024 * 1024
assert datetime.fromisoformat(SCHEDULED_AT) > datetime.now(WIB) + timedelta(minutes=10), 'Jadwal terlalu dekat!'

plan = {
    'scheduled_at': SCHEDULED_AT,
    'caption': caption,
    'threads_text': threads,
    'video_name': 'tanya-loka-bot.mp4',
    'video_sha256': video_sha,
    'video_bytes': len(video_bytes),
}

remote = r'''
from datetime import datetime, timedelta
from hashlib import sha256
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from uuid import uuid4
from zoneinfo import ZoneInfo
import json, os, sys

os.umask(0o077)
WIB = ZoneInfo('Asia/Jakarta')
BASE = 'http://127.0.0.1:8080'
root = Path(REMOTE_DIR); root.mkdir(parents=True, exist_ok=True)
token = None

def api(method, path, body=None, content_type=None, timeout=60):
    headers = {'Accept': 'application/json'}
    if isinstance(body, dict):
        body = json.dumps(body, ensure_ascii=False).encode('utf-8')
        content_type = 'application/json'
    if content_type:
        headers['Content-Type'] = content_type
    if token:
        headers['Authorization'] = 'Bearer ' + token
    try:
        with urlopen(Request(BASE + path, data=body, method=method, headers=headers), timeout=timeout) as response:
            result = json.load(response)
    except HTTPError as error:
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
    return datetime.fromisoformat(raw.replace('Z', '+00:00')).astimezone(WIB) if raw else None

def available(url):
    with urlopen(Request(url, method='HEAD'), timeout=30) as response:
        return response.status == 200

video_data = b''
if not DRY_RUN:
    video_data = sys.stdin.buffer.read()
    assert sha256(video_data).hexdigest() == PLAN['video_sha256'], 'SHA256 video tidak cocok'

login()
accounts = api('GET', '/admin/social/status')
for platform in ('instagram', 'threads'):
    account = accounts[platform]
    assert account['connected'] and account.get('username') == 'lokakasir.id', f'{platform} tidak terhubung'

query = urlencode({'from': '2026-11-23T00:00:00+07:00', 'to': '2026-11-24T00:00:00+07:00'})
day_posts = api('GET', '/admin/social/posts?' + query) or []
slot = ts(PLAN['scheduled_at'])
existing = None
for p in day_posts:
    if p['status'] not in ('scheduled', 'publishing', 'published') or not p.get('scheduled_at'):
        continue
    when = ts(p['scheduled_at'])
    if when == slot:
        if p['caption'] == PLAN['caption']:
            existing = p
        else:
            sys.exit(f"Slot {PLAN['scheduled_at']} masih dipakai posting lain ({p['id']}). Jalankan penataan jadwal dulu.")
    elif abs((when - slot).total_seconds()) < 2 * 3600:
        sys.exit(f"Slot {PLAN['scheduled_at']} terlalu dekat dengan posting {p['id']} ({when.isoformat()}).")

print(json.dumps({
    'accounts': {k: accounts[k].get('username') for k in ('instagram', 'threads')},
    'posts_on_2026_11_23': len(day_posts),
    'already_created': bool(existing),
    'slot': PLAN['scheduled_at'],
    'video_mb': round(PLAN['video_bytes'] / 1048576, 2),
}, ensure_ascii=False), flush=True)

if DRY_RUN:
    sys.exit(0)

if existing:
    post_id = existing['id']
else:
    boundary = uuid4().hex
    head = (
        f'--{boundary}\r\n'
        f'Content-Disposition: form-data; name="file"; filename="{PLAN["video_name"]}"\r\n'
        f'Content-Type: video/mp4\r\n\r\n'
    ).encode('ascii')
    media = api(
        'POST',
        '/admin/social/media',
        head + video_data + f'\r\n--{boundary}--\r\n'.encode('ascii'),
        f'multipart/form-data; boundary={boundary}',
        timeout=300,
    )
    assert (media['kind'], media['width'], media['height']) == ('video', 1080, 1920), media
    created = api('POST', '/admin/social/posts', {
        'caption': PLAN['caption'],
        'threads_text': PLAN['threads_text'],
        'threads_enabled': True,
        'media_ids': [media['id']],
        'schedule': True,
        'scheduled_at': PLAN['scheduled_at'],
    })
    post_id = created['id']

verified = api('GET', '/admin/social/posts/' + post_id)
assert verified['status'] == 'scheduled' and verified['threads_enabled'] and verified['threads_status'] == 'waiting'
assert ts(verified['scheduled_at']) == slot
assert verified['caption'] == PLAN['caption'] and verified['threads_text'] == PLAN['threads_text']
assert len(verified['media']) == 1 and verified['media'][0]['kind'] == 'video'
assert available(verified['media'][0]['url'])

print('RECEIPT ' + json.dumps({
    'account': '@lokakasir.id',
    'verified_at': datetime.now(WIB).isoformat(),
    'id': verified['id'],
    'scheduled_at': ts(verified['scheduled_at']).isoformat(),
    'instagram_status': verified['status'],
    'threads_status': verified['threads_status'],
    'media_id': verified['media'][0]['id'],
    'media_url': verified['media'][0]['url'],
    'duration_seconds': verified['media'][0].get('duration_seconds'),
}, ensure_ascii=False), flush=True)
'''

header = f'REMOTE_DIR = {REMOTE_DIR!r}\nDRY_RUN = {dry_run!r}\nimport json as _j\nPLAN = _j.loads({json.dumps(plan, ensure_ascii=False)!r})\n'
ssh = ['ssh', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10', HOST]
subprocess.run(
    ssh + [f'umask 077; mkdir -p {shlex.quote(REMOTE_DIR)}; cat > {shlex.quote(REMOTE_DIR)}/apply.py'],
    input=(header + remote).encode('utf-8'),
    check=True,
)
result = subprocess.run(
    ssh + [f'python3 {shlex.quote(REMOTE_DIR)}/apply.py'],
    input=video_bytes if not dry_run else b'',
    stdout=subprocess.PIPE,
    check=False,
)
out = result.stdout.decode('utf-8')
for line in out.splitlines():
    if line.startswith('RECEIPT '):
        receipt = json.loads(line[8:])
        (ROOT / 'verifikasi-jadwal.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n')
        print(f"Terverifikasi: posting {receipt['id']} dijadwalkan untuk {receipt['scheduled_at']} ({receipt['instagram_status']} / Threads: {receipt['threads_status']}).")
    else:
        print(line)
sys.exit(result.returncode)
