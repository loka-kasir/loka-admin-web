# Penataan ulang kalender: jam seragam & posting Loka Kasir setiap hari

**Status: diterapkan dan terverifikasi lewat API Loka Admin pada 23 November 2026.** Sebanyak 59 posting terjadwal dipindah jam/tanggal tayangnya tanpa mengubah caption, teks Threads, maupun media. Bukti verifikasi: [verifikasi-jadwal.json](verifikasi-jadwal.json). Kalender lengkap: [kalender-gabungan.csv](kalender-gabungan.csv).

## Perubahan utama

1. **Jam tayang diseragamkan menjadi 12.00 dan 20.00 WIB** setiap hari (mulai 24 November 2026 sampai akhir antrean 17 Januari 2027), menggantikan pola lama yang bercampur antara 11.00, 14.00, dan 20.00 WIB (termasuk 25 November yang sebelumnya tayang 11.00 & 14.00).
2. **Setiap hari (23 November 2026–17 Januari 2027) wajib memuat minimal satu posting Loka Kasir**, maksimal dua posting per hari:
   - **23 November 20.00 WIB** dikosongkan (Accounting e-Faktur pindah ke 16 Desember 12.00 WIB) untuk diisi video perkenalan & panduan bot [Tanya Loka](../2026-tanya-loka-bot/README.md).
   - **24 November** dan **28 November** (sebelumnya tanpa posting Kasir) kini masing-masing berisi satu posting produk di 12.00 WIB dan satu cerita toko Loka Kasir di 20.00 WIB.
   - **Hari campuran (produk lain + Kasir)**: 12.00 WIB untuk Accounting/HRIS/Billing, 20.00 WIB untuk Loka Kasir.
   - **Hari khusus Kasir**: 12.00 WIB dan 20.00 WIB keduanya Loka Kasir.
3. **Urutan kampanye terjaga**: berita isu terkini tetap pada 24 November–5 Desember, seri Loka Kasir Billing tetap dibuka dengan *Kenalan dengan Loka Kasir Billing* (4 Desember), tidak ada produk non-Kasir sama dua hari berturut-turut mulai 3 Desember, dan seluruh posting yang terikat tanggal (Hari Guru, tanggal tua, tutup November, 12.12, hampers, Hari Ibu, Natal, tahun baru) tetap di tanggalnya.
