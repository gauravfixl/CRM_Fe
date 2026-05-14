"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Star, MessageSquare, Smile, Meh, Frown, Search, Filter, MoreVertical, Plus,
    Trash2, PencilLine, Eye, Building2, TrendingUp, Quote, Send, ThumbsUp, BarChart3, ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Progress } from "@/shared/components/ui/progress"
import { Badge } from "@/shared/components/ui/badge"
import { toast } from "@/shared/utils/toast"

interface FeedbackEntry {
    id: number
    account: string
    nps: number
    csat: number
    sentiment: 'Positive' | 'Neutral' | 'Negative'
    comment: string
    date: string
}

const initialFeedback: FeedbackEntry[] = [
    { id: 1, account: "Global Dynamics", nps: 10, csat: 5, sentiment: "Positive", comment: "The platform's new analytics dashboard is a game changer for our executive team.", date: "2024-10-12" },
    { id: 2, account: "DataScale Inc", nps: 9, csat: 4, sentiment: "Positive", comment: "Good support response times, looking forward to the mobile app update.", date: "2024-10-08" },
    { id: 3, account: "Innova Hub", nps: 5, csat: 3, sentiment: "Neutral", comment: "Complex setup process, but the features are robust once configured.", date: "2024-10-05" },
    { id: 4, account: "Swift Apps", nps: 3, csat: 2, sentiment: "Negative", comment: "Experienced some latency during peak hours last week. Needs optimization.", date: "2024-09-28" },
    { id: 5, account: "Horizon Media", nps: 8, csat: 4, sentiment: "Positive", comment: "Very satisfied with the integration capabilities. Saved us hours of manual work.", date: "2024-09-20" },
]

const validators = {
    required: (v: any) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    range: (min: number, max: number) => (v: any) => v === "" || v === null || v === undefined ? "" : isNaN(Number(v)) ? "Enter a valid number" : Number(v) < min || Number(v) > max ? `Must be ${min}-${max}` : "",
    date: (v: string) => v && isNaN(new Date(v).getTime()) ? "Enter a valid date" : "",
}

const sentimentColor = (s: FeedbackEntry['sentiment']) =>
    s === 'Positive' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
    s === 'Negative' ? "bg-rose-50 text-rose-600 border-rose-100" :
    "bg-amber-50 text-amber-600 border-amber-100"

const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
        case 'Positive': return <Smile className="h-4 w-4 text-emerald-500" />
        case 'Negative': return <Frown className="h-4 w-4 text-rose-500" />
        default: return <Meh className="h-4 w-4 text-amber-500" />
    }
}

export default function FeedbackPage() {
    const router = useRouter()
    const [feedback, setFeedback] = React.useState<FeedbackEntry[]>(initialFeedback)
    const [search, setSearch] = React.useState("")
    const [sentimentFilter, setSentimentFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<number | null>(null)
    const [selected, setSelected] = React.useState<FeedbackEntry | null>(null)

    const [form, setForm] = React.useState({
        account: "", nps: "10", csat: "5",
        sentiment: "Positive" as FeedbackEntry['sentiment'],
        comment: "", date: new Date().toISOString().split('T')[0],
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const metrics = React.useMemo(() => {
        const total = feedback.length
        const avgNps = total > 0 ? (feedback.reduce((s, f) => s + f.nps, 0) / total).toFixed(1) : "0"
        const positive = feedback.filter(f => f.sentiment === 'Positive').length
        const sentimentRate = total > 0 ? Math.round((positive / total) * 100) : 0
        const promoters = feedback.filter(f => f.nps >= 9).length
        return { total, avgNps, sentimentRate: `${sentimentRate}%`, promoters }
    }, [feedback])

    const filtered = React.useMemo(() => {
        return feedback.filter(f => {
            const matchSearch = !search ||
                f.account.toLowerCase().includes(search.toLowerCase()) ||
                f.comment.toLowerCase().includes(search.toLowerCase())
            const matchSentiment = sentimentFilter === "all" || f.sentiment === sentimentFilter
            return matchSearch && matchSentiment
        })
    }, [feedback, search, sentimentFilter])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.account = validators.required(form.account) || validators.minLen(2)(form.account)
        errs.nps = validators.required(form.nps) || validators.range(0, 10)(form.nps)
        errs.csat = validators.required(form.csat) || validators.range(1, 5)(form.csat)
        errs.comment = validators.required(form.comment) || validators.minLen(5)(form.comment)
        errs.date = validators.required(form.date) || validators.date(form.date)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ account: "", nps: "10", csat: "5", sentiment: "Positive", comment: "", date: new Date().toISOString().split('T')[0] })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (f: FeedbackEntry) => {
        setEditingId(f.id)
        setForm({
            account: f.account, nps: String(f.nps), csat: String(f.csat),
            sentiment: f.sentiment, comment: f.comment, date: f.date,
        })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        const data: FeedbackEntry = {
            id: editingId || Date.now(),
            account: form.account.trim(),
            nps: Number(form.nps),
            csat: Number(form.csat),
            sentiment: form.sentiment,
            comment: form.comment.trim(),
            date: form.date,
        }
        if (editingId) {
            setFeedback(feedback.map(f => f.id === editingId ? data : f))
            toast.success("Feedback updated")
        } else {
            setFeedback([data, ...feedback])
            toast.success("Response recorded")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: number) => {
        setFeedback(feedback.filter(f => f.id !== id))
        toast.success("Feedback removed")
    }

    const openDetail = (f: FeedbackEntry) => { setSelected(f); setIsDetailOpen(true) }

    const kpis = [
        { title: "Avg. NPS Score", value: metrics.avgNps, subtitle: "Portfolio Benchmark", icon: BarChart3, color: "emerald", path: "/client-management/analytics/revenue" },
        { title: "Positive Sentiment", value: metrics.sentimentRate, subtitle: "Verbatim Happiness", icon: Smile, color: "blue", path: "/client-management/customers/health" },
        { title: "Total Responses", value: String(metrics.total), subtitle: "Last 90 Days", icon: MessageSquare, color: "amber", path: "/client-management/communication" },
        { title: "Promoters", value: String(metrics.promoters), subtitle: "Advocacy Potential", icon: ThumbsUp, color: "violet", path: "/client-management/customers/journey" },
    ]
    const cm: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        blue: { bg: "bg-gradient-to-br from-blue-50 to-blue-100/50", border: "border-blue-200/50", text: "text-blue-600", iconBg: "bg-blue-100" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", border: "border-amber-200/50", text: "text-amber-600", iconBg: "bg-amber-100" },
        violet: { bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", border: "border-violet-200/50", text: "text-violet-600", iconBg: "bg-violet-100" },
    }

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Feedback & <span className="text-emerald-600">NPS Vault</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Voice of the customer repository. Monitor Net Promoter Score and satisfaction trends.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />Add Response
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
                                <CardTitle className="text-base font-semibold">Verbatim Feedback Log</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length} entries</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search feedback..." value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {filtered.length > 0 ? filtered.map((item) => (
                                <div key={item.id} className="group relative p-5 border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-md hover:border-emerald-100 transition cursor-pointer rounded-none" onClick={() => openDetail(item)}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-none bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                                <Building2 className="h-5 w-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{item.account}</p>
                                                <p className="text-[10px] font-semibold text-slate-400">{item.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-none border ${sentimentColor(item.sentiment)}`}>NPS: {item.nps}</span>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="rounded-none">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44 rounded-none">
                                                    <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(item)}>
                                                        <PencilLine className="h-4 w-4" /> Edit Entry
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-2" onClick={() => toast.success("Forwarded to team")}>
                                                        <Send className="h-4 w-4" /> Forward to Team
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDelete(item.id)}>
                                                        <Trash2 className="h-4 w-4" /> Delete Record
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <Quote className="absolute -left-2 -top-2 h-8 w-8 text-emerald-600/5 rotate-180" />
                                        <p className="text-[13px] font-medium text-slate-600 leading-relaxed pl-4 italic relative z-10">"{item.comment}"</p>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            {getSentimentIcon(item.sentiment)}
                                            <span className="text-[11px] font-bold text-slate-500 capitalize">{item.sentiment} Sentiment</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`h-3 w-3 ${i < item.csat ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="px-6 py-12 text-center text-sm text-slate-500">No feedback matches your filters.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">NPS Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {[
                                { label: 'Promoters (9-10)', count: 18, pct: 65 },
                                { label: 'Passives (7-8)', count: 8, pct: 25 },
                                { label: 'Detractors (0-6)', count: 3, pct: 10 },
                            ].map((d, i) => (
                                <div key={i} className="space-y-2 cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1" onClick={() => toast.success(`${d.label} drill-down opened`)}>
                                    <div className="flex justify-between items-center text-[11px] font-bold">
                                        <span className="text-slate-600">{d.label}</span>
                                        <span className="text-slate-900">{d.count} accounts</span>
                                    </div>
                                    <Progress value={d.pct} className="h-1.5 bg-slate-50 rounded-none" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-emerald-100 bg-emerald-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-emerald-600 tracking-wider flex items-center gap-2 uppercase">
                                <TrendingUp className="h-4 w-4" /> AI Sentiment Pulse
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
                                Current portfolio sentiment is <span className="text-emerald-600 font-bold">Trending Up</span>. Expansion potential is high in the E-commerce segment.
                            </p>
                            <Button variant="outline" className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-none" onClick={() => router.push('/client-management/analytics/revenue')}>
                                Detailed AI Report
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Recurring Themes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { text: 'Speed', type: 'Positive' },
                                    { text: 'Mobile UX', type: 'Neutral' },
                                    { text: 'Analytics', type: 'Positive' },
                                    { text: 'Billing', type: 'Negative' },
                                    { text: 'Integrations', type: 'Positive' },
                                ].map((tag, i) => (
                                    <span key={i} className={`px-2 py-1 rounded-none text-[10px] font-bold border cursor-pointer hover:shadow-sm transition ${
                                        tag.type === 'Positive' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                        tag.type === 'Negative' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                        "bg-amber-50 text-amber-600 border-amber-100"
                                    }`} onClick={() => { setSearch(tag.text); toast.success(`Filtered by ${tag.text}`) }}>
                                        {tag.text}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Feedback Loop</CardTitle>
                            <ArrowRight className="h-4 w-4 text-slate-300" />
                        </CardHeader>
                        <CardContent>
                            <div className="p-3 bg-slate-50 rounded-none">
                                <p className="text-[11px] font-bold text-slate-600 leading-tight">
                                    4 unresolved negative feedback entries require executive follow-up.
                                </p>
                                <Button className="mt-3 w-full bg-slate-900 hover:bg-slate-800 text-white rounded-none text-[11px] h-8" onClick={() => router.push('/client-management/support')}>
                                    View Action Items
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-emerald-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Update Response" : "Log New Response"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Capture customer voice and survey data.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Account <span className="text-rose-500">*</span></Label>
                            <Input value={form.account} onChange={e => setField("account", e.target.value)} placeholder="e.g. Acme Corp" className={`h-10 rounded-none ${errors.account ? "border-rose-500" : ""}`} />
                            {errors.account && <p className="text-[11px] text-rose-500">{errors.account}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">NPS (0-10) <span className="text-rose-500">*</span></Label>
                                <Input type="number" min="0" max="10" value={form.nps} onChange={e => setField("nps", e.target.value)} className={`h-10 rounded-none ${errors.nps ? "border-rose-500" : ""}`} />
                                {errors.nps && <p className="text-[11px] text-rose-500">{errors.nps}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">CSAT (1-5) <span className="text-rose-500">*</span></Label>
                                <Input type="number" min="1" max="5" value={form.csat} onChange={e => setField("csat", e.target.value)} className={`h-10 rounded-none ${errors.csat ? "border-rose-500" : ""}`} />
                                {errors.csat && <p className="text-[11px] text-rose-500">{errors.csat}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Sentiment</Label>
                                <Select value={form.sentiment} onValueChange={(v: any) => setField("sentiment", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Positive">Positive</SelectItem>
                                        <SelectItem value="Neutral">Neutral</SelectItem>
                                        <SelectItem value="Negative">Negative</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Date <span className="text-rose-500">*</span></Label>
                                <Input type="date" value={form.date} onChange={e => setField("date", e.target.value)} className={`h-10 rounded-none ${errors.date ? "border-rose-500" : ""}`} />
                                {errors.date && <p className="text-[11px] text-rose-500">{errors.date}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Client Comment / Quote <span className="text-rose-500">*</span></Label>
                            <Textarea value={form.comment} onChange={e => setField("comment", e.target.value)} placeholder="Enter verbatim feedback..." className={`min-h-[100px] rounded-none ${errors.comment ? "border-rose-500" : ""}`} />
                            {errors.comment && <p className="text-[11px] text-rose-500">{errors.comment}</p>}
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none" onClick={handleSave}>
                            {editingId ? "Save Changes" : "Save Feedback"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-emerald-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Feedback</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Sentiment</Label>
                            <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Sentiments</SelectItem>
                                    <SelectItem value="Positive">Positive</SelectItem>
                                    <SelectItem value="Neutral">Neutral</SelectItem>
                                    <SelectItem value="Negative">Negative</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setSentimentFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-emerald-50">
                        <SheetTitle className="text-[18px] font-semibold">Feedback Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Account</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.account}</p>
                                    <p className="text-sm text-slate-500">{selected.date}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">NPS</p><p className="font-semibold text-slate-900">{selected.nps}/10</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">CSAT</p>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`h-3.5 w-3.5 ${i < selected.csat ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">Sentiment</p>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[11px] font-bold border ${sentimentColor(selected.sentiment)}`}>
                                            {getSentimentIcon(selected.sentiment)}{selected.sentiment}
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-3 border-t">
                                    <p className="text-[11px] text-slate-400 uppercase mb-2">Comment</p>
                                    <p className="text-sm font-medium text-slate-700 leading-relaxed italic">"{selected.comment}"</p>
                                </div>
                                <div className="pt-3 border-t space-y-2">
                                    <Button variant="outline" className="w-full h-10 rounded-none justify-start" onClick={() => toast.success("Forwarded to team")}>
                                        <Send className="h-4 w-4 mr-2" />Forward to Team
                                    </Button>
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
