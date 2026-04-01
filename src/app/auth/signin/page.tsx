import dynamic from 'next/dynamic'

const Signin = dynamic(() => import('./Signin'), { ssr: false })

export default function Page() {
  return <Signin />
}
