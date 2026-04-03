"use client"

import React, { useState } from "react"
import {
    Settings, ChevronUp, ChevronDown, Plus, Trash2, Eye, EyeOff,
    Columns, LayoutGrid, Filter, AlignJustify, Palette, X, GripVertical
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

interface BoardColumn {
    id: string
    name: string
    color: string
    wipLimit: number
    statusMapping: string[]
    order: number
}

interface QuickFilter {
    id: string
    name: string
    filterType: string
    value: string
    active: boolean
}

interface CardField {
    key: string
    label: string
    visible: boolean
}

const PRESET_COLORS = ["#64748b", "#6366f1", "#8b5cf6", "#ec4899", "#ef4444", "#f59e0b", "#10b981", "#06b6d4", "#3b82f6"]
const ALL_STATUSES = ["TODO", "IN_PROGRESS", "IN_REVIEW", "TESTING", "DONE", "BACKLOG", "BLOCKED"]
const SWIMLANE_OPTIONS = ["None", "By Assignee", "By Epic", "By Priority", "By Story"]
const CARD_COLOR_OPTIONS = ["None", "By Priority", "By Type", "By Assignee", "By Epic"]
const FILTER_TYPES = ["By Assignee", "By Priority", "By Type", "By Label", "By Epic"]

const INITIAL_COLUMNS: BoardColumn[] = [
    { id: "col-1", name: "Backlog", color: "#64748b", wipLimit: 0, statusMapping: ["BACKLOG"], order: 0 },
    { id: "col-2", name: "To Do", color: "#3b82f6", wipLimit: 10, statusMapping: ["TODO"], order: 1 },
    { id: "col-3", name: "In Progress", color: "#6366f1", wipLimit: 5, statusMapping: ["IN_PROGRESS"], order: 2 },
    { id: "col-4", name: "In Review", color: "#8b5cf6", wipLimit: 3, statusMapping: ["IN_REVIEW"], order: 3 },
    { id: "col-5", name: "Done", color: "#10b981", wipLimit: 0, statusMapping: ["DONE"], order: 4 },
]

const INITIAL_CARD_FIELDS: CardField[] = [
    { key: "type", label: "Type Icon", visible: true },
    { key: "priority", label: "Priority", visible: true },
    { key: "storyPoints", label: "Story Points", visible: true },
    { key: "assignee", label: "Assignee", visible: true },
    { key: "labels", label: "Labels", visible: false },
    { key: "dueDate", label: "Due Date", visible: false },
    { key: "epic", label: "Epic Badge", visible: true },
]

const INITIAL_FILTERS: QuickFilter[] = [
    { id: "qf-1", name: "Only My Issues", filterType: "By Assignee", value: "Current User", active: true },
    { id: "qf-2", name: "Recently Updated", filterType: "By Type", value: "Updated < 24h", active: true },
]

export default function BoardSettingsPage() {
    const [activeTab, setActiveTab] = useState("columns")
    const [columns, setColumns] = useState<BoardColumn[]>(INITIAL_COLUMNS)
    const [cardFields, setCardFields] = useState<CardField[]>(INITIAL_CARD_FIELDS)
    const [cardColorBy, setCardColorBy] = useState("None")
    const [quickFilters, setQuickFilters] = useState<QuickFilter[]>(INITIAL_FILTERS)
    const [swimlaneType, setSwimlaneType] = useState("None")
    const [showNoCategory, setShowNoCategory] = useState(true)

    // Column dialog
    const [colDialogOpen, setColDialogOpen] = useState(false)
    const [editingCol, setEditingCol] = useState<BoardColumn | null>(null)
    const [colName, setColName] = useState("")
    const [colColor, setColColor] = useState("#6366f1")
    const [colWip, setColWip] = useState(0)
    const [colStatuses, setColStatuses] = useState<string[]>([])

    // Filter dialog
    const [filterDialogOpen, setFilterDialogOpen] = useState(false)
    const [filterName, setFilterName] = useState("")
    const [filterType, setFilterType] = useState("")
    const [filterValue, setFilterValue] = useState("")

    // Delete confirmation
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deletingColId, setDeletingColId] = useState<string | null>(null)

    const resetColForm = () => {
        setColName(""); setColColor("#6366f1"); setColWip(0); setColStatuses([]); setEditingCol(null)
    }

    const openAddColumn = () => { resetColForm(); setColDialogOpen(true) }

    const openEditColumn = (col: BoardColumn) => {
        setEditingCol(col); setColName(col.name); setColColor(col.color)
        setColWip(col.wipLimit); setColStatuses(col.statusMapping); setColDialogOpen(true)
    }

    const confirmDeleteColumn = (id: string) => { setDeletingColId(id); setDeleteDialogOpen(true) }

    const handleDeleteColumn = () => {
        if (!deletingColId) return
        setColumns(prev => prev.filter(c => c.id !== deletingColId).map((c, i) => ({ ...c, order: i })))
        setDeleteDialogOpen(false); setDeletingColId(null)
        toast.success("Column deleted")
    }

    const handleSaveColumn = () => {
        if (!colName.trim()) { toast.error("Column name is required"); return }
        if (editingCol) {
            setColumns(prev => prev.map(c => c.id === editingCol.id ? { ...c, name: colName, color: colColor, wipLimit: colWip, statusMapping: colStatuses } : c))
            toast.success("Column updated")
        } else {
            const newCol: BoardColumn = {
                id: `col-${Date.now()}`, name: colName, color: colColor,
                wipLimit: colWip, statusMapping: colStatuses, order: columns.length
            }
            setColumns(prev => [...prev, newCol])
            toast.success("Column added")
        }
        setColDialogOpen(false); resetColForm()
    }

    const moveColumn = (id: string, dir: "up" | "down") => {
        const idx = columns.findIndex(c => c.id === id)
        if (idx === -1) return
        const newIdx = dir === "up" ? idx - 1 : idx + 1
        if (newIdx < 0 || newIdx >= columns.length) return
        const next = [...columns]
        const [moved] = next.splice(idx, 1)
        next.splice(newIdx, 0, moved)
        setColumns(next.map((c, i) => ({ ...c, order: i })))
        toast.success("Column reordered")
    }

    const toggleStatusMapping = (status: string) => {
        setColStatuses(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status])
    }

    const toggleCardField = (key: string) => {
        setCardFields(prev => prev.map(f => f.key === key ? { ...f, visible: !f.visible } : f))
        toast.success("Card layout updated")
    }

    const handleAddFilter = () => {
        if (!filterName.trim() || !filterType) { toast.error("Name and type are required"); return }
        const newFilter: QuickFilter = { id: `qf-${Date.now()}`, name: filterName, filterType, value: filterValue, active: true }
        setQuickFilters(prev => [...prev, newFilter])
        setFilterDialogOpen(false); setFilterName(""); setFilterType(""); setFilterValue("")
        toast.success("Quick filter created")
    }

    const toggleFilter = (id: string) => {
        setQuickFilters(prev => prev.map(f => f.id === id ? { ...f, active: !f.active } : f))
    }

    const deleteFilter = (id: string) => {
        setQuickFilters(prev => prev.filter(f => f.id !== id))
        toast.success("Filter deleted")
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* BREADCRUMB + HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>PROJECTS</span><span>/</span>
                    <span className="text-zinc-900 font-semibold">BOARD SETTINGS</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Board Configuration</h1>
                        <p className="text-xs text-zinc-500 font-medium">Customize your Kanban board layout, columns, and filters.</p>
                    </div>
                </div>
            </div>

            {/* TABS */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-zinc-100 h-9 rounded-lg px-1">
                    <TabsTrigger value="columns" className="text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"><Columns className="w-3.5 h-3.5 mr-1.5" />Columns</TabsTrigger>
                    <TabsTrigger value="cardLayout" className="text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"><LayoutGrid className="w-3.5 h-3.5 mr-1.5" />Card Layout</TabsTrigger>
                    <TabsTrigger value="filters" className="text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"><Filter className="w-3.5 h-3.5 mr-1.5" />Quick Filters</TabsTrigger>
                    <TabsTrigger value="swimlanes" className="text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"><AlignJustify className="w-3.5 h-3.5 mr-1.5" />Swimlanes</TabsTrigger>
                </TabsList>

                {/* COLUMNS TAB */}
                <TabsContent value="columns" className="mt-4">
                    <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/20">
                            <p className="text-xs font-medium text-zinc-500">{columns.length} columns configured</p>
                            <Button className="h-8 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95" onClick={openAddColumn}>
                                <Plus className="w-3.5 h-3.5 mr-2" /> Add Column
                            </Button>
                        </div>
                        <div className="divide-y divide-zinc-100">
                            {columns.sort((a, b) => a.order - b.order).map((col, idx) => (
                                <div key={col.id} className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-50/50 transition-colors">
                                    <GripVertical className="w-4 h-4 text-zinc-300 flex-shrink-0" />
                                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: col.color }} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-zinc-900">{col.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            {col.wipLimit > 0 && (
                                                <span className="text-[10px] text-zinc-400">WIP: {col.wipLimit}</span>
                                            )}
                                            <div className="flex gap-1">
                                                {col.statusMapping.map(s => (
                                                    <Badge key={s} variant="outline" className="text-[9px] font-medium border-zinc-200 text-zinc-500 px-1.5 py-0">{s}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md" onClick={() => moveColumn(col.id, "up")} disabled={idx === 0}>
                                            <ChevronUp className="h-3.5 w-3.5 text-zinc-400" />
                                        </Button>
                                        <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md" onClick={() => moveColumn(col.id, "down")} disabled={idx === columns.length - 1}>
                                            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                                        </Button>
                                        <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md" onClick={() => openEditColumn(col)}>
                                            <Settings className="h-3.5 w-3.5 text-zinc-400" />
                                        </Button>
                                        <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-red-50 rounded-md" onClick={() => confirmDeleteColumn(col.id)}>
                                            <Trash2 className="h-3.5 w-3.5 text-red-400" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* CARD LAYOUT TAB */}
                <TabsContent value="cardLayout" className="mt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Field toggles */}
                        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-zinc-100 bg-zinc-50/20">
                                <p className="text-xs font-bold text-zinc-900">Visible Fields</p>
                                <p className="text-[10px] text-zinc-400 mt-0.5">Toggle which fields appear on board cards</p>
                            </div>
                            <div className="divide-y divide-zinc-100">
                                {cardFields.map(f => (
                                    <div key={f.key} className="flex items-center justify-between px-4 py-3">
                                        <span className="text-xs font-medium text-zinc-700">{f.label}</span>
                                        <Button variant="ghost" className={`h-7 px-2 rounded-md text-xs font-medium ${f.visible ? "bg-indigo-50 text-indigo-600" : "bg-zinc-100 text-zinc-400"}`} onClick={() => toggleCardField(f.key)}>
                                            {f.visible ? <><Eye className="w-3.5 h-3.5 mr-1" /> Visible</> : <><EyeOff className="w-3.5 h-3.5 mr-1" /> Hidden</>}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Card color + preview */}
                        <div className="flex flex-col gap-4">
                            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-4">
                                <p className="text-xs font-bold text-zinc-900 mb-2">Card Color</p>
                                <Select value={cardColorBy} onValueChange={(v) => { setCardColorBy(v); toast.success(`Card color set to ${v}`) }}>
                                    <SelectTrigger className="h-9 text-xs border-zinc-200"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {CARD_COLOR_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Preview card */}
                            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-4">
                                <p className="text-xs font-bold text-zinc-900 mb-3">Card Preview</p>
                                <div className={`border border-zinc-200 rounded-md p-3 ${cardColorBy === "By Priority" ? "border-l-4 border-l-red-500" : cardColorBy === "By Type" ? "border-l-4 border-l-indigo-500" : cardColorBy === "By Epic" ? "border-l-4 border-l-violet-500" : ""}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {cardFields.find(f => f.key === "type")?.visible && <Badge className="text-[9px] bg-blue-50 text-blue-600 border-none px-1.5 py-0">TASK</Badge>}
                                        {cardFields.find(f => f.key === "priority")?.visible && <Badge className="text-[9px] bg-red-50 text-red-600 border-none px-1.5 py-0">HIGH</Badge>}
                                    </div>
                                    <p className="text-xs font-bold text-zinc-900 mb-1">Sample Issue Title</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        {cardFields.find(f => f.key === "storyPoints")?.visible && <span className="text-[10px] bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded font-medium">5 SP</span>}
                                        {cardFields.find(f => f.key === "epic")?.visible && <Badge className="text-[9px] bg-violet-50 text-violet-600 border-none px-1.5 py-0">Epic</Badge>}
                                        {cardFields.find(f => f.key === "labels")?.visible && <Badge variant="outline" className="text-[9px] border-zinc-200 text-zinc-500 px-1.5 py-0">frontend</Badge>}
                                        {cardFields.find(f => f.key === "dueDate")?.visible && <span className="text-[10px] text-zinc-400">Apr 15</span>}
                                        {cardFields.find(f => f.key === "assignee")?.visible && (
                                            <div className="ml-auto w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <span className="text-[9px] font-bold text-indigo-600">JD</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* QUICK FILTERS TAB */}
                <TabsContent value="filters" className="mt-4">
                    <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/20">
                            <p className="text-xs font-medium text-zinc-500">{quickFilters.length} quick filters</p>
                            <Button className="h-8 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95" onClick={() => setFilterDialogOpen(true)}>
                                <Plus className="w-3.5 h-3.5 mr-2" /> Add Filter
                            </Button>
                        </div>
                        <div className="divide-y divide-zinc-100">
                            {quickFilters.map(f => (
                                <div key={f.id} className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-50/50 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-zinc-900">{f.name}</p>
                                        <div className="flex gap-1.5 mt-0.5">
                                            <Badge variant="outline" className="text-[9px] font-medium border-zinc-200 text-zinc-500 px-1.5 py-0">{f.filterType}</Badge>
                                            {f.value && <span className="text-[10px] text-zinc-400">{f.value}</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" className={`h-7 px-2 rounded-md text-[10px] font-medium ${f.active ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-400"}`} onClick={() => toggleFilter(f.id)}>
                                            {f.active ? "Active" : "Inactive"}
                                        </Button>
                                        <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-red-50 rounded-md" onClick={() => deleteFilter(f.id)}>
                                            <Trash2 className="h-3.5 w-3.5 text-red-400" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {quickFilters.length === 0 && (
                                <div className="text-center py-12 text-xs text-zinc-400">No quick filters configured</div>
                            )}
                        </div>
                    </div>
                </TabsContent>

                {/* SWIMLANES TAB */}
                <TabsContent value="swimlanes" className="mt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-4 flex flex-col gap-4">
                            <div>
                                <p className="text-xs font-bold text-zinc-900 mb-1">Swimlane Type</p>
                                <p className="text-[10px] text-zinc-400 mb-3">Group rows on the board by a category</p>
                                <Select value={swimlaneType} onValueChange={(v) => { setSwimlaneType(v); toast.success(`Swimlanes set to ${v}`) }}>
                                    <SelectTrigger className="h-9 text-xs border-zinc-200"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {SWIMLANE_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            {swimlaneType !== "None" && (
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-zinc-700">Show &quot;No Category&quot; swimlane</p>
                                        <p className="text-[10px] text-zinc-400">Display items without a category assignment</p>
                                    </div>
                                    <Button variant="ghost" className={`h-7 px-2 rounded-md text-[10px] font-medium ${showNoCategory ? "bg-indigo-50 text-indigo-600" : "bg-zinc-100 text-zinc-400"}`} onClick={() => { setShowNoCategory(!showNoCategory); toast.success(showNoCategory ? "No category hidden" : "No category shown") }}>
                                        {showNoCategory ? "Shown" : "Hidden"}
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Preview */}
                        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-4">
                            <p className="text-xs font-bold text-zinc-900 mb-3">Board Preview</p>
                            {swimlaneType === "None" ? (
                                <div className="flex gap-2">
                                    {columns.slice(0, 4).map(col => (
                                        <div key={col.id} className="flex-1 bg-zinc-50 rounded-md p-2 border border-zinc-200">
                                            <p className="text-[10px] font-bold text-zinc-500 mb-2">{col.name}</p>
                                            <div className="h-6 bg-white rounded border border-zinc-100 mb-1" />
                                            <div className="h-6 bg-white rounded border border-zinc-100" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {["Lane 1", "Lane 2", ...(showNoCategory ? ["No Category"] : [])].map(lane => (
                                        <div key={lane} className="bg-zinc-50 rounded-md p-2 border border-zinc-200">
                                            <p className="text-[10px] font-bold text-zinc-500 mb-1.5">{lane}</p>
                                            <div className="flex gap-2">
                                                {columns.slice(0, 4).map(col => (
                                                    <div key={col.id} className="flex-1 h-5 bg-white rounded border border-zinc-100" />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* ADD/EDIT COLUMN DIALOG */}
            <Dialog open={colDialogOpen} onOpenChange={setColDialogOpen}>
                <DialogContent className="sm:max-w-[440px] bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-zinc-900 tracking-tight">
                            {editingCol ? "Edit Column" : "Add Column"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-zinc-500">Column Name</label>
                            <Input className="h-9 text-xs border-zinc-200" placeholder="e.g., QA Testing" value={colName} onChange={(e) => setColName(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-zinc-500">Color</label>
                            <div className="flex gap-2">
                                {PRESET_COLORS.map(c => (
                                    <button key={c} className={`w-7 h-7 rounded-full border-2 transition-all ${colColor === c ? "border-zinc-900 scale-110" : "border-transparent hover:border-zinc-300"}`} style={{ backgroundColor: c }} onClick={() => setColColor(c)} />
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-zinc-500">WIP Limit (0 = unlimited)</label>
                            <Input type="number" min={0} className="h-9 text-xs border-zinc-200 w-32" value={colWip} onChange={(e) => setColWip(parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-zinc-500">Status Mapping</label>
                            <div className="flex flex-wrap gap-1.5">
                                {ALL_STATUSES.map(s => (
                                    <button key={s} className={`text-[10px] font-medium px-2 py-1 rounded-md border transition-colors ${colStatuses.includes(s) ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100"}`} onClick={() => toggleStatusMapping(s)}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setColDialogOpen(false)}>Cancel</Button>
                        <Button className="h-8 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95" onClick={handleSaveColumn}>
                            {editingCol ? "Update" : "Add Column"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* DELETE CONFIRMATION DIALOG */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[380px] bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-zinc-900 tracking-tight">Delete Column</DialogTitle>
                    </DialogHeader>
                    <p className="text-xs text-zinc-500">Are you sure you want to delete this column? Issues mapped to this column will need to be remapped.</p>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button className="h-8 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95" onClick={handleDeleteColumn}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ADD FILTER DIALOG */}
            <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
                <DialogContent className="sm:max-w-[400px] bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-zinc-900 tracking-tight">Create Quick Filter</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-zinc-500">Filter Name</label>
                            <Input className="h-9 text-xs border-zinc-200" placeholder="e.g., High Priority Bugs" value={filterName} onChange={(e) => setFilterName(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-zinc-500">Filter Type</label>
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="h-9 text-xs border-zinc-200"><SelectValue placeholder="Select type..." /></SelectTrigger>
                                <SelectContent>
                                    {FILTER_TYPES.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-zinc-500">Value</label>
                            <Input className="h-9 text-xs border-zinc-200" placeholder="e.g., Urgent, frontend..." value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setFilterDialogOpen(false)}>Cancel</Button>
                        <Button className="h-8 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95" onClick={handleAddFilter}>Create Filter</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
