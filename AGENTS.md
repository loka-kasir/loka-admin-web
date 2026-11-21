# Loka Admin Web

Panel admin Loka Kasir (React 19 + Vite + Tailwind 4). Antarmuka dan komentar kode berbahasa Indonesia.

## Verifikasi

```sh
npm run lint    # eslint
npm test        # node --test tests/*.test.ts
npm run build   # tsc -b && vite build
```

Push ke `main` menjalankan CI dan men-deploy panel ke `admin.lokakasir.id` (Cloudflare Workers).

## Konten sosial (`output/social/`)

- Tiap kampanye punya folder sendiri berisi naskah, skrip build/render, media final, dan bukti verifikasi API. Ringkasan terbaru ada di `output/social/README.md`.
- Slide dirender dari HTML dengan Playwright + Google Chrome lokal (`LOKA_PLAYWRIGHT_PATH` menunjuk instalasi Playwright).
- Video dibuat di repo `../lokakasir-promo` (Remotion).
- Penjadwalan memakai API `/admin/social` lewat SSH ke server produksi; lihat `tools/schedule.py` atau `tools/apply.py` di folder kampanye. Selalu jalankan `--dry-run` dulu, dan jangan mengubah posting di luar target.
- Batas naskah mengikuti `src/lib/social.ts` (`SOCIAL_LIMITS`).
