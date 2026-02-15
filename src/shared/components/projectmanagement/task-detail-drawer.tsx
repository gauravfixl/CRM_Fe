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
    Activity
} from "lucide-react"
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
import { formatDistanceToNow } from "date-fns"

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

    const [isEditing, setIsEditing] = useState(false)
    const [editedTask, setEditedTask] = useState<Partial<Issue>>({})

    const task = taskId ? getIssueById(taskId) : null
    const history = task?.history || []

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
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
                {/* Header */}
                <SheetHeader className="sticky top-0 z-10 bg-white border-b border-slate-200 p-6 pb-4">
                    <div className="flex items-start justify-between gap-4">
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
                </SheetHeader>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Status */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase">Status</Label>
                            {isEditing ? (
                                <Select
                                    value={editedTask.status || task.status}
                                    onValueChange={(v) => setEditedTask({ ...editedTask, status: v as IssueStatus })}
                                >
                                    <SelectTrigger className="text-[12px] font-medium">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TODO">To Do</SelectItem>
                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="IN_REVIEW">In Review</SelectItem>
                                        <SelectItem value="DONE">Done</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                                    {getStatusIcon(task.status)}
                                    <span className="text-[13px] font-semibold text-slate-700">{task.status}</span>
                                </div>
                            )}
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase">Priority</Label>
                            {isEditing ? (
                                <Select
                                    value={editedTask.priority || task.priority}
                                    onValueChange={(v) => setEditedTask({ ...editedTask, priority: v as IssuePriority })}
                                >
                                    <SelectTrigger className="text-[12px] font-medium">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LOW">Low</SelectItem>
                                        <SelectItem value="MEDIUM">Medium</SelectItem>
                                        <SelectItem value="HIGH">High</SelectItem>
                                        <SelectItem value="URGENT">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <div className={`flex items-center gap-2 p-2 rounded-lg border ${getPriorityColor(task.priority)}`}>
                                    <Flag size={14} />
                                    <span className="text-[13px] font-semibold">{task.priority}</span>
                                </div>
                            )}
                        </div>

                        {/* Assignee */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase">Assignee</Label>
                            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                                {task.assignee ? (
                                    <>
                                        <Avatar className="h-6 w-6 border border-white shadow-sm">
                                            <AvatarImage src={task.assignee.avatar} />
                                            <AvatarFallback className="text-[9px] font-bold bg-indigo-100 text-indigo-700">
                                                {task.assignee.name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-[13px] font-semibold text-slate-700">{task.assignee.name}</span>
                                    </>
                                ) : (
                                    <span className="text-[13px] text-slate-400">Unassigned</span>
                                )}
                            </div>
                        </div>

                        {/* Story Points */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase">Story Points</Label>
                            {isEditing ? (
                                <Input
                                    type="number"
                                    value={editedTask.storyPoints || task.storyPoints || 0}
                                    onChange={(e) => setEditedTask({ ...editedTask, storyPoints: parseInt(e.target.value) })}
                                    className="text-[12px] font-medium"
                                />
                            ) : (
                                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                                    <span className="text-[16px] font-bold text-indigo-600">{task.storyPoints || 0}</span>
                                    <span className="text-[11px] text-slate-500">points</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Description */}
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-700">Description</Label>
                        {isEditing ? (
                            <Textarea
                                value={editedTask.description || task.description || ""}
                                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                                className="min-h-[120px] text-[13px] font-medium resize-none"
                                placeholder="Add a description..."
                            />
                        ) : (
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <p className="text-[13px] text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                                    {task.description || "No description provided"}
                                </p>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Tabs */}
                    <Tabs defaultValue="comments" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-xl">
                            <TabsTrigger value="comments" className="text-[11px] font-semibold rounded-lg">
                                Comments
                            </TabsTrigger>
                            <TabsTrigger value="activity" className="text-[11px] font-semibold rounded-lg">
                                Activity
                            </TabsTrigger>
                            <TabsTrigger value="attachments" className="text-[11px] font-semibold rounded-lg">
                                Attachments
                            </TabsTrigger>
                        </TabsList>

                        {/* Comments Tab */}
                        <TabsContent value="comments" className="mt-4">
                            <CommentThread
                                taskId={task.id}
                                projectId={projectId}
                                currentUserId="u1"
                                currentUserName="Current User"
                                currentUserAvatar="https://i.pravatar.cc/150?u=current"
                            />
                        </TabsContent>

                        {/* Activity Tab */}
                        <TabsContent value="activity" className="mt-4">
                            <div className="space-y-3">
                                {history.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Activity size={32} className="mx-auto text-slate-300 mb-3" />
                                        <p className="text-[13px] font-semibold text-slate-500">No activity yet</p>
                                    </div>
                                ) : (
                                    history.map((entry, index) => (
                                        <div key={index} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                            <div className="shrink-0">
                                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <Activity size={14} className="text-indigo-600" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[12px] font-semibold text-slate-700">
                                                    {entry.field} changed
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge className="bg-red-100 text-red-700 text-[9px] font-bold border-none">
                                                        {entry.oldValue || "None"}
                                                    </Badge>
                                                    <span className="text-slate-400">→</span>
                                                    <Badge className="bg-green-100 text-green-700 text-[9px] font-bold border-none">
                                                        {entry.newValue}
                                                    </Badge>
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-1">
                                                    {formatTime(entry.changedAt)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </TabsContent>

                        {/* Attachments Tab */}
                        <TabsContent value="attachments" className="mt-4">
                            <DocumentManager
                                taskId={task.id}
                                projectId={projectId}
                                organizationId="org-1"
                                level="task"
                            />
                        </TabsContent>
                    </Tabs>

                    {/* Metadata */}
                    <Separator />
                    <div className="grid grid-cols-2 gap-4 text-[11px]">
                        <div>
                            <span className="text-slate-500 font-semibold">Created:</span>
                            <span className="ml-2 text-slate-700 font-medium">{formatTime(task.createdAt)}</span>
                        </div>
                        {task.updatedAt && (
                            <div>
                                <span className="text-slate-500 font-semibold">Updated:</span>
                                <span className="ml-2 text-slate-700 font-medium">{formatTime(task.updatedAt)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
