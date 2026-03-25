"use client"

import { useState, useMemo, useEffect } from "react"
import {
    Plus, Search, RefreshCw, Download, Brain,
    Sparkles, Zap, TrendingUp, TrendingDown,
    Activity, MessageSquare, Lightbulb, CheckCircle2,
    Clock, ShieldAlert, ArrowUpRight, ArrowDownRight,
    SearchCode, Database, Cpu, Send, Info, Filter,
    LayoutDashboard, Wand2, X, Terminal, Bot,
    ShieldCheck
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { toast } from "@/shared/utils/toast"
import { motion, AnimatePresence } from "framer-motion"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/shared/components/ui/dialog"

// Mock data for AI Insights
const INITIAL_INSIGHTS = [
    { id: "INS-001", type: "Growth", title: "Enterprise upsell opportunity", description: "Acme Corp has significantly increased usage by 40% this month. They are exceeding their current Professional tier limits.", confidence: 94, action: "Propose Enterprise upgrade", status: "New", time: "2 hours ago" },
    { id: "INS-002", type: "Risk", title: "Potential churn: Nexus Inc", description: "Nexus Inc has not logged in for 12 consecutive days and their health score has dropped to 52.", confidence: 88, action: "Initiate recovery sequence", status: "Executing", time: "4 hours ago" },
    { id: "INS-003", type: "Operations", title: "Optimizable support load", description: "Automating FAQ responses for 'Billing' category could reduce ticket volume by 15%.", confidence: 76, action: "Enable AI auto-reply", status: "New", time: "5 hours ago" },
    { id: "INS-004", type: "Growth", title: "Referral candidate", description: "Global Tech recently gave a 10/10 NPS score. High potential for a case study or referral.", confidence: 82, action: "Request testimonial", status: "New", time: "1 day ago" },
    { id: "INS-005", type: "Risk", title: "Contract expiration risk", description: "Horizon Labs contract expires in 45 days. No discussions started yet.", confidence: 91, action: "Start renewal talk", status: "Executing", time: "1 day ago" },
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function AiInsightsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [aiQuery, setAiQuery] = useState("")
    const [filterType, setFilterType] = useState("all")
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [insights, setInsights] = useState(INITIAL_INSIGHTS)
    const [selectedInsight, setSelectedInsight] = useState<any>(null)
    const [isExecutionOpen, setIsExecutionOpen] = useState(false)

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
            const matchSearch = ins.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ins.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchType = filterType === "all" || ins.type.toLowerCase() === filterType.toLowerCase()
            return matchSearch && matchType
        })
    }, [searchQuery, filterType, insights])

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
                confidence: 96,
                action: "Target similar segments",
                status: "New",
                time: "Just now"
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
            setAiQuery("")
            setIsAnalyzing(false)
            // Trigger a new insight as a result
            const resultInsight = {
                id: `INS-QRY-${Math.floor(Math.random() * 1000)}`,
                type: "Operations",
                title: "Ad-hoc Query Result",
                description: `Analysis for "${aiQuery}" reveals 12 clients matching your criteria. High churn probability in Segment B.`,
                confidence: 89,
                action: "Review list & alert account managers",
                status: "New",
                time: "Just now"
            }
            setInsights(prev => [resultInsight, ...prev])
        }, 3000)
    }

    const handleDismiss = (id: string) => {
        setInsights(prev => prev.filter(i => i.id !== id))
        toast.info("Insight dismissed from active list")
    }

    const handleExecuteClick = (insight: any) => {
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
        const csv = [
            ["ID", "Type", "Title", "Description", "Confidence", "Action", "Status"],
            ...insights.map(i => [i.id, i.type, i.title, i.description, i.confidence, i.action, i.status])
        ].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "ai-insights.csv"
        a.click()
        URL.revokeObjectURL(url)
        toast.success("AI insights report exported")
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit"
        >
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <motion.div variants={itemVariants}>
                    <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Ai <span className="text-indigo-600">insights</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Intelligent analysis and automated recommendations to drive client success</p>
                </motion.div>
                <div className="flex items-center gap-3">
                    <Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shadow-xl shadow-indigo-200/50" onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />} Generate insights
                    </Button>
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-bold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleRefresh}>
                        <RefreshCw className={`w-4 h-4 text-slate-400 ${isRefreshing ? "animate-spin" : ""}`} /> Sync
                    </Button>
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-bold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleExport}>
                        <Download className="w-4 h-4 text-slate-400" /> Export
                    </Button>
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: "Predictive insights", value: stats.activeInsights, trend: "Dynamic", trendUp: true, icon: Brain, bg: "bg-indigo-50/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-100/50" },
                    { label: "Implementation rate", value: stats.implRate, trend: "+4.2%", trendUp: true, icon: CheckCircle2, bg: "bg-emerald-50/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-100/50" },
                    { label: "Estimated roi", value: stats.roi, trend: "+12.1k", trendUp: true, icon: TrendingUp, bg: "bg-violet-50/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-100/50" },
                    { label: "Portfolio sentiment", value: stats.sentiment, trend: "Stable", trendUp: true, icon: MessageSquare, bg: "bg-amber-50/50", iconBg: "bg-amber-100", iconColor: "text-amber-600", border: "border-amber-100/50" },
                ].map((stat, i) => (
                    <motion.div key={i} variants={itemVariants}>
                        <Card className={`${stat.bg} ${stat.border} border shadow-sm hover:shadow-md transition-all rounded-[22px] overflow-hidden`}>
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`h-10 w-10 rounded-[14px] flex items-center justify-center ${stat.iconBg}`}>
                                        <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                                    </div>
                                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                        {stat.trend}
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-medium text-slate-900 tracking-tight">{stat.value}</h3>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Insights List */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card className="rounded-[28px] border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden min-h-[600px]">
                        <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle className="text-lg font-bold text-slate-900">Current insights <span className="text-slate-400 text-sm font-semibold ml-2">({filteredInsights.length})</span></CardTitle>
                            <div className="flex items-center gap-3">
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <Input
                                        placeholder="Filter insights..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-11 h-11 bg-slate-50 border-0 rounded-xl text-sm font-semibold focus-visible:ring-1 focus-visible:ring-indigo-500"
                                    />
                                </div>
                                <Select value={filterType} onValueChange={setFilterType}>
                                    <SelectTrigger className="h-11 w-32 rounded-xl border-0 bg-slate-50 font-bold text-slate-700 shadow-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
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
                                <AnimatePresence mode="popLayout">
                                    {filteredInsights.map((ins, idx) => (
                                        <motion.div
                                            key={ins.id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.4 }}
                                            className="px-8 py-6 hover:bg-slate-50/50 transition-colors group"
                                        >
                                            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                                                <div className="flex items-start gap-5 flex-1">
                                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${ins.type === "Growth" ? "bg-emerald-50 text-emerald-600" :
                                                        ins.type === "Risk" ? "bg-rose-50 text-rose-600" : "bg-violet-50 text-violet-600"
                                                        }`}>
                                                        {ins.type === "Growth" ? <TrendingUp className="w-6 h-6" /> :
                                                            ins.type === "Risk" ? <ShieldAlert className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center gap-3 flex-wrap">
                                                            <h4 className="text-[15px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{ins.title}</h4>
                                                            <Badge className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border-0 shadow-none ${ins.type === "Growth" ? "bg-emerald-100 text-emerald-700" :
                                                                ins.type === "Risk" ? "bg-rose-100 text-rose-700" : "bg-violet-100 text-violet-700"
                                                                }`}>{ins.type}</Badge>
                                                            <Badge className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-lg border-0 shadow-none">{ins.confidence}% Confidence</Badge>
                                                        </div>
                                                        <p className="text-[13px] font-medium text-slate-500 leading-relaxed">{ins.description}</p>
                                                        <div className="flex items-center gap-4 pt-1">
                                                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-bold text-indigo-600 shadow-sm">
                                                                <Zap className="w-3 h-3" /> RECOMMENDED: {ins.action}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                                                                <Clock className="w-3.5 h-3.5" /> {ins.time}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 mt-2 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-9 w-9 p-0 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                                                        onClick={() => handleDismiss(ins.id)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        className={`h-9 px-4 rounded-xl font-bold text-xs shadow-lg transition-all ${ins.status === "Executing" ? "bg-slate-100 text-slate-500 cursor-default" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100"
                                                            }`}
                                                        onClick={() => ins.status === "New" && handleExecuteClick(ins)}
                                                    >
                                                        {ins.status === "Executing" ? "Executing..." : "Execute"}
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {filteredInsights.length === 0 && (
                                    <div className="px-8 py-20 text-center">
                                        <div className="h-14 w-14 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm"><Lightbulb className="w-6 h-6 text-slate-300" /></div>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No matching insights found</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* AI Query Interface */}
                <div className="space-y-6">
                    <motion.div variants={itemVariants}>
                        <Card className="rounded-[28px] border-0 shadow-xl shadow-slate-200/50 bg-white p-8 overflow-hidden relative group h-full">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><MessageSquare className="w-32 h-32" /></div>
                            <h4 className="text-lg font-bold text-slate-900 mb-2">Ask AI assistant</h4>
                            <p className="text-xs font-semibold text-slate-400 mb-6 leading-relaxed">Query your client database in natural language to find deep patterns.</p>
                            <div className="space-y-4">
                                <div className="relative">
                                    <MessageSquare className="absolute left-4 top-4 text-slate-400 w-4 h-4" />
                                    <textarea
                                        placeholder="e.g. Which clients have high usage but declining NPS?"
                                        value={aiQuery}
                                        onChange={(e) => setAiQuery(e.target.value)}
                                        className="w-full min-h-[120px] pl-11 pr-4 py-4 bg-slate-50 border-0 rounded-2xl text-[13px] font-bold placeholder:text-slate-400 focus:ring-1 focus:ring-indigo-500 transition-all resize-none disabled:opacity-50"
                                        disabled={isAnalyzing}
                                    />
                                </div>
                                <Button
                                    className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm gap-2 shadow-xl shadow-indigo-200/50 transition-transform active:scale-95 disabled:bg-slate-300 shadow-none"
                                    onClick={handleAnalyzeRequest}
                                    disabled={isAnalyzing}
                                >
                                    {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Analyze request
                                </Button>
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="rounded-[28px] border-0 shadow-xl shadow-slate-200/50 bg-white p-8 h-full">
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
                                        <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: s.val }}
                                                transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                                className={`h-full ${s.color} rounded-full`}
                                            ></motion.div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-3">
                                <Info className="w-4 h-4 text-slate-300 shrink-0" />
                                <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-tight">Models analyze billing, logs, and support data.</p>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>

            {/* Execution Dialog */}
            <Dialog open={isExecutionOpen} onOpenChange={setIsExecutionOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-[32px] border-0 shadow-2xl p-0 overflow-hidden font-outfit">
                    <div className="bg-indigo-600 h-24 relative flex items-center px-8 text-white">
                        <div className="flex items-center gap-4">
                            <div className="h-11 w-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <Terminal className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Execute insight</h3>
                                <p className="text-indigo-200 text-[10px] font-bold tracking-widest">{selectedInsight?.id}</p>
                            </div>
                        </div>

                    </div>

                    <div className="p-8 space-y-7">
                        <div className="space-y-3">
                            <h4 className="text-[11px] font-bold text-slate-400 tracking-widest px-1">Workflow target</h4>
                            <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-4">
                                <Bot className="w-8 h-8 text-indigo-500 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{selectedInsight?.action}</p>
                                    <p className="text-xs font-medium text-slate-500">{selectedInsight?.title}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[11px] font-bold text-slate-400 tracking-widest px-1">Pre-execution checklist</h4>
                            <div className="space-y-3">
                                {[
                                    { label: "Verify client eligibility", status: "Verified", icon: ShieldCheck },
                                    { label: "Review message template", status: "Ready", icon: CheckCircle2 },
                                    { label: "Notification routing", status: "Active", icon: Activity },
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <step.icon className="w-4 h-4 text-emerald-500" />
                                            <span className="text-xs font-bold text-slate-600">{step.label}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">{step.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-sm shadow-xl shadow-indigo-100"
                                onClick={confirmExecution}
                            >
                                <Zap className="w-4 h-4 mr-2" /> Start workflow
                            </Button>
                            <Button
                                variant="outline"
                                className="h-12 px-6 rounded-xl border-slate-200 font-bold text-sm hover:bg-slate-50"
                                onClick={() => setIsExecutionOpen(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}
