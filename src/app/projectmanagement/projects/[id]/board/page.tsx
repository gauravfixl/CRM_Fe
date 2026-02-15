"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import {
    Plus,
    MoreHorizontal,
    Search,
    Filter,
    Target,
    Layout,
    PlusCircle,
    Settings2,
    Users,
    Play,
    Clock,
    Zap,
    Sparkles,
    Bug
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog } from "@/components/ui/dialog"
import { Sheet } from "@/components/ui/sheet"
import TaskDetailDrawer from "@/shared/components/projectmanagement/task-detail-drawer"
import { CreateIssueModal } from "@/shared/components/projectmanagement/create-issue-modal"
import WorkflowSettingsModal from "@/shared/components/projectmanagement/workflow-settings-modal"
import MemberManagementDrawer from "@/shared/components/projectmanagement/member-management-drawer"
import { useIssueStore, IssueStatus } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { usePermissions } from "@/shared/hooks/use-permissions"
import { useWorkflowStore } from "@/shared/data/workflow-store"
import { useSprintEpicStore } from "@/shared/data/sprint-epic-store"
import { cn } from "@/lib/utils"

export default function ProjectBoard() {
    const { id } = useParams()
    const projectId = id as string

    // Zustand Store Sync
    const { getIssuesByProject, addIssue, updateIssueStatus } = useIssueStore()
    const { getProjectById } = useProjectStore()
    const { getSprintsByProject, getEpicsByProject, getActiveSprint } = useSprintEpicStore()

    const project = getProjectById(projectId)
    const issues = getIssuesByProject(projectId)
    const sprints = getSprintsByProject(projectId)
    const epics = getEpicsByProject(projectId)
    const activeSprint = getActiveSprint(projectId)

    // Local State for Management
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
    const [quickAddValues, setQuickAddValues] = useState<Record<string, string>>({})
    const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false)
    const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false)
    const [isMemberDrawerOpen, setIsMemberDrawerOpen] = useState(false)

    // RBAC Permissions
    const permissions = usePermissions({ projectId })

    // Workflow Configuration
    const { getConfig, canTransition } = useWorkflowStore()
    const boardConfig = getConfig(projectId)

    // HYBRID LOGIC: Toggle based on methodology
    const isScrum = project?.methodology === 'scrum'

    const boardIssues = isScrum && activeSprint
        ? issues.filter(i => i.sprintId === activeSprint.id)
        : issues // Show all issues for Kanban or if no sprint in Scrum

    const filteredIssues = boardIssues.filter(i =>
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.id.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const onDrop = (e: React.DragEvent, status: IssueStatus) => {
        e.preventDefault()
        const issueId = e.dataTransfer.getData("issueId")
        if (issueId) {
            const issue = issues.find(i => i.id === issueId)
            if (issue && !canTransition(projectId, issue.status, status)) {
                // Show error toast or notification
                console.warn(`Transition from ${issue.status} to ${status} is not allowed`)
                return
            }
            // Use enhanced updateIssueStatus with userId tracking
            updateIssueStatus(issueId, status, "u1") // TODO: Replace with actual logged-in user ID
        }
    }

    const onDragStart = (e: React.DragEvent, issueId: string) => {
        e.dataTransfer.setData("issueId", issueId)
        e.dataTransfer.effectAllowed = "move"
    }

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleQuickAdd = (status: IssueStatus) => {
        const title = quickAddValues[status]?.trim()
        if (!title) return

        addIssue({
            id: `${project?.key || 'TASK'}-${Math.floor(Math.random() * 900) + 100}`,
            projectId,
            title,
            description: "",
            status,
            priority: "MEDIUM",
            type: "TASK",
            assigneeId: "u1",
            reporterId: "u1",
            sprintId: activeSprint?.id || null,
            createdAt: new Date().toISOString(),
            columnOrder: 0,
            history: []
        })

        setQuickAddValues(prev => ({ ...prev, [status]: "" }))
    }

    return (
        <div className="flex flex-col h-full gap-4 animate-in fade-in duration-700 font-sans">
            {/* 1. Board Header (Sprint Info & Actions) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                            {isScrum ? (activeSprint?.name || "Sprint Board") : "Kanban Board"}
                        </h1>
                        {isScrum && activeSprint && (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-200 text-[9px] font-bold px-1.5 h-4.5 rounded-full uppercase">
                                Active
                            </Badge>
                        )}
                    </div>
                    {(isScrum ? activeSprint?.goal : project?.description) && (
                        <p className="text-[12px] text-slate-400 font-medium">
                            {isScrum ? activeSprint?.goal : project?.description}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {isScrum && (
                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200/60 shadow-sm">
                            <Clock size={12} className="text-indigo-500 ml-1" />
                            <span className="text-[10px] font-bold text-slate-600 px-1">4d remaining</span>
                        </div>
                    )}
                    <Button
                        onClick={() => setIsCreateIssueOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-8 px-3 rounded-lg shadow-sm text-[11px] border-none"
                    >
                        <Plus size={14} className="mr-1.5" />
                        Create
                    </Button>
                </div>
            </div>

            {/* 3. Controls Layer (Quick Filters) */}
            <div className="flex flex-wrap items-center gap-6 py-2">
                <div className="relative w-56">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                        placeholder="Search board..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 h-9 bg-white border border-slate-200 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 rounded-lg text-[12px] font-medium transition-all outline-none text-slate-600 placeholder:text-slate-400"
                    />
                </div>

                <div className="flex items-center -space-x-1.5">
                    {[1, 2, 3, 4].map(i => (
                        <Avatar key={i} className="h-7 w-7 border-2 border-white shadow-sm hover:translate-y-[-2px] transition-transform cursor-pointer">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${i}`} />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                    ))}
                    <div className="h-7 w-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
                        +8
                    </div>
                </div>

                <div className="flex items-center gap-2 border-l border-slate-200 pl-6">
                    <button className="text-[11px] font-bold text-slate-500 hover:text-slate-900 transition-colors">Only My Issues</button>
                    <button className="text-[11px] font-bold text-slate-500 hover:text-slate-900 transition-colors">Recently Updated</button>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    {permissions.canConfigureWorkflow && (
                        <Button
                            variant="ghost"
                            onClick={() => setIsWorkflowModalOpen(true)}
                            className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                        >
                            <Settings2 size={16} />
                        </Button>
                    )}
                </div>
            </div>

            {/* The Canvas (Scrum Lanes - Compacted) */}
            <div className="flex-1 flex gap-6 overflow-x-auto pb-6 custom-scrollbar scroll-smooth">
                {boardConfig.columns.map((col) => {
                    const status = col.key as IssueStatus
                    const columnIssues = filteredIssues.filter(i => i.status === status)
                    return (
                        <div
                            key={col.key}
                            onDragOver={onDragOver}
                            onDrop={(e) => onDrop(e, status)}
                            className="flex-shrink-0 w-80 flex flex-col h-full bg-slate-50/50 rounded-[24px] border border-slate-200 p-2 group/col transition-all"
                        >
                            {/* Column Header */}
                            <div className="px-3 py-3 flex items-center justify-between border-b border-slate-200/40 mb-2">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <h3 className="text-[11px] font-bold uppercase tracking-wider">{col.name}</h3>
                                    <span className="text-[11px] font-bold bg-slate-200/50 text-slate-500 px-1.5 rounded-full">
                                        {columnIssues.length}
                                    </span>
                                </div>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-slate-100 rounded-md">
                                    <MoreHorizontal size={14} className="text-slate-400" />
                                </Button>
                            </div>

                            {/* List Area */}
                            <div className="flex-1 px-1 space-y-2 overflow-y-auto min-h-[200px] py-1 custom-scrollbar">
                                {columnIssues.map(issue => {
                                    const issueEpic = epics.find(e => e.id === issue.epicId)
                                    return (
                                        <Card
                                            key={issue.id}
                                            draggable
                                            onDragStart={(e) => onDragStart(e, issue.id)}
                                            onClick={() => setSelectedTaskId(issue.id)}
                                            className="border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-grab active:scale-[0.99] group/card bg-white rounded-lg p-0.5"
                                        >
                                            <CardContent className="p-3 space-y-2">
                                                <div className="text-[12px] font-medium text-slate-800 leading-snug group-hover/card:text-indigo-600 transition-colors line-clamp-2">
                                                    {issue.title}
                                                </div>

                                                <div className="flex items-center justify-between pt-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-1.5 opacity-80 scale-90 -ml-1">
                                                            {issue.type === 'BUG' ? <Bug size={14} className="text-rose-500" /> : <Zap size={14} className="text-indigo-500" />}
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{issue.id.split('-').pop()}</span>
                                                        </div>
                                                        {issue.priority === 'URGENT' && (
                                                            <div className="h-1 w-4 bg-rose-500 rounded-full" />
                                                        )}
                                                    </div>
                                                    <Avatar className="h-5 w-5 border border-white shadow-sm shrink-0">
                                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${issue.assigneeId}`} />
                                                        <AvatarFallback className="text-[8px]">U</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}

                                {columnIssues.length === 0 && (
                                    <div className="flex-1 flex flex-col items-center justify-center min-h-[150px] border-2 border-dashed border-slate-200 rounded-[20px] bg-slate-50/50 m-2">
                                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-slate-300 shadow-sm mb-2">
                                            <Plus size={20} />
                                        </div>
                                        <span className="text-[13px] font-medium text-slate-400">Empty list</span>
                                    </div>
                                )}
                            </div>

                            {/* QUICK ADD */}
                            <div className="p-3">
                                <div className="relative group/input">
                                    <Plus className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" />
                                    <input
                                        placeholder="New deliverable..."
                                        value={quickAddValues[status] || ""}
                                        onChange={(e) => setQuickAddValues(prev => ({ ...prev, [status]: e.target.value }))}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleQuickAdd(status)
                                        }}
                                        className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[13px] font-medium outline-none hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-700 placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* PROJECT ARCHITECTURE MODALS & DRAWERS */}
            <Dialog open={isWorkflowModalOpen} onOpenChange={setIsWorkflowModalOpen}>
                <WorkflowSettingsModal
                    projectId={projectId}
                    onClose={() => setIsWorkflowModalOpen(false)}
                />
            </Dialog>

            <Sheet open={isMemberDrawerOpen} onOpenChange={setIsMemberDrawerOpen}>
                <MemberManagementDrawer
                    type="PROJECT"
                    id={projectId}
                    onClose={() => setIsMemberDrawerOpen(false)}
                />
            </Sheet>

            <TaskDetailDrawer
                taskId={selectedTaskId}
                isOpen={!!selectedTaskId}
                onClose={() => setSelectedTaskId(null)}
                projectId={projectId}
            />

            <CreateIssueModal
                projectId={projectId}
                isOpen={isCreateIssueOpen}
                onClose={() => setIsCreateIssueOpen(false)}
            />
        </div>
    )
}
