import type { ProductCounts, ProductKey, ProductTenant, TenantStatus } from '../api/productMonitor.ts'

type Variant = 'success' | 'danger' | 'warning' | 'info' | 'neutral'

export interface ProductInfo {
  key: ProductKey
  label: string
  description: string
  /** Panel admin milik produk itu sendiri, untuk tindakan (perpanjang, reset password, …). */
  adminUrl?: string
  tenantNoun: string
}

export const PRODUCTS: ProductInfo[] = [
  { key: 'billing', label: 'Billing', description: 'Billing rental PlayStation & warnet · billing.lokakasir.id', adminUrl: 'https://billing.lokakasir.id/admin', tenantNoun: 'rental' },
  { key: 'accounting', label: 'Accounting', description: 'Akuntansi · accounting.lokakasir.id', adminUrl: 'https://accounting.lokakasir.id/admin', tenantNoun: 'organisasi' },
  { key: 'hris', label: 'HRIS', description: 'HR, absensi & payroll · hris.lokakasir.id', tenantNoun: 'workspace' },
]

export function productInfo(key: string | undefined): ProductInfo | undefined {
  return PRODUCTS.find((p) => p.key === key)
}

export const STATUS_LABEL: Record<TenantStatus, string> = {
  trial: 'Trial',
  trial_expired: 'Trial habis',
  grace: 'Masa tenggang',
  active: 'Aktif',
  expired: 'Langganan habis',
  suspended: 'Nonaktif',
}

export const STATUS_VARIANT: Record<TenantStatus, Variant> = {
  trial: 'info',
  trial_expired: 'neutral',
  grace: 'warning',
  active: 'success',
  expired: 'danger',
  suspended: 'neutral',
}

/** Urutan tombol filter status. */
export const STATUS_ORDER: TenantStatus[] = ['active', 'trial', 'grace', 'expired', 'trial_expired', 'suspended']

export function statusCount(counts: ProductCounts, status: TenantStatus): number {
  return counts[status] ?? 0
}

/**
 * Hari tersisa sampai `until` (dibulatkan ke atas); negatif = sudah lewat.
 * `null` bila tanpa tanggal.
 */
export function daysLeft(until: string | null | undefined, now = new Date()): number | null {
  if (!until || !Number.isFinite(Date.parse(until))) return null
  return Math.ceil((Date.parse(until) - now.getTime()) / 86_400_000)
}

/** Keterangan singkat masa aktif: "5 hari lagi", "hari ini", "lewat 3 hari". */
export function untilHint(until: string | null | undefined, now = new Date()): string {
  const days = daysLeft(until, now)
  if (days == null) return ''
  if (days > 0) return `${days} hari lagi`
  if (days === 0) return 'hari ini'
  return `lewat ${-days} hari`
}

export function filterTenants(tenants: ProductTenant[], status: TenantStatus | '', search: string): ProductTenant[] {
  const q = search.trim().toLowerCase()
  return tenants.filter((t) =>
    (!status || t.status === status) &&
    (!q || [t.name, t.owner, t.contact, t.id].some((v) => v?.toLowerCase().includes(q))))
}

/** Kalimat kecil untuk kartu dashboard: trial berjalan & yang segera habis. */
export function overviewDetail(counts: ProductCounts): string {
  const parts = [`${counts.trial} trial`]
  if (counts.expiring_7d > 0) parts.push(`${counts.expiring_7d} habis ≤ 7 hari`)
  if ((counts.grace ?? 0) > 0) parts.push(`${counts.grace} masa tenggang`)
  parts.push(`${counts.total} total`)
  return parts.join(' · ')
}
