"""Menyusun targets.json: posting Loka Kasir yang masih antre (before.json) dipasangkan dengan naskah v3
dan layar aplikasi untuk slide penutup. Enam posting Accounting dilewati karena sudah memuat tangkapan layar."""
from collections import Counter
from pathlib import Path
import json, re

root = Path(__file__).resolve().parent.parent
before = json.loads((root / 'before.json').read_text())['posts']
v3 = {p['original_post_id']: p for p in json.loads((root.parent / '2026-nov-dec-v3' / 'campaign.json').read_text())}
# Layar dipilih dari kalimat tentang Loka Kasir di tiap posting; urutan aturan = prioritas.
RULES = [
    ('tutupkasir', r'\b(tutup kasir|kas masuk|kas keluar|catatan kas|uang di laci|laci|shift)\b'),
    ('bukakasir', r'\b(karyawan|akun|akses|alur kerja kasir)\b'),
    ('transaksi', r'\b(keranjang|ekstra|paket|diskon|promo)\b'),
    ('dapur', r'\b(pesanan|pre-order|meja|dapur|antrean|qr order)\b'),
    ('jamramai', r'\b(jam ramai|periode|mingguan|per jam)\b'),
    ('beranda', r'\blaporan\b'),
    ('produk', r'\b(stok|produk|hpp|harga|katalog|pembelian|supplier|pemasok|satuan|titipan)\b'),
    ('riwayat', r'\b(riwayat|transaksi|struk|pembayaran|qris|refund|kasbon|pelanggan|member)\b'),
]
targets = []
for post in before:
    if post['caption'].startswith('Loka Kasir Accounting'):
        continue
    row = {'id': post['id'], 'when': post['when'], 'title': post['caption'].splitlines()[0], 'slides_before': len(post['media'])}
    source = v3.get(post['id'])
    if source:
        bridge = (source['bridge'] or '').lower()
        row.update(number=source['number'], shot=next((name for name, rule in RULES if re.search(rule, bridge)), 'beranda') if bridge else None)
    else:
        row['legacy'] = True  # Hari Guru dan Tanggal Tua: templat lama, ditulis ulang di build.cjs
    targets.append(row)
(root / 'targets.json').write_text(json.dumps(targets, ensure_ascii=False, indent=1) + '\n')
print(len(targets), 'target;', dict(Counter(t.get('shot') or ('lama' if t.get('legacy') else 'tanpa layar') for t in targets)))
