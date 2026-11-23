import { X } from 'lucide-react'
import { useId, useLayoutEffect, useRef } from 'react'

interface ModalProps {
  title: string
  open: boolean
  onClose: () => void
  children: React.ReactNode
  wide?: boolean
}

export default function Modal({ title, open, onClose, children, wide }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const label = useId()
  useLayoutEffect(() => {
    const dialog = ref.current
    if (!open || !dialog) return
    dialog.showModal()
    return () => dialog.close()
  }, [open])

  if (!open) return null

  return (
    <dialog ref={ref} aria-labelledby={label}
      onCancel={e => { e.preventDefault(); e.stopPropagation(); onClose() }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      className={`fixed inset-0 mx-auto mt-auto mb-0 sm:my-auto max-h-none w-full overflow-visible rounded-t-2xl sm:rounded-xl bg-white text-slate-800 shadow-xl backdrop:bg-black/45 sm:w-[calc(100%-2rem)] ${wide ? 'max-w-5xl' : 'max-w-lg'}`}>
      <div className="flex max-h-[92dvh] flex-col p-4 sm:p-6">
        <div className="flex shrink-0 items-center justify-between gap-3 pb-4">
          <h2 id={label} className="text-base font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Tutup" className="-m-1.5 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"><X size={18} aria-hidden /></button>
        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </dialog>
  )
}
