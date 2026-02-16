"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import {
    Plus,
    Calendar,
    Target,
    Play,
    ChevronRight,
    ChevronDown,
    GripVertical,
    Edit2,
    Trash2,
    Flag,
    User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { useSprintStore, Sprint } from "@/shared/data/sprint-store"
import { useIssueStore, Issue, IssuePriority } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"
import TaskDetailDrawer from "@/shared/components/projectmanagement/task-detail-drawer"

export default function BacklogPage() {
    const params = useParams()
    const projectId = params?.id as string

    const { getProjectById } = useProjectStore()
    const { getSprints, createSprint, deleteSprint } = useSprintStore()
    const { getIssuesByProject, updateIssue, addIssue } = useIssueStore()

    const project = getProjectById(projectId)
    const sprints = getSprints({ projectId })
    const allTasks = getIssuesByProject(projectId)

    const [expandedSprints, setExpandedSprints] = useState<Set<string>>(new Set())
    const [createSprintOpen, setCreateSprintOpen] = useState(false)
    const [createTaskOpen, setCreateTaskOpen] = useState(false)
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
    const [selectedSprintForTask, setSelectedSprintForTask] = useState<string | null>(null)

    const [newSprint, setNewSprint] = useState({
        name: "",
        goal: ""
    })

    const [newTask, setNewTask] = useState({
        name: "",
        description: "",
        priority: "MEDIUM" as IssuePriority,
        storyPoints: 0,
        sprintId: ""
    })

    // Separate tasks by sprint
    const backlogTasks = allTasks.filter(t => !t.sprintId)
    const sprintTasks = (sprintId: string) => allTasks.filter(t => t.sprintId === sprintId)

    const toggleSprint = (sprintId: string) => {
        const newExpanded = new Set(expandedSprints)
        if (newExpanded.has(sprintId)) {
            newExpanded.delete(sprintId)
        } else {
            newExpanded.add(sprintId)
        }
        setExpandedSprints(newExpanded)
    }

    const handleCreateSprint = () => {
        if (!newSprint.name.trim()) {
            alert("Please enter a sprint name")
            return
        }

        createSprint({
            name: newSprint.name,
            goal: newSprint.goal,
            status: "PLANNED",
            projectId,
            boardId: "b1",
            workspaceId: project?.workspaceId || "w1",
            organizationId: "org-1",
            createdBy: "u1",
            creatorName: "Current User"
        })

        setNewSprint({ name: "", goal: "" })
        setCreateSprintOpen(false)
    }

    const handleCreateTask = () => {
        if (!newTask.name.trim()) {
            alert("Please enter a task name")
            return
        }

        addIssue({
            id: `ISSUE-${Date.now()}`,
            title: newTask.name,
            description: newTask.description,
            type: "TASK",
            priority: newTask.priority,
            status: "TODO",
            projectId,
            boardId: "b1",
            assigneeId: "u1",
            assignee: {
                name: "Current User",
                avatar: "https://i.pravatar.cc/150?u=u1"
            },
            reporterId: "u1",
            createdAt: new Date().toISOString(),
            storyPoints: newTask.storyPoints,
            sprintId: newTask.sprintId || null
        })

        setNewTask({
            name: "",
            description: "",
            priority: "MEDIUM",
            storyPoints: 0,
            sprintId: ""
        })
        setCreateTaskOpen(false)
    }

    const moveTaskToSprint = (taskId: string, sprintId: string | null) => {
        updateIssue(taskId, { sprintId: sprintId || undefined })
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

    const getSprintStatusColor = (status: Sprint['status']) => {
        const colors = {
            PLANNED: "bg-slate-100 text-slate-700 border-slate-200",
            ACTIVE: "bg-green-100 text-green-700 border-green-200",
            COMPLETED: "bg-blue-100 text-blue-700 border-blue-200"
        }
        return colors[status]
    }

    const TaskCard = ({ task }: { task: Issue }) => (
        <Card
            className="border-2 border-slate-200 hover:border-indigo-300 rounded-xl cursor-pointer transition-all group"
            onClick={() => setSelectedTaskId(task.id)}
        >
            <CardContent className="p-3">
                <div className="flex items-start gap-3">
                    <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical size={16} className="text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-slate-900 truncate">
                                    {task.title}
                                </p>
                                <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                                    {task.description || "No description"}
                                </p>
                            </div>
                            <Badge className="bg-indigo-100 text-indigo-700 text-[9px] font-bold border-none shrink-0">
                                {task.id}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`text-[9px] font-bold border ${getPriorityColor(task.priority)}`}>
                                <Flag size={8} className="mr-1" />
                                {task.priority}
                            </Badge>
                            {task.storyPoints && task.storyPoints > 0 && (
                                <Badge className="bg-purple-100 text-purple-700 text-[9px] font-bold border-purple-200 border">
                                    {task.storyPoints} pts
                                </Badge>
                            )}
                            {task.assignee && (
                                <Badge className="bg-slate-100 text-slate-600 text-[9px] font-bold border-none">
                                    <User size={8} className="mr-1" />
                                    {task.assignee.name}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    const SprintSection = ({ sprint }: { sprint: Sprint }) => {
        const tasks = sprintTasks(sprint.id)
        const isExpanded = expandedSprints.has(sprint.id)

        return (
            <div className="border-2 border-slate-200 rounded-2xl overflow-hidden">
                <div
                    className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => toggleSprint(sprint.id)}
                >
                    <div className="flex items-center gap-3 flex-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                                e.stopPropagation()
                                toggleSprint(sprint.id)
                            }}
                        >
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </Button>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-[14px] font-bold text-slate-900">{sprint.name}</h3>
                                <Badge className={`text-[10px] font-bold border ${getSprintStatusColor(sprint.status)}`}>
                                    {sprint.status}
                                </Badge>
                            </div>
                            {sprint.goal && (
                                <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                                    <Target size={12} />
                                    {sprint.goal}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[11px] text-slate-500 font-semibold">
                                {tasks.length} tasks · {sprint.totalPoints} pts
                            </p>
                            {sprint.startDate && sprint.endDate && (
                                <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 justify-end">
                                    <Calendar size={10} />
                                    {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                        {sprint.status === "PLANNED" && (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (confirm("Delete this sprint?")) {
                                        deleteSprint(sprint.id)
                                    }
                                }}
                                className="h-7 w-7 p-0 text-red-600 hover:bg-red-50"
                            >
                                <Trash2 size={14} />
                            </Button>
                        )}
                    </div>
                </div>

                {isExpanded && (
                    <div className="p-4 space-y-2 bg-white">
                        {tasks.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-[13px] font-semibold text-slate-500">No tasks in this sprint</p>
                                <p className="text-[11px] text-slate-400 mt-1">Drag tasks here or create new ones</p>
                            </div>
                        ) : (
                            tasks.map(task => <TaskCard key={task.id} task={task} />)
                        )}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full gap-5 max-w-6xl pb-10 origin-top">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[24px] font-bold text-slate-900">Backlog</h1>
                    <p className="text-[13px] text-slate-500 font-medium mt-1">
                        Plan and manage sprints for {project?.name}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog open={createTaskOpen} onOpenChange={setCreateTaskOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-9 px-4 bg-slate-600 hover:bg-slate-700 text-white rounded-xl text-[12px] font-semibold shadow-md shadow-slate-100">
                                <Plus size={14} className="mr-2" />
                                Create Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-[16px] font-bold">Create New Task</DialogTitle>
                                <DialogDescription className="text-[12px]">
                                    Add a new task to the backlog or a sprint
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold">Task Name *</Label>
                                    <Input
                                        value={newTask.name}
                                        onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                                        placeholder="Enter task name"
                                        className="text-[13px] font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold">Description</Label>
                                    <Textarea
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                        placeholder="Describe the task..."
                                        className="text-[13px] font-medium resize-none"
                                        rows={3}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold">Priority</Label>
                                        <select
                                            value={newTask.priority}
                                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as IssuePriority })}
                                            className="w-full h-9 px-3 rounded-lg border border-slate-200 text-[12px] font-medium"
                                        >
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HIGH">High</option>
                                            <option value="URGENT">Urgent</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold">Story Points</Label>
                                        <Input
                                            type="number"
                                            value={newTask.storyPoints}
                                            onChange={(e) => setNewTask({ ...newTask, storyPoints: parseInt(e.target.value) || 0 })}
                                            className="text-[13px] font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold">Sprint (Optional)</Label>
                                    <select
                                        value={newTask.sprintId}
                                        onChange={(e) => setNewTask({ ...newTask, sprintId: e.target.value })}
                                        className="w-full h-9 px-3 rounded-lg border border-slate-200 text-[12px] font-medium"
                                    >
                                        <option value="">Backlog (No Sprint)</option>
                                        {sprints.filter(s => s.status !== "COMPLETED").map(sprint => (
                                            <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setCreateTaskOpen(false)}
                                    className="h-9 px-4 rounded-xl text-[12px] font-semibold"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreateTask}
                                    className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[12px] font-semibold shadow-md shadow-indigo-100"
                                >
                                    Create Task
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={createSprintOpen} onOpenChange={setCreateSprintOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[12px] font-semibold shadow-md shadow-indigo-100">
                                <Plus size={14} className="mr-2" />
                                Create Sprint
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-[16px] font-bold">Create New Sprint</DialogTitle>
                                <DialogDescription className="text-[12px]">
                                    Plan a new sprint for your project
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold">Sprint Name *</Label>
                                    <Input
                                        value={newSprint.name}
                                        onChange={(e) => setNewSprint({ ...newSprint, name: e.target.value })}
                                        placeholder="e.g., Sprint 1"
                                        className="text-[13px] font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold">Sprint Goal</Label>
                                    <Textarea
                                        value={newSprint.goal}
                                        onChange={(e) => setNewSprint({ ...newSprint, goal: e.target.value })}
                                        placeholder="What do you want to achieve in this sprint?"
                                        className="text-[13px] font-medium resize-none"
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setCreateSprintOpen(false)}
                                    className="h-9 px-4 rounded-xl text-[12px] font-semibold"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreateSprint}
                                    className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[12px] font-semibold shadow-md shadow-indigo-100"
                                >
                                    Create Sprint
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Sprints */}
            <div className="space-y-4">
                {sprints.map(sprint => (
                    <SprintSection key={sprint.id} sprint={sprint} />
                ))}
            </div>

            {/* Backlog */}
            <div className="border-2 border-slate-200 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-slate-50">
                    <div>
                        <h3 className="text-[14px] font-bold text-slate-900">Backlog</h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            {backlogTasks.length} tasks not assigned to any sprint
                        </p>
                    </div>
                </div>
                <div className="p-4 space-y-2 bg-white">
                    {backlogTasks.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-[13px] font-semibold text-slate-500">No tasks in backlog</p>
                            <p className="text-[11px] text-slate-400 mt-1">Create tasks to get started</p>
                        </div>
                    ) : (
                        backlogTasks.map(task => <TaskCard key={task.id} task={task} />)
                    )}
                </div>
            </div>

            {/* Task Detail Drawer */}
            <TaskDetailDrawer
                taskId={selectedTaskId}
                isOpen={!!selectedTaskId}
                onClose={() => setSelectedTaskId(null)}
                projectId={projectId}
            />
        </div>
    )
}
