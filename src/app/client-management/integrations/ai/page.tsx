"use client"

import { useState, useMemo } from "react"
import {
    Plus, Search, RefreshCw, Download, Brain,
    Clock, Trash2, Edit, Loader2, X, Save,
    CheckCircle2, Zap, Activity, Sparkles,
    MessageSquare, Eye, BarChart2, FileText
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

type AiIntegration = {
    id: string
    name: string
    provider: string
    model: string
    useCase: string
    status: string
    requestsToday: number
    totalRequests: number
    avgLatency: number
    enabled: boolean
    lastUsed: string
    costEstimate: string
}

const PROVIDERS = ["OpenAI", "Anthropic", "Google Gemini", "Cohere", "Mistral", "Hugging Face"]
const USE_CASES = ["Churn prediction", "Sentiment analysis", "Email drafting", "Data extraction", "Lead scoring", "Smart summaries", "Chat assistant"]

const PROVIDER_COLORS: Record<string, string> = {
    OpenAI: "bg-emerald-50 text-emerald-600",
    Anthropic: "bg-violet-50 text-violet-600",
    "Google Gemini": "bg-blue-50 text-blue-600",
    Cohere: "bg-amber-50 text-amber-600",
    Mistral: "bg-rose-50 text-rose-600",
    "Hugging Face": "bg-yellow-50 text-yellow-600",
}

const USE_CASE_ICONS: Record<string, React.ElementType> = {
    "Churn prediction": BarChart2,
    "Sentiment analysis": Eye,
    "Email drafting": MessageSquare,
    "Data extraction": FileText,
    "Lead scoring": Zap,
    "Smart summaries": FileText,
    "Chat assistant": MessageSquare,
}

const INITIAL_INTEGRATIONS: AiIntegration[] = [
    { id: "AI-001", name: "Churn risk predictor", provider: "OpenAI", model: "GPT-4o", useCase: "Churn prediction", status: "Active", requestsToday: 142, totalRequests: 18400, avgLatency: 820, enabled: true, lastUsed: "2 min ago", costEstimate: "$12.40/day" },
    { id: "AI-002", name: "Ticket sentiment scorer", provider: "Anthropic", model: "Claude 3.5 Sonnet", useCase: "Sentiment analysis", status: "Active", requestsToday: 340, totalRequests: 42100, avgLatency: 640, enabled: true, lastUsed: "30 sec ago", costEstimate: "$8.20/day" },
    { id: "AI-003", name: "Email reply drafter", provider: "OpenAI", model: "GPT-4o Mini", useCase: "Email drafting", status: "Active", requestsToday: 88, totalRequests: 9800, avgLatency: 1100, enabled: true, lastUsed: "15 min ago", costEstimate: "$2.10/day" },
    { id: "AI-004", name: "Contract data extractor", provider: "Google Gemini", model: "Gemini 1.5 Pro", useCase: "Data extraction", status: "Active", requestsToday: 54, totalRequests: 6200, avgLatency: 1400, enabled: true, lastUsed: "1 hr ago", costEstimate: "$5.80/day" },
    { id: "AI-005", name: "Lead quality scorer", provider: "Cohere", model: "Command R+", useCase: "Lead scoring", status: "Paused", requestsToday: 0, totalRequests: 3400, avgLatency: 560, enabled: false, lastUsed: "3 days ago", costEstimate: "$0/day" },
]

export default function AiIntegrationsPage() {
    const [integrations, setIntegrations] = useState<AiIntegration[]>(INITIAL_INTEGRATIONS)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterProvider, setFilterProvider] = useState("all")
    const [filterUseCase, setFilterUseCase] = useState("all")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<AiIntegration | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<AiIntegration | null>(null)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [newIntegration, setNewIntegration] = useState({ name: "", provider: "OpenAI", model: "", useCase: "Churn prediction" })

    const stats = useMemo(() => ({
        active: integrations.filter(i => i.enabled).length,
        totalRequests: integrations.reduce((a, i) => a + i.totalRequests, 0),
        requestsToday: integrations.reduce((a, i) => a + i.requestsToday, 0),
        providers: new Set(integrations.map(i => i.provider)).size,
    }), [integrations])

    const filtered = useMemo(() => integrations.filter(i => {
        const matchSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.provider.toLowerCase().includes(searchQuery.toLowerCase()) || i.model.toLowerCase().includes(searchQuery.toLowerCase())
        const matchProvider = filterProvider === "all" || i.provider === filterProvider
        const matchUseCase = filterUseCase === "all" || i.useCase === filterUseCase
        return matchSearch && matchProvider && matchUseCase
    }), [integrations, searchQuery, filterProvider, filterUseCase])

    const handleCreate = () => {
        if (!newIntegration.name.trim() || !newIntegration.model.trim()) { toast.error("Name and model are required"); return }
        const i: AiIntegration = { id: `AI-${String(integrations.length + 1).padStart(3, "0")}`, name: newIntegration.name.trim(), provider: newIntegration.provider, model: newIntegration.model.trim(), useCase: newIntegration.useCase, status: "Active", requestsToday: 0, totalRequests: 0, avgLatency: 0, enabled: true, lastUsed: "Never", costEstimate: "$0/day" }
        setIntegrations(prev => [i, ...prev])
        setNewIntegration({ name: "", provider: "OpenAI", model: "", useCase: "Churn prediction" })
        setIsCreateOpen(false)
        toast.success(`AI integration "${i.name}" added successfully`)
    }

    const handleEditSave = () => {
        if (!editTarget?.name.trim()) { toast.error("Name is required"); return }
        setIntegrations(prev => prev.map(i => i.id === editTarget.id ? { ...editTarget } : i))
        setEditTarget(null)
        toast.success("AI integration updated")
    }

    const handleDelete = () => {
        if (!deleteTarget) return
        setIntegrations(prev => prev.filter(i => i.id !== deleteTarget.id))
        setDeleteTarget(null)
        toast.success("AI integration removed")
    }

    const handleToggle = (id: string, current: boolean) => {
        setIntegrations(prev => prev.map(i => i.id === id ? { ...i, enabled: !current, status: !current ? "Active" : "Paused" } : i))
        toast.success(current ? "AI integration paused" : "AI integration activated")
    }

    const handleRefresh = () => {
        setIsRefreshing(true)
        toast.promise(new Promise(r => setTimeout(r, 1500)), { loading: "Refreshing AI integration stats...", success: "Stats updated", error: "Refresh failed" })
        setTimeout(() => {
            setIsRefreshing(false)
            setIntegrations(prev => prev.map(i => i.enabled ? { ...i, requestsToday: i.requestsToday + 5, totalRequests: i.totalRequests + 5, avgLatency: i.avgLatency - 5 + Math.floor(Math.random() * 10), lastUsed: "Just now" } : i))
        }, 1500)
    }

    const handleExport = () => {
        const csv = [["ID", "Name", "Provider", "Model", "Use Case", "Status", "Requests Today", "Total Requests", "Avg Latency (ms)", "Cost"], ...integrations.map(i => [i.id, i.name, i.provider, i.model, i.useCase, i.status, i.requestsToday, i.totalRequests, i.avgLatency, i.costEstimate])].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "ai-integrations.csv"; a.click(); URL.revokeObjectURL(url)
        toast.success("AI integrations exported")
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">AI <span className="text-indigo-600">integrations</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Connect language models and AI services to power intelligent automation</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleRefresh}>{isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 text-slate-400" />} Refresh</Button>
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleExport}><Download className="w-4 h-4 text-slate-400" /> Export</Button>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild><Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2"><Plus className="w-4 h-4" /> Add AI model</Button></DialogTrigger>
                        <DialogContent className="sm:max-w-[480px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                            <DialogHeader><DialogTitle className="text-2xl font-semibold text-slate-900">Add <span className="text-indigo-600">AI integration</span></DialogTitle></DialogHeader>
                            <div className="grid gap-5 py-6">
                                <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Integration name *</Label><Input value={newIntegration.name} onChange={e => setNewIntegration({ ...newIntegration, name: e.target.value })} placeholder="e.g. Churn risk predictor" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Provider</Label><Select value={newIntegration.provider} onValueChange={v => setNewIntegration({ ...newIntegration, provider: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{PROVIDERS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
                                    <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Model name *</Label><Input value={newIntegration.model} onChange={e => setNewIntegration({ ...newIntegration, model: e.target.value })} placeholder="e.g. GPT-4o" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" /></div>
                                </div>
                                <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Use case</Label><Select value={newIntegration.useCase} onValueChange={v => setNewIntegration({ ...newIntegration, useCase: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{USE_CASES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent></Select></div>
                            </div>
                            <DialogFooter className="gap-2"><Button variant="ghost" className="rounded-xl font-semibold" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold px-8 text-white" onClick={handleCreate}>Add integration</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: "Active AI models", value: stats.active, icon: Brain, bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-100/50" },
                    { label: "Requests today", value: stats.requestsToday.toLocaleString(), icon: Zap, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-100/50" },
                    { label: "Total requests", value: stats.totalRequests.toLocaleString(), icon: Activity, bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-100/50" },
                    { label: "AI providers", value: stats.providers, icon: Sparkles, bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", iconBg: "bg-amber-100", iconColor: "text-amber-600", border: "border-amber-100/50" },
                ].map((stat, i) => (
                    <Card key={i} className={`${stat.bg} ${stat.border} border shadow-sm hover:shadow-md transition-all rounded-[22px] overflow-hidden`}>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`h-10 w-10 rounded-[14px] flex items-center justify-center ${stat.iconBg}`}><stat.icon className={`w-5 h-5 ${stat.iconColor}`} /></div>
                                <span className="text-[11px] font-semibold text-slate-400 bg-white/70 px-2 py-1 rounded-full border border-slate-100">{integrations.length} total</span>
                            </div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">{stat.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" /><Input placeholder="Search AI integrations or models..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 h-11 bg-white border-slate-200 rounded-xl text-sm font-medium" /></div>
                <Select value={filterProvider} onValueChange={setFilterProvider}><SelectTrigger className="w-44 h-11 rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-sm"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="all">All providers</SelectItem>{PROVIDERS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
                <Select value={filterUseCase} onValueChange={setFilterUseCase}><SelectTrigger className="w-48 h-11 rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-sm"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="all">All use cases</SelectItem>{USE_CASES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent></Select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(ai => {
                    const UseCaseIcon = USE_CASE_ICONS[ai.useCase] || Brain
                    return (
                        <Card key={ai.id} className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white p-7 space-y-5 hover:shadow-2xl transition-all group">
                            <div className="flex items-start justify-between">
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${PROVIDER_COLORS[ai.provider] || "bg-slate-50 text-slate-500"}`}><Brain className="w-6 h-6" /></div>
                                <Badge className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border-0 ${ai.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{ai.status}</Badge>
                            </div>
                            <div className="space-y-1.5">
                                <h4 className="text-md font-semibold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{ai.name}</h4>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 ${PROVIDER_COLORS[ai.provider]}`}>{ai.provider}</Badge>
                                    <code className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md font-mono">{ai.model}</code>
                                </div>
                                <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 pt-0.5"><UseCaseIcon className="w-3 h-3" />{ai.useCase}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: "Today", value: ai.requestsToday.toLocaleString() },
                                    { label: "Total", value: ai.totalRequests >= 1000 ? `${(ai.totalRequests / 1000).toFixed(1)}k` : ai.totalRequests.toString() },
                                    { label: "Latency", value: `${ai.avgLatency}ms` },
                                ].map((m, i) => (
                                    <div key={i} className="text-center p-2 bg-slate-50 rounded-xl">
                                        <p className="text-[10px] font-medium text-slate-400">{m.label}</p>
                                        <p className="text-sm font-semibold text-slate-900">{m.value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {ai.lastUsed}</p>
                                    <p className="text-[10px] font-semibold text-emerald-600">{ai.costEstimate}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Switch checked={ai.enabled} onCheckedChange={() => handleToggle(ai.id, ai.enabled)} className="data-[state=checked]:bg-indigo-600 scale-90" />
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl" onClick={() => setEditTarget({ ...ai })}><Edit className="w-3.5 h-3.5" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl" onClick={() => setDeleteTarget(ai)}><Trash2 className="w-3.5 h-3.5" /></Button>
                                </div>
                            </div>
                        </Card>
                    )
                })}
                {filtered.length === 0 && (
                    <div className="col-span-3 py-16 text-center">
                        <Brain className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 font-medium">No AI integrations found.</p>
                        <Button variant="ghost" className="mt-3 text-indigo-600 font-semibold text-sm" onClick={() => { setSearchQuery(""); setFilterProvider("all"); setFilterUseCase("all") }}>Clear filters</Button>
                    </div>
                )}
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editTarget} onOpenChange={() => setEditTarget(null)}>
                <DialogContent className="sm:max-w-[480px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader><DialogTitle className="text-2xl font-semibold text-slate-900">Edit <span className="text-indigo-600">AI integration</span></DialogTitle></DialogHeader>
                    {editTarget && <div className="grid gap-5 py-6">
                        <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Name *</Label><Input value={editTarget.name} onChange={e => setEditTarget({ ...editTarget, name: e.target.value })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Provider</Label><Select value={editTarget.provider} onValueChange={v => setEditTarget({ ...editTarget, provider: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{PROVIDERS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
                            <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Model</Label><Input value={editTarget.model} onChange={e => setEditTarget({ ...editTarget, model: e.target.value })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" /></div>
                        </div>
                        <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Use case</Label><Select value={editTarget.useCase} onValueChange={v => setEditTarget({ ...editTarget, useCase: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{USE_CASES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent></Select></div>
                    </div>}
                    <DialogFooter className="gap-2"><Button variant="ghost" className="rounded-xl font-semibold gap-2" onClick={() => setEditTarget(null)}><X className="w-4 h-4" />Cancel</Button><Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold px-8 text-white gap-2" onClick={handleEditSave}><Save className="w-4 h-4" />Save</Button></DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader><DialogTitle className="text-xl font-semibold text-slate-900">Remove AI integration</DialogTitle></DialogHeader>
                    <p className="text-sm font-medium text-slate-500 py-4">Are you sure you want to remove <span className="text-slate-900 font-semibold">"{deleteTarget?.name}"</span>?</p>
                    <DialogFooter className="gap-2"><Button variant="ghost" className="rounded-xl font-semibold" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button className="rounded-xl bg-rose-600 hover:bg-rose-700 font-semibold px-6 text-white gap-2" onClick={handleDelete}><Trash2 className="w-4 h-4" />Remove</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
