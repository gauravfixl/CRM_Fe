"use client"

import React, { useState, useMemo, useCallback } from "react"
import {
    ChevronLeft, ChevronRight, Plus, Search, Filter, Calendar as CalendarIcon,
    Clock, AlertTriangle, CalendarCheck, CalendarX, X, Bug, BookOpen,
    CheckSquare, Layers, ListTree
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger, DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import { useIssueStore, type Issue, type IssueStatus, type IssuePriority, type IssueType } from "@/shared/data/issue-store"
import { useSprintEpicStore } from "@/shared/data/sprint-epic-store"

const ALL_STATUSES: IssueStatus[] = ["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "TESTING", "DONE", "BLOCKED"]
const ALL_PRIORITIES: IssuePriority[] = ["URGENT", "HIGH", "MEDIUM", "LOW"]
const ALL_TYPES: IssueType[] = ["TASK", "BUG", "STORY", "EPIC", "SUBTASK"]
const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const HOURS = Array.from({ length: 24 }, (_, i) => i)

type ViewMode = "month" | "week"

const priorityChipColor: Record<string, string> = {
    URGENT: "bg-red-500 text-white", HIGH: "bg-orange-400 text-white",
    MEDIUM: "bg-blue-400 text-white", LOW: "bg-zinc-300 text-zinc-700",
}

const typeIcon: Record<string, React.ReactNode> = {
    TASK: <CheckSquare className="w-2.5 h-2.5" />,
    BUG: <Bug className="w-2.5 h-2.5" />,
    STORY: <BookOpen className="w-2.5 h-2.5" />,
    EPIC: <Layers className="w-2.5 h-2.5" />,
    SUBTASK: <ListTree className="w-2.5 h-2.5" />,
}

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
    const day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1 // Monday = 0
}

function isSameDay(d1: Date, d2: Date) {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

function getWeekDates(date: Date): Date[] {
    const d = new Date(date)
    const day = d.getDay()
    const diff = day === 0 ? 6 : day - 1
    d.setDate(d.getDate() - diff)
    return Array.from({ length: 7 }, (_, i) => {
        const wd = new Date(d)
        wd.setDate(d.getDate() + i)
        return wd
    })
}

export default function CalendarViewPage() {
    const { issues, updateIssue, addIssue } = useIssueStore()
    const { sprints } = useSprintEpicStore()
    const today = new Date()

    const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
    const [viewMode, setViewMode] = useState<ViewMode>("month")
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
    const [detailOpen, setDetailOpen] = useState(false)
    const [createOpen, setCreateOpen] = useState(false)
    const [createDate, setCreateDate] = useState<string>("")
    const [moveDateOpen, setMoveDateOpen] = useState(false)
    const [moveIssueId, setMoveIssueId] = useState<string>("")
    const [moveNewDate, setMoveNewDate] = useState("")

    // Filters
    const [filterAssignee, setFilterAssignee] = useState<string>("all")
    const [filterPriority, setFilterPriority] = useState<string>("all")
    const [filterStatus, setFilterStatus] = useState<string>("all")

    // Create form
    const [newTitle, setNewTitle] = useState("")
    const [newType, setNewType] = useState<IssueType>("TASK")
    const [newPriority, setNewPriority] = useState<IssuePriority>("MEDIUM")

    const assignees = useMemo(() => {
        const map = new Map<string, string>()
        issues.forEach(i => { if (i.assignee?.name) map.set(i.assigneeId, i.assignee.name) })
        return Array.from(map.entries())
    }, [issues])

    const filteredIssues = useMemo(() => {
        let list = [...issues]
        if (filterAssignee !== "all") list = list.filter(i => i.assigneeId === filterAssignee)
        if (filterPriority !== "all") list = list.filter(i => i.priority === filterPriority)
        if (filterStatus !== "all") list = list.filter(i => i.status === filterStatus)
        return list
    }, [issues, filterAssignee, filterPriority, filterStatus])

    const scheduledIssues = useMemo(() => filteredIssues.filter(i => i.dueDate), [filteredIssues])
    const unscheduledIssues = useMemo(() => filteredIssues.filter(i => !i.dueDate), [filteredIssues])

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const monthName = currentDate.toLocaleString("default", { month: "long" })

    // Stats
    const stats = useMemo(() => {
        const now = new Date()
        const startOfWeek = new Date(now)
        const dayOfWeek = startOfWeek.getDay()
        startOfWeek.setDate(startOfWeek.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
        startOfWeek.setHours(0, 0, 0, 0)
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(endOfWeek.getDate() + 7)

        const monthIssues = scheduledIssues.filter(i => {
            const d = new Date(i.dueDate!)
            return d.getMonth() === month && d.getFullYear() === year
        })
        const overdue = scheduledIssues.filter(i => new Date(i.dueDate!) < now && i.status !== "DONE")
        const dueThisWeek = scheduledIssues.filter(i => {
            const d = new Date(i.dueDate!)
            return d >= startOfWeek && d < endOfWeek
        })
        return {
            scheduled: monthIssues.length,
            overdue: overdue.length,
            dueThisWeek: dueThisWeek.length,
            unscheduled: unscheduledIssues.length,
        }
    }, [scheduledIssues, unscheduledIssues, month, year])

    const getIssuesForDay = useCallback((date: Date) => {
        return scheduledIssues.filter(i => i.dueDate && isSameDay(new Date(i.dueDate), date))
    }, [scheduledIssues])

    const navigateMonth = (dir: number) => {
        setCurrentDate(new Date(year, month + dir, 1))
    }

    const navigateWeek = (dir: number) => {
        const d = new Date(currentDate)
        d.setDate(d.getDate() + dir * 7)
        setCurrentDate(d)
    }

    const goToToday = () => setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1))

    const openDetail = (issue: Issue) => {
        setSelectedIssue(issue)
        setDetailOpen(true)
    }

    const openCreate = (dateStr: string) => {
        setCreateDate(dateStr)
        setNewTitle("")
        setNewType("TASK")
        setNewPriority("MEDIUM")
        setCreateOpen(true)
    }

    const handleCreate = () => {
        if (!newTitle.trim()) { toast.error("Title is required"); return }
        const id = `ISSUE-${String(issues.length + 1).padStart(2, "0")}`
        addIssue({
            id, projectId: "p1", title: newTitle, description: "", status: "TODO" as IssueStatus,
            priority: newPriority, type: newType, assigneeId: "u1",
            assignee: { name: "John Doe", avatar: "https://i.pravatar.cc/150?u=u1" },
            reporterId: "u1", createdAt: new Date().toISOString(),
            dueDate: createDate ? new Date(createDate).toISOString() : undefined,
            storyPoints: 0, columnOrder: 0, history: []
        })
        setCreateOpen(false)
        toast.success("Issue created on " + (createDate || "no date"))
    }

    const handleMoveDate = () => {
        if (!moveNewDate || !moveIssueId) return
        updateIssue(moveIssueId, { dueDate: new Date(moveNewDate).toISOString() })
        setMoveDateOpen(false)
        toast.success("Due date updated")
    }

    const openMoveDate = (issueId: string) => {
        setMoveIssueId(issueId)
        const issue = issues.find(i => i.id === issueId)
        setMoveNewDate(issue?.dueDate ? issue.dueDate.split("T")[0] : "")
        setMoveDateOpen(true)
    }

    const scheduleUnscheduled = (issueId: string) => {
        setMoveIssueId(issueId)
        setMoveNewDate("")
        setMoveDateOpen(true)
    }

    // Calendar grid
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7
    const prevMonthDays = getDaysInMonth(year, month - 1)

    const calendarCells = useMemo(() => {
        const cells: { date: Date; isCurrentMonth: boolean }[] = []
        for (let i = 0; i < totalCells; i++) {
            if (i < firstDay) {
                const day = prevMonthDays - firstDay + i + 1
                cells.push({ date: new Date(year, month - 1, day), isCurrentMonth: false })
            } else if (i - firstDay < daysInMonth) {
                cells.push({ date: new Date(year, month, i - firstDay + 1), isCurrentMonth: true })
            } else {
                cells.push({ date: new Date(year, month + 1, i - firstDay - daysInMonth + 1), isCurrentMonth: false })
            }
        }
        return cells
    }, [year, month, daysInMonth, firstDay, totalCells, prevMonthDays])

    const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate])

    return (
        <div className="flex flex-col h-full bg-[#fafafa] min-h-screen">
            {/* Breadcrumb */}
            <div className="px-6 pt-5 pb-2">
                <p className="text-[11px] font-semibold uppercase text-zinc-400 tracking-wider">
                    Projects / Calendar
                </p>
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight mt-1">Calendar</h1>
            </div>

            {/* Stats */}
            <div className="px-6 pb-3 grid grid-cols-4 gap-3">
                <SmallCard>
                    <SmallCardHeader className="flex-row items-center gap-2">
                        <CalendarCheck className="w-4 h-4 text-indigo-500" />
                        <span className="text-xs font-medium text-zinc-500">Scheduled this month</span>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <span className="text-lg font-bold text-zinc-900">{stats.scheduled}</span>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard>
                    <SmallCardHeader className="flex-row items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-medium text-zinc-500">Overdue</span>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <span className="text-lg font-bold text-red-600">{stats.overdue}</span>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard>
                    <SmallCardHeader className="flex-row items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-medium text-zinc-500">Due this week</span>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <span className="text-lg font-bold text-zinc-900">{stats.dueThisWeek}</span>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard>
                    <SmallCardHeader className="flex-row items-center gap-2">
                        <CalendarX className="w-4 h-4 text-zinc-400" />
                        <span className="text-xs font-medium text-zinc-500">Unscheduled</span>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <span className="text-lg font-bold text-zinc-900">{stats.unscheduled}</span>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Toolbar */}
            <div className="px-6 pb-3 flex items-center gap-2">
                <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95" onClick={() => viewMode === "month" ? navigateMonth(-1) : navigateWeek(-1)}>
                    <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                <span className="text-sm font-semibold text-zinc-900 min-w-[140px] text-center">
                    {viewMode === "month" ? `${monthName} ${year}` : `Week of ${weekDates[0].toLocaleDateString("default", { month: "short", day: "numeric" })}`}
                </span>
                <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95" onClick={() => viewMode === "month" ? navigateMonth(1) : navigateWeek(1)}>
                    <ChevronRight className="w-3.5 h-3.5" />
                </Button>
                <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95" onClick={goToToday}>
                    Today
                </Button>

                {/* View toggle */}
                <div className="flex border rounded-md overflow-hidden ml-2">
                    <button
                        className={`h-8 px-3 text-xs font-medium transition ${viewMode === "month" ? "bg-indigo-600 text-white" : "bg-white text-zinc-600 hover:bg-zinc-50"}`}
                        onClick={() => setViewMode("month")}
                    >Month</button>
                    <button
                        className={`h-8 px-3 text-xs font-medium transition ${viewMode === "week" ? "bg-indigo-600 text-white" : "bg-white text-zinc-600 hover:bg-zinc-50"}`}
                        onClick={() => setViewMode("week")}
                    >Week</button>
                </div>

                {/* Filters */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 ml-2">
                            <Filter className="w-3.5 h-3.5 mr-1.5" /> Filters
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 p-3 space-y-2" align="start">
                        <DropdownMenuLabel className="text-[11px] font-semibold uppercase text-zinc-400">Assignee</DropdownMenuLabel>
                        <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all" className="text-xs">All</SelectItem>
                                {assignees.map(([id, name]) => <SelectItem key={id} value={id} className="text-xs">{name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <DropdownMenuLabel className="text-[11px] font-semibold uppercase text-zinc-400">Priority</DropdownMenuLabel>
                        <Select value={filterPriority} onValueChange={setFilterPriority}>
                            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all" className="text-xs">All</SelectItem>
                                {ALL_PRIORITIES.map(p => <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <DropdownMenuLabel className="text-[11px] font-semibold uppercase text-zinc-400">Status</DropdownMenuLabel>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all" className="text-xs">All</SelectItem>
                                {ALL_STATUSES.map(s => <SelectItem key={s} value={s} className="text-xs">{s.replace(/_/g, " ")}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex-1" />

                <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => openCreate("")}>
                    <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Issue
                </Button>
            </div>

            {/* Calendar */}
            <div className="px-6 flex-1 flex gap-4 pb-4 overflow-hidden">
                <div className="flex-1 flex flex-col overflow-auto">
                    {viewMode === "month" ? (
                        <>
                            {/* Day headers */}
                            <div className="grid grid-cols-7 border-b bg-white rounded-t-lg">
                                {DAYS_OF_WEEK.map(d => (
                                    <div key={d} className="text-[11px] font-semibold uppercase text-zinc-500 text-center py-2 border-r last:border-r-0">{d}</div>
                                ))}
                            </div>
                            {/* Cells */}
                            <div className="grid grid-cols-7 flex-1 bg-white rounded-b-lg border-l border-b">
                                {calendarCells.map((cell, idx) => {
                                    const dayIssues = getIssuesForDay(cell.date)
                                    const isToday = isSameDay(cell.date, today)
                                    const dateStr = `${cell.date.getFullYear()}-${String(cell.date.getMonth() + 1).padStart(2, "0")}-${String(cell.date.getDate()).padStart(2, "0")}`
                                    return (
                                        <div
                                            key={idx}
                                            className={`border-r border-b min-h-[100px] p-1 relative cursor-pointer hover:bg-zinc-50/50 transition ${!cell.isCurrentMonth ? "bg-zinc-50/40" : ""}`}
                                            onClick={() => openCreate(dateStr)}
                                        >
                                            <div className={`text-[11px] font-medium mb-0.5 ${!cell.isCurrentMonth ? "text-zinc-300" : "text-zinc-600"}`}>
                                                {isToday ? (
                                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                                                        {cell.date.getDate()}
                                                    </span>
                                                ) : cell.date.getDate()}
                                            </div>
                                            <div className="space-y-0.5 overflow-hidden max-h-[72px]">
                                                {dayIssues.slice(0, 3).map(issue => (
                                                    <button
                                                        key={issue.id}
                                                        className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate flex items-center gap-1 ${priorityChipColor[issue.priority]}`}
                                                        onClick={(e) => { e.stopPropagation(); openDetail(issue) }}
                                                    >
                                                        {typeIcon[issue.type]}
                                                        <span className="truncate">{issue.title}</span>
                                                    </button>
                                                ))}
                                                {dayIssues.length > 3 && (
                                                    <span className="text-[9px] text-zinc-400 pl-1">+{dayIssues.length - 3} more</span>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    ) : (
                        /* Week view */
                        <div className="bg-white rounded-lg border overflow-auto flex-1">
                            {/* Header */}
                            <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b sticky top-0 bg-white z-10">
                                <div className="border-r p-1"></div>
                                {weekDates.map((wd, i) => {
                                    const isToday = isSameDay(wd, today)
                                    return (
                                        <div key={i} className="text-center py-2 border-r last:border-r-0">
                                            <div className="text-[10px] text-zinc-400 uppercase">{DAYS_OF_WEEK[i]}</div>
                                            <div className={`text-sm font-bold ${isToday ? "text-indigo-600" : "text-zinc-900"}`}>
                                                {isToday ? (
                                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white">{wd.getDate()}</span>
                                                ) : wd.getDate()}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            {/* Hourly slots */}
                            {HOURS.map(hour => (
                                <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] border-b min-h-[40px]">
                                    <div className="text-[10px] text-zinc-400 text-right pr-2 pt-1 border-r">
                                        {String(hour).padStart(2, "0")}:00
                                    </div>
                                    {weekDates.map((wd, i) => {
                                        const dayIssues = getIssuesForDay(wd)
                                        const dateStr = `${wd.getFullYear()}-${String(wd.getMonth() + 1).padStart(2, "0")}-${String(wd.getDate()).padStart(2, "0")}`
                                        return (
                                            <div
                                                key={i}
                                                className="border-r last:border-r-0 px-0.5 cursor-pointer hover:bg-zinc-50/50"
                                                onClick={() => openCreate(dateStr)}
                                            >
                                                {hour === 9 && dayIssues.map(issue => (
                                                    <button
                                                        key={issue.id}
                                                        className={`w-full text-left px-1 py-0.5 rounded text-[9px] font-medium truncate mb-0.5 ${priorityChipColor[issue.priority]}`}
                                                        onClick={(e) => { e.stopPropagation(); openDetail(issue) }}
                                                    >
                                                        {issue.title}
                                                    </button>
                                                ))}
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Side panel: unscheduled issues */}
                <div className="w-56 flex-shrink-0 bg-white rounded-lg border overflow-auto">
                    <div className="p-3 border-b">
                        <h3 className="text-xs font-semibold text-zinc-900">Unscheduled</h3>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{unscheduledIssues.length} issues without due date</p>
                    </div>
                    <div className="p-2 space-y-1.5">
                        {unscheduledIssues.map(issue => (
                            <div key={issue.id} className="p-2 rounded border hover:bg-zinc-50 transition group">
                                <div className="flex items-center gap-1 mb-1">
                                    {typeIcon[issue.type]}
                                    <span className="text-[10px] font-mono text-zinc-400">{issue.id}</span>
                                </div>
                                <p className="text-[11px] font-medium text-zinc-800 truncate">{issue.title}</p>
                                <div className="flex items-center gap-1 mt-1.5">
                                    <Badge className={`text-[8px] px-1 py-0 ${priorityChipColor[issue.priority]}`}>{issue.priority}</Badge>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-5 text-[9px] px-1 ml-auto opacity-0 group-hover:opacity-100 transition"
                                        onClick={() => scheduleUnscheduled(issue.id)}
                                    >
                                        Schedule
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {unscheduledIssues.length === 0 && (
                            <p className="text-[10px] text-zinc-400 text-center py-4">All issues scheduled</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Issue detail dialog */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                            {selectedIssue && typeIcon[selectedIssue.type]}
                            {selectedIssue?.id}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedIssue && (
                        <div className="space-y-3 py-2">
                            <div>
                                <label className="text-[11px] font-semibold uppercase text-zinc-400">Title</label>
                                <p className="text-xs text-zinc-900 font-medium">{selectedIssue.title}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-semibold uppercase text-zinc-400">Status</label>
                                    <Select
                                        value={selectedIssue.status}
                                        onValueChange={(v) => {
                                            updateIssue(selectedIssue.id, { status: v as IssueStatus })
                                            setSelectedIssue({ ...selectedIssue, status: v as IssueStatus })
                                            toast.success("Status updated")
                                        }}
                                    >
                                        <SelectTrigger className="h-7 text-xs mt-1"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {ALL_STATUSES.map(s => <SelectItem key={s} value={s} className="text-xs">{s.replace(/_/g, " ")}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-[11px] font-semibold uppercase text-zinc-400">Priority</label>
                                    <Select
                                        value={selectedIssue.priority}
                                        onValueChange={(v) => {
                                            updateIssue(selectedIssue.id, { priority: v as IssuePriority })
                                            setSelectedIssue({ ...selectedIssue, priority: v as IssuePriority })
                                            toast.success("Priority updated")
                                        }}
                                    >
                                        <SelectTrigger className="h-7 text-xs mt-1"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {ALL_PRIORITIES.map(p => <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <label className="text-[11px] font-semibold uppercase text-zinc-400">Assignee</label>
                                <p className="text-xs text-zinc-700">{selectedIssue.assignee?.name ?? "Unassigned"}</p>
                            </div>
                            <div>
                                <label className="text-[11px] font-semibold uppercase text-zinc-400">Due Date</label>
                                <p className="text-xs text-zinc-700">{selectedIssue.dueDate ? new Date(selectedIssue.dueDate).toLocaleDateString() : "Not set"}</p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        {selectedIssue && (
                            <Button variant="outline" className="h-8 text-xs" onClick={() => { openMoveDate(selectedIssue.id); setDetailOpen(false) }}>
                                Move Due Date
                            </Button>
                        )}
                        <Button variant="outline" className="h-8 text-xs" onClick={() => setDetailOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Move due date dialog */}
            <Dialog open={moveDateOpen} onOpenChange={setMoveDateOpen}>
                <DialogContent className="max-w-xs">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900">Move Due Date</DialogTitle>
                    </DialogHeader>
                    <div className="py-2">
                        <label className="text-xs font-medium text-zinc-700 mb-1 block">New Date</label>
                        <Input type="date" value={moveNewDate} onChange={e => setMoveNewDate(e.target.value)} className="h-8 text-xs" />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 text-xs" onClick={() => setMoveDateOpen(false)}>Cancel</Button>
                        <Button className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleMoveDate}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create issue dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900">
                            Create Issue {createDate ? `for ${new Date(createDate).toLocaleDateString()}` : ""}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        <div>
                            <label className="text-xs font-medium text-zinc-700 mb-1 block">Title</label>
                            <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Issue title..." className="h-8 text-xs" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs font-medium text-zinc-700 mb-1 block">Type</label>
                                <Select value={newType} onValueChange={v => setNewType(v as IssueType)}>
                                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {ALL_TYPES.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-zinc-700 mb-1 block">Priority</label>
                                <Select value={newPriority} onValueChange={v => setNewPriority(v as IssuePriority)}>
                                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {ALL_PRIORITIES.map(p => <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {!createDate && (
                            <div>
                                <label className="text-xs font-medium text-zinc-700 mb-1 block">Due Date</label>
                                <Input type="date" value={createDate} onChange={e => setCreateDate(e.target.value)} className="h-8 text-xs" />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 text-xs" onClick={() => setCreateOpen(false)}>Cancel</Button>
                        <Button className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleCreate}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
