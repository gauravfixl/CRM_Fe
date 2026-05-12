"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Target,
    TrendingUp,
    ArrowUpRight,
    RefreshCw,
    Search,
    Filter,
    MoreVertical,
    Calendar,
    Building2,
    Plus,
    Trash2,
    PencilLine,
    Eye,
    PieChart,
    CheckCircle2,
    Clock,
    Sparkles,
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

interface Opportunity {
    id: number
    client: string
    company: string
    type: 'New Deal' | 'Expansion' | 'Renewal'
    value: number
    stage: 'Discovery' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closing'
    probability: number
    expectedClose: string
    owner: string
}

const initialOpportunities: Opportunity[] = [
    { id: 1, client: "Enterprise Expansion", company: "Tech Co", type: "Expansion", value: 85000, stage: "Negotiation", probability: 80, expectedClose: "2024-10-30", owner: "John Doe" },
    { id: 2, client: "Global CRM Setup", company: "SysCorp", type: "New Deal", value: 240000, stage: "Discovery", probability: 35, expectedClose: "2024-12-15", owner: "Sarah Smith" },
    { id: 3, client: "Annual Service", company: "DataTech", type: "Renewal", value: 120000, stage: "Closing", probability: 95, expectedClose: "2024-11-05", owner: "Mike Johnson" },
    { id: 4, client: "Security Bundle", company: "Alpha Inc", type: "Expansion", value: 15000, stage: "Proposal", probability: 60, expectedClose: "2024-11-19", owner: "Lisa Chen" },
    { id: 5, client: "Cloud Migration", company: "BlueSky", type: "New Deal", value: 45000, stage: "Qualified", probability: 50, expectedClose: "2024-10-25", owner: "Emma Wilson" },
]

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    number: (v: any) => v === "" || v === null || v === undefined ? "" : isNaN(Number(v)) ? "Enter a valid number" : Number(v) < 0 ? "Must be positive" : "",
    percent: (v: any) => v === "" || v === null || v === undefined ? "" : isNaN(Number(v)) ? "Enter a valid number" : Number(v) < 0 || Number(v) > 100 ? "Must be between 0 and 100" : "",
    date: (v: string) => v && isNaN(new Date(v).getTime()) ? "Enter a valid date" : "",
}

const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`
    return `$${val}`
}

const getStageColor = (stage: string) => {
    switch (stage) {
        case 'Closing': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
        case 'Negotiation': return 'bg-indigo-50 text-indigo-600 border-indigo-100'
        case 'Proposal': return 'bg-blue-50 text-blue-600 border-blue-100'
        case 'Qualified': return 'bg-violet-50 text-violet-600 border-violet-100'
        default: return 'bg-slate-50 text-slate-600 border-slate-100'
    }
}

export default function OpportunitiesPage() {
    const router = useRouter()
    const [opportunities, setOpportunities] = React.useState<Opportunity[]>(initialOpportunities)
    const [search, setSearch] = React.useState("")
    const [stageFilter, setStageFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<number | null>(null)
    const [selected, setSelected] = React.useState<Opportunity | null>(null)

    const [form, setForm] = React.useState({
        client: "", company: "", type: "New Deal" as Opportunity['type'], value: "", stage: "Discovery" as Opportunity['stage'],
        probability: "50", expectedClose: "", owner: ""
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const metrics = React.useMemo(() => {
        const total = opportunities.reduce((s, o) => s + o.value, 0)
        const weighted = opportunities.reduce((s, o) => s + (o.value * o.probability / 100), 0)
        const avgProb = opportunities.length ? Math.round(opportunities.reduce((s, o) => s + o.probability, 0) / opportunities.length) : 0
        const highValue = opportunities.filter(o => o.value > 100000).length
        return {
            total: formatCurrency(total),
            weighted: formatCurrency(weighted),
            avgProb: `${avgProb}%`,
            highValue,
            count: opportunities.length,
        }
    }, [opportunities])

    const filtered = React.useMemo(() => {
        return opportunities.filter(o => {
            const matchSearch = !search || o.client.toLowerCase().includes(search.toLowerCase()) || o.company.toLowerCase().includes(search.toLowerCase()) || o.owner.toLowerCase().includes(search.toLowerCase())
            const matchStage = stageFilter === "all" || o.stage === stageFilter
            return matchSearch && matchStage
        })
    }, [opportunities, search, stageFilter])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.client = validators.required(form.client) || validators.minLen(2)(form.client)
        errs.company = validators.required(form.company) || validators.minLen(2)(form.company)
        errs.value = validators.required(form.value) || validators.number(form.value)
        errs.probability = validators.percent(form.probability)
        errs.expectedClose = validators.required(form.expectedClose) || validators.date(form.expectedClose)
        errs.owner = validators.required(form.owner)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ client: "", company: "", type: "New Deal", value: "", stage: "Discovery", probability: "50", expectedClose: "", owner: "" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (opp: Opportunity) => {
        setEditingId(opp.id)
        setForm({
            client: opp.client, company: opp.company, type: opp.type, value: String(opp.value),
            stage: opp.stage, probability: String(opp.probability), expectedClose: opp.expectedClose, owner: opp.owner
        })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        const data: Opportunity = {
            id: editingId || Date.now(),
            client: form.client.trim(),
            company: form.company.trim(),
            type: form.type,
            value: Number(form.value),
            stage: form.stage,
            probability: Number(form.probability),
            expectedClose: form.expectedClose,
            owner: form.owner.trim(),
        }
        if (editingId) {
            setOpportunities(opportunities.map(o => o.id === editingId ? data : o))
            toast.success("Opportunity updated")
        } else {
            setOpportunities([data, ...opportunities])
            toast.success("Opportunity created")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: number) => {
        setOpportunities(opportunities.filter(o => o.id !== id))
        toast.success("Opportunity removed")
    }

    const openDetail = (opp: Opportunity) => {
        setSelected(opp)
        setIsDetailOpen(true)
    }

    const kpiCards = [
        { title: "Total Pipeline", value: metrics.total, subtitle: `${metrics.count} Active Opportunities`, icon: Target, color: "indigo", trend: "+12%", path: "/client-management/revenue/overview" },
        { title: "Weighted Value", value: metrics.weighted, subtitle: "Adjusted Pipeline", icon: TrendingUp, color: "violet", trend: "+8%", path: "/client-management/analytics/revenue" },
        { title: "Avg. Probability", value: metrics.avgProb, subtitle: "Likelihood to Close", icon: RefreshCw, color: "emerald", trend: "+3%", path: "/client-management/analytics/forecasting" },
        { title: "High Value Deals", value: String(metrics.highValue), subtitle: "Deals above $100k", icon: ArrowUpRight, color: "amber", trend: `+${metrics.highValue}`, path: "/client-management/revenue/expansion" },
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
                        Active <span className="text-emerald-600">Opportunities</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Manage and track your active revenue pipeline across new sales and enterprise deals.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />New Opportunity
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
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
                    <Card className="rounded-none">
                        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-base font-semibold">Pipeline Overview</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length} Active</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search deals..." value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-6 py-3">Opportunity</th>
                                            <th className="px-6 py-3">Value</th>
                                            <th className="px-6 py-3">Stage</th>
                                            <th className="px-6 py-3">Probability</th>
                                            <th className="px-6 py-3">Close Date</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.length > 0 ? filtered.map((opp) => (
                                            <tr key={opp.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(opp)}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-none bg-white border border-slate-100 flex items-center justify-center group-hover:bg-emerald-50">
                                                            <Building2 className="h-4 w-4 text-emerald-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800">{opp.client}</p>
                                                            <p className="text-[11px] text-slate-500">{opp.company} • {opp.owner}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900">${opp.value.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${getStageColor(opp.stage)}`}>{opp.stage}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Progress value={opp.probability} className="w-20 h-1.5" />
                                                        <span className="text-xs font-bold text-slate-900">{opp.probability}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        <span className="text-[11px] font-semibold">{opp.expectedClose}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-none">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44 rounded-none">
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(opp)}>
                                                                <PencilLine className="h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openDetail(opp)}>
                                                                <Eye className="h-4 w-4" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDelete(opp.id)}>
                                                                <Trash2 className="h-4 w-4" /> Remove
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">No opportunities match your filters.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">Pipeline Stage Distribution</CardTitle>
                                <p className="text-sm text-slate-500 mt-1">Movement of deals through the sales cycle</p>
                            </div>
                            <PieChart className="h-5 w-5 text-slate-400" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(['Closing', 'Negotiation', 'Proposal', 'Qualified', 'Discovery'] as Opportunity['stage'][]).map((s, idx) => {
                                const list = opportunities.filter(o => o.stage === s)
                                const total = list.reduce((sum, o) => sum + o.value, 0)
                                const progress = Math.min(100, opportunities.length ? (list.length / opportunities.length) * 100 : 0)
                                return (
                                    <div key={idx} className="space-y-2 cursor-pointer hover:bg-slate-50 p-2 -m-2 transition" onClick={() => setStageFilter(s)}>
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-slate-700">{s} <span className="text-slate-400 font-medium ml-2">{list.length} Deals</span></span>
                                            <span className="text-slate-900">{formatCurrency(total)}</span>
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
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Priority Closures</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {opportunities.filter(o => o.probability > 70).slice(0, 4).map((deal, idx) => (
                                <div key={idx} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-2 rounded-none transition" onClick={() => openDetail(deal)}>
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-none bg-emerald-50 flex items-center justify-center text-[10px] font-bold text-emerald-600 border border-emerald-100">
                                            {deal.client.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 leading-none">{deal.client}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{deal.expectedClose}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-900">${(deal.value / 1000).toFixed(0)}k</p>
                                        <div className="flex items-center gap-1 justify-end mt-1">
                                            <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                                            <span className="text-[9px] font-bold text-emerald-600">{deal.probability}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-xs font-bold text-indigo-600 hover:text-indigo-700 rounded-none mt-3" onClick={() => router.push('/client-management/analytics/revenue')}>
                                View Full Pipeline Analytics
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-indigo-100 bg-indigo-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-indigo-600 tracking-wider flex items-center gap-2 uppercase">
                                <Sparkles className="h-4 w-4" /> AI Deal Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    <span className="text-indigo-600 font-bold">Project Horizon</span> has been in Discovery for 24 days. Set a follow-up task now.
                                </p>
                            </div>
                            <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    Similar deals with <span className="text-indigo-600 font-bold">90%+ prob.</span> usually close in 14 days.
                                </p>
                            </div>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-none mt-2" onClick={() => { toast.success("Win-strategy analysis started"); router.push('/client-management/analytics/ai-insights') }}>
                                Run Win-Strategy Analysis
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Sales Momentum</CardTitle>
                            <Clock className="h-4 w-4 text-indigo-400" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { user: 'JD', action: 'Moved to Closing', target: 'Acme Corp', time: '1h ago' },
                                { user: 'SW', action: 'New Opportunity:', target: 'Netflix', time: '3h ago' },
                                { user: 'MJ', action: 'Stage change for', target: 'Globex', time: '1d ago' },
                            ].map((log, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-none bg-white border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">{log.user}</div>
                                    <div className="flex-1">
                                        <p className="text-[12px] font-bold text-slate-700 leading-tight">{log.action} <span className="text-indigo-600">{log.target}</span></p>
                                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{log.time}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Sheet (Add/Edit Opportunity) */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-emerald-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Opportunity" : "Create Opportunity"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Track a new revenue opportunity.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Opportunity Name <span className="text-rose-500">*</span></Label>
                                <Input value={form.client} onChange={e => setField("client", e.target.value)} placeholder="e.g., Enterprise License" className={`h-10 rounded-none ${errors.client ? "border-rose-500" : ""}`} />
                                {errors.client && <p className="text-[11px] text-rose-500">{errors.client}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Company <span className="text-rose-500">*</span></Label>
                                <Input value={form.company} onChange={e => setField("company", e.target.value)} placeholder="e.g., Acme Corp" className={`h-10 rounded-none ${errors.company ? "border-rose-500" : ""}`} />
                                {errors.company && <p className="text-[11px] text-rose-500">{errors.company}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Value ($) <span className="text-rose-500">*</span></Label>
                                <Input type="number" value={form.value} onChange={e => setField("value", e.target.value)} placeholder="50000" className={`h-10 rounded-none ${errors.value ? "border-rose-500" : ""}`} />
                                {errors.value && <p className="text-[11px] text-rose-500">{errors.value}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Probability (%)</Label>
                                <Input type="number" min="0" max="100" value={form.probability} onChange={e => setField("probability", e.target.value)} placeholder="50" className={`h-10 rounded-none ${errors.probability ? "border-rose-500" : ""}`} />
                                {errors.probability && <p className="text-[11px] text-rose-500">{errors.probability}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Stage</Label>
                                <Select value={form.stage} onValueChange={(v: any) => setField("stage", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Discovery">Discovery</SelectItem>
                                        <SelectItem value="Qualified">Qualified</SelectItem>
                                        <SelectItem value="Proposal">Proposal</SelectItem>
                                        <SelectItem value="Negotiation">Negotiation</SelectItem>
                                        <SelectItem value="Closing">Closing</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Type</Label>
                                <Select value={form.type} onValueChange={(v: any) => setField("type", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="New Deal">New Deal</SelectItem>
                                        <SelectItem value="Expansion">Expansion</SelectItem>
                                        <SelectItem value="Renewal">Renewal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Expected Close Date <span className="text-rose-500">*</span></Label>
                            <Input type="date" value={form.expectedClose} onChange={e => setField("expectedClose", e.target.value)} className={`h-10 rounded-none ${errors.expectedClose ? "border-rose-500" : ""}`} />
                            {errors.expectedClose && <p className="text-[11px] text-rose-500">{errors.expectedClose}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Owner <span className="text-rose-500">*</span></Label>
                            <Input value={form.owner} onChange={e => setField("owner", e.target.value)} placeholder="e.g., John Doe" className={`h-10 rounded-none ${errors.owner ? "border-rose-500" : ""}`} />
                            {errors.owner && <p className="text-[11px] text-rose-500">{errors.owner}</p>}
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none" onClick={handleSave}>
                            {editingId ? "Save Changes" : "Create Opportunity"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-emerald-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Opportunities</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Stage</Label>
                            <Select value={stageFilter} onValueChange={setStageFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Stages</SelectItem>
                                    <SelectItem value="Discovery">Discovery</SelectItem>
                                    <SelectItem value="Qualified">Qualified</SelectItem>
                                    <SelectItem value="Proposal">Proposal</SelectItem>
                                    <SelectItem value="Negotiation">Negotiation</SelectItem>
                                    <SelectItem value="Closing">Closing</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setStageFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-emerald-50">
                        <SheetTitle className="text-[18px] font-semibold">Opportunity Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Opportunity</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.client}</p>
                                    <p className="text-sm text-slate-500">{selected.company}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Value</p><p className="font-semibold text-slate-900">${selected.value.toLocaleString()}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Type</p><Badge className="rounded-none">{selected.type}</Badge></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Stage</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${getStageColor(selected.stage)}`}>{selected.stage}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Probability</p><p className="font-semibold text-slate-900">{selected.probability}%</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Close Date</p><p className="font-semibold text-slate-900">{selected.expectedClose}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Owner</p><p className="font-semibold text-slate-900">{selected.owner}</p></div>
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
