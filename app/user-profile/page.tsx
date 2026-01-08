import dynamic from 'next/dynamic'

// Dynamically import your client-only component
const UserProfile = dynamic(() => import('./UserProfile'), { ssr: false })

export default UserProfile
