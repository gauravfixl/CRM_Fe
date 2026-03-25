"use client"

import { useState, useMemo } from "react"
import {
    Pause, Plus, Search, RefreshCw, Download,
    CheckCircle2, Clock, Zap, Activity,
    ArrowUpRight, ArrowDownRight, Trash2, Edit,
    Filter, GitBranch, Loader2, X, Save
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"
import { toast } from "@/shared/utils/toast"

type Workflow = {
    id: string
    name: string
    trigger: string
    status: string
    runs: number
    successRate: number
    lastRun: string
    category: string
}

const INITIAL_WORKFLOWS: Workflow[] = [
    { id: "WF-001", name: "Client onboarding sequence", trigger: "New client added", status: "Active", runs: 142, successRate: 98.2, lastRun: "2 min ago", category: "Onboarding" },
    { id: "WF-002", name: "Renewal reminder flow", trigger: "Subscription nearing expiry", status: "Active", runs: 89, successRate: 95.6, lastRun: "1 hr ago", category: "Retention" },
    { id: "WF-003", name: "Churn risk alert", trigger: "Health score drops below 40", status: "Active", runs: 34, successRate: 100, lastRun: "4 hr ago", category: "Risk" },
    { id: "WF-004", name: "Invoice follow-up", trigger: "Invoice overdue by 7 days", status: "Paused", runs: 211, successRate: 91.4, lastRun: "1 day ago", category: "Finance" },
    { id: "WF-005", name: "Escalation to account manager", trigger: "Support ticket unresolved > 48h", status: "Active", runs: 56, successRate: 96.4, lastRun: "30 min ago", category: "Support" },
    { id: "WF-006", name: "NPS follow-up survey", trigger: "Contract renewal completed", status: "Paused", runs: 77, successRate: 88.3, lastRun: "3 days ago", category: "Engagement" },
]

const CATEGORY_COLORS: Record<string, string> = {
    Onboarding: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Retention: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Risk: "bg-rose-50 text-rose-600 border-rose-100",
    Finance: "bg-amber-50 text-amber-600 border-amber-100",
    Support: "bg-violet-50 text-violet-600 border-violet-100",
    Engagement: "bg-cyan-50 text-cyan-600 border-cyan-100",
}

export default function WorkflowsPage() {
    const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [filterCategory, setFilterCategory] = useState("all")

    // Create dialog
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newWorkflow, setNewWorkflow] = useState({ name: "", trigger: "", category: "Onboarding" })

    // Edit dialog
    const [editTarget, setEditTarget] = useState<Workflow | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)

    // Delete confirm dialog
    const [deleteTarget, setDeleteTarget] = useState<Workflow | null>(null)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const [isSyncing, setIsSyncing] = useState(false)

    // ── Computed Stats (fully dynamic from workflows state) ──────────────
    const stats = useMemo(() => {
        const active = workflows.filter(w => w.status === "Active").length
        const paused = workflows.filter(w => w.status === "Paused").length
        const totalRuns = workflows.reduce((a, w) => a + w.runs, 0)
        const avgSuccess = workflows.length
            ? (workflows.reduce((a, w) => a + w.successRate, 0) / workflows.length).toFixed(1)
            : "0.0"
        return { active, paused, totalRuns, avgSuccess }
    }, [workflows])

    // ── Filtered list (reactive to search + status + category) ───────────
    const filtered = useMemo(() => {
        return workflows.filter(wf => {
            const matchSearch =
                wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                wf.trigger.toLowerCase().includes(searchQuery.toLowerCase())
            const matchStatus = filterStatus === "all" || wf.status.toLowerCase() === filterStatus
            const matchCategory = filterCategory === "all" || wf.category === filterCategory
            return matchSearch && matchStatus && matchCategory
        })
    }, [workflows, searchQuery, filterStatus, filterCategory])

    // ── CRUD handlers ────────────────────────────────────────────────────

    const handleCreate = () => {
        if (!newWorkflow.name.trim() || !newWorkflow.trigger.trim()) {
            toast.error("Workflow name and trigger condition are required")
            return
        }
        const wf: Workflow = {
            id: `WF-${String(workflows.length + 1).padStart(3, "0")}`,
            name: newWorkflow.name.trim(),
            trigger: newWorkflow.trigger.trim(),
            status: "Active",
            runs: 0,
            successRate: 100,
            lastRun: "Never",
            category: newWorkflow.category,
        }
        setWorkflows(prev => [wf, ...prev])
        setNewWorkflow({ name: "", trigger: "", category: "Onboarding" })
        setIsCreateOpen(false)
        toast.success(`Workflow "${wf.name}" created successfully`)
    }

    const handleEditOpen = (wf: Workflow) => {
        setEditTarget({ ...wf })
        setIsEditOpen(true)
    }

    const handleEditSave = () => {
        if (!editTarget) return
        if (!editTarget.name.trim() || !editTarget.trigger.trim()) {
            toast.error("Name and trigger are required")
            return
        }
        setWorkflows(prev => prev.map(w => w.id === editTarget.id ? { ...editTarget } : w))
        setIsEditOpen(false)
        setEditTarget(null)
        toast.success("Workflow updated successfully")
    }

    const handleDeleteOpen = (wf: Workflow) => {
        setDeleteTarget(wf)
        setIsDeleteOpen(true)
    }

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return
        setWorkflows(prev => prev.filter(w => w.id !== deleteTarget.id))
        setIsDeleteOpen(false)
        setDeleteTarget(null)
        toast.success("Workflow deleted successfully")
    }

    const handleToggle = (id: string, currentStatus: string) => {
        setWorkflows(prev =>
            prev.map(w => w.id === id ? { ...w, status: currentStatus === "Active" ? "Paused" : "Active" } : w)
        )
        toast.success(currentStatus === "Active" ? "Workflow paused" : "Workflow activated")
    }

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(new Promise(r => setTimeout(r, 1500)), {
            loading: "Syncing workflow engine...",
            success: "All workflows synchronized",
            error: "Sync failed",
        })
        setTimeout(() => setIsSyncing(false), 1500)
    }

    const handleExport = () => {
        const csv = [
            ["ID", "Name", "Trigger", "Status", "Category", "Runs", "Success Rate", "Last Run"],
            ...workflows.map(w => [w.id, w.name, w.trigger, w.status, w.category, w.runs, `${w.successRate}%`, w.lastRun]),
        ].map(row => row.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "workflows.csv"
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Workflows exported as CSV")
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">
                        Workflow <span className="text-indigo-600">automation</span>
                    </h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">
                        Design, manage, and monitor automated client workflows
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
                                <Plus className="w-4 h-4" /> New workflow
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[440px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">
                                    Create <span className="text-indigo-600">workflow</span>
                                </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-5 py-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Workflow name *</Label>
                                    <Input value={newWorkflow.name} onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })} placeholder="e.g. Client onboarding sequence" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Trigger condition *</Label>
                                    <Input value={newWorkflow.trigger} onChange={(e) => setNewWorkflow({ ...newWorkflow, trigger: e.target.value })} placeholder="e.g. New client added" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Category</Label>
                                    <Select value={newWorkflow.category} onValueChange={(v) => setNewWorkflow({ ...newWorkflow, category: v })}>
                                        <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {Object.keys(CATEGORY_COLORS).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
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
                    { label: "Active workflows", value: stats.active, icon: Zap, bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-100/50" },
                    { label: "Total runs (all time)", value: stats.totalRuns, icon: Activity, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-100/50" },
                    { label: "Avg success rate", value: `${stats.avgSuccess}%`, icon: CheckCircle2, bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-100/50" },
                    { label: "Paused workflows", value: stats.paused, icon: Pause, bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", iconBg: "bg-amber-100", iconColor: "text-amber-600", border: "border-amber-100/50" },
                ].map((stat, i) => (
                    <Card key={i} className={`${stat.bg} ${stat.border} border shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden`}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${stat.iconBg}`}>
                                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                                </div>
                                <span className="text-[11px] font-semibold text-slate-400 bg-white/70 px-2 py-1 rounded-full border border-slate-100">{workflows.length} total</span>
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
                    <Input placeholder="Search workflows or triggers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-11 bg-white border-slate-200 rounded-xl text-sm font-medium" />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-44 h-11 rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-sm">
                        <Filter className="w-4 h-4 mr-2 text-slate-400" /><SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="active">Active only</SelectItem>
                        <SelectItem value="paused">Paused only</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-44 h-11 rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-sm">
                        <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all">All categories</SelectItem>
                        {Object.keys(CATEGORY_COLORS).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {/* ── Workflow List ── */}
            <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                <CardHeader className="px-8 py-6 border-b border-slate-100">
                    <CardTitle className="text-lg font-semibold text-slate-900">
                        All workflows <span className="text-slate-400 font-medium text-sm ml-2">({filtered.length})</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                        {filtered.map((wf) => (
                            <div key={wf.id} className="px-8 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-slate-50/50 transition-colors group">
                                <div className="flex items-start gap-5 flex-1">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${(CATEGORY_COLORS[wf.category] || "bg-slate-50 text-slate-400").split(" ").slice(0, 2).join(" ")}`}>
                                        <GitBranch className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{wf.name}</h4>
                                            <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[wf.category] || "bg-slate-100 text-slate-500"}`}>{wf.category}</Badge>
                                            <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 ${wf.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{wf.status}</Badge>
                                        </div>
                                        <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                                            <Zap className="w-3 h-3" /> Trigger: {wf.trigger}
                                        </p>
                                        <div className="flex items-center gap-6 text-[11px] text-slate-400 font-medium">
                                            <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {wf.runs} runs</span>
                                            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> {wf.successRate}% success</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Last run: {wf.lastRun}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="flex items-center gap-2 border border-slate-100 rounded-xl px-3 py-2 bg-white shadow-sm">
                                        <Switch checked={wf.status === "Active"} onCheckedChange={() => handleToggle(wf.id, wf.status)} className="data-[state=checked]:bg-indigo-600 scale-90" />
                                        <span className="text-[10px] font-semibold text-slate-400">{wf.status}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl" onClick={() => handleEditOpen(wf)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl" onClick={() => handleDeleteOpen(wf)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && (
                            <div className="px-8 py-16 text-center">
                                <GitBranch className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-400 font-medium">No workflows found matching your criteria.</p>
                                <Button variant="ghost" className="mt-3 text-indigo-600 font-semibold text-sm" onClick={() => { setSearchQuery(""); setFilterStatus("all"); setFilterCategory("all") }}>Clear filters</Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* ── Edit Dialog ── */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[440px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">
                            Edit <span className="text-indigo-600">workflow</span>
                        </DialogTitle>
                    </DialogHeader>
                    {editTarget && (
                        <div className="grid gap-5 py-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">Workflow name *</Label>
                                <Input value={editTarget.name} onChange={(e) => setEditTarget({ ...editTarget, name: e.target.value })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">Trigger condition *</Label>
                                <Input value={editTarget.trigger} onChange={(e) => setEditTarget({ ...editTarget, trigger: e.target.value })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Category</Label>
                                    <Select value={editTarget.category} onValueChange={(v) => setEditTarget({ ...editTarget, category: v })}>
                                        <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {Object.keys(CATEGORY_COLORS).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Status</Label>
                                    <Select value={editTarget.status} onValueChange={(v) => setEditTarget({ ...editTarget, status: v })}>
                                        <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Paused">Paused</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" className="rounded-xl font-semibold gap-2" onClick={() => { setIsEditOpen(false); setEditTarget(null) }}><X className="w-4 h-4" />Cancel</Button>
                        <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold px-8 text-white gap-2" onClick={handleEditSave}><Save className="w-4 h-4" />Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Delete Confirm Dialog ── */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-slate-900">Delete workflow</DialogTitle>
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
