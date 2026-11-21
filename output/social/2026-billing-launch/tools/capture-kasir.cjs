// Tangkapan layar kasir web LokaKasir Billing dari server LOKAL berisi data contoh
// (lihat tools/seed-demo-state.py). Tidak menyentuh produksi.
// Pemakaian: node tools/capture-kasir.cjs [--probe]
const path = require('node:path')
const { chromium } = require(process.env.LOKA_PLAYWRIGHT_PATH || '/Users/odhiahmad/.npm/_npx/e41f203b7505f1fb/node_modules/playwright')
const out = path.join(__dirname, '..', 'assets', 'shots')
const BASE = process.env.BILLING_WEB || 'http://127.0.0.1:5199'
const pages = [['kasir-beranda', ''], ['kasir-monitor', 'monitor'], ['kasir-booking', 'booking'], ['kasir-pos', 'pos'], ['kasir-shift', 'shift'], ['kasir-member', 'member'], ['kasir-laporan', 'laporan']]
;(async () => {
  const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
  try {
    const page = await browser.newPage({ viewport: { width: 1180, height: 820 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })
    await page.goto(BASE + '/masuk', { waitUntil: 'networkidle' })
    await page.getByLabel('Email atau username').fill('admin')
    await page.getByLabel('Password', { exact: true }).fill('contoh-lokal-2026') // akun contoh server lokal, bukan produksi
    await page.locator('button[type="submit"]').click()
    await page.waitForURL(url => !url.pathname.endsWith('/masuk'), { timeout: 15000 })
    await page.waitForLoadState('networkidle')
    const home = new URL(page.url()).pathname.replace(/\/$/, '')
    console.log('beranda:', home || '/')
    for (const [file, route] of pages) {
      await page.goto(BASE + home + (route ? '/' + route : ''), { waitUntil: 'networkidle' })
      await page.waitForTimeout(900)
      await page.screenshot({ path: path.join(out, file + '.png') })
      const main = page.locator('main').first()
      console.log(file, JSON.stringify(await main.boundingBox()), JSON.stringify((await main.innerText()).replace(/\s+/g, ' ').slice(0, 160)))
    }
  } finally { await browser.close() }
})().catch(err => { console.error(err); process.exitCode = 1 })
