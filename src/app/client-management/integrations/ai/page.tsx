"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Plus, Search, RefreshCw, Download, Brain,
    Trash2, PencilLine, Filter, MoreVertical, Eye,
    Activity, CheckCircle2, AlertCircle, Sparkles, Zap, Bot,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Switch } from "@/shared/components/ui/switch"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Progress } from "@/shared/components/ui/progress"
import { toast } from "@/shared/utils/toast"

type AIProvider = {
    id: string
    name: string
    provider: 'OpenAI' | 'Anthropic' | 'Google AI' | 'Cohere' | 'Mistral' | 'Azure OpenAI'
    model: string
    apiKey: string
    useCase: 'Chat' | 'Embeddings' | 'Sentiment' | 'Summarization' | 'Classification'
    status: 'Active' | 'Inactive' | 'Error'
    enabled: boolean
    tokensUsed: number
    monthlyLimit: number
    cost: number
    lastUsed: string
}

const PROVIDERS: AIProvider['provider'][] = ["OpenAI", "Anthropic", "Google AI", "Cohere", "Mistral", "Azure OpenAI"]
const MODELS_BY_PROVIDER: Record<string, string[]> = {
    "OpenAI": ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo", "text-embedding-3-small"],
    "Anthropic": ["claude-opus-4.7", "claude-sonnet-4.6", "claude-haiku-4.5"],
    "Google AI": ["gemini-2.5-pro", "gemini-2.0-flash", "text-embedding-004"],
    "Cohere": ["command-r-plus", "embed-english-v3"],
    "Mistral": ["mistral-large", "mistral-medium"],
    "Azure OpenAI": ["gpt-4o", "gpt-4-turbo"],
}
const USE_CASES: AIProvider['useCase'][] = ["Chat", "Embeddings", "Sentiment", "Summarization", "Classification"]

const PROVIDER_COLORS: Record<string, string> = {
    OpenAI: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Anthropic: "bg-orange-50 text-orange-600 border-orange-100",
    "Google AI": "bg-blue-50 text-blue-600 border-blue-100",
    Cohere: "bg-violet-50 text-violet-600 border-violet-100",
    Mistral: "bg-rose-50 text-rose-600 border-rose-100",
    "Azure OpenAI": "bg-indigo-50 text-indigo-600 border-indigo-100",
}

const INITIAL: AIProvider[] = [
    { id: "AI-001", name: "OpenAI Production", provider: "OpenAI", model: "gpt-4o", apiKey: "sk-proj_h7d2...9fk3", useCase: "Chat", status: "Active", enabled: true, tokensUsed: 4820000, monthlyLimit: 10000000, cost: 248.32, lastUsed: "5 min ago" },
    { id: "AI-002", name: "Anthropic Summaries", provider: "Anthropic", model: "claude-sonnet-4.6", apiKey: "sk-ant-api03_x4...2lm", useCase: "Summarization", status: "Active", enabled: true, tokensUsed: 1820000, monthlyLimit: 5000000, cost: 84.12, lastUsed: "12 min ago" },
    { id: "AI-003", name: "Embeddings Service", provider: "OpenAI", model: "text-embedding-3-small", apiKey: "sk-proj_a1n8...7pq4", useCase: "Embeddings", status: "Active", enabled: true, tokensUsed: 12400000, monthlyLimit: 20000000, cost: 124.50, lastUsed: "Just now" },
    { id: "AI-004", name: "Sentiment Analysis", provider: "Cohere", model: "embed-english-v3", apiKey: "co_v2x4...9mq", useCase: "Sentiment", status: "Active", enabled: true, tokensUsed: 480000, monthlyLimit: 2000000, cost: 24.80, lastUsed: "1 hr ago" },
    { id: "AI-005", name: "Gemini Classifier", provider: "Google AI", model: "gemini-2.0-flash", apiKey: "AIza_x8m2...4pn", useCase: "Classification", status: "Inactive", enabled: false, tokensUsed: 0, monthlyLimit: 1000000, cost: 0, lastUsed: "—" },
]

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    number: (v: any) => v === "" || v === null || v === undefined ? "" : isNaN(Number(v)) ? "Enter a valid number" : Number(v) < 0 ? "Must be positive" : "",
}

export default function AIIntegrationsPage() {
    const router = useRouter()
    const [providers, setProviders] = React.useState<AIProvider[]>(INITIAL)
    const [search, setSearch] = React.useState("")
    const [providerFilter, setProviderFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [selected, setSelected] = React.useState<AIProvider | null>(null)

    const [form, setForm] = React.useState({
        name: "", provider: "OpenAI" as AIProvider['provider'], model: "gpt-4o",
        apiKey: "", useCase: "Chat" as AIProvider['useCase'], monthlyLimit: "1000000",
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const stats = React.useMemo(() => ({
        active: providers.filter(p => p.enabled).length,
        totalTokens: providers.reduce((a, p) => a + p.tokensUsed, 0),
        totalCost: providers.reduce((a, p) => a + p.cost, 0),
        avgUsage: providers.length ? Math.round(providers.reduce((a, p) => a + (p.tokensUsed / Math.max(1, p.monthlyLimit) * 100), 0) / providers.length) : 0,
    }), [providers])

    const filtered = React.useMemo(() => providers.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.model.toLowerCase().includes(search.toLowerCase())
        const matchProvider = providerFilter === "all" || p.provider === providerFilter
        return matchSearch && matchProvider
    }), [providers, search, providerFilter])

    const setField = (field: string, value: any) => {
        setForm(prev => {
            const next = { ...prev, [field]: value }
            if (field === "provider") next.model = MODELS_BY_PROVIDER[value]?.[0] || ""
            return next
        })
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(3)(form.name)
        errs.apiKey = validators.required(form.apiKey) || validators.minLen(10)(form.apiKey)
        errs.monthlyLimit = validators.required(form.monthlyLimit) || validators.number(form.monthlyLimit)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", provider: "OpenAI", model: "gpt-4o", apiKey: "", useCase: "Chat", monthlyLimit: "1000000" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (p: AIProvider) => {
        setEditingId(p.id)
        setForm({ name: p.name, provider: p.provider, model: p.model, apiKey: p.apiKey, useCase: p.useCase, monthlyLimit: String(p.monthlyLimit) })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setProviders(providers.map(p => p.id === editingId ? { ...p, name: form.name.trim(), provider: form.provider, model: form.model, apiKey: form.apiKey, useCase: form.useCase, monthlyLimit: Number(form.monthlyLimit) } : p))
            toast.success("AI provider updated")
        } else {
            const p: AIProvider = {
                id: `AI-${String(providers.length + 1).padStart(3, "0")}`,
                name: form.name.trim(), provider: form.provider, model: form.model,
                apiKey: form.apiKey, useCase: form.useCase,
                status: "Active", enabled: true, tokensUsed: 0,
                monthlyLimit: Number(form.monthlyLimit), cost: 0, lastUsed: "Never",
            }
            setProviders([p, ...providers])
            toast.success(`${p.provider} (${p.model}) configured`)
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: string) => {
        setProviders(providers.filter(p => p.id !== id))
        toast.success("AI provider removed")
    }

    const handleToggle = (id: string, current: boolean) => {
        setProviders(providers.map(p => p.id === id ? { ...p, enabled: !current, status: !current ? "Active" : "Inactive" } : p))
        toast.success(current ? "Provider disabled" : "Provider enabled")
    }

    const handleTest = (p: AIProvider) => {
        toast.success(`Testing ${p.provider} (${p.model})...`)
        setTimeout(() => toast.success(`${p.provider} responded successfully`), 1000)
    }

    const handleExport = () => {
        const csv = [["ID", "Name", "Provider", "Model", "Use Case", "Status", "Tokens", "Cost"], ...providers.map(p => [p.id, p.name, p.provider, p.model, p.useCase, p.status, p.tokensUsed, p.cost])].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = "ai-providers.csv"; a.click(); URL.revokeObjectURL(url)
        toast.success("AI providers exported")
    }

    const openDetail = (p: AIProvider) => { setSelected(p); setIsDetailOpen(true) }

    const kpiCards = [
        { title: "Active Providers", value: String(stats.active), subtitle: `${providers.length} configured`, icon: Brain, color: "violet", trend: `+${stats.active}`, path: "/client-management/integrations/ai" },
        { title: "Tokens Used", value: `${(stats.totalTokens / 1000000).toFixed(1)}M`, subtitle: "This month", icon: Activity, color: "indigo", trend: "+34%", path: "/client-management/analytics/ai-insights" },
        { title: "AI Spend", value: `$${stats.totalCost.toFixed(2)}`, subtitle: "Current month", icon: Sparkles, color: "emerald", trend: "+18%", path: "/client-management/revenue/overview" },
        { title: "Avg. Usage", value: `${stats.avgUsage}%`, subtitle: "of monthly limit", icon: Bot, color: "amber", trend: "—", path: "/client-management/integrations/ai" },
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
                        AI <span className="text-violet-600">Integrations</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Connect OpenAI, Anthropic, and other AI providers to power intelligent features.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />Export
                    </Button>
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />Add Provider
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
                                            <span className={`text-xs font-bold ${cc.text}`}>{kpi.trend}</span>
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
                                <CardTitle className="text-base font-semibold">AI Provider Configurations</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length}</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search providers..." value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-6 py-3">Provider</th>
                                            <th className="px-6 py-3">Use Case</th>
                                            <th className="px-6 py-3">Tokens</th>
                                            <th className="px-6 py-3">Cost</th>
                                            <th className="px-6 py-3">Enabled</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.length > 0 ? filtered.map(p => (
                                            <tr key={p.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(p)}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-9 w-9 rounded-none border flex items-center justify-center ${PROVIDER_COLORS[p.provider]}`}>
                                                            <Brain className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                                                            <p className="text-[11px] text-slate-500">{p.provider} • <span className="font-mono">{p.model}</span></p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge className="rounded-none bg-slate-100 text-slate-600">{p.useCase}</Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Progress value={(p.tokensUsed / Math.max(1, p.monthlyLimit)) * 100} className="w-16 h-1.5" />
                                                        <span className="text-xs font-bold text-slate-900">{(p.tokensUsed / 1000).toFixed(0)}k</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900">${p.cost.toFixed(2)}</td>
                                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <Switch checked={p.enabled} onCheckedChange={() => handleToggle(p.id, p.enabled)} className="data-[state=checked]:bg-violet-600" />
                                                </td>
                                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-none">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44 rounded-none">
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleTest(p)}>
                                                                <Zap className="h-4 w-4" /> Test Provider
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(p)}>
                                                                <PencilLine className="h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openDetail(p)}>
                                                                <Eye className="h-4 w-4" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDelete(p.id)}>
                                                                <Trash2 className="h-4 w-4" /> Remove
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">No AI providers match your filters.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">Token Usage by Provider</CardTitle>
                                <p className="text-sm text-slate-500 mt-1">Monthly token consumption</p>
                            </div>
                            <Activity className="h-5 w-5 text-slate-400" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {PROVIDERS.map((pv, idx) => {
                                const list = providers.filter(p => p.provider === pv)
                                const total = list.reduce((sum, p) => sum + p.tokensUsed, 0)
                                const max = Math.max(...providers.map(p => p.tokensUsed), 1)
                                const progress = Math.min(100, total / max * 100)
                                return (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-slate-700">{pv} <span className="text-slate-400 font-medium ml-2">{list.length} Configs</span></span>
                                            <span className="text-slate-900">{(total / 1000).toFixed(0)}k tokens</span>
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
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Top Spend</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[...providers].sort((a, b) => b.cost - a.cost).slice(0, 4).map((p, idx) => (
                                <div key={idx} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-2 transition" onClick={() => openDetail(p)}>
                                    <div className="flex items-center gap-3">
                                        <div className={`h-9 w-9 rounded-none border flex items-center justify-center text-[10px] font-bold ${PROVIDER_COLORS[p.provider]}`}>
                                            {p.provider.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 leading-none">{p.name}</p>
                                            <p className="text-[10px] text-slate-400 mt-1 font-mono">{p.model}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-900">${p.cost.toFixed(2)}</p>
                                        <div className="flex items-center gap-1 justify-end mt-1">
                                            <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                                            <span className="text-[9px] font-bold text-emerald-600">{p.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-xs font-bold text-violet-600 hover:text-violet-700 rounded-none mt-3" onClick={() => router.push('/client-management/analytics/ai-insights')}>
                                View AI Insights
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-violet-100 bg-violet-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-violet-600 tracking-wider flex items-center gap-2 uppercase">
                                <Sparkles className="h-4 w-4" /> AI Recommendations
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-violet-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    Use <span className="text-violet-600 font-bold">claude-haiku-4.5</span> for high-volume routing to cut costs by ~40%.
                                </p>
                            </div>
                            <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-none" onClick={() => { toast.success("Cost optimization analysis started"); router.push('/client-management/analytics/ai-insights') }}>
                                Run Cost Optimization
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-violet-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit AI Provider" : "Add AI Provider"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Configure model access and usage limits.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Integration Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g., OpenAI Production" className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`} />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Provider</Label>
                                <Select value={form.provider} onValueChange={(v: any) => setField("provider", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        {PROVIDERS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Model</Label>
                                <Select value={form.model} onValueChange={v => setField("model", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        {(MODELS_BY_PROVIDER[form.provider] || []).map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">API Key <span className="text-rose-500">*</span></Label>
                            <Input type="password" value={form.apiKey} onChange={e => setField("apiKey", e.target.value)} placeholder="sk-proj-..." className={`h-10 rounded-none font-mono text-xs ${errors.apiKey ? "border-rose-500" : ""}`} />
                            {errors.apiKey && <p className="text-[11px] text-rose-500">{errors.apiKey}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Use Case</Label>
                                <Select value={form.useCase} onValueChange={(v: any) => setField("useCase", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        {USE_CASES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Monthly Token Limit <span className="text-rose-500">*</span></Label>
                                <Input type="number" value={form.monthlyLimit} onChange={e => setField("monthlyLimit", e.target.value)} placeholder="1000000" className={`h-10 rounded-none ${errors.monthlyLimit ? "border-rose-500" : ""}`} />
                                {errors.monthlyLimit && <p className="text-[11px] text-rose-500">{errors.monthlyLimit}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-violet-600 hover:bg-violet-700 text-white rounded-none" onClick={handleSave}>
                            {editingId ? "Save Changes" : "Add Provider"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Providers</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Provider</Label>
                            <Select value={providerFilter} onValueChange={setProviderFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Providers</SelectItem>
                                    {PROVIDERS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setProviderFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-violet-600 hover:bg-violet-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold">Provider Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Integration</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                                    <p className="text-sm text-slate-500">{selected.provider} • <span className="font-mono">{selected.model}</span></p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">ID</p><p className="font-semibold text-slate-900">{selected.id}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Use Case</p><Badge className="rounded-none">{selected.useCase}</Badge></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${selected.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : selected.status === "Error" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-slate-600 border-slate-100"}`}>{selected.status}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Tokens</p><p className="font-semibold text-slate-900">{selected.tokensUsed.toLocaleString()}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Limit</p><p className="font-semibold text-slate-900">{selected.monthlyLimit.toLocaleString()}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Cost</p><p className="font-semibold text-slate-900">${selected.cost.toFixed(2)}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Last Used</p><p className="font-semibold text-slate-900">{selected.lastUsed}</p></div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">API Key</p><p className="font-mono text-xs text-slate-900 break-all">{selected.apiKey}</p></div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => handleTest(selected)}>
                                    <Zap className="h-4 w-4 mr-2" />Test
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsDetailOpen(false); openEdit(selected) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDelete(selected.id); setIsDetailOpen(false) }}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
