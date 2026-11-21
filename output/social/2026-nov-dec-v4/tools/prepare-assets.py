"""Menyiapkan aset v4: potongan tangkapan layar Loka Kasir (dari situs lokakasir.id, data contoh
"Toko Berkah Jaya") dan gambar untuk dua posting gaya lama, dipotong dari sampul yang sudah tayang di antrean."""
from pathlib import Path
import json
from PIL import Image

root = Path(__file__).resolve().parent.parent
site = root.parents[3] / 'loka-landing-web' / 'public' / 'images' / 'site'
# nama → (berkas sumber, kotak potong di gambar 1600 × 1051, nama layar, bagian yang ditutup).
# Slide menampilkan lebar penuh potongan dan memudarkan bagian bawahnya. Tepi kanan jatuh di sela
# antarkomponen; layar yang lebar (FADE_RIGHT) dipotong di sela kolom dan dipudarkan di kanan supaya
# teksnya tetap terbaca di ponsel.
SHOTS = {
    'beranda': ('app-beranda.webp', (340, 228, 1160, 845), 'Beranda', [(1086, 420, 1160, 845)]),  # kolom kanan tidak ikut
    'bukakasir': ('app-bukakasir.webp', (420, 85, 1180, 700), 'Persiapan Kasir', []),
    'dapur': ('app-dapur.webp', (340, 105, 1270, 1051), 'Pesanan Berjalan', []),
    'jamramai': ('app-jamramai.webp', (340, 105, 1585, 1051), 'Jam Ramai', []),
    'produk': ('app-produk.webp', (340, 190, 1295, 1051), 'Produk', []),
    'riwayat': ('app-riwayat.webp', (340, 180, 1272, 1051), 'Riwayat Penjualan', []),
    'transaksi': ('app-transaksi.webp', (600, 105, 1600, 1051), 'Kasir', []),
    'tutupkasir': ('app-tutupkasir.webp', (20, 105, 860, 760), 'Tutup Kasir', []),
}
FADE_RIGHT = {'dapur', 'produk', 'riwayat'}
meta = {}
for name, (source, box, label, masks) in SHOTS.items():
    full = Image.open(site / source).convert('RGB')
    background = full.getpixel((box[0] + 3, box[1] + 3))
    for mask in masks:
        full.paste(background, mask)
    image = full.crop(box)
    image.save(root / 'assets' / 'app' / f'{name}.png')
    meta[name] = {'label': label, 'width': image.width, 'height': image.height, 'background': '#%02x%02x%02x' % background,
                  'fade_right': name in FADE_RIGHT,
                  'source': f'loka-landing-web/public/images/site/{source}', 'box': box, 'masked': masks}
(root / 'assets' / 'app' / 'shots.json').write_text(json.dumps(meta, indent=1) + '\n')

# Dua posting gaya lama: ilustrasinya diambil dari sampul lama (bagian tanpa teks).
review = Path('/private/tmp/loka-review-20261121/media')  # unduhan sampul lama saat tinjauan 21 November
for target, source, box in [('hari-guru.jpg', '07-1.jpg', (230, 545, 1080, 1225)), ('tanggal-tua.jpg', '12-1.jpg', (470, 560, 1080, 1300))]:
    if (review / source).exists():
        Image.open(review / source).convert('RGB').crop(box).save(root / 'assets' / 'art' / target, quality=93)
print(json.dumps({k: (v['width'], v['height']) for k, v in meta.items()}))
