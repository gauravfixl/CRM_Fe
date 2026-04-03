"use client"

import React, { useState, useMemo, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import {
    Calendar, Plus, MoreHorizontal, ChevronDown, ChevronRight, Filter,
    Download, Eye, X, Clock, User, Flag, Layers, ZoomIn, ZoomOut,
    ArrowRight, Circle, CheckCircle2, AlertTriangle, Target
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import { useIssueStore, type Issue, type IssueStatus, type IssuePriority } from "@/shared/data/issue-store"
import { useSprintEpicStore, type Epic } from "@/shared/data/sprint-epic-store"
import { useIssueLinkStore } from "@/shared/data/issue-link-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"

const statusBarColors: Record<string, string> = {
    TODO: "#a1a1aa", BACKLOG: "#d4d4d8", IN_PROGRESS: "#3b82f6", IN_REVIEW: "#8b5cf6",
    DONE: "#22c55e", BLOCKED: "#ef4444", TESTING: "#f59e0b", COMPLETED: "#22c55e",
}
const priorityBarColors: Record<string, string> = {
    LOW: "#93c5fd", MEDIUM: "#fbbf24", HIGH: "#f97316", URGENT: "#ef4444",
}
const statusBadge: Record<string, string> = {
    TODO: "bg-zinc-100 text-zinc-600", IN_PROGRESS: "bg-blue-100 text-blue-700",
    DONE: "bg-green-100 text-green-700", BACKLOG: "bg-zinc-50 text-zinc-500",
    BLOCKED: "bg-red-100 text-red-600", IN_REVIEW: "bg-purple-100 text-purple-700",
}
const priorityBadge: Record<string, string> = {
    URGENT: "bg-red-100 text-red-700", HIGH: "bg-orange-100 text-orange-700",
    MEDIUM: "bg-yellow-100 text-yellow-700", LOW: "bg-blue-100 text-blue-700",
}

type ZoomLevel = "week" | "month" | "quarter"
type ColorBy = "status" | "priority" | "assignee"

function addDays(date: Date, days: number) { const d = new Date(date); d.setDate(d.getDate() + days); return d }
function startOfWeek(date: Date) { const d = new Date(date); d.setDate(d.getDate() - d.getDay() + 1); return d }
function formatShort(d: Date) { return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) }

function getTimelineRange(issues: Issue[], zoom: ZoomLevel) {
    const now = new Date()
    let minDate = addDays(now, -30)
    let maxDate = addDays(now, 90)
    issues.forEach(i => {
        if (i.startDate) { const d = new Date(i.startDate); if (d < minDate) minDate = d }
        if (i.dueDate) { const d = new Date(i.dueDate); if (d > maxDate) maxDate = d }
    })
    minDate = addDays(minDate, -7)
    maxDate = addDays(maxDate, 14)
    return { minDate, maxDate }
}

function getColumns(minDate: Date, maxDate: Date, zoom: ZoomLevel) {
    const cols: { label: string; start: Date; end: Date }[] = []
    const d = new Date(minDate)
    if (zoom === "week") {
        const s = startOfWeek(d)
        while (s < maxDate) {
            const end = addDays(s, 6)
            cols.push({ label: formatShort(s), start: new Date(s), end })
            s.setDate(s.getDate() + 7)
        }
    } else if (zoom === "month") {
        d.setDate(1)
        while (d < maxDate) {
            const end = new Date(d.getFullYear(), d.getMonth() + 1, 0)
            cols.push({ label: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }), start: new Date(d), end })
            d.setMonth(d.getMonth() + 1)
        }
    } else {
        d.setDate(1); d.setMonth(Math.floor(d.getMonth() / 3) * 3)
        while (d < maxDate) {
            const end = new Date(d.getFullYear(), d.getMonth() + 3, 0)
            cols.push({ label: `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear()}`, start: new Date(d), end })
            d.setMonth(d.getMonth() + 3)
        }
    }
    return cols
}

function getBarPosition(issue: Issue, minDate: Date, totalDays: number) {
    const start = issue.startDate ? new Date(issue.startDate) : new Date(issue.createdAt)
    const end = issue.dueDate ? new Date(issue.dueDate) : addDays(start, 7)
    const leftPct = Math.max(0, ((start.getTime() - minDate.getTime()) / (totalDays * 86400000)) * 100)
    const widthPct = Math.max(2, ((end.getTime() - start.getTime()) / (totalDays * 86400000)) * 100)
    return { leftPct: Math.min(leftPct, 100), widthPct: Math.min(widthPct, 100 - leftPct) }
}

export default function TimelinePage() {
    const params = useParams()
    const { issues, addIssue } = useIssueStore()
    const { epics } = useSprintEpicStore()
    const { links } = useIssueLinkStore()
    const { projects } = useProjectStore()
    const { activeWorkspaceId } = useWorkspaceStore()

    const [selectedProjectId, setSelectedProjectId] = useState<string>("")
    const [zoom, setZoom] = useState<ZoomLevel>("month")
    const [colorBy, setColorBy] = useState<ColorBy>("status")
    const [filterStatus, setFilterStatus] = useState<string>("all")
    const [filterPriority, setFilterPriority] = useState<string>("all")
    const [filterEpic, setFilterEpic] = useState<string>("all")
    const [filterAssignee, setFilterAssignee] = useState<string>("all")
    const [expandedEpics, setExpandedEpics] = useState<Set<string>>(new Set(["epic-01", "__no_epic__"]))
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [createDate, setCreateDate] = useState("")
    const [newIssue, setNewIssue] = useState({ title: "", description: "", priority: "MEDIUM" as IssuePriority, status: "TODO" as IssueStatus, startDate: "", dueDate: "" })
    const scrollRef = useRef<HTMLDivElement>(null)

    const workspaceProjects = useMemo(() =>
        projects.filter(p => !activeWorkspaceId || p.workspaceId === activeWorkspaceId),
        [projects, activeWorkspaceId]
    )

    useEffect(() => {
        if (!selectedProjectId && workspaceProjects.length > 0) {
            setSelectedProjectId(workspaceProjects[0].id)
        }
    }, [workspaceProjects, selectedProjectId])

    const projectIssues = issues.filter(i => i.projectId === selectedProjectId)
    const projectEpics = epics.filter(e => e.projectId === selectedProjectId)

    const filteredIssues = useMemo(() => {
        let items = projectIssues
        if (filterStatus !== "all") items = items.filter(i => i.status === filterStatus)
        if (filterPriority !== "all") items = items.filter(i => i.priority === filterPriority)
        if (filterEpic !== "all") items = items.filter(i => (i.epicId || "__no_epic__") === filterEpic)
        if (filterAssignee !== "all") items = items.filter(i => i.assigneeId === filterAssignee)
        return items
    }, [projectIssues, filterStatus, filterPriority, filterEpic, filterAssignee])

    const { minDate, maxDate } = getTimelineRange(filteredIssues, zoom)
    const totalDays = Math.max(1, Math.ceil((maxDate.getTime() - minDate.getTime()) / 86400000))
    const columns = getColumns(minDate, maxDate, zoom)
    const todayPct = ((Date.now() - minDate.getTime()) / (totalDays * 86400000)) * 100

    const assignees = useMemo(() => {
        const map = new Map<string, string>()
        projectIssues.forEach(i => { if (i.assignee?.name) map.set(i.assigneeId, i.assignee.name) })
        return Array.from(map.entries())
    }, [projectIssues])

    const groupedByEpic = useMemo(() => {
        const groups: { epic: Epic | null; issues: Issue[] }[] = []
        const epicMap = new Map<string, Issue[]>()
        filteredIssues.forEach(i => {
            const key = i.epicId || "__no_epic__"
            if (!epicMap.has(key)) epicMap.set(key, [])
            epicMap.get(key)!.push(i)
        })
        projectEpics.forEach(e => {
            if (epicMap.has(e.id)) groups.push({ epic: e, issues: epicMap.get(e.id)! })
        })
        if (epicMap.has("__no_epic__")) groups.push({ epic: null, issues: epicMap.get("__no_epic__")! })
        return groups
    }, [filteredIssues, projectEpics])

    const toggleEpic = (id: string) => {
        setExpandedEpics(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const getBarColor = (issue: Issue) => {
        if (colorBy === "priority") return priorityBarColors[issue.priority] || "#a1a1aa"
        if (colorBy === "assignee") {
            const idx = assignees.findIndex(([id]) => id === issue.assigneeId)
            const colors = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4"]
            return colors[idx % colors.length] || "#a1a1aa"
        }
        return statusBarColors[issue.status] || "#a1a1aa"
    }

    const handleCreate = () => {
        if (!newIssue.title.trim()) { toast.error("Title is required"); return }
        const id = `ISSUE-${Date.now()}`
        addIssue({
            id, projectId: selectedProjectId, title: newIssue.title, description: newIssue.description,
            status: newIssue.status, priority: newIssue.priority, type: "TASK",
            assigneeId: "u1", reporterId: "u1", createdAt: new Date().toISOString(),
            startDate: newIssue.startDate || createDate || new Date().toISOString(),
            dueDate: newIssue.dueDate || addDays(new Date(newIssue.startDate || createDate || new Date()), 7).toISOString(),
            storyPoints: 0, columnOrder: 0, history: []
        })
        toast.success("Issue created on timeline")
        setNewIssue({ title: "", description: "", priority: "MEDIUM", status: "TODO", startDate: "", dueDate: "" })
        setShowCreateDialog(false)
    }

    const exportCSV = () => {
        const header = "Key,Title,Status,Priority,Assignee,Start Date,Due Date,Epic\n"
        const rows = filteredIssues.map(i => {
            const epicName = projectEpics.find(e => e.id === i.epicId)?.name || "None"
            return `${i.id},"${i.title}",${i.status},${i.priority},${i.assignee?.name || "Unassigned"},${i.startDate || ""},${i.dueDate || ""},${epicName}`
        }).join("\n")
        const blob = new Blob([header + rows], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = "timeline-export.csv"; a.click()
        URL.revokeObjectURL(url)
        toast.success("Timeline exported as CSV")
    }

    const dependencyArrows = useMemo(() => {
        const arrows: { from: string; to: string }[] = []
        links.forEach(l => {
            if (l.linkType === "blocks" || l.linkType === "is_blocked_by") {
                const src = filteredIssues.find(i => i.id === l.sourceIssueId)
                const tgt = filteredIssues.find(i => i.id === l.targetIssueId)
                if (src && tgt) arrows.push({ from: l.sourceIssueId, to: l.targetIssueId })
            }
        })
        return arrows
    }, [links, filteredIssues])

    const flatIssues = groupedByEpic.flatMap(g => {
        const epicKey = g.epic?.id || "__no_epic__"
        if (!expandedEpics.has(epicKey)) return []
        return g.issues
    })

    return (
        <div className="min-h-screen bg-[#fafafa] p-6 space-y-5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">Projects</span>
                <span className="text-[10px] text-zinc-300">/</span>
                <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wide">Timeline</span>
            </div>

            {/* Project Selector */}
            <div className="flex items-center gap-2">
                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                    <SelectTrigger className="h-8 w-48 rounded-md border-zinc-200 text-xs font-medium">
                        <SelectValue placeholder="Select project..." />
                    </SelectTrigger>
                    <SelectContent>
                        {workspaceProjects.map(p => (
                            <SelectItem key={p.id} value={p.id} className="text-xs">{p.icon} {p.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Timeline</h1>
                    <p className="text-xs text-zinc-500 mt-0.5">Gantt-style roadmap of all project issues</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95" onClick={exportCSV}>
                        <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV
                    </Button>
                    <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowCreateDialog(true)}>
                        <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Issue
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-md p-0.5">
                    {(["week", "month", "quarter"] as ZoomLevel[]).map(z => (
                        <button key={z} onClick={() => setZoom(z)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${zoom === z ? "bg-indigo-600 text-white" : "text-zinc-600 hover:bg-zinc-100"}`}>{z.charAt(0).toUpperCase() + z.slice(1)}</button>
                    ))}
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="h-8 w-[130px] text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        {["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BACKLOG", "BLOCKED"].map(s => (
                            <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="h-8 w-[120px] text-xs"><SelectValue placeholder="Priority" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        {["LOW", "MEDIUM", "HIGH", "URGENT"].map(p => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={filterEpic} onValueChange={setFilterEpic}>
                    <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue placeholder="Epic" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Epics</SelectItem>
                        {projectEpics.map(e => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}
                        <SelectItem value="__no_epic__">No Epic</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                    <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue placeholder="Assignee" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Assignees</SelectItem>
                        {assignees.map(([id, name]) => (<SelectItem key={id} value={id}>{name}</SelectItem>))}
                    </SelectContent>
                </Select>
                <Select value={colorBy} onValueChange={v => setColorBy(v as ColorBy)}>
                    <SelectTrigger className="h-8 w-[130px] text-xs"><SelectValue placeholder="Color by" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="status">Color: Status</SelectItem>
                        <SelectItem value="priority">Color: Priority</SelectItem>
                        <SelectItem value="assignee">Color: Assignee</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                <div className="flex">
                    {/* Left Panel */}
                    <div className="w-[300px] min-w-[300px] border-r border-zinc-200">
                        <div className="h-10 border-b border-zinc-200 flex items-center px-3">
                            <span className="text-[11px] font-semibold text-zinc-500 uppercase">Issues</span>
                        </div>
                        {groupedByEpic.map(group => {
                            const epicKey = group.epic?.id || "__no_epic__"
                            const isExpanded = expandedEpics.has(epicKey)
                            return (
                                <div key={epicKey}>
                                    <button onClick={() => toggleEpic(epicKey)}
                                        className="w-full flex items-center gap-2 px-3 py-2 bg-zinc-50 border-b border-zinc-100 hover:bg-zinc-100 transition-colors">
                                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
                                        {group.epic && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: group.epic.color }} />}
                                        <span className="text-xs font-semibold text-zinc-700 truncate">{group.epic?.name || "No Epic"}</span>
                                        <Badge variant="secondary" className="ml-auto text-[10px] h-4">{group.issues.length}</Badge>
                                    </button>
                                    {isExpanded && group.issues.map(issue => (
                                        <div key={issue.id} className="flex items-center gap-2 px-3 py-2 border-b border-zinc-50 hover:bg-zinc-50 cursor-pointer" onClick={() => setSelectedIssue(issue)}>
                                            <span className="text-[10px] font-mono text-zinc-400 w-16 shrink-0">{issue.id}</span>
                                            <span className="text-xs text-zinc-700 truncate flex-1">{issue.title}</span>
                                            <Badge className={`text-[9px] h-4 ${statusBadge[issue.status] || "bg-zinc-100 text-zinc-600"}`}>{issue.status.replace(/_/g, " ")}</Badge>
                                        </div>
                                    ))}
                                </div>
                            )
                        })}
                    </div>

                    {/* Right Panel - Timeline */}
                    <div className="flex-1 overflow-x-auto" ref={scrollRef}>
                        {/* Header */}
                        <div className="h-10 border-b border-zinc-200 flex relative" style={{ minWidth: `${columns.length * 120}px` }}>
                            {columns.map((col, idx) => (
                                <div key={idx} className="flex-shrink-0 border-r border-zinc-100 flex items-center justify-center" style={{ width: "120px" }}>
                                    <span className="text-[10px] font-medium text-zinc-500">{col.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Bars */}
                        <div className="relative" style={{ minWidth: `${columns.length * 120}px` }}>
                            {/* Today marker */}
                            {todayPct > 0 && todayPct < 100 && (
                                <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10" style={{ left: `${todayPct}%` }}>
                                    <div className="absolute -top-0 -left-1.5 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center">
                                        <span className="text-[7px] text-white font-bold">T</span>
                                    </div>
                                </div>
                            )}

                            {/* Column grid lines */}
                            <div className="absolute inset-0 flex pointer-events-none">
                                {columns.map((_, idx) => (
                                    <div key={idx} className="flex-shrink-0 border-r border-zinc-50" style={{ width: "120px" }} />
                                ))}
                            </div>

                            {/* Dependency arrows SVG */}
                            <svg className="absolute inset-0 pointer-events-none z-5" style={{ width: "100%", height: "100%" }}>
                                {dependencyArrows.map((arrow, idx) => {
                                    const fromIdx = flatIssues.findIndex(i => i.id === arrow.from)
                                    const toIdx = flatIssues.findIndex(i => i.id === arrow.to)
                                    if (fromIdx === -1 || toIdx === -1) return null
                                    const fromIssue = flatIssues[fromIdx]
                                    const toIssue = flatIssues[toIdx]
                                    const fromBar = getBarPosition(fromIssue, minDate, totalDays)
                                    const toBar = getBarPosition(toIssue, minDate, totalDays)
                                    const fromY = fromIdx * 36 + 18
                                    const toY = toIdx * 36 + 18
                                    return (
                                        <g key={idx}>
                                            <line x1={`${fromBar.leftPct + fromBar.widthPct}%`} y1={fromY} x2={`${toBar.leftPct}%`} y2={toY}
                                                stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#arrowhead)" />
                                        </g>
                                    )
                                })}
                                <defs>
                                    <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                                        <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
                                    </marker>
                                </defs>
                            </svg>

                            {/* Issue rows */}
                            {groupedByEpic.map(group => {
                                const epicKey = group.epic?.id || "__no_epic__"
                                const isExpanded = expandedEpics.has(epicKey)
                                return (
                                    <div key={epicKey}>
                                        <div className="h-[36px] bg-zinc-50 border-b border-zinc-100" />
                                        {isExpanded && group.issues.map(issue => {
                                            const { leftPct, widthPct } = getBarPosition(issue, minDate, totalDays)
                                            return (
                                                <div key={issue.id} className="h-[36px] relative border-b border-zinc-50" onClick={(e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect()
                                                    if (widthPct < 1) {
                                                        const clickPct = ((e.clientX - rect.left) / rect.width) * 100
                                                        const clickDate = new Date(minDate.getTime() + (clickPct / 100) * totalDays * 86400000)
                                                        setCreateDate(clickDate.toISOString().split("T")[0])
                                                        setShowCreateDialog(true)
                                                    }
                                                }}>
                                                    <div className="absolute top-1 rounded-sm cursor-pointer hover:opacity-90 transition-opacity flex items-center px-2 overflow-hidden"
                                                        style={{ left: `${leftPct}%`, width: `${widthPct}%`, height: "28px", backgroundColor: getBarColor(issue) }}
                                                        onClick={(e) => { e.stopPropagation(); setSelectedIssue(issue) }}>
                                                        <span className="text-[10px] font-medium text-white truncate">{issue.title}</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Dialog */}
            <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-base font-semibold text-zinc-900">{selectedIssue?.id} - {selectedIssue?.title}</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">{selectedIssue?.description}</DialogDescription>
                    </DialogHeader>
                    {selectedIssue && (
                        <div className="space-y-3 mt-2">
                            <div className="grid grid-cols-2 gap-3">
                                <div><span className="text-[10px] font-medium text-zinc-400 block">Status</span><Badge className={`text-[10px] ${statusBadge[selectedIssue.status] || ""}`}>{selectedIssue.status}</Badge></div>
                                <div><span className="text-[10px] font-medium text-zinc-400 block">Priority</span><Badge className={`text-[10px] ${priorityBadge[selectedIssue.priority] || ""}`}>{selectedIssue.priority}</Badge></div>
                                <div><span className="text-[10px] font-medium text-zinc-400 block">Assignee</span><span className="text-xs text-zinc-700">{selectedIssue.assignee?.name || "Unassigned"}</span></div>
                                <div><span className="text-[10px] font-medium text-zinc-400 block">Type</span><span className="text-xs text-zinc-700">{selectedIssue.type}</span></div>
                                <div><span className="text-[10px] font-medium text-zinc-400 block">Start Date</span><span className="text-xs text-zinc-700">{selectedIssue.startDate ? new Date(selectedIssue.startDate).toLocaleDateString() : "—"}</span></div>
                                <div><span className="text-[10px] font-medium text-zinc-400 block">Due Date</span><span className="text-xs text-zinc-700">{selectedIssue.dueDate ? new Date(selectedIssue.dueDate).toLocaleDateString() : "—"}</span></div>
                                <div><span className="text-[10px] font-medium text-zinc-400 block">Story Points</span><span className="text-xs text-zinc-700">{selectedIssue.storyPoints ?? "—"}</span></div>
                                <div><span className="text-[10px] font-medium text-zinc-400 block">Epic</span><span className="text-xs text-zinc-700">{projectEpics.find(e => e.id === selectedIssue.epicId)?.name || "None"}</span></div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" size="sm" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setSelectedIssue(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Issue Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base font-semibold text-zinc-900">Create Issue on Timeline</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">Add a new issue with date range</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 mt-2">
                        <div><label className="text-xs font-medium text-zinc-500 block mb-1">Title</label>
                            <Input className="h-8 text-xs" value={newIssue.title} onChange={e => setNewIssue(p => ({ ...p, title: e.target.value }))} placeholder="Issue title" /></div>
                        <div><label className="text-xs font-medium text-zinc-500 block mb-1">Description</label>
                            <Input className="h-8 text-xs" value={newIssue.description} onChange={e => setNewIssue(p => ({ ...p, description: e.target.value }))} placeholder="Description" /></div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><label className="text-xs font-medium text-zinc-500 block mb-1">Status</label>
                                <Select value={newIssue.status} onValueChange={v => setNewIssue(p => ({ ...p, status: v as IssueStatus }))}>
                                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent>{["TODO", "IN_PROGRESS", "DONE", "BACKLOG"].map(s => (<SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>))}</SelectContent>
                                </Select></div>
                            <div><label className="text-xs font-medium text-zinc-500 block mb-1">Priority</label>
                                <Select value={newIssue.priority} onValueChange={v => setNewIssue(p => ({ ...p, priority: v as IssuePriority }))}>
                                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent>{["LOW", "MEDIUM", "HIGH", "URGENT"].map(p => (<SelectItem key={p} value={p}>{p}</SelectItem>))}</SelectContent>
                                </Select></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><label className="text-xs font-medium text-zinc-500 block mb-1">Start Date</label>
                                <Input type="date" className="h-8 text-xs" value={newIssue.startDate || createDate} onChange={e => setNewIssue(p => ({ ...p, startDate: e.target.value }))} /></div>
                            <div><label className="text-xs font-medium text-zinc-500 block mb-1">Due Date</label>
                                <Input type="date" className="h-8 text-xs" value={newIssue.dueDate} onChange={e => setNewIssue(p => ({ ...p, dueDate: e.target.value }))} /></div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" size="sm" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700" onClick={handleCreate}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
