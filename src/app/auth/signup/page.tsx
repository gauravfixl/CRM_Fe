import dynamic from 'next/dynamic'

// Dynamically import your client-only component
const Signup = dynamic(() => import('./Signup'), { ssr: false })

export default Signup
