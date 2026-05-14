"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    History, Search, Filter, MoreVertical, Plus, Trash2, Eye, Mail, Smartphone, Bell,
    CheckCircle2, Clock, AlertCircle, Calendar, Download, ArrowUpRight, MessageSquare, Zap,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Badge } from "@/shared/components/ui/badge"
import { toast } from "@/shared/utils/toast"

interface HistoryEntry {
    id: number
    account: string
    type: 'Email' | 'SMS' | 'Call' | 'In-App'
    subject: string
    representative: string
    status: 'Completed' | 'Delivered' | 'Failed' | 'Opened'
    timestamp: string
    date: string
    sentiment: 'Positive' | 'Neutral' | 'Negative' | 'N/A'
    summary: string
}

const initialHistory: HistoryEntry[] = [
    { id: 1, account: "Global Dynamics", type: "Email", subject: "Q3 Strategy Alignment", representative: "Sarah J.", status: "Opened", timestamp: "Oct 15, 2024 • 10:45 AM", date: "2024-10-15", sentiment: "Positive", summary: "Discussed Q3 priorities and product roadmap alignment." },
    { id: 2, account: "DataScale Inc", type: "SMS", subject: "Critical: Support Ticket Alert", representative: "System", status: "Delivered", timestamp: "Oct 12, 2024 • 09:12 AM", date: "2024-10-12", sentiment: "N/A", summary: "Automated alert for high-severity ticket #4502." },
    { id: 3, account: "Innova Hub", type: "Call", subject: "Executive Review Call", representative: "Mike W.", status: "Completed", timestamp: "Oct 10, 2024 • 04:30 PM", date: "2024-10-10", sentiment: "Neutral", summary: "Hour-long executive review covering renewal terms." },
    { id: 4, account: "Swift Apps", type: "Email", subject: "Onboarding Welcome!", representative: "Emily R.", status: "Opened", timestamp: "Oct 08, 2024 • 11:00 AM", date: "2024-10-08", sentiment: "Positive", summary: "Welcome email with onboarding checklist." },
    { id: 5, account: "Horizon Media", type: "In-App", subject: "Service Maintenance Notification", representative: "System", status: "Failed", timestamp: "Oct 05, 2024 • 02:00 AM", date: "2024-10-05", sentiment: "Negative", summary: "Notification failed due to push token expiration." },
]

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
}

const getTypeIcon = (type: string) => {
    switch (type) {
        case 'Email': return Mail
        case 'SMS': return Smartphone
        case 'Call': return MessageSquare
        case 'In-App': return Bell
        default: return Zap
    }
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Opened': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
        case 'Completed': return 'bg-blue-50 text-blue-600 border-blue-100'
        case 'Delivered': return 'bg-indigo-50 text-indigo-600 border-indigo-100'
        case 'Failed': return 'bg-rose-50 text-rose-600 border-rose-100'
        default: return 'bg-slate-50 text-slate-600 border-slate-100'
    }
}

export default function CommunicationHistoryPage() {
    const router = useRouter()
    const [history, setHistory] = React.useState<HistoryEntry[]>(initialHistory)
    const [search, setSearch] = React.useState("")
    const [typeFilter, setTypeFilter] = React.useState("all")
    const [clientFilter, setClientFilter] = React.useState("all")
    const [dateFilter, setDateFilter] = React.useState("")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [selected, setSelected] = React.useState<HistoryEntry | null>(null)

    const [form, setForm] = React.useState({
        account: "", type: "Call" as HistoryEntry['type'],
        subject: "", representative: "Current User",
        sentiment: "Neutral" as HistoryEntry['sentiment'],
        summary: "",
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const clients = React.useMemo(() => Array.from(new Set(history.map(h => h.account))), [history])

    const metrics = React.useMemo(() => {
        const total = history.length
        const totalLastWeek = "842"
        const avgSentiment = "Positive"
        const topChannel = "Email"
        return { total, totalLastWeek, avgSentiment, topChannel }
    }, [history])

    const filtered = React.useMemo(() => {
        return history.filter(h =>
            (typeFilter === "all" || h.type === typeFilter) &&
            (clientFilter === "all" || h.account === clientFilter) &&
            (!dateFilter || h.date === dateFilter) &&
            (h.account.toLowerCase().includes(search.toLowerCase()) ||
                h.subject.toLowerCase().includes(search.toLowerCase()) ||
                h.representative.toLowerCase().includes(search.toLowerCase()))
        )
    }, [history, search, typeFilter, clientFilter, dateFilter])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.account = validators.required(form.account)
        errs.subject = validators.required(form.subject) || validators.minLen(3)(form.subject)
        errs.representative = validators.required(form.representative)
        errs.summary = validators.required(form.summary) || validators.minLen(5)(form.summary)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setForm({ account: "", type: "Call", subject: "", representative: "Current User", sentiment: "Neutral", summary: "" })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        const today = new Date()
        const dateStr = today.toISOString().split('T')[0]
        const entry: HistoryEntry = {
            id: Date.now(),
            account: form.account.trim(),
            type: form.type,
            subject: form.subject.trim(),
            representative: form.representative.trim(),
            status: "Completed",
            timestamp: today.toLocaleString(),
            date: dateStr,
            sentiment: form.sentiment,
            summary: form.summary.trim(),
        }
        setHistory([entry, ...history])
        toast.success("Audit entry logged")
        setIsFormOpen(false)
    }

    const handleDelete = (id: number) => {
        setHistory(history.filter(h => h.id !== id))
        toast.success("Entry deleted")
    }

    const openDetail = (h: HistoryEntry) => { setSelected(h); setIsDetailOpen(true) }

    const kpiCards = [
        { title: "Total Interactions", value: metrics.totalLastWeek, subtitle: "Past 7 Days", icon: History, color: "blue", trend: "+12%", path: "/client-management/analytics/overview" },
        { title: "Open Rate", value: "68.4%", subtitle: "Network Average", icon: ArrowUpRight, color: "indigo", trend: "+3%", path: "/client-management/communication/email" },
        { title: "Client Sentiment", value: metrics.avgSentiment, subtitle: "Aggregate Pulse", icon: CheckCircle2, color: "emerald", trend: "", path: "/client-management/customers" },
        { title: "Top Channel", value: metrics.topChannel, subtitle: "62% of volume", icon: Calendar, color: "rose", trend: "", path: "/client-management/communication/email" },
    ]
    const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        blue: { bg: "bg-gradient-to-br from-blue-50 to-blue-100/50", border: "border-blue-200/50", text: "text-blue-600", iconBg: "bg-blue-100" },
        indigo: { bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", border: "border-indigo-200/50", text: "text-indigo-600", iconBg: "bg-indigo-100" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        rose: { bg: "bg-gradient-to-br from-rose-50 to-rose-100/50", border: "border-rose-200/50", text: "text-rose-600", iconBg: "bg-rose-100" },
    }

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Communication <span className="text-indigo-600">Audit Trail</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Historical repository of all client interactions across channels.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={() => toast.success("Audit log export started")}>
                        <Download className="h-4 w-4 mr-2" />Export
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />Log Entry
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
                                <CardTitle className="text-base font-semibold">Communication Ledger</CardTitle>
                                <Badge className="rounded-none bg-indigo-50 text-indigo-700 border-0">{filtered.length} entries</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search audit trail..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-6 py-3">Channel & Account</th>
                                            <th className="px-6 py-3">Summary</th>
                                            <th className="px-6 py-3">Rep</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.length > 0 ? filtered.map(h => {
                                            const TIcon = getTypeIcon(h.type)
                                            return (
                                                <tr key={h.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(h)}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-9 w-9 rounded-none bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                                                                <TIcon className="h-4 w-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-800">{h.account}</p>
                                                                <p className="text-[10px] text-slate-400 mt-0.5">{h.type}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-[12px] font-bold text-slate-800 max-w-[220px] truncate">{h.subject}</p>
                                                        <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />{h.timestamp}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-6 w-6 rounded-none bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-600 border border-slate-200">{h.representative.split(' ').map(n => n[0]).join('')}</div>
                                                            <span className="text-[11px] font-bold text-slate-600">{h.representative}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1">
                                                            <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold border w-fit ${getStatusColor(h.status)}`}>{h.status}</span>
                                                            {h.sentiment !== 'N/A' && (
                                                                <span className={`text-[9px] font-bold ${h.sentiment === 'Positive' ? "text-emerald-500" : h.sentiment === 'Negative' ? "text-rose-500" : "text-amber-500"}`}>
                                                                    {h.sentiment}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="rounded-none"><MoreVertical className="h-4 w-4" /></Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="rounded-none w-40">
                                                                <DropdownMenuItem onClick={() => openDetail(h)}><Eye className="h-4 w-4 mr-2" />View</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => toast.success("Timeline expanded")}><History className="h-4 w-4 mr-2" />Timeline</DropdownMenuItem>
                                                                <DropdownMenuItem className="text-rose-500 border-t mt-1" onClick={() => handleDelete(h.id)}>
                                                                    <Trash2 className="h-4 w-4 mr-2" />Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            )
                                        }) : (
                                            <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">No entries match your filters.</td></tr>
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
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-widest uppercase">Protocol Split</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { name: 'Email', pct: 62, color: 'bg-blue-500' },
                                { name: 'Calls', pct: 18, color: 'bg-indigo-500' },
                                { name: 'SMS', pct: 12, color: 'bg-violet-500' },
                                { name: 'In-Person', pct: 8, color: 'bg-emerald-500' },
                            ].map((p, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-[11px] font-bold">
                                        <span className="text-slate-600">{p.name}</span>
                                        <span className="text-slate-900">{p.pct}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-none">
                                        <div className={`h-full ${p.color}`} style={{ width: `${p.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-indigo-100 bg-indigo-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-indigo-600 tracking-widest uppercase flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" /> Audit Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                <p className="text-[10px] font-bold text-slate-400 tracking-widest mb-1">Critical Alert</p>
                                <p className="text-[12px] font-bold text-slate-900">12 interactions missed audit commitment in last 24h.</p>
                            </div>
                            <Button className="w-full rounded-none bg-slate-900 hover:bg-slate-800 text-white" onClick={() => router.push('/client-management/customers')}>
                                Review Missed Tags
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-widest uppercase">Sync Schedule</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { name: 'G-Suite Audit', status: 'Syncing', time: '12m ago', color: 'bg-emerald-500' },
                                { name: 'Salesforce Connect', status: 'Idle', time: '2h ago', color: 'bg-slate-400' },
                                { name: 'Phone Hub', status: 'Error', time: '5m ago', color: 'bg-rose-500' },
                            ].map((s, i) => (
                                <div key={i} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-none">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-2 w-2 ${s.color}`} />
                                        <span className="text-[11px] font-bold text-slate-700">{s.name}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] font-bold text-slate-400">{s.status}</span>
                                        <span className="text-[9px] text-slate-300">{s.time}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Manual Log Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-blue-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">Log Manual Entry</SheetTitle>
                        <p className="text-[12px] text-slate-500">Capture an external interaction for the audit trail.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Account <span className="text-rose-500">*</span></Label>
                            <Input value={form.account} onChange={e => setField("account", e.target.value)} placeholder="Search client..." className={`h-10 rounded-none ${errors.account ? "border-rose-500" : ""}`} />
                            {errors.account && <p className="text-[11px] text-rose-500">{errors.account}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Type</Label>
                                <Select value={form.type} onValueChange={(v: any) => setField("type", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Call">Phone Call</SelectItem>
                                        <SelectItem value="Email">Email</SelectItem>
                                        <SelectItem value="SMS">SMS</SelectItem>
                                        <SelectItem value="In-App">In-App</SelectItem>
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
                                        <SelectItem value="Negative">Negative</SelectItem>
                                        <SelectItem value="N/A">Not Applicable</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Subject <span className="text-rose-500">*</span></Label>
                            <Input value={form.subject} onChange={e => setField("subject", e.target.value)} placeholder="e.g. Quarterly review call" className={`h-10 rounded-none ${errors.subject ? "border-rose-500" : ""}`} />
                            {errors.subject && <p className="text-[11px] text-rose-500">{errors.subject}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Representative <span className="text-rose-500">*</span></Label>
                            <Input value={form.representative} onChange={e => setField("representative", e.target.value)} className={`h-10 rounded-none ${errors.representative ? "border-rose-500" : ""}`} />
                            {errors.representative && <p className="text-[11px] text-rose-500">{errors.representative}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Summary <span className="text-rose-500">*</span></Label>
                            <Input value={form.summary} onChange={e => setField("summary", e.target.value)} placeholder="Discussed new API endpoints" className={`h-10 rounded-none ${errors.summary ? "border-rose-500" : ""}`} />
                            {errors.summary && <p className="text-[11px] text-rose-500">{errors.summary}</p>}
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>
                            <CheckCircle2 className="h-4 w-4 mr-2" />Commit Entry
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter History</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Type</Label>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="Email">Email</SelectItem>
                                    <SelectItem value="SMS">SMS</SelectItem>
                                    <SelectItem value="Call">Call</SelectItem>
                                    <SelectItem value="In-App">In-App</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Client</Label>
                            <Select value={clientFilter} onValueChange={setClientFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Clients</SelectItem>
                                    {clients.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Date</Label>
                            <Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="h-10 rounded-none" />
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setTypeFilter("all"); setClientFilter("all"); setDateFilter(""); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Audit Detail</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Account</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.account}</p>
                                </div>
                                <div className="border-t pt-3">
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Subject</p>
                                    <p className="font-semibold text-slate-900">{selected.subject}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Type</p><p className="font-semibold text-slate-900">{selected.type}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${getStatusColor(selected.status)}`}>{selected.status}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Rep</p><p className="font-semibold text-slate-900">{selected.representative}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Sentiment</p><Badge className="rounded-none">{selected.sentiment}</Badge></div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">Timestamp</p><p className="font-semibold text-slate-900 text-sm">{selected.timestamp}</p></div>
                                </div>
                                <div className="border-t pt-3">
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-2">Summary</p>
                                    <p className="text-[13px] text-slate-700">{selected.summary}</p>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsDetailOpen(false); toast.success("Opening timeline") }}>
                                    <History className="h-4 w-4 mr-2" />Timeline
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
