import dynamic from 'next/dynamic'

const UserProfile = dynamic(() => import('./UserProfile'), { ssr: false })

export default function Page() {
  return <UserProfile />
}
