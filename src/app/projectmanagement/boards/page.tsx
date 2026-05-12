"use client"

import React, { useState, useEffect } from "react"
import {
    Plus,
    MoreHorizontal,
    Calendar,
    Filter,
    Search,
    Layout,
    ListTodo,
    Clock,
    Eye,
    CheckCircle2,
    ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useIssueStore } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { Badge } from "@/components/ui/badge"
import QuickCreateModal from "@/shared/components/projectmanagement/quick-create-modal"
import { cn } from "@/lib/utils"

export default function KanbanBoardPage() {
    const [mounted, setMounted] = useState(false)
    const { issues } = useIssueStore()
    const { projects } = useProjectStore()
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFocus, setStatusFocus] = useState<string | null>(null)
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const filteredIssues = issues.filter(i =>
        i.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const columns = [
        { id: 'TODO', title: 'To Do' },
        { id: 'IN_PROGRESS', title: 'In Progress' },
        { id: 'IN_REVIEW', title: 'In Review' },
        { id: 'DONE', title: 'Done' }
    ]

    const getProjectKey = (projectId: string) => {
        const p = projects.find(proj => proj.id === projectId)
        return p ? p.key : "PROJ"
    }

    const todoCount = filteredIssues.filter(i => i.status === "TODO").length
    const inProgCount = filteredIssues.filter(i => i.status === "IN_PROGRESS").length
    const reviewCount = filteredIssues.filter(i => i.status === "IN_REVIEW").length
    const doneCount = filteredIssues.filter(i => i.status === "DONE").length

    const kpis = [
        { label: "To Do", value: todoCount, icon: <ListTodo size={18} />, color: "text-indigo-800", bg: "bg-indigo-100", filter: "TODO" },
        { label: "In Progress", value: inProgCount, icon: <Clock size={18} />, color: "text-amber-800", bg: "bg-amber-100", filter: "IN_PROGRESS" },
        { label: "In Review", value: reviewCount, icon: <Eye size={18} />, color: "text-blue-800", bg: "bg-blue-100", filter: "IN_REVIEW" },
        { label: "Done", value: doneCount, icon: <CheckCircle2 size={18} />, color: "text-emerald-800", bg: "bg-emerald-100", filter: "DONE" },
    ]

    return (
        <div className="flex flex-col h-full gap-5 p-6 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-none">
                        <Layout className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Global Board</h1>
                        <p className="text-[13px] text-slate-500 font-medium italic">All tasks across all projects</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 text-xs font-bold rounded-none"
                    >
                        <Plus className="h-4 w-4" />
                        Add Task
                    </Button>
                </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((stat, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => setStatusFocus(statusFocus === stat.filter ? null : stat.filter)}
                        className={cn(
                            "block border shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all h-[75px] rounded-none cursor-pointer text-left",
                            stat.bg,
                            statusFocus === stat.filter && "ring-2 ring-indigo-500"
                        )}
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
                            <ChevronRight size={16} className="text-slate-500/60" />
                        </div>
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-4">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search tasks..."
                            className="pl-9 h-9 bg-white border-slate-200 text-xs font-medium rounded-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setStatusFocus(null); setSearchQuery("") }}
                        className="h-9 gap-2 text-slate-600 text-xs font-bold rounded-none"
                    >
                        <Filter className="h-4 w-4" />
                        Clear
                    </Button>
                </div>
            </div>

            {/* Kanban Columns */}
            <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar h-full">
                {columns
                    .filter(c => !statusFocus || c.id === statusFocus)
                    .map((column) => {
                        const columnIssues = filteredIssues.filter(i => i.status === column.id)

                        return (
                            <div key={column.id} className="flex flex-col gap-4 min-w-[300px] w-[300px] flex-shrink-0">
                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{column.title}</h3>
                                        <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-none">
                                            {columnIssues.length}
                                        </span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 rounded-none">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex flex-col gap-3 min-h-[200px] bg-slate-100/30 p-2 border-2 border-dashed border-slate-200/50 rounded-none">
                                    {columnIssues.map((task) => (
                                        <Card key={task.id} className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer border-b-2 border-b-slate-200 group rounded-none">
                                            <CardContent className="p-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Badge variant="outline" className="text-[10px] font-bold px-2 py-0.5 bg-white text-slate-500 border-slate-200 rounded-none">
                                                        {getProjectKey(task.projectId)}-{task.id}
                                                    </Badge>
                                                    <span className={`text-[10px] font-bold uppercase ${task.priority === 'URGENT' ? 'text-rose-600' :
                                                        task.priority === 'HIGH' ? 'text-amber-500' :
                                                            'text-indigo-500'
                                                        }`}>
                                                        {task.priority}
                                                    </span>
                                                </div>
                                                <h4 className="text-[13px] font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                                                    {task.title}
                                                </h4>
                                                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-5 w-5 border border-white shadow-sm">
                                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${task.assigneeId}`} />
                                                            <AvatarFallback className="text-[8px]">U</AvatarFallback>
                                                        </Avatar>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-slate-400">
                                                        <Calendar className="h-3 w-3" />
                                                        <span className="text-[10px] font-medium">{task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No date'}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setIsCreateOpen(true)}
                                        className="w-full h-10 border-2 border-dashed border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/50 gap-2 rounded-none"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span className="text-xs font-semibold">New Task</span>
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
            </div>

            <QuickCreateModal isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} />
        </div>
    )
}
