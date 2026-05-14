"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Radio, Search, Filter, MoreVertical, Plus, Trash2, PencilLine, Eye,
    AlertTriangle, CheckCircle2, ShieldAlert, Send, Globe, Zap, Megaphone, Clock,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Textarea } from "@/shared/components/ui/textarea"
import { Badge } from "@/shared/components/ui/badge"
import { toast } from "@/shared/utils/toast"

interface Broadcast {
    id: number
    title: string
    scope: 'All Accounts' | 'Enterprise' | 'Free Tier' | 'Region: North America' | 'Region: EU' | 'Region: APAC'
    severity: 'Critical' | 'Warning' | 'Info' | 'Broadcast'
    status: 'Active' | 'Draft' | 'Expired' | 'Scheduled'
    message: string
    targetReach: number
    sentAt: string
    scheduledFor?: string
}

const initialBroadcasts: Broadcast[] = [
    { id: 1, title: "System Maintenance: Sunday Oct 20", scope: "All Accounts", severity: "Warning", status: "Active", message: "Please be advised that all instances will undergo maintenance on Sunday from 02:00 to 04:00 AM UTC.", targetReach: 12500, sentAt: "10 mins ago" },
    { id: 2, title: "Critical Security Patch: API v2.4", scope: "Enterprise", severity: "Critical", status: "Active", message: "URGENT: All Enterprise API keys must be rotated by EOD Tuesday due to v2.4 updates.", targetReach: 450, sentAt: "1 hour ago" },
    { id: 3, title: "New Resource: Executive Playbook", scope: "All Accounts", severity: "Info", status: "Expired", message: "Check out the new Strategic Account Playbook now available in your resources tab.", targetReach: 12500, sentAt: "2 days ago" },
    { id: 4, title: "Localized Holiday Support Hours", scope: "Region: North America", severity: "Broadcast", status: "Scheduled", message: "Support hours for US & Canada will be modified for the upcoming Thanksgiving weekend.", targetReach: 2800, sentAt: "Starts Oct 25", scheduledFor: "2024-10-25" },
    { id: 5, title: "Vulnerability Disclosure: Library X", scope: "All Accounts", severity: "Critical", status: "Expired", message: "We have patched a potential vulnerability in Library X. No action is required from your side.", targetReach: 12500, sentAt: "Sep 15, 2024" },
]

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    number: (v: any) => v === "" || v === null || v === undefined ? "" : isNaN(Number(v)) ? "Enter a valid number" : Number(v) < 0 ? "Must be positive" : "",
}

const getSeverityProps = (severity: string) => {
    switch (severity) {
        case 'Critical': return { color: 'bg-rose-50 text-rose-600 border-rose-100', icon: ShieldAlert }
        case 'Warning': return { color: 'bg-amber-50 text-amber-600 border-amber-100', icon: AlertTriangle }
        case 'Info': return { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: Zap }
        case 'Broadcast': return { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: Megaphone }
        default: return { color: 'bg-slate-50 text-slate-600 border-slate-100', icon: Radio }
    }
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Active': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
        case 'Scheduled': return 'bg-indigo-50 text-indigo-600 border-indigo-100'
        case 'Draft': return 'bg-slate-50 text-slate-600 border-slate-100'
        default: return 'bg-slate-50 text-slate-600 border-slate-100'
    }
}

export default function BroadcastMessagesPage() {
    const router = useRouter()
    const [broadcasts, setBroadcasts] = React.useState<Broadcast[]>(initialBroadcasts)
    const [search, setSearch] = React.useState("")
    const [severityFilter, setSeverityFilter] = React.useState("all")
    const [scopeFilter, setScopeFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<number | null>(null)
    const [selected, setSelected] = React.useState<Broadcast | null>(null)

    const [form, setForm] = React.useState({
        title: "", scope: "All Accounts" as Broadcast['scope'],
        severity: "Info" as Broadcast['severity'], status: "Draft" as Broadcast['status'],
        message: "", targetReach: "0", scheduledFor: "",
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const metrics = React.useMemo(() => {
        const total = broadcasts.length
        const criticalCount = broadcasts.filter(b => b.severity === 'Critical').length
        const totalReach = broadcasts.reduce((s, b) => s + b.targetReach, 0).toLocaleString()
        const avgAck = "92.4%"
        return { total, criticalCount, totalReach, avgAck }
    }, [broadcasts])

    const filtered = React.useMemo(() => {
        return broadcasts.filter(b =>
            (severityFilter === "all" || b.severity === severityFilter) &&
            (scopeFilter === "all" || b.scope === scopeFilter) &&
            (b.title.toLowerCase().includes(search.toLowerCase()) ||
                b.scope.toLowerCase().includes(search.toLowerCase()) ||
                b.message.toLowerCase().includes(search.toLowerCase()))
        )
    }, [broadcasts, search, severityFilter, scopeFilter])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.title = validators.required(form.title) || validators.minLen(5)(form.title)
        errs.message = validators.required(form.message) || validators.minLen(10)(form.message)
        errs.targetReach = validators.number(form.targetReach)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ title: "", scope: "All Accounts", severity: "Info", status: "Draft", message: "", targetReach: "0", scheduledFor: "" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (b: Broadcast) => {
        setEditingId(b.id)
        setForm({
            title: b.title, scope: b.scope, severity: b.severity, status: b.status,
            message: b.message, targetReach: String(b.targetReach), scheduledFor: b.scheduledFor || "",
        })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setBroadcasts(broadcasts.map(b => b.id === editingId ? {
                ...b, title: form.title.trim(), scope: form.scope, severity: form.severity,
                status: form.status, message: form.message.trim(), targetReach: Number(form.targetReach),
                scheduledFor: form.scheduledFor,
            } : b))
            toast.success("Broadcast updated")
        } else {
            const newB: Broadcast = {
                id: Date.now(),
                title: form.title.trim(),
                scope: form.scope,
                severity: form.severity,
                status: form.status,
                message: form.message.trim(),
                targetReach: Number(form.targetReach),
                sentAt: form.status === 'Scheduled' && form.scheduledFor ? `Starts ${form.scheduledFor}` : "Just now",
                scheduledFor: form.scheduledFor || undefined,
            }
            setBroadcasts([newB, ...broadcasts])
            toast.success("Broadcast dispatched")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: number) => {
        setBroadcasts(broadcasts.filter(b => b.id !== id))
        toast.success("Broadcast halted")
    }

    const openDetail = (b: Broadcast) => { setSelected(b); setIsDetailOpen(true) }

    const kpiCards = [
        { title: "Global Pulses", value: String(metrics.total), subtitle: "Last 30 days", icon: Radio, color: "rose", trend: "+5", path: "/client-management/communication/history" },
        { title: "Critical Alerts", value: String(metrics.criticalCount), subtitle: "Requiring Attention", icon: ShieldAlert, color: "amber", trend: "", path: "/client-management/communication/sms" },
        { title: "Aggregated Reach", value: metrics.totalReach, subtitle: "Unique Accounts", icon: Globe, color: "blue", trend: "+8%", path: "/client-management/customers" },
        { title: "Response Velocity", value: metrics.avgAck, subtitle: "Engagement Ack", icon: CheckCircle2, color: "emerald", trend: "+3%", path: "/client-management/analytics/overview" },
    ]
    const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        rose: { bg: "bg-gradient-to-br from-rose-50 to-rose-100/50", border: "border-rose-200/50", text: "text-rose-600", iconBg: "bg-rose-100" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", border: "border-amber-200/50", text: "text-amber-600", iconBg: "bg-amber-100" },
        blue: { bg: "bg-gradient-to-br from-blue-50 to-blue-100/50", border: "border-blue-200/50", text: "text-blue-600", iconBg: "bg-blue-100" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
    }

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Broadcast <span className="text-amber-600">Command Center</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Orchestrate global announcements, critical system alerts, and mass communications.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Megaphone className="h-4 w-4 mr-2" />Initiate Pulse
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
                                            {kpi.trend && <span className="text-xs font-bold text-emerald-600">{kpi.trend}</span>}
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
                                <CardTitle className="text-base font-semibold">Distribution Log</CardTitle>
                                <Badge className="rounded-none bg-amber-50 text-amber-700 border-0">{filtered.length} pulses</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search pulses..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-6 py-3">Announcement</th>
                                            <th className="px-6 py-3">Scope</th>
                                            <th className="px-6 py-3">Reach</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.length > 0 ? filtered.map(b => {
                                            const props = getSeverityProps(b.severity)
                                            const SIcon = props.icon
                                            return (
                                                <tr key={b.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(b)}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-9 w-9 rounded-none flex items-center justify-center border ${props.color}`}>
                                                                <SIcon className="h-4 w-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-800 max-w-[200px] truncate">{b.title}</p>
                                                                <p className="text-[10px] text-slate-400 mt-0.5">Sent: {b.sentAt}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1">
                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[10px] font-bold border w-fit ${props.color}`}>
                                                                <SIcon className="h-3 w-3" />{b.severity}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-slate-400">{b.scope}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-[12px] font-bold text-slate-700">{b.targetReach.toLocaleString()}</p>
                                                        <p className="text-[10px] text-slate-400">Accounts</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold border ${getStatusColor(b.status)}`}>{b.status}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="rounded-none"><MoreVertical className="h-4 w-4" /></Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="rounded-none w-44">
                                                                <DropdownMenuItem onClick={() => openDetail(b)}><Eye className="h-4 w-4 mr-2" />View</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => openEdit(b)}><PencilLine className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => toast.success("Geo-targeting opened")}><Globe className="h-4 w-4 mr-2" />Geo-Targeting</DropdownMenuItem>
                                                                <DropdownMenuItem className="text-rose-500 border-t mt-1" onClick={() => handleDelete(b.id)}>
                                                                    <Trash2 className="h-4 w-4 mr-2" />Halt
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            )
                                        }) : (
                                            <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">No broadcasts match your filters.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-widest uppercase">Regional Reach</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { name: 'North America', count: 4850, pct: 65, color: 'bg-blue-500' },
                                { name: 'Europe / UK', count: 3200, pct: 45, color: 'bg-indigo-500' },
                                { name: 'Asia Pacific', count: 2100, pct: 28, color: 'bg-emerald-500' },
                                { name: 'Others', count: 1200, pct: 12, color: 'bg-slate-400' },
                            ].map((r, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-[11px] font-bold">
                                        <span className="text-slate-600">{r.name}</span>
                                        <span className="text-slate-900">{r.count.toLocaleString()}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-none">
                                        <div className={`h-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-rose-100 bg-rose-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-rose-600 tracking-widest uppercase flex items-center gap-2">
                                <ShieldAlert className="h-4 w-4" /> Critical Staging
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-rose-100 rounded-none">
                                <p className="text-[12px] font-bold text-slate-900">Planned Service Halt</p>
                                <p className="text-[11px] text-slate-500 mt-1">Reach: <span className="text-rose-600 font-bold">12.5k</span> clients. Executive approval required.</p>
                            </div>
                            <Button className="w-full rounded-none bg-rose-600 hover:bg-rose-700 text-white" onClick={() => toast.success("Audit request submitted")}>
                                Request Executive Audit
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-widest uppercase">Queue Health</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { name: 'SMS Hub', latency: '24ms', load: 'Normal' },
                                { name: 'Push Cluster', latency: '112ms', load: 'High' },
                                { name: 'SMTP Relay', latency: '8ms', load: 'Optimal' },
                            ].map((q, i) => (
                                <div key={i} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-none">
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-700">{q.name}</p>
                                        <p className="text-[9px] text-slate-400">Latency: {q.latency}</p>
                                    </div>
                                    <Badge className={`rounded-none border-0 text-[9px] ${q.load === 'High' ? "text-rose-500 bg-rose-50" : "text-emerald-500 bg-emerald-50"}`}>{q.load}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-amber-50 to-orange-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900 flex items-center gap-2">
                            <Megaphone className="h-5 w-5 text-amber-600" />
                            {editingId ? "Edit Broadcast" : "New Broadcast"}
                        </SheetTitle>
                        <p className="text-[12px] text-slate-500">Send a global announcement or critical alert.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Title <span className="text-rose-500">*</span></Label>
                            <Input value={form.title} onChange={e => setField("title", e.target.value)} placeholder="e.g. Planned Infrastructure Upgrade" className={`h-10 rounded-none ${errors.title ? "border-rose-500" : ""}`} />
                            {errors.title && <p className="text-[11px] text-rose-500">{errors.title}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Target Segment / Scope</Label>
                            <Select value={form.scope} onValueChange={(v: any) => setField("scope", v)}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="All Accounts">All Accounts</SelectItem>
                                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                                    <SelectItem value="Free Tier">Free Tier</SelectItem>
                                    <SelectItem value="Region: North America">Region: North America</SelectItem>
                                    <SelectItem value="Region: EU">Region: EU</SelectItem>
                                    <SelectItem value="Region: APAC">Region: APAC</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Severity</Label>
                                <Select value={form.severity} onValueChange={(v: any) => setField("severity", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Critical">Critical</SelectItem>
                                        <SelectItem value="Warning">Warning</SelectItem>
                                        <SelectItem value="Info">Info</SelectItem>
                                        <SelectItem value="Broadcast">Broadcast</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Status</Label>
                                <Select value={form.status} onValueChange={(v: any) => setField("status", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Draft">Draft</SelectItem>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Target Reach</Label>
                                <Input type="number" value={form.targetReach} onChange={e => setField("targetReach", e.target.value)} className={`h-10 rounded-none ${errors.targetReach ? "border-rose-500" : ""}`} />
                                {errors.targetReach && <p className="text-[11px] text-rose-500">{errors.targetReach}</p>}
                            </div>
                            {form.status === 'Scheduled' && (
                                <div className="space-y-1.5">
                                    <Label className="text-[12px] font-semibold">Scheduled For</Label>
                                    <Input type="date" value={form.scheduledFor} onChange={e => setField("scheduledFor", e.target.value)} className="h-10 rounded-none" />
                                </div>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Message Payload <span className="text-rose-500">*</span></Label>
                            <Textarea value={form.message} onChange={e => setField("message", e.target.value)} placeholder="Global announcement payload..." className={`min-h-[140px] rounded-none ${errors.message ? "border-rose-500" : ""}`} />
                            {errors.message && <p className="text-[11px] text-rose-500">{errors.message}</p>}
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-amber-600 hover:bg-amber-700 text-white rounded-none" onClick={handleSave}>
                            <Send className="h-4 w-4 mr-2" />{editingId ? "Save" : "Dispatch"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-amber-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Broadcasts</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Severity</Label>
                            <Select value={severityFilter} onValueChange={setSeverityFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Severities</SelectItem>
                                    <SelectItem value="Critical">Critical</SelectItem>
                                    <SelectItem value="Warning">Warning</SelectItem>
                                    <SelectItem value="Info">Info</SelectItem>
                                    <SelectItem value="Broadcast">Broadcast</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Scope</Label>
                            <Select value={scopeFilter} onValueChange={setScopeFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Scopes</SelectItem>
                                    <SelectItem value="All Accounts">All Accounts</SelectItem>
                                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                                    <SelectItem value="Free Tier">Free Tier</SelectItem>
                                    <SelectItem value="Region: North America">North America</SelectItem>
                                    <SelectItem value="Region: EU">EU</SelectItem>
                                    <SelectItem value="Region: APAC">APAC</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setSeverityFilter("all"); setScopeFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-amber-600 hover:bg-amber-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-amber-50">
                        <SheetTitle className="text-[18px] font-semibold">Broadcast Detail</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Title</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.title}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Scope</p><p className="font-semibold text-slate-900 text-sm">{selected.scope}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Severity</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${getSeverityProps(selected.severity).color}`}>{selected.severity}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${getStatusColor(selected.status)}`}>{selected.status}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Reach</p><p className="font-semibold text-slate-900">{selected.targetReach.toLocaleString()}</p></div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">Sent</p><p className="font-semibold text-slate-900 text-sm flex items-center gap-1"><Clock className="h-3 w-3" />{selected.sentAt}</p></div>
                                </div>
                                <div className="border-t pt-3">
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-2">Message Payload</p>
                                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-none">
                                        <p className="text-[13px] text-slate-700">{selected.message}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsDetailOpen(false); openEdit(selected) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDelete(selected.id); setIsDetailOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" />Halt
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
