"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useParams } from "next/navigation"
import {
    Search, Plus, MoreHorizontal, ChevronDown, ChevronRight,
    CheckSquare, Bug, BookOpen, Layers, Circle, AlertTriangle,
    ArrowUp, ArrowDown, Minus, Flame, X, PanelRightOpen, PanelRightClose,
    GripVertical, Trash2, Edit3, UserPlus, Hash, ArrowRightCircle, Kanban
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import { useIssueStore, Issue, IssuePriority, IssueType } from "@/shared/data/issue-store"
import { useSprintEpicStore, Sprint } from "@/shared/data/sprint-epic-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import { createTask, updateTask } from "@/modules/project-management/task/hooks/taskHooks"

const typeIcons: Record<IssueType, React.ReactNode> = {
    TASK: <CheckSquare className="w-3.5 h-3.5 text-blue-500" />,
    BUG: <Bug className="w-3.5 h-3.5 text-red-500" />,
    STORY: <BookOpen className="w-3.5 h-3.5 text-green-500" />,
    EPIC: <Layers className="w-3.5 h-3.5 text-purple-500" />,
    SUBTASK: <Circle className="w-3.5 h-3.5 text-zinc-400" />,
}

const priorityConfig: Record<IssuePriority, { icon: React.ReactNode; color: string }> = {
    URGENT: { icon: <Flame className="w-3 h-3" />, color: "bg-red-100 text-red-700" },
    HIGH: { icon: <ArrowUp className="w-3 h-3" />, color: "bg-orange-100 text-orange-700" },
    MEDIUM: { icon: <Minus className="w-3 h-3" />, color: "bg-yellow-100 text-yellow-700" },
    LOW: { icon: <ArrowDown className="w-3 h-3" />, color: "bg-blue-100 text-blue-700" },
}

const statusColors: Record<string, string> = {
    TODO: "bg-zinc-100 text-zinc-600",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    IN_REVIEW: "bg-purple-100 text-purple-700",
    DONE: "bg-green-100 text-green-700",
    BACKLOG: "bg-zinc-50 text-zinc-500",
    BLOCKED: "bg-red-100 text-red-600",
}

export default function BacklogPage() {
    const params = useParams()
    const { issues, addIssue, updateIssue, deleteIssue } = useIssueStore()
    const { sprints, epics, addSprint, updateSprint, getSprintsByProject, getEpicsByProject } = useSprintEpicStore()
    const { projects } = useProjectStore()
    const { activeWorkspaceId } = useWorkspaceStore()

    const [selectedProjectId, setSelectedProjectId] = useState<string>("")
    const [searchQuery, setSearchQuery] = useState("")
    const [epicFilter, setEpicFilter] = useState<string | null>(null)
    const [showEpicPanel, setShowEpicPanel] = useState(false)
    const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())
    const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set())
    const [inlineInputs, setInlineInputs] = useState<Record<string, string>>({})

    const workspaceProjects = useMemo(() =>
        projects.filter(p => !activeWorkspaceId || p.workspaceId === activeWorkspaceId),
        [projects, activeWorkspaceId]
    )

    useEffect(() => {
        if (!selectedProjectId && workspaceProjects.length > 0) {
            setSelectedProjectId(workspaceProjects[0].id)
        }
    }, [workspaceProjects, selectedProjectId])

    const projectSprints = getSprintsByProject(selectedProjectId)
    const projectEpics = getEpicsByProject(selectedProjectId)
    const projectIssues = useMemo(() => {
        let filtered = issues.filter(i => i.projectId === selectedProjectId && i.type !== "SUBTASK")
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            filtered = filtered.filter(i => i.title.toLowerCase().includes(q) || i.id.toLowerCase().includes(q))
        }
        if (epicFilter) {
            filtered = filtered.filter(i => i.epicId === epicFilter)
        }
        return filtered
    }, [issues, searchQuery, epicFilter])

    const activeSprints = projectSprints.filter(s => s.status === "ACTIVE")
    const plannedSprints = projectSprints.filter(s => s.status === "PLANNED")
    const backlogIssues = projectIssues.filter(i => !i.sprintId)
    const unestimated = projectIssues.filter(i => !i.storyPoints)

    const toggleSection = (id: string) => {
        setCollapsedSections(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const toggleSelectIssue = (id: string) => {
        setSelectedIssues(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const toggleSelectAll = (issueIds: string[]) => {
        setSelectedIssues(prev => {
            const allSelected = issueIds.every(id => prev.has(id))
            const next = new Set(prev)
            if (allSelected) {
                issueIds.forEach(id => next.delete(id))
            } else {
                issueIds.forEach(id => next.add(id))
            }
            return next
        })
    }

    const handleCreateSprint = () => {
        const num = projectSprints.length + 1
        const newSprint: Sprint = {
            id: `sprint-${Date.now()}`,
            projectId: selectedProjectId,
            name: `Sprint ${num}`,
            goal: "",
            status: "PLANNED",
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 14 * 86400000).toISOString(),
            createdAt: new Date().toISOString(),
        }
        addSprint(newSprint)
        toast.success(`Sprint ${num} created`)
    }

    const handleStartSprint = (sprintId: string) => {
        updateSprint(sprintId, { status: "ACTIVE", startDate: new Date().toISOString() })
        toast.success("Sprint started")
    }

    const handleCompleteSprint = (sprintId: string) => {
        updateSprint(sprintId, { status: "COMPLETED" })
        const sprintIssues = projectIssues.filter(i => i.sprintId === sprintId && i.status !== "DONE")
        sprintIssues.forEach(issue => {
            updateIssue(issue.id, { sprintId: null })
        })
        toast.success(`Sprint completed. ${sprintIssues.length} incomplete items moved to backlog.`)
    }

    const handleMoveToSprint = async (issueId: string, sprintId: string) => {
        try {
            await updateTask(selectedProjectId, issueId, { sprintId })
            updateIssue(issueId, { sprintId })
            toast.success("Moved to sprint")
        } catch (err) {
            toast.error("Failed to move issue")
        }
    }

    const handleMoveToBacklog = async (issueId: string) => {
        try {
            await updateTask(selectedProjectId, issueId, { sprintId: null })
            updateIssue(issueId, { sprintId: null })
            toast.success("Moved to backlog")
        } catch (err) {
            toast.error("Failed to move issue")
        }
    }

    const handleBulkMoveToSprint = (sprintId: string) => {
        selectedIssues.forEach(id => updateIssue(id, { sprintId }))
        toast.success(`${selectedIssues.size} items moved to sprint`)
        setSelectedIssues(new Set())
    }

    const handleBulkSetPriority = (priority: IssuePriority) => {
        selectedIssues.forEach(id => updateIssue(id, { priority }))
        toast.success(`Priority set for ${selectedIssues.size} items`)
        setSelectedIssues(new Set())
    }

    const handleBulkDelete = () => {
        selectedIssues.forEach(id => deleteIssue(id))
        toast.success(`${selectedIssues.size} items deleted`)
        setSelectedIssues(new Set())
    }

    const handleInlineCreate = async (sprintId: string | null) => {
        const key = sprintId || "backlog"
        const title = inlineInputs[key]?.trim()
        if (!title) return

        const selectedProject = workspaceProjects.find(p => p.id === selectedProjectId)

        // Try API first — only add to store on success
        try {
            if (selectedProject?.boardId) {
                const res = await createTask(selectedProjectId, {
                    boardId: selectedProject.boardId,
                    name: title,
                    type: "task",
                    status: "TODO",
                    priority: "medium",
                    sprintId: sprintId || undefined,
                })
                // Use API response to build the issue for store
                const apiTask = res?.data?.task || res?.data?.data || res?.data
                const newIssue: Issue = {
                    id: apiTask?._id || `ISSUE-${Date.now()}`,
                    projectId: selectedProjectId,
                    title: apiTask?.name || title,
                    description: "",
                    status: "TODO",
                    priority: "MEDIUM",
                    type: "TASK",
                    assigneeId: "",
                    reporterId: "",
                    createdAt: new Date().toISOString(),
                    sprintId: sprintId || undefined,
                    columnOrder: 0,
                    history: [],
                }
                addIssue(newIssue)
                toast.success("Issue created")
            } else {
                // No boardId — fallback to store only
                const newIssue: Issue = {
                    id: `ISSUE-${Date.now()}`,
                    projectId: selectedProjectId,
                    title,
                    description: "",
                    status: "TODO",
                    priority: "MEDIUM",
                    type: "TASK",
                    assigneeId: "",
                    reporterId: "",
                    createdAt: new Date().toISOString(),
                    sprintId: sprintId || undefined,
                    columnOrder: 0,
                    history: [],
                }
                addIssue(newIssue)
                toast.success("Issue created (local only — no board found)")
            }
        } catch (err) {
            toast.error("Failed to create issue. Please try again.")
            return // Don't add to store if API fails
        }

        setInlineInputs(prev => ({ ...prev, [key]: "" }))
    }

    const handleSetPoints = (issueId: string, points: number) => {
        updateIssue(issueId, { storyPoints: points })
        toast.success(`Story points set to ${points}`)
    }

    const getSectionPoints = (sectionIssues: Issue[]) =>
        sectionIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0)

    const renderIssueRow = (issue: Issue) => (
        <div key={issue.id} className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-50 border-b border-zinc-100 group text-xs">
            <Checkbox
                checked={selectedIssues.has(issue.id)}
                onCheckedChange={() => toggleSelectIssue(issue.id)}
                className="h-3.5 w-3.5"
            />
            <GripVertical className="w-3 h-3 text-zinc-300 opacity-0 group-hover:opacity-100" />
            {typeIcons[issue.type]}
            <span className="font-mono text-zinc-400 text-[10px] w-20 shrink-0">{issue.id}</span>
            <span className="text-zinc-900 font-medium truncate flex-1">{issue.title}</span>
            {issue.epicId && (
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-purple-200 text-purple-600">
                    {projectEpics.find(e => e.id === issue.epicId)?.name || "Epic"}
                </Badge>
            )}
            <Badge className={`text-[9px] px-1.5 py-0 border-none font-semibold ${priorityConfig[issue.priority].color}`}>
                {priorityConfig[issue.priority].icon}
                <span className="ml-1">{issue.priority}</span>
            </Badge>
            <span className="text-[10px] text-zinc-400 w-6 text-center font-mono">{issue.storyPoints || "-"}</span>
            {issue.assignee ? (
                <img src={issue.assignee.avatar} alt="" className="w-5 h-5 rounded-full border border-zinc-200" />
            ) : (
                <div className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200" />
            )}
            <Badge className={`text-[9px] px-1.5 py-0 border-none ${statusColors[issue.status] || "bg-zinc-100 text-zinc-500"}`}>
                {issue.status.replace("_", " ")}
            </Badge>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 shadow-xl border-zinc-100 text-xs">
                    <DropdownMenuItem onClick={() => toast.info(`Edit ${issue.id}`)}>
                        <Edit3 className="w-3 h-3 mr-2" /> Edit Issue
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info(`Assign ${issue.id}`)}>
                        <UserPlus className="w-3 h-3 mr-2" /> Assign
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {[1, 2, 3, 5, 8, 13].map(p => (
                        <DropdownMenuItem key={p} onClick={() => handleSetPoints(issue.id, p)}>
                            <Hash className="w-3 h-3 mr-2" /> Set Points: {p}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    {issue.sprintId ? (
                        <DropdownMenuItem onClick={() => handleMoveToBacklog(issue.id)}>
                            <ArrowRightCircle className="w-3 h-3 mr-2" /> Move to Backlog
                        </DropdownMenuItem>
                    ) : (
                        activeSprints.concat(plannedSprints).map(s => (
                            <DropdownMenuItem key={s.id} onClick={() => handleMoveToSprint(issue.id, s.id)}>
                                <ArrowRightCircle className="w-3 h-3 mr-2" /> Move to {s.name}
                            </DropdownMenuItem>
                        ))
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => { deleteIssue(issue.id); toast.success("Issue deleted") }}>
                        <Trash2 className="w-3 h-3 mr-2" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )

    const renderSection = (title: string, sectionId: string, sectionIssues: Issue[], sprint?: Sprint) => {
        const isCollapsed = collapsedSections.has(sectionId)
        const points = getSectionPoints(sectionIssues)
        const inputKey = sprint?.id || "backlog"

        return (
            <div key={sectionId} className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                <div
                    className="flex items-center gap-2 px-3 py-2.5 bg-zinc-50/80 border-b border-zinc-200 cursor-pointer select-none"
                    onClick={() => toggleSection(sectionId)}
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                    <span className="text-xs font-bold text-zinc-900">{title}</span>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-mono">{sectionIssues.length} issues</Badge>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-mono text-indigo-600">{points} pts</Badge>
                    {sprint?.status === "ACTIVE" && <Badge className="text-[9px] px-1.5 py-0 bg-green-100 text-green-700 border-none">Active</Badge>}
                    <div className="flex-1" />
                    <Checkbox
                        checked={sectionIssues.length > 0 && sectionIssues.every(i => selectedIssues.has(i.id))}
                        onCheckedChange={() => toggleSelectAll(sectionIssues.map(i => i.id))}
                        className="h-3.5 w-3.5 mr-1"
                        onClick={(e) => e.stopPropagation()}
                    />
                    {sprint && sprint.status === "PLANNED" && (
                        <Button
                            className="h-6 rounded text-[10px] font-medium px-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm active:scale-95"
                            onClick={(e) => { e.stopPropagation(); handleStartSprint(sprint.id) }}
                        >
                            Start Sprint
                        </Button>
                    )}
                    {sprint && sprint.status === "ACTIVE" && (
                        <Button
                            className="h-6 rounded text-[10px] font-medium px-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95"
                            onClick={(e) => { e.stopPropagation(); handleCompleteSprint(sprint.id) }}
                        >
                            Complete Sprint
                        </Button>
                    )}
                </div>
                {!isCollapsed && (
                    <>
                        {sectionIssues.length === 0 && (
                            <div className="px-4 py-6 text-center text-xs text-zinc-400">No issues in this section. Create one below.</div>
                        )}
                        {sectionIssues.map(renderIssueRow)}
                        <div className="flex items-center gap-2 px-3 py-2 border-t border-zinc-100 bg-zinc-50/30">
                            <Plus className="w-3.5 h-3.5 text-zinc-400" />
                            <Input
                                placeholder="Create issue..."
                                className="h-7 border-none shadow-none bg-transparent text-xs placeholder:text-zinc-400 focus-visible:ring-0"
                                value={inlineInputs[inputKey] || ""}
                                onChange={(e) => setInlineInputs(prev => ({ ...prev, [inputKey]: e.target.value }))}
                                onKeyDown={(e) => { if (e.key === "Enter") handleInlineCreate(sprint?.id || null) }}
                            />
                        </div>
                    </>
                )}
            </div>
        )
    }

    const selectedProject = workspaceProjects.find(p => p.id === selectedProjectId)
    const isScrum = selectedProject?.methodology === "scrum"

    if (selectedProjectId && !isScrum) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="h-16 w-16 bg-zinc-100 rounded-full flex items-center justify-center">
                    <Kanban className="w-8 h-8 text-zinc-400" />
                </div>
                <h2 className="text-lg font-bold text-zinc-900">This is a Kanban Project</h2>
                <p className="text-sm text-zinc-500 max-w-md text-center">Sprints and backlogs are only available for Scrum projects. Switch to a Scrum project or use the Board view for Kanban.</p>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-[#fafafa]">
            <div className="flex-1 flex flex-col gap-5 p-6">
                {/* HEADER */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                        <span>PROJECTS</span><span>/</span><span className="text-zinc-900 font-semibold">BACKLOG</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                            <SelectTrigger className="h-8 w-48 rounded-md border-zinc-200 text-xs font-medium">
                                <SelectValue placeholder="Select project..." />
                            </SelectTrigger>
                            <SelectContent>
                                {workspaceProjects.map(p => (
                                    <SelectItem key={p.id} value={p.id} className="text-xs">{p.icon} {p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                        <div>
                            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Backlog</h1>
                            <p className="text-xs text-zinc-500 font-medium">Prioritize and organize work for upcoming sprints.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white"
                                onClick={handleCreateSprint}
                            >
                                <Plus className="w-3.5 h-3.5 mr-2" />
                                Create Sprint
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95"
                                onClick={() => setShowEpicPanel(!showEpicPanel)}
                            >
                                {showEpicPanel ? <PanelRightClose className="w-3.5 h-3.5 mr-2" /> : <PanelRightOpen className="w-3.5 h-3.5 mr-2" />}
                                Epics
                            </Button>
                        </div>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                        <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                            <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Total Backlog</p>
                            <Layers className="w-4 h-4 text-indigo-500" />
                        </SmallCardHeader>
                        <SmallCardContent className="px-4 pb-4">
                            <p className="text-2xl font-bold text-zinc-900">{backlogIssues.length}</p>
                            <p className="text-[10px] text-zinc-400">Unassigned items</p>
                        </SmallCardContent>
                    </SmallCard>
                    <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                        <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                            <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Sprint Items</p>
                            <CheckSquare className="w-4 h-4 text-blue-500" />
                        </SmallCardHeader>
                        <SmallCardContent className="px-4 pb-4">
                            <p className="text-2xl font-bold text-zinc-900">{projectIssues.filter(i => i.sprintId).length}</p>
                            <p className="text-[10px] text-zinc-400">Assigned to sprints</p>
                        </SmallCardContent>
                    </SmallCard>
                    <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                        <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                            <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Unestimated</p>
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                        </SmallCardHeader>
                        <SmallCardContent className="px-4 pb-4">
                            <p className="text-2xl font-bold text-zinc-900">{unestimated.length}</p>
                            <p className="text-[10px] text-zinc-400">Need story points</p>
                        </SmallCardContent>
                    </SmallCard>
                    <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                        <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                            <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Epics</p>
                            <Layers className="w-4 h-4 text-purple-500" />
                        </SmallCardHeader>
                        <SmallCardContent className="px-4 pb-4">
                            <p className="text-2xl font-bold text-zinc-900">{projectEpics.length}</p>
                            <p className="text-[10px] text-zinc-400">Active epics</p>
                        </SmallCardContent>
                    </SmallCard>
                </div>

                {/* SEARCH + BULK ACTIONS */}
                <div className="flex items-center gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                        <Input
                            placeholder="Search issues..."
                            className="pl-9 h-8 bg-white border-zinc-200 rounded-md text-xs font-medium focus:ring-1 focus:ring-indigo-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {epicFilter && (
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95" onClick={() => setEpicFilter(null)}>
                            <X className="w-3 h-3 mr-1" /> Clear Epic Filter
                        </Button>
                    )}
                    {selectedIssues.size > 0 && (
                        <div className="flex items-center gap-2 ml-auto bg-indigo-50 border border-indigo-200 rounded-md px-3 py-1.5">
                            <span className="text-[10px] font-semibold text-indigo-700">{selectedIssues.size} selected</span>
                            <Select onValueChange={(val) => handleBulkMoveToSprint(val)}>
                                <SelectTrigger className="h-6 w-32 text-[10px] border-indigo-200">
                                    <SelectValue placeholder="Move to Sprint" />
                                </SelectTrigger>
                                <SelectContent>
                                    {activeSprints.concat(plannedSprints).map(s => (
                                        <SelectItem key={s.id} value={s.id} className="text-xs">{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={(val) => handleBulkSetPriority(val as IssuePriority)}>
                                <SelectTrigger className="h-6 w-28 text-[10px] border-indigo-200">
                                    <SelectValue placeholder="Set Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(["LOW", "MEDIUM", "HIGH", "URGENT"] as IssuePriority[]).map(p => (
                                        <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button variant="ghost" className="h-6 w-6 p-0 text-red-500 hover:text-red-700" onClick={handleBulkDelete}>
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" className="h-6 w-6 p-0 text-zinc-400" onClick={() => setSelectedIssues(new Set())}>
                                <X className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* SPRINT SECTIONS */}
                <div className="flex flex-col gap-3">
                    {activeSprints.map(sprint => {
                        const sprintIssues = projectIssues.filter(i => i.sprintId === sprint.id)
                        return renderSection(
                            `${sprint.name}${sprint.goal ? ` - ${sprint.goal}` : ""}`,
                            sprint.id,
                            sprintIssues,
                            sprint
                        )
                    })}
                    {plannedSprints.map(sprint => {
                        const sprintIssues = projectIssues.filter(i => i.sprintId === sprint.id)
                        return renderSection(
                            `${sprint.name}${sprint.goal ? ` - ${sprint.goal}` : ""}`,
                            sprint.id,
                            sprintIssues,
                            sprint
                        )
                    })}
                    {renderSection("Backlog", "backlog", backlogIssues)}
                </div>
            </div>

            {/* EPIC SIDEBAR */}
            {showEpicPanel && (
                <div className="w-64 border-l border-zinc-200 bg-white p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-900">Epics</span>
                        <Button variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowEpicPanel(false)}>
                            <X className="w-3.5 h-3.5 text-zinc-400" />
                        </Button>
                    </div>
                    <div
                        className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-xs font-medium ${!epicFilter ? "bg-indigo-50 text-indigo-700" : "text-zinc-600 hover:bg-zinc-50"}`}
                        onClick={() => setEpicFilter(null)}
                    >
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                        All Issues
                        <span className="ml-auto text-[10px] text-zinc-400">{projectIssues.length}</span>
                    </div>
                    {projectEpics.map(epic => {
                        const count = projectIssues.filter(i => i.epicId === epic.id).length
                        return (
                            <div
                                key={epic.id}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-xs font-medium ${epicFilter === epic.id ? "bg-indigo-50 text-indigo-700" : "text-zinc-600 hover:bg-zinc-50"}`}
                                onClick={() => setEpicFilter(epic.id)}
                            >
                                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: epic.color }} />
                                <span className="truncate">{epic.name}</span>
                                <span className="ml-auto text-[10px] text-zinc-400">{count}</span>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
