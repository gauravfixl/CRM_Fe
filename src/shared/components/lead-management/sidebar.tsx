"use client"

import * as React from "react"
import { useMemo, memo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import {
    Sidebar as ShadcnSidebar,
    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarRail,
} from "@/shared/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/shared/components/ui/collapsible"

interface NavItem {
    title: string;
    url: string;
    icon?: React.ReactNode;
    badge?: string;
    defaultOpen?: boolean;
    items?: {
        title: string;
        url: string;
        icon?: React.ReactNode;
        badge?: string;
    }[];
}

const leadNavigation: NavItem[] = [
    {
        title: "Overview",
        url: "/lead-management",
        icon: <span className="text-xl">📊</span>,
        badge: "Live"
    },
    {
        title: "Lead Inbox",
        url: "/lead-management/inbox/new",
        icon: <span className="text-xl">📥</span>,
        defaultOpen: true,
        items: [
            { title: "New", url: "/lead-management/inbox/new", icon: <span className="text-lg">✨</span> },
            { title: "Unassigned", url: "/lead-management/inbox/unassigned", icon: <span className="text-lg">📬</span> },
            { title: "Pending Response", url: "/lead-management/inbox/pending", icon: <span className="text-lg">⏳</span> },
            { title: "At Risk", url: "/lead-management/inbox/at-risk", icon: <span className="text-lg">⚠️</span>, badge: "8" },
            { title: "Inactive", url: "/lead-management/inbox/inactive", icon: <span className="text-lg">🧊</span> },
            { title: "High Value", url: "/lead-management/inbox/high-value", icon: <span className="text-lg">💎</span> },
            { title: "Reopened", url: "/lead-management/inbox/reopened", icon: <span className="text-lg">🔄</span> },
        ]
    },
    {
        title: "Leads",
        url: "/lead-management/database/all",
        icon: <span className="text-xl">👥</span>,
        items: [
            { title: "All", url: "/lead-management/database/all", icon: <span className="text-lg">🌐</span> },
            { title: "Active", url: "/lead-management/database/active", icon: <span className="text-lg">✅</span> },
            { title: "Converted", url: "/lead-management/database/converted", icon: <span className="text-lg">🏆</span> },
            { title: "Lost", url: "/lead-management/database/lost", icon: <span className="text-lg">❌</span> },
            { title: "Archived", url: "/lead-management/database/archived", icon: <span className="text-lg">📂</span> },
            { title: "Saved Views", url: "/lead-management/database/saved", icon: <span className="text-lg">💾</span> },
        ]
    },
    {
        title: "Pipeline",
        url: "/lead-management/pipeline/board",
        icon: <span className="text-xl">🔀</span>,
        items: [
            { title: "Board View", url: "/lead-management/pipeline/board", icon: <span className="text-lg">📋</span> },
            { title: "Funnel View", url: "/lead-management/pipeline/funnel", icon: <span className="text-lg">🌪️</span> },
            { title: "Stage Performance", url: "/lead-management/pipeline/performance", icon: <span className="text-lg">📈</span> },
            { title: "Aging Analysis", url: "/lead-management/pipeline/aging", icon: <span className="text-lg">⏳</span> },
            { title: "Conversion Trends", url: "/lead-management/pipeline/conversion", icon: <span className="text-lg">📉</span> },
            { title: "Forecast", url: "/lead-management/pipeline/forecast", icon: <span className="text-lg">🔮</span> },
        ]
    },
    {
        title: "Activities",
        url: "/lead-management/activities/all",
        icon: <span className="text-xl">📅</span>,
        items: [
            { title: "All Activities", url: "/lead-management/activities/all", icon: <span className="text-lg">🗓️</span> },
            { title: "Tasks", url: "/lead-management/activities/tasks", icon: <span className="text-lg">📝</span> },
            { title: "Calls", url: "/lead-management/activities/calls", icon: <span className="text-lg">📞</span> },
            { title: "Meetings", url: "/lead-management/activities/meetings", icon: <span className="text-lg">🤝</span> },
            { title: "Emails", url: "/lead-management/activities/emails", icon: <span className="text-lg">📧</span> },
            { title: "Overdue", url: "/lead-management/activities/overdue", badge: "14", icon: <span className="text-lg">⏰</span> },
            { title: "Upcoming", url: "/lead-management/activities/upcoming", icon: <span className="text-lg">🚀</span> },
        ]
    },
    {
        title: "Qualification & Scoring",
        url: "/lead-management/qualification/framework",
        icon: <span className="text-xl">🎯</span>,
        items: [
            { title: "Qualification Framework", url: "/lead-management/qualification/framework", icon: <span className="text-lg">🏗️</span> },
            { title: "Scoring Rules", url: "/lead-management/qualification/rules", icon: <span className="text-lg">📜</span> },
            { title: "Behavioral Scoring", url: "/lead-management/qualification/behavioral", icon: <span className="text-lg">🧠</span> },
            { title: "Score Thresholds (MQL/SQL)", url: "/lead-management/qualification/thresholds", icon: <span className="text-lg">📏</span> },
            { title: "Score Distribution", url: "/lead-management/qualification/distribution", icon: <span className="text-lg">📊</span> },
            { title: "Qualification Insights", url: "/lead-management/qualification/insights", icon: <span className="text-lg">💡</span> },
            { title: "Score History (Audit)", url: "/lead-management/qualification/history", icon: <span className="text-lg">🕰️</span> },
        ]
    },
    {
        title: "Routing & SLA",
        url: "/lead-management/routing/rules",
        icon: <span className="text-xl">🛤️</span>,
        items: [
            { title: "Routing Rules", url: "/lead-management/routing/rules", icon: <span className="text-lg">🔀</span> },
            { title: "Assignment Methods", url: "/lead-management/routing/methods", icon: <span className="text-lg">🛠️</span> },
            { title: "Queues / Pools", url: "/lead-management/routing/queues", icon: <span className="text-lg">👥</span> },
            { title: "Reassignment & Escalation", url: "/lead-management/routing/escalation", icon: <span className="text-lg">⚡</span> },
            { title: "SLA Policies", url: "/lead-management/routing/sla-policies", icon: <span className="text-lg">📋</span> },
            { title: "SLA Monitoring", url: "/lead-management/routing/sla-monitoring", icon: <span className="text-lg">🖥️</span> },
            { title: "Breach Log", url: "/lead-management/routing/breach-log", icon: <span className="text-lg">🚨</span> },
            { title: "Business Hours & Calendars", url: "/lead-management/routing/business-hours", icon: <span className="text-lg">🕒</span> },
            { title: "Routing Audit (History)", url: "/lead-management/routing/audit", icon: <span className="text-lg">📝</span> },
        ]
    },
    {
        title: "Automation",
        url: "/lead-management/automation/workflows",
        icon: <span className="text-xl">⚡</span>,
        items: [
            { title: "Workflows", url: "/lead-management/automation/workflows", icon: <span className="text-lg">🔄</span> },
            { title: "Triggers", url: "/lead-management/automation/triggers", icon: <span className="text-lg">🎯</span> },
            { title: "Actions Library", url: "/lead-management/automation/actions", icon: <span className="text-lg">📦</span> },
            { title: "Nurture Sequences", url: "/lead-management/automation/nurture", icon: <span className="text-lg">🌱</span> },
            { title: "Stage Automation", url: "/lead-management/automation/stage-automation", icon: <span className="text-lg">🎭</span> },
            { title: "SLA Automation", url: "/lead-management/automation/sla-automation", icon: <span className="text-lg">⏱️</span> },
            { title: "Templates", url: "/lead-management/automation/templates", icon: <span className="text-lg">📄</span> },
            { title: "Workflow Logs", url: "/lead-management/automation/logs", icon: <span className="text-lg">🗒️</span> },
            { title: "Automation Settings", url: "/lead-management/automation/settings", icon: <span className="text-lg">⚙️</span> },
        ]
    },
    {
        title: "Campaigns & Sources",
        url: "/lead-management/campaigns/list",
        icon: <span className="text-xl">📣</span>,
        items: [
            { title: "Campaigns", url: "/lead-management/campaigns/list", icon: <span className="text-lg">📢</span> },
            { title: "Sources", url: "/lead-management/campaigns/sources", icon: <span className="text-lg">📍</span> },
            { title: "UTM Tracking", url: "/lead-management/campaigns/utm-tracking", icon: <span className="text-lg">🏷️</span> },
            { title: "Lead Attribution", url: "/lead-management/campaigns/attribution", icon: <span className="text-lg">🎯</span> },
            { title: "Cost & ROI", url: "/lead-management/campaigns/roi", icon: <span className="text-lg">💰</span> },
            { title: "Source Quality", url: "/lead-management/campaigns/source-quality", icon: <span className="text-lg">⭐</span> },
            { title: "Campaign Performance", url: "/lead-management/campaigns/performance", icon: <span className="text-lg">🚀</span> },
            { title: "Tracking Settings", url: "/lead-management/campaigns/settings", icon: <span className="text-lg">🛠️</span> },
        ]
    },
    {
        title: "Reports & Analytics",
        url: "/lead-management/reports/executive",
        icon: <span className="text-xl">📈</span>,
        items: [
            { title: "Executive Dashboard", url: "/lead-management/reports/executive", icon: <span className="text-lg">👔</span> },
            { title: "Lead Reports", url: "/lead-management/reports/leads", icon: <span className="text-lg">📊</span> },
            { title: "Funnel & Conversion", url: "/lead-management/reports/funnel", icon: <span className="text-lg">🌪️</span> },
            { title: "Source & Campaign", url: "/lead-management/reports/sources", icon: <span className="text-lg">🗺️</span> },
            { title: "Activity Reports", url: "/lead-management/reports/activities", icon: <span className="text-lg">🏃</span> },
            { title: "SLA Reports", url: "/lead-management/reports/sla", icon: <span className="text-lg">⏱️</span> },
            { title: "Qualification Reports", url: "/lead-management/reports/qualification", icon: <span className="text-lg">🎓</span> },
            { title: "Aging & Bottlenecks", url: "/lead-management/reports/aging", icon: <span className="text-lg">🕰️</span> },
            { title: "Automation Reports", url: "/lead-management/reports/automation", icon: <span className="text-lg">🤖</span> },
            { title: "Custom Reports", url: "/lead-management/reports/custom", icon: <span className="text-lg">🛠️</span> },
            { title: "Scheduled Reports", url: "/lead-management/reports/scheduled", icon: <span className="text-lg">📅</span> },
        ]
    },
    {
        title: "Integrations",
        url: "/lead-management/integrations/lead-capture",
        icon: <span className="text-xl">🔌</span>,
        items: [
            { title: "Lead Capture", url: "/lead-management/integrations/lead-capture", icon: <span className="text-lg">🕸️</span> },
            { title: "Marketing Platforms", url: "/lead-management/integrations/marketing", icon: <span className="text-lg">📧</span> },
            { title: "Communication Channels", url: "/lead-management/integrations/communications", icon: <span className="text-lg">💬</span> },
            { title: "CRM & Data Sync", url: "/lead-management/integrations/crm-sync", icon: <span className="text-lg">🔄</span> },
            { title: "Ad Platforms", url: "/lead-management/integrations/ads", icon: <span className="text-lg">📢</span> },
            { title: "API & Webhooks", url: "/lead-management/integrations/api-webhooks", icon: <span className="text-lg">🔗</span> },
            { title: "Tracking & Pixels", url: "/lead-management/integrations/tracking", icon: <span className="text-lg">📡</span> },
            { title: "Marketplace", url: "/lead-management/integrations/marketplace", icon: <span className="text-lg">🛒</span> },
            { title: "Integration Logs", url: "/lead-management/integrations/logs", icon: <span className="text-lg">📜</span> },
        ]
    },
    {
        title: "Settings",
        url: "/lead-management/settings/org",
        icon: <span className="text-xl">⚙️</span>,
        items: [
            { title: "Organization & Preferences", url: "/lead-management/settings/org", icon: <span className="text-lg">🏢</span> },
            { title: "Users & Access", url: "/lead-management/settings/users", icon: <span className="text-lg">👥</span> },
            { title: "Lead Lifecycle Setup", url: "/lead-management/settings/lifecycle", icon: <span className="text-lg">🧬</span> },
            { title: "Fields & Data Model", url: "/lead-management/settings/data-model", icon: <span className="text-lg">🏗️</span> },
            { title: "Statuses, Tags & Reasons", url: "/lead-management/settings/classification", icon: <span className="text-lg">🏷️</span> },
            { title: "Templates & Content", url: "/lead-management/settings/templates", icon: <span className="text-lg">📄</span> },
            { title: "Notifications", url: "/lead-management/settings/notifications", icon: <span className="text-lg">🔔</span> },
            { title: "Data Management", url: "/lead-management/settings/data-management", icon: <span className="text-lg">💾</span> },
            { title: "Security", url: "/lead-management/settings/security", icon: <span className="text-lg">🔒</span> },
            { title: "Audit & Compliance", url: "/lead-management/settings/audit", icon: <span className="text-lg">🕵️</span> },
            { title: "System Health", url: "/lead-management/settings/health", icon: <span className="text-lg">🏥</span> },
            { title: "Billing & Plan", url: "/lead-management/settings/billing", icon: <span className="text-lg">💳</span> },
        ]
    },
]

function LeadSidebarComponent({ ...props }: React.ComponentProps<typeof ShadcnSidebar>) {
    const pathname = usePathname()

    const navWithActive = useMemo(() => {
        return leadNavigation.map(item => ({
            ...item,
            isActive: pathname === item.url || (item.items && item.items.length > 0 && item.items.some(sub => pathname === sub.url))
        }));
    }, [pathname]);

    return (
        <ShadcnSidebar collapsible="icon" className="!top-[70px] !bottom-0 !h-auto border-r bg-white" {...props}>
            <SidebarContent className="py-2">
                <SidebarGroup className="!p-1.5">
                    <SidebarMenu className="gap-1">
                        {navWithActive.map((item) => {
                            const isActive = item.isActive;
                            const hasSubMenu = (item.items?.length ?? 0) > 0;

                            if (hasSubMenu) {
                                return (
                                    <Collapsible
                                        key={item.title}
                                        asChild
                                        defaultOpen={isActive || item.defaultOpen}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={item.title} isActive={isActive} className="font-medium text-slate-600 h-10 hover:bg-slate-100 group-data-[collapsible=icon]:justify-center text-[13px]">
                                                    <span className="flex items-center justify-center shrink-0">{item.icon}</span>
                                                    <span className="ml-1.5 truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                                                    <ChevronRight className="ml-auto w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="transition-all duration-300 ease-in-out">
                                                <SidebarMenuSub className="border-l-slate-200 ml-2">
                                                    {item.items?.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild isActive={pathname === subItem.url} className="text-slate-500 h-9 hover:text-slate-900 hover:bg-slate-100 rounded-md text-[12px]">
                                                                <Link href={subItem.url} className="flex w-full items-center">
                                                                    <span className="shrink-0">{subItem.icon}</span>
                                                                    <span className="ml-1.5 truncate flex-1">{subItem.title}</span>
                                                                    {subItem.badge && (
                                                                        <span className="ml-auto bg-slate-100 text-[11px] px-1.5 rounded-full font-semibold text-slate-500">
                                                                            {subItem.badge}
                                                                        </span>
                                                                    )}
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                )
                            }

                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title} className="font-medium text-slate-600 h-10 hover:bg-slate-100 group-data-[collapsible=icon]:justify-center text-[13px]">
                                        <Link href={item.url} className="flex w-full items-center group-data-[collapsible=icon]:justify-center">
                                            <span className="shrink-0 flex items-center justify-center">{item.icon}</span>
                                            <span className="ml-1.5 truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                                            {item.badge && (
                                                <span className="ml-auto bg-rose-100 text-[11px] px-1.5 rounded-full font-semibold text-rose-600 group-data-[collapsible=icon]:hidden">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </ShadcnSidebar>
    )
}

export const LeadSidebar = memo(LeadSidebarComponent);
