"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
    Target,
    Zap,
    Trophy,
    Activity,
    Calendar,
    Award,
    CheckCircle2,
    Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useIssueStore } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function PerformanceReport() {
    const [mounted, setMounted] = useState(false)
    const { issues } = useIssueStore()
    const { projects } = useProjectStore()
    const [projectFilter, setProjectFilter] = useState<string>("all")

    useEffect(() => {
        setMounted(true)
        useIssueStore.persist.rehydrate()
        useProjectStore.persist.rehydrate()
    }, [])

    const filteredIssues = useMemo(() => {
        return projectFilter === "all" ? issues : issues.filter(i => i.projectId === projectFilter)
    }, [issues, projectFilter])

    // Performers: aggregate by assigneeId
    const performers = useMemo(() => {
        const map: Record<string, { name: string; avatar: string; assigneeId: string; tasks: number; done: number; bugs: number; bugsFixed: number; points: number }> = {}
        filteredIssues.forEach(i => {
            const id = i.assigneeId || "unassigned"
            if (id === "unassigned") return
            const name = i.assignee?.name || id
            const avatar = i.assignee?.avatar || ""
            if (!map[id]) {
                map[id] = { name, avatar, assigneeId: id, tasks: 0, done: 0, bugs: 0, bugsFixed: 0, points: 0 }
            }
            map[id].tasks += 1
            if (i.status === "DONE") {
                map[id].done += 1
                map[id].points += i.storyPoints || 0
            }
            if (i.type === "BUG") {
                map[id].bugs += 1
                if (i.status === "DONE") map[id].bugsFixed += 1
            }
        })
        return Object.values(map)
            .map(m => ({
                ...m,
                score: m.tasks > 0 ? Math.round((m.done / m.tasks) * 100) : 0,
                quality: m.bugs > 0 ? `${Math.round((m.bugsFixed / m.bugs) * 100)}%` : "100%",
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
    }, [filteredIssues])

    const totalCompleted = filteredIssues.filter(i => i.status === "DONE").length
    const totalBugs = filteredIssues.filter(i => i.type === "BUG").length
    const bugDensity = filteredIssues.length > 0 ? Math.round((totalBugs / filteredIssues.length) * 100) : 0
    const deliveryScore = filteredIssues.length > 0 ? Math.round((totalCompleted / filteredIssues.length) * 100) : 0

    // Avg cycle time
    const doneWithUpdates = filteredIssues.filter(i => i.status === "DONE" && i.updatedAt)
    const avgCycle = doneWithUpdates.length > 0
        ? doneWithUpdates.reduce((s, i) => {
            const ms = new Date(i.updatedAt!).getTime() - new Date(i.createdAt).getTime()
            return s + ms / (1000 * 60 * 60)
        }, 0) / doneWithUpdates.length
        : 0

    if (!mounted) return null

    return (
        <div className="w-full h-full p-6 space-y-5 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-widest">
                        <Award size={14} />
                        Talent Optimization
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Performance Analytics</h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Evaluate delivery excellence and contributor output.
                    </p>
                </div>
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                    <SelectTrigger className="h-9 w-44 text-xs rounded-none">
                        <SelectValue placeholder="All projects" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All projects</SelectItem>
                        {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Delivery Score", value: `${deliveryScore}/100`, icon: <Target size={18} />, color: "text-indigo-800", bg: "bg-indigo-100" },
                    { label: "Avg Cycle (hrs)", value: `${avgCycle.toFixed(1)}h`, icon: <Zap size={18} />, color: "text-amber-800", bg: "bg-amber-100" },
                    { label: "Bug Density", value: `${bugDensity}%`, icon: <Activity size={18} />, color: "text-rose-800", bg: "bg-rose-100" },
                    { label: "Task Completion", value: totalCompleted, icon: <CheckCircle2 size={18} />, color: "text-emerald-800", bg: "bg-emerald-100" },
                ].map((stat, i) => (
                    <div key={i} className={`block border shadow-sm h-[75px] rounded-none ${stat.bg}`}>
                        <div className="p-4 flex items-center justify-between w-full h-full">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 bg-white ${stat.color} flex items-center justify-center shrink-0 rounded-none`}>{stat.icon}</div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight leading-none">{stat.label}</span>
                                    <span className="text-xl font-black text-slate-900 leading-none mt-1.5">{stat.value}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Leaderboard */}
                <div className="lg:col-span-2 border border-slate-200 bg-white shadow-sm rounded-none">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <Star size={14} className="text-amber-500" />
                            Top Performers
                        </h3>
                    </div>
                    {performers.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-8">No completed tasks yet.</p>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Member</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Score</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Throughput</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Quality</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {performers.map((p) => (
                                    <tr key={p.assigneeId} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 rounded-none">
                                                    {p.avatar && <AvatarImage src={p.avatar} />}
                                                    <AvatarFallback className="rounded-none">{p.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-bold text-slate-700">{p.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-16 bg-slate-100 rounded-none overflow-hidden">
                                                    <div className="h-full bg-indigo-500" style={{ width: `${p.score}%` }} />
                                                </div>
                                                <span className="text-xs font-bold text-slate-900">{p.score}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-800">{p.done}/{p.tasks} tasks · {p.points} pts</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <Badge className="bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase tracking-widest rounded-none">
                                                {p.quality}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Issue type breakdown */}
                <div className="border border-slate-200 bg-white shadow-sm rounded-none">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                        <h3 className="text-sm font-bold text-slate-800">Issue Breakdown</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        {(["TASK", "BUG", "STORY", "EPIC", "SUBTASK"] as const).map(t => {
                            const count = filteredIssues.filter(i => i.type === t).length
                            const pct = filteredIssues.length > 0 ? (count / filteredIssues.length) * 100 : 0
                            return (
                                <div key={t} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-[11px] font-bold">
                                        <span className="text-slate-600">{t}</span>
                                        <span className="text-slate-800">{count} ({Math.round(pct)}%)</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-none">
                                        <div
                                            className={`h-full ${t === "BUG" ? "bg-rose-500" : t === "STORY" ? "bg-emerald-500" : t === "EPIC" ? "bg-purple-500" : t === "SUBTASK" ? "bg-amber-500" : "bg-indigo-500"}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
