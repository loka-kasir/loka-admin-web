// Tangkapan tampilan produk dari halaman resmi https://billing.lokakasir.id (ilustrasi antarmuka di landing page).
// Pemakaian: node tools/capture-landing.cjs            → daftar bagian + tangkapan halaman penuh (.landing.jpg)
//            node tools/capture-landing.cjs <nama>=<selector> ...  → tangkapan elemen ke assets/shots/<nama>.png
const path = require('node:path')
const { chromium } = require(process.env.LOKA_PLAYWRIGHT_PATH || '/Users/odhiahmad/.npm/_npx/e41f203b7505f1fb/node_modules/playwright')
const root = path.join(__dirname, '..')
;(async () => {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true,
    // Resolver lokal belum mengenal subdomain baru ini; alamatnya dari 1.1.1.1.
    args: ['--host-resolver-rules=MAP billing.lokakasir.id 104.21.7.122'],
  })
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })
    await page.goto('https://billing.lokakasir.id/', { waitUntil: 'networkidle' })
    // Bagian muncul saat digulir; gulir sampai bawah supaya semuanya termuat.
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)) } window.scrollTo(0, 0) })
    await page.waitForTimeout(600)
    const picks = process.argv.slice(2)
    if (!picks.length) {
      const sections = await page.evaluate(() => [...document.querySelectorAll('section, header, footer')].map(el => ({ tag: el.tagName, id: el.id, cls: el.className.toString().slice(0, 40), y: Math.round(el.getBoundingClientRect().top + scrollY), h: Math.round(el.offsetHeight), head: (el.querySelector('h1,h2')?.innerText || '').replace(/\s+/g, ' ').slice(0, 70) })))
      console.log(JSON.stringify(sections))
      await page.setViewportSize({ width: 1280, height: 900 })
      await page.screenshot({ path: path.join(root, '.landing.jpg'), fullPage: true, type: 'jpeg', quality: 60, scale: 'css' })
      return
    }
    for (const pick of picks) {
      const at = pick.indexOf('=')
      const el = page.locator(pick.slice(at + 1)).first()
      await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(400)
      await el.screenshot({ path: path.join(root, 'assets', 'shots', pick.slice(0, at) + '.png') })
      console.log(pick.slice(0, at), JSON.stringify(await el.boundingBox()))
    }
  } finally { await browser.close() }
})().catch(err => { console.error(err); process.exitCode = 1 })
