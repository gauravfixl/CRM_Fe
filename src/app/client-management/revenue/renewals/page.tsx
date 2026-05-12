"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CartesianGrid, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts'
import {
    RefreshCcw,
    ShieldCheck,
    AlertTriangle,
    TrendingUp,
    Search,
    Filter,
    MoreVertical,
    Calendar,
    ArrowUpRight,
    Clock,
    History,
    CheckCircle2,
    Building,
    Target,
    Plus,
    Trash2,
    PencilLine,
    ExternalLink,
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

interface Renewal {
    id: number
    client: string
    value: number
    date: string
    status: 'Proposed' | 'In Discussion' | 'Negotiating' | 'Closing' | 'At Risk'
    probability: number
    health: 'Perfect' | 'Stable' | 'Warning' | 'Critical'
}

const initialRenewals: Renewal[] = [
    { id: 1, client: 'Acme Corp', value: 45000, date: '2024-10-12', status: 'In Discussion', probability: 90, health: 'Stable' },
    { id: 2, client: 'GlobalTech Solutions', value: 120000, date: '2024-10-28', status: 'At Risk', probability: 45, health: 'Critical' },
    { id: 3, client: 'NorthStar Ind.', value: 32500, date: '2024-11-05', status: 'Negotiating', probability: 75, health: 'Warning' },
    { id: 4, client: 'Cloud Nine Systems', value: 15000, date: '2024-11-12', status: 'Closing', probability: 98, health: 'Perfect' },
    { id: 5, client: 'Vanguard Group', value: 88000, date: '2024-12-02', status: 'Proposed', probability: 60, health: 'Stable' },
]

const healthTrendData = [
    { name: 'Week 1', health: 82 },
    { name: 'Week 2', health: 85 },
    { name: 'Week 3', health: 84 },
    { name: 'Week 4', health: 88 },
    { name: 'Week 5', health: 87 },
    { name: 'Week 6', health: 91 },
]

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    number: (v: any) => v === "" || v == null ? "" : isNaN(Number(v)) ? "Enter a valid number" : Number(v) < 0 ? "Must be positive" : "",
    percent: (v: any) => v === "" || v == null ? "" : isNaN(Number(v)) ? "Enter a valid number" : Number(v) < 0 || Number(v) > 100 ? "Must be 0–100" : "",
    date: (v: string) => v && isNaN(new Date(v).getTime()) ? "Enter a valid date" : "",
}

const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`
    return `$${val}`
}

const getHealthColor = (h: Renewal['health']) => {
    switch (h) {
        case 'Perfect': return { text: 'text-emerald-600', bg: 'bg-emerald-100', dot: 'bg-emerald-500' }
        case 'Stable': return { text: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' }
        case 'Warning': return { text: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500' }
        case 'Critical': return { text: 'text-rose-600', bg: 'bg-rose-50', dot: 'bg-rose-500' }
    }
}

export default function RenewalsPage() {
    const router = useRouter()
    const [renewals, setRenewals] = React.useState<Renewal[]>(initialRenewals)
    const [search, setSearch] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<number | null>(null)
    const [selected, setSelected] = React.useState<Renewal | null>(null)

    const [form, setForm] = React.useState({
        client: "", value: "", date: "", status: "Proposed" as Renewal['status'],
        probability: "50", health: "Stable" as Renewal['health']
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const metrics = React.useMemo(() => {
        const totalValue = renewals.reduce((s, r) => s + r.value, 0)
        const avgProb = renewals.length ? Math.round(renewals.reduce((s, r) => s + r.probability, 0) / renewals.length) : 0
        const atRiskValue = renewals.filter(r => r.health === 'Critical').reduce((s, r) => s + r.value, 0)
        return { totalValue: formatCurrency(totalValue), avgProb: `${avgProb}%`, atRisk: formatCurrency(atRiskValue), count: renewals.length }
    }, [renewals])

    const filtered = React.useMemo(() => {
        return renewals.filter(r => {
            const matchSearch = !search || r.client.toLowerCase().includes(search.toLowerCase()) || r.status.toLowerCase().includes(search.toLowerCase())
            const matchStatus = statusFilter === "all" || r.status === statusFilter
            return matchSearch && matchStatus
        })
    }, [renewals, search, statusFilter])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.client = validators.required(form.client) || validators.minLen(2)(form.client)
        errs.value = validators.required(form.value) || validators.number(form.value)
        errs.date = validators.required(form.date) || validators.date(form.date)
        errs.probability = validators.percent(form.probability)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ client: "", value: "", date: "", status: "Proposed", probability: "50", health: "Stable" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (r: Renewal) => {
        setEditingId(r.id)
        setForm({ client: r.client, value: String(r.value), date: r.date, status: r.status, probability: String(r.probability), health: r.health })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        const data: Renewal = {
            id: editingId || Date.now(),
            client: form.client.trim(),
            value: Number(form.value),
            date: form.date,
            status: form.status,
            probability: Number(form.probability),
            health: form.health,
        }
        if (editingId) {
            setRenewals(renewals.map(r => r.id === editingId ? data : r))
            toast.success("Renewal updated")
        } else {
            setRenewals([data, ...renewals])
            toast.success("Renewal added")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: number) => {
        setRenewals(renewals.filter(r => r.id !== id))
        toast.success("Renewal removed")
    }

    const openDetail = (r: Renewal) => {
        setSelected(r)
        setIsDetailOpen(true)
    }

    const kpiCards = [
        { title: "Renewal Pipeline", value: metrics.totalValue, subtitle: `${metrics.count} Active`, icon: RefreshCcw, color: "indigo", trend: "+12%", path: "/client-management/revenue/overview" },
        { title: "Expected Churn", value: metrics.atRisk, subtitle: "Probabilistic Risk", icon: AlertTriangle, color: "rose", trend: "-2%", path: "/client-management/analytics/retention" },
        { title: "Renewal Rate", value: "96.2%", subtitle: "Last 12 Months", icon: ShieldCheck, color: "emerald", trend: "+0.4%", path: "/client-management/analytics/revenue" },
        { title: "Avg Probability", value: metrics.avgProb, subtitle: "Pipeline Confidence", icon: TrendingUp, color: "violet", trend: "+1.2%", path: "/client-management/analytics/forecasting" },
        { title: "Avg Health", value: "88/100", subtitle: "Account Performance", icon: Target, color: "amber", trend: "+5", path: "/client-management/customers/health" },
    ]
    const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        indigo: { bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", border: "border-indigo-200/50", text: "text-indigo-600", iconBg: "bg-indigo-100" },
        rose: { bg: "bg-gradient-to-br from-rose-50 to-rose-100/50", border: "border-rose-200/50", text: "text-rose-600", iconBg: "bg-rose-100" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        violet: { bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", border: "border-violet-200/50", text: "text-violet-600", iconBg: "bg-violet-100" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", border: "border-amber-200/50", text: "text-amber-600", iconBg: "bg-amber-100" },
    }

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Revenue <span className="text-indigo-600">Protection</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Track upcoming renewals and mitigate risk to protect ARR.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />New Renewal
                    </Button>
                </div>
            </div>

            {/* KPI */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {kpiCards.map((kpi, i) => {
                    const cc = colorMap[kpi.color]
                    const Icon = kpi.icon
                    return (
                        <Card key={i} className={`rounded-none cursor-pointer hover:shadow-md transition ${cc.bg} ${cc.border} border`} onClick={() => router.push(kpi.path)}>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 tracking-wide mb-1">{kpi.title}</p>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="text-xl font-bold text-slate-900">{kpi.value}</h3>
                                            <span className={`text-[11px] font-bold ${kpi.trend.startsWith('-') ? 'text-rose-600' : 'text-emerald-600'}`}>{kpi.trend}</span>
                                        </div>
                                        <p className="mt-1 text-[11px] text-slate-400">{kpi.subtitle}</p>
                                    </div>
                                    <div className={`h-9 w-9 rounded-none flex items-center justify-center ${cc.iconBg}`}>
                                        <Icon className={`h-4 w-4 ${cc.text}`} />
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
                                <CardTitle className="text-base font-semibold">Upcoming Renewals</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length} found</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search accounts..." value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-6 py-3">Account</th>
                                            <th className="px-6 py-3">Contract Value</th>
                                            <th className="px-6 py-3">Renewal Date</th>
                                            <th className="px-6 py-3">Health</th>
                                            <th className="px-6 py-3">Probability</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.length > 0 ? filtered.map((item) => {
                                            const hc = getHealthColor(item.health)
                                            return (
                                                <tr key={item.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(item)}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-9 w-9 rounded-none bg-white border border-slate-100 flex items-center justify-center group-hover:bg-indigo-50">
                                                                <Building className="h-4 w-4 text-indigo-600" />
                                                            </div>
                                                            <span className="text-sm font-semibold text-slate-800">{item.client}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-bold text-slate-900">${item.value.toLocaleString()}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2 text-[12px] text-slate-500">
                                                            <Calendar className="h-3.5 w-3.5" />
                                                            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-none border text-[11px] font-bold ${hc.bg} ${hc.text} border-slate-100`}>
                                                            <div className={`h-1.5 w-1.5 ${hc.dot}`} />{item.health}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <Progress value={item.probability} className="w-20 h-1.5" />
                                                            <span className="text-xs font-bold text-slate-900">{item.probability}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="rounded-none">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-40 rounded-none">
                                                                <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(item)}>
                                                                    <PencilLine className="h-4 w-4" /> Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="flex items-center gap-2" onClick={() => router.push('/client-management/customers')}>
                                                                    <ExternalLink className="h-4 w-4" /> View Client
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDelete(item.id)}>
                                                                    <Trash2 className="h-4 w-4" /> Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            )
                                        }) : (
                                            <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">No renewals match your search.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">Renewal Health Velocity</CardTitle>
                                <p className="text-sm text-slate-500 mt-1">Account health movements over recent weeks</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 bg-emerald-500" />
                                <span className="text-xs font-bold text-slate-900">Avg. Health: 88%</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={healthTrendData}>
                                        <defs>
                                            <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
                                        <YAxis hide domain={[0, 100]} />
                                        <RechartsTooltip />
                                        <Area type="monotone" dataKey="health" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorHealth)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Retention Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-none bg-orange-50/50 border border-orange-100 flex items-start gap-3 cursor-pointer hover:bg-orange-50 transition" onClick={() => setStatusFilter("At Risk")}>
                                <div className="h-10 w-10 shrink-0 rounded-none bg-orange-100 flex items-center justify-center text-orange-600">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-slate-900">Immediate Risk Alert</p>
                                    <p className="text-xs text-slate-500">3 high-value contracts expiring within 14 days without signed renewals.</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-none bg-emerald-50/50 border border-emerald-100 flex items-start gap-3 cursor-pointer hover:bg-emerald-50 transition" onClick={() => router.push('/client-management/analytics/forecasting')}>
                                <div className="h-10 w-10 shrink-0 rounded-none bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-slate-900">Renewal Forecasting</p>
                                    <p className="text-xs text-slate-500">Projected retention for Q4 is 98.2%, outperforming target of 95%.</p>
                                </div>
                            </div>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-none gap-2 mt-2" onClick={() => router.push('/client-management/analytics/retention')}>
                                Full Retention Audit <ArrowUpRight className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Churn Risk Factors</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { factor: 'Low Platform Usage', weight: 'High Risk', color: 'text-rose-600', bg: 'bg-rose-50' },
                                { factor: 'No Support Activity', weight: 'Medium Risk', color: 'text-amber-600', bg: 'bg-amber-50' },
                                { factor: 'Key Contact Change', weight: 'Neutral', color: 'text-slate-600', bg: 'bg-slate-50' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-none border border-slate-50 hover:border-slate-200 transition">
                                    <span className="text-[13px] font-bold text-slate-700">{item.factor}</span>
                                    <span className={`text-[11px] font-bold px-2 py-1 rounded-none ${item.bg} ${item.color}`}>{item.weight}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Recent Mitigation Wins</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { user: 'JR', action: 'Restored health for', target: 'Acme Corp', time: '2h ago' },
                                { user: 'SM', action: 'Upsold Enterprise to', target: 'Netflix', time: '5h ago' },
                                { user: 'AW', action: 'Initiated recovery for', target: 'Globex', time: '1d ago' },
                            ].map((win, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-none bg-white border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">{win.user}</div>
                                    <div className="flex-1">
                                        <p className="text-[12px] font-bold text-slate-700 leading-tight">{win.action} <span className="text-indigo-600">{win.target}</span></p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <History className="h-3 w-3 text-slate-300" />
                                            <p className="text-[11px] font-semibold text-slate-400">{win.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Renewal" : "Add Renewal"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Track a contract renewal event.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Account Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.client} onChange={e => setField("client", e.target.value)} placeholder="e.g., Acme Corp" className={`h-10 rounded-none ${errors.client ? "border-rose-500" : ""}`} />
                            {errors.client && <p className="text-[11px] text-rose-500">{errors.client}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Contract Value ($) <span className="text-rose-500">*</span></Label>
                                <Input type="number" value={form.value} onChange={e => setField("value", e.target.value)} placeholder="45000" className={`h-10 rounded-none ${errors.value ? "border-rose-500" : ""}`} />
                                {errors.value && <p className="text-[11px] text-rose-500">{errors.value}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Renewal Date <span className="text-rose-500">*</span></Label>
                                <Input type="date" value={form.date} onChange={e => setField("date", e.target.value)} className={`h-10 rounded-none ${errors.date ? "border-rose-500" : ""}`} />
                                {errors.date && <p className="text-[11px] text-rose-500">{errors.date}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Status</Label>
                                <Select value={form.status} onValueChange={(v: any) => setField("status", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Proposed">Proposed</SelectItem>
                                        <SelectItem value="In Discussion">In Discussion</SelectItem>
                                        <SelectItem value="Negotiating">Negotiating</SelectItem>
                                        <SelectItem value="Closing">Closing</SelectItem>
                                        <SelectItem value="At Risk">At Risk</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Probability (%)</Label>
                                <Input type="number" min="0" max="100" value={form.probability} onChange={e => setField("probability", e.target.value)} className={`h-10 rounded-none ${errors.probability ? "border-rose-500" : ""}`} />
                                {errors.probability && <p className="text-[11px] text-rose-500">{errors.probability}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Health</Label>
                            <Select value={form.health} onValueChange={(v: any) => setField("health", v)}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="Perfect">Perfect</SelectItem>
                                    <SelectItem value="Stable">Stable</SelectItem>
                                    <SelectItem value="Warning">Warning</SelectItem>
                                    <SelectItem value="Critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>{editingId ? "Save Changes" : "Add Renewal"}</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Renewals</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Status</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="Proposed">Proposed</SelectItem>
                                    <SelectItem value="In Discussion">In Discussion</SelectItem>
                                    <SelectItem value="Negotiating">Negotiating</SelectItem>
                                    <SelectItem value="Closing">Closing</SelectItem>
                                    <SelectItem value="At Risk">At Risk</SelectItem>
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
                        <SheetTitle className="text-[18px] font-semibold">Renewal Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Account</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.client}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Value</p><p className="font-semibold text-slate-900">${selected.value.toLocaleString()}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Date</p><p className="font-semibold text-slate-900">{new Date(selected.date).toLocaleDateString()}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p><Badge className="rounded-none">{selected.status}</Badge></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Probability</p><p className="font-semibold text-slate-900">{selected.probability}%</p></div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">Health</p>
                                        {(() => { const hc = getHealthColor(selected.health); return (
                                            <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-none border text-[11px] font-bold ${hc.bg} ${hc.text} border-slate-100`}>
                                                <div className={`h-1.5 w-1.5 ${hc.dot}`} />{selected.health}
                                            </div>
                                        ) })()}
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsDetailOpen(false); openEdit(selected) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDelete(selected.id); setIsDetailOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" />Delete
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
