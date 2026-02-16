"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import {
    Plus,
    MoreHorizontal,
    Search,
    Filter,
    Calendar as CalendarIcon,
    Zap,
    Bug,
    ChevronDown,
    CheckCircle2,
    BarChart2,
    SlidersHorizontal,
    Settings2,
    Link2,
    Key,
    Flag,
    Tag,
    Archive,
    Clipboard,
    Copy,
    ArrowUp,
    ArrowDown,
    TriangleAlert,
    AlertCircle,
    Bookmark,
    ArrowLeft,
    ArrowRight,
    Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent
} from "@/shared/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog"
import { Sheet } from "@/components/ui/sheet"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import TaskDetailDrawer from "@/shared/components/projectmanagement/task-detail-drawer"
import { CreateIssueModal } from "@/shared/components/projectmanagement/create-issue-modal"
import WorkflowSettingsModal from "@/shared/components/projectmanagement/workflow-settings-modal"
import MemberManagementDrawer from "@/shared/components/projectmanagement/member-management-drawer"
import { useIssueStore, IssueStatus, IssueType } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { usePermissions } from "@/shared/hooks/use-permissions"
import { useWorkflowStore } from "@/shared/data/workflow-store"
import { useSprintEpicStore } from "@/shared/data/sprint-epic-store"
import { useProjectMemberStore } from "@/shared/data/project-member-store"

export default function ProjectBoard() {
    const { id } = useParams()
    const projectId = id as string

    const { getIssuesByProject, addIssue, updateIssueStatus, deleteIssue } = useIssueStore()
    const { getProjectById } = useProjectStore()
    const { getSprintsByProject, getEpicsByProject, getActiveSprint } = useSprintEpicStore()

    const project = getProjectById(projectId)
    const issues = getIssuesByProject(projectId)
    const activeSprint = getActiveSprint(projectId)
    const { getAllProjectMembers } = useProjectMemberStore()
    const projectMembers = getAllProjectMembers(projectId)

    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
    const [quickAddValues, setQuickAddValues] = useState<Record<string, string>>({})
    const [quickAddDates, setQuickAddDates] = useState<Record<string, Date | undefined>>({})
    const [quickAddAssignees, setQuickAddAssignees] = useState<Record<string, string>>({})
    const [quickAddTypes, setQuickAddTypes] = useState<Record<string, IssueType>>({})
    const [addingToColumn, setAddingToColumn] = useState<string | null>(null)
    const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false)
    const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false)
    const [isMemberDrawerOpen, setIsMemberDrawerOpen] = useState(false)
    const [isAddingColumn, setIsAddingColumn] = useState(false)
    const [newColumnName, setNewColumnName] = useState("")
    const [editingLimitColumn, setEditingLimitColumn] = useState<{ id: string, name: string, limit?: number } | null>(null)
    const [newLimit, setNewLimit] = useState<string>("")
    const [columnError, setColumnError] = useState<string | null>(null)

    const permissions = usePermissions({ projectId })
    const { getConfig, canTransition, addColumn, moveColumn, deleteColumn, updateColumn } = useWorkflowStore()
    const boardConfig = getConfig(projectId)

    const handleAddColumn = () => {
        const trimmedName = newColumnName.trim()
        if (!trimmedName) return

        // Check for duplicate names on this board
        const isDuplicate = boardConfig.columns.some(
            col => col.name.toLowerCase() === trimmedName.toLowerCase()
        )

        if (isDuplicate) {
            setColumnError(trimmedName)
            return
        }

        addColumn(projectId, {
            name: trimmedName,
            key: trimmedName.toUpperCase().replace(/\s+/g, '_'),
            color: "#64748b"
        })
        setNewColumnName("")
        setIsAddingColumn(false)
        setColumnError(null)
    }

    const handleMoveColumn = (columnId: string, direction: 'left' | 'right') => {
        moveColumn(projectId, columnId, direction)
    }

    const handleDeleteColumn = (columnId: string, columnName: string) => {
        if (confirm(`Are you sure you want to delete ${columnName} column? All issues in this column will remain but their status will no longer be visible on this board.`)) {
            deleteColumn(projectId, columnId)
        }
    }

    const handleSetLimit = () => {
        if (editingLimitColumn) {
            updateColumn(projectId, editingLimitColumn.id, { limit: newLimit ? parseInt(newLimit) : undefined })
            setEditingLimitColumn(null)
            setNewLimit("")
        }
    }

    const isScrum = project?.methodology === 'scrum'
    const boardIssues = isScrum && activeSprint ? issues.filter(i => i.sprintId === activeSprint.id) : issues

    const filteredIssues = boardIssues.filter(i =>
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.id.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const onDrop = (e: React.DragEvent, status: IssueStatus) => {
        e.preventDefault()
        const issueId = e.dataTransfer.getData("issueId")
        if (issueId) {
            const issue = issues.find(i => i.id === issueId)
            if (issue && !canTransition(projectId, issue.status, status)) return
            updateIssueStatus(issueId, status, "u1")
        }
    }

    const onDragStart = (e: React.DragEvent, issueId: string) => {
        e.dataTransfer.setData("issueId", issueId)
        e.dataTransfer.effectAllowed = "move"
    }

    const onDragOver = (e: React.DragEvent) => e.preventDefault()

    const handleQuickAdd = (status: IssueStatus) => {
        const title = quickAddValues[status]?.trim()
        if (!title) return

        addIssue({
            id: `${project?.key || 'KAN'}-${Math.floor(Math.random() * 900) + 100}`,
            projectId,
            title,
            description: "",
            status,
            priority: "MEDIUM",
            type: quickAddTypes[status] || "TASK",
            assigneeId: quickAddAssignees[status] || "u1",
            reporterId: "u1",
            sprintId: activeSprint?.id || null,
            dueDate: quickAddDates[status]?.toISOString() || undefined,
            createdAt: new Date().toISOString(),
            columnOrder: 0,
            history: []
        })

        setQuickAddValues(prev => ({ ...prev, [status]: "" }))
        setQuickAddDates(prev => ({ ...prev, [status]: undefined }))
        setQuickAddAssignees(prev => ({ ...prev, [status]: "" }))
        setQuickAddTypes(prev => ({ ...prev, [status]: "TASK" }))
        setAddingToColumn(null)
    }

    return (
        <div className="flex flex-col h-full bg-[#f4f5f7]/30 font-outfit overflow-hidden" style={{ zoom: "90%" }}>
            {/* Jira-Style Controls Bar */}
            <div className="px-6 py-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                                placeholder="Search board"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 h-10 bg-white border border-gray-200 focus:border-blue-500 rounded-sm text-sm transition-all outline-none w-52 font-normal text-gray-600"
                            />
                        </div>
                        <div className="flex items-center -space-x-1">
                            {[1, 2].map(i => (
                                <Avatar key={i} className="h-8 w-8 border-2 border-white cursor-pointer hover:z-10 transition-all">
                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${i + 10}`} />
                                    <AvatarFallback>GG</AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                        <Button variant="ghost" size="sm" className="bg-[#f4f5f7] border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 gap-2 h-10 px-4 rounded-sm">
                            <Filter size={16} />
                            Filter
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="bg-[#f4f5f7] border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 h-10 px-4 rounded-sm">
                            Group
                            <ChevronDown size={14} className="ml-2" />
                        </Button>
                        <Button variant="ghost" size="sm" className="bg-[#f4f5f7] border border-gray-200 h-10 w-10 p-0 rounded-sm text-gray-600">
                            <BarChart2 size={18} />
                        </Button>
                        <Button variant="ghost" size="sm" className="bg-[#f4f5f7] border border-gray-200 h-10 w-10 p-0 rounded-sm text-gray-600">
                            <SlidersHorizontal size={18} />
                        </Button>
                        <Button variant="ghost" size="sm" className="bg-[#f4f5f7] border border-gray-200 h-10 w-10 p-0 rounded-sm text-gray-600">
                            <MoreHorizontal size={18} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Kanban Board Area */}
            <div className="flex-1 px-6 pb-6 overflow-x-auto overflow-y-hidden min-h-0">
                <div className="flex gap-4 h-full items-stretch pb-4 min-h-[70vh]">
                    {boardConfig.columns.map((col, index) => {
                        const status = col.key as IssueStatus
                        const columnIssues = filteredIssues.filter(i => i.status === status)
                        const isAdding = addingToColumn === col.key
                        const limitExceeded = col.limit && columnIssues.length > col.limit

                        const isFirst = index === 0
                        const isLast = index === boardConfig.columns.length - 1

                        return (
                            <div
                                key={col.key}
                                onDragOver={onDragOver}
                                onDrop={(e) => onDrop(e, status)}
                                className={`flex-shrink-0 w-[280px] flex flex-col rounded-sm p-1.5 min-h-full group/col transition-colors ${limitExceeded ? 'bg-red-50' : 'bg-[#f4f5f7]'}`}
                            >
                                {/* Column Header */}
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className={`text-[12px] font-bold uppercase tracking-wider ${limitExceeded ? 'text-red-600' : 'text-gray-500'}`}>{col.name}</h3>
                                        <span className={`text-[12px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${limitExceeded ? 'bg-red-200 text-red-700' : 'text-gray-500 bg-gray-200/50'}`}>
                                            {columnIssues.length} {col.limit ? `/ ${col.limit}` : ""}
                                        </span>
                                        {status === "DONE" && <CheckCircle2 size={14} className="text-emerald-500 ml-1" />}
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-200/50 rounded flex-shrink-0 opacity-0 group-hover/col:opacity-100 transition-opacity">
                                                <MoreHorizontal size={14} className="text-gray-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuItem
                                                disabled={isFirst}
                                                onClick={() => handleMoveColumn(col.id, 'left')}
                                                className="gap-2"
                                            >
                                                <ArrowLeft size={14} />
                                                Move column left
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                disabled={isLast}
                                                onClick={() => handleMoveColumn(col.id, 'right')}
                                                className="gap-2"
                                            >
                                                <ArrowRight size={14} />
                                                Move column right
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => {
                                                setEditingLimitColumn(col)
                                                setNewLimit(col.limit?.toString() || "")
                                            }} className="gap-2">
                                                <Settings2 size={14} />
                                                Set column limit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleDeleteColumn(col.id, col.name)} className="gap-2 text-rose-600 focus:text-rose-600">
                                                <Trash2 size={14} />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Create Button at TOP (if empty) */}
                                {columnIssues.length === 0 && !isAdding && (
                                    <button
                                        onClick={() => setAddingToColumn(col.key)}
                                        className="mx-1 flex items-center gap-2 p-2 text-gray-500 hover:bg-gray-200/50 rounded-sm transition-all group opacity-0 group-hover/col:opacity-100"
                                    >
                                        <Plus size={18} className="text-gray-400 group-hover:text-gray-600" />
                                        <span className="text-sm font-semibold">Create</span>
                                    </button>
                                )}

                                {/* List Area */}
                                <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar px-0.5 pb-2 min-h-[10px]">
                                    {columnIssues.map(issue => (
                                        <Card
                                            key={issue.id}
                                            draggable
                                            onDragStart={(e) => onDragStart(e, issue.id)}
                                            onClick={() => setSelectedTaskId(issue.id)}
                                            className="border border-gray-200 shadow-sm hover:bg-[#ebecf0]/50 transition-all cursor-pointer group bg-white rounded-[3px] p-0"
                                        >
                                            <CardContent className="p-3 space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <div className="text-[14px] font-medium text-gray-800 leading-tight">
                                                        {issue.title}
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <MoreHorizontal size={14} className="text-gray-400" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="start" sideOffset={5} className="w-56 font-outfit z-[100]">
                                                            <DropdownMenuSub>
                                                                <DropdownMenuSubTrigger className="gap-2">
                                                                    <ArrowRight size={14} />
                                                                    Move work item
                                                                </DropdownMenuSubTrigger>
                                                                <DropdownMenuSubContent className="w-48">
                                                                    <DropdownMenuItem className="gap-2" onClick={(e) => e.stopPropagation()}>
                                                                        <ArrowDown size={14} />
                                                                        Down
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem className="gap-2" onClick={(e) => e.stopPropagation()}>
                                                                        <div className="flex flex-col items-center">
                                                                            <ArrowDown size={14} />
                                                                            <div className="h-[1px] w-3 bg-current -mt-1" />
                                                                        </div>
                                                                        To the bottom
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuSubContent>
                                                            </DropdownMenuSub>
                                                            <DropdownMenuSub>
                                                                <DropdownMenuSubTrigger className="gap-2">
                                                                    <CheckCircle2 size={14} />
                                                                    Change status
                                                                </DropdownMenuSubTrigger>
                                                                <DropdownMenuSubContent className="w-48">
                                                                    {['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].map((s) => (
                                                                        <DropdownMenuItem
                                                                            key={s}
                                                                            disabled={issue.status === s}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation()
                                                                                updateIssueStatus(issue.id, s as IssueStatus, "u1")
                                                                            }}
                                                                            className="gap-2"
                                                                        >
                                                                            {s.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                                                                        </DropdownMenuItem>
                                                                    ))}
                                                                </DropdownMenuSubContent>
                                                            </DropdownMenuSub>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(window.location.href) }} className="gap-2">
                                                                <Link2 size={14} />
                                                                Copy link
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(issue.id) }} className="gap-2">
                                                                <Key size={14} />
                                                                Copy key
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="gap-2">
                                                                <Flag size={14} />
                                                                Add flag
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="gap-2">
                                                                <Tag size={14} />
                                                                Add label
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="gap-2">
                                                                <Link2 size={14} />
                                                                Link work item
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="gap-2">
                                                                <Archive size={14} />
                                                                Archive
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    if (confirm("Are you sure you want to delete this issue?")) {
                                                                        deleteIssue(issue.id)
                                                                    }
                                                                }}
                                                                className="gap-2 text-rose-600 focus:text-rose-600"
                                                            >
                                                                <Trash2 size={14} />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                {issue.dueDate && (
                                                    <div className="flex flex-wrap gap-2 items-center">
                                                        <div className="flex items-center gap-1.5 px-1.5 py-0.5 border border-rose-200 bg-rose-50 rounded-[3px] text-rose-600">
                                                            <CalendarIcon size={10} className="text-rose-500" />
                                                            <span className="text-[11px] font-semibold">{format(new Date(issue.dueDate), 'MMM d, yyyy')}</span>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1.5">
                                                            {issue.id.includes('KAN-1') ? (
                                                                <div className="p-0.5 bg-blue-500 rounded-sm">
                                                                    <CheckCircle2 size={10} className="text-white" />
                                                                </div>
                                                            ) : (
                                                                <Bookmark size={14} className="text-emerald-500 fill-current" />
                                                            )}
                                                            <span className="text-[12px] font-medium text-gray-500 uppercase tracking-tight">{issue.id}</span>
                                                        </div>
                                                    </div>
                                                    <Avatar className="h-6 w-6 border-2 border-white shadow-sm shrink-0">
                                                        <AvatarImage src={projectMembers.find(m => m.userId === issue.assigneeId)?.userAvatar || `https://i.pravatar.cc/150?u=${issue.assigneeId}`} />
                                                        <AvatarFallback className="text-[8px] bg-gray-100 text-gray-500">
                                                            {projectMembers.find(m => m.userId === issue.assigneeId)?.userName.charAt(0) || 'U'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    {isAdding && (
                                        <div className="bg-white p-3 rounded-[3px] border-2 border-[#4c9aff] shadow-[0_4px_8px_-2px_rgba(9,30,66,0.25),0_0_1px_rgba(9,30,66,0.31)] mx-0.5 space-y-3">
                                            <textarea
                                                autoFocus
                                                placeholder="What needs to be done?"
                                                value={quickAddValues[status] || ""}
                                                onChange={(e) => setQuickAddValues(prev => ({ ...prev, [status]: e.target.value }))}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault()
                                                        handleQuickAdd(status)
                                                    }
                                                    if (e.key === 'Escape') setAddingToColumn(null)
                                                }}
                                                className="w-full text-[14px] font-normal outline-none resize-none min-h-[60px] text-gray-800 placeholder:text-gray-400 leading-tight"
                                            />

                                            <div className="flex items-center justify-between pt-1 border-t border-gray-100/50">
                                                <div className="flex items-center gap-1">
                                                    {/* Jira-style Type Selector */}
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <div className="flex items-center gap-1 p-1 hover:bg-gray-100 rounded-sm cursor-pointer transition-colors group/type">
                                                                <div className={`p-0.5 rounded-sm ${(quickAddTypes[status] || 'TASK') === 'TASK' ? 'bg-blue-500' :
                                                                    (quickAddTypes[status] || 'TASK') === 'BUG' ? 'bg-rose-500' : 'bg-emerald-500'
                                                                    }`}>
                                                                    {(quickAddTypes[status] || 'TASK') === 'TASK' && <CheckCircle2 size={10} className="text-white" />}
                                                                    {(quickAddTypes[status] || 'TASK') === 'BUG' && <Bug size={10} className="text-white" />}
                                                                    {(quickAddTypes[status] || 'TASK') === 'STORY' && <Bookmark size={10} className="text-white" />}
                                                                </div>
                                                                <ChevronDown size={12} className="text-gray-400" />
                                                            </div>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="start" className="w-40">
                                                            <DropdownMenuItem onClick={() => setQuickAddTypes(prev => ({ ...prev, [status]: 'TASK' }))} className="gap-2">
                                                                <div className="p-0.5 bg-blue-500 rounded-sm"><CheckCircle2 size={10} className="text-white" /></div>
                                                                <span className="text-xs font-bold">Task</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => setQuickAddTypes(prev => ({ ...prev, [status]: 'STORY' }))} className="gap-2">
                                                                <div className="p-0.5 bg-emerald-500 rounded-sm"><Bookmark size={10} className="text-white" /></div>
                                                                <span className="text-xs font-bold">Story</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => setQuickAddTypes(prev => ({ ...prev, [status]: 'BUG' }))} className="gap-2">
                                                                <div className="p-0.5 bg-rose-500 rounded-sm"><Bug size={10} className="text-white" /></div>
                                                                <span className="text-xs font-bold">Bug</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>

                                                    {/* Jira-style Due Date Picker */}
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <div className={`p-1.5 hover:bg-gray-100 rounded-sm cursor-pointer transition-colors ${quickAddDates[status] ? 'text-blue-600' : 'text-gray-500'}`}>
                                                                <CalendarIcon size={14} />
                                                            </div>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0 border-none shadow-2xl" align="start">
                                                            <div className="p-4 bg-white border border-gray-200 rounded-md">
                                                                <div className="mb-2 text-xs font-bold text-gray-500 uppercase tracking-tight flex justify-between items-center">
                                                                    <span>Due date</span>
                                                                    {quickAddDates[status] && (
                                                                        <button
                                                                            onClick={() => setQuickAddDates(prev => ({ ...prev, [status]: undefined }))}
                                                                            className="text-blue-600 hover:underline hover:text-blue-700 normal-case font-medium"
                                                                        >
                                                                            Clear
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <div className="mb-2">
                                                                    <input
                                                                        type="text"
                                                                        readOnly
                                                                        value={quickAddDates[status] ? format(quickAddDates[status]!, 'P') : ''}
                                                                        placeholder="M/d/yyyy"
                                                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
                                                                    />
                                                                </div>
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={quickAddDates[status]}
                                                                    onSelect={(date) => setQuickAddDates(prev => ({ ...prev, [status]: date }))}
                                                                    initialFocus
                                                                />
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <div className="p-1.5 hover:bg-gray-100 rounded-sm cursor-pointer transition-colors text-gray-500">
                                                                {quickAddAssignees[status] ? (
                                                                    <Avatar className="h-5 w-5 border border-white shadow-sm">
                                                                        <AvatarImage src={projectMembers.find(m => m.userId === quickAddAssignees[status])?.userAvatar} />
                                                                        <AvatarFallback className="text-[6px]">{projectMembers.find(m => m.userId === quickAddAssignees[status])?.userName.charAt(0)}</AvatarFallback>
                                                                    </Avatar>
                                                                ) : (
                                                                    <div className="h-5 w-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                                                                        <Plus size={10} className="text-gray-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-48 p-0 border-none shadow-2xl" align="start">
                                                            <div className="p-2 bg-white border border-gray-200 rounded-md">
                                                                <div className="px-2 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-tight flex justify-between items-center">
                                                                    <span>Assign member</span>
                                                                    {quickAddAssignees[status] && (
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setQuickAddAssignees(prev => ({ ...prev, [status]: "" }));
                                                                            }}
                                                                            className="text-blue-600 hover:underline hover:text-blue-700 normal-case font-medium"
                                                                        >
                                                                            Clear
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <div className="max-h-40 overflow-y-auto custom-scrollbar">
                                                                    {projectMembers.map(member => (
                                                                        <div
                                                                            key={member.id}
                                                                            onClick={() => setQuickAddAssignees(prev => ({ ...prev, [status]: member.userId }))}
                                                                            className={`flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-sm cursor-pointer transition-colors ${quickAddAssignees[status] === member.userId ? 'bg-blue-50' : ''}`}
                                                                        >
                                                                            <Avatar className="h-5 w-5">
                                                                                <AvatarImage src={member.userAvatar} />
                                                                                <AvatarFallback className="text-[6px]">{member.userName.charAt(0)}</AvatarFallback>
                                                                            </Avatar>
                                                                            <div className="flex flex-col">
                                                                                <span className="text-xs font-medium text-gray-700">{member.userName}</span>
                                                                                <span className="text-[9px] text-gray-500">{member.role}</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => setAddingToColumn(null)}
                                                        className="h-7 px-2 text-[12px] font-bold text-gray-600 hover:bg-gray-100"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleQuickAdd(status)}
                                                        className="bg-[#0052cc] hover:bg-[#0747a6] text-white h-7 px-3 text-[12px] font-bold rounded-sm shadow-sm"
                                                    >
                                                        Add
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Create Button at BOTTOM (if not empty) */}
                                {columnIssues.length > 0 && !isAdding && (
                                    <button
                                        onClick={() => setAddingToColumn(col.key)}
                                        className="mt-1 flex items-center gap-2 w-full p-2 text-gray-500 hover:bg-gray-200/50 rounded-sm transition-all group"
                                    >
                                        <Plus size={18} className="text-gray-400 group-hover:text-gray-600" />
                                        <span className="text-sm font-semibold">Create</span>
                                    </button>
                                )}
                            </div>
                        )
                    })}

                    {/* Add Column Button */}
                    <div className="flex-shrink-0 w-[280px] flex flex-col mt-2">
                        {isAddingColumn ? (
                            <div className="relative group">
                                <div className={`bg-[#f4f5f7] p-3 rounded-sm border-2 transition-all shadow-sm ${columnError ? 'border-amber-500 bg-white' : 'border-blue-500'}`}>
                                    <div className="relative flex items-center">
                                        <input
                                            autoFocus
                                            placeholder="Column name"
                                            value={newColumnName}
                                            onChange={(e) => {
                                                setNewColumnName(e.target.value)
                                                if (columnError) setColumnError(null)
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleAddColumn()
                                                if (e.key === 'Escape') setIsAddingColumn(false)
                                            }}
                                            className="w-full p-2 pr-10 text-[14px] border border-gray-200 rounded outline-none focus:border-blue-500 font-normal"
                                        />
                                        {columnError && (
                                            <TriangleAlert size={18} className="absolute right-3 text-amber-500 animate-in fade-in zoom-in duration-200" />
                                        )}
                                    </div>

                                    {columnError && (
                                        <div className="absolute left-0 top-[calc(100%+8px)] w-[320px] bg-white border border-gray-200 shadow-xl rounded-md p-4 z-[200] animate-in slide-in-from-top-2 duration-200">
                                            <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45" />
                                            <p className="text-[13px] text-gray-700 leading-relaxed font-normal">
                                                The name <span className="font-bold underlineDecoration-amber-500 text-gray-900">'{columnError}'</span> is already being used on this board.
                                                <br />
                                                <span className="mt-1 block">You'll need to give your column a unique name. Trust us - it'll be less confusing this way.</span>
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-2 mt-3">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                setIsAddingColumn(false)
                                                setColumnError(null)
                                            }}
                                            className="h-8 text-xs font-bold"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={handleAddColumn}
                                            className="bg-[#0052cc] hover:bg-[#0747a6] text-white h-8 text-xs font-bold rounded-sm"
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Button
                                onClick={() => setIsAddingColumn(true)}
                                variant="ghost"
                                className="h-10 w-10 p-0 border border-transparent hover:bg-gray-200/50 rounded-sm bg-gray-100/30"
                            >
                                <Plus size={20} className="text-gray-500" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals & Drawers */}
            <Dialog open={isWorkflowModalOpen} onOpenChange={setIsWorkflowModalOpen}>
                <WorkflowSettingsModal projectId={projectId} onClose={() => setIsWorkflowModalOpen(false)} />
            </Dialog>

            <Sheet open={isMemberDrawerOpen} onOpenChange={setIsMemberDrawerOpen}>
                <MemberManagementDrawer type="PROJECT" id={projectId} onClose={() => setIsMemberDrawerOpen(false)} />
            </Sheet>

            <TaskDetailDrawer
                taskId={selectedTaskId}
                isOpen={!!selectedTaskId}
                onClose={() => setSelectedTaskId(null)}
                projectId={projectId}
            />

            <CreateIssueModal
                projectId={projectId}
                isOpen={isCreateIssueOpen}
                onClose={() => setIsCreateIssueOpen(false)}
            />

            <Dialog open={!!editingLimitColumn} onOpenChange={(open) => !open && setEditingLimitColumn(null)}>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="px-6 py-4 border-b border-gray-100 bg-white">
                        <DialogTitle className="text-lg font-bold text-gray-900">Set Column Limit</DialogTitle>
                        <DialogDescription className="text-sm text-gray-500 mt-1">
                            How many issues can be in {editingLimitColumn?.name || 'this column'} at once?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 bg-white">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum number of issues</label>
                        <input
                            type="number"
                            autoFocus
                            value={newLimit}
                            onChange={(e) => setNewLimit(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSetLimit()
                                if (e.key === 'Escape') setEditingLimitColumn(null)
                            }}
                            placeholder="No limit"
                            className="w-full h-10 px-3 bg-white border border-gray-200 rounded focus:border-blue-500 outline-none transition-all font-medium"
                        />
                        <p className="mt-2 text-[11px] text-gray-400 font-medium">Leave empty for no limit. Columns exceeding their limit will be highlighted in red.</p>
                    </div>
                    <DialogFooter className="px-6 py-4 bg-gray-50/50 flex justify-end gap-2 border-t border-gray-100">
                        <Button variant="ghost" size="sm" onClick={() => setEditingLimitColumn(null)} className="font-bold text-gray-600">Cancel</Button>
                        <Button size="sm" onClick={handleSetLimit} className="bg-[#0052cc] hover:bg-[#0747a6] text-white font-bold h-9 px-6 rounded-sm">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
