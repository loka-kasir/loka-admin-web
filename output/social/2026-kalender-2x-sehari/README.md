# Kalender @lokakasir.id: maksimal dua posting per hari

**Status: diterapkan dan terverifikasi lewat API Loka Admin pada 22 November 2026.** 42 posting terjadwal dipindah jadwalnya; isi (caption, teks Threads, media) tidak berubah. Setelah delapan posting Billing masuk, kalender berisi 112 posting pada 22 November 2026–16 Januari 2027, tepat dua per hari. Bukti: [verifikasi-jadwal.json](verifikasi-jadwal.json). Kalender lengkap: [kalender-gabungan.csv](kalender-gabungan.csv).

## Strategi

Akun ini sekarang membawa empat produk: Loka Kasir (kasir), Accounting, HRIS, dan Billing. Pengikutnya sebagian besar pemilik usaha kecil, jadi cerita toko Loka Kasir tetap menjadi isi utama dan produk lain masuk sebagai selingan yang jelas bedanya.

- **Dua slot dengan peran berbeda.** Siang (11.00) untuk isu terkini dan produk: Accounting, HRIS, Billing. Malam (20.00) untuk cerita toko Loka Kasir. Hari tanpa posting produk memakai 14.00 dan 20.00 untuk Loka Kasir.
- **Satu produk baru per hari.** Accounting, HRIS, dan Billing tidak pernah tayang di hari yang sama, kecuali 22–24 November yang sudah terlanjur dekat jam tayang.
- **Yang cepat basi tayang dulu.** Posting isu terkini tetap di 22 November–5 Desember. Yang isinya tahan lama (UMP untuk payroll Januari, PPh final 2027) mundur ke 7 dan 10 Desember.
- **Momen tidak digeser.** Posting Loka Kasir yang terikat tanggal tetap di harinya: Hari Guru, akhir bulan, 12.12, hampers, libur akhir tahun, Natal, tahun baru.
- **Tidak ada yang dibuang.** 22 cerita toko yang tidak terikat tanggal pindah ke 6–16 Januari 2027, dua per hari. Naskahnya diperiksa: tidak menyebut Desember, Natal, 12.12, atau hampers.
- **Billing dicicil.** Delapan posting, kira-kira satu tiap tiga hari sampai 19 Desember, foto dan video bergantian, dibuka dengan perkenalan dan satu posting yang menumpang rilis GTA 6.
- **Akhir tahun untuk Loka Kasir.** 20 Desember–5 Januari hanya berisi cerita toko, musim paling ramai bagi pemilik usaha.

Komposisi akhir: 84 Loka Kasir, 13 Accounting, 7 HRIS, 8 Billing; 11 di antaranya video.

## Berkas

- `plan.py` menyusun `moves.json` dari `calendar.json` (cuplikan kalender sebelum diubah) dan menolak rencana yang menghasilkan lebih dari dua posting per hari atau slot ganda.
- `apply.py --dry-run`, lalu `apply.py`: memindahkan jadwal lewat API. Aman diulang.
- `fix-threads-ump.py`: sekali jalan. Posting UMP pindah ke 7 Desember, jadi kalimat Threads tentang batas UMK 25 November diubah dari "menyusul paling lambat" menjadi "batas penetapan".

## Catatan

- Posting e-Faktur (Accounting) tayang 23 November 20.00, slot malam, karena siang hari itu sudah berisi posting Accounting lain.
- Dua cerita toko yang pindah ke Januari ("Toko buka. Pemasok libur." dan "Owner istirahat.") menyebut libur secara umum, bukan libur akhir tahun.
- Menambah kampanye baru berarti menggeser lagi cerita toko ke belakang; jalankan ulang `plan.py` dengan slot baru.
