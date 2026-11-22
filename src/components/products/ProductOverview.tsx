import type { ProductOverviewItem } from '../../api/productMonitor'
import { formatNumber } from '../../lib/analytics'
import { formatMoneyShort } from '../../lib/dashboard'
import { PRODUCTS, overviewDetail } from '../../lib/productMonitor'
import { SectionLabel, StatCard } from '../ui/Card'

/** Bagian "Produk lain" di Dashboard: satu kartu per produk, tiap kartu menuju halamannya. */
export default function ProductOverview({ items, error }: { items: ProductOverviewItem[] | null; error: string | null }) {
  return (
    <div className="space-y-3">
      <SectionLabel hint="Langganan aktif · pendapatan 30 hari terakhir">Produk lain</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PRODUCTS.map((p) => {
          const item = items?.find((i) => i.product === p.key)
          const data = item?.data
          return (
            <StatCard
              key={p.key}
              to={`/monitor/${p.key}`}
              label={p.label}
              value={data ? `${formatNumber(data.counts.active)} aktif` : '—'}
              tone={data && data.counts.expiring_7d > 0 ? 'warning' : 'default'}
              detail={data ? overviewDetail(data.counts) : item?.error ?? error ?? 'Memuat…'}
              footer={data && (
                <p className="text-xs text-slate-500">
                  <span className="font-semibold tabular-nums text-slate-800">{formatMoneyShort(data.revenue_30d.amount)}</span>
                  {' '}dari {formatNumber(data.revenue_30d.count)} pembayaran · {formatNumber(data.signups_30d)} daftar baru
                </p>
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
