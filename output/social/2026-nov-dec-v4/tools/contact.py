"""Lembar kontak untuk pemeriksaan visual: python3 tools/contact.py <berkas keluaran> <kode> [<kode> ...]
Menampilkan carousel seperti yang akan tayang: sampul v3 (bila dipertahankan) diikuti slide v4."""
from pathlib import Path
import json, sys
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parent.parent
plan = {p['code']: p for p in json.loads((root / 'plan.json').read_text())}
out, codes = sys.argv[1], sys.argv[2:]
W, H = 324, 405
rows = []
for code in codes:
    post = plan[code]
    files = ([root.parent / '2026-nov-dec-v3' / 'media' / f'{code}-1.jpg'] if post['keep_cover'] else []) + [root / f for f in post['files']]
    rows.append((post, files))
cols = max(len(files) for _, files in rows)
sheet = Image.new('RGB', (cols * (W + 8) + 8, len(rows) * (H + 30) + 8), '#e9edf5')
draw = ImageDraw.Draw(sheet)
for r, (post, files) in enumerate(rows):
    y = 8 + r * (H + 30)
    draw.text((8, y + 4), f"{post['code']}  {post['when']}  layar: {post['shot']}  {post['title'][:90]}", fill='#102348')
    for c, file in enumerate(files):
        sheet.paste(Image.open(file).convert('RGB').resize((W, H)), (8 + c * (W + 8), y + 22))
sheet.save(out, quality=88)
print(out, sheet.size)
