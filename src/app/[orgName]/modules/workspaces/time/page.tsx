"use client"

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react"
import {
    Timer, Search, Plus, MoreHorizontal, Clock, Play, Square, Pencil, Trash2,
    Calendar, Download, ChevronLeft, ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/shared/components/ui/dropdown-menu"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import { useIssueStore } from "@/shared/data/issue-store"

interface WorkLog {
    id: string
    taskId: string
    taskTitle: string
    projectId: string
    user: string
    date: string
    hours: number
    minutes: number
    description: string
    billable: boolean
}

const CURRENT_USER = "John Doe"
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function fmtDuration(h: number, m: number) {
    return `${h}h ${String(m).padStart(2, "0")}m`
}

function fmtElapsed(seconds: number) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

function todayStr() {
    return new Date().toISOString().slice(0, 10)
}

function getWeekDates(offset: number): string[] {
    const now = new Date()
    const day = now.getDay()
    const mon = new Date(now)
    mon.setDate(now.getDate() - ((day === 0 ? 6 : day - 1)) + offset * 7)
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(mon)
        d.setDate(mon.getDate() + i)
        return d.toISOString().slice(0, 10)
    })
}

export default function TimeTrackingPage() {
    const issues = useIssueStore((s) => s.issues)

    // Work logs state
    const [logs, setLogs] = useState<WorkLog[]>([
        { id: "wl-1", taskId: "ISSUE-01", taskTitle: "Implement Auth Middleware", projectId: "p1", user: "John Doe", date: todayStr(), hours: 2, minutes: 30, description: "JWT middleware implementation", billable: true },
        { id: "wl-2", taskId: "ISSUE-02", taskTitle: "UI Responsive Review", projectId: "p1", user: "Jane Smith", date: todayStr(), hours: 1, minutes: 45, description: "Reviewed mobile breakpoints", billable: true },
        { id: "wl-3", taskId: "ISSUE-03", taskTitle: "Fix Sidebar Z-Index", projectId: "p1", user: "John Doe", date: new Date(Date.now() - 86400000).toISOString().slice(0, 10), hours: 3, minutes: 0, description: "Z-index debugging", billable: false },
    ])

    // Timer state
    const [timerRunning, setTimerRunning] = useState(false)
    const [timerSeconds, setTimerSeconds] = useState(0)
    const [timerTaskId, setTimerTaskId] = useState("")
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // Dialog state
    const [logDialogOpen, setLogDialogOpen] = useState(false)
    const [editingLog, setEditingLog] = useState<WorkLog | null>(null)
    const [logForm, setLogForm] = useState({ taskId: "", hours: "1", minutes: "0", date: todayStr(), description: "", billable: true })

    // Search & filters
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState("my")

    // Timesheet
    const [weekOffset, setWeekOffset] = useState(0)
    const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset])

    // Timer logic
    useEffect(() => {
        if (timerRunning) {
            intervalRef.current = setInterval(() => setTimerSeconds(s => s + 1), 1000)
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
    }, [timerRunning])

    const startTimer = useCallback(() => {
        if (!timerTaskId) { toast.error("Select a task first"); return }
        setTimerSeconds(0)
        setTimerRunning(true)
        toast.success("Timer started")
    }, [timerTaskId])

    const stopTimer = useCallback(() => {
        setTimerRunning(false)
        const h = Math.floor(timerSeconds / 3600)
        const m = Math.floor((timerSeconds % 3600) / 60)
        if (timerSeconds < 60) { toast("Timer stopped — less than 1 minute, not logged"); return }
        const task = issues.find(i => i.id === timerTaskId)
        const newLog: WorkLog = {
            id: `wl-${Date.now()}`,
            taskId: timerTaskId,
            taskTitle: task?.title || timerTaskId,
            projectId: task?.projectId || "",
            user: CURRENT_USER,
            date: todayStr(),
            hours: h,
            minutes: m,
            description: "Logged via timer",
            billable: true,
        }
        setLogs(prev => [newLog, ...prev])
        setTimerSeconds(0)
        toast.success(`Logged ${fmtDuration(h, m)} to ${task?.title || timerTaskId}`)
    }, [timerSeconds, timerTaskId, issues])

    // Log work dialog
    const openLogDialog = useCallback((log?: WorkLog) => {
        if (log) {
            setEditingLog(log)
            setLogForm({ taskId: log.taskId, hours: String(log.hours), minutes: String(log.minutes), date: log.date, description: log.description, billable: log.billable })
        } else {
            setEditingLog(null)
            setLogForm({ taskId: "", hours: "1", minutes: "0", date: todayStr(), description: "", billable: true })
        }
        setLogDialogOpen(true)
    }, [])

    const saveLog = useCallback(() => {
        const hours = parseInt(logForm.hours) || 0
        const minutes = parseInt(logForm.minutes) || 0
        if (!logForm.taskId) { toast.error("Select a task"); return }
        if (hours === 0 && minutes === 0) { toast.error("Enter time spent"); return }
        const task = issues.find(i => i.id === logForm.taskId)
        if (editingLog) {
            setLogs(prev => prev.map(l => l.id === editingLog.id ? { ...l, taskId: logForm.taskId, taskTitle: task?.title || logForm.taskId, hours, minutes, date: logForm.date, description: logForm.description, billable: logForm.billable } : l))
            toast.success("Work log updated")
        } else {
            const newLog: WorkLog = {
                id: `wl-${Date.now()}`,
                taskId: logForm.taskId,
                taskTitle: task?.title || logForm.taskId,
                projectId: task?.projectId || "",
                user: CURRENT_USER,
                date: logForm.date,
                hours,
                minutes,
                description: logForm.description,
                billable: logForm.billable,
            }
            setLogs(prev => [newLog, ...prev])
            toast.success("Work logged successfully")
        }
        setLogDialogOpen(false)
    }, [logForm, editingLog, issues])

    const deleteLog = useCallback((id: string) => {
        setLogs(prev => prev.filter(l => l.id !== id))
        toast.success("Work log deleted")
    }, [])

    // Stats
    const totalThisWeek = useMemo(() => {
        const thisWeek = getWeekDates(0)
        return logs.filter(l => thisWeek.includes(l.date)).reduce((s, l) => s + l.hours * 60 + l.minutes, 0)
    }, [logs])

    const myToday = useMemo(() => {
        return logs.filter(l => l.user === CURRENT_USER && l.date === todayStr()).reduce((s, l) => s + l.hours * 60 + l.minutes, 0)
    }, [logs])

    const billableTotal = useMemo(() => {
        return logs.filter(l => l.billable).reduce((s, l) => s + l.hours * 60 + l.minutes, 0)
    }, [logs])

    // Filtered logs
    const filteredLogs = useMemo(() => {
        let filtered = logs
        if (activeTab === "my") filtered = filtered.filter(l => l.user === CURRENT_USER)
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            filtered = filtered.filter(l => l.taskTitle.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || l.user.toLowerCase().includes(q))
        }
        return filtered.sort((a, b) => b.date.localeCompare(a.date))
    }, [logs, activeTab, searchQuery])

    // Project breakdown
    const projectBreakdown = useMemo(() => {
        const map: Record<string, { name: string; totalMin: number }> = {}
        logs.forEach(l => {
            const pid = l.projectId || "Unknown"
            if (!map[pid]) map[pid] = { name: pid, totalMin: 0 }
            map[pid].totalMin += l.hours * 60 + l.minutes
        })
        return Object.values(map).sort((a, b) => b.totalMin - a.totalMin)
    }, [logs])

    const maxProjectMin = useMemo(() => Math.max(...projectBreakdown.map(p => p.totalMin), 1), [projectBreakdown])

    // Person breakdown
    const personBreakdown = useMemo(() => {
        const map: Record<string, number> = {}
        logs.forEach(l => { map[l.user] = (map[l.user] || 0) + l.hours * 60 + l.minutes })
        return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([name, totalMin]) => ({ name, totalMin }))
    }, [logs])

    const maxPersonMin = useMemo(() => Math.max(...personBreakdown.map(p => p.totalMin), 1), [personBreakdown])

    // Timesheet: tasks in current week
    const timesheetTasks = useMemo(() => {
        const taskIds = [...new Set(logs.filter(l => l.user === CURRENT_USER && weekDates.some(d => l.date === d)).map(l => l.taskId))]
        return taskIds.map(tid => {
            const taskLogs = logs.filter(l => l.taskId === tid && l.user === CURRENT_USER)
            const title = taskLogs[0]?.taskTitle || tid
            const byDay: Record<string, number> = {}
            weekDates.forEach(d => { byDay[d] = 0 })
            taskLogs.forEach(l => { if (byDay[l.date] !== undefined) byDay[l.date] += l.hours * 60 + l.minutes })
            const total = Object.values(byDay).reduce((s, v) => s + v, 0)
            return { taskId: tid, title, byDay, total }
        })
    }, [logs, weekDates])

    const dayTotals = useMemo(() => {
        return weekDates.map(d => timesheetTasks.reduce((s, t) => s + (t.byDay[d] || 0), 0))
    }, [timesheetTasks, weekDates])

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* BREADCRUMB & HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>PROJECTS</span><span>/</span>
                    <span className="text-zinc-900 font-semibold">TIME TRACKING</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Timesheets & Logs</h1>
                        <p className="text-xs text-zinc-500 font-medium">Track time across tasks and projects.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button className="h-8 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95" onClick={() => timerRunning ? stopTimer() : startTimer()}>
                            {timerRunning ? <Square className="w-3.5 h-3.5 mr-2" /> : <Play className="w-3.5 h-3.5 mr-2" />}
                            {timerRunning ? "Stop Timer" : "Start Timer"}
                        </Button>
                        <Button variant="outline" className="h-8 rounded-md border-zinc-200 text-xs font-medium px-3 shadow-sm active:scale-95" onClick={() => openLogDialog()}>
                            <Plus className="w-3.5 h-3.5 mr-2" />Log Work
                        </Button>
                    </div>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-emerald-500 to-emerald-700 border-none text-white shadow-[0_8px_30px_rgb(16,185,129,0.3)] hover:shadow-[0_20px_40px_rgba(5,150,105,0.4)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Total Hours This Week</p>
                        <Timer className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">{fmtDuration(Math.floor(totalThisWeek / 60), totalThisWeek % 60)}</p>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-gradient-to-br from-indigo-500 to-indigo-700 border-none text-white shadow-[0_8px_30px_rgb(99,102,241,0.3)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">My Hours Today</p>
                        <Clock className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">{fmtDuration(Math.floor(myToday / 60), myToday % 60)}</p>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-gradient-to-br from-amber-500 to-amber-700 border-none text-white shadow-[0_8px_30px_rgb(245,158,11,0.3)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Billable Hours</p>
                        <Calendar className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">{fmtDuration(Math.floor(billableTotal / 60), billableTotal % 60)}</p>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className={`border-none text-white shadow-[0_8px_30px_rgb(139,92,246,0.3)] hover:-translate-y-1 transform transition-all duration-300 ${timerRunning ? "bg-gradient-to-br from-rose-500 to-rose-700" : "bg-gradient-to-br from-violet-500 to-violet-700"}`}>
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Active Timer</p>
                        <Timer className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md font-mono">{timerRunning ? fmtElapsed(timerSeconds) : "00:00:00"}</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* ACTIVE TIMER SECTION */}
            {timerRunning && (
                <div className="bg-white rounded-lg border border-rose-200 shadow-sm p-4 flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs font-medium text-zinc-700">Timer running on:</span>
                    <span className="text-xs font-bold text-zinc-900">{issues.find(i => i.id === timerTaskId)?.title || timerTaskId}</span>
                    <span className="text-sm font-mono font-bold text-rose-600 ml-auto">{fmtElapsed(timerSeconds)}</span>
                    <Button size="sm" className="h-7 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-medium px-2.5 active:scale-95" onClick={stopTimer}>
                        <Square className="w-3 h-3 mr-1" />Stop
                    </Button>
                </div>
            )}

            {/* TIMER TASK SELECTOR */}
            {!timerRunning && (
                <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-4 flex items-center gap-3">
                    <span className="text-xs font-medium text-zinc-500">Timer task:</span>
                    <Select value={timerTaskId} onValueChange={setTimerTaskId}>
                        <SelectTrigger className="h-8 w-64 text-xs font-medium border-zinc-200">
                            <SelectValue placeholder="Select task for timer" />
                        </SelectTrigger>
                        <SelectContent>
                            {issues.map(i => (
                                <SelectItem key={i.id} value={i.id} className="text-xs">{i.id} — {i.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* WORK LOG TABLE */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                        <TabsList className="bg-zinc-100/60 h-8">
                            <TabsTrigger value="my" className="text-[11px] font-medium h-7 px-3">My Logs</TabsTrigger>
                            <TabsTrigger value="team" className="text-[11px] font-medium h-7 px-3">Team Logs</TabsTrigger>
                            <TabsTrigger value="all" className="text-[11px] font-medium h-7 px-3">All Logs</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                        <Input placeholder="Search logs..." className="pl-9 h-8 bg-white border-zinc-200 rounded-md text-xs font-medium" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                </div>
                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="py-2.5 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Task</TableHead>
                            <TableHead className="py-2.5 font-semibold text-[11px] text-zinc-500 uppercase">Project</TableHead>
                            <TableHead className="py-2.5 font-semibold text-[11px] text-zinc-500 uppercase">User</TableHead>
                            <TableHead className="py-2.5 font-semibold text-[11px] text-zinc-500 uppercase">Date</TableHead>
                            <TableHead className="py-2.5 font-semibold text-[11px] text-zinc-500 uppercase text-right">Duration</TableHead>
                            <TableHead className="py-2.5 font-semibold text-[11px] text-zinc-500 uppercase">Description</TableHead>
                            <TableHead className="py-2.5 font-semibold text-[11px] text-zinc-500 uppercase text-right pr-4">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLogs.length === 0 && (
                            <TableRow><TableCell colSpan={7} className="text-center py-8 text-xs text-zinc-400">No work logs found</TableCell></TableRow>
                        )}
                        {filteredLogs.map(l => (
                            <TableRow key={l.id} className="hover:bg-zinc-50/50 transition-colors">
                                <TableCell className="py-2.5 px-4">
                                    <span className="text-xs font-bold text-zinc-900">{l.taskTitle}</span>
                                    {l.billable && <Badge className="ml-2 text-[9px] bg-emerald-100 text-emerald-700 font-semibold">Billable</Badge>}
                                </TableCell>
                                <TableCell className="py-2.5"><span className="text-xs text-zinc-600 font-medium">{l.projectId}</span></TableCell>
                                <TableCell className="py-2.5"><span className="text-xs text-zinc-600 font-medium">{l.user}</span></TableCell>
                                <TableCell className="py-2.5"><span className="text-[10px] font-mono text-zinc-500">{l.date}</span></TableCell>
                                <TableCell className="py-2.5 text-right"><span className="text-xs font-bold font-mono text-zinc-900">{fmtDuration(l.hours, l.minutes)}</span></TableCell>
                                <TableCell className="py-2.5"><span className="text-xs text-zinc-500 italic">{l.description}</span></TableCell>
                                <TableCell className="py-2.5 text-right pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md">
                                                <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40 shadow-xl border-zinc-100">
                                            <DropdownMenuItem onClick={() => openLogDialog(l)}>
                                                <Pencil className="w-3.5 h-3.5 mr-2" />Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-rose-600" onClick={() => deleteLog(l.id)}>
                                                <Trash2 className="w-3.5 h-3.5 mr-2" />Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* TIME SUMMARY CARDS */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Per-project breakdown */}
                <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-5">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4">By Project</h3>
                    <div className="flex flex-col gap-2.5">
                        {projectBreakdown.map((p, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <span className="text-xs font-medium text-zinc-700 w-24 truncate">{p.name}</span>
                                <div className="flex-1 h-5 bg-zinc-100 rounded-sm overflow-hidden">
                                    <div className="h-full bg-indigo-500 rounded-sm flex items-center justify-end pr-2 transition-all" style={{ width: `${(p.totalMin / maxProjectMin) * 100}%`, minWidth: 32 }}>
                                        <span className="text-[9px] font-bold text-white">{fmtDuration(Math.floor(p.totalMin / 60), p.totalMin % 60)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Per-person breakdown */}
                <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-5">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4">By Person</h3>
                    <div className="flex flex-col gap-2.5">
                        {personBreakdown.map((p, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <span className="text-xs font-medium text-zinc-700 w-24 truncate">{p.name}</span>
                                <div className="flex-1 h-5 bg-zinc-100 rounded-sm overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-sm flex items-center justify-end pr-2 transition-all" style={{ width: `${(p.totalMin / maxPersonMin) * 100}%`, minWidth: 32 }}>
                                        <span className="text-[9px] font-bold text-white">{fmtDuration(Math.floor(p.totalMin / 60), p.totalMin % 60)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* WEEKLY TIMESHEET */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Weekly Timesheet</h3>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setWeekOffset(w => w - 1)}>
                            <ChevronLeft className="w-4 h-4 text-zinc-500" />
                        </Button>
                        <span className="text-[10px] font-medium text-zinc-500">{weekDates[0]} — {weekDates[6]}</span>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setWeekOffset(w => w + 1)}>
                            <ChevronRight className="w-4 h-4 text-zinc-500" />
                        </Button>
                        {weekOffset !== 0 && (
                            <Button variant="outline" size="sm" className="h-7 text-[10px] px-2" onClick={() => setWeekOffset(0)}>Today</Button>
                        )}
                    </div>
                </div>
                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="py-2 px-4 font-semibold text-[11px] text-zinc-500 uppercase w-48">Task</TableHead>
                            {DAYS.map((d, i) => (
                                <TableHead key={d} className="py-2 font-semibold text-[11px] text-zinc-500 uppercase text-center w-20">
                                    <div>{d}</div>
                                    <div className="text-[9px] text-zinc-400 font-normal">{weekDates[i]?.slice(5)}</div>
                                </TableHead>
                            ))}
                            <TableHead className="py-2 font-semibold text-[11px] text-zinc-500 uppercase text-right pr-4">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {timesheetTasks.length === 0 && (
                            <TableRow><TableCell colSpan={9} className="text-center py-6 text-xs text-zinc-400">No time logged this week</TableCell></TableRow>
                        )}
                        {timesheetTasks.map(t => (
                            <TableRow key={t.taskId} className="hover:bg-zinc-50/50">
                                <TableCell className="py-2 px-4 text-xs font-medium text-zinc-700 truncate max-w-[12rem]">{t.title}</TableCell>
                                {weekDates.map(d => (
                                    <TableCell key={d} className="py-2 text-center">
                                        <span className={`text-[11px] font-mono ${t.byDay[d] > 0 ? "font-bold text-zinc-900" : "text-zinc-300"}`}>
                                            {t.byDay[d] > 0 ? fmtDuration(Math.floor(t.byDay[d] / 60), t.byDay[d] % 60) : "—"}
                                        </span>
                                    </TableCell>
                                ))}
                                <TableCell className="py-2 text-right pr-4">
                                    <span className="text-xs font-bold font-mono text-indigo-600">{fmtDuration(Math.floor(t.total / 60), t.total % 60)}</span>
                                </TableCell>
                            </TableRow>
                        ))}
                        {/* Day totals row */}
                        {timesheetTasks.length > 0 && (
                            <TableRow className="bg-zinc-50 border-t border-zinc-200">
                                <TableCell className="py-2 px-4 text-xs font-bold text-zinc-900">Total</TableCell>
                                {dayTotals.map((t, i) => (
                                    <TableCell key={i} className="py-2 text-center">
                                        <span className="text-[11px] font-bold font-mono text-zinc-900">{t > 0 ? fmtDuration(Math.floor(t / 60), t % 60) : "—"}</span>
                                    </TableCell>
                                ))}
                                <TableCell className="py-2 text-right pr-4">
                                    <span className="text-xs font-bold font-mono text-indigo-600">
                                        {fmtDuration(Math.floor(dayTotals.reduce((s, v) => s + v, 0) / 60), dayTotals.reduce((s, v) => s + v, 0) % 60)}
                                    </span>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* LOG WORK DIALOG */}
            <Dialog open={logDialogOpen} onOpenChange={setLogDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-bold text-zinc-900">{editingLog ? "Edit Work Log" : "Log Work"}</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">Record time spent on a task.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-2">
                        <div>
                            <label className="text-xs font-medium text-zinc-700 mb-1 block">Task</label>
                            <Select value={logForm.taskId} onValueChange={(v) => setLogForm(f => ({ ...f, taskId: v }))}>
                                <SelectTrigger className="h-8 text-xs border-zinc-200">
                                    <SelectValue placeholder="Select task" />
                                </SelectTrigger>
                                <SelectContent>
                                    {issues.map(i => (
                                        <SelectItem key={i.id} value={i.id} className="text-xs">{i.id} — {i.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-zinc-700 mb-1 block">Hours</label>
                                <Input type="number" min="0" max="24" className="h-8 text-xs border-zinc-200" value={logForm.hours} onChange={(e) => setLogForm(f => ({ ...f, hours: e.target.value }))} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-zinc-700 mb-1 block">Minutes</label>
                                <Input type="number" min="0" max="59" className="h-8 text-xs border-zinc-200" value={logForm.minutes} onChange={(e) => setLogForm(f => ({ ...f, minutes: e.target.value }))} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-zinc-700 mb-1 block">Date</label>
                            <Input type="date" className="h-8 text-xs border-zinc-200" value={logForm.date} onChange={(e) => setLogForm(f => ({ ...f, date: e.target.value }))} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-zinc-700 mb-1 block">Description</label>
                            <Input className="h-8 text-xs border-zinc-200" placeholder="What did you work on?" value={logForm.description} onChange={(e) => setLogForm(f => ({ ...f, description: e.target.value }))} />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="billable" checked={logForm.billable} onChange={(e) => setLogForm(f => ({ ...f, billable: e.target.checked }))} className="rounded border-zinc-300" />
                            <label htmlFor="billable" className="text-xs font-medium text-zinc-700">Billable</label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setLogDialogOpen(false)}>Cancel</Button>
                        <Button className="h-8 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95" onClick={saveLog}>
                            {editingLog ? "Update" : "Log Work"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
