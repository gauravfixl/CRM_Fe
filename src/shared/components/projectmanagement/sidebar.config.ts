import {
    Home,
    Zap,
    Clock,
    Layout,
    Users,
    UserPlus,
    FileStack,
    BarChart3,
    PieChart,
    Settings,
    HelpCircle,
    Calendar,
    FileText,
    Kanban,
    LayoutGrid,
    LayoutList,
    CalendarDays
} from "lucide-react"

export type SidebarRole = 'Admin' | 'Manager' | 'Member'

export interface SidebarSubItem {
    id: string
    title: string
    href: string
    roles: SidebarRole[]
    icon?: any
}

export interface SidebarItem {
    id: string
    title: string
    icon: any
    href: string
    roles: SidebarRole[]
    badge?: string
    isNew?: boolean
    subItems?: SidebarSubItem[]
}

export interface SidebarSection {
    id: string
    title: string
    items: SidebarItem[]
    roles: SidebarRole[]
}

export const SIDEBAR_CONFIG: SidebarSection[] = [
    {
        id: "workspace-hub",
        title: "Workspace Hub",
        roles: ["Admin", "Manager", "Member"],
        items: [
            { id: "home", title: "Home", icon: Home, href: "/projectmanagement", roles: ["Admin", "Manager", "Member"] },
            { id: "for-you", title: "My Work", icon: Zap, href: "/projectmanagement/for-you", roles: ["Admin", "Manager", "Member"], isNew: true },
            { id: "recent", title: "Recent", icon: Clock, href: "/projectmanagement/recent", roles: ["Admin", "Manager", "Member"], isNew: true },
            {
                id: "projects",
                title: "Projects",
                icon: Layout,
                href: "/projectmanagement/projects",
                roles: ["Admin", "Manager", "Member"],
                subItems: [
                    { id: "all-projects", title: "All Projects", href: "/projectmanagement/projects", roles: ["Admin", "Manager", "Member"] },
                    { id: "archived-projects", title: "Archived", href: "/projectmanagement/projects?filter=archived", roles: ["Admin", "Manager", "Member"] },
                ]
            },
            { id: "teams", title: "Teams", icon: Users, href: "/projectmanagement/teams", roles: ["Admin", "Manager", "Member"] },
            { id: "people", title: "People", icon: UserPlus, href: "/projectmanagement/people", roles: ["Admin", "Manager"] },
            { id: "templates", title: "Templates", icon: FileStack, href: "/projectmanagement/templates", roles: ["Admin", "Manager"] },
        ]
    },
    {
        id: "execution",
        title: "Execution",
        roles: ["Admin", "Manager", "Member"],
        items: [
            {
                id: "tasks",
                title: "Tasks",
                icon: Kanban,
                href: "/projectmanagement/my-work",
                roles: ["Admin", "Manager", "Member"],
                subItems: [
                    { id: "my-tasks", title: "My Tasks", href: "/projectmanagement/my-work?tab=assigned", roles: ["Admin", "Manager", "Member"] },
                    { id: "team-tasks", title: "Team Tasks", href: "/projectmanagement/my-work?tab=team", roles: ["Admin", "Manager", "Member"] },
                    { id: "all-tasks", title: "All Tasks", href: "/projectmanagement/my-work?tab=all", roles: ["Admin", "Manager", "Member"] },
                    { id: "board-view", title: "Board View", href: "/projectmanagement/boards", roles: ["Admin", "Manager", "Member"], icon: LayoutGrid },
                    { id: "list-view", title: "List View", href: "/projectmanagement/list", roles: ["Admin", "Manager", "Member"], icon: LayoutList },
                    { id: "calendar-view", title: "Calendar View", href: "/projectmanagement/calendar", roles: ["Admin", "Manager", "Member"], icon: CalendarDays },
                ]
            },
            {
                id: "documents",
                title: "Documents",
                icon: FileText,
                href: "/projectmanagement/assets",
                roles: ["Admin", "Manager", "Member"],
                subItems: [
                    { id: "my-docs", title: "My Documents", href: "/projectmanagement/assets?scope=my", roles: ["Admin", "Manager", "Member"] },
                    { id: "project-docs", title: "Project Documents", href: "/projectmanagement/assets?scope=project", roles: ["Admin", "Manager", "Member"] },
                    { id: "workspace-assets", title: "Workspace Assets", href: "/projectmanagement/assets?scope=workspace", roles: ["Admin", "Manager", "Member"] },
                ]
            },
            { id: "calendar", title: "Calendar", icon: Calendar, href: "/projectmanagement/calendar", roles: ["Admin", "Manager", "Member"] },
        ]
    },
    {
        id: "insights",
        title: "Insights",
        roles: ["Admin", "Manager"],
        items: [
            { id: "dashboards", title: "Dashboards", icon: PieChart, href: "/projectmanagement/analytics", roles: ["Admin", "Manager"], isNew: true },
            {
                id: "reports",
                title: "Reports",
                icon: BarChart3,
                href: "/projectmanagement/reports",
                roles: ["Admin", "Manager"],
                subItems: [
                    { id: "sprint-progress", title: "Sprint / Progress", href: "/projectmanagement/reports/sprint", roles: ["Admin", "Manager"] },
                    { id: "workload", title: "Workload", href: "/projectmanagement/reports/workload", roles: ["Admin", "Manager"] },
                    { id: "performance", title: "Performance", href: "/projectmanagement/reports/performance", roles: ["Admin", "Manager"] },
                ]
            },
        ]
    },
    {
        id: "system",
        title: "System",
        roles: ["Admin"],
        items: [
            { id: "settings", title: "Settings", icon: Settings, href: "/projectmanagement/workspace/settings", roles: ["Admin"] },
            { id: "help", title: "Help & Docs", icon: HelpCircle, href: "/projectmanagement/help", roles: ["Admin", "Manager", "Member"] },
        ]
    }
]
