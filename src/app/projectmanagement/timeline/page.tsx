"use client"

import React, { useEffect, useState, useMemo } from "react"
import {
    GanttChart,
    Plus,
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Layers,
    Clock,
    CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIssueStore, type Issue } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"
import QuickCreateModal from "@/shared/components/projectmanagement/quick-create-modal"
import { cn } from "@/lib/utils"

const DAYS_WINDOW = 14

function sameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function daysBetween(a: Date, b: Date) {
    const ms = 24 * 60 * 60 * 1000
    const aStart = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime()
    const bStart = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime()
    return Math.floor((bStart - aStart) / ms)
}

function priorityColor(p: string): string {
    if (p === "URGENT") return "bg-rose-500"
    if (p === "HIGH") return "bg-amber-500"
    if (p === "MEDIUM") return "bg-indigo-500"
    return "bg-slate-400"
}

export default function TimelinePage() {
    const [mounted, setMounted] = useState(false)
    const { issues } = useIssueStore()
    const { projects } = useProjectStore()
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [weekOffset, setWeekOffset] = useState(0)

    useEffect(() => {
        setMounted(true)
        useIssueStore.persist.rehydrate()
        useProjectStore.persist.rehydrate()
    }, [])

    const days = useMemo(() => {
        const baseDate = new Date()
        baseDate.setHours(0, 0, 0, 0)
        baseDate.setDate(baseDate.getDate() + weekOffset * 7 - baseDate.getDay())
        return Array.from({ length: DAYS_WINDOW }, (_, i) => {
            const d = new Date(baseDate)
            d.setDate(d.getDate() + i)
            return d
        })
    }, [weekOffset])

    const windowStart = days[0]
    const windowEnd = days[days.length - 1]

    // Group issues by project, filter to those falling within window
    const issuesByProject = useMemo(() => {
        const map: Record<string, Issue[]> = {}
        if (!windowStart || !windowEnd) return map
        const winStart = new Date(windowStart).setHours(0, 0, 0, 0)
        const winEnd = new Date(windowEnd).setHours(23, 59, 59, 999)
        issues.forEach(issue => {
            const start = issue.startDate ? new Date(issue.startDate).getTime() : issue.createdAt ? new Date(issue.createdAt).getTime() : null
            const end = issue.dueDate ? new Date(issue.dueDate).getTime() : start
            if (start === null || end === null) return
            // Overlap check
            if (end < winStart || start > winEnd) return
            if (!map[issue.projectId]) map[issue.projectId] = []
            map[issue.projectId].push(issue)
        })
        return map
    }, [issues, windowStart, windowEnd])

    if (!mounted) return null

    const total = issues.length
    const inProgress = issues.filter(i => i.status === "IN_PROGRESS").length
    const done = issues.filter(i => i.status === "DONE").length
    const upcoming = issues.filter(i => i.dueDate && new Date(i.dueDate) > new Date()).length

    const kpis = [
        { label: "All Items", value: total, icon: <Layers size={18} />, color: "text-indigo-800", bg: "bg-indigo-100" },
        { label: "In Progress", value: inProgress, icon: <Clock size={18} />, color: "text-amber-800", bg: "bg-amber-100" },
        { label: "Upcoming", value: upcoming, icon: <CalendarIcon size={18} />, color: "text-emerald-800", bg: "bg-emerald-100" },
        { label: "Completed", value: done, icon: <CheckCircle2 size={18} />, color: "text-blue-800", bg: "bg-blue-100" },
    ]

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return (
        <div className="w-full h-full p-6 space-y-5 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 flex items-center justify-center text-white shadow-sm rounded-none">
                            <GanttChart size={16} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Timeline</h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                        Visualize project schedules and milestone progress.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white border border-slate-200 shadow-sm rounded-none">
                        <Button onClick={() => setWeekOffset(w => w - 1)} variant="ghost" size="icon" className="h-9 w-9 text-slate-500 rounded-none">
                            <ChevronLeft size={16} />
                        </Button>
                        <span className="px-3 text-xs font-bold text-slate-700">
                            {windowStart?.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – {windowEnd?.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                        <Button onClick={() => setWeekOffset(w => w + 1)} variant="ghost" size="icon" className="h-9 w-9 text-slate-500 rounded-none">
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                    <Button onClick={() => setWeekOffset(0)} variant="outline" size="sm" className="h-9 text-xs rounded-none">
                        Today
                    </Button>
                    <Button onClick={() => setIsCreateOpen(true)} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-2 rounded-none">
                        <Plus size={14} /> New Item
                    </Button>
                </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((stat, i) => (
                    <div
                        key={i}
                        className={`block border shadow-sm overflow-hidden hover:shadow-md transition-all h-[75px] rounded-none ${stat.bg}`}
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
                    </div>
                ))}
            </div>

            {/* Gantt timeline */}
            <div className="border border-slate-200 bg-white overflow-auto shadow-sm rounded-none">
                <div className="min-w-[1200px]">
                    {/* Day headers */}
                    <div className="grid border-b border-slate-200 bg-slate-50 sticky top-0 z-10" style={{ gridTemplateColumns: `260px repeat(${DAYS_WINDOW}, minmax(70px, 1fr))` }}>
                        <div className="py-2 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide">Project / Issue</div>
                        {days.map((d, i) => {
                            const isWeekend = d.getDay() === 0 || d.getDay() === 6
                            const isToday = sameDay(d, today)
                            return (
                                <div key={i} className={cn(
                                    "py-2 text-center text-[10px] font-bold uppercase tracking-wide border-l border-slate-100",
                                    isWeekend && "bg-slate-100",
                                    isToday && "bg-indigo-100 text-indigo-700",
                                    !isWeekend && !isToday && "text-slate-500"
                                )}>
                                    <div>{d.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                                    <div className={cn("font-medium", isToday ? "text-indigo-600" : "text-slate-400")}>{d.getDate()}</div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Rows */}
                    {projects.length === 0 ? (
                        <div className="p-10 text-center text-slate-400 text-xs">No projects to display.</div>
                    ) : (
                        projects.slice(0, 12).map(p => {
                            const projIssues = (issuesByProject[p.id] || []).slice(0, 8)
                            return (
                                <div key={p.id} className="border-b border-slate-100">
                                    <div className="grid hover:bg-slate-50/50 transition-colors" style={{ gridTemplateColumns: `260px repeat(${DAYS_WINDOW}, minmax(70px, 1fr))` }}>
                                        <div className="py-3 px-3 flex items-center gap-2 text-xs font-bold text-slate-700 border-r border-slate-100 bg-slate-50/30">
                                            <span className="text-lg">{p.icon}</span>
                                            <div className="flex flex-col min-w-0">
                                                <span className="truncate">{p.name}</span>
                                                <span className="text-[10px] font-medium text-slate-400">{projIssues.length} item{projIssues.length !== 1 ? 's' : ''}</span>
                                            </div>
                                        </div>
                                        <div className="col-span-full" style={{ gridColumn: `2 / ${DAYS_WINDOW + 2}` }}>
                                            <div className="relative h-full" style={{ minHeight: `${Math.max(40, projIssues.length * 22 + 10)}px` }}>
                                                {/* Day grid */}
                                                <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${DAYS_WINDOW}, 1fr)` }}>
                                                    {days.map((d, i) => {
                                                        const isWeekend = d.getDay() === 0 || d.getDay() === 6
                                                        const isToday = sameDay(d, today)
                                                        return (
                                                            <div key={i} className={cn(
                                                                "border-l border-slate-50 h-full",
                                                                isWeekend && "bg-slate-50/40",
                                                                isToday && "bg-indigo-50/30"
                                                            )} />
                                                        )
                                                    })}
                                                </div>
                                                {/* Issue bars */}
                                                {projIssues.map((issue, idx) => {
                                                    const startSrc = issue.startDate || issue.createdAt
                                                    const start = new Date(startSrc)
                                                    start.setHours(0, 0, 0, 0)
                                                    const end = issue.dueDate ? new Date(issue.dueDate) : start
                                                    end.setHours(0, 0, 0, 0)

                                                    const windowStartCopy = new Date(windowStart)
                                                    windowStartCopy.setHours(0, 0, 0, 0)
                                                    const startIdx = Math.max(0, daysBetween(new Date(windowStartCopy), new Date(start)))
                                                    const endIdx = Math.min(DAYS_WINDOW - 1, daysBetween(new Date(windowStartCopy), new Date(end)))
                                                    const span = Math.max(1, endIdx - startIdx + 1)
                                                    const left = (startIdx / DAYS_WINDOW) * 100
                                                    const width = (span / DAYS_WINDOW) * 100

                                                    return (
                                                        <div
                                                            key={issue.id}
                                                            className={cn(
                                                                "absolute flex items-center px-2 text-[10px] font-bold text-white truncate shadow-sm hover:shadow-md transition-all cursor-pointer",
                                                                priorityColor(issue.priority),
                                                                issue.status === "DONE" && "opacity-60 line-through"
                                                            )}
                                                            style={{
                                                                top: `${6 + idx * 22}px`,
                                                                left: `calc(${left}% + 2px)`,
                                                                width: `calc(${width}% - 4px)`,
                                                                height: '18px',
                                                            }}
                                                            title={`${issue.title}\n${start.toLocaleDateString()} → ${end.toLocaleDateString()}\nStatus: ${issue.status}`}
                                                        >
                                                            {issue.title}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500">
                <div className="flex items-center gap-1.5"><div className="h-3 w-4 bg-rose-500" /> Urgent</div>
                <div className="flex items-center gap-1.5"><div className="h-3 w-4 bg-amber-500" /> High</div>
                <div className="flex items-center gap-1.5"><div className="h-3 w-4 bg-indigo-500" /> Medium</div>
                <div className="flex items-center gap-1.5"><div className="h-3 w-4 bg-slate-400" /> Low</div>
                <div className="flex items-center gap-1.5"><div className="h-3 w-4 bg-indigo-100 border border-indigo-300" /> Today</div>
            </div>

            <QuickCreateModal isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} />
        </div>
    )
}
