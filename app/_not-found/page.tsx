// app/_not-found/page.tsx
import dynamic from 'next/dynamic'

const ClientNotFound = dynamic(() => import('./Notfound'), { ssr: false })

export default ClientNotFound
