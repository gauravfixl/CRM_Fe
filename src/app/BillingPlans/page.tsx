import dynamic from 'next/dynamic'

// Dynamically import your client-only component
const BillingPlan = dynamic(() => import('./Billing'), { ssr: false })

export default BillingPlan
