"use client"

import React, { useState, useMemo } from "react"
import {
    Activity, User, Timer, BarChart3, PieChart, AlertTriangle, Users,
    Clock, X, Plus, CheckSquare, Bug, BookOpen, Layers, Circle,
    Flame, ArrowUp, ArrowDown, Minus, Eye, EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useIssueStore, type Issue, type IssuePriority, type IssueStatus, type IssueType } from "@/shared/data/issue-store"
import { useSprintEpicStore } from "@/shared/data/sprint-epic-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CURRENT_USER_ID = "u1"

type WidgetId = "activity" | "assigned" | "sprint-status" | "priority" | "status-dist" | "overdue" | "workload" | "recent"

interface WidgetConfig {
    id: WidgetId
    title: string
    icon: React.ReactNode
    description: string
}

const ALL_WIDGETS: WidgetConfig[] = [
    { id: "activity", title: "Activity Stream", icon: <Activity className="w-4 h-4 text-blue-500" />, description: "Recent issue changes and updates" },
    { id: "assigned", title: "Assigned to Me", icon: <User className="w-4 h-4 text-indigo-500" />, description: "Your open issues" },
    { id: "sprint-status", title: "Sprint Status", icon: <Timer className="w-4 h-4 text-green-500" />, description: "Current sprint progress" },
    { id: "priority", title: "Priority Breakdown", icon: <BarChart3 className="w-4 h-4 text-orange-500" />, description: "Issues by priority level" },
    { id: "status-dist", title: "Status Distribution", icon: <PieChart className="w-4 h-4 text-purple-500" />, description: "Issues by status" },
    { id: "overdue", title: "Overdue Issues", icon: <AlertTriangle className="w-4 h-4 text-red-500" />, description: "Past due date issues" },
    { id: "workload", title: "Workload", icon: <Users className="w-4 h-4 text-teal-500" />, description: "Tasks per assignee" },
    { id: "recent", title: "Recent Issues", icon: <Clock className="w-4 h-4 text-zinc-500" />, description: "Recently created issues" },
]

const typeIcons: Record<IssueType, React.ReactNode> = {
    TASK: <CheckSquare className="w-3 h-3 text-blue-500" />,
    BUG: <Bug className="w-3 h-3 text-red-500" />,
    STORY: <BookOpen className="w-3 h-3 text-green-500" />,
    EPIC: <Layers className="w-3 h-3 text-purple-500" />,
    SUBTASK: <Circle className="w-3 h-3 text-zinc-400" />,
}

const priorityConfig: Record<IssuePriority, { icon: React.ReactNode; color: string; barColor: string }> = {
    URGENT: { icon: <Flame className="w-3 h-3" />, color: "bg-red-100 text-red-700", barColor: "bg-red-500" },
    HIGH: { icon: <ArrowUp className="w-3 h-3" />, color: "bg-orange-100 text-orange-700", barColor: "bg-orange-500" },
    MEDIUM: { icon: <Minus className="w-3 h-3" />, color: "bg-blue-100 text-blue-700", barColor: "bg-blue-500" },
    LOW: { icon: <ArrowDown className="w-3 h-3" />, color: "bg-zinc-100 text-zinc-600", barColor: "bg-zinc-400" },
}

const statusConfig: Record<string, { color: string; barColor: string }> = {
    TODO: { color: "bg-zinc-100 text-zinc-600", barColor: "bg-zinc-400" },
    IN_PROGRESS: { color: "bg-blue-100 text-blue-700", barColor: "bg-blue-500" },
    IN_REVIEW: { color: "bg-purple-100 text-purple-700", barColor: "bg-purple-500" },
    DONE: { color: "bg-green-100 text-green-700", barColor: "bg-green-500" },
    BACKLOG: { color: "bg-zinc-50 text-zinc-500", barColor: "bg-zinc-300" },
    BLOCKED: { color: "bg-red-100 text-red-600", barColor: "bg-red-400" },
}

export default function DashboardPage() {
    const { issues } = useIssueStore()
    const { sprints } = useSprintEpicStore()
    const { projects } = useProjectStore()
    const { activeWorkspaceId } = useWorkspaceStore()
    const [selectedProjectId, setSelectedProjectId] = useState<string>("")

    const workspaceProjects = useMemo(() => projects.filter(p => !activeWorkspaceId || p.workspaceId === activeWorkspaceId), [projects, activeWorkspaceId])
    React.useEffect(() => { if (!selectedProjectId && workspaceProjects.length > 0) setSelectedProjectId(workspaceProjects[0].id) }, [workspaceProjects, selectedProjectId])

    const [visibleWidgets, setVisibleWidgets] = useState<Set<WidgetId>>(new Set(ALL_WIDGETS.map(w => w.id)))
    const [widgetDialogOpen, setWidgetDialogOpen] = useState(false)

    const projectIssues = useMemo(() => issues.filter(i => i.projectId === selectedProjectId), [issues, selectedProjectId])
    const activeSprint = useMemo(() => sprints.find(s => s.projectId === selectedProjectId && s.status === "ACTIVE"), [sprints, selectedProjectId])

    // Activity stream: get last 10 history entries across all issues
    const activityStream = useMemo(() => {
        const allHistory: { issueId: string; issueTitle: string; entry: Issue["history"] extends (infer T)[] ? T : never }[] = []
        projectIssues.forEach(issue => {
            (issue.history || []).forEach(entry => {
                allHistory.push({ issueId: issue.id, issueTitle: issue.title, entry: entry as any })
            })
        })
        return allHistory.sort((a, b) => new Date((b.entry as any).changedAt).getTime() - new Date((a.entry as any).changedAt).getTime()).slice(0, 10)
    }, [projectIssues])

    // Assigned to current user
    const myIssues = useMemo(() => projectIssues.filter(i => i.assigneeId === CURRENT_USER_ID && i.status !== "DONE"), [projectIssues])

    // Sprint metrics
    const sprintIssues = useMemo(() => activeSprint ? projectIssues.filter(i => i.sprintId === activeSprint.id) : [], [projectIssues, activeSprint])
    const sprintDone = sprintIssues.filter(i => i.status === "DONE").length
    const sprintTotal = sprintIssues.length
    const sprintPointsRemaining = sprintIssues.filter(i => i.status !== "DONE").reduce((sum, i) => sum + (i.storyPoints || 0), 0)
    const sprintDaysRemaining = activeSprint?.endDate ? Math.max(0, Math.ceil((new Date(activeSprint.endDate).getTime() - Date.now()) / 86400000)) : 0

    // Priority breakdown
    const priorityCounts = useMemo(() => {
        const counts: Record<string, number> = { URGENT: 0, HIGH: 0, MEDIUM: 0, LOW: 0 }
        projectIssues.forEach(i => { counts[i.priority] = (counts[i.priority] || 0) + 1 })
        return counts
    }, [projectIssues])

    // Status distribution
    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = {}
        projectIssues.forEach(i => { counts[i.status] = (counts[i.status] || 0) + 1 })
        return counts
    }, [projectIssues])

    // Overdue issues
    const overdueIssues = useMemo(() => {
        const now = new Date()
        return projectIssues.filter(i => i.dueDate && new Date(i.dueDate) < now && i.status !== "DONE")
    }, [projectIssues])

    // Workload per assignee
    const workload = useMemo(() => {
        const counts: Record<string, { name: string; count: number }> = {}
        projectIssues.forEach(i => {
            if (i.assigneeId) {
                if (!counts[i.assigneeId]) counts[i.assigneeId] = { name: i.assignee?.name || i.assigneeId, count: 0 }
                counts[i.assigneeId].count++
            }
        })
        return Object.values(counts).sort((a, b) => b.count - a.count)
    }, [projectIssues])

    // Recent issues
    const recentIssues = useMemo(() => {
        return [...projectIssues].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8)
    }, [projectIssues])

    const toggleWidget = (id: WidgetId) => {
        setVisibleWidgets(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const removeWidget = (id: WidgetId) => {
        setVisibleWidgets(prev => {
            const next = new Set(prev)
            next.delete(id)
            return next
        })
        toast.success("Widget removed")
    }

    const maxWorkload = Math.max(...workload.map(w => w.count), 1)
    const totalIssues = projectIssues.length || 1

    const WidgetCard = ({ id, title, icon, children }: { id: WidgetId; title: string; icon: React.ReactNode; children: React.ReactNode }) => {
        if (!visibleWidgets.has(id)) return null
        return (
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
                    <div className="flex items-center gap-2">
                        {icon}
                        <span className="text-xs font-bold text-zinc-900">{title}</span>
                    </div>
                    <Button variant="ghost" className="h-5 w-5 p-0 text-zinc-400 hover:text-red-500" onClick={() => removeWidget(id)}>
                        <X className="w-3 h-3" />
                    </Button>
                </div>
                <div className="px-4 py-3 flex-1">{children}</div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-[#fafafa]">
            <div className="flex-1 flex flex-col gap-5 p-6">
                {/* BREADCRUMB & HEADER */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                        <span>PROJECTS</span><span>/</span><span className="text-zinc-900 font-semibold">DASHBOARD</span>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                        <div>
                            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Dashboard</h1>
                            <p className="text-xs text-zinc-500 font-medium">Workspace overview and key metrics at a glance.</p>
                        </div>
                        <Dialog open={widgetDialogOpen} onOpenChange={setWidgetDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white">
                                    <Plus className="w-3.5 h-3.5 mr-2" /> Add Widget
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="text-sm font-bold text-zinc-900">Manage Widgets</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-2 mt-2">
                                    {ALL_WIDGETS.map(widget => (
                                        <div key={widget.id} className="flex items-center justify-between px-3 py-2.5 bg-zinc-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                {widget.icon}
                                                <div>
                                                    <p className="text-xs font-medium text-zinc-900">{widget.title}</p>
                                                    <p className="text-[10px] text-zinc-400">{widget.description}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                className={`h-7 rounded-md text-[10px] font-medium px-2.5 shadow-sm active:scale-95 ${visibleWidgets.has(widget.id) ? "border-indigo-200 text-indigo-600" : ""}`}
                                                onClick={() => toggleWidget(widget.id)}
                                            >
                                                {visibleWidgets.has(widget.id) ? <><Eye className="w-3 h-3 mr-1" /> Visible</> : <><EyeOff className="w-3 h-3 mr-1" /> Hidden</>}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* WIDGET GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Activity Stream */}
                    <WidgetCard id="activity" title="Activity Stream" icon={<Activity className="w-4 h-4 text-blue-500" />}>
                        {activityStream.length > 0 ? (
                            <div className="space-y-2.5 max-h-64 overflow-y-auto">
                                {activityStream.map((item, i) => {
                                    const entry = item.entry as any
                                    return (
                                        <div key={i} className="flex items-start gap-2 text-xs">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                            <div>
                                                <span className="font-medium text-zinc-700">{entry.changedBy || "User"}</span>
                                                <span className="text-zinc-500"> changed {entry.field} of </span>
                                                <span className="font-medium text-zinc-700">{item.issueId}</span>
                                                <span className="text-zinc-500"> from </span>
                                                <Badge variant="outline" className="text-[9px] px-1 py-0">{entry.oldValue}</Badge>
                                                <span className="text-zinc-500"> to </span>
                                                <Badge variant="outline" className="text-[9px] px-1 py-0">{entry.newValue}</Badge>
                                                <p className="text-[10px] text-zinc-400 mt-0.5">{new Date(entry.changedAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-xs text-zinc-400">No recent activity. Changes to issues will appear here.</div>
                        )}
                    </WidgetCard>

                    {/* Assigned to Me */}
                    <WidgetCard id="assigned" title="Assigned to Me" icon={<User className="w-4 h-4 text-indigo-500" />}>
                        {myIssues.length > 0 ? (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {myIssues.map(issue => (
                                    <div key={issue.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-zinc-50 cursor-pointer">
                                        {typeIcons[issue.type]}
                                        <span className="font-mono text-[10px] text-zinc-400 w-16 shrink-0">{issue.id}</span>
                                        <span className="text-xs text-zinc-900 font-medium truncate flex-1">{issue.title}</span>
                                        <Badge className={`text-[9px] px-1.5 py-0 border-none ${statusConfig[issue.status]?.color || "bg-zinc-100 text-zinc-500"}`}>
                                            {issue.status.replace(/_/g, " ")}
                                        </Badge>
                                        <Badge className={`text-[9px] px-1.5 py-0 border-none ${priorityConfig[issue.priority].color}`}>
                                            {priorityConfig[issue.priority].icon}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-xs text-zinc-400">No open issues assigned to you.</div>
                        )}
                    </WidgetCard>

                    {/* Sprint Status */}
                    <WidgetCard id="sprint-status" title="Sprint Status" icon={<Timer className="w-4 h-4 text-green-500" />}>
                        {activeSprint ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-zinc-900">{activeSprint.name}</span>
                                    <Badge className="text-[9px] px-1.5 py-0 bg-green-100 text-green-700 border-none">Active</Badge>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[10px] text-zinc-500 mb-1">
                                        <span>{sprintDone} / {sprintTotal} done</span>
                                        <span>{sprintTotal > 0 ? Math.round((sprintDone / sprintTotal) * 100) : 0}%</span>
                                    </div>
                                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                                            style={{ width: `${sprintTotal > 0 ? (sprintDone / sprintTotal) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-zinc-50 rounded-lg p-2.5 text-center">
                                        <p className="text-lg font-bold text-zinc-900">{sprintDaysRemaining}</p>
                                        <p className="text-[10px] text-zinc-400">Days Remaining</p>
                                    </div>
                                    <div className="bg-zinc-50 rounded-lg p-2.5 text-center">
                                        <p className="text-lg font-bold text-zinc-900">{sprintPointsRemaining}</p>
                                        <p className="text-[10px] text-zinc-400">Points Left</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-xs text-zinc-400">No active sprint. Start a sprint from the Backlog page.</div>
                        )}
                    </WidgetCard>

                    {/* Priority Breakdown */}
                    <WidgetCard id="priority" title="Priority Breakdown" icon={<BarChart3 className="w-4 h-4 text-orange-500" />}>
                        <div className="space-y-2.5">
                            {(["URGENT", "HIGH", "MEDIUM", "LOW"] as IssuePriority[]).map(p => {
                                const count = priorityCounts[p] || 0
                                const pct = totalIssues > 0 ? (count / totalIssues) * 100 : 0
                                return (
                                    <div key={p} className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {priorityConfig[p].icon}
                                                <span className="text-xs font-medium text-zinc-700">{p}</span>
                                            </div>
                                            <span className="text-xs font-bold text-zinc-900">{count}</span>
                                        </div>
                                        <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all duration-500 ${priorityConfig[p].barColor}`} style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </WidgetCard>

                    {/* Status Distribution */}
                    <WidgetCard id="status-dist" title="Status Distribution" icon={<PieChart className="w-4 h-4 text-purple-500" />}>
                        <div className="space-y-2.5">
                            {(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BACKLOG", "BLOCKED"] as IssueStatus[]).map(s => {
                                const count = statusCounts[s] || 0
                                if (count === 0) return null
                                const pct = totalIssues > 0 ? (count / totalIssues) * 100 : 0
                                return (
                                    <div key={s} className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-zinc-700">{s.replace(/_/g, " ")}</span>
                                            <span className="text-xs font-bold text-zinc-900">{count}</span>
                                        </div>
                                        <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all duration-500 ${statusConfig[s]?.barColor || "bg-zinc-300"}`} style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </WidgetCard>

                    {/* Overdue Issues */}
                    <WidgetCard id="overdue" title="Overdue Issues" icon={<AlertTriangle className="w-4 h-4 text-red-500" />}>
                        {overdueIssues.length > 0 ? (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {overdueIssues.map(issue => (
                                    <div key={issue.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-red-50/50 border border-red-100">
                                        {typeIcons[issue.type]}
                                        <span className="font-mono text-[10px] text-zinc-400 w-16 shrink-0">{issue.id}</span>
                                        <span className="text-xs text-zinc-900 font-medium truncate flex-1">{issue.title}</span>
                                        <span className="text-[10px] text-red-600 font-medium shrink-0">
                                            Due {issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : "N/A"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-xs text-zinc-400">No overdue issues. Great job!</div>
                        )}
                    </WidgetCard>

                    {/* Workload */}
                    <WidgetCard id="workload" title="Workload" icon={<Users className="w-4 h-4 text-teal-500" />}>
                        {workload.length > 0 ? (
                            <div className="space-y-2.5">
                                {workload.map(w => (
                                    <div key={w.name} className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-zinc-700 truncate">{w.name}</span>
                                            <span className="text-xs font-bold text-zinc-900">{w.count} tasks</span>
                                        </div>
                                        <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-teal-500 rounded-full transition-all duration-500" style={{ width: `${(w.count / maxWorkload) * 100}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-xs text-zinc-400">No assignee data available.</div>
                        )}
                    </WidgetCard>

                    {/* Recent Issues */}
                    <WidgetCard id="recent" title="Recent Issues" icon={<Clock className="w-4 h-4 text-zinc-500" />}>
                        {recentIssues.length > 0 ? (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {recentIssues.map(issue => (
                                    <div key={issue.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-zinc-50">
                                        {typeIcons[issue.type]}
                                        <span className="text-xs text-zinc-900 font-medium truncate flex-1">{issue.title}</span>
                                        <span className="text-[10px] text-zinc-400 shrink-0">{new Date(issue.createdAt).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-xs text-zinc-400">No issues created yet.</div>
                        )}
                    </WidgetCard>
                </div>

                {/* Empty state when all widgets hidden */}
                {Array.from(visibleWidgets).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <EyeOff className="w-10 h-10 text-zinc-300 mb-3" />
                        <p className="text-sm font-medium text-zinc-500">All widgets are hidden</p>
                        <p className="text-xs text-zinc-400 mt-1">Click "Add Widget" to show dashboard widgets.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
