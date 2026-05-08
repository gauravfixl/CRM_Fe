"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    CheckCircle2,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    MoreHorizontal,
    Clock,
    ListTodo,
    Play,
    Edit2,
    Trash2,
    Pause,
    RotateCcw
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/shared/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover"
import { Label } from "@/shared/components/ui/label"

const INITIAL_TASKS = [
    { id: "TSK-001", title: "Send revised proposal to Arjun", lead: "Arjun Reddy", deadline: "Today, 5:00 PM", priority: "High", completed: false },
    { id: "TSK-002", title: "Review LinkedIn profile for outreach", lead: "Ishani Gupta", deadline: "Tomorrow, 10:00 AM", priority: "Medium", completed: false },
    { id: "TSK-003", title: "Prepare deck for ROI presentation", lead: "Aarav Sharma", deadline: "Today, 3:00 PM", priority: "Critical", completed: false },
    { id: "TSK-004", title: "Verify documentation for KYC", lead: "Zoya Khan", deadline: "23 Feb, 11:30 AM", priority: "Low", completed: true },
    { id: "TSK-005", title: "Draft follow-up sequence", lead: "Rajesh Malhotra", deadline: "Overdue", priority: "High", completed: false },
]

type Task = typeof INITIAL_TASKS[number]
type FormErrors = Partial<Record<"title" | "lead" | "deadline", string>>

const emptyForm = { title: "", lead: "", deadline: "", priority: "Medium" }

export default function TasksPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
    const [searchQuery, setSearchQuery] = useState("")
    const [priorityFilter, setPriorityFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [errors, setErrors] = useState<FormErrors>({})
    const [isFocusRunning, setIsFocusRunning] = useState(false)
    const [timeLeft, setTimeLeft] = useState(1499)

    useEffect(() => { setIsClient(true) }, [])

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

    const filteredTasks = useMemo(() => {
        return tasks.filter(t => {
            const q = searchQuery.toLowerCase()
            const matchesSearch = t.title.toLowerCase().includes(q) || t.lead.toLowerCase().includes(q)
            const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter
            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "completed" && t.completed) ||
                (statusFilter === "pending" && !t.completed)
            return matchesSearch && matchesPriority && matchesStatus
        })
    }, [tasks, searchQuery, priorityFilter, statusFilter])

    const activeFilterCount = [priorityFilter, statusFilter].filter(f => f !== "all").length

    const validate = (): boolean => {
        const e: FormErrors = {}
        if (!form.title.trim()) e.title = "Task title is required"
        else if (form.title.trim().length < 3) e.title = "Title must be at least 3 characters"
        else if (form.title.trim().length > 120) e.title = "Title must be under 120 characters"

        if (!form.lead.trim()) e.lead = "Associated lead is required"
        else if (!/^[A-Za-z\s.'-]{2,50}$/.test(form.lead.trim())) e.lead = "Lead name must contain only letters (2-50 chars)"

        if (!form.deadline.trim()) e.deadline = "Deadline is required"

        setErrors(e)
        return Object.keys(e).length === 0
    }

    const toggleTask = (id: string) => {
        const task = tasks.find(t => t.id === id)
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
        if (task && !task.completed) {
            toast({ title: "Task Completed", description: "Way to go! Focus on the next one." })
        }
    }

    const openCreate = () => {
        setEditingId(null)
        setForm(emptyForm)
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (task: Task) => {
        setEditingId(task.id)
        setForm({ title: task.title, lead: task.lead, deadline: task.deadline, priority: task.priority })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSubmit = () => {
        if (!validate()) {
            toast({ title: "Validation failed", description: "Please correct the highlighted fields.", variant: "destructive" })
            return
        }
        if (editingId) {
            setTasks(tasks.map(t => t.id === editingId ? { ...t, ...form } : t))
            toast({ title: "Task Updated", description: "Changes saved successfully." })
        } else {
            const id = `TSK-${String(tasks.length + 1).padStart(3, "0")}`
            setTasks([{ ...form, id, completed: false } as Task, ...tasks])
            toast({ title: "Task Created", description: "New operational task added to your queue." })
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id))
        toast({ title: "Deleted", description: "Task has been removed from queue." })
    }

    const clearFilters = () => {
        setPriorityFilter("all")
        setStatusFilter("all")
    }

    const completionRate = tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0

    if (!isClient) return null

    return (
        <div className="space-y-5 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500" style={{ zoom: "90%" }}>

            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-amber-50/60 p-4 rounded-none border border-amber-100 shadow-sm">
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
                            <div className="p-2 rounded-none bg-white text-amber-600 border border-amber-100 shadow-sm">
                                <ListTodo size={20} />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">My Task Queue</h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            A high-focus list of your operational tasks and reminders. Stay organized and ensure no lead detail slips through the cracks.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-4">
                        <p className="text-[10px] font-semibold text-slate-400">Completion Rate</p>
                        <h4 className="text-[18px] font-semibold text-emerald-600">{completionRate}%</h4>
                    </div>
                    <Button onClick={openCreate} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none rounded-none">
                        <Plus className="h-4 w-4 mr-2" /> Quick Task
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-sky-50/40 overflow-hidden p-6">
                    <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Active Work Items</h3>
                            <p className="text-[10px] text-slate-500 font-semibold">Showing {filteredTasks.length} of {tasks.length} tasks</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="relative w-56">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                                <Input
                                    placeholder="Search tasks..."
                                    className="pl-9 h-9 rounded-none border-slate-200 bg-white text-[12px]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="h-9 border-slate-200 bg-white text-slate-600 font-semibold px-3 gap-2 rounded-none text-[11px]">
                                        <Filter size={12} className="text-slate-400" /> Filters
                                        {activeFilterCount > 0 && (
                                            <Badge className="bg-indigo-100 text-indigo-600 border-none font-bold text-[9px] h-4 rounded-none">{activeFilterCount}</Badge>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 bg-white border-slate-200 rounded-none p-4 space-y-3" align="end">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[12px] font-bold text-slate-900">Filters</h4>
                                        {activeFilterCount > 0 && (
                                            <Button variant="ghost" size="sm" className="h-6 text-[10px] text-rose-500" onClick={clearFilters}>Clear</Button>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase">Priority</Label>
                                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                            <SelectTrigger className="h-9 rounded-none border-slate-200 text-[12px]"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-white rounded-none">
                                                <SelectItem value="all">All Priorities</SelectItem>
                                                <SelectItem value="Critical">Critical</SelectItem>
                                                <SelectItem value="High">High</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="Low">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase">Status</Label>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="h-9 rounded-none border-slate-200 text-[12px]"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-white rounded-none">
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredTasks.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 text-[13px] font-medium">No tasks match your filters.</div>
                        ) : filteredTasks.map((task) => (
                            <div key={task.id} className="flex items-center justify-between p-5 rounded-none bg-white border border-slate-100 group hover:border-indigo-200 hover:shadow-md transition-all">
                                <div className="flex items-center gap-5">
                                    <div
                                        className={`h-6 w-6 rounded-none border-2 flex items-center justify-center transition-colors cursor-pointer ${task.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 group-hover:border-indigo-400'}`}
                                        onClick={() => toggleTask(task.id)}
                                    >
                                        {task.completed && <CheckCircle2 size={14} />}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className={`text-[15px] font-semibold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</h4>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className="text-[9px] font-semibold text-indigo-600 border-indigo-100 bg-indigo-50/40 rounded-none">{task.lead}</Badge>
                                            <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${task.deadline === 'Overdue' ? 'text-rose-500' : 'text-slate-400'}`}>
                                                <Clock size={12} /> {task.deadline}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-[11px] font-semibold italic ${task.priority === 'Critical' ? 'text-rose-500' : task.priority === 'High' ? 'text-amber-500' : task.priority === 'Medium' ? 'text-indigo-500' : 'text-slate-400'}`}>
                                        {task.priority}
                                    </span>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-300 hover:text-slate-900 transition-colors rounded-none">
                                                <MoreHorizontal size={18} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-white border-slate-200 rounded-none">
                                            <DropdownMenuItem onClick={() => openEdit(task)} className="text-[12px] cursor-pointer">
                                                <Edit2 size={12} className="mr-2" /> Edit Task
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => toggleTask(task.id)} className="text-[12px] cursor-pointer">
                                                <CheckCircle2 size={12} className="mr-2" /> Toggle Complete
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(task.id)} className="text-[12px] text-rose-600 cursor-pointer">
                                                <Trash2 size={12} className="mr-2" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="lg:col-span-4 space-y-5">
                    <Card className="border-none shadow-sm ring-1 ring-indigo-100 rounded-none bg-indigo-50 text-slate-900 p-6 space-y-6 flex flex-col">
                        <div className="space-y-1">
                            <p className="text-[11px] font-semibold text-indigo-600 tracking-wider">Focus Session</p>
                            <h3 className="text-[20px] font-semibold tracking-tight">Tasks Blitz Mode</h3>
                        </div>
                        <div className="text-center py-2">
                            <h2 className="text-[42px] font-semibold tabular-nums text-indigo-600">{formatTime(timeLeft)}</h2>
                            <p className="text-[12px] text-slate-400 font-semibold tracking-widest uppercase">
                                {isFocusRunning ? "In Progress" : timeLeft === 0 ? "Time's Up!" : "Ready"}
                            </p>
                        </div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    onClick={() => setIsFocusRunning(!isFocusRunning)}
                                    className="h-10 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold rounded-none border-none shadow-md"
                                >
                                    {isFocusRunning ? <><Pause size={14} className="mr-2" /> Pause</> : <><Play size={14} className="mr-2 fill-current" /> Start</>}
                                </Button>
                                <Button
                                    onClick={() => { setIsFocusRunning(false); setTimeLeft(1499) }}
                                    variant="outline"
                                    className="h-10 bg-white text-indigo-600 border-indigo-200 font-semibold rounded-none"
                                >
                                    <RotateCcw size={14} className="mr-2" /> Reset
                                </Button>
                            </div>
                            <p className="text-[11px] text-slate-500 text-center font-medium leading-relaxed italic">
                                "Focusing on High-Priority tasks first increases throughput by 62%."
                            </p>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-cyan-50/50 p-6 space-y-5">
                        <h4 className="text-[14px] font-semibold text-slate-900 tracking-tight">Today's Goal</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-[12px] font-semibold text-slate-600">{tasks.filter(t => t.completed).length} / {tasks.length} Tasks</span>
                                <span className="text-[12px] font-semibold text-indigo-600">{completionRate}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white rounded-none overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: `${completionRate}%` }} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 rounded-none bg-emerald-50 border border-emerald-100 space-y-1">
                                <p className="text-[9px] font-semibold text-emerald-600 tracking-wide">Avg Finish</p>
                                <h4 className="text-[18px] font-semibold text-emerald-700">1.2h</h4>
                            </div>
                            <div className="p-4 rounded-none bg-amber-50 border border-amber-100 space-y-1">
                                <p className="text-[9px] font-semibold text-amber-600 tracking-wide">Streak</p>
                                <h4 className="text-[18px] font-semibold text-amber-700">4 Days</h4>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md bg-white p-0 rounded-none border-l border-slate-200">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="p-6 border-b border-slate-100 bg-amber-50/60">
                            <SheetTitle className="text-[18px] font-bold text-slate-900 tracking-tight">
                                {editingId ? "Edit Task" : "Create Quick Task"}
                            </SheetTitle>
                            <p className="text-[12px] text-slate-500 font-medium">
                                {editingId ? "Update task details below." : "Add a new operational task to your queue."}
                            </p>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Task Title *</Label>
                                <Input
                                    placeholder="What needs to be done?"
                                    className={`h-11 rounded-none border-slate-200 ${errors.title ? "border-rose-400" : ""}`}
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                />
                                {errors.title && <p className="text-[11px] text-rose-500 font-medium">{errors.title}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Associated Lead *</Label>
                                <Input
                                    placeholder="Lead full name (letters only)"
                                    className={`h-11 rounded-none border-slate-200 ${errors.lead ? "border-rose-400" : ""}`}
                                    value={form.lead}
                                    onChange={(e) => setForm({ ...form, lead: e.target.value })}
                                />
                                {errors.lead && <p className="text-[11px] text-rose-500 font-medium">{errors.lead}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Deadline *</Label>
                                <Input
                                    placeholder="e.g., Today, 5:00 PM"
                                    className={`h-11 rounded-none border-slate-200 ${errors.deadline ? "border-rose-400" : ""}`}
                                    value={form.deadline}
                                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                                />
                                {errors.deadline && <p className="text-[11px] text-rose-500 font-medium">{errors.deadline}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Priority</Label>
                                <Select value={form.priority} onValueChange={(val) => setForm({ ...form, priority: val })}>
                                    <SelectTrigger className="h-11 rounded-none border-slate-200"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-white rounded-none">
                                        <SelectItem value="Critical">Critical</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <SheetFooter className="p-6 border-t border-slate-100 bg-slate-50/50 flex-row gap-3">
                            <Button variant="outline" className="flex-1 h-11 rounded-none border-slate-200 font-semibold" onClick={() => setIsFormOpen(false)}>
                                Cancel
                            </Button>
                            <Button className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-none" onClick={handleSubmit}>
                                {editingId ? "Save Changes" : "Add to Queue"}
                            </Button>
                        </SheetFooter>
                    </div>
                </SheetContent>
            </Sheet>

        </div>
    )
}
