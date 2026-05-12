"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    BarChart3,
    PieChart,
    Activity,
    Users,
    ChevronLeft,
    Filter,
    Download,
    Search,
    Globe,
    Mail,
    Zap,
    Target,
    ArrowUpRight,
    ArrowDownRight,
    ArrowRight,
    RefreshCw
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"

const SOURCE_QUALITY = [
    { source: "Google Ads", count: 1240, avgScore: 68, trend: "up", conversion: "12%" },
    { source: "LinkedIn Outreach", count: 850, avgScore: 72, trend: "up", conversion: "18%" },
    { source: "Capterra / G2", count: 320, avgScore: 54, trend: "down", conversion: "9%" },
    { source: "Direct Traffic", count: 4200, avgScore: 32, trend: "stable", conversion: "4%" },
    { source: "Email Newsletters", count: 1800, avgScore: 45, trend: "up", conversion: "6%" },
]

export default function ScoreDistributionPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [period, setPeriod] = useState("30d")
    const [searchTerm, setSearchTerm] = useState("")
    const [trendFilter, setTrendFilter] = useState("all")

    useEffect(() => {
        setIsClient(true)
    }, [])

    const filteredSources = useMemo(() => {
        return SOURCE_QUALITY.filter(s => {
            const matchSearch = !searchTerm || s.source.toLowerCase().includes(searchTerm.toLowerCase())
            const matchTrend = trendFilter === "all" || s.trend === trendFilter
            return matchSearch && matchTrend
        })
    }, [searchTerm, trendFilter])

    const handleRefresh = () => {
        setIsRefreshing(true)
        toast({ title: "Recalculating Distribution", description: "Analyzing 12.4k lead scores for quality breakdown..." })
        setTimeout(() => {
            setIsRefreshing(false)
            toast({ title: "Distribution Updated", description: "Latest figures are now displayed." })
        }, 1500)
    }

    const handleExport = () => {
        const csvRows = [
            ["Source", "Leads", "Avg Score", "Trend", "Win Probability"],
            ...SOURCE_QUALITY.map(s => [s.source, s.count.toString(), s.avgScore.toString(), s.trend, s.conversion])
        ]
        const csv = csvRows.map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `quality-report-${period}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Export Complete", description: "Quality report downloaded." })
    }

    if (!isClient) return null

    return (
        <div style={{ zoom: 0.9 }} className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header — colorful light fill */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-blue-50 p-6 border border-blue-100 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold uppercase tracking-widest text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white text-blue-600 border border-blue-100">
                                <PieChart className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Lead Quality Distribution
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            Analyze database health with score segmentation. Measure marketing performance by the quality of leads generated.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="h-10 border-slate-200 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5"
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin text-indigo-500' : 'text-slate-400'}`} />
                        {isRefreshing ? "Recalculating..." : "Refresh Stats"}
                    </Button>
                    <Button
                        onClick={handleExport}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none"
                    >
                        <Download className="h-4 w-4 mr-2" /> Export Quality Report
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Distribution Overview Card */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden group">
                        <CardHeader className="p-8 pb-0">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-[18px] font-semibold">Database Quality Breakdown</CardTitle>
                                    <CardDescription className="text-[12px] font-medium text-slate-400">Segmentation of leads based on current scoring rules.</CardDescription>
                                </div>
                                <Select value={period} onValueChange={setPeriod}>
                                    <SelectTrigger className="w-[140px] h-9 border-slate-100 text-[11px] font-semibold rounded-lg shadow-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="30d">Last 30 Days</SelectItem>
                                        <SelectItem value="90d">Last 90 Days</SelectItem>
                                        <SelectItem value="all">All Time</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-4">
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-[13px] font-semibold">
                                            <span className="text-rose-500">Low Quality (0-30)</span>
                                            <span className="text-slate-500">42%</span>
                                        </div>
                                        <Progress value={42} className="h-3 bg-slate-50 [&>div]:bg-rose-500" />
                                        <p className="text-[11px] font-medium text-slate-400">5,200 leads in this band.</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-[13px] font-semibold">
                                            <span className="text-amber-500">Neutral (31-60)</span>
                                            <span className="text-slate-500">38%</span>
                                        </div>
                                        <Progress value={38} className="h-3 bg-slate-50 [&>div]:bg-amber-500" />
                                        <p className="text-[11px] font-medium text-slate-400">4,710 leads in this band.</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-[13px] font-semibold">
                                            <span className="text-emerald-500">High Quality (61+)</span>
                                            <span className="text-slate-500">20%</span>
                                        </div>
                                        <Progress value={20} className="h-3 bg-slate-50 [&>div]:bg-emerald-500" />
                                        <p className="text-[11px] font-medium text-slate-400">2,480 leads in this band.</p>
                                    </div>
                                </div>

                                <div className="md:col-span-2 relative flex items-center justify-center min-h-[250px] bg-slate-50/50 border border-dashed border-slate-200">
                                    <div className="flex flex-col items-center gap-3">
                                        <BarChart3 size={40} className="text-slate-200" />
                                        <p className="text-[12px] font-semibold text-slate-400">Detailed Trend Visualization</p>
                                        <Badge variant="outline" className="border-slate-100 text-slate-300 font-semibold text-[9px] uppercase px-2">Simulation Mode</Badge>
                                    </div>
                                    <div className="absolute inset-x-8 bottom-8 h-32 flex items-end gap-2 opacity-10">
                                        {[40, 70, 45, 90, 65, 30, 85, 50, 75, 60].map((h, i) => (
                                            <div key={i} className="flex-1 bg-indigo-500 rounded-t-lg" style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quality by Source Table */}
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden">
                        <CardHeader className="p-6 border-b border-slate-50">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <CardTitle className="text-[16px] font-semibold">Source vs Quality Index</CardTitle>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            placeholder="Search sources..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-9 h-10 w-[220px] border-slate-100 bg-white text-[13px] rounded-lg focus-visible:ring-indigo-500"
                                        />
                                    </div>
                                    <Select value={trendFilter} onValueChange={setTrendFilter}>
                                        <SelectTrigger className="w-[140px] h-10 border-slate-100 bg-white font-semibold text-[12px] rounded-lg">
                                            <Filter className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Trends</SelectItem>
                                            <SelectItem value="up">Trending Up</SelectItem>
                                            <SelectItem value="down">Trending Down</SelectItem>
                                            <SelectItem value="stable">Stable</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-4 text-left text-[11px] font-semibold text-slate-400 tracking-wider">Source Name</th>
                                        <th className="px-8 py-4 text-center text-[11px] font-semibold text-slate-400 tracking-wider">Leads</th>
                                        <th className="px-8 py-4 text-center text-[11px] font-semibold text-slate-400 tracking-wider">Avg Quality</th>
                                        <th className="px-8 py-4 text-right text-[11px] font-semibold text-slate-400 tracking-wider">Win Prob.</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredSources.length === 0 ? (
                                        <tr><td colSpan={4} className="px-8 py-10 text-center text-[12px] font-semibold text-slate-400">No sources match your filters.</td></tr>
                                    ) : filteredSources.map((s, i) => (
                                        <tr key={i} className="group hover:bg-slate-50/30 transition-all">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-white border border-slate-100 shadow-sm">
                                                        {s.source.includes("Ads") ? <Target size={14} className="text-blue-500" /> :
                                                            s.source.includes("Direct") ? <Globe size={14} className="text-slate-400" /> :
                                                                <Mail size={14} className="text-indigo-500" />}
                                                    </div>
                                                    <span className="text-[13px] font-semibold text-slate-700">{s.source}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-center text-[13px] font-semibold text-slate-600 tabular-nums">{s.count.toLocaleString()}</td>
                                            <td className="px-8 py-5 text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <span className="text-[14px] font-semibold text-slate-900 tabular-nums">{s.avgScore}</span>
                                                    {s.trend === 'up' ? <ArrowUpRight size={14} className="text-emerald-500" /> :
                                                        s.trend === 'down' ? <ArrowDownRight size={14} className="text-rose-500" /> : null}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <Badge className={`${parseInt(s.conversion) > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'} border-none px-2 h-6 font-semibold`}>
                                                    {s.conversion}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>

                {/* DB Health Summary Side */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-emerald-50 overflow-hidden">
                        <CardHeader className="p-6 border-b border-emerald-100">
                            <CardTitle className="text-[16px] font-semibold text-slate-900">Health Indicators</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6 bg-white">
                            <div className="p-5 bg-indigo-50 text-slate-900 border border-indigo-100 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-white">
                                        <Zap size={18} className="text-indigo-600" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">Ready to Work</p>
                                        <h4 className="text-[18px] font-semibold tracking-tight text-slate-900">842 <span className="text-[10px] font-semibold text-emerald-500">Abv. Threshold</span></h4>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => toast({ title: "Sent to Outreach", description: "842 leads pushed into the outreach queue." })}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[12px] h-9 border-none"
                                >
                                    Send to Outreach
                                </Button>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-[12px] font-semibold text-slate-600">Model Sensitivity</span>
                                    <span className="text-[12px] font-semibold text-slate-900">Medium</span>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { label: "Data Completeness", val: 82 },
                                        { label: "Phone Verification", val: 54 },
                                        { label: "Domain Accuracy", val: 92 },
                                    ].map((m, i) => (
                                        <div key={i} className="space-y-1.5">
                                            <div className="flex justify-between text-[10px] font-semibold text-slate-400 tracking-wider">
                                                <span>{m.label}</span>
                                                <span>{m.val}%</span>
                                            </div>
                                            <Progress value={m.val} className="h-1.5 bg-slate-50" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-indigo-100 rounded-none bg-indigo-50 text-slate-900 p-6 space-y-4">
                        <div className="p-3 bg-white border border-indigo-100 text-indigo-600 shadow-sm w-fit">
                            <Activity size={24} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[16px] font-semibold">Distribution Decay</h4>
                            <p className="text-[12px] text-slate-600 font-semibold leading-relaxed">
                                Leads from "Events" decay 2x faster than SEO leads. System has automated a 14-day re-engagement trigger.
                            </p>
                        </div>
                        <div className="pt-2">
                            <Button
                                variant="ghost"
                                onClick={() => toast({ title: "Decay Logic", description: "Opening decay configuration..." })}
                                className="p-0 h-auto text-[11px] font-semibold uppercase tracking-widest text-indigo-600 hover:bg-transparent hover:translate-x-1 transition-transform"
                            >
                                View Decay Logic <ArrowUpRight size={14} className="ml-1.5" />
                            </Button>
                        </div>
                    </Card>
                </div>

            </div>

        </div>
    )
}
