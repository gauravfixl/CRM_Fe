"use client"

import React, { useState, useEffect } from "react"
import {
    Plus,
    CheckCircle2,
    Clock,
    AlertCircle,
    TrendingUp,
    Zap,
    ChevronDown,
    Search,
    ChevronRight,
    Star,
    LayoutGrid,
    MoreHorizontal
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { useIssueStore } from "@/shared/data/issue-store"
import { useTeamStore } from "@/shared/data/team-store"
import Link from "next/link"
import CreateProjectModal from "@/shared/components/projectmanagement/create-project-modal"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

export default function ProjectDashboard() {
    const { workspaces, activeWorkspaceId, setActiveWorkspace } = useWorkspaceStore()
    const { getProjectsByWorkspace } = useProjectStore()
    const { getIssuesByProject, issues } = useIssueStore()
    const { members } = useTeamStore()
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0]
    const projects = activeWorkspaceId ? getProjectsByWorkspace(activeWorkspaceId) : []
    const starredProjects = projects.filter(p => p.starred)

    // Dynamic stats
    const activeProjectsCount = projects.filter(p => p.status === "Active").length
    const completedProjectsCount = projects.filter(p => p.status === "Completed").length
    const tasksDueCount = issues.filter(i => i.status !== "DONE" && i.dueDate).length
    const issuesCount = issues.filter(i => i.type === "BUG" && i.status !== "DONE").length

    const userName = mounted ? (localStorage.getItem("userName") || "User") : "User"
    const currentHour = new Date().getHours()
    const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening"

    return (
        <div className="w-full max-w-[1500px] mx-auto space-y-4 pb-20 animate-in fade-in duration-500 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between py-2 mb-2">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="flex flex-col">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <h1 className="text-base font-bold text-slate-900 flex items-center gap-2 leading-none cursor-pointer hover:text-indigo-600 transition-colors">
                                        {activeWorkspace?.name || "Fixl Solutions"}
                                        <ChevronDown size={14} className="text-slate-400 group-hover:text-indigo-500" />
                                    </h1>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-64 p-2 shadow-xl border-slate-100 bg-white z-[80]">
                                    <div className="px-2 py-2 mb-1">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Switch Workspace</span>
                                    </div>
                                    {workspaces.map((ws) => (
                                        <DropdownMenuItem
                                            key={ws.id}
                                            onClick={() => setActiveWorkspace(ws.id)}
                                            className="flex items-center gap-3 p-2 text-xs font-medium text-slate-700 cursor-pointer focus:bg-indigo-50 focus:text-indigo-600"
                                        >
                                            <span>{ws.name}</span>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <p className="text-[11px] font-medium text-slate-400 mt-1 italic leading-none">
                                Manage your projects in {activeWorkspace?.name?.toLowerCase() || "fixl-solutions"} mode
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Type / to search..."
                            className="h-8 w-[220px] pl-9 pr-3 bg-white border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all placeholder:text-slate-300"
                        />
                    </div>
                    <Button
                        onClick={() => setIsCreateProjectOpen(true)}
                        className="h-8 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 text-xs"
                    >
                        <Plus size={14} strokeWidth={3} />
                        Create Project
                    </Button>
                </div>
            </div>

            {/* Welcome Hero Section - Light color, no border-radius */}
            <div className="relative overflow-hidden bg-slate-800 p-6 text-white shadow-sm">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Zap size={140} />
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold tracking-tight text-white">{greeting}, {userName}!</h2>
                        <p className="text-white text-xs opacity-90">You have {tasksDueCount} tasks due today and {issuesCount} open issues.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: "UP NEXT", value: mounted ? (issues.find(i => i.status !== "DONE")?.title || "No pending tasks") : "Loading...", color: "text-indigo-300" },
                            { label: "RECENT ACTIVITY", value: "No recent updates", color: "text-slate-300" },
                            { label: "TIME LOGGED", value: `${Math.floor(Math.random() * 8)}h ${Math.floor(Math.random() * 60)}m logged today`, color: "text-amber-300" }
                        ].map((item, i) => (
                            <div key={i} className="p-4 bg-white/5 border border-white/5 backdrop-blur-sm">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-2">{item.label}</p>
                                <p className={`text-xs font-bold italic leading-tight ${item.color}`}>{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Metrics Row - Darker colors, no border-radius */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: "Active projects", value: activeProjectsCount.toString(), icon: <LayoutGrid size={18} />, color: "text-indigo-800", bg: "bg-indigo-100" },
                    { label: "Completed", value: completedProjectsCount.toString(), icon: <CheckCircle2 size={18} />, color: "text-emerald-800", bg: "bg-emerald-100" },
                    { label: "Tasks due", value: tasksDueCount.toString().padStart(2, '0'), icon: <Clock size={18} />, color: "text-amber-800", bg: "bg-amber-100" },
                    { label: "Issues", value: issuesCount.toString().padStart(2, '0'), icon: <AlertCircle size={18} />, color: "text-rose-800", bg: "bg-rose-100" }
                ].map((stat, i) => (
                    <Card key={i} className={`border shadow-sm overflow-hidden hover:shadow-md transition-all h-[75px] flex items-center ${stat.bg}`}>
                        <CardContent className="p-4 flex items-center justify-between w-full">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 bg-white ${stat.color} flex items-center justify-center shrink-0`}>
                                    {stat.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight leading-none">{stat.label}</span>
                                    <span className="text-xl font-black text-slate-900 leading-none mt-1.5">{stat.value}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Core Grid Components: Workload, Contributors & Updates */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

                {/* Left: Workload Distribution */}
                <div className="lg:col-span-4 space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">WORKLOAD DISTRIBUTION</h3>
                        <TrendingUp size={14} className="text-indigo-500" />
                    </div>
                    <Card className="border shadow-sm p-5 space-y-6 h-full bg-slate-50 flex flex-col justify-center">
                        {[
                            { name: "Frontend Core", val: 55, color: "bg-indigo-500", cap: "2%" },
                            { name: "Design Systems", val: 32, color: "bg-emerald-500", cap: "1%" },
                            { name: "Back-end Ops", val: 15, color: "bg-amber-500", cap: "0.5%" },
                        ].map((team, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between text-[11px] font-bold">
                                    <span className="text-slate-700">{team.name}</span>
                                    <span className="text-slate-500 uppercase tracking-tight">{team.cap} Capacity</span>
                                </div>
                                <div className="h-2 w-full bg-white border border-slate-200 p-[1px]">
                                    <div className={`h-full ${team.color} transition-all duration-1000`} style={{ width: `${team.val}%` }} />
                                </div>
                            </div>
                        ))}
                    </Card>
                </div>

                {/* Middle: Top Contributors */}
                <div className="lg:col-span-4 space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">TOP CONTRIBUTORS</h3>
                        <MoreHorizontal size={14} className="text-slate-400" />
                    </div>
                    <Card className="border shadow-sm overflow-hidden h-full bg-white">
                        <div className="divide-y divide-slate-100 h-full flex flex-col justify-between">
                            {members.slice(0, 4).map((member, i) => (
                                <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer group flex-1">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8 ring-2 ring-white">
                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${member.id}`} />
                                            <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-[10px]">{member.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-800 leading-none group-hover:text-indigo-600 transition-colors line-clamp-1">{member.name}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mt-1 line-clamp-1">{member.role}</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-xs font-bold text-slate-800">5 pts</p>
                                        <p className="text-[10px] font-bold text-emerald-500">+15%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right: Mix of Favourites & Tips */}
                <div className="lg:col-span-4 grid grid-cols-1 gap-5">
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight px-1">SYSTEM UPDATES</h3>
                        <Card className="border shadow-sm p-4 h-[120px] flex flex-col justify-center bg-white">
                            <div className="text-center space-y-2">
                                <p className="text-[11px] font-medium text-slate-400">No recent mutations detected.</p>
                                <Button variant="link" className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide h-auto p-0 hover:no-underline">
                                    Audit Feed
                                </Button>
                            </div>
                        </Card>
                    </div>

                    <Card className="border shadow-lg shadow-indigo-100/30 bg-indigo-50 p-5 text-indigo-900 relative overflow-hidden group h-[120px]">
                        <Zap size={40} className="absolute -top-1 -right-1 text-indigo-200 opacity-60 transform group-hover:scale-110 transition-transform" />
                        <div className="relative z-10 space-y-2">
                            <h4 className="text-[11px] font-bold uppercase tracking-tight italic">Productivity Tip</h4>
                            <p className="text-indigo-800/80 text-[10px] font-medium leading-tight italic line-clamp-2">
                                "Sprints move 30% faster. Use targets for better results."
                            </p>
                            <Button className="w-full h-7 bg-indigo-600 text-white font-bold text-[9px] uppercase tracking-wide hover:bg-indigo-700 shadow-md transition-all active:scale-95">
                                Learn More
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Favorite Projects with Dynamic Sizing */}
            <div className="space-y-4 pt-8 mt-4">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight italic">Priority Projects</h3>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {starredProjects.map((project) => (
                        <Card key={project.id} className="border shadow-sm p-4 hover:shadow-md transition-all group cursor-pointer bg-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 bg-slate-50 flex items-center justify-center text-lg group-hover:bg-indigo-50 transition-colors border border-slate-100">
                                        {project.icon || "🚀"}
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="text-[12px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{project.name}</h4>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide italic mt-0.5">{project.key}</p>
                                    </div>
                                </div>
                                <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500 transition-all transform group-hover:translate-x-0.5" />
                            </div>
                        </Card>
                    ))}
                    {starredProjects.length === 0 && (
                        <div className="col-span-full py-6 text-center bg-slate-50/50 border border-dashed border-slate-200">
                            <p className="text-slate-400 font-medium text-[10px]">No priority flags set.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <CreateProjectModal
                isOpen={isCreateProjectOpen}
                onClose={() => setIsCreateProjectOpen(false)}
            />
        </div>
    )
}
