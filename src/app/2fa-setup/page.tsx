import dynamic from 'next/dynamic'

const TwoFactorPage = dynamic(() => import('./TwoFactor'), { ssr: false })

export default function Page() {
  return <TwoFactorPage />
}
