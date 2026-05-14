"use client"

import React, { useEffect, useMemo, useState } from "react"
import {
    History,
    Search,
    Download,
    Activity,
    UserCog,
    FolderKanban,
    GitBranch,
    MessageSquare,
    Trash2,
    Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useAuditLogsStore, type AuditEventType } from "@/shared/data/audit-logs-store"
import { useProjectStore } from "@/shared/data/projects-store"
import RouteGuard from "@/shared/components/projectmanagement/route-guard"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

const EVENT_TYPE_LABELS: Record<AuditEventType, string> = {
    PROJECT_CREATED: "Project Created",
    PROJECT_UPDATED: "Project Updated",
    PROJECT_DELETED: "Project Deleted",
    TASK_CREATED: "Task Created",
    TASK_UPDATED: "Task Updated",
    TASK_DELETED: "Task Deleted",
    TASK_MOVED: "Task Moved",
    MEMBER_ADDED: "Member Added",
    MEMBER_REMOVED: "Member Removed",
    MEMBER_ROLE_CHANGED: "Role Changed",
    WORKFLOW_UPDATED: "Workflow Updated",
    COLUMN_ADDED: "Column Added",
    COLUMN_UPDATED: "Column Updated",
    COLUMN_DELETED: "Column Deleted",
    TEAM_CREATED: "Team Created",
    TEAM_UPDATED: "Team Updated",
    TEAM_DELETED: "Team Deleted",
    COMMENT_ADDED: "Comment Added",
    COMMENT_DELETED: "Comment Deleted",
    DOCUMENT_UPLOADED: "Doc Uploaded",
    DOCUMENT_DELETED: "Doc Deleted",
}

function entityIcon(t: string) {
    switch (t) {
        case "task": return <Activity size={14} />
        case "project": return <FolderKanban size={14} />
        case "member": return <UserCog size={14} />
        case "workflow": return <GitBranch size={14} />
        case "comment": return <MessageSquare size={14} />
        default: return <History size={14} />
    }
}

function entityColor(t: string) {
    switch (t) {
        case "task": return "bg-indigo-50 text-indigo-700"
        case "project": return "bg-emerald-50 text-emerald-700"
        case "member": return "bg-amber-50 text-amber-700"
        case "workflow": return "bg-purple-50 text-purple-700"
        case "comment": return "bg-blue-50 text-blue-700"
        default: return "bg-slate-50 text-slate-600"
    }
}

function AuditLogPageInner() {
    const [mounted, setMounted] = useState(false)
    const { logs, getLogs, clearLogs } = useAuditLogsStore()
    const { projects } = useProjectStore()
    const [query, setQuery] = useState("")
    const [projectFilter, setProjectFilter] = useState<string>("all")
    const [entityFilter, setEntityFilter] = useState<string>("all")
    const [eventFilter, setEventFilter] = useState<string>("all")

    useEffect(() => {
        setMounted(true)
        useAuditLogsStore.persist.rehydrate()
        useProjectStore.persist.rehydrate()
    }, [])

    const filtered = useMemo(() => {
        let list = logs
        if (projectFilter !== "all") list = list.filter(l => l.projectId === projectFilter)
        if (entityFilter !== "all") list = list.filter(l => l.entityType === entityFilter)
        if (eventFilter !== "all") list = list.filter(l => l.eventType === eventFilter)
        const q = query.trim().toLowerCase()
        if (q) {
            list = list.filter(l =>
                (l.entityName || "").toLowerCase().includes(q) ||
                l.userName.toLowerCase().includes(q) ||
                (l.details.action || "").toLowerCase().includes(q)
            )
        }
        return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    }, [logs, projectFilter, entityFilter, eventFilter, query])

    if (!mounted) return null

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `audit-logs-${Date.now()}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleClearOld = () => {
        if (confirm("Clear logs older than 30 days?")) {
            const cutoff = new Date()
            cutoff.setDate(cutoff.getDate() - 30)
            clearLogs(cutoff)
        }
    }

    const totalLogs = logs.length
    const tasks = logs.filter(l => l.entityType === "task").length
    const projectsCount = logs.filter(l => l.entityType === "project").length
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayLogs = logs.filter(l => new Date(l.timestamp) >= today).length

    const kpis = [
        { label: "Total Events", value: totalLogs, icon: <History size={18} />, color: "text-indigo-800", bg: "bg-indigo-100" },
        { label: "Task Events", value: tasks, icon: <Activity size={18} />, color: "text-emerald-800", bg: "bg-emerald-100" },
        { label: "Project Events", value: projectsCount, icon: <FolderKanban size={18} />, color: "text-amber-800", bg: "bg-amber-100" },
        { label: "Today", value: todayLogs, icon: <Calendar size={18} />, color: "text-rose-800", bg: "bg-rose-100" },
    ]

    return (
        <div className="w-full h-full p-6 space-y-5 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 flex items-center justify-center text-white shadow-sm rounded-none">
                            <History size={16} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Audit Log</h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">All recorded actions across projects, issues, sprints and comments.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleClearOld} variant="outline" className="h-9 text-xs font-bold border-slate-200 gap-2 rounded-none">
                        <Trash2 size={14} /> Clear &gt;30d
                    </Button>
                    <Button onClick={handleExport} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-2 rounded-none">
                        <Download size={14} /> Export
                    </Button>
                </div>
            </div>

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

            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by entity, user, or action..." className="pl-9 h-9 bg-white border-slate-200 text-xs font-medium rounded-none" />
                </div>
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                    <SelectTrigger className="h-9 w-40 text-xs rounded-none"><SelectValue placeholder="Project" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All projects</SelectItem>
                        {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={entityFilter} onValueChange={setEntityFilter}>
                    <SelectTrigger className="h-9 w-36 text-xs rounded-none"><SelectValue placeholder="Entity" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All entities</SelectItem>
                        <SelectItem value="task">Task</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="workflow">Workflow</SelectItem>
                        <SelectItem value="comment">Comment</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={eventFilter} onValueChange={setEventFilter}>
                    <SelectTrigger className="h-9 w-44 text-xs rounded-none"><SelectValue placeholder="Event" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All events</SelectItem>
                        {(Object.keys(EVENT_TYPE_LABELS) as AuditEventType[]).map(t => (
                            <SelectItem key={t} value={t}>{EVENT_TYPE_LABELS[t]}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="border border-slate-200 bg-white shadow-sm rounded-none">
                {filtered.length === 0 ? (
                    <div className="py-14 text-center">
                        <History size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-medium text-slate-500">No audit events match these filters.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filtered.slice(0, 200).map(log => (
                            <div key={log.id} className="flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors">
                                <div className={cn("h-9 w-9 flex items-center justify-center shrink-0 rounded-none", entityColor(log.entityType))}>
                                    {entityIcon(log.entityType)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                        <span className="text-sm font-bold text-slate-900">{log.userName}</span>
                                        <Badge className="bg-slate-100 text-slate-700 text-[9px] font-bold rounded-none">{EVENT_TYPE_LABELS[log.eventType] || log.eventType}</Badge>
                                        {log.entityName && (
                                            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-none">{log.entityName}</span>
                                        )}
                                    </div>
                                    <p className="text-[12px] text-slate-600">{log.details.action}</p>
                                    {log.details.changes && log.details.changes.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {log.details.changes.map((c, ci) => (
                                                <div key={ci} className="flex items-center gap-1 text-[10px] bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-none">
                                                    <span className="font-bold text-slate-500">{c.field}:</span>
                                                    <span className="text-rose-500 line-through">{String(c.oldValue ?? "—")}</span>
                                                    <span className="text-slate-400">→</span>
                                                    <span className="text-emerald-600 font-bold">{String(c.newValue ?? "—")}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-[10px] text-slate-400 mt-1">{formatDistanceToNow(new Date(log.timestamp))} ago</p>
                                </div>
                            </div>
                        ))}
                        {filtered.length > 200 && (
                            <div className="text-center py-3 text-[11px] font-bold text-slate-400">
                                Showing first 200 of {filtered.length} events. Use filters to narrow down.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function AuditLogPage() {
    return (
        <RouteGuard required="admin" pageName="Audit Log">
            <AuditLogPageInner />
        </RouteGuard>
    )
}
