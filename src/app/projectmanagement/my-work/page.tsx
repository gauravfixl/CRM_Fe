"use client"

import React, { useState, useMemo, useEffect } from "react"
import {
    CheckCircle2,
    Clock,
    Search,
    Filter,
    MessageSquare,
    Calendar,
    Plus,
    Inbox,
    Target,
    Zap,
    ChevronRight,
    Layout,
    ListTodo,
    AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useIssueStore } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"
import QuickCreateModal from "@/shared/components/projectmanagement/quick-create-modal"
import { cn } from "@/lib/utils"

type StatusFilter = "all" | "TODO" | "IN_PROGRESS" | "DONE"

export default function MyWorkPage() {
    const [activeTab, setActiveTab] = useState("assigned")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [filterQuery, setFilterQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
    const [mounted, setMounted] = useState(false)

    const { issues } = useIssueStore()
    const { projects } = useProjectStore()

    useEffect(() => {
        setMounted(true)
        useIssueStore.persist.rehydrate()
        useProjectStore.persist.rehydrate()
    }, [])

    const myTasks = useMemo(() => {
        if (!mounted) return []
        return issues
            .filter(i => i.assigneeId === 'u1')
            .map(i => {
                const proj = projects.find(p => p.id === i.projectId)
                return {
                    ...i,
                    projectName: proj ? proj.name : "Unknown Project",
                    projectIcon: proj ? proj.icon : "🚀"
                }
            })
            .filter(i => i.title.toLowerCase().includes(filterQuery.toLowerCase()))
            .filter(i => statusFilter === "all" || i.status === statusFilter)
    }, [issues, projects, mounted, filterQuery, statusFilter])

    if (!mounted) return null

    const myAll = issues.filter(i => i.assigneeId === 'u1')
    const todoCount = myAll.filter(i => i.status === "TODO").length
    const inProgressCount = myAll.filter(i => i.status === "IN_PROGRESS").length
    const doneCount = myAll.filter(i => i.status === "DONE").length
    const urgentCount = myAll.filter(i => i.priority === "URGENT" || i.priority === "HIGH").length

    const kpis: { label: string; value: number; icon: React.ReactNode; color: string; bg: string; filter: StatusFilter }[] = [
        { label: "To Do", value: todoCount, icon: <ListTodo size={18} />, color: "text-indigo-800", bg: "bg-indigo-100", filter: "TODO" },
        { label: "In Progress", value: inProgressCount, icon: <Clock size={18} />, color: "text-amber-800", bg: "bg-amber-100", filter: "IN_PROGRESS" },
        { label: "Done", value: doneCount, icon: <CheckCircle2 size={18} />, color: "text-emerald-800", bg: "bg-emerald-100", filter: "DONE" },
        { label: "Urgent / High", value: urgentCount, icon: <AlertTriangle size={18} />, color: "text-rose-800", bg: "bg-rose-100", filter: "all" },
    ]

    return (
        <div className="w-full max-w-full mx-auto space-y-5 p-6 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 flex items-center justify-center text-white shadow-sm rounded-none">
                            <Target size={16} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Operations</h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                        Track and execute your assigned tasks from across the workspace.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white border border-slate-200 flex items-center gap-3 shadow-sm rounded-none">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Queue</p>
                            <p className="text-sm font-bold text-slate-900">{myTasks.length} Tasks</p>
                        </div>
                        <Inbox size={16} className="text-slate-400" />
                    </div>
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all rounded-none"
                    >
                        <Plus size={16} />
                        New Task
                    </Button>
                </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((stat, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => setStatusFilter(stat.filter)}
                        className={cn(
                            "block border shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all h-[75px] rounded-none cursor-pointer text-left",
                            stat.bg,
                            statusFilter === stat.filter && stat.filter !== "all" && "ring-2 ring-indigo-500"
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

            {/* Content & Filters */}
            <Tabs defaultValue="assigned" className="w-full" onValueChange={setActiveTab}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <TabsList className="bg-slate-100/50 p-1 h-auto gap-1 border border-slate-200/50 rounded-none">
                        <TabsTrigger value="assigned" className="px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm text-slate-500 data-[state=active]:text-indigo-600 font-semibold text-xs transition-all rounded-none">
                            Assigned to me
                        </TabsTrigger>
                        <TabsTrigger value="mentions" className="px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm text-slate-500 data-[state=active]:text-indigo-600 font-semibold text-xs transition-all rounded-none">
                            Interactions
                            <Badge className="ml-2 bg-indigo-50 text-indigo-600 border-none px-1.5 py-0 text-[9px] rounded-none">3</Badge>
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <Input
                                value={filterQuery}
                                onChange={(e) => setFilterQuery(e.target.value)}
                                placeholder="Filter tasks..."
                                className="pl-9 h-9 w-[240px] bg-white border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500/10 rounded-none"
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setFilterQuery(""); setStatusFilter("all") }}
                            className="h-9 px-2 border-slate-200 text-xs gap-1.5 rounded-none"
                        >
                            <Filter size={14} className="text-slate-500" /> Clear
                        </Button>
                    </div>
                </div>

                <TabsContent value="assigned" className="mt-0">
                    <div className="space-y-3">
                        {myTasks.length > 0 ? myTasks.map((task) => (
                            <div key={task.id} className="group bg-white border border-slate-100 p-4 hover:border-indigo-100 hover:shadow-md transition-all flex items-center justify-between gap-4 rounded-none">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div
                                        className={`h-10 w-10 flex items-center justify-center shrink-0 shadow-sm rounded-none ${task.status === "DONE" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-600"}`}
                                    >
                                        {task.status === "DONE" ? <CheckCircle2 size={18} /> : <Zap size={18} />}
                                    </div>

                                    <div className="space-y-1 flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 border border-slate-100 rounded-none">
                                                {task.projectName}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium">
                                                {task.id}
                                            </span>
                                        </div>
                                        <h4 className={`text-sm font-bold truncate ${task.status === "DONE" ? "text-slate-400 line-through" : "text-slate-800"}`}>
                                            {task.title}
                                        </h4>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="hidden md:flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                            <Calendar size={14} className="text-slate-400" />
                                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "No Date"}
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wide rounded-none ${task.priority === 'URGENT' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                            task.priority === 'HIGH' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                            }`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-none">
                                        <ChevronRight size={16} />
                                    </Button>
                                </div>
                            </div>
                        )) : (
                            <div className="h-64 bg-slate-50/50 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400 space-y-3 rounded-none">
                                <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <Search size={20} className="text-slate-300" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-slate-600">No tasks found</p>
                                    <p className="text-xs text-slate-400 mt-1">Your queue is currently empty.</p>
                                </div>
                                <Button
                                    onClick={() => setIsCreateOpen(true)}
                                    className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[12px] gap-2 rounded-none"
                                >
                                    <Plus size={14} strokeWidth={3} /> Create your first task
                                </Button>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="mentions" className="mt-0">
                    <div className="bg-slate-50 p-12 text-center border-2 border-dashed border-slate-100 flex flex-col items-center justify-center space-y-4 rounded-none">
                        <div className="h-16 w-16 bg-white flex items-center justify-center shadow-sm rounded-none">
                            <MessageSquare size={24} className="text-indigo-500" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-800">No Interactions</h3>
                            <p className="text-sm text-slate-500">You haven't been mentioned in any tasks recently.</p>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
            <QuickCreateModal isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} />
        </div>
    )
}
