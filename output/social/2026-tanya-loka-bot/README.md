# Video Reels: Perkenalan & Cara Pakai Bot Tanya Loka

**Jadwal tayang: 23 November 2026 pukul 20.00 WIB** di Instagram dan Threads `@lokakasir.id`.

## Isi materi

Video vertikal 9:16 (1080 × 1920, 42 detik, 30 fps) dibuat dengan Remotion di repo `../lokakasir-promo` (`LokaKasir-Tanya-Loka`, `src/tanya/TanyaLokaVideo.tsx`) dengan musik orisinal (`create-tanya-audio.py`):

1. **Pembuka (0–4,5 dtk)**: Perkenalan bot **Tanya Loka** di dalam Loka Kasir.
2. **Langkah 1 — Cara membuka (4,5–11,5 dtk)**: Ketuk ikon bintang ✨ di header (sebelah pencarian), atau lewat menu Lainnya, sidebar tablet, Bantuan, serta Web Admin.
3. **Langkah 2 — Cek angka toko lewat chat (11,5–22 dtk)**: Tanya omzet hari ini, pertanyaan lanjutan ("kalau kemarin?"), stok menipis, produk terlaris, kasbon belum lunas, status shift, jam ramai (mengikuti hak akses peran).
4. **Langkah 3 — Cepat & tetap jalan offline (22–31,5 dtk)**: Cari harga/stok produk dari katalog lokal (`harga kopi susu`, `stok gula`), cari nota & kasbon pelanggan, serta panduan cara pakai yang tetap bisa diakses tanpa internet plus tombol ke WhatsApp CS.
5. **Ringkasan 3 langkah (31,5–37 dtk)** & **Ajakan (37–42 dtk)**.

## Berkas

- `video.mp4` — MP4 H.264 `yuv420p` BT.709 + AAC + `faststart` (hasil `collect-video.cjs`)
- `preview-video.jpg` — lembar pratinjau 6 adegan
- `video-validation.json` — hasil pemeriksaan `ffprobe` sesuai batas Reels & `SOCIAL_LIMITS`
- `caption.txt` & `threads.txt` — naskah Instagram dan Threads
- `schedule.py` — pengunggah & penjadwal lewat API `/admin/social`
- `verifikasi-jadwal.json` — bukti verifikasi jadwal dari server
