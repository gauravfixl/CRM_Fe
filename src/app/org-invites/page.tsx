import dynamic from 'next/dynamic'

const InvitationsPage = dynamic(() => import('./InvitationsPage'), { ssr: false })

export default function Page() {
  return <InvitationsPage />
}
