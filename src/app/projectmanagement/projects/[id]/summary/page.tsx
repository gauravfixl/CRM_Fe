"use client"

import React from "react"
import { useParams } from "next/navigation"
import {
    Activity,
    CheckCircle2,
    Clock,
    AlertCircle,
    Users,
    TrendingUp,
    Calendar,
    ArrowUpRight,
    Layout,
    Plus,
    FileEdit,
    BookOpen,
    Bug,
    ShieldAlert,
    ChevronRight,
    Filter,
    ArrowUpCircle,
    ChevronDown,
    UserCircle2,
    Zap
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/lib/utils"
import { useIssueStore, IssueType, IssuePriority, Issue } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { useSprintStore } from "@/shared/data/sprint-store"

/**
 * SOURCE OF TRUTH: UI/UX Spec 5.6
 * Phase 2: Integrated Project Insights with Store-driven Data.
 */
import { AIInsights } from "@/shared/components/projectmanagement/ai-insights"

export default function ProjectSummaryPage() {
    const { id } = useParams()
    const projectId = id as string

    // Fix for hydration error: ensure we only render store-dependent data on the client
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
        setIsMounted(true)
        // Manually rehydrate stores since they have skipHydration: true
        useIssueStore.persist.rehydrate()
        useProjectStore.persist.rehydrate()
        useSprintStore.persist.rehydrate()
    }, [])

    // Store Hooks
    const { getIssuesByProject } = useIssueStore()
    const { getProjectById } = useProjectStore()
    const { getSprints } = useSprintStore()

    const issues = getIssuesByProject(projectId)
    const sprints = getSprints({ projectId })
    const activeSprint = sprints.find(s => s.status === 'ACTIVE')

    // Workload Logic
    const workload = issues.reduce((acc: Record<string, number>, issue) => {
        const user = issue.assigneeId || 'Unassigned'
        acc[user] = (acc[user] || 0) + 1
        return acc
    }, {})

    // Sort workload
    const sortedWorkload = Object.entries(workload)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4)

    // Activity Feed
    const activityFeed = issues
        .flatMap(i => (i.history || []).map(h => ({
            ...h,
            issueId: i.id,
            issueTitle: i.title,
            issueCode: i.id.split('-').pop()
        })))
        .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())
        .slice(0, 5)
    const project = getProjectById(projectId)
    const projectKey = project?.key || "KEY"

    if (!isMounted) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    const totalIssues = issues.length
    const doneIssues = issues.filter((i: Issue) => i.status === 'DONE').length
    const todoIssues = issues.filter((i: Issue) => i.status === 'TODO').length
    const progressIssues = issues.filter((i: Issue) => i.status === 'IN_PROGRESS' || i.status === 'IN_REVIEW').length

    // Priority Distribution
    const priorityCounts = {
        URGENT: issues.filter((i: Issue) => i.priority === 'URGENT').length,
        HIGH: issues.filter((i: Issue) => i.priority === 'HIGH').length,
        MEDIUM: issues.filter((i: Issue) => i.priority === 'MEDIUM').length,
        LOW: issues.filter((i: Issue) => i.priority === 'LOW').length,
    }

    const typeCounts = {
        TASK: issues.filter((i: Issue) => i.type === 'TASK').length,
        STORY: issues.filter((i: Issue) => i.type === 'STORY').length,
        BUG: issues.filter((i: Issue) => i.type === 'BUG').length,
    }

    const progressPercentage = totalIssues > 0 ? Math.round((doneIssues / totalIssues) * 100) : 0

    return (
        <div className="flex flex-col gap-6 w-full mx-auto pb-16 animate-in fade-in duration-700 font-sans px-4">
            {/* 1. Header & Project Key */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                        Project Intelligence
                    </h1>
                    <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
                        <span>{project?.name}</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-indigo-600 font-bold">{projectKey}</span>
                        <span className="text-slate-300">/</span>
                        <span>Summary View</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-8 px-3 rounded-lg border-slate-200 font-bold text-[11px] text-slate-600 gap-2 bg-white hover:bg-slate-50 shadow-sm">
                        <Calendar size={14} className="text-slate-400" />
                        January 2026
                        <ChevronDown size={14} className="text-slate-400" />
                    </Button>
                    <Button className="h-8 bg-slate-900 hover:bg-indigo-600 text-white font-bold px-4 rounded-lg shadow-sm text-[11px] transition-colors">
                        Export Protocols
                    </Button>
                </div>
            </div>

            {/* 2. Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Completed", val: doneIssues, sub: "Items closed", icon: <CheckCircle2 size={16} />, color: "text-emerald-700", bg: "bg-emerald-100/60", border: "border-emerald-200" },
                    { label: "In Flight", val: progressIssues, sub: "Currently active", icon: <Activity size={16} />, color: "text-blue-700", bg: "bg-blue-100/60", border: "border-blue-200" },
                    { label: "New Tasks", val: todoIssues, sub: "Awaiting start", icon: <Plus size={16} />, color: "text-indigo-700", bg: "bg-indigo-100/60", border: "border-indigo-200" },
                    { label: "Urgent items", val: priorityCounts.URGENT, sub: "High attention", icon: <ShieldAlert size={16} />, color: "text-rose-700", bg: "bg-rose-100/60", border: "border-rose-200" },
                ].map((stat, i) => (
                    <Card key={i} className={cn("border shadow-sm rounded-2xl transition-all hover:shadow-md", stat.bg, stat.border)}>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center bg-white shadow-sm border border-white/80", stat.color)}>
                                {stat.icon}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider leading-tight mb-0.5">{stat.label}</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-bold text-slate-900 leading-none">{stat.val}</span>
                                    <span className="text-[10px] font-medium text-slate-500 leading-none">{stat.sub}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* 3. Main Insights Grid */}
            <div className="grid grid-cols-12 gap-6">
                {/* Left Side: Velocity & AI Insights */}
                <div className="col-span-12 xl:col-span-8 space-y-6">
                    {/* Status Overview (Donut Visualization) */}
                    <Card className="border border-slate-200 shadow-sm rounded-[24px] bg-white overflow-hidden">
                        <CardHeader className="p-5 pb-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-1 bg-indigo-600 rounded-full" />
                                    <CardTitle className="text-[14px] font-bold text-slate-800">Operational Velocity</CardTitle>
                                </div>
                                <Badge variant="outline" className="text-[9px] font-bold border-slate-100 bg-slate-50 text-slate-500 px-2 h-5">Real-time Data</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 py-4 flex flex-col lg:flex-row items-center justify-around gap-6">
                            <div className="relative h-36 w-36 flex items-center justify-center shrink-0">
                                <svg className="h-full w-full transform -rotate-90">
                                    <circle cx="72" cy="72" r="62" fill="transparent" stroke="#f8fafc" strokeWidth="12" />
                                    {totalIssues > 0 && (
                                        <>
                                            <circle cx="72" cy="72" r="62" fill="transparent" stroke="#10b981" strokeWidth="12"
                                                strokeDasharray={`${(doneIssues / totalIssues) * 390} 390`}
                                                strokeDashoffset="0"
                                                strokeLinecap="round"
                                                className="transition-all duration-1000 ease-out"
                                            />
                                            <circle cx="72" cy="72" r="62" fill="transparent" stroke="#6366f1" strokeWidth="12"
                                                strokeDasharray={`${(progressIssues / totalIssues) * 390} 390`}
                                                strokeDashoffset={`-${(doneIssues / totalIssues) * 390}`}
                                                strokeLinecap="round"
                                                className="transition-all duration-1000 ease-out delay-200"
                                            />
                                        </>
                                    )}
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-2xl font-bold text-slate-900 tracking-tight">{progressPercentage}%</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">State</span>
                                </div>
                            </div>
                            <div className="space-y-3 flex-1 w-full lg:max-w-[240px]">
                                {[
                                    { label: "Successful protocols", count: doneIssues, color: "bg-emerald-500", raw: 'Resolved' },
                                    { label: "In-flight operations", count: progressIssues, color: "bg-indigo-500", raw: 'Active' },
                                    { label: "Queued initiatives", count: todoIssues, color: "bg-slate-200", raw: 'Pending' }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col gap-1 group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                                                <span className="text-[12px] font-bold text-slate-700">{item.raw}</span>
                                            </div>
                                            <span className="text-[12px] font-bold text-slate-900">{item.count} items</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <div className={`h-full ${item.color} rounded-full`} style={{ width: totalIssues > 0 ? `${(item.count / totalIssues) * 100}%` : '0%' }} />
                                        </div>
                                        <p className="text-[10px] font-medium text-slate-400">{item.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Workload Column */}
                            <div className="space-y-4 flex-1 w-full lg:max-w-[220px] border-l border-slate-100 pl-8">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Team capacity</h4>
                                {sortedWorkload.map(([user, count], i) => (
                                    <div key={user} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-2.5">
                                            <Avatar className="h-7 w-7 border border-slate-100 shadow-sm">
                                                <AvatarImage src={`https://i.pravatar.cc/150?u=${user}`} />
                                                <AvatarFallback className="text-[8px] font-bold">{user.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-slate-700">User {user}</span>
                                                <span className="text-[9px] font-medium text-slate-400">{count} Active items</span>
                                            </div>
                                        </div>
                                        <div className="h-1 w-10 bg-slate-50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full"
                                                style={{ width: `${(count / (totalIssues || 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {sortedWorkload.length === 0 && <p className="text-[10px] text-slate-400 italic">No cycles active</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Insights moved here to fill space and reduce width */}
                    <AIInsights projectId={projectId} />
                </div>

                {/* Right Side: Sprint & Feed */}
                <div className="col-span-12 xl:col-span-4 space-y-6">
                    <Card className="border border-slate-200 shadow-sm rounded-[24px] bg-white h-auto overflow-hidden">
                        <CardHeader className="p-5 pb-0 flex flex-row items-center justify-between space-y-0 text-slate-800">
                            <CardTitle className="text-[14px] font-bold">Active Protocol</CardTitle>
                            {activeSprint && <Badge className="bg-emerald-500 text-white border-none text-[8px] font-bold px-1.5 h-4">LIVE</Badge>}
                        </CardHeader>
                        <CardContent className="p-5 pt-4 space-y-4">
                            {activeSprint ? (
                                <>
                                    <div>
                                        <h3 className="text-md font-bold text-slate-900 leading-tight mb-1">{activeSprint.name}</h3>
                                        <p className="text-[11px] font-medium text-slate-400 line-clamp-1">{activeSprint.goal || "Operational objective not defined"}</p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-[10px] font-bold text-slate-500">
                                            <span>Deployment state</span>
                                            <span>{Math.round((activeSprint.completedPoints / (activeSprint.totalPoints || 1)) * 100)}%</span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                                                style={{ width: `${(activeSprint.completedPoints / (activeSprint.totalPoints || 1)) * 100}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                                            <span>{activeSprint.completedPoints} Points Done</span>
                                            <span>{activeSprint.totalPoints} Total</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-1">
                                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                            <span className="block text-lg font-bold text-slate-900">{activeSprint.completedTasks}</span>
                                            <span className="text-[10px] font-bold text-slate-400">Deployed</span>
                                        </div>
                                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                            <span className="block text-lg font-bold text-slate-900">{activeSprint.totalTasks - activeSprint.completedTasks}</span>
                                            <span className="text-[10px] font-bold text-slate-400">Backlog</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-6 text-center opacity-70">
                                    <Clock className="h-8 w-8 text-slate-200 mb-2" />
                                    <p className="text-[11px] font-bold text-slate-500">No active cycles found</p>
                                    <Button variant="link" className="text-indigo-600 text-[10px] font-bold h-6">Initialize Cycle</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border border-slate-200 shadow-sm rounded-[24px] bg-white p-4 h-auto">
                        <h4 className="text-[13px] font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <Activity size={14} className="text-indigo-500" />
                            Transmission Feed
                        </h4>
                        <div className="space-y-3">
                            {activityFeed.map((act, i) => (
                                <div key={i} className="flex gap-2 relative pb-3 border-l border-slate-100 pl-4 last:border-0 last:pb-0">
                                    <div className="absolute -left-[4.5px] top-1 h-2 w-2 rounded-full bg-white border border-indigo-500 shadow-sm" />
                                    <div>
                                        <div className="text-[10.5px] font-bold text-slate-700 leading-tight">
                                            <span className="text-indigo-600">User</span> <span className="text-slate-500 font-medium">mutated</span> {act.issueTitle.substring(0, 20)}...
                                        </div>
                                        <div className="text-[9px] text-slate-400 mt-0.5 flex items-center gap-1 font-medium">
                                            <span className="font-bold text-indigo-400">{act.field}</span>
                                            <span>&bull;</span>
                                            <span>{new Date(act.changedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {activityFeed.length === 0 && <p className="text-[10px] text-slate-400 italic pl-2">Standby mode</p>}
                        </div>
                    </Card>
                </div>
            </div>

            {/* 4. Advanced Insights (Priority & Type) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border border-slate-200 shadow-sm rounded-[24px] bg-white p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <ShieldAlert size={14} className="text-rose-500" />
                            <h3 className="text-[13px] font-bold text-slate-800">Priority Matrix</h3>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 px-2 h-5 flex items-center rounded-md bg-slate-50">Risks</span>
                    </div>
                    <div className="space-y-3">
                        {[
                            { label: 'Critical Protocol', count: priorityCounts.URGENT, color: 'bg-rose-500', percent: (priorityCounts.URGENT / (totalIssues || 1)) * 100 },
                            { label: 'High Priority', count: priorityCounts.HIGH, color: 'bg-orange-500', percent: (priorityCounts.HIGH / (totalIssues || 1)) * 100 },
                            { label: 'Core Maintenance', count: priorityCounts.MEDIUM, color: 'bg-indigo-500', percent: (priorityCounts.MEDIUM / (totalIssues || 1)) * 100 },
                            { label: 'Backlog Items', count: priorityCounts.LOW, color: 'bg-slate-300', percent: (priorityCounts.LOW / (totalIssues || 1)) * 100 }
                        ].map((p, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold">
                                    <span className="text-slate-500">{p.label}</span>
                                    <span className="text-slate-900">{p.count}</span>
                                </div>
                                <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div className={cn("h-full rounded-full transition-all duration-1000", p.color)} style={{ width: `${p.percent}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="border border-slate-200 shadow-sm rounded-[24px] bg-white p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Layout size={14} className="text-indigo-500" />
                            <h3 className="text-[13px] font-bold text-slate-800">Resource Distribution</h3>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 px-2 h-5 flex items-center rounded-md bg-slate-50">Taxonomy</span>
                    </div>
                    <div className="space-y-2">
                        {[
                            { label: 'Application Stories', count: typeCounts.STORY, color: 'bg-indigo-500', icon: BookOpen },
                            { label: 'Operational Tasks', count: typeCounts.TASK, color: 'bg-blue-500', icon: Zap },
                            { label: 'System Faults', count: typeCounts.BUG, color: 'bg-rose-500', icon: Bug }
                        ].map((t, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 bg-slate-50/50 border border-slate-100/50 rounded-xl group hover:bg-white hover:shadow-sm transition-all">
                                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-xs", t.color)}>
                                    <t.icon size={14} />
                                </div>
                                <div className="flex-1 space-y-0.5">
                                    <div className="flex justify-between">
                                        <span className="text-[11px] font-bold text-slate-700">{t.label}</span>
                                        <span className="text-[11px] font-bold text-slate-900">{t.count}</span>
                                    </div>
                                    <div className="h-0.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
                                        <div className={cn("h-full", t.color)} style={{ width: `${(t.count / (totalIssues || 1)) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}
