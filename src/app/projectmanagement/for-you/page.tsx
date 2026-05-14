"use client"

import React, { useState, useEffect } from "react"
import {
    Zap,
    Star,
    Clock,
    CheckCircle2,
    ArrowRight,
    Inbox,
    Target,
    Activity,
    TrendingUp,
    ListTodo,
    AlertTriangle,
    CalendarClock,
    ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useIssueStore } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"
import Link from "next/link"

export default function MyWorkPage() {
    const [mounted, setMounted] = useState(false)
    const { issues } = useIssueStore()
    const { projects } = useProjectStore()

    useEffect(() => {
        setMounted(true)
    }, [])

    const myNextTasks = issues.filter(i => i.assigneeId === 'u1' && i.status !== 'DONE').slice(0, 3)
    const myOpenCount = issues.filter(i => i.assigneeId === 'u1' && i.status !== 'DONE').length
    const myCompletedCount = issues.filter(i => i.assigneeId === 'u1' && i.status === 'DONE').length
    const myDueThisWeek = issues.filter(i => {
        if (i.assigneeId !== 'u1' || !i.dueDate) return false
        const d = new Date(i.dueDate)
        const now = new Date()
        const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        return diff >= 0 && diff <= 7
    }).length
    const myUrgentCount = issues.filter(i => i.assigneeId === 'u1' && i.status !== 'DONE' && (i.priority === 'URGENT' || i.priority === 'HIGH')).length
    const starredProjects = projects.filter(p => p.starred)

    if (!mounted) return null

    const kpis = [
        { label: "My Open Tasks", value: myOpenCount, icon: <ListTodo size={18} />, color: "text-indigo-800", bg: "bg-indigo-100", href: "/projectmanagement/my-work?tab=assigned" },
        { label: "Completed", value: myCompletedCount, icon: <CheckCircle2 size={18} />, color: "text-emerald-800", bg: "bg-emerald-100", href: "/projectmanagement/my-work?tab=assigned&status=DONE" },
        { label: "Due This Week", value: myDueThisWeek, icon: <CalendarClock size={18} />, color: "text-amber-800", bg: "bg-amber-100", href: "/projectmanagement/calendar" },
        { label: "Urgent / High", value: myUrgentCount, icon: <AlertTriangle size={18} />, color: "text-rose-800", bg: "bg-rose-100", href: "/projectmanagement/my-work?tab=assigned&priority=HIGH" }
    ]

    return (
        <div className="w-full h-full px-4 py-3 space-y-5 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">My Work</h1>
                    <p className="text-xs text-slate-500 font-medium">
                        Your personalized daily overview and priority items.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100/50 rounded-none">
                        <Zap size={14} className="text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-amber-700">12 Day Streak</span>
                    </div>
                </div>
            </div>

            {/* KPI cards — clickable, no radius */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((stat, i) => (
                    <Link
                        key={i}
                        href={stat.href}
                        className={`block border shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all h-[75px] rounded-none cursor-pointer ${stat.bg}`}
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
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Immediate Focus */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Inbox size={16} className="text-slate-400" />
                                Immediate Focus
                            </h3>
                            <Link href="/projectmanagement/my-work">
                                <Button variant="link" className="text-indigo-600 h-auto p-0 text-xs font-semibold">
                                    View all tasks <ArrowRight size={12} className="ml-1" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid gap-3">
                            {myNextTasks.length > 0 ? myNextTasks.map((task) => (
                                <Link
                                    key={task.id}
                                    href={`/projectmanagement/projects/${task.projectId}/board`}
                                    className="group bg-white border border-slate-200 p-4 hover:border-indigo-300 hover:shadow-sm transition-all flex items-center gap-4 rounded-none cursor-pointer"
                                >
                                    <div className="h-10 w-10 bg-slate-50 flex items-center justify-center shrink-0 rounded-none">
                                        <Target size={18} className="text-slate-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-slate-200 text-[10px] font-bold px-1.5 h-4 rounded-none">
                                                {projects.find(p => p.id === task.projectId)?.key || "PROJ"}
                                            </Badge>
                                            <span className="text-[10px] font-medium text-slate-400">
                                                Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "TBD"}
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-800 truncate">{task.title}</h4>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge className={`border-none text-[10px] font-bold px-2 py-0.5 h-5 rounded-none ${task.priority === 'URGENT' ? 'bg-rose-50 text-rose-600' :
                                            task.priority === 'HIGH' ? 'bg-amber-50 text-amber-600' :
                                                'bg-indigo-50 text-indigo-600'
                                            }`}>
                                            {task.priority}
                                        </Badge>
                                        <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                    </div>
                                </Link>
                            )) : (
                                <div className="h-24 bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 rounded-none">
                                    <CheckCircle2 size={20} className="mb-1 opacity-50" />
                                    <p className="text-xs font-medium">No urgent tasks assigned.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Clock size={16} className="text-slate-400" />
                                Recent Activity
                            </h3>
                            <Link href="/projectmanagement/recent">
                                <Button variant="link" className="text-indigo-600 h-auto p-0 text-xs font-semibold">
                                    See full feed <ArrowRight size={12} className="ml-1" />
                                </Button>
                            </Link>
                        </div>
                        <div className="bg-white border border-slate-200 divide-y divide-slate-100 rounded-none">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="p-4 flex items-start gap-3">
                                    <Avatar className="h-8 w-8 border border-slate-100">
                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${i + 20}`} />
                                        <AvatarFallback className="text-[10px]">SC</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-0.5">
                                        <p className="text-xs text-slate-600">
                                            <span className="font-bold text-slate-900">Sarah Chen</span> completed <span className="font-semibold text-indigo-600">"API Integration"</span>
                                        </p>
                                        <p className="text-[10px] font-medium text-slate-400">2 hours ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-5">
                    {/* Starred Projects */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Star size={16} className="text-amber-500 fill-amber-500" />
                            Starred Projects
                        </h3>
                        <div className="flex flex-col gap-3">
                            {starredProjects.map(proj => (
                                <Link
                                    key={proj.id}
                                    href={`/projectmanagement/projects/${proj.id}/board`}
                                    className="p-3 bg-white border border-slate-200 flex items-center gap-3 hover:border-indigo-500 hover:shadow-sm transition-all group cursor-pointer rounded-none"
                                >
                                    <div className="h-8 w-8 bg-slate-50 flex items-center justify-center text-sm group-hover:bg-indigo-50 transition-colors rounded-none">
                                        {proj.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600">{proj.name}</h4>
                                        <p className="text-[10px] text-slate-400 font-medium">Project Hub</p>
                                    </div>
                                </Link>
                            ))}
                            {starredProjects.length === 0 && (
                                <div className="text-center py-4 text-xs text-slate-400 italic border border-dashed border-slate-200 rounded-none">No starred projects yet.</div>
                            )}
                        </div>
                    </div>

                    {/* Mini Analytics */}
                    <Link href="/projectmanagement/analytics" className="block mt-4">
                        <Card className="bg-indigo-50 border border-indigo-100 text-slate-900 p-5 hover:bg-indigo-100 transition-colors cursor-pointer group rounded-none">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">Weekly Progress</h4>
                                    <p className="text-[10px] text-indigo-600 font-medium">+14% vs last week</p>
                                </div>
                                <Activity size={16} className="text-indigo-600" />
                            </div>
                            <div className="flex items-end gap-1 h-16 mb-2">
                                {[40, 60, 45, 90, 65, 80, 50].map((h, i) => (
                                    <div key={i} className="flex-1 bg-indigo-100 relative overflow-hidden h-full rounded-none">
                                        <div className="absolute bottom-0 w-full bg-indigo-500 rounded-none" style={{ height: `${h}%` }} />
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 group-hover:text-indigo-700 transition-colors">
                                <TrendingUp size={12} />
                                View Analytics
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    )
}
