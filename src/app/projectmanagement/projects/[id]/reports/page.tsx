"use client"

import React from "react"
import { useParams } from "next/navigation"
import {
    BarChart3,
    TrendingUp,
    Zap,
    Target,
    Users,
    Clock,
    Download,
    Calendar,
    ChevronDown,
    Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

import { useIssueStore } from "@/shared/data/issue-store"
import { useSprintStore } from "@/shared/data/sprint-store"

export default function ReportsPage() {
    const { id } = useParams()
    const projectId = id as string
    const projectName = id === "p1" ? "Website Redesign" : "Project"

    const { getIssuesByProject } = useIssueStore()
    const { getSprints } = useSprintStore()

    const issues = getIssuesByProject(projectId)
    const sprints = getSprints({ projectId })

    // Metrics Calculation
    const totalIssues = issues.length
    const doneIssues = issues.filter(i => i.status === 'DONE')
    const totalPoints = issues.reduce((acc, i) => acc + (i.storyPoints || 0), 0)
    const completedPoints = doneIssues.reduce((acc, i) => acc + (i.storyPoints || 0), 0)

    // Calculate Velocity (Average of last 3 closed sprints)
    // For now, mock based on completed points as we don't have full sprint history in store for all cases
    const currentVelocity = completedPoints

    // Completion Percentage
    const completionRate = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0

    // Cycle Time (Mocked logic: difference between createdAt and updatedAt for DONE items)
    // In a real app, we'd use status history.
    const avgCycleTime = doneIssues.length > 0 ? "3.5 days" : "0 days"

    return (
        <div className="flex flex-col h-full gap-6 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">{projectName} Insights</h1>
                        <p className="text-[13px] text-slate-500 font-medium italic">Monitor velocity, burn-down, and team productivity.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9 gap-2 font-bold text-slate-600">
                        <Calendar size={16} />
                        Last 30 Days
                        <ChevronDown size={14} />
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 gap-2 font-bold text-indigo-600 border-indigo-200">
                        <Download size={16} />
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-indigo-900 text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                        <Zap size={100} />
                    </div>
                    <CardHeader className="pb-2">
                        <p className="text-[11px] font-bold text-indigo-300 mb-1">Current Velocity</p>
                        <CardTitle className="text-3xl font-bold">{currentVelocity} pts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-indigo-300 text-[12px] font-bold">
                            <TrendingUp size={14} />
                            <span>Based on completed items</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                        <Target size={100} />
                    </div>
                    <CardHeader className="pb-2">
                        <p className="text-[11px] font-bold text-slate-500 mb-1">Target Completion</p>
                        <CardTitle className="text-3xl font-bold">{completionRate}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-emerald-600 text-[12px] font-bold">
                            <TrendingUp size={14} />
                            <span>{doneIssues.length} / {totalIssues} tasks closed</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                        <Clock size={100} />
                    </div>
                    <CardHeader className="pb-2">
                        <p className="text-[11px] font-bold text-slate-500 mb-1">Avg. Cycle Time</p>
                        <CardTitle className="text-3xl font-bold">{avgCycleTime}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-rose-500 text-[12px] font-bold">
                            <TrendingUp size={14} className="rotate-90" />
                            <span>Est. delivery time</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Placeholder Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Burn-down Chart</CardTitle>
                        <CardDescription>Remaining effort in story points vs time.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative h-[250px] w-full bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-end p-6 gap-4">
                            {/* Simple CSS-based bar visualization placeholder */}
                            {Array.from({ length: 14 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-indigo-500/20 hover:bg-indigo-500 transition-colors rounded-t-md relative group"
                                    style={{ height: `${100 - (i * 7)}%` }}
                                >
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {100 - (i * 7)}
                                    </div>
                                </div>
                            ))}
                            {/* Ideal line (visual mock) */}
                            <div className="absolute inset-0 pointer-events-none p-6">
                                <div className="w-full h-full border-b border-l border-slate-200" />
                                <div
                                    className="absolute top-6 left-6 bottom-6 right-6 border-t-2 border-slate-400/30 border-dashed"
                                    style={{
                                        clipPath: 'polygon(0 0, 100% 100%, 0 0)',
                                        transform: 'rotate(0deg)'
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Velocity per Sprint</CardTitle>
                        <CardDescription>Story points completed across recent sprints.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative h-[250px] w-full bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-end p-6 gap-8">
                            {[28, 35, 32, 45, 42].map((v, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full bg-slate-200 rounded-t-lg group relative cursor-pointer overflow-hidden h-[200px] flex items-end">
                                        <div
                                            className="w-full bg-indigo-600 transition-all duration-1000 group-hover:bg-indigo-500"
                                            style={{ height: `${(v / 50) * 100}%` }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md">{v} pts</span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">SP-{10 + i}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Team Load */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Team Allocation</CardTitle>
                    <CardDescription>Workload distribution across team members.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {[
                            { name: "Sahil S.", load: 85, tasks: 12, color: "bg-amber-500" },
                            { name: "Sarah K.", load: 60, tasks: 8, color: "bg-indigo-600" },
                            { name: "James W.", load: 95, tasks: 15, color: "bg-rose-500" },
                            { name: "Mike L.", load: 30, tasks: 4, color: "bg-emerald-500" },
                        ].map((m, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${m.name}`} />
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                        <span className="text-[13px] font-bold text-slate-800 tracking-tight">{m.name}</span>
                                        <Badge variant="secondary" className="text-[10px] font-bold text-slate-400 capitalize bg-transparent border-none">{m.tasks} Active Tasks</Badge>
                                    </div>
                                    <span className={`text-[12px] font-bold ${m.load > 90 ? 'text-rose-500' : 'text-slate-600'}`}>{m.load}% Load</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${m.color} transition-all duration-1000`} style={{ width: `${m.load}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
