export function parsePage(raw: string | null) {
  const n = Number(raw)
  return Number.isSafeInteger(n) && n > 0 ? n : 1
}

export function lastPage(total: number, limit: number) {
  return Math.max(1, Math.ceil(total / limit))
}

/** Selalu sertakan awal, akhir, dan tetangga halaman aktif. */
export function pageWindow(page: number, last: number): (number | string)[] {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1)
  if (page <= 4) return [1, 2, 3, 4, 5, 'kanan', last]
  if (page >= last - 3) return [1, 'kiri', last - 4, last - 3, last - 2, last - 1, last]
  return [1, 'kiri', page - 1, page, page + 1, 'kanan', last]
}
