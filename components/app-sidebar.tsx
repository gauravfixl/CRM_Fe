"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
  Building2,
  ChevronRight,
  Home,
  Users,
  Target,
  UserCheck,
  Receipt,
  FolderKanban,
  Shield
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import { useModule } from "@/app/context/ModuleContext"
import { useParams } from "next/navigation"
import { useApp } from "@/contexts/app-context"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { useSupportAccess } from "@/contexts/AuthContext";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "CRM",
      url: "/modules/crm",
      icon: Users,
      items: [
        { title: "Leads", url: "/modules/crm/leads" },
        { title: "Clients", url: "/modules/crm/clients" },
        { title: "Contacts", url: "/modules/crm/contacts" },
        { title: "Opportunities", url: "/modules/crm/opportunities" },
      ],
    },
    {
      title: "Lead Management",
      url: "/modules/lead-management",
      icon: Target,
      items: [
        { title: "All Leads", url: "/modules/crm/leads" },
      ],
    },
    {
      title: "Organization Management",
      url: "/organization",
      icon: Target,
      items: [
        { title: "All Organizations", url: "organization/all-org" },
        { title: "Firms", url: "/firm-management/firms" },
      ],
    },
    {
      title: "Client Management",
      url: "/modules/client-management",
      icon: UserCheck,
      items: [
        { title: "Roles", url: "/modules/administration/roles" },
        { title: "All Clients", url: "/modules/crm/clients" },
      ],
    },
    {
      title: "Invoices",
      url: "/modules/invoice",
      icon: Receipt,
      items: [
        { title: "All Invoices", url: "/modules/invoice/all" },
        { title: "Taxes", url: "/modules/taxes" },
        { title: "Create Invoice", url: "/modules/invoice/create" },
      ],
    },
    {
      title: "Project Management",
      url: "/modules/project-management",
      icon: FolderKanban,
      items: [
        { title: "Workspaces", url: "/modules/workspaces" },
      ],
    },
    {
      title: "Administration",
      url: "/modules/administration",
      icon: FolderKanban,
      items: [
        { title: "Roles", url: "/modules/administration/roles" },
      ],
    },
  ],
}

type SidebarProps = React.ComponentProps<typeof Sidebar> & {
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

export function AppSidebar({ open, ...props }: SidebarProps) {
  const { selectedModule } = useModule()
  const params = useParams() as { workspaceId?: string; orgName?: string }
  const { state } = useApp()
  const pathname = usePathname();
  const { accessibleModules } = useSupportAccess();

  const [orgName, setOrgName] = useState("")
  useEffect(() => {
    const storedOrg = localStorage.getItem("orgName") || "";
    setOrgName(storedOrg);
  }, []);

  const currentOrg = params.workspaceId || params.orgName || ""

  const prefixWithOrg = (url: string) => {
    if (!url.startsWith("/modules")) return url;
    if (!currentOrg) return url;
    return `/${currentOrg}${url}`;
  };

  const supportModuleLinks: { [key: string]: string } = {
    firms: prefixWithOrg("/modules/firm-management/firms"),
    clients: prefixWithOrg("/modules/client-management/clients"),
    leads: prefixWithOrg("/modules/crm/leads"),
    org: prefixWithOrg("/modules/organization/all-org"),
  };

  const workspaceProjects = React.useMemo(() => {
    return (state?.projects || []).filter(
      (project) => project.workspaceId === currentOrg
    )
  }, [currentOrg, state?.projects])

  const navMainWithOrg = React.useMemo(() => {
    return data.navMain.map((item) => {
      let updatedItem = {
        ...item,
        url: prefixWithOrg(item.url),
        items: item.items
          ? item.items.map((subItem) => ({
            ...subItem,
            url: prefixWithOrg(subItem.url),
          }))
          : undefined,
      };

      if (item.title === "Project Management") {
        updatedItem.items = (updatedItem.items || []).map((subItem) => {
          if (subItem.title === "Projects") {
            return {
              ...subItem,
              items: workspaceProjects.map((project) => ({
                title: project.name,
                url: `/${orgName}/modules/workspaces/${currentOrg}/projects/${project.id}/board`,
              })),
            };
          }
          return subItem;
        });
      }
      return updatedItem;
    });
  }, [currentOrg, workspaceProjects, orgName])

  const DEFAULT_NAV_ITEMS = [
    {
      title: "Dashboard",
      url: `/${currentOrg}/dashboard`,
      icon: Home,
    },
    {
      title: "Organization Management",
      url: prefixWithOrg("/modules/organization/all-org"),
      icon: Building2,
      items: [
        { title: "All Organizations", url: prefixWithOrg("/modules/organization/all-org") },
        { title: "Firms", url: prefixWithOrg("/modules/firm-management/firms") },
        { title: "Support Agent", url: prefixWithOrg("/modules/SupportAgent") },
        { title: "Ticket Creation", url: prefixWithOrg("/modules/ticketing") },
      ],
    },
  ]

  const filteredNavItems = React.useMemo(() => {
    let navItems: typeof data.navMain = []
    if (selectedModule) {
      navItems = navMainWithOrg.filter(
        (item) => item.title.toLowerCase() === selectedModule.toLowerCase()
      )
    } else {
      navItems = navMainWithOrg
    }
    const navWithoutDefaults = navItems.filter(
      (item) => !DEFAULT_NAV_ITEMS.some((def) => def.title === item.title)
    )
    return [...DEFAULT_NAV_ITEMS, ...navWithoutDefaults]
  }, [navMainWithOrg, selectedModule, currentOrg])

  return (
    <Sidebar collapsible="icon" {...props} className="bg-red-600 mt-[63px]" >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary">Platform</SidebarGroupLabel>
          <SidebarMenu>
            {filteredNavItems.map((item) => (
              <Collapsible key={item.title} defaultOpen={item.title === "Project Management"}>
                <SidebarMenuItem>
                  {item.items ? (
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={`text-primary hover:text-white hover:bg-primary
                          data-[state=open]:hover:text-white data-[state=open]:hover:bg-primary no-underline `}
                      >
                        {item.icon && <item.icon />}
                        {item.title}
                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={`text-primary hover:text-white hover:bg-primary 
                        ${item.url === pathname ? "bg-primary text-white" : ""}`}
                    >
                      <Link href={item.url} className="flex items-center gap-2 w-full !no-underline">
                        {item.icon && <item.icon />}
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  )}

                  {item.items && (
                    <CollapsibleContent>
                      <SidebarMenuSub className="w-full">
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title} className="w-full">
                            <SidebarMenuSubButton
                              asChild
                              className={`w-full text-primary hover:bg-primary hover:text-white
                                ${subItem.url === pathname ? "bg-primary text-white" : ""}`}
                            >
                              <Link href={subItem.url} className="flex w-full !no-underline submenu-button">
                                {subItem.title}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {accessibleModules.length > 0 && (
          <SidebarMenuItem className="p-2 pt-0">
            <Collapsible defaultOpen>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip="Support Access"
                  className="w-full flex items-center gap-2 text-red-500 data-[state=open]:bg-primary data-[state=open]:text-white hover:bg-primary hover:text-white data-[state=open]:hover:bg-primary data-[state=open]:hover:text-white"
                >
                  <Shield className="h-4 w-4" />
                  Support Access
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub>
                  {accessibleModules.map((moduleId) => (
                    <SidebarMenuSubItem key={moduleId}>
                      <SidebarMenuSubButton
                        asChild
                        className="w-full text-primary hover:bg-primary hover:text-white"
                      >
                        <Link
                          href={supportModuleLinks[moduleId]}
                          className="flex items-center gap-2 w-full !no-underline"
                        >
                          {moduleId.charAt(0).toUpperCase() + moduleId.slice(1)}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
