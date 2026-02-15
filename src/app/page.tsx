import { redirect } from 'next/navigation'
// Disable static prerendering
export const dynamic = 'force-dynamic'
export default function HomePage() {
  redirect('/Fixl/dashboard')
}
