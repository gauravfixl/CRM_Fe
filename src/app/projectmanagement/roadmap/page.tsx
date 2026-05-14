"use client"

import React, { useEffect, useMemo, useState } from "react"
import {
    Map,
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar as CalendarIcon,
    Layers,
    Target
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useSprintEpicStore } from "@/shared/data/sprint-epic-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { useIssueStore } from "@/shared/data/issue-store"
import { cn } from "@/lib/utils"
import QuickCreateModal from "@/shared/components/projectmanagement/quick-create-modal"

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"]

function quarterRange(year: number, q: number): [Date, Date] {
    const startMonth = (q - 1) * 3
    const start = new Date(year, startMonth, 1)
    const end = new Date(year, startMonth + 3, 0, 23, 59, 59, 999)
    return [start, end]
}

function whichQuarter(date: Date): number {
    return Math.floor(date.getMonth() / 3) + 1
}

export default function RoadmapPage() {
    const [mounted, setMounted] = useState(false)
    const { epics } = useSprintEpicStore()
    const { projects } = useProjectStore()
    const { issues } = useIssueStore()
    const [year, setYear] = useState(new Date().getFullYear())
    const [projectFilter, setProjectFilter] = useState<string>("all")
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    useEffect(() => {
        setMounted(true)
        useSprintEpicStore.persist.rehydrate()
        useProjectStore.persist.rehydrate()
        useIssueStore.persist.rehydrate()
    }, [])

    const filteredEpics = useMemo(() => {
        return projectFilter === "all" ? epics : epics.filter(e => e.projectId === projectFilter)
    }, [epics, projectFilter])

    // Group epics by quarter based on linked issues' due dates
    const epicQuarter = useMemo(() => {
        const map: Record<string, { quarter: number; issueCount: number; doneCount: number }> = {}
        filteredEpics.forEach(epic => {
            const epicIssues = issues.filter(i => i.epicId === epic.id)
            // Find earliest due date among issues; if none, default to current quarter
            const datesWithDue = epicIssues
                .filter(i => i.dueDate)
                .map(i => new Date(i.dueDate!))
            const yearDates = datesWithDue.filter(d => d.getFullYear() === year)
            const q = yearDates.length > 0 ? whichQuarter(yearDates[0]) : whichQuarter(new Date())
            map[epic.id] = {
                quarter: q,
                issueCount: epicIssues.length,
                doneCount: epicIssues.filter(i => i.status === "DONE").length,
            }
        })
        return map
    }, [filteredEpics, issues, year])

    const epicsByQuarter = (q: number) => filteredEpics.filter(e => epicQuarter[e.id]?.quarter === q)

    if (!mounted) return null

    const currentQ = whichQuarter(new Date())

    const kpis = [
        { label: "Total Epics", value: filteredEpics.length, icon: <Layers size={18} />, color: "text-indigo-800", bg: "bg-indigo-100" },
        { label: "Active", value: filteredEpics.filter(e => e.status === "IN_PROGRESS").length, icon: <Target size={18} />, color: "text-amber-800", bg: "bg-amber-100" },
        { label: "Completed", value: filteredEpics.filter(e => e.status === "DONE").length, icon: <CalendarIcon size={18} />, color: "text-emerald-800", bg: "bg-emerald-100" },
        { label: "Current Quarter", value: `Q${currentQ}`, icon: <Map size={18} />, color: "text-rose-800", bg: "bg-rose-100" },
    ]

    return (
        <div className="w-full h-full p-6 space-y-5 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 flex items-center justify-center text-white shadow-sm rounded-none">
                            <Map size={16} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Roadmap</h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">High-level quarterly planning view of all epics.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white border border-slate-200 shadow-sm rounded-none">
                        <Button onClick={() => setYear(y => y - 1)} variant="ghost" size="icon" className="h-9 w-9 text-slate-500 rounded-none">
                            <ChevronLeft size={16} />
                        </Button>
                        <span className="px-3 text-xs font-bold text-slate-700">{year}</span>
                        <Button onClick={() => setYear(y => y + 1)} variant="ghost" size="icon" className="h-9 w-9 text-slate-500 rounded-none">
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                    <Button onClick={() => setYear(new Date().getFullYear())} variant="outline" size="sm" className="h-9 text-xs rounded-none">
                        This Year
                    </Button>
                    <Select value={projectFilter} onValueChange={setProjectFilter}>
                        <SelectTrigger className="h-9 w-44 text-xs rounded-none">
                            <SelectValue placeholder="All projects" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All projects</SelectItem>
                            {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button onClick={() => setIsCreateOpen(true)} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-2 rounded-none">
                        <Plus size={14} /> New Item
                    </Button>
                </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((stat, i) => (
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

            {/* Quarterly grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {QUARTERS.map((q, idx) => {
                    const qNum = idx + 1
                    const [start, end] = quarterRange(year, qNum)
                    const qEpics = epicsByQuarter(qNum)
                    const isCurrent = year === new Date().getFullYear() && qNum === currentQ
                    return (
                        <div key={q} className={cn("border bg-white shadow-sm flex flex-col rounded-none", isCurrent ? "border-indigo-400 ring-1 ring-indigo-200" : "border-slate-200")}>
                            <div className={cn("px-4 py-3 border-b flex items-center justify-between", isCurrent ? "bg-indigo-50 border-indigo-100" : "bg-slate-50 border-slate-100")}>
                                <div>
                                    <h3 className={cn("text-sm font-bold", isCurrent ? "text-indigo-800" : "text-slate-800")}>{q} <span className="font-normal text-[10px] text-slate-400">· {year}</span></h3>
                                    <p className="text-[10px] font-bold text-slate-500 mt-0.5">{start.toLocaleDateString(undefined, { month: "short" })} – {end.toLocaleDateString(undefined, { month: "short" })}</p>
                                </div>
                                <Badge className={cn("text-[10px] font-bold rounded-none", isCurrent ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600")}>
                                    {qEpics.length} epics
                                </Badge>
                            </div>
                            <div className="flex-1 p-3 space-y-2 min-h-[280px]">
                                {qEpics.length === 0 ? (
                                    <div className="h-full flex items-center justify-center py-8">
                                        <p className="text-[11px] text-slate-300 italic">No epics planned</p>
                                    </div>
                                ) : (
                                    qEpics.map(epic => {
                                        const stats = epicQuarter[epic.id]
                                        const pct = stats.issueCount > 0 ? Math.round((stats.doneCount / stats.issueCount) * 100) : 0
                                        const proj = projects.find(p => p.id === epic.projectId)
                                        return (
                                            <div key={epic.id} className="border border-slate-200 p-3 rounded-none hover:shadow-md transition-shadow group cursor-pointer">
                                                <div className="flex items-start gap-2 mb-2">
                                                    <div className="h-3 w-3 mt-1 shrink-0" style={{ backgroundColor: epic.color }} />
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="text-xs font-bold text-slate-800 truncate">{epic.name}</h4>
                                                        <p className="text-[10px] text-slate-400 truncate">{proj?.name || "Unknown"}</p>
                                                    </div>
                                                    <Badge className={`text-[8px] font-bold rounded-none ${epic.status === "DONE" ? "bg-emerald-50 text-emerald-700" : epic.status === "IN_PROGRESS" ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-600"}`}>
                                                        {epic.status.replace("_", " ")}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[9px] font-bold text-slate-500">
                                                        <span>{stats.doneCount}/{stats.issueCount} issues</span>
                                                        <span>{pct}%</span>
                                                    </div>
                                                    <div className="h-1 w-full bg-slate-100 rounded-none">
                                                        <div className="h-full transition-all rounded-none" style={{ width: `${pct}%`, backgroundColor: epic.color }} />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            <QuickCreateModal isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} />
        </div>
    )
}
