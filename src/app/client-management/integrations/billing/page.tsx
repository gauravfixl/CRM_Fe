"use client"

import { useState, useMemo } from "react"
import {
    Plus, Search, RefreshCw, Download, CreditCard,
    CheckCircle2, Clock, Activity, Trash2, Edit,
    Loader2, X, Save, AlertCircle, DollarSign,
    Shield, ToggleLeft, Zap
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

type Gateway = {
    id: string
    name: string
    provider: string
    status: string
    mode: string
    currency: string
    txnVolume: number
    successRate: number
    enabled: boolean
    lastActivity: string
}

const INITIAL_GATEWAYS: Gateway[] = [
    { id: "BG-001", name: "Stripe production", provider: "Stripe", status: "Active", mode: "Live", currency: "USD", txnVolume: 128400, successRate: 99.2, enabled: true, lastActivity: "2 min ago" },
    { id: "BG-002", name: "Razorpay India", provider: "Razorpay", status: "Active", mode: "Live", currency: "INR", txnVolume: 54200, successRate: 98.7, enabled: true, lastActivity: "15 min ago" },
    { id: "BG-003", name: "PayPal global", provider: "PayPal", status: "Active", mode: "Live", currency: "USD", txnVolume: 32100, successRate: 97.4, enabled: true, lastActivity: "1 hr ago" },
    { id: "BG-004", name: "Stripe sandbox", provider: "Stripe", status: "Testing", mode: "Test", currency: "USD", txnVolume: 0, successRate: 100, enabled: true, lastActivity: "3 hr ago" },
    { id: "BG-005", name: "Braintree payments", provider: "Braintree", status: "Paused", mode: "Live", currency: "USD", txnVolume: 8900, successRate: 96.1, enabled: false, lastActivity: "5 days ago" },
]

const PROVIDERS = ["Stripe", "Razorpay", "PayPal", "Braintree", "Square", "Adyen", "Mollie"]
const CURRENCIES = ["USD", "EUR", "GBP", "INR", "AUD", "CAD"]

const PROVIDER_COLORS: Record<string, string> = {
    Stripe: "bg-violet-50 text-violet-600",
    Razorpay: "bg-sky-50 text-sky-600",
    PayPal: "bg-blue-50 text-blue-600",
    Braintree: "bg-emerald-50 text-emerald-600",
    Square: "bg-slate-50 text-slate-600",
    Adyen: "bg-green-50 text-green-600",
    Mollie: "bg-orange-50 text-orange-600",
}

export default function BillingGatewaysPage() {
    const [gateways, setGateways] = useState<Gateway[]>(INITIAL_GATEWAYS)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<Gateway | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Gateway | null>(null)
    const [isSyncing, setIsSyncing] = useState(false)
    const [newGateway, setNewGateway] = useState({ name: "", provider: "Stripe", mode: "Live", currency: "USD" })

    const stats = useMemo(() => ({
        active: gateways.filter(g => g.enabled).length,
        totalVolume: gateways.reduce((a, g) => a + g.txnVolume, 0),
        avgSuccess: gateways.length ? (gateways.reduce((a, g) => a + g.successRate, 0) / gateways.length).toFixed(1) : "0",
        providers: new Set(gateways.map(g => g.provider)).size,
    }), [gateways])

    const filtered = useMemo(() => gateways.filter(g => {
        const matchSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.provider.toLowerCase().includes(searchQuery.toLowerCase())
        const matchStatus = filterStatus === "all" || g.status.toLowerCase() === filterStatus
        return matchSearch && matchStatus
    }), [gateways, searchQuery, filterStatus])

    const handleCreate = () => {
        if (!newGateway.name.trim()) { toast.error("Gateway name is required"); return }
        const g: Gateway = { id: `BG-${String(gateways.length + 1).padStart(3, "0")}`, name: newGateway.name.trim(), provider: newGateway.provider, status: "Active", mode: newGateway.mode, currency: newGateway.currency, txnVolume: 0, successRate: 100, enabled: true, lastActivity: "Never" }
        setGateways(prev => [g, ...prev])
        setNewGateway({ name: "", provider: "Stripe", mode: "Live", currency: "USD" })
        setIsCreateOpen(false)
        toast.success(`Gateway "${g.name}" added successfully`)
    }

    const handleEditSave = () => {
        if (!editTarget?.name.trim()) { toast.error("Name is required"); return }
        setGateways(prev => prev.map(g => g.id === editTarget.id ? { ...editTarget } : g))
        setEditTarget(null)
        toast.success("Gateway updated successfully")
    }

    const handleDelete = () => {
        if (!deleteTarget) return
        setGateways(prev => prev.filter(g => g.id !== deleteTarget.id))
        setDeleteTarget(null)
        toast.success("Gateway removed")
    }

    const handleToggle = (id: string, current: boolean) => {
        setGateways(prev => prev.map(g => g.id === id ? { ...g, enabled: !current, status: !current ? "Active" : "Paused" } : g))
        toast.success(current ? "Gateway paused" : "Gateway activated")
    }

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(new Promise(r => setTimeout(r, 1500)), { loading: "Refreshing gateway status...", success: "All gateways refreshed", error: "Refresh failed" })
        setTimeout(() => {
            setIsSyncing(false)
            setGateways(prev => prev.map(g => g.enabled ? { ...g, lastActivity: "Just now", txnVolume: g.txnVolume + Math.floor(Math.random() * 1000) } : g))
        }, 1500)
    }

    const handleExport = () => {
        const csv = [["ID", "Name", "Provider", "Mode", "Currency", "Volume", "Success Rate", "Status"], ...gateways.map(g => [g.id, g.name, g.provider, g.mode, g.currency, g.txnVolume, `${g.successRate}%`, g.status])].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "billing-gateways.csv"; a.click(); URL.revokeObjectURL(url)
        toast.success("Billing gateways exported")
    }

    const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">Billing <span className="text-indigo-600">gateways</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Manage payment gateways and monitor transaction health</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleSync}>
                        {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 text-slate-400" />} Refresh
                    </Button>
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleExport}><Download className="w-4 h-4 text-slate-400" /> Export</Button>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild><Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2"><Plus className="w-4 h-4" /> Add gateway</Button></DialogTrigger>
                        <DialogContent className="sm:max-w-[440px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                            <DialogHeader><DialogTitle className="text-2xl font-semibold text-slate-900">Add <span className="text-indigo-600">billing gateway</span></DialogTitle></DialogHeader>
                            <div className="grid gap-5 py-6">
                                <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Gateway name *</Label><Input value={newGateway.name} onChange={e => setNewGateway({ ...newGateway, name: e.target.value })} placeholder="e.g. Stripe production" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" /></div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Provider</Label><Select value={newGateway.provider} onValueChange={v => setNewGateway({ ...newGateway, provider: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{PROVIDERS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
                                    <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Mode</Label><Select value={newGateway.mode} onValueChange={v => setNewGateway({ ...newGateway, mode: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="Live">Live</SelectItem><SelectItem value="Test">Test</SelectItem></SelectContent></Select></div>
                                    <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Currency</Label><Select value={newGateway.currency} onValueChange={v => setNewGateway({ ...newGateway, currency: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                                </div>
                            </div>
                            <DialogFooter className="gap-2"><Button variant="ghost" className="rounded-xl font-semibold" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold px-8 text-white" onClick={handleCreate}>Add gateway</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: "Active gateways", value: stats.active, icon: CreditCard, bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-100/50" },
                    { label: "Total volume processed", value: fmt(stats.totalVolume), icon: DollarSign, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-100/50" },
                    { label: "Avg success rate", value: `${stats.avgSuccess}%`, icon: CheckCircle2, bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-100/50" },
                    { label: "Payment providers", value: stats.providers, icon: Shield, bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", iconBg: "bg-amber-100", iconColor: "text-amber-600", border: "border-amber-100/50" },
                ].map((stat, i) => (
                    <Card key={i} className={`${stat.bg} ${stat.border} border shadow-sm hover:shadow-md transition-all rounded-[22px] overflow-hidden`}>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`h-10 w-10 rounded-[14px] flex items-center justify-center ${stat.iconBg}`}><stat.icon className={`w-5 h-5 ${stat.iconColor}`} /></div>
                                <span className="text-[11px] font-semibold text-slate-400 bg-white/70 px-2 py-1 rounded-full border border-slate-100">{gateways.length} total</span>
                            </div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">{stat.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" /><Input placeholder="Search gateways or providers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 h-11 bg-white border-slate-200 rounded-xl text-sm font-medium" /></div>
                <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="w-44 h-11 rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-sm"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="all">All statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="paused">Paused</SelectItem><SelectItem value="testing">Testing</SelectItem></SelectContent></Select>
            </div>

            <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                <CardHeader className="px-8 py-6 border-b border-slate-100"><CardTitle className="text-lg font-semibold text-slate-900">Payment gateways <span className="text-slate-400 font-medium text-sm ml-2">({filtered.length})</span></CardTitle></CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                        {filtered.map(g => (
                            <div key={g.id} className="px-8 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-slate-50/50 transition-colors group">
                                <div className="flex items-start gap-5 flex-1">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${PROVIDER_COLORS[g.provider] || "bg-slate-50 text-slate-400"}`}><CreditCard className="w-5 h-5" /></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{g.name}</h4>
                                            <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 ${PROVIDER_COLORS[g.provider]}`}>{g.provider}</Badge>
                                            <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 ${g.mode === "Live" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{g.mode}</Badge>
                                            <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 ${g.status === "Active" ? "bg-emerald-100 text-emerald-700" : g.status === "Testing" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>{g.status}</Badge>
                                        </div>
                                        <div className="flex items-center gap-6 text-[11px] text-slate-400 font-medium">
                                            <span>{g.currency} · {fmt(g.txnVolume)} processed</span>
                                            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> {g.successRate}% success</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {g.lastActivity}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="flex items-center gap-2 border border-slate-100 rounded-xl px-3 py-2 bg-white shadow-sm">
                                        <Switch checked={g.enabled} onCheckedChange={() => handleToggle(g.id, g.enabled)} className="data-[state=checked]:bg-indigo-600 scale-90" />
                                        <span className="text-[10px] font-semibold text-slate-400">{g.enabled ? "On" : "Off"}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl" onClick={() => setEditTarget({ ...g })}><Edit className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl" onClick={() => setDeleteTarget(g)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && <div className="px-8 py-16 text-center"><p className="text-slate-400 font-medium">No gateways found.</p><Button variant="ghost" className="mt-3 text-indigo-600 font-semibold text-sm" onClick={() => { setSearchQuery(""); setFilterStatus("all") }}>Clear filters</Button></div>}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!editTarget} onOpenChange={() => setEditTarget(null)}>
                <DialogContent className="sm:max-w-[440px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader><DialogTitle className="text-2xl font-semibold text-slate-900">Edit <span className="text-indigo-600">gateway</span></DialogTitle></DialogHeader>
                    {editTarget && <div className="grid gap-5 py-6">
                        <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Name *</Label><Input value={editTarget.name} onChange={e => setEditTarget({ ...editTarget, name: e.target.value })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" /></div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Provider</Label><Select value={editTarget.provider} onValueChange={v => setEditTarget({ ...editTarget, provider: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{PROVIDERS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
                            <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Mode</Label><Select value={editTarget.mode} onValueChange={v => setEditTarget({ ...editTarget, mode: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="Live">Live</SelectItem><SelectItem value="Test">Test</SelectItem></SelectContent></Select></div>
                            <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Currency</Label><Select value={editTarget.currency} onValueChange={v => setEditTarget({ ...editTarget, currency: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                        </div>
                    </div>}
                    <DialogFooter className="gap-2"><Button variant="ghost" className="rounded-xl font-semibold gap-2" onClick={() => setEditTarget(null)}><X className="w-4 h-4" />Cancel</Button><Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold px-8 text-white gap-2" onClick={handleEditSave}><Save className="w-4 h-4" />Save</Button></DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader><DialogTitle className="text-xl font-semibold text-slate-900">Remove gateway</DialogTitle></DialogHeader>
                    <p className="text-sm font-medium text-slate-500 py-4">Are you sure you want to remove <span className="text-slate-900 font-semibold">"{deleteTarget?.name}"</span>?</p>
                    <DialogFooter className="gap-2"><Button variant="ghost" className="rounded-xl font-semibold" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button className="rounded-xl bg-rose-600 hover:bg-rose-700 font-semibold px-6 text-white gap-2" onClick={handleDelete}><Trash2 className="w-4 h-4" />Remove</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
