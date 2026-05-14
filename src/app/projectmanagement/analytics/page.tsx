"use client"

import React, { useMemo } from "react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis
} from "recharts"
import {
    Activity,
    Users,
    CheckCircle2,
    Calendar,
    Download,
    Layers,
    AlertCircle
} from "lucide-react"
import { useIssueStore } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AnalyticsHubPage() {
    const { issues } = useIssueStore()
    const { projects } = useProjectStore()

    // 1. Data Processing for Status Distribution
    const statusData = useMemo(() => {
        const counts: Record<string, number> = { TODO: 0, IN_PROGRESS: 0, IN_REVIEW: 0, DONE: 0 }
        issues.forEach(i => { if (counts[i.status] !== undefined) counts[i.status]++ })
        return Object.entries(counts).map(([name, value]) => ({ name: name.replace('_', ' '), value }))
    }, [issues])

    // 2. Data Processing for Priority
    const priorityData = useMemo(() => {
        const counts: Record<string, number> = { LOW: 0, MEDIUM: 0, HIGH: 0, URGENT: 0 }
        issues.forEach(i => { if (counts[i.priority] !== undefined) counts[i.priority]++ })
        return Object.entries(counts).map(([name, value]) => ({ name, value }))
    }, [issues])

    // 3. Real Productivity Data — last 7 days, count of issues marked DONE per day
    const productivityData = useMemo(() => {
        const now = new Date()
        const startOfDay = (d: Date) => {
            const x = new Date(d)
            x.setHours(0, 0, 0, 0)
            return x
        }
        const days: { day: string; value: number; date: Date }[] = []
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now)
            d.setDate(d.getDate() - i)
            days.push({
                day: d.toLocaleDateString(undefined, { weekday: "short" }),
                value: 0,
                date: startOfDay(d),
            })
        }
        issues.forEach(i => {
            if (i.status !== "DONE" || !i.updatedAt) return
            const when = startOfDay(new Date(i.updatedAt))
            const slot = days.find(d => d.date.getTime() === when.getTime())
            if (slot) slot.value += 1
        })
        return days.map(d => ({ day: d.day, value: d.value }))
    }, [issues])

    // 4. Real team workload by component / project
    const workloadData = useMemo(() => {
        const map: Record<string, number> = {}
        issues.forEach(i => {
            if (i.status === "DONE") return
            const proj = projects.find(p => p.id === i.projectId)
            const name = proj?.name.slice(0, 8) || "Other"
            map[name] = (map[name] || 0) + (i.storyPoints || 1)
        })
        const entries = Object.entries(map).slice(0, 5)
        const max = Math.max(1, ...entries.map(([, v]) => v))
        return entries.map(([subject, value]) => ({ subject, A: value, fullMark: max }))
    }, [issues, projects])

    // 5. Real completion rate
    const doneCount = issues.filter(i => i.status === "DONE").length
    const completionPct = issues.length > 0 ? Math.round((doneCount / issues.length) * 100) : 0
    const teamSize = new Set(issues.map(i => i.assigneeId).filter(Boolean)).size

    const COLORS = ["#94a3b8", "#6366f1", "#8b5cf6", "#10b981"]

    return (
        <div className="w-full h-full p-6 space-y-6 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics</h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Real-time insights and performance metrics.
                    </p>
                </div>
                <Button size="sm" variant="outline" className="h-9 gap-2">
                    <Download size={14} /> Export Report
                </Button>
            </div>

            {/* Top Stats Row - clickable KPI cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Active Issues", value: issues.length, icon: <AlertCircle size={18} />, color: "text-indigo-800", bg: "bg-indigo-100", href: "/projectmanagement/my-work?tab=all" },
                    { label: "Projects", value: projects.length, icon: <Layers size={18} />, color: "text-blue-800", bg: "bg-blue-100", href: "/projectmanagement/projects" },
                    { label: "Completion", value: `${completionPct}%`, icon: <CheckCircle2 size={18} />, color: "text-emerald-800", bg: "bg-emerald-100", href: "/projectmanagement/reports/performance" },
                    { label: "Team", value: teamSize, icon: <Users size={18} />, color: "text-amber-800", bg: "bg-amber-100", href: "/projectmanagement/people" },
                ].map((stat, i) => (
                    <a
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
                        </div>
                    </a>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

                {/* Velocity Trend */}
                <Card className="xl:col-span-2 rounded-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-slate-800">System Velocity (7 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={productivityData}>
                                    <defs>
                                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Status Breakdown */}
                <Card className="rounded-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-slate-800">Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-2 mt-4">
                            {statusData.map((s, i) => (
                                <div key={i} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        <span className="font-medium text-slate-600 capitalize">{s.name.toLowerCase()}</span>
                                    </div>
                                    <span className="font-bold text-slate-900">{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Priority Breakdown */}
                <Card className="rounded-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-slate-800">Task Priorities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={priorityData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} interval={0} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                                    />
                                    <Bar dataKey="value" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Workload by Project */}
                <Card className="rounded-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-slate-800">Project Load (active pts)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                {workloadData.length === 0 ? (
                                    <div className="flex h-full items-center justify-center text-xs text-slate-400">No active work to chart.</div>
                                ) : (
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={workloadData}>
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                                        <Radar name="Workload" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                        <Tooltip />
                                    </RadarChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
