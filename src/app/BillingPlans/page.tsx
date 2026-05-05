import dynamic from 'next/dynamic'

const BillingPlan = dynamic(() => import('./Billing'), { ssr: false })

export default function BillingPlansPage() {
  return <BillingPlan />
}
