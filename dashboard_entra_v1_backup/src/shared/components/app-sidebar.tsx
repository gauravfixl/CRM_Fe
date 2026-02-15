"use client"

import * as React from "react"
import { useEffect, useState, useMemo } from "react"
import {
  Users,
  Shield,
  Lock,
  FileText,
  PieChart,
  UserPlus,
  UserCheck,
  CreditCard,
  Briefcase,
  Settings,
  CalendarClock,
  Calculator,
  Building2,
  LayoutDashboard,
  CheckCircle,
  FolderKanban,
  BarChart3,
  Contact,
  Calendar,
  Trello,
  Zap,
  Timer,
  Award,
  Banknote,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Menu,
  ShoppingBag, // Products
  ShoppingCart, // Orders
  Megaphone, // Campaigns
  LifeBuoy, // Support/Tickets
  BookOpen, // Knowledge Base
  FileStack, // Quotes
  ChevronDown, // Dropdown arrow
  ArrowLeft, // Back arrow
  Filter, // Overview
  ListFilter, // List actions
  Workflow, // Automation
  ChartBar, // Lead Scoring
  Clock,
  Plus,
  Target,
  TrendingUp,
  DollarSign,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarHeader,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar"

import { Separator } from "@/components/ui/separator"
import { useParams, usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Exact 15 items - Optimised for Enterprise CRM/HRM/PM (Fixl Solutions)
// Final Recommended Admin Sidebar Structure
const sidebarGroupsData = [
  {
    title: "DASHBOARD",
    icon: LayoutDashboard,
    url: "/dashboard",
    items: []
  },
  {
    title: "CALENDAR",
    icon: Calendar,
    url: "/modules/calendar",
    items: []
  },
  {
    title: "CRM SYSTEM",
    icon: Users,
    items: [
      { title: "Leads", icon: UserPlus, url: "/modules/crm/leads" },
      { title: "Deals / Opportunities", icon: Briefcase, url: "/modules/crm/deals" },
      { title: "Sales Pipeline", icon: LayoutDashboard, url: "/modules/crm/pipeline" },
      { title: "Clients / Accounts", icon: UserCheck, url: "/modules/crm/clients" },
      { title: "Contacts", icon: Contact, url: "/modules/crm/contacts" },
      { title: "Activities", icon: CalendarClock, url: "/modules/crm/activities" },
      { title: "Campaigns", icon: Megaphone, url: "/modules/crm/campaigns" },
    ]
  },
  {
    title: "SALES & COMMERCE", // Odoo Style
    icon: ShoppingCart,
    items: [
      { title: "Products / Services", icon: ShoppingBag, url: "/modules/sales/products" }, // New
      { title: "Quotes / Proposals", icon: FileStack, url: "/modules/sales/quotes" }, // New
      { title: "Sales Orders", icon: ShoppingCart, url: "/modules/sales/orders" }, // New
    ]
  },
  {
    title: "SUPPORT DESK", // Salesforce Service Cloud
    icon: LifeBuoy,
    items: [
      { title: "Tickets / Cases", icon: LifeBuoy, url: "/modules/support/tickets" }, // New
      { title: "Knowledge Base", icon: BookOpen, url: "/modules/support/kb" }, // New
    ]
  },
  {
    title: "PROJECT MANAGEMENT",
    icon: FolderKanban,
    items: [
      { title: "Workspaces", icon: Building2, url: "/modules/workspaces/manage" },
      { title: "Projects", icon: FolderKanban, url: "/modules/workspaces" },
      { title: "Tasks", icon: CheckCircle, url: "/modules/workspaces/tasks" },
      { title: "Boards", icon: Trello, url: "/modules/workspaces/boards" },
      { title: "Sprints", icon: Zap, url: "/modules/workspaces/sprints" },
      { title: "Time Tracking", icon: Timer, url: "/modules/workspaces/time" },
    ]
  },
  {
    title: "HRM / WORKFORCE",
    icon: Users,
    items: [
      { title: "HR Dashboard", icon: LayoutDashboard, url: "/hrmcubicle" },
      { title: "Employees", icon: Users, url: "/modules/hr/employees" },
      { title: "Attendance", icon: CalendarClock, url: "/modules/attendance/daily" },
      { title: "Leave Management", icon: CalendarClock, url: "/modules/leave-management" },
      { title: "Payroll", icon: Receipt, url: "/modules/hr/payroll" },
      { title: "Performance Reviews", icon: Award, url: "/modules/hr/performance" },
      { title: "Recruitment", icon: UserPlus, url: "/modules/hr/recruitment" },
    ]
  },
  {
    title: "FINANCE",
    icon: Calculator,
    items: [
      { title: "Invoices", icon: CreditCard, url: "/modules/invoice/all" },
      { title: "Payments", icon: CreditCard, url: "/modules/payments" },
      { title: "Accounting", icon: Calculator, url: "/modules/accounting" },
      { title: "Expenses", icon: Banknote, url: "/modules/finance/expenses" },
    ]
  },
  {
    title: "ANALYTICS",
    icon: PieChart,
    items: [
      { title: "Reports", icon: PieChart, url: "/reports" },
      { title: "Performance Insights", icon: BarChart3, url: "/modules/performance" },
    ]
  },
  {
    title: "ADMINISTRATION",
    icon: Settings,
    items: [
      { title: "Organization Profile", icon: Building2, url: "/modules/organization/all-org" },
      { title: "Business Units", icon: Building2, url: "/modules/firm-management/firms" },
      { title: "Users", icon: Users, url: "/modules/users" },
      { title: "Roles & Permissions", icon: Shield, url: "/modules/administration/roles" },
      { title: "Workflow Automation", icon: Settings, url: "/modules/settings/automation" },
      { title: "Integrations", icon: Settings, url: "/modules/settings/integrations" },
      { title: "Security Overview", icon: Lock, url: "/security" },
      { title: "Audit Logs", icon: FileText, url: "/audit-logs" },
    ]
  },
];

// Leads Specific Sub-Sidebar Structure
const leadsMenuData = [
  {
    group: "LEAD OVERVIEW",
    items: [
      { title: "All Leads", url: "/modules/crm/leads", icon: UserPlus },
      { title: "My Leads", url: "/modules/crm/leads?filter=mine", icon: Contact },
      { title: "Recently Viewed", url: "/modules/crm/leads?filter=recent", icon: Filter },
      { title: "Unassigned", url: "/modules/crm/leads?filter=unassigned", icon: UserCheck },
      { title: "Converted", url: "/modules/crm/leads?filter=converted", icon: CheckCircle },
    ]
  },
  {
    group: "PIPELINE",
    items: [
      { title: "Kanban View", url: "/modules/crm/leads/kanban", icon: LayoutDashboard },
      { title: "Lead Stages", url: "/modules/crm/leads/settings/stages", icon: Settings },
    ]
  },
  {
    group: "ACTIVITIES",
    items: [
      { title: "Timeline", url: "/modules/crm/leads/activities/timeline", icon: CalendarClock },
      { title: "Emails", url: "/modules/crm/leads/activities/emails", icon: Menu },
      { title: "Calls", url: "/modules/crm/leads/activities/calls", icon: Contact },
      { title: "Meetings", url: "/modules/crm/leads/activities/meetings", icon: Calendar },
      { title: "Notes", url: "/modules/crm/leads/activities/notes", icon: FileText },
    ]
  },
  {
    group: "ACTIONS",
    items: [
      { title: "Import Leads", url: "/modules/crm/leads/import", icon: FileText },
      { title: "Bulk Actions", url: "/modules/crm/leads/bulk", icon: ListFilter },
    ]
  },
  {
    group: "RULES & AUTOMATION",
    items: [
      { title: "Lead Scoring", url: "/modules/crm/leads/settings/scoring", icon: ChartBar },
      { title: "Workflow Rules", url: "/modules/crm/leads/settings/workflows", icon: Workflow },
    ]
  }
];

// Deals / Opportunities Specific Sub-Sidebar Structure
const dealsMenuData = [
  {
    group: "DEAL OVERVIEW",
    items: [
      { title: "All Deals", url: "/modules/crm/deals", icon: Briefcase },
      { title: "My Deals", url: "/modules/crm/deals?filter=mine", icon: Contact },
      { title: "Recently Viewed", url: "/modules/crm/deals?filter=recent", icon: Filter },
      { title: "Open Deals", url: "/modules/crm/deals?filter=open", icon: FolderKanban },
      { title: "Closed Won", url: "/modules/crm/deals?filter=won", icon: CheckCircle },
      { title: "Closed Lost", url: "/modules/crm/deals?filter=lost", icon: Award },
    ]
  },
  {
    group: "PIPELINE",
    items: [
      { title: "Kanban View", url: "/modules/crm/deals/kanban", icon: LayoutDashboard },
      { title: "Deal Stages", url: "/modules/crm/deals/settings/stages", icon: Settings },
      { title: "Probability Settings", url: "/modules/crm/deals/settings/probability", icon: PieChart },
    ]
  },
  {
    group: "ACTIVITIES",
    items: [
      { title: "Timeline", url: "/modules/crm/deals/activities/timeline", icon: CalendarClock },
      { title: "Emails", url: "/modules/crm/deals/activities/emails", icon: Menu },
      { title: "Calls", url: "/modules/crm/deals/activities/calls", icon: Contact },
      { title: "Meetings", url: "/modules/crm/deals/activities/meetings", icon: Calendar },
      { title: "Notes", url: "/modules/crm/deals/activities/notes", icon: FileText },
    ]
  },
  {
    group: "ACTIONS",
    items: [
      { title: "Create Deal", url: "/modules/crm/deals/new", icon: Briefcase },
      { title: "Import Deals", url: "/modules/crm/deals/import", icon: FileText },
      { title: "Bulk Update", url: "/modules/crm/deals/bulk", icon: ListFilter },
    ]
  }
];

// Sales Pipeline Specific Sub-Sidebar Structure
const pipelineMenuData = [
  {
    group: "PIPELINE",
    items: [
      { title: "Kanban View", url: "/modules/crm/pipeline", icon: LayoutDashboard },
      { title: "Stage Settings", url: "/modules/crm/pipeline/settings/stages", icon: Settings },
      { title: "Probability Settings", url: "/modules/crm/pipeline/settings/probability", icon: PieChart },
    ]
  },
  {
    group: "ANALYTICS",
    items: [
      { title: "Pipeline Value", url: "/modules/crm/pipeline/analytics/value", icon: BarChart3 },
      { title: "Win Rate", url: "/modules/crm/pipeline/analytics/win-rate", icon: TrendingUp },
    ]
  }
];

const campaignsMenuData = [
  {
    group: "OVERVIEW",
    items: [
      { title: "All Campaigns", url: "/modules/crm/campaigns", icon: Megaphone },
      { title: "My Campaigns", url: "/modules/crm/campaigns?filter=mine", icon: Contact },
      { title: "Active Campaigns", url: "/modules/crm/campaigns?filter=active", icon: Zap },
      { title: "Completed", url: "/modules/crm/campaigns?filter=completed", icon: CheckCircle },
      { title: "Drafts", url: "/modules/crm/campaigns?filter=drafts", icon: FileText },
    ]
  },
  {
    group: "EXECUTION",
    items: [
      { title: "Members", url: "/modules/crm/campaigns/members", icon: Users },
      { title: "Member Status", url: "/modules/crm/campaigns/member-status", icon: Filter },
      { title: "Email Campaigns", url: "/modules/crm/campaigns/emails", icon: Menu },
      { title: "Events / Webinars", url: "/modules/crm/campaigns/events", icon: Calendar },
    ]
  },
  {
    group: "ACTIONS",
    items: [
      { title: "Create Campaign", url: "/modules/crm/campaigns/new", icon: Plus },
      { title: "Add Members", url: "/modules/crm/campaigns/add-members", icon: UserPlus },
      { title: "Import Members", url: "/modules/crm/campaigns/import", icon: FileText },
      { title: "Bulk Actions", url: "/modules/crm/campaigns/bulk", icon: ListFilter },
    ]
  },
  {
    group: "INFLUENCE & ATTRIBUTION",
    items: [
      { title: "Primary Source", url: "/modules/crm/campaigns/influence/primary", icon: Target },
      { title: "Influenced Deals", url: "/modules/crm/campaigns/influence/deals", icon: Briefcase },
      { title: "Revenue Attribution", url: "/modules/crm/campaigns/influence/revenue", icon: DollarSign },
    ]
  },
  {
    group: "ANALYTICS & REPORTS",
    items: [
      { title: "Campaign Performance", url: "/modules/crm/campaigns/analytics/performance", icon: BarChart3 },
      { title: "ROI Reports", url: "/modules/crm/campaigns/analytics/roi", icon: PieChart },
      { title: "Lead Source Analysis", url: "/modules/crm/campaigns/analytics/sources", icon: Filter },
    ]
  }
];

const clientsMenuData = [
  {
    group: "OVERVIEW",
    items: [
      { title: "All Accounts", url: "/modules/crm/clients", icon: UserCheck },
      { title: "My Accounts", url: "/modules/crm/clients?filter=mine", icon: Contact },
      { title: "Active Accounts", url: "/modules/crm/clients?filter=active", icon: CheckCircle },
      { title: "Inactive Accounts", url: "/modules/crm/clients?filter=inactive", icon: Shield },
      { title: "Recently Viewed", url: "/modules/crm/clients?filter=recent", icon: Filter },
    ]
  },
  {
    group: "RELATIONSHIPS",
    items: [
      { title: "Contacts", url: "/modules/crm/clients/contacts", icon: Users },
      { title: "Decision Makers", url: "/modules/crm/clients/decision-makers", icon: Award },
      { title: "Account Team", url: "/modules/crm/clients/team", icon: Shield },
    ]
  },
  {
    group: "SALES & REVENUE",
    items: [
      { title: "Deals", url: "/modules/crm/clients/deals", icon: Briefcase },
      { title: "Open Opportunities", url: "/modules/crm/clients/opportunities", icon: FolderKanban },
      { title: "Closed Deals", url: "/modules/crm/clients/closed", icon: CheckCircle },
      { title: "Revenue Summary", url: "/modules/crm/clients/revenue", icon: BarChart3 },
    ]
  },
  {
    group: "ACTIVITIES",
    items: [
      { title: "Timeline", url: "/modules/crm/clients/activities/timeline", icon: CalendarClock },
      { title: "Emails", url: "/modules/crm/clients/activities/emails", icon: Menu },
      { title: "Calls", url: "/modules/crm/clients/activities/calls", icon: Contact },
      { title: "Meetings", url: "/modules/crm/clients/activities/meetings", icon: Calendar },
      { title: "Notes", url: "/modules/crm/clients/activities/notes", icon: FileText },
    ]
  },
  {
    group: "SUPPORT",
    items: [
      { title: "Cases", url: "/modules/crm/clients/support/cases", icon: LifeBuoy },
      { title: "SLAs", url: "/modules/crm/clients/support/sla", icon: Shield },
    ]
  },
  {
    group: "ANALYTICS",
    items: [
      { title: "Performance", url: "/modules/crm/clients/analytics/performance", icon: BarChart3 },
      { title: "Revenue Trend", url: "/modules/crm/clients/analytics/trends", icon: TrendingUp },
      { title: "Engagement Score", url: "/modules/crm/clients/analytics/engagement", icon: Target },
    ]
  }
];

// --- CALENDAR Sub-sidebar Data ---
const calendarMenuData = [
  {
    group: "VIEWS",
    items: [
      { title: "My Schedule", url: "/modules/calendar?view=my", icon: UserCheck },
      { title: "Team Schedule", url: "/modules/calendar?view=team", icon: Users },
      { title: "Company Wide", url: "/modules/calendar?view=company", icon: Building2 },
    ]
  },
  {
    group: "MY CALENDARS",
    items: [
      { title: "Meetings", url: "/modules/calendar?type=meeting", icon: CheckCircle },
      { title: "Tasks & Deadlines", url: "/modules/calendar?type=task", icon: CheckCircle },
      { title: "Reminders", url: "/modules/calendar?type=reminder", icon: CheckCircle },
    ]
  },
  {
    group: "TEAM",
    items: [
      { title: "Availability", url: "/modules/calendar/availability", icon: Clock },
      { title: "Leave Calendar", url: "/modules/calendar/leaves", icon: Calendar },
    ]
  }
];

type SidebarProps = React.ComponentProps<typeof Sidebar> & {
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

const AppSidebarComponent = ({ open, setOpen, ...props }: SidebarProps) => {
  const params = useParams() as { workspaceId?: string; orgName?: string }
  const pathname = usePathname();
  const router = useRouter();
  const { state: sidebarState } = useSidebar();

  const [activeCategory, setActiveCategory] = useState<string>("DASHBOARD");
  const [isSubCollapsed, setIsSubCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["CRM SYSTEM"]); // CRM SYSTEM open by default

  const [orgName, setOrgName] = useState("")
  useEffect(() => {
    const storedOrg = localStorage.getItem("orgName") || "";
    setOrgName(storedOrg);
  }, []);

  const currentOrg = useMemo(() => {
    return (params.orgName && params.orgName !== "null")
      ? params.orgName
      : (params.workspaceId || orgName || "");
  }, [params.orgName, params.workspaceId, orgName]);

  // Transform data once to include valid URLs
  const finalSidebarGroups = useMemo(() => {
    return sidebarGroupsData.map(group => ({
      ...group,
      items: group.items.map(item => {
        let finalUrl = item.url;
        if (currentOrg && !item.url.startsWith("/hrmcubicle")) {
          finalUrl = `/${currentOrg}${item.url.startsWith("/") ? "" : "/"}${item.url}`;
        }
        return { ...item, url: finalUrl };
      })
    }));
  }, [currentOrg]);

  // Transform Leads specific data with Org Prefix
  const finalLeadsMenu = useMemo(() => {
    return leadsMenuData.map(group => ({
      ...group,
      items: group.items.map(item => {
        let finalUrl = item.url;
        if (currentOrg) {
          finalUrl = `/${currentOrg}${item.url.startsWith("/") ? "" : "/"}${item.url}`;
        }
        return { ...item, url: finalUrl };
      })
    }))
  }, [currentOrg]);

  // Transform Deals data
  const finalDealsMenu = useMemo(() => {
    return dealsMenuData.map(group => ({
      ...group,
      items: group.items.map(item => {
        let finalUrl = item.url;
        if (currentOrg) {
          finalUrl = `/${currentOrg}${item.url.startsWith("/") ? "" : "/"}${item.url}`;
        }
        return { ...item, url: finalUrl };
      })
    }))
  }, [currentOrg]);

  // Transform Pipeline data
  const finalPipelineMenu = useMemo(() => {
    return pipelineMenuData.map(group => ({
      ...group,
      items: group.items.map(item => {
        let finalUrl = item.url;
        if (currentOrg) {
          finalUrl = `/${currentOrg}${item.url.startsWith("/") ? "" : "/"}${item.url}`;
        }
        return { ...item, url: finalUrl };
      })
    }))
  }, [currentOrg]);

  // Transform Campaigns data
  const finalCampaignsMenu = useMemo(() => {
    return campaignsMenuData.map(group => ({
      ...group,
      items: group.items.map(item => {
        let finalUrl = item.url;
        if (currentOrg) {
          finalUrl = `/${currentOrg}${item.url.startsWith("/") ? "" : "/"}${item.url}`;
        }
        return { ...item, url: finalUrl };
      })
    }))
  }, [currentOrg]);

  // Transform Clients data
  const finalClientsMenu = useMemo(() => {
    return clientsMenuData.map(group => ({
      ...group,
      items: group.items.map(item => {
        let finalUrl = item.url;
        if (currentOrg) {
          finalUrl = `/${currentOrg}${item.url.startsWith("/") ? "" : "/"}${item.url}`;
        }
        return { ...item, url: finalUrl };
      })
    }))
  }, [currentOrg]);

  // Determine Active Module based on Path AND Active Category
  const activeModule = useMemo(() => {
    // If we are in CALENDAR category, return specialized module name
    if (activeCategory === "CALENDAR") return "Calendar";

    // Only show drill-down if we're in CRM SYSTEM category
    if (activeCategory !== "CRM SYSTEM") return null;

    // Check most specific paths first to avoid false matches
    if (pathname?.includes("/modules/crm/campaigns")) return "Campaigns";
    if (pathname?.includes("/modules/crm/pipeline")) return "Pipeline";
    if (pathname?.includes("/modules/crm/clients")) return "Clients";
    if (pathname?.includes("/modules/crm/deals")) return "Deals";
    if (pathname?.includes("/modules/crm/leads")) return "Leads";
    // Add logic for other modules if they need drill-down
    return null;
  }, [pathname, activeCategory]);

  // Sync Active Category with URL
  useEffect(() => {
    if (!pathname) return;

    for (const group of sidebarGroupsData) {
      if (group.url && pathname.includes(group.url)) { // Relaxed check specifically for Calendar
        setActiveCategory(group.title);
        // Don't auto-expand anything for single-link categories like Calendar
        return;
      }
      if (group.items.length > 0) {
        const hasMatch = group.items.some(item => pathname.includes(item.url) || (item.url !== '/' && pathname.startsWith(item.url)));
        if (hasMatch) {
          setActiveCategory(group.title);
          setExpandedGroups(prev => [...new Set([...prev, group.title])]);
          return;
        }
      }
    }
  }, [pathname]);

  // Select the correct sub-sidebar data
  const finalSubSidebarGroups = useMemo(() => {
    if (activeCategory === "CALENDAR") return calendarMenuData;

    switch (activeModule) {
      case "Leads": return leadsMenuData;
      case "Deals": return dealsMenuData;
      case "Clients": return finalClientsMenu;
      // case "Pipeline": return pipelineMenuData; // To be added
      // case "Campaigns": return campaignsMenuData; // To be added
      default: return []; // Dashboard or others with no sub-sidebar
    }
  }, [activeModule, activeCategory, finalClientsMenu]);

  const activeGroupItems = useMemo(() => {
    const group = finalSidebarGroups.find(g => g.title === activeCategory);
    return group ? group.items : [];
  }, [activeCategory, finalSidebarGroups]);

  const handleCategoryClick = (group: typeof sidebarGroupsData[0]) => {
    // Set the active category (this will clear drill-down if switching categories)
    setActiveCategory(group.title);
    setIsSubCollapsed(false);

    // Close all inline dropdowns when switching categories
    setExpandedGroups([]);

    // If clicking on a category with no items and it has a URL, navigate to it
    if (group.items.length === 0 && group.url) {
      let finalUrl = group.url;
      if (currentOrg && !group.url.startsWith("/hrmcubicle")) {
        finalUrl = `/${currentOrg}${group.url}`;
      }
      router.push(finalUrl);
    }
  };

  const toggleGroup = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    setExpandedGroups(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  return (
    <>
      {/* PRIMARY SIDEBAR - Categories & Inline Dropdowns */}
      <Sidebar collapsible="icon" {...props} className="mt-[63px] h-[calc(100svh-63px)] border-r bg-white dark:bg-zinc-950 z-30">
        <SidebarHeader className="h-0 p-0 m-0" />
        <SidebarContent className="bg-white dark:bg-zinc-950 pt-2 hover-scroll">
          <SidebarMenu>
            {finalSidebarGroups.map((group) => {
              const isActive = activeCategory === group.title;
              const isExpanded = expandedGroups.includes(group.title);
              const hasSubItems = group.items.length > 0;

              return (
                <SidebarMenuItem key={group.title}>
                  <div className="flex items-center w-full relative group/item">
                    <SidebarMenuButton
                      onClick={() => handleCategoryClick(group)}
                      tooltip={group.title}
                      className={`gap-3 p-3 transition-colors flex-1 
                        ${isActive ? "bg-zinc-100 dark:bg-zinc-800 text-blue-600" : "text-zinc-600 hover:text-foreground dark:text-zinc-400"}`}
                    >
                      <group.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-blue-600" : "text-zinc-500"}`} />
                      <span className="text-xs font-medium truncate group-data-[collapsible=icon]:hidden">
                        {group.title}
                      </span>
                    </SidebarMenuButton>

                    {hasSubItems && (
                      <div
                        onClick={(e) => toggleGroup(e, group.title)}
                        className="absolute right-1 p-1.5 cursor-pointer text-zinc-400 hover:text-foreground group-data-[collapsible=icon]:hidden transition-colors"
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                      </div>
                    )}
                  </div>


                  {/* Inline Dropdown Items - Show when expanded OR when collapsed but group is expanded */}
                  {isExpanded && hasSubItems && (
                    <SidebarMenuSub className="border-l-0 ml-0 pl-0 space-y-0">
                      {group.items.map(subItem => {
                        const isSubActive = pathname === subItem.url || pathname?.startsWith(subItem.url + "/");
                        const isCollapsed = sidebarState === "collapsed";

                        return (
                          <SidebarMenuSubItem key={subItem.title} className="ml-0">
                            <SidebarMenuSubButton asChild isActive={isSubActive} className="h-auto p-0 m-0">
                              <Link
                                href={subItem.url}
                                className={`text-xs font-light flex items-center gap-3 w-full hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors ${isCollapsed ? 'justify-center p-2' : 'p-3'
                                  }`}
                                title={subItem.title}
                              >
                                <subItem.icon className="h-4 w-4 opacity-70 flex-shrink-0" />
                                {!isCollapsed && <span>{subItem.title}</span>}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  )}
                  {/* Separator between groups */}
                  <div className="my-1 px-2 group-data-[collapsible=icon]:hidden opacity-50">
                    <Separator className="bg-zinc-100 dark:bg-zinc-800" />
                  </div>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      {/* SECONDARY SIDEBAR - Module Drill-down or Category List */}
      {activeCategory !== "DASHBOARD" && (
        <aside className={`mt-[63px] h-[calc(100svh-63px)] border-r border-border bg-zinc-50 dark:bg-zinc-900 flex-shrink-0 relative hover-scroll hidden md:flex flex-col transition-all duration-300 ${isSubCollapsed ? "w-[60px]" : "w-64"}`}>

          <div className={`p-4 border-b border-border flex items-center sticky top-0 bg-inherit z-10 ${isSubCollapsed ? "justify-center" : "justify-between"}`}>
            {!isSubCollapsed && (
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wide truncate">
                {activeModule ? activeModule.toUpperCase() : activeCategory}
              </h3>
            )}
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsSubCollapsed(!isSubCollapsed)}>
              {isSubCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          <div className="p-2 space-y-4">
            {/* CASE 1: LEAD MODULE ACTIVE (Drill Down) */}
            {!isSubCollapsed && activeModule === "Leads" ? (
              <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-300">
                {finalLeadsMenu.map((group, idx) => (
                  <div key={idx} className="px-2">
                    <h4 className="text-xs font-semibold text-zinc-500 mb-2 px-2 uppercase tracking-wider">{group.group}</h4>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const isActive = pathname === item.url
                        return (
                          <Link
                            key={item.title}
                            href={item.url}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-light transition-colors
                                ${isActive
                                ? "bg-white dark:bg-zinc-800 text-blue-600 !font-normal shadow-sm border border-zinc-200"
                                : "text-zinc-600 hover:text-foreground dark:hover:text-zinc-300 transition-colors"
                              }`}
                          >
                            <item.icon className="h-4 w-4 opacity-70" />
                            <span>{item.title}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
                {/* Back to CRM Navigation */}
                <Separator className="my-2" />
                <div className="px-2">
                  <Link
                    href={`/${currentOrg}/modules/crm`}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-500 hover:text-foreground"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span>Back to CRM Modules</span>
                  </Link>
                </div>
              </div>
            ) : !isSubCollapsed && activeModule === "Deals" ? (
              /* CASE 2: DEALS MODULE ACTIVE (Drill Down) */
              <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-300">
                {finalDealsMenu.map((group, idx) => (
                  <div key={idx} className="px-2">
                    <h4 className="text-xs font-semibold text-zinc-500 mb-2 px-2 uppercase tracking-wider">{group.group}</h4>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const isActive = pathname === item.url
                        return (
                          <Link
                            key={item.title}
                            href={item.url}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-light transition-colors
                                ${isActive
                                ? "bg-white dark:bg-zinc-800 text-blue-600 !font-normal shadow-sm border border-zinc-200"
                                : "text-zinc-600 hover:text-foreground dark:hover:text-zinc-300 transition-colors"
                              }`}
                          >
                            <item.icon className="h-4 w-4 opacity-70" />
                            <span>{item.title}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
                {/* Back to CRM Navigation */}
                <Separator className="my-2" />
                <div className="px-2">
                  <Link
                    href={`/${currentOrg}/modules/crm`}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-500 hover:text-foreground"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span>Back to CRM Modules</span>
                  </Link>
                </div>
              </div>
            ) : !isSubCollapsed && activeModule === "Pipeline" ? (
              /* CASE 3: PIPELINE MODULE ACTIVE */
              <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-300">
                {finalPipelineMenu.map((group, idx) => (
                  <div key={idx} className="px-2">
                    <h4 className="text-xs font-semibold text-zinc-500 mb-2 px-2 uppercase tracking-wider">{group.group}</h4>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const isActive = pathname === item.url
                        return (
                          <Link
                            key={item.title}
                            href={item.url}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-light transition-colors
                                ${isActive
                                ? "bg-white dark:bg-zinc-800 text-blue-600 !font-normal shadow-sm border border-zinc-200"
                                : "text-zinc-600 hover:text-foreground dark:hover:text-zinc-300 transition-colors"
                              }`}
                          >
                            <item.icon className="h-4 w-4 opacity-70" />
                            <span>{item.title}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
                {/* Back to CRM Navigation */}
                <Separator className="my-2" />
                <div className="px-2">
                  <Link
                    href={`/${currentOrg}/modules/crm`}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-500 hover:text-foreground"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span>Back to CRM Modules</span>
                  </Link>
                </div>
              </div>
            ) : !isSubCollapsed && activeModule === "Campaigns" ? (
              /* CASE 4: CAMPAIGNS MODULE ACTIVE */
              <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-300">
                {finalCampaignsMenu.map((group, idx) => (
                  <div key={idx} className="px-2">
                    <h4 className="text-xs font-semibold text-zinc-500 mb-2 px-2 uppercase tracking-wider">{group.group}</h4>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const isActive = pathname === item.url
                        return (
                          <Link
                            key={item.title}
                            href={item.url}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-light transition-colors
                                ${isActive
                                ? "bg-white dark:bg-zinc-800 text-blue-600 !font-normal shadow-sm border border-zinc-200"
                                : "text-zinc-600 hover:text-foreground dark:hover:text-zinc-300 transition-colors"
                              }`}
                          >
                            <item.icon className="h-4 w-4 opacity-70" />
                            <span>{item.title}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
                {/* Back to CRM Navigation */}
                <Separator className="my-2" />
                <div className="px-2">
                  <Link
                    href={`/${currentOrg}/modules/crm`}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-500 hover:text-foreground"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span>Back to CRM Modules</span>
                  </Link>
                </div>
              </div>
            ) : !isSubCollapsed && activeModule === "Calendar" ? (
              /* CASE: CALENDAR MODULE ACTIVE */
              <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-300">
                {finalSubSidebarGroups.map((group, idx) => (
                  <div key={idx} className="px-2">
                    <h4 className="text-xs font-semibold text-zinc-500 mb-2 px-2 uppercase tracking-wider">{group.group}</h4>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const isActive = pathname === item.url || (pathname && pathname.includes(item.url) && item.url !== '/modules/calendar')
                        return (
                          <Link
                            key={item.title}
                            href={item.url}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-light transition-colors
                                ${isActive
                                ? "bg-white dark:bg-zinc-800 text-blue-600 !font-normal shadow-sm border border-zinc-200"
                                : "text-zinc-600 hover:text-foreground dark:hover:text-zinc-300 transition-colors"
                              }`}
                          >
                            <item.icon className="h-4 w-4 opacity-70" />
                            <span>{item.title}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : !isSubCollapsed && activeModule === "Clients" ? (
              /* CASE 5: CLIENTS / ACCOUNTS MODULE ACTIVE */
              <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-300">
                {finalClientsMenu.map((group, idx) => (
                  <div key={idx} className="px-2">
                    <h4 className="text-xs font-semibold text-zinc-500 mb-2 px-2 uppercase tracking-wider">{group.group}</h4>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const isActive = pathname === item.url
                        return (
                          <Link
                            key={item.title}
                            href={item.url}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-light transition-colors
                                ${isActive
                                ? "bg-white dark:bg-zinc-800 text-blue-600 !font-normal shadow-sm border border-zinc-200"
                                : "text-zinc-600 hover:text-foreground dark:hover:text-zinc-300 transition-colors"
                              }`}
                          >
                            <item.icon className="h-4 w-4 opacity-70" />
                            <span>{item.title}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
                {/* Back to CRM Navigation */}
                <Separator className="my-2" />
                <div className="px-2">
                  <Link
                    href={`/${currentOrg}/modules/crm`}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-500 hover:text-foreground"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span>Back to CRM Modules</span>
                  </Link>
                </div>
              </div>
            ) : (
              /* CASE 6: STANDARD CATEGORY LIST (Default) */
              <div className="space-y-1">
                {activeGroupItems.map((item) => {
                  const isActive = pathname === item.url || pathname?.startsWith(item.url + "/");
                  return (
                    <Link
                      key={item.title}
                      href={item.url}
                      className={`flex items-center gap-3 py-2 rounded-md text-xs font-light transition-colors
                            ${isActive
                          ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 !font-normal shadow-sm border border-zinc-200 dark:border-zinc-700"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-foreground transition-colors"
                        }
                            ${isSubCollapsed ? "justify-center px-0" : "px-3"}
                          `}
                      title={isSubCollapsed ? item.title : ""}
                    >
                      <item.icon className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-zinc-500"}`} />
                      {!isSubCollapsed && <span>{item.title}</span>}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
};

export const AppSidebar = React.memo(AppSidebarComponent);
