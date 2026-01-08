
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Home,
  Building,
  Users,
  Cog,
  Target,
  FolderKanban,
  CircleEllipsis,
  MessageSquareText,
  BarChart2,
  BookOpen,
  Blocks,
  MoreHorizontal,
  FileText,
  DollarSign,
  SquarePlus
} from "lucide-react"
import { getAllOrg } from "@/hooks/orgHooks"
import { useModule } from "@/app/context/ModuleContext"
import { useAuthStore } from "@/lib/useAuthStore"
import { showSuccess, showError } from "@/utils/toast"
import { switchOrganization } from "@/hooks/orgHooks"
import { jwtDecode } from "jwt-decode"

export default function ToggleOverlayPanel() {
  const { setSelectedModule } = useModule()
  const [organizations, setOrganizations] = useState([])
  const singleOrg = useAuthStore((state) => state.singleOrg)
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedOrgIndex, setSelectedOrgIndex] = useState("")
  // const OrgToken: any =  [];
  const [OrgToken, setOrgToken] = useState("");
  // Fetch organizations on mount
  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await getAllOrg()
        if (res.data) {
          setOrganizations(res.data.data)
        }
      } catch (error) {
        console.error("Error fetching organizations:", error)
      }
    }
    fetchOrgs()
    const orgto = localStorage.getItem("orgToken");
    console.log("orgto", orgto !== undefined);

    const routingData: any = orgto !== undefined ? jwtDecode(orgto as any) : [];
    setOrgToken(routingData)
  }, [])
  console.log("singleOrg at toggle Overlay panel", singleOrg, OrgToken);

  // Selected organization state
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null)

  // Set default selected org as first org's name
  useEffect(() => {
    if (!selectedOrg && organizations.length > 0) {
      setSelectedOrg(organizations[0].orgName)
    }
  }, [organizations, selectedOrg])

  const currentOrg = selectedOrg || organizations[0]?.orgName || ""

  const getOrgnameInitials = (orgName?: string) => {
    if (!orgName) return ""
    return orgName.slice(0, 2).toUpperCase()
  }

  // Default modules that should always be visible
  const DEFAULT_MODULES = ["dashboard", "organization", "lead"]

  // Merge with organization modules if available
  const orgModules = singleOrg?.organization?.modules || []
  const getOrgModules = OrgToken?.permissions?.map((item: any) => item.module) || [];
  const mergedModules = Array.from(new Set([...DEFAULT_MODULES, ...getOrgModules]))

  const MODULES_MAP: Record<string, { label: string; url: string; icon: JSX.Element }> = {
    dashboard: { label: "Dashboard", url: "/dashboard", icon: <Home size={18} /> },
    lead: { label: "Lead Management", url: "/modules/crm/leads", icon: <Users size={18} /> },
    invoice: { label: "Invoices", url: "/modules/invoice/all", icon: <FileText size={18} /> },
    project: { label: "Project Management", url: "/modules/workspaces", icon: <FolderKanban size={18} /> },
    organization: { label: "Organization Management", url: "/modules/organization/all-org", icon: <Building size={18} /> },
    firm: { label: "Firm Management", url: "/modules/firm-management/firms", icon: <Target size={18} /> },
    client: { label: "Client Management", url: "/modules/crm/clients", icon: <Target size={18} /> },
    administration: { label: "Administration", url: "/modules/administration", icon: <Cog size={18} /> },
    tax: { label: "Tax", url: "/modules/taxes", icon: <Cog size={18} /> },
    accounting: { label: "Accounting", url: "modules/firm-management", icon: <DollarSign size={18} /> },
  }

  console.log("mergedModules", mergedModules, MODULES_MAP, orgModules, DEFAULT_MODULES, getOrgModules, OrgToken);

  const menuItems = mergedModules
    .map((mod) => MODULES_MAP[mod])
    .filter(Boolean);

  console.log("mergedModules menuItems  at toggle Overlay panel", menuItems);

  const recommendedItems = [
    {
      icon: <MessageSquareText className="text-yellow-500" size={20} />,
      title: "Work requests",
      description: "Create one place to manage requests",
    },
    {
      icon: <BarChart2 className="text-purple-500" size={20} />,
      title: "Product roadmap",
      description: "Align everyone with custom roadmaps",
    },
    {
      icon: <BookOpen className="text-sky-500" size={20} />,
      title: "Confluence",
      description: "Document collaboration",
    },
    {
      icon: <Blocks className="text-neutral-800" size={20} />,
      title: "More Cubicle apps",
      description: "",
    },
  ]

  const handleSwitchOrg = async (orgId: string | number) => {
    const newOrg = organizations.find((org) => org.orgId === orgId);
    if (!newOrg) return;

    setSelectedOrg(newOrg.orgName);  // update selected org
    try {
      const res = await switchOrganization(newOrg.orgId);
      console.log("Switched org response:", res, res?.token);

      localStorage.setItem("orgToken", res?.token);
      showSuccess(`Switched to ${newOrg.orgName}`);
    } catch (err) {
      console.error("Error switching org:", err);
      showError(`Failed to switch organization`);
    }
  };


  //  const handleSelect = (label: string) => {
  //   if (!currentOrg) {
  //     router.push(`/null/dashboard`)
  //     setOpen(false)
  //     return
  //   }
  //   setSelectedModule(label)
  //   router.push(`/${currentOrg}/dashboard`)
  //   setOpen(false)  // <-- closes popover automatically
  // }
  const prefixWithOrg = (url: string) => {
    if (!url.startsWith("/modules")) return url; // Dashboard or other top-level pages
    if (!currentOrg) {
      console.warn("No org/workspace to prefix path:", url);
      return url;
    }
    return `/${currentOrg}${url}`;
  };

  const handleSelect = (label: string) => {
    if (!currentOrg) {
      router.push(`/null/dashboard`)
      setOpen(false)
      return
    }
    setSelectedModule(label)
    console.log("url", prefixWithOrg(label), label);
    if (label === "/dashboard") {
      router.push(`/${currentOrg}/${label}`)
    }
    else {
      router.push(`${prefixWithOrg(label)}`)
    }
    // // Convert module label to route-friendly string
    // const route = label.toLowerCase().replace(/\s+/g, "") // removes spaces if any
    // router.push(`/${currentOrg}/dashboard`)

    setOpen(false)  // closes popover automatically
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
          {/* Left Avatars */}
          <div className="w-[60px] bg-muted flex flex-col items-center gap-2 py-4 overflow-y-auto">
            {organizations.map((org, index) => {
              const initials = getOrgnameInitials(org.orgName)
              const isSelected = selectedOrg === org.orgName
              return (
                <div
                  key={index}
                  className={`text-xs font-bold rounded-full h-8 w-8 flex items-center justify-center truncate cursor-pointer ${isSelected ? "bg-primary text-white shadow-lg" : "bg-primary text-white"
                    }`}
                  title={org.orgName}
                  onClick={() => handleSwitchOrg(org.orgId)}
                >
                  {initials}
                </div>
              )
            })}
          </div>

          {/* Right Scrollable Section */}
          <ScrollArea className="flex-1 h-full">
            <div className="p-2">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(item.url)}
                  className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                >
                  <span className="text-muted-foreground">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
            <div

              onClick={() => handleSelect("/hrmcubicle")}
              className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer"
            >
              <span className="text-muted-foreground"> <FileText size={18} /> </span>
              <span className="text-sm font-medium">HRMs</span>
            </div>
            <Separator />
            <div className="p-4">
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                Recommended for your team
              </h4>
              <div className="space-y-2">
                {recommendedItems.map((item, index) => (
                  <div
                    key={index}
                    className="border rounded-md p-3 bg-muted/50 flex gap-3 items-start"
                  >
                    <div className="mt-1">{item.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{item.title}</div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  )
}
