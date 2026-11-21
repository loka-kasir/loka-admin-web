# Instagram Loka Kasir — slide isi dirombak (v4)

**Status: terpasang dan terverifikasi lewat API Loka Admin pada 22 November 2026 dini hari.** 84 posting Loka Kasir yang masih antre (25 November 2026–5 Januari 2027, pukul 14.00 dan 20.00 WIB) memakai 316 slide baru. Sampul, caption, teks Threads, ID, dan jadwal tidak berubah. Bukti: [release-verification.json](release-verification.json). Keadaan sebelum penerapan: [before.json](before.json).

[Contoh empat carousel](preview.jpg) · [Daftar posting dan berkasnya](plan.json)

## Kenapa dirombak

Tinjauan antrean pada 21 November menemukan sampul yang bagus tetapi slide isi yang kosong: median area tanpa isi 45% di slide tengah dan 68% di slide terakhir, penutup tanpa tampilan produk, dan dua label bagian yang sama di hampir semua posting. Dua posting (Hari Guru, Tanggal Tua) masih memakai templat lama.

## Yang berubah

- **Slide terisi sampai bawah.** Blok teks setinggi isinya dan gambar posting mengambil sisa tinggi. Dengan ukuran yang sama, median area kosong turun menjadi 18% (tengah) dan 10% (akhir). `render.cjs` menolak slide yang menyisakan lebih dari 60 px di atas footer.
- **Penutup menampilkan aplikasi.** 77 penutup memuat layar Loka Kasir yang sesuai dengan kalimat tentang produknya (Beranda, Kasir, Pesanan Berjalan, Produk, Riwayat Penjualan, Jam Ramai, Persiapan Kasir, Tutup Kasir). Tangkapan layar berasal dari situs lokakasir.id dan berisi data contoh "Toko Berkah Jaya"; tiap slide menuliskannya. Pemetaan ada di `tools/targets.py`.
- **Label bagian bervariasi.** "Yang perlu dibawa pulang" dan "Coba di tokomu" dirotasi dengan beberapa label lain.
- **Dua posting gaya lama** mendapat sampul dan slide baru dengan templat yang sama. Ilustrasinya dipotong dari sampul lama; isi diambil dari caption yang sudah terjadwal.
- Enam posting hangat (Natal, akhir tahun, dan sejenisnya) tetap tanpa layar aplikasi.

Naskah slide tetap dari `../2026-nov-dec-v3/campaign.json`; tidak ada klaim baru. Enam posting Accounting tidak disentuh karena sudah memuat tangkapan layar.

## Membuat ulang

```sh
python3 tools/prepare-assets.py   # potongan layar aplikasi + ilustrasi dua posting lama
python3 tools/targets.py          # before.json + naskah v3 → targets.json
node build.cjs                    # → plan.json dan .pages/<kode>.html
node render.cjs                   # 316 JPEG 1080 × 1350 + layout-validation.json
python3 tools/apply.py --dry-run  # cek antrean; tanpa --dry-run mengunggah dan memasang
```

`apply.py` melewati posting yang sudah tayang, kurang dari 30 menit lagi, atau isinya berbeda dari `before.json`, dan aman dijalankan ulang. Media lama yang dilepas dari posting dihapus otomatis oleh service setelah 48 jam; sebelum itu, sampul dan slide lama masih bisa dipasang kembali dari `before.json`.

## Catatan

- Sampul lama dari ilustrasi Tanggal Tua tetap bergaya kartun 3D, berbeda dari gaya sampul lain.
- Tangkapan layar aplikasi berasal dari versi di situs (Oktober 2026). Bila tampilan aplikasi berubah banyak, perbarui `assets/app` lalu jalankan ulang.
