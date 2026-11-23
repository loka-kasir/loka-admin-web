import Select from '../components/ui/Select'
import { FilterBar, SearchField, filterControl } from '../components/ui/FilterBar'
import { useState, useCallback } from 'react'
import { useAdminData } from '../hooks/useAdminData'
import { useListQuery, usePageBounds } from '../hooks/useListQuery'
import DetailLink from '../components/ui/DetailLink'
import DetailModal from '../components/ui/DetailModal'
import { getBusinesses, toggleBusinessActive, deleteBusiness } from '../api/admin'
import type { AdminBusiness } from '../types'
import Badge from '../components/ui/Badge'
import Pagination from '../components/ui/Pagination'
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal'
import { formatDate } from '../lib/analytics'
import { membershipLabel, membershipVariant } from '../lib/membership'

// Pengurutan yang diterima server (/admin/businesses: sort_by + order_by).
// Default "Terbaru": pendaftar baru paling sering dicari di halaman ini.
const SORT_OPTIONS = [
  { value: 'created_at:desc', label: 'Terbaru daftar' },
  { value: 'created_at:asc', label: 'Terlama daftar' },
  { value: 'updated_at:desc', label: 'Baru diperbarui' },
  { value: 'name:asc', label: 'Nama A–Z' },
  { value: 'name:desc', label: 'Nama Z–A' },
] as const
type SortValue = (typeof SORT_OPTIONS)[number]['value']
const sortParams = (v: SortValue) => {
  const [sort_by, order_by] = v.split(':') as ['created_at' | 'updated_at' | 'name', 'asc' | 'desc']
  return { sort_by, order_by }
}

const STATUS_OPTIONS = [
  { value: '', label: 'Semua' },
  { value: 'trial', label: 'Trial' },
  { value: 'pro', label: 'Pro' },
  { value: 'expired', label: 'Berakhir / tanpa langganan' },
]

// Tidak ada paket Gratis: tanpa membership atau `free` lama berarti usaha
// terkunci (lihat saja) sampai berlangganan.
function membershipBadge(membership: AdminBusiness['membership']) {
  if (!membership) return <Badge variant="danger">Tanpa langganan</Badge>
  const expired = membership.type === 'free' || new Date(membership.end_date) < new Date() || !membership.is_active
  if (expired) return <Badge variant="danger">Berakhir</Badge>
  return <Badge variant={membershipVariant(membership.type)}>{membershipLabel(membership.type)}</Badge>
}

export default function BusinessesPage() {
  const { params, page, setPage, setFilters } = useListQuery()
  const search = params.get('search') ?? ''
  const status = params.get('status') ?? ''
  const sort = SORT_OPTIONS.find(o => o.value === params.get('sort'))?.value ?? SORT_OPTIONS[0].value
  const [toggling, setToggling] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminBusiness | null>(null)

  const limit = 15

  const fetcher = useCallback(async () => {
    const res = await getBusinesses({ page, limit, search, status, ...sortParams(sort) })
    if (!res.status) throw new Error(res.message)
    return res
  }, [page, search, status, sort])
  const { data, error, loading, refresh: load } = useAdminData(fetcher)
  const businesses = data?.data ?? []
  const total = data?.pagination.total ?? 0
  usePageBounds(page, data?.pagination.total, limit, setPage)

  const handleToggle = async (b: AdminBusiness) => {
    if (!confirm(`${b.is_active ? 'Nonaktifkan' : 'Aktifkan'} bisnis "${b.business_name}"?`)) return
    setToggling(b.id)
    try {
      await toggleBusinessActive(b.id)
      await load()
    } catch (err) {
      console.error(err)
    } finally {
      setToggling(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteBusiness(deleteTarget.id)
    setDeleteTarget(null)
    load()
  }

  return (
    <div className="space-y-4">
      <DetailModal kind="business" onChanged={load} />
      <DeleteConfirmModal
        open={!!deleteTarget}
        businessName={deleteTarget?.business_name ?? ''}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Bisnis</h2>
          <p className="text-sm text-slate-500 mt-0.5">{loading ? 'Memuat daftar bisnis…' : error ? 'Daftar bisnis gagal dimuat' : `${total.toLocaleString('id-ID')} bisnis sesuai filter`}</p>
        </div>
      </div>

      {error && <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><span>{error}</span><button type="button" onClick={load} disabled={loading} className="font-semibold underline disabled:opacity-50">Coba lagi</button></div>}

      {/* Filters */}
      <FilterBar
        search={
          <SearchField
            label="Cari bisnis"
            placeholder="Cari nama bisnis, pemilik, nama/email pengguna…"
            value={search}
            onSearch={search => setFilters({ search })}
          />
        }
        controls={<>
          <Select
            aria-label="Status bisnis"
            value={status}
            onChange={e => setFilters({ status: e.target.value })}
            className={filterControl}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
          <Select
            aria-label="Urutkan bisnis"
            value={sort}
            onChange={e => setFilters({ sort: e.target.value })}
            className={filterControl}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
          </>
        }
      />

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Bisnis</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Pemilik</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Tipe</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Membership</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Akses bisnis</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Daftar</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">Memuat data...</td>
                </tr>
              ) : error || businesses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">{error ? 'Daftar bisnis belum berhasil dimuat.' : 'Tidak ada bisnis sesuai filter.'}</td>
                </tr>
              ) : (
                businesses.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {b.image ? (
                          <img src={b.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xs">
                            {b.business_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <DetailLink kind="business" id={b.id} className="font-medium text-indigo-600 hover:underline">{b.business_name}</DetailLink>
                          <p className="text-xs text-slate-400">{b.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-700">{b.owner_name}</p>
                      {/* Email ikut ditampilkan sejak pencarian bisa memakainya:
                          hasil yang cocok lewat email tetapi tidak menunjukkan
                          email mana pun membuat admin menebak kenapa baris ini
                          muncul. */}
                      {b.owner?.email && (
                        <p className="text-xs text-slate-500 break-all">{b.owner.email}</p>
                      )}
                      {/* Satu nomor kontak pemilik: WhatsApp (nomor HP akun lama
                          sudah digabung ke sini oleh server). */}
                      {b.owner?.whatsapp_number && (
                        <a href={`https://wa.me/${b.owner.whatsapp_number}`} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-emerald-600 hover:underline">WA {b.owner.whatsapp_number}</a>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {b.business_type?.name ?? '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {membershipBadge(b.membership)}
                        {b.membership && b.membership.type !== 'free' && b.membership.is_active && new Date(b.membership.end_date) > new Date() && b.membership.days_remaining > 0 && (
                          <span className="text-xs text-slate-400">
                            {`${b.membership.days_remaining} hari lagi`}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={b.is_active ? 'success' : 'danger'}>
                        {b.is_active ? 'Diaktifkan' : 'Dinonaktifkan'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {formatDate(b.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <DetailLink
                          kind="business" id={b.id}
                          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                        >
                          Detail
                        </DetailLink>
                        <button
                          onClick={() => handleToggle(b)}
                          disabled={toggling === b.id}
                          className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                            b.is_active
                              ? 'bg-red-100 hover:bg-red-200 text-red-700'
                              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                          } disabled:opacity-50`}
                        >
                          {toggling === b.id ? '...' : b.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(b)}
                          className="px-3 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && !error && (
          <div className="px-4 py-3 border-t border-slate-100">
            <Pagination page={page} total={total} limit={limit} onChange={setPage} />
          </div>
        )}
      </div>
    </div>
  )
}
