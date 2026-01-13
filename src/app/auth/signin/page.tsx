import dynamic from 'next/dynamic'

// Dynamically import your client-only component
const Signin = dynamic(() => import('./Signin'), { ssr: false })

export default Signin
