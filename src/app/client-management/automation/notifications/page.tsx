"use client"

import { useState, useMemo } from "react"
import {
    Plus, Search, RefreshCw, Download, Bell,
    CheckCircle2, Clock, Activity,
    Trash2, Edit,
    Loader2, Mail, MessageSquare, Smartphone,
    Volume2, Users, AlertCircle, X, Save
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

type NotificationRule = {
    id: string
    name: string
    trigger: string
    channel: string
    audience: string
    priority: string
    enabled: boolean
    sent: number
    openRate: number
    lastSent: string
}

const CHANNEL_ICONS: Record<string, React.ElementType> = {
    Email: Mail,
    SMS: MessageSquare,
    "In-app": Smartphone,
    Slack: Volume2,
    Push: Bell,
}

const INITIAL_RULES: NotificationRule[] = [
    { id: "NR-001", name: "Welcome email on signup", trigger: "New client onboarded", channel: "Email", audience: "Client", priority: "High", enabled: true, sent: 142, openRate: 68, lastSent: "2 min ago" },
    { id: "NR-002", name: "Health score alert to CSM", trigger: "Health score drops below 40", channel: "In-app", audience: "Account manager", priority: "Critical", enabled: true, sent: 34, openRate: 100, lastSent: "4 hr ago" },
    { id: "NR-003", name: "Invoice overdue reminder", trigger: "Invoice 7 days overdue", channel: "Email", audience: "Client & finance", priority: "High", enabled: true, sent: 89, openRate: 55, lastSent: "1 day ago" },
    { id: "NR-004", name: "Renewal upcoming Slack alert", trigger: "30 days before renewal", channel: "Slack", audience: "Account team", priority: "Medium", enabled: true, sent: 67, openRate: 90, lastSent: "3 days ago" },
    { id: "NR-005", name: "Ticket unresolved escalation", trigger: "Ticket open > 48 hours", channel: "In-app", audience: "Support lead", priority: "Critical", enabled: false, sent: 22, openRate: 100, lastSent: "30 min ago" },
    { id: "NR-006", name: "NPS survey completion SMS", trigger: "Contract renewal done", channel: "SMS", audience: "Client", priority: "Low", enabled: true, sent: 55, openRate: 45, lastSent: "2 hr ago" },
]

const PRIORITY_COLORS: Record<string, string> = {
    Critical: "bg-rose-50 text-rose-600 border-rose-100",
    High: "bg-amber-50 text-amber-600 border-amber-100",
    Medium: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Low: "bg-slate-50 text-slate-500 border-slate-100",
}

const CHANNEL_COLORS: Record<string, string> = {
    Email: "bg-indigo-50 text-indigo-600",
    SMS: "bg-emerald-50 text-emerald-600",
    "In-app": "bg-violet-50 text-violet-600",
    Slack: "bg-amber-50 text-amber-600",
    Push: "bg-cyan-50 text-cyan-600",
}

const PRIORITIES = ["Critical", "High", "Medium", "Low"]
const CHANNELS = Object.keys(CHANNEL_ICONS)

export default function NotificationRulesPage() {
    const [rules, setRules] = useState<NotificationRule[]>(INITIAL_RULES)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterChannel, setFilterChannel] = useState("all")
    const [filterPriority, setFilterPriority] = useState("all")

    // Create
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newRule, setNewRule] = useState({ name: "", trigger: "", channel: "Email", audience: "", priority: "Medium" })

    // Edit
    const [editTarget, setEditTarget] = useState<NotificationRule | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)

    // Delete
    const [deleteTarget, setDeleteTarget] = useState<NotificationRule | null>(null)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const [isSyncing, setIsSyncing] = useState(false)

    // ── Dynamic Stats ────────────────────────────────────────────────────
    const stats = useMemo(() => {
        const active = rules.filter(r => r.enabled).length
        const totalSent = rules.reduce((a, r) => a + r.sent, 0)
        const avgOpenRate = rules.length
            ? Math.round(rules.reduce((a, r) => a + r.openRate, 0) / rules.length)
            : 0
        const channels = new Set(rules.map(r => r.channel)).size
        return { active, totalSent, avgOpenRate, channels }
    }, [rules])

    // ── Filtered list ────────────────────────────────────────────────────
    const filtered = useMemo(() => {
        return rules.filter(r => {
            const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.trigger.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.audience.toLowerCase().includes(searchQuery.toLowerCase())
            const matchChannel = filterChannel === "all" || r.channel === filterChannel
            const matchPriority = filterPriority === "all" || r.priority === filterPriority
            return matchSearch && matchChannel && matchPriority
        })
    }, [rules, searchQuery, filterChannel, filterPriority])

    // ── CRUD ─────────────────────────────────────────────────────────────

    const handleCreate = () => {
        if (!newRule.name.trim() || !newRule.trigger.trim()) {
            toast.error("Rule name and trigger condition are required")
            return
        }
        const r: NotificationRule = {
            id: `NR-${String(rules.length + 1).padStart(3, "0")}`,
            name: newRule.name.trim(),
            trigger: newRule.trigger.trim(),
            channel: newRule.channel,
            audience: newRule.audience.trim() || "All",
            priority: newRule.priority,
            enabled: true,
            sent: 0,
            openRate: 0,
            lastSent: "Never",
        }
        setRules(prev => [r, ...prev])
        setNewRule({ name: "", trigger: "", channel: "Email", audience: "", priority: "Medium" })
        setIsCreateOpen(false)
        toast.success(`Notification rule "${r.name}" created successfully`)
    }

    const handleEditOpen = (r: NotificationRule) => {
        setEditTarget({ ...r })
        setIsEditOpen(true)
    }

    const handleEditSave = () => {
        if (!editTarget) return
        if (!editTarget.name.trim() || !editTarget.trigger.trim()) {
            toast.error("Name and trigger are required")
            return
        }
        setRules(prev => prev.map(r => r.id === editTarget.id ? { ...editTarget } : r))
        setIsEditOpen(false)
        setEditTarget(null)
        toast.success("Notification rule updated successfully")
    }

    const handleDeleteOpen = (r: NotificationRule) => {
        setDeleteTarget(r)
        setIsDeleteOpen(true)
    }

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return
        setRules(prev => prev.filter(r => r.id !== deleteTarget.id))
        setIsDeleteOpen(false)
        setDeleteTarget(null)
        toast.success("Notification rule deleted successfully")
    }

    const handleToggle = (id: string, current: boolean) => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !current } : r))
        toast.success(current ? "Rule disabled" : "Rule enabled")
    }

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(new Promise(r => setTimeout(r, 1500)), {
            loading: "Syncing notification rules...",
            success: "All rules synchronized",
            error: "Sync failed",
        })
        setTimeout(() => setIsSyncing(false), 1500)
    }

    const handleExport = () => {
        const csv = [
            ["ID", "Name", "Trigger", "Channel", "Audience", "Priority", "Enabled", "Sent", "Open Rate", "Last Sent"],
            ...rules.map(r => [r.id, r.name, r.trigger, r.channel, r.audience, r.priority, r.enabled, r.sent, `${r.openRate}%`, r.lastSent]),
        ].map(row => row.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "notification-rules.csv"
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Notification rules exported as CSV")
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">
                        Notification <span className="text-indigo-600">rules</span>
                    </h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">
                        Define who gets notified, when, and through which channel
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
                                <Plus className="w-4 h-4" /> New rule
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[480px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">
                                    Create <span className="text-indigo-600">notification rule</span>
                                </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-5 py-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Rule name *</Label>
                                    <Input value={newRule.name} onChange={(e) => setNewRule({ ...newRule, name: e.target.value })} placeholder="e.g. Welcome email on signup" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Trigger condition *</Label>
                                    <Input value={newRule.trigger} onChange={(e) => setNewRule({ ...newRule, trigger: e.target.value })} placeholder="e.g. New client onboarded" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700">Channel</Label>
                                        <Select value={newRule.channel} onValueChange={(v) => setNewRule({ ...newRule, channel: v })}>
                                            <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                {CHANNELS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700">Priority</Label>
                                        <Select value={newRule.priority} onValueChange={(v) => setNewRule({ ...newRule, priority: v })}>
                                            <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Audience</Label>
                                    <Input value={newRule.audience} onChange={(e) => setNewRule({ ...newRule, audience: e.target.value })} placeholder="e.g. Client, Account manager, Finance team" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" />
                                </div>
                            </div>
                            <DialogFooter className="gap-2">
                                <Button variant="ghost" className="rounded-xl font-semibold" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold px-8 text-white" onClick={handleCreate}>Create rule</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* ── Stats Cards (dynamic) ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: "Active rules", value: stats.active, icon: Bell, bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-100/50" },
                    { label: "Total notifications sent", value: stats.totalSent, icon: Activity, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-100/50" },
                    { label: "Avg open rate", value: `${stats.avgOpenRate}%`, icon: CheckCircle2, bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-100/50" },
                    { label: "Channels configured", value: stats.channels, icon: Volume2, bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", iconBg: "bg-amber-100", iconColor: "text-amber-600", border: "border-amber-100/50" },
                ].map((stat, i) => (
                    <Card key={i} className={`${stat.bg} ${stat.border} border shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden`}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${stat.iconBg}`}>
                                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                                </div>
                                <span className="text-[11px] font-semibold text-slate-400 bg-white/70 px-2 py-1 rounded-full border border-slate-100">{rules.length} total</span>
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
                    <Input placeholder="Search rules, triggers, or audience..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-11 bg-white border-slate-200 rounded-xl text-sm font-medium" />
                </div>
                <Select value={filterChannel} onValueChange={setFilterChannel}>
                    <SelectTrigger className="w-44 h-11 rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-sm">
                        <Bell className="w-4 h-4 mr-2 text-slate-400" /><SelectValue placeholder="All channels" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all">All channels</SelectItem>
                        {CHANNELS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-44 h-11 rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-sm">
                        <SelectValue placeholder="All priorities" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all">All priorities</SelectItem>
                        {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {/* ── Rules Table ── */}
            <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                <CardHeader className="px-8 py-6 border-b border-slate-100">
                    <CardTitle className="text-lg font-semibold text-slate-900">
                        Notification rules <span className="text-slate-400 font-medium text-sm ml-2">({filtered.length})</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                        {filtered.map((rule) => {
                            const ChannelIcon = CHANNEL_ICONS[rule.channel] || Bell
                            return (
                                <div key={rule.id} className="px-8 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-slate-50/50 transition-colors group">
                                    <div className="flex items-start gap-5 flex-1">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${CHANNEL_COLORS[rule.channel] || "bg-slate-50 text-slate-400"}`}>
                                            <ChannelIcon className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{rule.name}</h4>
                                                <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${PRIORITY_COLORS[rule.priority]}`}>{rule.priority}</Badge>
                                                <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 ${CHANNEL_COLORS[rule.channel]}`}>{rule.channel}</Badge>
                                                <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 ${rule.enabled ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                                    {rule.enabled ? "Active" : "Disabled"}
                                                </Badge>
                                            </div>
                                            <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                                                <AlertCircle className="w-3 h-3" /> Trigger: {rule.trigger}
                                            </p>
                                            <div className="flex items-center gap-6 text-[11px] text-slate-400 font-medium">
                                                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {rule.audience}</span>
                                                <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {rule.sent} sent</span>
                                                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> {rule.openRate}% open rate</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {rule.lastSent}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="flex items-center gap-2 border border-slate-100 rounded-xl px-3 py-2 bg-white shadow-sm">
                                            <Switch checked={rule.enabled} onCheckedChange={() => handleToggle(rule.id, rule.enabled)} className="data-[state=checked]:bg-indigo-600 scale-90" />
                                            <span className="text-[10px] font-semibold text-slate-400">{rule.enabled ? "Active" : "Off"}</span>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl" onClick={() => handleEditOpen(rule)}><Edit className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl" onClick={() => handleDeleteOpen(rule)}><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                            )
                        })}
                        {filtered.length === 0 && (
                            <div className="px-8 py-16 text-center">
                                <Bell className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-400 font-medium">No notification rules match the current filters.</p>
                                <Button variant="ghost" className="mt-3 text-indigo-600 font-semibold text-sm" onClick={() => { setSearchQuery(""); setFilterChannel("all"); setFilterPriority("all") }}>Clear filters</Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* ── Edit Dialog ── */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[480px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">
                            Edit <span className="text-indigo-600">notification rule</span>
                        </DialogTitle>
                    </DialogHeader>
                    {editTarget && (
                        <div className="grid gap-5 py-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">Rule name *</Label>
                                <Input value={editTarget.name} onChange={(e) => setEditTarget({ ...editTarget, name: e.target.value })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">Trigger condition *</Label>
                                <Input value={editTarget.trigger} onChange={(e) => setEditTarget({ ...editTarget, trigger: e.target.value })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Channel</Label>
                                    <Select value={editTarget.channel} onValueChange={(v) => setEditTarget({ ...editTarget, channel: v })}>
                                        <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {CHANNELS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Priority</Label>
                                    <Select value={editTarget.priority} onValueChange={(v) => setEditTarget({ ...editTarget, priority: v })}>
                                        <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">Audience</Label>
                                <Input value={editTarget.audience} onChange={(e) => setEditTarget({ ...editTarget, audience: e.target.value })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" />
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
                        <DialogTitle className="text-xl font-semibold text-slate-900">Delete notification rule</DialogTitle>
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
