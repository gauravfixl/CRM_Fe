"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    RefreshCw, Download,
    TrendingUp, Users,
    ArrowUpRight, ArrowDownRight,
    Target, Zap,
    Database, Filter,
    Table as TableIcon, DollarSign, ListFilter
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { toast } from "@/shared/utils/toast"

const getCohortData = (type: string, metric: string) => {
    const months = ["Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024", "May 2024", "Jun 2024"]
    const factor = type === "quarterly" ? 1.5 : type === "source" ? 0.8 : 1.0
    const metricBase = metric === "revenue" ? 100 : 100

    return months.map((m, i) => {
        const size = Math.floor((100 + Math.random() * 100) * factor)
        const row = []
        for (let j = 0; j < (6 - i); j++) {
            const val = metric === "retention"
                ? Math.max(70, metricBase - (j * (5 + Math.random() * 5)))
                : metricBase + (j * (Math.random() * 5))
            row.push(Math.round(val))
        }
        return { cohort: m, size, months: row }
    })
}

export default function CohortAnalysisPage() {
    const router = useRouter()
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [viewMetric, setViewMetric] = useState("retention")
    const [cohortType, setCohortType] = useState("monthly")
    const [cohortData, setCohortData] = useState(getCohortData("monthly", "retention"))

    const [isInsightOpen, setIsInsightOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [selectedInsight, setSelectedInsight] = useState<any>(null)

    useEffect(() => {
        setCohortData(getCohortData(cohortType, viewMetric))
    }, [cohortType, viewMetric])

    const topStats = useMemo(() => {
        const factor = cohortType === "quarterly" ? 1.1 : 1.0
        return [
            { label: "Avg cohort retention", value: (88.4 * factor).toFixed(1) + "%", trend: "+2.4%", trendUp: true, icon: Users, bg: "bg-indigo-50/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-100", path: "/client-management/analytics/retention" },
            { label: "Revenue expansion", value: (18.2 * factor).toFixed(1) + "%", trend: "+1.5%", trendUp: true, icon: TrendingUp, bg: "bg-emerald-50/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-100", path: "/client-management/revenue/expansion" },
            { label: "Power user index", value: "64.1%", trend: "-0.8%", trendUp: false, icon: Zap, bg: "bg-violet-50/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-100", path: "/client-management/customers" },
            { label: "Churn threshold", value: "4.2%", trend: "-0.5%", trendUp: true, icon: Target, bg: "bg-amber-50/50", iconBg: "bg-amber-100", iconColor: "text-amber-600", border: "border-amber-100", path: "/client-management/analytics/forecasting" },
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
        toast.success("Report exported")
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
            if (val >= 110) return "bg-emerald-600 text-white"
            if (val >= 105) return "bg-emerald-500 text-white"
            if (val >= 100) return "bg-emerald-400 text-white"
            if (val >= 95) return "bg-emerald-300 text-slate-800"
            return "bg-emerald-50 text-slate-500"
        }
    }

    const insightCards = [
        {
            id: "ins-momentum",
            title: "Cohort sign-up momentum",
            description: "The June 2024 cohort shows 12% higher day-1 retention compared to the annual average.",
            fullText: "Cohort momentum analysis: The June 2024 sign-up cohort retained 100% of its users on day 1, beating the historical average of 88% by 12 percentage points. This unusual lift coincided with the v3.2 onboarding revamp and the introduction of the guided product tour. Recommended actions: (1) preserve current onboarding flow, (2) extend tour-style guidance to advanced features, (3) replicate signup campaigns that delivered this cohort.",
            icon: TrendingUp,
            badge: "Top performance",
            badgeColor: "bg-emerald-50 text-emerald-600",
            iconBg: "bg-indigo-50 text-indigo-600",
        },
        {
            id: "ins-expansion",
            title: "Revenue expansion cohort",
            description: "March 2024 cohort has reached a 115% expansion rate due to Enterprise plan upgrades.",
            fullText: "Revenue expansion analysis: The March 2024 cohort has reached a net revenue expansion of 115% at month 4, driven primarily by 8 mid-market accounts upgrading to Enterprise tier within their first 90 days. The cohort's growth rate of +15.2% is 2.4x higher than the Q1 average. Maximum lifetime value observed in this cohort is $8.4k, with Enterprise (72%), Professional (45%), and Starter (18%) all showing expansion. Recommended: target similar SMB segments with proactive upgrade outreach at the 60-day mark.",
            icon: Database,
            badge: "View details",
            badgeColor: "bg-amber-50 text-amber-600",
            iconBg: "bg-amber-50 text-amber-600",
        },
    ]

    const openInsight = (insight: any) => {
        setSelectedInsight(insight)
        setIsInsightOpen(true)
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Cohort <span className="text-indigo-600">analysis</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Analyze user behavior and retention patterns by sign-up period</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <Select value={cohortType} onValueChange={(v) => { setCohortType(v); toast.success("Cohort type updated") }}>
                        <SelectTrigger className="h-11 w-48 rounded-none border-slate-200 bg-white font-bold text-slate-700 shadow-sm gap-2">
                            <ListFilter className="w-4 h-4 text-slate-400" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="monthly">Monthly cohort</SelectItem>
                            <SelectItem value="quarterly">Quarterly cohort</SelectItem>
                            <SelectItem value="source">Source cohort</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="h-11 px-5 rounded-none border-slate-200 bg-white font-bold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="w-4 h-4 text-slate-400" /> Filter
                    </Button>
                    <Button variant="outline" className="h-11 px-5 rounded-none border-slate-200 bg-white font-bold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleRefresh}>
                        <RefreshCw className={`w-4 h-4 text-slate-400 ${isRefreshing ? "animate-spin" : ""}`} /> Refresh
                    </Button>
                    <Button variant="outline" className="h-11 px-5 rounded-none border-slate-200 bg-white font-bold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleExport}>
                        <Download className="w-4 h-4 text-slate-400" /> Export
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
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

            {/* Cohort Matrix */}
            <Card className="rounded-none border border-slate-100 shadow-sm bg-white overflow-hidden">
                <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-lg font-bold text-slate-900">{viewMetric === "retention" ? "Retention" : "Revenue"} matrix</CardTitle>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">Heatmap of {viewMetric === "retention" ? "user retention" : "revenue expansion"} over selected months</p>
                    </div>
                    <div className="flex items-center p-1 bg-slate-50 rounded-none">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-9 px-4 rounded-none font-bold text-[11px] shadow-none transition-all ${viewMetric === "retention" ? "bg-white shadow-sm text-indigo-600" : "text-slate-400"}`}
                            onClick={() => setViewMetric("retention")}
                        >
                            <TableIcon className="w-3.5 h-3.5 mr-2" />
                            Retention
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-9 px-4 rounded-none font-bold text-[11px] shadow-none transition-all ${viewMetric === "revenue" ? "bg-white shadow-sm text-emerald-600" : "text-slate-400"}`}
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
                            <tbody>
                                {cohortData.map((c) => (
                                    <tr key={c.cohort}>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-none bg-indigo-50 flex items-center justify-center text-indigo-600 text-[10px] font-bold border border-indigo-100">{c.cohort.substring(0, 3)}</div>
                                                <span className="text-[13px] font-bold text-slate-700 whitespace-nowrap">{c.cohort}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="text-[12px] font-semibold text-slate-500">{c.size}</span>
                                        </td>
                                        {c.months.map((m, j) => (
                                            <td key={j} className="p-0.5">
                                                <div
                                                    className={`h-11 flex items-center justify-center rounded-none text-xs font-bold transition-all hover:scale-[1.02] cursor-pointer shadow-sm ${getHeatmapColor(m)}`}
                                                    onClick={() => toast.info(`Cohort ${c.cohort}: ${m}% ${viewMetric} at month ${j}`)}
                                                >
                                                    {m}%
                                                </div>
                                            </td>
                                        ))}
                                        {Array.from({ length: 6 - c.months.length }).map((_, j) => (
                                            <td key={j} className="p-0.5">
                                                <div className="h-11 flex items-center justify-center rounded-none bg-slate-50/50 text-[10px] text-slate-200">
                                                    -
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Insight Cards (clickable) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {insightCards.map((card) => {
                    const Icon = card.icon
                    return (
                        <Card
                            key={card.id}
                            className="rounded-none border border-slate-100 shadow-sm bg-white p-8 h-full cursor-pointer hover:shadow-md transition"
                            onClick={() => openInsight(card)}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className={`h-12 w-12 rounded-none flex items-center justify-center ${card.iconBg}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <Badge className={`${card.badgeColor} border-0 rounded-none px-2 py-1 text-[10px] font-bold`}>{card.badge}</Badge>
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h4>
                            <p className="text-sm font-medium text-slate-400 mb-6">{card.description}</p>
                            {card.id === "ins-momentum" ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-700">June 2024</span>
                                        <span className="text-[10px] font-bold text-slate-400">100% Ret</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-50 overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: "100%" }}></div></div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-700">Average</span>
                                        <span className="text-[10px] font-bold text-slate-400">88% Ret</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-50 overflow-hidden"><div className="h-full bg-slate-300" style={{ width: "88%" }}></div></div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-slate-50/50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1 uppercase">Growth rate</p>
                                        <p className="text-xl font-bold text-emerald-600">+15.2%</p>
                                    </div>
                                    <div className="p-5 bg-slate-50/50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1 uppercase">Max ltv</p>
                                        <p className="text-xl font-bold text-indigo-600">$8.4k</p>
                                    </div>
                                </div>
                            )}
                        </Card>
                    )
                })}
            </div>

            {/* Insight Detail Sheet */}
            <Sheet open={isInsightOpen} onOpenChange={setIsInsightOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-amber-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{selectedInsight?.title}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Cohort insight detail</p>
                    </SheetHeader>
                    {selectedInsight && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-5">
                                <div className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-none">
                                    <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-line">{selectedInsight.fullText}</p>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <h4 className="text-[11px] font-bold text-slate-400 tracking-widest border-b border-slate-100 pb-2">EXPANSION BY TIER</h4>
                                    {[
                                        { label: "Enterprise", val: "72%", color: "bg-indigo-500", revenue: "+$4.2k" },
                                        { label: "Professional", val: "45%", color: "bg-emerald-500", revenue: "+$1.8k" },
                                        { label: "Starter", val: "18%", color: "bg-amber-400", revenue: "+$0.4k" },
                                    ].map((item, i) => (
                                        <div key={i} className="space-y-2 pt-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[12px] font-bold text-slate-700">{item.label}</span>
                                                <span className="text-[11px] font-bold text-slate-900">{item.revenue}</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-50 overflow-hidden">
                                                <div style={{ width: item.val }} className={`h-full ${item.color}`}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 bg-slate-50 rounded-none border border-slate-100 flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-none bg-white flex items-center justify-center shadow-sm">
                                        <Zap className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Expansion velocity</p>
                                        <p className="text-[11px] font-medium text-slate-500">Upgrade rate is 2.4x higher than Q1 average.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsInsightOpen(false)}>Close</Button>
                                <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={() => { setIsInsightOpen(false); router.push("/client-management/analytics/forecasting") }}>
                                    <ArrowUpRight className="w-4 h-4 mr-2" /> Open forecast
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
                        <SheetTitle className="text-[18px] font-semibold">Filter cohorts</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Cohort type</Label>
                            <Select value={cohortType} onValueChange={setCohortType}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="monthly">Monthly cohort</SelectItem>
                                    <SelectItem value="quarterly">Quarterly cohort</SelectItem>
                                    <SelectItem value="source">Source cohort</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Metric</Label>
                            <Select value={viewMetric} onValueChange={setViewMetric}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="retention">Retention</SelectItem>
                                    <SelectItem value="revenue">Revenue</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setCohortType("monthly"); setViewMetric("retention"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none text-white" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
