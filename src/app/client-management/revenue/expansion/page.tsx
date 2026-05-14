"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RPieChart, Pie } from 'recharts'
import {
    Zap,
    TrendingUp,
    ArrowUpRight,
    PackagePlus,
    Layers,
    Sparkles,
    Search,
    Filter,
    MoreVertical,
    Building2,
    Rocket,
    Plus,
    Target,
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

interface Expansion {
    id: number
    client: string
    target: string
    value: number
    type: 'Upsell' | 'Cross-sell' | 'Add-on' | 'Upgrade'
    probability: number
    segment: 'Enterprise' | 'Mid-Market' | 'SMB'
}

const initialExpansions: Expansion[] = [
    { id: 1, client: 'DataScale Inc', target: 'Professional Upgrade', value: 8500, type: 'Upsell', probability: 75, segment: 'Mid-Market' },
    { id: 2, client: 'Innova Hub', target: 'API & Webhooks Add-on', value: 2200, type: 'Add-on', probability: 90, segment: 'SMB' },
    { id: 3, client: 'Global Dynamics', target: 'Global Security Suite', value: 12000, type: 'Cross-sell', probability: 45, segment: 'Enterprise' },
    { id: 4, client: 'Swift Apps', target: 'Unlimited Seats', value: 1500, type: 'Upgrade', probability: 95, segment: 'SMB' },
    { id: 5, client: 'Horizon Media', target: 'SSO & Advanced Governance', value: 4800, type: 'Upsell', probability: 82, segment: 'Mid-Market' },
]

const segmentColors: Record<string, string> = {
    'Enterprise': 'bg-violet-50 text-violet-600 border-violet-100',
    'Mid-Market': 'bg-indigo-50 text-indigo-600 border-indigo-100',
    'SMB': 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100',
}

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    number: (v: any) => v === "" || v == null ? "" : isNaN(Number(v)) ? "Enter a valid number" : Number(v) < 0 ? "Must be positive" : "",
    percent: (v: any) => v === "" || v == null ? "" : isNaN(Number(v)) ? "Enter a valid number" : Number(v) < 0 || Number(v) > 100 ? "Must be 0–100" : "",
}

const formatCurrency = (val: number) => val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`

export default function ExpansionPage() {
    const router = useRouter()
    const [expansions, setExpansions] = React.useState<Expansion[]>(initialExpansions)
    const [search, setSearch] = React.useState("")
    const [segmentFilter, setSegmentFilter] = React.useState("all")
    const [typeFilter, setTypeFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<number | null>(null)
    const [selected, setSelected] = React.useState<Expansion | null>(null)

    const [form, setForm] = React.useState({
        client: "", target: "", value: "", type: "Upsell" as Expansion['type'], probability: "50", segment: "Mid-Market" as Expansion['segment']
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const metrics = React.useMemo(() => {
        const total = expansions.reduce((s, e) => s + e.value, 0)
        const avg = expansions.length ? Math.round(total / expansions.length) : 0
        const highProb = expansions.filter(e => e.probability > 80).length
        return { total: formatCurrency(total), avg: formatCurrency(avg), highProb, count: expansions.length }
    }, [expansions])

    const filtered = React.useMemo(() => {
        return expansions.filter(e => {
            const matchSearch = !search || e.client.toLowerCase().includes(search.toLowerCase()) || e.target.toLowerCase().includes(search.toLowerCase())
            const matchSegment = segmentFilter === "all" || e.segment === segmentFilter
            const matchType = typeFilter === "all" || e.type === typeFilter
            return matchSearch && matchSegment && matchType
        })
    }, [expansions, search, segmentFilter, typeFilter])

    const chartData = React.useMemo(() => {
        const byType: Record<string, number> = {}
        expansions.forEach(e => { byType[e.type] = (byType[e.type] || 0) + e.value })
        const colors: Record<string, string> = { Upsell: '#4f46e5', 'Cross-sell': '#8b5cf6', 'Add-on': '#d946ef', Upgrade: '#06b6d4' }
        return Object.entries(byType).map(([name, value]) => ({ name, value, color: colors[name] || '#94a3b8' }))
    }, [expansions])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = () => {
        const errs: Record<string, string> = {}
        errs.client = validators.required(form.client) || validators.minLen(2)(form.client)
        errs.target = validators.required(form.target) || validators.minLen(2)(form.target)
        errs.value = validators.required(form.value) || validators.number(form.value)
        errs.probability = validators.percent(form.probability)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ client: "", target: "", value: "", type: "Upsell", probability: "50", segment: "Mid-Market" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (e: Expansion) => {
        setEditingId(e.id)
        setForm({ client: e.client, target: e.target, value: String(e.value), type: e.type, probability: String(e.probability), segment: e.segment })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        const data: Expansion = {
            id: editingId || Date.now(),
            client: form.client.trim(), target: form.target.trim(),
            value: Number(form.value), type: form.type, probability: Number(form.probability), segment: form.segment
        }
        if (editingId) { setExpansions(expansions.map(e => e.id === editingId ? data : e)); toast.success("Opportunity updated") }
        else { setExpansions([data, ...expansions]); toast.success("Opportunity added") }
        setIsFormOpen(false)
    }

    const handleDelete = (id: number) => {
        setExpansions(expansions.filter(e => e.id !== id))
        toast.success("Opportunity removed")
    }

    const openDetail = (e: Expansion) => { setSelected(e); setIsDetailOpen(true) }

    const kpiCards = [
        { title: "Pipeline Value", value: metrics.total, subtitle: `${metrics.count} Opportunities`, icon: Zap, color: "indigo", trend: "+18%", path: "/client-management/revenue/overview" },
        { title: "Avg Deal Size", value: metrics.avg, subtitle: "Per Opportunity", icon: TrendingUp, color: "violet", trend: "+5%", path: "/client-management/analytics/revenue" },
        { title: "High Probability", value: `${metrics.highProb}`, subtitle: "Above 80% confidence", icon: Rocket, color: "fuchsia", trend: `+${metrics.highProb}`, path: "/client-management/analytics/forecasting" },
        { title: "Win Rate", value: "62%", subtitle: "Last Quarter", icon: Target, color: "amber", trend: "+8%", path: "/client-management/analytics/cohorts" },
    ]
    const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        indigo: { bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", border: "border-indigo-200/50", text: "text-indigo-600", iconBg: "bg-indigo-100" },
        violet: { bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", border: "border-violet-200/50", text: "text-violet-600", iconBg: "bg-violet-100" },
        fuchsia: { bg: "bg-gradient-to-br from-fuchsia-50 to-fuchsia-100/50", border: "border-fuchsia-200/50", text: "text-fuchsia-600", iconBg: "bg-fuchsia-100" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", border: "border-amber-200/50", text: "text-amber-600", iconBg: "bg-amber-100" },
    }

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Revenue <span className="text-violet-600">Expansion Engine</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Identify upsell paths and cross-sell opportunities to maximize account lifetime value.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />New Expansion
                    </Button>
                </div>
            </div>

            {/* KPI */}
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
                                            <span className="text-xs font-bold text-emerald-600">{kpi.trend}</span>
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
                    {/* Expansion List */}
                    <Card className="rounded-none">
                        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-base font-semibold">Active Expansion Opportunities</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length}</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-6 py-3">Account & Target</th>
                                            <th className="px-6 py-3">Type</th>
                                            <th className="px-6 py-3">Segment</th>
                                            <th className="px-6 py-3">Value</th>
                                            <th className="px-6 py-3">Probability</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.length > 0 ? filtered.map((exp) => (
                                            <tr key={exp.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(exp)}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-none bg-white border border-slate-100 flex items-center justify-center group-hover:bg-violet-50">
                                                            <Building2 className="h-4 w-4 text-violet-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800">{exp.client}</p>
                                                            <p className="text-[11px] text-slate-500">{exp.target}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge className="rounded-none bg-violet-50 text-violet-700 hover:bg-violet-50">{exp.type}</Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2 py-0.5 rounded-none text-[11px] font-bold border ${segmentColors[exp.segment]}`}>{exp.segment}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900">{formatCurrency(exp.value)}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Progress value={exp.probability} className="w-20 h-1.5" />
                                                        <span className="text-xs font-bold text-slate-900">{exp.probability}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-none"><MoreVertical className="h-4 w-4" /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-40 rounded-none">
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(exp)}>
                                                                <PencilLine className="h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => router.push('/client-management/customers')}>
                                                                <ExternalLink className="h-4 w-4" /> View Client
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDelete(exp.id)}>
                                                                <Trash2 className="h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">No expansion opportunities found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bar Chart */}
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Expansion by Type</CardTitle>
                            <p className="text-sm text-slate-500">Value distribution across upsell categories</p>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" />
                                    <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip formatter={(v: any) => `$${v.toLocaleString()}`} />
                                    <Bar dataKey="value">
                                        {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* AI Recommendation */}
                    <Card className="rounded-none border-violet-100 bg-violet-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-violet-600 tracking-wider flex items-center gap-2 uppercase">
                                <Sparkles className="h-4 w-4" /> AI Expansion Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-violet-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    <span className="text-violet-600 font-bold">DataScale Inc</span> shows usage patterns matching Enterprise tier - 85% upgrade probability.
                                </p>
                            </div>
                            <div className="p-3 bg-white border border-violet-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    Top SMB accounts likely to add <span className="text-violet-600 font-bold">SSO/Governance</span> bundle this quarter.
                                </p>
                            </div>
                            <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-none" onClick={() => router.push('/client-management/analytics/ai-insights')}>
                                Run Account Analysis
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Type Distribution */}
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Type Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={180}>
                                <RPieChart>
                                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                                        {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip />
                                </RPieChart>
                            </ResponsiveContainer>
                            <div className="space-y-2 mt-3">
                                {chartData.map((c, i) => (
                                    <div key={i} className="flex items-center justify-between text-[11px] cursor-pointer hover:bg-slate-50 px-2 py-1 -mx-2" onClick={() => setTypeFilter(c.name)}>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2" style={{ background: c.color }} />
                                            <span className="font-medium text-slate-700">{c.name}</span>
                                        </div>
                                        <span className="font-bold text-slate-900">{formatCurrency(c.value)}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Wins */}
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Recent Expansion Wins</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { user: 'SM', action: 'Closed Cross-sell', target: 'TechFlow', time: '2h ago' },
                                { user: 'JD', action: 'Upsold Enterprise to', target: 'CloudNine', time: '1d ago' },
                                { user: 'AW', action: 'Added Pro to', target: 'Globex', time: '3d ago' },
                            ].map((win, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-none bg-violet-50 border border-violet-100 flex items-center justify-center text-xs font-bold text-violet-600">{win.user}</div>
                                    <div className="flex-1">
                                        <p className="text-[12px] font-bold text-slate-700">{win.action} <span className="text-violet-600">{win.target}</span></p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">{win.time}</p>
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
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-violet-50 to-fuchsia-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Expansion" : "New Expansion"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Add a new upsell or cross-sell opportunity.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Account <span className="text-rose-500">*</span></Label>
                            <Input value={form.client} onChange={e => setField("client", e.target.value)} placeholder="e.g., DataScale Inc" className={`h-10 rounded-none ${errors.client ? "border-rose-500" : ""}`} />
                            {errors.client && <p className="text-[11px] text-rose-500">{errors.client}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Target Product / Plan <span className="text-rose-500">*</span></Label>
                            <Input value={form.target} onChange={e => setField("target", e.target.value)} placeholder="e.g., Professional Upgrade" className={`h-10 rounded-none ${errors.target ? "border-rose-500" : ""}`} />
                            {errors.target && <p className="text-[11px] text-rose-500">{errors.target}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Type</Label>
                                <Select value={form.type} onValueChange={(v: any) => setField("type", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Upsell">Upsell</SelectItem>
                                        <SelectItem value="Cross-sell">Cross-sell</SelectItem>
                                        <SelectItem value="Add-on">Add-on</SelectItem>
                                        <SelectItem value="Upgrade">Upgrade</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Segment</Label>
                                <Select value={form.segment} onValueChange={(v: any) => setField("segment", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Enterprise">Enterprise</SelectItem>
                                        <SelectItem value="Mid-Market">Mid-Market</SelectItem>
                                        <SelectItem value="SMB">SMB</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Value ($) <span className="text-rose-500">*</span></Label>
                                <Input type="number" value={form.value} onChange={e => setField("value", e.target.value)} placeholder="5000" className={`h-10 rounded-none ${errors.value ? "border-rose-500" : ""}`} />
                                {errors.value && <p className="text-[11px] text-rose-500">{errors.value}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Probability (%)</Label>
                                <Input type="number" min="0" max="100" value={form.probability} onChange={e => setField("probability", e.target.value)} className={`h-10 rounded-none ${errors.probability ? "border-rose-500" : ""}`} />
                                {errors.probability && <p className="text-[11px] text-rose-500">{errors.probability}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-violet-600 hover:bg-violet-700 text-white rounded-none" onClick={handleSave}>{editingId ? "Save" : "Add"}</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Expansions</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Type</Label>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="Upsell">Upsell</SelectItem>
                                    <SelectItem value="Cross-sell">Cross-sell</SelectItem>
                                    <SelectItem value="Add-on">Add-on</SelectItem>
                                    <SelectItem value="Upgrade">Upgrade</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Segment</Label>
                            <Select value={segmentFilter} onValueChange={setSegmentFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Segments</SelectItem>
                                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                                    <SelectItem value="Mid-Market">Mid-Market</SelectItem>
                                    <SelectItem value="SMB">SMB</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setTypeFilter("all"); setSegmentFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-violet-600 hover:bg-violet-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold">Expansion Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Account</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.client}</p>
                                    <p className="text-sm text-slate-500">{selected.target}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Type</p><Badge className="rounded-none">{selected.type}</Badge></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Segment</p>
                                        <span className={`inline-flex px-2 py-0.5 rounded-none text-[11px] font-bold border ${segmentColors[selected.segment]}`}>{selected.segment}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Value</p><p className="font-semibold text-slate-900">{formatCurrency(selected.value)}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Probability</p><p className="font-semibold text-slate-900">{selected.probability}%</p></div>
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
