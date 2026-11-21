// Lembar kontak untuk pemeriksaan visual: node tools/contact.cjs [nomor slide 1-4 | all] [berkas keluaran]
const fs = require('node:fs')
const path = require('node:path')
const { pathToFileURL } = require('node:url')
const { chromium } = require(process.env.LOKA_PLAYWRIGHT_PATH || '/Users/odhiahmad/.npm/_npx/e41f203b7505f1fb/node_modules/playwright')
const root = path.join(__dirname, '..')
const campaign = JSON.parse(fs.readFileSync(path.join(root, 'campaign.json'), 'utf8')).filter(p => p.format === 'foto')
const which = process.argv[2] || '1'
const out = process.argv[3] || path.join(root, which === '1' ? 'preview-sampul.jpg' : `preview-slide-${which}.jpg`)
const pick = which.includes('-') ? campaign.filter(p => which.split(',').includes(p.code.slice(0, 2) + '-')) : campaign
;(async () => {
  const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
  try {
    const page = await browser.newPage({ viewport: { width: 1500, height: 900 }, deviceScaleFactor: 1 })
    const parts = which === 'all' || which.includes('-') ? [1, 2, 3, 4] : [Number(which)]
    const cols = parts.length === 4 ? 4 : 5
    const images = pick.flatMap(p => parts.map(n => pathToFileURL(path.join(root, p.folder, `slide-0${n}.jpg`)).href))
    // Halaman sementara di folder kampanye: about:blank tidak boleh memuat gambar file://.
    const sheet = path.join(root, '.contact.html')
    fs.writeFileSync(sheet, `<body style="margin:0;background:#dfe6f3;padding:16px;display:grid;grid-template-columns:repeat(${cols},1fr);gap:14px">${images.map(src => `<img src="${src}" style="width:100%;display:block;border-radius:8px">`).join('')}</body>`)
    await page.goto(pathToFileURL(sheet).href)
    await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth))
    await page.screenshot({ path: out, fullPage: true, type: 'jpeg', quality: 88 })
    fs.rmSync(sheet)
    console.log(out)
  } finally { await browser.close() }
})().catch(err => { console.error(err); process.exitCode = 1 })
