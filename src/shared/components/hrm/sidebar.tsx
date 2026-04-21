"use client"

import * as React from "react"
import { useMemo, memo } from "react"
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
import { useRoleAccess } from "@/shared/hooks/use-role-access"

// Exact Keka-style Navigation Data based on Document Analysis
// using Colorful Icons (Emojis) to match the "colorful" requirement
const hrmNavigation = [
    {
        title: "Home",
        url: "/hrmcubicle",
        icon: <span className="text-xl">🏠</span>,
        items: []
    },
    {
        title: "Me",
        url: "#",
        icon: <span className="text-xl">👤</span>,
        items: [
            {
                title: "My Identity",
                url: "#",
                icon: <span className="text-lg">🪪</span>,
                items: [
                    { title: "My Profile", url: "/hrmcubicle/me", icon: <span className="text-base">🆔</span> },
                    { title: "My Documents", url: "/hrmcubicle/me/documents", icon: <span className="text-base">📂</span> },
                    { title: "My Assets", url: "/hrmcubicle/me/assets", icon: <span className="text-base">💻</span> },
                ]
            },
            {
                title: "My Time",
                url: "#",
                icon: <span className="text-lg">⏱️</span>,
                items: [
                    { title: "My Attendance", url: "/hrmcubicle/attendance", icon: <span className="text-base">📅</span> },
                    { title: "My Leave", url: "/hrmcubicle/leave", icon: <span className="text-base">🌴</span> },
                    { title: "My Holidays", url: "/hrmcubicle/me/holidays", icon: <span className="text-base">🎉</span> },
                ]
            },
            {
                title: "My Finance",
                url: "#",
                icon: <span className="text-lg">💰</span>,
                items: [
                    { title: "My Payslips", url: "/hrmcubicle/me/payslips", icon: <span className="text-base">🧾</span> },
                    { title: "My Finances", url: "/hrmcubicle/my-finances", icon: <span className="text-base">💵</span> },
                    { title: "My Expenses", url: "/hrmcubicle/me/expenses", icon: <span className="text-base">💳</span> },
                    { title: "My Tax", url: "/hrmcubicle/me/tax", icon: <span className="text-base">📑</span> },
                ]
            },
            {
                title: "My Growth",
                url: "#",
                icon: <span className="text-lg">📈</span>,
                items: [
                    { title: "My Performance", url: "/hrmcubicle/performance", icon: <span className="text-base">📊</span> },
                    { title: "My Goals", url: "/hrmcubicle/me/goals", icon: <span className="text-base">🎯</span> },
                    { title: "My Training", url: "/hrmcubicle/me/training", icon: <span className="text-base">📚</span> },
                ]
            },
            {
                title: "My Support",
                url: "#",
                icon: <span className="text-lg">🎧</span>,
                items: [
                    { title: "My Helpdesk", url: "/hrmcubicle/me/helpdesk", icon: <span className="text-base">🎫</span> },
                    { title: "My Announcements", url: "/hrmcubicle/me/announcements", icon: <span className="text-base">📢</span> },
                ]
            },
        ]
    },
    {
        title: "Inbox",
        url: "#",
        icon: <span className="text-xl">📥</span>,
        items: [
            { title: "Approvals", url: "/hrmcubicle/inbox/approvals", icon: <span className="text-lg">✅</span> },
            { title: "Notifications", url: "/hrmcubicle/inbox/notifications", icon: <span className="text-lg">🔔</span> },
            { title: "Requests", url: "/hrmcubicle/inbox/requests", icon: <span className="text-lg">📨</span> },
        ]
    },
    {
        title: "My Team",
        url: "#",
        icon: <span className="text-xl">👥</span>,
        items: [
            {
                title: "Team Overview",
                url: "/hrmcubicle/my-team",
                icon: <span className="text-lg">📊</span>,
                isNew: true
            },
            {
                title: "Team Members",
                url: "/hrmcubicle/my-team/members",
                icon: <span className="text-lg">🧑‍💼</span>
            },
            {
                title: "Team Attendance",
                url: "/hrmcubicle/my-team/attendance",
                icon: <span className="text-lg">⏱️</span>
            },
            {
                title: "Team Leave",
                url: "/hrmcubicle/my-team/leave",
                icon: <span className="text-lg">🌴</span>
            },
            {
                title: "Team Requests",
                url: "/hrmcubicle/my-team/requests",
                icon: <span className="text-lg">📥</span>,
                badge: "12"
            },
            {
                title: "Team Performance",
                url: "/hrmcubicle/my-team/performance",
                icon: <span className="text-lg">📈</span>
            },
            {
                title: "Team Calendar",
                url: "/hrmcubicle/my-team/calendar",
                icon: <span className="text-lg">🗓️</span>
            },
        ]
    },
    {
        title: "Organization",
        url: "#",
        icon: <span className="text-xl">🏢</span>,
        items: [
            { title: "Org Dashboard", url: "/hrmcubicle/organization/dashboard", icon: <span className="text-lg">📉</span> },
            { title: "Company Profile", url: "/hrmcubicle/organization/company-profile", icon: <span className="text-lg">🏛️</span> },
            { title: "Employees", url: "/hrmcubicle/organization/employees", icon: <span className="text-lg">🧑‍🤝‍🧑</span> },
            { title: "Departments", url: "/hrmcubicle/organization/departments", icon: <span className="text-lg">🏗️</span> },
            { title: "Designations", url: "/hrmcubicle/organization/designations", icon: <span className="text-lg">🏷️</span> },
            { title: "Locations", url: "/hrmcubicle/organization/locations", icon: <span className="text-lg">📍</span> },
            { title: "Holidays", url: "/hrmcubicle/organization/holidays", icon: <span className="text-lg">📅</span> },
            { title: "Policy Center", url: "/hrmcubicle/organization/policies", icon: <span className="text-lg">📜</span> },
            { title: "Teams Workhub", url: "/hrmcubicle/organization/teams", icon: <span className="text-lg">🤝</span> },
            { title: "Org Chart", url: "/hrmcubicle/organization/chart", icon: <span className="text-lg">🌳</span> },
        ]
    },
    {
        title: "Hire",
        url: "#",
        icon: <span className="text-xl">🚀</span>,
        items: [
            { title: "Job Openings", url: "/hrmcubicle/hire/jobs", icon: <span className="text-lg">📢</span> },
            { title: "Candidates", url: "/hrmcubicle/hire/candidates", icon: <span className="text-lg">👨‍💼</span> },
            { title: "Interviews", url: "/hrmcubicle/hire/interviews", icon: <span className="text-lg">🤝</span> },
            { title: "Offer Letters", url: "/hrmcubicle/hire/offers", icon: <span className="text-lg">✉️</span> },
            { title: "Hiring Reports", url: "/hrmcubicle/hire/reports", icon: <span className="text-lg">📑</span> },
            { title: "Career Page", url: "/hrmcubicle/hire/career-page", icon: <span className="text-lg">🌐</span> },
            { title: "Referrals", url: "/hrmcubicle/hire/referrals", icon: <span className="text-lg">🤝</span> },
            { title: "Resume Parser", url: "/hrmcubicle/hire/resume-parser", icon: <span className="text-lg">📄</span> },
            { title: "Scorecards", url: "/hrmcubicle/hire/scorecards", icon: <span className="text-lg">📋</span> },
        ]
    },
    {
        title: "Lifecycle",
        url: "#",
        icon: <span className="text-xl">🎓</span>,
        items: [
            { title: "Pre-Onboarding", url: "/hrmcubicle/lifecycle/pre-onboarding", icon: <span className="text-lg">⏳</span> },
            { title: "Onboarding", url: "/hrmcubicle/lifecycle/onboarding", icon: <span className="text-lg">🚀</span> },
            { title: "Asset Allocation", url: "/hrmcubicle/lifecycle/assets", icon: <span className="text-lg">💻</span> },
            { title: "Lifecycle Actions", url: "/hrmcubicle/lifecycle/actions", icon: <span className="text-lg">🔄</span> },
            { title: "Probation Management", url: "/hrmcubicle/lifecycle/probation", icon: <span className="text-lg">⏱️</span> },
            { title: "Compliance & Policies", url: "/hrmcubicle/lifecycle/compliance", icon: <span className="text-lg">📜</span> },
            { title: "Exit Management", url: "/hrmcubicle/lifecycle/offboarding", icon: <span className="text-lg">🚪</span> },
            { title: "Clearance Checklist", url: "/hrmcubicle/lifecycle/clearance", icon: <span className="text-lg">✅</span> },
            { title: "Full & Final Settlement", url: "/hrmcubicle/lifecycle/settlement", icon: <span className="text-lg">💰</span> },
            { title: "Employee History", url: "/hrmcubicle/lifecycle/history", icon: <span className="text-lg">📜</span> },
        ]
    },
    {
        title: "Time & Attend",
        url: "#",
        icon: <span className="text-xl">⏱️</span>,
        items: [
            { title: "Dashboard", url: "/hrmcubicle/timeattend", icon: <span className="text-lg">⏲️</span> },
            { title: "Attendance Tracking", url: "/hrmcubicle/timeattend/attendance", icon: <span className="text-lg">📅</span> },
            { title: "Shifts & Holidays", url: "/hrmcubicle/timeattend/shifts", icon: <span className="text-lg">🗓️</span> },
            { title: "Overtime", url: "/hrmcubicle/timeattend/overtime", icon: <span className="text-lg">⏳</span> },
            { title: "Leave", url: "/hrmcubicle/timeattend/leave", icon: <span className="text-lg">🌴</span> },
            { title: "Shift Allowance", url: "/hrmcubicle/timeattend/allowance", icon: <span className="text-lg">💵</span> },
            { title: "Approvals", url: "/hrmcubicle/timeattend/approvals", icon: <span className="text-lg">✔️</span> },
            { title: "Comp-Off", url: "/hrmcubicle/timeattend/comp-off", icon: <span className="text-lg">🔄</span> },
            { title: "Reports", url: "/hrmcubicle/timeattend/reports", icon: <span className="text-lg">📊</span> },
            { title: "Settings", url: "/hrmcubicle/timeattend/settings", icon: <span className="text-lg">⚙️</span> },
        ]
    },
    {
        title: "Payroll",
        url: "#",
        icon: <span className="text-xl">💰</span>,
        items: [
            { title: "Payroll Dashboard", url: "/hrmcubicle/payroll/dashboard", icon: <span className="text-lg">💵</span> },
            { title: "Salary Processing", url: "/hrmcubicle/payroll/processing", icon: <span className="text-lg">⚙️</span> },
            { title: "Payslips", url: "/hrmcubicle/payroll/payslips", icon: <span className="text-lg">📄</span> },
            { title: "Reimbursements", url: "/hrmcubicle/payroll/reimbursements", icon: <span className="text-lg">💸</span> },
            { title: "Tax Declarations", url: "/hrmcubicle/payroll/tax-declarations", icon: <span className="text-lg">📑</span> },
            { title: "Proof Submission", url: "/hrmcubicle/payroll/proof-submission", icon: <span className="text-lg">📤</span> },
            { title: "Payroll Reports", url: "/hrmcubicle/payroll/payroll-reports", icon: <span className="text-lg">📊</span> },
            { title: "Payroll Settings", url: "/hrmcubicle/payroll/payroll-settings", icon: <span className="text-lg">⚙️</span> },
            { title: "Salary Structure", url: "/hrmcubicle/payroll/salary-structure", icon: <span className="text-lg">🏗️</span> },
            { title: "Statutory Compliance", url: "/hrmcubicle/payroll/statutory", icon: <span className="text-lg">🏛️</span> },
            { title: "Loans & Advances", url: "/hrmcubicle/payroll/loans", icon: <span className="text-lg">🏦</span> },
            { title: "Salary Revision", url: "/hrmcubicle/payroll/salary-revision", icon: <span className="text-lg">📊</span> },
            { title: "Multi-Entity", url: "/hrmcubicle/payroll/multi-entity", icon: <span className="text-lg">🏢</span> },
        ]
    },
    {
        title: "Performance",
        url: "#",
        icon: <span className="text-xl">📊</span>,
        items: [
            { title: "Goals / OKRs", url: "/hrmcubicle/performance/goals", icon: <span className="text-lg">🎯</span> },
            { title: "Appraisals", url: "/hrmcubicle/performance/appraisals", icon: <span className="text-lg">📝</span> },
            { title: "Reviews", url: "/hrmcubicle/performance/reviews", icon: <span className="text-lg">⭐</span> },
            { title: "Feedback", url: "/hrmcubicle/performance/feedback", icon: <span className="text-lg">💬</span> },
            { title: "Performance Reports", url: "/hrmcubicle/performance/reports", icon: <span className="text-lg">📈</span> },
            { title: "Calibration", url: "/hrmcubicle/performance/calibration", icon: <span className="text-lg">📐</span> },
            { title: "PIP Tracking", url: "/hrmcubicle/performance/pip", icon: <span className="text-lg">📉</span> },
            { title: "Compensation Review", url: "/hrmcubicle/performance/compensation", icon: <span className="text-lg">💵</span> },
        ]
    },
    {
        title: "Documents",
        url: "#",
        icon: <span className="text-xl">📚</span>,
        items: [
            { title: "Company Policies", url: "/hrmcubicle/documents/policies", icon: <span className="text-lg">📖</span> },
            { title: "HR Documents", url: "/hrmcubicle/documents/hr-docs", icon: <span className="text-lg">📂</span> },
            { title: "Letters", url: "/hrmcubicle/documents/letters", icon: <span className="text-lg">✉️</span> },
            { title: "Templates", url: "/hrmcubicle/documents/templates", icon: <span className="text-lg">📝</span> },
            { title: "Acknowledgements", url: "/hrmcubicle/documents/acknowledgements", icon: <span className="text-lg">✅</span> },
            { title: "E-Signatures", url: "/hrmcubicle/documents/e-signatures", icon: <span className="text-lg">✍️</span> },
            { title: "Bulk Letters", url: "/hrmcubicle/documents/bulk-letters", icon: <span className="text-lg">📮</span> },
        ]
    },
    {
        title: "Engage",
        url: "#",
        icon: <span className="text-xl">❤️</span>,
        items: [
            { title: "Announcements", url: "/hrmcubicle/engage/announcements", icon: <span className="text-lg">📢</span> },
            { title: "Surveys", url: "/hrmcubicle/engage/surveys", icon: <span className="text-lg">📋</span> },
            { title: "Employee Feedback", url: "/hrmcubicle/engage/feedback", icon: <span className="text-lg">💭</span> },
            { title: "Rewards & Recognition", url: "/hrmcubicle/engage/rewards", icon: <span className="text-lg">🏆</span> },
            { title: "Events", url: "/hrmcubicle/engage/events", icon: <span className="text-lg">🎉</span> },
            { title: "Celebrations", url: "/hrmcubicle/engage/celebrations", icon: <span className="text-lg">🎂</span> },
            { title: "Social Feed", url: "/hrmcubicle/engage/social-feed", icon: <span className="text-lg">💬</span> },
        ]
    },
    {
        title: "Helpdesk",
        url: "#",
        icon: <span className="text-xl">🎫</span>,
        items: [
            { title: "Dashboard", url: "/hrmcubicle/helpdesk", icon: <span className="text-lg">📊</span> },
            { title: "My Tickets", url: "/hrmcubicle/helpdesk/my-tickets", icon: <span className="text-lg">🏷️</span> },
            { title: "Support Queue", url: "/hrmcubicle/helpdesk/support-queue", icon: <span className="text-lg">🤝</span> },
            { title: "Knowledge Base", url: "/hrmcubicle/helpdesk/knowledge-base", icon: <span className="text-lg">📚</span> },
            { title: "Agent Management", url: "/hrmcubicle/helpdesk/agent-management", icon: <span className="text-lg">🧑‍🤝‍🧑</span> },
            { title: "Reports & Analytics", url: "/hrmcubicle/helpdesk/reports", icon: <span className="text-lg">📉</span> },
            { title: "Settings", url: "/hrmcubicle/helpdesk/settings", icon: <span className="text-lg">⚙️</span> },
        ]
    },
    {
        title: "Expenses",
        url: "#",
        icon: <span className="text-xl">💳</span>,
        items: [
            { title: "Dashboard", url: "/hrmcubicle/expenses", icon: <span className="text-lg">📊</span> },
            { title: "My Claims", url: "/hrmcubicle/expenses/claims", icon: <span className="text-lg">🧾</span> },
            { title: "Travel", url: "/hrmcubicle/expenses/travel", icon: <span className="text-lg">✈️</span> },
            { title: "Approvals", url: "/hrmcubicle/expenses/approvals", icon: <span className="text-lg">✅</span> },
            { title: "Reports", url: "/hrmcubicle/expenses/reports", icon: <span className="text-lg">📑</span> },
            { title: "Settings", url: "/hrmcubicle/expenses/settings", icon: <span className="text-lg">⚙️</span> },
        ]
    },
    {
        title: "Timesheets",
        url: "/hrmcubicle/timesheets",
        icon: <span className="text-xl">⏰</span>,
        items: []
    },
    {
        title: "Reports Hub",
        url: "#",
        icon: <span className="text-xl">📊</span>,
        items: [
            { title: "Dashboard", url: "/hrmcubicle/reports", icon: <span className="text-lg">📈</span> },
            { title: "Report Builder", url: "/hrmcubicle/reports/builder", icon: <span className="text-lg">🔧</span> },
            { title: "Scheduled", url: "/hrmcubicle/reports/scheduled", icon: <span className="text-lg">📅</span> },
            { title: "Templates", url: "/hrmcubicle/reports/templates", icon: <span className="text-lg">📋</span> },
        ]
    },
    {
        title: "Settings",
        url: "#",
        icon: <span className="text-xl">⚙️</span>,
        items: [
            { title: "Role & Permissions", url: "/hrmcubicle/admin/roles", icon: <span className="text-lg">🔒</span> },
            { title: "Workflows & Approvals", url: "/hrmcubicle/admin/approvals", icon: <span className="text-lg">🔀</span> },
            { title: "Automation & Rules", url: "/hrmcubicle/admin/rules", icon: <span className="text-lg">⚡</span> },
            { title: "Attendance Rules", url: "/hrmcubicle/admin/attendance", icon: <span className="text-lg">⏲️</span> },
            { title: "Payroll Settings", url: "/hrmcubicle/admin/payroll", icon: <span className="text-lg">💰</span> },
            { title: "Integrations", url: "/hrmcubicle/admin/integrations", icon: <span className="text-lg">🔌</span> },
            { title: "Audit Logs", url: "/hrmcubicle/admin/audit", icon: <span className="text-lg">📝</span> },
            { title: "Delegation", url: "/hrmcubicle/admin/delegation", icon: <span className="text-lg">🔀</span> },
            { title: "Escalation Rules", url: "/hrmcubicle/admin/escalation", icon: <span className="text-lg">⬆️</span> },
        ]
    },
]

function SidebarComponent({ ...props }: React.ComponentProps<typeof ShadcnSidebar>) {
    const pathname = usePathname()
    const { filterModuleSidebar } = useRoleAccess()

    // Filter navigation based on OrgAdmin role permissions
    const filteredNavigation = useMemo(() => {
        return filterModuleSidebar(hrmNavigation, "hrm")
    }, [filterModuleSidebar])

    // Recursively check if any descendant url matches current pathname
    const isBranchActive = (node: any): boolean => {
        if (node?.url && node.url !== "#" && pathname === node.url) return true;
        if (Array.isArray(node?.items) && node.items.length > 0) {
            return node.items.some((child: any) => isBranchActive(child));
        }
        return false;
    };

    // Precalculate active states to avoid multiple scans during render
    const navWithActive = useMemo(() => {
        return filteredNavigation.map(item => ({
            ...item,
            isActive: isBranchActive(item)
        }));
    }, [pathname, filteredNavigation]);

    return (
        <ShadcnSidebar collapsible="icon" className="top-[63px] h-[calc(100vh-63px)] border-r bg-white" {...props}>
            <SidebarContent className="py-2 text-[13px]">
                <SidebarGroup>
                    <SidebarMenu className="gap-1">
                        {navWithActive.map((item) => {
                            const isActive = item.isActive;
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
                                                <SidebarMenuButton tooltip={item.title} isActive={isActive} className="font-medium text-slate-600 h-9 text-[13px] hover:bg-slate-100 group-data-[collapsible=icon]:justify-center">
                                                    <span className="flex items-center justify-center shrink-0 text-[16px]">{item.icon}</span>
                                                    <span className="ml-1 truncate group-data-[collapsible=icon]:hidden" title={item.title}>{item.title}</span>
                                                    <ChevronRight className="ml-auto w-3 h-3 text-slate-400 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="transition-all duration-300 ease-in-out">
                                                <SidebarMenuSub className="border-l-slate-200 ml-2">
                                                    {item.items.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild isActive={pathname === subItem.url} className="text-slate-500 h-8 text-[12.5px] hover:text-slate-900 hover:bg-slate-100 rounded-md">
                                                                <Link href={subItem.url} prefetch={true} className="flex w-full items-center">
                                                                    <span className="shrink-0 text-[13px]">{subItem.icon}</span>
                                                                    <span className="ml-1 truncate" title={subItem.title}>{subItem.title}</span>
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
                                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title} className="font-medium text-slate-600 h-9 text-[13px] hover:bg-slate-100 group-data-[collapsible=icon]:justify-center">
                                        <Link href={item.url} prefetch={true} className="flex w-full items-center group-data-[collapsible=icon]:justify-center">
                                            <span className="shrink-0 flex items-center justify-center text-[16px]">{item.icon}</span>
                                            <span className="ml-1 truncate group-data-[collapsible=icon]:hidden" title={item.title}>{item.title}</span>
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
export const Sidebar = memo(SidebarComponent);
