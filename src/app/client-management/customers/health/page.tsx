"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Heart, Activity, AlertCircle, CheckCircle2, Search, Filter, MoreVertical, Plus,
    Trash2, PencilLine, Eye, Building2, TrendingUp, TrendingDown, MessageSquare, Zap, LifeBuoy, ChevronRight, ArrowUpRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Progress } from "@/shared/components/ui/progress"
import { Badge } from "@/shared/components/ui/badge"
import { toast } from "@/shared/utils/toast"

interface ClientHealth {
    id: number
    account: string
    healthScore: number
    usageScore: number
    supportScore: number
    sentiment: 'Positive' | 'Neutral' | 'Mixed' | 'Decline'
    trend: 'Improving' | 'Stable' | 'At Risk' | 'Declining'
    lastSync: string
}

const initialHealth: ClientHealth[] = [
    { id: 1, account: "Global Dynamics", healthScore: 92, usageScore: 95, supportScore: 88, sentiment: "Positive", trend: "Improving", lastSync: "2h ago" },
    { id: 2, account: "DataScale Inc", healthScore: 75, usageScore: 82, supportScore: 60, sentiment: "Mixed", trend: "Stable", lastSync: "5h ago" },
    { id: 3, account: "Innova Hub", healthScore: 42, usageScore: 30, supportScore: 55, sentiment: "Decline", trend: "At Risk", lastSync: "1d ago" },
    { id: 4, account: "Swift Apps", healthScore: 88, usageScore: 90, supportScore: 85, sentiment: "Positive", trend: "Stable", lastSync: "3h ago" },
    { id: 5, account: "Horizon Media", healthScore: 65, usageScore: 70, supportScore: 45, sentiment: "Neutral", trend: "Declining", lastSync: "12h ago" },
]

const validators = {
    required: (v: any) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    percent: (v: any) => v === "" || v === null || v === undefined ? "" : isNaN(Number(v)) ? "Enter a valid number" : Number(v) < 0 || Number(v) > 100 ? "Must be 0-100" : "",
}

const sentimentColor = (s: ClientHealth['sentiment']) =>
    s === 'Positive' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
    s === 'Decline' ? "bg-rose-50 text-rose-600 border-rose-100" :
    s === 'Mixed' ? "bg-amber-50 text-amber-600 border-amber-100" :
    "bg-slate-50 text-slate-600 border-slate-100"

const getTrendIcon = (trend: string) => {
    switch (trend) {
        case 'Improving': return <TrendingUp className="h-3 w-3 text-emerald-500" />
        case 'At Risk': return <AlertCircle className="h-3 w-3 text-rose-500" />
        case 'Declining': return <TrendingDown className="h-3 w-3 text-rose-500" />
        default: return <Activity className="h-3 w-3 text-slate-400" />
    }
}

export default function ClientHealthPage() {
    const router = useRouter()
    const [healthData, setHealthData] = React.useState<ClientHealth[]>(initialHealth)
    const [search, setSearch] = React.useState("")
    const [trendFilter, setTrendFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<number | null>(null)
    const [selected, setSelected] = React.useState<ClientHealth | null>(null)

    const [form, setForm] = React.useState({
        account: "", healthScore: "50", usageScore: "50", supportScore: "50",
        sentiment: "Neutral" as ClientHealth['sentiment'],
        trend: "Stable" as ClientHealth['trend'],
        lastSync: "Just now",
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const metrics = React.useMemo(() => {
        const total = healthData.length
        const avgScore = total > 0 ? Math.round(healthData.reduce((s, h) => s + h.healthScore, 0) / total) : 0
        const atRisk = healthData.filter(h => h.healthScore < 50).length
        const highHealth = healthData.filter(h => h.healthScore > 80).length
        return { total, avgScore, atRisk, highHealth }
    }, [healthData])

    const filtered = React.useMemo(() => {
        return healthData.filter(h => {
            const matchSearch = !search || h.account.toLowerCase().includes(search.toLowerCase())
            const matchTrend = trendFilter === "all" || h.trend === trendFilter
            return matchSearch && matchTrend
        })
    }, [healthData, search, trendFilter])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.account = validators.required(form.account) || validators.minLen(2)(form.account)
        errs.healthScore = validators.percent(form.healthScore)
        errs.usageScore = validators.percent(form.usageScore)
        errs.supportScore = validators.percent(form.supportScore)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ account: "", healthScore: "50", usageScore: "50", supportScore: "50", sentiment: "Neutral", trend: "Stable", lastSync: "Just now" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (h: ClientHealth) => {
        setEditingId(h.id)
        setForm({
            account: h.account,
            healthScore: String(h.healthScore),
            usageScore: String(h.usageScore),
            supportScore: String(h.supportScore),
            sentiment: h.sentiment, trend: h.trend, lastSync: h.lastSync,
        })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        const data: ClientHealth = {
            id: editingId || Date.now(),
            account: form.account.trim(),
            healthScore: Number(form.healthScore),
            usageScore: Number(form.usageScore),
            supportScore: Number(form.supportScore),
            sentiment: form.sentiment,
            trend: form.trend,
            lastSync: form.lastSync,
        }
        if (editingId) {
            setHealthData(healthData.map(h => h.id === editingId ? data : h))
            toast.success("Health metrics updated")
        } else {
            setHealthData([data, ...healthData])
            toast.success("Monitoring started")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: number) => {
        setHealthData(healthData.filter(h => h.id !== id))
        toast.success("Monitor disabled")
    }

    const openDetail = (h: ClientHealth) => { setSelected(h); setIsDetailOpen(true) }

    const kpis = [
        { title: "Avg Health Score", value: `${metrics.avgScore}%`, subtitle: "Portfolio Health", icon: Heart, color: "rose", path: "/client-management/customers" },
        { title: "Retention Risk", value: String(metrics.atRisk), subtitle: "Below 50% Health", icon: AlertCircle, color: "amber", path: "/client-management/analytics/retention" },
        { title: "Engagement Leaders", value: String(metrics.highHealth), subtitle: "Likely to Expand", icon: Zap, color: "emerald", path: "/client-management/revenue/expansion" },
        { title: "Monitored Clients", value: String(metrics.total), subtitle: "In Radar System", icon: Activity, color: "blue", path: "/client-management/customers/journey" },
    ]
    const cm: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        rose: { bg: "bg-gradient-to-br from-rose-50 to-rose-100/50", border: "border-rose-200/50", text: "text-rose-600", iconBg: "bg-rose-100" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", border: "border-amber-200/50", text: "text-amber-600", iconBg: "bg-amber-100" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        blue: { bg: "bg-gradient-to-br from-blue-50 to-blue-100/50", border: "border-blue-200/50", text: "text-blue-600", iconBg: "bg-blue-100" },
    }

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Client <span className="text-rose-600">Health Radar</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Real-time sentiment and platform usage analytics to prevent churn.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />Sync Health Data
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, i) => {
                    const cc = cm[kpi.color]
                    const Icon = kpi.icon
                    return (
                        <Card key={i} className={`rounded-none cursor-pointer hover:shadow-md transition ${cc.bg} ${cc.border} border`} onClick={() => router.push(kpi.path)}>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 tracking-wide mb-1">{kpi.title}</p>
                                        <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
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
                                <CardTitle className="text-base font-semibold">Global Health Inventory</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length} clients</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search by client..." value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-6 py-3">Account</th>
                                            <th className="px-6 py-3">Health Score</th>
                                            <th className="px-6 py-3">Status & Trend</th>
                                            <th className="px-6 py-3">Usage</th>
                                            <th className="px-6 py-3">Sync</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.length > 0 ? filtered.map((h) => (
                                            <tr key={h.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(h)}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-none bg-white border border-slate-100 flex items-center justify-center group-hover:bg-rose-50">
                                                            <Building2 className="h-5 w-5 text-rose-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">{h.account}</p>
                                                            <p className="text-[10px] font-medium text-slate-400 mt-0.5">Automated Monitor</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative h-10 w-10 flex items-center justify-center">
                                                            <svg className="h-full w-full transform -rotate-90">
                                                                <circle cx="20" cy="20" r="16" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                                                                <circle cx="20" cy="20" r="16" fill="transparent" stroke={h.healthScore >= 80 ? '#10b981' : h.healthScore >= 50 ? '#f59e0b' : '#ef4444'} strokeWidth="4" strokeDasharray={100} strokeDashoffset={100 - h.healthScore} />
                                                            </svg>
                                                            <span className="absolute text-[10px] font-bold text-slate-900">{h.healthScore}%</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold border whitespace-nowrap ${sentimentColor(h.sentiment)}`}>{h.sentiment}</span>
                                                            {getTrendIcon(h.trend)}
                                                        </div>
                                                        <span className="text-[10px] font-medium text-slate-400">{h.trend}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-2 w-32">
                                                        <div className="flex items-center justify-between text-[9px] font-bold text-slate-400">
                                                            <span>Usage</span>
                                                            <span>{h.usageScore}%</span>
                                                        </div>
                                                        <Progress value={h.usageScore} className="h-1 bg-slate-50 rounded-none" />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-[11px] font-bold text-slate-400 whitespace-nowrap">{h.lastSync}</td>
                                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-none">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44 rounded-none">
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(h)}>
                                                                <PencilLine className="h-4 w-4" /> Recalibrate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => router.push('/client-management/customers/feedback')}>
                                                                <MessageSquare className="h-4 w-4" /> Sentiment Audit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDelete(h.id)}>
                                                                <Trash2 className="h-4 w-4" /> Disable Monitor
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">No records match your filters.</td></tr>
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
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Health Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { name: 'Product Adoption', value: 85 },
                                { name: 'Billing Stability', value: 92 },
                                { name: 'Support Tickets', value: 44 },
                                { name: 'Account Engagement', value: 72 },
                            ].map((s, i) => (
                                <div key={i} className="space-y-2 cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1" onClick={() => toast.success(`${s.name} drill-down opened`)}>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[12px] font-bold text-slate-700">{s.name}</span>
                                        <span className="text-[12px] font-bold text-slate-900">{s.value}%</span>
                                    </div>
                                    <Progress value={s.value} className="h-1.5 bg-slate-50 rounded-none" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-rose-100 bg-rose-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-rose-600 tracking-wider flex items-center gap-2 uppercase">
                                <AlertCircle className="h-4 w-4" /> Critical Churn Risk
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-rose-100 rounded-none">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-sm font-bold text-slate-800">Innova Hub</p>
                                    <span className="text-[10px] font-extrabold text-rose-600 px-1.5 py-0.5 bg-rose-50 rounded-none">Action Required</span>
                                </div>
                                <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                                    Login volume dropped by <span className="text-rose-600 font-bold">45%</span> in 7 days.
                                </p>
                            </div>
                            <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-none" onClick={() => { toast.success("Risk playbook running"); router.push('/client-management/analytics/retention') }}>
                                Run Risk Playbook
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Success Signals</CardTitle>
                            <ChevronRight className="h-4 w-4 text-slate-300" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { text: 'Upsell opportunity in Global Dynamics', icon: <ArrowUpRight className="h-3 w-3 text-emerald-500" />, path: '/client-management/revenue/expansion' },
                                { text: 'New champion found in DataScale', icon: <CheckCircle2 className="h-3 w-3 text-blue-500" />, path: '/client-management/customers/contacts' },
                                { text: 'Service expansion for Swift Apps', icon: <LifeBuoy className="h-3 w-3 text-violet-500" />, path: '/client-management/subscriptions/plans' },
                            ].map((sig, i) => (
                                <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1" onClick={() => router.push(sig.path)}>
                                    <div className="h-7 w-7 rounded-none bg-slate-50 border border-slate-100 flex items-center justify-center">{sig.icon}</div>
                                    <p className="text-[12px] font-bold text-slate-700">{sig.text}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-rose-50 to-orange-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Recalibrate Health" : "Setup Health Monitor"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Track client engagement and churn signals.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Client Account <span className="text-rose-500">*</span></Label>
                            <Input value={form.account} onChange={e => setField("account", e.target.value)} placeholder="e.g. Acme Corp" className={`h-10 rounded-none ${errors.account ? "border-rose-500" : ""}`} />
                            {errors.account && <p className="text-[11px] text-rose-500">{errors.account}</p>}
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Health (%)</Label>
                                <Input type="number" min="0" max="100" value={form.healthScore} onChange={e => setField("healthScore", e.target.value)} className={`h-10 rounded-none ${errors.healthScore ? "border-rose-500" : ""}`} />
                                {errors.healthScore && <p className="text-[11px] text-rose-500">{errors.healthScore}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Usage (%)</Label>
                                <Input type="number" min="0" max="100" value={form.usageScore} onChange={e => setField("usageScore", e.target.value)} className={`h-10 rounded-none ${errors.usageScore ? "border-rose-500" : ""}`} />
                                {errors.usageScore && <p className="text-[11px] text-rose-500">{errors.usageScore}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Support (%)</Label>
                                <Input type="number" min="0" max="100" value={form.supportScore} onChange={e => setField("supportScore", e.target.value)} className={`h-10 rounded-none ${errors.supportScore ? "border-rose-500" : ""}`} />
                                {errors.supportScore && <p className="text-[11px] text-rose-500">{errors.supportScore}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Trend</Label>
                                <Select value={form.trend} onValueChange={(v: any) => setField("trend", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Improving">Improving</SelectItem>
                                        <SelectItem value="Stable">Stable</SelectItem>
                                        <SelectItem value="At Risk">At Risk</SelectItem>
                                        <SelectItem value="Declining">Declining</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Sentiment</Label>
                                <Select value={form.sentiment} onValueChange={(v: any) => setField("sentiment", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Positive">Positive</SelectItem>
                                        <SelectItem value="Neutral">Neutral</SelectItem>
                                        <SelectItem value="Mixed">Mixed</SelectItem>
                                        <SelectItem value="Decline">Decline</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-rose-600 hover:bg-rose-700 text-white rounded-none" onClick={handleSave}>
                            {editingId ? "Refresh Radar" : "Start Monitoring"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-rose-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Health</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Trend Status</Label>
                            <Select value={trendFilter} onValueChange={setTrendFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Trends</SelectItem>
                                    <SelectItem value="Improving">Improving</SelectItem>
                                    <SelectItem value="Stable">Stable</SelectItem>
                                    <SelectItem value="At Risk">At Risk</SelectItem>
                                    <SelectItem value="Declining">Declining</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setTrendFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-rose-600 hover:bg-rose-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-rose-50">
                        <SheetTitle className="text-[18px] font-semibold">Health Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Account</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.account}</p>
                                </div>
                                <div className="space-y-3 pt-3 border-t">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-[11px] text-slate-400 uppercase">Health Score</span>
                                            <span className="text-sm font-bold text-slate-900">{selected.healthScore}%</span>
                                        </div>
                                        <Progress value={selected.healthScore} className="h-2 rounded-none" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-[11px] text-slate-400 uppercase">Usage</span>
                                            <span className="text-sm font-bold text-slate-900">{selected.usageScore}%</span>
                                        </div>
                                        <Progress value={selected.usageScore} className="h-2 rounded-none" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-[11px] text-slate-400 uppercase">Support</span>
                                            <span className="text-sm font-bold text-slate-900">{selected.supportScore}%</span>
                                        </div>
                                        <Progress value={selected.supportScore} className="h-2 rounded-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Sentiment</p>
                                        <span className={`inline-flex px-2 py-0.5 rounded-none text-[11px] font-bold border ${sentimentColor(selected.sentiment)}`}>{selected.sentiment}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Trend</p><p className="font-semibold text-slate-900 flex items-center gap-1">{getTrendIcon(selected.trend)}{selected.trend}</p></div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">Last Sync</p><p className="font-semibold text-slate-900">{selected.lastSync}</p></div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsDetailOpen(false); openEdit(selected) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDelete(selected.id); setIsDetailOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" />Disable
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
