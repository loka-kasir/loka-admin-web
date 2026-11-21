// Mengekspor posting video ke proyek Remotion (lokakasir-promo/src/isu) beserta asetnya.
// Jalankan setelah content.cjs berubah: node tools/export-video.cjs
const fs = require('node:fs')
const path = require('node:path')
const root = path.join(__dirname, '..')
const promo = process.env.LOKA_PROMO_PATH || path.join(root, '..', '..', '..', '..', 'lokakasir-promo')
const posts = require('../content.cjs')
const PRODUCT = { accounting: ['Loka Kasir Accounting', 'Pembukuan & laporan keuangan', 'accounting.lokakasir.id'], hris: ['Loka Kasir HRIS', 'Karyawan, absensi & payroll', 'hris.lokakasir.id'] }
// Ukuran PNG dari header IHDR, untuk menghitung geseran tangkapan layar di video.
const pngSize = file => { const b = fs.readFileSync(file); return { captureWidth: b.readUInt32BE(16), captureHeight: b.readUInt32BE(20) } }
const assets = path.join(promo, 'public', 'assets', 'isu')
fs.mkdirSync(assets, { recursive: true })
fs.copyFileSync(path.join(root, 'assets', 'lokakasir-mark.svg'), path.join(assets, 'lokakasir-mark.svg'))
const out = posts.map((p, i) => ({ p, code: `${String(i + 1).padStart(2, '0')}-${p.slug}` })).filter(x => x.p.video).map(({ p, code }) => {
  fs.copyFileSync(path.join(root, 'assets', 'shots', p.app.capture), path.join(assets, p.app.capture))
  const [name, tag, domain] = PRODUCT[p.product]
  const size = pngSize(path.join(root, 'assets', 'shots', p.app.capture))
  return { code, product: p.product, productName: name, productTag: tag, domain, theme: p.theme, category: p.category, newsDate: p.newsDate,
    headline: p.headline, lead: p.lead, viz: p.video, facts: p.facts, bridge: { kicker: p.bridge.kicker || 'Buat usahamu', title: p.bridge.title, items: p.bridge.items },
    app: { title: p.app.title, body: p.app.body, path: p.app.path, capture: p.app.capture, ...size, focus: p.app.focus || [0, 0, size.captureWidth, size.captureHeight], zoom: p.app.zoom || 2.4, cta: p.app.cta } }
})
fs.writeFileSync(path.join(promo, 'src', 'isu', 'posts.ts'), `// Dihasilkan oleh loka-admin-web/output/social/2026-viral-accounting-hris/tools/export-video.cjs. Jangan diubah langsung.
import type { Post } from "./Kit";

export const posts: Post[] = ${JSON.stringify(out, null, 2)};
`)
console.log(`${out.length} posting video diekspor ke ${path.relative(root, path.join(promo, 'src', 'isu', 'posts.ts'))}`)
