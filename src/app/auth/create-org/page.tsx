import dynamic from 'next/dynamic'

const CreateOrg = dynamic(() => import('./CreateOrg'), { ssr: false })

export default function Page() {
  return <CreateOrg />
}
