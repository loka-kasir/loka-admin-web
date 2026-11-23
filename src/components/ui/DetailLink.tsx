import { Link, useLocation, type LinkProps } from 'react-router-dom'

export type DetailKind = 'business' | 'agent' | 'post'

export default function DetailLink({ kind, id, ...props }: Omit<LinkProps, 'to' | 'state' | 'id'> & { kind: DetailKind; id: string }) {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  params.set(kind, id)
  return <Link {...props} to={{ pathname: location.pathname, search: params.toString() }} state={{ openedDetail: kind }} aria-haspopup="dialog" />
}
