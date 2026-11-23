import axios from '../lib/axios'
import type { SingleResponse } from '../types'

export type ProductKey = 'billing' | 'accounting' | 'hris'
/** Status bersama ketiga produk (lihat endpoint monitor/summary di tiap service). */
export type TenantStatus = 'trial' | 'trial_expired' | 'grace' | 'active' | 'expired' | 'suspended'

export interface ProductCounts {
  total: number
  trial: number
  trial_expired: number
  active: number
  expired: number
  suspended: number
  expiring_7d: number
  /** Hanya HRIS: masa tenggang 7 hari setelah masa aktif habis. */
  grace?: number
}

export interface ProductTenant {
  id: string
  name: string
  owner: string
  contact: string
  status: TenantStatus
  plan: string
  until: string | null
  created_at: string | null
  last_seen_at: string | null
  /** Hanya HRIS: karyawan aktif. */
  employees?: number
}

export interface ProductPayment {
  tenant: string
  amount: number
  plan: string
  months: number
  method: string
  paid_at: string
}

export interface ProductSummary {
  product: ProductKey
  generated_at: string
  counts: ProductCounts
  revenue_30d: { count: number; amount: number }
  revenue_month: { count: number; amount: number }
  signups_30d: number
  tenants: ProductTenant[]
  payments: ProductPayment[]
}

/** Satu produk di ringkasan gabungan; `error` terisi bila layanannya tidak bisa dibaca. */
export interface ProductOverviewItem {
  product: ProductKey
  data: ProductSummary | null
  error?: string
  code?: string
}

/** Ringkasan ketiga produk sekaligus (Dashboard). `fresh` melewati cache 1 menit di server. */
export const getProductOverview = (fresh = false) =>
  axios
    .get<SingleResponse<ProductOverviewItem[]>>('/admin/product-monitor', { params: fresh ? { fresh: 1 } : undefined })
    .then((r) => r.data)

export interface MonitorQuery {
  page: number
  limit: number
  status: TenantStatus | ''
  search: string
}
export interface PagedSummary extends ProductSummary {
  pagination: { page: number; limit: number; total: number }
}

export const getProductSummary = (product: ProductKey, query: MonitorQuery, fresh = false) =>
  axios
    .get<SingleResponse<PagedSummary>>(`/admin/product-monitor/${product}`, { params: { ...query, fresh: fresh ? 1 : undefined } })
    .then(({ data: r }) => {
      const p = r.data?.pagination
      if (!r.status || !p || p.page !== query.page || p.limit !== query.limit || !Number.isSafeInteger(p.total) || p.total < 0) {
        throw new Error('Layanan belum mengembalikan halaman tenant yang diminta.')
      }
      return r.data
    })
