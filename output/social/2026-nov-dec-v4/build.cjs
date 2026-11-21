// v4: slide 2 sampai akhir dari 84 posting Loka Kasir yang masih antre dirombak supaya terisi penuh
// dan penutupnya menampilkan layar aplikasi. Sampul, caption, teks Threads, ID, dan jadwal tidak berubah.
// Naskah slide berasal dari ../2026-nov-dec-v3/campaign.json; daftar posting dari targets.json.
// Jalankan: node build.cjs   lalu   node render.cjs
const fs = require('node:fs')
const path = require('node:path')
const root = __dirname
const v3 = JSON.parse(fs.readFileSync(path.join(root, '..', '2026-nov-dec-v3', 'campaign.json'), 'utf8'))
const targets = JSON.parse(fs.readFileSync(path.join(root, 'targets.json'), 'utf8'))
const shots = JSON.parse(fs.readFileSync(path.join(root, 'assets', 'app', 'shots.json'), 'utf8'))
const e = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const byNumber = Object.fromEntries(v3.map(p => [p.number, p]))

// Label bagian dirotasi supaya antrean tidak mengulang dua judul yang sama di setiap posting.
const PAYOFF = ['Intinya', 'Yang sering terlewat', 'Pelajarannya', 'Jadi begini', 'Kuncinya']
const ACTION = ['Coba di tokomu', 'Tiga langkah kecil', 'Mulai dari sini', 'Bisa dicoba besok']

// Dua posting bergaya lama ditulis ulang dari caption yang sudah terjadwal (isi caption tidak diubah).
const legacy = {
  '566c7644-4bbe-4798-9081-361a2519bbf9': {
    code: 'L01', art: 'assets/art/hari-guru.jpg', shot: null,
    slides: [
      { kind: 'cover', eyebrow: 'Hari Guru Nasional · 25 November', title: 'Terima kasih, Guru.', titleSize: 124, body: 'Untuk yang mengajari kita berhitung, menabung, dan berani bermimpi.' },
      { kind: 'warm', eyebrow: 'Dari Loka Kasir', title: 'Pelajaran pertama soal uang datang dari kelas.', body: 'Terima kasih untuk para guru yang terus mengajar dengan sabar. Selamat Hari Guru Nasional.' },
    ],
  },
  'afc0ea8e-19d8-4ea3-a426-827b7d24469e': {
    code: 'L02', art: 'assets/art/tanggal-tua.jpg', shot: 'jamramai',
    slides: [
      { kind: 'cover', eyebrow: 'Tanggal tua', title: 'Dompet pembeli menipis. Warung tetap harus jalan.', body: 'Tiga pilihan ramah kantong yang bisa disiapkan.' },
      { kind: 'action', eyebrow: 'Coba di warungmu', title: 'Sediakan pilihan ramah kantong.', items: ['Porsi mini|Lebih murah, tetap kenyang.', 'Paket hemat Rp10.000|Nasi, lauk, dan teh.', 'Menu murah di depan|Taruh di tempat paling kelihatan.'] },
      { kind: 'close', eyebrow: 'Di Loka Kasir', title: 'Kamu biasanya bikin strategi apa pas tanggal tua?', body: 'Catat semua penjualan di Loka Kasir supaya kelihatan kapan ramai dan kapan sepi.', cta: '' },
    ],
  },
}

const art = src => `<div class="art"><img src="${e(src)}" alt=""></div>`
const steps = (items, fill) => `<ol class="steps${fill ? ' fill' : ''}">${items.map((item, i) => { const [head, sub] = item.split('|'); return `<li class="step"><span class="step-num">${i + 1}</span><p>${e(head)}${sub ? `<small>${e(sub)}</small>` : ''}</p></li>` }).join('')}</ol>`

function content(p, s) {
  const eyebrow = text => `<p class="eyebrow">${e(text)}</p>`
  const h2 = `<h2>${e(s.title)}</h2>`
  if (s.kind === 'cover') return `${art(p.art)}${eyebrow(s.eyebrow)}<h1${s.titleSize ? ` style="font-size:${s.titleSize}px"` : ''}>${e(s.title)}</h1><p class="lead">${e(s.body)}</p>`
  if (s.kind === 'chat') return `${eyebrow(s.eyebrow)}${h2}${art(p.art)}<div class="conversation">${s.items.map((line, i) => { const at = line.indexOf(':'); return `<div class="bubble b${i % 2}">${at > 0 ? `<span class="speaker">${e(line.slice(0, at))}</span>` : ''}<p>${e(at > 0 ? line.slice(at + 1).trim() : line)}</p></div>` }).join('')}</div><p class="note">Ilustrasi percakapan sehari-hari.</p>`
  if (s.kind === 'quiz') return `${eyebrow(s.eyebrow)}${h2}${art(p.art)}<div class="options">${s.items.map((x, i) => `<div class="option"><span>${'ABC'[i]}</span><p>${e(x.replace(/^[ABC]\.\s*/, ''))}</p></div>`).join('')}</div><p class="note">Sudah pilih? Alasannya ada di slide berikutnya.</p>`
  if (s.kind === 'compare') return `${eyebrow(s.eyebrow)}${h2}${art(p.art)}<div class="comparison">${s.items.map((x, i) => { const at = x.indexOf(':'); return `<div class="card"><span class="card-label">${e((p.compare_labels || [])[i] || x.slice(0, at))}</span><p>${e(at > 0 ? x.slice(at + 1).trim() : x)}</p></div>` }).join('')}</div>`
  if (s.kind === 'checklist') return `${eyebrow(s.eyebrow)}${h2}<p class="intro">${e(s.body)}</p>${art(p.art)}${steps(s.items)}`
  if (s.kind === 'math') return `${eyebrow('Simulasi · bukan data merchant')}${h2}<p class="intro">${e(s.body)}</p><div class="receipt">${s.data.rows.map(([label, value]) => `<div class="receipt-row"><span>${e(label)}</span><strong>${e(value)}</strong></div>`).join('')}</div>${art(p.art)}`
  if (s.kind === 'calculation') { const d = s.data; return `${eyebrow('Simulasi')}${h2}<p class="equation">${e(d.equation)}</p><p class="result">${e(d.result)}</p>${d.before ? `<div class="bars"><div class="bar-label"><span>Sebelum</span><b>${e(d.before)}</b></div><div class="bar-track"><i style="width:100%"></i></div><div class="bar-label"><span>Setelah</span><b>${e(d.after)}</b></div><div class="bar-track"><i style="width:${d.ratio}%"></i></div></div>` : ''}<p class="intro">${e(d.note || s.body)}</p>${art(p.art)}` }
  if (s.kind === 'payoff') return `${eyebrow(p.warm ? s.eyebrow : PAYOFF[p.number % PAYOFF.length])}<h2 style="font-size:80px">${e(s.title)}</h2><p class="body">${e(s.body)}</p>${art(p.art)}`
  if (s.kind === 'action') return `${eyebrow(p.legacy ? s.eyebrow : ACTION[p.number % ACTION.length])}${h2}${steps(s.items, true)}`
  if (s.kind === 'close') {
    const shot = p.shot && shots[p.shot]
    if (!shot || !s.body) return `${eyebrow(s.eyebrow === 'Bawa ke praktik' ? 'Dari Loka Kasir' : s.eyebrow)}${h2}${art(p.art)}${s.cta || s.body ? `<p class="signoff">${e(s.body || s.cta)}</p>` : ''}`
    return `${eyebrow('Di Loka Kasir')}${h2}<div class="card product"><figure><div class="shot${shot.fade_right ? ' fade-right' : ''}" style="background:${shot.background};--shot-bg:${shot.background}"><img src="assets/app/${e(p.shot)}.png" alt="Layar ${e(shot.label)} Loka Kasir"></div><figcaption>Layar ${e(shot.label)} di Loka Kasir · data contoh</figcaption></figure><p>${e(s.body)}</p></div><div class="cta-row"><span>${e(s.cta || '')}</span><b class="pill">lokakasir.id</b></div>`
  }
  // myth, story, warm: cerita pendek di atas gambar besar.
  return `${eyebrow(s.eyebrow)}${h2}${art(p.art)}<div class="card"><p class="quote">${e(s.body)}</p></div>`
}

function themeFor(p, s, index) {
  if (s.kind === 'cover') return 'paper'
  if (s.kind === 'close') return p.shot && s.body ? 'blue' : 'paper'
  if (s.kind === 'payoff') return p.warm ? 'paper' : ['blue', 'lime', 'navy'][p.number % 3]
  if (s.kind === 'action') return p.number % 2 ? 'paper' : 'navy'
  if (s.kind === 'calculation') return 'navy'
  return ['paper', 'navy', 'paper', 'lime'][(p.number + index) % 4]
}

const plan = []
const pages = {}
for (const target of targets) {
  const old = legacy[target.id]
  const source = old ? null : byNumber[target.number]
  if (!old && !source) throw new Error(`Naskah tidak ditemukan: ${target.id}`)
  const p = old
    ? { code: old.code, number: Number(old.code.slice(1)), art: old.art, shot: old.shot, slides: old.slides, legacy: true }
    : { code: String(source.number).padStart(3, '0'), number: source.number, art: `../2026-nov-dec-v3/${source.art}`, shot: source.bridge ? target.shot : null, slides: source.slides, compare_labels: source.compare_labels, warm: source.format === 'warm' }
  if (!fs.existsSync(path.join(root, p.art))) throw new Error(`Gambar tidak ada: ${p.art}`)
  const first = old ? 0 : 1 // sampul v3 dipertahankan; posting gaya lama mendapat sampul baru
  const files = []
  const sections = []
  p.slides.forEach((s, i) => {
    if (i < first) return
    const file = `media/${p.code}-${i + 1}.jpg`
    files.push(file)
    sections.push(`<section class="slide ${themeFor(p, s, i)} ${s.kind}" data-file="${file}"><header class="masthead"><img class="brand" src="assets/loka-white.svg" alt="Loka"><span class="pagination">${String(i + 1).padStart(2, '0')} / ${String(p.slides.length).padStart(2, '0')}</span></header><main class="stage">${content(p, s)}</main><footer><span>@lokakasir.id</span><span class="progress">${p.slides.map((_, j) => `<i class="${j <= i ? 'done' : ''}"></i>`).join('')}</span></footer></section>`)
  })
  pages[p.code] = sections
  plan.push({ id: target.id, code: p.code, when: target.when, title: target.title, keep_cover: !old, shot: p.shot || null, slides_before: target.slides_before, slides_after: p.slides.length, files })
}
const css = fs.readFileSync(path.join(root, 'slides.css'), 'utf8')
const page = body => `<!doctype html><html lang="id"><meta charset="utf-8"><title>Loka Kasir · slide v4</title><style>${css}</style><body>${body}</body></html>\n`
fs.rmSync(path.join(root, '.pages'), { recursive: true, force: true })
fs.mkdirSync(path.join(root, '.pages'))
// Satu halaman per posting: gambar sumber besar (±2 MB), jadi tidak dimuat sekaligus saat render.
for (const [code, sections] of Object.entries(pages)) fs.writeFileSync(path.join(root, '.pages', `${code}.html`), page(sections.join('\n')).replace(/(src|url)=?\(?['"]?(assets\/|\.\.\/2026)/g, m => m.replace('assets/', '../assets/').replace('../2026', '../../2026')).replace(/url\('assets\//g, "url('../assets/"))
fs.writeFileSync(path.join(root, 'plan.json'), JSON.stringify(plan, null, 1) + '\n')
console.log(`${plan.length} posting, ${plan.reduce((n, p) => n + p.files.length, 0)} slide baru; ${plan.filter(p => p.shot).length} penutup memakai layar aplikasi.`)
