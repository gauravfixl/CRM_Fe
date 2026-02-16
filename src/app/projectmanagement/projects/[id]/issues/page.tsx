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

import { useIssueStore } from "@/shared/data/issue-store"

export default function IssuesPage() {
    const { id } = useParams()
    const projectId = id as string

    // State for Task Detail View
    const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

    const handleTaskClick = (task: any) => {
        setSelectedTaskId(task.id)
        setIsDrawerOpen(true)
    }

    const projectName = id === "p1" ? "Website Redesign" : "Project"

    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const { getIssuesByProject, addIssue } = useIssueStore()
    const issues = getIssuesByProject(projectId)

    // Create Issue Form State
    const [newItem, setNewItem] = useState({ title: "", type: "TASK" as const, priority: "MEDIUM" as const })

    const handleCreate = () => {
        if (!newItem.title.trim()) return
        addIssue({
            id: `ISSUE-${Date.now()}`,
            title: newItem.title,
            type: newItem.type,
            priority: newItem.priority,
            status: "TODO",
            projectId,
            boardId: "b1",
            assigneeId: "u1",
            reporterId: "u1",
            description: "",
            createdAt: new Date().toISOString()
        })
        setCreateDialogOpen(false)
        setNewItem({ title: "", type: "TASK", priority: "MEDIUM" })
    }

    return (
        <div className="flex flex-col h-full gap-6 max-w-7xl">
            {/* Sheet for Task Details */}
            <TaskDetailDrawer
                taskId={selectedTaskId}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                projectId={projectId}
            />

            {/* Create Issue Dialog */}
            <Sheet open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                {/* Reusing Sheet for quick creation or simple Dialog can work, but let's use a Dialog for consistency with Backlog or just a simple form here */}
            </Sheet>

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
                <div className="flex items-center gap-2">
                    <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center">
                        <Search className="h-4 w-4 text-slate-400 ml-2" />
                        <Input placeholder="Search..." className="h-8 border-none bg-transparent w-48 focus-visible:ring-0" />
                    </div>
                    <Button onClick={() => {
                        const title = prompt("Enter issue title:")
                        if (title) {
                            addIssue({
                                id: `ISSUE-${Date.now()}`,
                                title,
                                type: "TASK",
                                priority: "MEDIUM",
                                status: "TODO",
                                projectId,
                                boardId: "b1",
                                createdAt: new Date().toISOString(),
                                description: "",
                                assigneeId: "",
                                reporterId: "u1"
                            })
                        }
                    }} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2">
                        <Plus className="h-4 w-4 stroke-[3px]" />
                        Create Issue
                    </Button>
                </div>
            </div>

            {/* Issues Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex-1">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/80 border-b border-slate-200">
                        <tr>
                            <th className="px-5 py-3 text-[13px] font-bold text-slate-500 w-[110px]">ID</th>
                            <th className="px-5 py-3 text-[13px] font-bold text-slate-500">Title</th>
                            <th className="px-5 py-3 text-[13px] font-bold text-slate-500 w-[120px]">Status</th>
                            <th className="px-5 py-3 text-[13px] font-bold text-slate-500 w-[120px]">Priority</th>
                            <th className="px-5 py-3 text-[13px] font-bold text-slate-500 w-[150px]">Assignee</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {issues.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">No issues found. Create one to get started.</td>
                            </tr>
                        ) : (
                            issues.map((issue) => (
                                <tr
                                    key={issue.id}
                                    onClick={() => handleTaskClick(issue)}
                                    className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                                >
                                    <td className="px-5 py-4 text-[12px] font-bold text-slate-400">{issue.id}</td>
                                    <td className="px-5 py-4">
                                        <div className="font-bold text-slate-800">{issue.title}</div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <Badge variant="outline" className="bg-slate-100 text-slate-600 border-none">{issue.status}</Badge>
                                    </td>
                                    <td className="px-5 py-4">
                                        <Badge variant="outline" className={`border-none ${issue.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>{issue.priority}</Badge>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={`https://i.pravatar.cc/150?u=${issue.assigneeId}`} />
                                                <AvatarFallback>U</AvatarFallback>
                                            </Avatar>
                                            <span className="text-[13px] text-slate-600">{issue.assigneeId || "Unassigned"}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
