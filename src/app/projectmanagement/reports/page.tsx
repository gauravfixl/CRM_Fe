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
    FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ReportsHubPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const reportCategories = [
        {
            id: 'execution',
            title: 'Project Execution',
            description: 'In-depth analysis of task completion, velocity, and sprint health.',
            reports: [
                { title: 'Velocity Chart', desc: 'Track team throughput over time.', icon: <Zap size={18} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { title: 'Burnup Report', desc: 'Visualize progress towards project scope.', icon: <TrendingUp size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { title: 'Cumulative Flow', desc: 'Identify bottlenecks in your workflow.', icon: <Activity size={18} />, color: 'text-blue-600', bg: 'bg-blue-50' }
            ]
        },
        {
            id: 'resources',
            title: 'People & Capacity',
            description: 'Monitor individual workload, peak performance, and team balance.',
            reports: [
                { title: 'Workload Balance', desc: 'Distribute tasks fairly across members.', icon: <Users size={18} />, color: 'text-amber-600', bg: 'bg-amber-50' },
                { title: 'Time Tracking', desc: 'Analyze billable hours and logged time.', icon: <Clock size={18} />, color: 'text-slate-600', bg: 'bg-slate-50' },
                { title: 'Member Performance', desc: 'High-level individual output metrics.', icon: <Target size={18} />, color: 'text-rose-600', bg: 'bg-rose-50' }
            ]
        }
    ]

    return (
        <div className="w-full h-full p-6 space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Strategic insights and operational metrics.
                    </p>
                </div>
                <div>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        Create Custom Report
                    </Button>
                </div>
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
                                <Card key={i} className="group hover:border-indigo-300 hover:shadow-md transition-all">
                                    <CardHeader className="p-4 pb-2">
                                        <div className="flex items-start justify-between">
                                            <div className={`h-10 w-10 ${report.bg} ${report.color} rounded-lg flex items-center justify-center`}>
                                                {report.icon}
                                            </div>
                                            {i === 0 && <Badge variant="secondary" className="text-[10px]">Popular</Badge>}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-2 space-y-3">
                                        <div className="space-y-1">
                                            <CardTitle className="text-sm font-bold text-slate-900">{report.title}</CardTitle>
                                            <CardDescription className="text-xs text-slate-500 line-clamp-2">
                                                {report.desc}
                                            </CardDescription>
                                        </div>
                                        <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                                            View Report
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Special Section: Governance */}
            <Card className="bg-slate-900 border-none text-white overflow-hidden relative">
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
                            <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold">
                                Run Audit
                            </Button>
                            <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white">
                                Learn More
                            </Button>
                        </div>
                    </div>
                    {/* Decorative background element could go here if needed, keeping it simple for now */}
                </CardContent>
            </Card>
        </div>
    )
}
