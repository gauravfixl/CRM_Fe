"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Search, RefreshCw, Download, Brain,
    Zap, TrendingUp,
    Activity, MessageSquare, Lightbulb, CheckCircle2,
    Clock, ShieldAlert, ArrowUpRight,
    Send, Info, Filter,
    Wand2, X, Bot,
    ShieldCheck
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { toast } from "@/shared/utils/toast"

const INITIAL_INSIGHTS = [
    { id: "INS-001", type: "Growth", title: "Enterprise upsell opportunity", description: "Acme Corp has significantly increased usage by 40% this month. They are exceeding their current Professional tier limits.", longDescription: "Acme Corp has shown a 40% increase in usage this month, including 3x API call growth and active deployment to 2 additional regions. They've hit 85% of their Professional tier seat cap and 92% of their compute quota. Historical pattern shows accounts with this growth profile convert to Enterprise within 45 days 78% of the time. Recommended approach: schedule a 30-minute roadmap call with their CTO this week, present Enterprise tier benefits including unlimited seats, dedicated CSM, and priority support.", confidence: 94, action: "Propose Enterprise upgrade", status: "New", time: "2 hours ago", relatedRoute: "/client-management/revenue/expansion" },
    { id: "INS-002", type: "Risk", title: "Potential churn: Nexus Inc", description: "Nexus Inc has not logged in for 12 consecutive days and their health score has dropped to 52.", longDescription: "Nexus Inc's account shows alarming inactivity signals: 12-day login gap, zero API calls in the past week, and 2 unresolved support tickets escalated to engineering. Their health score declined from 78 to 52 over the past 30 days. Three of their 5 user seats have not logged in for 21+ days. Estimated MRR at risk: $1,500. Recommended recovery: immediate executive-level outreach, offer a strategy review session, and consider a temporary discount or feature unlock to re-engage. Time-sensitive: best results when contact occurs within 7 days.", confidence: 88, action: "Initiate recovery sequence", status: "Executing", time: "4 hours ago", relatedRoute: "/client-management/analytics/retention" },
    { id: "INS-003", type: "Operations", title: "Optimizable support load", description: "Automating FAQ responses for 'Billing' category could reduce ticket volume by 15%.", longDescription: "Pattern analysis across the last 90 days of support tickets shows that 23% of all tickets fall into the Billing category, with 68% matching one of 14 repetitive question patterns. Auto-replying to these common queries could reclaim approximately 12 support hours per week (worth ~$2,400/month). High-confidence categories include: invoice download requests, prorated charge inquiries, payment method updates, and tax-related questions. Recommended: enable AI auto-reply for the top 14 patterns and route any unresolved cases to a human agent within 4 hours.", confidence: 76, action: "Enable AI auto-reply", status: "New", time: "5 hours ago", relatedRoute: "/client-management/reports" },
    { id: "INS-004", type: "Growth", title: "Referral candidate", description: "Global Tech recently gave a 10/10 NPS score. High potential for a case study or referral.", longDescription: "Global Tech submitted a 10/10 NPS score on their last quarterly survey, accompanied by detailed positive feedback highlighting our analytics module as 'transformative'. Their account has been stable for 18 months with steady expansion. Their team has spoken at 3 industry events this quarter and has an active LinkedIn following of ~12k. They represent an ideal candidate for: (1) detailed case study with measurable ROI metrics, (2) reference program enrollment for high-value prospects, (3) co-marketing webinar opportunity, or (4) testimonial video for the website.", confidence: 82, action: "Request testimonial", status: "New", time: "1 day ago", relatedRoute: "/client-management/customers" },
    { id: "INS-005", type: "Risk", title: "Contract expiration risk", description: "Horizon Labs contract expires in 45 days. No discussions started yet.", longDescription: "Horizon Labs ($4,500 MRR, Enterprise tier) has a contract expiring in 45 days. No renewal discussions have been initiated and no calendar holds exist with their primary stakeholders. Historical data shows Enterprise renewals without active dialogue 30+ days before expiration carry a 35% higher churn risk. Their usage and health metrics are strong (health score: 91), suggesting expansion potential. Recommended: initiate renewal conversation this week, propose a 2-year contract with incremental discount, and explore expansion opportunities for adjacent products.", confidence: 91, action: "Start renewal talk", status: "Executing", time: "1 day ago", relatedRoute: "/client-management/revenue/renewals" },
]

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
}

export default function AiInsightsPage() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [aiQuery, setAiQuery] = useState("")
    const [filterType, setFilterType] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [insights, setInsights] = useState(INITIAL_INSIGHTS)

    const [selectedInsight, setSelectedInsight] = useState<any>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [isExecutionOpen, setIsExecutionOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    const [form, setForm] = useState({ title: "", description: "", type: "Growth", action: "" })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const stats = useMemo(() => {
        const factor = insights.length / INITIAL_INSIGHTS.length
        return {
            activeInsights: insights.length,
            implRate: Math.round(68 * factor) + "%",
            roi: "$" + Math.round(125 * factor) + "k",
            sentiment: factor > 0.8 ? "Positive" : "Neutral",
        }
    }, [insights])

    const filteredInsights = useMemo(() => {
        return insights.filter(ins => {
            const matchSearch = !searchQuery ||
                ins.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ins.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchType = filterType === "all" || ins.type.toLowerCase() === filterType.toLowerCase()
            const matchStatus = filterStatus === "all" || ins.status === filterStatus
            return matchSearch && matchType && matchStatus
        })
    }, [searchQuery, filterType, filterStatus, insights])

    const handleGenerate = () => {
        setIsGenerating(true)
        toast.promise(new Promise(r => setTimeout(r, 2500)), {
            loading: "AI is analyzing client data patterns...",
            success: "Generated 1 new strategic insight",
            error: "Failed to generate insights"
        })
        setTimeout(() => {
            const newInsight = {
                id: `INS-00${insights.length + 1}`,
                type: Math.random() > 0.5 ? "Growth" : "Risk",
                title: "New AI Discovery: Pattern Match",
                description: "Deep learning models identified a 92% correlation between feature X usage and lifetime expansion.",
                longDescription: "Pattern analysis across all active accounts identified a strong correlation (r=0.92) between adoption of feature X and lifetime value expansion. Accounts that adopted feature X within the first 60 days expanded by an average of 47% over 12 months, compared to 12% for non-adopters. Suggested action: prioritize feature X in onboarding flows and create targeted in-app promotions for low-adoption segments.",
                confidence: 96,
                action: "Target similar segments",
                status: "New",
                time: "Just now",
                relatedRoute: "/client-management/analytics/cohorts"
            }
            setInsights(prev => [newInsight, ...prev])
            setIsGenerating(false)
        }, 2500)
    }

    const handleAnalyzeRequest = () => {
        if (!aiQuery.trim()) {
            toast.error("Please enter a query for the AI to analyze")
            return
        }
        setIsAnalyzing(true)
        toast.promise(new Promise(r => setTimeout(r, 3000)), {
            loading: "Processing complex query across database nodes...",
            success: "Analysis complete: View results below",
            error: "Query engine timeout"
        })
        setTimeout(() => {
            const resultInsight = {
                id: `INS-QRY-${Math.floor(Math.random() * 1000)}`,
                type: "Operations",
                title: "Ad-hoc Query Result",
                description: `Analysis for "${aiQuery}" reveals 12 clients matching your criteria. High churn probability in Segment B.`,
                longDescription: `Custom query analysis for "${aiQuery}" returned 12 matching client accounts. The model identified two distinct behavioral segments: Segment A (5 accounts) is healthy and trending positive, while Segment B (7 accounts) shows churn probability above 60% with declining usage and support escalations. Recommended: schedule outreach to Segment B accounts within the next 14 days.`,
                confidence: 89,
                action: "Review list & alert account managers",
                status: "New",
                time: "Just now",
                relatedRoute: "/client-management/analytics/retention"
            }
            setInsights(prev => [resultInsight, ...prev])
            setAiQuery("")
            setIsAnalyzing(false)
        }, 3000)
    }

    const handleDismiss = (id: string) => {
        setInsights(prev => prev.filter(i => i.id !== id))
        toast.success("Insight dismissed")
    }

    const openDetail = (insight: any) => {
        setSelectedInsight(insight)
        setIsDetailOpen(true)
    }

    const openExecution = (insight: any) => {
        setSelectedInsight(insight)
        setIsExecutionOpen(true)
    }

    const confirmExecution = () => {
        if (!selectedInsight) return
        toast.promise(new Promise(r => setTimeout(r, 2000)), {
            loading: `Executing automated workflow: ${selectedInsight.action}...`,
            success: "Automation sequence started",
            error: "Process execution failed"
        })
        setTimeout(() => {
            setInsights(prev => prev.map(i => i.id === selectedInsight.id ? { ...i, status: "Executing" } : i))
            setIsExecutionOpen(false)
            setIsDetailOpen(false)
        }, 2000)
    }

    const handleRefresh = () => {
        setIsRefreshing(true)
        toast.promise(new Promise(r => setTimeout(r, 1500)), {
            loading: "Checking implementation status...",
            success: "Insights sync completed",
            error: "Sync failed"
        })
        setTimeout(() => setIsRefreshing(false), 1500)
    }

    const handleExport = () => {
        toast.success("Report exported")
    }

    const openCreate = () => {
        setForm({ title: "", description: "", type: "Growth", action: "" })
        setErrors({})
        setIsCreateOpen(true)
    }

    const setField = (f: string, v: any) => {
        setForm(prev => ({ ...prev, [f]: v }))
        if (errors[f]) setErrors(prev => { const c = { ...prev }; delete c[f]; return c })
    }

    const validateForm = (): boolean => {
        const errs: Record<string, string> = {}
        errs.title = validators.required(form.title) || validators.minLen(3)(form.title)
        errs.description = validators.required(form.description) || validators.minLen(10)(form.description)
        errs.action = validators.required(form.action) || validators.minLen(3)(form.action)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSaveCustomInsight = () => {
        if (!validateForm()) { toast.error("Please correct the highlighted fields"); return }
        const newInsight = {
            id: `INS-CUSTOM-${Date.now()}`,
            type: form.type,
            title: form.title.trim(),
            description: form.description.trim(),
            longDescription: form.description.trim(),
            confidence: 80,
            action: form.action.trim(),
            status: "New",
            time: "Just now",
            relatedRoute: "/client-management/analytics/ai-insights"
        }
        setInsights(prev => [newInsight, ...prev])
        toast.success("Custom insight created")
        setIsCreateOpen(false)
    }

    const kpiCards = [
        { label: "Predictive insights", value: stats.activeInsights, trend: "Dynamic", trendUp: true, icon: Brain, bg: "bg-indigo-50/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-100", path: "/client-management/analytics/forecasting" },
        { label: "Implementation rate", value: stats.implRate, trend: "+4.2%", trendUp: true, icon: CheckCircle2, bg: "bg-emerald-50/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-100", path: "/client-management/reports" },
        { label: "Estimated roi", value: stats.roi, trend: "+12.1k", trendUp: true, icon: TrendingUp, bg: "bg-violet-50/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-100", path: "/client-management/analytics/revenue" },
        { label: "Portfolio sentiment", value: stats.sentiment, trend: "Stable", trendUp: true, icon: MessageSquare, bg: "bg-amber-50/50", iconBg: "bg-amber-100", iconColor: "text-amber-600", border: "border-amber-100", path: "/client-management/customers" },
    ]

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Ai <span className="text-indigo-600">insights</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Intelligent analysis and automated recommendations to drive client success</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <Button className="h-11 px-6 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2" onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />} Generate insights
                    </Button>
                    <Button variant="outline" className="h-11 px-5 rounded-none border-slate-200 bg-white font-bold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={openCreate}>
                        <Lightbulb className="w-4 h-4 text-slate-400" /> Custom
                    </Button>
                    <Button variant="outline" className="h-11 px-5 rounded-none border-slate-200 bg-white font-bold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="w-4 h-4 text-slate-400" /> Filter
                    </Button>
                    <Button variant="outline" className="h-11 px-5 rounded-none border-slate-200 bg-white font-bold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleRefresh}>
                        <RefreshCw className={`w-4 h-4 text-slate-400 ${isRefreshing ? "animate-spin" : ""}`} /> Sync
                    </Button>
                    <Button variant="outline" className="h-11 px-5 rounded-none border-slate-200 bg-white font-bold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleExport}>
                        <Download className="w-4 h-4 text-slate-400" /> Export
                    </Button>
                </div>
            </div>

            {/* KPI Cards (clickable) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {kpiCards.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <Card
                            key={i}
                            className={`${stat.bg} ${stat.border} border shadow-sm hover:shadow-md transition-all rounded-none cursor-pointer`}
                            onClick={() => router.push(stat.path)}
                        >
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`h-10 w-10 rounded-none flex items-center justify-center ${stat.iconBg}`}>
                                        <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                                    </div>
                                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-none">
                                        {stat.trend}
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Insights List */}
                <Card className="rounded-none border border-slate-100 shadow-sm bg-white overflow-hidden min-h-[600px] lg:col-span-2">
                    <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-lg font-bold text-slate-900">Current insights <span className="text-slate-400 text-sm font-semibold ml-2">({filteredInsights.length})</span></CardTitle>
                        <div className="flex items-center gap-3">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input
                                    placeholder="Filter insights..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-11 h-11 bg-slate-50 border-0 rounded-none text-sm font-semibold focus-visible:ring-1 focus-visible:ring-indigo-500"
                                />
                            </div>
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="h-11 w-32 rounded-none border-0 bg-slate-50 font-bold text-slate-700 shadow-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All types</SelectItem>
                                    <SelectItem value="growth">Growth</SelectItem>
                                    <SelectItem value="risk">Risk</SelectItem>
                                    <SelectItem value="operations">Ops</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-50">
                            {filteredInsights.map((ins) => (
                                <div
                                    key={ins.id}
                                    className="px-8 py-6 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                                    onClick={() => openDetail(ins)}
                                >
                                    <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                                        <div className="flex items-start gap-5 flex-1">
                                            <div className={`h-12 w-12 rounded-none flex items-center justify-center shrink-0 border ${ins.type === "Growth" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                ins.type === "Risk" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-violet-50 text-violet-600 border-violet-100"
                                                }`}>
                                                {ins.type === "Growth" ? <TrendingUp className="w-6 h-6" /> :
                                                    ins.type === "Risk" ? <ShieldAlert className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h4 className="text-[15px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{ins.title}</h4>
                                                    <Badge className={`text-[10px] font-bold px-2 py-0.5 rounded-none border-0 shadow-none ${ins.type === "Growth" ? "bg-emerald-100 text-emerald-700" :
                                                        ins.type === "Risk" ? "bg-rose-100 text-rose-700" : "bg-violet-100 text-violet-700"
                                                        }`}>{ins.type}</Badge>
                                                    <Badge className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-none border-0 shadow-none">{ins.confidence}% Confidence</Badge>
                                                </div>
                                                <p className="text-[13px] font-medium text-slate-500 leading-relaxed">{ins.description}</p>
                                                <div className="flex items-center gap-4 pt-1 flex-wrap">
                                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-100 rounded-none text-[10px] font-bold text-indigo-600 shadow-sm">
                                                        <Zap className="w-3 h-3" /> RECOMMENDED: {ins.action}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                                                        <Clock className="w-3.5 h-3.5" /> {ins.time}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 md:mt-0" onClick={(e) => e.stopPropagation()}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-9 w-9 p-0 rounded-none text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                                                onClick={() => handleDismiss(ins.id)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                className={`h-9 px-4 rounded-none font-bold text-xs transition-all ${ins.status === "Executing" ? "bg-slate-100 text-slate-500 cursor-default hover:bg-slate-100" : "bg-indigo-600 text-white hover:bg-indigo-700"
                                                    }`}
                                                onClick={() => ins.status === "New" && openExecution(ins)}
                                            >
                                                {ins.status === "Executing" ? "Executing..." : "Execute"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredInsights.length === 0 && (
                                <div className="px-8 py-20 text-center">
                                    <div className="h-14 w-14 rounded-none bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm"><Lightbulb className="w-6 h-6 text-slate-300" /></div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No matching insights found</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* AI Query + Discovery */}
                <div className="space-y-6">
                    <Card className="rounded-none border border-slate-100 shadow-sm bg-white p-8 overflow-hidden h-full">
                        <h4 className="text-lg font-bold text-slate-900 mb-2">Ask AI assistant</h4>
                        <p className="text-xs font-semibold text-slate-400 mb-6 leading-relaxed">Query your client database in natural language to find deep patterns.</p>
                        <div className="space-y-4">
                            <div className="relative">
                                <MessageSquare className="absolute left-4 top-4 text-slate-400 w-4 h-4" />
                                <textarea
                                    placeholder="e.g. Which clients have high usage but declining NPS?"
                                    value={aiQuery}
                                    onChange={(e) => setAiQuery(e.target.value)}
                                    className="w-full min-h-[120px] pl-11 pr-4 py-4 bg-slate-50 border-0 rounded-none text-[13px] font-bold placeholder:text-slate-400 focus:ring-1 focus:ring-indigo-500 transition-all resize-none disabled:opacity-50"
                                    disabled={isAnalyzing}
                                />
                            </div>
                            <Button
                                className="w-full h-11 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm gap-2 disabled:bg-slate-300"
                                onClick={handleAnalyzeRequest}
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Analyze request
                            </Button>
                        </div>
                    </Card>

                    <Card className="rounded-none border border-slate-100 shadow-sm bg-white p-8 h-full">
                        <h4 className="text-lg font-bold text-slate-900 mb-6">Discovery status</h4>
                        <div className="space-y-6">
                            {[
                                { label: "Data indexing", val: "100%", status: "Complete", color: "bg-emerald-500" },
                                { label: "Pattern recognition", val: isAnalyzing ? "94%" : "84%", status: "Active", color: "bg-indigo-500" },
                                { label: "Anomaly detection", val: isAnalyzing ? "98%" : "92%", status: "Active", color: "bg-violet-500" },
                            ].map((s, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold text-slate-700">{s.label}</p>
                                        <p className="text-[10px] font-bold text-slate-400">{s.val}</p>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 overflow-hidden">
                                        <div style={{ width: s.val }} className={`h-full ${s.color}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-3">
                            <Info className="w-4 h-4 text-slate-300 shrink-0" />
                            <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-tight">Models analyze billing, logs, and support data.</p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Insight Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{selectedInsight?.title}</SheetTitle>
                        <p className="text-[12px] text-slate-500">{selectedInsight?.id} • {selectedInsight?.time}</p>
                    </SheetHeader>
                    {selectedInsight && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-5">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Badge className={`text-[10px] font-bold px-2 py-0.5 rounded-none border-0 ${selectedInsight.type === "Growth" ? "bg-emerald-100 text-emerald-700" :
                                        selectedInsight.type === "Risk" ? "bg-rose-100 text-rose-700" : "bg-violet-100 text-violet-700"
                                        }`}>{selectedInsight.type}</Badge>
                                    <Badge className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-none border-0">{selectedInsight.confidence}% Confidence</Badge>
                                    <Badge className={`text-[10px] font-bold px-2 py-0.5 rounded-none border-0 ${selectedInsight.status === "Executing" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"}`}>{selectedInsight.status}</Badge>
                                </div>

                                <div className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-none">
                                    <h4 className="text-[11px] font-bold text-indigo-600 tracking-widest mb-2">FULL RECOMMENDATION</h4>
                                    <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-line">{selectedInsight.longDescription || selectedInsight.description}</p>
                                </div>

                                <div className="p-4 bg-white border border-slate-200 rounded-none">
                                    <h4 className="text-[11px] font-bold text-slate-400 tracking-widest mb-2">RECOMMENDED ACTION</h4>
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-indigo-600" />
                                        <p className="text-[13px] font-bold text-slate-900">{selectedInsight.action}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <h4 className="text-[11px] font-bold text-slate-400 tracking-widest border-b border-slate-100 pb-2">RELATED ACTIONS</h4>
                                    <Button
                                        variant="outline"
                                        className="w-full h-11 rounded-none border-slate-100 bg-white hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-600 justify-between px-4 font-bold text-[12px]"
                                        onClick={() => { setIsDetailOpen(false); router.push(selectedInsight.relatedRoute) }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <ArrowUpRight className="w-4 h-4 text-slate-400" />
                                            Open related dashboard
                                        </div>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full h-11 rounded-none border-slate-100 bg-white hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 justify-between px-4 font-bold text-[12px]"
                                        onClick={() => { handleDismiss(selectedInsight.id); setIsDetailOpen(false) }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <X className="w-4 h-4 text-slate-400" />
                                            Dismiss insight
                                        </div>
                                    </Button>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsDetailOpen(false)}>Close</Button>
                                <Button
                                    className={`flex-1 h-10 rounded-none text-white ${selectedInsight.status === "Executing" ? "bg-slate-400 cursor-default hover:bg-slate-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
                                    onClick={() => selectedInsight.status === "New" && openExecution(selectedInsight)}
                                >
                                    <Zap className="w-4 h-4 mr-2" /> {selectedInsight.status === "Executing" ? "Executing..." : "Execute action"}
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>

            {/* Execution Sheet */}
            <Sheet open={isExecutionOpen} onOpenChange={setIsExecutionOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-emerald-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">Execute insight</SheetTitle>
                        <p className="text-[12px] text-slate-500">{selectedInsight?.id}</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                        <div className="space-y-3">
                            <h4 className="text-[11px] font-bold text-slate-400 tracking-widest">WORKFLOW TARGET</h4>
                            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-none flex items-center gap-4">
                                <Bot className="w-7 h-7 text-indigo-500 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{selectedInsight?.action}</p>
                                    <p className="text-xs font-medium text-slate-500">{selectedInsight?.title}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-[11px] font-bold text-slate-400 tracking-widest">PRE-EXECUTION CHECKLIST</h4>
                            {[
                                { label: "Verify client eligibility", status: "Verified", icon: ShieldCheck },
                                { label: "Review message template", status: "Ready", icon: CheckCircle2 },
                                { label: "Notification routing", status: "Active", icon: Activity },
                            ].map((step, i) => {
                                const Icon = step.icon
                                return (
                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-none border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-4 h-4 text-emerald-500" />
                                            <span className="text-xs font-bold text-slate-600">{step.label}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-none">{step.status}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsExecutionOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={confirmExecution}>
                            <Zap className="w-4 h-4 mr-2" /> Start workflow
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Create Custom Insight Sheet */}
            <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-emerald-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">New custom insight</SheetTitle>
                        <p className="text-[12px] text-slate-500">Log a manually identified opportunity or risk.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Title <span className="text-rose-500">*</span></Label>
                            <Input
                                value={form.title}
                                onChange={e => setField("title", e.target.value)}
                                placeholder="e.g., Renewal opportunity: Tech Co"
                                className={`h-10 rounded-none ${errors.title ? "border-rose-500" : ""}`}
                            />
                            {errors.title && <p className="text-[11px] text-rose-500">{errors.title}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Type</Label>
                            <Select value={form.type} onValueChange={v => setField("type", v)}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="Growth">Growth</SelectItem>
                                    <SelectItem value="Risk">Risk</SelectItem>
                                    <SelectItem value="Operations">Operations</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Description <span className="text-rose-500">*</span></Label>
                            <textarea
                                value={form.description}
                                onChange={e => setField("description", e.target.value)}
                                placeholder="Provide context for the insight..."
                                className={`w-full h-28 p-3 bg-white border rounded-none text-[13px] focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none ${errors.description ? "border-rose-500" : "border-slate-200"}`}
                            />
                            {errors.description && <p className="text-[11px] text-rose-500">{errors.description}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Recommended action <span className="text-rose-500">*</span></Label>
                            <Input
                                value={form.action}
                                onChange={e => setField("action", e.target.value)}
                                placeholder="e.g., Schedule expansion call"
                                className={`h-10 rounded-none ${errors.action ? "border-rose-500" : ""}`}
                            />
                            {errors.action && <p className="text-[11px] text-rose-500">{errors.action}</p>}
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSaveCustomInsight}>
                            <Lightbulb className="w-4 h-4 mr-2" /> Save insight
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter insights</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Type</Label>
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All types</SelectItem>
                                    <SelectItem value="growth">Growth</SelectItem>
                                    <SelectItem value="risk">Risk</SelectItem>
                                    <SelectItem value="operations">Operations</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Status</Label>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All statuses</SelectItem>
                                    <SelectItem value="New">New</SelectItem>
                                    <SelectItem value="Executing">Executing</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setFilterType("all"); setFilterStatus("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none text-white" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
