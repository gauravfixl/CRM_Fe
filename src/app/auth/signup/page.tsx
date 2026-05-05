import dynamic from 'next/dynamic'

const Signup = dynamic(() => import('./Signup'), { ssr: false })

export default function Page() {
  return <Signup />
}
