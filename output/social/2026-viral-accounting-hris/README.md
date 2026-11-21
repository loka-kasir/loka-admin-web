# Isu terkini: Loka Kasir Accounting dan HRIS, 22 November–10 Desember 2026

> Pembaruan 22 November: dua posting yang isinya tahan lama pindah jadwal saat [kalender ditata dua posting per hari](../2026-kalender-2x-sehari/README.md): UMP 2027 ke 7 Desember dan PPh final UMKM ke 10 Desember. `kalender.csv` dan `content.cjs` sudah mengikuti.

**14 posting terjadwal di Loka Admin** untuk Instagram dan Threads @lokakasir.id, satu per hari pukul 11.00 WIB. Tujuh berupa foto (empat gambar 1080 × 1350) dan tujuh berupa video Reels 9:16 berdurasi 28 detik; keduanya bergantian dan tidak dicampur dalam satu posting. Hasil baca ulang API: [verifikasi-jadwal.json](verifikasi-jadwal.json). Posting lain di kalender tidak diubah.

[Galeri](index.html) · [Kalender](kalender.csv) · [Sampul foto](preview-sampul.jpg) · [Semua gambar](preview-foto.jpg) · [Frame video](preview-video.jpg) · [Sumber berita](sources.json)

## Isi

Setiap posting berangkat dari satu berita yang ramai pada 15–21 November 2026, lalu menunjukkan kaitannya dengan pembukuan (Accounting) atau pengelolaan karyawan (HRIS): UMP 2027, BSU, dana cadangan pesangon, dokter telemedicine "online 24 jam", harga GTA 6 dan PPN, rekor penonton Windah Basudara, BI-Rate 6%, rupiah Rp18.245, PPh final UMKM, Persib dan JDT, debutan Timnas, UU Perampasan Aset, dan pemilihan wakil presiden di MPR.

Urutannya: berita dan angka kuncinya, tiga fakta dengan sumber, artinya buat usaha, lalu langkahnya di aplikasi dengan tangkapan layar asli. Angka berita tercatat per posting di `sources.json` dan setiap posting mencantumkan tanggal beritanya. Contoh hitungan diberi label "Contoh hitungan". Selisih 11% pada harga GTA 6 adalah hitungan sendiri dan ditulis begitu; Sony tidak merinci pajaknya.

Posting politik (pemilihan wakil presiden, UU Perampasan Aset) hanya memuat prosedur dan fakta pengesahan, tanpa nama calon dan tanpa sikap. Jadwal sidang MPR 9 Desember bisa berubah; periksa lagi sebelum posting 26 November tayang.

## Produk

- Accounting: fitur yang disebut diperiksa di `lokakasir-accounting-web` (menu, persetujuan perintah pembayaran, revaluasi kurs, log aktivitas). Tangkapan layar dari akun demo kampanye 20 November. Ajakan: trial 14 hari di accounting.lokakasir.id.
- HRIS: tangkapan layar diambil dari mode demo di hris.lokakasir.id pada 21 November (`tools/capture-hris.cjs`). Ruang kerja perusahaan masih memakai kode aktivasi dari operator, jadi ajakannya "coba mode demo", bukan daftar. Di materi namanya ditulis "Loka Kasir HRIS" mengikuti penulisan akun; aplikasinya sendiri menulis "LokaKasir HRIS".

## Membuat ulang

```sh
node build.cjs                 # content.cjs → campaign.json, carousel.html, galeri, kalender, caption
node render.cjs                # 28 JPEG + pemeriksaan tata letak (Playwright + Chrome lokal)
node tools/export-video.cjs    # naskah video → ../../../../lokakasir-promo/src/isu/posts.ts
# di lokakasir-promo: npx remotion render src/isu/index.ts Isu-02 out/isu/02-acc-gta6-harga-ppn.mp4 --codec=h264
node tools/collect-video.cjs   # MP4 → media/<kode>/video.mp4, yuv420p + faststart, cek syarat Reels
python3 tools/schedule.py --dry-run   # cek akun dan slot; tanpa --dry-run mengunggah dan menjadwalkan
```

`schedule.py` hanya membuat posting baru dan berhenti bila slot sudah dipakai posting lain. Menjalankannya lagi melewati posting yang sudah terjadwal.

## Validasi

- `layout-validation.json`: 28 gambar tanpa teks meluap, keluar margin, atau gambar gagal dimuat; `tools/check-slides.py` memastikan tiap JPEG utuh.
- `video-validation.json`: tujuh MP4 H.264 yuv420p 1080 × 1920, 30 fps, 28 detik, sekitar 8 MB, audio AAC, `moov` di awal.
- Naskah: caption ≤ 2.200 karakter dan ≤ 5 hashtag, teks Threads ≤ 500 karakter, tanpa emoji.
- Video belum pernah diunggah lewat alur ini sebelumnya. Posting video pertama tayang 23 November 11.00 WIB; periksa hasilnya di Instagram dan Threads setelah tayang.
