// Jalankan terhadap Vite lokal. Semua respons API memakai data uji.
const assert = require('node:assert/strict')
const { chromium } = require(process.env.LOKA_PLAYWRIGHT_PATH || 'playwright')

const base = 'http://127.0.0.1:5186'
const date = '2026-01-01T00:00:00Z'
const business = n => ({
  id: `test-${n}`, business_name: `Toko ${n}`, owner_name: 'Pemilik',
  created_at: date, updated_at: date, is_active: true, membership: null, outlets: [],
})

async function check(browser, width) {
  const context = await browser.newContext({ viewport: { width, height: 800 }, serviceWorkers: 'block' })
  const errors = []
  const requests = []
  let total = 310
  let failDetail = false
  let name
  await context.addInitScript(() => localStorage.setItem('loka-admin-auth', JSON.stringify({ state: { token: 'uji-lokal' }, version: 0 })))
  await context.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (url.origin !== base) return route.abort()
    if (!url.pathname.startsWith('/admin/') && url.pathname !== '/business-type' && url.pathname !== '/business-vertical') return route.continue()
    let data = []
    let pagination
    if (url.pathname === '/admin/businesses') {
      const p = Number(url.searchParams.get('page'))
      requests.push(p)
      data = Array.from({ length: Math.min(15, Math.max(0, total - (p - 1) * 15)) }, (_, i) => business((p - 1) * 15 + i + 1))
      if (p === 9 && data.length && name) data[0].business_name = name
      pagination = { page: p, limit: 15, total }
    } else if (url.pathname === '/admin/businesses/test-121') {
      if (failDetail) return route.fulfill({ status: 503, json: { status: false } })
      if (route.request().method() === 'PATCH') name = route.request().postDataJSON().business_name
      data = { ...business(121), business_type: { id: 1, name: 'Ritel' }, business_name: name || 'Toko 121' }
    } else if (url.pathname === '/business-type') data = [{ id: 1, name: 'Ritel' }, { id: 2, name: 'Jasa' }]
    else if (url.pathname === '/admin/active-users') data = { businesses: [] }
    else if (url.pathname.endsWith('/subscription-prices')) {
      data = ['pro', 'pro-yearly', 'pro-3year'].map(plan => ({ plan, normal_price: 10000, custom_price: null }))
    }
    await route.fulfill({ json: { status: true, data, pagination } })
  })
  const page = await context.newPage()
  page.setDefaultTimeout(8000)
  page.on('pageerror', err => errors.push(err.message))
  const dialog = page.getByRole('dialog', { name: 'Detail bisnis', exact: true })
  const current = () => page.locator('[aria-current="page"][disabled]').innerText()
  const start = `${base}/businesses?search=Toko&page=8`
  try {
    await page.goto(start)
    await page.getByRole('button', { name: 'Halaman berikutnya' }).click()
    const trigger = page.getByRole('link', { name: 'Toko 121', exact: true })
    await trigger.waitFor()
    assert.equal(await current(), '9')
    await trigger.click()
    await dialog.getByRole('button', { name: 'Edit Profil Bisnis' }).click()
    const edit = page.getByRole('dialog', { name: 'Edit Profil Bisnis' })
    await edit.getByRole('button', { name: 'Ritel' }).click()
    await edit.getByRole('option', { name: 'Jasa' }).click()
    await page.keyboard.press('Escape')
    await edit.waitFor({ state: 'hidden' })
    assert.ok(await dialog.isVisible())
    await dialog.getByRole('button', { name: 'Tutup', exact: true }).click()
    await dialog.waitFor({ state: 'hidden' })
    assert.equal(await current(), '9')
    assert.equal(await page.getByRole('searchbox').inputValue(), 'Toko')
    assert.deepEqual([...new Set(requests)], [8, 9])

    await trigger.click()
    await dialog.getByRole('button', { name: 'Edit Profil Bisnis' }).click()
    await edit.getByRole('textbox').first().fill('Toko diperbarui')
    await edit.getByRole('button', { name: 'Simpan', exact: true }).click()
    await dialog.getByRole('heading', { name: 'Toko diperbarui', exact: true }).first().waitFor()
    await page.goBack()
    await page.getByRole('link', { name: 'Toko diperbarui' }).waitFor()
    assert.equal(await current(), '9')
    await page.goForward()
    await page.reload()
    await dialog.getByRole('button', { name: 'Edit Profil Bisnis' }).waitFor()
    await page.keyboard.press('Escape')
    await dialog.waitFor({ state: 'hidden' })
    assert.equal(await current(), '9')

    failDetail = true
    await page.getByRole('link', { name: 'Toko diperbarui' }).click()
    await dialog.getByRole('alert').waitFor()
    failDetail = false
    await dialog.getByRole('button', { name: 'Coba lagi' }).click()
    await dialog.getByRole('button', { name: 'Edit Profil Bisnis' }).waitFor()
    const box = await dialog.boundingBox()
    assert.ok(box && box.x >= 0 && box.x + box.width <= width && box.height <= 800)
    await page.goBack()
    total = 17
    await page.reload()
    await page.getByRole('link', { name: 'Toko 16', exact: true }).waitFor()
    assert.equal(await current(), '2')
    await page.getByRole('searchbox').fill('baru')
    await page.waitForURL('**/businesses?search=baru')
    await page.getByRole('link', { name: 'Toko 1', exact: true }).waitFor()
    assert.equal(await current(), '1')
    assert.deepEqual(errors, [])
  } finally {
    await context.close()
  }
}

;(async () => {
  const browser = await chromium.launch({ channel: 'chrome' })
  try {
    for (const width of [1366, 390]) {
      await check(browser, width)
      console.log(`Alur daftar dan modal lulus pada lebar ${width}px.`)
    }
  } finally {
    await browser.close()
  }
})().catch(err => { console.error(err); process.exitCode = 1 })
