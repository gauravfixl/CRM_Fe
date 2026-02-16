"use client"

import React from "react"
import { List } from "lucide-react"

import { useParams } from "next/navigation"
import { useIssueStore, IssueStatus, IssuePriority } from "@/shared/data/issue-store"
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
import { Search, Filter, MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const STATUS_COLORS: Record<string, string> = {
    TODO: "bg-slate-100 text-slate-600 border-slate-200",
    IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
    DONE: "bg-green-100 text-green-700 border-green-200",
    BACKLOG: "bg-slate-50 text-slate-500 border-slate-100",
    HIGH: "bg-orange-100 text-orange-700 border-orange-200",
    URGENT: "bg-red-100 text-red-700 border-red-200",
    MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
    LOW: "bg-green-50 text-green-600 border-green-100"
}

export default function ListPage() {
    const { id } = useParams()
    const projectId = id as string
    const { getIssuesByProject, deleteIssue } = useIssueStore()
    const [search, setSearch] = React.useState("")
    const [sortConfig, setSortConfig] = React.useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)

    const issues = getIssuesByProject(projectId).filter(i =>
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.status.toLowerCase().includes(search.toLowerCase())
    )

    const sortedIssues = React.useMemo(() => {
        if (!sortConfig) return issues
        return [...issues].sort((a, b) => {
            const aValue = a[sortConfig.key as keyof typeof a]
            const bValue = b[sortConfig.key as keyof typeof b]

            // Handle undefined/null
            if (aValue === undefined || aValue === null) return 1
            if (bValue === undefined || bValue === null) return -1
            if (aValue === bValue) return 0

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })
    }, [issues, sortConfig])

    const handleSort = (key: string) => {
        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }))
    }

    return (
        <div className="flex flex-col h-full gap-4 max-w-7xl pb-10 font-sans">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <Search size={14} className="ml-2 text-slate-400" />
                        <input
                            className="bg-transparent text-[13px] font-medium text-slate-700 placeholder:text-slate-400 outline-none w-64"
                            placeholder="Filter by keyword..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="sm" className="h-9 gap-2 text-[12px] font-bold text-slate-600">
                        <Filter size={14} />
                        Filter
                    </Button>
                </div>
                <div className="text-[12px] font-semibold text-slate-500">
                    Showing {sortedIssues.length} tasks
                </div>
            </div>

            {/* List Table */}
            <div className="flex-1 overflow-auto">
                <Table>
                    <TableHeader className="bg-slate-50 sticky top-0 z-10">
                        <TableRow className="hover:bg-slate-50 border-b border-slate-200">
                            <TableHead className="w-[100px] text-[12px] font-bold text-slate-500 cursor-pointer hover:text-slate-700" onClick={() => handleSort('id')}>
                                K-ID <ArrowUpDown size={10} className="inline ml-1" />
                            </TableHead>
                            <TableHead className="w-[40%] text-[13px] font-bold text-slate-500 cursor-pointer hover:text-slate-700" onClick={() => handleSort('title')}>
                                Summary <ArrowUpDown size={10} className="inline ml-1" />
                            </TableHead>
                            <TableHead className="text-[13px] font-bold text-slate-500 cursor-pointer hover:text-slate-700" onClick={() => handleSort('status')}>
                                Status
                            </TableHead>
                            <TableHead className="text-[13px] font-bold text-slate-500 cursor-pointer hover:text-slate-700" onClick={() => handleSort('priority')}>
                                Priority
                            </TableHead>
                            <TableHead className="text-[13px] font-bold text-slate-500">
                                Assignee
                            </TableHead>
                            <TableHead className="text-[13px] font-bold text-slate-500 cursor-pointer hover:text-slate-700" onClick={() => handleSort('dueDate')}>
                                Due Date
                            </TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedIssues.map((issue) => (
                            <TableRow key={issue.id} className="group hover:bg-slate-50/80 transition-colors border-b border-slate-100">
                                <TableCell className="font-mono text-[11px] font-bold text-slate-500">
                                    {issue.id}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-semibold text-slate-800 line-clamp-1">{issue.title}</span>
                                        <span className="text-[11px] text-slate-400 font-medium line-clamp-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                            {issue.description || "No description"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`text-[10px] font-bold px-2 py-0.5 border ${STATUS_COLORS[issue.status] || "bg-slate-100 text-slate-600"}`}>
                                        {issue.status.replace("_", " ")}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`text-[10px] font-bold px-2 py-0.5 border ${STATUS_COLORS[issue.priority] || "bg-slate-100 text-slate-600"}`}>
                                        {issue.priority}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${issue.assigneeId}`} />
                                            <AvatarFallback className="text-[9px] font-bold">{issue.assigneeId?.[0] || "?"}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-[12px] font-medium text-slate-700">{issue.assigneeId || "Unassigned"}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-[12px] font-semibold text-slate-600">
                                        {issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : "-"}
                                    </span>
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
                                                className="text-[12px] font-medium"
                                                onClick={() => alert(`Edit issue ${issue.id}`)}
                                            >
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-[12px] font-medium text-red-600 focus:bg-red-50 focus:text-red-700"
                                                onClick={() => {
                                                    if (confirm("Delete this issue?")) {
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
                                <TableCell colSpan={7} className="h-32 text-center text-slate-400 text-sm font-medium italic">
                                    No tasks found matching your filters.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
