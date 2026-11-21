// Tangkapan layar mode demo Loka Kasir HRIS (https://hris.lokakasir.id, data contoh, tanpa login).
// Dialog hanya dibuka lalu ditutup; tidak ada yang disimpan.
const path = require('node:path')
const { chromium } = require(process.env.LOKA_PLAYWRIGHT_PATH || '/Users/odhiahmad/.npm/_npx/e41f203b7505f1fb/node_modules/playwright')
const out = path.join(__dirname, '..', 'assets', 'shots')
// [berkas, menu, tinggi area (px CSS) dihitung dari judul halaman, teks jangkar opsional]
const pages = [
  ['hris-ringkasan', 'Ringkasan', 470], ['hris-shift', 'Jadwal Shift', 400], ['hris-karyawan', 'Karyawan', 440],
  ['hris-siklus', 'Siklus Karyawan', 470], ['hris-portal', 'Portal Saya', 440], ['hris-cuti', 'Cuti & Izin', 380],
  ['hris-laporan', 'Laporan', 330, 'Rekap lembur & klaim'],
]
const dialogs = [
  ['hris-dialog-profil', 'Aturan Payroll', 'Atur Profil'], ['hris-dialog-cuti', 'Cuti & Izin', 'Tinjau'],
  ['hris-dialog-karyawan', 'Karyawan', 'Tambah Karyawan'], ['hris-dialog-shift', 'Jadwal Shift', 'Atur Shift'],
]
;(async () => {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true,
    // Resolver lokal belum mengenal subdomain baru ini; alamatnya diambil dari 1.1.1.1.
    args: ['--host-resolver-rules=MAP hris.lokakasir.id 172.67.130.77'],
  })
  try {
    const page = await browser.newPage({ viewport: { width: 1060, height: 1500 }, deviceScaleFactor: 2 })
    await page.goto('https://hris.lokakasir.id/', { waitUntil: 'networkidle' })
    const nav = async label => {
      await page.locator('aside, nav').getByText(label, { exact: true }).first().click()
      await page.waitForTimeout(500)
      await page.evaluate(() => window.scrollTo(0, 0))
    }
    for (const [file, label, height, anchor] of pages) {
      await nav(label)
      const main = await page.locator('main').first().boundingBox()
      const start = anchor
        ? (await page.locator('main').getByText(anchor, { exact: true }).first().boundingBox()).y - 78
        : (await page.locator('main h1').first().boundingBox()).y - 14
      await page.screenshot({ path: path.join(out, file + '.png'), clip: { x: main.x + 8, y: start, width: main.width - 16, height } })
      console.log(file, Math.round(main.width - 16), height)
    }
    for (const [file, label, trigger] of dialogs) {
      await nav(label)
      await page.getByText(trigger, { exact: true }).first().click()
      const dialog = page.locator('dialog[open], [role="dialog"]').first()
      await dialog.waitFor({ state: 'visible', timeout: 5000 })
      await page.waitForTimeout(300)
      await page.evaluate(() => document.activeElement && document.activeElement.blur())
      await dialog.screenshot({ path: path.join(out, file + '.png') })
      const box = await dialog.boundingBox()
      console.log(file, Math.round(box.width), Math.round(box.height))
      await page.keyboard.press('Escape'); await page.waitForTimeout(300)
    }
  } finally { await browser.close() }
})().catch(err => { console.error(err); process.exitCode = 1 })
