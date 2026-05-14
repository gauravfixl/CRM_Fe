"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Plus, Search, RefreshCw, Download, Headphones,
    Trash2, PencilLine, Filter, MoreVertical, Eye,
    MessageCircle, Activity, CheckCircle2, AlertCircle, Zap,
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

type SupportTool = {
    id: string
    name: string
    provider: 'Zendesk' | 'Intercom' | 'Freshdesk' | 'Help Scout' | 'Salesforce Service' | 'Front'
    workspace: string
    status: 'Connected' | 'Disconnected' | 'Error'
    enabled: boolean
    ticketsSynced: number
    openTickets: number
    avgResolution: string
    sla: number
    apiKey: string
    webhookUrl: string
}

const INITIAL: SupportTool[] = [
    { id: "SP-001", name: "Zendesk Production", provider: "Zendesk", workspace: "fixl.zendesk.com", status: "Connected", enabled: true, ticketsSynced: 12420, openTickets: 184, avgResolution: "4h 12m", sla: 96, apiKey: "zd_8k2x...4mq", webhookUrl: "https://api.fixl.io/hooks/zd" },
    { id: "SP-002", name: "Intercom Messenger", provider: "Intercom", workspace: "fixl-app", status: "Connected", enabled: true, ticketsSynced: 8240, openTickets: 92, avgResolution: "2h 48m", sla: 92, apiKey: "ic_pmq8...x4n", webhookUrl: "https://api.fixl.io/hooks/ic" },
    { id: "SP-003", name: "Freshdesk Enterprise", provider: "Freshdesk", workspace: "fixl.freshdesk.com", status: "Connected", enabled: true, ticketsSynced: 4380, openTickets: 51, avgResolution: "5h 32m", sla: 88, apiKey: "fd_3z9p...8kn", webhookUrl: "https://api.fixl.io/hooks/fd" },
    { id: "SP-004", name: "Help Scout Mailbox", provider: "Help Scout", workspace: "fixl-support", status: "Connected", enabled: true, ticketsSynced: 1820, openTickets: 24, avgResolution: "3h 15m", sla: 94, apiKey: "hs_v2x4...9mq", webhookUrl: "https://api.fixl.io/hooks/hs" },
    { id: "SP-005", name: "Front Inbox", provider: "Front", workspace: "fixl.frontapp.com", status: "Disconnected", enabled: false, ticketsSynced: 0, openTickets: 0, avgResolution: "—", sla: 0, apiKey: "fr_x8m2...4pn", webhookUrl: "https://api.fixl.io/hooks/fr" },
]

const PROVIDERS: SupportTool['provider'][] = ["Zendesk", "Intercom", "Freshdesk", "Help Scout", "Salesforce Service", "Front"]

const PROVIDER_COLORS: Record<string, string> = {
    Zendesk: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Intercom: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Freshdesk: "bg-cyan-50 text-cyan-600 border-cyan-100",
    "Help Scout": "bg-blue-50 text-blue-600 border-blue-100",
    "Salesforce Service": "bg-sky-50 text-sky-600 border-sky-100",
    Front: "bg-violet-50 text-violet-600 border-violet-100",
}

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    url: (v: string) => v && !/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)/i.test(v) ? "Enter a valid URL" : "",
}

export default function SupportIntegrationsPage() {
    const router = useRouter()
    const [tools, setTools] = React.useState<SupportTool[]>(INITIAL)
    const [search, setSearch] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [selected, setSelected] = React.useState<SupportTool | null>(null)

    const [form, setForm] = React.useState({
        name: "", provider: "Zendesk" as SupportTool['provider'], workspace: "", apiKey: "", webhookUrl: "",
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const stats = React.useMemo(() => ({
        active: tools.filter(t => t.enabled).length,
        totalTickets: tools.reduce((a, t) => a + t.ticketsSynced, 0),
        openTickets: tools.reduce((a, t) => a + t.openTickets, 0),
        avgSla: tools.length ? Math.round(tools.filter(t => t.sla > 0).reduce((a, t) => a + t.sla, 0) / Math.max(1, tools.filter(t => t.sla > 0).length)) : 0,
    }), [tools])

    const filtered = React.useMemo(() => tools.filter(t => {
        const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.provider.toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === "all" || t.status === statusFilter
        return matchSearch && matchStatus
    }), [tools, search, statusFilter])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(3)(form.name)
        errs.workspace = validators.required(form.workspace)
        errs.apiKey = validators.required(form.apiKey) || validators.minLen(6)(form.apiKey)
        errs.webhookUrl = validators.required(form.webhookUrl) || validators.url(form.webhookUrl)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", provider: "Zendesk", workspace: "", apiKey: "", webhookUrl: "" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (t: SupportTool) => {
        setEditingId(t.id)
        setForm({ name: t.name, provider: t.provider, workspace: t.workspace, apiKey: t.apiKey, webhookUrl: t.webhookUrl })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setTools(tools.map(t => t.id === editingId ? { ...t, name: form.name.trim(), provider: form.provider, workspace: form.workspace, apiKey: form.apiKey, webhookUrl: form.webhookUrl } : t))
            toast.success("Support tool updated")
        } else {
            const t: SupportTool = {
                id: `SP-${String(tools.length + 1).padStart(3, "0")}`,
                name: form.name.trim(), provider: form.provider, workspace: form.workspace,
                status: "Connected", enabled: true, ticketsSynced: 0, openTickets: 0,
                avgResolution: "—", sla: 90, apiKey: form.apiKey, webhookUrl: form.webhookUrl,
            }
            setTools([t, ...tools])
            toast.success(`${t.provider} connected`)
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: string) => {
        setTools(tools.filter(t => t.id !== id))
        toast.success("Support tool removed")
    }

    const handleToggle = (id: string, current: boolean) => {
        setTools(tools.map(t => t.id === id ? { ...t, enabled: !current, status: !current ? "Connected" : "Disconnected" } : t))
        toast.success(current ? "Integration disabled" : "Integration enabled")
    }

    const handleSyncNow = (t: SupportTool) => {
        toast.success(`Syncing ${t.name}...`)
        setTimeout(() => toast.success(`${t.name} sync complete`), 1200)
    }

    const handleExport = () => {
        const csv = [["ID", "Name", "Provider", "Workspace", "Status", "Tickets", "Open", "SLA"], ...tools.map(t => [t.id, t.name, t.provider, t.workspace, t.status, t.ticketsSynced, t.openTickets, t.sla])].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = "support-integrations.csv"; a.click(); URL.revokeObjectURL(url)
        toast.success("Integrations exported")
    }

    const openDetail = (t: SupportTool) => { setSelected(t); setIsDetailOpen(true) }

    const kpiCards = [
        { title: "Active Integrations", value: String(stats.active), subtitle: `${tools.length} configured`, icon: Headphones, color: "emerald", trend: `+${stats.active}`, path: "/client-management/integrations/support" },
        { title: "Tickets Synced", value: stats.totalTickets.toLocaleString(), subtitle: "Across all platforms", icon: MessageCircle, color: "indigo", trend: "+22%", path: "/client-management/lifecycle/support" },
        { title: "Open Tickets", value: stats.openTickets.toLocaleString(), subtitle: "Needs response", icon: AlertCircle, color: "amber", trend: "-8%", path: "/client-management/lifecycle/support" },
        { title: "Avg. SLA", value: `${stats.avgSla}%`, subtitle: "Compliance rate", icon: CheckCircle2, color: "violet", trend: "+2%", path: "/client-management/analytics/customer" },
    ]
    const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        indigo: { bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", border: "border-indigo-200/50", text: "text-indigo-600", iconBg: "bg-indigo-100" },
        violet: { bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", border: "border-violet-200/50", text: "text-violet-600", iconBg: "bg-violet-100" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", border: "border-amber-200/50", text: "text-amber-600", iconBg: "bg-amber-100" },
    }

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Support <span className="text-emerald-600">Tools</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Connect Zendesk, Intercom, Freshdesk, and other helpdesk platforms.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />Export
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />Connect Tool
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
                                <CardTitle className="text-base font-semibold">Support Integrations</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length}</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search tools..." value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-6 py-3">Integration</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Tickets</th>
                                            <th className="px-6 py-3">SLA</th>
                                            <th className="px-6 py-3">Enabled</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.length > 0 ? filtered.map(t => (
                                            <tr key={t.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(t)}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-9 w-9 rounded-none border flex items-center justify-center ${PROVIDER_COLORS[t.provider]}`}>
                                                            <Headphones className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                                                            <p className="text-[11px] text-slate-500">{t.provider} • {t.workspace}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${t.status === "Connected" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : t.status === "Error" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-slate-600 border-slate-100"}`}>{t.status}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900">{t.ticketsSynced.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Progress value={t.sla} className="w-16 h-1.5" />
                                                        <span className="text-xs font-bold text-slate-900">{t.sla}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <Switch checked={t.enabled} onCheckedChange={() => handleToggle(t.id, t.enabled)} className="data-[state=checked]:bg-emerald-600" />
                                                </td>
                                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-none">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44 rounded-none">
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleSyncNow(t)}>
                                                                <RefreshCw className="h-4 w-4" /> Sync Now
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(t)}>
                                                                <PencilLine className="h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openDetail(t)}>
                                                                <Eye className="h-4 w-4" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDelete(t.id)}>
                                                                <Trash2 className="h-4 w-4" /> Disconnect
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">No support tools match your filters.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">Ticket Distribution</CardTitle>
                                <p className="text-sm text-slate-500 mt-1">Synced volume by provider</p>
                            </div>
                            <Activity className="h-5 w-5 text-slate-400" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {PROVIDERS.map((p, idx) => {
                                const list = tools.filter(t => t.provider === p)
                                const total = list.reduce((sum, t) => sum + t.ticketsSynced, 0)
                                const max = Math.max(...tools.map(t => t.ticketsSynced), 1)
                                const progress = Math.min(100, total / max * 100)
                                return (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-slate-700">{p} <span className="text-slate-400 font-medium ml-2">{list.length} Active</span></span>
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
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Fastest Response Times</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[...tools].filter(t => t.sla > 0).sort((a, b) => b.sla - a.sla).slice(0, 4).map((t, idx) => (
                                <div key={idx} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-2 transition" onClick={() => openDetail(t)}>
                                    <div className="flex items-center gap-3">
                                        <div className={`h-9 w-9 rounded-none border flex items-center justify-center text-[10px] font-bold ${PROVIDER_COLORS[t.provider]}`}>
                                            {t.provider.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 leading-none">{t.name}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{t.avgResolution}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-900">{t.sla}%</p>
                                        <div className="flex items-center gap-1 justify-end mt-1">
                                            <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                                            <span className="text-[9px] font-bold text-emerald-600">SLA</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-xs font-bold text-emerald-600 hover:text-emerald-700 rounded-none mt-3" onClick={() => router.push('/client-management/lifecycle/support')}>
                                View Support Dashboard
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-emerald-100 bg-emerald-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-emerald-600 tracking-wider flex items-center gap-2 uppercase">
                                <Zap className="h-4 w-4" /> Tips
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-emerald-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    Enable <span className="text-emerald-600 font-bold">2-way sync</span> to mirror ticket replies back into the CRM.
                                </p>
                            </div>
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-none" onClick={() => router.push('/client-management/integrations/webhooks')}>
                                Setup Webhooks
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-emerald-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Integration" : "Connect Support Tool"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Sync tickets and customer conversations.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Integration Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g., Zendesk Production" className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`} />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Provider</Label>
                            <Select value={form.provider} onValueChange={(v: any) => setField("provider", v)}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {PROVIDERS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Workspace / Subdomain <span className="text-rose-500">*</span></Label>
                            <Input value={form.workspace} onChange={e => setField("workspace", e.target.value)} placeholder="e.g., yourcompany.zendesk.com" className={`h-10 rounded-none ${errors.workspace ? "border-rose-500" : ""}`} />
                            {errors.workspace && <p className="text-[11px] text-rose-500">{errors.workspace}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">API Key <span className="text-rose-500">*</span></Label>
                            <Input type="password" value={form.apiKey} onChange={e => setField("apiKey", e.target.value)} placeholder="Enter API token" className={`h-10 rounded-none font-mono text-xs ${errors.apiKey ? "border-rose-500" : ""}`} />
                            {errors.apiKey && <p className="text-[11px] text-rose-500">{errors.apiKey}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Webhook URL <span className="text-rose-500">*</span></Label>
                            <Input value={form.webhookUrl} onChange={e => setField("webhookUrl", e.target.value)} placeholder="https://api.example.com/webhook" className={`h-10 rounded-none ${errors.webhookUrl ? "border-rose-500" : ""}`} />
                            {errors.webhookUrl && <p className="text-[11px] text-rose-500">{errors.webhookUrl}</p>}
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none" onClick={handleSave}>
                            {editingId ? "Save Changes" : "Connect"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-emerald-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Tools</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Status</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="Connected">Connected</SelectItem>
                                    <SelectItem value="Disconnected">Disconnected</SelectItem>
                                    <SelectItem value="Error">Error</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setStatusFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-emerald-50">
                        <SheetTitle className="text-[18px] font-semibold">Integration Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Integration</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                                    <p className="text-sm text-slate-500">{selected.provider}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">ID</p><p className="font-semibold text-slate-900">{selected.id}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${selected.status === "Connected" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : selected.status === "Error" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-slate-600 border-slate-100"}`}>{selected.status}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Tickets</p><p className="font-semibold text-slate-900">{selected.ticketsSynced.toLocaleString()}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Open</p><p className="font-semibold text-slate-900">{selected.openTickets}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">SLA</p><p className="font-semibold text-slate-900">{selected.sla}%</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Avg Resolution</p><p className="font-semibold text-slate-900">{selected.avgResolution}</p></div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">Workspace</p><p className="font-semibold text-slate-900">{selected.workspace}</p></div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">Webhook</p><p className="font-mono text-xs text-slate-900 break-all">{selected.webhookUrl}</p></div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsDetailOpen(false); openEdit(selected) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDelete(selected.id); setIsDetailOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" />Disconnect
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
