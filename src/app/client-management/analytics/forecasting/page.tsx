"use client"

import { useState, useMemo, useEffect } from "react"
import {
    Plus, Search, RefreshCw, Download, BarChart2,
    TrendingUp, TrendingDown, Calendar, LineChart,
    ArrowUpRight, ArrowDownRight, Target, Brain,
    Sparkles, Zap, Activity, Clock, Sliders,
    ShieldCheck, AlertCircle, Info, X, SlidersHorizontal,
    Settings2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { toast } from "@/shared/utils/toast"
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart
} from 'recharts'
import { motion, AnimatePresence } from "framer-motion"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/shared/components/ui/dialog"
import { Slider } from "@/shared/components/ui/slider"

// Mock data generator for dynamic forecasting
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

export default function ForecastingPage() {
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [forecastPeriod, setForecastPeriod] = useState("6")
    const [scenario, setScenario] = useState("baseline")
    const [growthMod, setGrowthMod] = useState(100) // 100% = 1.0
    const [forecastData, setForecastData] = useState(getForecastData("6", "baseline"))
    const [isParamsOpen, setIsParamsOpen] = useState(false)

    useEffect(() => {
        setForecastData(getForecastData(forecastPeriod, scenario, growthMod / 100))
    }, [forecastPeriod, scenario, growthMod])

    const topStats = useMemo(() => {
        const factor = (scenario === "optimistic" ? 1.2 : scenario === "consv" ? 0.85 : 1.0) * (growthMod / 100)
        return [
            { label: "Year-end projection", value: "$" + (2.1 * factor).toFixed(1) + "M", trend: "+14.2% YoY", trendUp: true, icon: Target, bg: "bg-indigo-50/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-100/50" },
            { label: "Growth sustainability", value: factor < 0.9 ? "Medium" : "High", trend: "+2.1%", trendUp: true, icon: ShieldCheck, bg: "bg-emerald-50/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-100/50" },
            { label: "Churn probability", value: (1.2 / factor).toFixed(1) + "%", trend: "-0.3%", trendUp: true, icon: TrendingDown, bg: "bg-rose-50/50", iconBg: "bg-rose-100", iconColor: "text-rose-600", border: "border-rose-100/50" },
            { label: "Forecast accuracy", value: scenario === "baseline" ? "94.8%" : "91.2%", trend: "+1.2%", trendUp: true, icon: Brain, bg: "bg-violet-50/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-100/50" },
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
        const csv = [
            ["Month", "Baseline Forecast", "Low Range", "High Range"],
            ...forecastData.map(f => [f.month, f.value, f.low, f.high])
        ].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "revenue-forecast.csv"
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Forecast report exported")
    }

    const fmt = (val: number) => {
        if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`
        if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`
        return `$${val.toFixed(0)}`
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-50">
                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">{label}</p>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            <p className="text-[13px] font-bold text-slate-900">
                                Projected: <span className="text-indigo-600">{fmt(payload[0].payload.value)}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-100"></div>
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
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit"
        >
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <motion.div variants={itemVariants}>
                    <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Revenue <span className="text-indigo-600">forecasting</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">AI-powered future projections based on historical growth and churn patterns</p>
                </motion.div>
                <div className="flex items-center gap-3">
                    <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
                        <SelectTrigger className="h-11 w-48 rounded-xl border-slate-200 bg-white font-bold text-slate-700 shadow-sm gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="3">Next 3 months</SelectItem>
                            <SelectItem value="6">Next 6 months</SelectItem>
                            <SelectItem value="12">Next 12 months</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-bold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleRefresh}>
                        <RefreshCw className={`w-4 h-4 text-slate-400 ${isRefreshing ? "animate-spin" : ""}`} /> Run engine
                    </Button>
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-bold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleExport}>
                        <Download className="w-4 h-4 text-slate-400" /> Export
                    </Button>
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {topStats.map((stat, i) => (
                    <motion.div key={i} variants={itemVariants}>
                        <Card className={`${stat.bg} ${stat.border} border shadow-sm hover:shadow-md transition-all rounded-[22px] overflow-hidden`}>
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`h-10 w-10 rounded-[14px] flex items-center justify-center ${stat.iconBg}`}>
                                        <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                                    </div>
                                    <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${stat.trendUp ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"}`}>
                                        {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
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

            {/* Projection Chart Area */}
            <motion.div variants={itemVariants}>
                <Card className="rounded-[28px] border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden h-[520px]">
                    <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                Revenue projection <Sparkles className="w-5 h-5 text-indigo-500" />
                            </CardTitle>
                            <p className="text-xs font-semibold text-slate-400 mt-0.5">Estimated revenue growth for the next {forecastPeriod} months</p>
                        </div>
                        <div className="p-1 bg-slate-50 rounded-xl flex">
                            {["Conservative", "Baseline", "Optimistic"].map((s) => (
                                <Button
                                    key={s}
                                    variant="ghost"
                                    size="sm"
                                    className={`h-9 px-4 rounded-lg font-bold text-[11px] shadow-none transition-all ${(s === "Conservative" && scenario === "consv") ||
                                        (s === "Baseline" && scenario === "baseline") ||
                                        (s === "Optimistic" && scenario === "optimistic")
                                        ? "bg-white shadow-sm text-indigo-600" : "text-slate-400"
                                        }`}
                                    onClick={() => setScenario(s === "Conservative" ? "consv" : s.toLowerCase())}
                                >{s}</Button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="h-[420px] p-8 relative">
                        {isRefreshing && (
                            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-b-[28px]">
                                <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                            </div>
                        )}
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRangeForecast" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.05} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                                    tickFormatter={(val) => fmt(val)}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="high"
                                    stroke="transparent"
                                    fill="url(#colorRangeForecast)"
                                    animationBegin={200}
                                    animationDuration={1500}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="low"
                                    stroke="transparent"
                                    fill="white"
                                    animationBegin={200}
                                    animationDuration={1500}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                    animationBegin={400}
                                    animationDuration={2000}
                                    name="Projected"
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </motion.div>

            {/* AI Insights & Scenario Impact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                    <Card className="rounded-[28px] border-0 shadow-xl shadow-slate-200/50 bg-white p-8 h-full">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600"><Brain className="w-6 h-6" /></div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-900">AI projection summary</h4>
                                <p className="text-[11px] font-medium text-slate-400 italic">Confidence level: 92% • Updated 2 mins ago</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-5 bg-slate-50/50 rounded-2xl flex items-start gap-4 border border-slate-50 hover:border-indigo-100 transition-colors">
                                <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm"><Activity className="w-4 h-4 text-emerald-500" /></div>
                                <p className="text-xs font-semibold text-slate-600 leading-relaxed">Based on current trajectory, we expect a <span className="font-bold text-slate-900">12% increase</span> in revenue by Q4. Expansion from Enterprise clients is the primary driver.</p>
                            </div>
                            <div className="p-5 bg-slate-50/50 rounded-2xl flex items-start gap-4 border border-slate-50 hover:border-indigo-100 transition-colors">
                                <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm"><AlertCircle className="w-4 h-4 text-amber-500" /></div>
                                <p className="text-xs font-semibold text-slate-600 leading-relaxed">A potential churn risk of <span className="font-bold text-slate-900">$24k MRR</span> is detected from aging accounts in the Professional tier.</p>
                            </div>
                            <Button className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-sm text-white shadow-xl shadow-indigo-200/50" onClick={handleRefresh}>
                                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} /> Recalculate models
                            </Button>
                        </div>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="rounded-[28px] border-0 shadow-xl shadow-slate-200/50 bg-white p-8 h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-lg font-bold text-slate-900">Scenario analysis</h4>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 px-3 rounded-xl bg-slate-50 font-bold text-[11px] text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-all gap-1.5"
                                onClick={() => setIsParamsOpen(true)}
                            >
                                <SlidersHorizontal className="w-3.5 h-3.5" /> Adjust params
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
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: s.current }}
                                            transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                            className={`h-full ${s.color} rounded-full`}
                                        ></motion.div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-2">
                            <Info className="w-4 h-4 text-slate-300" />
                            <p className="text-[10px] font-medium text-slate-400 leading-relaxed tracking-tight">Data based on Monte-Carlo simulations with {growthMod}% confidence weighting.</p>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Adjust Params Dialog */}
            <Dialog open={isParamsOpen} onOpenChange={setIsParamsOpen}>
                <DialogContent className="sm:max-w-[450px] rounded-[32px] border-0 shadow-2xl p-0 overflow-hidden font-outfit">
                    <div className="bg-slate-900 h-24 relative flex items-center px-8 text-white">
                        <div className="flex items-center gap-4">
                            <div className="h-11 w-11 rounded-xl bg-indigo-500 flex items-center justify-center">
                                <Settings2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Adjust metrics</h3>
                                <p className="text-indigo-300 text-[10px] font-bold tracking-widest">Growth configuration</p>
                            </div>
                        </div>

                    </div>

                    <div className="p-8 space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <h4 className="text-xs font-bold text-slate-700">Growth multiplier</h4>
                                    <Badge className="bg-indigo-50 text-indigo-600 border-0 rounded-lg">{growthMod}%</Badge>
                                </div>
                                <div className="px-2">
                                    <Slider
                                        defaultValue={[growthMod]}
                                        max={200}
                                        min={50}
                                        step={1}
                                        onValueChange={(val) => setGrowthMod(val[0])}
                                        className="py-4 cursor-pointer"
                                    />
                                </div>
                                <p className="text-[10px] font-medium text-slate-400 px-1 italic">Varies the base assumption of growth for all scenarios.</p>
                            </div>

                            <div className="space-y-4 pt-2">
                                <h4 className="text-[11px] font-bold text-slate-400 tracking-widest px-1">Model variables</h4>
                                {[
                                    { label: "Market volatility", status: "Medium", color: "text-amber-500" },
                                    { label: "Historical accuracy", status: "94.8%", color: "text-emerald-500" },
                                    { label: "Data points", status: "1.2k", color: "text-slate-500" },
                                ].map((v, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="text-xs font-bold text-slate-600">{v.label}</span>
                                        <span className={`text-xs font-bold ${v.color}`}>{v.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 font-bold text-sm shadow-xl shadow-slate-200"
                                onClick={() => {
                                    handleRefresh()
                                    setIsParamsOpen(false)
                                }}
                            >
                                <RefreshCw className="w-4 h-4 mr-2" /> Apply changes
                            </Button>
                            <Button
                                variant="outline"
                                className="h-12 px-6 rounded-xl border-slate-200 font-bold text-sm hover:bg-slate-50 text-slate-600"
                                onClick={() => setIsParamsOpen(false)}
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
