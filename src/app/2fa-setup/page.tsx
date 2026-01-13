import dynamic from 'next/dynamic'

// Dynamically import your client-only component
const TwoFactorPage = dynamic(() => import('./TwoFactor'), { ssr: false })

export default TwoFactorPage
