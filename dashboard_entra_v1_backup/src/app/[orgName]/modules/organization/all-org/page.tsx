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

      <div className="bg-zinc-50/50 p-3 md:p-4 z-10 rounded-xl shadow-sm min-h-[70vh] mt-4">
        <div className="flex flex-col 3xl:flex-row w-full gap-6 items-start">
          <div className="flex-1 bg-white rounded-lg shadow-sm p-4 overflow-hidden flex flex-col min-w-0 w-full">
            <div className="p-2 border-b mb-4">
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <CustomInput
                  placeholder="Search organizations..."
                  className="pl-10 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <ScrollArea className="flex-1 h-[60vh]">
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
                {filteredOrgs.map((org) => (
                  <SmallCard
                    key={org.orgId}
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedOrg?.orgId === org.orgId ? "border-primary bg-primary/5" : ""}`}
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
                          <Badge variant="secondary" className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 border-0"><Shield className="h-3 w-3 mr-1" />Active</Badge>
                        )}
                        <CustomButton variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleViewOrg(org.orgName, org.orgId); }}><Eye className="h-4 w-4" /></CustomButton>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
                      <div className="flex items-center gap-1 text-muted-foreground truncate"><Mail className="h-3 w-3" /><span>{org.orgEmail}</span></div>
                      <div className="flex items-center gap-1 text-muted-foreground truncate"><Phone className="h-3 w-3" /><span>{org.orgPhone}</span></div>
                      <div className="flex items-center gap-1 text-muted-foreground"><Activity className="h-3 w-3" /><span>Joined {new Date(org.joinedAt).toLocaleDateString()}</span></div>
                      <div className="flex items-center gap-1 text-muted-foreground"><User2 className="h-3 w-3" /><span>{org.employeeId}</span></div>
                    </div>
                  </SmallCard>
                ))}
              </div>
            </ScrollArea>
          </div>

          {selectedOrg && (
            <FlatCard className="org-details-panel w-full 3xl:w-[350px] flex-shrink-0 sticky top-4 mb-4">
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
              <ScrollArea className="flex-1 p-4">
                <div className="text-center space-y-2 mb-6">
                  {selectedOrg?.newOrgLogo?.url ? (
                    <img src={selectedOrg.newOrgLogo.url} alt={selectedOrg?.name} className="h-16 w-16 mx-auto rounded-xl object-cover shadow-sm border" />
                  ) : (
                    <div className="h-16 w-16 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-sm">
                      {selectedOrg?.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                  )}
                  <p className="text-lg font-bold break-words">{selectedOrg.name}</p>
                  {selectedOrg.orgActive && <Badge className="bg-green-100 text-green-700 border-0">Active</Badge>}
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Admin Information</p>
                    <div className="flex items-center gap-3 bg-zinc-50 p-2 rounded-lg border">
                      <Avatar className="h-8 w-8 border shadow-sm shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">{selectedOrg.contactName.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate">{selectedOrg.contactName}</p>
                        <p className="text-[11px] text-muted-foreground break-all">{selectedOrg.contactEmail}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{selectedOrg.contactPhone}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <CustomButton className="w-full text-xs h-9" onClick={() => { }}>
                      <Key className="h-4 w-4 mr-2" />
                      Request Access
                    </CustomButton>
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
