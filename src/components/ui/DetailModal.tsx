import { lazy, Suspense } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Modal from './Modal'
import type { DetailKind } from './DetailLink'

const contents = {
  business: lazy(() => import('../../pages/BusinessDetailPage')),
  agent: lazy(() => import('../../pages/SalesAgentDetailPage')),
  post: lazy(() => import('../../pages/SocialPostPage')),
}
const titles = { business: 'Detail bisnis', agent: 'Detail sales', post: 'Detail posting' }

export interface DetailProps {
  recordId?: string
  onDismiss?: () => void
  onChanged?: () => void
}

export default function DetailModal({ kind, onChanged }: { kind: DetailKind; onChanged?: () => void }) {
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const id = params.get(kind)
  if (!id) return null
  const close = () => {
    if (location.state?.openedDetail === kind) navigate(-1)
    else {
      const next = new URLSearchParams(params)
      next.delete(kind)
      setParams(next, { replace: true })
    }
  }
  const Content = contents[kind]
  return <Modal wide title={titles[kind]} open onClose={close}>
    <Suspense fallback={<p className="p-6 text-sm text-slate-500">Memuat detail…</p>}>
      {/^[\w-]+$/.test(id)
        ? <Content key={id} recordId={id} onDismiss={close} onChanged={onChanged} />
        : <p role="alert" className="text-sm text-red-700">ID detail tidak valid.</p>}
    </Suspense>
  </Modal>
}
