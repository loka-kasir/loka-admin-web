"""Sekali jalan: posting "UMP 2027 dan payroll Januari" pindah dari 30 November ke 7 Desember, jadi kalimat
Threads "UMK menyusul paling lambat 25 November" sudah lewat saat tayang. Hanya teks Threads yang diganti
dengan naskah di ../2026-viral-accounting-hris/media/09-hris-ump-2027/threads.txt."""
from pathlib import Path
import json, subprocess, sys
root = Path(__file__).resolve().parent
post = next(p for p in json.loads((root.parent / '2026-viral-accounting-hris' / 'verifikasi-jadwal.json').read_text())['posts'] if p['code'] == '09-hris-ump-2027')
text = (root.parent / '2026-viral-accounting-hris' / 'media' / '09-hris-ump-2027' / 'threads.txt').read_text().strip()
assert len(text) <= 500 and 'Batas penetapan UMK: 25 November.' in text
remote = r'''
from pathlib import Path
from urllib.request import Request, urlopen
import json
BASE = 'http://127.0.0.1:8080'
def api(method, path, body=None, token=None):
    headers = {'Accept': 'application/json'}
    if body is not None: body = json.dumps(body, ensure_ascii=False).encode(); headers['Content-Type'] = 'application/json'
    if token: headers['Authorization'] = 'Bearer ' + token
    with urlopen(Request(BASE + path, data=body, method=method, headers=headers), timeout=60) as r: return json.load(r)['data']
config = {}
for line in Path('/home/ubuntu/loka-kasir-service/.env').read_text().splitlines():
    key, sep, value = line.partition('=')
    if sep and key.strip() in ('ADMIN_USERNAME', 'ADMIN_PASSWORD'):
        value = value.strip()
        if len(value) >= 2 and value[0] in ('"', "'") and value[0] == value[-1]: value = value[1:-1]
        config[key.strip()] = value
token = api('POST', '/admin/login', {'username': config['ADMIN_USERNAME'], 'password': config['ADMIN_PASSWORD']})['token']
path = '/admin/social/posts/' + POST_ID
post = api('GET', path, token=token)
from datetime import datetime
assert post['status'] == 'scheduled' and datetime.fromisoformat(post['scheduled_at'].replace('Z', '+00:00')) == datetime.fromisoformat('2026-12-07T11:00:00+07:00'), post['scheduled_at']
media = [m['id'] for m in sorted(post['media'], key=lambda m: m['position'])]
if post['threads_text'] != TEXT:
    saved = api('PUT', path, {'caption': post['caption'], 'threads_text': TEXT, 'threads_enabled': True, 'media_ids': media, 'schedule': True, 'scheduled_at': post['scheduled_at']}, token=token)
    assert saved['threads_text'] == TEXT and saved['caption'] == post['caption'] and saved['scheduled_at'] == post['scheduled_at'] and saved['status'] == 'scheduled'
    assert [m['id'] for m in sorted(saved['media'], key=lambda m: m['position'])] == media
print('teks Threads posting UMP sesuai naskah baru')
'''
header = f'POST_ID = {post["id"]!r}\nTEXT = {text!r}\n'
sys.exit(subprocess.run(['ssh', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10', 'tencent-lighthouse', 'python3 -'], input=(header + remote).encode()).returncode)
