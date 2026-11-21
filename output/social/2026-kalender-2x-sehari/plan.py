"""Menyusun rencana kalender maksimal dua posting per hari (moves.json) dari kalender live.

Aturan penyusunan (lihat README.md):
- Siang 11.00 = isu terkini atau produk (Accounting, HRIS, Billing). Malam 20.00 = cerita toko Loka Kasir.
- Posting Kasir yang terikat tanggal (Hari Guru, akhir bulan, 12.12, hampers, libur) tetap di harinya.
- Posting Kasir yang tidak terikat tanggal dan tergeser pindah ke 6–16 Januari 2027.
- Slot Billing disisihkan (BILLING_SLOTS) dan diisi oleh kampanye 2026-billing-launch.
Masukan: calendar.json (cuplikan /admin/social/posts). Jalankan: python3 plan.py
"""
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from pathlib import Path
import json, re

root = Path(__file__).resolve().parent
social = root.parent
WIB = timezone(timedelta(hours=7))
calendar = {p['id']: p for p in json.loads((root / 'calendar.json').read_text())}
kasir = {p['code']: p['id'] for p in json.loads((social / '2026-nov-dec-v4' / 'plan.json').read_text())}
isu = {p['code'][:2]: p['id'] for p in json.loads((social / '2026-viral-accounting-hris' / 'verifikasi-jadwal.json').read_text())['posts']}
acc = {p['folder'].split('/')[1][:2]: p['id'] for p in json.loads((social / '2026-accounting-launch' / 'verifikasi-jadwal.json').read_text())['posts']}

# kode → (tanggal, jam). K = Loka Kasir (nomor naskah v3/v4), T = isu terkini, A = Accounting.
TARGET = {
    'A06': ('2026-12-11', '11:00'), 'A07': ('2026-11-23', '20:00'), 'A08': ('2026-12-17', '11:00'),
    'A09': ('2026-12-14', '11:00'), 'A10': ('2026-12-08', '11:00'),
    'T09': ('2026-12-07', '11:00'), 'T13': ('2026-12-10', '11:00'),
    'K017': ('2026-12-03', '20:00'), 'K025': ('2026-12-01', '20:00'), 'K027': ('2026-12-02', '20:00'),
    'K035': ('2026-12-06', '20:00'), 'K036': ('2026-12-07', '20:00'), 'K041': ('2026-12-09', '20:00'),
    'K043': ('2026-12-10', '20:00'), 'K045': ('2026-12-11', '20:00'), 'K049': ('2026-12-13', '20:00'),
    'K051': ('2026-12-14', '20:00'), 'K055': ('2026-12-16', '20:00'), 'K057': ('2026-12-17', '20:00'),
    'K061': ('2026-12-19', '20:00'),
}
# Cerita toko yang tidak terikat tanggal: antre lagi mulai 6 Januari, dua per hari.
DISPLACED = ['014', '015', '019', '020', '021', '026', '028', '029', '030', '031', '033', '037', '038', '039', '042', '044', '046',
             '050', '052', '056', '058', '062']
day = datetime(2027, 1, 6, tzinfo=WIB)
for index, code in enumerate(DISPLACED):
    TARGET['K' + code] = ((day + timedelta(days=index // 2)).strftime('%Y-%m-%d'), '14:00' if index % 2 == 0 else '20:00')
BILLING_SLOTS = ['2026-11-24T20:00', '2026-11-28T20:00', '2026-12-04T11:00', '2026-12-06T11:00', '2026-12-09T11:00', '2026-12-13T11:00',
                 '2026-12-16T11:00', '2026-12-19T11:00']

def post_id(code):
    return {'K': kasir, 'T': isu, 'A': acc}[code[0]][code[1:]]

def wib(raw):
    return datetime.fromisoformat(raw.replace('Z', '+00:00')).astimezone(WIB)

moves = []
final = {key: wib(p['scheduled_at']) for key, p in calendar.items() if p['status'] == 'scheduled'}
for code, (date, time) in TARGET.items():
    key = post_id(code)
    post = calendar[key]
    assert post['status'] == 'scheduled', code
    target = datetime.fromisoformat(f'{date}T{time}:00+07:00')
    if code[1:] in DISPLACED and code[0] == 'K':  # pastikan naskah yang pindah ke Januari tidak menyebut momen Desember
        assert not re.search(r'desember|november|natal|12\.12|harbolnas|akhir tahun|tahun baru|hampers', post['caption'], re.I), (code, post['caption'][:60])
    if final[key] != target:
        moves.append({'code': code, 'id': key, 'title': post['caption'].splitlines()[0][:80], 'from': final[key].isoformat(), 'to': target.isoformat()})
        final[key] = target
per_day = Counter(t.strftime('%Y-%m-%d') for t in final.values())
for slot in BILLING_SLOTS:
    per_day[slot[:10]] += 1
    assert datetime.fromisoformat(slot + ':00+07:00') not in final.values(), slot
assert len(set(final.values())) == len(final), 'ada dua posting di slot yang sama'
over = {d: n for d, n in per_day.items() if n > 2}
assert not over, over
(root / 'moves.json').write_text(json.dumps({'billing_slots': BILLING_SLOTS, 'moves': moves}, ensure_ascii=False, indent=1) + '\n')
print(len(moves), 'posting pindah jadwal;', len(final), 'posting terjadwal +', len(BILLING_SLOTS), 'slot Billing;',
      'per hari:', dict(sorted(Counter(per_day.values()).items())), '| terakhir:', max(per_day))
