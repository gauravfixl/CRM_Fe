"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Plus, Search, RefreshCw, Download, ArrowLeftRight,
    Trash2, PencilLine, Filter, MoreVertical, Eye,
    Activity, CheckCircle2, AlertCircle, Database, Zap,
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

type Mapping = {
    id: string
    name: string
    sourceSystem: string
    targetSystem: string
    sourceField: string
    targetField: string
    transform: 'None' | 'Uppercase' | 'Lowercase' | 'Trim' | 'Date Format'
    direction: 'Bidirectional' | 'Source to Target' | 'Target to Source'
    status: 'Active' | 'Paused' | 'Error'
    enabled: boolean
    syncedRecords: number
    errors: number
    lastSync: string
}

const SYSTEMS = ["Salesforce", "HubSpot", "Stripe", "Intercom", "MailChimp", "Zoho", "Internal CRM"]

const INITIAL: Mapping[] = [
    { id: "DM-001", name: "Contact Email Sync", sourceSystem: "Salesforce", targetSystem: "Internal CRM", sourceField: "Email", targetField: "email", transform: "Lowercase", direction: "Bidirectional", status: "Active", enabled: true, syncedRecords: 4820, errors: 0, lastSync: "5 min ago" },
    { id: "DM-002", name: "Company Name", sourceSystem: "HubSpot", targetSystem: "Internal CRM", sourceField: "company", targetField: "organization", transform: "Trim", direction: "Source to Target", status: "Active", enabled: true, syncedRecords: 2310, errors: 2, lastSync: "12 min ago" },
    { id: "DM-003", name: "Deal Amount", sourceSystem: "Internal CRM", targetSystem: "Stripe", sourceField: "deal.value", targetField: "amount_total", transform: "None", direction: "Source to Target", status: "Error", enabled: true, syncedRecords: 880, errors: 14, lastSync: "2 hr ago" },
    { id: "DM-004", name: "Subscriber Status", sourceSystem: "MailChimp", targetSystem: "Internal CRM", sourceField: "status", targetField: "newsletter_status", transform: "Uppercase", direction: "Source to Target", status: "Active", enabled: true, syncedRecords: 1540, errors: 0, lastSync: "1 hr ago" },
    { id: "DM-005", name: "Created Date", sourceSystem: "Intercom", targetSystem: "Internal CRM", sourceField: "created_at", targetField: "createdAt", transform: "Date Format", direction: "Source to Target", status: "Paused", enabled: false, syncedRecords: 680, errors: 0, lastSync: "2 days ago" },
]

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
}

export default function DataSyncPage() {
    const router = useRouter()
    const [mappings, setMappings] = React.useState<Mapping[]>(INITIAL)
    const [search, setSearch] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [selected, setSelected] = React.useState<Mapping | null>(null)

    const [form, setForm] = React.useState({
        name: "", sourceSystem: "Salesforce", targetSystem: "Internal CRM",
        sourceField: "", targetField: "", transform: "None" as Mapping['transform'],
        direction: "Bidirectional" as Mapping['direction'],
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const stats = React.useMemo(() => ({
        active: mappings.filter(m => m.enabled).length,
        records: mappings.reduce((a, m) => a + m.syncedRecords, 0),
        errors: mappings.reduce((a, m) => a + m.errors, 0),
        systems: new Set([...mappings.map(m => m.sourceSystem), ...mappings.map(m => m.targetSystem)]).size,
    }), [mappings])

    const filtered = React.useMemo(() => mappings.filter(m => {
        const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.sourceField.toLowerCase().includes(search.toLowerCase()) || m.targetField.toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === "all" || m.status === statusFilter
        return matchSearch && matchStatus
    }), [mappings, search, statusFilter])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(3)(form.name)
        errs.sourceField = validators.required(form.sourceField)
        errs.targetField = validators.required(form.targetField)
        if (form.sourceSystem === form.targetSystem) errs.targetSystem = "Source and target must differ"
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", sourceSystem: "Salesforce", targetSystem: "Internal CRM", sourceField: "", targetField: "", transform: "None", direction: "Bidirectional" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (m: Mapping) => {
        setEditingId(m.id)
        setForm({ name: m.name, sourceSystem: m.sourceSystem, targetSystem: m.targetSystem, sourceField: m.sourceField, targetField: m.targetField, transform: m.transform, direction: m.direction })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setMappings(mappings.map(m => m.id === editingId ? { ...m, ...form, name: form.name.trim() } : m))
            toast.success("Mapping rule updated")
        } else {
            const m: Mapping = {
                id: `DM-${String(mappings.length + 1).padStart(3, "0")}`,
                name: form.name.trim(), sourceSystem: form.sourceSystem, targetSystem: form.targetSystem,
                sourceField: form.sourceField, targetField: form.targetField,
                transform: form.transform, direction: form.direction,
                status: "Active", enabled: true, syncedRecords: 0, errors: 0, lastSync: "Never",
            }
            setMappings([m, ...mappings])
            toast.success("Mapping rule created")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: string) => {
        setMappings(mappings.filter(m => m.id !== id))
        toast.success("Mapping removed")
    }

    const handleToggle = (id: string, current: boolean) => {
        setMappings(mappings.map(m => m.id === id ? { ...m, enabled: !current, status: !current ? "Active" : "Paused" } : m))
        toast.success(current ? "Mapping paused" : "Mapping activated")
    }

    const handleRunSync = (m: Mapping) => {
        toast.success(`Running sync: ${m.name}...`)
        setTimeout(() => {
            setMappings(prev => prev.map(x => x.id === m.id ? { ...x, lastSync: "Just now", errors: 0 } : x))
            toast.success(`${m.name} sync complete`)
        }, 1200)
    }

    const handleExport = () => {
        const csv = [["ID", "Name", "Source System", "Source Field", "Target System", "Target Field", "Transform", "Direction", "Status"], ...mappings.map(m => [m.id, m.name, m.sourceSystem, m.sourceField, m.targetSystem, m.targetField, m.transform, m.direction, m.status])].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = "data-mappings.csv"; a.click(); URL.revokeObjectURL(url)
        toast.success("Mappings exported")
    }

    const openDetail = (m: Mapping) => { setSelected(m); setIsDetailOpen(true) }

    const kpiCards = [
        { title: "Active Mappings", value: String(stats.active), subtitle: `${mappings.length} total rules`, icon: ArrowLeftRight, color: "indigo", trend: `+${stats.active}`, path: "/client-management/integrations/data-sync" },
        { title: "Records Synced", value: stats.records.toLocaleString(), subtitle: "Last 30 days", icon: Database, color: "emerald", trend: "+22%", path: "/client-management/integrations/crm" },
        { title: "Sync Errors", value: String(stats.errors), subtitle: "Needs review", icon: AlertCircle, color: stats.errors > 0 ? "rose" : "violet", trend: stats.errors > 0 ? "Alert" : "Clean", path: "/client-management/integrations/data-sync" },
        { title: "Connected Systems", value: String(stats.systems), subtitle: "Source + target", icon: CheckCircle2, color: "violet", trend: "+1", path: "/client-management/integrations/marketplace" },
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
                        Data Sync <span className="text-indigo-600">Mapping</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Define how data flows and transforms between connected systems.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />Export
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />Add Rule
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
                                <CardTitle className="text-base font-semibold">Field Mappings</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length}</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search mappings..." value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-6 py-3">Mapping</th>
                                            <th className="px-6 py-3">Flow</th>
                                            <th className="px-6 py-3">Records</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Enabled</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.length > 0 ? filtered.map(m => (
                                            <tr key={m.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(m)}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-none bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                                            <ArrowLeftRight className="h-4 w-4 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                                                            <p className="text-[11px] font-mono text-slate-500">{m.sourceField} → {m.targetField}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1 text-[11px] font-semibold">
                                                        <Badge className="rounded-none bg-slate-100 text-slate-700">{m.sourceSystem}</Badge>
                                                        <span className="text-slate-400">→</span>
                                                        <Badge className="rounded-none bg-slate-100 text-slate-700">{m.targetSystem}</Badge>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900">{m.syncedRecords.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${m.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : m.status === "Error" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>{m.status}</span>
                                                </td>
                                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <Switch checked={m.enabled} onCheckedChange={() => handleToggle(m.id, m.enabled)} className="data-[state=checked]:bg-indigo-600" />
                                                </td>
                                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-none">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44 rounded-none">
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleRunSync(m)}>
                                                                <RefreshCw className="h-4 w-4" /> Run Sync
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(m)}>
                                                                <PencilLine className="h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openDetail(m)}>
                                                                <Eye className="h-4 w-4" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDelete(m.id)}>
                                                                <Trash2 className="h-4 w-4" /> Remove
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">No mappings match your filters.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">System Volume</CardTitle>
                                <p className="text-sm text-slate-500 mt-1">Records synced per source system</p>
                            </div>
                            <Database className="h-5 w-5 text-slate-400" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {SYSTEMS.slice(0, 6).map((s, idx) => {
                                const list = mappings.filter(m => m.sourceSystem === s)
                                const total = list.reduce((sum, m) => sum + m.syncedRecords, 0)
                                const max = Math.max(...mappings.map(m => m.syncedRecords), 1)
                                const progress = Math.min(100, total / max * 100)
                                return (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-slate-700">{s} <span className="text-slate-400 font-medium ml-2">{list.length} Rules</span></span>
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
                            {mappings.slice(0, 4).map((m, idx) => (
                                <div key={idx} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-2 transition" onClick={() => openDetail(m)}>
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-none bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                                            {m.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 leading-none">{m.name}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{m.lastSync}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-900">{m.syncedRecords.toLocaleString()}</p>
                                        <div className="flex items-center gap-1 justify-end mt-1">
                                            <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                                            <span className="text-[9px] font-bold text-emerald-600">{m.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-indigo-100 bg-indigo-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-indigo-600 tracking-wider flex items-center gap-2 uppercase">
                                <Zap className="h-4 w-4" /> Mapping Tips
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    Use <span className="text-indigo-600 font-bold">Trim</span> transforms to clean leading/trailing whitespace.
                                </p>
                            </div>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={() => router.push('/client-management/integrations/crm')}>
                                Manage CRM Connections
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Mapping" : "Create Field Mapping"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Define how data flows between systems.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Mapping Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g., Contact Email Sync" className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`} />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Source System</Label>
                                <Select value={form.sourceSystem} onValueChange={v => setField("sourceSystem", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        {SYSTEMS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Target System</Label>
                                <Select value={form.targetSystem} onValueChange={v => setField("targetSystem", v)}>
                                    <SelectTrigger className={`h-10 rounded-none ${errors.targetSystem ? "border-rose-500" : ""}`}><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        {SYSTEMS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {errors.targetSystem && <p className="text-[11px] text-rose-500">{errors.targetSystem}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Source Field <span className="text-rose-500">*</span></Label>
                                <Input value={form.sourceField} onChange={e => setField("sourceField", e.target.value)} placeholder="e.g., Email" className={`h-10 rounded-none font-mono text-xs ${errors.sourceField ? "border-rose-500" : ""}`} />
                                {errors.sourceField && <p className="text-[11px] text-rose-500">{errors.sourceField}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Target Field <span className="text-rose-500">*</span></Label>
                                <Input value={form.targetField} onChange={e => setField("targetField", e.target.value)} placeholder="e.g., email" className={`h-10 rounded-none font-mono text-xs ${errors.targetField ? "border-rose-500" : ""}`} />
                                {errors.targetField && <p className="text-[11px] text-rose-500">{errors.targetField}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Transform</Label>
                                <Select value={form.transform} onValueChange={(v: any) => setField("transform", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="None">None</SelectItem>
                                        <SelectItem value="Uppercase">Uppercase</SelectItem>
                                        <SelectItem value="Lowercase">Lowercase</SelectItem>
                                        <SelectItem value="Trim">Trim</SelectItem>
                                        <SelectItem value="Date Format">Date Format</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Direction</Label>
                                <Select value={form.direction} onValueChange={(v: any) => setField("direction", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Bidirectional">Bidirectional</SelectItem>
                                        <SelectItem value="Source to Target">Source → Target</SelectItem>
                                        <SelectItem value="Target to Source">Target → Source</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>
                            {editingId ? "Save Changes" : "Create Mapping"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Mappings</SheetTitle>
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
                                    <SelectItem value="Error">Error</SelectItem>
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
                        <SheetTitle className="text-[18px] font-semibold">Mapping Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Mapping</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                                    <p className="text-xs font-mono text-slate-500 mt-1">{selected.sourceField} → {selected.targetField}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Source</p><p className="font-semibold text-slate-900">{selected.sourceSystem}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Target</p><p className="font-semibold text-slate-900">{selected.targetSystem}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Direction</p><Badge className="rounded-none">{selected.direction}</Badge></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Transform</p><Badge className="rounded-none">{selected.transform}</Badge></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Records</p><p className="font-semibold text-slate-900">{selected.syncedRecords.toLocaleString()}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Errors</p><p className="font-semibold text-slate-900">{selected.errors}</p></div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">Last Sync</p><p className="font-semibold text-slate-900">{selected.lastSync}</p></div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => handleRunSync(selected)}>
                                    <RefreshCw className="h-4 w-4 mr-2" />Sync
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
