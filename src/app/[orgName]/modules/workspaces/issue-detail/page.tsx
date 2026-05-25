"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
    CheckSquare, Bug, BookOpen, Layers, Circle, Flame, ArrowUp,
    ArrowDown, Minus, Eye, Share2, Copy, Trash2, Edit3, Plus,
    Send, Clock, MessageSquare, History, Timer, X, Save, Link2,
    AlertTriangle, ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useIssueStore, type Issue, type IssueStatus, type IssuePriority, type IssueType } from "@/shared/data/issue-store"
import { useSprintEpicStore } from "@/shared/data/sprint-epic-store"
import { useCollaborationStore } from "@/shared/data/collaboration-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
const CURRENT_USER = { id: "u1", name: "John Doe", avatar: "https://i.pravatar.cc/150?u=u1" }
const ALL_STATUSES: IssueStatus[] = ["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BLOCKED"]
const ALL_PRIORITIES: IssuePriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"]
const ALL_TYPES: IssueType[] = ["TASK", "BUG", "STORY", "EPIC"]

const typeIcons: Record<IssueType, React.ReactNode> = {
    TASK: <CheckSquare className="w-4 h-4 text-blue-500" />,
    BUG: <Bug className="w-4 h-4 text-red-500" />,
    STORY: <BookOpen className="w-4 h-4 text-green-500" />,
    EPIC: <Layers className="w-4 h-4 text-purple-500" />,
    SUBTASK: <Circle className="w-4 h-4 text-zinc-400" />,
}

const priorityConfig: Record<IssuePriority, { icon: React.ReactNode; color: string }> = {
    URGENT: { icon: <Flame className="w-3 h-3" />, color: "bg-red-100 text-red-700" },
    HIGH: { icon: <ArrowUp className="w-3 h-3" />, color: "bg-orange-100 text-orange-700" },
    MEDIUM: { icon: <Minus className="w-3 h-3" />, color: "bg-yellow-100 text-yellow-700" },
    LOW: { icon: <ArrowDown className="w-3 h-3" />, color: "bg-blue-100 text-blue-700" },
}

const statusColors: Record<string, string> = {
    TODO: "bg-zinc-100 text-zinc-600",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    IN_REVIEW: "bg-purple-100 text-purple-700",
    DONE: "bg-green-100 text-green-700",
    BACKLOG: "bg-zinc-50 text-zinc-500",
    BLOCKED: "bg-red-100 text-red-600",
}

interface WorkLogEntry {
    id: string
    userId: string
    userName: string
    hours: number
    description: string
    date: string
}

interface LinkedIssue {
    id: string
    issueId: string
    type: "blocks" | "blocked-by" | "relates-to" | "duplicates"
}

export default function IssueDetailPage() {
    const searchParams = useSearchParams()
    const taskId = searchParams.get("id")

    const { issues, getIssueById, updateIssue, deleteIssue, addIssue, getSubTasks } = useIssueStore()
    const { sprints, epics, getSprintsByProject, getEpicsByProject } = useSprintEpicStore()
    const { comments, addComment, deleteComment, getCommentsByTask } = useCollaborationStore()

    const issue = taskId ? getIssueById(taskId) : undefined
    const subTasks = taskId ? getSubTasks(taskId) : []
    const selectedProjectId = issue?.projectId ?? ""
    const projectSprints = getSprintsByProject(selectedProjectId)
    const projectEpics = getEpicsByProject(selectedProjectId)
    const issueComments = taskId ? getCommentsByTask(taskId) : []

    // Editing states
    const [editingTitle, setEditingTitle] = useState(false)
    const [titleDraft, setTitleDraft] = useState("")
    const [editingDesc, setEditingDesc] = useState(false)
    const [descDraft, setDescDraft] = useState("")
    const [isWatching, setIsWatching] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [activityTab, setActivityTab] = useState("comments")

    // Sub-task input
    const [subTaskTitle, setSubTaskTitle] = useState("")

    // Comment input
    const [commentText, setCommentText] = useState("")

    // Work log state
    const [workLogs, setWorkLogs] = useState<WorkLogEntry[]>([
        { id: "wl1", userId: "u1", userName: "John Doe", hours: 2.5, description: "Initial implementation", date: new Date(Date.now() - 86400000).toISOString() },
        { id: "wl2", userId: "u2", userName: "Jane Smith", hours: 1, description: "Code review", date: new Date().toISOString() },
    ])
    const [workLogDialogOpen, setWorkLogDialogOpen] = useState(false)
    const [newLogHours, setNewLogHours] = useState("")
    const [newLogDesc, setNewLogDesc] = useState("")

    // Linked issues
    const [linkedIssues, setLinkedIssues] = useState<LinkedIssue[]>([])
    const [linkDialogOpen, setLinkDialogOpen] = useState(false)
    const [linkType, setLinkType] = useState<LinkedIssue["type"]>("relates-to")
    const [linkTargetId, setLinkTargetId] = useState("")

    // Detail field editing
    const [editingAssignee, setEditingAssignee] = useState(false)
    const [assigneeDraft, setAssigneeDraft] = useState("")
    const [editingPoints, setEditingPoints] = useState(false)
    const [pointsDraft, setPointsDraft] = useState("")
    const [editingLabels, setEditingLabels] = useState(false)
    const [labelsDraft, setLabelsDraft] = useState("")
    const [editingDueDate, setEditingDueDate] = useState(false)
    const [dueDateDraft, setDueDateDraft] = useState("")
    const [editingStartDate, setEditingStartDate] = useState(false)
    const [startDateDraft, setStartDateDraft] = useState("")

    // Sync drafts when issue changes
    useEffect(() => {
        if (issue) {
            setTitleDraft(issue.title)
            setDescDraft(issue.description)
            setAssigneeDraft(issue.assigneeId)
            setPointsDraft(issue.storyPoints?.toString() || "")
            setLabelsDraft((issue.labels || []).join(", "))
            setDueDateDraft(issue.dueDate ? issue.dueDate.split("T")[0] : "")
            setStartDateDraft(issue.startDate ? issue.startDate.split("T")[0] : "")
        }
    }, [issue?.id])

    if (!taskId) {
        return (
            <div className="flex min-h-screen bg-[#fafafa] items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                    <h2 className="text-sm font-bold text-zinc-900">Select an Issue</h2>
                    <p className="text-xs text-zinc-500 mt-1">Use ?id=ISSUE-01 in the URL to view issue details.</p>
                </div>
            </div>
        )
    }

    if (!issue) {
        return (
            <div className="flex min-h-screen bg-[#fafafa] items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-red-300 mx-auto mb-3" />
                    <h2 className="text-sm font-bold text-zinc-900">Issue Not Found</h2>
                    <p className="text-xs text-zinc-500 mt-1">The issue &quot;{taskId}&quot; could not be found.</p>
                </div>
            </div>
        )
    }

    const handleSaveTitle = () => {
        if (titleDraft.trim() && titleDraft !== issue.title) {
            updateIssue(issue.id, { title: titleDraft.trim() })
            toast.success("Title updated")
        }
        setEditingTitle(false)
    }

    const handleSaveDescription = () => {
        updateIssue(issue.id, { description: descDraft })
        setEditingDesc(false)
        toast.success("Description updated")
    }

    const handleStatusChange = (status: string) => {
        updateIssue(issue.id, { status: status as IssueStatus })
        toast.success(`Status changed to ${status.replace(/_/g, " ")}`)
    }

    const handlePriorityChange = (priority: string) => {
        updateIssue(issue.id, { priority: priority as IssuePriority })
        toast.success(`Priority changed to ${priority}`)
    }

    const handleClone = () => {
        const cloned: Issue = {
            ...issue,
            id: `${issue.id}-CLONE-${Date.now()}`,
            title: `[Clone] ${issue.title}`,
            createdAt: new Date().toISOString(),
            updatedAt: undefined,
            history: [],
        }
        addIssue(cloned)
        toast.success("Issue cloned successfully")
    }

    const handleDelete = () => {
        deleteIssue(issue.id)
        setDeleteDialogOpen(false)
        toast.success("Issue deleted")
    }

    const handleShare = () => {
        const url = `${window.location.origin}${window.location.pathname}?id=${issue.id}`
        navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard")
    }

    const handleAddSubTask = () => {
        if (!subTaskTitle.trim()) return
        const subTask: Issue = {
            id: `${issue.id}-SUB-${Date.now()}`,
            projectId: issue.projectId,
            title: subTaskTitle.trim(),
            description: "",
            status: "TODO",
            priority: "MEDIUM",
            type: "SUBTASK",
            assigneeId: "",
            reporterId: CURRENT_USER.id,
            parentId: issue.id,
            createdAt: new Date().toISOString(),
            columnOrder: 0,
            history: [],
        }
        addIssue(subTask)
        setSubTaskTitle("")
        toast.success("Sub-task created")
    }

    const handleAddComment = () => {
        if (!commentText.trim()) return
        addComment(issue.id, commentText.trim(), CURRENT_USER)
        setCommentText("")
        toast.success("Comment added")
    }

    const handleDeleteComment = (commentId: string) => {
        deleteComment(commentId)
        toast.success("Comment deleted")
    }

    const handleAddWorkLog = () => {
        const hours = parseFloat(newLogHours)
        if (isNaN(hours) || hours <= 0) { toast.error("Enter valid hours"); return }
        setWorkLogs(prev => [...prev, {
            id: `wl-${Date.now()}`,
            userId: CURRENT_USER.id,
            userName: CURRENT_USER.name,
            hours,
            description: newLogDesc,
            date: new Date().toISOString(),
        }])
        setNewLogHours("")
        setNewLogDesc("")
        setWorkLogDialogOpen(false)
        toast.success("Work log added")
    }

    const handleAddLink = () => {
        if (!linkTargetId.trim()) { toast.error("Select a target issue"); return }
        setLinkedIssues(prev => [...prev, {
            id: `link-${Date.now()}`,
            issueId: linkTargetId,
            type: linkType,
        }])
        setLinkTargetId("")
        setLinkDialogOpen(false)
        toast.success("Issue linked")
    }

    const handleSaveAssignee = () => {
        updateIssue(issue.id, { assigneeId: assigneeDraft })
        setEditingAssignee(false)
        toast.success("Assignee updated")
    }

    const handleSavePoints = () => {
        const pts = parseInt(pointsDraft)
        updateIssue(issue.id, { storyPoints: isNaN(pts) ? undefined : pts })
        setEditingPoints(false)
        toast.success("Story points updated")
    }

    const handleSaveLabels = () => {
        const labels = labelsDraft.split(",").map(l => l.trim()).filter(Boolean)
        updateIssue(issue.id, { labels })
        setEditingLabels(false)
        toast.success("Labels updated")
    }

    const handleSaveDueDate = () => {
        updateIssue(issue.id, { dueDate: dueDateDraft ? new Date(dueDateDraft).toISOString() : undefined })
        setEditingDueDate(false)
        toast.success("Due date updated")
    }

    const handleSaveStartDate = () => {
        updateIssue(issue.id, { startDate: startDateDraft ? new Date(startDateDraft).toISOString() : undefined })
        setEditingStartDate(false)
        toast.success("Start date updated")
    }

    const handleSprintChange = (sprintId: string) => {
        updateIssue(issue.id, { sprintId: sprintId === "none" ? null : sprintId })
        toast.success("Sprint updated")
    }

    const handleEpicChange = (epicId: string) => {
        updateIssue(issue.id, { epicId: epicId === "none" ? null : epicId })
        toast.success("Epic updated")
    }

    const totalLogged = workLogs.reduce((sum, wl) => sum + wl.hours, 0)

    return (
        <div className="flex min-h-screen bg-[#fafafa]">
            <div className="flex-1 flex flex-col gap-5 p-6 max-w-screen-xl mx-auto w-full">
                {/* BREADCRUMB */}
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>PROJECTS</span><span>/</span><span>ISSUE DETAIL</span><span>/</span><span className="text-zinc-900 font-semibold">{issue.id}</span>
                </div>

                {/* HEADER */}
                <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-5 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant="outline" className="text-xs px-2 py-0.5 font-mono font-bold">{issue.id}</Badge>
                        {typeIcons[issue.type]}
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{issue.type}</Badge>
                        <div className="flex-1" />
                        <Select value={issue.status} onValueChange={handleStatusChange}>
                            <SelectTrigger className={`h-7 w-32 text-[10px] font-semibold border-none ${statusColors[issue.status] || "bg-zinc-100 text-zinc-500"}`}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ALL_STATUSES.map(s => (
                                    <SelectItem key={s} value={s} className="text-xs">{s.replace(/_/g, " ")}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={issue.priority} onValueChange={handlePriorityChange}>
                            <SelectTrigger className={`h-7 w-28 text-[10px] font-semibold border-none ${priorityConfig[issue.priority].color}`}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ALL_PRIORITIES.map(p => (
                                    <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Title */}
                    {editingTitle ? (
                        <div className="flex items-center gap-2">
                            <Input
                                className="text-lg font-bold text-zinc-900 h-10 flex-1"
                                value={titleDraft}
                                onChange={(e) => setTitleDraft(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") handleSaveTitle(); if (e.key === "Escape") setEditingTitle(false) }}
                                autoFocus
                            />
                            <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleSaveTitle}>
                                <Save className="w-3.5 h-3.5 mr-1" /> Save
                            </Button>
                        </div>
                    ) : (
                        <h1
                            className="text-xl font-bold text-zinc-900 tracking-tight cursor-pointer hover:text-indigo-600 transition-colors"
                            onClick={() => { setTitleDraft(issue.title); setEditingTitle(true) }}
                        >
                            {issue.title}
                        </h1>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button
                            variant={isWatching ? "default" : "outline"}
                            className={`h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 ${isWatching ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""}`}
                            onClick={() => { setIsWatching(!isWatching); toast.success(isWatching ? "Stopped watching" : "Now watching") }}
                        >
                            <Eye className="w-3.5 h-3.5 mr-2" /> {isWatching ? "Watching" : "Watch"}
                        </Button>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95" onClick={handleShare}>
                            <Share2 className="w-3.5 h-3.5 mr-2" /> Share
                        </Button>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95" onClick={handleClone}>
                            <Copy className="w-3.5 h-3.5 mr-2" /> Clone
                        </Button>
                        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 text-red-600 border-red-200 hover:bg-red-50">
                                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-sm">
                                <DialogHeader>
                                    <DialogTitle className="text-sm font-bold text-zinc-900">Delete Issue</DialogTitle>
                                </DialogHeader>
                                <p className="text-xs text-zinc-500">Are you sure you want to delete <span className="font-bold">{issue.id}</span>? This action cannot be undone.</p>
                                <DialogFooter className="gap-2">
                                    <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                                    <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>Delete</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* TWO COLUMN LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
                    {/* LEFT COLUMN */}
                    <div className="space-y-4">
                        {/* Description */}
                        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xs font-bold text-zinc-900">Description</h2>
                                {!editingDesc && (
                                    <Button variant="ghost" className="h-6 text-[10px] px-2 text-zinc-400" onClick={() => { setDescDraft(issue.description); setEditingDesc(true) }}>
                                        <Edit3 className="w-3 h-3 mr-1" /> Edit
                                    </Button>
                                )}
                            </div>
                            {editingDesc ? (
                                <div className="space-y-2">
                                    <textarea
                                        className="w-full h-32 border border-zinc-200 rounded-lg p-3 text-xs text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 resize-none"
                                        value={descDraft}
                                        onChange={(e) => setDescDraft(e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        <Button className="h-7 rounded-md text-[10px] font-medium px-2.5 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleSaveDescription}>
                                            <Save className="w-3 h-3 mr-1" /> Save
                                        </Button>
                                        <Button variant="outline" className="h-7 rounded-md text-[10px] font-medium px-2.5 shadow-sm active:scale-95" onClick={() => setEditingDesc(false)}>Cancel</Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-wrap">{issue.description || "No description provided. Click Edit to add one."}</p>
                            )}
                        </div>

                        {/* Sub-tasks */}
                        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xs font-bold text-zinc-900">Sub-tasks ({subTasks.length})</h2>
                            </div>
                            {subTasks.length > 0 && (
                                <div className="space-y-1">
                                    {subTasks.map(st => (
                                        <div key={st.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-zinc-50 group">
                                            <Circle className="w-3 h-3 text-zinc-400" />
                                            <span className="font-mono text-[10px] text-zinc-400 w-20 shrink-0">{st.id}</span>
                                            <span className="text-xs text-zinc-900 font-medium truncate flex-1">{st.title}</span>
                                            <Badge className={`text-[9px] px-1.5 py-0 border-none ${statusColors[st.status] || "bg-zinc-100 text-zinc-500"}`}>
                                                {st.status.replace(/_/g, " ")}
                                            </Badge>
                                            <Button variant="ghost" className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500" onClick={() => { deleteIssue(st.id); toast.success("Sub-task deleted") }}>
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Add a sub-task..."
                                    className="h-7 text-xs flex-1 border-zinc-200"
                                    value={subTaskTitle}
                                    onChange={(e) => setSubTaskTitle(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") handleAddSubTask() }}
                                />
                                <Button className="h-7 rounded-md text-[10px] font-medium px-2.5 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleAddSubTask}>
                                    <Plus className="w-3 h-3 mr-1" /> Add
                                </Button>
                            </div>
                        </div>

                        {/* Linked Issues */}
                        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xs font-bold text-zinc-900">Linked Issues ({linkedIssues.length})</h2>
                                <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" className="h-6 text-[10px] px-2 text-zinc-400">
                                            <Link2 className="w-3 h-3 mr-1" /> Add Link
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-sm">
                                        <DialogHeader>
                                            <DialogTitle className="text-sm font-bold text-zinc-900">Link Issue</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-3 mt-2">
                                            <div>
                                                <label className="text-xs font-medium text-zinc-500 mb-1 block">Link Type</label>
                                                <Select value={linkType} onValueChange={(val) => setLinkType(val as LinkedIssue["type"])}>
                                                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="relates-to" className="text-xs">Relates to</SelectItem>
                                                        <SelectItem value="blocks" className="text-xs">Blocks</SelectItem>
                                                        <SelectItem value="blocked-by" className="text-xs">Blocked by</SelectItem>
                                                        <SelectItem value="duplicates" className="text-xs">Duplicates</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-zinc-500 mb-1 block">Target Issue</label>
                                                <Select value={linkTargetId} onValueChange={setLinkTargetId}>
                                                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select issue..." /></SelectTrigger>
                                                    <SelectContent>
                                                        {issues.filter(i => i.id !== issue.id && i.projectId === selectedProjectId).map(i => (
                                                            <SelectItem key={i.id} value={i.id} className="text-xs">{i.id} - {i.title}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleAddLink}>
                                                <Link2 className="w-3.5 h-3.5 mr-2" /> Link
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            {linkedIssues.length > 0 ? (
                                <div className="space-y-1">
                                    {linkedIssues.map(link => {
                                        const linked = getIssueById(link.issueId)
                                        return (
                                            <div key={link.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-zinc-50 group">
                                                <Badge variant="outline" className="text-[9px] px-1.5 py-0 shrink-0">{link.type}</Badge>
                                                <span className="font-mono text-[10px] text-zinc-400">{link.issueId}</span>
                                                <span className="text-xs text-zinc-700 truncate flex-1">{linked?.title || "Unknown"}</span>
                                                <Button variant="ghost" className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500" onClick={() => { setLinkedIssues(prev => prev.filter(l => l.id !== link.id)); toast.success("Link removed") }}>
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="text-xs text-zinc-400">No linked issues. Click "Add Link" to create a relationship.</p>
                            )}
                        </div>

                        {/* Activity Tabs */}
                        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-5 space-y-3">
                            <Tabs value={activityTab} onValueChange={setActivityTab}>
                                <TabsList className="bg-zinc-100 rounded-lg p-0.5 h-auto">
                                    <TabsTrigger value="comments" className="text-[10px] font-medium px-3 py-1 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                        <MessageSquare className="w-3 h-3 mr-1" /> Comments ({issueComments.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="history" className="text-[10px] font-medium px-3 py-1 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                        <History className="w-3 h-3 mr-1" /> History
                                    </TabsTrigger>
                                    <TabsTrigger value="worklog" className="text-[10px] font-medium px-3 py-1 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                        <Timer className="w-3 h-3 mr-1" /> Work Log ({totalLogged}h)
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="comments" className="mt-3 space-y-3">
                                    {issueComments.length > 0 ? (
                                        <div className="space-y-3">
                                            {issueComments.map(c => (
                                                <div key={c.id} className="flex gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-zinc-200 shrink-0 overflow-hidden">
                                                        {c.userAvatar && <img src={c.userAvatar} alt="" className="w-full h-full object-cover" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-medium text-zinc-900">{c.userName}</span>
                                                            <span className="text-[10px] text-zinc-400">{new Date(c.createdAt).toLocaleString()}</span>
                                                            <Button variant="ghost" className="h-5 w-5 p-0 ml-auto text-zinc-400 hover:text-red-500" onClick={() => handleDeleteComment(c.id)}>
                                                                <X className="w-2.5 h-2.5" />
                                                            </Button>
                                                        </div>
                                                        <p className="text-xs text-zinc-600 mt-0.5">{c.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-zinc-400 text-center py-3">No comments yet.</p>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Input
                                            placeholder="Add a comment..."
                                            className="h-8 text-xs flex-1 border-zinc-200"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === "Enter") handleAddComment() }}
                                        />
                                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleAddComment}>
                                            <Send className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="history" className="mt-3">
                                    {(issue.history || []).length > 0 ? (
                                        <div className="space-y-2">
                                            {[...(issue.history || [])].reverse().map((entry, i) => (
                                                <div key={i} className="flex items-start gap-2 text-xs">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-1.5 shrink-0" />
                                                    <div>
                                                        <span className="font-medium text-zinc-700">{entry.changedBy || "User"}</span>
                                                        <span className="text-zinc-500"> changed </span>
                                                        <span className="font-medium text-zinc-700">{entry.field}</span>
                                                        <span className="text-zinc-500"> from </span>
                                                        <Badge variant="outline" className="text-[9px] px-1 py-0">{entry.oldValue}</Badge>
                                                        <span className="text-zinc-500"> to </span>
                                                        <Badge variant="outline" className="text-[9px] px-1 py-0">{entry.newValue}</Badge>
                                                        <p className="text-[10px] text-zinc-400 mt-0.5">{new Date(entry.changedAt).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-zinc-400 text-center py-3">No change history recorded.</p>
                                    )}
                                </TabsContent>

                                <TabsContent value="worklog" className="mt-3 space-y-3">
                                    {workLogs.length > 0 ? (
                                        <div className="space-y-2">
                                            {workLogs.map(wl => (
                                                <div key={wl.id} className="flex items-center gap-2 px-2 py-1.5 rounded bg-zinc-50">
                                                    <Clock className="w-3 h-3 text-zinc-400" />
                                                    <span className="text-xs font-medium text-zinc-700">{wl.userName}</span>
                                                    <span className="text-xs text-zinc-500">logged {wl.hours}h</span>
                                                    {wl.description && <span className="text-xs text-zinc-400 truncate">- {wl.description}</span>}
                                                    <span className="text-[10px] text-zinc-400 ml-auto shrink-0">{new Date(wl.date).toLocaleDateString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-zinc-400 text-center py-3">No work logged.</p>
                                    )}
                                    <Dialog open={workLogDialogOpen} onOpenChange={setWorkLogDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="h-7 rounded-md text-[10px] font-medium px-2.5 shadow-sm active:scale-95">
                                                <Plus className="w-3 h-3 mr-1" /> Log Work
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-sm">
                                            <DialogHeader>
                                                <DialogTitle className="text-sm font-bold text-zinc-900">Log Work</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-3 mt-2">
                                                <div>
                                                    <label className="text-xs font-medium text-zinc-500 mb-1 block">Hours</label>
                                                    <Input type="number" step="0.5" min="0.5" className="h-8 text-xs" value={newLogHours} onChange={(e) => setNewLogHours(e.target.value)} placeholder="e.g. 2.5" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-zinc-500 mb-1 block">Description</label>
                                                    <Input className="h-8 text-xs" value={newLogDesc} onChange={(e) => setNewLogDesc(e.target.value)} placeholder="What did you work on?" />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleAddWorkLog}>Save</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-4">
                        {/* Details panel */}
                        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-5 space-y-3">
                            <h2 className="text-xs font-bold text-zinc-900">Details</h2>

                            {/* Assignee */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-medium text-zinc-400 uppercase">Assignee</label>
                                {editingAssignee ? (
                                    <div className="flex gap-1">
                                        <Input className="h-7 text-xs flex-1" value={assigneeDraft} onChange={(e) => setAssigneeDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSaveAssignee() }} autoFocus />
                                        <Button className="h-7 w-7 p-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md" onClick={handleSaveAssignee}><Save className="w-3 h-3" /></Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 cursor-pointer hover:bg-zinc-50 rounded px-1 py-0.5" onClick={() => { setAssigneeDraft(issue.assigneeId); setEditingAssignee(true) }}>
                                        {issue.assignee?.avatar && <img src={issue.assignee.avatar} alt="" className="w-5 h-5 rounded-full" />}
                                        <span className="text-xs text-zinc-700">{issue.assignee?.name || issue.assigneeId || "Unassigned"}</span>
                                    </div>
                                )}
                            </div>

                            {/* Reporter */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-medium text-zinc-400 uppercase">Reporter</label>
                                <span className="text-xs text-zinc-700 block">{issue.reporterId || "Unknown"}</span>
                            </div>

                            {/* Sprint */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-medium text-zinc-400 uppercase">Sprint</label>
                                <Select value={issue.sprintId || "none"} onValueChange={handleSprintChange}>
                                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="None" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none" className="text-xs">None</SelectItem>
                                        {projectSprints.map(s => (
                                            <SelectItem key={s.id} value={s.id} className="text-xs">{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Epic */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-medium text-zinc-400 uppercase">Epic</label>
                                <Select value={issue.epicId || "none"} onValueChange={handleEpicChange}>
                                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="None" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none" className="text-xs">None</SelectItem>
                                        {projectEpics.map(e => (
                                            <SelectItem key={e.id} value={e.id} className="text-xs">{e.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Story Points */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-medium text-zinc-400 uppercase">Story Points</label>
                                {editingPoints ? (
                                    <div className="flex gap-1">
                                        <Input type="number" className="h-7 text-xs flex-1" value={pointsDraft} onChange={(e) => setPointsDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSavePoints() }} autoFocus />
                                        <Button className="h-7 w-7 p-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md" onClick={handleSavePoints}><Save className="w-3 h-3" /></Button>
                                    </div>
                                ) : (
                                    <span className="text-xs text-zinc-700 cursor-pointer hover:text-indigo-600 block px-1 py-0.5" onClick={() => { setPointsDraft(issue.storyPoints?.toString() || ""); setEditingPoints(true) }}>
                                        {issue.storyPoints || "Not estimated"}
                                    </span>
                                )}
                            </div>

                            {/* Start Date */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-medium text-zinc-400 uppercase">Start Date</label>
                                {editingStartDate ? (
                                    <div className="flex gap-1">
                                        <Input type="date" className="h-7 text-xs flex-1" value={startDateDraft} onChange={(e) => setStartDateDraft(e.target.value)} />
                                        <Button className="h-7 w-7 p-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md" onClick={handleSaveStartDate}><Save className="w-3 h-3" /></Button>
                                    </div>
                                ) : (
                                    <span className="text-xs text-zinc-700 cursor-pointer hover:text-indigo-600 block px-1 py-0.5" onClick={() => { setStartDateDraft(issue.startDate ? issue.startDate.split("T")[0] : ""); setEditingStartDate(true) }}>
                                        {issue.startDate ? new Date(issue.startDate).toLocaleDateString() : "Not set"}
                                    </span>
                                )}
                            </div>

                            {/* Due Date */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-medium text-zinc-400 uppercase">Due Date</label>
                                {editingDueDate ? (
                                    <div className="flex gap-1">
                                        <Input type="date" className="h-7 text-xs flex-1" value={dueDateDraft} onChange={(e) => setDueDateDraft(e.target.value)} />
                                        <Button className="h-7 w-7 p-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md" onClick={handleSaveDueDate}><Save className="w-3 h-3" /></Button>
                                    </div>
                                ) : (
                                    <span className="text-xs text-zinc-700 cursor-pointer hover:text-indigo-600 block px-1 py-0.5" onClick={() => { setDueDateDraft(issue.dueDate ? issue.dueDate.split("T")[0] : ""); setEditingDueDate(true) }}>
                                        {issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : "Not set"}
                                    </span>
                                )}
                            </div>

                            {/* Labels */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-medium text-zinc-400 uppercase">Labels</label>
                                {editingLabels ? (
                                    <div className="flex gap-1">
                                        <Input className="h-7 text-xs flex-1" placeholder="label1, label2" value={labelsDraft} onChange={(e) => setLabelsDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSaveLabels() }} autoFocus />
                                        <Button className="h-7 w-7 p-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md" onClick={handleSaveLabels}><Save className="w-3 h-3" /></Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-1 cursor-pointer px-1 py-0.5" onClick={() => { setLabelsDraft((issue.labels || []).join(", ")); setEditingLabels(true) }}>
                                        {(issue.labels || []).length > 0 ? issue.labels!.map(l => (
                                            <Badge key={l} variant="outline" className="text-[9px] px-1.5 py-0">{l}</Badge>
                                        )) : (
                                            <span className="text-xs text-zinc-400">No labels</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Created / Updated */}
                            <div className="space-y-1 pt-2 border-t border-zinc-100">
                                <label className="text-[10px] font-medium text-zinc-400 uppercase">Created</label>
                                <span className="text-xs text-zinc-500 block">{new Date(issue.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-medium text-zinc-400 uppercase">Updated</label>
                                <span className="text-xs text-zinc-500 block">{issue.updatedAt ? new Date(issue.updatedAt).toLocaleString() : "Never"}</span>
                            </div>
                        </div>

                        {/* People section */}
                        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-5 space-y-3">
                            <h2 className="text-xs font-bold text-zinc-900">People</h2>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    {issue.assignee?.avatar ? (
                                        <img src={issue.assignee.avatar} alt="" className="w-7 h-7 rounded-full border border-zinc-200" />
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200" />
                                    )}
                                    <div>
                                        <p className="text-[10px] text-zinc-400">Assignee</p>
                                        <p className="text-xs font-medium text-zinc-700">{issue.assignee?.name || "Unassigned"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                                        <Eye className="w-3 h-3 text-zinc-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-zinc-400">Watchers</p>
                                        <p className="text-xs font-medium text-zinc-700">{isWatching ? 1 : 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
