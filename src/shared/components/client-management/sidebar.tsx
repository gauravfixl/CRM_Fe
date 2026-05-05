"use client"

import * as React from "react"
import { useMemo, memo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    ChevronRight,
} from "lucide-react"
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
import { useRoleAccess } from "@/shared/hooks/use-role-access"

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

const clientNavigation: NavItem[] = [
    {
        title: "Overview",
        url: "/client-management",
        icon: <span className="text-xl">📊</span>,
        badge: "Live"
    },
    {
        title: "Revenue",
        url: "/client-management/revenue/overview",
        icon: <span className="text-xl">💰</span>,
        items: [
            { title: "Overview", url: "/client-management/revenue/overview", icon: <span className="text-lg">🔭</span> },
            { title: "Opportunities", url: "/client-management/revenue/opportunities", icon: <span className="text-lg">🤝</span> },
            { title: "Renewals", url: "/client-management/revenue/renewals", icon: <span className="text-lg">🔄</span> },
            { title: "Expansion", url: "/client-management/revenue/expansion", icon: <span className="text-lg">🚀</span> },
        ]
    },
    {
        title: "Subscriptions",
        url: "/client-management/subscriptions/overview",
        icon: <span className="text-xl">💳</span>,
        items: [
            { title: "Overview", url: "/client-management/subscriptions/overview", icon: <span className="text-lg">📊</span> },
            { title: "Plans & Pricing", url: "/client-management/subscriptions/plans", icon: <span className="text-lg">📑</span> },
            { title: "Active Subscriptions", url: "/client-management/subscriptions/active", icon: <span className="text-lg">✅</span> },
            { title: "Usage Billing", url: "/client-management/subscriptions/usage", icon: <span className="text-lg">🔋</span> },
            { title: "Contracts", url: "/client-management/subscriptions/contracts", icon: <span className="text-lg">✍️</span> },
            { title: "Invoices & Payments", url: "/client-management/subscriptions/invoices", icon: <span className="text-lg">🧾</span> },
        ]
    },
    {
        title: "Customers",
        url: "/client-management/customers",
        icon: <span className="text-xl">👥</span>,
        defaultOpen: true,
        items: [
            { title: "Account Overview", url: "/client-management/customers", icon: <span className="text-lg">🏢</span> },
            { title: "Contacts & Key People", url: "/client-management/customers/contacts", icon: <span className="text-lg">📇</span> },
            { title: "Onboarding Stage", url: "/client-management/customers/onboarding", icon: <span className="text-lg">🚀</span> },
            { title: "Client Health", url: "/client-management/customers/health", icon: <span className="text-lg">❤️</span> },
            { title: "Customer Journey", url: "/client-management/customers/journey", icon: <span className="text-lg">🗺️</span> },
            { title: "Feedback & NPS", url: "/client-management/customers/feedback", icon: <span className="text-lg">⭐</span> },
        ]
    },
    {
        title: "Communication",
        url: "/client-management/communication/email",
        icon: <span className="text-xl">💬</span>,
        items: [
            { title: "Email Center", url: "/client-management/communication/email", icon: <span className="text-lg">📧</span> },
            { title: "SMS & Notifications", url: "/client-management/communication/sms", icon: <span className="text-lg">💬</span> },
            { title: "Templates", url: "/client-management/communication/templates", icon: <span className="text-lg">📝</span> },
            { title: "Communication History", url: "/client-management/communication/history", icon: <span className="text-lg">📜</span> },
            { title: "Campaigns", url: "/client-management/communication/campaigns", icon: <span className="text-lg">📣</span> },
            { title: "Broadcast Messages", url: "/client-management/communication/broadcast", icon: <span className="text-lg">📢</span> },
        ]
    },
    {
        title: "Support",
        url: "/client-management/support/overview",
        icon: <span className="text-xl">🎧</span>,
        items: [
            { title: "Overview", url: "/client-management/support/overview", icon: <span className="text-lg">📊</span> },
            { title: "Tickets", url: "/client-management/support/tickets", icon: <span className="text-lg">🎫</span> },
            { title: "SLA Management", url: "/client-management/support/sla", icon: <span className="text-lg">⏱️</span> },
            { title: "Escalations", url: "/client-management/support/escalations", icon: <span className="text-lg">🚨</span> },
            { title: "Knowledge Base", url: "/client-management/support/knowledge", icon: <span className="text-lg">📚</span> },
        ]
    },
    {
        title: "Analytics",
        url: "/client-management/analytics/revenue",
        icon: <span className="text-xl">📈</span>,
        items: [
            { title: "Revenue & MRR", url: "/client-management/analytics/revenue", icon: <span className="text-lg">📊</span> },
            { title: "Retention & Churn", url: "/client-management/analytics/retention", icon: <span className="text-lg">📉</span> },
            { title: "Cohort Analysis", url: "/client-management/analytics/cohorts", icon: <span className="text-lg">🧩</span> },
            { title: "Forecasting", url: "/client-management/analytics/forecasting", icon: <span className="text-lg">🔮</span> },
            { title: "AI Insights", url: "/client-management/analytics/ai-insights", icon: <span className="text-lg">🧠</span> },
        ]
    },
    {
        title: "Reports",
        url: "/client-management/reports/executive",
        icon: <span className="text-xl">📉</span>,
        items: [
            { title: "Executive Dashboard", url: "/client-management/reports/executive", icon: <span className="text-lg">📈</span> },
            { title: "Financial Reports", url: "/client-management/reports/financial", icon: <span className="text-lg">💰</span> },
            { title: "Client Reports", url: "/client-management/reports/client", icon: <span className="text-lg">👥</span> },
            { title: "Performance Reports", url: "/client-management/reports/performance", icon: <span className="text-lg">🎯</span> },
            { title: "Custom Reports", url: "/client-management/reports/custom", icon: <span className="text-lg">⚙️</span> },
            { title: "Scheduled Reports", url: "/client-management/reports/scheduled", icon: <span className="text-lg">📅</span> },
        ]
    },
    {
        title: "Finance",
        url: "/client-management/finance/overview",
        icon: <span className="text-xl">🏦</span>,
        items: [
            { title: "Overview", url: "/client-management/finance/overview", icon: <span className="text-lg">📊</span> },
            { title: "Accounting", url: "/client-management/finance/accounting", icon: <span className="text-lg">📒</span> },
            { title: "Expenses", url: "/client-management/finance/expenses", icon: <span className="text-lg">💸</span> },
            { title: "Tax Module", url: "/client-management/finance/tax", icon: <span className="text-lg">🏛️</span> },
            { title: "Financial Reports", url: "/client-management/finance/reports", icon: <span className="text-lg">📋</span> },
            { title: "Revenue Recognition", url: "/client-management/finance/recognition", icon: <span className="text-lg">秤</span> },
        ]
    },
    {
        title: "Automation",
        url: "/client-management/automation/workflows",
        icon: <span className="text-xl">⚡</span>,
        items: [
            { title: "Workflows", url: "/client-management/automation/workflows", icon: <span className="text-lg">🔄</span> },
            { title: "Playbooks", url: "/client-management/automation/playbooks", icon: <span className="text-lg">📖</span> },
            { title: "Triggers & Actions", url: "/client-management/automation/triggers", icon: <span className="text-lg">⚡</span> },
            { title: "Notification Rules", url: "/client-management/automation/notifications", icon: <span className="text-lg">🔔</span> },
        ]
    },
    {
        title: "Integrations",
        url: "/client-management/integrations/crm",
        icon: <span className="text-xl">🔌</span>,
        items: [
            { title: "CRM Sync", url: "/client-management/integrations/crm", icon: <span className="text-lg">🔗</span> },
            { title: "Billing Gateways", url: "/client-management/integrations/billing", icon: <span className="text-lg">💳</span> },
            { title: "Support Tools", url: "/client-management/integrations/support", icon: <span className="text-lg">🛠️</span> },
            { title: "API Keys & Access", url: "/client-management/integrations/api", icon: <span className="text-lg">🔑</span> },
            { title: "Webhooks", url: "/client-management/integrations/webhooks", icon: <span className="text-lg">🪝</span> },
            { title: "Data Sync Mapping", url: "/client-management/integrations/data-sync", icon: <span className="text-lg">🔄</span> },
            { title: "AI Integrations", url: "/client-management/integrations/ai", icon: <span className="text-lg">🧠</span> },
            { title: "Marketplace", url: "/client-management/integrations/marketplace", icon: <span className="text-lg">🏪</span> },
        ]
    },
    {
        title: "Settings",
        url: "/client-management/settings/users",
        icon: <span className="text-xl">⚙️</span>,
        items: [
            { title: "User Management", url: "/client-management/settings/users", icon: <span className="text-lg">👥</span> },
            { title: "Roles & Permissions", url: "/client-management/settings/roles", icon: <span className="text-lg">🛡️</span> },
            { title: "Customization", url: "/client-management/settings/fields", icon: <span className="text-lg">⚙️</span> },
        ]
    }
]

function ClientSidebarComponent({ ...props }: React.ComponentProps<typeof ShadcnSidebar>) {
    const pathname = usePathname()
    const { filterModuleSidebar } = useRoleAccess()

    // Filter navigation based on OrgAdmin role permissions
    const filteredNavigation = useMemo(() => {
        return filterModuleSidebar(clientNavigation, "client")
    }, [filterModuleSidebar])

    const navWithActive = useMemo(() => {
        return filteredNavigation.map(item => ({
            ...item,
            isActive: pathname === item.url || (item.items && item.items.length > 0 && item.items.some(sub => pathname === sub.url))
        }));
    }, [pathname, filteredNavigation]);

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
                                                    <span className="flex items-center justify-center shrink-0 w-6">{item.icon}</span>
                                                    <span className="ml-1.5 truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                                                    <ChevronRight className="ml-auto w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="transition-all duration-300 ease-in-out">
                                                <SidebarMenuSub className="border-l-0 ml-0 pl-0 mx-0 px-0 translate-x-0">
                                                    {item.items?.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild isActive={pathname === subItem.url} className="text-slate-500 h-9 hover:text-slate-900 hover:bg-slate-100 rounded-md text-[12px]">
                                                                <Link href={subItem.url} className="flex w-full items-center">
                                                                    <span className="flex items-center justify-center shrink-0 w-6">{subItem.icon}</span>
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
                                            <span className="shrink-0 flex items-center justify-center w-6">{item.icon}</span>
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

export const ClientSidebar = memo(ClientSidebarComponent);
