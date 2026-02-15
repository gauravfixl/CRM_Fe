"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import { Plus, Filter, Maximize2, Search, Layout, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useIssueStore } from "@/shared/data/issue-store"
import { useSprintEpicStore } from "@/shared/data/sprint-epic-store"

import { differenceInDays, addDays, format, startOfWeek, isSameWeek, isValid, parseISO } from "date-fns"

export default function TimelinePage() {
    const { id } = useParams()
    const projectId = id as string
    const { getIssuesByProject } = useIssueStore()

    const issues = getIssuesByProject(projectId)
    const [viewMode, setViewMode] = useState<"DAYS" | "WEEKS" | "MONTHS">("WEEKS")

    // 1. Calculate Timeline Range
    const dates = issues.flatMap(i => [
        i.createdAt ? new Date(i.createdAt) : new Date(),
        i.dueDate ? new Date(i.dueDate) : addDays(new Date(), 7)
    ])

    const minDate = dates.length ? new Date(Math.min(...dates.map(d => d.getTime()))) : new Date()
    const maxDate = dates.length ? new Date(Math.max(...dates.map(d => d.getTime()))) : addDays(new Date(), 30)

    // Add buffer
    const timelineStart = addDays(minDate, -7)
    const timelineEnd = addDays(maxDate, 14)
    const totalDays = differenceInDays(timelineEnd, timelineStart) || 1

    // 2. Compute Issue Positions
    const timelineIssues = issues.map((issue, idx) => {
        const start = issue.createdAt ? new Date(issue.createdAt) : new Date()
        const end = issue.dueDate ? new Date(issue.dueDate) : addDays(start, 7) // Default 7 days if no due date

        // Clamp to timeline (optional, but good for rendering)
        const daysFromStart = differenceInDays(start, timelineStart)
        const durationDays = differenceInDays(end, start) || 1

        const leftPct = (daysFromStart / totalDays) * 100
        const widthPct = (durationDays / totalDays) * 100

        const colors = ["bg-indigo-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"]

        return {
            ...issue,
            name: issue.title,
            leftPct: Math.max(0, leftPct),
            widthPct: Math.max(0.5, widthPct), // Min width visual
            color: colors[idx % colors.length]
        }
    }).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    // 3. Generate Headers
    const headers = React.useMemo(() => {
        const items = []
        if (viewMode === 'WEEKS') {
            let current = startOfWeek(timelineStart)
            while (current <= timelineEnd) {
                items.push({
                    label: `WEEK ${format(current, "w")}`,
                    subLabel: format(current, "MMM d"),
                    leftPct: (differenceInDays(current, timelineStart) / totalDays) * 100
                })
                current = addDays(current, 7)
            }
        } else {
            // Simple Month/Day fallback logic could go here, sticking to Weeks for Deep implementation prototype
            let current = timelineStart
            const step = Math.ceil(totalDays / 12)
            for (let i = 0; i < 12; i++) {
                items.push({
                    label: format(addDays(current, i * step), "MMM d"),
                    leftPct: (i * step / totalDays) * 100
                })
            }
        }
        return items
    }, [timelineStart, timelineEnd, totalDays, viewMode])

    const projectName = projectId === "p1" ? "Website Redesign" : "Project"

    return (
        <div className="flex flex-col h-full gap-4 max-w-[1400px] mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
                        <Clock className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">{projectName} Roadmap</h1>
                        <p className="text-[13px] text-slate-500 font-medium italic">Cross-project dependencies and delivery schedule.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200">
                        <Button variant="ghost" size="sm" className="h-8 text-[12px] font-bold text-slate-400">Days</Button>
                        <Button variant="secondary" size="sm" className="h-8 text-[12px] font-bold bg-white text-indigo-600 shadow-sm border-none px-4">Weeks</Button>
                        <Button variant="ghost" size="sm" className="h-8 text-[12px] font-bold text-slate-400">Months</Button>
                    </div>
                    <Button variant="outline" size="sm" className="h-10 gap-2 font-bold text-[12px] text-slate-600 border-slate-200 rounded-xl px-4">
                        <Filter size={14} className="text-slate-400" />
                        Configure
                    </Button>
                </div>
            </div>

            {/* Timeline View */}
            <div className="flex flex-col border border-slate-200 rounded-[24px] bg-white shadow-xl shadow-slate-200/50 overflow-hidden min-h-[600px]">
                {/* Timeline Toolbar */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/30">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:bg-white border border-transparent hover:border-slate-100 rounded-lg">
                                <ChevronLeft size={18} />
                            </Button>
                            <span className="text-[14px] font-bold text-slate-700 tracking-tight">January 2026 - March 2026</span>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:bg-white border border-transparent hover:border-slate-100 rounded-lg">
                                <ChevronRight size={18} />
                            </Button>
                        </div>
                        <div className="h-4 w-[1px] bg-slate-200" />
                        <Button variant="ghost" size="sm" className="h-9 text-[12px] font-bold text-indigo-600 hover:bg-indigo-50">Go to Today</Button>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600">
                            <Maximize2 size={18} />
                        </Button>
                    </div>
                </div>

                <div className="flex flex-1 relative overflow-auto custom-scrollbar">
                    {/* Sidebar with task names */}
                    <div className="w-[280px] border-r border-slate-100 flex-shrink-0 bg-white z-10 sticky left-0 shadow-[8px_0_15px_rgba(0,0,0,0.03)]">
                        <div className="h-12 border-b border-slate-100 bg-slate-50/50 flex items-center px-6">
                            <span className="text-[11px] font-bold text-slate-400">Deliverables</span>
                        </div>
                        {timelineIssues.map(item => (
                            <div key={item.id} className="h-16 border-b border-slate-100 px-6 flex flex-col justify-center hover:bg-slate-50 transition-colors group">
                                <span className="text-[13px] font-bold text-slate-700 truncate group-hover:text-indigo-600 transition-colors">{item.name}</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-[9px] h-4 px-1.5 font-bold text-slate-400 border-none bg-slate-100">task</Badge>
                                    <span className="text-[9px] font-bold text-slate-300">{item.id.split('-').pop()}</span>
                                </div>
                            </div>
                        ))}
                        <div className="h-16 flex items-center px-6 bg-slate-50/20">
                            <Button variant="ghost" size="sm" className="h-9 text-indigo-600 font-bold text-[12px] p-0 hover:bg-transparent gap-2">
                                <Plus size={16} /> New Milestone
                            </Button>
                        </div>
                    </div>

                    {/* Timeline Grid */}
                    <div className="flex-1 min-w-[1200px] relative">
                        {/* Days/Weeks Header */}
                        <div className="h-12 border-b border-slate-100 flex bg-slate-50/50 relative overflow-hidden">
                            {headers.map((h, i) => (
                                <div
                                    key={i}
                                    className="absolute top-0 bottom-0 flex flex-col justify-center border-l border-slate-200 pl-2"
                                    style={{ left: `${h.leftPct}%` }}
                                >
                                    <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{h.label}</span>
                                    {h.subLabel && <span className="text-[9px] font-medium text-slate-300">{h.subLabel}</span>}
                                </div>
                            ))}
                        </div>

                        {/* Visual Task Bars */}
                        <div className="relative">
                            {/* Vertical grid lines */}
                            <div className="absolute inset-0 flex pointer-events-none">
                                {headers.map((h, i) => (
                                    <div key={i} className="absolute top-0 bottom-0 border-r border-slate-100/40" style={{ left: `${h.leftPct}%` }} />
                                ))}
                            </div>

                            <div className="relative">
                                {timelineIssues.map((item, index) => (
                                    <div key={item.id} className="h-16 border-b border-slate-100/50 relative flex items-center group">
                                        <div
                                            className={`absolute h-9 rounded-xl ${item.color} shadow-lg shadow-indigo-100/20 border border-white/20 flex items-center px-4 cursor-pointer hover:scale-[1.01] hover:shadow-2xl transition-all z-10`}
                                            style={{
                                                left: `${item.leftPct}%`,
                                                width: `${item.widthPct}%`,
                                            }}
                                        >
                                            <span className="text-[12px] font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis tracking-tight">
                                                {item.name}
                                            </span>
                                            {/* Status Indicator inside bar */}
                                            <div className="ml-auto flex items-center gap-1.5 opacity-60">
                                                <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                            </div>

                                            {/* Handles for dragging logic */}
                                            <div className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/20 rounded-r-xl" />
                                            <div className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/20 rounded-l-xl" />
                                        </div>
                                    </div>
                                ))}
                                <div className="h-16 flex items-center" />
                            </div>

                            {/* Today Marker */}
                            <div className="absolute top-0 bottom-0 left-[28%] w-[3px] bg-rose-500 z-20 shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                                <div className="absolute top-0 -left-[28px] h-[24px] w-[60px] bg-rose-500 rounded-xl flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
                                    Current
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
