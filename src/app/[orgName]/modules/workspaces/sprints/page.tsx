"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useParams } from "next/navigation"
import {
    Zap, Plus, MoreHorizontal, Target, TrendingUp, Calendar,
    ChevronDown, ChevronRight, CheckCircle2, Circle, Clock,
    Trash2, Edit3, Play, Flag, Users, BarChart3, X, AlertTriangle, Kanban
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import { useIssueStore, Issue } from "@/shared/data/issue-store"
import { useSprintEpicStore, Sprint, SprintStatus } from "@/shared/data/sprint-epic-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"

const statusColors: Record<string, string> = {
    TODO: "bg-zinc-100 text-zinc-600", IN_PROGRESS: "bg-blue-100 text-blue-700",
    IN_REVIEW: "bg-purple-100 text-purple-700", DONE: "bg-green-100 text-green-700",
    BACKLOG: "bg-zinc-50 text-zinc-500", BLOCKED: "bg-red-100 text-red-600",
}

const priorityColors: Record<string, string> = {
    URGENT: "bg-red-100 text-red-700", HIGH: "bg-orange-100 text-orange-700",
    MEDIUM: "bg-yellow-100 text-yellow-700", LOW: "bg-blue-100 text-blue-700",
}

export default function SprintsPage() {
    const params = useParams()
    const { issues, updateIssue } = useIssueStore()
    const { sprints, addSprint, updateSprint, deleteSprint, getSprintsByProject } = useSprintEpicStore()
    const { projects } = useProjectStore()
    const { activeWorkspaceId } = useWorkspaceStore()

    const [selectedProjectId, setSelectedProjectId] = useState<string>("")
    const [activeTab, setActiveTab] = useState("all")
    const [expandedSprint, setExpandedSprint] = useState<string | null>(null)
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [showCompleteDialog, setShowCompleteDialog] = useState<string | null>(null)
    const [newSprint, setNewSprint] = useState({ name: "", goal: "", startDate: "", endDate: "" })
    const [moveIncompleteTo, setMoveIncompleteTo] = useState<"backlog" | "next">("backlog")

    const workspaceProjects = useMemo(() =>
        projects.filter(p => !activeWorkspaceId || p.workspaceId === activeWorkspaceId),
        [projects, activeWorkspaceId]
    )

    useEffect(() => {
        if (!selectedProjectId && workspaceProjects.length > 0) {
            setSelectedProjectId(workspaceProjects[0].id)
        }
    }, [workspaceProjects, selectedProjectId])

    const projectSprints = getSprintsByProject(selectedProjectId)
    const projectIssues = issues.filter(i => i.projectId === selectedProjectId)

    const filteredSprints = useMemo(() => {
        if (activeTab === "all") return projectSprints
        const statusMap: Record<string, SprintStatus> = { active: "ACTIVE", planned: "PLANNED", completed: "COMPLETED" }
        return projectSprints.filter(s => s.status === statusMap[activeTab])
    }, [projectSprints, activeTab])

    const getSprintIssues = (sprintId: string) => projectIssues.filter(i => i.sprintId === sprintId)
    const getStatusCount = (sprintIssues: Issue[], statuses: string[]) =>
        sprintIssues.filter(i => statuses.includes(i.status)).length
    const getSprintPoints = (sprintIssues: Issue[]) => sprintIssues.reduce((s, i) => s + (i.storyPoints || 0), 0)
    const getCompletedPoints = (sprintIssues: Issue[]) =>
        sprintIssues.filter(i => i.status === "DONE").reduce((s, i) => s + (i.storyPoints || 0), 0)

    const activeSprints = projectSprints.filter(s => s.status === "ACTIVE")
    const plannedSprints = projectSprints.filter(s => s.status === "PLANNED")
    const completedSprints = projectSprints.filter(s => s.status === "COMPLETED")
    const avgVelocity = completedSprints.length > 0
        ? Math.round(completedSprints.reduce((sum, s) => sum + getCompletedPoints(getSprintIssues(s.id)), 0) / completedSprints.length)
        : 0

    const uniqueAssignees = (sprintIssues: Issue[]) => {
        const seen = new Map<string, { name: string; avatar: string }>()
        sprintIssues.forEach(i => {
            if (i.assignee && i.assigneeId) seen.set(i.assigneeId, i.assignee)
        })
        return Array.from(seen.values())
    }

    const handleCreateSprint = () => {
        if (!newSprint.name.trim()) { toast.error("Sprint name is required"); return }
        const sprint: Sprint = {
            id: `sprint-${Date.now()}`,
            projectId: selectedProjectId,
            name: newSprint.name,
            goal: newSprint.goal || undefined,
            status: "PLANNED",
            startDate: newSprint.startDate || new Date().toISOString(),
            endDate: newSprint.endDate || new Date(Date.now() + 14 * 86400000).toISOString(),
            createdAt: new Date().toISOString(),
        }
        addSprint(sprint)
        setNewSprint({ name: "", goal: "", startDate: "", endDate: "" })
        setShowCreateDialog(false)
        toast.success(`${sprint.name} created`)
    }

    const handleStartSprint = (sprintId: string) => {
        updateSprint(sprintId, { status: "ACTIVE", startDate: new Date().toISOString() })
        toast.success("Sprint started")
    }

    const handleCompleteSprint = () => {
        if (!showCompleteDialog) return
        const sprintId = showCompleteDialog
        const sprintIssues = getSprintIssues(sprintId)
        const incomplete = sprintIssues.filter(i => i.status !== "DONE")

        updateSprint(sprintId, { status: "COMPLETED" })

        if (moveIncompleteTo === "backlog") {
            incomplete.forEach(i => updateIssue(i.id, { sprintId: null }))
        } else {
            const nextSprint = plannedSprints[0] || activeSprints.find(s => s.id !== sprintId)
            if (nextSprint) {
                incomplete.forEach(i => updateIssue(i.id, { sprintId: nextSprint.id }))
            } else {
                incomplete.forEach(i => updateIssue(i.id, { sprintId: null }))
            }
        }

        setShowCompleteDialog(null)
        toast.success(`Sprint completed. ${incomplete.length} incomplete items moved.`)
    }

    const handleDeleteSprint = (sprintId: string) => {
        const sprintIssues = getSprintIssues(sprintId)
        sprintIssues.forEach(i => updateIssue(i.id, { sprintId: null }))
        deleteSprint(sprintId)
        toast.success("Sprint deleted. Issues moved to backlog.")
    }

    const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "--"

    const renderVelocityChart = () => {
        const last5 = completedSprints.slice(-5)
        if (last5.length === 0) return (
            <div className="text-xs text-zinc-400 text-center py-6">No completed sprints yet</div>
        )
        const maxPts = Math.max(...last5.map(s => getSprintPoints(getSprintIssues(s.id))), 1)
        return (
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-bold text-zinc-900">Velocity Chart</span>
                    <span className="text-[10px] text-zinc-400 ml-auto">Last {last5.length} sprints</span>
                </div>
                <div className="flex items-end gap-2 h-28">
                    {last5.map(s => {
                        const total = getSprintPoints(getSprintIssues(s.id))
                        const done = getCompletedPoints(getSprintIssues(s.id))
                        const hTotal = Math.max((total / maxPts) * 100, 8)
                        const hDone = Math.max((done / maxPts) * 100, 4)
                        return (
                            <div key={s.id} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full flex flex-col items-center gap-0.5" style={{ height: "96px" }}>
                                    <div className="w-full flex items-end gap-0.5 h-full">
                                        <div className="flex-1 bg-zinc-200 rounded-t" style={{ height: `${hTotal}%` }} title={`Total: ${total} pts`} />
                                        <div className="flex-1 bg-indigo-500 rounded-t" style={{ height: `${hDone}%` }} title={`Done: ${done} pts`} />
                                    </div>
                                </div>
                                <span className="text-[9px] text-zinc-400 truncate w-full text-center">{s.name.slice(0, 10)}</span>
                            </div>
                        )
                    })}
                </div>
                <div className="flex items-center gap-4 mt-2 justify-center">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-zinc-200 rounded" /><span className="text-[9px] text-zinc-400">Total</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-indigo-500 rounded" /><span className="text-[9px] text-zinc-400">Completed</span></div>
                </div>
            </div>
        )
    }

    const renderSprintCard = (sprint: Sprint) => {
        const sprintIssues = getSprintIssues(sprint.id)
        const total = sprintIssues.length
        const done = getStatusCount(sprintIssues, ["DONE"])
        const inProgress = getStatusCount(sprintIssues, ["IN_PROGRESS", "IN_REVIEW"])
        const todo = total - done - inProgress
        const totalPts = getSprintPoints(sprintIssues)
        const donePts = getCompletedPoints(sprintIssues)
        const pct = total > 0 ? Math.round((done / total) * 100) : 0
        const members = uniqueAssignees(sprintIssues)
        const isExpanded = expandedSprint === sprint.id

        return (
            <div key={sprint.id} className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <Badge className={`text-[9px] uppercase font-bold border-none px-2 py-0.5 ${sprint.status === "ACTIVE" ? "bg-green-100 text-green-700" : sprint.status === "COMPLETED" ? "bg-zinc-100 text-zinc-500" : "bg-blue-100 text-blue-600"}`}>
                                    {sprint.status}
                                </Badge>
                                <span className="text-xs font-bold text-zinc-900 truncate">{sprint.name}</span>
                            </div>
                            {sprint.goal && (
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <Target className="w-3 h-3 text-zinc-400 shrink-0" />
                                    <span className="text-[11px] text-zinc-500 italic truncate">{sprint.goal}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 mt-1">
                                <Calendar className="w-3 h-3 text-zinc-400" />
                                <span className="text-[10px] font-mono text-zinc-400">{formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {sprint.status === "PLANNED" && (
                                <Button className="h-7 rounded-md text-[10px] font-medium px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm active:scale-95" onClick={() => handleStartSprint(sprint.id)}>
                                    <Play className="w-3 h-3 mr-1" /> Start
                                </Button>
                            )}
                            {sprint.status === "ACTIVE" && (
                                <Button className="h-7 rounded-md text-[10px] font-medium px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95" onClick={() => setShowCompleteDialog(sprint.id)}>
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Complete
                                </Button>
                            )}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md">
                                        <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44 shadow-xl border-zinc-100 text-xs">
                                    <DropdownMenuItem onClick={() => toast.info("Edit sprint coming soon")}>
                                        <Edit3 className="w-3 h-3 mr-2" /> Edit Sprint
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteSprint(sprint.id)}>
                                        <Trash2 className="w-3 h-3 mr-2" /> Delete Sprint
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-zinc-400">{pct}% complete</span>
                            <span className="text-[10px] font-mono text-zinc-400">{donePts}/{totalPts} pts</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                    </div>

                    {/* Task breakdown + mini bar */}
                    <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                <Circle className="w-3 h-3 text-zinc-400" />
                                <span className="text-[10px] text-zinc-500">{todo} To Do</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-blue-500" />
                                <span className="text-[10px] text-zinc-500">{inProgress} In Progress</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                <span className="text-[10px] text-zinc-500">{done} Done</span>
                            </div>
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                            {members.slice(0, 4).map((m, idx) => (
                                <img key={idx} src={m.avatar || `https://i.pravatar.cc/150?u=${idx}`} alt={m.name} className="w-5 h-5 rounded-full border border-white shadow-sm -ml-1 first:ml-0" title={m.name} />
                            ))}
                            {members.length > 4 && <span className="text-[9px] text-zinc-400 ml-1">+{members.length - 4}</span>}
                        </div>
                    </div>

                    {/* Burndown mini */}
                    <div className="flex items-end gap-0.5 mt-3 h-8">
                        {total > 0 && (
                            <>
                                <div className="flex-1 bg-zinc-200 rounded-t" style={{ height: `${Math.max((todo / total) * 100, 5)}%` }} title={`To Do: ${todo}`} />
                                <div className="flex-1 bg-blue-400 rounded-t" style={{ height: `${Math.max((inProgress / total) * 100, 5)}%` }} title={`In Progress: ${inProgress}`} />
                                <div className="flex-1 bg-green-500 rounded-t" style={{ height: `${Math.max((done / total) * 100, 5)}%` }} title={`Done: ${done}`} />
                            </>
                        )}
                    </div>
                </div>

                {/* Expand toggle */}
                <div
                    className="flex items-center justify-center gap-1 py-2 border-t border-zinc-100 cursor-pointer hover:bg-zinc-50 text-[10px] text-zinc-400"
                    onClick={() => setExpandedSprint(isExpanded ? null : sprint.id)}
                >
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    {isExpanded ? "Collapse" : `Show ${total} issues`}
                </div>

                {/* Expanded issue table */}
                {isExpanded && sprintIssues.length > 0 && (
                    <div className="border-t border-zinc-200">
                        <Table>
                            <TableHeader className="bg-zinc-50/50">
                                <TableRow>
                                    <TableHead className="py-2 px-3 font-semibold text-[11px] text-zinc-500 uppercase">Key</TableHead>
                                    <TableHead className="py-2 font-semibold text-[11px] text-zinc-500 uppercase">Title</TableHead>
                                    <TableHead className="py-2 font-semibold text-[11px] text-zinc-500 uppercase text-center">Status</TableHead>
                                    <TableHead className="py-2 font-semibold text-[11px] text-zinc-500 uppercase text-center">Priority</TableHead>
                                    <TableHead className="py-2 font-semibold text-[11px] text-zinc-500 uppercase text-center">Points</TableHead>
                                    <TableHead className="py-2 font-semibold text-[11px] text-zinc-500 uppercase text-center">Assignee</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sprintIssues.map(issue => (
                                    <TableRow key={issue.id} className="hover:bg-zinc-50/50 transition-colors">
                                        <TableCell className="py-2 px-3"><span className="text-[10px] font-mono text-zinc-400">{issue.id}</span></TableCell>
                                        <TableCell className="py-2"><span className="text-xs font-medium text-zinc-900">{issue.title}</span></TableCell>
                                        <TableCell className="py-2 text-center">
                                            <Badge className={`text-[9px] px-1.5 py-0 border-none ${statusColors[issue.status] || "bg-zinc-100 text-zinc-500"}`}>
                                                {issue.status.replace("_", " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-2 text-center">
                                            <Badge className={`text-[9px] px-1.5 py-0 border-none ${priorityColors[issue.priority]}`}>
                                                {issue.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-2 text-center"><span className="text-[10px] font-mono text-zinc-500">{issue.storyPoints || "-"}</span></TableCell>
                                        <TableCell className="py-2 text-center">
                                            {issue.assignee ? (
                                                <img src={issue.assignee.avatar} alt="" className="w-5 h-5 rounded-full border border-zinc-200 mx-auto" title={issue.assignee.name} />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 mx-auto" />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        )
    }

    const selectedProject = workspaceProjects.find(p => p.id === selectedProjectId)
    const isScrum = selectedProject?.methodology === "scrum"

    if (selectedProjectId && !isScrum) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="h-16 w-16 bg-zinc-100 rounded-full flex items-center justify-center">
                    <Kanban className="w-8 h-8 text-zinc-400" />
                </div>
                <h2 className="text-lg font-bold text-zinc-900">This is a Kanban Project</h2>
                <p className="text-sm text-zinc-500 max-w-md text-center">Sprints and backlogs are only available for Scrum projects. Switch to a Scrum project or use the Board view for Kanban.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>PROJECTS</span><span>/</span><span className="text-zinc-900 font-semibold">SPRINTS</span>
                </div>
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Sprint Management</h1>
                        <p className="text-xs text-zinc-500 font-medium">Coordinate agile cycles and track team velocity.</p>
                    </div>
                    <Button className="h-8 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95" onClick={() => setShowCreateDialog(true)}>
                        <Plus className="w-3.5 h-3.5 mr-2" /> Create Sprint
                    </Button>
                </div>
            </div>

            {/* STATS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-indigo-500 to-indigo-700 border-none text-white shadow-[0_8px_30px_rgb(99,102,241,0.3)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.4)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Active Sprints</p>
                        <Zap className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">{activeSprints.length}</p>
                        <p className="text-[10px] text-white/80">In progress now</p>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Planned</p>
                        <Calendar className="w-4 h-4 text-blue-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">{plannedSprints.length}</p>
                        <p className="text-[10px] text-zinc-400">Upcoming sprints</p>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Completed</p>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">{completedSprints.length}</p>
                        <p className="text-[10px] text-zinc-400">Total completed</p>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Avg Velocity</p>
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">{avgVelocity}</p>
                        <p className="text-[10px] text-zinc-400">Points per sprint</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* VELOCITY CHART */}
            {renderVelocityChart()}

            {/* TABS */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-zinc-100 h-8 p-0.5 rounded-md">
                    <TabsTrigger value="active" className="text-[10px] font-semibold h-7 px-3 rounded">Active</TabsTrigger>
                    <TabsTrigger value="planned" className="text-[10px] font-semibold h-7 px-3 rounded">Planned</TabsTrigger>
                    <TabsTrigger value="completed" className="text-[10px] font-semibold h-7 px-3 rounded">Completed</TabsTrigger>
                    <TabsTrigger value="all" className="text-[10px] font-semibold h-7 px-3 rounded">All</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* SPRINT CARDS */}
            <div className="grid gap-4 md:grid-cols-2">
                {filteredSprints.length === 0 && (
                    <div className="col-span-2 text-center py-12 text-xs text-zinc-400">No sprints found. Create one to get started.</div>
                )}
                {filteredSprints.map(renderSprintCard)}
            </div>

            {/* CREATE SPRINT DIALOG */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-bold text-zinc-900">Create Sprint</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">Plan a new sprint for your team.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-2">
                        <div>
                            <label className="text-xs font-medium text-zinc-700 mb-1 block">Sprint Name</label>
                            <Input
                                className="h-8 text-xs"
                                placeholder="e.g. Sprint 5 - API Refactor"
                                value={newSprint.name}
                                onChange={(e) => setNewSprint(p => ({ ...p, name: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-zinc-700 mb-1 block">Goal</label>
                            <Input
                                className="h-8 text-xs"
                                placeholder="What should this sprint achieve?"
                                value={newSprint.goal}
                                onChange={(e) => setNewSprint(p => ({ ...p, goal: e.target.value }))}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-zinc-700 mb-1 block">Start Date</label>
                                <Input type="date" className="h-8 text-xs" value={newSprint.startDate} onChange={(e) => setNewSprint(p => ({ ...p, startDate: e.target.value }))} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-zinc-700 mb-1 block">End Date</label>
                                <Input type="date" className="h-8 text-xs" value={newSprint.endDate} onChange={(e) => setNewSprint(p => ({ ...p, endDate: e.target.value }))} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 text-xs" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                        <Button className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleCreateSprint}>Create Sprint</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* COMPLETE SPRINT DIALOG */}
            <Dialog open={!!showCompleteDialog} onOpenChange={() => setShowCompleteDialog(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-bold text-zinc-900">Complete Sprint</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">
                            {showCompleteDialog && (() => {
                                const si = getSprintIssues(showCompleteDialog)
                                const done = si.filter(i => i.status === "DONE").length
                                const incomplete = si.length - done
                                return `${done} of ${si.length} issues completed. ${incomplete} incomplete.`
                            })()}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                        {showCompleteDialog && getSprintIssues(showCompleteDialog).filter(i => i.status !== "DONE").length > 0 && (
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-medium text-zinc-700">Move incomplete issues to:</label>
                                <Select value={moveIncompleteTo} onValueChange={(v) => setMoveIncompleteTo(v as "backlog" | "next")}>
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="backlog" className="text-xs">Backlog</SelectItem>
                                        <SelectItem value="next" className="text-xs">Next Sprint</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="bg-amber-50 border border-amber-200 rounded p-2 mt-1">
                                    <div className="flex items-center gap-1.5">
                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                        <span className="text-[10px] text-amber-700 font-medium">Incomplete issues will be moved automatically.</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 text-xs" onClick={() => setShowCompleteDialog(null)}>Cancel</Button>
                        <Button className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleCompleteSprint}>Complete Sprint</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
