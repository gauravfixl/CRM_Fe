"use client"

import React, { useState, useEffect } from "react"
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Filter,
    Target,
    CalendarDays,
    CalendarClock,
    AlertTriangle,
    CheckCircle2,
    Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useIssueStore } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"
import QuickCreateModal from "@/shared/components/projectmanagement/quick-create-modal"

export default function GlobalCalendarPage() {
    const [mounted, setMounted] = useState(false)
    const [currentDate, setCurrentDate] = useState(new Date())
    const { issues } = useIssueStore()
    const { projects } = useProjectStore()
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [projectFilter, setProjectFilter] = useState<string | null>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    const today = () => setCurrentDate(new Date())

    const issuesWithDates = issues.filter(i => i.dueDate && (!projectFilter || i.projectId === projectFilter))
    const tasksInCurrentMonth = issuesWithDates.filter(i => {
        const d = new Date(i.dueDate!)
        return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()
    })

    const now = new Date()
    const todayTasks = issuesWithDates.filter(i => {
        const d = new Date(i.dueDate!)
        return d.toDateString() === now.toDateString()
    })
    const thisWeekTasks = issuesWithDates.filter(i => {
        const d = new Date(i.dueDate!)
        const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        return diff >= 0 && diff <= 7
    })
    const overdue = issuesWithDates.filter(i => {
        const d = new Date(i.dueDate!)
        return d < now && i.status !== "DONE"
    })

    const kpis = [
        { label: "Due Today", value: todayTasks.length, icon: <CalendarDays size={18} />, color: "text-indigo-800", bg: "bg-indigo-100" },
        { label: "This Week", value: thisWeekTasks.length, icon: <CalendarClock size={18} />, color: "text-amber-800", bg: "bg-amber-100" },
        { label: "This Month", value: tasksInCurrentMonth.length, icon: <CalendarIcon size={18} />, color: "text-emerald-800", bg: "bg-emerald-100" },
        { label: "Overdue", value: overdue.length, icon: <AlertTriangle size={18} />, color: "text-rose-800", bg: "bg-rose-100" },
    ]

    return (
        <div className="w-full h-full p-6 space-y-5 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Calendar</h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Schedule and timeline of all project commitments.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white border border-slate-200 shadow-sm rounded-none">
                        <Button onClick={prevMonth} variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-slate-900 rounded-none">
                            <ChevronLeft size={16} />
                        </Button>
                        <div className="px-4 text-center min-w-[120px]">
                            <span className="text-sm font-bold text-slate-800">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                        </div>
                        <Button onClick={nextMonth} variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-slate-900 rounded-none">
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                    <Button onClick={today} variant="outline" className="h-9 text-xs font-semibold rounded-none">Today</Button>
                    <Button onClick={() => setIsCreateOpen(true)} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-2 rounded-none">
                        <Plus size={14} /> New Task
                    </Button>
                </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((stat, i) => (
                    <div
                        key={i}
                        className={`block border shadow-sm overflow-hidden hover:shadow-md transition-all h-[75px] rounded-none ${stat.bg}`}
                    >
                        <div className="p-4 flex items-center justify-between w-full h-full">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 bg-white ${stat.color} flex items-center justify-center shrink-0 rounded-none`}>
                                    {stat.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight leading-none">{stat.label}</span>
                                    <span className="text-xl font-black text-slate-900 leading-none mt-1.5">{stat.value}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Calendar Grid */}
                <div className="xl:col-span-3">
                    <div className="bg-white border border-slate-200 overflow-hidden shadow-sm rounded-none">
                        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                                <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)]">
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                <div key={`empty-${i}`} className="bg-slate-50/30 border-r border-b border-slate-100" />
                            ))}

                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1
                                const dayTasks = tasksInCurrentMonth.filter(t => t.dueDate && new Date(t.dueDate).getDate() === day)
                                const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear()

                                return (
                                    <div key={day} className={`p-2 border-r border-b border-slate-100 transition-colors hover:bg-slate-50 ${isToday ? 'bg-indigo-50/30' : ''}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-sm font-semibold flex h-7 w-7 items-center justify-center ${isToday ? 'bg-indigo-600 text-white rounded-full' : 'text-slate-700'}`}>
                                                {day}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            {dayTasks.slice(0, 3).map((task, idx) => (
                                                <div key={idx} className="px-2 py-1 bg-white border border-slate-200 text-[10px] font-medium text-slate-700 truncate shadow-sm hover:border-indigo-300 rounded-none">
                                                    {task.title}
                                                </div>
                                            ))}
                                            {dayTasks.length > 3 && (
                                                <div className="text-[10px] text-indigo-600 font-medium pl-1">
                                                    +{dayTasks.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 p-4 rounded-none">
                        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <Filter size={16} className="text-slate-400" />
                            Projects
                        </h3>
                        <div className="space-y-1">
                            <button
                                type="button"
                                onClick={() => setProjectFilter(null)}
                                className={`w-full flex items-center gap-2 p-2 hover:bg-slate-50 transition-colors text-left ${!projectFilter ? "bg-indigo-50 text-indigo-700" : "text-slate-600"}`}
                            >
                                <div className="h-2 w-2 rounded-full bg-slate-400" />
                                <span className="text-xs font-semibold">All Projects</span>
                            </button>
                            {projects.map(p => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setProjectFilter(p.id)}
                                    className={`w-full flex items-center gap-2 p-2 hover:bg-slate-50 transition-colors text-left ${projectFilter === p.id ? "bg-indigo-50 text-indigo-700" : "text-slate-600"}`}
                                >
                                    <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                    <span className="text-xs font-semibold truncate">{p.name}</span>
                                </button>
                            ))}
                            {projects.length === 0 && <p className="text-xs text-slate-400 italic">No projects found.</p>}
                        </div>
                    </div>

                    <Card className="bg-slate-50 border-dashed border-2 border-slate-200 shadow-none rounded-none">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex items-center gap-2 text-indigo-600">
                                <Target size={18} />
                                <h4 className="text-sm font-bold">Focus</h4>
                            </div>
                            <p className="text-xs text-slate-500 font-medium italic">
                                "Finish the quarterly audit and finalize the design system v2."
                            </p>
                            <Button size="sm" variant="secondary" className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-none">
                                Mark Complete
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <QuickCreateModal isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} />
        </div>
    )
}
