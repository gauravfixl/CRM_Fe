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

    // 3. Mock Productivity Data
    const productivityData = [
        { day: "Mon", value: 12 },
        { day: "Tue", value: 18 },
        { day: "Wed", value: 15 },
        { day: "Thu", value: 25 },
        { day: "Fri", value: 22 },
        { day: "Sat", value: 10 },
        { day: "Sun", value: 8 }
    ]

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

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Active Issues</p>
                            <p className="text-2xl font-bold text-slate-900">{issues.length}</p>
                        </div>
                        <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                            <AlertCircle size={20} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Projects</p>
                            <p className="text-2xl font-bold text-slate-900">{projects.length}</p>
                        </div>
                        <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                            <Layers size={20} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Completion</p>
                            <p className="text-2xl font-bold text-slate-900">78%</p>
                        </div>
                        <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                            <CheckCircle2 size={20} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Team</p>
                            <p className="text-2xl font-bold text-slate-900">12</p>
                        </div>
                        <div className="h-10 w-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                            <Users size={20} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

                {/* Velocity Trend */}
                <Card className="xl:col-span-2">
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
                <Card>
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
                <Card>
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

                {/* Workload */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-slate-800">Team Workload</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                                    { subject: 'Dev', A: 120, fullMark: 150 },
                                    { subject: 'Design', A: 98, fullMark: 150 },
                                    { subject: 'Ops', A: 86, fullMark: 150 },
                                    { subject: 'Mkt', A: 99, fullMark: 150 },
                                    { subject: 'Sales', A: 85, fullMark: 150 },
                                ]}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                                    <Radar name="Workload" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
