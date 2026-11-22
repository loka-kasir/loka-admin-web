import assert from 'node:assert/strict'
import test from 'node:test'
import type { ProductCounts, ProductTenant } from '../src/api/productMonitor.ts'
import { daysLeft, filterTenants, overviewDetail, productInfo, statusCount, untilHint } from '../src/lib/productMonitor.ts'

const counts: ProductCounts = { total: 9, trial: 3, trial_expired: 1, active: 4, expired: 1, suspended: 0, expiring_7d: 2 }

test('product routes only accept the three known products', () => {
  assert.equal(productInfo('billing')?.label, 'Billing')
  assert.equal(productInfo('hris')?.adminUrl, undefined)
  assert.equal(productInfo('kasir'), undefined)
  assert.equal(productInfo(undefined), undefined)
})

test('days left round up and show past dates as overdue', () => {
  const now = new Date('2026-11-22T03:00:00Z')
  assert.equal(daysLeft('2026-11-27T02:00:00Z', now), 5)
  assert.equal(daysLeft(null, now), null)
  assert.equal(daysLeft('bukan tanggal', now), null)
  assert.equal(untilHint('2026-11-22T03:00:00Z', now), 'hari ini')
  assert.equal(untilHint('2026-11-19T03:00:00Z', now), 'lewat 3 hari')
  assert.equal(untilHint('2026-11-23T03:00:00Z', now), '1 hari lagi')
})

test('tenants filter by status and by name, owner, contact or id', () => {
  const tenants: ProductTenant[] = [
    { id: 'kopi', name: 'Kopi Loka', owner: 'Sari', contact: 'sari@kopi.id', status: 'trial', plan: '', until: null, created_at: null, last_seen_at: null },
    { id: 'ps-1', name: 'Rental PS Budi', owner: 'Budi', contact: '0812', status: 'active', plan: 'Bulanan', until: null, created_at: null, last_seen_at: null },
  ]
  assert.deepEqual(filterTenants(tenants, '', '').map((t) => t.id), ['kopi', 'ps-1'])
  assert.deepEqual(filterTenants(tenants, 'active', '').map((t) => t.id), ['ps-1'])
  assert.deepEqual(filterTenants(tenants, '', ' SARI@ ').map((t) => t.id), ['kopi'])
  assert.deepEqual(filterTenants(tenants, 'trial', 'budi'), [])
})

test('overview text mentions only what needs attention', () => {
  assert.equal(overviewDetail(counts), '3 trial · 2 habis ≤ 7 hari · 9 total')
  assert.equal(overviewDetail({ ...counts, expiring_7d: 0, grace: 1 }), '3 trial · 1 masa tenggang · 9 total')
  assert.equal(statusCount(counts, 'grace'), 0)
  assert.equal(statusCount(counts, 'active'), 4)
})
