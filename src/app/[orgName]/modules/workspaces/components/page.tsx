"use client"

import React, { useState, useMemo } from "react"
import {
    Layers, Tag, Plus, MoreHorizontal, Trash2, Edit3, Search,
    X, Link2, Users, ChevronRight, Eye, Palette
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import { useIssueStore } from "@/shared/data/issue-store"

interface ProjectComponent {
    id: string
    name: string
    description: string
    lead: string
    defaultAssignee: string
    issueKeys: string[]
}

interface Label {
    id: string
    name: string
    color: string
    usageCount: number
}

const PRESET_COLORS = [
    "#ef4444", "#f97316", "#eab308", "#22c55e",
    "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280",
]

const initialComponents: ProjectComponent[] = [
    { id: "c1", name: "Frontend", description: "React UI components and pages", lead: "Alice Johnson", defaultAssignee: "Bob Smith", issueKeys: ["PROJ-101", "PROJ-102", "PROJ-105"] },
    { id: "c2", name: "Backend", description: "Server-side logic and APIs", lead: "Charlie Davis", defaultAssignee: "Diana Lee", issueKeys: ["PROJ-103", "PROJ-106"] },
    { id: "c3", name: "API", description: "REST and GraphQL endpoints", lead: "Bob Smith", defaultAssignee: "Eve Wilson", issueKeys: ["PROJ-104", "PROJ-107", "PROJ-108", "PROJ-109"] },
    { id: "c4", name: "Database", description: "Schema design and migrations", lead: "Diana Lee", defaultAssignee: "Frank Brown", issueKeys: ["PROJ-110"] },
    { id: "c5", name: "DevOps", description: "CI/CD pipelines and infrastructure", lead: "Eve Wilson", defaultAssignee: "Alice Johnson", issueKeys: ["PROJ-111", "PROJ-112"] },
]

const initialLabels: Label[] = [
    { id: "l1", name: "bug", color: "#ef4444", usageCount: 8 },
    { id: "l2", name: "feature", color: "#3b82f6", usageCount: 12 },
    { id: "l3", name: "enhancement", color: "#8b5cf6", usageCount: 5 },
    { id: "l4", name: "documentation", color: "#22c55e", usageCount: 3 },
    { id: "l5", name: "urgent", color: "#f97316", usageCount: 4 },
    { id: "l6", name: "design", color: "#ec4899", usageCount: 6 },
    { id: "l7", name: "tech-debt", color: "#6b7280", usageCount: 7 },
    { id: "l8", name: "testing", color: "#eab308", usageCount: 2 },
]

export default function ComponentsLabelsPage() {
    const { issues } = useIssueStore()
    const [activeTab, setActiveTab] = useState("components")
    const [components, setComponents] = useState<ProjectComponent[]>(initialComponents)
    const [labels, setLabels] = useState<Label[]>(initialLabels)
    const [search, setSearch] = useState("")

    // Component dialogs
    const [showCreateComponent, setShowCreateComponent] = useState(false)
    const [editingComponent, setEditingComponent] = useState<ProjectComponent | null>(null)
    const [deleteComponentId, setDeleteComponentId] = useState<string | null>(null)
    const [selectedComponent, setSelectedComponent] = useState<ProjectComponent | null>(null)
    const [compForm, setCompForm] = useState({ name: "", description: "", lead: "", defaultAssignee: "" })

    // Label dialogs
    const [showCreateLabel, setShowCreateLabel] = useState(false)
    const [editingLabel, setEditingLabel] = useState<Label | null>(null)
    const [deleteLabelId, setDeleteLabelId] = useState<string | null>(null)
    const [showMergeLabels, setShowMergeLabels] = useState(false)
    const [selectedLabel, setSelectedLabel] = useState<Label | null>(null)
    const [labelForm, setLabelForm] = useState({ name: "", color: "#3b82f6" })
    const [mergeFrom, setMergeFrom] = useState("")
    const [mergeTo, setMergeTo] = useState("")

    const totalIssuesLinked = useMemo(() => components.reduce((s, c) => s + c.issueKeys.length, 0), [components])
    const filteredComponents = useMemo(() => components.filter(c => c.name.toLowerCase().includes(search.toLowerCase())), [components, search])
    const filteredLabels = useMemo(() => labels.filter(l => l.name.toLowerCase().includes(search.toLowerCase())), [labels, search])

    const matchedIssues = useMemo(() => {
        if (selectedComponent) return issues.filter(i => i.labels?.some(l => l.toLowerCase() === selectedComponent.name.toLowerCase()))
        if (selectedLabel) return issues.filter(i => i.labels?.some(l => l.toLowerCase() === selectedLabel.name.toLowerCase()))
        return []
    }, [issues, selectedComponent, selectedLabel])

    // Component CRUD
    const handleCreateComponent = () => {
        if (!compForm.name.trim()) { toast.error("Name is required"); return }
        const nc: ProjectComponent = { id: `c${Date.now()}`, ...compForm, issueKeys: [] }
        setComponents(p => [...p, nc])
        setCompForm({ name: "", description: "", lead: "", defaultAssignee: "" })
        setShowCreateComponent(false)
        toast.success(`Component "${nc.name}" created`)
    }
    const handleEditComponent = () => {
        if (!editingComponent || !compForm.name.trim()) { toast.error("Name is required"); return }
        setComponents(p => p.map(c => c.id === editingComponent.id ? { ...c, ...compForm } : c))
        setEditingComponent(null)
        toast.success("Component updated")
    }
    const handleDeleteComponent = () => {
        if (!deleteComponentId) return
        const name = components.find(c => c.id === deleteComponentId)?.name
        setComponents(p => p.filter(c => c.id !== deleteComponentId))
        setDeleteComponentId(null)
        toast.success(`Component "${name}" deleted`)
    }

    // Label CRUD
    const handleCreateLabel = () => {
        if (!labelForm.name.trim()) { toast.error("Name is required"); return }
        const nl: Label = { id: `l${Date.now()}`, name: labelForm.name, color: labelForm.color, usageCount: 0 }
        setLabels(p => [...p, nl])
        setLabelForm({ name: "", color: "#3b82f6" })
        setShowCreateLabel(false)
        toast.success(`Label "${nl.name}" created`)
    }
    const handleEditLabel = () => {
        if (!editingLabel || !labelForm.name.trim()) { toast.error("Name is required"); return }
        setLabels(p => p.map(l => l.id === editingLabel.id ? { ...l, name: labelForm.name, color: labelForm.color } : l))
        setEditingLabel(null)
        toast.success("Label renamed")
    }
    const handleDeleteLabel = () => {
        if (!deleteLabelId) return
        const name = labels.find(l => l.id === deleteLabelId)?.name
        setLabels(p => p.filter(l => l.id !== deleteLabelId))
        setDeleteLabelId(null)
        toast.success(`Label "${name}" deleted`)
    }
    const handleMergeLabels = () => {
        if (!mergeFrom || !mergeTo || mergeFrom === mergeTo) { toast.error("Select two different labels"); return }
        const fromLabel = labels.find(l => l.id === mergeFrom)
        const toLabel = labels.find(l => l.id === mergeTo)
        if (!fromLabel || !toLabel) return
        setLabels(p => p.filter(l => l.id !== mergeFrom).map(l => l.id === mergeTo ? { ...l, usageCount: l.usageCount + fromLabel.usageCount } : l))
        setShowMergeLabels(false)
        setMergeFrom("")
        setMergeTo("")
        toast.success(`Merged "${fromLabel.name}" into "${toLabel.name}"`)
    }

    return (
        <div className="flex flex-col gap-6 p-6 bg-[#fafafa] min-h-screen">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-zinc-400">PROJECTS</span>
                <ChevronRight className="w-3 h-3 text-zinc-300" />
                <span className="text-[10px] font-medium text-zinc-400">COMPONENTS & LABELS</span>
            </div>

            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Components & Labels</h1>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="components" className="text-xs"><Layers className="w-3.5 h-3.5 mr-1.5" />Components</TabsTrigger>
                    <TabsTrigger value="labels" className="text-xs"><Tag className="w-3.5 h-3.5 mr-1.5" />Labels</TabsTrigger>
                </TabsList>

                {/* ===== COMPONENTS TAB ===== */}
                <TabsContent value="components" className="mt-4 flex flex-col gap-4">
                    {selectedComponent ? (
                        <div className="flex flex-col gap-4">
                            <Button variant="ghost" className="h-8 rounded-md text-xs font-medium px-3 w-fit" onClick={() => setSelectedComponent(null)}>
                                <ChevronRight className="w-3.5 h-3.5 mr-1 rotate-180" />Back to Components
                            </Button>
                            <h2 className="text-lg font-semibold text-zinc-900">{selectedComponent.name} — Linked Issues</h2>
                            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Key</TableHead>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Title</TableHead>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Status</TableHead>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Priority</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {matchedIssues.length === 0 ? (
                                            <TableRow><TableCell colSpan={4} className="text-center text-xs text-zinc-400 py-8">No issues found for this component</TableCell></TableRow>
                                        ) : matchedIssues.map(issue => (
                                            <TableRow key={issue.id}>
                                                <TableCell className="text-xs font-medium text-indigo-600">{issue.id}</TableCell>
                                                <TableCell className="text-xs text-zinc-900">{issue.title}</TableCell>
                                                <TableCell><Badge variant="secondary" className="text-[10px]">{issue.status}</Badge></TableCell>
                                                <TableCell><Badge variant="outline" className="text-[10px]">{issue.priority}</Badge></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <SmallCard><SmallCardHeader><Layers className="w-4 h-4 text-indigo-500" /><span className="text-xs font-medium text-zinc-500">Total Components</span></SmallCardHeader><SmallCardContent><span className="text-xl font-bold text-zinc-900">{components.length}</span></SmallCardContent></SmallCard>
                                <SmallCard><SmallCardHeader><Link2 className="w-4 h-4 text-blue-500" /><span className="text-xs font-medium text-zinc-500">Issues Linked</span></SmallCardHeader><SmallCardContent><span className="text-xl font-bold text-zinc-900">{totalIssuesLinked}</span></SmallCardContent></SmallCard>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1 max-w-xs">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                                    <Input placeholder="Search components..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
                                </div>
                                <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { setCompForm({ name: "", description: "", lead: "", defaultAssignee: "" }); setShowCreateComponent(true) }}>
                                    <Plus className="w-3.5 h-3.5 mr-1" />Create Component
                                </Button>
                            </div>
                            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Name</TableHead>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Description</TableHead>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Lead</TableHead>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Default Assignee</TableHead>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Issues</TableHead>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase w-[60px]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredComponents.length === 0 ? (
                                            <TableRow><TableCell colSpan={6} className="text-center text-xs text-zinc-400 py-8">No components found</TableCell></TableRow>
                                        ) : filteredComponents.map(comp => (
                                            <TableRow key={comp.id} className="cursor-pointer hover:bg-zinc-50" onClick={() => setSelectedComponent(comp)}>
                                                <TableCell className="text-xs font-medium text-zinc-900">{comp.name}</TableCell>
                                                <TableCell className="text-xs text-zinc-500 max-w-[200px] truncate">{comp.description}</TableCell>
                                                <TableCell className="text-xs text-zinc-600">{comp.lead}</TableCell>
                                                <TableCell className="text-xs text-zinc-600">{comp.defaultAssignee}</TableCell>
                                                <TableCell><Badge variant="secondary" className="text-[10px]">{comp.issueKeys.length}</Badge></TableCell>
                                                <TableCell onClick={e => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="w-3.5 h-3.5" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => { setCompForm({ name: comp.name, description: comp.description, lead: comp.lead, defaultAssignee: comp.defaultAssignee }); setEditingComponent(comp) }}><Edit3 className="w-3.5 h-3.5 mr-2" />Edit</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600" onClick={() => setDeleteComponentId(comp.id)}><Trash2 className="w-3.5 h-3.5 mr-2" />Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )}
                </TabsContent>

                {/* ===== LABELS TAB ===== */}
                <TabsContent value="labels" className="mt-4 flex flex-col gap-4">
                    {selectedLabel ? (
                        <div className="flex flex-col gap-4">
                            <Button variant="ghost" className="h-8 rounded-md text-xs font-medium px-3 w-fit" onClick={() => setSelectedLabel(null)}>
                                <ChevronRight className="w-3.5 h-3.5 mr-1 rotate-180" />Back to Labels
                            </Button>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedLabel.color }} />
                                <h2 className="text-lg font-semibold text-zinc-900">{selectedLabel.name} — Issues</h2>
                            </div>
                            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Key</TableHead>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Title</TableHead>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Status</TableHead>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Priority</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {matchedIssues.length === 0 ? (
                                            <TableRow><TableCell colSpan={4} className="text-center text-xs text-zinc-400 py-8">No issues found with this label</TableCell></TableRow>
                                        ) : matchedIssues.map(issue => (
                                            <TableRow key={issue.id}>
                                                <TableCell className="text-xs font-medium text-indigo-600">{issue.id}</TableCell>
                                                <TableCell className="text-xs text-zinc-900">{issue.title}</TableCell>
                                                <TableCell><Badge variant="secondary" className="text-[10px]">{issue.status}</Badge></TableCell>
                                                <TableCell><Badge variant="outline" className="text-[10px]">{issue.priority}</Badge></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Label chips */}
                            <div className="flex flex-wrap gap-2">
                                {labels.map(l => (
                                    <button key={l.id} onClick={() => setSelectedLabel(l)} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white hover:opacity-80 transition-opacity" style={{ backgroundColor: l.color }}>
                                        {l.name} <span className="bg-white/25 rounded-full px-1.5 text-[10px]">{l.usageCount}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1 max-w-xs">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                                    <Input placeholder="Search labels..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
                                </div>
                                <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { setLabelForm({ name: "", color: "#3b82f6" }); setShowCreateLabel(true) }}>
                                    <Plus className="w-3.5 h-3.5 mr-1" />Create Label
                                </Button>
                                <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95" onClick={() => { setMergeFrom(""); setMergeTo(""); setShowMergeLabels(true) }}>
                                    Merge Labels
                                </Button>
                            </div>
                            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Name</TableHead>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Color</TableHead>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Usage Count</TableHead>
                                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase w-[60px]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredLabels.length === 0 ? (
                                            <TableRow><TableCell colSpan={4} className="text-center text-xs text-zinc-400 py-8">No labels found</TableCell></TableRow>
                                        ) : filteredLabels.map(label => (
                                            <TableRow key={label.id} className="cursor-pointer hover:bg-zinc-50" onClick={() => setSelectedLabel(label)}>
                                                <TableCell className="text-xs font-medium text-zinc-900">{label.name}</TableCell>
                                                <TableCell><div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border border-zinc-200" style={{ backgroundColor: label.color }} /><span className="text-[10px] text-zinc-400">{label.color}</span></div></TableCell>
                                                <TableCell><Badge variant="secondary" className="text-[10px]">{label.usageCount}</Badge></TableCell>
                                                <TableCell onClick={e => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="w-3.5 h-3.5" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => { setLabelForm({ name: label.name, color: label.color }); setEditingLabel(label) }}><Edit3 className="w-3.5 h-3.5 mr-2" />Rename</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600" onClick={() => setDeleteLabelId(label.id)}><Trash2 className="w-3.5 h-3.5 mr-2" />Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )}
                </TabsContent>
            </Tabs>

            {/* ===== CREATE COMPONENT DIALOG ===== */}
            <Dialog open={showCreateComponent} onOpenChange={setShowCreateComponent}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900">Create Component</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">Add a new project component to categorize issues.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-2">
                        <div><label className="text-xs font-medium text-zinc-500">Name</label><Input value={compForm.name} onChange={e => setCompForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Authentication" className="mt-1 h-8 text-xs" /></div>
                        <div><label className="text-xs font-medium text-zinc-500">Description</label><Input value={compForm.description} onChange={e => setCompForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description" className="mt-1 h-8 text-xs" /></div>
                        <div><label className="text-xs font-medium text-zinc-500">Lead</label><Input value={compForm.lead} onChange={e => setCompForm(p => ({ ...p, lead: e.target.value }))} placeholder="Team lead name" className="mt-1 h-8 text-xs" /></div>
                        <div><label className="text-xs font-medium text-zinc-500">Default Assignee</label><Input value={compForm.defaultAssignee} onChange={e => setCompForm(p => ({ ...p, defaultAssignee: e.target.value }))} placeholder="Default assignee" className="mt-1 h-8 text-xs" /></div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setShowCreateComponent(false)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleCreateComponent}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ===== EDIT COMPONENT DIALOG ===== */}
            <Dialog open={!!editingComponent} onOpenChange={o => !o && setEditingComponent(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900">Edit Component</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">Update the component details.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-2">
                        <div><label className="text-xs font-medium text-zinc-500">Name</label><Input value={compForm.name} onChange={e => setCompForm(p => ({ ...p, name: e.target.value }))} className="mt-1 h-8 text-xs" /></div>
                        <div><label className="text-xs font-medium text-zinc-500">Description</label><Input value={compForm.description} onChange={e => setCompForm(p => ({ ...p, description: e.target.value }))} className="mt-1 h-8 text-xs" /></div>
                        <div><label className="text-xs font-medium text-zinc-500">Lead</label><Input value={compForm.lead} onChange={e => setCompForm(p => ({ ...p, lead: e.target.value }))} className="mt-1 h-8 text-xs" /></div>
                        <div><label className="text-xs font-medium text-zinc-500">Default Assignee</label><Input value={compForm.defaultAssignee} onChange={e => setCompForm(p => ({ ...p, defaultAssignee: e.target.value }))} className="mt-1 h-8 text-xs" /></div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setEditingComponent(null)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleEditComponent}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ===== DELETE COMPONENT DIALOG ===== */}
            <Dialog open={!!deleteComponentId} onOpenChange={o => !o && setDeleteComponentId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900">Delete Component</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">Are you sure? This will unlink all associated issues. This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setDeleteComponentId(null)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteComponent}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ===== CREATE LABEL DIALOG ===== */}
            <Dialog open={showCreateLabel} onOpenChange={setShowCreateLabel}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900">Create Label</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">Add a new label to categorize issues.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-2">
                        <div><label className="text-xs font-medium text-zinc-500">Name</label><Input value={labelForm.name} onChange={e => setLabelForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. needs-review" className="mt-1 h-8 text-xs" /></div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500">Color</label>
                            <div className="flex items-center gap-2 mt-2">
                                {PRESET_COLORS.map(c => (
                                    <button key={c} onClick={() => setLabelForm(p => ({ ...p, color: c }))} className={`w-7 h-7 rounded-full border-2 transition-all ${labelForm.color === c ? "border-zinc-900 scale-110" : "border-transparent"}`} style={{ backgroundColor: c }} />
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2"><span className="text-xs text-zinc-500">Preview:</span><span className="px-2.5 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: labelForm.color }}>{labelForm.name || "label"}</span></div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setShowCreateLabel(false)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleCreateLabel}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ===== EDIT LABEL DIALOG ===== */}
            <Dialog open={!!editingLabel} onOpenChange={o => !o && setEditingLabel(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900">Rename Label</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">Update the label name and color.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-2">
                        <div><label className="text-xs font-medium text-zinc-500">Name</label><Input value={labelForm.name} onChange={e => setLabelForm(p => ({ ...p, name: e.target.value }))} className="mt-1 h-8 text-xs" /></div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500">Color</label>
                            <div className="flex items-center gap-2 mt-2">
                                {PRESET_COLORS.map(c => (
                                    <button key={c} onClick={() => setLabelForm(p => ({ ...p, color: c }))} className={`w-7 h-7 rounded-full border-2 transition-all ${labelForm.color === c ? "border-zinc-900 scale-110" : "border-transparent"}`} style={{ backgroundColor: c }} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setEditingLabel(null)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleEditLabel}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ===== DELETE LABEL DIALOG ===== */}
            <Dialog open={!!deleteLabelId} onOpenChange={o => !o && setDeleteLabelId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900">Delete Label</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">Are you sure? This label will be removed from all issues. This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setDeleteLabelId(null)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteLabel}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ===== MERGE LABELS DIALOG ===== */}
            <Dialog open={showMergeLabels} onOpenChange={setShowMergeLabels}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900">Merge Labels</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">Merge one label into another. The source label will be deleted and its issues reassigned.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-2">
                        <div>
                            <label className="text-xs font-medium text-zinc-500">From (will be deleted)</label>
                            <Select value={mergeFrom} onValueChange={setMergeFrom}><SelectTrigger className="mt-1 h-8 text-xs"><SelectValue placeholder="Select source label" /></SelectTrigger><SelectContent>{labels.map(l => <SelectItem key={l.id} value={l.id} className="text-xs">{l.name}</SelectItem>)}</SelectContent></Select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500">Into (will be kept)</label>
                            <Select value={mergeTo} onValueChange={setMergeTo}><SelectTrigger className="mt-1 h-8 text-xs"><SelectValue placeholder="Select target label" /></SelectTrigger><SelectContent>{labels.filter(l => l.id !== mergeFrom).map(l => <SelectItem key={l.id} value={l.id} className="text-xs">{l.name}</SelectItem>)}</SelectContent></Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setShowMergeLabels(false)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleMergeLabels}>Merge</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}