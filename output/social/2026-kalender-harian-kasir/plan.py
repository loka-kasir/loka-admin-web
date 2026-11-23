"""Menyusun rencana penataan ulang kalender (moves.json) dari calendar-before.json.

Tujuan:
1. Jam tayang seragam setiap hari: 12:00 WIB (siang) dan 20:00 WIB (malam),
   kecuali slot hari ini 23 Nov 11:00 yang sudah terbit.
2. Setiap hari (23 Nov 2026 – 17 Jan 2027) wajib memiliki minimal 1 posting Loka Kasir,
   maksimal 2 posting per hari, dan tidak ada slot ganda.
3. Slot malam hari ini (23 Nov 2026 20:00 WIB) dikosongkan untuk posting video baru
   perkenalan & panduan bot Tanya Loka (Loka Kasir).
4. Semua posting yang terikat tanggal (Hari Guru, tanggal tua, akhir bulan, 12.12,
   hampers, Hari Ibu, Natal, tahun baru) tetap di tanggalnya.
5. Berita isu terkini tetap di 24 Nov – 5 Des; seri Billing selalu dimulai dari
   "Kenalan dengan Loka Kasir Billing", dan tidak ada produk non-Kasir sama dua hari berturut-turut.
"""
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from pathlib import Path
import csv
import json
import re

ROOT = Path(__file__).resolve().parent
WIB = timezone(timedelta(hours=7))

NEW_BOT_SLOT = '2026-11-23T20:00:00+07:00'
NEW_BOT_TITLE = 'Loka Kasir · Sekarang ada bot Tanya Loka untuk bantu kelola toko'


def wib(raw: str) -> datetime:
    return datetime.fromisoformat(raw.replace('Z', '+00:00')).astimezone(WIB)


def product_of(post: dict) -> str:
    first = (post.get('caption') or '').splitlines()[0] if post.get('caption') else ''
    if first.startswith('Loka Kasir Accounting'):
        return 'Accounting'
    if first.startswith('Loka Kasir HRIS'):
        return 'HRIS'
    if first.startswith('Loka Kasir Billing'):
        return 'Billing'
    return 'Kasir'


def format_of(post: dict) -> str:
    media = post.get('media') or []
    if len(media) == 1 and media[0].get('kind') == 'video':
        return 'Video'
    return f'Foto {len(media)} gambar'


def main() -> None:
    posts = json.loads((ROOT / 'calendar-before.json').read_text())
    by_id = {p['id']: p for p in posts}
    scheduled = [p for p in posts if p['status'] == 'scheduled' and p.get('scheduled_at')]

    # Pastikan kita menemukan ID yang tepat berdasarkan prefix unik 8 karakter.
    def find_id(prefix: str) -> str:
        matches = [p['id'] for p in scheduled if p['id'].startswith(prefix)]
        assert len(matches) == 1, f'Prefix {prefix} -> {matches}'
        return matches[0]

    # Jadwal slot siang (12:00 WIB) untuk seluruh 25 posting non-Kasir (Accounting / HRIS / Billing)
    # dari 24 Nov s.d. 19 Des (30 Nov dikosongkan untuk 2 posting Kasir penutup November).
    non_kasir_schedule = [
        # Berita isu terkini (tetap segar di 24 Nov – 5 Des)
        ('2026-11-24', '8dbcc285'),  # HRIS · Dokter online 24 jam
        ('2026-11-25', 'e138d3e5'),  # Accounting · UU Perampasan Aset (Video)
        ('2026-11-26', '64597ca8'),  # Accounting · Pemilihan wakil presiden (sebelum 9 Des)
        ('2026-11-27', 'ef38af3a'),  # HRIS · Debutan Timnas (Video)
        ('2026-11-28', '22de0974'),  # Accounting · Rupiah Rp18.245
        ('2026-11-29', '6d9ed629'),  # Accounting · Persib, JDT (Video)
        # 2026-11-30 = 2 Kasir (tutup November & besok Desember)
        ('2026-12-01', 'b99dc52d'),  # HRIS · GTA 6 & cuti (Video)
        ('2026-12-02', '1091761c'),  # HRIS · Dana cadangan pesangon / Danantara
        ('2026-12-03', 'e84d3735'),  # Accounting · BI-Rate naik ke 6% (Video)
        # Seri Billing dimulai dari "Kenalan" (4 Des), bergantian foto/video dan berselang-seling dengan HRIS/Accounting
        ('2026-12-04', '14534f6d'),  # Billing 01 · Kenalan dengan Loka Kasir Billing (Foto)
        ('2026-12-05', '9852cbdc'),  # HRIS · BSU 2026 (Video)
        ('2026-12-06', '5b51cbab'),  # Billing 02 · GTA 6 dan rental PS5 (Video)
        ('2026-12-07', 'e8bfea43'),  # HRIS · UMP 2027 dan payroll Januari (Foto)
        ('2026-12-08', 'cabd960e'),  # Accounting · Jejak audit pembukuan (Foto)
        ('2026-12-09', '493f8219'),  # Billing 03 · Menit yang lewat tanpa tagihan (Foto)
        ('2026-12-10', 'df124001'),  # Accounting · PPh final UMKM berakhir (Foto)
        ('2026-12-11', '40a55a5e'),  # Billing 04 · Selisih kas per shift (Video)
        ('2026-12-12', 'b582c469'),  # Accounting · Aset tetap dan penyusutan (Foto)
        ('2026-12-13', 'e1a763f2'),  # Billing 05 · Pesan makanan dari TV (Foto)
        ('2026-12-14', 'f64a6dbe'),  # Accounting · Anggaran versus realisasi (Foto)
        ('2026-12-15', 'dc63cab7'),  # Billing 06 · Member dan saldo deposit (Video)
        ('2026-12-16', 'efe680f8'),  # Accounting · Pemeriksaan e-Faktur sebelum unggah (Foto, pindah dari 23 Nov 20:00)
        ('2026-12-17', 'e558b182'),  # Billing 07 · Internet mati dan mati lampu (Foto)
        ('2026-12-18', '9a441c3e'),  # Accounting · Checklist menjelang tutup buku (Foto)
        ('2026-12-19', 'e2e477c5'),  # Billing 08 · Tarif berdasarkan jam (Video)
    ]

    target: dict[str, tuple[str, str]] = {}
    non_kasir_ids = set()
    for day, prefix in non_kasir_schedule:
        pid = find_id(prefix)
        assert product_of(by_id[pid]) != 'Kasir', prefix
        target[pid] = (day, '12:00')
        non_kasir_ids.add(pid)

    all_non_kasir = {p['id'] for p in scheduled if product_of(p) != 'Kasir'}
    assert non_kasir_ids == all_non_kasir, (
        'Daftar non-Kasir tidak lengkap:',
        all_non_kasir - non_kasir_ids,
        non_kasir_ids - all_non_kasir,
    )

    # Semua posting Kasir terjadwal saat ini (total 84 posting).
    kasir_posts = sorted(
        [p for p in scheduled if product_of(p) == 'Kasir'],
        key=lambda p: wib(p['scheduled_at']),
    )

    # Hari-hari Kasir yang perlu diisi di 24 Nov dan 28 Nov (sebelumnya 0 Kasir),
    # serta 3 slot siang yang baru dipakai non-Kasir di 12 Des, 15 Des, 18 Des:
    # - 12 Des: 9f0189d8 ("12.12 ramai...") terikat tanggal -> tetap di 12 Des 20:00!
    #           db98ef0b ("Toko tutup. Ada 10 menit...") evergreen -> pindah ke 24 Nov 20:00!
    # - 15 Des: 164de743 ("Stok opname...") evergreen -> pindah ke 28 Nov 20:00!
    #           ba9dc31b ("Member top-up...") tetap di 15 Des 20:00!
    # - 18 Des: 832536dd ("Order 100 porsi...") evergreen -> pindah ke ekor 17 Jan 12:00!
    #           156d2c70 ("Kasir sering ditanya harga?") tetap di 18 Des 20:00!
    kasir_overrides = {
        find_id('566c7644'): ('2026-11-25', '20:00'),  # Selamat Hari Guru Nasional (sebelumnya 14:00)
        find_id('db98ef0b'): ('2026-11-24', '20:00'),  # Toko tutup (evergreen, mengisi 24 Nov)
        find_id('164de743'): ('2026-11-28', '20:00'),  # Stok opname (evergreen, mengisi 28 Nov)
        find_id('9f0189d8'): ('2026-12-12', '20:00'),  # 12.12 ramai (tetap di 12 Des!)
        find_id('832536dd'): ('2027-01-17', '12:00'),  # Order 100 porsi (evergreen, pindah ke ekor 17 Jan)
    }

    # Pastikan posting evergreen yang dipindah tanggal tidak menyebut tanggal/momen tertentu.
    for prefix in ('db98ef0b', '164de743', '832536dd'):
        cap = by_id[find_id(prefix)]['caption']
        assert not re.search(r'desember|november|natal|12\.12|harbolnas|akhir tahun|tahun baru|hampers|hari guru', cap, re.I), (prefix, cap[:80])

    for p in kasir_posts:
        pid = p['id']
        if pid in kasir_overrides:
            target[pid] = kasir_overrides[pid]
            continue
        cur = wib(p['scheduled_at'])
        day = cur.strftime('%Y-%m-%d')
        hour = '12:00' if cur.strftime('%H:%M') in ('11:00', '14:00') else '20:00'
        target[pid] = (day, hour)

    assert len(target) == len(scheduled), (len(target), len(scheduled))

    # Susun daftar perpindahan (hanya yang berubah jam/tanggalnya).
    moves = []
    for p in sorted(scheduled, key=lambda x: wib(x['scheduled_at'])):
        pid = p['id']
        cur = wib(p['scheduled_at'])
        day, hhmm = target[pid]
        want = datetime.fromisoformat(f'{day}T{hhmm}:00+07:00')
        if cur != want:
            moves.append({
                'id': pid,
                'product': product_of(p),
                'title': (p.get('caption') or '').splitlines()[0][:80],
                'from': cur.isoformat(),
                'to': want.isoformat(),
            })

    # Verifikasi penuh atas kalender akhir (termasuk 23 Nov 11:00 published + 23 Nov 20:00 video bot baru).
    slots: dict[str, dict] = {}
    for p in posts:
        if p['status'] == 'published' and p.get('scheduled_at'):
            t = wib(p['scheduled_at'])
            if t.strftime('%Y-%m-%d') >= '2026-11-23':
                slots[t.isoformat()] = {
                    'id': p['id'],
                    'status': p['status'],
                    'product': product_of(p),
                    'format': format_of(p),
                    'title': (p.get('caption') or '').splitlines()[0],
                }
    slots[NEW_BOT_SLOT] = {
        'id': 'NEW-TANYA-LOKA-BOT',
        'status': 'new',
        'product': 'Kasir',
        'format': 'Video',
        'title': NEW_BOT_TITLE,
    }
    for pid, (day, hhmm) in target.items():
        iso = f'{day}T{hhmm}:00+07:00'
        assert iso not in slots, f'Slot ganda: {iso}'
        p = by_id[pid]
        slots[iso] = {
            'id': pid,
            'status': 'scheduled',
            'product': product_of(p),
            'format': format_of(p),
            'title': (p.get('caption') or '').splitlines()[0],
        }

    # Cek setiap hari dari 2026-11-23 sampai 2027-01-17.
    by_day: dict[str, list[tuple[str, dict]]] = defaultdict(list)
    for iso, item in sorted(slots.items()):
        by_day[iso[:10]].append((iso[11:16], item))

    d = datetime(2026, 11, 23, tzinfo=WIB)
    end_d = datetime(2027, 1, 17, tzinfo=WIB)
    while d <= end_d:
        key = d.strftime('%Y-%m-%d')
        items = by_day[key]
        assert 1 <= len(items) <= 2, f'{key}: jumlah posting {len(items)}'
        hours = [h for h, _ in items]
        if key == '2026-11-23':
            assert hours == ['11:00', '20:00'], (key, hours)
        elif key == '2027-01-17':
            assert hours == ['12:00'], (key, hours)
        else:
            assert hours == ['12:00', '20:00'], (key, hours)
        products = [it['product'] for _, it in items]
        assert 'Kasir' in products, f'{key}: tidak ada posting Kasir! ({products})'
        # Pada hari campuran, slot 12:00 produk lain dan 20:00 Kasir.
        if len(items) == 2 and any(pr != 'Kasir' for pr in products):
            assert items[0][1]['product'] != 'Kasir' and items[1][1]['product'] == 'Kasir', (key, products)
        d += timedelta(days=1)

    # Cek Billing 01 muncul sebelum semua Billing lain.
    billing_order = [
        (iso[:10], item['title'])
        for iso, item in sorted(slots.items())
        if item['product'] == 'Billing'
    ]
    assert 'Kenalan' in billing_order[0][1], billing_order

    # Cek tidak ada produk non-Kasir sama dua hari berturut-turut mulai 3 Des.
    prev_prod = None
    for iso, item in sorted(slots.items()):
        if iso[:10] >= '2026-12-03' and item['product'] != 'Kasir':
            assert item['product'] != prev_prod, f'Produk non-Kasir berurutan di {iso[:10]}: {item["product"]}'
            prev_prod = item['product']

    out_plan = {
        'new_bot_slot': NEW_BOT_SLOT,
        'total_scheduled_existing': len(scheduled),
        'moves': moves,
    }
    (ROOT / 'moves.json').write_text(json.dumps(out_plan, ensure_ascii=False, indent=2) + '\n')

    with (ROOT / 'kalender-gabungan.csv').open('w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['Tanggal', 'Jam WIB', 'Produk', 'Format', 'Judul', 'Posting Loka Admin'])
        for iso, item in sorted(slots.items()):
            url = (
                f'https://admin.lokakasir.id/social/{item["id"]}'
                if item['status'] != 'new'
                else '(akan dibuat: video Tanya Loka)'
            )
            w.writerow([iso[:10], iso[11:16], item['product'], item['format'], item['title'], url])

    print(
        f'OK: {len(moves)} posting pindah jadwal; '
        f'{len(by_day)} hari terverifikasi (2026-11-23 s.d. 2027-01-17); '
        f'0 hari tanpa Kasir; jam seragam 12:00 & 20:00 WIB.'
    )


if __name__ == '__main__':
    main()
