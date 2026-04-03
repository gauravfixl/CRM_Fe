"use client"

import React, { useState, useMemo } from "react"
import {
    Search, CheckSquare, Edit3, Trash2, ArrowRight, ChevronRight, AlertTriangle,
    RotateCcw, Layers, Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import { useIssueStore, type Issue, type IssueStatus, type IssuePriority } from "@/shared/data/issue-store"
import { useSprintEpicStore } from "@/shared/data/sprint-epic-store"

type BulkOperation = "edit" | "transition" | "move_sprint" | "delete"

interface BulkHistoryEntry {
    id: string
    operation: BulkOperation
    count: number
    summary: string
    timestamp: string
}

const STATUS_OPTIONS: IssueStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BACKLOG", "TESTING", "BLOCKED"]
const PRIORITY_OPTIONS: IssuePriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"]

const PRIORITY_COLORS: Record<string, string> = {
    URGENT: "bg-red-50 text-red-700", HIGH: "bg-orange-50 text-orange-700",
    MEDIUM: "bg-amber-50 text-amber-600", LOW: "bg-zinc-100 text-zinc-600",
}
const STATUS_COLORS: Record<string, string> = {
    TODO: "bg-zinc-100 text-zinc-600", IN_PROGRESS: "bg-blue-50 text-blue-700",
    IN_REVIEW: "bg-purple-50 text-purple-700", DONE: "bg-emerald-50 text-emerald-700",
    BACKLOG: "bg-zinc-100 text-zinc-500", BLOCKED: "bg-red-50 text-red-700",
    TESTING: "bg-cyan-50 text-cyan-700",
}

export default function BulkOperationsPage() {
    const issues = useIssueStore((s) => s.issues)
    const updateIssue = useIssueStore((s) => s.updateIssue)
    const deleteIssue = useIssueStore((s) => s.deleteIssue)
    const sprints = useSprintEpicStore((s) => s.sprints)

    const [step, setStep] = useState(1)
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = useState("")
    const [operation, setOperation] = useState<BulkOperation | null>(null)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

    // Edit fields state
    const [editStatus, setEditStatus] = useState<string>("")
    const [editPriority, setEditPriority] = useState<string>("")
    const [editAssignee, setEditAssignee] = useState("")
    const [editSprint, setEditSprint] = useState<string>("")
    const [editLabels, setEditLabels] = useState("")
    const [editStoryPoints, setEditStoryPoints] = useState("")
    const [editDueDate, setEditDueDate] = useState("")

    // Transition
    const [transitionStatus, setTransitionStatus] = useState<string>("")

    // Move to sprint
    const [moveSprintId, setMoveSprintId] = useState<string>("")

    // History
    const [history, setHistory] = useState<BulkHistoryEntry[]>([
        { id: "bh-1", operation: "edit", count: 5, summary: "Changed priority to HIGH on 5 issues", timestamp: "2026-04-01T09:30:00Z" },
        { id: "bh-2", operation: "transition", count: 3, summary: "Moved 3 issues to DONE", timestamp: "2026-03-30T16:00:00Z" },
    ])

    const filteredIssues = useMemo(() => {
        if (!searchQuery) return issues
        const q = searchQuery.toLowerCase()
        return issues.filter((i) => i.title.toLowerCase().includes(q) || i.id.toLowerCase().includes(q))
    }, [issues, searchQuery])

    const selectedIssues = useMemo(() => issues.filter((i) => selectedIds.has(i.id)), [issues, selectedIds])

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id); else next.add(id)
            return next
        })
    }

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredIssues.length) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(filteredIssues.map((i) => i.id)))
        }
    }

    const goToStep = (s: number) => {
        if (s === 2 && selectedIds.size === 0) { toast.error("Select at least one issue"); return }
        if (s === 3 && !operation) { toast.error("Choose an operation"); return }
        if (s === 4 && operation === "edit") {
            if (!editStatus && !editPriority && !editAssignee && !editSprint && !editLabels && !editStoryPoints && !editDueDate) {
                toast.error("Configure at least one field to change"); return
            }
        }
        if (s === 4 && operation === "transition" && !transitionStatus) { toast.error("Select a target status"); return }
        if (s === 4 && operation === "move_sprint" && !moveSprintId) { toast.error("Select a target sprint"); return }
        setStep(s)
    }

    const executeOperation = () => {
        const count = selectedIssues.length
        if (operation === "delete") {
            selectedIssues.forEach((i) => deleteIssue(i.id))
            addHistory("delete", count, `Deleted ${count} issues`)
            toast.success(`${count} issues deleted`)
        } else if (operation === "transition") {
            selectedIssues.forEach((i) => updateIssue(i.id, { status: transitionStatus as IssueStatus }))
            addHistory("transition", count, `Moved ${count} issues to ${transitionStatus}`)
            toast.success(`${count} issues transitioned to ${transitionStatus}`)
        } else if (operation === "move_sprint") {
            selectedIssues.forEach((i) => updateIssue(i.id, { sprintId: moveSprintId }))
            const sprintName = sprints.find((s) => s.id === moveSprintId)?.name ?? moveSprintId
            addHistory("move_sprint", count, `Moved ${count} issues to sprint "${sprintName}"`)
            toast.success(`${count} issues moved to ${sprintName}`)
        } else if (operation === "edit") {
            const updates: Partial<Issue> = {}
            if (editStatus) updates.status = editStatus as IssueStatus
            if (editPriority) updates.priority = editPriority as IssuePriority
            if (editAssignee) updates.assigneeId = editAssignee
            if (editSprint) updates.sprintId = editSprint
            if (editLabels) updates.labels = editLabels.split(",").map((l) => l.trim())
            if (editStoryPoints) updates.storyPoints = Number(editStoryPoints)
            if (editDueDate) updates.dueDate = new Date(editDueDate).toISOString()
            const fields = Object.keys(updates).join(", ")
            selectedIssues.forEach((i) => updateIssue(i.id, updates))
            addHistory("edit", count, `Updated ${fields} on ${count} issues`)
            toast.success(`${count} issues updated (${fields})`)
        }
        // Reset
        setSelectedIds(new Set())
        setOperation(null)
        setStep(1)
        resetEditFields()
    }

    const resetEditFields = () => {
        setEditStatus(""); setEditPriority(""); setEditAssignee("")
        setEditSprint(""); setEditLabels(""); setEditStoryPoints(""); setEditDueDate("")
        setTransitionStatus(""); setMoveSprintId("")
    }

    const addHistory = (op: BulkOperation, count: number, summary: string) => {
        setHistory((prev) => [
            { id: `bh-${Date.now()}`, operation: op, count, summary, timestamp: new Date().toISOString() },
            ...prev,
        ])
    }

    const getChangeSummary = (): string[] => {
        const lines: string[] = []
        if (operation === "edit") {
            if (editStatus) lines.push(`Status -> ${editStatus}`)
            if (editPriority) lines.push(`Priority -> ${editPriority}`)
            if (editAssignee) lines.push(`Assignee -> ${editAssignee}`)
            if (editSprint) lines.push(`Sprint -> ${sprints.find((s) => s.id === editSprint)?.name ?? editSprint}`)
            if (editLabels) lines.push(`Labels -> ${editLabels}`)
            if (editStoryPoints) lines.push(`Story Points -> ${editStoryPoints}`)
            if (editDueDate) lines.push(`Due Date -> ${editDueDate}`)
        }
        if (operation === "transition") lines.push(`Status -> ${transitionStatus}`)
        if (operation === "move_sprint") lines.push(`Sprint -> ${sprints.find((s) => s.id === moveSprintId)?.name ?? moveSprintId}`)
        if (operation === "delete") lines.push(`DELETE ${selectedIssues.length} issues permanently`)
        return lines
    }

    const OPERATION_LABELS: Record<BulkOperation, string> = {
        edit: "Edit Fields", transition: "Bulk Transition", move_sprint: "Move to Sprint", delete: "Delete Issues",
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>PROJECTS</span><span>/</span>
                    <span className="text-zinc-900 font-semibold">BULK OPERATIONS</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Bulk Operations</h1>
                        <p className="text-xs text-zinc-500 font-medium">Edit, transition, or manage multiple issues at once.</p>
                    </div>
                </div>
            </div>

            {/* STEP INDICATOR */}
            <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((s) => (
                    <React.Fragment key={s}>
                        <button
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${step === s ? "bg-indigo-600 text-white shadow-sm" : step > s ? "bg-indigo-100 text-indigo-700" : "bg-zinc-100 text-zinc-400"}`}
                            onClick={() => { if (s < step) setStep(s) }}
                        >
                            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                                {step > s ? "\u2713" : s}
                            </span>
                            {s === 1 && "Select"}
                            {s === 2 && "Operation"}
                            {s === 3 && "Configure"}
                            {s === 4 && "Confirm"}
                        </button>
                        {s < 4 && <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />}
                    </React.Fragment>
                ))}
            </div>

            {/* STATS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-indigo-500 to-indigo-700 border-none text-white shadow-[0_8px_30px_rgb(99,102,241,0.3)]">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Selected</p>
                        <CheckSquare className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">{selectedIds.size}</p>
                        <p className="text-[10px] text-white/80">Issues selected</p>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white border shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Total Issues</p>
                        <Layers className="w-4 h-4 text-zinc-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">{issues.length}</p>
                        <p className="text-[10px] text-zinc-400">Available for selection</p>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white border shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Current Step</p>
                        <ArrowRight className="w-4 h-4 text-indigo-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">{step}/4</p>
                        <p className="text-[10px] text-zinc-400">{step === 1 ? "Select Issues" : step === 2 ? "Choose Operation" : step === 3 ? "Configure" : "Preview"}</p>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white border shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Past Operations</p>
                        <Clock className="w-4 h-4 text-amber-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">{history.length}</p>
                        <p className="text-[10px] text-zinc-400">Operations logged</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* STEP 1 — SELECT ISSUES */}
            {step === 1 && (
                <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/20">
                        <div className="flex items-center gap-3">
                            <h2 className="text-sm font-bold text-zinc-900">Step 1: Select Issues</h2>
                            <Badge className="text-[9px] bg-indigo-50 text-indigo-600 border-none px-2 py-0.5 font-bold">{selectedIds.size} selected</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                                <Input className="pl-9 h-8 bg-white border-zinc-200 rounded-md text-xs font-medium" placeholder="Search issues..."
                                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                            <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white"
                                onClick={() => goToStep(2)}>
                                Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                        </div>
                    </div>
                    <Table>
                        <TableHeader className="bg-zinc-50/50">
                            <TableRow>
                                <TableHead className="py-3 px-4 w-10">
                                    <input type="checkbox" className="rounded border-zinc-300"
                                        checked={selectedIds.size === filteredIssues.length && filteredIssues.length > 0}
                                        onChange={toggleSelectAll} />
                                </TableHead>
                                <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Key</TableHead>
                                <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Title</TableHead>
                                <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Status</TableHead>
                                <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Priority</TableHead>
                                <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Type</TableHead>
                                <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Assignee</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredIssues.map((issue) => (
                                <TableRow key={issue.id} className={`hover:bg-zinc-50/50 transition-colors cursor-pointer ${selectedIds.has(issue.id) ? "bg-indigo-50/30" : ""}`}
                                    onClick={() => toggleSelect(issue.id)}>
                                    <TableCell className="py-3 px-4">
                                        <input type="checkbox" className="rounded border-zinc-300" checked={selectedIds.has(issue.id)} onChange={() => toggleSelect(issue.id)} />
                                    </TableCell>
                                    <TableCell className="py-3"><span className="text-[10px] font-mono font-bold text-indigo-600">{issue.id}</span></TableCell>
                                    <TableCell className="py-3"><span className="text-xs font-medium text-zinc-900">{issue.title}</span></TableCell>
                                    <TableCell className="py-3 text-center">
                                        <Badge className={`text-[9px] uppercase font-bold border-none px-2 py-0.5 ${STATUS_COLORS[issue.status] ?? "bg-zinc-100 text-zinc-600"}`}>{issue.status}</Badge>
                                    </TableCell>
                                    <TableCell className="py-3 text-center">
                                        <Badge className={`text-[9px] uppercase font-bold border-none px-2 py-0.5 ${PRIORITY_COLORS[issue.priority]}`}>{issue.priority}</Badge>
                                    </TableCell>
                                    <TableCell className="py-3 text-center">
                                        <Badge className="text-[9px] uppercase font-bold border-none px-2 py-0.5 bg-zinc-100 text-zinc-600">{issue.type}</Badge>
                                    </TableCell>
                                    <TableCell className="py-3 text-center">
                                        <span className="text-xs text-zinc-600">{issue.assignee?.name ?? issue.assigneeId}</span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* STEP 2 — CHOOSE OPERATION */}
            {step === 2 && (
                <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/20 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-zinc-900">Step 2: Choose Operation</h2>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3 active:scale-95" onClick={() => setStep(1)}>Back</Button>
                            <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => goToStep(3)}>
                                Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                        </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {([
                            { key: "edit" as BulkOperation, icon: Edit3, label: "Edit Fields", desc: "Change status, priority, assignee, sprint, labels, story points, or due date", color: "indigo" },
                            { key: "transition" as BulkOperation, icon: ArrowRight, label: "Bulk Transition", desc: "Move all selected issues to a new status", color: "blue" },
                            { key: "move_sprint" as BulkOperation, icon: RotateCcw, label: "Move to Sprint", desc: "Reassign selected issues to a different sprint", color: "emerald" },
                            { key: "delete" as BulkOperation, icon: Trash2, label: "Delete Issues", desc: "Permanently delete all selected issues", color: "red" },
                        ]).map((op) => (
                            <button key={op.key} onClick={() => setOperation(op.key)}
                                className={`flex items-start gap-4 p-4 rounded-lg border-2 text-left transition-all ${operation === op.key ? `border-${op.color}-500 bg-${op.color}-50/50` : "border-zinc-200 hover:border-zinc-300"}`}>
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${operation === op.key ? `bg-${op.color}-100` : "bg-zinc-100"}`}>
                                    <op.icon className={`w-5 h-5 ${operation === op.key ? `text-${op.color}-600` : "text-zinc-500"}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-zinc-900">{op.label}</p>
                                    <p className="text-xs text-zinc-500 mt-0.5">{op.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 3 — CONFIGURE */}
            {step === 3 && (
                <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/20 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-zinc-900">Step 3: Configure Changes</h2>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3 active:scale-95" onClick={() => setStep(2)}>Back</Button>
                            <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => goToStep(4)}>
                                Preview <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                        </div>
                    </div>
                    <div className="p-6">
                        {operation === "edit" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                                <div>
                                    <label className="text-xs font-medium text-zinc-900 mb-1 block">Status</label>
                                    <Select value={editStatus} onValueChange={setEditStatus}>
                                        <SelectTrigger className="h-8 text-xs border-zinc-200"><SelectValue placeholder="No change" /></SelectTrigger>
                                        <SelectContent>{STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-zinc-900 mb-1 block">Priority</label>
                                    <Select value={editPriority} onValueChange={setEditPriority}>
                                        <SelectTrigger className="h-8 text-xs border-zinc-200"><SelectValue placeholder="No change" /></SelectTrigger>
                                        <SelectContent>{PRIORITY_OPTIONS.map((p) => <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-zinc-900 mb-1 block">Assignee</label>
                                    <Input className="h-8 text-xs border-zinc-200" placeholder="Assignee ID..." value={editAssignee} onChange={(e) => setEditAssignee(e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-zinc-900 mb-1 block">Sprint</label>
                                    <Select value={editSprint} onValueChange={setEditSprint}>
                                        <SelectTrigger className="h-8 text-xs border-zinc-200"><SelectValue placeholder="No change" /></SelectTrigger>
                                        <SelectContent>{sprints.map((s) => <SelectItem key={s.id} value={s.id} className="text-xs">{s.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-zinc-900 mb-1 block">Labels (comma separated)</label>
                                    <Input className="h-8 text-xs border-zinc-200" placeholder="bug, frontend..." value={editLabels} onChange={(e) => setEditLabels(e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-zinc-900 mb-1 block">Story Points</label>
                                    <Input className="h-8 text-xs border-zinc-200" type="number" placeholder="Points..." value={editStoryPoints} onChange={(e) => setEditStoryPoints(e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-zinc-900 mb-1 block">Due Date</label>
                                    <Input className="h-8 text-xs border-zinc-200" type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} />
                                </div>
                            </div>
                        )}
                        {operation === "transition" && (
                            <div className="max-w-sm">
                                <label className="text-xs font-medium text-zinc-900 mb-1 block">Target Status</label>
                                <Select value={transitionStatus} onValueChange={setTransitionStatus}>
                                    <SelectTrigger className="h-8 text-xs border-zinc-200"><SelectValue placeholder="Select status..." /></SelectTrigger>
                                    <SelectContent>{STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        )}
                        {operation === "move_sprint" && (
                            <div className="max-w-sm">
                                <label className="text-xs font-medium text-zinc-900 mb-1 block">Target Sprint</label>
                                <Select value={moveSprintId} onValueChange={setMoveSprintId}>
                                    <SelectTrigger className="h-8 text-xs border-zinc-200"><SelectValue placeholder="Select sprint..." /></SelectTrigger>
                                    <SelectContent>{sprints.map((s) => <SelectItem key={s.id} value={s.id} className="text-xs">{s.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        )}
                        {operation === "delete" && (
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 max-w-lg">
                                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-red-800">Warning: Permanent Deletion</p>
                                    <p className="text-xs text-red-600 mt-1">{selectedIssues.length} issues will be permanently deleted. This action cannot be undone.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* STEP 4 — PREVIEW & CONFIRM */}
            {step === 4 && (
                <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/20 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-zinc-900">Step 4: Preview & Confirm</h2>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3 active:scale-95" onClick={() => setStep(3)}>Back</Button>
                            {operation === "delete" ? (
                                <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-red-600 hover:bg-red-700 text-white" onClick={() => setDeleteConfirmOpen(true)}>
                                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />Delete {selectedIssues.length} Issues
                                </Button>
                            ) : (
                                <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={executeOperation}>
                                    <CheckSquare className="w-3.5 h-3.5 mr-1.5" />Execute
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200">
                            <p className="text-xs font-bold text-zinc-900 mb-2">Summary</p>
                            <p className="text-xs text-zinc-600"><span className="font-semibold">{selectedIssues.length}</span> issues will be updated with operation: <span className="font-semibold">{operation ? OPERATION_LABELS[operation] : ""}</span></p>
                            <div className="mt-3 space-y-1">
                                {getChangeSummary().map((line, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs">
                                        <ArrowRight className="w-3 h-3 text-indigo-500" />
                                        <span className="text-zinc-700 font-medium">{line}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-zinc-900 mb-2">Affected Issues</p>
                            <div className="flex flex-wrap gap-1.5">
                                {selectedIssues.map((i) => (
                                    <Badge key={i.id} className="text-[9px] font-mono font-bold border-none px-2 py-0.5 bg-indigo-50 text-indigo-700">
                                        {i.id}: {i.title.slice(0, 30)}{i.title.length > 30 ? "..." : ""}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION DIALOG */}
            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-bold text-red-700">Confirm Deletion</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">
                            Are you sure you want to permanently delete {selectedIssues.length} issues? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => { setDeleteConfirmOpen(false); executeOperation() }}>
                            Delete Permanently
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* HISTORY SECTION */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/20">
                    <h2 className="text-sm font-bold text-zinc-900">Recent Bulk Operations</h2>
                </div>
                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Operation</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Summary</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Issues</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-right pr-4">Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.length === 0 ? (
                            <TableRow><TableCell colSpan={4} className="py-8 text-center text-xs text-zinc-400">No operations yet.</TableCell></TableRow>
                        ) : (
                            history.map((h) => (
                                <TableRow key={h.id} className="hover:bg-zinc-50/50 transition-colors">
                                    <TableCell className="py-3 px-4">
                                        <Badge className="text-[9px] uppercase font-bold border-none px-2 py-0.5 bg-indigo-50 text-indigo-700">{h.operation}</Badge>
                                    </TableCell>
                                    <TableCell className="py-3"><span className="text-xs text-zinc-700">{h.summary}</span></TableCell>
                                    <TableCell className="py-3 text-center"><span className="text-xs font-bold text-zinc-900">{h.count}</span></TableCell>
                                    <TableCell className="py-3 text-right pr-4"><span className="text-[10px] font-mono text-zinc-400">{new Date(h.timestamp).toLocaleString()}</span></TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
