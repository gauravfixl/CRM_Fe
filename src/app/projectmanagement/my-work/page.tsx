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
    ArrowUpRight,
    Layout
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useIssueStore } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"
import QuickCreateModal from "@/shared/components/projectmanagement/quick-create-modal"

export default function MyWorkPage() {
    const [activeTab, setActiveTab] = useState("assigned")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [filterQuery, setFilterQuery] = useState("")
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
            .filter(i => i.assigneeId === 'u1') // Assume User u1
            .map(i => {
                const proj = projects.find(p => p.id === i.projectId)
                return {
                    ...i,
                    projectName: proj ? proj.name : "Unknown Project",
                    projectIcon: proj ? proj.icon : "🚀"
                }
            })
            .filter(i => i.title.toLowerCase().includes(filterQuery.toLowerCase()))
    }, [issues, projects, mounted, filterQuery])

    if (!mounted) return null

    return (
        <div className="w-full max-w-full mx-auto space-y-6 p-6 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                            <Target size={16} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Operations</h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                        Track and execute your assigned tasks from across the workspace.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg flex items-center gap-3 shadow-sm">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Queue</p>
                            <p className="text-sm font-bold text-slate-900">{myTasks.length} Tasks</p>
                        </div>
                        <Inbox size={16} className="text-slate-400" />
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)} className="h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center gap-2 shadow-sm transition-all">
                        <Plus size={16} />
                        New Task
                    </Button>
                </div>
            </div>

            {/* Content & Filters */}
            <Tabs defaultValue="assigned" className="w-full" onValueChange={setActiveTab}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <TabsList className="bg-slate-100/50 p-1 h-auto rounded-lg gap-1 border border-slate-200/50">
                        <TabsTrigger value="assigned" className="px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md text-slate-500 data-[state=active]:text-indigo-600 font-semibold text-xs transition-all">
                            Assigned to me
                        </TabsTrigger>
                        <TabsTrigger value="mentions" className="px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md text-slate-500 data-[state=active]:text-indigo-600 font-semibold text-xs transition-all">
                            Interactions
                            <Badge className="ml-2 bg-indigo-50 text-indigo-600 border-none px-1.5 py-0 text-[9px]">3</Badge>
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <Input
                                value={filterQuery}
                                onChange={(e) => setFilterQuery(e.target.value)}
                                placeholder="Filter tasks..."
                                className="pl-9 h-9 w-[240px] bg-white border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500/10"
                            />
                        </div>
                        <Button variant="outline" size="sm" className="h-9 w-9 p-0 border-slate-200 rounded-lg">
                            <Filter size={14} className="text-slate-500" />
                        </Button>
                    </div>
                </div>

                <TabsContent value="assigned" className="mt-0">
                    <div className="space-y-3">
                        {myTasks.length > 0 ? myTasks.map((task) => (
                            <div key={task.id} className="group bg-white border border-slate-100 rounded-xl p-4 hover:border-indigo-100 hover:shadow-md transition-all flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div
                                        className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${task.status === "DONE" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-600"
                                            }`}
                                    >
                                        {task.status === "DONE" ? <CheckCircle2 size={18} /> : <Zap size={18} />}
                                    </div>

                                    <div className="space-y-1 flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
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
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide ${task.priority === 'URGENT' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                            task.priority === 'HIGH' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                            }`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-indigo-600">
                                        <ChevronRight size={16} />
                                    </Button>
                                </div>
                            </div>
                        )) : (
                            <div className="h-64 bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400 space-y-3">
                                <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <Search size={20} className="text-slate-300" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-slate-600">No tasks found</p>
                                    <p className="text-xs text-slate-400 mt-1">Your queue is currently empty.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="mentions" className="mt-0">
                    <div className="bg-slate-50 rounded-xl p-12 text-center border-2 border-dashed border-slate-100 flex flex-col items-center justify-center space-y-4">
                        <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
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
