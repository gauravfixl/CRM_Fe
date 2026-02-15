"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    AlertCircle,
    Filter,
    Search,
    Plus,
    MoreHorizontal,
    ChevronDown,
    ArrowUpRight,
    MessageSquare,
    Paperclip,
    Target
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet } from "@/components/ui/sheet"
import TaskDetailDrawer from "@/shared/components/projectmanagement/task-detail-drawer"

const ISSUES_DATA = [
    { id: "WR-102", code: "WR-102", title: "Mobile Navigation Menu not closing on click", status: "In Progress", priority: "High", type: "Bug", assigned: "Sarah K.", created: "Jan 26, 2026", comments: 5, files: 2 },
    { id: "WR-105", code: "WR-105", title: "Hero Section padding issues on Safari", status: "To Do", priority: "Medium", type: "Bug", assigned: "Sahil S.", created: "Jan 27, 2026", comments: 0, files: 1 },
    { id: "WR-98", code: "WR-98", title: "Implement new logo across all headers", status: "Done", priority: "Low", type: "Task", assigned: "Mike L.", created: "Jan 22, 2026", comments: 12, files: 4 },
    { id: "WR-110", code: "WR-110", title: "API latency issues in user profile load", status: "In Progress", priority: "Critical", type: "Bug", assigned: "James W.", created: "Jan 27, 2026", comments: 3, files: 0 },
    { id: "WR-115", code: "WR-115", title: "Search component auto-focus logic", status: "Review", priority: "High", type: "Task", assigned: "Sahil S.", created: "Today", comments: 1, files: 0 },
]

export default function IssuesPage() {
    const { id } = useParams()
    const projectId = id as string
    const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

    const handleTaskClick = (task: any) => {
        setSelectedTaskId(task.id)
        setIsDrawerOpen(true)
    }

    const projectName = id === "p1" ? "Website Redesign" : "Project"

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Sheet for Task Details */}
            <TaskDetailDrawer
                taskId={selectedTaskId}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                projectId={projectId}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <Target className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">{projectName} Issues</h1>
                        <p className="text-[13px] text-slate-500 font-medium italic">Track bugs, tasks, and feature requests in one place.</p>
                    </div>
                </div>
                <Button className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2">
                    <Plus className="h-4 w-4 stroke-[3px]" />
                    Create Issue
                </Button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-6 mt-2">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-[350px]">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input placeholder="Search issues by name, ID or assignee..." className="pl-10 h-10 bg-white border-slate-200" />
                    </div>
                    <Button variant="outline" className="h-10 gap-2 font-bold text-slate-600 px-4">
                        <Filter size={16} />
                        Filter
                    </Button>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[12px] text-slate-500 font-bold">Group by:</span>
                        <Button variant="ghost" size="sm" className="h-8 text-[12px] font-bold text-indigo-600 bg-indigo-50 border-none">Status <ChevronDown className="h-3 w-3 ml-1" /></Button>
                    </div>
                </div>
            </div>

            {/* Issues Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/80 border-b border-slate-200">
                        <tr>
                            <th className="px-5 py-3 text-[13px] font-bold text-slate-500 w-[110px]">Type & ID</th>
                            <th className="px-5 py-3 text-[13px] font-bold text-slate-500">Title</th>
                            <th className="px-5 py-3 text-[13px] font-bold text-slate-500 w-[120px]">Status</th>
                            <th className="px-5 py-3 text-[13px] font-bold text-slate-500 w-[120px]">Priority</th>
                            <th className="px-5 py-3 text-[13px] font-bold text-slate-500 w-[150px]">Assignee</th>
                            <th className="px-5 py-3 text-[13px] font-bold text-slate-500 w-[40px]"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {ISSUES_DATA.map((issue) => (
                            <tr
                                key={issue.id}
                                onClick={() => handleTaskClick(issue)}
                                className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                            >
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1 rounded ${issue.type === 'Bug' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                                            <AlertCircle size={10} className="fill-current" />
                                        </div>
                                        <span className="text-[12px] font-bold text-slate-400">{issue.id}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-[14px] font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                                            {issue.title}
                                        </span>
                                        <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400 font-medium">
                                            <span>Created {issue.created}</span>
                                            <span className="flex items-center gap-1"><MessageSquare size={12} /> {issue.comments}</span>
                                            <span className="flex items-center gap-1"><Paperclip size={12} /> {issue.files}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <Badge variant="outline" className={`text-[11px] font-bold border-none ${issue.status === 'Done' ? 'bg-emerald-100 text-emerald-700' :
                                        issue.status === 'In Progress' ? 'bg-indigo-100 text-indigo-700' :
                                            issue.status === 'Review' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {issue.status}
                                    </Badge>
                                </td>
                                <td className="px-5 py-4">
                                    <span className={`text-[11px] font-bold flex items-center gap-1 ${issue.priority === 'Critical' ? 'text-rose-600' :
                                        issue.priority === 'High' ? 'text-amber-600' : 'text-blue-600'
                                        }`}>
                                        <div className={`h-1.5 w-1.5 rounded-full ${issue.priority === 'Critical' ? 'bg-rose-600 animate-pulse' :
                                            issue.priority === 'High' ? 'bg-amber-600' : 'bg-blue-600'
                                            }`} />
                                        {issue.priority}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${issue.assigned}`} />
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                        <span className="text-[13px] font-semibold text-slate-700 truncate">{issue.assigned}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-slate-600">
                                        <MoreHorizontal size={16} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[12px] text-slate-500 font-medium">Showing 5 of 142 issues</span>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 px-3 text-[12px] font-bold">Previous</Button>
                        <Button variant="outline" size="sm" className="h-8 px-3 text-[12px] font-bold bg-white">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
