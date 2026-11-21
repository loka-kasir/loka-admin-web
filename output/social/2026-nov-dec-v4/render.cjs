// Merender slide v4 per posting (.pages/<kode>.html) menjadi JPEG 1080 × 1350 dan memeriksa tata letak.
// Jalankan: node render.cjs [--only=019,L02]
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { pathToFileURL } = require('node:url')
const { chromium } = require(process.env.LOKA_PLAYWRIGHT_PATH || '/Users/odhiahmad/.npm/_npx/e41f203b7505f1fb/node_modules/playwright')
const root = __dirname
const plan = JSON.parse(fs.readFileSync(path.join(root, 'plan.json'), 'utf8'))
const only = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean)
;(async () => {
  const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
  const problems = []
  let count = 0
  try {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 })
    for (const post of plan) {
      if (only.length && !only.includes(post.code)) continue
      await page.goto(pathToFileURL(path.join(root, '.pages', `${post.code}.html`)).href)
      await page.evaluate(() => document.fonts.ready)
      await page.waitForFunction(() => [...document.images].every(image => image.complete))
      const found = await page.evaluate(() => [...document.querySelectorAll('.slide')].map(slide => {
        const bad = []
        const stage = slide.querySelector('.stage')
        const footer = slide.querySelector('footer').getBoundingClientRect()
        if (stage.scrollHeight > stage.clientHeight + 1) bad.push(`isi meluap ${stage.scrollHeight - stage.clientHeight}px`)
        for (const el of stage.querySelectorAll('h1,h2,p,li,figure,.art,.card,.bubble,.option,.receipt,.pill')) {
          const box = el.getBoundingClientRect()
          if (box.bottom > footer.top + 1) bad.push(`${el.className || el.tagName} melewati footer`)
          if (box.right > 1080 - 60 || box.left < 60) bad.push(`${el.className || el.tagName} keluar margin`)
          if (el.scrollWidth > el.clientWidth + 2 && !el.classList.contains('art') && el.tagName !== 'FIGURE') bad.push(`${el.className || el.tagName} teks meluap`)
        }
        // Isi terakhir harus sampai dekat footer: tidak boleh ada ruang kosong besar di bawah.
        const last = stage.lastElementChild.getBoundingClientRect()
        if (footer.top - last.bottom > 60) bad.push(`ruang kosong ${Math.round(footer.top - last.bottom)}px di bawah`)
        for (const image of slide.querySelectorAll('img')) if (image.naturalWidth === 0) bad.push(`gambar gagal: ${image.getAttribute('src')}`)
        return { file: slide.dataset.file, bad: [...new Set(bad)] }
      }))
      assert.deepEqual(found.map(f => f.file), post.files)
      for (const [index, slide] of found.entries()) {
        if (slide.bad.length) problems.push([slide.file, slide.bad])
        await page.evaluate(shown => { document.querySelectorAll('.slide').forEach((el, i) => { el.style.display = i === shown ? '' : 'none' }); window.scrollTo(0, 0) }, index)
        await page.screenshot({ path: path.join(root, slide.file), type: 'jpeg', quality: 92, animations: 'disabled', clip: { x: 0, y: 0, width: 1080, height: 1350 } })
        count++
      }
    }
  } finally { await browser.close() }
  if (!only.length) fs.writeFileSync(path.join(root, 'layout-validation.json'), JSON.stringify({ checked_at: new Date().toISOString(), slides: count, problems }, null, 1) + '\n')
  console.log(`${count} JPEG dirender; ${problems.length} slide bermasalah.`)
  if (problems.length) { console.log(JSON.stringify(problems.slice(0, 40))); process.exitCode = 1 }
})().catch(err => { console.error(err.message || err); process.exitCode = 1 })
