"use client"

import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Home,
  Users,
  Cog,
  Target,
  FolderKanban,
  FileText,
  DollarSign,
  SquarePlus,
  LayoutDashboard
} from "lucide-react"
import { getAllOrg, switchOrganization } from "@/hooks/orgHooks"
import { useModule } from "@/app/context/ModuleContext"
import { useAuthStore } from "@/lib/useAuthStore"
import { showSuccess, showError } from "@/utils/toast"
import { jwtDecode } from "jwt-decode"

// STATIC DATA OUTSIDE COMPONENT
const DEFAULT_MODULES = ["dashboard", "lead", "hrms"]

const MODULES_MAP: Record<string, { label: string; url: string; icon: React.ReactNode }> = {
  dashboard: { label: "Dashboard", url: "/dashboard", icon: <Home size={18} /> },
  lead: { label: "Lead Management", url: "/lead-management", icon: <Users size={18} /> },
  invoice: { label: "Invoices", url: "/modules/invoice/all", icon: <FileText size={18} /> },
  project: { label: "Project Management", url: "/projectmanagement", icon: <FolderKanban size={18} /> },

  firm: { label: "Firm Management", url: "/modules/firm-management/firms", icon: <Target size={18} /> },
  client: { label: "Client Management", url: "/client-management", icon: <Target size={18} /> },
  administration: { label: "Administration", url: "/modules/administration", icon: <Cog size={18} /> },
  tax: { label: "Tax", url: "/modules/taxes", icon: <Cog size={18} /> },
  accounting: { label: "Accounting", url: "/modules/accounting", icon: <DollarSign size={18} /> },
  hrms: { label: "HRM Dashboard", url: "/hrmcubicle", icon: <LayoutDashboard size={18} /> },
}


export default function ToggleOverlayPanel() {
  const { setSelectedModule } = useModule()
  const [organizations, setOrganizations] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null)
  const [OrgTokenData, setOrgTokenData] = useState<any>(null)
  const params = useParams() as { orgName?: string }
  const [orgNameFromStorage, setOrgNameFromStorage] = useState("")

  useEffect(() => {
    setOrgNameFromStorage(localStorage.getItem("orgName") || "")
  }, [])

  const currentOrg = (params.orgName && params.orgName !== "null")
    ? params.orgName
    : (selectedOrg || orgNameFromStorage || organizations[0]?.orgName || "");

  const prefixUrl = React.useCallback((url: string) => {
    if (!currentOrg) return url;
    if (url.startsWith("/hrmcubicle") || url.startsWith("/projectmanagement") || url.startsWith("/lead-management") || url.startsWith("/client-management")) return url;
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return `/${currentOrg}${cleanPath}`;
  }, [currentOrg]);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await getAllOrg()
        if (res.data?.data) {
          setOrganizations(res.data.data)
        }
      } catch (error) {
        console.error("Error fetching organizations:", error)
      }
    }
    fetchOrgs()

    const token = localStorage.getItem("orgToken")
    if (token) {
      try {
        setOrgTokenData(jwtDecode(token))
      } catch (e) { }
    }
  }, [])

  useEffect(() => {
    if (!selectedOrg && organizations.length > 0) {
      setSelectedOrg(organizations[0].orgName)
    }
  }, [organizations, selectedOrg])

  const menuItems = useMemo(() => {
    const getOrgModules = OrgTokenData?.permissions?.map((item: any) => item.module) || [];
    const mergedModules = Array.from(new Set([...DEFAULT_MODULES, ...getOrgModules]))
    return mergedModules.map(mod => MODULES_MAP[mod]).filter(Boolean)
  }, [OrgTokenData])

  const handleSwitchOrg = async (org: any) => {
    setSelectedOrg(org.orgName)
    try {
      const res = await switchOrganization(org.orgId)
      localStorage.setItem("orgToken", res?.token)
      localStorage.setItem("orgID", org.orgId)
      localStorage.setItem("orgName", org.orgName)
      showSuccess(`Switched to ${org.orgName}`)
      window.location.reload()
    } catch (err) {
      showError(`Failed to switch organization`)
    }
  }

  const getInitials = (orgName?: string) => {
    if (!orgName) return ""
    return orgName.slice(0, 2).toUpperCase()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <SquarePlus className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-0">
        <div className="flex h-[400px]">
          {/* Left Avatars - REVERTED TO ORIGINAL UI */}
          <div className="w-[60px] bg-muted flex flex-col items-center gap-2 py-4 overflow-y-auto">
            {organizations.map((org, index) => {
              const initials = getInitials(org.orgName)
              const isSelected = selectedOrg === org.orgName
              return (
                <div
                  key={index}
                  className={`text-xs font-bold rounded-full h-8 w-8 flex items-center justify-center truncate cursor-pointer ${isSelected ? "bg-primary text-white shadow-lg" : "bg-primary text-white"
                    }`}
                  title={org.orgName}
                  onClick={() => handleSwitchOrg(org)}
                >
                  {initials}
                </div>
              )
            })}
          </div>

          {/* Right Scrollable Section - REVERTED TO ORIGINAL UI */}
          <ScrollArea className="flex-1 h-full">
            <div className="p-2">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={prefixUrl(item.url)}
                  className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer !no-underline text-foreground"
                  onClick={() => {
                    setSelectedModule(item.label)
                    setOpen(false)
                  }}
                  prefetch={true}
                >
                  <span className="text-muted-foreground">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  )
}
