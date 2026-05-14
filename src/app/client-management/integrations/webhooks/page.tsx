"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Plus, Search, RefreshCw, Download, Webhook,
    Trash2, PencilLine, Filter, MoreVertical, Eye,
    Activity, CheckCircle2, AlertCircle, Copy, Zap,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Switch } from "@/shared/components/ui/switch"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Progress } from "@/shared/components/ui/progress"
import { toast } from "@/shared/utils/toast"

type WebhookItem = {
    id: string
    name: string
    url: string
    events: string[]
    secret: string
    status: 'Active' | 'Paused' | 'Failing'
    enabled: boolean
    triggered: number
    successRate: number
    lastTriggered: string
    createdAt: string
}

const ALL_EVENTS = [
    "contact.created", "contact.updated", "contact.deleted",
    "deal.created", "deal.won", "deal.lost",
    "invoice.paid", "invoice.failed",
    "subscription.created", "subscription.cancelled",
    "ticket.opened", "ticket.resolved",
]

const INITIAL: WebhookItem[] = [
    { id: "WH-001", name: "Slack Notifier", url: "https://hooks.slack.com/services/T0/B0/abc", events: ["deal.won", "deal.lost", "contact.created"], secret: "whsec_8j3k...2lm", status: "Active", enabled: true, triggered: 1240, successRate: 99.2, lastTriggered: "2 min ago", createdAt: "Jan 15, 2025" },
    { id: "WH-002", name: "Customer Portal", url: "https://app.customer.io/webhook/abc", events: ["contact.updated", "subscription.created"], secret: "whsec_p2x4...8mq", status: "Active", enabled: true, triggered: 820, successRate: 98.5, lastTriggered: "12 min ago", createdAt: "Feb 02, 2025" },
    { id: "WH-003", name: "Billing Sync", url: "https://api.billing.io/v1/hook", events: ["invoice.paid", "invoice.failed", "subscription.cancelled"], secret: "whsec_b8r1...5qm", status: "Failing", enabled: true, triggered: 420, successRate: 76.4, lastTriggered: "1 hr ago", createdAt: "Mar 10, 2025" },
    { id: "WH-004", name: "Analytics Pipeline", url: "https://etl.fixl.io/ingest", events: ["deal.created", "deal.won", "ticket.opened"], secret: "whsec_a1n8...7pq", status: "Active", enabled: true, triggered: 3820, successRate: 99.9, lastTriggered: "Just now", createdAt: "Dec 01, 2024" },
    { id: "WH-005", name: "Legacy CRM", url: "https://legacy.example.com/hook", events: ["contact.created"], secret: "whsec_v2x4...9mq", status: "Paused", enabled: false, triggered: 0, successRate: 0, lastTriggered: "—", createdAt: "Oct 05, 2024" },
]

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    url: (v: string) => v && !/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)/i.test(v) ? "Enter a valid URL" : "",
}

export default function WebhooksPage() {
    const router = useRouter()
    const [hooks, setHooks] = React.useState<WebhookItem[]>(INITIAL)
    const [search, setSearch] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [selected, setSelected] = React.useState<WebhookItem | null>(null)

    const [form, setForm] = React.useState({
        name: "", url: "", secret: "", events: [] as string[],
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const stats = React.useMemo(() => ({
        active: hooks.filter(h => h.enabled).length,
        totalTriggered: hooks.reduce((a, h) => a + h.triggered, 0),
        failing: hooks.filter(h => h.status === "Failing").length,
        avgSuccess: hooks.length ? Math.round(hooks.filter(h => h.successRate > 0).reduce((a, h) => a + h.successRate, 0) / Math.max(1, hooks.filter(h => h.successRate > 0).length)) : 0,
    }), [hooks])

    const filtered = React.useMemo(() => hooks.filter(h => {
        const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) || h.url.toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === "all" || h.status === statusFilter
        return matchSearch && matchStatus
    }), [hooks, search, statusFilter])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const toggleEvent = (ev: string) => {
        setForm(prev => ({ ...prev, events: prev.events.includes(ev) ? prev.events.filter(e => e !== ev) : [...prev.events, ev] }))
        if (errors.events) setErrors(prev => { const c = { ...prev }; delete c.events; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(3)(form.name)
        errs.url = validators.required(form.url) || validators.url(form.url)
        errs.secret = validators.required(form.secret) || validators.minLen(8)(form.secret)
        if (form.events.length === 0) errs.events = "Select at least one event"
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", url: "", secret: `whsec_${Math.random().toString(36).substring(2, 18)}`, events: [] })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (h: WebhookItem) => {
        setEditingId(h.id)
        setForm({ name: h.name, url: h.url, secret: h.secret, events: [...h.events] })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setHooks(hooks.map(h => h.id === editingId ? { ...h, name: form.name.trim(), url: form.url, secret: form.secret, events: form.events } : h))
            toast.success("Webhook updated")
        } else {
            const h: WebhookItem = {
                id: `WH-${String(hooks.length + 1).padStart(3, "0")}`,
                name: form.name.trim(), url: form.url, secret: form.secret, events: form.events,
                status: "Active", enabled: true, triggered: 0, successRate: 100,
                lastTriggered: "Never", createdAt: new Date().toLocaleDateString(),
            }
            setHooks([h, ...hooks])
            toast.success("Webhook created")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: string) => {
        setHooks(hooks.filter(h => h.id !== id))
        toast.success("Webhook removed")
    }

    const handleToggle = (id: string, current: boolean) => {
        setHooks(hooks.map(h => h.id === id ? { ...h, enabled: !current, status: !current ? "Active" : "Paused" } : h))
        toast.success(current ? "Webhook paused" : "Webhook activated")
    }

    const handleTest = (h: WebhookItem) => {
        toast.success(`Sending test payload to ${h.name}...`)
        setTimeout(() => toast.success(`${h.name} responded 200 OK`), 1000)
    }

    const handleCopy = (val: string) => {
        navigator.clipboard?.writeText(val).then(() => toast.success("Copied to clipboard")).catch(() => toast.error("Copy failed"))
    }

    const handleExport = () => {
        const csv = [["ID", "Name", "URL", "Status", "Events", "Triggered", "Success Rate"], ...hooks.map(h => [h.id, h.name, h.url, h.status, h.events.join("|"), h.triggered, h.successRate])].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = "webhooks.csv"; a.click(); URL.revokeObjectURL(url)
        toast.success("Webhooks exported")
    }

    const openDetail = (h: WebhookItem) => { setSelected(h); setIsDetailOpen(true) }

    const kpiCards = [
        { title: "Active Webhooks", value: String(stats.active), subtitle: `${hooks.length} total`, icon: Webhook, color: "violet", trend: `+${stats.active}`, path: "/client-management/integrations/webhooks" },
        { title: "Events Triggered", value: stats.totalTriggered.toLocaleString(), subtitle: "Last 30 days", icon: Activity, color: "indigo", trend: "+18%", path: "/client-management/integrations/data-sync" },
        { title: "Failing Hooks", value: String(stats.failing), subtitle: "Needs attention", icon: AlertCircle, color: stats.failing > 0 ? "rose" : "emerald", trend: stats.failing > 0 ? "Alert" : "Clean", path: "/client-management/integrations/webhooks" },
        { title: "Success Rate", value: `${stats.avgSuccess}%`, subtitle: "Delivery reliability", icon: CheckCircle2, color: "emerald", trend: "+1%", path: "/client-management/integrations/api" },
    ]
    const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        indigo: { bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", border: "border-indigo-200/50", text: "text-indigo-600", iconBg: "bg-indigo-100" },
        violet: { bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", border: "border-violet-200/50", text: "text-violet-600", iconBg: "bg-violet-100" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        rose: { bg: "bg-gradient-to-br from-rose-50 to-rose-100/50", border: "border-rose-200/50", text: "text-rose-600", iconBg: "bg-rose-100" },
    }

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        <span className="text-violet-600">Webhooks</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Subscribe to real-time events and push notifications to external systems.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />Export
                    </Button>
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />Add Webhook
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((kpi, i) => {
                    const cc = colorMap[kpi.color]
                    const Icon = kpi.icon
                    return (
                        <Card key={i} className={`rounded-none cursor-pointer hover:shadow-md transition ${cc.bg} ${cc.border} border`} onClick={() => router.push(kpi.path)}>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 tracking-wide mb-1">{kpi.title}</p>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
                                            <span className={`text-xs font-bold ${cc.text}`}>{kpi.trend}</span>
                                        </div>
                                        <p className="mt-2 text-xs text-slate-400">{kpi.subtitle}</p>
                                    </div>
                                    <div className={`h-10 w-10 rounded-none flex items-center justify-center ${cc.iconBg}`}>
                                        <Icon className={`h-5 w-5 ${cc.text}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-none">
                        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-base font-semibold">Configured Endpoints</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length}</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search webhooks..." value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-6 py-3">Webhook</th>
                                            <th className="px-6 py-3">Events</th>
                                            <th className="px-6 py-3">Triggered</th>
                                            <th className="px-6 py-3">Success</th>
                                            <th className="px-6 py-3">Enabled</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.length > 0 ? filtered.map(h => (
                                            <tr key={h.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(h)}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-none bg-violet-50 border border-violet-100 flex items-center justify-center">
                                                            <Webhook className="h-4 w-4 text-violet-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800">{h.name}</p>
                                                            <p className="text-[11px] font-mono text-slate-500 truncate max-w-[300px]">{h.url}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge className="rounded-none bg-slate-100 text-slate-600">{h.events.length} events</Badge>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900">{h.triggered.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Progress value={h.successRate} className="w-16 h-1.5" />
                                                        <span className="text-xs font-bold text-slate-900">{h.successRate}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <Switch checked={h.enabled} onCheckedChange={() => handleToggle(h.id, h.enabled)} className="data-[state=checked]:bg-violet-600" />
                                                </td>
                                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-none">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44 rounded-none">
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleTest(h)}>
                                                                <Zap className="h-4 w-4" /> Test Webhook
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(h)}>
                                                                <PencilLine className="h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openDetail(h)}>
                                                                <Eye className="h-4 w-4" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDelete(h.id)}>
                                                                <Trash2 className="h-4 w-4" /> Remove
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">No webhooks match your filters.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">Event Activity</CardTitle>
                                <p className="text-sm text-slate-500 mt-1">Most triggered event types</p>
                            </div>
                            <Activity className="h-5 w-5 text-slate-400" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {ALL_EVENTS.slice(0, 6).map((ev, idx) => {
                                const list = hooks.filter(h => h.events.includes(ev))
                                const total = list.reduce((sum, h) => sum + h.triggered, 0)
                                const max = Math.max(...hooks.map(h => h.triggered), 1)
                                const progress = Math.min(100, total / max * 100)
                                return (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="font-mono text-slate-700">{ev} <span className="text-slate-400 font-medium ml-2">{list.length} subscribers</span></span>
                                            <span className="text-slate-900">{total.toLocaleString()}</span>
                                        </div>
                                        <Progress value={progress} className="h-1.5 bg-slate-50" />
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Recent Deliveries</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {hooks.slice(0, 4).map((h, idx) => (
                                <div key={idx} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-2 transition" onClick={() => openDetail(h)}>
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-none bg-violet-50 border border-violet-100 flex items-center justify-center text-[10px] font-bold text-violet-600">
                                            {h.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 leading-none">{h.name}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{h.lastTriggered}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-900">{h.triggered.toLocaleString()}</p>
                                        <div className="flex items-center gap-1 justify-end mt-1">
                                            {h.status === "Failing" ? <AlertCircle className="h-2.5 w-2.5 text-rose-500" /> : <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />}
                                            <span className={`text-[9px] font-bold ${h.status === "Failing" ? "text-rose-600" : "text-emerald-600"}`}>{h.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-xs font-bold text-violet-600 hover:text-violet-700 rounded-none mt-3" onClick={() => router.push('/client-management/integrations/api')}>
                                View API Logs
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-violet-100 bg-violet-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-violet-600 tracking-wider flex items-center gap-2 uppercase">
                                <Zap className="h-4 w-4" /> Best Practices
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-violet-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    Always validate <span className="text-violet-600 font-bold">HMAC signatures</span> using your webhook secret.
                                </p>
                            </div>
                            <div className="p-3 bg-white border border-violet-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    Respond with <span className="text-violet-600 font-bold">2xx</span> within 10 seconds.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-violet-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Webhook" : "Create Webhook"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Subscribe to real-time CRM events.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Webhook Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g., Slack Notifier" className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`} />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Endpoint URL <span className="text-rose-500">*</span></Label>
                            <Input value={form.url} onChange={e => setField("url", e.target.value)} placeholder="https://example.com/webhook" className={`h-10 rounded-none ${errors.url ? "border-rose-500" : ""}`} />
                            {errors.url && <p className="text-[11px] text-rose-500">{errors.url}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Signing Secret <span className="text-rose-500">*</span></Label>
                            <div className="flex gap-2">
                                <Input value={form.secret} onChange={e => setField("secret", e.target.value)} placeholder="whsec_..." className={`h-10 rounded-none font-mono text-xs ${errors.secret ? "border-rose-500" : ""}`} />
                                <Button variant="outline" size="icon" className="h-10 w-10 rounded-none" onClick={() => handleCopy(form.secret)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            {errors.secret && <p className="text-[11px] text-rose-500">{errors.secret}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Subscribed Events <span className="text-rose-500">*</span></Label>
                            <div className={`max-h-60 overflow-y-auto p-2 border rounded-none ${errors.events ? "border-rose-500" : "border-slate-200"}`}>
                                {ALL_EVENTS.map(ev => (
                                    <label key={ev} className="flex items-center gap-2 p-1.5 cursor-pointer hover:bg-slate-50">
                                        <input type="checkbox" checked={form.events.includes(ev)} onChange={() => toggleEvent(ev)} className="h-4 w-4" />
                                        <span className="text-xs font-mono text-slate-700">{ev}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.events && <p className="text-[11px] text-rose-500">{errors.events}</p>}
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-violet-600 hover:bg-violet-700 text-white rounded-none" onClick={handleSave}>
                            {editingId ? "Save Changes" : "Create Webhook"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Webhooks</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Status</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Paused">Paused</SelectItem>
                                    <SelectItem value="Failing">Failing</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setStatusFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-violet-600 hover:bg-violet-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold">Webhook Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Webhook</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                                    <p className="text-xs font-mono text-slate-500 break-all mt-1">{selected.url}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">ID</p><p className="font-semibold text-slate-900">{selected.id}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${selected.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : selected.status === "Failing" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>{selected.status}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Triggered</p><p className="font-semibold text-slate-900">{selected.triggered.toLocaleString()}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Success Rate</p><p className="font-semibold text-slate-900">{selected.successRate}%</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Last Triggered</p><p className="font-semibold text-slate-900">{selected.lastTriggered}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Created</p><p className="font-semibold text-slate-900">{selected.createdAt}</p></div>
                                    <div className="col-span-2">
                                        <p className="text-[11px] text-slate-400 uppercase">Secret</p>
                                        <div className="flex items-center gap-2">
                                            <p className="font-mono text-xs text-slate-900 break-all">{selected.secret}</p>
                                            <button onClick={() => handleCopy(selected.secret)} className="text-slate-400 hover:text-violet-600 flex-shrink-0">
                                                <Copy className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[11px] text-slate-400 uppercase mb-1">Events</p>
                                        <div className="flex flex-wrap gap-1">
                                            {selected.events.map(ev => <Badge key={ev} className="rounded-none bg-slate-100 text-slate-700 font-mono text-[10px]">{ev}</Badge>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => handleTest(selected)}>
                                    <Zap className="h-4 w-4 mr-2" />Test
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsDetailOpen(false); openEdit(selected) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDelete(selected.id); setIsDetailOpen(false) }}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
