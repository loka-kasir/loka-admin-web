import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'
import ButtonIcon from '../../components/ui/ButtonIcon'
import { useState } from 'react'

/** Pesan kegagalan dari server, bukan "Coba lagi" generik.
 *
 *  Ini alat internal: saat penghapusan ditolak (mis. constraint database yang
 *  belum ditangani), admin harus bisa membacanya langsung di layar, bukan harus
 *  membuka DevTools untuk melihat body respons. */
function deleteErrorMessage(err: unknown): string {
  const data = (err as { response?: { data?: { message?: string; error?: { details?: string } } } })
    .response?.data
  if (!data?.message) return 'Gagal menghapus. Coba lagi.'
  const details = data.error?.details
  return details ? `${data.message} — ${details}` : data.message
}

interface DeleteConfirmModalProps {
  open: boolean
  businessName: string
  onClose: () => void
  onConfirm: () => Promise<void>
}

export default function DeleteConfirmModal({ open, businessName, onClose, onConfirm }: DeleteConfirmModalProps) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleClose = () => {
    if (loading) return
    setInput('')
    setError('')
    onClose()
  }

  const handleConfirm = async () => {
    if (input !== businessName) {
      setError('Nama bisnis tidak sesuai')
      return
    }
    setLoading(true)
    setError('')
    try {
      await onConfirm()
      setInput('')
      setError('')
    } catch (err) {
      setError(deleteErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <Modal title="Hapus Bisnis" open={open} onClose={handleClose}>
        <p className="text-xs text-slate-500 mb-4">Tindakan ini tidak bisa dibatalkan</p>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 space-y-1">
          <p className="text-sm font-semibold text-red-700"><ButtonIcon icon={AlertTriangle} />Data berikut akan terhapus permanen:</p>
          <ul className="text-xs text-red-600 space-y-0.5 mt-1 ml-1">
            <li>• Akun pemilik & semua karyawan</li>
            <li>• Data bisnis & semua outlet</li>
            <li>• Produk, transaksi, laporan</li>
            <li>• Membership & riwayat pembayaran</li>
          </ul>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-slate-600 mb-2">
            Ketik <span className="font-bold text-slate-800">"{businessName}"</span> untuk konfirmasi:
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError('') }}
            placeholder={businessName}
            autoFocus
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        <div className="flex gap-3">
          <button onClick={handleClose} disabled={loading}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50">
            Batal
          </button>
          <button onClick={handleConfirm} disabled={loading || input !== businessName}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors">
            {loading ? 'Menghapus...' : 'Hapus Permanen'}
          </button>
        </div>
    </Modal>
  )
}
