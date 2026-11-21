# Perkenalan Loka Kasir Billing, 24 November–19 Desember 2026

**Delapan posting terjadwal di Loka Admin** untuk Instagram dan Threads @lokakasir.id: empat foto (empat gambar 1080 × 1350) dan empat video Reels 9:16 berdurasi 28 detik, bergantian. Hasil baca ulang API: [verifikasi-jadwal.json](verifikasi-jadwal.json). Slotnya berasal dari [kalender dua posting per hari](../2026-kalender-2x-sehari/README.md).

[Galeri](index.html) · [Kalender](kalender.csv) · [Sampul foto](preview-sampul.jpg) · [Semua gambar](preview-foto.jpg) · [Frame video](preview-video.jpg)

## Isi

Loka Kasir Billing adalah billing rental PlayStation dan warnet: timer di Android TV, kasir web, dan aplikasi PC. Tiap posting mengangkat satu masalah rental, bukan daftar fitur.

| Tanggal | Format | Topik |
| --- | --- | --- |
| 24 Nov 20.00 | Foto | Kenalan: timer jalan sendiri di tiap TV |
| 28 Nov 20.00 | Video | GTA 6 dan rental PS5 yang ramai (booking) |
| 4 Des 11.00 | Foto | Menit yang lewat tanpa tagihan |
| 6 Des 11.00 | Video | Selisih kas per shift |
| 9 Des 11.00 | Foto | Pesan makanan dari TV |
| 13 Des 11.00 | Video | Member dan saldo deposit |
| 16 Des 11.00 | Foto | Internet mati dan mati lampu |
| 19 Des 11.00 | Video | Tarif berdasarkan jam |

## Sumber dan batas klaim

- Fitur mengikuti README repo `lokakasir-billing` dan halaman billing.lokakasir.id per 22 November 2026. Ajakan: gratis 14 hari, tanpa kartu kredit (dikonfirmasi dari `/public/config`: `trial_days` 14). Harga langganan tidak disebut.
- Angka rupiah di posting menit bocor, selisih kas, saldo member, dan tarif adalah **contoh hitungan** dan diberi label begitu di gambar dan caption.
- Harga dan tanggal rilis GTA 6: Kompas.com, 19 November 2026 (sama dengan kampanye isu terkini).
- Tangkapan layar TV dibuat dari tes tampilan aplikasi TV (`flutter test test/screens_smoke_test.dart` dengan `SCREENSHOT_DIR`). Tangkapan layar kasir diambil dari server Billing **lokal** berisi data contoh, bukan dari produksi; database contohnya sudah dihapus. Semua diberi keterangan "data contoh".
- Di materi namanya ditulis "Loka Kasir Billing" mengikuti penulisan akun; aplikasinya menulis "LokaKasir Billing".

## Membuat ulang

```sh
node build.cjs                 # content.cjs → campaign.json, carousel.html, galeri, kalender, caption
node render.cjs                # 16 JPEG + pemeriksaan tata letak
node tools/export-video.cjs    # naskah video → ../../../../lokakasir-promo/src/isu/posts-billing.ts
# di lokakasir-promo: npx remotion render src/isu/index.ts Billing-02 out/isu/billing-02-billing-gta6-rental-ramai.mp4 --codec=h264
node tools/collect-video.cjs   # MP4 → media/<kode>/video.mp4, yuv420p + faststart, cek syarat Reels
python3 tools/schedule.py --dry-run
```

Untuk mengambil ulang layar kasir: jalankan `lokakasir-billing-service` di port 8097 dengan database kosong, `go run ./cmd/seed-demo`, ganti password bawaan akun `admin` menjadi nilai di `tools/seed-demo-state.py`, jalankan skrip itu, lalu `node tools/capture-kasir.cjs` dengan web di port 5199.
