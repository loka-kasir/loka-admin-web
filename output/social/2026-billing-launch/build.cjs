// Menyusun materi kampanye dari content.cjs: campaign.json, carousel.html, index.html,
// kalender.csv, dan caption/threads/alt-text per posting. Jalankan: node build.cjs
//
// Templat sama dengan ../2026-viral-accounting-hris. Posting dengan `video` tayang sebagai satu video
// (Reels) dari proyek Remotion lokakasir-promo;
// posting lain tayang sebagai empat gambar. Keduanya tidak dicampur dalam satu posting.
const fs = require('node:fs')
const path = require('node:path')
const root = __dirname
const posts = require('./content.cjs')

// Batas sama dengan src/lib/social.ts (SOCIAL_LIMITS).
const LIMITS = { caption: 2200, hashtags: 5, threads: 500, links: 5 }
const PRODUCT = {
  accounting: { name: 'Loka Kasir Accounting', tag: 'Pembukuan & laporan keuangan', domain: 'accounting.lokakasir.id', url: 'https://accounting.lokakasir.id/', shot: 'Tampilan Loka Kasir Accounting · Akun demo' },
  billing: { name: 'Loka Kasir Billing', tag: 'Billing rental PS & warnet', domain: 'billing.lokakasir.id', url: 'https://billing.lokakasir.id/', shot: 'Tampilan Loka Kasir Billing · Data contoh' },
  hris: { name: 'Loka Kasir HRIS', tag: 'Karyawan, absensi & payroll', domain: 'hris.lokakasir.id', url: 'https://hris.lokakasir.id/', shot: 'Tampilan Loka Kasir HRIS · Mode demo' },
}
const e = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const chars = text => Array.from(text).length
const fail = message => { throw new Error(message) }
// Lebar jendela tangkapan layar di slide produk (lebar isi slide dikurangi bingkai figure).
const SHOT_WIDTH = 912
const pngWidth = file => fs.readFileSync(file).readUInt32BE(16)
/** Tangkapan layar slide produk. Dengan `photoFocus` [x0, y0, x1, y1] (px sumber), hanya bagian itu yang tampil, diperbesar selebar jendela. */
function shot(app) {
  const src = `assets/shots/${e(app.capture)}`
  if (!app.photoFocus) return `<img src="${src}" alt="${e(app.captureAlt)}">`
  const [x0, y0, x1, y1] = app.photoFocus
  const zoom = SHOT_WIDTH / (x1 - x0)
  const width = pngWidth(path.join(root, 'assets', 'shots', app.capture)) * zoom
  return `<div class="crop" style="height:${Math.round((y1 - y0) * zoom)}px"><img src="${src}" alt="${e(app.captureAlt)}" style="width:${width.toFixed(1)}px;margin:${(-y0 * zoom).toFixed(1)}px 0 0 ${(-x0 * zoom).toFixed(1)}px"></div>`
}

// Ikon garis dari lucide-react (ISC) yang sudah menjadi dependensi panel.
function icon(name) {
  const file = path.join(root, '..', '..', '..', 'node_modules', 'lucide-react', 'dist', 'esm', 'icons', name + '.mjs')
  const source = fs.readFileSync(file, 'utf8')
  const nodes = new Function('return ' + source.match(/node:\s*(\[[\s\S]*?\])\s*\n\s*\};/)[1])()
  const body = nodes.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).filter(([k]) => k !== 'key').map(([k, v]) => `${k}="${e(v)}"`).join(' ')}/>`).join('')
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`
}

function hero(p) {
  const h = p.hero
  const art = `<div class="icon">${icon(p.icon)}</div>`
  if (h.kind === 'shot') return `<div class="hero shot"><img src="assets/shots/${e(h.image)}" alt="${e(h.alt)}"><p>${e(h.caption)}</p></div>`
  if (h.kind === 'ticker') return `<div class="hero ticker">${art}${h.rows.map(([a, b]) => `<div class="row"><b>${e(a)}</b><span>${e(b)}</span></div>`).join('')}</div>`
  if (h.kind === 'versus') return `<div class="hero versus">${h.rows.map(([a, b]) => `<div class="row"><span>${e(a)}</span><b>${e(b)}</b></div>`).join('')}<div class="badge${chars(h.badge) > 7 ? ' long' : ''}">${e(h.badge)}</div></div>`
  const size = Math.max(112, Math.min(236, Math.round(900 / (0.6 * chars(h.big)))))
  return `<div class="hero stat">${art}<div class="big" style="font-size:${size}px">${e(h.big)}</div><p class="label">${e(h.label)}</p><div class="minis">${h.minis.map(([a, b]) => `<div class="mini"><b>${e(a)}</b><span>${e(b)}</span></div>`).join('')}</div></div>`
}
const heroText = h => h.kind === 'shot' ? `Gambar: ${h.alt}. ${h.caption}` : h.kind === 'stat' ? `${h.big}: ${h.label}. ${h.minis.map(m => m.join(' ')).join('; ')}.` : `${h.rows.map(r => r.join(': ')).join('; ')}${h.badge ? ` (${h.badge})` : ''}.`

const seen = new Set()
const blocks = [], gallery = [], rows = [], campaign = []
const months = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

posts.forEach((p, index) => {
  const product = PRODUCT[p.product] || fail(`Produk tidak dikenal: ${p.product}`)
  const code = `${String(index + 1).padStart(2, '0')}-${p.slug}`
  const folder = `media/${code}`
  const slot = `${p.date}T${p.time}:00+07:00`
  if (seen.has(slot)) fail(`Slot ganda: ${slot}`)
  seen.add(slot)

  // Validasi naskah sebelum ada yang dirender.
  for (const [label, text, limit] of [['caption', p.caption, LIMITS.caption], ['threads', p.threads, LIMITS.threads]]) {
    if (chars(text) > limit) fail(`${code}: ${label} ${chars(text)} karakter, batas ${limit}`)
    if (!text.startsWith(product.name + ' · ')) fail(`${code}: ${label} harus diawali nama produk`)
    if (!text.includes(product.url)) fail(`${code}: ${label} tanpa tautan ${product.url}`)
    if (/[\u{1F000}-\u{1FAFF}]/u.test(text)) fail(`${code}: ${label} memuat emoji`)
  }
  if ((p.caption.match(/#[\p{L}\p{N}_]+/gu) || []).length > LIMITS.hashtags) fail(`${code}: hashtag lebih dari ${LIMITS.hashtags}`)
  if ((p.threads.match(/\bhttps?:\/\//gi) || []).length > LIMITS.links) fail(`${code}: tautan Threads lebih dari ${LIMITS.links}`)
  if (p.facts.items.length !== 3 || p.bridge.items.length !== 3) fail(`${code}: fakta dan langkah harus tiga butir`)
  if (!fs.existsSync(path.join(root, 'assets', 'shots', p.app.capture))) fail(`${code}: tangkapan layar ${p.app.capture} tidak ada`)

  fs.mkdirSync(path.join(root, folder), { recursive: true })
  const isVideo = Boolean(p.video)
  const scenes = [
    `${product.name}. ${[p.category, p.newsDate].filter(Boolean).join(', ')}. ${p.headline} ${p.lead} ${heroText(p.hero)}`,
    `${p.facts.title}. ${p.facts.items.map(([a, b]) => `${a}: ${b}`).join(' ')} ${p.facts.source}`,
    `${p.bridge.title}. ${p.bridge.items.map(([a, b]) => `${a}. ${b}`).join(' ')}`,
    `${p.app.title} ${p.app.body} Menu: ${p.app.path.join(', ')}. Tangkapan layar: ${p.app.captureAlt}. ${p.app.cta}.`,
  ]
  const alt = isVideo
    ? [`Video 28 detik tanpa narasi suara, dengan musik. ${['Pembuka', 'Fakta', 'Buat usahamu', 'Di aplikasi'].map((name, i) => `${name}: ${scenes[i]}`).join(' ')}`]
    : scenes
  fs.writeFileSync(path.join(root, folder, 'caption.txt'), p.caption.trimEnd() + '\n')
  fs.writeFileSync(path.join(root, folder, 'threads.txt'), p.threads.trimEnd() + '\n')
  fs.writeFileSync(path.join(root, folder, 'alt-text.txt'), alt.map((text, i) => (isVideo ? text : `Slide ${i + 1}: ${text}`)).join('\n\n') + '\n')
  const media = isVideo ? ['video.mp4'] : [1, 2, 3, 4].map(n => `slide-0${n}.jpg`)
  // Gambar dari format sebelumnya tidak boleh tertinggal di folder posting video (dan sebaliknya).
  for (const stale of ['video.mp4', 'slide-01.jpg', 'slide-02.jpg', 'slide-03.jpg', 'slide-04.jpg']) {
    if (!media.includes(stale)) fs.rmSync(path.join(root, folder, stale), { force: true })
  }

  const frame = (part, kind, body) => `<article class="slide ${kind} t-${p.theme} p-${p.product}" data-file="${folder}/slide-${String(part).padStart(2, '0')}.jpg">
<header class="brand"><div class="wordmark"><img src="assets/lokakasir-mark.svg" alt=""><div><strong>${e(product.name)}</strong><small>${e(product.tag)}</small></div></div><span class="pagination">${part} / 4</span></header>
<main>${body}</main>
<footer><span>@lokakasir.id</span><span>${part < 4 ? 'Geser →' : e(product.domain)}</span></footer>
</article>`
  const list = items => items.map(([a, b], i) => `<li><span class="number">${i + 1}</span><div><h3>${e(a)}</h3><p>${e(b)}</p></div></li>`).join('')
  if (!isVideo) blocks.push(
    frame(1, 'cover', `<div class="chips"><span class="chip live"><i></i>${e(p.chip || 'LAGI RAMAI')}</span><span class="chip">${e([p.category, p.newsDate].filter(Boolean).join(' · '))}</span></div><h1>${e(p.headline)}</h1><p class="lead">${e(p.lead)}</p>${hero(p)}`),
    frame(2, 'facts', `<p class="kicker">${e(p.facts.kicker || 'Faktanya')}</p><h2>${e(p.facts.title)}</h2><ol>${p.facts.items.map(([a, b]) => `<li><b>${e(a)}</b><p>${e(b)}</p></li>`).join('')}</ol><p class="source">${e(p.facts.source)}</p>`),
    frame(3, 'bridge', `<p class="kicker">${e(p.bridge.kicker || 'Buat usahamu')}</p><h2>${e(p.bridge.title)}</h2><ol>${list(p.bridge.items)}</ol>`),
    frame(4, 'app', `<p class="kicker">Di ${e(product.name)}</p><h2>${e(p.app.title)}</h2><p class="lead">${e(p.app.body)}</p><ul class="path">${p.app.path.map(x => `<li>${e(x)}</li>`).join('<li class="sep">›</li>')}</ul><figure>${shot(p.app)}<figcaption>${e(product.shot)}</figcaption></figure><p class="cta">${e(p.app.cta)} <span>→</span></p>`),
  )

  const when = new Date(`${p.date}T00:00:00Z`)
  const label = `${days[when.getUTCDay()]}, ${when.getUTCDate()} ${months[when.getUTCMonth() + 1]} ${when.getUTCFullYear()}`
  gallery.push(`<section class="post"><header><p>${e(label)} · ${p.time.replace(':', '.')} WIB · ${e(product.name)} · ${e(p.category)} · ${isVideo ? 'Video' : 'Foto'}</p><h2>${e(p.title)}</h2></header>
${isVideo ? `<video class="reel" controls preload="metadata" src="${folder}/video.mp4" aria-label="${e(alt[0])}"></video>` : `<div class="images">${alt.map((text, i) => `<a href="${folder}/slide-0${i + 1}.jpg"><img loading="lazy" src="${folder}/slide-0${i + 1}.jpg" alt="${e(text)}"></a>`).join('')}</div>`}
<details><summary>Caption Instagram (${chars(p.caption)} karakter)</summary><p class="copy">${e(p.caption)}</p></details>
<details><summary>Versi Threads (${chars(p.threads)} karakter)</summary><p class="copy">${e(p.threads)}</p></details></section>`)
  rows.push([p.date, p.time, 'Asia/Jakarta', product.name, p.category, p.title, 'Instagram & Threads @lokakasir.id', isVideo ? 'Video Reels 9:16, 28 detik' : 'Foto 4 gambar, 1080 × 1350', folder, product.url])
  campaign.push({ number: index + 1, code, folder, scheduled_at: slot, format: isVideo ? 'video' : 'foto', media, ...p, product: p.product, productName: product.name })
})

// Setelah tools/schedule.py berjalan, kalender memuat tautan posting di Loka Admin.
const receiptFile = path.join(root, 'verifikasi-jadwal.json')
const scheduled = fs.existsSync(receiptFile) ? Object.fromEntries(JSON.parse(fs.readFileSync(receiptFile, 'utf8')).posts.map(x => [x.code, x.id])) : {}
campaign.forEach((p, i) => rows[i].push(scheduled[p.code] ? 'Terjadwal di Loka Admin' : 'Belum dijadwalkan', scheduled[p.code] ? `https://admin.lokakasir.id/social/${scheduled[p.code]}` : ''))
const csvCell = value => /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
fs.writeFileSync(path.join(root, 'kalender.csv'), '\ufeff' + [['Tanggal', 'Jam WIB', 'Zona', 'Produk', 'Kategori', 'Topik', 'Kanal feed', 'Format', 'Folder', 'CTA', 'Status', 'Posting Loka Admin'], ...rows].map(r => r.map(csvCell).join(',')).join('\n') + '\n')
fs.writeFileSync(path.join(root, 'campaign.json'), JSON.stringify(campaign, null, 1) + '\n')
fs.writeFileSync(path.join(root, 'carousel.html'), `<!doctype html><html lang="id"><meta charset="utf-8"><title>Carousel · Loka Kasir Billing</title><style>${fs.readFileSync(path.join(root, 'slides.css'), 'utf8')}</style><body>${blocks.join('\n')}</body></html>\n`)
fs.writeFileSync(path.join(root, 'index.html'), `<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Konten Loka Kasir Billing</title><style>*{box-sizing:border-box}body{margin:0;background:#f2f6ff;color:#102348;font-family:Arial,sans-serif}
main{max-width:1180px;margin:auto;padding:48px 28px}h1{font-size:clamp(30px,5vw,50px);line-height:1.12;margin:0 0 12px}p{line-height:1.5}a{color:#174dde}
.bar{display:flex;flex-wrap:wrap;gap:14px;margin:20px 0 30px}.bar a{font-weight:700}section{background:#fff;padding:24px;border:1px solid #dce5fa;border-radius:18px;margin-bottom:26px}
.post header p{margin:0;color:#485b7c}.post h2{margin:8px 0 20px;font-size:25px}.images{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.images img{display:block;width:100%;border-radius:10px;aspect-ratio:4/5;object-fit:cover}.reel{display:block;width:min(100%,300px);aspect-ratio:9/16;border-radius:12px;background:#0b1f3b}details{padding:14px 0;border-bottom:1px solid #e3e9f5}summary{font-weight:700;cursor:pointer}.copy{white-space:pre-wrap}
@media(max-width:560px){main{padding:24px 14px}section{padding:16px}.images{grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.images img{border-radius:6px}}</style>
<main><h1>Konten Loka Kasir Billing</h1>
<p>${posts.length} posting untuk Instagram dan Threads @lokakasir.id, 24 November–19 Desember 2026. Foto (empat gambar) dan video tayang bergantian, memperkenalkan billing rental PlayStation dan warnet satu masalah per posting.</p>
<div class="bar"><a href="kalender.csv" download>Unduh kalender CSV</a><a href="README.md">Catatan kampanye</a></div>
${gallery.join('\n')}</main></html>\n`)
console.log(`${posts.length} posting: ${blocks.length / 4} foto (${blocks.length} gambar) dan ${posts.length - blocks.length / 4} video. Naskah lolos batas caption ${LIMITS.caption}, hashtag ${LIMITS.hashtags}, Threads ${LIMITS.threads}.`)
