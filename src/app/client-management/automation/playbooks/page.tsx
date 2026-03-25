"use client"

import { useState, useMemo } from "react"
import {
    Plus, Search, RefreshCw, Download, BookOpen,
    CheckCircle2, Clock, Target,
    Trash2, Edit, ArrowUpRight, Loader2, Play,
    ArrowDownRight, X, Save, Users
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { toast } from "@/shared/utils/toast"

type Playbook = {
    id: string
    name: string
    stage: string
    steps: number
    completionRate: number
    assignedTo: string
    status: string
    lastUsed: string
    category: string
}

const INITIAL_PLAYBOOKS: Playbook[] = [
    { id: "PB-001", name: "New client onboarding", stage: "Onboarding", steps: 8, completionRate: 92, assignedTo: "Account team", status: "Active", lastUsed: "Today", category: "Onboarding" },
    { id: "PB-002", name: "Churn prevention protocol", stage: "Retention", steps: 5, completionRate: 78, assignedTo: "CSM team", status: "Active", lastUsed: "Yesterday", category: "Retention" },
    { id: "PB-003", name: "Upsell motion - enterprise", stage: "Expansion", steps: 6, completionRate: 65, assignedTo: "Sales team", status: "Active", lastUsed: "2 days ago", category: "Sales" },
    { id: "PB-004", name: "Executive business review", stage: "Engagement", steps: 4, completionRate: 88, assignedTo: "Account team", status: "Active", lastUsed: "1 week ago", category: "Engagement" },
    { id: "PB-005", name: "Contract renewal workflow", stage: "Renewal", steps: 7, completionRate: 0, assignedTo: "Finance & CSM", status: "Draft", lastUsed: "Never", category: "Finance" },
    { id: "PB-006", name: "Crisis escalation response", stage: "Support", steps: 3, completionRate: 100, assignedTo: "Support team", status: "Active", lastUsed: "3 days ago", category: "Support" },
]

const CATEGORY_COLORS: Record<string, string> = {
    Onboarding: "bg-indigo-50 text-indigo-600",
    Retention: "bg-emerald-50 text-emerald-600",
    Sales: "bg-violet-50 text-violet-600",
    Engagement: "bg-cyan-50 text-cyan-600",
    Finance: "bg-amber-50 text-amber-600",
    Support: "bg-rose-50 text-rose-600",
}

const STAGES = ["Onboarding", "Retention", "Expansion", "Engagement", "Renewal", "Support"]

export default function PlaybooksPage() {
    const [playbooks, setPlaybooks] = useState<Playbook[]>(INITIAL_PLAYBOOKS)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [filterStage, setFilterStage] = useState("all")

    // Create
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newPlaybook, setNewPlaybook] = useState({ name: "", stage: "Onboarding", assignedTo: "", category: "Onboarding" })

    // Edit
    const [editTarget, setEditTarget] = useState<Playbook | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)

    // View detail
    const [viewTarget, setViewTarget] = useState<Playbook | null>(null)
    const [isViewOpen, setIsViewOpen] = useState(false)

    // Delete
    const [deleteTarget, setDeleteTarget] = useState<Playbook | null>(null)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const [isSyncing, setIsSyncing] = useState(false)

    // ── Dynamic Stats ────────────────────────────────────────────────────
    const stats = useMemo(() => {
        const active = playbooks.filter(p => p.status === "Active").length
        const draft = playbooks.filter(p => p.status === "Draft").length
        const totalSteps = playbooks.reduce((a, p) => a + p.steps, 0)
        const avgCompletion = playbooks.length
            ? Math.round(playbooks.reduce((a, p) => a + p.completionRate, 0) / playbooks.length)
            : 0
        return { active, draft, totalSteps, avgCompletion }
    }, [playbooks])

    // ── Filtered list ────────────────────────────────────────────────────
    const filtered = useMemo(() => {
        return playbooks.filter(pb => {
            const matchSearch = pb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pb.stage.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pb.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
            const matchStatus = filterStatus === "all" || pb.status.toLowerCase() === filterStatus
            const matchStage = filterStage === "all" || pb.stage === filterStage
            return matchSearch && matchStatus && matchStage
        })
    }, [playbooks, searchQuery, filterStatus, filterStage])

    // ── CRUD ─────────────────────────────────────────────────────────────

    const handleCreate = () => {
        if (!newPlaybook.name.trim()) {
            toast.error("Playbook name is required")
            return
        }
        const pb: Playbook = {
            id: `PB-${String(playbooks.length + 1).padStart(3, "0")}`,
            name: newPlaybook.name.trim(),
            stage: newPlaybook.stage,
            steps: 1,
            completionRate: 0,
            assignedTo: newPlaybook.assignedTo.trim() || "Unassigned",
            status: "Draft",
            lastUsed: "Never",
            category: newPlaybook.category,
        }
        setPlaybooks(prev => [pb, ...prev])
        setNewPlaybook({ name: "", stage: "Onboarding", assignedTo: "", category: "Onboarding" })
        setIsCreateOpen(false)
        toast.success(`Playbook "${pb.name}" created successfully`)
    }

    const handleEditOpen = (pb: Playbook) => {
        setEditTarget({ ...pb })
        setIsEditOpen(true)
    }

    const handleEditSave = () => {
        if (!editTarget) return
        if (!editTarget.name.trim()) {
            toast.error("Name is required")
            return
        }
        setPlaybooks(prev => prev.map(p => p.id === editTarget.id ? { ...editTarget } : p))
        setIsEditOpen(false)
        setEditTarget(null)
        toast.success("Playbook updated successfully")
    }

    const handleDeleteOpen = (pb: Playbook) => {
        setDeleteTarget(pb)
        setIsDeleteOpen(true)
    }

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return
        setPlaybooks(prev => prev.filter(p => p.id !== deleteTarget.id))
        setIsDeleteOpen(false)
        setDeleteTarget(null)
        toast.success("Playbook deleted successfully")
    }

    const handleLaunch = (pb: Playbook) => {
        // Update lastUsed and mark as Active
        setPlaybooks(prev => prev.map(p => p.id === pb.id ? { ...p, status: "Active", lastUsed: "Just now" } : p))
        setIsViewOpen(false)
        toast.success(`Playbook "${pb.name}" launched successfully`)
    }

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(new Promise(r => setTimeout(r, 1500)), {
            loading: "Syncing playbooks...",
            success: "All playbooks synchronized",
            error: "Sync failed",
        })
        setTimeout(() => setIsSyncing(false), 1500)
    }

    const handleExport = () => {
        const csv = [
            ["ID", "Name", "Stage", "Steps", "Completion %", "Assigned To", "Status", "Last Used"],
            ...playbooks.map(p => [p.id, p.name, p.stage, p.steps, `${p.completionRate}%`, p.assignedTo, p.status, p.lastUsed]),
        ].map(row => row.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "playbooks.csv"
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Playbooks exported as CSV")
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">
                        Playbook <span className="text-indigo-600">library</span>
                    </h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">
                        Structured playbooks to standardize client engagement motions
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleSync}>
                        {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 text-slate-400" />}
                        {isSyncing ? "Syncing" : "Sync"}
                    </Button>
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleExport}>
                        <Download className="w-4 h-4 text-slate-400" /> Export
                    </Button>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm gap-2">
                                <Plus className="w-4 h-4" /> New playbook
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[440px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">
                                    Create <span className="text-indigo-600">playbook</span>
                                </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-5 py-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Playbook name *</Label>
                                    <Input value={newPlaybook.name} onChange={(e) => setNewPlaybook({ ...newPlaybook, name: e.target.value })} placeholder="e.g. Client onboarding flow" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700">Stage</Label>
                                        <Select value={newPlaybook.stage} onValueChange={(v) => setNewPlaybook({ ...newPlaybook, stage: v, category: v })}>
                                            <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                {STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700">Assigned team</Label>
                                        <Input value={newPlaybook.assignedTo} onChange={(e) => setNewPlaybook({ ...newPlaybook, assignedTo: e.target.value })} placeholder="e.g. Account team" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="gap-2">
                                <Button variant="ghost" className="rounded-xl font-semibold" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold px-8 text-white" onClick={handleCreate}>Create</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* ── Stats Cards (dynamic) ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: "Active playbooks", value: stats.active, icon: BookOpen, bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-100/50" },
                    { label: "Avg completion rate", value: `${stats.avgCompletion}%`, icon: Target, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-100/50" },
                    { label: "Total steps defined", value: stats.totalSteps, icon: CheckCircle2, bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-100/50" },
                    { label: "Drafts pending", value: stats.draft, icon: Clock, bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", iconBg: "bg-amber-100", iconColor: "text-amber-600", border: "border-amber-100/50" },
                ].map((stat, i) => (
                    <Card key={i} className={`${stat.bg} ${stat.border} border shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden`}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${stat.iconBg}`}>
                                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                                </div>
                                <span className="text-[11px] font-semibold text-slate-400 bg-white/70 px-2 py-1 rounded-full border border-slate-100">{playbooks.length} total</span>
                            </div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">{stat.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ── Filters ── */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
                    <Input placeholder="Search playbooks, stages, or teams..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-11 bg-white border-slate-200 rounded-xl text-sm font-medium" />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40 h-11 rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-sm"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="active">Active only</SelectItem>
                        <SelectItem value="draft">Drafts only</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={filterStage} onValueChange={setFilterStage}>
                    <SelectTrigger className="w-44 h-11 rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-sm"><SelectValue placeholder="All stages" /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all">All stages</SelectItem>
                        {STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {/* ── Playbook Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((pb) => (
                    <Card key={pb.id} className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white p-7 space-y-5 hover:shadow-2xl transition-all group">
                        <div className="flex items-start justify-between">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${CATEGORY_COLORS[pb.category] || "bg-slate-50 text-slate-400"}`}>
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <Badge className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border-0 ${pb.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{pb.status}</Badge>
                        </div>
                        <div className="space-y-1.5">
                            <h4 className="text-md font-semibold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{pb.name}</h4>
                            <p className="text-[11px] font-medium text-slate-400 flex items-center gap-2">
                                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{pb.stage}</span>
                                <span>{pb.steps} steps</span>
                                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{pb.assignedTo}</span>
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <p className="text-[11px] font-medium text-slate-400">Completion rate</p>
                                <p className="text-sm font-semibold text-slate-900">{pb.completionRate}%</p>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${pb.completionRate}%` }} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                            <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {pb.lastUsed === "Never" ? "Not yet launched" : `Last: ${pb.lastUsed}`}
                            </p>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl" title="Launch" onClick={() => { setViewTarget(pb); setIsViewOpen(true) }}>
                                    <Play className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl" title="Edit" onClick={() => handleEditOpen(pb)}>
                                    <Edit className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl" title="Delete" onClick={() => handleDeleteOpen(pb)}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-3 py-16 text-center">
                        <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 font-medium">No playbooks found matching your criteria.</p>
                        <Button variant="ghost" className="mt-3 text-indigo-600 font-semibold text-sm" onClick={() => { setSearchQuery(""); setFilterStatus("all"); setFilterStage("all") }}>Clear filters</Button>
                    </div>
                )}
            </div>

            {/* ── View / Launch Dialog ── */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="sm:max-w-[480px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">
                            Playbook <span className="text-indigo-600">detail</span>
                        </DialogTitle>
                    </DialogHeader>
                    {viewTarget && (
                        <div className="space-y-6 py-4">
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                <h4 className="text-lg font-semibold text-slate-900">{viewTarget.name}</h4>
                                <p className="text-sm font-medium text-slate-400">{viewTarget.stage} · {viewTarget.assignedTo}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                {[
                                    { label: "Total steps", value: viewTarget.steps },
                                    { label: "Completion rate", value: `${viewTarget.completionRate}%` },
                                    { label: "Status", value: viewTarget.status },
                                    { label: "Last used", value: viewTarget.lastUsed },
                                ].map((item, i) => (
                                    <div key={i} className="space-y-1">
                                        <p className="text-xs font-semibold text-slate-400">{item.label}</p>
                                        <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-slate-400">Progress</p>
                                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${viewTarget.completionRate}%` }} />
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" className="rounded-xl font-semibold" onClick={() => setIsViewOpen(false)}>Close</Button>
                        <Button className="w-full sm:w-auto h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2" onClick={() => viewTarget && handleLaunch(viewTarget)}>
                            <Play className="w-4 h-4" /> Launch playbook
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Edit Dialog ── */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[440px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">
                            Edit <span className="text-indigo-600">playbook</span>
                        </DialogTitle>
                    </DialogHeader>
                    {editTarget && (
                        <div className="grid gap-5 py-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">Name *</Label>
                                <Input value={editTarget.name} onChange={(e) => setEditTarget({ ...editTarget, name: e.target.value })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Stage</Label>
                                    <Select value={editTarget.stage} onValueChange={(v) => setEditTarget({ ...editTarget, stage: v, category: v })}>
                                        <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Status</Label>
                                    <Select value={editTarget.status} onValueChange={(v) => setEditTarget({ ...editTarget, status: v })}>
                                        <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Draft">Draft</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">Assigned team</Label>
                                <Input value={editTarget.assignedTo} onChange={(e) => setEditTarget({ ...editTarget, assignedTo: e.target.value })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">Number of steps</Label>
                                <Input type="number" min={1} value={editTarget.steps} onChange={(e) => setEditTarget({ ...editTarget, steps: Number(e.target.value) })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" />
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" className="rounded-xl font-semibold gap-2" onClick={() => { setIsEditOpen(false); setEditTarget(null) }}><X className="w-4 h-4" />Cancel</Button>
                        <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold px-8 text-white gap-2" onClick={handleEditSave}><Save className="w-4 h-4" />Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Delete Confirm ── */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-slate-900">Delete playbook</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm font-medium text-slate-500">Are you sure you want to delete <span className="text-slate-900 font-semibold">"{deleteTarget?.name}"</span>? This action cannot be undone.</p>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" className="rounded-xl font-semibold" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button className="rounded-xl bg-rose-600 hover:bg-rose-700 font-semibold px-6 text-white gap-2" onClick={handleDeleteConfirm}><Trash2 className="w-4 h-4" />Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
