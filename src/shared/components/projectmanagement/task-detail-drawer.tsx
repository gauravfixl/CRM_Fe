"use client"

import React, { useState } from "react"
import {
    X,
    Edit2,
    Trash2,
    Calendar,
    User,
    Flag,
    Tag,
    Link as LinkIcon,
    Clock,
    CheckCircle2,
    Circle,
    AlertCircle,
    ChevronDown,
    Paperclip,
    Activity,
    Minimize2,
    Maximize2,
    Eye,
    Share2,
    Lock,
    MoreVertical,
    MoreHorizontal,
    ChevronRight,
    PlayCircle,
    Copy,
    Archive,
    Printer,
    FileSpreadsheet,
    FileText,
    FileCode,
    Settings,
    Plus,
    GitBranch,
    Pin,
    Users,
    Zap
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/shared/components/ui/dropdown-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover"
import { Calendar as CalendarComponent } from "@/shared/components/ui/calendar"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/shared/components/ui/command"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useIssueStore, Issue, IssuePriority, IssueStatus } from "@/shared/data/issue-store"
import CommentThread from "./comment-thread"
import DocumentManager from "./document-manager"
import { format, formatDistanceToNow } from "date-fns"
import { useSprintEpicStore } from "@/shared/data/sprint-epic-store"
import { useProjectMemberStore } from "@/shared/data/project-member-store"

interface TaskDetailDrawerProps {
    taskId: string | null
    isOpen: boolean
    onClose: () => void
    projectId?: string
}

export default function TaskDetailDrawer({
    taskId,
    isOpen,
    onClose,
    projectId
}: TaskDetailDrawerProps) {
    const { getIssueById, updateIssue, deleteIssue } = useIssueStore()
    const { getEpicsByProject } = useSprintEpicStore()
    const { getAllProjectMembers } = useProjectMemberStore()

    const [isEditing, setIsEditing] = useState(false)
    const [editedTask, setEditedTask] = useState<Partial<Issue>>({})
    const [drawerWidth, setDrawerWidth] = useState(700)
    const [isResizing, setIsResizing] = useState(false)
    const [isMaximized, setIsMaximized] = useState(false)

    const [isAddingSubtask, setIsAddingSubtask] = useState(false)
    const [subtaskTitle, setSubtaskTitle] = useState("")
    const { addSubTask, getSubTasks, getIssuesByProject } = useIssueStore()

    const task = taskId ? getIssueById(taskId) : null
    const subtasks = task ? getSubTasks(task.id) : []
    const allProjectTasks = projectId ? getIssuesByProject(projectId).filter(t => t.id !== taskId && t.type !== "SUBTASK") : []
    const history = task?.history || []
    const epics = projectId ? getEpicsByProject(projectId) : []
    const members = projectId ? getAllProjectMembers(projectId) : []
    const taskEpic = epics.find(e => e.id === task?.epicId)

    const handleAddSubtask = () => {
        if (!task || !subtaskTitle.trim()) return

        addSubTask(task.id, {
            projectId: task.projectId,
            title: subtaskTitle,
            description: "",
            status: "TODO",
            priority: "MEDIUM",
            assigneeId: "u1", // Default to current user or unassigned
            reporterId: "u1",
            storyPoints: 0,
        })

        setSubtaskTitle("")
        setIsAddingSubtask(false)
    }

    const startResizing = (e: React.MouseEvent) => {
        setIsResizing(true)
        e.preventDefault()
    }

    const stopResizing = () => {
        setIsResizing(false)
    }

    const resize = (e: MouseEvent) => {
        if (isResizing) {
            const newWidth = window.innerWidth - e.clientX
            if (newWidth > 400 && newWidth < window.innerWidth * 0.8) {
                setDrawerWidth(newWidth)
            }
        }
    }

    React.useEffect(() => {
        window.addEventListener('mousemove', resize)
        window.addEventListener('mouseup', stopResizing)
        return () => {
            window.removeEventListener('mousemove', resize)
            window.removeEventListener('mouseup', stopResizing)
        }
    }, [isResizing])

    if (!task) return null

    const handleSave = () => {
        if (taskId) {
            updateIssue(taskId, editedTask)
            setIsEditing(false)
            setEditedTask({})
        }
    }

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this task?")) {
            if (taskId) {
                deleteIssue(taskId)
                onClose()
            }
        }
    }

    const getPriorityColor = (priority: IssuePriority) => {
        const colors = {
            URGENT: "bg-red-100 text-red-700 border-red-200",
            HIGH: "bg-orange-100 text-orange-700 border-orange-200",
            MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
            LOW: "bg-blue-100 text-blue-700 border-blue-200"
        }
        return colors[priority]
    }

    const getStatusIcon = (status: IssueStatus) => {
        if (status === "DONE" || status === "COMPLETED") return <CheckCircle2 size={16} className="text-green-600" />
        if (status === "IN_PROGRESS") return <Circle size={16} className="text-blue-600" />
        return <AlertCircle size={16} className="text-slate-400" />
    }

    const formatTime = (timestamp: string) => {
        try {
            return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
        } catch {
            return "recently"
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose} modal={isMaximized}>
            <SheetContent
                side="right"
                showOverlay={isMaximized}
                className={`p-0 overflow-hidden flex flex-col transition-all duration-300 sm:max-w-none [&>button]:hidden 
                    ${isMaximized
                        ? 'fixed !inset-auto !left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 !m-0 rounded-2xl border bg-white h-[85vh] animate-none shadow-2xl'
                        : 'h-full right-0 border-l border-slate-200 shadow-xl'
                    }`}
                style={{
                    width: isMaximized ? '80vw' : `${drawerWidth}px`,
                    maxWidth: isMaximized ? '80vw' : '90vw',
                    transform: isMaximized ? 'translate(-50%, -50%)' : undefined
                }}
            >
                {/* Resize Handle */}
                {!isMaximized && (
                    <div
                        onMouseDown={startResizing}
                        className={`absolute left-0 top-0 w-1.5 h-full cursor-col-resize hover:bg-indigo-400 group z-50 transition-colors ${isResizing ? 'bg-indigo-600' : ''}`}
                    >
                        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-8 w-1 rounded-full bg-slate-300 opacity-0 group-hover:opacity-100" />
                    </div>
                )}

                {/* Header Area */}
                <div className="flex flex-col border-b border-slate-200 shrink-0">
                    <div className="px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[12px] text-slate-500 font-medium">
                            <span className="hover:text-indigo-600 cursor-pointer flex items-center gap-1">
                                {taskEpic?.name || "Add epic"}
                            </span>
                            <ChevronRight size={14} className="text-slate-300" />
                            <Badge className="bg-indigo-100 text-indigo-700 text-[10px] font-bold border-none h-5">
                                {task.id}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                <Lock size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 bg-blue-50/50 hover:bg-blue-50 border border-blue-100">
                                <Eye size={16} />
                                <span className="ml-1 text-[10px] font-bold">1</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                <Share2 size={16} />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                        <MoreHorizontal size={18} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 font-outfit">
                                    <DropdownMenuItem className="gap-2 py-2">
                                        <PlayCircle size={14} /> Log work
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-2 py-2">
                                        <Flag size={14} /> Add flag
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-2 py-2">
                                        <Activity size={14} /> Add vote
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="gap-2 py-2">
                                        <LinkIcon size={14} /> Copy link
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-2 py-2">
                                        <Copy size={14} /> Clone
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-2 py-2">
                                        <Archive size={14} /> Archive
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleDelete} className="gap-2 py-2 text-rose-600 focus:text-rose-600">
                                        <Trash2 size={14} /> Delete
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="gap-2 py-2">
                                        <Printer size={14} /> Print
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-2 py-2">
                                        <FileSpreadsheet size={14} /> Export Excel
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-2 py-2">
                                        <FileText size={14} /> Export Word
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-2 py-2">
                                        <FileCode size={14} /> Export XML
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <div className="h-4 w-[1px] bg-slate-200 mx-1" />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-slate-900"
                                onClick={() => setIsMaximized(!isMaximized)}
                            >
                                {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900" onClick={onClose}>
                                <X size={20} />
                            </Button>
                        </div>
                    </div>

                    <div className="px-6 py-4 flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-indigo-100 text-indigo-700 text-[10px] font-bold border-none">
                                    {task.id}
                                </Badge>
                                <Badge className={`text-[9px] font-bold border ${getPriorityColor(task.priority)}`}>
                                    <Flag size={10} className="mr-1" />
                                    {task.priority}
                                </Badge>
                                <Badge className="bg-slate-100 text-slate-600 text-[9px] font-bold border-none">
                                    {task.type}
                                </Badge>
                            </div>
                            {isEditing ? (
                                <Input
                                    value={editedTask.title || task.title}
                                    onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                                    className="text-[16px] font-bold border-indigo-200 focus:border-indigo-600"
                                />
                            ) : (
                                <SheetTitle className="text-[18px] font-bold text-slate-900 leading-tight">
                                    {task.title}
                                </SheetTitle>
                            )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            {isEditing ? (
                                <>
                                    <Button
                                        size="sm"
                                        onClick={handleSave}
                                        className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-semibold"
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                            setIsEditing(false)
                                            setEditedTask({})
                                        }}
                                        className="h-8 px-3 rounded-lg text-[11px] font-semibold"
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setIsEditing(true)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Edit2 size={14} />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={handleDelete}
                                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Body Content */}
                <div className={`flex-1 overflow-hidden flex ${isMaximized ? 'flex-row' : 'flex-col overflow-y-auto custom-scrollbar'}`}>
                    {/* Primary Content (Left side or Main) */}
                    <div className={`flex-1 overflow-y-auto custom-scrollbar ${isMaximized ? 'p-8 border-r border-slate-100' : 'p-6 space-y-6'}`}>
                        {/* Title Section (only for maximized) */}
                        {isMaximized && (
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{task.title}</h2>
                            </div>
                        )}

                        {/* Quick Actions Row (Status + Automation) - side-panel mode */}
                        {!isMaximized && (
                            <div className="flex items-center gap-3 mb-6">
                                <Select
                                    value={editedTask.status || task.status}
                                    onValueChange={(v) => {
                                        setEditedTask(prev => ({ ...prev, status: v as IssueStatus }))
                                        setIsEditing(true)
                                    }}
                                >
                                    <SelectTrigger className="h-9 gap-2 border-none bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold focus:ring-0 rounded px-3 transition-colors text-[13px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="font-outfit">
                                        <SelectItem value="TODO">To Do</SelectItem>
                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="IN_REVIEW">In Review</SelectItem>
                                        <SelectItem value="DONE">Done</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded hover:bg-slate-100 text-slate-500 border border-slate-200">
                                    <Zap size={16} />
                                </Button>
                            </div>
                        )}

                        {/* Description Section */}
                        <div className="space-y-3 mb-8">
                            <Label className="text-[14px] font-bold text-slate-800">Description</Label>
                            {isEditing ? (
                                <Textarea
                                    value={editedTask.description || task.description || ""}
                                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                                    className="min-h-[120px] text-[14px] font-medium resize-none focus-visible:ring-indigo-600 border-slate-200"
                                    placeholder="Add a description..."
                                />
                            ) : (
                                <div className="group relative">
                                    <p className="text-[14px] text-slate-700 font-medium leading-relaxed whitespace-pre-wrap p-3 rounded hover:bg-slate-50 transition-colors cursor-text border border-transparent hover:border-slate-200" onClick={() => setIsEditing(true)}>
                                        {task.description || "Add a description..."}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Subtasks Section (Both views) */}
                        <div className="space-y-3 mb-8">
                            <div className="flex items-center justify-between">
                                <Label className="text-[14px] font-bold text-slate-800">Subtasks</Label>
                                {!isAddingSubtask && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsAddingSubtask(true)}
                                        className="h-8 text-indigo-600 hover:text-indigo-700 font-bold p-0 flex items-center gap-2 hover:bg-transparent"
                                    >
                                        <Plus size={14} /> Add subtask
                                    </Button>
                                )}
                            </div>
                            <div className="space-y-2 mb-2">
                                {subtasks.map(st => (
                                    <div key={st.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 border border-slate-100 group transition-all shadow-sm bg-white">
                                        <div
                                            className={`h-5 w-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${st.status === "DONE" ? "bg-green-600 border-green-600" : "bg-white border-slate-300"}`}
                                            onClick={() => updateIssue(st.id, { status: st.status === "DONE" ? "TODO" : "DONE" })}
                                        >
                                            {st.status === "DONE" && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                        <span className={`text-[13px] font-medium flex-1 ${st.status === "DONE" ? "text-slate-400 line-through" : "text-slate-700"}`}>{st.title}</span>
                                        <Badge variant="outline" className={`text-[10px] border-none px-1.5 h-6 font-bold ${st.status === "DONE" ? "bg-green-100 text-green-700" :
                                            st.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                                                "bg-slate-100 text-slate-500"
                                            }`}>{st.status.replace('_', ' ')}</Badge>
                                    </div>
                                ))}
                            </div>
                            {isAddingSubtask && (
                                <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-inner">
                                    <Input
                                        autoFocus
                                        placeholder="What needs to be done?"
                                        value={subtaskTitle}
                                        onChange={(e) => setSubtaskTitle(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
                                        className="h-10 text-[14px] bg-white border-slate-200 focus-visible:ring-indigo-600"
                                    />
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={handleAddSubtask} className="h-9 bg-indigo-600 hover:bg-indigo-700 font-bold px-4">Create</Button>
                                        <Button size="sm" variant="ghost" onClick={() => setIsAddingSubtask(false)} className="h-9 text-slate-500 font-bold hover:bg-slate-200 px-4">Cancel</Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Linked Items Section */}
                        {!isMaximized && (
                            <div className="space-y-3 mb-8">
                                <Label className="text-[14px] font-bold text-slate-800 block">Linked work items</Label>
                                <Button variant="ghost" size="sm" className="h-8 text-indigo-600 hover:text-indigo-700 font-bold p-0 flex items-center gap-2">
                                    <Plus size={14} /> Add linked work item
                                </Button>
                            </div>
                        )}

                        {/* Details Section (side-panel accordion mode) */}
                        {!isMaximized && (
                            <div className="border border-slate-200 rounded-xl overflow-hidden mb-6 bg-white shadow-sm">
                                <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                                        <ChevronDown size={14} /> Details
                                    </span>
                                    <Settings size={14} className="text-slate-400" />
                                </div>
                                <div className="p-4 space-y-5">
                                    {/* Assignee Row */}
                                    <div className="space-y-1.5 flex flex-col">
                                        <Label className="text-[13px] font-semibold text-slate-500">Assignee</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <div className="flex items-center gap-3 p-1 rounded hover:bg-slate-50 cursor-pointer transition-colors group">
                                                    <Avatar className="h-8 w-8 border-none ring-2 ring-white shadow-sm">
                                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${task.assigneeId}`} />
                                                        <AvatarFallback className="text-[10px] font-bold bg-indigo-100 text-indigo-700">U</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="text-[13px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                                            {members.find(m => m.userId === task.assigneeId)?.userName || "Unassigned"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0 w-[240px]" align="start">
                                                <Command>
                                                    <CommandInput placeholder="Search members..." />
                                                    <CommandList>
                                                        <CommandEmpty>No member found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {members.map((member) => (
                                                                <CommandItem
                                                                    key={member.userId}
                                                                    onSelect={() => {
                                                                        setEditedTask(prev => ({ ...prev, assigneeId: member.userId }))
                                                                        setIsEditing(true)
                                                                    }}
                                                                    className="flex items-center gap-2 cursor-pointer"
                                                                >
                                                                    <Avatar className="h-6 w-6">
                                                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${member.userId}`} />
                                                                        <AvatarFallback>{member.userName[0]}</AvatarFallback>
                                                                    </Avatar>
                                                                    <span className="text-sm">{member.userName}</span>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <button
                                            className="text-[11px] text-indigo-600 font-semibold hover:underline w-fit ml-11"
                                            onClick={() => {
                                                setEditedTask(prev => ({ ...prev, assigneeId: "u1" }))
                                                setIsEditing(true)
                                            }}
                                        >
                                            Assign to me
                                        </button>
                                    </div>

                                    {/* Reporter Row */}
                                    <div className="space-y-1.5 flex flex-col border-t border-slate-100 pt-3">
                                        <Label className="text-[13px] font-semibold text-slate-500">Reporter</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <div className="flex items-center gap-2 p-1 rounded hover:bg-slate-50 cursor-pointer transition-colors group w-fit">
                                                    <div className="h-6 w-6 rounded-full bg-cyan-500 flex items-center justify-center text-[9px] font-bold text-white uppercase">
                                                        {(editedTask.reporterId || task.reporterId) ? (editedTask.reporterId || task.reporterId)[0] : 'U'}
                                                    </div>
                                                    <span className="text-[12px] font-medium text-slate-700">
                                                        {members.find(m => m.userId === (editedTask.reporterId || task.reporterId))?.userName || "gaurav garg"}
                                                    </span>
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0 w-[240px]" align="start">
                                                <Command>
                                                    <CommandInput placeholder="Search members..." />
                                                    <CommandList>
                                                        <CommandEmpty>No member found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {members.map((member) => (
                                                                <CommandItem
                                                                    key={member.userId}
                                                                    onSelect={() => {
                                                                        setEditedTask(prev => ({ ...prev, reporterId: member.userId }))
                                                                        setIsEditing(true)
                                                                    }}
                                                                    className="flex items-center gap-2 cursor-pointer"
                                                                >
                                                                    <Avatar className="h-5 w-5">
                                                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${member.userId}`} />
                                                                        <AvatarFallback>{member.userName[0]}</AvatarFallback>
                                                                    </Avatar>
                                                                    <span className="text-xs">{member.userName}</span>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Priority Row */}
                                    <div className="space-y-1.5 flex flex-col">
                                        <Label className="text-[13px] font-semibold text-slate-500">Priority</Label>
                                        <Select
                                            value={editedTask.priority || task.priority}
                                            onValueChange={(v) => {
                                                setEditedTask(prev => ({ ...prev, priority: v as IssuePriority }))
                                                setIsEditing(true)
                                            }}
                                        >
                                            <SelectTrigger className="h-8 border-none bg-transparent hover:bg-slate-50 text-[13px] font-medium text-slate-700 p-0 focus:ring-0">
                                                <div className="flex items-center gap-2">
                                                    <Flag size={14} className={getPriorityColor(editedTask.priority || task.priority).split(' ')[0].replace('text-', '')} />
                                                    <SelectValue />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent className="font-outfit">
                                                <SelectItem value="LOW">Low</SelectItem>
                                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                                <SelectItem value="HIGH">High</SelectItem>
                                                <SelectItem value="URGENT">Urgent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Parent Row */}
                                    <div className="space-y-1.5 flex flex-col">
                                        <Label className="text-[13px] font-semibold text-slate-500">Parent</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <div className="text-[13px] text-slate-400 font-medium hover:bg-slate-50 p-1 rounded cursor-pointer transition-colors w-fit">
                                                    {(editedTask.parentId !== undefined ? editedTask.parentId : task.parentId) || "None"}
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0 w-[300px]" align="start">
                                                <Command>
                                                    <CommandInput placeholder="Search tasks..." />
                                                    <CommandList>
                                                        <CommandEmpty>No tasks found.</CommandEmpty>
                                                        <CommandGroup>
                                                            <CommandItem
                                                                onSelect={() => {
                                                                    setEditedTask(prev => ({ ...prev, parentId: null }))
                                                                    setIsEditing(true)
                                                                }}
                                                                className="cursor-pointer"
                                                            >
                                                                <span className="text-slate-500 italic">None</span>
                                                            </CommandItem>
                                                            {allProjectTasks.map((t) => (
                                                                <CommandItem
                                                                    key={t.id}
                                                                    onSelect={() => {
                                                                        setEditedTask(prev => ({ ...prev, parentId: t.id }))
                                                                        setIsEditing(true)
                                                                    }}
                                                                    className="flex flex-col items-start gap-1 cursor-pointer"
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <Badge className="bg-indigo-100 text-indigo-700 text-[10px] h-4">{t.id}</Badge>
                                                                        <span className="font-bold text-sm truncate max-w-[200px]">{t.title}</span>
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Due Date Row */}
                                    <div className="space-y-1.5 flex flex-col">
                                        <Label className="text-[13px] font-semibold text-slate-500">Due date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <div className={`flex items-center gap-1.5 font-bold text-[11px] px-2 py-1.5 rounded border cursor-pointer transition-colors w-fit ${(editedTask.dueDate || task.dueDate) ? 'text-rose-600 bg-rose-50 border-rose-100 hover:bg-rose-100' : 'text-slate-400 bg-transparent border-transparent hover:bg-slate-50'}`}>
                                                    <Calendar size={12} />
                                                    {(editedTask.dueDate || task.dueDate) ? format(new Date(editedTask.dueDate || task.dueDate as string), 'MMM d, yyyy') : 'No date'}
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <CalendarComponent
                                                    mode="single"
                                                    selected={(editedTask.dueDate || task.dueDate) ? new Date(editedTask.dueDate || task.dueDate as string) : undefined}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            setEditedTask(prev => ({ ...prev, dueDate: date.toISOString() }))
                                                            setIsEditing(true)
                                                        }
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Labels Row */}
                                    <div className="space-y-1.5 flex flex-col">
                                        <Label className="text-[13px] font-semibold text-slate-500">Labels</Label>
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap gap-1 min-h-[30px] hover:bg-slate-50 p-1 rounded cursor-pointer transition-colors border border-transparent hover:border-slate-200">
                                                {((editedTask.labels || task.labels) && (editedTask.labels || task.labels)!.length > 0) ? (
                                                    (editedTask.labels || task.labels)!.map(label => (
                                                        <Badge key={label} variant="outline" className="text-[10px] bg-slate-100 text-slate-700 border-slate-200 flex items-center gap-1 group/badge">
                                                            {label}
                                                            <X
                                                                size={10}
                                                                className="cursor-pointer opacity-0 group-hover/badge:opacity-100 transition-opacity"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const currentLabels = editedTask.labels || task.labels || [];
                                                                    const newLabels = currentLabels.filter(l => l !== label);
                                                                    setEditedTask(prev => ({ ...prev, labels: newLabels }));
                                                                    setIsEditing(true);
                                                                }}
                                                            />
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-[13px] text-slate-400 font-medium italic">None</span>
                                                )}
                                            </div>
                                            <Input
                                                className="h-8 text-[12px]"
                                                placeholder="Add label..."
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        const target = e.target as HTMLInputElement;
                                                        const val = target.value.trim();
                                                        if (val) {
                                                            const currentLabels = editedTask.labels || task.labels || [];
                                                            const newLabels = Array.from(new Set([...currentLabels, val]));
                                                            setEditedTask(prev => ({ ...prev, labels: newLabels }));
                                                            setIsEditing(true);
                                                            target.value = "";
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Team Row */}
                                    <div className="space-y-1.5 flex flex-col">
                                        <Label className="text-[13px] font-semibold text-slate-500 flex items-center gap-1.5">
                                            Team <Pin size={12} className="text-slate-300" />
                                        </Label>
                                        <Select
                                            value={editedTask.teamId || task.teamId || "none"}
                                            onValueChange={(v) => {
                                                setEditedTask(prev => ({ ...prev, teamId: v === "none" ? undefined : v }))
                                                setIsEditing(true)
                                            }}
                                        >
                                            <SelectTrigger className="h-8 border-none bg-transparent hover:bg-slate-50 text-[13px] font-medium text-slate-700 p-0 focus:ring-0 gap-2">
                                                <SelectValue placeholder="None" />
                                            </SelectTrigger>
                                            <SelectContent className="font-outfit">
                                                <SelectItem value="none">None</SelectItem>
                                                <SelectItem value="frontend">Frontend Team</SelectItem>
                                                <SelectItem value="backend">Backend Team</SelectItem>
                                                <SelectItem value="design">Design Team</SelectItem>
                                                <SelectItem value="qa">QA Team</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Start Date Row */}
                                    <div className="space-y-1.5 flex flex-col">
                                        <Label className="text-[13px] font-semibold text-slate-500">Start date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <div className={`flex items-center gap-1.5 font-bold text-[11px] px-2 py-1.5 rounded border cursor-pointer transition-colors w-fit ${(editedTask.startDate || task.startDate) ? 'text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100' : 'text-slate-400 bg-transparent border-transparent hover:bg-slate-50'}`}>
                                                    <Calendar size={12} />
                                                    {(editedTask.startDate || task.startDate) ? format(new Date(editedTask.startDate || task.startDate as string), 'MMM d, yyyy') : 'No date'}
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <CalendarComponent
                                                    mode="single"
                                                    selected={(editedTask.startDate || task.startDate) ? new Date(editedTask.startDate || task.startDate as string) : undefined}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            setEditedTask(prev => ({ ...prev, startDate: date.toISOString() }))
                                                            setIsEditing(true)
                                                        } else {
                                                            setEditedTask(prev => ({ ...prev, startDate: null as any }))
                                                            setIsEditing(true)
                                                        }
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>



                                    {/* Development Row */}
                                    <div className="space-y-1.5 flex flex-col border-t border-slate-100 pt-3">
                                        <Label className="text-[13px] font-semibold text-slate-500 mb-1">Development</Label>
                                        <div className="space-y-1">
                                            <button className="flex items-center gap-2 text-[12px] text-indigo-600 font-bold hover:bg-indigo-50 px-2 py-1.5 rounded transition-colors w-full text-left">
                                                <GitBranch size={13} /> Create branch
                                            </button>
                                            <button className="flex items-center gap-2 text-[12px] text-indigo-600 font-bold hover:bg-indigo-50 px-2 py-1.5 rounded transition-colors w-full text-left">
                                                <Activity size={13} /> Create commit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Attachments Section */}
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-between">
                                <Label className="text-[14px] font-bold text-slate-800">Attachments</Label>
                                <Button variant="ghost" size="sm" className="h-8 text-indigo-600 hover:text-indigo-700 font-bold">Manage</Button>
                            </div>
                            <DocumentManager
                                taskId={task.id}
                                projectId={projectId}
                                organizationId="org-1"
                                level="task"
                            />
                        </div>

                        {/* Activity Tabs */}
                        <div className="mt-10">
                            <Tabs defaultValue="comments" className="w-full">
                                <div className="flex items-center justify-between border-b border-slate-100 mb-6 sticky top-0 bg-white z-10">
                                    <TabsList className="bg-transparent p-0 gap-6">
                                        <TabsTrigger value="comments" className="px-0 py-2 text-[13px] font-bold rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 transition-all">
                                            Comments
                                        </TabsTrigger>
                                        <TabsTrigger value="history" className="px-0 py-2 text-[13px] font-bold rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 transition-all">
                                            History
                                        </TabsTrigger>
                                        <TabsTrigger value="worklog" className="px-0 py-2 text-[13px] font-bold rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 transition-all">
                                            Work log
                                        </TabsTrigger>
                                    </TabsList>
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                                        SHOW:
                                        <Button variant="ghost" size="sm" className="h-6 text-[11px] font-bold px-1.5 uppercase tracking-wider text-slate-500 hover:bg-slate-100">All</Button>
                                    </div>
                                </div>

                                <TabsContent value="comments" className="mt-0 focus-visible:ring-0">
                                    <CommentThread
                                        taskId={task.id}
                                        projectId={projectId}
                                        currentUserId="u1"
                                        currentUserName="Current User"
                                        currentUserAvatar="https://i.pravatar.cc/150?u=current"
                                    />
                                </TabsContent>

                                <TabsContent value="history" className="mt-0 focus-visible:ring-0">
                                    <div className="space-y-4">
                                        {history.length === 0 ? (
                                            <div className="text-center py-12">
                                                <Activity size={32} className="mx-auto text-slate-300 mb-4" />
                                                <p className="text-[14px] font-semibold text-slate-500">No history found</p>
                                            </div>
                                        ) : (
                                            history.map((entry, index) => (
                                                <div key={index} className="flex gap-4">
                                                    <div className="shrink-0 mt-1">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${entry.changedBy}`} />
                                                            <AvatarFallback>{entry.changedBy[0]}</AvatarFallback>
                                                        </Avatar>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[13px] text-slate-800">
                                                            <span className="font-bold">{entry.changedBy}</span>
                                                            <span className="mx-1 text-slate-500">updated the</span>
                                                            <span className="font-bold">{entry.field}</span>
                                                        </p>
                                                        <div className="flex items-center gap-3 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 w-fit">
                                                            <span className="text-[11px] text-slate-500 line-through decoration-slate-300">{entry.oldValue || "None"}</span>
                                                            <ChevronRight size={12} className="text-slate-300" />
                                                            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{entry.newValue}</span>
                                                        </div>
                                                        <p className="text-[11px] text-slate-400 mt-2">
                                                            {formatTime(entry.changedAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                    {/* Right Sidebar (Details Pane - maximized view) */}
                    {isMaximized && (
                        <div className="w-[40%] overflow-y-auto bg-white p-6 custom-scrollbar shrink-0 border-l border-slate-100">
                            {/* Jira-Style Status Dropdown */}
                            <div className="mb-6">
                                <Select
                                    value={editedTask.status || task.status}
                                    onValueChange={(v) => {
                                        setEditedTask(prev => ({ ...prev, status: v as IssueStatus }))
                                        setIsEditing(true)
                                    }}
                                >
                                    <SelectTrigger className="w-fit h-9 gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold focus:ring-1 focus:ring-indigo-500 rounded-md transition-colors px-3 shadow-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="font-outfit">
                                        <SelectItem value="TODO">To Do</SelectItem>
                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="IN_REVIEW">In Review</SelectItem>
                                        <SelectItem value="DONE">Done</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Details Accordion-style Group */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between mb-4 group cursor-pointer" onClick={() => { }}>
                                    <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
                                        <ChevronDown size={16} className="text-slate-400" /> Details
                                    </h3>
                                    <Settings size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <div className="space-y-4 px-2">
                                    {/* Assignee Row */}
                                    <div className="grid grid-cols-[110px_1fr] items-start gap-4">
                                        <span className="text-[13px] font-semibold text-slate-500 py-1">Assignee</span>
                                        <div className="space-y-1">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <div className="flex items-center gap-3 p-1.5 rounded hover:bg-slate-100 cursor-pointer transition-colors group border border-transparent hover:border-slate-200">
                                                        <Avatar className="h-7 w-7 border-none shadow-sm">
                                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${task.assigneeId}`} />
                                                            <AvatarFallback className="text-[10px] font-bold bg-indigo-100 text-indigo-700">
                                                                <User size={14} />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-[13px] font-bold text-slate-700 group-hover:text-indigo-600">
                                                            {members.find(m => m.userId === task.assigneeId)?.userName || "Unassigned"}
                                                        </span>
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent className="p-0 w-[240px]" align="start">
                                                    <Command>
                                                        <CommandInput placeholder="Search members..." />
                                                        <CommandList>
                                                            <CommandEmpty>No member found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {members.map((member) => (
                                                                    <CommandItem
                                                                        key={member.userId}
                                                                        onSelect={() => {
                                                                            setEditedTask(prev => ({ ...prev, assigneeId: member.userId }))
                                                                            setIsEditing(true)
                                                                        }}
                                                                        className="flex items-center gap-2 cursor-pointer"
                                                                    >
                                                                        <Avatar className="h-6 w-6">
                                                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${member.userId}`} />
                                                                            <AvatarFallback>{member.userName[0]}</AvatarFallback>
                                                                        </Avatar>
                                                                        <span className="text-sm">{member.userName}</span>
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <button
                                                className="text-[11px] text-indigo-600 font-bold hover:underline ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => {
                                                    setEditedTask(prev => ({ ...prev, assigneeId: "u1" }))
                                                    setIsEditing(true)
                                                }}
                                            >
                                                Assign to me
                                            </button>
                                        </div>
                                    </div>

                                    {/* Reporter Row */}
                                    <div className="grid grid-cols-[110px_1fr] items-center gap-4">
                                        <span className="text-[13px] font-semibold text-slate-500">Reporter</span>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <div className="flex items-center gap-3 p-1.5 rounded hover:bg-slate-50 cursor-pointer transition-colors group w-fit text-left">
                                                    <div className="h-7 w-7 rounded-full bg-cyan-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-2 ring-cyan-100 uppercase">
                                                        {(editedTask.reporterId || task.reporterId) ? (editedTask.reporterId || task.reporterId)[0] : 'U'}
                                                    </div>
                                                    <span className="text-[13px] font-medium text-slate-700">
                                                        {members.find(m => m.userId === (editedTask.reporterId || task.reporterId))?.userName || "gaurav garg"}
                                                    </span>
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0 w-[240px]" align="start">
                                                <Command>
                                                    <CommandInput placeholder="Search members..." />
                                                    <CommandList>
                                                        <CommandEmpty>No member found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {members.map((member) => (
                                                                <CommandItem
                                                                    key={member.userId}
                                                                    onSelect={() => {
                                                                        setEditedTask(prev => ({ ...prev, reporterId: member.userId }))
                                                                        setIsEditing(true)
                                                                    }}
                                                                    className="flex items-center gap-2 cursor-pointer"
                                                                >
                                                                    <Avatar className="h-6 w-6">
                                                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${member.userId}`} />
                                                                        <AvatarFallback>{member.userName[0]}</AvatarFallback>
                                                                    </Avatar>
                                                                    <span className="text-sm">{member.userName}</span>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Priority Row */}
                                    <div className="grid grid-cols-[110px_1fr] items-center gap-4">
                                        <span className="text-[13px] font-semibold text-slate-500">Priority</span>
                                        <Select
                                            value={editedTask.priority || task.priority}
                                            onValueChange={(v) => {
                                                setEditedTask(prev => ({ ...prev, priority: v as IssuePriority }))
                                                setIsEditing(true)
                                            }}
                                        >
                                            <SelectTrigger className="h-9 border border-slate-200 hover:border-indigo-400 bg-white hover:bg-slate-50 text-[13px] font-bold text-slate-700 p-2 focus:ring-1 focus:ring-indigo-500 transition-all">
                                                <div className="flex items-center gap-2">
                                                    <Flag size={14} className={getPriorityColor(editedTask.priority || task.priority).split(' ')[0].replace('text-', '')} />
                                                    <SelectValue />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent className="font-outfit">
                                                <SelectItem value="LOW">Low</SelectItem>
                                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                                <SelectItem value="HIGH">High</SelectItem>
                                                <SelectItem value="URGENT">Urgent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Parent Row */}
                                    <div className="grid grid-cols-[110px_1fr] items-center gap-4">
                                        <span className="text-[13px] font-semibold text-slate-500">Parent</span>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <div className={`text-[13px] font-bold px-3 py-2 rounded border border-slate-200 hover:border-indigo-400 hover:bg-slate-50 transition-all cursor-pointer w-full flex items-center justify-between ${(editedTask.parentId !== undefined ? editedTask.parentId : task.parentId) ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-400'}`}>
                                                    {(editedTask.parentId !== undefined ? editedTask.parentId : task.parentId) ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-4 w-4 bg-indigo-600 rounded-sm flex items-center justify-center">
                                                                <CheckCircle2 size={10} className="text-white" />
                                                            </div>
                                                            <span>{editedTask.parentId || task.parentId}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="font-medium">Select parent</span>
                                                    )}
                                                    <ChevronDown size={14} className="text-slate-400" />
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0 w-[300px]" align="start">
                                                <Command>
                                                    <CommandInput placeholder="Search tasks..." />
                                                    <CommandList>
                                                        <CommandEmpty>No tasks found.</CommandEmpty>
                                                        <CommandGroup>
                                                            <CommandItem
                                                                onSelect={() => {
                                                                    setEditedTask(prev => ({ ...prev, parentId: null }))
                                                                    setIsEditing(true)
                                                                }}
                                                                className="cursor-pointer"
                                                            >
                                                                <span className="text-slate-500 italic">None</span>
                                                            </CommandItem>
                                                            {allProjectTasks.map((t) => (
                                                                <CommandItem
                                                                    key={t.id}
                                                                    onSelect={() => {
                                                                        setEditedTask(prev => ({ ...prev, parentId: t.id }))
                                                                        setIsEditing(true)
                                                                    }}
                                                                    className="flex flex-col items-start gap-1 cursor-pointer"
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <Badge className="bg-indigo-100 text-indigo-700 text-[10px] h-4">{t.id}</Badge>
                                                                        <span className="font-bold text-sm truncate max-w-[200px]">{t.title}</span>
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Due Date Row */}
                                    <div className="grid grid-cols-[110px_1fr] items-center gap-4">
                                        <span className="text-[13px] font-semibold text-slate-500">Due date</span>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <div className="relative cursor-pointer group w-full">
                                                    <Input
                                                        readOnly
                                                        value={(editedTask.dueDate || task.dueDate) ? format(new Date(editedTask.dueDate || task.dueDate as string), 'MM/dd/yyyy') : ''}
                                                        placeholder="None"
                                                        className={`h-9 pr-10 text-[13px] font-bold cursor-pointer transition-all border-slate-200 hover:border-indigo-400 focus:ring-1 focus:ring-indigo-500 ${(editedTask.dueDate || task.dueDate) ? 'text-rose-600 bg-rose-50/30' : 'text-slate-400'}`}
                                                    />
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500">
                                                        <Calendar size={16} />
                                                    </div>
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <CalendarComponent
                                                    mode="single"
                                                    selected={(editedTask.dueDate || task.dueDate) ? new Date(editedTask.dueDate || task.dueDate as string) : undefined}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            setEditedTask(prev => ({ ...prev, dueDate: date.toISOString() }))
                                                            setIsEditing(true)
                                                        }
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Labels Row */}
                                    <div className="grid grid-cols-[110px_1fr] items-start gap-4">
                                        <span className="text-[13px] font-semibold text-slate-500 py-1">Labels</span>
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap gap-1 min-h-[32px] hover:bg-slate-50 p-1.5 rounded cursor-pointer transition-colors border border-transparent hover:border-slate-200">
                                                {(editedTask.labels || task.labels) && (editedTask.labels || task.labels)!.length > 0 ? (
                                                    (editedTask.labels || task.labels)!.map(label => (
                                                        <Badge key={label} variant="outline" className="text-[10px] bg-slate-100 text-slate-700 border-slate-200 flex items-center gap-1 group/badge">
                                                            {label}
                                                            <X
                                                                size={10}
                                                                className="cursor-pointer opacity-0 group-hover/badge:opacity-100 transition-opacity"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const currentLabels = editedTask.labels || task.labels || [];
                                                                    const newLabels = currentLabels.filter(l => l !== label);
                                                                    setEditedTask(prev => ({ ...prev, labels: newLabels }));
                                                                    setIsEditing(true);
                                                                }}
                                                            />
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-[13px] text-slate-400 font-medium italic">None</span>
                                                )}
                                            </div>
                                            <Input
                                                className="h-8 text-[12px]"
                                                placeholder="Add label..."
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        const target = e.target as HTMLInputElement;
                                                        const val = target.value.trim();
                                                        if (val) {
                                                            const currentLabels = editedTask.labels || task.labels || [];
                                                            const newLabels = Array.from(new Set([...currentLabels, val]));
                                                            setEditedTask(prev => ({ ...prev, labels: newLabels }));
                                                            setIsEditing(true);
                                                            target.value = "";
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Team Row */}
                                    <div className="grid grid-cols-[110px_1fr] items-center gap-4">
                                        <span className="text-[13px] font-semibold text-slate-500 flex items-center gap-1.5">
                                            Team <Pin size={12} className="text-slate-300" />
                                        </span>
                                        <Select
                                            value={editedTask.teamId || task.teamId || "none"}
                                            onValueChange={(v) => {
                                                setEditedTask(prev => ({ ...prev, teamId: v === "none" ? undefined : v }))
                                                setIsEditing(true)
                                            }}
                                        >
                                            <SelectTrigger className="h-9 border border-slate-200 hover:border-indigo-400 bg-white hover:bg-slate-50 text-[13px] font-bold text-slate-700 p-2 focus:ring-1 focus:ring-indigo-500 w-full transition-all gap-2 justify-between">
                                                <SelectValue placeholder="None" />
                                            </SelectTrigger>
                                            <SelectContent className="font-outfit">
                                                <SelectItem value="none">None</SelectItem>
                                                <SelectItem value="frontend">Frontend Team</SelectItem>
                                                <SelectItem value="backend">Backend Team</SelectItem>
                                                <SelectItem value="design">Design Team</SelectItem>
                                                <SelectItem value="qa">QA Team</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Start Date Row */}
                                    <div className="grid grid-cols-[110px_1fr] items-center gap-4">
                                        <span className="text-[13px] font-semibold text-slate-500">Start date</span>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <div className="relative cursor-pointer group w-full">
                                                    <Input
                                                        readOnly
                                                        value={(editedTask.startDate || task.startDate) ? format(new Date(editedTask.startDate || task.startDate as string), 'MM/dd/yyyy') : ''}
                                                        placeholder="None"
                                                        className={`h-9 pr-10 text-[13px] font-bold cursor-pointer transition-all border-slate-200 hover:border-indigo-400 focus:ring-1 focus:ring-indigo-500 ${(editedTask.startDate || task.startDate) ? 'text-slate-700 bg-slate-50' : 'text-slate-400'}`}
                                                    />
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500">
                                                        <Calendar size={16} />
                                                    </div>
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <CalendarComponent
                                                    mode="single"
                                                    selected={(editedTask.startDate || task.startDate) ? new Date(editedTask.startDate || task.startDate as string) : undefined}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            setEditedTask(prev => ({ ...prev, startDate: date.toISOString() }))
                                                            setIsEditing(true)
                                                        } else {
                                                            setEditedTask(prev => ({ ...prev, startDate: null as any }))
                                                            setIsEditing(true)
                                                        }
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Development Row */}
                                    <div className="grid grid-cols-[110px_1fr] items-start gap-4 pt-4 border-t border-slate-100">
                                        <span className="text-[13px] font-semibold text-slate-500 py-1">Development</span>
                                        <div className="space-y-2">
                                            <button className="flex items-center gap-2 text-[13px] text-indigo-600 font-bold hover:bg-indigo-50 p-1.5 rounded w-full transition-colors group text-left">
                                                <GitBranch size={14} className="group-hover:rotate-12 transition-transform" />
                                                Create branch
                                                <ChevronDown size={14} className="ml-auto text-slate-400" />
                                            </button>
                                            <button className="flex items-center gap-2 text-[13px] text-indigo-600 font-bold hover:bg-indigo-50 p-1.5 rounded w-full transition-colors group text-left">
                                                <Activity size={14} className="group-hover:scale-110 transition-transform" />
                                                Create commit
                                                <ChevronDown size={14} className="ml-auto text-slate-400" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Dates Metadata Footer */}
                                <div className="mt-8 pt-6 border-t border-slate-100 space-y-2 px-2">
                                    <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
                                        <span>Created {formatTime(task.createdAt)}</span>
                                        <span>Updated {formatTime(task.updatedAt || task.createdAt)}</span>
                                    </div>
                                    <button className="text-[11px] text-indigo-600 font-bold hover:underline">Configure</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
