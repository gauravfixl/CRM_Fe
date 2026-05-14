"use client"

import React, { useState, useEffect } from "react"
import {
    BarChart3,
    TrendingUp,
    Users,
    Clock,
    Zap,
    Target,
    Activity,
    Shield,
    FileText,
    ChevronRight,
    Award
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ReportsHubPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const kpis = [
        { label: "Sprint Reports", value: 3, icon: <Zap size={18} />, color: "text-indigo-800", bg: "bg-indigo-100", href: "/projectmanagement/reports/sprint" },
        { label: "Workload Reports", value: 2, icon: <Users size={18} />, color: "text-amber-800", bg: "bg-amber-100", href: "/projectmanagement/reports/workload" },
        { label: "Performance", value: 1, icon: <Target size={18} />, color: "text-emerald-800", bg: "bg-emerald-100", href: "/projectmanagement/reports/performance" },
        { label: "Custom Reports", value: 0, icon: <FileText size={18} />, color: "text-rose-800", bg: "bg-rose-100", href: "/projectmanagement/reports" },
    ]

    const reportCategories = [
        {
            id: 'execution',
            title: 'Project Execution',
            description: 'In-depth analysis of task completion, velocity, and sprint health.',
            reports: [
                { title: 'Velocity Chart', desc: 'Track team throughput over time.', icon: <Zap size={18} />, color: 'text-indigo-600', bg: 'bg-indigo-50', href: '/projectmanagement/reports/sprint' },
                { title: 'Burnup Report', desc: 'Visualize progress towards project scope.', icon: <TrendingUp size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50', href: '/projectmanagement/reports/sprint' },
                { title: 'Cumulative Flow', desc: 'Identify bottlenecks in your workflow.', icon: <Activity size={18} />, color: 'text-blue-600', bg: 'bg-blue-50', href: '/projectmanagement/reports/sprint' }
            ]
        },
        {
            id: 'resources',
            title: 'People & Capacity',
            description: 'Monitor individual workload, peak performance, and team balance.',
            reports: [
                { title: 'Workload Balance', desc: 'Distribute tasks fairly across members.', icon: <Users size={18} />, color: 'text-amber-600', bg: 'bg-amber-50', href: '/projectmanagement/reports/workload' },
                { title: 'Time Tracking', desc: 'Analyze billable hours and logged time.', icon: <Clock size={18} />, color: 'text-slate-600', bg: 'bg-slate-50', href: '/projectmanagement/reports/workload' },
                { title: 'Member Performance', desc: 'High-level individual output metrics.', icon: <Award size={18} />, color: 'text-rose-600', bg: 'bg-rose-50', href: '/projectmanagement/reports/performance' }
            ]
        }
    ]

    return (
        <div className="w-full h-full p-6 space-y-6 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Strategic insights and operational metrics.
                    </p>
                </div>
                <div>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-none">
                        <BarChart3 size={14} className="mr-2" /> Create Custom Report
                    </Button>
                </div>
            </div>

            {/* KPI cards */}
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

            <div className="space-y-8">
                {reportCategories.map((category) => (
                    <div key={category.id} className="space-y-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">{category.title}</h3>
                            <p className="text-sm text-slate-500">{category.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {category.reports.map((report, i) => (
                                <Link key={i} href={report.href}>
                                    <Card className="group hover:border-indigo-300 hover:shadow-md transition-all rounded-none cursor-pointer h-full">
                                        <CardHeader className="p-4 pb-2">
                                            <div className="flex items-start justify-between">
                                                <div className={`h-10 w-10 ${report.bg} ${report.color} flex items-center justify-center rounded-none`}>
                                                    {report.icon}
                                                </div>
                                                {i === 0 && <Badge variant="secondary" className="text-[10px] rounded-none">Popular</Badge>}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-2 space-y-3">
                                            <div className="space-y-1">
                                                <CardTitle className="text-sm font-bold text-slate-900">{report.title}</CardTitle>
                                                <CardDescription className="text-xs text-slate-500 line-clamp-2">
                                                    {report.desc}
                                                </CardDescription>
                                            </div>
                                            <Button variant="outline" size="sm" className="w-full h-8 text-xs rounded-none">
                                                View Report
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Special Section: Governance */}
            <Card className="bg-slate-900 border-none text-white overflow-hidden relative rounded-none">
                <CardContent className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-indigo-400">
                            <Shield size={20} />
                            <h4 className="text-xs font-bold uppercase tracking-widest">Compliance</h4>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Security & Governance Audit
                        </h2>
                        <p className="text-slate-400 text-sm max-w-md">
                            Ensure your workspace adheres to enterprise standards with automated compliance reporting and security vulnerability scans.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold rounded-none">
                                Run Audit
                            </Button>
                            <Link href="/projectmanagement/help">
                                <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white rounded-none">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
