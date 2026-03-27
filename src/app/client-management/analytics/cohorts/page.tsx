"use client"

import { useState, useMemo, useEffect } from "react"
import {
    Plus, Search, RefreshCw, Download, Layers,
    TrendingUp, TrendingDown, Users, Calendar,
    BarChart3, LineChart, ArrowUpRight, ArrowDownRight,
    Target, Grid, Filter, Database, Zap,
    HelpCircle, ChevronDown, ListFilter,
    Table, LayoutGrid, DollarSign, X, ExternalLink,
    PieChart, Activity
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

// Mock data generator for Cohorts
const getCohortData = (type: string, metric: string) => {
    const months = ["Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024", "May 2024", "Jun 2024"]
    const factor = type === "quarterly" ? 1.5 : type === "source" ? 0.8 : 1.0
    const metricBase = metric === "revenue" ? 100 : 100

    return months.map((m, i) => {
        const size = Math.floor((100 + Math.random() * 100) * factor)
        const row = []
        for (let j = 0; j < (6 - i); j++) {
            // Retention naturally decays, Revenue might expand
            const val = metric === "retention"
                ? Math.max(70, metricBase - (j * (5 + Math.random() * 5)))
                : metricBase + (j * (Math.random() * 5))
            row.push(Math.round(val))
        }
        return { cohort: m, size, months: row }
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

export default function CohortAnalysisPage() {
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [viewMetric, setViewMetric] = useState("retention") // retention or revenue
    const [cohortType, setCohortType] = useState("monthly")
    const [cohortData, setCohortData] = useState(getCohortData("monthly", "retention"))
    const [isReportOpen, setIsReportOpen] = useState(false)

    useEffect(() => {
        setCohortData(getCohortData(cohortType, viewMetric))
    }, [cohortType, viewMetric])

    const topStats = useMemo(() => {
        const factor = cohortType === "quarterly" ? 1.1 : 1.0
        return [
            { label: "Avg cohort retention", value: (88.4 * factor).toFixed(1) + "%", trend: "+2.4%", trendUp: true, icon: Users, bg: "bg-indigo-50/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-100/50" },
            { label: "Revenue expansion", value: (18.2 * factor).toFixed(1) + "%", trend: "+1.5%", trendUp: true, icon: TrendingUp, bg: "bg-emerald-50/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-100/50" },
            { label: "Power user index", value: "64.1%", trend: "-0.8%", trendUp: false, icon: Zap, bg: "bg-violet-50/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-100/50" },
            { label: "Churn threshold", value: "4.2%", trend: "-0.5%", trendUp: true, icon: Target, bg: "bg-amber-50/50", iconBg: "bg-amber-100", iconColor: "text-amber-600", border: "border-amber-100/50" },
        ]
    }, [cohortType])

    const handleRefresh = () => {
        setIsRefreshing(true)
        toast.promise(new Promise(r => setTimeout(r, 1500)), {
            loading: "Generating cohort matrix...",
            success: "Heatmap updated with latest signups",
            error: "Failed to recalculate cohorts"
        })
        setTimeout(() => {
            setCohortData(getCohortData(cohortType, viewMetric))
            setIsRefreshing(false)
        }, 1500)
    }

    const handleExport = () => {
        const csv = [
            ["Cohort", "Size", "Month 0", "Month 1", "Month 2", "Month 3", "Month 4", "Month 5"],
            ...cohortData.map(c => [c.cohort, c.size, ...c.months])
        ].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "cohort-analysis.csv"
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Cohort data exported successfully")
    }

    const getHeatmapColor = (val: number) => {
        if (viewMetric === "retention") {
            if (val >= 95) return "bg-indigo-600 text-white"
            if (val >= 90) return "bg-indigo-500 text-white"
            if (val >= 85) return "bg-indigo-400 text-white"
            if (val >= 80) return "bg-indigo-300 text-slate-800"
            if (val >= 70) return "bg-indigo-200 text-slate-800"
            return "bg-indigo-50 text-slate-500"
        } else {
            // Revenue expansion colors (Greens)
            if (val >= 110) return "bg-emerald-600 text-white"
            if (val >= 105) return "bg-emerald-500 text-white"
            if (val >= 100) return "bg-emerald-400 text-white"
            if (val >= 95) return "bg-emerald-300 text-slate-800"
            return "bg-emerald-50 text-slate-500"
        }
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
                    <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Cohort <span className="text-indigo-600">analysis</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Analyze user behavior and retention patterns by sign-up period</p>
                </motion.div>
                <div className="flex items-center gap-3">
                    <Select value={cohortType} onValueChange={setCohortType}>
                        <SelectTrigger className="h-11 w-48 rounded-xl border-slate-200 bg-white font-bold text-slate-700 shadow-sm gap-2">
                            <ListFilter className="w-4 h-4 text-slate-400" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="monthly">Monthly cohort</SelectItem>
                            <SelectItem value="quarterly">Quarterly cohort</SelectItem>
                            <SelectItem value="source">Source cohort</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-bold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleRefresh}>
                        <RefreshCw className={`w-4 h-4 text-slate-400 ${isRefreshing ? "animate-spin" : ""}`} /> Refresh
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

            {/* Cohort Matrix Chart Area */}
            <motion.div variants={itemVariants}>
                <Card className="rounded-[28px] border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                    <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-900">Retention matrix</CardTitle>
                            <p className="text-xs font-semibold text-slate-400 mt-0.5">Heatmap of user retention over selected months</p>
                        </div>
                        <div className="flex items-center p-1 bg-slate-50 rounded-xl">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`h-9 px-4 rounded-lg font-bold text-[11px] shadow-none transition-all ${viewMetric === "retention" ? "bg-white shadow-sm text-indigo-600" : "text-slate-400"}`}
                                onClick={() => setViewMetric("retention")}
                            >
                                <Table className="w-3.5 h-3.5 mr-2" />
                                Retention
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`h-9 px-4 rounded-lg font-bold text-[11px] shadow-none transition-all ${viewMetric === "revenue" ? "bg-white shadow-sm text-emerald-600" : "text-slate-400"}`}
                                onClick={() => setViewMetric("revenue")}
                            >
                                <DollarSign className="w-3.5 h-3.5 mr-2" />
                                Revenue
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="overflow-x-auto">
                            <table className="w-full border-separate border-spacing-1">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-[11px] font-bold text-slate-400 text-left tracking-wider">Cohort</th>
                                        <th className="px-4 py-3 text-[11px] font-bold text-slate-400 text-left tracking-wider">Size</th>
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <th key={i} className="px-4 py-3 text-[11px] font-bold text-slate-400 text-center tracking-wider whitespace-nowrap">Month {i}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="">
                                    <AnimatePresence mode="popLayout">
                                        {cohortData.map((c, i) => (
                                            <motion.tr
                                                key={c.cohort}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                            >
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 text-[10px] font-bold">{c.cohort.substring(0, 3)}</div>
                                                        <span className="text-[13px] font-bold text-slate-700 whitespace-nowrap">{c.cohort}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className="text-[12px] font-semibold text-slate-500">{c.size}</span>
                                                </td>
                                                {c.months.map((m, j) => (
                                                    <td key={j} className="p-0.5">
                                                        <div className={`h-11 flex items-center justify-center rounded-lg text-xs font-bold transition-all hover:scale-[1.02] cursor-pointer shadow-sm ${getHeatmapColor(m)}`} onClick={() => toast.info(`Cohort ${c.cohort}: ${m}% retention at month ${j}`)}>
                                                            {m}%
                                                        </div>
                                                    </td>
                                                ))}
                                                {/* Empty cells for triangle effect */}
                                                {Array.from({ length: 6 - c.months.length }).map((_, j) => (
                                                    <td key={j} className="p-0.5">
                                                        <div className="h-11 flex items-center justify-center rounded-lg bg-slate-50/50 text-[10px] text-slate-200">
                                                            -
                                                        </div>
                                                    </td>
                                                ))}
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Bottom Analysis Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                    <Card className="rounded-[28px] border-0 shadow-xl shadow-slate-200/50 bg-white p-8 h-full">
                        <div className="flex items-center justify-between mb-6">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600"><TrendingUp className="w-6 h-6" /></div>
                            <Badge className="bg-emerald-50 text-emerald-600 border-0 rounded-lg px-2 py-1 text-[10px] font-bold">Top performance</Badge>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">Cohort sign-up momentum</h4>
                        <p className="text-sm font-medium text-slate-400 mb-6">The June 2024 cohort shows 12% higher day-1 retention compared to the annual average.</p>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700">June 2024</span>
                                <span className="text-[10px] font-bold text-slate-400">100% Ret</span>
                            </div>
                            <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    className="h-full bg-indigo-500 rounded-full"
                                ></motion.div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700">Average</span>
                                <span className="text-[10px] font-bold text-slate-400">88% Ret</span>
                            </div>
                            <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "88%" }}
                                    className="h-full bg-slate-300 rounded-full"
                                ></motion.div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="rounded-[28px] border-0 shadow-xl shadow-slate-200/50 bg-white p-8 h-full">
                        <div className="flex items-center justify-between mb-6">
                            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600"><Database className="w-6 h-6" /></div>
                            <Button variant="ghost" size="sm" className="h-9 rounded-xl font-bold text-xs text-indigo-600 hover:bg-indigo-50" onClick={() => setIsReportOpen(true)}>See report</Button>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">Revenue expansion cohort</h4>
                        <p className="text-sm font-medium text-slate-400 mb-6">March 2024 cohort has reached a 115% expansion rate due to Enterprise plan upgrades.</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors">
                                <p className="text-[11px] font-bold text-slate-400 mb-1 uppercase">Growth rate</p>
                                <p className="text-xl font-bold text-emerald-600">+15.2%</p>
                            </div>
                            <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors">
                                <p className="text-[11px] font-bold text-slate-400 mb-1 uppercase">Max ltv</p>
                                <p className="text-xl font-bold text-indigo-600">$8.4k</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Report Dialog */}
            <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-[32px] border-0 shadow-2xl p-0 overflow-hidden font-outfit">
                    <div className="bg-amber-500 h-24 relative flex items-center px-8 text-white">
                        <div className="flex items-center gap-4">
                            <div className="h-11 w-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <Database className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Expansion report</h3>
                                <p className="text-amber-100 text-[10px] font-bold tracking-widest">March 2024 deep dive</p>
                            </div>
                        </div>

                    </div>

                    <div className="p-8 space-y-7">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[11px] font-bold text-slate-400 tracking-widest">Expansion by tier</h4>
                                <Badge className="bg-emerald-50 text-emerald-600 border-0 rounded-lg text-[10px] font-bold">+15.2% Overall</Badge>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: "Enterprise", val: "72%", color: "bg-indigo-500", revenue: "+$4.2k" },
                                    { label: "Professional", val: "45%", color: "bg-emerald-500", revenue: "+$1.8k" },
                                    { label: "Starter", val: "18%", color: "bg-amber-400", revenue: "+$0.4k" },
                                ].map((item, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[13px] font-bold text-slate-700">{item.label}</span>
                                            <span className="text-[11px] font-bold text-slate-900">{item.revenue}</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: item.val }}
                                                className={`h-full ${item.color} rounded-full`}
                                            ></motion.div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                <Zap className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-900">Expansion velocity</p>
                                <p className="text-[11px] font-medium text-slate-500">Upgrade rate is 2.4x higher than Q1 average.</p>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                className="flex-1 h-12 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold text-sm shadow-xl shadow-amber-100"
                                onClick={() => {
                                    toast.success("Downloading full report...")
                                    handleExport()
                                }}
                            >
                                <Download className="w-4 h-4 mr-2" /> Download details
                            </Button>
                            <Button
                                variant="outline"
                                className="h-12 px-6 rounded-xl border-slate-200 font-bold text-sm hover:bg-slate-50"
                                onClick={() => setIsReportOpen(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}
