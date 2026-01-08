"use client"

import { useState, useEffect } from "react"
import { Shield, Mail, Phone, Activity, LogIn, Eye, MoreHorizontal, Search, User2, Key } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomDropdownMenu, CustomDropdownMenuContent, CustomDropdownMenuItem, CustomDropdownMenuTrigger } from "@/components/custom/CustomDropdownMenu"
import { CustomInput } from "@/components/custom/CustomInput"
import { CustomSelect, CustomSelectContent, CustomSelectItem, CustomSelectTrigger, CustomSelectValue } from "@/components/custom/CustomSelect"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLoaderStore } from "@/lib/loaderStore"
import { getAllOrg, switchOrganization, getOrgById } from "@/hooks/orgHooks"
import { jwtDecode } from "jwt-decode"
import { useRouter } from "next/navigation"
import { SmallCard } from "@/components/custom/SmallCard"
import SubHeader from "@/components/custom/SubHeader"
import { FlatCard } from "@/components/custom/FlatCard"

export default function OrganizationsPage() {
  const router = useRouter()
  const [organizations, setOrganizations] = useState<any[]>([])
  const [selectedOrg, setSelectedOrg] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const { showLoader, hideLoader } = useLoaderStore()

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        showLoader()
        const res = await getAllOrg()
        setOrganizations(res.data?.data || [])
      } catch (err) {
        console.error("Error fetching organizations:", err)
      } finally {
        hideLoader()
      }
    }
    fetchOrgs()
  }, [showLoader, hideLoader])

  const handleSwitchOrg = async (orgId: string) => {
    try {
      showLoader()
      const res = await switchOrganization(orgId)
      const token = res?.token
      if (!token) throw new Error("No token returned")
      const decodedToken: any = jwtDecode(token)
      localStorage.setItem("orgToken", res?.token)
      const newOrgId = decodedToken?.orgId
      const orgRes = await getOrgById(newOrgId)
      const orgData = orgRes?.data?.organization
      if (orgData) setSelectedOrg(orgData)
      localStorage.setItem("orgName", orgData.name)
      router.push(`/${orgData.name}/modules/organization/all-org`)
    } catch (err) {
      console.error("Error switching org:", err)
    } finally {
      hideLoader()
    }
  }

  const handleViewOrg = (orgName: string, orgId: string) => {
    router.push(`/${orgName}/modules/organization/${orgId}`)
  }

  const filteredOrgs = organizations.filter(org =>
    org.orgName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.orgEmail.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <SubHeader
        title="Organizations"
        breadcrumbItems={[{ label: "Home", href: "/" }, { label: "Organizations", href: "/orgs" }]}
        rightControls={
          <>
            <CustomSelect value={selectedOrg?.orgId || ""} onValueChange={handleSwitchOrg}>
              <CustomSelectTrigger className="w-48">
                <CustomSelectValue placeholder="Select Organization" />
              </CustomSelectTrigger>
              <CustomSelectContent>
                {organizations.map((org) => (
                  <CustomSelectItem key={org.orgId} value={org.orgId}>{org.orgName}</CustomSelectItem>
                ))}
              </CustomSelectContent>
            </CustomSelect>
            <CustomButton variant="outline" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
              {viewMode === "grid" ? "List View" : "Grid View"}
            </CustomButton>
          </>
        }
      />

      <div className="flex h-[65vh] bg-white -mt-14 z-10">
        <div className="flex flex-col lg:flex-row w-full">
          <div className="flex-1 border-r border-white">
            <div className="p-2 border-b border-white">
              <div className="relative">
                <CustomInput
                  placeholder="Search organizations..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <ScrollArea className="flex-1 h-[60vh] p-2">
              <div className={viewMode === "grid" ? "grid grid-cols-1 xl:grid-cols-2 gap-4" : "space-y-4"}>
                {filteredOrgs.map((org) => (
                  <SmallCard
                    key={org.orgId}
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedOrg?.orgId === org.orgId ? "bg-[hsl(var(--primary-50))]" : ""}`}
                    onClick={() => handleSwitchOrg(org.orgId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {org.logo ? (
                          <img src={org.logo} alt={org.orgName} className="h-8 w-8 rounded-md object-cover" />
                        ) : (
                          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                            {org.orgName?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{org.orgName}</p>
                          <p className="text-xs text-gray-500 truncate">{org.orgContact || "No Contact"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {org.orgActive && (
                          <Badge className="bg-[hsl(var(--primary-50))] text-[hsl(var(--primary-600))] text-xs px-2 py-0.5"><Shield className="h-3 w-3 mr-1" />Active</Badge>
                        )}
                        <CustomButton variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleViewOrg(org.orgName, org.orgId); }}><Eye className="h-4 w-4" /></CustomButton>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <div className="flex items-center gap-1"><Mail className="h-3 w-3 text-gray-400" /><span className="truncate">{org.orgEmail}</span></div>
                      <div className="flex items-center gap-1"><Phone className="h-3 w-3 text-gray-400" /><span className="truncate">{org.orgPhone}</span></div>
                      <div className="flex items-center gap-1"><Activity className="h-3 w-3 text-gray-400" /><span>Joined {new Date(org.joinedAt).toLocaleDateString()}</span></div>
                      <div className="flex items-center gap-1"><User2 className="h-3 w-3 text-gray-400" /><span>{org.employeeId}</span></div>
                    </div>
                  </SmallCard>
                ))}
              </div>
            </ScrollArea>
          </div>

          {selectedOrg && (
            <FlatCard className="org-details-panel w-full lg:w-1/3">
              <div className="flex items-center justify-between px-3 py-2 border-b">
                <p className="text-sm font-semibold">Organization Details</p>
                <CustomDropdownMenu>
                  <CustomDropdownMenuTrigger asChild><CustomButton variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></CustomButton></CustomDropdownMenuTrigger>
                  <CustomDropdownMenuContent align="end">
                    <CustomDropdownMenuItem>Full Profile</CustomDropdownMenuItem>
                    <CustomDropdownMenuItem>Contact Admin</CustomDropdownMenuItem>
                  </CustomDropdownMenuContent>
                </CustomDropdownMenu>
              </div>
              <ScrollArea className="flex-1 p-3">
                <div className="text-center space-y-2 mb-4">
                  {selectedOrg?.newOrgLogo?.url ? (
                    <img src={selectedOrg.newOrgLogo.url} alt={selectedOrg?.name} className="h-12 w-12 mx-auto rounded-md object-cover" />
                  ) : (
                    <div className="h-12 w-12 mx-auto rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {selectedOrg?.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                  )}
                  <p className="text-sm font-semibold">{selectedOrg.name}</p>
                  {selectedOrg.orgActive && <Badge className="bg-[#D8DDFA] text-[#3A57E8] text-xs">Active</Badge>}
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium mb-2">Admin Information</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-8 w-8"><AvatarFallback>{selectedOrg.contactName.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback></Avatar>
                      <div className="min-w-0 flex-1"><p className="text-xs font-medium truncate">{selectedOrg.contactName}</p></div>
                    </div>
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-1"><Mail className="h-3 w-3" />{selectedOrg.contactEmail}</div>
                      <div className="flex items-center gap-1"><Phone className="h-3 w-3" />{selectedOrg.contactPhone}</div>
                    </div>
                  </div>
                  <div className="space-y-2 pt-4 border-t">
                    <CustomButton className="w-full bg-blue-600 text-xs" onClick={() => { }}><Key className="h-3 w-3 mr-1" />Request Access</CustomButton>
                  </div>
                </div>
              </ScrollArea>
            </FlatCard>
          )}
        </div>
      </div>
    </>
  )
}
