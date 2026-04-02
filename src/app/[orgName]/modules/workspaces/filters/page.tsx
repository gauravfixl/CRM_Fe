"use client"

import React, { useState, useMemo } from "react"
import {
    Search, Filter, Plus, X, Play, Star, Pin, Save, Trash2, ChevronDown, SlidersHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import { useIssueStore, type Issue } from "@/shared/data/issue-store"
import { useSprintEpicStore } from "@/shared/data/sprint-epic-store"

type FilterOperator = "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "between" | "is_empty" | "is_not_empty"
type FilterField = "status" | "priority" | "assignee" | "type" | "sprint" | "epic" | "labels" | "dueDate" | "createdDate" | "storyPoints"
type FilterConjunction = "AND" | "OR"

interface FilterRow {
    id: string
    field: FilterField
    operator: FilterOperator
    value: string
    value2?: string
    conjunction: FilterConjunction
}

interface SavedFilter {
    id: string
    name: string
    description: string
    rows: FilterRow[]
    shared: boolean
    lastUsed: string
    pinned: boolean
    starred: boolean
}

const FIELDS: { value: FilterField; label: string }[] = [
    { value: "status", label: "Status" },
    { value: "priority", label: "Priority" },
    { value: "assignee", label: "Assignee" },
    { value: "type", label: "Type" },
    { value: "sprint", label: "Sprint" },
    { value: "epic", label: "Epic" },
    { value: "labels", label: "Labels" },
    { value: "dueDate", label: "Due Date" },
    { value: "createdDate", label: "Created Date" },
    { value: "storyPoints", label: "Story Points" },
]

const OPERATORS: { value: FilterOperator; label: string }[] = [
    { value: "equals", label: "equals" },
    { value: "not_equals", label: "not equals" },
    { value: "contains", label: "contains" },
    { value: "greater_than", label: "greater than" },
    { value: "less_than", label: "less than" },
    { value: "between", label: "between" },
    { value: "is_empty", label: "is empty" },
    { value: "is_not_empty", label: "is not empty" },
]

const STATUS_OPTIONS = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BACKLOG", "TESTING", "BLOCKED"]
const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH", "URGENT"]
const TYPE_OPTIONS = ["TASK", "BUG", "STORY", "EPIC", "SUBTASK"]

function createFilterRow(): FilterRow {
    return {
        id: `fr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        field: "status",
        operator: "equals",
        value: "",
        conjunction: "AND",
    }
}

function applyFilters(issues: Issue[], rows: FilterRow[]): Issue[] {
    if (rows.length === 0) return issues
    return issues.filter((issue) => {
        let result = evaluateRow(issue, rows[0])
        for (let i = 1; i < rows.length; i++) {
            const rowResult = evaluateRow(issue, rows[i])
            if (rows[i].conjunction === "AND") {
                result = result && rowResult
            } else {
                result = result || rowResult
            }
        }
        return result
    })
}

function evaluateRow(issue: Issue, row: FilterRow): boolean {
    const { field, operator, value, value2 } = row
    let fieldValue: string | number | undefined | null = ""
    switch (field) {
        case "status": fieldValue = issue.status; break
        case "priority": fieldValue = issue.priority; break
        case "assignee": fieldValue = issue.assignee?.name ?? issue.assigneeId; break
        case "type": fieldValue = issue.type; break
        case "sprint": fieldValue = issue.sprintId ?? ""; break
        case "epic": fieldValue = issue.epicId ?? ""; break
        case "labels": fieldValue = (issue.labels ?? []).join(","); break
        case "dueDate": fieldValue = issue.dueDate ?? ""; break
        case "createdDate": fieldValue = issue.createdAt; break
        case "storyPoints": fieldValue = issue.storyPoints; break
    }
    const strVal = String(fieldValue ?? "").toLowerCase()
    const cmpVal = value.toLowerCase()

    switch (operator) {
        case "equals": return strVal === cmpVal
        case "not_equals": return strVal !== cmpVal
        case "contains": return strVal.includes(cmpVal)
        case "greater_than": return Number(fieldValue ?? 0) > Number(value)
        case "less_than": return Number(fieldValue ?? 0) < Number(value)
        case "between": return Number(fieldValue ?? 0) >= Number(value) && Number(fieldValue ?? 0) <= Number(value2 ?? value)
        case "is_empty": return !fieldValue || strVal === ""
        case "is_not_empty": return !!fieldValue && strVal !== ""
    }
}

const PRIORITY_COLORS: Record<string, string> = {
    URGENT: "bg-red-50 text-red-700",
    HIGH: "bg-orange-50 text-orange-700",
    MEDIUM: "bg-amber-50 text-amber-600",
    LOW: "bg-zinc-100 text-zinc-600",
}

const STATUS_COLORS: Record<string, string> = {
    TODO: "bg-zinc-100 text-zinc-600",
    IN_PROGRESS: "bg-blue-50 text-blue-700",
    IN_REVIEW: "bg-purple-50 text-purple-700",
    DONE: "bg-emerald-50 text-emerald-700",
    BACKLOG: "bg-zinc-100 text-zinc-500",
    BLOCKED: "bg-red-50 text-red-700",
}

export default function FiltersPage() {
    const issues = useIssueStore((s) => s.issues)
    const sprints = useSprintEpicStore((s) => s.sprints)
    const epics = useSprintEpicStore((s) => s.epics)

    const [filterRows, setFilterRows] = useState<FilterRow[]>([createFilterRow()])
    const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([
        {
            id: "sf-1", name: "My Open Issues", description: "All non-done issues assigned to me",
            rows: [{ id: "r1", field: "status", operator: "not_equals", value: "DONE", conjunction: "AND" }],
            shared: false, lastUsed: "2026-04-01T10:00:00Z", pinned: true, starred: false,
        },
        {
            id: "sf-2", name: "Critical Bugs", description: "High and urgent priority bugs",
            rows: [
                { id: "r2", field: "type", operator: "equals", value: "BUG", conjunction: "AND" },
                { id: "r3", field: "priority", operator: "equals", value: "URGENT", conjunction: "AND" },
            ],
            shared: true, lastUsed: "2026-03-28T14:00:00Z", pinned: false, starred: true,
        },
    ])
    const [hasApplied, setHasApplied] = useState(false)
    const [saveDialogOpen, setSaveDialogOpen] = useState(false)
    const [saveName, setSaveName] = useState("")
    const [saveDesc, setSaveDesc] = useState("")
    const [saveShared, setSaveShared] = useState(false)

    const filteredIssues = useMemo(() => {
        if (!hasApplied) return []
        return applyFilters(issues, filterRows)
    }, [issues, filterRows, hasApplied])

    const addRow = () => {
        setFilterRows((prev) => [...prev, createFilterRow()])
    }

    const removeRow = (id: string) => {
        setFilterRows((prev) => prev.filter((r) => r.id !== id))
    }

    const updateRow = (id: string, updates: Partial<FilterRow>) => {
        setFilterRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)))
    }

    const handleApply = () => {
        const validRows = filterRows.filter((r) => r.operator === "is_empty" || r.operator === "is_not_empty" || r.value)
        if (validRows.length === 0) {
            toast.error("Add at least one filter condition with a value")
            return
        }
        setHasApplied(true)
        toast.success(`Filter applied — ${applyFilters(issues, validRows).length} issues matched`)
    }

    const handleSave = () => {
        if (!saveName.trim()) { toast.error("Filter name is required"); return }
        const newFilter: SavedFilter = {
            id: `sf-${Date.now()}`, name: saveName, description: saveDesc,
            rows: [...filterRows], shared: saveShared, lastUsed: new Date().toISOString(),
            pinned: false, starred: false,
        }
        setSavedFilters((prev) => [...prev, newFilter])
        setSaveDialogOpen(false)
        setSaveName("")
        setSaveDesc("")
        setSaveShared(false)
        toast.success(`Filter "${saveName}" saved`)
    }

    const runSavedFilter = (sf: SavedFilter) => {
        setFilterRows(sf.rows.map((r) => ({ ...r })))
        setSavedFilters((prev) => prev.map((f) => f.id === sf.id ? { ...f, lastUsed: new Date().toISOString() } : f))
        setHasApplied(true)
        toast.success(`Running filter: ${sf.name}`)
    }

    const togglePin = (id: string) => {
        setSavedFilters((prev) => prev.map((f) => f.id === id ? { ...f, pinned: !f.pinned } : f))
    }

    const toggleStar = (id: string) => {
        setSavedFilters((prev) => prev.map((f) => f.id === id ? { ...f, starred: !f.starred } : f))
    }

    const deleteSavedFilter = (id: string) => {
        setSavedFilters((prev) => prev.filter((f) => f.id !== id))
        toast.success("Filter deleted")
    }

    const applyQuickFilter = (label: string, rows: FilterRow[]) => {
        setFilterRows(rows)
        setHasApplied(true)
        toast.success(`Quick filter: ${label}`)
    }

    const renderValueInput = (row: FilterRow) => {
        if (row.operator === "is_empty" || row.operator === "is_not_empty") return null
        const dropdownFields: Record<string, string[]> = {
            status: STATUS_OPTIONS,
            priority: PRIORITY_OPTIONS,
            type: TYPE_OPTIONS,
        }
        const options = dropdownFields[row.field]
        if (options) {
            return (
                <Select value={row.value} onValueChange={(v) => updateRow(row.id, { value: v })}>
                    <SelectTrigger className="h-8 w-40 text-xs border-zinc-200">
                        <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((o) => (
                            <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )
        }
        if (row.field === "sprint") {
            return (
                <Select value={row.value} onValueChange={(v) => updateRow(row.id, { value: v })}>
                    <SelectTrigger className="h-8 w-40 text-xs border-zinc-200">
                        <SelectValue placeholder="Select sprint..." />
                    </SelectTrigger>
                    <SelectContent>
                        {sprints.map((s) => (
                            <SelectItem key={s.id} value={s.id} className="text-xs">{s.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )
        }
        if (row.field === "epic") {
            return (
                <Select value={row.value} onValueChange={(v) => updateRow(row.id, { value: v })}>
                    <SelectTrigger className="h-8 w-40 text-xs border-zinc-200">
                        <SelectValue placeholder="Select epic..." />
                    </SelectTrigger>
                    <SelectContent>
                        {epics.map((e) => (
                            <SelectItem key={e.id} value={e.id} className="text-xs">{e.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )
        }
        return (
            <div className="flex items-center gap-1">
                <Input
                    className="h-8 w-36 text-xs border-zinc-200"
                    placeholder="Value..."
                    value={row.value}
                    onChange={(e) => updateRow(row.id, { value: e.target.value })}
                />
                {row.operator === "between" && (
                    <>
                        <span className="text-xs text-zinc-400">to</span>
                        <Input
                            className="h-8 w-36 text-xs border-zinc-200"
                            placeholder="Value 2..."
                            value={row.value2 ?? ""}
                            onChange={(e) => updateRow(row.id, { value2: e.target.value })}
                        />
                    </>
                )}
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* BREADCRUMB + HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>PROJECTS</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">FILTERS</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Advanced Filters</h1>
                        <p className="text-xs text-zinc-500 font-medium">Build JQL-like queries to find issues across your project.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-zinc-900 hover:bg-zinc-800 text-white">
                                    <Save className="w-3.5 h-3.5 mr-2" />Save Filter
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="text-sm font-bold text-zinc-900">Save Filter</DialogTitle>
                                    <DialogDescription className="text-xs text-zinc-500">Save current filter configuration as a preset.</DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col gap-3 py-3">
                                    <div>
                                        <label className="text-xs font-medium text-zinc-900 mb-1 block">Name</label>
                                        <Input className="h-8 text-xs" value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder="e.g. My Sprint Bugs" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-zinc-900 mb-1 block">Description</label>
                                        <Input className="h-8 text-xs" value={saveDesc} onChange={(e) => setSaveDesc(e.target.value)} placeholder="Optional description..." />
                                    </div>
                                    <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 cursor-pointer">
                                        <input type="checkbox" checked={saveShared} onChange={(e) => setSaveShared(e.target.checked)} className="rounded border-zinc-300" />
                                        Share with team
                                    </label>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
                                    <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleSave}>Save</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleApply}>
                            <Play className="w-3.5 h-3.5 mr-2" />Apply Filter
                        </Button>
                    </div>
                </div>
            </div>

            {/* STATS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-indigo-500 to-indigo-700 border-none text-white shadow-[0_8px_30px_rgb(99,102,241,0.3)]">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Total Issues</p>
                        <Filter className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">{issues.length}</p>
                        <p className="text-[10px] text-white/80">In all projects</p>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white border shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Saved Filters</p>
                        <Star className="w-4 h-4 text-amber-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">{savedFilters.length}</p>
                        <p className="text-[10px] text-zinc-400">Presets available</p>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white border shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Active Conditions</p>
                        <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">{filterRows.length}</p>
                        <p className="text-[10px] text-zinc-400">Filter rows active</p>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white border shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Results</p>
                        <Search className="w-4 h-4 text-emerald-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">{hasApplied ? filteredIssues.length : "—"}</p>
                        <p className="text-[10px] text-zinc-400">{hasApplied ? "Matched issues" : "Apply to see results"}</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* SAVED FILTERS */}
            {savedFilters.length > 0 && (
                <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/20">
                        <h2 className="text-sm font-bold text-zinc-900">Saved Filters</h2>
                    </div>
                    <Table>
                        <TableHeader className="bg-zinc-50/50">
                            <TableRow>
                                <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Name</TableHead>
                                <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Query Summary</TableHead>
                                <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Last Used</TableHead>
                                <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-right pr-4">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {savedFilters.map((sf) => (
                                <TableRow key={sf.id} className="hover:bg-zinc-50/50 transition-colors">
                                    <TableCell className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            {sf.pinned && <Pin className="w-3 h-3 text-indigo-500" />}
                                            {sf.starred && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                                            <span className="text-xs font-bold text-zinc-900">{sf.name}</span>
                                            {sf.shared && <Badge className="text-[9px] bg-blue-50 text-blue-600 border-none px-1.5">Shared</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <span className="text-xs text-zinc-500 font-mono">
                                            {sf.rows.map((r, i) => `${i > 0 ? ` ${r.conjunction} ` : ""}${r.field} ${r.operator} ${r.value}`).join("")}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <span className="text-[10px] text-zinc-400 font-mono">{new Date(sf.lastUsed).toLocaleDateString()}</span>
                                    </TableCell>
                                    <TableCell className="py-3 text-right pr-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md" onClick={() => togglePin(sf.id)}>
                                                <Pin className={`w-3.5 h-3.5 ${sf.pinned ? "text-indigo-500" : "text-zinc-400"}`} />
                                            </Button>
                                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md" onClick={() => toggleStar(sf.id)}>
                                                <Star className={`w-3.5 h-3.5 ${sf.starred ? "text-amber-500 fill-amber-500" : "text-zinc-400"}`} />
                                            </Button>
                                            <Button className="h-7 rounded-md text-[10px] font-medium px-2 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => runSavedFilter(sf)}>
                                                <Play className="w-3 h-3 mr-1" />Run
                                            </Button>
                                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-red-50 rounded-md" onClick={() => deleteSavedFilter(sf.id)}>
                                                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* QUICK FILTERS */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-zinc-500 mr-1">Quick Filters:</span>
                <Button variant="outline" className="h-7 rounded-md text-[10px] font-medium px-2.5 border-zinc-200 text-zinc-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 active:scale-95"
                    onClick={() => applyQuickFilter("My Open Issues", [{ id: "q1", field: "status", operator: "not_equals", value: "DONE", conjunction: "AND" }])}>
                    My Open Issues
                </Button>
                <Button variant="outline" className="h-7 rounded-md text-[10px] font-medium px-2.5 border-zinc-200 text-zinc-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 active:scale-95"
                    onClick={() => applyQuickFilter("High Priority", [{ id: "q2", field: "priority", operator: "equals", value: "HIGH", conjunction: "AND" }])}>
                    High Priority
                </Button>
                <Button variant="outline" className="h-7 rounded-md text-[10px] font-medium px-2.5 border-zinc-200 text-zinc-700 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 active:scale-95"
                    onClick={() => applyQuickFilter("Due This Week", [{ id: "q3", field: "dueDate", operator: "is_not_empty", value: "", conjunction: "AND" }])}>
                    Due This Week
                </Button>
                <Button variant="outline" className="h-7 rounded-md text-[10px] font-medium px-2.5 border-zinc-200 text-zinc-700 hover:bg-zinc-100 active:scale-95"
                    onClick={() => applyQuickFilter("Unassigned", [{ id: "q4", field: "assignee", operator: "is_empty", value: "", conjunction: "AND" }])}>
                    Unassigned
                </Button>
                <Button variant="outline" className="h-7 rounded-md text-[10px] font-medium px-2.5 border-zinc-200 text-zinc-700 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 active:scale-95"
                    onClick={() => applyQuickFilter("Bugs Only", [{ id: "q5", field: "type", operator: "equals", value: "BUG", conjunction: "AND" }])}>
                    Bugs Only
                </Button>
            </div>

            {/* FILTER BUILDER */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/20 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-zinc-900">Filter Builder</h2>
                    <Button variant="outline" className="h-7 rounded-md text-[10px] font-medium px-2.5 border-zinc-200 active:scale-95" onClick={addRow}>
                        <Plus className="w-3 h-3 mr-1" />Add Row
                    </Button>
                </div>
                <div className="p-4 flex flex-col gap-3">
                    {filterRows.map((row, idx) => (
                        <div key={row.id} className="flex flex-wrap items-center gap-2">
                            {idx > 0 && (
                                <Select value={row.conjunction} onValueChange={(v) => updateRow(row.id, { conjunction: v as FilterConjunction })}>
                                    <SelectTrigger className="h-8 w-20 text-xs font-semibold border-zinc-200 bg-zinc-50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="AND" className="text-xs font-semibold">AND</SelectItem>
                                        <SelectItem value="OR" className="text-xs font-semibold">OR</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                            {idx === 0 && <span className="text-xs font-semibold text-zinc-500 w-20 text-center">WHERE</span>}

                            <Select value={row.field} onValueChange={(v) => updateRow(row.id, { field: v as FilterField, value: "" })}>
                                <SelectTrigger className="h-8 w-36 text-xs border-zinc-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {FIELDS.map((f) => (
                                        <SelectItem key={f.value} value={f.value} className="text-xs">{f.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={row.operator} onValueChange={(v) => updateRow(row.id, { operator: v as FilterOperator })}>
                                <SelectTrigger className="h-8 w-36 text-xs border-zinc-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {OPERATORS.map((o) => (
                                        <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {renderValueInput(row)}

                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-red-50 rounded-md" onClick={() => removeRow(row.id)}>
                                <X className="w-3.5 h-3.5 text-red-400" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* RESULTS TABLE */}
            {hasApplied && (
                <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/20">
                        <h2 className="text-sm font-bold text-zinc-900">Results ({filteredIssues.length} issues)</h2>
                    </div>
                    <Table>
                        <TableHeader className="bg-zinc-50/50">
                            <TableRow>
                                <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Key</TableHead>
                                <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Title</TableHead>
                                <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Type</TableHead>
                                <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Status</TableHead>
                                <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Priority</TableHead>
                                <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Assignee</TableHead>
                                <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Points</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredIssues.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-12 text-center text-xs text-zinc-400">
                                        No issues match the current filter criteria.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredIssues.map((issue) => (
                                    <TableRow key={issue.id} className="hover:bg-zinc-50/50 transition-colors">
                                        <TableCell className="py-3 px-4">
                                            <span className="text-[10px] font-mono font-bold text-indigo-600">{issue.id}</span>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <span className="text-xs font-medium text-zinc-900">{issue.title}</span>
                                        </TableCell>
                                        <TableCell className="py-3 text-center">
                                            <Badge className="text-[9px] uppercase font-bold border-none px-2 py-0.5 bg-zinc-100 text-zinc-600">{issue.type}</Badge>
                                        </TableCell>
                                        <TableCell className="py-3 text-center">
                                            <Badge className={`text-[9px] uppercase font-bold border-none px-2 py-0.5 ${STATUS_COLORS[issue.status] ?? "bg-zinc-100 text-zinc-600"}`}>{issue.status}</Badge>
                                        </TableCell>
                                        <TableCell className="py-3 text-center">
                                            <Badge className={`text-[9px] uppercase font-bold border-none px-2 py-0.5 ${PRIORITY_COLORS[issue.priority]}`}>{issue.priority}</Badge>
                                        </TableCell>
                                        <TableCell className="py-3 text-center">
                                            <span className="text-xs text-zinc-600">{issue.assignee?.name ?? issue.assigneeId}</span>
                                        </TableCell>
                                        <TableCell className="py-3 text-center">
                                            <span className="text-xs font-mono text-zinc-500">{issue.storyPoints ?? "—"}</span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}
