"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Plus, Search, RefreshCw, Download, Link2,
    Clock, Activity, Trash2, PencilLine,
    AlertCircle, Database, Play, Filter,
    MoreVertical, Eye, Zap, CheckCircle2,
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

type CrmSync = {
    id: string
    name: string
    platform: string
    status: 'Active' | 'Paused' | 'Error'
    lastSync: string
    records: number
    errors: number
    enabled: boolean
    direction: 'Bidirectional' | 'Import' | 'Export'
    endpoint: string
}

const INITIAL_SYNCS: CrmSync[] = [
    { id: "CS-001", name: "Salesforce main sync", platform: "Salesforce", status: "Active", lastSync: "5 min ago", records: 4820, errors: 0, enabled: true, direction: "Bidirectional", endpoint: "https://api.salesforce.com/v52" },
    { id: "CS-002", name: "HubSpot contact sync", platform: "HubSpot", status: "Active", lastSync: "12 min ago", records: 2310, errors: 2, enabled: true, direction: "Import", endpoint: "https://api.hubapi.com" },
    { id: "CS-003", name: "Pipedrive deals sync", platform: "Pipedrive", status: "Error", lastSync: "2 hr ago", records: 880, errors: 14, enabled: true, direction: "Export", endpoint: "https://api.pipedrive.com/v1" },
    { id: "CS-004", name: "Zoho contact import", platform: "Zoho CRM", status: "Active", lastSync: "1 hr ago", records: 1540, errors: 0, enabled: true, direction: "Import", endpoint: "https://www.zohoapis.com/crm" },
    { id: "CS-005", name: "Microsoft Dynamics", platform: "MS Dynamics", status: "Paused", lastSync: "2 days ago", records: 680, errors: 0, enabled: false, direction: "Bidirectional", endpoint: "https://api.dynamics.com" },
]

const PLATFORMS = ["Salesforce", "HubSpot", "Pipedrive", "Zoho CRM", "MS Dynamics", "Freshsales"]
const DIRECTIONS: CrmSync['direction'][] = ["Bidirectional", "Import", "Export"]

const PLATFORM_COLORS: Record<string, string> = {
    Salesforce: "bg-blue-50 text-blue-600 border-blue-100",
    HubSpot: "bg-orange-50 text-orange-600 border-orange-100",
    Pipedrive: "bg-emerald-50 text-emerald-600 border-emerald-100",
    "Zoho CRM": "bg-rose-50 text-rose-600 border-rose-100",
    "MS Dynamics": "bg-indigo-50 text-indigo-600 border-indigo-100",
    Freshsales: "bg-violet-50 text-violet-600 border-violet-100",
}

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    url: (v: string) => v && !/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)/i.test(v) ? "Enter a valid URL" : "",
}

export default function CrmSyncPage() {
    const router = useRouter()
    const [syncs, setSyncs] = React.useState<CrmSync[]>(INITIAL_SYNCS)
    const [search, setSearch] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [selected, setSelected] = React.useState<CrmSync | null>(null)

    const [form, setForm] = React.useState({
        name: "", platform: "Salesforce", direction: "Bidirectional" as CrmSync['direction'], endpoint: "",
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const stats = React.useMemo(() => ({
        active: syncs.filter(s => s.enabled).length,
        totalRecords: syncs.reduce((a, s) => a + s.records, 0),
        totalErrors: syncs.reduce((a, s) => a + s.errors, 0),
        paused: syncs.filter(s => !s.enabled).length,
    }), [syncs])

    const filtered = React.useMemo(() => syncs.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.platform.toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === "all" || s.status.toLowerCase() === statusFilter
        return matchSearch && matchStatus
    }), [syncs, search, statusFilter])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(3)(form.name)
        errs.endpoint = validators.required(form.endpoint) || validators.url(form.endpoint)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", platform: "Salesforce", direction: "Bidirectional", endpoint: "" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (s: CrmSync) => {
        setEditingId(s.id)
        setForm({ name: s.name, platform: s.platform, direction: s.direction, endpoint: s.endpoint })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setSyncs(syncs.map(s => s.id === editingId ? { ...s, name: form.name.trim(), platform: form.platform, direction: form.direction, endpoint: form.endpoint } : s))
            toast.success("CRM sync updated")
        } else {
            const newSync: CrmSync = {
                id: `CS-${String(syncs.length + 1).padStart(3, "0")}`,
                name: form.name.trim(), platform: form.platform, status: "Active",
                lastSync: "Never", records: 0, errors: 0, enabled: true,
                direction: form.direction, endpoint: form.endpoint,
            }
            setSyncs([newSync, ...syncs])
            toast.success(`CRM sync "${newSync.name}" connected`)
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: string) => {
        setSyncs(syncs.filter(s => s.id !== id))
        toast.success("CRM sync disconnected")
    }

    const handleToggle = (id: string, current: boolean) => {
        setSyncs(syncs.map(s => s.id === id ? { ...s, enabled: !current, status: !current ? "Active" : "Paused" } : s))
        toast.success(current ? "Sync paused" : "Sync activated")
    }

    const handleRunSync = (id: string, name: string) => {
        setSyncs(syncs.map(s => s.id === id ? { ...s, lastSync: "Just now", errors: 0, status: "Active" } : s))
        toast.success(`${name} sync started`)
    }

    const handleSyncAll = () => {
        toast.success("Running all CRM syncs...")
        setTimeout(() => { setSyncs(syncs.map(s => s.enabled ? { ...s, lastSync: "Just now", errors: 0 } : s)); toast.success("All syncs completed") }, 1200)
    }

    const handleExport = () => {
        const csv = [["ID", "Name", "Platform", "Status", "Direction", "Records", "Errors", "Last Sync"], ...syncs.map(s => [s.id, s.name, s.platform, s.status, s.direction, s.records, s.errors, s.lastSync])].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = "crm-syncs.csv"; a.click(); URL.revokeObjectURL(url)
        toast.success("CRM syncs exported")
    }

    const openDetail = (s: CrmSync) => { setSelected(s); setIsDetailOpen(true) }

    const kpiCards = [
        { title: "Active Syncs", value: String(stats.active), subtitle: `${syncs.length} total connections`, icon: Link2, color: "indigo", trend: `+${stats.active}`, path: "/client-management/integrations/crm" },
        { title: "Records Synced", value: stats.totalRecords.toLocaleString(), subtitle: "Across all platforms", icon: Database, color: "emerald", trend: "+12%", path: "/client-management/integrations/data-sync" },
        { title: "Sync Errors", value: String(stats.totalErrors), subtitle: "Needs attention", icon: AlertCircle, color: stats.totalErrors > 0 ? "rose" : "violet", trend: stats.totalErrors > 0 ? `${stats.totalErrors} err` : "Clean", path: "/client-management/integrations/webhooks" },
        { title: "Paused Syncs", value: String(stats.paused), subtitle: "Disabled connections", icon: Activity, color: "amber", trend: "—", path: "/client-management/integrations/marketplace" },
    ]
    const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        indigo: { bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", border: "border-indigo-200/50", text: "text-indigo-600", iconBg: "bg-indigo-100" },
        violet: { bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", border: "border-violet-200/50", text: "text-violet-600", iconBg: "bg-violet-100" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", border: "border-amber-200/50", text: "text-amber-600", iconBg: "bg-amber-100" },
        rose: { bg: "bg-gradient-to-br from-rose-50 to-rose-100/50", border: "border-rose-200/50", text: "text-rose-600", iconBg: "bg-rose-100" },
    }

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        CRM <span className="text-indigo-600">Sync</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Connect and synchronize data across your CRM platforms in real time.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={handleSyncAll}>
                        <RefreshCw className="h-4 w-4 mr-2" />Sync All
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />Export
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />Connect CRM
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
                                <CardTitle className="text-base font-semibold">CRM Connections</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length} Active</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search syncs..." value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-6 py-3">Connection</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Records</th>
                                            <th className="px-6 py-3">Last Sync</th>
                                            <th className="px-6 py-3">Enabled</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.length > 0 ? filtered.map(s => (
                                            <tr key={s.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(s)}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-9 w-9 rounded-none border flex items-center justify-center ${PLATFORM_COLORS[s.platform] || "bg-slate-50 text-slate-400 border-slate-100"}`}>
                                                            <Link2 className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                                                            <p className="text-[11px] text-slate-500">{s.platform} • {s.direction}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${s.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : s.status === "Error" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>{s.status}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900">{s.records.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        <span className="text-[11px] font-semibold">{s.lastSync}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <Switch checked={s.enabled} onCheckedChange={() => handleToggle(s.id, s.enabled)} className="data-[state=checked]:bg-indigo-600" />
                                                </td>
                                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-none">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44 rounded-none">
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleRunSync(s.id, s.name)}>
                                                                <Play className="h-4 w-4" /> Run Sync
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(s)}>
                                                                <PencilLine className="h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openDetail(s)}>
                                                                <Eye className="h-4 w-4" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDelete(s.id)}>
                                                                <Trash2 className="h-4 w-4" /> Disconnect
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">No CRM syncs match your filters.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">Platform Distribution</CardTitle>
                                <p className="text-sm text-slate-500 mt-1">Records synced by CRM platform</p>
                            </div>
                            <Database className="h-5 w-5 text-slate-400" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {PLATFORMS.map((p, idx) => {
                                const list = syncs.filter(s => s.platform === p)
                                const total = list.reduce((sum, s) => sum + s.records, 0)
                                const max = Math.max(...syncs.map(s => s.records), 1)
                                const progress = Math.min(100, total / max * 100)
                                return (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-slate-700">{p} <span className="text-slate-400 font-medium ml-2">{list.length} Connections</span></span>
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
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Recent Sync Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {syncs.slice(0, 4).map((s, idx) => (
                                <div key={idx} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-2 transition" onClick={() => openDetail(s)}>
                                    <div className="flex items-center gap-3">
                                        <div className={`h-9 w-9 rounded-none border flex items-center justify-center text-[10px] font-bold ${PLATFORM_COLORS[s.platform] || "bg-slate-50 text-slate-400 border-slate-100"}`}>
                                            {s.platform.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 leading-none">{s.name}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{s.lastSync}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-900">{s.records.toLocaleString()}</p>
                                        <div className="flex items-center gap-1 justify-end mt-1">
                                            <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                                            <span className="text-[9px] font-bold text-emerald-600">{s.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-xs font-bold text-indigo-600 hover:text-indigo-700 rounded-none mt-3" onClick={() => router.push('/client-management/integrations/data-sync')}>
                                View Data Sync Mapping
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-indigo-100 bg-indigo-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-indigo-600 tracking-wider flex items-center gap-2 uppercase">
                                <Zap className="h-4 w-4" /> Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={() => router.push('/client-management/integrations/marketplace')}>
                                Browse App Marketplace
                            </Button>
                            <Button variant="outline" className="w-full rounded-none" onClick={() => router.push('/client-management/integrations/webhooks')}>
                                Configure Webhooks
                            </Button>
                            <Button variant="outline" className="w-full rounded-none" onClick={() => router.push('/client-management/integrations/api')}>
                                Manage API Keys
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit CRM Connection" : "Connect New CRM"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Configure your CRM data sync settings.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Connection Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g., Salesforce main sync" className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`} />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Platform</Label>
                                <Select value={form.platform} onValueChange={v => setField("platform", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        {PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Direction</Label>
                                <Select value={form.direction} onValueChange={(v: any) => setField("direction", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        {DIRECTIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">API Endpoint URL <span className="text-rose-500">*</span></Label>
                            <Input value={form.endpoint} onChange={e => setField("endpoint", e.target.value)} placeholder="https://api.example.com" className={`h-10 rounded-none ${errors.endpoint ? "border-rose-500" : ""}`} />
                            {errors.endpoint && <p className="text-[11px] text-rose-500">{errors.endpoint}</p>}
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>
                            {editingId ? "Save Changes" : "Connect"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Connections</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Status</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="paused">Paused</SelectItem>
                                    <SelectItem value="error">Error</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setStatusFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Connection Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Connection</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                                    <p className="text-sm text-slate-500">{selected.platform}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">ID</p><p className="font-semibold text-slate-900">{selected.id}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Direction</p><Badge className="rounded-none">{selected.direction}</Badge></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${selected.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : selected.status === "Error" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>{selected.status}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Records</p><p className="font-semibold text-slate-900">{selected.records.toLocaleString()}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Errors</p><p className="font-semibold text-slate-900">{selected.errors}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Last Sync</p><p className="font-semibold text-slate-900">{selected.lastSync}</p></div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">Endpoint</p><p className="font-semibold text-slate-900 text-xs break-all">{selected.endpoint}</p></div>
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
