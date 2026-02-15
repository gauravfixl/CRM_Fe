"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
    ChevronRight,
    Star,
    Plus,
    Circle,
    Home,
    Zap,
    History,
    LayoutGrid,
    Users,
    UserPlus,
    FileStack,
    Kanban,
    FileText,
    Calendar,
    PieChart,
    BarChart3,
    Settings,
    HelpCircle,
    ChevronDown,
    ChevronsUpDown,
    Check,
    Trash2
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

import {
    Sidebar,
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
    SidebarHeader,
    useSidebar
} from "@/components/ui/sidebar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { useProjectStore } from "@/shared/data/projects-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import { usePermissions } from "@/shared/hooks/use-permissions"
import { SIDEBAR_CONFIG, SidebarRole } from "./sidebar.config"
import CreateWorkspaceModal from "./create-workspace-modal"

/**
 * SOURCE OF TRUTH: Sidebar Restoration
 * Logic: Config-driven, RBAC-aware, matching high-fidelity screenshots.
 */
export function ProjectSidebar() {
    const pathname = usePathname()
    const { projects } = useProjectStore()
    const { activeWorkspaceId, workspaces, setActiveWorkspace, deleteWorkspace } = useWorkspaceStore()
    const { state } = useSidebar()
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    const permissions = usePermissions({ workspaceId: activeWorkspaceId || undefined })

    const currentUserRole: SidebarRole = React.useMemo(() => {
        if (permissions.role === 'WorkspaceAdmin') return 'Admin'
        if (permissions.role === 'ProjectOwner' || permissions.role === 'ProjectAdmin') return 'Manager'
        return 'Member'
    }, [permissions.role])

    const starredProjects = projects.filter(p => p.starred)

    const filteredConfig = React.useMemo(() => {
        return SIDEBAR_CONFIG
            .filter(section => section.roles.includes(currentUserRole))
            .map(section => ({
                ...section,
                items: section.items
                    .filter(item => item.roles.includes(currentUserRole))
                    .map(item => ({
                        ...item,
                        subItems: item.subItems?.filter(sub => sub.roles.includes(currentUserRole))
                    }))
            }))
    }, [currentUserRole])

    const isActive = (href: string) => {
        if (href === "/projectmanagement") return pathname === "/projectmanagement"
        return pathname.startsWith(href)
    }

    if (!isMounted) return null

    return (
        <Sidebar
            className="border-r border-slate-200 bg-white"
            collapsible="icon"
            style={{ top: "64px", height: "calc(100vh - 64px)" }}
        >
            <SidebarHeader className="pt-4 px-3 pb-0">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className={cn(
                            "flex items-center gap-3 w-full p-2 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-200 group outline-none shadow-sm h-9",
                            state === "collapsed" ? "justify-center" : "justify-start"
                        )}>
                            <span className="text-lg shrink-0 leading-none">
                                {workspaces.find(w => w.id === activeWorkspaceId)?.icon || "🚀"}
                            </span>
                            {state !== "collapsed" && (
                                <>
                                    <div className="flex flex-col items-start flex-1 text-left overflow-hidden">
                                        <span className="text-[13px] font-bold text-slate-900 truncate w-full leading-tight">
                                            {workspaces.find(w => w.id === activeWorkspaceId)?.name || "Select Workspace"}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-medium truncate w-full group-hover:text-slate-700 transition-colors">
                                            Free Plan
                                        </span>
                                    </div>
                                    <ChevronsUpDown size={14} className="text-slate-400 group-hover:text-slate-600 shrink-0 transition-colors" />
                                </>
                            )}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[220px] p-2 rounded-2xl shadow-xl shadow-slate-200/50 border-slate-100 bg-white ml-1">
                        <div className="px-2 py-2 mb-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Switch Workspace</span>
                        </div>
                        {workspaces.map((ws) => (
                            <DropdownMenuItem
                                key={ws.id}
                                onClick={() => setActiveWorkspace(ws.id)}
                                className="flex items-center justify-between p-2 rounded-xl text-[13px] font-bold text-slate-700 cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 mb-0.5 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-lg shadow-sm border border-slate-50">
                                        {ws.icon}
                                    </div>
                                    <span>{ws.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {activeWorkspaceId === ws.id && <Check size={16} className="text-indigo-600" />}
                                    <div
                                        role="button"
                                        className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (workspaces.length <= 1) {
                                                alert("You cannot delete the only remaining workspace.")
                                                return;
                                            }
                                            if (confirm(`Are you sure you want to delete workspace "${ws.name}"? This action cannot be undone.`)) {
                                                deleteWorkspace(ws.id)
                                            }
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </div>
                                </div>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="flex items-center justify-between p-2 rounded-xl text-[13px] font-bold text-indigo-600 cursor-pointer focus:bg-indigo-50 focus:text-indigo-700 mt-1"
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsCreateModalOpen(true)
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-indigo-50 rounded-lg flex items-center justify-center text-lg shadow-sm border border-indigo-50">
                                    <Plus size={16} className="text-indigo-600" />
                                </div>
                                <span>Create New Workspace</span>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarHeader>

            {/* 🏷️ Header for current workspace hub title */}
            {state !== "collapsed" && (
                <div className="px-6 pt-6 pb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] opacity-80">
                        Workspace Hub
                    </span>
                </div>
            )}

            <SidebarContent className="px-3 pt-2 pb-20 space-y-6 custom-scrollbar overflow-x-hidden" style={{ zoom: "0.8" }}>
                {filteredConfig.map((section, sectionIdx) => (
                    <React.Fragment key={section.id}>
                        <SidebarGroup className="p-0">
                            {state !== "collapsed" && section.id !== "workspace-hub" && (
                                <SidebarGroupLabel className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.05em] mb-1.5">
                                    {section.title}
                                </SidebarGroupLabel>
                            )}
                            <SidebarMenu className="gap-[1px]">
                                {section.items.map((item) => (
                                    <SidebarMenuItem key={item.id}>
                                        {item.subItems && item.subItems.length > 0 ? (
                                            <Collapsible key={`collapsible-${item.id}`} className="group/collapsible" defaultOpen={isActive(item.href)}>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton
                                                        className={cn(
                                                            "h-9 px-3 rounded-lg transition-all duration-200 group relative",
                                                            isActive(item.href) ? "bg-slate-100/70 text-slate-900 font-bold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                                        )}
                                                    >
                                                        <div className="flex items-center justify-between w-full">
                                                            <div className="flex items-center gap-3">
                                                                <item.icon size={20} className={cn("transition-colors", isActive(item.href) ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
                                                                {state !== "collapsed" && <span className="text-[14px] tracking-tight">{item.title}</span>}
                                                            </div>
                                                            {state !== "collapsed" && (
                                                                <ChevronRight size={14} className="text-slate-300 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                            )}
                                                        </div>
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub className="ml-8 border-l border-slate-100 gap-0.5 mt-1 pb-1">
                                                        {item.subItems.map((sub) => (
                                                            <SidebarMenuSubItem key={sub.id}>
                                                                <SidebarMenuSubButton asChild isActive={pathname === sub.href}>
                                                                    <Link
                                                                        href={sub.href}
                                                                        className={cn(
                                                                            "flex items-center gap-2 py-2.5 px-3 rounded-lg text-[13.5px] transition-all",
                                                                            pathname === sub.href
                                                                                ? "text-indigo-600 font-bold"
                                                                                : "text-slate-500 hover:text-slate-900"
                                                                        )}
                                                                    >
                                                                        {sub.title}
                                                                    </Link>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        ))}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        ) : (
                                            <SidebarMenuButton
                                                key={`button-${item.id}`}
                                                asChild
                                                isActive={isActive(item.href)}
                                                className={cn(
                                                    "h-9 px-3 rounded-lg transition-all duration-200 group relative",
                                                    isActive(item.href) ? "bg-slate-100/70 text-slate-900 font-bold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                                )}
                                            >
                                                <Link href={item.href} className="flex items-center justify-between w-full">
                                                    <div className="flex items-center gap-3">
                                                        <item.icon size={20} className={cn("transition-colors", isActive(item.href) ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
                                                        {state !== "collapsed" && <span className="text-[14px] tracking-tight">{item.title}</span>}
                                                    </div>
                                                    {state !== "collapsed" && item.isNew && (
                                                        <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                                    )}
                                                </Link>
                                            </SidebarMenuButton>
                                        )}
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroup>

                        {/* ⭐ Starred Projects - Move after Workspace Hub (index 0) */}
                        {sectionIdx === 0 && starredProjects.length > 0 && (
                            <SidebarGroup className="p-0 pt-4">
                                {state !== "collapsed" && (
                                    <SidebarGroupLabel className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3 flex items-center gap-2 opacity-80">
                                        <Star size={12} className="text-amber-400 fill-amber-400" /> Starred
                                    </SidebarGroupLabel>
                                )}
                                <SidebarMenu className="gap-0">
                                    {starredProjects.map((project) => (
                                        <SidebarMenuItem key={project.id}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={pathname.includes(`/projects/${project.id}`)}
                                                className="h-9 px-3 rounded-lg hover:bg-slate-50 text-slate-600 font-semibold group"
                                            >
                                                <Link href={`/projectmanagement/projects/${project.id}/board`} className="flex items-center gap-3">
                                                    <div className="h-7 w-7 rounded-lg bg-white flex items-center justify-center text-[15px] shadow-sm border border-slate-100 group-hover:bg-indigo-50 transition-all font-sans">
                                                        {project.icon || "🚀"}
                                                    </div>
                                                    {state !== "collapsed" && <span className="text-[13.5px] truncate tracking-tight">{project.name}</span>}
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroup>
                        )}
                    </React.Fragment>
                ))}
            </SidebarContent>
            <CreateWorkspaceModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </Sidebar>
    )
}
