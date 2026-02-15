"use client"

import React, { useState, useEffect } from "react"
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Filter,
    Target
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useIssueStore } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"

export default function GlobalCalendarPage() {
    const [mounted, setMounted] = useState(false)
    const [currentDate, setCurrentDate] = useState(new Date())
    const { issues } = useIssueStore()
    const { projects } = useProjectStore()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))

    // Mock events
    const tasksWithDates = issues.filter(i => i.dueDate).map(i => ({
        ...i,
        date: new Date(i.dueDate).getDate()
    }))

    return (
        <div className="w-full h-full p-6 space-y-6 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Calendar</h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Schedule and timeline of all project commitments.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm">
                        <Button onClick={prevMonth} variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-slate-900">
                            <ChevronLeft size={16} />
                        </Button>
                        <div className="px-4 text-center min-w-[120px]">
                            <span className="text-sm font-bold text-slate-800">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                        </div>
                        <Button onClick={nextMonth} variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-slate-900">
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Main Calendar Grid */}
                <div className="xl:col-span-3">
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                                <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)]">
                            {/* Empty days */}
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                <div key={`empty-${i}`} className="bg-slate-50/30 border-r border-b border-slate-100" />
                            ))}

                            {/* Actual days */}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1
                                const dayTasks = tasksWithDates.filter(t => t.date === day)
                                const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth()

                                return (
                                    <div key={day} className={`p-2 border-r border-b border-slate-100 transition-colors hover:bg-slate-50 ${isToday ? 'bg-indigo-50/30' : ''}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-sm font-semibold flex h-7 w-7 items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-700'}`}>
                                                {day}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            {dayTasks.slice(0, 3).map((task, idx) => (
                                                <div key={idx} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-700 truncate shadow-sm hover:border-indigo-300">
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
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <Filter size={16} className="text-slate-400" />
                            Projects
                        </h3>
                        <div className="space-y-2">
                            {projects.map(p => (
                                <div key={p.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                                    <div className="h-2 w-2 rounded-full bg-slate-400" />
                                    <span className="text-xs font-semibold text-slate-600">{p.name}</span>
                                </div>
                            ))}
                            {projects.length === 0 && <p className="text-xs text-slate-400 italic">No projects found.</p>}
                        </div>
                    </div>

                    <Card className="bg-slate-50 border-dashed border-2 border-slate-200 shadow-none">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex items-center gap-2 text-indigo-600">
                                <Target size={18} />
                                <h4 className="text-sm font-bold">Focus</h4>
                            </div>
                            <p className="text-xs text-slate-500 font-medium italic">
                                "Finish the quarterly audit and finalize the design system v2."
                            </p>
                            <Button size="sm" variant="secondary" className="w-full text-xs font-semibold bg-white border border-slate-200">
                                Mark Complete
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
