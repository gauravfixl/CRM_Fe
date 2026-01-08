// 'use client'

// import { useEffect, useState } from 'react'
// import { Eye } from 'lucide-react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { SubHeader } from '@/components/sub-header'

// interface Invitation {
//   _id: string
//   email: string
//   role: string
//   status: string
//   invitedBy: string
//   createdAt: string
//   expiresAt: string | null
// }

// export default function InvitationsPage() {
//   const [invitations, setInvitations] = useState<Invitation[]>([])

//   useEffect(() => {
//     // Simulate API call
//     const fetchInvites = async () => {
//       // Replace this with your actual API call
//       const data = await Promise.resolve({
//         invitations: [
//           {
//             _id: '68885769e367b6b6e4c3617f',
//             email: 'poojafixl@gmail.com',
//             role: 'Manager',
//             status: 'expired',
//             invitedBy: '688855dbe367b6b6e4c36076',
//             createdAt: '2025-07-29T05:08:57.364Z',
//             expiresAt: '2025-07-29T06:08:57.363Z',
//           },
//           {
//             _id: '6888702be367b6b6e4c36a30',
//             email: 'poojafixl@gmail.com',
//             role: 'User',
//             status: 'accepted',
//             invitedBy: '688855dbe367b6b6e4c36076',
//             createdAt: '2025-07-29T06:54:35.504Z',
//             expiresAt: null,
//           },
//           // ... add all entries from your JSON if needed
//         ],
//       })
//       setInvitations(data.invitations)
//     }

//     fetchInvites()
//   }, [])

//   return (
//     <div className="min-h-screen">
//       <SubHeader title="Invitations" />

//       <div className="p-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>All Invitations</CardTitle>
//           </CardHeader>
//           <CardContent className="p-0">
//             <table className="w-full border-collapse text-sm text-left">
//               <thead className=" text-blue-900">
//                 <tr>
//                   <th className="px-4 py-3 border-b">Email</th>
//                   <th className="px-4 py-3 border-b">Role</th>
//                   <th className="px-4 py-3 border-b">Status</th>
//                   <th className="px-4 py-3 border-b">Invited By</th>
//                   <th className="px-4 py-3 border-b">Created At</th>
//                   <th className="px-4 py-3 border-b">Expires At</th>
//                   <th className="px-4 py-3 border-b">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {invitations.map((invite) => (
//                   <tr key={invite._id}>
//                     <td className="px-4 py-3 border-b">{invite.email}</td>
//                     <td className="px-4 py-3 border-b">{invite.role}</td>
//                     <td className="px-4 py-3 border-b capitalize">{invite.status}</td>
//                     <td className="px-4 py-3 border-b">{invite.invitedBy}</td>
//                     <td className="px-4 py-3 border-b">
//                       {new Date(invite.createdAt).toLocaleString()}
//                     </td>
//                     <td className="px-4 py-3 border-b">
//                       {invite.expiresAt
//                         ? new Date(invite.expiresAt).toLocaleString()
//                         : '—'}
//                     </td>
//                     <td className="px-4 py-3 border-b">
//                       <Button variant="ghost" size="icon">
//                         <Eye size={18} className="text-blue-600" />
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
import dynamic from 'next/dynamic'

// Dynamically import your client-only component
const InvitationsPage = dynamic(() => import('./InvitationsPage'), { ssr: false })

export default InvitationsPage
