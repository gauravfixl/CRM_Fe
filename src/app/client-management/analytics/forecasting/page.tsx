"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    RefreshCw, Download,
    TrendingUp, TrendingDown,
    ArrowUpRight, ArrowDownRight, Target, Brain,
    Sparkles, Activity, Clock,
    ShieldCheck, AlertCircle, Info, Filter,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { toast } from "@/shared/utils/toast"
import {
    Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart
} from 'recharts'

const validators = {
    number: (v: any) => v === "" || v === null || v === undefined ? "" : isNaN(Number(v)) ? "Enter a valid number" : "",
    percent: (v: any) => v === "" || v === null || v === undefined ? "" : isNaN(Number(v)) ? "Enter a valid number" : Number(v) < 0 || Number(v) > 200 ? "Must be between 0 and 200" : "",
}

const getForecastData = (period: string, scenario: string, growthAdj = 1.0) => {
    const monthsCount = parseInt(period)
    const base = 120000
    const growth = (scenario === "optimistic" ? 0.08 : scenario === "consv" ? 0.02 : 0.05) * growthAdj
    const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"].slice(0, monthsCount)

    return months.map((m, i) => {
        const value = base * Math.pow(1 + growth, i) + (Math.random() * 5000)
        const range = scenario === "optimistic" ? 0.15 : scenario === "consv" ? 0.05 : 0.1
        return {
            month: m,
            value: Math.round(value),
            low: Math.round(value * (1 - range)),
            high: Math.round(value * (1 + range))
        }
    })
}

export default function ForecastingPage() {
    const router = useRouter()
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [forecastPeriod, setForecastPeriod] = useState("6")
    const [scenario, setScenario] = useState("baseline")
    const [growthMod, setGrowthMod] = useState(100)
    const [forecastData, setForecastData] = useState(getForecastData("6", "baseline"))

    const [isParamsOpen, setIsParamsOpen] = useState(false)
    const [isInsightOpen, setIsInsightOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [selectedInsight, setSelectedInsight] = useState<any>(null)

    const [paramsForm, setParamsForm] = useState({ growth: "100", volatility: "Medium" })
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        setForecastData(getForecastData(forecastPeriod, scenario, growthMod / 100))
    }, [forecastPeriod, scenario, growthMod])

    const topStats = useMemo(() => {
        const factor = (scenario === "optimistic" ? 1.2 : scenario === "consv" ? 0.85 : 1.0) * (growthMod / 100)
        return [
            { label: "Year-end projection", value: "$" + (2.1 * factor).toFixed(1) + "M", trend: "+14.2% YoY", trendUp: true, icon: Target, bg: "bg-indigo-50/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-100", path: "/client-management/analytics/revenue" },
            { label: "Growth sustainability", value: factor < 0.9 ? "Medium" : "High", trend: "+2.1%", trendUp: true, icon: ShieldCheck, bg: "bg-emerald-50/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-100", path: "/client-management/revenue/forecasting" },
            { label: "Churn probability", value: (1.2 / factor).toFixed(1) + "%", trend: "-0.3%", trendUp: true, icon: TrendingDown, bg: "bg-rose-50/50", iconBg: "bg-rose-100", iconColor: "text-rose-600", border: "border-rose-100", path: "/client-management/analytics/retention" },
            { label: "Forecast accuracy", value: scenario === "baseline" ? "94.8%" : "91.2%", trend: "+1.2%", trendUp: true, icon: Brain, bg: "bg-violet-50/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-100", path: "/client-management/analytics/ai-insights" },
        ]
    }, [scenario, growthMod])

    const handleRefresh = () => {
        setIsRefreshing(true)
        toast.promise(new Promise(r => setTimeout(r, 2000)), {
            loading: "Running AI forecast models...",
            success: "Revenue projections updated",
            error: "Failed to run prediction engine"
        })
        setTimeout(() => {
            setForecastData(getForecastData(forecastPeriod, scenario, growthMod / 100))
            setIsRefreshing(false)
        }, 2000)
    }

    const handleExport = () => {
        toast.success("Report exported")
    }

    const fmt = (val: number) => {
        if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`
        if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`
        return `$${val.toFixed(0)}`
    }

    const insights = [
        {
            id: "fc-trajectory",
            title: "Q4 revenue trajectory",
            short: "Based on current trajectory, we expect a 12% increase in revenue by Q4. Expansion from Enterprise clients is the primary driver.",
            full: "Based on the current growth trajectory and historical patterns from the last 18 months, we project a 12% revenue increase by Q4. Enterprise tier accounts represent 68% of this expansion, driven by net seat growth across 14 strategic accounts and 3 net-new logos in the pipeline. Confidence level: 92% based on Monte-Carlo simulations across 10,000 iterations. Recommended actions: (1) prioritize Enterprise renewals due in Q3, (2) accelerate the 3 pipeline logos in late-stage negotiation, (3) protect baseline by maintaining current onboarding velocity.",
            icon: Activity,
            iconColor: "text-emerald-500",
        },
        {
            id: "fc-churn-risk",
            title: "Professional tier churn risk",
            short: "A potential churn risk of $24k MRR is detected from aging accounts in the Professional tier.",
            full: "Predictive model flags $24k of MRR at risk over the next 90 days, concentrated in 11 Professional tier accounts. Common signals: 30+ day login gaps (7 accounts), declining product engagement (5 accounts), and unresolved support tickets older than 14 days (4 accounts). Estimated revenue loss if no intervention: $24,000/month. Recommended actions: (1) trigger automated re-engagement campaigns, (2) assign customer success owners to top 5 at-risk accounts, (3) offer targeted feature training sessions for low-adoption accounts.",
            icon: AlertCircle,
            iconColor: "text-amber-500",
        },
    ]

    const openInsight = (insight: any) => {
        setSelectedInsight(insight)
        setIsInsightOpen(true)
    }

    const openParams = () => {
        setParamsForm({ growth: String(growthMod), volatility: "Medium" })
        setErrors({})
        setIsParamsOpen(true)
    }

    const validateParams = () => {
        const errs: Record<string, string> = {}
        errs.growth = validators.percent(paramsForm.growth)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const applyParams = () => {
        if (!validateParams()) { toast.error("Please correct the highlighted fields"); return }
        setGrowthMod(Number(paramsForm.growth))
        toast.success("Forecast parameters applied")
        setIsParamsOpen(false)
        handleRefresh()
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-none shadow-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">{label}</p>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-none bg-indigo-500"></div>
                            <p className="text-[13px] font-bold text-slate-900">
                                Projected: <span className="text-indigo-600">{fmt(payload[0].payload.value)}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-none bg-indigo-100"></div>
                            <p className="text-[11px] font-semibold text-slate-400 italic">
                                Range: {fmt(payload[0].payload.low)} - {fmt(payload[0].payload.high)}
                            </p>
                        </div>
                    </div>
                </div>
            )
        }
        return null
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Revenue <span className="text-indigo-600">forecasting</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">AI-powered future projections based on historical growth and churn patterns</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <Select value={forecastPeriod} onValueChange={(v) => { setForecastPeriod(v); toast.success("Period updated") }}>
                        <SelectTrigger className="h-11 w-48 rounded-none border-slate-200 bg-white font-bold text-slate-700 shadow-sm gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="3">Next 3 months</SelectItem>
                            <SelectItem value="6">Next 6 months</SelectItem>
                            <SelectItem value="12">Next 12 months</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="h-11 px-5 rounded-none border-slate-200 bg-white font-bold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="w-4 h-4 text-slate-400" /> Filter
                    </Button>
                    <Button variant="outline" className="h-11 px-5 rounded-none border-slate-200 bg-white font-bold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleRefresh}>
                        <RefreshCw className={`w-4 h-4 text-slate-400 ${isRefreshing ? "animate-spin" : ""}`} /> Run engine
                    </Button>
                    <Button variant="outline" className="h-11 px-5 rounded-none border-slate-200 bg-white font-bold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleExport}>
                        <Download className="w-4 h-4 text-slate-400" /> Export
                    </Button>
                </div>
            </div>

            {/* KPI Cards (clickable) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {topStats.map((stat, i) => {
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
                                    <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-none ${stat.trendUp ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"}`}>
                                        {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
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

            {/* Projection Chart */}
            <Card className="rounded-none border border-slate-100 shadow-sm bg-white overflow-hidden h-[520px]">
                <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            Revenue projection <Sparkles className="w-5 h-5 text-indigo-500" />
                        </CardTitle>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">Estimated revenue growth for the next {forecastPeriod} months</p>
                    </div>
                    <div className="p-1 bg-slate-50 rounded-none flex">
                        {["Conservative", "Baseline", "Optimistic"].map((s) => {
                            const active = (s === "Conservative" && scenario === "consv") ||
                                (s === "Baseline" && scenario === "baseline") ||
                                (s === "Optimistic" && scenario === "optimistic")
                            return (
                                <Button
                                    key={s}
                                    variant="ghost"
                                    size="sm"
                                    className={`h-9 px-4 rounded-none font-bold text-[11px] shadow-none transition-all ${active ? "bg-white shadow-sm text-indigo-600" : "text-slate-400"}`}
                                    onClick={() => { setScenario(s === "Conservative" ? "consv" : s.toLowerCase()); toast.success(`${s} scenario applied`) }}
                                >{s}</Button>
                            )
                        })}
                    </div>
                </CardHeader>
                <CardContent className="h-[420px] p-8 relative">
                    {isRefreshing && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                        </div>
                    )}
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRangeForecast" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} tickFormatter={(val) => fmt(val)} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="high" stroke="transparent" fill="url(#colorRangeForecast)" animationBegin={200} animationDuration={1500} />
                            <Area type="monotone" dataKey="low" stroke="transparent" fill="white" animationBegin={200} animationDuration={1500} />
                            <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} animationBegin={400} animationDuration={2000} name="Projected" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* AI Insights & Scenario Impact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="rounded-none border border-slate-100 shadow-sm bg-white p-8 h-full">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 rounded-none bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100"><Brain className="w-6 h-6" /></div>
                        <div>
                            <h4 className="text-lg font-bold text-slate-900">AI projection summary</h4>
                            <p className="text-[11px] font-medium text-slate-400 italic">Confidence level: 92% • Updated 2 mins ago</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {insights.map(ins => {
                            const Icon = ins.icon
                            return (
                                <div
                                    key={ins.id}
                                    className="p-5 bg-slate-50/50 rounded-none flex items-start gap-4 border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer"
                                    onClick={() => openInsight(ins)}
                                >
                                    <div className="h-8 w-8 rounded-none bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                                        <Icon className={`w-4 h-4 ${ins.iconColor}`} />
                                    </div>
                                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">{ins.short}</p>
                                </div>
                            )
                        })}
                        <Button className="w-full h-11 rounded-none bg-indigo-600 hover:bg-indigo-700 font-bold text-sm text-white" onClick={handleRefresh}>
                            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} /> Recalculate models
                        </Button>
                    </div>
                </Card>

                <Card className="rounded-none border border-slate-100 shadow-sm bg-white p-8 h-full">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-lg font-bold text-slate-900">Scenario analysis</h4>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 px-3 rounded-none bg-slate-50 font-bold text-[11px] text-slate-600 hover:bg-slate-100 hover:text-indigo-600 gap-1.5"
                            onClick={openParams}
                        >
                            <Filter className="w-3.5 h-3.5" /> Adjust params
                        </Button>
                    </div>
                    <div className="space-y-7">
                        {[
                            { label: "Baseline growth", current: scenario === "optimistic" ? (22 * (growthMod / 100)).toFixed(0) + "%" : scenario === "consv" ? (8 * (growthMod / 100)).toFixed(0) + "%" : (15 * (growthMod / 100)).toFixed(0) + "%", projected: "+$240k", color: "bg-indigo-500" },
                            { label: "Upsell performance", current: scenario === "optimistic" ? (12 * (growthMod / 100)).toFixed(0) + "%" : scenario === "consv" ? (4 * (growthMod / 100)).toFixed(0) + "%" : (8 * (growthMod / 100)).toFixed(0) + "%", projected: "+$120k", color: "bg-teal-400" },
                            { label: "New acquisition", current: scenario === "optimistic" ? (28 * (growthMod / 100)).toFixed(0) + "%" : scenario === "consv" ? (15 * (growthMod / 100)).toFixed(0) + "%" : (22 * (growthMod / 100)).toFixed(0) + "%", projected: "+$320k", color: "bg-violet-500" },
                        ].map((s, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700">{s.label}</span>
                                    <span className="text-[11px] font-bold text-emerald-600">{s.projected}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 overflow-hidden">
                                    <div style={{ width: s.current }} className={`h-full ${s.color}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-2">
                        <Info className="w-4 h-4 text-slate-300" />
                        <p className="text-[10px] font-medium text-slate-400 leading-relaxed tracking-tight">Data based on Monte-Carlo simulations with {growthMod}% confidence weighting.</p>
                    </div>
                </Card>
            </div>

            {/* Adjust Params Sheet */}
            <Sheet open={isParamsOpen} onOpenChange={setIsParamsOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Adjust forecast parameters</SheetTitle>
                        <p className="text-[12px] text-slate-500">Tune model assumptions and growth multipliers.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Growth multiplier (%) <span className="text-rose-500">*</span></Label>
                            <Input
                                type="number"
                                value={paramsForm.growth}
                                onChange={e => { setParamsForm(p => ({ ...p, growth: e.target.value })); if (errors.growth) setErrors(p => { const c = { ...p }; delete c.growth; return c }) }}
                                placeholder="100"
                                className={`h-10 rounded-none ${errors.growth ? "border-rose-500" : ""}`}
                            />
                            {errors.growth && <p className="text-[11px] text-rose-500">{errors.growth}</p>}
                            <p className="text-[10px] text-slate-400 italic">Varies the base assumption of growth for all scenarios (50–200).</p>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Market volatility</Label>
                            <Select value={paramsForm.volatility} onValueChange={(v) => setParamsForm(p => ({ ...p, volatility: v }))}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 pt-2">
                            <h4 className="text-[11px] font-bold text-slate-400 tracking-widest border-b border-slate-100 pb-2">MODEL VARIABLES</h4>
                            {[
                                { label: "Historical accuracy", status: "94.8%", color: "text-emerald-500" },
                                { label: "Data points", status: "1.2k", color: "text-slate-500" },
                                { label: "Confidence", status: `${growthMod}%`, color: "text-indigo-500" },
                            ].map((v, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-none border border-slate-100">
                                    <span className="text-xs font-bold text-slate-600">{v.label}</span>
                                    <span className={`text-xs font-bold ${v.color}`}>{v.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsParamsOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none text-white" onClick={applyParams}>
                            <RefreshCw className="w-4 h-4 mr-2" /> Apply changes
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Insight Detail Sheet */}
            <Sheet open={isInsightOpen} onOpenChange={setIsInsightOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{selectedInsight?.title}</SheetTitle>
                        <p className="text-[12px] text-slate-500">AI projection insight</p>
                    </SheetHeader>
                    {selectedInsight && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-5">
                                <div className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-none">
                                    <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-line">{selectedInsight.full}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-none">
                                        <p className="text-[10px] font-bold text-slate-400 tracking-wider">CONFIDENCE</p>
                                        <p className="text-lg font-bold text-indigo-600 mt-1">92%</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-none">
                                        <p className="text-[10px] font-bold text-slate-400 tracking-wider">UPDATED</p>
                                        <p className="text-lg font-bold text-slate-700 mt-1">2 min ago</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsInsightOpen(false)}>Close</Button>
                                <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={() => { setIsInsightOpen(false); router.push("/client-management/analytics/ai-insights") }}>
                                    <ArrowUpRight className="w-4 h-4 mr-2" /> Open AI insights
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter forecast</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Period</Label>
                            <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="3">Next 3 months</SelectItem>
                                    <SelectItem value="6">Next 6 months</SelectItem>
                                    <SelectItem value="12">Next 12 months</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Scenario</Label>
                            <Select value={scenario} onValueChange={setScenario}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="consv">Conservative</SelectItem>
                                    <SelectItem value="baseline">Baseline</SelectItem>
                                    <SelectItem value="optimistic">Optimistic</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setForecastPeriod("6"); setScenario("baseline"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none text-white" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
