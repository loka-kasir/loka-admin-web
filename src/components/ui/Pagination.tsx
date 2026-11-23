import { ChevronLeft, ChevronRight } from 'lucide-react'
import { lastPage, pageWindow } from '../../lib/pagination'
interface PaginationProps {
  page: number
  total: number
  limit: number
  onChange: (page: number) => void
}

export default function Pagination({ page, total, limit, onChange }: PaginationProps) {
  const totalPages = lastPage(total, limit)
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Navigasi halaman" className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
      <span>
        Menampilkan {(page - 1) * limit + 1}–{Math.min(page * limit, total)} dari {total} data
      </span>
      <div className="flex max-w-full flex-wrap items-center gap-1">
        <button
          type="button" disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="px-3 py-1.5 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft size={16} aria-hidden />
        </button>
        {pageWindow(page, totalPages).map(p => {
          if (typeof p === 'string') return <span key={p} aria-hidden className="px-1 text-slate-400">…</span>
          return (
            <button
              key={p}
              type="button"
              aria-label={`Halaman ${p}`}
              aria-current={p === page ? 'page' : undefined}
              disabled={p === page}
              onClick={() => onChange(p)}
              className={`px-3 py-1.5 rounded border text-sm ${
                p === page
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-slate-200 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          )
        })}
        <button
          type="button" disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="px-3 py-1.5 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Halaman berikutnya"
        >
          <ChevronRight size={16} aria-hidden />
        </button>
      </div>
    </nav>
  )
}
