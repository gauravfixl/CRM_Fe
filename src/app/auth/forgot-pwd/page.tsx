import dynamic from 'next/dynamic'

const ForgotPass = dynamic(() => import('./ForgotPass'), { ssr: false })

export default function Page() {
  return <ForgotPass />
}
