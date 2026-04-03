"use client"

import React, { useState, useMemo, useEffect } from "react"
import {
    BarChart3, TrendingDown, Layers, GitCompare, Users, Download,
    ChevronRight, CheckCircle2, Circle, AlertCircle, ArrowUpRight, ArrowDownRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import { useIssueStore, type Issue } from "@/shared/data/issue-store"
import { useSprintEpicStore, type Sprint } from "@/shared/data/sprint-epic-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"

const REPORT_CATEGORIES = [
    { id: "sprint", label: "Sprint Report", icon: CheckCircle2, color: "bg-indigo-100 text-indigo-600" },
    { id: "velocity", label: "Velocity Chart", icon: BarChart3, color: "bg-emerald-100 text-emerald-600" },
    { id: "burndown", label: "Burndown Chart", icon: TrendingDown, color: "bg-amber-100 text-amber-600" },
    { id: "cumulative", label: "Cumulative Flow", icon: Layers, color: "bg-purple-100 text-purple-600" },
    { id: "created-resolved", label: "Created vs Resolved", icon: GitCompare, color: "bg-rose-100 text-rose-600" },
    { id: "workload", label: "Workload", icon: Users, color: "bg-cyan-100 text-cyan-600" },
]

function exportCSV(filename: string, headers: string[], rows: string[][]) {
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`${filename}.csv downloaded`)
}

export default function ReportsPage() {
    const [activeReport, setActiveReport] = useState("sprint")
    const [selectedSprintId, setSelectedSprintId] = useState<string>("")
    const [selectedProjectId, setSelectedProjectId] = useState<string>("")

    const allIssues = useIssueStore((s) => s.issues)
    const allSprints = useSprintEpicStore((s) => s.sprints)
    const { projects } = useProjectStore()
    const { activeWorkspaceId } = useWorkspaceStore()

    const workspaceProjects = useMemo(() =>
        projects.filter(p => !activeWorkspaceId || p.workspaceId === activeWorkspaceId),
        [projects, activeWorkspaceId]
    )

    useEffect(() => {
        if (!selectedProjectId && workspaceProjects.length > 0) {
            setSelectedProjectId(workspaceProjects[0].id)
        }
    }, [workspaceProjects, selectedProjectId])

    const issues = useMemo(() => selectedProjectId ? allIssues.filter(i => i.projectId === selectedProjectId) : allIssues, [allIssues, selectedProjectId])
    const sprints = useMemo(() => selectedProjectId ? allSprints.filter(s => s.projectId === selectedProjectId) : allSprints, [allSprints, selectedProjectId])

    const selectedSprint = useMemo(() => sprints.find(s => s.id === selectedSprintId) || sprints[0], [sprints, selectedSprintId])
    const sprintIssues = useMemo(() => {
        if (!selectedSprint) return []
        return issues.filter(i => i.sprintId === selectedSprint.id)
    }, [issues, selectedSprint])

    const completedIssues = useMemo(() => sprintIssues.filter(i => i.status === "DONE" || i.status === "COMPLETED"), [sprintIssues])
    const incompleteIssues = useMemo(() => sprintIssues.filter(i => i.status !== "DONE" && i.status !== "COMPLETED"), [sprintIssues])
    const completedPoints = useMemo(() => completedIssues.reduce((s, i) => s + (i.storyPoints || 0), 0), [completedIssues])
    const incompletePoints = useMemo(() => incompleteIssues.reduce((s, i) => s + (i.storyPoints || 0), 0), [incompleteIssues])
    const totalPoints = completedPoints + incompletePoints

    // Velocity data: simulate last 6 sprints from store
    const velocityData = useMemo(() => {
        return sprints.slice(0, 6).map(sprint => {
            const si = issues.filter(i => i.sprintId === sprint.id)
            const committed = si.reduce((s, i) => s + (i.storyPoints || 0), 0)
            const completed = si.filter(i => i.status === "DONE" || i.status === "COMPLETED").reduce((s, i) => s + (i.storyPoints || 0), 0)
            return { sprint: sprint.name, committed, completed }
        })
    }, [sprints, issues])

    const maxVelocity = useMemo(() => Math.max(...velocityData.map(v => Math.max(v.committed, v.completed)), 1), [velocityData])

    // Burndown: calculate remaining points per day
    const burndownData = useMemo(() => {
        if (!selectedSprint?.startDate || !selectedSprint?.endDate) return []
        const start = new Date(selectedSprint.startDate).getTime()
        const end = new Date(selectedSprint.endDate).getTime()
        const days = Math.max(Math.ceil((end - start) / 86400000), 1)
        const total = totalPoints
        const points: { day: number; ideal: number; actual: number }[] = []
        for (let d = 0; d <= days; d++) {
            const dayDate = new Date(start + d * 86400000)
            const doneByDay = sprintIssues.filter(i => {
                if (i.status !== "DONE" && i.status !== "COMPLETED") return false
                const updated = i.updatedAt ? new Date(i.updatedAt).getTime() : Date.now()
                return updated <= dayDate.getTime()
            }).reduce((s, i) => s + (i.storyPoints || 0), 0)
            points.push({
                day: d,
                ideal: Math.max(total - (total / days) * d, 0),
                actual: Math.max(total - doneByDay, 0),
            })
        }
        return points
    }, [selectedSprint, sprintIssues, totalPoints])

    // Created vs Resolved per week (last 4 weeks)
    const createdVsResolved = useMemo(() => {
        const weeks: { label: string; created: number; resolved: number }[] = []
        for (let w = 3; w >= 0; w--) {
            const weekStart = new Date(Date.now() - (w + 1) * 7 * 86400000)
            const weekEnd = new Date(Date.now() - w * 7 * 86400000)
            const label = `Week ${4 - w}`
            const created = issues.filter(i => {
                const d = new Date(i.createdAt).getTime()
                return d >= weekStart.getTime() && d < weekEnd.getTime()
            }).length
            const resolved = issues.filter(i => {
                if (i.status !== "DONE" && i.status !== "COMPLETED") return false
                const d = new Date(i.updatedAt || i.createdAt).getTime()
                return d >= weekStart.getTime() && d < weekEnd.getTime()
            }).length
            weeks.push({ label, created, resolved })
        }
        return weeks
    }, [issues])

    // Workload: per assignee
    const workloadData = useMemo(() => {
        const map: Record<string, { name: string; count: number }> = {}
        issues.forEach(i => {
            const name = i.assignee?.name || i.assigneeId || "Unassigned"
            if (!map[name]) map[name] = { name, count: 0 }
            map[name].count++
        })
        return Object.values(map).sort((a, b) => b.count - a.count)
    }, [issues])

    const maxWorkload = useMemo(() => Math.max(...workloadData.map(w => w.count), 1), [workloadData])

    const handleExportSprint = () => {
        const rows = sprintIssues.map(i => [i.id, i.title, i.status, i.priority, String(i.storyPoints || 0), i.assignee?.name || i.assigneeId])
        exportCSV("sprint-report", ["ID", "Title", "Status", "Priority", "Points", "Assignee"], rows)
    }

    const handleExportVelocity = () => {
        const rows = velocityData.map(v => [v.sprint, String(v.committed), String(v.completed)])
        exportCSV("velocity-report", ["Sprint", "Committed", "Completed"], rows)
    }

    const handleExportWorkload = () => {
        const rows = workloadData.map(w => [w.name, String(w.count)])
        exportCSV("workload-report", ["Assignee", "Tasks"], rows)
    }

    const handleExportCreatedResolved = () => {
        const rows = createdVsResolved.map(w => [w.label, String(w.created), String(w.resolved)])
        exportCSV("created-vs-resolved", ["Week", "Created", "Resolved"], rows)
    }

    const renderIssueRow = (issue: Issue) => (
        <TableRow key={issue.id} className="hover:bg-zinc-50/50 transition-colors">
            <TableCell className="py-2.5 px-4">
                <span className="text-xs font-bold text-zinc-900">{issue.id}</span>
            </TableCell>
            <TableCell className="py-2.5">
                <span className="text-xs font-medium text-zinc-700">{issue.title}</span>
            </TableCell>
            <TableCell className="py-2.5">
                <Badge variant="outline" className="text-[10px] font-semibold">{issue.status}</Badge>
            </TableCell>
            <TableCell className="py-2.5">
                <Badge className={`text-[10px] font-semibold ${issue.priority === "URGENT" ? "bg-rose-100 text-rose-700" : issue.priority === "HIGH" ? "bg-amber-100 text-amber-700" : "bg-zinc-100 text-zinc-600"}`}>
                    {issue.priority}
                </Badge>
            </TableCell>
            <TableCell className="py-2.5 text-center">
                <span className="text-xs font-mono text-zinc-600">{issue.storyPoints || 0}</span>
            </TableCell>
            <TableCell className="py-2.5">
                <span className="text-xs text-zinc-500">{issue.assignee?.name || issue.assigneeId || "—"}</span>
            </TableCell>
        </TableRow>
    )

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* BREADCRUMB & HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>PROJECTS</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">REPORTS</span>
                </div>
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight mt-2">Reports Dashboard</h1>
                <p className="text-xs text-zinc-500 font-medium">Analyze sprint performance, velocity, and team workload.</p>
                <div className="flex items-center gap-2 mt-2">
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
            </div>

            {/* REPORT CATEGORY CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {REPORT_CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveReport(cat.id)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-200 ${activeReport === cat.id ? "border-indigo-300 bg-indigo-50 shadow-sm" : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"}`}
                    >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cat.color}`}>
                            <cat.icon className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-semibold text-zinc-700">{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* SPRINT REPORT */}
            {activeReport === "sprint" && (
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Select value={selectedSprintId || selectedSprint?.id || ""} onValueChange={setSelectedSprintId}>
                                <SelectTrigger className="h-8 w-56 text-xs font-medium border-zinc-200">
                                    <SelectValue placeholder="Select sprint" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sprints.map(s => (
                                        <SelectItem key={s.id} value={s.id} className="text-xs">{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Badge variant="outline" className="text-[10px]">{selectedSprint?.status || "—"}</Badge>
                        </div>
                        <Button className="h-8 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95" onClick={handleExportSprint}>
                            <Download className="w-3.5 h-3.5 mr-2" />Export CSV
                        </Button>
                    </div>

                    {/* Sprint Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <SmallCard className="border-zinc-200 bg-white">
                            <SmallCardHeader className="pb-1 px-4 pt-3">
                                <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">Completed</p>
                            </SmallCardHeader>
                            <SmallCardContent className="px-4 pb-3">
                                <p className="text-2xl font-bold text-emerald-600">{completedIssues.length}</p>
                                <p className="text-[10px] text-zinc-400">{completedPoints} story points</p>
                            </SmallCardContent>
                        </SmallCard>
                        <SmallCard className="border-zinc-200 bg-white">
                            <SmallCardHeader className="pb-1 px-4 pt-3">
                                <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">Incomplete</p>
                            </SmallCardHeader>
                            <SmallCardContent className="px-4 pb-3">
                                <p className="text-2xl font-bold text-amber-600">{incompleteIssues.length}</p>
                                <p className="text-[10px] text-zinc-400">{incompletePoints} story points</p>
                            </SmallCardContent>
                        </SmallCard>
                        <SmallCard className="border-zinc-200 bg-white">
                            <SmallCardHeader className="pb-1 px-4 pt-3">
                                <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">Total Points</p>
                            </SmallCardHeader>
                            <SmallCardContent className="px-4 pb-3">
                                <p className="text-2xl font-bold text-zinc-900">{totalPoints}</p>
                                <p className="text-[10px] text-zinc-400">{sprintIssues.length} issues total</p>
                            </SmallCardContent>
                        </SmallCard>
                        <SmallCard className="border-zinc-200 bg-white">
                            <SmallCardHeader className="pb-1 px-4 pt-3">
                                <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">Completion Rate</p>
                            </SmallCardHeader>
                            <SmallCardContent className="px-4 pb-3">
                                <p className="text-2xl font-bold text-indigo-600">{sprintIssues.length > 0 ? Math.round((completedIssues.length / sprintIssues.length) * 100) : 0}%</p>
                                <p className="text-[10px] text-zinc-400">of issues done</p>
                            </SmallCardContent>
                        </SmallCard>
                    </div>

                    {/* Issues grouped by Completed / Incomplete */}
                    <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                        <Tabs defaultValue="completed" className="w-full">
                            <div className="px-4 pt-3 border-b border-zinc-100">
                                <TabsList className="bg-zinc-100/60 h-8">
                                    <TabsTrigger value="completed" className="text-[11px] font-medium h-7 px-3">Completed ({completedIssues.length})</TabsTrigger>
                                    <TabsTrigger value="incomplete" className="text-[11px] font-medium h-7 px-3">Incomplete ({incompleteIssues.length})</TabsTrigger>
                                </TabsList>
                            </div>
                            <TabsContent value="completed" className="mt-0">
                                <Table>
                                    <TableHeader className="bg-zinc-50/50">
                                        <TableRow>
                                            <TableHead className="py-2.5 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Key</TableHead>
                                            <TableHead className="py-2.5 font-semibold text-[11px] text-zinc-500 uppercase">Title</TableHead>
                                            <TableHead className="py-2.5 font-semibold text-[11px] text-zinc-500 uppercase">Status</TableHead>
                                            <TableHead className="py-2.5 font-semibold text-[11px] text-zinc-500 uppercase">Priority</TableHead>
                                            <TableHead className="py-2.5 font-semibold text-[11px] text-zinc-500 uppercase text-center">Points</TableHead>
                                            <TableHead className="py-2.5 font-semibold text-[11px] text-zinc-500 uppercase">Assignee</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {completedIssues.length === 0 && (
                                            <TableRow><TableCell colSpan={6} className="text-center py-8 text-xs text-zinc-400">No completed issues in this sprint</TableCell></TableRow>
                                        )}
                                        {completedIssues.map(renderIssueRow)}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                            <TabsContent value="incomplete" className="mt-0">
                                <Table>
                                    <TableHeader className="bg-zinc-50/50">
                                        <TableRow>
                                            <TableHead className="py-2.5 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Key</TableHead>
                                            <TableHead className="py-2.5 font-semibold text-[11px] text-zinc-500 uppercase">Title</TableHead>
                                            <TableHead className="py-2.5 font-semibold text-[11px] text-zinc-500 uppercase">Status</TableHead>
                                            <TableHead className="py-2.5 font-semibold text-[11px] text-zinc-500 uppercase">Priority</TableHead>
                                            <TableHead className="py-2.5 font-semibold text-[11px] text-zinc-500 uppercase text-center">Points</TableHead>
                                            <TableHead className="py-2.5 font-semibold text-[11px] text-zinc-500 uppercase">Assignee</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {incompleteIssues.length === 0 && (
                                            <TableRow><TableCell colSpan={6} className="text-center py-8 text-xs text-zinc-400">No incomplete issues in this sprint</TableCell></TableRow>
                                        )}
                                        {incompleteIssues.map(renderIssueRow)}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            )}

            {/* VELOCITY CHART */}
            {activeReport === "velocity" && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-zinc-900">Velocity Chart — Last {velocityData.length} Sprints</h2>
                        <Button className="h-8 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95" onClick={handleExportVelocity}>
                            <Download className="w-3.5 h-3.5 mr-2" />Export CSV
                        </Button>
                    </div>
                    <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
                        <div className="flex items-end gap-6 h-52">
                            {velocityData.map((v, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                                    <div className="flex items-end gap-1 w-full h-40">
                                        <div className="flex-1 flex flex-col items-center justify-end h-full">
                                            <span className="text-[10px] font-bold text-zinc-500 mb-1">{v.committed}</span>
                                            <div className="w-full bg-zinc-200 rounded-t-sm" style={{ height: `${(v.committed / maxVelocity) * 100}%`, minHeight: 4 }} />
                                        </div>
                                        <div className="flex-1 flex flex-col items-center justify-end h-full">
                                            <span className="text-[10px] font-bold text-indigo-600 mb-1">{v.completed}</span>
                                            <div className="w-full bg-indigo-500 rounded-t-sm" style={{ height: `${(v.completed / maxVelocity) * 100}%`, minHeight: 4 }} />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-medium text-zinc-500 truncate max-w-full">{v.sprint}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-zinc-100">
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-zinc-200" /><span className="text-[10px] text-zinc-500 font-medium">Committed</span></div>
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-indigo-500" /><span className="text-[10px] text-zinc-500 font-medium">Completed</span></div>
                        </div>
                    </div>
                </div>
            )}

            {/* BURNDOWN CHART */}
            {activeReport === "burndown" && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-sm font-bold text-zinc-900">Sprint Burndown</h2>
                            <Select value={selectedSprintId || selectedSprint?.id || ""} onValueChange={setSelectedSprintId}>
                                <SelectTrigger className="h-8 w-48 text-xs font-medium border-zinc-200">
                                    <SelectValue placeholder="Select sprint" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sprints.map(s => (
                                        <SelectItem key={s.id} value={s.id} className="text-xs">{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
                        {burndownData.length === 0 ? (
                            <div className="flex items-center justify-center h-48 text-xs text-zinc-400">No sprint dates configured. Set start/end dates on the sprint to see burndown.</div>
                        ) : (
                            <div className="relative">
                                <svg viewBox={`0 0 ${burndownData.length * 60} 200`} className="w-full h-52" preserveAspectRatio="none">
                                    {/* Ideal line */}
                                    <polyline
                                        fill="none"
                                        stroke="#c7d2fe"
                                        strokeWidth="2"
                                        strokeDasharray="6 4"
                                        points={burndownData.map((p, i) => `${i * 60},${200 - (p.ideal / (totalPoints || 1)) * 180}`).join(" ")}
                                    />
                                    {/* Actual line */}
                                    <polyline
                                        fill="none"
                                        stroke="#6366f1"
                                        strokeWidth="2.5"
                                        points={burndownData.map((p, i) => `${i * 60},${200 - (p.actual / (totalPoints || 1)) * 180}`).join(" ")}
                                    />
                                    {/* Data points */}
                                    {burndownData.map((p, i) => (
                                        <circle key={i} cx={i * 60} cy={200 - (p.actual / (totalPoints || 1)) * 180} r="3" fill="#6366f1" />
                                    ))}
                                </svg>
                                <div className="flex justify-between mt-2">
                                    {burndownData.map((p, i) => (
                                        <span key={i} className="text-[9px] text-zinc-400 font-medium">Day {p.day}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-zinc-100">
                            <div className="flex items-center gap-1.5"><div className="w-6 h-0.5 bg-indigo-500" /><span className="text-[10px] text-zinc-500 font-medium">Actual</span></div>
                            <div className="flex items-center gap-1.5"><div className="w-6 h-0.5 border-t-2 border-dashed border-indigo-200" /><span className="text-[10px] text-zinc-500 font-medium">Ideal</span></div>
                        </div>
                    </div>
                </div>
            )}

            {/* CUMULATIVE FLOW */}
            {activeReport === "cumulative" && (
                <div className="flex flex-col gap-4">
                    <h2 className="text-sm font-bold text-zinc-900">Cumulative Flow Diagram</h2>
                    <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
                        {(() => {
                            const statuses = ["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"] as const
                            const statusColors: Record<string, string> = { BACKLOG: "bg-zinc-200", TODO: "bg-blue-200", IN_PROGRESS: "bg-amber-300", IN_REVIEW: "bg-purple-300", DONE: "bg-emerald-400" }
                            const counts = statuses.map(s => ({ status: s, count: issues.filter(i => i.status === s).length }))
                            const total = Math.max(counts.reduce((s, c) => s + c.count, 0), 1)
                            return (
                                <div className="flex flex-col gap-3">
                                    <div className="flex h-32 rounded-md overflow-hidden border border-zinc-100">
                                        {counts.map(c => (
                                            <div key={c.status} className={`${statusColors[c.status] || "bg-zinc-100"} flex items-end justify-center transition-all duration-300`} style={{ width: `${(c.count / total) * 100}%`, minWidth: c.count > 0 ? 32 : 0 }}>
                                                {c.count > 0 && <span className="text-[10px] font-bold text-zinc-700 mb-2">{c.count}</span>}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {counts.map(c => (
                                            <div key={c.status} className="flex items-center gap-1.5">
                                                <div className={`w-3 h-3 rounded-sm ${statusColors[c.status] || "bg-zinc-100"}`} />
                                                <span className="text-[10px] text-zinc-500 font-medium">{c.status.replace("_", " ")} ({c.count})</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })()}
                    </div>
                </div>
            )}

            {/* CREATED VS RESOLVED */}
            {activeReport === "created-resolved" && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-zinc-900">Created vs Resolved — Last 4 Weeks</h2>
                        <Button className="h-8 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95" onClick={handleExportCreatedResolved}>
                            <Download className="w-3.5 h-3.5 mr-2" />Export CSV
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {createdVsResolved.map((w, idx) => (
                            <SmallCard key={idx} className="border-zinc-200 bg-white">
                                <SmallCardHeader className="pb-1 px-4 pt-3">
                                    <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">{w.label}</p>
                                </SmallCardHeader>
                                <SmallCardContent className="px-4 pb-3">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
                                            <span className="text-lg font-bold text-rose-600">{w.created}</span>
                                            <span className="text-[10px] text-zinc-400">created</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-500" />
                                            <span className="text-lg font-bold text-emerald-600">{w.resolved}</span>
                                            <span className="text-[10px] text-zinc-400">resolved</span>
                                        </div>
                                    </div>
                                </SmallCardContent>
                            </SmallCard>
                        ))}
                    </div>
                    <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
                        <div className="flex items-end gap-8 h-40">
                            {createdVsResolved.map((w, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                                    <div className="flex items-end gap-1.5 w-full h-28">
                                        <div className="flex-1 flex flex-col items-center justify-end h-full">
                                            <span className="text-[10px] font-bold text-rose-500 mb-1">{w.created}</span>
                                            <div className="w-full bg-rose-200 rounded-t-sm" style={{ height: `${(w.created / Math.max(...createdVsResolved.map(x => Math.max(x.created, x.resolved)), 1)) * 100}%`, minHeight: 4 }} />
                                        </div>
                                        <div className="flex-1 flex flex-col items-center justify-end h-full">
                                            <span className="text-[10px] font-bold text-emerald-500 mb-1">{w.resolved}</span>
                                            <div className="w-full bg-emerald-300 rounded-t-sm" style={{ height: `${(w.resolved / Math.max(...createdVsResolved.map(x => Math.max(x.created, x.resolved)), 1)) * 100}%`, minHeight: 4 }} />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-medium text-zinc-500">{w.label}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-zinc-100">
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-rose-200" /><span className="text-[10px] text-zinc-500 font-medium">Created</span></div>
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-300" /><span className="text-[10px] text-zinc-500 font-medium">Resolved</span></div>
                        </div>
                    </div>
                </div>
            )}

            {/* WORKLOAD */}
            {activeReport === "workload" && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-zinc-900">Workload Distribution</h2>
                        <Button className="h-8 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95" onClick={handleExportWorkload}>
                            <Download className="w-3.5 h-3.5 mr-2" />Export CSV
                        </Button>
                    </div>
                    <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
                        <div className="flex flex-col gap-3">
                            {workloadData.length === 0 && <p className="text-xs text-zinc-400 text-center py-8">No issues found</p>}
                            {workloadData.map((w, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <span className="text-xs font-medium text-zinc-700 w-32 truncate">{w.name}</span>
                                    <div className="flex-1 h-6 bg-zinc-100 rounded-sm overflow-hidden">
                                        <div className="h-full bg-indigo-500 rounded-sm flex items-center justify-end pr-2 transition-all duration-300" style={{ width: `${(w.count / maxWorkload) * 100}%`, minWidth: 24 }}>
                                            <span className="text-[10px] font-bold text-white">{w.count}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
