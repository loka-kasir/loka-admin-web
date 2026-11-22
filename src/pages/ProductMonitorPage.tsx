import { useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { getProductSummary, type ProductKey, type ProductPayment, type ProductSummary, type ProductTenant, type TenantStatus } from '../api/productMonitor'
import { AnalyticsHeader, AnalyticsState } from '../components/analytics/AnalyticsUI'
import Badge from '../components/ui/Badge'
import { Card, StatCard } from '../components/ui/Card'
import { formatDate, formatNumber, percentage } from '../lib/analytics'
import { formatMoneyShort } from '../lib/dashboard'
import { STATUS_LABEL, STATUS_ORDER, STATUS_VARIANT, filterTenants, productInfo, statusCount, untilHint, type ProductInfo } from '../lib/productMonitor'
import { formatMoney } from '../lib/sales'

const METHOD_LABEL: Record<string, string> = { duitku: 'Duitku', cash: 'Tunai', transfer: 'Transfer', qris: 'QRIS' }

function TenantRow({ tenant, showEmployees }: { tenant: ProductTenant; showEmployees: boolean }) {
  const hint = tenant.status === 'trial' || tenant.status === 'active' || tenant.status === 'grace' ? untilHint(tenant.until) : ''
  return (
    <tr className="border-b border-slate-100 last:border-0 align-top">
      <td className="px-4 py-3">
        <p className="font-medium text-slate-800">{tenant.name || '—'}</p>
        <p className="text-xs text-slate-400 truncate max-w-56">{tenant.id}</p>
      </td>
      <td className="px-4 py-3 text-xs text-slate-600 space-y-0.5">
        <p>{tenant.owner || '—'}</p>
        {tenant.contact && tenant.contact !== tenant.owner && <p className="text-slate-400">{tenant.contact}</p>}
      </td>
      <td className="px-4 py-3"><Badge variant={STATUS_VARIANT[tenant.status] ?? 'neutral'}>{STATUS_LABEL[tenant.status] ?? tenant.status}</Badge></td>
      <td className="px-4 py-3 text-xs text-slate-600">{tenant.plan || '—'}</td>
      {showEmployees && <td className="px-4 py-3 text-xs tabular-nums text-slate-600">{formatNumber(tenant.employees)}</td>}
      <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
        <p>{formatDate(tenant.until)}</p>
        {hint && <p className={hint.startsWith('lewat') ? 'text-red-600' : 'text-slate-400'}>{hint}</p>}
      </td>
      <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
        <p>{formatDate(tenant.created_at)}</p>
        {tenant.last_seen_at && <p className="text-slate-400">aktif {formatDate(tenant.last_seen_at)}</p>}
      </td>
    </tr>
  )
}

function Payments({ payments }: { payments: ProductPayment[] }) {
  return (
    <Card title="Pembayaran terakhir" description="20 pembayaran langganan terbaru">
      {payments.length ? (
        <ul className="divide-y divide-slate-100">
          {payments.map((p, i) => (
            <li key={`${p.paid_at}-${i}`} className="flex items-baseline justify-between gap-3 py-2.5 first:pt-0 last:pb-0 text-sm">
              <span className="min-w-0">
                <span className="block truncate text-slate-800">{p.tenant}</span>
                <span className="block text-xs text-slate-400">{p.plan || '—'} · {METHOD_LABEL[p.method] ?? p.method} · {formatDate(p.paid_at, true)}</span>
              </span>
              <span className="shrink-0 font-medium tabular-nums text-slate-900">{formatMoney(p.amount)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="h-24 flex items-center justify-center text-slate-400 text-sm">Belum ada pembayaran</div>
      )}
    </Card>
  )
}

/** Seperti useAnalytics, tetapi menampilkan alasan dari server (mis. "belum dikonfigurasi") dan `fresh` saat diperbarui. */
function useProductSummary(product: ProductKey) {
  const [state, setState] = useState<{ data: ProductSummary | null; error: string | null; updatedAt: string | null }>({ data: null, error: null, updatedAt: null })
  const [request, setRequest] = useState({ revision: 0, fresh: false })
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let current = true
    getProductSummary(product, request.fresh)
      .then((r) => { if (current) setState({ data: r.data, error: null, updatedAt: new Date().toISOString() }) })
      .catch((e) => {
        const message = e?.response?.data?.message
        if (current) setState((s) => ({ ...s, error: typeof message === 'string' && message ? message : 'Data gagal dimuat. Periksa koneksi, lalu coba lagi.' }))
      })
      .finally(() => { if (current) setLoading(false) })
    return () => { current = false }
  }, [product, request])
  const refresh = () => { setLoading(true); setRequest((r) => ({ revision: r.revision + 1, fresh: true })) }
  return { ...state, loading, refresh }
}

function ProductMonitor({ info }: { info: ProductInfo }) {
  const query = useProductSummary(info.key)
  const [status, setStatus] = useState<TenantStatus | ''>('')
  const [search, setSearch] = useState('')
  const data = query.data
  const tenants = useMemo(() => filterTenants(data?.tenants ?? [], status, search), [data, status, search])
  const showEmployees = info.key === 'hris'
  const columns = ['Usaha', 'Pemilik', 'Status', 'Paket', ...(showEmployees ? ['Karyawan'] : []), 'Aktif s.d.', 'Daftar']

  const header = (
    <AnalyticsHeader
      title={info.label}
      description={info.description}
      loading={query.loading}
      updatedAt={query.updatedAt}
      refresh={query.refresh}
    />
  )
  if (!data) return <div className="space-y-6">{header}<AnalyticsState loading={query.loading} error={query.error} hasData={false} /></div>

  const c = data.counts
  return (
    <div className="space-y-6">
      {header}
      <AnalyticsState loading={false} error={query.error} hasData />

      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Berlangganan aktif" value={formatNumber(c.active)} detail={`${percentage(c.active, c.total)}% dari ${formatNumber(c.total)} ${info.tenantNoun}`} tone="success" />
        <StatCard
          label="Trial berjalan"
          value={formatNumber(c.trial)}
          tone={c.expiring_7d > 0 ? 'warning' : 'default'}
          detail={`${formatNumber(c.expiring_7d)} trial/langganan habis ≤ 7 hari`}
        />
        <StatCard
          label="Pendapatan 30 hari"
          value={formatMoneyShort(data.revenue_30d.amount)}
          detail={`${formatNumber(data.revenue_30d.count)} pembayaran · bulan ini ${formatMoneyShort(data.revenue_month.amount)}`}
        />
        <StatCard label="Pendaftaran 30 hari" value={formatNumber(data.signups_30d)} detail={`${formatNumber(c.trial_expired)} trial habis tanpa berlangganan`} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-3 min-w-0">
          <div className="card p-3 sm:p-4 flex flex-col gap-3">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter status">
              {(['', ...STATUS_ORDER] as const).filter((s) => !s || statusCount(c, s) > 0 || status === s).map((s) => (
                <button
                  key={s || 'all'}
                  type="button"
                  aria-pressed={status === s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${status === s ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {s ? STATUS_LABEL[s] : 'Semua'} <span className="tabular-nums opacity-75">{formatNumber(s ? statusCount(c, s) : c.total)}</span>
                </button>
              ))}
            </div>
            <input
              type="search"
              placeholder={`Cari ${info.tenantNoun}, pemilik, kontak…`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {columns.map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tenants.length ? tenants.map((t) => <TenantRow key={t.id} tenant={t} showEmployees={showEmployees} />) : (
                    <tr><td colSpan={columns.length} className="px-4 py-10 text-center text-slate-400">Tidak ada {info.tenantNoun} sesuai filter</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {data.tenants.length >= 500 && <p className="text-xs text-slate-400">Menampilkan 500 {info.tenantNoun} terbaru.</p>}
        </div>
        <div className="space-y-4 min-w-0">
          <Payments payments={data.payments} />
          {info.adminUrl && (
            <a href={info.adminUrl} target="_blank" rel="noreferrer" className="card p-4 flex items-center justify-between gap-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <span>Buka panel admin {info.label}<span className="block text-xs font-normal text-slate-400">untuk perpanjang, catat pembayaran, atau reset akun</span></span>
              <ExternalLink size={16} className="shrink-0 text-slate-400" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductMonitorPage() {
  const { product } = useParams()
  const info = productInfo(product)
  if (!info) return <Navigate to="/" replace />
  return <ProductMonitor key={info.key} info={info} />
}
