"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    CheckCircle2,
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    LayoutDashboard,
    Calendar,
    User,
    ArrowUpCircle,
    ArrowDownCircle,
    AlertCircle,
    Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

export default function GlobalTasksPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const tasks = [
        { id: "T-101", title: "Design Homepage Mockups", project: "Website Redesign", assignee: "Alice", priority: "HIGH", status: "IN_PROGRESS", due: "Tomorrow" },
        { id: "T-102", title: "Setup CI/CD Pipeline", project: "Backend Migration", assignee: "Bob", priority: "CRITICAL", status: "TODO", due: "Today" },
        { id: "T-103", title: "Draft Q1 Blog Post", project: "Marketing", assignee: "Charlie", priority: "LOW", status: "Review", due: "Next Week" },
        { id: "T-104", title: "Fix Login Bug", project: "Mobile App Beta", assignee: "Dave", priority: "HIGH", status: "DONE", due: "Yesterday" },
    ]

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 800)
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>PROJECTS</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">GLOBAL TASKS</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">All Tasks</h1>
                        <p className="text-xs text-zinc-500 font-medium">Global view of all assignments across every project and workspace.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button className="h-8 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95" onClick={() => handleAction("Create Task Dialog")}>
                            <Plus className="w-3.5 h-3.5 mr-2" />
                            New Task
                        </Button>
                    </div>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-indigo-500 to-indigo-700 border-t border-white/20 border-none text-white shadow-[0_8px_30px_rgb(99,102,241,0.3)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.4)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">My Tasks</p>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">12</p>
                        <p className="text-[10px] text-white">3 due today</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Overdue</p>
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-rose-600">5</p>
                        <p className="text-[10px] text-zinc-400">Action required</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Completed This Week</p>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">45</p>
                        <p className="text-[10px] text-zinc-400">Top performer: Alice</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Backlog</p>
                        <Clock className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">128</p>
                        <p className="text-[10px] text-zinc-400">Unassigned tasks</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* TASKS TABLE */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/20">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                        <Input
                            placeholder="Search tasks..."
                            className="pl-9 h-9 bg-white border-zinc-200 rounded-md text-xs font-medium focus:ring-1 focus:ring-indigo-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="h-8 text-[10px] font-bold uppercase transition-colors">
                            <Filter className="w-3.5 h-3.5 mr-2" /> Filter
                        </Button>
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Task</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Project</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Priority</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Status</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Due Date</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Assignee</TableHead>
                            <TableHead className="py-3 text-right pr-4 font-semibold text-[11px] text-zinc-500 uppercase">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((t) => (
                            <TableRow key={t.id} className="hover:bg-zinc-50/50 transition-colors">
                                <TableCell className="py-3 px-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-zinc-900">{t.title}</span>
                                        <span className="text-[10px] text-zinc-400 font-mono">{t.id}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <span className="text-xs font-medium text-zinc-600">{t.project}</span>
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-1.5">
                                        {t.priority === 'CRITICAL' && <ArrowUpCircle className="w-3.5 h-3.5 text-rose-500" />}
                                        {t.priority === 'HIGH' && <ArrowUpCircle className="w-3.5 h-3.5 text-amber-500" />}
                                        {t.priority === 'LOW' && <ArrowDownCircle className="w-3.5 h-3.5 text-blue-500" />}
                                        <span className={`text-[10px] font-bold uppercase ${t.priority === 'CRITICAL' ? 'text-rose-600' :
                                                t.priority === 'HIGH' ? 'text-amber-600' :
                                                    'text-zinc-500'
                                            }`}>{t.priority}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <Badge className={`text-[9px] uppercase font-bold border-none px-2 py-0.5 ${t.status === 'DONE' ? 'bg-emerald-50 text-emerald-600' :
                                            t.status === 'IN_PROGRESS' ? 'bg-indigo-50 text-indigo-600' :
                                                'bg-zinc-100 text-zinc-500'
                                        }`}>
                                        {t.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-3 text-center text-xs text-zinc-500 font-medium">
                                    {t.due}
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-600">
                                            {t.assignee[0]}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md">
                                                <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 shadow-xl border-zinc-100">
                                            <DropdownMenuItem onClick={() => handleAction("View details")}>
                                                View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleAction("Edit task")}>
                                                Edit Task
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
