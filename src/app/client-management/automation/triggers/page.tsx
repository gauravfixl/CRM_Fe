"use client"

import { useState, useMemo } from "react"
import {
    Plus, Search, RefreshCw, Download, Zap,
    CheckCircle2, Clock, Activity,
    Trash2, Edit, ArrowUpRight, ArrowDownRight,
    Loader2, MousePointer, ToggleLeft, AlertCircle,
    ChevronRight, Mail, MessageSquare, Database,
    X, Save
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

type Trigger = {
    id: string
    name: string
    type: string
    event: string
    action: string
    enabled: boolean
    fires: number
    lastFired: string
    category: string
}

type ActionItem = {
    id: string
    name: string
    description: string
    icon: React.ElementType
    category: string
    uses: number
}

const INITIAL_TRIGGERS: Trigger[] = [
    { id: "TR-001", name: "New client created", type: "Event", event: "Client added to system", action: "Send welcome email", enabled: true, fires: 142, lastFired: "2 min ago", category: "Client" },
    { id: "TR-002", name: "Health score drops", type: "Threshold", event: "Health score < 40", action: "Alert account manager", enabled: true, fires: 34, lastFired: "4 hr ago", category: "Risk" },
    { id: "TR-003", name: "Invoice 7 days overdue", type: "Schedule", event: "Invoice due date + 7 days", action: "Send reminder + escalate", enabled: true, fires: 89, lastFired: "1 day ago", category: "Finance" },
    { id: "TR-004", name: "Support ticket unresolved", type: "Threshold", event: "Ticket open for 48+ hours", action: "Escalate to manager", enabled: true, fires: 22, lastFired: "30 min ago", category: "Support" },
    { id: "TR-005", name: "Renewal 30 days before", type: "Schedule", event: "Renewal date - 30 days", action: "Initiate renewal workflow", enabled: false, fires: 67, lastFired: "3 days ago", category: "Retention" },
    { id: "TR-006", name: "NPS score submitted", type: "Event", event: "Client submits NPS survey", action: "Create follow-up task", enabled: true, fires: 55, lastFired: "2 hr ago", category: "Engagement" },
]

const INITIAL_ACTIONS: ActionItem[] = [
    { id: "ACT-001", name: "Send email", description: "Dispatch a templated email to client or team", icon: Mail, category: "Communication", uses: 284 },
    { id: "ACT-002", name: "Create task", description: "Assign a follow-up task to a team member", icon: CheckCircle2, category: "Task", uses: 192 },
    { id: "ACT-003", name: "Update field", description: "Automatically update a data field in the record", icon: Database, category: "Data", uses: 156 },
    { id: "ACT-004", name: "Send in-app notification", description: "Push a real-time alert inside the platform", icon: AlertCircle, category: "Notification", uses: 311 },
    { id: "ACT-005", name: "Trigger webhook", description: "Fire an outbound webhook to an external system", icon: Zap, category: "Integration", uses: 98 },
    { id: "ACT-006", name: "Send SMS", description: "Send an SMS to the client or assigned rep", icon: MessageSquare, category: "Communication", uses: 74 },
]

const TYPE_COLORS: Record<string, string> = {
    Event: "bg-indigo-50 text-indigo-600",
    Threshold: "bg-rose-50 text-rose-600",
    Schedule: "bg-emerald-50 text-emerald-600",
}

const CATEGORY_COLORS: Record<string, string> = {
    Client: "bg-indigo-50 text-indigo-600",
    Risk: "bg-rose-50 text-rose-600",
    Finance: "bg-amber-50 text-amber-600",
    Support: "bg-violet-50 text-violet-600",
    Retention: "bg-emerald-50 text-emerald-600",
    Engagement: "bg-cyan-50 text-cyan-600",
}

const TRIGGER_TYPES = ["Event", "Threshold", "Schedule"]
const CATEGORIES = Object.keys(CATEGORY_COLORS)

export default function TriggersActionsPage() {
    const [triggers, setTriggers] = useState<Trigger[]>(INITIAL_TRIGGERS)
    const [actions] = useState<ActionItem[]>(INITIAL_ACTIONS)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterType, setFilterType] = useState("all")
    const [filterCategory, setFilterCategory] = useState("all")
    const [activeTab, setActiveTab] = useState<"triggers" | "actions">("triggers")

    // Create
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newTrigger, setNewTrigger] = useState({ name: "", type: "Event", event: "", action: "", category: "Client" })

    // Edit
    const [editTarget, setEditTarget] = useState<Trigger | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)

    // Delete
    const [deleteTarget, setDeleteTarget] = useState<Trigger | null>(null)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const [isSyncing, setIsSyncing] = useState(false)

    // ── Dynamic Stats ────────────────────────────────────────────────────
    const stats = useMemo(() => ({
        active: triggers.filter(t => t.enabled).length,
        totalFires: triggers.reduce((a, t) => a + t.fires, 0),
        actionTypes: actions.length,
        disabled: triggers.filter(t => !t.enabled).length,
    }), [triggers, actions])

    // ── Filtered list ────────────────────────────────────────────────────
    const filtered = useMemo(() => {
        return triggers.filter(t => {
            const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.action.toLowerCase().includes(searchQuery.toLowerCase())
            const matchType = filterType === "all" || t.type === filterType
            const matchCategory = filterCategory === "all" || t.category === filterCategory
            return matchSearch && matchType && matchCategory
        })
    }, [triggers, searchQuery, filterType, filterCategory])

    // ── CRUD ─────────────────────────────────────────────────────────────

    const handleCreate = () => {
        if (!newTrigger.name.trim() || !newTrigger.event.trim() || !newTrigger.action.trim()) {
            toast.error("Name, event, and action are required")
            return
        }
        const t: Trigger = {
            id: `TR-${String(triggers.length + 1).padStart(3, "0")}`,
            name: newTrigger.name.trim(),
            type: newTrigger.type,
            event: newTrigger.event.trim(),
            action: newTrigger.action.trim(),
            enabled: true,
            fires: 0,
            lastFired: "Never",
            category: newTrigger.category,
        }
        setTriggers(prev => [t, ...prev])
        setNewTrigger({ name: "", type: "Event", event: "", action: "", category: "Client" })
        setIsCreateOpen(false)
        toast.success(`Trigger "${t.name}" created successfully`)
    }

    const handleEditOpen = (t: Trigger) => {
        setEditTarget({ ...t })
        setIsEditOpen(true)
    }

    const handleEditSave = () => {
        if (!editTarget) return
        if (!editTarget.name.trim() || !editTarget.event.trim() || !editTarget.action.trim()) {
            toast.error("All fields are required")
            return
        }
        setTriggers(prev => prev.map(t => t.id === editTarget.id ? { ...editTarget } : t))
        setIsEditOpen(false)
        setEditTarget(null)
        toast.success("Trigger updated successfully")
    }

    const handleDeleteOpen = (t: Trigger) => {
        setDeleteTarget(t)
        setIsDeleteOpen(true)
    }

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return
        setTriggers(prev => prev.filter(t => t.id !== deleteTarget.id))
        setIsDeleteOpen(false)
        setDeleteTarget(null)
        toast.success("Trigger deleted successfully")
    }

    const handleToggle = (id: string, current: boolean) => {
        setTriggers(prev => prev.map(t => t.id === id ? { ...t, enabled: !current } : t))
        toast.success(current ? "Trigger disabled" : "Trigger enabled")
    }

    const handleUseAction = (act: ActionItem) => {
        toast.success(`Action "${act.name}" added to your workflow`)
    }

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(new Promise(r => setTimeout(r, 1500)), {
            loading: "Syncing trigger engine...",
            success: "All triggers synchronized",
            error: "Sync failed",
        })
        setTimeout(() => setIsSyncing(false), 1500)
    }

    const handleExport = () => {
        const csv = [
            ["ID", "Name", "Type", "Event", "Action", "Category", "Enabled", "Fires", "Last Fired"],
            ...triggers.map(t => [t.id, t.name, t.type, t.event, t.action, t.category, t.enabled, t.fires, t.lastFired]),
        ].map(row => row.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "triggers.csv"
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Triggers exported as CSV")
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">
                        Triggers <span className="text-indigo-600">&amp; actions</span>
                    </h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">
                        Configure event-driven triggers and automate response actions
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
                                <Plus className="w-4 h-4" /> New trigger
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[480px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">
                                    Create <span className="text-indigo-600">trigger</span>
                                </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-5 py-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Trigger name *</Label>
                                    <Input value={newTrigger.name} onChange={(e) => setNewTrigger({ ...newTrigger, name: e.target.value })} placeholder="e.g. Health score drops below 40" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700">Trigger type</Label>
                                        <Select value={newTrigger.type} onValueChange={(v) => setNewTrigger({ ...newTrigger, type: v })}>
                                            <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                {TRIGGER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700">Category</Label>
                                        <Select value={newTrigger.category} onValueChange={(v) => setNewTrigger({ ...newTrigger, category: v })}>
                                            <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">When this event occurs *</Label>
                                    <Input value={newTrigger.event} onChange={(e) => setNewTrigger({ ...newTrigger, event: e.target.value })} placeholder="e.g. Client health score drops below 40" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Then perform this action *</Label>
                                    <Input value={newTrigger.action} onChange={(e) => setNewTrigger({ ...newTrigger, action: e.target.value })} placeholder="e.g. Alert account manager" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" />
                                </div>
                            </div>
                            <DialogFooter className="gap-2">
                                <Button variant="ghost" className="rounded-xl font-semibold" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold px-8 text-white" onClick={handleCreate}>Create trigger</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* ── Stats Cards (dynamic) ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: "Active triggers", value: stats.active, icon: Zap, bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-100/50" },
                    { label: "Total fires (all time)", value: stats.totalFires, icon: Activity, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-100/50" },
                    { label: "Action types available", value: stats.actionTypes, icon: MousePointer, bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-100/50" },
                    { label: "Disabled triggers", value: stats.disabled, icon: ToggleLeft, bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", iconBg: "bg-amber-100", iconColor: "text-amber-600", border: "border-amber-100/50" },
                ].map((stat, i) => (
                    <Card key={i} className={`${stat.bg} ${stat.border} border shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden`}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${stat.iconBg}`}>
                                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                                </div>
                                <span className="text-[11px] font-semibold text-slate-400 bg-white/70 px-2 py-1 rounded-full border border-slate-100">{triggers.length} total</span>
                            </div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">{stat.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ── Tab Switcher ── */}
            <div className="flex gap-2 bg-white border border-slate-200 p-1 rounded-xl w-fit shadow-sm">
                {(["triggers", "actions"] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize ${activeTab === tab ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                        {tab === "triggers" ? "Triggers" : "Action library"}
                    </button>
                ))}
            </div>

            {/* ── TRIGGERS TAB ── */}
            {activeTab === "triggers" && (
                <>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
                            <Input placeholder="Search triggers, events, or actions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-11 bg-white border-slate-200 rounded-xl text-sm font-medium" />
                        </div>
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-40 h-11 rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-sm"><SelectValue placeholder="All types" /></SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">All types</SelectItem>
                                {TRIGGER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="w-44 h-11 rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-sm"><SelectValue placeholder="All categories" /></SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">All categories</SelectItem>
                                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                        <CardHeader className="px-8 py-6 border-b border-slate-100">
                            <CardTitle className="text-lg font-semibold text-slate-900">
                                Configured triggers <span className="text-slate-400 font-medium text-sm ml-2">({filtered.length})</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {filtered.map((t) => (
                                    <div key={t.id} className="px-8 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-slate-50/50 transition-colors group">
                                        <div className="flex items-start gap-5 flex-1">
                                            <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${TYPE_COLORS[t.type] || "bg-slate-50 text-slate-400"}`}>
                                                <Zap className="w-5 h-5" />
                                            </div>
                                            <div className="space-y-1.5 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{t.name}</h4>
                                                    <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 ${TYPE_COLORS[t.type]}`}>{t.type}</Badge>
                                                    <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 ${CATEGORY_COLORS[t.category]}`}>{t.category}</Badge>
                                                </div>
                                                <p className="text-xs font-medium text-slate-400">
                                                    <span className="text-slate-300">When:</span> {t.event}
                                                </p>
                                                <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                                    <ChevronRight className="w-3 h-3" />
                                                    <span className="text-slate-300">Then:</span> {t.action}
                                                </p>
                                                <div className="flex items-center gap-6 text-[11px] text-slate-400 font-medium pt-1">
                                                    <span>{t.fires} fires</span>
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {t.lastFired}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="flex items-center gap-2 border border-slate-100 rounded-xl px-3 py-2 bg-white shadow-sm">
                                                <Switch checked={t.enabled} onCheckedChange={() => handleToggle(t.id, t.enabled)} className="data-[state=checked]:bg-indigo-600 scale-90" />
                                                <span className="text-[10px] font-semibold text-slate-400">{t.enabled ? "Active" : "Off"}</span>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl" onClick={() => handleEditOpen(t)}><Edit className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl" onClick={() => handleDeleteOpen(t)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                ))}
                                {filtered.length === 0 && (
                                    <div className="px-8 py-16 text-center">
                                        <Zap className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                        <p className="text-slate-400 font-medium">No triggers match your current filters.</p>
                                        <Button variant="ghost" className="mt-3 text-indigo-600 font-semibold text-sm" onClick={() => { setSearchQuery(""); setFilterType("all"); setFilterCategory("all") }}>Clear filters</Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}

            {/* ── ACTIONS TAB ── */}
            {activeTab === "actions" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {actions.map((act) => (
                        <Card key={act.id} className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white p-7 space-y-5 hover:shadow-2xl transition-all group">
                            <div className="flex items-start justify-between">
                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                                    <act.icon className="w-6 h-6 text-indigo-600" />
                                </div>
                                <Badge className="bg-slate-100 text-slate-500 font-semibold text-[10px] border-0">{act.category}</Badge>
                            </div>
                            <div className="space-y-1.5">
                                <h4 className="text-md font-semibold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{act.name}</h4>
                                <p className="text-[12px] font-medium text-slate-400 leading-relaxed">{act.description}</p>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                <p className="text-[11px] font-medium text-slate-400">{act.uses} uses in workflows</p>
                                <Button variant="ghost" size="sm" className="text-indigo-600 font-semibold text-xs h-8 hover:bg-indigo-50 rounded-xl" onClick={() => handleUseAction(act)}>
                                    Use action
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* ── Edit Dialog ── */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[480px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">
                            Edit <span className="text-indigo-600">trigger</span>
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
                                    <Label className="text-sm font-semibold text-slate-700">Type</Label>
                                    <Select value={editTarget.type} onValueChange={(v) => setEditTarget({ ...editTarget, type: v })}>
                                        <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {TRIGGER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Category</Label>
                                    <Select value={editTarget.category} onValueChange={(v) => setEditTarget({ ...editTarget, category: v })}>
                                        <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">When this event occurs *</Label>
                                <Input value={editTarget.event} onChange={(e) => setEditTarget({ ...editTarget, event: e.target.value })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">Then perform this action *</Label>
                                <Input value={editTarget.action} onChange={(e) => setEditTarget({ ...editTarget, action: e.target.value })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" />
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
                        <DialogTitle className="text-xl font-semibold text-slate-900">Delete trigger</DialogTitle>
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
