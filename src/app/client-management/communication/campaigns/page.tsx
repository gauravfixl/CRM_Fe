"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Megaphone, Search, Filter, MoreVertical, Plus, Trash2, PencilLine, Eye,
    Target, Users, TrendingUp, CheckCircle2, Clock, Play, Pause, BarChart3,
    ArrowUpRight, ChevronRight, Sparkles,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Badge } from "@/shared/components/ui/badge"
import { Progress } from "@/shared/components/ui/progress"
import { toast } from "@/shared/utils/toast"

interface Campaign {
    id: number
    name: string
    status: 'Active' | 'Draft' | 'Paused' | 'Completed'
    audience: string
    reach: number
    engagement: number
    type: 'Email' | 'Multi-Channel' | 'SMS'
    startDate: string
    schedule: string
    description?: string
}

const initialCampaigns: Campaign[] = [
    { id: 1, name: "Q4 Partner Expansion", status: "Active", audience: "Enterprise Tier 1", reach: 1240, engagement: 42, type: "Multi-Channel", startDate: "2024-10-01", schedule: "Daily", description: "Drive expansion across top-tier accounts." },
    { id: 2, name: "AI Features Beta Teaser", status: "Paused", audience: "Power Users", reach: 3500, engagement: 68, type: "Email", startDate: "2024-09-28", schedule: "Weekly", description: "Generate beta interest for new AI features." },
    { id: 3, name: "Annual Renewal Reminder", status: "Active", audience: "Subscription Expiring", reach: 450, engagement: 89, type: "Email", startDate: "2024-10-05", schedule: "Trigger-based" },
    { id: 4, name: "Retention Drive: Inactive", status: "Draft", audience: "Inactive > 30d", reach: 890, engagement: 0, type: "SMS", startDate: "2024-10-20", schedule: "One-time" },
    { id: 5, name: "Strategic QBR Push", status: "Completed", audience: "Key Stakeholders", reach: 120, engagement: 94, type: "Multi-Channel", startDate: "2024-09-15", schedule: "Weekly" },
]

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    number: (v: any) => v === "" || v === null || v === undefined ? "" : isNaN(Number(v)) ? "Enter a valid number" : Number(v) < 0 ? "Must be positive" : "",
    date: (v: string) => v && isNaN(new Date(v).getTime()) ? "Enter a valid date" : "",
}

const getStatusProps = (status: string) => {
    switch (status) {
        case 'Active': return { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: Play }
        case 'Paused': return { color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Pause }
        case 'Draft': return { color: 'bg-slate-50 text-slate-600 border-slate-100', icon: Clock }
        case 'Completed': return { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: CheckCircle2 }
        default: return { color: 'bg-slate-50 text-slate-600 border-slate-100', icon: Clock }
    }
}

export default function CampaignsPage() {
    const router = useRouter()
    const [campaigns, setCampaigns] = React.useState<Campaign[]>(initialCampaigns)
    const [search, setSearch] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState("all")
    const [typeFilter, setTypeFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<number | null>(null)
    const [selected, setSelected] = React.useState<Campaign | null>(null)

    const [form, setForm] = React.useState({
        name: "", audience: "", type: "Email" as Campaign['type'],
        status: "Draft" as Campaign['status'], reach: "0", startDate: "",
        schedule: "One-time", description: "",
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const metrics = React.useMemo(() => {
        const total = campaigns.length
        const activeCount = campaigns.filter(c => c.status === 'Active').length
        const avgEngagement = (campaigns.reduce((s, c) => s + c.engagement, 0) / (campaigns.filter(c => c.status !== 'Draft').length || 1)).toFixed(0)
        const totalReach = campaigns.reduce((s, c) => s + c.reach, 0).toLocaleString()
        return { total, activeCount, avgEngagement: `${avgEngagement}%`, totalReach }
    }, [campaigns])

    const filtered = React.useMemo(() => {
        return campaigns.filter(c =>
            (statusFilter === "all" || c.status === statusFilter) &&
            (typeFilter === "all" || c.type === typeFilter) &&
            (c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.audience.toLowerCase().includes(search.toLowerCase()))
        )
    }, [campaigns, search, statusFilter, typeFilter])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(3)(form.name)
        errs.audience = validators.required(form.audience)
        errs.reach = validators.number(form.reach)
        errs.startDate = validators.required(form.startDate) || validators.date(form.startDate)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", audience: "", type: "Email", status: "Draft", reach: "0", startDate: "", schedule: "One-time", description: "" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (c: Campaign) => {
        setEditingId(c.id)
        setForm({
            name: c.name, audience: c.audience, type: c.type, status: c.status,
            reach: String(c.reach), startDate: c.startDate, schedule: c.schedule, description: c.description || "",
        })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setCampaigns(campaigns.map(c => c.id === editingId ? {
                ...c, name: form.name.trim(), audience: form.audience.trim(), type: form.type,
                status: form.status, reach: Number(form.reach), startDate: form.startDate,
                schedule: form.schedule, description: form.description.trim(),
            } : c))
            toast.success("Campaign updated")
        } else {
            const newC: Campaign = {
                id: Date.now(),
                name: form.name.trim(),
                audience: form.audience.trim(),
                type: form.type,
                status: form.status,
                reach: Number(form.reach),
                engagement: 0,
                startDate: form.startDate,
                schedule: form.schedule,
                description: form.description.trim(),
            }
            setCampaigns([newC, ...campaigns])
            toast.success("Campaign launched")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: number) => {
        setCampaigns(campaigns.filter(c => c.id !== id))
        toast.success("Campaign archived")
    }

    const toggleStatus = (c: Campaign) => {
        const newStatus = c.status === 'Active' ? 'Paused' : 'Active'
        setCampaigns(campaigns.map(x => x.id === c.id ? { ...x, status: newStatus } : x))
        toast.success(`Campaign ${newStatus === 'Active' ? 'resumed' : 'paused'}`)
    }

    const openDetail = (c: Campaign) => { setSelected(c); setIsDetailOpen(true) }

    const kpiCards = [
        { title: "Active Campaigns", value: String(metrics.activeCount), subtitle: "Live Workflows", icon: Play, color: "rose", trend: "+2", path: "/client-management/communication/broadcast" },
        { title: "Global Engagement", value: metrics.avgEngagement, subtitle: "Portfolio Score", icon: TrendingUp, color: "emerald", trend: "+8%", path: "/client-management/analytics/overview" },
        { title: "Total Reach", value: metrics.totalReach, subtitle: "Last 30 days", icon: Users, color: "blue", trend: "+12%", path: "/client-management/customers" },
        { title: "High Intensity", value: "3", subtitle: "Critical Priority", icon: Target, color: "amber", trend: "", path: "/client-management/communication/email" },
    ]
    const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        rose: { bg: "bg-gradient-to-br from-rose-50 to-rose-100/50", border: "border-rose-200/50", text: "text-rose-600", iconBg: "bg-rose-100" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        blue: { bg: "bg-gradient-to-br from-blue-50 to-blue-100/50", border: "border-blue-200/50", text: "text-blue-600", iconBg: "bg-blue-100" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", border: "border-amber-200/50", text: "text-amber-600", iconBg: "bg-amber-100" },
    }

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Outreach <span className="text-rose-600">Campaigns</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Design and orchestrate multi-channel communication sequences for targeted segments.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />Launch Campaign
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
                                            {kpi.trend && <span className="text-xs font-bold text-emerald-600">{kpi.trend}</span>}
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
                                <CardTitle className="text-base font-semibold">Campaign Command Center</CardTitle>
                                <Badge className="rounded-none bg-rose-50 text-rose-600 border-0">{filtered.length} tracks</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search campaigns..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-6 py-3">Campaign</th>
                                            <th className="px-6 py-3">Status & Type</th>
                                            <th className="px-6 py-3">Reach & Engagement</th>
                                            <th className="px-6 py-3">Start</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.length > 0 ? filtered.map(c => {
                                            const props = getStatusProps(c.status)
                                            const SIcon = props.icon
                                            return (
                                                <tr key={c.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(c)}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-9 w-9 rounded-none bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                                                                <Megaphone className="h-4 w-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-800 max-w-[180px] truncate">{c.name}</p>
                                                                <p className="text-[10px] text-slate-400 mt-0.5">{c.audience}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1">
                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[10px] font-bold border w-fit ${props.color}`}>
                                                                <SIcon className="h-3 w-3" />{c.status}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-slate-400 ml-0.5">{c.type}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-[10px] font-bold">
                                                                <span className="text-slate-600">{c.reach.toLocaleString()} Reach</span>
                                                                <span className="text-rose-600">{c.engagement}%</span>
                                                            </div>
                                                            <Progress value={c.engagement} className="h-1 bg-slate-50" />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1 text-slate-500">
                                                            <Clock className="h-3 w-3" />
                                                            <span className="text-[11px] font-bold">{c.startDate}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="rounded-none"><MoreVertical className="h-4 w-4" /></Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="rounded-none w-44">
                                                                <DropdownMenuItem onClick={() => openDetail(c)}><Eye className="h-4 w-4 mr-2" />View</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => openEdit(c)}><PencilLine className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => toast.success("Opening ROI analytics")}><BarChart3 className="h-4 w-4 mr-2" />ROI</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => toggleStatus(c)}>
                                                                    {c.status === 'Active' ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                                                                    {c.status === 'Active' ? 'Pause' : 'Resume'}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="text-rose-500 border-t mt-1" onClick={() => handleDelete(c.id)}>
                                                                    <Trash2 className="h-4 w-4 mr-2" />Archive
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            )
                                        }) : (
                                            <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">No campaigns match your filters.</td></tr>
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
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-widest uppercase">Conversion Funnel</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { stage: 'Initial Reach', pct: 100, color: 'bg-slate-400' },
                                { stage: 'Email Open', pct: 72, color: 'bg-blue-500' },
                                { stage: 'CTA Click', pct: 24, color: 'bg-rose-500' },
                                { stage: 'Conversion', pct: 6, color: 'bg-emerald-500' },
                            ].map((s, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-[11px] font-bold">
                                        <span className="text-slate-600">{s.stage}</span>
                                        <span className="text-slate-900">{s.pct}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-none">
                                        <div className={`h-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-emerald-100 bg-emerald-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-emerald-600 tracking-widest uppercase flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" /> Top Performer
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-3 bg-white border border-emerald-100 rounded-none cursor-pointer" onClick={() => openDetail(campaigns[0])}>
                                <div className="flex items-start justify-between mb-2">
                                    <p className="text-[12px] font-bold text-slate-900">Q4 Partner Expansion</p>
                                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                                </div>
                                <p className="text-[10px] text-slate-400 mb-3">Enterprise Segments</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-center p-2 bg-emerald-50">
                                        <p className="text-[12px] font-bold text-emerald-600">42%</p>
                                        <p className="text-[8px] text-slate-400">Eng. Rate</p>
                                    </div>
                                    <div className="text-center p-2 bg-blue-50">
                                        <p className="text-[12px] font-bold text-blue-600">1.2k</p>
                                        <p className="text-[8px] text-slate-400">Reach</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-widest uppercase">Growth Triggers</CardTitle>
                            <Sparkles className="h-4 w-4 text-indigo-400" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {[
                                { text: 'Expansion Alert V2', type: 'Email', drift: '+12%' },
                                { text: 'Renewal Ping', type: 'SMS', drift: '+4%' },
                            ].map((t, i) => (
                                <div key={i} className="flex items-center justify-between p-2 bg-slate-50/50 border border-slate-100 rounded-none cursor-pointer hover:border-rose-200" onClick={() => router.push('/client-management/communication/templates')}>
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-700">{t.text}</p>
                                        <p className="text-[9px] text-slate-400">{t.type}</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-500">{t.drift}</span>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full rounded-none text-rose-600 text-[11px] font-bold mt-2" onClick={() => router.push('/client-management/communication/templates')}>
                                Manage Triggers <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-rose-50 to-amber-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Campaign" : "Launch Campaign"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Define outreach protocol parameters.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Campaign Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g. Q4 Executive Push" className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`} />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Audience / Segment <span className="text-rose-500">*</span></Label>
                            <Input value={form.audience} onChange={e => setField("audience", e.target.value)} placeholder="e.g. Inactive Accounts" className={`h-10 rounded-none ${errors.audience ? "border-rose-500" : ""}`} />
                            {errors.audience && <p className="text-[11px] text-rose-500">{errors.audience}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Channel</Label>
                                <Select value={form.type} onValueChange={(v: any) => setField("type", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Email">Email</SelectItem>
                                        <SelectItem value="SMS">SMS</SelectItem>
                                        <SelectItem value="Multi-Channel">Multi-Channel</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Status</Label>
                                <Select value={form.status} onValueChange={(v: any) => setField("status", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Draft">Draft</SelectItem>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Paused">Paused</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Reach</Label>
                                <Input type="number" value={form.reach} onChange={e => setField("reach", e.target.value)} className={`h-10 rounded-none ${errors.reach ? "border-rose-500" : ""}`} />
                                {errors.reach && <p className="text-[11px] text-rose-500">{errors.reach}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Start Date <span className="text-rose-500">*</span></Label>
                                <Input type="date" value={form.startDate} onChange={e => setField("startDate", e.target.value)} className={`h-10 rounded-none ${errors.startDate ? "border-rose-500" : ""}`} />
                                {errors.startDate && <p className="text-[11px] text-rose-500">{errors.startDate}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Schedule</Label>
                            <Select value={form.schedule} onValueChange={(v) => setField("schedule", v)}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="One-time">One-time</SelectItem>
                                    <SelectItem value="Daily">Daily</SelectItem>
                                    <SelectItem value="Weekly">Weekly</SelectItem>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="Trigger-based">Trigger-based</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Description</Label>
                            <Input value={form.description} onChange={e => setField("description", e.target.value)} placeholder="Brief campaign description" className="h-10 rounded-none" />
                        </div>
                        <div className="p-3 bg-rose-50/30 border border-rose-100 rounded-none">
                            <p className="text-[11px] font-bold text-rose-800 flex items-center gap-1.5 mb-1">
                                <Sparkles className="h-3.5 w-3.5" /> AI Predictive Reach
                            </p>
                            <p className="text-[11px] text-slate-600">This audience has <span className="text-emerald-600 font-bold">78%</span> probability of meeting engagement KPIs.</p>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-rose-600 hover:bg-rose-700 text-white rounded-none" onClick={handleSave}>
                            {editingId ? "Save Changes" : "Launch"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-rose-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Campaigns</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Status</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Paused">Paused</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Channel</Label>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="Email">Email</SelectItem>
                                    <SelectItem value="SMS">SMS</SelectItem>
                                    <SelectItem value="Multi-Channel">Multi-Channel</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setStatusFilter("all"); setTypeFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-rose-600 hover:bg-rose-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-rose-50">
                        <SheetTitle className="text-[18px] font-semibold">Campaign Detail</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Campaign</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                                    <p className="text-sm text-slate-500">{selected.audience}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Channel</p><p className="font-semibold text-slate-900">{selected.type}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${getStatusProps(selected.status).color}`}>{selected.status}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Reach</p><p className="font-semibold text-slate-900">{selected.reach.toLocaleString()}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Engagement</p><p className="font-semibold text-slate-900">{selected.engagement}%</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Start Date</p><p className="font-semibold text-slate-900">{selected.startDate}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Schedule</p><Badge className="rounded-none">{selected.schedule}</Badge></div>
                                </div>
                                {selected.description && (
                                    <div className="border-t pt-3">
                                        <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Description</p>
                                        <p className="text-[13px] text-slate-700">{selected.description}</p>
                                    </div>
                                )}
                                <div className="border-t pt-3">
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-2">Performance</p>
                                    <Progress value={selected.engagement} className="h-2 bg-slate-50" />
                                    <p className="text-[11px] text-slate-500 mt-1">{selected.engagement}% engagement rate</p>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsDetailOpen(false); openEdit(selected) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDelete(selected.id); setIsDetailOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" />Archive
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
