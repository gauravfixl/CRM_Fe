"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    Play,
    CheckCircle2,
    Calendar,
    Target,
    TrendingUp,
    Clock,
    Flag,
    User,
    ArrowLeft,
    Edit2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSprintStore } from "@/shared/data/sprint-store"
import { useIssueStore, Issue, IssuePriority } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"
import TaskDetailDrawer from "@/shared/components/projectmanagement/task-detail-drawer"

export default function SprintPage() {
    const params = useParams()
    const router = useRouter()
    const sprintId = params?.sprintId as string
    const projectId = params?.id as string

    const { getSprintById, startSprint, completeSprint, updateSprint } = useSprintStore()
    const { getIssues } = useIssueStore()
    const { getProjectById } = useProjectStore()

    const sprint = getSprintById(sprintId)
    const project = getProjectById(projectId)
    const tasks = getIssues({ projectId, sprintId })

    const [startDialogOpen, setStartDialogOpen] = useState(false)
    const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
    const [editSprintData, setEditSprintData] = useState({ name: "", goal: "", startDate: "", endDate: "" })
    const [sprintDates, setSprintDates] = useState({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    })

    if (!sprint) {
        return (
            <div className="p-6">
                <p className="text-[14px] text-slate-500">Sprint not found</p>
            </div>
        )
    }

    const completedTasks = tasks.filter(t => t.status === "DONE" || t.status === "COMPLETED")
    const inProgressTasks = tasks.filter(t => t.status === "IN_PROGRESS")
    const todoTasks = tasks.filter(t => t.status === "TODO" || t.status === "BACKLOG")

    const totalPoints = tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0)
    const completedPoints = completedTasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0)
    const progress = totalPoints > 0 ? (completedPoints / totalPoints) * 100 : 0

    const handleStartSprint = () => {
        const started = startSprint(sprintId, sprintDates.startDate, sprintDates.endDate)
        if (started) {
            setStartDialogOpen(false)
        }
    }

    const handleCompleteSprint = () => {
        const completed = completeSprint(sprintId)
        if (completed) {
            setCompleteDialogOpen(false)
            router.push(`/projectmanagement/projects/${projectId}/backlog`)
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

    const getStatusColor = (status: string) => {
        if (status === "DONE" || status === "COMPLETED") return "bg-green-100 text-green-700 border-green-200"
        if (status === "IN_PROGRESS") return "bg-blue-100 text-blue-700 border-blue-200"
        return "bg-slate-100 text-slate-700 border-slate-200"
    }

    const TaskCard = ({ task }: { task: Issue }) => (
        <Card
            className="border-2 border-slate-200 hover:border-indigo-300 rounded-xl cursor-pointer transition-all"
            onClick={() => setSelectedTaskId(task.id)}
        >
            <CardContent className="p-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-indigo-100 text-indigo-700 text-[9px] font-bold border-none">
                                {task.id}
                            </Badge>
                            <Badge className={`text-[9px] font-bold border ${getStatusColor(task.status)}`}>
                                {task.status}
                            </Badge>
                        </div>
                        <p className="text-[13px] font-bold text-slate-900 mb-1">
                            {task.title}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                            {task.description || "No description"}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap mt-2">
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

    const daysRemaining = sprint.endDate
        ? Math.ceil((new Date(sprint.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/projectmanagement/projects/${projectId}/backlog`)}
                        className="h-8 w-8 p-0"
                    >
                        <ArrowLeft size={16} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-[24px] font-bold text-slate-900">{sprint.name}</h1>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-slate-400 hover:text-indigo-600 ml-1"
                                onClick={() => {
                                    setEditSprintData({
                                        name: sprint.name,
                                        goal: sprint.goal,
                                        startDate: sprint.startDate || "",
                                        endDate: sprint.endDate || ""
                                    })
                                    setEditDialogOpen(true)
                                }}
                            >
                                <Edit2 size={14} />
                            </Button>
                            <Badge className={`text-[10px] font-bold border ${sprint.status === "ACTIVE" ? "bg-green-100 text-green-700 border-green-200" :
                                sprint.status === "COMPLETED" ? "bg-blue-100 text-blue-700 border-blue-200" :
                                    "bg-slate-100 text-slate-700 border-slate-200"
                                }`}>
                                {sprint.status}
                            </Badge>
                        </div>
                        {sprint.goal && (
                            <p className="text-[13px] text-slate-500 font-medium flex items-center gap-2">
                                <Target size={14} />
                                {sprint.goal}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {sprint.status === "PLANNED" && (
                        <Dialog open={startDialogOpen} onOpenChange={setStartDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="h-9 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[12px] font-semibold shadow-md shadow-green-100">
                                    <Play size={14} className="mr-2" />
                                    Start Sprint
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="text-[16px] font-bold">Start Sprint</DialogTitle>
                                    <DialogDescription className="text-[12px]">
                                        Set the sprint duration and start working
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold">Start Date</Label>
                                        <Input
                                            type="date"
                                            value={sprintDates.startDate}
                                            onChange={(e) => setSprintDates({ ...sprintDates, startDate: e.target.value })}
                                            className="text-[13px] font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold">End Date</Label>
                                        <Input
                                            type="date"
                                            value={sprintDates.endDate}
                                            onChange={(e) => setSprintDates({ ...sprintDates, endDate: e.target.value })}
                                            className="text-[13px] font-medium"
                                        />
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                                        <p className="text-[11px] text-blue-700 font-semibold">
                                            Sprint duration: {Math.ceil((new Date(sprintDates.endDate).getTime() - new Date(sprintDates.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setStartDialogOpen(false)}
                                        className="h-9 px-4 rounded-xl text-[12px] font-semibold"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleStartSprint}
                                        className="h-9 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[12px] font-semibold shadow-md shadow-green-100"
                                    >
                                        Start Sprint
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                    {sprint.status === "ACTIVE" && (
                        <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[12px] font-semibold shadow-md shadow-blue-100">
                                    <CheckCircle2 size={14} className="mr-2" />
                                    Complete Sprint
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="text-[16px] font-bold">Complete Sprint</DialogTitle>
                                    <DialogDescription className="text-[12px]">
                                        Mark this sprint as completed
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <div className="grid grid-cols-2 gap-4 text-[12px]">
                                            <div>
                                                <p className="text-slate-500 font-semibold">Total Tasks</p>
                                                <p className="text-[18px] font-bold text-slate-900">{tasks.length}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 font-semibold">Completed</p>
                                                <p className="text-[18px] font-bold text-green-600">{completedTasks.length}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 font-semibold">Total Points</p>
                                                <p className="text-[18px] font-bold text-slate-900">{totalPoints}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 font-semibold">Completed Points</p>
                                                <p className="text-[18px] font-bold text-green-600">{completedPoints}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {todoTasks.length > 0 && (
                                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                                            <p className="text-[11px] text-amber-700 font-semibold">
                                                ⚠️ {todoTasks.length} incomplete tasks will be moved back to backlog
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCompleteDialogOpen(false)}
                                        className="h-9 px-4 rounded-xl text-[12px] font-semibold"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleCompleteSprint}
                                        className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[12px] font-semibold shadow-md shadow-blue-100"
                                    >
                                        Complete Sprint
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}

                    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-[16px] font-bold">Edit Sprint Details</DialogTitle>
                                <DialogDescription className="text-[12px]">
                                    Update sprint information
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold">Sprint Name</Label>
                                    <Input
                                        value={editSprintData.name}
                                        onChange={e => setEditSprintData({ ...editSprintData, name: e.target.value })}
                                        className="text-[13px] font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold">Goal</Label>
                                    <Input
                                        value={editSprintData.goal}
                                        onChange={e => setEditSprintData({ ...editSprintData, goal: e.target.value })}
                                        className="text-[13px] font-medium"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold">Start Date</Label>
                                        <Input
                                            type="date"
                                            value={editSprintData.startDate}
                                            onChange={e => setEditSprintData({ ...editSprintData, startDate: e.target.value })}
                                            className="text-[13px] font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold">End Date</Label>
                                        <Input
                                            type="date"
                                            value={editSprintData.endDate}
                                            onChange={e => setEditSprintData({ ...editSprintData, endDate: e.target.value })}
                                            className="text-[13px] font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="h-9 px-4 rounded-xl text-[12px] font-semibold">Cancel</Button>
                                <Button
                                    onClick={() => {
                                        updateSprint(sprintId, editSprintData)
                                        setEditDialogOpen(false)
                                    }}
                                    className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[12px] font-semibold shadow-md shadow-indigo-100"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Sprint Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-2 border-slate-200 rounded-2xl">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-100 rounded-xl">
                                <Target size={20} className="text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-500 font-bold uppercase">Total Tasks</p>
                                <p className="text-[20px] font-bold text-slate-900">{tasks.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-slate-200 rounded-2xl">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <CheckCircle2 size={20} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-500 font-bold uppercase">Completed</p>
                                <p className="text-[20px] font-bold text-green-600">{completedTasks.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-slate-200 rounded-2xl">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <TrendingUp size={20} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-500 font-bold uppercase">Story Points</p>
                                <p className="text-[20px] font-bold text-slate-900">{completedPoints}/{totalPoints}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-slate-200 rounded-2xl">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-amber-100 rounded-xl">
                                <Clock size={20} className="text-amber-600" />
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-500 font-bold uppercase">Days Left</p>
                                <p className="text-[20px] font-bold text-slate-900">
                                    {daysRemaining !== null ? (daysRemaining > 0 ? daysRemaining : 0) : "-"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Progress Bar */}
            <Card className="border-2 border-slate-200 rounded-2xl">
                <CardContent className="p-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-[13px] font-bold text-slate-700">Sprint Progress</p>
                            <p className="text-[13px] font-bold text-indigo-600">{Math.round(progress)}%</p>
                        </div>
                        <Progress value={progress} className="h-3" />
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                            <span>{completedPoints} points completed</span>
                            <span>{totalPoints - completedPoints} points remaining</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sprint Dates */}
            {sprint.startDate && sprint.endDate && (
                <Card className="border-2 border-slate-200 rounded-2xl">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-slate-400" />
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">Start Date</p>
                                    <p className="text-[13px] font-bold text-slate-900">
                                        {new Date(sprint.startDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-slate-200"></div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-slate-400" />
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">End Date</p>
                                    <p className="text-[13px] font-bold text-slate-900">
                                        {new Date(sprint.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Task Lists */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* To Do */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[14px] font-bold text-slate-900">To Do</h3>
                        <Badge className="bg-slate-100 text-slate-600 text-[10px] font-bold border-none">
                            {todoTasks.length}
                        </Badge>
                    </div>
                    <div className="space-y-2">
                        {todoTasks.map(task => <TaskCard key={task.id} task={task} />)}
                        {todoTasks.length === 0 && (
                            <p className="text-center py-8 text-[12px] text-slate-400 font-medium">No tasks</p>
                        )}
                    </div>
                </div>

                {/* In Progress */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[14px] font-bold text-slate-900">In Progress</h3>
                        <Badge className="bg-blue-100 text-blue-600 text-[10px] font-bold border-none">
                            {inProgressTasks.length}
                        </Badge>
                    </div>
                    <div className="space-y-2">
                        {inProgressTasks.map(task => <TaskCard key={task.id} task={task} />)}
                        {inProgressTasks.length === 0 && (
                            <p className="text-center py-8 text-[12px] text-slate-400 font-medium">No tasks</p>
                        )}
                    </div>
                </div>

                {/* Done */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[14px] font-bold text-slate-900">Done</h3>
                        <Badge className="bg-green-100 text-green-600 text-[10px] font-bold border-none">
                            {completedTasks.length}
                        </Badge>
                    </div>
                    <div className="space-y-2">
                        {completedTasks.map(task => <TaskCard key={task.id} task={task} />)}
                        {completedTasks.length === 0 && (
                            <p className="text-center py-8 text-[12px] text-slate-400 font-medium">No tasks</p>
                        )}
                    </div>
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
