"use client"

import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
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
  LayoutDashboard,
  Building2,
  Check
} from "lucide-react"
import { getAllOrg, switchOrganization } from "@/hooks/orgHooks"
import { getFirmList } from "@/hooks/firmHooks"
import { useModule } from "@/app/context/ModuleContext"
import { useAuthStore } from "@/lib/useAuthStore"
import { showSuccess, showError } from "@/utils/toast"
import { jwtDecode } from "jwt-decode"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

// Color constants for org and firm avatars
const ORG_COLORS = {
  bg: "bg-indigo-600",
  bgSelected: "bg-indigo-700",
  ring: "ring-indigo-400",
  hoverBg: "hover:bg-indigo-700",
} as const

const FIRM_COLORS = {
  bg: "bg-emerald-600",
  bgSelected: "bg-emerald-700",
  ring: "ring-emerald-400",
  hoverBg: "hover:bg-emerald-700",
} as const


export default function ToggleOverlayPanel() {
  const { setSelectedModule } = useModule()
  const { currentFirm, setCurrentFirm } = useAuthStore()
  const [organizations, setOrganizations] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null)
  const [OrgTokenData, setOrgTokenData] = useState<any>(null)
  const [firms, setFirms] = useState<any[]>([])
  const [firmsLoading, setFirmsLoading] = useState(false)
  const params = useParams() as { orgName?: string }
  const [orgNameFromStorage, setOrgNameFromStorage] = useState("")

  useEffect(() => {
    setOrgNameFromStorage(localStorage.getItem("orgName") || "")
    // Hydrate currentFirm from localStorage if not already set
    if (!currentFirm) {
      const storedFirmId = localStorage.getItem("firmId")
      const storedFirmName = localStorage.getItem("firmName")
      if (storedFirmId && storedFirmName) {
        setCurrentFirm({ firmId: storedFirmId, firmName: storedFirmName })
      }
    }
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

  // Fetch firms for the current organization
  useEffect(() => {
    const fetchFirms = async () => {
      setFirmsLoading(true)
      try {
        const res = await getFirmList()
        const firmData = res?.data?.firms || res?.data?.data || []
        setFirms(firmData)
      } catch (err) {
        console.error("Error fetching firms:", err)
        setFirms([])
      } finally {
        setFirmsLoading(false)
      }
    }
    fetchFirms()
  }, [selectedOrg])

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
      // Clear firm selection when switching org
      setCurrentFirm(null)
      localStorage.removeItem("firmId")
      localStorage.removeItem("firmName")
      showSuccess(`Switched to ${org.orgName}`)
      window.location.reload()
    } catch (err) {
      showError(`Failed to switch organization`)
    }
  }

  const handleSwitchFirm = (firm: any) => {
    const firmId = firm._id
    const firmName = firm.FirmName

    // If clicking the already selected firm, deselect it
    if (currentFirm?.firmId === firmId) {
      setCurrentFirm(null)
      localStorage.removeItem("firmId")
      localStorage.removeItem("firmName")
      showSuccess(`Deselected firm: ${firmName}`)
      setOpen(false)
      return
    }

    setCurrentFirm({ firmId, firmName })
    localStorage.setItem("firmId", firmId)
    localStorage.setItem("firmName", firmName)
    showSuccess(`Switched to firm: ${firmName}`)
    setOpen(false)
  }

  const getInitials = (name?: string) => {
    if (!name) return ""
    return name.slice(0, 2).toUpperCase()
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
          {/* Left Panel - Organizations & Firms */}
          <TooltipProvider delayDuration={200}>
            <ScrollArea className="w-[68px] bg-muted border-r">
              <div className="flex flex-col items-center gap-1 py-3 px-1">
                {organizations.map((org, index) => {
                  const isSelectedOrg = selectedOrg === org.orgName
                  return (
                    <React.Fragment key={org.orgId || index}>
                      {/* Organization Avatar */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`relative text-[11px] font-bold rounded-full h-9 w-9 flex items-center justify-center cursor-pointer transition-all duration-200 text-white shrink-0
                              ${isSelectedOrg
                                ? `${ORG_COLORS.bgSelected} ring-2 ${ORG_COLORS.ring} shadow-md`
                                : `${ORG_COLORS.bg} ${ORG_COLORS.hoverBg} opacity-80 hover:opacity-100`
                              }`}
                            onClick={() => handleSwitchOrg(org)}
                          >
                            {getInitials(org.orgName)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={8}>
                          <p className="font-medium">{org.orgName}</p>
                          <p className="text-xs text-muted-foreground">Organization</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Firms under this org (only show for selected/current org) */}
                      {isSelectedOrg && firms.length > 0 && (
                        <>
                          {/* Separator between org and its firms */}
                          <div className="w-7 my-0.5 border-t border-muted-foreground/25" />

                          {firms.map((firm) => {
                            const isSelectedFirm = currentFirm?.firmId === firm._id
                            return (
                              <Tooltip key={firm._id}>
                                <TooltipTrigger asChild>
                                  <div
                                    className={`relative text-[10px] font-bold rounded-md h-8 w-8 flex items-center justify-center cursor-pointer transition-all duration-200 text-white shrink-0
                                      ${isSelectedFirm
                                        ? `${FIRM_COLORS.bgSelected} ring-2 ${FIRM_COLORS.ring} shadow-md`
                                        : `${FIRM_COLORS.bg} ${FIRM_COLORS.hoverBg} opacity-75 hover:opacity-100`
                                      }`}
                                    onClick={() => handleSwitchFirm(firm)}
                                  >
                                    {getInitials(firm.FirmName)}
                                    {isSelectedFirm && (
                                      <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-[1px]">
                                        <Check size={10} className="text-emerald-600" />
                                      </div>
                                    )}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={8}>
                                  <p className="font-medium">{firm.FirmName}</p>
                                  <p className="text-xs text-muted-foreground">Firm</p>
                                </TooltipContent>
                              </Tooltip>
                            )
                          })}
                        </>
                      )}

                      {/* Firms loading state */}
                      {isSelectedOrg && firmsLoading && (
                        <>
                          <div className="w-7 my-0.5 border-t border-muted-foreground/25" />
                          <div className="h-8 w-8 rounded-md bg-muted-foreground/20 animate-pulse shrink-0" />
                        </>
                      )}

                      {/* Separator between different orgs */}
                      {index < organizations.length - 1 && (
                        <div className="w-9 my-1 border-t border-muted-foreground/15" />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            </ScrollArea>
          </TooltipProvider>

          {/* Right Scrollable Section - Modules */}
          <ScrollArea className="flex-1 h-full">
            <div className="p-2">
              {/* Current context indicator */}
              {currentFirm && (
                <div className="mx-2 mb-2 px-3 py-2 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-emerald-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium truncate">
                        Active Firm: {currentFirm.firmName}
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
