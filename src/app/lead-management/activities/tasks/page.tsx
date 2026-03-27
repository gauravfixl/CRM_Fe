"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    CheckCircle2,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    Download,
    MoreHorizontal,
    Clock,
    Zap,
    Scale,
    AlertCircle,
    UserCheck,
    ListTodo,
    Circle,
    Play
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Checkbox } from "@/shared/components/ui/checkbox"

// --- Mock Data ---
const INITIAL_TASKS = [
    { id: "TSK-001", title: "Send revised proposal to Arjun", lead: "Arjun Reddy", deadline: "Today, 5:00 PM", priority: "High", completed: false },
    { id: "TSK-002", title: "Review LinkedIn profile for outreach", lead: "Ishani Gupta", deadline: "Tomorrow, 10:00 AM", priority: "Medium", completed: false },
    { id: "TSK-003", title: "Prepare deck for ROI presentation", lead: "Aarav Sharma", deadline: "Today, 3:00 PM", priority: "Critical", completed: false },
    { id: "TSK-004", title: "Verify documentation for KYC", lead: "Zoya Khan", deadline: "23 Feb, 11:30 AM", priority: "Low", completed: true },
    { id: "TSK-005", title: "Draft follow-up sequence", lead: "Rajesh Malhotra", deadline: "Overdue", priority: "High", completed: false },
]

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"

export default function TasksPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [tasks, setTasks] = useState(INITIAL_TASKS)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newTask, setNewTask] = useState({ title: "", lead: "", priority: "Medium" })
    const [isFocusRunning, setIsFocusRunning] = useState(false)
    const [timeLeft, setTimeLeft] = useState(1499) // 24:59

    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        let interval: any
        if (isFocusRunning && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
        }
        return () => clearInterval(interval)
    }, [isFocusRunning, timeLeft])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
        const task = tasks.find(t => t.id === id)
        if (!task?.completed) {
            toast({
                title: "Task Completed",
                description: "Way to go! Focus on the next one.",
            })
        }
    }

    const handleAddTask = () => {
        if (!newTask.title) return
        setTasks([{
            ...newTask,
            id: `TSK-00${tasks.length + 1}`,
            deadline: "Today",
            completed: false
        } as any, ...tasks])
        setIsAddOpen(false)
        setNewTask({ title: "", lead: "", priority: "Medium" })
        toast({
            title: "Task Created",
            description: "New operational task added to your queue.",
        })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 shadow-sm">
                                <ListTodo size={20} />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                My Task Queue
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            A high-focus list of your operational tasks and reminders. Stay organized and ensure no lead detail slips through the cracks.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-4">
                        <p className="text-[10px] font-semibold text-slate-400">Completion Rate</p>
                        <h4 className="text-[18px] font-semibold text-emerald-600">
                            {Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%
                        </h4>
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                                <Plus className="h-4 w-4 mr-2" /> Quick Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-3xl p-6">
                            <DialogHeader>
                                <DialogTitle className="text-[18px] font-semibold text-slate-900 tracking-tight">Create Quick Task</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Input placeholder="What needs to be done?" className="h-11 rounded-xl" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
                                <Input placeholder="Associated Lead" className="h-11 rounded-xl" value={newTask.lead} onChange={(e) => setNewTask({ ...newTask, lead: e.target.value })} />
                            </div>
                            <Button className="h-11 w-full bg-indigo-600 font-semibold rounded-xl" onClick={handleAddTask}>Add to Queue</Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Task List Main */}
                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Active Work Items</h3>
                            <p className="text-[10px] text-slate-500 font-semibold">Showing 5 pending tasks</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 text-[11px] font-semibold text-indigo-600 px-3 bg-indigo-50">Focused View</Button>
                            <Button variant="ghost" size="sm" className="h-8 text-[11px] font-semibold text-slate-400 px-3 hover:text-slate-600">Bulk Actions</Button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <div key={task.id} className="flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 group hover:border-indigo-100/50 hover:shadow-lg hover:shadow-indigo-50/50 transition-all cursor-default">
                                <div className="flex items-center gap-5">
                                    <div
                                        className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer ${task.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 group-hover:border-indigo-400'}`}
                                        onClick={() => toggleTask(task.id)}
                                    >
                                        {task.completed && <CheckCircle2 size={14} />}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className={`text-[15px] font-semibold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</h4>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className="text-[9px] font-semibold text-indigo-600 border-indigo-100 bg-indigo-50/20">{task.lead}</Badge>
                                            <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${task.deadline === 'Overdue' ? 'text-rose-500' : 'text-slate-400'}`}>
                                                <Clock size={12} /> {task.deadline}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-[11px] font-semibold italic ${task.priority === 'Critical' ? 'text-rose-500' : task.priority === 'High' ? 'text-amber-500' : 'text-slate-400'}`}>
                                        {task.priority}
                                    </span>
                                    <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-200 hover:text-slate-900 transition-colors">
                                        <MoreHorizontal size={18} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Focus sidebar (Pomodoro/Efficiency) */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-indigo-100 rounded-3xl bg-indigo-50 text-slate-900 p-8 space-y-8 flex flex-col">
                        <div className="space-y-1">
                            <p className="text-[11px] font-semibold text-indigo-600 tracking-wider font-semibold">Focus Session</p>
                            <h3 className="text-[20px] font-semibold tracking-tight">Tasks Blitz Mode</h3>
                        </div>

                        <div className="text-center py-4">
                            <h2 className="text-[42px] font-semibold tabular-nums text-indigo-600">{formatTime(timeLeft)}</h2>
                            <p className="text-[12px] text-slate-400 font-semibold tracking-widest uppercase">Next Break: {timeLeft > 0 ? 'Wait for it' : 'Now!'}</p>
                        </div>

                        <div className="space-y-4">
                            <Button
                                onClick={() => setIsFocusRunning(!isFocusRunning)}
                                className="w-full h-11 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold rounded-xl border-none shadow-lg shadow-indigo-200"
                            >
                                <Play size={16} className={`mr-2 ${isFocusRunning ? 'hidden' : 'fill-current'}`} />
                                {isFocusRunning ? 'Pause Session' : 'Start Deep Work'}
                            </Button>
                            <p className="text-[11px] text-slate-500 text-center font-medium leading-relaxed italic">
                                "Focusing on High-Priority tasks first increases throughput by 62%."
                            </p>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6 space-y-6">
                        <h4 className="text-[14px] font-semibold text-slate-900 tracking-tight">Today's Goal</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-[12px] font-semibold text-slate-600">8 / 12 Tasks</span>
                                <span className="text-[12px] font-semibold text-indigo-600">66%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: '66%' }} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                                <p className="text-[9px] font-semibold text-emerald-600 tracking-wide">Avg Finish</p>
                                <h4 className="text-[18px] font-semibold text-emerald-700">1.2h</h4>
                            </div>
                            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
                                <p className="text-[9px] font-semibold text-amber-600 tracking-wide">Streak</p>
                                <h4 className="text-[18px] font-semibold text-amber-700">4 Days</h4>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>

        </div>
    )
}
