"use client"

import React, { useEffect, useState } from "react"
import {
    LayoutGrid,
    Plus,
    Activity,
    BarChart3,
    Users,
    PieChart,
    TrendingUp,
    ChevronRight,
    Settings2
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useIssueStore } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { useTeamStore } from "@/shared/data/team-store"
import { useSprintStore } from "@/shared/data/sprint-store"

interface Widget {
    id: string
    title: string
    type: "stat" | "chart" | "list"
    value?: string | number
    icon?: React.ReactNode
    color?: string
    bg?: string
    href?: string
}

export default function DashboardWidgetsPage() {
    const [mounted, setMounted] = useState(false)
    const { issues } = useIssueStore()
    const { projects } = useProjectStore()
    const { members } = useTeamStore()
    const { sprints } = useSprintStore()
    const [editMode, setEditMode] = useState(false)

    useEffect(() => { setMounted(true) }, [])
    if (!mounted) return null

    // Real velocity: average completed points across last 3 completed sprints
    const completedSprints = sprints.filter(s => s.status === "COMPLETED" && !s.isDeleted).slice(-3)
    const velocity = completedSprints.length > 0
        ? Math.round(completedSprints.reduce((s, sp) => s + (sp.completedPoints || 0), 0) / completedSprints.length)
        : 0

    const widgets: Widget[] = [
        { id: "w1", title: "Active Projects", type: "stat", value: projects.filter(p => p.status === "Active").length, icon: <LayoutGrid size={18} />, color: "text-indigo-800", bg: "bg-indigo-100", href: "/projectmanagement/projects?status=Active" },
        { id: "w2", title: "Open Tasks", type: "stat", value: issues.filter(i => i.status !== "DONE").length, icon: <Activity size={18} />, color: "text-emerald-800", bg: "bg-emerald-100", href: "/projectmanagement/my-work" },
        { id: "w3", title: "Team Members", type: "stat", value: members.length, icon: <Users size={18} />, color: "text-amber-800", bg: "bg-amber-100", href: "/projectmanagement/people" },
        { id: "w4", title: "Sprint Velocity", type: "stat", value: `${velocity} pts`, icon: <TrendingUp size={18} />, color: "text-rose-800", bg: "bg-rose-100", href: "/projectmanagement/reports/sprint" },
    ]

    return (
        <div className="w-full h-full p-6 space-y-5 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 flex items-center justify-center text-white shadow-sm rounded-none">
                            <LayoutGrid size={16} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Custom Dashboard</h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                        Configurable widgets and at-a-glance metrics.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => setEditMode(!editMode)} variant="outline" className="h-9 text-xs gap-2 rounded-none">
                        <Settings2 size={14} /> {editMode ? "Done Editing" : "Customize"}
                    </Button>
                    <Button className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-2 rounded-none">
                        <Plus size={14} strokeWidth={3} /> Add Widget
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {widgets.map(w => (
                    <Link
                        key={w.id}
                        href={w.href || "#"}
                        className={`block border shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all h-[75px] rounded-none cursor-pointer ${w.bg}`}
                    >
                        <div className="p-4 flex items-center justify-between w-full h-full">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 bg-white ${w.color} flex items-center justify-center shrink-0 rounded-none`}>
                                    {w.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight leading-none">{w.title}</span>
                                    <span className="text-xl font-black text-slate-900 leading-none mt-1.5">{w.value}</span>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-500/60" />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <Card className="border border-slate-200 p-5 bg-white rounded-none">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <BarChart3 size={16} className="text-indigo-600" /> Sprint Velocity
                        </h3>
                        <Link href="/projectmanagement/reports/sprint" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">View report →</Link>
                    </div>
                    <div className="flex items-end gap-2 h-32">
                        {[60, 75, 50, 80, 45, 90, 65].map((h, i) => (
                            <div key={i} className="flex-1 bg-indigo-100 relative">
                                <div className="absolute bottom-0 w-full bg-indigo-500 transition-all" style={{ height: `${h}%` }} />
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="border border-slate-200 p-5 bg-white rounded-none">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <PieChart size={16} className="text-emerald-600" /> Status Distribution
                        </h3>
                        <Link href="/projectmanagement/analytics" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">View analytics →</Link>
                    </div>
                    <div className="space-y-2">
                        {[
                            { label: "To Do", count: issues.filter(i => i.status === "TODO").length, color: "bg-slate-400" },
                            { label: "In Progress", count: issues.filter(i => i.status === "IN_PROGRESS").length, color: "bg-amber-500" },
                            { label: "In Review", count: issues.filter(i => i.status === "IN_REVIEW").length, color: "bg-blue-500" },
                            { label: "Done", count: issues.filter(i => i.status === "DONE").length, color: "bg-emerald-500" },
                        ].map(s => (
                            <div key={s.label} className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold text-slate-600">
                                    <span>{s.label}</span>
                                    <span>{s.count}</span>
                                </div>
                                <div className="h-2 bg-slate-100">
                                    <div className={`h-full ${s.color}`} style={{ width: `${Math.min(s.count * 10, 100)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}
