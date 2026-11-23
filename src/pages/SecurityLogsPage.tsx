import Select from '../components/ui/Select'
import { useCallback } from 'react'
import { getSecurityLogs, type SecurityEventLog } from '../api/admin'
import { useAdminData } from '../hooks/useAdminData'
import { useListQuery, usePageBounds } from '../hooks/useListQuery'
import Pagination from '../components/ui/Pagination'

const ACTION_LABELS: Record<string, string> = {
  request_forgot_password: 'Minta OTP (Web)',
  mobile_request_forgot_password: 'Minta OTP (Mobile)',
  reset_password: 'Reset Password',
  admin_reset_password: 'Reset Password oleh Admin',
}

const ACTION_OPTIONS = [
  { value: '', label: 'Semua Aksi' },
  { value: 'request_forgot_password', label: 'Minta OTP (Web)' },
  { value: 'mobile_request_forgot_password', label: 'Minta OTP (Mobile)' },
  { value: 'reset_password', label: 'Reset Password' },
  { value: 'admin_reset_password', label: 'Reset Password oleh Admin' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'success', label: 'Berhasil' },
  { value: 'failed', label: 'Gagal' },
]

function LocationBadge({ log }: { log: SecurityEventLog }) {
  if (log.country) {
    return (
      <div className="text-sm">
        <div className="font-medium text-slate-700">
          {[log.city, log.region, log.country].filter(Boolean).join(', ')}
        </div>
        {log.isp && <div className="text-xs text-slate-400 truncate max-w-[200px]">{log.isp}</div>}
      </div>
    )
  }
  return <span className="text-slate-400 text-sm">Memproses…</span>
}

function parseUserAgent(ua: string): string {
  if (!ua) return '-'
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS'
  if (/Android/.test(ua)) return 'Android'
  if (/Windows/.test(ua)) return 'Windows'
  if (/Mac OS X/.test(ua)) return 'macOS'
  if (/Linux/.test(ua)) return 'Linux'
  return ua.slice(0, 40)
}

export default function SecurityLogsPage() {
  const { params, page, setPage, setFilters } = useListQuery()
  const action = params.get('action') || undefined
  const status = params.get('status') || undefined
  const limit = 20
  const fetcher = useCallback(async () => {
    const res = await getSecurityLogs({ page, limit, action, status })
    if (!res.status) throw new Error(res.message)
    return res.data
  }, [page, action, status])
  const { data, loading, error, refresh } = useAdminData(fetcher)
  const logs = data?.data ?? []
  const total = data?.total ?? 0
  usePageBounds(page, data?.total, limit, setPage)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Security Log</h1>
        <p className="text-sm text-slate-500 mt-1">
          Rekaman setiap request reset password — IP, lokasi, dan status.
        </p>
      </div>

      {/* Filters */}
      <div className="card p-3 sm:p-4 grid grid-cols-1 sm:flex sm:flex-wrap gap-3">
        <Select
          aria-label="Aksi"
          value={action ?? ''}
          onChange={e => setFilters({ action: e.target.value })}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {ACTION_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
        <Select
          aria-label="Status"
          value={status ?? ''}
          onChange={e => setFilters({ status: e.target.value })}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
        <button
          disabled={loading} onClick={refresh}
          className="sm:ml-auto px-4 py-2.5 sm:py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Perbarui
        </button>
      </div>

      {/* Summary */}
      <div className="text-sm text-slate-500">
        {error ? <p role="alert" className="text-red-700">{error} <button onClick={refresh} className="underline">Coba lagi</button></p> : loading ? 'Memuat log…' : `${total} kejadian ditemukan`}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-medium text-slate-600">Waktu</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Aksi</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Identifier</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">IP</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Lokasi</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Device</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    Memuat…
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    {error ? 'Log belum berhasil dimuat.' : 'Tidak ada log sesuai filter.'}
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('id-ID', {
                        dateStyle: 'short',
                        timeStyle: 'medium',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-700">
                        {ACTION_LABELS[log.action] ?? log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{log.identifier}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{log.ip_address}</td>
                    <td className="px-4 py-3">
                      <LocationBadge log={log} />
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {parseUserAgent(log.user_agent)}
                    </td>
                    <td className="px-4 py-3">
                      {log.status === 'success' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Berhasil
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Gagal
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {total > limit && <div className="border-t border-slate-200 p-4"><Pagination page={page} limit={limit} total={total} onChange={setPage} /></div>}
      </div>
    </div>
  )
}
