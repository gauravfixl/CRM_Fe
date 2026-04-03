"use client"

import React, { useState, useMemo, useCallback, useEffect } from "react"
import {
    Search, Plus, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
    Download, Trash2, Settings2, ArrowUpDown, Filter, Bug, BookOpen,
    CheckSquare, Layers, ListTree, MoreHorizontal, X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import { useIssueStore, type Issue, type IssueStatus, type IssuePriority, type IssueType } from "@/shared/data/issue-store"
import { useSprintEpicStore } from "@/shared/data/sprint-epic-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"

const ALL_STATUSES: IssueStatus[] = ["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "TESTING", "DONE", "BLOCKED"]
const ALL_PRIORITIES: IssuePriority[] = ["URGENT", "HIGH", "MEDIUM", "LOW"]
const ALL_TYPES: IssueType[] = ["TASK", "BUG", "STORY", "EPIC", "SUBTASK"]
const GROUP_OPTIONS = ["None", "Status", "Priority", "Assignee", "Sprint", "Epic"] as const
const PAGE_SIZES = [25, 50, 100] as const

const ALL_COLUMNS = [
    { key: "select", label: "", alwaysVisible: true },
    { key: "id", label: "Key" },
    { key: "type", label: "Type" },
    { key: "title", label: "Title" },
    { key: "status", label: "Status" },
    { key: "priority", label: "Priority" },
    { key: "assignee", label: "Assignee" },
    { key: "sprint", label: "Sprint" },
    { key: "storyPoints", label: "Points" },
    { key: "dueDate", label: "Due Date" },
    { key: "createdAt", label: "Created" },
    { key: "labels", label: "Labels" },
] as const

type SortKey = "id" | "title" | "status" | "priority" | "assignee" | "storyPoints" | "dueDate" | "createdAt"
type SortDir = "asc" | "desc"

const priorityOrder: Record<string, number> = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
const statusColor: Record<string, string> = {
    BACKLOG: "bg-zinc-100 text-zinc-600", TODO: "bg-slate-100 text-slate-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700", IN_REVIEW: "bg-purple-100 text-purple-700",
    TESTING: "bg-amber-100 text-amber-700", DONE: "bg-green-100 text-green-700",
    BLOCKED: "bg-red-100 text-red-700",
}
const priorityColor: Record<string, string> = {
    URGENT: "bg-red-100 text-red-700", HIGH: "bg-orange-100 text-orange-700",
    MEDIUM: "bg-blue-100 text-blue-700", LOW: "bg-zinc-100 text-zinc-600",
}
const typeIcon: Record<string, React.ReactNode> = {
    TASK: <CheckSquare className="w-3.5 h-3.5 text-blue-500" />,
    BUG: <Bug className="w-3.5 h-3.5 text-red-500" />,
    STORY: <BookOpen className="w-3.5 h-3.5 text-green-500" />,
    EPIC: <Layers className="w-3.5 h-3.5 text-purple-500" />,
    SUBTASK: <ListTree className="w-3.5 h-3.5 text-zinc-400" />,
}

export default function ListViewPage() {
    const { issues: allIssues, updateIssue, addIssue, deleteIssue } = useIssueStore()
    const { sprints, epics } = useSprintEpicStore()
    const { projects } = useProjectStore()
    const { activeWorkspaceId } = useWorkspaceStore()

    const [selectedProjectId, setSelectedProjectId] = useState<string>("")

    const workspaceProjects = useMemo(() =>
        projects.filter(p => !activeWorkspaceId || p.workspaceId === activeWorkspaceId),
        [projects, activeWorkspaceId]
    )

    useEffect(() => {
        if (!selectedProjectId && workspaceProjects.length > 0) {
            setSelectedProjectId(workspaceProjects[0].id)
        }
    }, [workspaceProjects, selectedProjectId])

    const issues = useMemo(() => selectedProjectId ? allIssues.filter(i => i.projectId === selectedProjectId) : allIssues, [allIssues, selectedProjectId])

    const [search, setSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState<string>("all")
    const [filterPriority, setFilterPriority] = useState<string>("all")
    const [filterAssignee, setFilterAssignee] = useState<string>("all")
    const [filterType, setFilterType] = useState<string>("all")
    const [filterSprint, setFilterSprint] = useState<string>("all")
    const [filterEpic, setFilterEpic] = useState<string>("all")
    const [sortKey, setSortKey] = useState<SortKey>("createdAt")
    const [sortDir, setSortDir] = useState<SortDir>("desc")
    const [groupBy, setGroupBy] = useState<typeof GROUP_OPTIONS[number]>("None")
    const [pageSize, setPageSize] = useState<number>(25)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [visibleCols, setVisibleCols] = useState<Set<string>>(new Set(ALL_COLUMNS.map(c => c.key)))
    const [colDialogOpen, setColDialogOpen] = useState(false)
    const [createOpen, setCreateOpen] = useState(false)
    const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null)

    // New issue form
    const [newTitle, setNewTitle] = useState("")
    const [newType, setNewType] = useState<IssueType>("TASK")
    const [newPriority, setNewPriority] = useState<IssuePriority>("MEDIUM")
    const [newStatus, setNewStatus] = useState<IssueStatus>("TODO")

    const assignees = useMemo(() => {
        const map = new Map<string, string>()
        issues.forEach(i => { if (i.assignee?.name) map.set(i.assigneeId, i.assignee.name) })
        return Array.from(map.entries())
    }, [issues])

    // Filter
    const filtered = useMemo(() => {
        let list = [...issues]
        if (search) {
            const q = search.toLowerCase()
            list = list.filter(i => i.title.toLowerCase().includes(q) || i.id.toLowerCase().includes(q))
        }
        if (filterStatus !== "all") list = list.filter(i => i.status === filterStatus)
        if (filterPriority !== "all") list = list.filter(i => i.priority === filterPriority)
        if (filterAssignee !== "all") list = list.filter(i => i.assigneeId === filterAssignee)
        if (filterType !== "all") list = list.filter(i => i.type === filterType)
        if (filterSprint !== "all") list = list.filter(i => i.sprintId === filterSprint)
        if (filterEpic !== "all") list = list.filter(i => i.epicId === filterEpic)
        return list
    }, [issues, search, filterStatus, filterPriority, filterAssignee, filterType, filterSprint, filterEpic])

    // Sort
    const sorted = useMemo(() => {
        const list = [...filtered]
        const dir = sortDir === "asc" ? 1 : -1
        list.sort((a, b) => {
            switch (sortKey) {
                case "id": return a.id.localeCompare(b.id) * dir
                case "title": return a.title.localeCompare(b.title) * dir
                case "status": return a.status.localeCompare(b.status) * dir
                case "priority": return ((priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9)) * dir
                case "assignee": return (a.assignee?.name ?? "").localeCompare(b.assignee?.name ?? "") * dir
                case "storyPoints": return ((a.storyPoints ?? 0) - (b.storyPoints ?? 0)) * dir
                case "dueDate": return (a.dueDate ?? "").localeCompare(b.dueDate ?? "") * dir
                case "createdAt": return a.createdAt.localeCompare(b.createdAt) * dir
                default: return 0
            }
        })
        return list
    }, [filtered, sortKey, sortDir])

    // Group
    const grouped = useMemo(() => {
        if (groupBy === "None") return { "All Issues": sorted }
        const map: Record<string, Issue[]> = {}
        sorted.forEach(i => {
            let key = ""
            switch (groupBy) {
                case "Status": key = i.status; break
                case "Priority": key = i.priority; break
                case "Assignee": key = i.assignee?.name ?? "Unassigned"; break
                case "Sprint": key = sprints.find(s => s.id === i.sprintId)?.name ?? "No Sprint"; break
                case "Epic": key = epics.find(e => e.id === i.epicId)?.name ?? "No Epic"; break
            }
            if (!map[key]) map[key] = []
            map[key].push(i)
        })
        return map
    }, [sorted, groupBy, sprints, epics])

    // Pagination
    const totalFiltered = sorted.length
    const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize))
    const paginatedGroups = useMemo(() => {
        if (groupBy !== "None") return grouped
        const start = (currentPage - 1) * pageSize
        return { "All Issues": sorted.slice(start, start + pageSize) }
    }, [grouped, groupBy, currentPage, pageSize, sorted])

    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())
    const toggleGroup = (g: string) => {
        setCollapsedGroups(prev => {
            const next = new Set(prev)
            next.has(g) ? next.delete(g) : next.add(g)
            return next
        })
    }

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
        else { setSortKey(key); setSortDir("asc") }
    }

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }
    const toggleSelectAll = () => {
        if (selectedIds.size === sorted.length) setSelectedIds(new Set())
        else setSelectedIds(new Set(sorted.map(i => i.id)))
    }

    const handleInlineUpdate = (issueId: string, field: string, value: string) => {
        updateIssue(issueId, { [field]: value } as Partial<Issue>)
        setEditingCell(null)
        toast.success(`Updated ${field}`)
    }

    const handleBulkAction = (action: string, value?: string) => {
        selectedIds.forEach(id => {
            if (action === "delete") deleteIssue(id)
            else if (action === "status" && value) updateIssue(id, { status: value as IssueStatus })
            else if (action === "priority" && value) updateIssue(id, { priority: value as IssuePriority })
            else if (action === "assignee" && value) {
                const a = assignees.find(([aid]) => aid === value)
                updateIssue(id, { assigneeId: value, assignee: a ? { name: a[1], avatar: "" } : undefined })
            }
        })
        setSelectedIds(new Set())
        toast.success(`Bulk ${action} applied to ${selectedIds.size} issues`)
    }

    const handleCreate = () => {
        if (!newTitle.trim()) { toast.error("Title is required"); return }
        const id = `ISSUE-${String(issues.length + 1).padStart(2, "0")}`
        addIssue({
            id, projectId: selectedProjectId || "p1", title: newTitle, description: "", status: newStatus,
            priority: newPriority, type: newType, assigneeId: "u1",
            assignee: { name: "John Doe", avatar: "https://i.pravatar.cc/150?u=u1" },
            reporterId: "u1", createdAt: new Date().toISOString(), storyPoints: 0, columnOrder: 0, history: []
        })
        setNewTitle(""); setCreateOpen(false)
        toast.success("Issue created")
    }

    const exportCSV = () => {
        const headers = ["Key", "Type", "Title", "Status", "Priority", "Assignee", "Sprint", "Points", "Due Date", "Created", "Labels"]
        const rows = sorted.map(i => [
            i.id, i.type, `"${i.title}"`, i.status, i.priority,
            i.assignee?.name ?? "", sprints.find(s => s.id === i.sprintId)?.name ?? "",
            String(i.storyPoints ?? ""), i.dueDate ?? "", i.createdAt, (i.labels ?? []).join(";")
        ])
        const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = "issues.csv"; a.click()
        URL.revokeObjectURL(url)
        toast.success("CSV exported")
    }

    const toggleCol = (key: string) => {
        setVisibleCols(prev => {
            const next = new Set(prev)
            next.has(key) ? next.delete(key) : next.add(key)
            return next
        })
    }

    const SortIcon = ({ col }: { col: SortKey }) => (
        sortKey === col
            ? sortDir === "asc" ? <ChevronUp className="w-3 h-3 ml-1 inline" /> : <ChevronDown className="w-3 h-3 ml-1 inline" />
            : <ArrowUpDown className="w-3 h-3 ml-1 inline opacity-30" />
    )

    const isColVisible = (key: string) => visibleCols.has(key)

    const renderInlineSelect = (issue: Issue, field: "status" | "priority" | "assigneeId", options: { value: string; label: string }[]) => {
        if (editingCell?.id === issue.id && editingCell.field === field) {
            return (
                <Select
                    defaultValue={(issue as any)[field]}
                    onValueChange={(v) => {
                        if (field === "assigneeId") {
                            const a = assignees.find(([aid]) => aid === v)
                            updateIssue(issue.id, { assigneeId: v, assignee: a ? { name: a[1], avatar: "" } : undefined })
                        } else {
                            handleInlineUpdate(issue.id, field, v)
                        }
                        setEditingCell(null)
                    }}
                >
                    <SelectTrigger className="h-7 text-xs w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map(o => (
                            <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )
        }
        return null
    }

    return (
        <div className="flex flex-col h-full bg-[#fafafa] min-h-screen">
            {/* Breadcrumb */}
            <div className="px-6 pt-5 pb-2">
                <p className="text-[11px] font-semibold uppercase text-zinc-400 tracking-wider">
                    Projects / List View
                </p>
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight mt-1">List View</h1>
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
            </div>

            {/* Toolbar */}
            <div className="px-6 pb-3 flex flex-wrap items-center gap-2">
                <div className="relative w-56">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                    <Input
                        placeholder="Search issues..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
                        className="pl-8 h-8 text-xs rounded-md"
                    />
                </div>

                {/* Filters */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95">
                            <Filter className="w-3.5 h-3.5 mr-1.5" /> Filters
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 p-3 space-y-2" align="start">
                        <DropdownMenuLabel className="text-[11px] font-semibold uppercase text-zinc-400">Status</DropdownMenuLabel>
                        <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setCurrentPage(1) }}>
                            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all" className="text-xs">All</SelectItem>
                                {ALL_STATUSES.map(s => <SelectItem key={s} value={s} className="text-xs">{s.replace(/_/g, " ")}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <DropdownMenuLabel className="text-[11px] font-semibold uppercase text-zinc-400">Priority</DropdownMenuLabel>
                        <Select value={filterPriority} onValueChange={v => { setFilterPriority(v); setCurrentPage(1) }}>
                            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all" className="text-xs">All</SelectItem>
                                {ALL_PRIORITIES.map(p => <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <DropdownMenuLabel className="text-[11px] font-semibold uppercase text-zinc-400">Type</DropdownMenuLabel>
                        <Select value={filterType} onValueChange={v => { setFilterType(v); setCurrentPage(1) }}>
                            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all" className="text-xs">All</SelectItem>
                                {ALL_TYPES.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <DropdownMenuLabel className="text-[11px] font-semibold uppercase text-zinc-400">Assignee</DropdownMenuLabel>
                        <Select value={filterAssignee} onValueChange={v => { setFilterAssignee(v); setCurrentPage(1) }}>
                            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all" className="text-xs">All</SelectItem>
                                {assignees.map(([id, name]) => <SelectItem key={id} value={id} className="text-xs">{name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <DropdownMenuLabel className="text-[11px] font-semibold uppercase text-zinc-400">Sprint</DropdownMenuLabel>
                        <Select value={filterSprint} onValueChange={v => { setFilterSprint(v); setCurrentPage(1) }}>
                            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all" className="text-xs">All</SelectItem>
                                {sprints.map(s => <SelectItem key={s.id} value={s.id} className="text-xs">{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <DropdownMenuLabel className="text-[11px] font-semibold uppercase text-zinc-400">Epic</DropdownMenuLabel>
                        <Select value={filterEpic} onValueChange={v => { setFilterEpic(v); setCurrentPage(1) }}>
                            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all" className="text-xs">All</SelectItem>
                                {epics.map(e => <SelectItem key={e.id} value={e.id} className="text-xs">{e.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95">
                            <ArrowUpDown className="w-3.5 h-3.5 mr-1.5" /> Sort
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {(["id", "title", "status", "priority", "storyPoints", "dueDate", "createdAt"] as SortKey[]).map(k => (
                            <DropdownMenuItem key={k} onClick={() => toggleSort(k)} className="text-xs">
                                {k === "id" ? "Key" : k === "storyPoints" ? "Points" : k === "dueDate" ? "Due Date" : k === "createdAt" ? "Created" : k.charAt(0).toUpperCase() + k.slice(1)}
                                {sortKey === k && (sortDir === "asc" ? " (ASC)" : " (DESC)")}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Group By */}
                <Select value={groupBy} onValueChange={(v) => setGroupBy(v as typeof GROUP_OPTIONS[number])}>
                    <SelectTrigger className="h-8 w-36 text-xs">
                        <SelectValue placeholder="Group by" />
                    </SelectTrigger>
                    <SelectContent>
                        {GROUP_OPTIONS.map(g => <SelectItem key={g} value={g} className="text-xs">Group: {g}</SelectItem>)}
                    </SelectContent>
                </Select>

                <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95" onClick={() => setColDialogOpen(true)}>
                    <Settings2 className="w-3.5 h-3.5 mr-1.5" /> Columns
                </Button>

                <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95" onClick={exportCSV}>
                    <Download className="w-3.5 h-3.5 mr-1.5" /> Export
                </Button>

                <div className="flex-1" />

                <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setCreateOpen(true)}>
                    <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Issue
                </Button>
            </div>

            {/* Active filters */}
            {(filterStatus !== "all" || filterPriority !== "all" || filterAssignee !== "all" || filterType !== "all" || filterSprint !== "all" || filterEpic !== "all") && (
                <div className="px-6 pb-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-zinc-400 font-medium">Active filters:</span>
                    {filterStatus !== "all" && <Badge variant="secondary" className="text-[10px] cursor-pointer" onClick={() => setFilterStatus("all")}>Status: {filterStatus} <X className="w-2.5 h-2.5 ml-1" /></Badge>}
                    {filterPriority !== "all" && <Badge variant="secondary" className="text-[10px] cursor-pointer" onClick={() => setFilterPriority("all")}>Priority: {filterPriority} <X className="w-2.5 h-2.5 ml-1" /></Badge>}
                    {filterType !== "all" && <Badge variant="secondary" className="text-[10px] cursor-pointer" onClick={() => setFilterType("all")}>Type: {filterType} <X className="w-2.5 h-2.5 ml-1" /></Badge>}
                    {filterAssignee !== "all" && <Badge variant="secondary" className="text-[10px] cursor-pointer" onClick={() => setFilterAssignee("all")}>Assignee <X className="w-2.5 h-2.5 ml-1" /></Badge>}
                    {filterSprint !== "all" && <Badge variant="secondary" className="text-[10px] cursor-pointer" onClick={() => setFilterSprint("all")}>Sprint <X className="w-2.5 h-2.5 ml-1" /></Badge>}
                    {filterEpic !== "all" && <Badge variant="secondary" className="text-[10px] cursor-pointer" onClick={() => setFilterEpic("all")}>Epic <X className="w-2.5 h-2.5 ml-1" /></Badge>}
                </div>
            )}

            {/* Stats bar */}
            <div className="px-6 pb-3 flex items-center gap-3">
                <span className="text-xs text-zinc-500">{totalFiltered} issues</span>
                <span className="text-xs text-zinc-400">|</span>
                <span className="text-xs text-zinc-500">{selectedIds.size} selected</span>
            </div>

            {/* Table */}
            <div className="px-6 flex-1 overflow-auto pb-4">
                <div className="border rounded-lg bg-white overflow-hidden">
                    {Object.entries(paginatedGroups).map(([groupName, groupIssues]) => (
                        <div key={groupName}>
                            {groupBy !== "None" && (
                                <button
                                    className="w-full flex items-center gap-2 px-4 py-2 bg-zinc-50 border-b text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition"
                                    onClick={() => toggleGroup(groupName)}
                                >
                                    {collapsedGroups.has(groupName) ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    {groupName} <Badge variant="secondary" className="text-[10px] ml-1">{groupIssues.length}</Badge>
                                </button>
                            )}
                            {!collapsedGroups.has(groupName) && (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-zinc-50/80">
                                            {isColVisible("select") && (
                                                <TableHead className="w-10">
                                                    <input type="checkbox" className="rounded" checked={selectedIds.size === sorted.length && sorted.length > 0} onChange={toggleSelectAll} />
                                                </TableHead>
                                            )}
                                            {isColVisible("id") && <TableHead className="text-[11px] font-semibold uppercase text-zinc-500 cursor-pointer w-24" onClick={() => toggleSort("id")}>Key<SortIcon col="id" /></TableHead>}
                                            {isColVisible("type") && <TableHead className="text-[11px] font-semibold uppercase text-zinc-500 w-12">Type</TableHead>}
                                            {isColVisible("title") && <TableHead className="text-[11px] font-semibold uppercase text-zinc-500 cursor-pointer min-w-[200px]" onClick={() => toggleSort("title")}>Title<SortIcon col="title" /></TableHead>}
                                            {isColVisible("status") && <TableHead className="text-[11px] font-semibold uppercase text-zinc-500 cursor-pointer w-28" onClick={() => toggleSort("status")}>Status<SortIcon col="status" /></TableHead>}
                                            {isColVisible("priority") && <TableHead className="text-[11px] font-semibold uppercase text-zinc-500 cursor-pointer w-24" onClick={() => toggleSort("priority")}>Priority<SortIcon col="priority" /></TableHead>}
                                            {isColVisible("assignee") && <TableHead className="text-[11px] font-semibold uppercase text-zinc-500 cursor-pointer w-28" onClick={() => toggleSort("assignee")}>Assignee<SortIcon col="assignee" /></TableHead>}
                                            {isColVisible("sprint") && <TableHead className="text-[11px] font-semibold uppercase text-zinc-500 w-28">Sprint</TableHead>}
                                            {isColVisible("storyPoints") && <TableHead className="text-[11px] font-semibold uppercase text-zinc-500 cursor-pointer w-16 text-center" onClick={() => toggleSort("storyPoints")}>Pts<SortIcon col="storyPoints" /></TableHead>}
                                            {isColVisible("dueDate") && <TableHead className="text-[11px] font-semibold uppercase text-zinc-500 cursor-pointer w-24" onClick={() => toggleSort("dueDate")}>Due<SortIcon col="dueDate" /></TableHead>}
                                            {isColVisible("createdAt") && <TableHead className="text-[11px] font-semibold uppercase text-zinc-500 cursor-pointer w-24" onClick={() => toggleSort("createdAt")}>Created<SortIcon col="createdAt" /></TableHead>}
                                            {isColVisible("labels") && <TableHead className="text-[11px] font-semibold uppercase text-zinc-500 w-28">Labels</TableHead>}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {groupIssues.map(issue => (
                                            <TableRow key={issue.id} className="hover:bg-zinc-50/60 transition-colors group">
                                                {isColVisible("select") && (
                                                    <TableCell className="w-10">
                                                        <input type="checkbox" className="rounded" checked={selectedIds.has(issue.id)} onChange={() => toggleSelect(issue.id)} />
                                                    </TableCell>
                                                )}
                                                {isColVisible("id") && <TableCell className="text-xs font-mono text-zinc-500">{issue.id}</TableCell>}
                                                {isColVisible("type") && <TableCell>{typeIcon[issue.type] ?? null}</TableCell>}
                                                {isColVisible("title") && (
                                                    <TableCell className="text-xs font-medium text-zinc-900 max-w-[300px] truncate">
                                                        {issue.title}
                                                    </TableCell>
                                                )}
                                                {isColVisible("status") && (
                                                    <TableCell>
                                                        {editingCell?.id === issue.id && editingCell.field === "status" ? (
                                                            renderInlineSelect(issue, "status", ALL_STATUSES.map(s => ({ value: s, label: s.replace(/_/g, " ") })))
                                                        ) : (
                                                            <button onClick={() => setEditingCell({ id: issue.id, field: "status" })} className="w-full text-left">
                                                                <Badge className={`text-[10px] ${statusColor[issue.status] ?? "bg-zinc-100"}`}>
                                                                    {issue.status.replace(/_/g, " ")}
                                                                </Badge>
                                                            </button>
                                                        )}
                                                    </TableCell>
                                                )}
                                                {isColVisible("priority") && (
                                                    <TableCell>
                                                        {editingCell?.id === issue.id && editingCell.field === "priority" ? (
                                                            renderInlineSelect(issue, "priority", ALL_PRIORITIES.map(p => ({ value: p, label: p })))
                                                        ) : (
                                                            <button onClick={() => setEditingCell({ id: issue.id, field: "priority" })} className="w-full text-left">
                                                                <Badge className={`text-[10px] ${priorityColor[issue.priority] ?? "bg-zinc-100"}`}>
                                                                    {issue.priority}
                                                                </Badge>
                                                            </button>
                                                        )}
                                                    </TableCell>
                                                )}
                                                {isColVisible("assignee") && (
                                                    <TableCell>
                                                        {editingCell?.id === issue.id && editingCell.field === "assigneeId" ? (
                                                            renderInlineSelect(issue, "assigneeId", assignees.map(([id, name]) => ({ value: id, label: name })))
                                                        ) : (
                                                            <button onClick={() => setEditingCell({ id: issue.id, field: "assigneeId" })} className="w-full text-left text-xs text-zinc-700">
                                                                {issue.assignee?.name ?? "Unassigned"}
                                                            </button>
                                                        )}
                                                    </TableCell>
                                                )}
                                                {isColVisible("sprint") && (
                                                    <TableCell className="text-xs text-zinc-500">
                                                        {sprints.find(s => s.id === issue.sprintId)?.name ?? "-"}
                                                    </TableCell>
                                                )}
                                                {isColVisible("storyPoints") && (
                                                    <TableCell className="text-center">
                                                        {editingCell?.id === issue.id && editingCell.field === "storyPoints" ? (
                                                            <Input
                                                                type="number"
                                                                defaultValue={issue.storyPoints ?? 0}
                                                                className="h-6 w-14 text-xs text-center"
                                                                autoFocus
                                                                onBlur={(e) => { updateIssue(issue.id, { storyPoints: parseInt(e.target.value) || 0 }); setEditingCell(null); toast.success("Points updated") }}
                                                                onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur() }}
                                                            />
                                                        ) : (
                                                            <button className="text-xs text-zinc-600 w-full" onClick={() => setEditingCell({ id: issue.id, field: "storyPoints" })}>
                                                                {issue.storyPoints ?? "-"}
                                                            </button>
                                                        )}
                                                    </TableCell>
                                                )}
                                                {isColVisible("dueDate") && (
                                                    <TableCell>
                                                        {editingCell?.id === issue.id && editingCell.field === "dueDate" ? (
                                                            <Input
                                                                type="date"
                                                                defaultValue={issue.dueDate ? issue.dueDate.split("T")[0] : ""}
                                                                className="h-6 text-xs w-28"
                                                                autoFocus
                                                                onBlur={(e) => { updateIssue(issue.id, { dueDate: e.target.value ? new Date(e.target.value).toISOString() : undefined }); setEditingCell(null); toast.success("Due date updated") }}
                                                                onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur() }}
                                                            />
                                                        ) : (
                                                            <button className="text-xs text-zinc-500 w-full text-left" onClick={() => setEditingCell({ id: issue.id, field: "dueDate" })}>
                                                                {issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : "-"}
                                                            </button>
                                                        )}
                                                    </TableCell>
                                                )}
                                                {isColVisible("createdAt") && (
                                                    <TableCell className="text-xs text-zinc-400">
                                                        {new Date(issue.createdAt).toLocaleDateString()}
                                                    </TableCell>
                                                )}
                                                {isColVisible("labels") && (
                                                    <TableCell>
                                                        <div className="flex gap-1 flex-wrap">
                                                            {(issue.labels ?? []).map(l => (
                                                                <Badge key={l} variant="outline" className="text-[9px]">{l}</Badge>
                                                            ))}
                                                            {(!issue.labels || issue.labels.length === 0) && <span className="text-xs text-zinc-400">-</span>}
                                                        </div>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                        {groupIssues.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={12} className="text-center text-xs text-zinc-400 py-8">
                                                    No issues found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {groupBy === "None" && (
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-500">Rows per page:</span>
                            <Select value={String(pageSize)} onValueChange={v => { setPageSize(Number(v)); setCurrentPage(1) }}>
                                <SelectTrigger className="h-7 w-16 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {PAGE_SIZES.map(s => <SelectItem key={s} value={String(s)} className="text-xs">{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs text-zinc-500">Page {currentPage} of {totalPages}</span>
                            <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bulk actions bar */}
            {selectedIds.size > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white rounded-lg shadow-xl px-4 py-2.5 flex items-center gap-3 z-50">
                    <span className="text-xs font-medium">{selectedIds.size} selected</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="secondary" className="h-7 text-xs">Set Status</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {ALL_STATUSES.map(s => (
                                <DropdownMenuItem key={s} className="text-xs" onClick={() => handleBulkAction("status", s)}>{s.replace(/_/g, " ")}</DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="secondary" className="h-7 text-xs">Set Priority</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {ALL_PRIORITIES.map(p => (
                                <DropdownMenuItem key={p} className="text-xs" onClick={() => handleBulkAction("priority", p)}>{p}</DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="secondary" className="h-7 text-xs">Assign</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {assignees.map(([id, name]) => (
                                <DropdownMenuItem key={id} className="text-xs" onClick={() => handleBulkAction("assignee", id)}>{name}</DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => handleBulkAction("delete")}>
                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-zinc-300" onClick={() => setSelectedIds(new Set())}>
                        <X className="w-3 h-3 mr-1" /> Clear
                    </Button>
                </div>
            )}

            {/* Column visibility dialog */}
            <Dialog open={colDialogOpen} onOpenChange={setColDialogOpen}>
                <DialogContent className="max-w-xs">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900">Column Visibility</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 py-2">
                        {ALL_COLUMNS.filter(c => !c.alwaysVisible).map(col => (
                            <label key={col.key} className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={visibleCols.has(col.key)}
                                    onChange={() => toggleCol(col.key)}
                                    className="rounded"
                                />
                                {col.label}
                            </label>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 text-xs" onClick={() => setColDialogOpen(false)}>Done</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create issue dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900">Create Issue</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        <div>
                            <label className="text-xs font-medium text-zinc-700 mb-1 block">Title</label>
                            <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Issue title..." className="h-8 text-xs" />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="text-xs font-medium text-zinc-700 mb-1 block">Type</label>
                                <Select value={newType} onValueChange={v => setNewType(v as IssueType)}>
                                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {ALL_TYPES.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-zinc-700 mb-1 block">Status</label>
                                <Select value={newStatus} onValueChange={v => setNewStatus(v as IssueStatus)}>
                                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {ALL_STATUSES.map(s => <SelectItem key={s} value={s} className="text-xs">{s.replace(/_/g, " ")}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-zinc-700 mb-1 block">Priority</label>
                                <Select value={newPriority} onValueChange={v => setNewPriority(v as IssuePriority)}>
                                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {ALL_PRIORITIES.map(p => <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 text-xs" onClick={() => setCreateOpen(false)}>Cancel</Button>
                        <Button className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleCreate}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
