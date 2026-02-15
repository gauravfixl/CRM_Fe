"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { CustomButton } from "@/components/custom/CustomButton"
import { Send, Building2, Users, Package, Mail, Phone, MapPin } from "lucide-react"
import SendInviteModal from "@/components/sendInviteModal"
import { getOrgById } from "@/hooks/orgHooks"
import { useLoaderStore } from "@/lib/loaderStore"
import { Permission } from "@/components/custom/Permission"
import SubHeader from "@/components/custom/SubHeader"

export default function OrganizationProfilePage() {
  const params = useParams()
  const orgName = (params?.orgName as string) || ""
  const orgId = (params?.id as string) || ""

  const { showLoader, hideLoader } = useLoaderStore()
  const [orgData, setOrgData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [openInviteModal, setOpenInviteModal] = useState(false)

  useEffect(() => {
    if (!orgId) return

    const fetchOrg = async () => {
      showLoader()
      setError(null)
      try {
        const res = await getOrgById(orgId)
        const singleOrg = res?.data?.organization
        if (!singleOrg) throw new Error("Organization data not found in response")

        setOrgData({
          id: singleOrg.orgId,
          name: singleOrg.orgName,
          logo: singleOrg.logo || null,
          contactName: singleOrg.contactName,
          contactEmail: singleOrg.contactEmail,
          contactPhone: singleOrg.contactPhone,
          address: singleOrg.address,
          city: singleOrg.city,
          state: singleOrg.state,
          country: singleOrg.country,
          totalUsers: singleOrg.totalUsers || 0,
          totalModules: singleOrg.totalModules || 0,
        })
      } catch (err: any) {
        console.error("Error fetching org:", err)
        setError(err.response?.data?.message || "Failed to fetch organization")
      } finally {
        hideLoader()
      }
    }

    fetchOrg()
  }, [orgId, showLoader, hideLoader])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-destructive text-sm font-medium">{error}</div>
      </div>
    )
  }

  if (!orgData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Organization not found</div>
      </div>
    )
  }

  return (
    <>
      {/* SubHeader with breadcrumbs and Send Invitation button */}
      <SubHeader
        title={orgData.name}
        breadcrumbItems={[
          { label: "All Organizations", href: `/${orgName}/modules/organization/all-org` },
          { label: `${decodeURIComponent(orgName)} - Detail`, href: `/${orgId}/crm` },
        ]}
        rightControls={
          <Permission module="organization" action="SEND_INVITATION">
            <CustomButton
              variant="outline"
              size="sm"
              className="flex gap-2 items-center text-xs h-8 px-3"
              onClick={() => setOpenInviteModal(true)}
            >
              <Send className="w-3 h-3" />
              Send Invitation
            </CustomButton>
          </Permission>
        }
      />

      <div className="min-h-screen bg-background -mt-12 z-10  shadow-md">
        <Permission module="organization" action="VIEW_ONLY">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Organization Overview */}
                <div className="bg-card border border-border ">
                  <div className="px-4 py-3 border-b border-border bg-primary">
                    <h2 className="text-sm font-medium text-white">Overview</h2>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Building2 className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-xs text-muted-foreground">Organization Name</div>
                        <div className="text-sm font-medium text-foreground">{orgData.name}</div>
                      </div>
                    </div>

                    {orgData.contactName && (
                      <div className="flex items-start gap-3">
                        <Users className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-xs text-muted-foreground">Contact Person</div>
                          <div className="text-xs text-foreground">{orgData.contactName}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-card border border-border ">
                  <div className="px-4 py-3 border-b border-border bg-primary">
                    <h2 className="text-xs font-medium text-white">Contact Information</h2>
                  </div>
                  <div className="p-4 space-y-3">
                    {orgData.contactEmail && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-xs text-muted-foreground">Email</div>
                          <div className="text-xs text-foreground">{orgData.contactEmail}</div>
                        </div>
                      </div>
                    )}

                    {orgData.contactPhone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-xs text-muted-foreground">Phone</div>
                          <div className="text-xs text-foreground">{orgData.contactPhone}</div>
                        </div>
                      </div>
                    )}

                    {(orgData.address || orgData.city || orgData.state || orgData.country) && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-xs text-muted-foreground">Address</div>
                          <div className="text-xs text-foreground">
                            {[orgData.address, orgData.city, orgData.state, orgData.country].filter(Boolean).join(", ") || "N/A"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Statistics */}
              <div className="space-y-6">
                <div className="bg-card border border-border ">
                  <div className="px-4 py-3 border-b border-border bg-primary">
                    <h2 className="text-xs font-medium text-white">Statistics</h2>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Total Users</span>
                      </div>
                      <span className="text-xs font-semibold text-foreground">{orgData.totalUsers}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Total Modules</span>
                      </div>
                      <span className="text-xs font-semibold text-foreground">{orgData.totalModules}</span>
                    </div>
                  </div>
                </div>

                {/* Organization ID */}
                <div className="bg-card border border-border ">
                  <div className="px-4 py-3 border-b border-border bg-primary">
                    <h2 className="text-xs font-medium text-white">Details</h2>
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-muted-foreground">Organization ID</div>
                    <div className=" font-mono text-foreground mt-1 bg-muted px-2 py-1 rounded text-xs">
                      {orgData.id}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Permission>
      </div>

      <SendInviteModal open={openInviteModal} onClose={() => setOpenInviteModal(false)} />
    </>
  )
}
