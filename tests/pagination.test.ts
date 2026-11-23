import assert from 'node:assert/strict'
import test from 'node:test'
import { lastPage, pageWindow, parsePage } from '../src/lib/pagination.ts'

test('nomor halaman URL harus bilangan bulat positif yang aman', () => {
  for (const raw of [null, '', 'abc', '0', '-1', '2.5', 'Infinity', '99999999999999999']) {
    assert.equal(parsePage(raw), 1)
  }
  assert.equal(parsePage('12'), 12)
})

test('halaman pertama, aktif dan terakhir tetap terjangkau tanpa daftar tombol panjang', () => {
  for (const total of [0, 1, 7, 8, 9, 16, 100]) {
    const last = lastPage(total, 1)
    for (let page = 1; page <= last; page++) {
      const window = pageWindow(page, last)
      const pages = window.filter(n => typeof n === 'number')
      assert.equal(pages[0], 1)
      assert.equal(pages.at(-1), last)
      assert.ok(pages.includes(page))
      if (page > 1) assert.ok(pages.includes(page - 1))
      if (page < last) assert.ok(pages.includes(page + 1))
      assert.deepEqual(pages, [...new Set(pages)].sort((a, b) => a - b))
      assert.ok(window.length <= 7)
    }
  }
  assert.equal(lastPage(21, 20), 2)
  assert.equal(lastPage(20, 20), 1)
})
