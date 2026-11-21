// Merender posting foto di carousel.html menjadi JPEG 1080 × 1350 dan memeriksa tata letak.
// Posting video dirender di proyek Remotion (lihat tools/collect-video.cjs).
// Jalankan setelah build: node render.cjs [--only=03,07]
const assert = require('node:assert/strict')
const fs = require('node:fs')
const { execFileSync } = require('node:child_process')
const path = require('node:path')
const { pathToFileURL } = require('node:url')
const { chromium } = require(process.env.LOKA_PLAYWRIGHT_PATH || '/Users/odhiahmad/.npm/_npx/e41f203b7505f1fb/node_modules/playwright')
const root = __dirname
const campaign = JSON.parse(fs.readFileSync(path.join(root, 'campaign.json'), 'utf8')).filter(p => p.format === 'foto')
const only = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean)
;(async () => {
  const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
  try {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 })
    await page.goto(pathToFileURL(path.join(root, 'carousel.html')).href)
    await page.evaluate(() => document.fonts.ready)
    await page.waitForFunction(() => [...document.images].every(image => image.complete))
    assert.equal(await page.locator('[data-file]').count(), campaign.length * 4)
    const problems = await page.evaluate(() => [...document.querySelectorAll('.slide')].flatMap(slide => {
      const bad = []
      const main = slide.querySelector('main')
      const footer = slide.querySelector('footer').getBoundingClientRect()
      const inner = slide.getBoundingClientRect()
      if (main.scrollHeight > main.clientHeight + 1) bad.push(`main meluap ${main.scrollHeight - main.clientHeight}px`)
      for (const el of main.querySelectorAll('h1,h2,h3,p,li,b,span,figure,.hero,.badge,.big')) {
        const box = el.getBoundingClientRect()
        if (box.bottom > footer.top + 1) bad.push(`${el.className || el.tagName} melewati footer`)
        if (box.right > inner.right - 40 || box.left < inner.left + 40) bad.push(`${el.className || el.tagName} keluar margin`)
        // .hero sengaja memotong ikon dekoratif; teksnya diperiksa lewat .big dan anak lainnya.
        if (!el.classList.contains('hero') && el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).display !== 'inline') bad.push(`${el.className || el.tagName} teks meluap`)
      }
      // Lencana dan ikon tidak boleh menimpa angka utama.
      const badge = slide.querySelector('.versus .badge')
      if (badge) for (const value of slide.querySelectorAll('.versus .row b')) {
        const range = document.createRange(); range.selectNodeContents(value)
        const text = range.getBoundingClientRect(), b = badge.getBoundingClientRect()
        if (text.right > b.left - 8) bad.push('lencana menimpa angka')
      }
      for (const image of slide.querySelectorAll('img')) if (image.naturalWidth === 0) bad.push(`gambar gagal: ${image.getAttribute('src')}`)
      return bad.length ? [[slide.dataset.file, [...new Set(bad)]]] : []
    }))
    if (problems.length) { console.error(JSON.stringify(problems, null, 1)); assert.fail(`${problems.length} slide bermasalah`) }
    // Tiap slide dipotret sendirian di viewport yang pas. Memotret elemen di halaman panjang (28 slide)
    // sesekali menghasilkan gambar terpotong yang memperlihatkan latar halaman.
    const files = await page.locator('[data-file]').evaluateAll(slides => slides.map(slide => slide.dataset.file))
    let count = 0
    for (const [index, file] of files.entries()) {
      if (only.length && !only.some(n => file.startsWith(`media/${n}-`))) continue
      await page.evaluate(shown => {
        document.querySelectorAll('.slide').forEach((slide, i) => { slide.style.display = i === shown ? '' : 'none' })
        window.scrollTo(0, 0)
      }, index)
      await page.screenshot({ path: path.join(root, file), type: 'jpeg', quality: 93, animations: 'disabled', clip: { x: 0, y: 0, width: 1080, height: 1350 } })
      count++
    }
    console.log(execFileSync('python3', [path.join(root, 'tools', 'check-slides.py')], { encoding: 'utf8' }).trim())
    fs.writeFileSync(path.join(root, 'layout-validation.json'), JSON.stringify({ checked_at: new Date().toISOString(), slides: campaign.length * 4, rendered: count, problems: [] }, null, 1) + '\n')
    console.log(`${count} JPEG 1080 × 1350 dirender; ${campaign.length * 4} slide lolos pemeriksaan tata letak.`)
  } finally { await browser.close() }
})().catch(err => { console.error(err.message || err); process.exitCode = 1 })
