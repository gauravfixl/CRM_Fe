"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useParams } from "next/navigation"
import {
    Layers, Plus, MoreHorizontal, Target, TrendingUp, CheckCircle2,
    Circle, Clock, Trash2, Edit3, Eye, ChevronDown, ChevronRight,
    X, BarChart3, Calendar, Search, Unlink, Link2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import { useIssueStore, type Issue } from "@/shared/data/issue-store"
import { useSprintEpicStore, type Epic } from "@/shared/data/sprint-epic-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
const PRESET_COLORS = ["#6366f1", "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#ec4899"]

const epicStatusBadge: Record<string, string> = {
    OPEN: "bg-zinc-100 text-zinc-600", IN_PROGRESS: "bg-blue-100 text-blue-700", DONE: "bg-green-100 text-green-700",
}
const statusColors: Record<string, string> = {
    TODO: "bg-zinc-100 text-zinc-600", IN_PROGRESS: "bg-blue-100 text-blue-700",
    IN_REVIEW: "bg-purple-100 text-purple-700", DONE: "bg-green-100 text-green-700",
    BACKLOG: "bg-zinc-50 text-zinc-500", BLOCKED: "bg-red-100 text-red-600",
}
const priorityColors: Record<string, string> = {
    URGENT: "bg-red-100 text-red-700", HIGH: "bg-orange-100 text-orange-700",
    MEDIUM: "bg-yellow-100 text-yellow-700", LOW: "bg-blue-100 text-blue-700",
}

function addDays(d: Date, n: number) { const r = new Date(d); r.setDate(r.getDate() + n); return r }

export default function EpicsPage() {
    const params = useParams()
    const { issues, updateIssue } = useIssueStore()
    const { epics, addEpic, updateEpic, deleteEpic } = useSprintEpicStore()
    const { projects } = useProjectStore()
    const { activeWorkspaceId } = useWorkspaceStore()

    const [selectedProjectId, setSelectedProjectId] = useState<string>("")
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [showDetailDialog, setShowDetailDialog] = useState<string | null>(null)
    const [showEditDialog, setShowEditDialog] = useState<Epic | null>(null)
    const [issueSearchQuery, setIssueSearchQuery] = useState("")
    const [newEpic, setNewEpic] = useState({ name: "", description: "", color: PRESET_COLORS[0], status: "OPEN" as Epic["status"], startDate: "", dueDate: "" })

    const workspaceProjects = useMemo(() =>
        projects.filter(p => !activeWorkspaceId || p.workspaceId === activeWorkspaceId),
        [projects, activeWorkspaceId]
    )

    useEffect(() => {
        if (!selectedProjectId && workspaceProjects.length > 0) {
            setSelectedProjectId(workspaceProjects[0].id)
        }
    }, [workspaceProjects, selectedProjectId])

    const projectEpics = epics.filter(e => e.projectId === selectedProjectId)
    const projectIssues = issues.filter(i => i.projectId === selectedProjectId)

    const getChildIssues = (epicId: string) => projectIssues.filter(i => i.epicId === epicId)
    const getCompletedCount = (epicId: string) => getChildIssues(epicId).filter(i => i.status === "DONE").length
    const getTotalPoints = (epicId: string) => getChildIssues(epicId).reduce((s, i) => s + (i.storyPoints || 0), 0)
    const getCompletedPoints = (epicId: string) => getChildIssues(epicId).filter(i => i.status === "DONE").reduce((s, i) => s + (i.storyPoints || 0), 0)

    const totalEpics = projectEpics.length
    const activeEpics = projectEpics.filter(e => e.status === "IN_PROGRESS").length
    const completedEpics = projectEpics.filter(e => e.status === "DONE").length
    const totalStoryPoints = projectEpics.reduce((s, e) => s + getTotalPoints(e.id), 0)

    const handleCreateEpic = () => {
        if (!newEpic.name.trim()) { toast.error("Epic name is required"); return }
        addEpic({
            id: `epic-${Date.now()}`, projectId: selectedProjectId, name: newEpic.name,
            description: newEpic.description, color: newEpic.color, status: newEpic.status,
            createdAt: new Date().toISOString(),
        })
        toast.success("Epic created successfully")
        setNewEpic({ name: "", description: "", color: PRESET_COLORS[0], status: "OPEN", startDate: "", dueDate: "" })
        setShowCreateDialog(false)
    }

    const handleUpdateEpic = () => {
        if (!showEditDialog) return
        updateEpic(showEditDialog.id, {
            name: showEditDialog.name, description: showEditDialog.description,
            color: showEditDialog.color, status: showEditDialog.status,
        })
        toast.success("Epic updated")
        setShowEditDialog(null)
    }

    const handleDeleteEpic = (epicId: string) => {
        const children = getChildIssues(epicId)
        children.forEach(i => updateIssue(i.id, { epicId: null }))
        deleteEpic(epicId)
        toast.success("Epic deleted")
    }

    const handleAddIssueToEpic = (issueId: string, epicId: string) => {
        updateIssue(issueId, { epicId })
        toast.success("Issue linked to epic")
        setIssueSearchQuery("")
    }

    const handleRemoveIssueFromEpic = (issueId: string) => {
        updateIssue(issueId, { epicId: null })
        toast.success("Issue removed from epic")
    }

    const detailEpic = projectEpics.find(e => e.id === showDetailDialog)
    const detailChildren = detailEpic ? getChildIssues(detailEpic.id) : []
    const unlinkedIssues = projectIssues.filter(i => !i.epicId && i.title.toLowerCase().includes(issueSearchQuery.toLowerCase()))

    // Mini roadmap data
    const roadmapEpics = projectEpics.map(e => {
        const children = getChildIssues(e.id)
        const minStart = children.reduce((min, i) => {
            const d = i.startDate || i.createdAt
            return d < min ? d : min
        }, new Date().toISOString())
        const maxEnd = children.reduce((max, i) => {
            const d = i.dueDate || addDays(new Date(i.createdAt), 30).toISOString()
            return d > max ? d : max
        }, new Date().toISOString())
        return { ...e, start: minStart, end: maxEnd }
    })

    const roadmapMin = roadmapEpics.length > 0 ? new Date(Math.min(...roadmapEpics.map(e => new Date(e.start).getTime()))) : new Date()
    const roadmapMax = roadmapEpics.length > 0 ? new Date(Math.max(...roadmapEpics.map(e => new Date(e.end).getTime()))) : addDays(new Date(), 90)
    const roadmapRange = Math.max(1, (roadmapMax.getTime() - roadmapMin.getTime()) / 86400000)

    return (
        <div className="min-h-screen bg-[#fafafa] p-6 space-y-5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">Projects</span>
                <span className="text-[10px] text-zinc-300">/</span>
                <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wide">Epics</span>
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
                    <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Epic Management</h1>
                    <p className="text-xs text-zinc-500 mt-0.5">Organize and track large bodies of work</p>
                </div>
                <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Epic
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
                <SmallCard><SmallCardHeader><div className="flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-500" /><span className="text-xs font-medium text-zinc-500">Total Epics</span></div></SmallCardHeader><SmallCardContent><span className="text-xl font-bold text-zinc-900">{totalEpics}</span></SmallCardContent></SmallCard>
                <SmallCard><SmallCardHeader><div className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500" /><span className="text-xs font-medium text-zinc-500">Active</span></div></SmallCardHeader><SmallCardContent><span className="text-xl font-bold text-zinc-900">{activeEpics}</span></SmallCardContent></SmallCard>
                <SmallCard><SmallCardHeader><div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /><span className="text-xs font-medium text-zinc-500">Completed</span></div></SmallCardHeader><SmallCardContent><span className="text-xl font-bold text-zinc-900">{completedEpics}</span></SmallCardContent></SmallCard>
                <SmallCard><SmallCardHeader><div className="flex items-center gap-2"><Target className="w-4 h-4 text-orange-500" /><span className="text-xs font-medium text-zinc-500">Total Story Points</span></div></SmallCardHeader><SmallCardContent><span className="text-xl font-bold text-zinc-900">{totalStoryPoints}</span></SmallCardContent></SmallCard>
            </div>

            {/* Epic Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectEpics.map(epic => {
                    const children = getChildIssues(epic.id)
                    const completed = getCompletedCount(epic.id)
                    const total = children.length
                    const pctDone = total > 0 ? Math.round((completed / total) * 100) : 0
                    const pts = getTotalPoints(epic.id)
                    const cPts = getCompletedPoints(epic.id)
                    const childDates = children.filter(i => i.startDate || i.dueDate)
                    const dateRange = childDates.length > 0
                        ? `${new Date(childDates[0].startDate || childDates[0].createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${new Date(childDates[childDates.length - 1].dueDate || addDays(new Date(), 30).toISOString()).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                        : "No dates"
                    return (
                        <div key={epic.id} className="bg-white rounded-lg border border-zinc-200 shadow-sm p-4 space-y-3 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: epic.color }} />
                                    <h3 className="text-sm font-semibold text-zinc-900 truncate">{epic.name}</h3>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><MoreHorizontal className="w-3.5 h-3.5" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setShowEditDialog({ ...epic })}><Edit3 className="w-3.5 h-3.5 mr-2" /> Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setShowDetailDialog(epic.id)}><Eye className="w-3.5 h-3.5 mr-2" /> View Children</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteEpic(epic.id)}><Trash2 className="w-3.5 h-3.5 mr-2" /> Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <p className="text-xs text-zinc-500 line-clamp-2">{epic.description || "No description"}</p>
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                                    <span>Progress</span><span>{pctDone}%</span>
                                </div>
                                <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full transition-all" style={{ width: `${pctDone}%`, backgroundColor: epic.color }} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                                <span className="text-zinc-400">Story Points: <span className="text-zinc-600 font-medium">{cPts}/{pts}</span></span>
                                <Badge className={`text-[9px] h-4 ${epicStatusBadge[epic.status]}`}>{epic.status.replace(/_/g, " ")}</Badge>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-zinc-400">
                                <span>{total} issues</span>
                                <span>{dateRange}</span>
                            </div>
                        </div>
                    )
                })}
                {projectEpics.length === 0 && (
                    <div className="col-span-3 text-center py-12 text-zinc-400 text-sm">No epics yet. Create one to get started.</div>
                )}
            </div>

            {/* Epic Roadmap */}
            {projectEpics.length > 0 && (
                <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-4">
                    <h2 className="text-sm font-semibold text-zinc-900 mb-3">Epic Roadmap</h2>
                    <div className="space-y-2">
                        {roadmapEpics.map(epic => {
                            const startPct = ((new Date(epic.start).getTime() - roadmapMin.getTime()) / (roadmapRange * 86400000)) * 100
                            const endPct = ((new Date(epic.end).getTime() - roadmapMin.getTime()) / (roadmapRange * 86400000)) * 100
                            const widthPct = Math.max(3, endPct - startPct)
                            return (
                                <div key={epic.id} className="flex items-center gap-3">
                                    <span className="text-[10px] text-zinc-500 w-32 truncate shrink-0">{epic.name}</span>
                                    <div className="flex-1 h-5 bg-zinc-50 rounded relative">
                                        <div className="absolute top-0.5 bottom-0.5 rounded" style={{ left: `${startPct}%`, width: `${widthPct}%`, backgroundColor: epic.color, opacity: 0.8 }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex justify-between mt-2 text-[9px] text-zinc-400">
                        <span>{roadmapMin.toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                        <span>{roadmapMax.toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                    </div>
                </div>
            )}

            {/* Create Epic Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base font-semibold text-zinc-900">Create Epic</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">Create a new epic to group related issues</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 mt-2">
                        <div><label className="text-xs font-medium text-zinc-500 block mb-1">Name</label>
                            <Input className="h-8 text-xs" value={newEpic.name} onChange={e => setNewEpic(p => ({ ...p, name: e.target.value }))} placeholder="Epic name" /></div>
                        <div><label className="text-xs font-medium text-zinc-500 block mb-1">Description</label>
                            <Input className="h-8 text-xs" value={newEpic.description} onChange={e => setNewEpic(p => ({ ...p, description: e.target.value }))} placeholder="Description" /></div>
                        <div><label className="text-xs font-medium text-zinc-500 block mb-1">Color</label>
                            <div className="flex gap-2">
                                {PRESET_COLORS.map(c => (
                                    <button key={c} onClick={() => setNewEpic(p => ({ ...p, color: c }))}
                                        className={`w-7 h-7 rounded-full border-2 transition-all ${newEpic.color === c ? "border-zinc-900 scale-110" : "border-transparent"}`} style={{ backgroundColor: c }} />
                                ))}
                            </div>
                        </div>
                        <div><label className="text-xs font-medium text-zinc-500 block mb-1">Status</label>
                            <Select value={newEpic.status} onValueChange={v => setNewEpic(p => ({ ...p, status: v as Epic["status"] }))}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="OPEN">Open</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="DONE">Done</SelectItem>
                                </SelectContent>
                            </Select></div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><label className="text-xs font-medium text-zinc-500 block mb-1">Start Date</label>
                                <Input type="date" className="h-8 text-xs" value={newEpic.startDate} onChange={e => setNewEpic(p => ({ ...p, startDate: e.target.value }))} /></div>
                            <div><label className="text-xs font-medium text-zinc-500 block mb-1">Due Date</label>
                                <Input type="date" className="h-8 text-xs" value={newEpic.dueDate} onChange={e => setNewEpic(p => ({ ...p, dueDate: e.target.value }))} /></div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" size="sm" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700" onClick={handleCreateEpic}>Create Epic</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Epic Dialog */}
            <Dialog open={!!showEditDialog} onOpenChange={() => setShowEditDialog(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base font-semibold text-zinc-900">Edit Epic</DialogTitle>
                    </DialogHeader>
                    {showEditDialog && (
                        <div className="space-y-3 mt-2">
                            <div><label className="text-xs font-medium text-zinc-500 block mb-1">Name</label>
                                <Input className="h-8 text-xs" value={showEditDialog.name} onChange={e => setShowEditDialog(p => p ? { ...p, name: e.target.value } : p)} /></div>
                            <div><label className="text-xs font-medium text-zinc-500 block mb-1">Description</label>
                                <Input className="h-8 text-xs" value={showEditDialog.description || ""} onChange={e => setShowEditDialog(p => p ? { ...p, description: e.target.value } : p)} /></div>
                            <div><label className="text-xs font-medium text-zinc-500 block mb-1">Color</label>
                                <div className="flex gap-2">
                                    {PRESET_COLORS.map(c => (
                                        <button key={c} onClick={() => setShowEditDialog(p => p ? { ...p, color: c } : p)}
                                            className={`w-7 h-7 rounded-full border-2 transition-all ${showEditDialog.color === c ? "border-zinc-900 scale-110" : "border-transparent"}`} style={{ backgroundColor: c }} />
                                    ))}
                                </div></div>
                            <div><label className="text-xs font-medium text-zinc-500 block mb-1">Status</label>
                                <Select value={showEditDialog.status} onValueChange={v => setShowEditDialog(p => p ? { ...p, status: v as Epic["status"] } : p)}>
                                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="OPEN">Open</SelectItem>
                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="DONE">Done</SelectItem>
                                    </SelectContent>
                                </Select></div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" size="sm" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setShowEditDialog(null)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700" onClick={handleUpdateEpic}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Epic Detail Dialog */}
            <Dialog open={!!showDetailDialog} onOpenChange={() => setShowDetailDialog(null)}>
                <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-base font-semibold text-zinc-900 flex items-center gap-2">
                            {detailEpic && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: detailEpic.color }} />}
                            {detailEpic?.name}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">{detailEpic?.description || "No description"}</DialogDescription>
                    </DialogHeader>
                    {detailEpic && (
                        <div className="space-y-4 mt-2">
                            {/* Progress Chart */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold text-zinc-700">Progress</h4>
                                <div className="flex gap-1.5 h-6">
                                    {["DONE", "IN_PROGRESS", "TODO", "BACKLOG"].map(st => {
                                        const count = detailChildren.filter(i => i.status === st).length
                                        const pct = detailChildren.length > 0 ? (count / detailChildren.length) * 100 : 0
                                        if (pct === 0) return null
                                        const colors: Record<string, string> = { DONE: "bg-green-500", IN_PROGRESS: "bg-blue-500", TODO: "bg-zinc-300", BACKLOG: "bg-zinc-200" }
                                        return <div key={st} className={`${colors[st] || "bg-zinc-200"} rounded-sm flex items-center justify-center`} style={{ width: `${pct}%` }}>
                                            <span className="text-[9px] text-white font-medium">{count}</span>
                                        </div>
                                    })}
                                </div>
                                <div className="flex gap-3 text-[10px] text-zinc-400">
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-green-500" /> Done</span>
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-blue-500" /> In Progress</span>
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-zinc-300" /> To Do</span>
                                </div>
                            </div>

                            {/* Child Issues Table */}
                            <div>
                                <h4 className="text-xs font-semibold text-zinc-700 mb-2">Child Issues ({detailChildren.length})</h4>
                                <div className="border border-zinc-200 rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-zinc-50">
                                                <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Key</TableHead>
                                                <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Title</TableHead>
                                                <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Status</TableHead>
                                                <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Priority</TableHead>
                                                <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Points</TableHead>
                                                <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Assignee</TableHead>
                                                <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase w-8"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {detailChildren.map(issue => (
                                                <TableRow key={issue.id}>
                                                    <TableCell className="text-[10px] font-mono text-zinc-400">{issue.id}</TableCell>
                                                    <TableCell className="text-xs text-zinc-700">{issue.title}</TableCell>
                                                    <TableCell><Badge className={`text-[9px] h-4 ${statusColors[issue.status] || "bg-zinc-100 text-zinc-600"}`}>{issue.status.replace(/_/g, " ")}</Badge></TableCell>
                                                    <TableCell><Badge className={`text-[9px] h-4 ${priorityColors[issue.priority] || ""}`}>{issue.priority}</Badge></TableCell>
                                                    <TableCell className="text-xs text-zinc-600">{issue.storyPoints || "—"}</TableCell>
                                                    <TableCell className="text-xs text-zinc-600">{issue.assignee?.name || "Unassigned"}</TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-400 hover:text-red-600" onClick={() => handleRemoveIssueFromEpic(issue.id)}>
                                                            <Unlink className="w-3 h-3" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {detailChildren.length === 0 && (
                                                <TableRow><TableCell colSpan={7} className="text-center text-xs text-zinc-400 py-6">No issues linked to this epic</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Add Issue */}
                            <div>
                                <h4 className="text-xs font-semibold text-zinc-700 mb-2">Add Issue to Epic</h4>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-400" />
                                        <Input className="h-8 text-xs pl-8" placeholder="Search issues by title..." value={issueSearchQuery} onChange={e => setIssueSearchQuery(e.target.value)} />
                                    </div>
                                </div>
                                {issueSearchQuery && (
                                    <div className="mt-2 border border-zinc-200 rounded-lg max-h-40 overflow-y-auto">
                                        {unlinkedIssues.slice(0, 8).map(i => (
                                            <button key={i.id} className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-50 text-left border-b border-zinc-50 last:border-0"
                                                onClick={() => handleAddIssueToEpic(i.id, detailEpic.id)}>
                                                <span className="text-xs text-zinc-700">{i.id} — {i.title}</span>
                                                <Link2 className="w-3 h-3 text-indigo-500" />
                                            </button>
                                        ))}
                                        {unlinkedIssues.length === 0 && <div className="text-center text-xs text-zinc-400 py-3">No matching unlinked issues</div>}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" size="sm" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setShowDetailDialog(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
