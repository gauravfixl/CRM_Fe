'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import SubHeader from '@/components/custom/SubHeader'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import SendInviteModal from '@/components/sendInviteModal'
import { getOrgById } from '@/hooks/orgHooks'
import { Permission } from "@/components/custom/Permission"

interface OrganizationProfilePageProps {
  orgId?: string;
}

export default function OrganizationProfilePage({ orgId }: OrganizationProfilePageProps) {
  const params = useParams()
  // Handle params.id which can be string | string[] | undefined
  const paramId = params?.id
  const activeOrgId = orgId || (Array.isArray(paramId) ? paramId[0] : paramId) || ''

  const [orgData, setOrgData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openInviteModal, setOpenInviteModal] = useState(false)

  useEffect(() => {
    if (!activeOrgId) {
      setLoading(false)
      return
    }

    const fetchOrg = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await getOrgById(activeOrgId)
        const singleOrg = res?.data?.organization

        if (!singleOrg) {
          throw new Error('Organization data not found in response')
        }

        const modules = singleOrg?.modules?.length
        const users = singleOrg?.users?.length

        setOrgData({
          id: singleOrg.id,
          name: singleOrg.name,
          logo: singleOrg.OrgLogo?.url || null,
          contactName: singleOrg.contactName,
          contactEmail: singleOrg.contactEmail,
          contactPhone: singleOrg.contactPhone,
          address: singleOrg.address,
          city: singleOrg.orgCity,
          state: singleOrg.orgState,
          country: singleOrg.orgCountry,
          totalUsers: users,
          totalModules: modules,
        })
      } catch (err: any) {
        console.error('Error fetching org:', err)
        setError(err.response?.data?.message || 'Failed to fetch organization')
      } finally {
        setLoading(false)
      }
    }

    fetchOrg()
  }, [activeOrgId])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
  if (!orgData) return <div className="min-h-screen flex items-center justify-center text-gray-600">Organization not found.</div>

  return (
    <div className="min-h-screen">
      <SubHeader
        title="Organization Profile"
        rightControls={
          <Permission module="organization" action="SEND_INVITATION">
            <Button
              variant="outline"
              className="flex gap-2 items-center"
              onClick={() => {
                setOpenInviteModal(true)
              }}
            >
              Send Invitation
              <Send size={16} />
            </Button>
          </Permission>
        }
      />

      <div className="px-6 pt-6 space-y-6 h-[50vh] overflow-y-auto">
        <div className="border p-4 rounded-md shadow-sm">
          <p className="text-lg font-medium">
            Organization: <span className="font-semibold">{orgData.name}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="bg-primary rounded-t-md text-white">
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-sm space-y-2">
              <p><strong>Email:</strong> {orgData.contactEmail || 'N/A'}</p>
              <p><strong>Name:</strong> {orgData.name}</p>
              <p><strong>Address:</strong> {orgData.address || 'N/A'}</p>
              <p><strong>Phone:</strong> {orgData.contactPhone || 'N/A'}</p>
              <p><strong>City:</strong> {orgData.city || 'N/A'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-primary rounded-t-md text-white">
              <CardTitle className="text-base">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-sm space-y-2">
              <p><strong>Total Users:</strong> {orgData.totalUsers}</p>
              <p><strong>Total Modules:</strong> {orgData.totalModules}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <SendInviteModal
        open={openInviteModal}
        onClose={() => {
          setOpenInviteModal(false)
        }}
      />
    </div>
  )
}
