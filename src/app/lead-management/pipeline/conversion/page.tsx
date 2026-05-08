"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    ResponsiveContainer,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
    ComposedChart,
    Line
} from "recharts"
import {
    TrendingUp,
    ChevronLeft,
    Download,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    Filter,
    Activity,
    Target,
    MousePointer2
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { useToast } from "@/shared/components/ui/use-toast"
import { Input } from "@/shared/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/shared/components/ui/popover"
import { usePipelineData } from "@/shared/hooks/use-pipeline-data"

const CONVERSION_TREND_DATA = [
    { name: 'Jan', rate: 12, leads: 400, wins: 48 },
    { name: 'Feb', rate: 15, leads: 450, wins: 67 },
    { name: 'Mar', rate: 14, leads: 500, wins: 70 },
    { name: 'Apr', rate: 18, leads: 480, wins: 86 },
    { name: 'May', rate: 22, leads: 520, wins: 114 },
    { name: 'Jun', rate: 20, leads: 550, wins: 110 },
]

const STAGE_TRENDS = [
    { stage: 'Lead In → Disc', current: '75%', prev: '68%', status: 'up' },
    { stage: 'Disc → Qual', current: '72%', prev: '75%', status: 'down' },
    { stage: 'Qual → Proposal', current: '85%', prev: '80%', status: 'up' },
    { stage: 'Proposal → Win', current: '62%', prev: '58%', status: 'up' },
]

const WIN_LOSS_DATA = [
    { name: 'Week 1', win: 40, loss: 20 },
    { name: 'Week 2', win: 45, loss: 25 },
    { name: 'Week 3', win: 35, loss: 30 },
    { name: 'Week 4', win: 55, loss: 15 },
]

export default function ConversionTrendsPage() {
    const { leads } = usePipelineData()
    const { toast } = useToast()
    const router = useRouter()
    const [period, setPeriod] = useState("6mo")
    const [viewMode, setViewMode] = useState<'percentage' | 'absolute'>('percentage')
    const [isExporting, setIsExporting] = useState(false)

    // Filters
    const [filterOpen, setFilterOpen] = useState(false)
    const [trendFilter, setTrendFilter] = useState<'all' | 'up' | 'down'>('all')
    const [minRate, setMinRate] = useState("")

    const filteredStageTrends = useMemo(() => {
        return STAGE_TRENDS.filter(t => {
            if (trendFilter !== "all" && t.status !== trendFilter) return false
            if (minRate) {
                const m = parseInt(minRate) || 0
                const r = parseInt(t.current.replace("%", "")) || 0
                if (r < m) return false
            }
            return true
        })
    }, [trendFilter, minRate])

    const activeFilterCount = (trendFilter !== "all" ? 1 : 0) + (minRate ? 1 : 0)

    const totalLeads = leads.length
    const wonLeads = leads.filter(l => l.stage === 'won').length
    const lostLeads = leads.filter(l => l.stage === 'lost').length
    const winRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) + "%" : "0%"
    const dropOffRate = totalLeads > 0 ? ((lostLeads / totalLeads) * 100).toFixed(1) + "%" : "0%"

    const handleExport = () => {
        setIsExporting(true)
        setTimeout(() => {
            const headers = ["Month", "Rate (%)", "Leads", "Wins"]
            const rows = CONVERSION_TREND_DATA.map(d => [d.name, d.rate.toString(), d.leads.toString(), d.wins.toString()])
            const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.setAttribute("href", url)
            link.setAttribute("download", `Conversion_Trends_${period}_${new Date().toISOString().split('T')[0]}.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            setIsExporting(false)
            toast({
                title: "Data Exported",
                description: "Conversion trend datasets have been prepared and downloaded.",
            })
        }, 800)
    }

    const handlePeriodChange = (val: string) => {
        setPeriod(val)
        toast({
            title: "Period Updated",
            description: "Analytics engine is recalculating trends for the selected lifecycle.",
        })
    }

    const handleClearFilters = () => {
        setTrendFilter("all")
        setMinRate("")
        setFilterOpen(false)
    }

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500" style={{ zoom: 0.9 }}>

            {/* Structural Header (light indigo) */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-indigo-50 p-4 rounded-none border border-indigo-100 shadow-sm">
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/lead-management/pipeline/board')}
                        className="-ml-2 h-7 text-[10px] font-medium text-slate-500 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back to Pipeline
                    </Button>
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-none bg-white text-indigo-600 border border-indigo-100">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                            <h1 className="text-[20px] font-bold tracking-tight text-slate-900">
                                Conversion Trends
                            </h1>
                        </div>
                        <p className="text-[12px] text-slate-600 font-medium max-w-xl">
                            Longitudinal analysis of funnel efficiency and winning patterns over time.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <Select value={period} onValueChange={handlePeriodChange}>
                        <SelectTrigger className="w-[160px] h-10 border-slate-200 font-medium text-[12px] bg-white rounded-none">
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1mo">Last Month</SelectItem>
                            <SelectItem value="3mo">Last Quarter</SelectItem>
                            <SelectItem value="6mo">Last 6 Months</SelectItem>
                            <SelectItem value="year">Full Year</SelectItem>
                        </SelectContent>
                    </Select>

                    <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="h-10 border-slate-200 text-slate-600 font-medium bg-white px-4 rounded-none relative">
                                <Filter className="h-4 w-4 mr-2 text-slate-400" /> Filters
                                {activeFilterCount > 0 && (
                                    <Badge className="ml-2 bg-indigo-600 text-white border-none h-5 px-1.5 text-[10px] rounded-none">
                                        {activeFilterCount}
                                    </Badge>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 p-4 rounded-none border-slate-200 shadow-xl">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[13px] font-semibold">Stage ∆ Filters</h4>
                                    <button
                                        type="button"
                                        onClick={handleClearFilters}
                                        className="text-[11px] font-medium text-indigo-600 hover:underline"
                                    >
                                        Clear
                                    </button>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase text-slate-500">Trend</label>
                                    <Select value={trendFilter} onValueChange={(v) => setTrendFilter(v as any)}>
                                        <SelectTrigger className="h-9 rounded-none border-slate-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Stages</SelectItem>
                                            <SelectItem value="up">Improving</SelectItem>
                                            <SelectItem value="down">Declining</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase text-slate-500">Min Current Rate (%)</label>
                                    <Input
                                        name="minRate"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={minRate}
                                        onChange={(e) => setMinRate(e.target.value)}
                                        placeholder="0-100"
                                        className="h-9 rounded-none border-slate-200"
                                    />
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Button
                        variant="outline"
                        onClick={handleExport}
                        disabled={isExporting}
                        className="h-10 border-slate-200 text-slate-600 font-medium bg-white px-4 rounded-none disabled:opacity-50"
                    >
                        <Download className="h-4 w-4 mr-2 text-slate-400" /> {isExporting ? "Exporting..." : "Export CSV"}
                    </Button>
                </div>
            </div>

            {/* Core Trend Stats (colorful) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Pipeline win rate", val: winRate, trend: "+3.4%", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", icon: Target },
                    { label: "Cycle velocity", val: "24.5d", trend: "-2.1d", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", icon: Activity },
                    { label: "Drop-off trend", val: dropOffRate, trend: "+1.2%", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", icon: MousePointer2 },
                    { label: "Revenue efficiency", val: "92%", trend: "+8%", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", icon: Zap },
                ].map((s, i) => (
                    <Card key={i} className={`border-none shadow-sm ${s.bg} border ${s.border} rounded-none`}>
                        <CardContent className="p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[12px] font-medium text-slate-600 whitespace-nowrap">{s.label}</p>
                                <div className="flex items-baseline gap-2">
                                    <h4 className="text-[22px] font-semibold text-slate-900 leading-none">{s.val}</h4>
                                    <span className={`text-[11px] font-medium ${s.color}`}>{s.trend}</span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-none bg-white/70 ${s.color} border border-white`}>
                                <s.icon size={20} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Conversion Area Chart */}
                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-none">
                    <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-[16px] font-bold text-slate-900">Win Rate Trajectory</CardTitle>
                            <CardDescription className="text-[12px] font-medium mt-1">Monthly conversion percentage and lead volume correlation</CardDescription>
                        </div>
                        <div className="flex bg-slate-100 p-1 rounded-none">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setViewMode('percentage')
                                    toast({ title: "View Switched", description: "Displaying relative conversion efficiency." })
                                }}
                                className={`h-7 text-[10px] font-medium px-3 rounded-none ${viewMode === 'percentage' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                Percentage
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setViewMode('absolute')
                                    toast({ title: "View Switched", description: "Displaying raw volume distribution." })
                                }}
                                className={`h-7 text-[10px] font-medium px-3 rounded-none ${viewMode === 'absolute' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                Absolute
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={CONVERSION_TREND_DATA}>
                                    <defs>
                                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '0px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    {viewMode === 'percentage' ? (
                                        <Area type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                                    ) : (
                                        <Bar dataKey="leads" barSize={30} fill="#e2e8f0" radius={[0, 0, 0, 0]} />
                                    )}
                                    <Line type="monotone" dataKey="wins" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981', stroke: '#fff' }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Stage Win Rate Comparison */}
                <Card className="lg:col-span-4 border-none shadow-sm ring-1 ring-slate-100 rounded-none overflow-hidden">
                    <CardHeader className="p-6 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-[16px] font-bold text-slate-900">Stage Conversion ∆</CardTitle>
                                <CardDescription className="text-[12px] font-medium">Comparison with previous period</CardDescription>
                            </div>
                            <span className="text-[10px] font-medium text-slate-400">{filteredStageTrends.length}/{STAGE_TRENDS.length}</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-5">
                        {filteredStageTrends.length > 0 ? filteredStageTrends.map((t, i) => (
                            <div key={i} className="flex items-center justify-between group p-3 rounded-none hover:bg-slate-50 transition-colors">
                                <div className="space-y-1">
                                    <h5 className="text-[13px] font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{t.stage}</h5>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-medium text-slate-400">Prev: {t.prev}</span>
                                        <div className="h-1 w-8 bg-slate-100 rounded-none" />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[15px] font-semibold text-slate-900">{t.current}</div>
                                    <div className={`flex items-center justify-end text-[10px] font-bold ${t.status === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {t.status === 'up' ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                                        {t.status === 'up' ? 'Improving' : 'Declining'}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="py-8 text-center text-[12px] font-medium text-slate-400">No stage trends match your filter.</div>
                        )}

                        <div className="mt-6 p-5 rounded-none border-2 border-dashed border-slate-100 space-y-3">
                            <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-indigo-500" />
                                <span className="text-[11px] font-medium text-slate-500">Benchmark goal</span>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[13px] font-semibold text-slate-900">
                                    <span>25% Win rate</span>
                                    <span>72% Achieved</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-none overflow-hidden">
                                    <div className="h-full bg-indigo-500 rounded-none w-[72%]" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Win vs Loss Trend */}
            <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none">
                <CardHeader className="p-6">
                    <CardTitle className="text-[16px] font-bold text-slate-900">Outcome distribution Week-over-Week</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={WIN_LOSS_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '0px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="win" name="Closed Won" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="loss" name="Closed Lost" stackId="a" fill="#f43f5e" radius={[0, 0, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
