"use client"

import { useState, useMemo } from "react"
import {
    Plus, Search, RefreshCw, Download, Key,
    Clock, Trash2, Edit, Loader2, X, Save,
    Eye, EyeOff, Copy, Shield, AlertCircle,
    CheckCircle2, Activity
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

type ApiKey = {
    id: string
    name: string
    keyPreview: string
    scope: string
    status: string
    requests: number
    rateLimit: number
    expiresAt: string
    enabled: boolean
    createdAt: string
    environment: string
}

const generateKeyPreview = () => `ck_${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`

const INITIAL_KEYS: ApiKey[] = [
    { id: "AK-001", name: "Production API key", keyPreview: "ck_live_h7d2...9fk3", scope: "Full access", status: "Active", requests: 48200, rateLimit: 10000, expiresAt: "Dec 31, 2026", enabled: true, createdAt: "Jan 15, 2025", environment: "Production" },
    { id: "AK-002", name: "Mobile app key", keyPreview: "ck_live_m4p9...2xl8", scope: "Read only", status: "Active", requests: 12400, rateLimit: 5000, expiresAt: "Jun 30, 2026", enabled: true, createdAt: "Feb 10, 2025", environment: "Production" },
    { id: "AK-003", name: "Webhook service key", keyPreview: "ck_live_w8r1...5qm7", scope: "Webhooks", status: "Active", requests: 8900, rateLimit: 2000, expiresAt: "Mar 15, 2026", enabled: true, createdAt: "Mar 01, 2025", environment: "Production" },
    { id: "AK-004", name: "Staging test key", keyPreview: "ck_test_s3x6...4jn2", scope: "Full access", status: "Active", requests: 2100, rateLimit: 10000, expiresAt: "Dec 31, 2026", enabled: true, createdAt: "Jan 15, 2025", environment: "Staging" },
    { id: "AK-005", name: "Analytics read key", keyPreview: "ck_live_a1n8...7pq4", scope: "Analytics", status: "Revoked", requests: 23400, rateLimit: 5000, expiresAt: "Expired", enabled: false, createdAt: "Oct 05, 2024", environment: "Production" },
]

const SCOPES = ["Full access", "Read only", "Webhooks", "Analytics", "Billing", "Contacts"]
const ENVIRONMENTS = ["Production", "Staging", "Development"]

const SCOPE_COLORS: Record<string, string> = {
    "Full access": "bg-rose-50 text-rose-600",
    "Read only": "bg-slate-50 text-slate-600",
    Webhooks: "bg-violet-50 text-violet-600",
    Analytics: "bg-cyan-50 text-cyan-600",
    Billing: "bg-amber-50 text-amber-600",
    Contacts: "bg-indigo-50 text-indigo-600",
}

export default function ApiKeysPage() {
    const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterEnv, setFilterEnv] = useState("all")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<ApiKey | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<ApiKey | null>(null)
    const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set())
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [newKey, setNewKey] = useState({ name: "", scope: "Read only", environment: "Production", rateLimit: "5000" })

    const stats = useMemo(() => ({
        active: keys.filter(k => k.enabled).length,
        totalRequests: keys.reduce((a, k) => a + k.requests, 0),
        revoked: keys.filter(k => k.status === "Revoked").length,
        environments: new Set(keys.filter(k => k.enabled).map(k => k.environment)).size,
    }), [keys])

    const filtered = useMemo(() => keys.filter(k => {
        const matchSearch = k.name.toLowerCase().includes(searchQuery.toLowerCase()) || k.scope.toLowerCase().includes(searchQuery.toLowerCase())
        const matchEnv = filterEnv === "all" || k.environment === filterEnv
        return matchSearch && matchEnv
    }), [keys, searchQuery, filterEnv])

    const handleCreate = () => {
        if (!newKey.name.trim()) { toast.error("Key name is required"); return }
        const k: ApiKey = {
            id: `AK-${String(keys.length + 1).padStart(3, "0")}`,
            name: newKey.name.trim(), keyPreview: generateKeyPreview(),
            scope: newKey.scope, status: "Active",
            requests: 0, rateLimit: Number(newKey.rateLimit) || 5000,
            expiresAt: "Dec 31, 2026", enabled: true,
            createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            environment: newKey.environment,
        }
        setKeys(prev => [k, ...prev])
        setNewKey({ name: "", scope: "Read only", environment: "Production", rateLimit: "5000" })
        setIsCreateOpen(false)
        toast.success(`API key "${k.name}" generated successfully`)
    }

    const handleEditSave = () => {
        if (!editTarget?.name.trim()) { toast.error("Name is required"); return }
        setKeys(prev => prev.map(k => k.id === editTarget.id ? { ...editTarget } : k))
        setEditTarget(null)
        toast.success("API key updated")
    }

    const handleDelete = () => {
        if (!deleteTarget) return
        setKeys(prev => prev.filter(k => k.id !== deleteTarget.id))
        setDeleteTarget(null)
        toast.success("API key revoked and deleted")
    }

    const handleToggle = (id: string, current: boolean) => {
        setKeys(prev => prev.map(k => k.id === id ? { ...k, enabled: !current, status: !current ? "Active" : "Revoked" } : k))
        toast.success(current ? "API key revoked" : "API key activated")
    }

    const handleCopy = (id: string, keyPreview: string) => {
        navigator.clipboard.writeText(keyPreview)
        toast.success("API key copied to clipboard")
    }

    const toggleReveal = (id: string) => {
        setRevealedKeys(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
    }

    const handleRefresh = () => {
        setIsRefreshing(true)
        toast.promise(new Promise(r => setTimeout(r, 1500)), { loading: "Refreshing API key stats...", success: "Stats refreshed", error: "Failed" })
        setTimeout(() => {
            setIsRefreshing(false)
            setKeys(prev => prev.map(k => k.enabled ? { ...k, requests: k.requests + Math.floor(Math.random() * 100) } : k))
        }, 1500)
    }

    const handleExport = () => {
        const csv = [["ID", "Name", "Scope", "Environment", "Status", "Requests", "Rate Limit", "Expires"], ...keys.map(k => [k.id, k.name, k.scope, k.environment, k.status, k.requests, k.rateLimit, k.expiresAt])].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "api-keys.csv"; a.click(); URL.revokeObjectURL(url)
        toast.success("API keys list exported")
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">API keys <span className="text-indigo-600">&amp; access</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Manage API credentials, scopes, and rate limits for integrations</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleRefresh}>{isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 text-slate-400" />} Refresh</Button>
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleExport}><Download className="w-4 h-4 text-slate-400" /> Export</Button>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild><Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2"><Plus className="w-4 h-4" /> Generate key</Button></DialogTrigger>
                        <DialogContent className="sm:max-w-[480px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                            <DialogHeader><DialogTitle className="text-2xl font-semibold text-slate-900">Generate <span className="text-indigo-600">API key</span></DialogTitle></DialogHeader>
                            <div className="grid gap-5 py-6">
                                <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Key name *</Label><Input value={newKey.name} onChange={e => setNewKey({ ...newKey, name: e.target.value })} placeholder="e.g. Mobile app production key" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Permission scope</Label><Select value={newKey.scope} onValueChange={v => setNewKey({ ...newKey, scope: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{SCOPES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                                    <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Environment</Label><Select value={newKey.environment} onValueChange={v => setNewKey({ ...newKey, environment: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{ENVIRONMENTS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
                                </div>
                                <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Rate limit (req/min)</Label><Input type="number" value={newKey.rateLimit} onChange={e => setNewKey({ ...newKey, rateLimit: e.target.value })} placeholder="5000" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" /></div>
                            </div>
                            <DialogFooter className="gap-2"><Button variant="ghost" className="rounded-xl font-semibold" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold px-8 text-white" onClick={handleCreate}>Generate</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: "Active API keys", value: stats.active, icon: Key, bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-100/50" },
                    { label: "Total API requests", value: stats.totalRequests.toLocaleString(), icon: Activity, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-100/50" },
                    { label: "Active environments", value: stats.environments, icon: Shield, bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-100/50" },
                    { label: "Revoked keys", value: stats.revoked, icon: AlertCircle, bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", iconBg: "bg-amber-100", iconColor: "text-amber-600", border: "border-amber-100/50" },
                ].map((stat, i) => (
                    <Card key={i} className={`${stat.bg} ${stat.border} border shadow-sm hover:shadow-md transition-all rounded-[22px] overflow-hidden`}>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`h-10 w-10 rounded-[14px] flex items-center justify-center ${stat.iconBg}`}><stat.icon className={`w-5 h-5 ${stat.iconColor}`} /></div>
                                <span className="text-[11px] font-semibold text-slate-400 bg-white/70 px-2 py-1 rounded-full border border-slate-100">{keys.length} total</span>
                            </div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">{stat.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" /><Input placeholder="Search keys or scopes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 h-11 bg-white border-slate-200 rounded-xl text-sm font-medium" /></div>
                <Select value={filterEnv} onValueChange={setFilterEnv}><SelectTrigger className="w-44 h-11 rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-sm"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="all">All environments</SelectItem>{ENVIRONMENTS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select>
            </div>

            <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                <CardHeader className="px-8 py-6 border-b border-slate-100"><CardTitle className="text-lg font-semibold text-slate-900">API credentials <span className="text-slate-400 font-medium text-sm ml-2">({filtered.length})</span></CardTitle></CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                        {filtered.map(k => (
                            <div key={k.id} className="px-8 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-slate-50/50 transition-colors group">
                                <div className="flex items-start gap-5 flex-1">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${k.environment === "Production" ? "bg-indigo-50 text-indigo-600" : k.environment === "Staging" ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-500"}`}><Key className="w-5 h-5" /></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{k.name}</h4>
                                            <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 ${SCOPE_COLORS[k.scope] || "bg-slate-100 text-slate-500"}`}>{k.scope}</Badge>
                                            <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 ${k.environment === "Production" ? "bg-indigo-100 text-indigo-700" : "bg-amber-100 text-amber-700"}`}>{k.environment}</Badge>
                                            <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 ${k.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>{k.status}</Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <code className="text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                {revealedKeys.has(k.id) ? k.keyPreview : k.keyPreview.replace(/[^.]/g, "•").replace("••", k.keyPreview.substring(0, 7))}
                                            </code>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-600 rounded-lg" onClick={() => toggleReveal(k.id)}>{revealedKeys.has(k.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-indigo-600 rounded-lg" onClick={() => handleCopy(k.id, k.keyPreview)}><Copy className="w-3.5 h-3.5" /></Button>
                                        </div>
                                        <div className="flex items-center gap-6 text-[11px] text-slate-400 font-medium">
                                            <span>{k.requests.toLocaleString()} requests</span>
                                            <span>{k.rateLimit.toLocaleString()} req/min limit</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Expires: {k.expiresAt}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="flex items-center gap-2 border border-slate-100 rounded-xl px-3 py-2 bg-white shadow-sm">
                                        <Switch checked={k.enabled} onCheckedChange={() => handleToggle(k.id, k.enabled)} className="data-[state=checked]:bg-indigo-600 scale-90" />
                                        <span className="text-[10px] font-semibold text-slate-400">{k.enabled ? "Active" : "Off"}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl" onClick={() => setEditTarget({ ...k })}><Edit className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl" onClick={() => setDeleteTarget(k)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && <div className="px-8 py-16 text-center"><p className="text-slate-400 font-medium">No API keys found.</p><Button variant="ghost" className="mt-3 text-indigo-600 font-semibold text-sm" onClick={() => { setSearchQuery(""); setFilterEnv("all") }}>Clear filters</Button></div>}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!editTarget} onOpenChange={() => setEditTarget(null)}>
                <DialogContent className="sm:max-w-[440px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader><DialogTitle className="text-2xl font-semibold text-slate-900">Edit <span className="text-indigo-600">API key</span></DialogTitle></DialogHeader>
                    {editTarget && <div className="grid gap-5 py-6">
                        <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Name *</Label><Input value={editTarget.name} onChange={e => setEditTarget({ ...editTarget, name: e.target.value })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Scope</Label><Select value={editTarget.scope} onValueChange={v => setEditTarget({ ...editTarget, scope: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{SCOPES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                            <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Rate limit</Label><Input type="number" value={editTarget.rateLimit} onChange={e => setEditTarget({ ...editTarget, rateLimit: Number(e.target.value) })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" /></div>
                        </div>
                    </div>}
                    <DialogFooter className="gap-2"><Button variant="ghost" className="rounded-xl font-semibold gap-2" onClick={() => setEditTarget(null)}><X className="w-4 h-4" />Cancel</Button><Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold px-8 text-white gap-2" onClick={handleEditSave}><Save className="w-4 h-4" />Save</Button></DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader><DialogTitle className="text-xl font-semibold text-slate-900">Revoke API key</DialogTitle></DialogHeader>
                    <p className="text-sm font-medium text-slate-500 py-4">Are you sure you want to permanently revoke <span className="text-slate-900 font-semibold">"{deleteTarget?.name}"</span>? All requests using this key will immediately fail.</p>
                    <DialogFooter className="gap-2"><Button variant="ghost" className="rounded-xl font-semibold" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button className="rounded-xl bg-rose-600 hover:bg-rose-700 font-semibold px-6 text-white gap-2" onClick={handleDelete}><Trash2 className="w-4 h-4" />Revoke</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
