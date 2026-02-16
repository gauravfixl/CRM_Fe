"use client"

import React, { useState, useEffect } from "react"
import {
    Search,
    Filter,
    MoreHorizontal,
    ArrowUpDown,
    CheckCircle2,
    Clock,
    AlertCircle,
    LayoutList
} from "lucide-react"
import { useIssueStore } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const STATUS_COLORS: Record<string, string> = {
    TODO: "bg-slate-100 text-slate-600 border-slate-200",
    IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
    IN_REVIEW: "bg-purple-100 text-purple-700 border-purple-200",
    DONE: "bg-green-100 text-green-700 border-green-200",
}

const PRIORITY_COLORS: Record<string, string> = {
    LOW: "bg-green-50 text-green-600 border-green-100",
    MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
    HIGH: "bg-orange-100 text-orange-700 border-orange-200",
    URGENT: "bg-red-100 text-red-700 border-red-200",
}

export default function GlobalListPage() {
    const [mounted, setMounted] = useState(false)
    const { issues, deleteIssue } = useIssueStore()
    const { projects } = useProjectStore()
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [priorityFilter, setPriorityFilter] = useState<string>("all")
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const getProjectName = (projectId: string) => {
        const p = projects.find(proj => proj.id === projectId)
        return p ? p.name : "Unknown Project"
    }

    const getProjectKey = (projectId: string) => {
        const p = projects.find(proj => proj.id === projectId)
        return p ? p.key : "PROJ"
    }

    const filteredIssues = issues.filter(i => {
        const matchesSearch = i.title.toLowerCase().includes(search.toLowerCase()) ||
            i.status.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter === "all" || i.status === statusFilter
        const matchesPriority = priorityFilter === "all" || i.priority === priorityFilter
        return matchesSearch && matchesStatus && matchesPriority
    })

    const sortedIssues = React.useMemo(() => {
        if (!sortConfig) return filteredIssues
        return [...filteredIssues].sort((a, b) => {
            const aValue = a[sortConfig.key as keyof typeof a]
            const bValue = b[sortConfig.key as keyof typeof b]

            if (aValue === undefined || aValue === null) return 1
            if (bValue === undefined || bValue === null) return -1
            if (aValue === bValue) return 0

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })
    }, [filteredIssues, sortConfig])

    const handleSort = (key: string) => {
        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }))
    }

    return (
        <div className="flex flex-col h-full gap-6 p-6 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                            <LayoutList size={16} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">All Tasks</h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                        Comprehensive list view of all tasks across all projects.
                    </p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            className="pl-9 h-9 bg-white border-slate-200 text-xs font-medium"
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px] h-9 text-xs font-semibold bg-white">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="TODO">To Do</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="IN_REVIEW">In Review</SelectItem>
                            <SelectItem value="DONE">Done</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="w-[140px] h-9 text-xs font-semibold bg-white">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priority</SelectItem>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="URGENT">Urgent</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="text-xs font-bold text-slate-500">
                    {sortedIssues.length} tasks
                </div>
            </div>

            {/* List Table */}
            <div className="flex-1 overflow-auto bg-white border border-slate-200 rounded-xl">
                <Table>
                    <TableHeader className="bg-slate-50 sticky top-0 z-10">
                        <TableRow className="hover:bg-slate-50 border-b border-slate-200">
                            <TableHead className="w-[120px] text-xs font-bold text-slate-500 cursor-pointer hover:text-slate-700" onClick={() => handleSort('id')}>
                                ID <ArrowUpDown size={10} className="inline ml-1" />
                            </TableHead>
                            <TableHead className="w-[35%] text-xs font-bold text-slate-500 cursor-pointer hover:text-slate-700" onClick={() => handleSort('title')}>
                                Task <ArrowUpDown size={10} className="inline ml-1" />
                            </TableHead>
                            <TableHead className="text-xs font-bold text-slate-500 cursor-pointer hover:text-slate-700" onClick={() => handleSort('projectId')}>
                                Project
                            </TableHead>
                            <TableHead className="text-xs font-bold text-slate-500 cursor-pointer hover:text-slate-700" onClick={() => handleSort('status')}>
                                Status
                            </TableHead>
                            <TableHead className="text-xs font-bold text-slate-500 cursor-pointer hover:text-slate-700" onClick={() => handleSort('priority')}>
                                Priority
                            </TableHead>
                            <TableHead className="text-xs font-bold text-slate-500">
                                Assignee
                            </TableHead>
                            <TableHead className="text-xs font-bold text-slate-500 cursor-pointer hover:text-slate-700" onClick={() => handleSort('dueDate')}>
                                Due Date
                            </TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedIssues.map((issue) => (
                            <TableRow key={issue.id} className="group hover:bg-slate-50/80 transition-colors border-b border-slate-100">
                                <TableCell className="font-mono text-[10px] font-bold text-slate-500">
                                    {getProjectKey(issue.projectId)}-{issue.id}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-800 line-clamp-1">{issue.title}</span>
                                        <span className="text-[10px] text-slate-400 font-medium line-clamp-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                            {issue.description || "No description"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-xs font-semibold text-slate-600">{getProjectName(issue.projectId)}</span>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`text-[10px] font-bold px-2 py-0.5 border ${STATUS_COLORS[issue.status] || "bg-slate-100 text-slate-600"}`}>
                                        {issue.status.replace("_", " ")}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`text-[10px] font-bold px-2 py-0.5 border ${PRIORITY_COLORS[issue.priority] || "bg-slate-100 text-slate-600"}`}>
                                        {issue.priority}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${issue.assigneeId}`} />
                                            <AvatarFallback className="text-[9px] font-bold">{issue.assigneeId?.[0] || "?"}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs font-medium text-slate-700">{issue.assigneeId || "Unassigned"}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={12} className="text-slate-400" />
                                        <span className="text-xs font-semibold text-slate-600">
                                            {issue.dueDate ? new Date(issue.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "-"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal size={14} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40">
                                            <DropdownMenuItem
                                                className="text-xs font-medium"
                                                onClick={() => alert(`Edit issue ${issue.id}`)}
                                            >
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-xs font-medium text-red-600 focus:bg-red-50 focus:text-red-700"
                                                onClick={() => {
                                                    if (confirm("Delete this task?")) {
                                                        deleteIssue(issue.id)
                                                    }
                                                }}
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {sortedIssues.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                                        <AlertCircle size={32} className="opacity-50" />
                                        <p className="text-sm font-medium">No tasks found matching your filters.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
