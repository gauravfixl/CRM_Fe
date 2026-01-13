import dynamic from 'next/dynamic'

// Dynamically import your client-only component
const forgotPass = dynamic(() => import('./ForgotPass'), { ssr: false })

export default forgotPass
