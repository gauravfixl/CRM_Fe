"use client"

import React, { useState, useMemo, useEffect } from "react"
import {
    Plus,
    Search,
    LayoutGrid,
    SearchX,
    Star,
    MoreHorizontal,
    ArrowRight,
    History,
    ChevronDown,
    Trash2,
    Settings2,
    ChevronRight,
    CheckCircle2,
    Clock,
    Pause
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { useProjectStore, Project, ProjectStatus } from "@/shared/data/projects-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import { useTeamStore } from "@/shared/data/team-store"
import Link from "next/link"
import { cn } from "@/lib/utils"
import CreateProjectModal from "@/shared/components/projectmanagement/create-project-modal"

type StatusFilter = "all" | "Active" | "Planned" | "On Hold" | "Completed" | "Archived"

export default function ProjectsPage() {
    const [mounted, setMounted] = useState(false)
    const { getProjectsByWorkspace, toggleStar, deleteProject } = useProjectStore()
    const { activeWorkspaceId } = useWorkspaceStore()
    const { members } = useTeamStore()
    const searchParams = useSearchParams()

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState<"name" | "recent">("name")
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

    useEffect(() => {
        setMounted(true)
        useProjectStore.persist.rehydrate()
        useWorkspaceStore.persist.rehydrate()
        useTeamStore.persist.rehydrate()
    }, [])

    // Sync URL query to filter
    useEffect(() => {
        const status = searchParams.get("status") as StatusFilter | null
        const filter = searchParams.get("filter")
        if (status && ["Active", "Planned", "On Hold", "Completed"].includes(status)) {
            setStatusFilter(status)
        } else if (filter === "archived") {
            setStatusFilter("Archived")
        }
    }, [searchParams])

    const projects = (mounted && activeWorkspaceId) ? getProjectsByWorkspace(activeWorkspaceId) : []

    const filteredProjects = useMemo(() => {
        let result = projects.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.key.toLowerCase().includes(searchQuery.toLowerCase())
        )

        if (statusFilter === "Archived") {
            result = result.filter(p => p.status === "Closing")
        } else if (statusFilter !== "all") {
            result = result.filter(p => p.status === statusFilter)
        }

        if (sortBy === "name") {
            result.sort((a, b) => a.name.localeCompare(b.name))
        }

        return result
    }, [projects, searchQuery, sortBy, statusFilter])

    const getLeadName = (leadId: string) => {
        return members.find(m => m.id === leadId)?.name || "External Lead"
    }

    if (!mounted) return null

    const activeCount = projects.filter(p => p.status === "Active").length
    const completedCount = projects.filter(p => p.status === "Completed").length
    const onHoldCount = projects.filter(p => p.status === "On Hold").length
    const archivedCount = projects.filter(p => p.status === "Closing").length

    const kpis: { label: string; value: number; icon: React.ReactNode; color: string; bg: string; filter: StatusFilter }[] = [
        { label: "Active", value: activeCount, icon: <LayoutGrid size={18} />, color: "text-indigo-800", bg: "bg-indigo-100", filter: "Active" },
        { label: "Completed", value: completedCount, icon: <CheckCircle2 size={18} />, color: "text-emerald-800", bg: "bg-emerald-100", filter: "Completed" },
        { label: "On Hold", value: onHoldCount, icon: <Pause size={18} />, color: "text-amber-800", bg: "bg-amber-100", filter: "On Hold" },
        { label: "Archived", value: archivedCount, icon: <Trash2 size={18} />, color: "text-rose-800", bg: "bg-rose-100", filter: "Archived" },
    ]

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-4 py-4 animate-in fade-in duration-500 px-6 pb-20 font-outfit">
            {/* Mini Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 bg-indigo-600 flex items-center justify-center text-white shadow-sm rounded-none">
                            <LayoutGrid size={14} />
                        </div>
                        <h1 className="text-lg font-bold text-slate-900 tracking-tight">Project Directory</h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <Input
                            placeholder="Find projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-8 w-[200px] bg-white border border-slate-200 text-[12px] rounded-none"
                        />
                    </div>
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[12px] flex items-center gap-2 rounded-none"
                    >
                        <Plus size={14} strokeWidth={3} />
                        New Project
                    </Button>
                </div>
            </div>

            {/* KPI cards — clickable, set status filter on click */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((stat, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => setStatusFilter(stat.filter)}
                        className={cn(
                            "block border shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all h-[75px] rounded-none cursor-pointer text-left",
                            stat.bg,
                            statusFilter === stat.filter && "ring-2 ring-indigo-500"
                        )}
                    >
                        <div className="p-4 flex items-center justify-between w-full h-full">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 bg-white ${stat.color} flex items-center justify-center shrink-0 rounded-none`}>
                                    {stat.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight leading-none">{stat.label}</span>
                                    <span className="text-xl font-black text-slate-900 leading-none mt-1.5">{stat.value}</span>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-500/60" />
                        </div>
                    </button>
                ))}
            </div>

            {/* Filters Row */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                <div className="flex items-center gap-5">
                    {(["all", "Active", "On Hold", "Completed", "Archived"] as StatusFilter[]).map(t => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setStatusFilter(t)}
                            className={cn(
                                "text-[12px] font-bold pb-1 px-1 transition-colors border-b-2",
                                statusFilter === t
                                    ? "text-indigo-600 border-indigo-600"
                                    : "text-slate-400 hover:text-slate-600 border-transparent"
                            )}
                        >
                            {t === "all" ? "All" : t}
                        </button>
                    ))}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-7 px-2 hover:bg-slate-50 text-[11px] font-bold gap-1 text-slate-500 rounded-none">
                            Sort: {sortBy === "name" ? "A-Z" : "Updated"} <ChevronDown size={12} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px] p-1 shadow-xl border-slate-100">
                        <DropdownMenuItem onClick={() => setSortBy("name")} className="text-[12px] font-medium py-1.5">Alphabetical</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("recent")} className="text-[12px] font-medium py-1.5">Recently Updated</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Core Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProjects.map((project) => (
                    <Card key={project.id} className="group border border-slate-100 shadow-sm hover:shadow-md transition-all bg-white overflow-hidden flex flex-col h-full rounded-none">
                        <div className="p-4 flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                                <Link href={`/projectmanagement/projects/${project.id}/board`}>
                                    <div className="h-10 w-10 bg-slate-50 flex items-center justify-center text-[20px] shadow-sm border border-slate-100 group-hover:bg-indigo-50 transition-colors cursor-pointer font-sans rounded-none">
                                        {project.icon || "🚀"}
                                    </div>
                                </Link>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => toggleStar(project.id)}
                                        className={cn(
                                            "h-7 w-7 flex items-center justify-center transition-all rounded-none",
                                            project.starred ? "text-amber-500 hover:bg-amber-50" : "text-slate-200 hover:text-amber-400 hover:bg-slate-50"
                                        )}
                                        aria-label={project.starred ? "Unstar project" : "Star project"}
                                    >
                                        <Star size={16} className={project.starred ? "fill-current" : ""} />
                                    </button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="h-7 w-7 text-slate-300 hover:text-slate-900 flex items-center justify-center transition-all rounded-none">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[180px] p-1 shadow-xl border-slate-100">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/projectmanagement/projects/${project.id}/settings`} className="flex items-center gap-2 text-[12px] font-bold py-2 w-full">
                                                    <Settings2 size={14} /> Settings
                                                </Link>
                                            </DropdownMenuItem>
                                            <div className="h-px bg-slate-50 my-1" />
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    if (confirm(`Archive project ${project.name}?`)) deleteProject(project.id)
                                                }}
                                                className="flex items-center gap-2 text-[12px] font-bold text-rose-500 py-2 focus:bg-rose-50"
                                            >
                                                <Trash2 size={14} /> Archive
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Link href={`/projectmanagement/projects/${project.id}/board`}>
                                    <h3 className="text-[14px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight truncate leading-tight cursor-pointer">
                                        {project.name}
                                    </h3>
                                </Link>
                                <div className="flex items-center gap-1.5">
                                    <Badge className="bg-slate-50 text-slate-400 hover:bg-slate-50 border-none font-bold text-[8px] uppercase tracking-widest px-1 h-3.5 rounded-none">
                                        {project.key}
                                    </Badge>
                                    <Badge className={cn(
                                        "border-none font-bold text-[8px] uppercase tracking-widest px-1 h-3.5 rounded-none",
                                        project.status === "Active" ? "bg-emerald-50 text-emerald-700" :
                                            project.status === "Completed" ? "bg-indigo-50 text-indigo-700" :
                                                project.status === "On Hold" ? "bg-amber-50 text-amber-700" :
                                                    "bg-slate-50 text-slate-500"
                                    )}>
                                        {project.status}
                                    </Badge>
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-2 h-[32px] mt-1.5 leading-relaxed">
                                    {project.description || "Project execution cluster for " + project.name}
                                </p>
                            </div>

                            <div className="pt-1 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <Avatar className="h-6 w-6 border border-white shadow-sm">
                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${project.leadId}`} />
                                        <AvatarFallback className="text-[9px]">{getLeadName(project.leadId)[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-[11px] font-bold text-slate-600 truncate max-w-[70px]">{getLeadName(project.leadId)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-300">
                                    <History size={10} />
                                    2h
                                </div>
                            </div>
                        </div>

                        <Link href={`/projectmanagement/projects/${project.id}/board`}>
                            <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between group/btn cursor-pointer">
                                <span className="text-[11px] font-bold text-slate-500 group-hover/btn:text-indigo-600 transition-colors">Access Hub</span>
                                <ArrowRight size={12} className="text-slate-300 group-hover/btn:text-indigo-600 transition-all group-hover/btn:translate-x-0.5" />
                            </div>
                        </Link>
                    </Card>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 bg-white border border-slate-100 shadow-sm rounded-none">
                    <SearchX size={24} className="text-slate-200 mb-2" />
                    <p className="text-[12px] font-bold text-slate-500">
                        {searchQuery || statusFilter !== "all" ? "No projects match your filters" : "No projects yet"}
                    </p>
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="mt-3 h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[12px] gap-2 rounded-none"
                    >
                        <Plus size={14} strokeWidth={3} /> Create your first project
                    </Button>
                </div>
            )}

            <CreateProjectModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
        </div>
    )
}
