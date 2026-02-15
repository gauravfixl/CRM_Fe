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
    Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { useProjectStore, Project } from "@/shared/data/projects-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import { useTeamStore } from "@/shared/data/team-store"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function ProjectsPage() {
    const [mounted, setMounted] = useState(false)
    const { getProjectsByWorkspace, toggleStar, deleteProject } = useProjectStore()
    const { activeWorkspaceId } = useWorkspaceStore()
    const { members } = useTeamStore()

    useEffect(() => {
        setMounted(true)
        useProjectStore.persist.rehydrate()
        useWorkspaceStore.persist.rehydrate()
        useTeamStore.persist.rehydrate()
    }, [])

    const projects = (mounted && activeWorkspaceId) ? getProjectsByWorkspace(activeWorkspaceId) : []

    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState<"name" | "recent">("name")

    const filteredProjects = useMemo(() => {
        let result = projects.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.key.toLowerCase().includes(searchQuery.toLowerCase())
        )

        if (sortBy === "name") {
            result.sort((a, b) => a.name.localeCompare(b.name))
        }

        return result
    }, [projects, searchQuery, sortBy])

    const getLeadName = (leadId: string) => {
        return members.find(m => m.id === leadId)?.name || "External Lead"
    }

    if (!mounted) return null

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-4 py-4 animate-in fade-in duration-500 px-6 pb-20 font-outfit">
            {/* 🏷️ Mini Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 bg-indigo-600 rounded flex items-center justify-center text-white shadow-sm">
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
                            className="pl-9 h-8 w-[200px] bg-white border border-slate-200 rounded-lg text-[12px]"
                        />
                    </div>
                    <Link href="/projectmanagement/projects/new">
                        <Button className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[12px] flex items-center gap-2">
                            <Plus size={14} strokeWidth={3} />
                            New Project
                        </Button>
                    </Link>
                </div>
            </div>

            {/* 📊 Filters Row */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                <div className="flex items-center gap-5">
                    <button className="text-[12px] font-bold text-indigo-600 border-b-2 border-indigo-600 pb-1 px-1">Active</button>
                    <button className="text-[12px] font-bold text-slate-400 hover:text-slate-600 pb-1 px-1 transition-colors">Shared</button>
                    <button className="text-[12px] font-bold text-slate-400 hover:text-slate-600 pb-1 px-1 transition-colors">Archived</button>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-7 px-2 hover:bg-slate-50 rounded text-[11px] font-bold gap-1 text-slate-500">
                            Sort: {sortBy === "name" ? "A-Z" : "Updated"} <ChevronDown size={12} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px] p-1 shadow-xl border-slate-100 rounded-xl">
                        <DropdownMenuItem onClick={() => setSortBy("name")} className="text-[12px] font-medium py-1.5 rounded-lg">Alphabetical</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("recent")} className="text-[12px] font-medium py-1.5 rounded-lg">Recently Updated</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* 🏗️ Core Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProjects.map((project) => (
                    <Card key={project.id} className="group border border-slate-100 shadow-sm hover:shadow-md transition-all rounded-xl bg-white overflow-hidden flex flex-col h-full">
                        <div className="p-4 flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                                <Link href={`/projectmanagement/projects/${project.id}/board`}>
                                    <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center text-[20px] shadow-sm border border-slate-100 group-hover:bg-indigo-50 transition-colors cursor-pointer font-sans">
                                        {project.icon || "🚀"}
                                    </div>
                                </Link>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => toggleStar(project.id)}
                                        className={cn(
                                            "h-7 w-7 rounded-md flex items-center justify-center transition-all",
                                            project.starred ? "text-amber-500 hover:bg-amber-50" : "text-slate-200 hover:text-amber-400 hover:bg-slate-50"
                                        )}
                                    >
                                        <Star size={16} className={project.starred ? "fill-current" : ""} />
                                    </button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="h-7 w-7 text-slate-300 hover:text-slate-900 rounded-md flex items-center justify-center transition-all">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[180px] p-1 shadow-xl border-slate-100 rounded-xl">
                                            <DropdownMenuItem className="flex items-center gap-2 text-[12px] font-bold py-2 rounded-lg"><Settings2 size={14} /> Settings</DropdownMenuItem>
                                            <div className="h-px bg-slate-50 my-1" />
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    if (confirm(`Archive project ${project.name}?`)) deleteProject(project.id)
                                                }}
                                                className="flex items-center gap-2 text-[12px] font-bold text-rose-500 py-2 rounded-lg focus:bg-rose-50"
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
                                    <Badge className="bg-slate-50 text-slate-400 hover:bg-slate-50 border-none font-bold text-[8px] uppercase tracking-widest px-1 h-3.5 rounded">
                                        {project.key}
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
                <div className="flex flex-col items-center justify-center py-10 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <SearchX size={24} className="text-slate-200 mb-2" />
                    <p className="text-[12px] font-bold text-slate-500">No clusters found</p>
                </div>
            )}
        </div>
    )
}
