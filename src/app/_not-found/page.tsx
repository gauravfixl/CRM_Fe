import dynamic from 'next/dynamic'

const ClientNotFound = dynamic(() => import('./Notfound'), { ssr: false })

export default function Page() {
  return <ClientNotFound />
}
