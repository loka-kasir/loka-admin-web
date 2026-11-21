"""Memeriksa JPEG posting foto setelah render: ukuran 1080 × 1350 dan tidak ada bagian yang
menampilkan latar halaman (#0b1f42), tanda tangkapan slide terpotong. Dipanggil oleh render.cjs."""
from pathlib import Path
import sys
from PIL import Image

root = Path(__file__).resolve().parent.parent
PAGE = (11, 31, 66)
bad = []
files = sorted(root.glob('media/*/slide-*.jpg'))
for file in files:
    image = Image.open(file).convert('RGB')
    if image.size != (1080, 1350):
        bad.append(f'{file.relative_to(root)}: ukuran {image.size}')
        continue
    # Tepi kiri, kanan, dan bawah selalu berisi warna slide; di sana latar halaman tidak boleh muncul.
    edges = [(x, y) for y in (1300, 1346) for x in range(6, 1080, 28)] + [(x, y) for x in (3, 1076) for y in range(40, 1350, 40)]
    hits = sum(all(abs(a - b) <= 4 for a, b in zip(image.getpixel(point), PAGE)) for point in edges)
    if hits > len(edges) * 0.3:
        bad.append(f'{file.relative_to(root)}: latar halaman terlihat di {hits}/{len(edges)} titik tepi')
if bad:
    print('\n'.join(bad))
    sys.exit(1)
print(f'{len(files)} JPEG utuh, 1080 × 1350.')
