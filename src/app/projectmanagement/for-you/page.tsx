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
    TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
    const starredProjects = projects.filter(p => p.starred)

    if (!mounted) return null

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
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-100/50">
                        <Zap size={14} className="text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-amber-700">12 Day Streak</span>
                    </div>
                </div>
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
                                <div key={task.id} className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all flex items-center gap-4">
                                    <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
                                        <Target size={18} className="text-slate-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-slate-200 text-[10px] font-bold px-1.5 h-4 rounded-sm">
                                                {projects.find(p => p.id === task.projectId)?.key || "PROJ"}
                                            </Badge>
                                            <span className="text-[10px] font-medium text-slate-400">
                                                Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "TBD"}
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-800 truncate">{task.title}</h4>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge className={`border-none text-[10px] font-bold px-2 py-0.5 h-5 rounded ${task.priority === 'URGENT' ? 'bg-rose-50 text-rose-600' :
                                            task.priority === 'HIGH' ? 'bg-amber-50 text-amber-600' :
                                                'bg-indigo-50 text-indigo-600'
                                            }`}>
                                            {task.priority}
                                        </Badge>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50">
                                            <ArrowRight size={16} />
                                        </Button>
                                    </div>
                                </div>
                            )) : (
                                <div className="h-24 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                                    <CheckCircle2 size={20} className="mb-1 opacity-50" />
                                    <p className="text-xs font-medium">No urgent tasks assigned.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Clock size={16} className="text-slate-400" />
                            Recent Activity
                        </h3>
                        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
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
                                <Link key={proj.id} href={`/projectmanagement/projects/${proj.id}/board`}>
                                    <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3 hover:border-indigo-500 hover:shadow-sm transition-all group cursor-pointer">
                                        <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-sm group-hover:bg-indigo-50 transition-colors">
                                            {proj.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600">{proj.name}</h4>
                                            <p className="text-[10px] text-slate-400 font-medium">Project Hub</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {starredProjects.length === 0 && (
                                <div className="text-center py-4 text-xs text-slate-400 italic">No starred projects yet.</div>
                            )}
                        </div>
                    </div>

                    {/* Mini Analytics */}
                    <Link href="/projectmanagement/analytics" className="block mt-4">
                        <Card className="bg-indigo-50 border border-indigo-100 text-slate-900 rounded-xl p-5 hover:bg-indigo-100 transition-colors cursor-pointer group">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">Weekly Progress</h4>
                                    <p className="text-[10px] text-indigo-600 font-medium">+14% vs last week</p>
                                </div>
                                <Activity size={16} className="text-indigo-600" />
                            </div>
                            <div className="flex items-end gap-1 h-16 mb-2">
                                {[40, 60, 45, 90, 65, 80, 50].map((h, i) => (
                                    <div key={i} className="flex-1 bg-indigo-100 rounded-sm relative overflow-hidden h-full">
                                        <div className="absolute bottom-0 w-full bg-indigo-500 rounded-sm" style={{ height: `${h}%` }} />
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
