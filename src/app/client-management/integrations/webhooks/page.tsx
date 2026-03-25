"use client"

import { useState, useMemo } from "react"
import {
    Plus, Search, RefreshCw, Download, Webhook,
    Clock, Trash2, Edit, Loader2, X, Save,
    CheckCircle2, AlertCircle, Activity, Zap,
    Play, RotateCcw
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

type WebhookItem = {
    id: string
    name: string
    url: string
    events: string[]
    status: string
    deliveries: number
    failures: number
    successRate: number
    enabled: boolean
    lastDelivery: string
}

const EVENT_OPTIONS = [
    "client.created", "client.updated", "client.deleted",
    "invoice.paid", "invoice.overdue", "subscription.renewed",
    "ticket.created", "ticket.resolved", "health.score.changed"
]

const INITIAL_WEBHOOKS: WebhookItem[] = [
    { id: "WH-001", name: "Slack notifications", url: "https://hooks.slack.com/services/T0/B0/xxx", events: ["client.created", "invoice.paid"], status: "Active", deliveries: 842, failures: 2, successRate: 99.8, enabled: true, lastDelivery: "3 min ago" },
    { id: "WH-002", name: "Internal analytics", url: "https://analytics.company.com/webhook", events: ["client.updated", "health.score.changed"], status: "Active", deliveries: 4210, failures: 14, successRate: 99.7, enabled: true, lastDelivery: "10 min ago" },
    { id: "WH-003", name: "Billing system sync", url: "https://billing.app.io/hooks/crm", events: ["invoice.paid", "invoice.overdue", "subscription.renewed"], status: "Active", deliveries: 620, failures: 0, successRate: 100, enabled: true, lastDelivery: "1 hr ago" },
    { id: "WH-004", name: "Support escalation hook", url: "https://support.myapp.com/escalate", events: ["ticket.created", "ticket.resolved"], status: "Error", deliveries: 180, failures: 22, successRate: 87.8, enabled: true, lastDelivery: "2 hr ago" },
    { id: "WH-005", name: "CRM data backup", url: "https://backup.internal/crm-hook", events: ["client.created", "client.deleted"], status: "Paused", deliveries: 310, failures: 1, successRate: 99.7, enabled: false, lastDelivery: "3 days ago" },
]

export default function WebhooksPage() {
    const [webhooks, setWebhooks] = useState<WebhookItem[]>(INITIAL_WEBHOOKS)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<WebhookItem | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<WebhookItem | null>(null)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [newWebhook, setNewWebhook] = useState({ name: "", url: "", event: "client.created" })

    const stats = useMemo(() => ({
        active: webhooks.filter(w => w.enabled).length,
        totalDeliveries: webhooks.reduce((a, w) => a + w.deliveries, 0),
        totalFailures: webhooks.reduce((a, w) => a + w.failures, 0),
        avgSuccess: webhooks.length ? (webhooks.reduce((a, w) => a + w.successRate, 0) / webhooks.length).toFixed(1) : "0",
    }), [webhooks])

    const filtered = useMemo(() => webhooks.filter(w => {
        const matchSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) || w.url.toLowerCase().includes(searchQuery.toLowerCase())
        const matchStatus = filterStatus === "all" || w.status.toLowerCase() === filterStatus
        return matchSearch && matchStatus
    }), [webhooks, searchQuery, filterStatus])

    const handleCreate = () => {
        if (!newWebhook.name.trim() || !newWebhook.url.trim()) { toast.error("Name and URL are required"); return }
        try { new URL(newWebhook.url) } catch { toast.error("Please enter a valid URL"); return }
        const w: WebhookItem = { id: `WH-${String(webhooks.length + 1).padStart(3, "0")}`, name: newWebhook.name.trim(), url: newWebhook.url.trim(), events: [newWebhook.event], status: "Active", deliveries: 0, failures: 0, successRate: 100, enabled: true, lastDelivery: "Never" }
        setWebhooks(prev => [w, ...prev])
        setNewWebhook({ name: "", url: "", event: "client.created" })
        setIsCreateOpen(false)
        toast.success(`Webhook "${w.name}" registered successfully`)
    }

    const handleEditSave = () => {
        if (!editTarget?.name.trim() || !editTarget.url.trim()) { toast.error("Name and URL are required"); return }
        setWebhooks(prev => prev.map(w => w.id === editTarget.id ? { ...editTarget } : w))
        setEditTarget(null)
        toast.success("Webhook updated successfully")
    }

    const handleDelete = () => {
        if (!deleteTarget) return
        setWebhooks(prev => prev.filter(w => w.id !== deleteTarget.id))
        setDeleteTarget(null)
        toast.success("Webhook removed")
    }

    const handleToggle = (id: string, current: boolean) => {
        setWebhooks(prev => prev.map(w => w.id === id ? { ...w, enabled: !current, status: !current ? "Active" : "Paused" } : w))
        toast.success(current ? "Webhook paused" : "Webhook activated")
    }

    const handleTestDeliver = (id: string, name: string) => {
        setWebhooks(prev => prev.map(w => w.id === id ? { ...w, deliveries: w.deliveries + 1, lastDelivery: "Just now" } : w))
        toast.promise(new Promise(r => setTimeout(r, 1500)), { loading: `Sending test event to ${name}...`, success: "Test event delivered successfully", error: "Delivery failed" })
    }

    const handleRetryFailed = (id: string) => {
        setWebhooks(prev => prev.map(w => w.id === id ? { ...w, failures: 0, successRate: 100, status: "Active" } : w))
        toast.success("Failed deliveries retried successfully")
    }

    const handleRefresh = () => {
        setIsRefreshing(true)
        toast.promise(new Promise(r => setTimeout(r, 1500)), { loading: "Checking webhook health...", success: "All webhooks checked", error: "Check failed" })
        setTimeout(() => {
            setIsRefreshing(false)
            setWebhooks(prev => prev.map(w => w.enabled ? { ...w, lastDelivery: "Just now", deliveries: w.deliveries + Math.floor(Math.random() * 5) } : w))
        }, 1500)
    }

    const handleExport = () => {
        const csv = [["ID", "Name", "URL", "Events", "Status", "Deliveries", "Failures", "Success Rate"], ...webhooks.map(w => [w.id, w.name, w.url, w.events.join(";"), w.status, w.deliveries, w.failures, `${w.successRate}%`])].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "webhooks.csv"; a.click(); URL.revokeObjectURL(url)
        toast.success("Webhooks exported")
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">Webhook <span className="text-indigo-600">endpoints</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Register and monitor outbound webhook integrations for real-time events</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleRefresh}>{isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 text-slate-400" />} Check health</Button>
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleExport}><Download className="w-4 h-4 text-slate-400" /> Export</Button>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild><Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2"><Plus className="w-4 h-4" /> Add webhook</Button></DialogTrigger>
                        <DialogContent className="sm:max-w-[480px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                            <DialogHeader><DialogTitle className="text-2xl font-semibold text-slate-900">Register <span className="text-indigo-600">webhook</span></DialogTitle></DialogHeader>
                            <div className="grid gap-5 py-6">
                                <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Webhook name *</Label><Input value={newWebhook.name} onChange={e => setNewWebhook({ ...newWebhook, name: e.target.value })} placeholder="e.g. Slack notifications" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" /></div>
                                <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Endpoint URL *</Label><Input value={newWebhook.url} onChange={e => setNewWebhook({ ...newWebhook, url: e.target.value })} placeholder="https://your-service.com/webhook" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-mono text-sm text-slate-900" /></div>
                                <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Trigger event</Label>
                                    <Select value={newWebhook.event} onValueChange={v => setNewWebhook({ ...newWebhook, event: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl">{EVENT_OPTIONS.map(e => <SelectItem key={e} value={e}><code className="text-xs">{e}</code></SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter className="gap-2"><Button variant="ghost" className="rounded-xl font-semibold" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold px-8 text-white" onClick={handleCreate}>Register</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: "Active webhooks", value: stats.active, icon: Zap, bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-100/50" },
                    { label: "Total deliveries", value: stats.totalDeliveries.toLocaleString(), icon: Activity, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-100/50" },
                    { label: "Avg success rate", value: `${stats.avgSuccess}%`, icon: CheckCircle2, bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-100/50" },
                    { label: "Total failures", value: stats.totalFailures, icon: AlertCircle, bg: `bg-gradient-to-br ${stats.totalFailures > 0 ? "from-rose-50 to-rose-100/50" : "from-amber-50 to-amber-100/50"}`, iconBg: `${stats.totalFailures > 0 ? "bg-rose-100" : "bg-amber-100"}`, iconColor: `${stats.totalFailures > 0 ? "text-rose-600" : "text-amber-600"}`, border: "border-amber-100/50" },
                ].map((stat, i) => (
                    <Card key={i} className={`${stat.bg} ${stat.border} border shadow-sm hover:shadow-md transition-all rounded-[22px] overflow-hidden`}>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`h-10 w-10 rounded-[14px] flex items-center justify-center ${stat.iconBg}`}><stat.icon className={`w-5 h-5 ${stat.iconColor}`} /></div>
                                <span className="text-[11px] font-semibold text-slate-400 bg-white/70 px-2 py-1 rounded-full border border-slate-100">{webhooks.length} total</span>
                            </div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">{stat.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" /><Input placeholder="Search webhooks or URLs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 h-11 bg-white border-slate-200 rounded-xl text-sm font-medium" /></div>
                <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="w-44 h-11 rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-sm"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="all">All statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="paused">Paused</SelectItem><SelectItem value="error">Error</SelectItem></SelectContent></Select>
            </div>

            <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                <CardHeader className="px-8 py-6 border-b border-slate-100"><CardTitle className="text-lg font-semibold text-slate-900">Registered webhooks <span className="text-slate-400 font-medium text-sm ml-2">({filtered.length})</span></CardTitle></CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                        {filtered.map(w => (
                            <div key={w.id} className="px-8 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-slate-50/50 transition-colors group">
                                <div className="flex items-start gap-5 flex-1">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${w.status === "Error" ? "bg-rose-50 text-rose-600" : "bg-violet-50 text-violet-600"}`}><Zap className="w-5 h-5" /></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{w.name}</h4>
                                            <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 ${w.status === "Active" ? "bg-emerald-100 text-emerald-700" : w.status === "Error" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>{w.status}</Badge>
                                            {w.failures > 0 && <Badge className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border-0">{w.failures} failures</Badge>}
                                        </div>
                                        <code className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-lg block truncate max-w-md">{w.url}</code>
                                        <div className="flex flex-wrap gap-1.5">
                                            {w.events.map(ev => <code key={ev} className="text-[10px] font-mono bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md">{ev}</code>)}
                                        </div>
                                        <div className="flex items-center gap-6 text-[11px] text-slate-400 font-medium">
                                            <span>{w.deliveries.toLocaleString()} deliveries</span>
                                            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> {w.successRate}% success</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {w.lastDelivery}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                    <Button variant="ghost" size="sm" className="h-9 px-3 text-indigo-600 hover:bg-indigo-50 rounded-xl font-semibold text-xs gap-1.5" onClick={() => handleTestDeliver(w.id, w.name)}><Play className="w-3 h-3" />Test</Button>
                                    {w.failures > 0 && <Button variant="ghost" size="sm" className="h-9 px-3 text-amber-600 hover:bg-amber-50 rounded-xl font-semibold text-xs gap-1.5" onClick={() => handleRetryFailed(w.id)}><RotateCcw className="w-3 h-3" />Retry</Button>}
                                    <div className="flex items-center gap-2 border border-slate-100 rounded-xl px-3 py-2 bg-white shadow-sm">
                                        <Switch checked={w.enabled} onCheckedChange={() => handleToggle(w.id, w.enabled)} className="data-[state=checked]:bg-indigo-600 scale-90" />
                                        <span className="text-[10px] font-semibold text-slate-400">{w.enabled ? "On" : "Off"}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl" onClick={() => setEditTarget({ ...w })}><Edit className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl" onClick={() => setDeleteTarget(w)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && <div className="px-8 py-16 text-center"><p className="text-slate-400 font-medium">No webhooks found.</p><Button variant="ghost" className="mt-3 text-indigo-600 font-semibold text-sm" onClick={() => { setSearchQuery(""); setFilterStatus("all") }}>Clear filters</Button></div>}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!editTarget} onOpenChange={() => setEditTarget(null)}>
                <DialogContent className="sm:max-w-[480px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader><DialogTitle className="text-2xl font-semibold text-slate-900">Edit <span className="text-indigo-600">webhook</span></DialogTitle></DialogHeader>
                    {editTarget && <div className="grid gap-5 py-6">
                        <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Name *</Label><Input value={editTarget.name} onChange={e => setEditTarget({ ...editTarget, name: e.target.value })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" /></div>
                        <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Endpoint URL *</Label><Input value={editTarget.url} onChange={e => setEditTarget({ ...editTarget, url: e.target.value })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-mono text-sm text-slate-900" /></div>
                    </div>}
                    <DialogFooter className="gap-2"><Button variant="ghost" className="rounded-xl font-semibold gap-2" onClick={() => setEditTarget(null)}><X className="w-4 h-4" />Cancel</Button><Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold px-8 text-white gap-2" onClick={handleEditSave}><Save className="w-4 h-4" />Save</Button></DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader><DialogTitle className="text-xl font-semibold text-slate-900">Remove webhook</DialogTitle></DialogHeader>
                    <p className="text-sm font-medium text-slate-500 py-4">Are you sure you want to remove <span className="text-slate-900 font-semibold">"{deleteTarget?.name}"</span>? No more events will be sent to this endpoint.</p>
                    <DialogFooter className="gap-2"><Button variant="ghost" className="rounded-xl font-semibold" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button className="rounded-xl bg-rose-600 hover:bg-rose-700 font-semibold px-6 text-white gap-2" onClick={handleDelete}><Trash2 className="w-4 h-4" />Remove</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
