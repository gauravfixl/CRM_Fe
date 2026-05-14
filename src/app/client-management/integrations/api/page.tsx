"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Plus, Search, RefreshCw, Download, Key,
    Trash2, PencilLine, Filter, MoreVertical, Eye,
    Shield, Activity, CheckCircle2, AlertCircle, Copy,
    EyeOff, Zap,
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

type ApiKey = {
    id: string
    name: string
    keyPreview: string
    keyFull: string
    scope: string
    status: 'Active' | 'Revoked' | 'Expired'
    requests: number
    rateLimit: number
    expiresAt: string
    enabled: boolean
    createdAt: string
    environment: 'Production' | 'Staging' | 'Development'
}

const genPreview = () => `ck_${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`
const genFull = () => `ck_live_${Math.random().toString(36).substring(2, 18)}${Math.random().toString(36).substring(2, 18)}`

const INITIAL: ApiKey[] = [
    { id: "AK-001", name: "Production API key", keyPreview: "ck_live_h7d2...9fk3", keyFull: "ck_live_h7d2x9p4mq8jk32lm9fk3", scope: "Full access", status: "Active", requests: 48200, rateLimit: 10000, expiresAt: "Dec 31, 2026", enabled: true, createdAt: "Jan 15, 2025", environment: "Production" },
    { id: "AK-002", name: "Mobile app key", keyPreview: "ck_live_m4p9...2xl8", keyFull: "ck_live_m4p9x8j2k7n5q3r2xl8", scope: "Read only", status: "Active", requests: 12400, rateLimit: 5000, expiresAt: "Jun 30, 2026", enabled: true, createdAt: "Feb 10, 2025", environment: "Production" },
    { id: "AK-003", name: "Webhook service key", keyPreview: "ck_live_w8r1...5qm7", keyFull: "ck_live_w8r1nk4j2x8p9m25qm7", scope: "Webhooks", status: "Active", requests: 8900, rateLimit: 2000, expiresAt: "Mar 15, 2026", enabled: true, createdAt: "Mar 01, 2025", environment: "Production" },
    { id: "AK-004", name: "Staging test key", keyPreview: "ck_test_s3x6...4jn2", keyFull: "ck_test_s3x6m9p2k4n8j7x4jn2", scope: "Full access", status: "Active", requests: 2100, rateLimit: 10000, expiresAt: "Dec 31, 2026", enabled: true, createdAt: "Jan 15, 2025", environment: "Staging" },
    { id: "AK-005", name: "Analytics read key", keyPreview: "ck_live_a1n8...7pq4", keyFull: "ck_live_a1n8k4j2m9p8x57pq4", scope: "Analytics", status: "Revoked", requests: 23400, rateLimit: 5000, expiresAt: "Expired", enabled: false, createdAt: "Oct 05, 2024", environment: "Production" },
]

const SCOPES = ["Full access", "Read only", "Webhooks", "Analytics", "Billing", "Contacts"]
const ENVIRONMENTS: ApiKey['environment'][] = ["Production", "Staging", "Development"]

const SCOPE_COLORS: Record<string, string> = {
    "Full access": "bg-rose-50 text-rose-600 border-rose-100",
    "Read only": "bg-slate-50 text-slate-600 border-slate-100",
    Webhooks: "bg-violet-50 text-violet-600 border-violet-100",
    Analytics: "bg-cyan-50 text-cyan-600 border-cyan-100",
    Billing: "bg-amber-50 text-amber-600 border-amber-100",
    Contacts: "bg-indigo-50 text-indigo-600 border-indigo-100",
}

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    number: (v: any) => v === "" || v === null || v === undefined ? "" : isNaN(Number(v)) ? "Enter a valid number" : Number(v) < 0 ? "Must be positive" : "",
}

export default function ApiKeysPage() {
    const router = useRouter()
    const [keys, setKeys] = React.useState<ApiKey[]>(INITIAL)
    const [search, setSearch] = React.useState("")
    const [envFilter, setEnvFilter] = React.useState("all")
    const [revealed, setRevealed] = React.useState<Set<string>>(new Set())

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [selected, setSelected] = React.useState<ApiKey | null>(null)

    const [form, setForm] = React.useState({
        name: "", scope: "Read only", environment: "Production" as ApiKey['environment'], rateLimit: "5000", expiresAt: "",
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const stats = React.useMemo(() => ({
        active: keys.filter(k => k.enabled).length,
        totalRequests: keys.reduce((a, k) => a + k.requests, 0),
        revoked: keys.filter(k => k.status === "Revoked").length,
        environments: new Set(keys.filter(k => k.enabled).map(k => k.environment)).size,
    }), [keys])

    const filtered = React.useMemo(() => keys.filter(k => {
        const matchSearch = k.name.toLowerCase().includes(search.toLowerCase()) || k.scope.toLowerCase().includes(search.toLowerCase())
        const matchEnv = envFilter === "all" || k.environment === envFilter
        return matchSearch && matchEnv
    }), [keys, search, envFilter])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(3)(form.name)
        errs.rateLimit = validators.required(form.rateLimit) || validators.number(form.rateLimit)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", scope: "Read only", environment: "Production", rateLimit: "5000", expiresAt: "" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (k: ApiKey) => {
        setEditingId(k.id)
        setForm({ name: k.name, scope: k.scope, environment: k.environment, rateLimit: String(k.rateLimit), expiresAt: k.expiresAt })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setKeys(keys.map(k => k.id === editingId ? { ...k, name: form.name.trim(), scope: form.scope, environment: form.environment, rateLimit: Number(form.rateLimit), expiresAt: form.expiresAt || k.expiresAt } : k))
            toast.success("API key updated")
        } else {
            const full = genFull()
            const k: ApiKey = {
                id: `AK-${String(keys.length + 1).padStart(3, "0")}`,
                name: form.name.trim(), keyPreview: genPreview(), keyFull: full,
                scope: form.scope, status: "Active", requests: 0,
                rateLimit: Number(form.rateLimit),
                expiresAt: form.expiresAt || "Dec 31, 2026",
                enabled: true, createdAt: new Date().toLocaleDateString(),
                environment: form.environment,
            }
            setKeys([k, ...keys])
            toast.success(`API key generated: ${full.slice(0, 16)}...`)
            navigator.clipboard?.writeText(full).catch(() => { })
        }
        setIsFormOpen(false)
    }

    const handleRevoke = (id: string) => {
        setKeys(keys.map(k => k.id === id ? { ...k, status: "Revoked", enabled: false } : k))
        toast.success("API key revoked")
    }

    const handleDelete = (id: string) => {
        setKeys(keys.filter(k => k.id !== id))
        toast.success("API key removed")
    }

    const handleToggle = (id: string, current: boolean) => {
        setKeys(keys.map(k => k.id === id ? { ...k, enabled: !current, status: !current ? "Active" : "Revoked" } : k))
        toast.success(current ? "Key disabled" : "Key enabled")
    }

    const handleCopy = (key: string) => {
        navigator.clipboard?.writeText(key).then(() => toast.success("Copied to clipboard")).catch(() => toast.error("Copy failed"))
    }

    const toggleReveal = (id: string) => {
        setRevealed(prev => {
            const n = new Set(prev)
            if (n.has(id)) n.delete(id); else n.add(id)
            return n
        })
    }

    const handleExport = () => {
        const csv = [["ID", "Name", "Scope", "Status", "Environment", "Requests", "Rate Limit", "Expires"], ...keys.map(k => [k.id, k.name, k.scope, k.status, k.environment, k.requests, k.rateLimit, k.expiresAt])].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = "api-keys.csv"; a.click(); URL.revokeObjectURL(url)
        toast.success("API keys exported")
    }

    const openDetail = (k: ApiKey) => { setSelected(k); setIsDetailOpen(true) }

    const kpiCards = [
        { title: "Active Keys", value: String(stats.active), subtitle: `${keys.length} total keys`, icon: Key, color: "indigo", trend: `+${stats.active}`, path: "/client-management/integrations/api" },
        { title: "API Requests", value: stats.totalRequests.toLocaleString(), subtitle: "Last 30 days", icon: Activity, color: "emerald", trend: "+34%", path: "/client-management/analytics/automation" },
        { title: "Revoked Keys", value: String(stats.revoked), subtitle: "Security audit", icon: Shield, color: "rose", trend: "—", path: "/client-management/integrations/api" },
        { title: "Environments", value: String(stats.environments), subtitle: "Active environments", icon: CheckCircle2, color: "violet", trend: "+1", path: "/client-management/integrations/webhooks" },
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
                        API <span className="text-indigo-600">Keys</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Generate and manage API keys for programmatic access to your CRM.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />Export
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />Generate Key
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
                                <CardTitle className="text-base font-semibold">API Keys</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length}</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search keys..." value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-6 py-3">Key</th>
                                            <th className="px-6 py-3">Scope</th>
                                            <th className="px-6 py-3">Requests</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Enabled</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.length > 0 ? filtered.map(k => (
                                            <tr key={k.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(k)}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-none bg-white border border-slate-100 flex items-center justify-center group-hover:bg-indigo-50">
                                                            <Key className="h-4 w-4 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800">{k.name}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <p className="text-[11px] font-mono text-slate-500">{revealed.has(k.id) ? k.keyFull : k.keyPreview}</p>
                                                                <button onClick={(e) => { e.stopPropagation(); toggleReveal(k.id) }} className="text-slate-400 hover:text-indigo-600">
                                                                    {revealed.has(k.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                                                </button>
                                                                <button onClick={(e) => { e.stopPropagation(); handleCopy(k.keyFull) }} className="text-slate-400 hover:text-indigo-600">
                                                                    <Copy className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${SCOPE_COLORS[k.scope] || "bg-slate-50 text-slate-600 border-slate-100"}`}>{k.scope}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900">{k.requests.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${k.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : k.status === "Revoked" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>{k.status}</span>
                                                </td>
                                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <Switch checked={k.enabled} onCheckedChange={() => handleToggle(k.id, k.enabled)} className="data-[state=checked]:bg-indigo-600" />
                                                </td>
                                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-none">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44 rounded-none">
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleCopy(k.keyFull)}>
                                                                <Copy className="h-4 w-4" /> Copy Key
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(k)}>
                                                                <PencilLine className="h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openDetail(k)}>
                                                                <Eye className="h-4 w-4" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 text-amber-600" onClick={() => handleRevoke(k.id)}>
                                                                <Shield className="h-4 w-4" /> Revoke
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDelete(k.id)}>
                                                                <Trash2 className="h-4 w-4" /> Remove
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">No API keys match your filters.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">Rate Limit Usage</CardTitle>
                                <p className="text-sm text-slate-500 mt-1">Current request volume vs limits</p>
                            </div>
                            <Activity className="h-5 w-5 text-slate-400" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {keys.filter(k => k.enabled).slice(0, 5).map((k, idx) => {
                                const pct = Math.min(100, (k.requests / Math.max(1, k.rateLimit * 24 * 30)) * 100)
                                return (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-slate-700">{k.name} <span className="text-slate-400 font-medium ml-2">{k.environment}</span></span>
                                            <span className="text-slate-900">{k.requests.toLocaleString()} / {k.rateLimit.toLocaleString()}/hr</span>
                                        </div>
                                        <Progress value={pct} className="h-1.5 bg-slate-50" />
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Top Consumers</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[...keys].sort((a, b) => b.requests - a.requests).slice(0, 4).map((k, idx) => (
                                <div key={idx} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-2 transition" onClick={() => openDetail(k)}>
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-none bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-100">
                                            {k.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 leading-none">{k.name}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{k.environment}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-900">{(k.requests / 1000).toFixed(1)}k</p>
                                        <div className="flex items-center gap-1 justify-end mt-1">
                                            <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                                            <span className="text-[9px] font-bold text-emerald-600">{k.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-rose-100 bg-rose-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-rose-600 tracking-wider flex items-center gap-2 uppercase">
                                <AlertCircle className="h-4 w-4" /> Security Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-rose-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    Rotate <span className="text-rose-600 font-bold">production keys</span> at least every 90 days.
                                </p>
                            </div>
                            <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-none" onClick={() => router.push('/client-management/integrations/webhooks')}>
                                Review Webhook Security
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit API Key" : "Generate New Key"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Configure API key access and limits.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Key Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g., Production API key" className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`} />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Scope</Label>
                                <Select value={form.scope} onValueChange={v => setField("scope", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        {SCOPES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Environment</Label>
                                <Select value={form.environment} onValueChange={(v: any) => setField("environment", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        {ENVIRONMENTS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Rate Limit (requests/hour) <span className="text-rose-500">*</span></Label>
                            <Input type="number" value={form.rateLimit} onChange={e => setField("rateLimit", e.target.value)} placeholder="5000" className={`h-10 rounded-none ${errors.rateLimit ? "border-rose-500" : ""}`} />
                            {errors.rateLimit && <p className="text-[11px] text-rose-500">{errors.rateLimit}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Expiration Date</Label>
                            <Input type="date" value={form.expiresAt} onChange={e => setField("expiresAt", e.target.value)} className="h-10 rounded-none" />
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>
                            {editingId ? "Save Changes" : "Generate"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Keys</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Environment</Label>
                            <Select value={envFilter} onValueChange={setEnvFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Environments</SelectItem>
                                    {ENVIRONMENTS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setEnvFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">API Key Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Key</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs font-mono text-slate-500 break-all">{selected.keyFull}</p>
                                        <button onClick={() => handleCopy(selected.keyFull)} className="text-slate-400 hover:text-indigo-600 flex-shrink-0">
                                            <Copy className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">ID</p><p className="font-semibold text-slate-900">{selected.id}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Scope</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${SCOPE_COLORS[selected.scope] || "bg-slate-50"}`}>{selected.scope}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${selected.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}>{selected.status}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Environment</p><Badge className="rounded-none">{selected.environment}</Badge></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Requests</p><p className="font-semibold text-slate-900">{selected.requests.toLocaleString()}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Rate Limit</p><p className="font-semibold text-slate-900">{selected.rateLimit.toLocaleString()}/hr</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Created</p><p className="font-semibold text-slate-900">{selected.createdAt}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Expires</p><p className="font-semibold text-slate-900">{selected.expiresAt}</p></div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsDetailOpen(false); openEdit(selected) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleRevoke(selected.id); setIsDetailOpen(false) }}>
                                    <Shield className="h-4 w-4 mr-2" />Revoke
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
