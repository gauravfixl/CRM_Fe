import dynamic from 'next/dynamic'

// Dynamically import your client-only component
const createOrg = dynamic(() => import('./CreateOrg'), { ssr: false })

export default createOrg
