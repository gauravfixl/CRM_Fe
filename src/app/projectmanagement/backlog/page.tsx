"use client"

import React, { useEffect, useState, useMemo } from "react"
import {
    LayoutList,
    Plus,
    Search,
    ChevronRight,
    Inbox,
    Layers,
    Calendar as CalendarIcon,
    AlertTriangle,
    Filter
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useIssueStore } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"
import QuickCreateModal from "@/shared/components/projectmanagement/quick-create-modal"
import { cn } from "@/lib/utils"

export default function BacklogPage() {
    const [mounted, setMounted] = useState(false)
    const { issues } = useIssueStore()
    const { projects } = useProjectStore()
    const [query, setQuery] = useState("")
    const [projectFilter, setProjectFilter] = useState<string>("all")
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    useEffect(() => {
        setMounted(true)
        useIssueStore.persist.rehydrate()
        useProjectStore.persist.rehydrate()
    }, [])

    if (!mounted) return null

    const backlogIssues = useMemo(() => {
        return issues.filter(i => {
            if (i.status === "DONE") return false
            if (projectFilter !== "all" && i.projectId !== projectFilter) return false
            const q = query.trim().toLowerCase()
            if (!q) return true
            return i.title.toLowerCase().includes(q)
        })
    }, [issues, query, projectFilter])

    const totalCount = issues.filter(i => i.status !== "DONE").length
    const urgentCount = issues.filter(i => i.status !== "DONE" && (i.priority === "URGENT" || i.priority === "HIGH")).length
    const unassignedCount = issues.filter(i => i.status !== "DONE" && !i.assigneeId).length
    const overdueCount = issues.filter(i => i.status !== "DONE" && i.dueDate && new Date(i.dueDate) < new Date()).length

    const kpis = [
        { label: "Total Backlog", value: totalCount, icon: <LayoutList size={18} />, color: "text-indigo-800", bg: "bg-indigo-100" },
        { label: "High Priority", value: urgentCount, icon: <AlertTriangle size={18} />, color: "text-rose-800", bg: "bg-rose-100" },
        { label: "Unassigned", value: unassignedCount, icon: <Inbox size={18} />, color: "text-amber-800", bg: "bg-amber-100" },
        { label: "Overdue", value: overdueCount, icon: <CalendarIcon size={18} />, color: "text-emerald-800", bg: "bg-emerald-100" },
    ]

    const getProjectKey = (id: string) => projects.find(p => p.id === id)?.key || "PROJ"
    const getProjectName = (id: string) => projects.find(p => p.id === id)?.name || "Unknown"

    return (
        <div className="w-full h-full p-6 space-y-5 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 flex items-center justify-center text-white shadow-sm rounded-none">
                            <LayoutList size={16} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Backlog</h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                        All open work items across projects, ready to be planned.
                    </p>
                </div>
                <Button
                    onClick={() => setIsCreateOpen(true)}
                    className="h-9 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2 rounded-none"
                >
                    <Plus size={14} strokeWidth={3} /> New Item
                </Button>
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
                            <ChevronRight size={16} className="text-slate-500/60" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 p-3 border border-slate-200 rounded-none">
                <div className="flex items-center gap-2 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search backlog..."
                            className="pl-9 h-9 bg-white border-slate-200 text-xs font-medium rounded-none"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto">
                    <button
                        type="button"
                        onClick={() => setProjectFilter("all")}
                        className={cn(
                            "px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide border-b-2 transition-colors rounded-none",
                            projectFilter === "all" ? "text-indigo-700 border-indigo-600" : "text-slate-500 border-transparent hover:text-slate-700"
                        )}
                    >
                        All
                    </button>
                    {projects.slice(0, 5).map(p => (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => setProjectFilter(p.id)}
                            className={cn(
                                "px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap rounded-none",
                                projectFilter === p.id ? "text-indigo-700 border-indigo-600" : "text-slate-500 border-transparent hover:text-slate-700"
                            )}
                        >
                            {p.key}
                        </button>
                    ))}
                </div>
            </div>

            {/* Backlog list */}
            <div className="border border-slate-200 bg-white shadow-sm rounded-none">
                {backlogIssues.length === 0 ? (
                    <div className="py-14 text-center text-slate-400">
                        <LayoutList size={32} className="mx-auto mb-2 text-slate-300" />
                        <p className="text-sm font-medium">Backlog is clear.</p>
                        <p className="text-xs mt-1">Create new items to start planning your sprint.</p>
                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            className="mt-3 h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2 rounded-none"
                        >
                            <Plus size={14} strokeWidth={3} /> Add first item
                        </Button>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {backlogIssues.map(issue => (
                            <Link
                                key={issue.id}
                                href={`/projectmanagement/projects/${issue.projectId}/board`}
                                className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors group"
                            >
                                <Badge className="bg-slate-50 text-slate-500 border border-slate-200 text-[10px] font-bold px-1.5 h-5 rounded-none">
                                    {getProjectKey(issue.projectId)}-{issue.id}
                                </Badge>
                                <span className={`text-[11px] font-bold uppercase tracking-wide ${issue.status === "TODO" ? "text-slate-500" : issue.status === "IN_PROGRESS" ? "text-amber-600" : "text-blue-600"}`}>
                                    {issue.status.replace("_", " ")}
                                </span>
                                <h4 className="text-sm font-bold text-slate-800 truncate flex-1 group-hover:text-indigo-600 transition-colors">
                                    {issue.title}
                                </h4>
                                <span className="hidden md:inline text-[11px] font-medium text-slate-400">{getProjectName(issue.projectId)}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide rounded-none ${issue.priority === 'URGENT' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                    issue.priority === 'HIGH' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                        'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                    }`}>
                                    {issue.priority}
                                </span>
                                <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <QuickCreateModal isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} />
        </div>
    )
}
