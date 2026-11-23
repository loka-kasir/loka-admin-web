import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { lastPage, parsePage } from '../lib/pagination'

export function useListQuery() {
  const [params, setParams] = useSearchParams()
  const page = parsePage(params.get('page'))
  const update = (patch: Record<string, string>, next: number) => {
    const query = new URLSearchParams(params)
    for (const [key, value] of Object.entries(patch)) {
      if (value) query.set(key, value)
      else query.delete(key)
    }
    if (next > 1) query.set('page', String(next))
    else query.delete('page')
    if (query.toString() !== params.toString()) setParams(query, { replace: true })
  }
  return {
    params, page,
    setFilters: (patch: Record<string, string>) => update(patch, 1),
    setPage: (next: number) => update({}, next),
  }
}

/** Gunakan total dari respons filter saat ini, bukan total lama saat memuat. */
export function usePageBounds(page: number, total: number | undefined, limit: number, setPage: (page: number) => void) {
  useEffect(() => {
    if (total !== undefined && page > lastPage(total, limit)) setPage(lastPage(total, limit))
  }, [page, total, limit, setPage])
}
