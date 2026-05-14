"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
    Zap,
    Target,
    Activity,
    LineChart,
    Calendar,
    Download,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    PlayCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSprintStore } from "@/shared/data/sprint-store"
import { useIssueStore } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function SprintProgressReport() {
    const [mounted, setMounted] = useState(false)
    const { sprints } = useSprintStore()
    const { issues } = useIssueStore()
    const { projects } = useProjectStore()
    const [projectFilter, setProjectFilter] = useState<string>("all")

    useEffect(() => {
        setMounted(true)
        useSprintStore.persist.rehydrate()
        useIssueStore.persist.rehydrate()
        useProjectStore.persist.rehydrate()
    }, [])

    const filteredSprints = useMemo(() => {
        const list = sprints.filter(s => !s.isDeleted)
        if (projectFilter === "all") return list
        return list.filter(s => s.projectId === projectFilter)
    }, [sprints, projectFilter])

    const activeSprint = useMemo(() => filteredSprints.find(s => s.status === "ACTIVE"), [filteredSprints])
    const completedSprints = useMemo(() =>
        filteredSprints.filter(s => s.status === "COMPLETED").sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        [filteredSprints]
    )

    // Compute real metrics from issues + sprints
    const sprintMetrics = useMemo(() => {
        const sprintIssues = (sprintId: string) => issues.filter(i => i.sprintId === sprintId)
        const sumPoints = (list: typeof issues) => list.reduce((s, i) => s + (i.storyPoints || 0), 0)

        const avgVelocity = completedSprints.length > 0
            ? Math.round(completedSprints.reduce((s, sp) => s + sumPoints(sprintIssues(sp.id).filter(i => i.status === "DONE")), 0) / completedSprints.length)
            : 0

        const allCompletion = filteredSprints.map(sp => {
            const issuesInSprint = sprintIssues(sp.id)
            if (issuesInSprint.length === 0) return 0
            return issuesInSprint.filter(i => i.status === "DONE").length / issuesInSprint.length
        })
        const completionRate = allCompletion.length > 0
            ? Math.round((allCompletion.reduce((s, v) => s + v, 0) / allCompletion.length) * 100)
            : 0

        // Scope creep: issues added to sprint after start (frontend approximation: issues without storyPoints estimate)
        const scopeCreep = sprintIssues(activeSprint?.id || "").filter(i => !i.storyPoints || i.storyPoints === 0).length

        // Cycle time: avg days from createdAt to updatedAt for DONE issues
        const doneIssues = issues.filter(i => i.status === "DONE" && i.updatedAt)
        const avgCycleDays = doneIssues.length > 0
            ? doneIssues.reduce((s, i) => {
                const days = (new Date(i.updatedAt!).getTime() - new Date(i.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                return s + days
            }, 0) / doneIssues.length
            : 0

        return {
            avgVelocity,
            completionRate,
            scopeCreep,
            avgCycleDays: Math.round(avgCycleDays * 10) / 10,
        }
    }, [filteredSprints, completedSprints, activeSprint, issues])

    // Active sprint burndown: days vs remaining points
    const burndown = useMemo(() => {
        if (!activeSprint || !activeSprint.startDate || !activeSprint.endDate) return []
        const start = new Date(activeSprint.startDate)
        const end = new Date(activeSprint.endDate)
        const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
        const sprintIssues = issues.filter(i => i.sprintId === activeSprint.id)
        const totalPoints = sprintIssues.reduce((s, i) => s + (i.storyPoints || 0), 0)
        const today = new Date()

        return Array.from({ length: totalDays + 1 }, (_, dayIdx) => {
            const date = new Date(start)
            date.setDate(date.getDate() + dayIdx)
            const ideal = Math.max(0, totalPoints * (1 - dayIdx / totalDays))

            const isPast = date <= today
            const completedByDay = isPast
                ? sprintIssues
                    .filter(i => i.status === "DONE" && i.updatedAt && new Date(i.updatedAt) <= date)
                    .reduce((s, i) => s + (i.storyPoints || 0), 0)
                : null
            const remaining = completedByDay !== null ? Math.max(0, totalPoints - completedByDay) : null

            return { day: dayIdx, date, ideal: Math.round(ideal), remaining }
        })
    }, [activeSprint, issues])

    const maxBurnPoints = useMemo(() => {
        const vals = burndown.map(b => Math.max(b.ideal, b.remaining ?? 0))
        return Math.max(1, ...vals)
    }, [burndown])

    // Velocity history: last 6 completed sprints
    const velocityHistory = useMemo(() => {
        return completedSprints.slice(0, 6).reverse().map(sp => {
            const sprintIssues = issues.filter(i => i.sprintId === sp.id)
            const completed = sprintIssues.filter(i => i.status === "DONE").reduce((s, i) => s + (i.storyPoints || 0), 0)
            const planned = sprintIssues.reduce((s, i) => s + (i.storyPoints || 0), 0)
            return { sprint: sp.name, completed, planned, ratio: planned > 0 ? Math.round((completed / planned) * 100) : 0 }
        })
    }, [completedSprints, issues])

    if (!mounted) return null

    const handleExport = () => {
        const data = {
            sprints: filteredSprints,
            metrics: sprintMetrics,
            burndown,
            velocityHistory,
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `sprint-report-${Date.now()}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="w-full h-full p-6 space-y-5 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
                        <LineChart size={14} />
                        Sprint Analytics
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sprint & Progress Report</h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Real-time visualization of sprint velocity and throughput.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={projectFilter} onValueChange={setProjectFilter}>
                        <SelectTrigger className="h-9 w-44 text-xs rounded-none">
                            <SelectValue placeholder="All projects" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All projects</SelectItem>
                            {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleExport} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-2 rounded-none">
                        <Download size={14} /> Export
                    </Button>
                </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Avg. Velocity", value: `${sprintMetrics.avgVelocity} pts`, icon: <Zap size={18} />, color: "text-indigo-800", bg: "bg-indigo-100" },
                    { title: "Completion Rate", value: `${sprintMetrics.completionRate}%`, icon: <Target size={18} />, color: "text-emerald-800", bg: "bg-emerald-100" },
                    { title: "Active Sprint Tasks", value: activeSprint ? issues.filter(i => i.sprintId === activeSprint.id).length : 0, icon: <Activity size={18} />, color: "text-amber-800", bg: "bg-amber-100" },
                    { title: "Cycle Time (days)", value: `${sprintMetrics.avgCycleDays}d`, icon: <BarChart3 size={18} />, color: "text-rose-800", bg: "bg-rose-100" }
                ].map((stat, i) => (
                    <div key={i} className={`block border shadow-sm h-[75px] rounded-none ${stat.bg}`}>
                        <div className="p-4 flex items-center justify-between w-full h-full">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 bg-white ${stat.color} flex items-center justify-center shrink-0 rounded-none`}>
                                    {stat.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight leading-none">{stat.title}</span>
                                    <span className="text-xl font-black text-slate-900 leading-none mt-1.5">{stat.value}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Burn-down */}
                <div className="lg:col-span-2 border border-slate-200 bg-white shadow-sm rounded-none">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Burndown Chart</h3>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">{activeSprint?.name || "No active sprint"}</p>
                        </div>
                        {activeSprint && <Badge className="bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-none">ACTIVE</Badge>}
                    </div>
                    <div className="p-6">
                        {!activeSprint ? (
                            <div className="py-12 text-center text-slate-400">
                                <PlayCircle size={32} className="mx-auto mb-2 text-slate-300" />
                                <p className="text-sm font-medium">No active sprint to chart.</p>
                            </div>
                        ) : burndown.length === 0 ? (
                            <p className="text-xs text-slate-400 text-center py-8">Sprint has no start/end dates.</p>
                        ) : (
                            <div className="relative h-[260px] w-full flex items-end gap-1">
                                {burndown.map((b, i) => {
                                    const idealH = (b.ideal / maxBurnPoints) * 100
                                    const remH = b.remaining !== null ? (b.remaining / maxBurnPoints) * 100 : null
                                    return (
                                        <div key={i} className="flex-1 flex flex-col justify-end gap-1 group cursor-pointer h-full relative">
                                            {/* Ideal line dot */}
                                            <div className="absolute w-full" style={{ bottom: `${idealH}%` }}>
                                                <div className="h-px w-full bg-slate-300 border-dashed" />
                                            </div>
                                            {remH !== null && (
                                                <div
                                                    className="w-full bg-indigo-600 group-hover:bg-indigo-700 transition-all relative"
                                                    style={{ height: `${remH}%`, minHeight: '2px' }}
                                                >
                                                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                        Day {b.day}: {b.remaining} pts
                                                    </div>
                                                </div>
                                            )}
                                            <span className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-tighter">{b.day}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Velocity history */}
                <div className="border border-slate-200 bg-white shadow-sm rounded-none">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                        <h3 className="text-sm font-bold text-slate-800">Velocity History</h3>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">Last {velocityHistory.length} sprints</p>
                    </div>
                    <div className="p-6 space-y-5">
                        {velocityHistory.length === 0 ? (
                            <p className="text-xs text-slate-400 text-center py-8">No completed sprints.</p>
                        ) : (
                            velocityHistory.map((v, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-[11px] font-bold">
                                        <span className="text-slate-600 truncate">{v.sprint}</span>
                                        <span className="text-slate-800">{v.completed}/{v.planned} pts</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-none">
                                        <div
                                            className={`h-full ${v.ratio >= 100 ? 'bg-emerald-500' : v.ratio >= 80 ? 'bg-indigo-500' : 'bg-amber-500'} transition-all duration-500`}
                                            style={{ width: `${Math.min(v.ratio, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
