"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Home,
    User,
    Inbox,
    Users,
    Building2,
    Briefcase,
    Clock,
    DollarSign,
    Award,
    FileText,
    Heart,
    RefreshCw
} from "lucide-react"

import {
    Sidebar as ShadcnSidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    useSidebar,
} from "@/shared/components/ui/sidebar"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"

// Exact Keka-style Navigation Data based on Document Analysis
// using Colorful Icons (Emojis) to match the "colorful" requirement
const hrmNavigation = [
    {
        title: "Home",
        url: "/hrmcubicle",
        icon: () => <span className="text-xl">🏠</span>,
        items: []
    },
    {
        title: "Me",
        url: "#",
        icon: () => <span className="text-xl">👤</span>,
        items: [
            { title: "My Profile", url: "/hrmcubicle/me", icon: () => <span className="text-lg">🆔</span> },
            { title: "My Attendance", url: "/hrmcubicle/attendance", icon: () => <span className="text-lg">📅</span> },
            { title: "My Leave", url: "/hrmcubicle/leave", icon: () => <span className="text-lg">🌴</span> },
            { title: "My Finances", url: "/hrmcubicle/my-finances", icon: () => <span className="text-lg">💰</span> },
            { title: "My Performance", url: "/hrmcubicle/performance", icon: () => <span className="text-lg">📈</span> },
            { title: "My Documents", url: "/hrmcubicle/me/documents", icon: () => <span className="text-lg">📂</span> },
            { title: "My Assets", url: "/hrmcubicle/me/assets", icon: () => <span className="text-lg">💻</span> },
        ]
    },
    {
        title: "Inbox",
        url: "#",
        icon: () => <span className="text-xl">📥</span>,
        items: [
            { title: "Approvals", url: "/hrmcubicle/inbox/approvals", icon: () => <span className="text-lg">✅</span> },
            { title: "Notifications", url: "/hrmcubicle/inbox/notifications", icon: () => <span className="text-lg">🔔</span> },
            { title: "Requests", url: "/hrmcubicle/inbox/requests", icon: () => <span className="text-lg">📨</span> },
        ]
    },
    {
        title: "My Team",
        url: "#",
        icon: () => <span className="text-xl">👥</span>,
        items: [
            {
                title: "Team Overview",
                url: "/hrmcubicle/my-team",
                icon: () => <span className="text-lg">📊</span>,
                isNew: true
            },
            {
                title: "Team Members",
                url: "/hrmcubicle/my-team/members",
                icon: () => <span className="text-lg">🧑‍💼</span>
            },
            {
                title: "Team Attendance",
                url: "/hrmcubicle/my-team/attendance",
                icon: () => <span className="text-lg">⏱️</span>
            },
            {
                title: "Team Leave",
                url: "/hrmcubicle/my-team/leave",
                icon: () => <span className="text-lg">🌴</span>
            },
            {
                title: "Team Requests",
                url: "/hrmcubicle/my-team/requests",
                icon: () => <span className="text-lg">📥</span>,
                badge: "12"
            },
            {
                title: "Team Performance",
                url: "/hrmcubicle/my-team/performance",
                icon: () => <span className="text-lg">📈</span>
            },
            {
                title: "Team Calendar",
                url: "/hrmcubicle/my-team/calendar",
                icon: () => <span className="text-lg">🗓️</span>
            },
            {
                title: "On/Offboarding",
                url: "/hrmcubicle/my-team/lifecycle",
                icon: () => <span className="text-lg">🚀</span>
            },
            {
                title: "Team Documents",
                url: "/hrmcubicle/my-team/documents",
                icon: () => <span className="text-lg">📂</span>
            },
            {
                title: "Team Reports",
                url: "/hrmcubicle/my-team/reports",
                icon: () => <span className="text-lg">📑</span>
            },
        ]
    },
    {
        title: "Organization",
        url: "#",
        icon: () => <span className="text-xl">🏢</span>,
        items: [
            { title: "Org Dashboard", url: "/hrmcubicle/organization/dashboard", icon: () => <span className="text-lg">📉</span> },
            { title: "Employees", url: "/hrmcubicle/organization/employees", icon: () => <span className="text-lg">🧑‍🤝‍🧑</span> },
            { title: "Departments", url: "/hrmcubicle/organization/departments", icon: () => <span className="text-lg">🏗️</span> },
            { title: "Designations", url: "/hrmcubicle/organization/designations", icon: () => <span className="text-lg">🏷️</span> },
            { title: "Locations", url: "/hrmcubicle/organization/locations", icon: () => <span className="text-lg">📍</span> },
            { title: "Org Chart", url: "/hrmcubicle/organization/chart", icon: () => <span className="text-lg">🌳</span> },
        ]
    },
    {
        title: "Hire",
        url: "#",
        icon: () => <span className="text-xl">🚀</span>,
        items: [
            { title: "Job Openings", url: "/hrmcubicle/hire/jobs", icon: () => <span className="text-lg">📢</span> },
            { title: "Candidates", url: "/hrmcubicle/hire/candidates", icon: () => <span className="text-lg">👨‍💼</span> },
            { title: "Interviews", url: "/hrmcubicle/hire/interviews", icon: () => <span className="text-lg">🤝</span> },
            { title: "Offer Letters", url: "/hrmcubicle/hire/offers", icon: () => <span className="text-lg">✉️</span> },
            { title: "Hiring Reports", url: "/hrmcubicle/hire/reports", icon: () => <span className="text-lg">📑</span> },
        ]
    },
    {
        title: "Lifecycle",
        url: "#",
        icon: () => <span className="text-xl">🎓</span>,
        items: [
            { title: "Pre-Onboarding", url: "/hrmcubicle/lifecycle/pre-onboarding", icon: () => <span className="text-lg">⏳</span> },
            { title: "Onboarding", url: "/hrmcubicle/lifecycle/onboarding", icon: () => <span className="text-lg">🚀</span> },
            { title: "Asset Allocation", url: "/hrmcubicle/lifecycle/assets", icon: () => <span className="text-lg">💻</span> },
            { title: "Lifecycle Actions", url: "/hrmcubicle/lifecycle/actions", icon: () => <span className="text-lg">🔄</span> },
            { title: "Probation Management", url: "/hrmcubicle/lifecycle/probation", icon: () => <span className="text-lg">⏱️</span> },
            { title: "Compliance & Policies", url: "/hrmcubicle/lifecycle/compliance", icon: () => <span className="text-lg">📜</span> },
            { title: "Exit Management", url: "/hrmcubicle/lifecycle/offboarding", icon: () => <span className="text-lg">🚪</span> },
            { title: "Clearance Checklist", url: "/hrmcubicle/lifecycle/clearance", icon: () => <span className="text-lg">✅</span> },
            { title: "Full & Final Settlement", url: "/hrmcubicle/lifecycle/settlement", icon: () => <span className="text-lg">💰</span> },
            { title: "Employee History", url: "/hrmcubicle/lifecycle/history", icon: () => <span className="text-lg">📜</span> },
        ]
    },
    {
        title: "Time & Attend",
        url: "#",
        icon: () => <span className="text-xl">⏱️</span>,
        items: [
            { title: "Dashboard", url: "/hrmcubicle/timeattend", icon: () => <span className="text-lg">⏲️</span> },
            { title: "Attendance Tracking", url: "/hrmcubicle/timeattend/attendance", icon: () => <span className="text-lg">📅</span> },
            { title: "Shifts & Holidays", url: "/hrmcubicle/timeattend/shifts", icon: () => <span className="text-lg">🗓️</span> },
            { title: "Overtime", url: "/hrmcubicle/timeattend/overtime", icon: () => <span className="text-lg">⏳</span> },
            { title: "Leave", url: "/hrmcubicle/timeattend/leave", icon: () => <span className="text-lg">🌴</span> },
            { title: "Shift Allowance", url: "/hrmcubicle/timeattend/allowance", icon: () => <span className="text-lg">💵</span> },
            { title: "Approvals", url: "/hrmcubicle/timeattend/approvals", icon: () => <span className="text-lg">✔️</span> },
            { title: "Reports", url: "/hrmcubicle/timeattend/reports", icon: () => <span className="text-lg">📊</span> },
            { title: "Settings", url: "/hrmcubicle/timeattend/settings", icon: () => <span className="text-lg">⚙️</span> },
        ]
    },
    {
        title: "Payroll",
        url: "#",
        icon: () => <span className="text-xl">💰</span>,
        items: [
            { title: "Payroll Dashboard", url: "/hrmcubicle/payroll/dashboard", icon: () => <span className="text-lg">💵</span> },
            { title: "Salary Processing", url: "/hrmcubicle/payroll/processing", icon: () => <span className="text-lg">⚙️</span> },
            { title: "Payslips", url: "/hrmcubicle/payroll/payslips", icon: () => <span className="text-lg">📄</span> },
            { title: "Reimbursements", url: "/hrmcubicle/payroll/reimbursements", icon: () => <span className="text-lg">💸</span> },
            { title: "Tax Declarations", url: "/hrmcubicle/payroll/tax-declarations", icon: () => <span className="text-lg">📑</span> },
            { title: "Proof Submission", url: "/hrmcubicle/payroll/proof-submission", icon: () => <span className="text-lg">📤</span> },
            { title: "Statutory Reports", url: "/hrmcubicle/payroll/statutory-reports", icon: () => <span className="text-lg">⚖️</span> },
        ]
    },
    {
        title: "Performance",
        url: "#",
        icon: () => <span className="text-xl">📊</span>,
        items: [
            { title: "Goals / OKRs", url: "/hrmcubicle/performance/goals", icon: () => <span className="text-lg">🎯</span> },
            { title: "Appraisals", url: "/hrmcubicle/performance/appraisals", icon: () => <span className="text-lg">📝</span> },
            { title: "Reviews", url: "/hrmcubicle/performance/reviews", icon: () => <span className="text-lg">⭐</span> },
            { title: "Feedback", url: "/hrmcubicle/performance/feedback", icon: () => <span className="text-lg">💬</span> },
            { title: "Performance Reports", url: "/hrmcubicle/performance/reports", icon: () => <span className="text-lg">📈</span> },
        ]
    },
    {
        title: "Documents",
        url: "#",
        icon: () => <span className="text-xl">📚</span>,
        items: [
            { title: "Company Policies", url: "/hrmcubicle/documents/policies", icon: () => <span className="text-lg">📖</span> },
            { title: "HR Documents", url: "/hrmcubicle/documents/hr-docs", icon: () => <span className="text-lg">📂</span> },
            { title: "Letters", url: "/hrmcubicle/documents/letters", icon: () => <span className="text-lg">✉️</span> },
            { title: "Templates", url: "/hrmcubicle/documents/templates", icon: () => <span className="text-lg">📝</span> },
            { title: "Acknowledgements", url: "/hrmcubicle/documents/acknowledgements", icon: () => <span className="text-lg">✅</span> },
        ]
    },
    {
        title: "Engage",
        url: "#",
        icon: () => <span className="text-xl">❤️</span>,
        items: [
            { title: "Announcements", url: "/hrmcubicle/engage/announcements", icon: () => <span className="text-lg">📢</span> },
            { title: "Surveys", url: "/hrmcubicle/engage/surveys", icon: () => <span className="text-lg">📋</span> },
            { title: "Employee Feedback", url: "/hrmcubicle/engage/feedback", icon: () => <span className="text-lg">💭</span> },
            { title: "Rewards & Recognition", url: "/hrmcubicle/engage/rewards", icon: () => <span className="text-lg">🏆</span> },
            { title: "Events", url: "/hrmcubicle/engage/events", icon: () => <span className="text-lg">🎉</span> },
        ]
    },
    {
        title: "Helpdesk",
        url: "#",
        icon: () => <span className="text-xl">🎫</span>,
        items: [
            { title: "Helpdesk Dashboard", url: "/hrmcubicle/helpdesk", icon: () => <span className="text-lg">📊</span> },
            { title: "My Tickets", url: "/hrmcubicle/helpdesk?tab=my_tickets", icon: () => <span className="text-lg">🏷️</span> },
            { title: "Support Queue", url: "/hrmcubicle/helpdesk?tab=queue", icon: () => <span className="text-lg">🤝</span> },
        ]
    },
    {
        title: "Admin",
        url: "#",
        icon: () => <span className="text-xl">⚙️</span>,
        items: [
            { title: "Role & Permissions", url: "/hrmcubicle/admin/roles", icon: () => <span className="text-lg">🔒</span> },
            { title: "Workflow Settings", url: "/hrmcubicle/admin/workflows", icon: () => <span className="text-lg">🔀</span> },
            { title: "Approval Matrix", url: "/hrmcubicle/admin/approvals", icon: () => <span className="text-lg">✅</span> },
            { title: "Attendance Rules", url: "/hrmcubicle/admin/attendance", icon: () => <span className="text-lg">⏲️</span> },
            { title: "Payroll Settings", url: "/hrmcubicle/admin/payroll", icon: () => <span className="text-lg">💰</span> },
            { title: "Integrations", url: "/hrmcubicle/admin/integrations", icon: () => <span className="text-lg">🔌</span> },
            { title: "Audit Logs", url: "/hrmcubicle/admin/audit", icon: () => <span className="text-lg">📝</span> },
        ]
    },
]

export function Sidebar({ ...props }: React.ComponentProps<typeof ShadcnSidebar>) {
    const pathname = usePathname()

    return (
        <ShadcnSidebar collapsible="icon" className="top-[63px] h-[calc(100vh-63px)] border-r bg-white" {...props}>
            <SidebarContent className="py-2">
                <SidebarGroup>
                    <SidebarMenu className="gap-2">
                        {hrmNavigation.map((item) => {
                            const isActive = pathname === item.url || (item.items.length > 0 && item.items.some(sub => pathname === sub.url));
                            const hasSubMenu = item.items.length > 0;

                            if (hasSubMenu) {
                                return (
                                    <Collapsible
                                        key={item.title}
                                        asChild
                                        defaultOpen={isActive}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={item.title} isActive={isActive} className="font-medium text-slate-600 h-10 hover:bg-slate-100">
                                                    <item.icon />
                                                    <span className="ml-1">{item.title}</span>
                                                    <ChevronRight className="ml-auto w-4 h-4 text-slate-400 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub className="border-l-slate-200 ml-4">
                                                    {item.items.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild isActive={pathname === subItem.url} className="text-slate-500 h-9 hover:text-slate-900 hover:bg-slate-100 rounded-md">
                                                                <Link href={subItem.url}>
                                                                    {subItem.icon && <subItem.icon />}
                                                                    <span>{subItem.title}</span>
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
                                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title} className="font-medium text-slate-600 h-10 hover:bg-slate-100">
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span className="ml-1">{item.title}</span>
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
