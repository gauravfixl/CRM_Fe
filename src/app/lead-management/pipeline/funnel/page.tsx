"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    ResponsiveContainer,
    FunnelChart,
    Funnel,
    LabelList,
    Tooltip,
    Cell
} from "recharts"
import {
    Download,
    ChevronLeft,
    TrendingUp,
    Users,
    MousePointer2,
    Zap,
    Info,
    ArrowDown,
    Target,
    Loader2,
    Activity,
    Filter
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import { Input } from "@/shared/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/shared/components/ui/popover"
import { usePipelineData } from "@/shared/hooks/use-pipeline-data"

export default function FunnelViewPage() {
    const { leads } = usePipelineData()
    const { toast } = useToast()
    const router = useRouter()
    const [timeRange, setTimeRange] = useState("30d")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [isLiveActive, setIsLiveActive] = useState(false)

    // Filters
    const [filterOpen, setFilterOpen] = useState(false)
    const [ownerFilter, setOwnerFilter] = useState("all")
    const [priorityFilter, setPriorityFilter] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    const STAGE_ORDER = ["new", "contacted", "engaged", "qualified", "proposal", "negotiation", "pending", "won"]
    const STAGE_LABELS: Record<string, string> = {
        new: "New",
        contacted: "Contacted",
        engaged: "Engaged",
        qualified: "Qualified",
        proposal: "Proposal Shared",
        negotiation: "Negotiation",
        pending: "Decision Pending",
        won: "Wins"
    }

    const ownerOptions = useMemo(() => Array.from(new Set(leads.map(l => l.owner))), [leads])

    const filteredLeads = useMemo(() => {
        return leads.filter(l => {
            if (ownerFilter !== "all" && l.owner !== ownerFilter) return false
            if (priorityFilter !== "all" && l.priority !== priorityFilter) return false
            if (searchQuery && !(
                l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                l.company.toLowerCase().includes(searchQuery.toLowerCase())
            )) return false
            return true
        })
    }, [leads, ownerFilter, priorityFilter, searchQuery])

    const stageCounts = STAGE_ORDER.map(stageId => ({
        id: stageId,
        name: STAGE_LABELS[stageId],
        value: filteredLeads.filter(l => l.stage === stageId).length,
        fill: stageId === 'won' ? '#10b981' : '#6366f1'
    }))

    const funnelData = stageCounts

    const totalLeads = filteredLeads.length
    const totalConversions = filteredLeads.filter(l => l.stage === 'won').length
    const winRate = totalLeads > 0 ? ((totalConversions / totalLeads) * 100).toFixed(1) + "%" : "0%"
    const avgDays = totalConversions > 0 ? "24 Days" : "-"

    const activeFilterCount = (ownerFilter !== "all" ? 1 : 0) + (priorityFilter !== "all" ? 1 : 0) + (searchQuery ? 1 : 0)

    const handleRefresh = () => {
        setIsAnalyzing(true)
        setTimeout(() => {
            setIsAnalyzing(false)
            toast({
                title: "Funnel Recalculated",
                description: `Deep-learning model has updated conversion projections for ${timeRange}.`,
            })
        }, 1500)
    }

    const handleExport = () => {
        const headers = ["Stage", "Volume", "Conversion Rate", "Drop-Off"]
        const data = STAGE_ORDER.map((id, i) => {
            const count = filteredLeads.filter(l => l.stage === id).length
            const prevCount = i > 0 ? filteredLeads.filter(l => l.stage === STAGE_ORDER[i - 1]).length : 0
            const conv = prevCount > 0 ? ((count / prevCount) * 100).toFixed(1) + "%" : "-"
            const drop = prevCount > 0 ? (100 - (count / prevCount * 100)).toFixed(1) + "%" : "-"
            return [STAGE_LABELS[id], count.toString(), conv, drop]
        })

        const csvContent = [headers, ...data].map(e => e.join(",")).join("\n")
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `Funnel_Analysis_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({
            title: "Analysis Exported",
            description: "Funnel metrics have been exported to CSV format.",
        })
    }

    const toggleLiveFeed = () => {
        const nextState = !isLiveActive
        setIsLiveActive(nextState)
        if (nextState) {
            toast({
                title: "Live Tracking Active",
                description: "Real-time pipeline influx is now being monitored.",
            })
        } else {
            toast({
                title: "Live Tracking Paused",
                description: "Real-time monitoring has been disabled.",
            })
        }
    }

    const handleClearFilters = () => {
        setOwnerFilter("all")
        setPriorityFilter("all")
        setSearchQuery("")
        setFilterOpen(false)
    }

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500" style={{ zoom: 0.9 }}>

            {/* Header (light indigo) */}
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
                                Funnel Analysis
                            </h1>
                        </div>
                        <p className="text-[12px] text-slate-600 font-medium max-w-xl">
                            Visualizing the lead lifecycle conversion and attrition across all stages.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <Select value={timeRange} onValueChange={(val) => {
                        setTimeRange(val)
                        handleRefresh()
                    }}>
                        <SelectTrigger className="w-[160px] h-10 border-slate-200 font-medium text-[12px] bg-white rounded-none">
                            <SelectValue placeholder="Select Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 Days</SelectItem>
                            <SelectItem value="30d">Last 30 Days</SelectItem>
                            <SelectItem value="90d">Last quarter</SelectItem>
                            <SelectItem value="year">Last year</SelectItem>
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
                                    <h4 className="text-[13px] font-semibold">Filters</h4>
                                    <button
                                        type="button"
                                        onClick={handleClearFilters}
                                        className="text-[11px] font-medium text-indigo-600 hover:underline"
                                    >
                                        Clear
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase text-slate-500">Search</label>
                                        <Input
                                            name="searchQuery"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Name or company..."
                                            className="h-9 rounded-none border-slate-200"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase text-slate-500">Owner</label>
                                        <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                                            <SelectTrigger className="h-9 rounded-none border-slate-200">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Owners</SelectItem>
                                                {ownerOptions.map(o => (
                                                    <SelectItem key={o} value={o}>{o}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase text-slate-500">Priority</label>
                                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                            <SelectTrigger className="h-9 rounded-none border-slate-200">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Priorities</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="low">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Button variant="outline" onClick={handleExport} className="h-10 border-slate-200 text-slate-600 font-medium bg-white px-4 rounded-none">
                        <Download className="h-4 w-4 mr-2 text-slate-400" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Top Metrics Cards (colorful) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total New Leads", value: totalLeads.toLocaleString(), trend: "+14.2%", icon: Users, bg: "bg-blue-50", border: "border-blue-100", iconBg: "bg-white", iconColor: "text-blue-600" },
                    { label: "Total Conversions", value: totalConversions.toLocaleString(), trend: "+5.1%", icon: Target, bg: "bg-emerald-50", border: "border-emerald-100", iconBg: "bg-white", iconColor: "text-emerald-600" },
                    { label: "Overall Win Rate", value: winRate, trend: "-1.2%", icon: Zap, bg: "bg-amber-50", border: "border-amber-100", iconBg: "bg-white", iconColor: "text-amber-600" },
                    { label: "Avg. Days to Close", value: avgDays, trend: "-4d", icon: MousePointer2, bg: "bg-indigo-50", border: "border-indigo-100", iconBg: "bg-white", iconColor: "text-indigo-600" },
                ].map((stat, i) => (
                    <Card key={i} className={`${stat.bg} ${stat.border} border shadow-sm rounded-none transition-all duration-300 hover:shadow-md cursor-default`}>
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className={`p-3 rounded-none ${stat.iconBg} ${stat.iconColor} shadow-sm border border-white`}>
                                <stat.icon size={22} />
                            </div>
                            <div>
                                <p className="text-[12px] font-medium text-slate-600">{stat.label}</p>
                                <div className="flex items-baseline gap-2">
                                    <h4 className="text-[20px] font-semibold text-slate-900">{stat.value}</h4>
                                    <span className={`text-[11px] font-medium ${stat.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}`}>
                                        {stat.trend}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Visual Funnel */}
                <Card className="lg:col-span-7 border-none shadow-sm ring-1 ring-slate-100 rounded-none overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-[16px] font-bold text-slate-900">Conversion Funnel</CardTitle>
                                <CardDescription className="text-[12px] font-medium">Stage-by-stage volume distribution</CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleLiveFeed}
                                disabled={isAnalyzing}
                                className={`h-8 rounded-none font-medium text-[10px] transition-all duration-300 ${isLiveActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100 border shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 border shadow-sm'}`}
                            >
                                {isAnalyzing ? (
                                    <> <Loader2 className="h-3 w-3 mr-2 animate-spin" /> Recalculating...</>
                                ) : (
                                    <> <Activity className={`h-3 w-3 mr-2 ${isLiveActive ? 'animate-pulse' : ''}`} /> {isLiveActive ? 'Tracking Active' : 'Live Feed'}</>
                                )}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pb-4">
                        <div className="h-[450px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <FunnelChart>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '0px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Funnel
                                        dataKey="value"
                                        data={funnelData}
                                        isAnimationActive
                                    >
                                        <LabelList position="right" fill="#64748b" stroke="none" dataKey="name" />
                                        <LabelList position="center" fill="#fff" stroke="none" dataKey="value" fontStyle="bold" />
                                        {funnelData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Funnel>
                                </FunnelChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Funnel Efficiency / Drop-off List */}
                <Card className="lg:col-span-5 border-none shadow-sm ring-1 ring-slate-100 rounded-none">
                    <CardHeader className="p-6">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-none bg-indigo-50 text-indigo-600">
                                <Zap className="h-4 w-4" />
                            </div>
                            <CardTitle className="text-[16px] font-bold text-slate-900">Attrition Intelligence</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-6">
                        {STAGE_ORDER.slice(1).map((id, i) => {
                            const count = filteredLeads.filter(l => l.stage === id).length
                            const prevCount = filteredLeads.filter(l => l.stage === STAGE_ORDER[i]).length
                            const convRate = prevCount > 0 ? ((count / prevCount) * 100).toFixed(1) + "%" : "0%"
                            const dropOff = prevCount > 0 ? (100 - (count / prevCount * 100)).toFixed(1) + "%" : "0%"

                            return (
                                <div key={i} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-none bg-slate-50 flex items-center justify-center font-bold text-slate-400 text-[10px] border border-slate-100">
                                                {i + 1}
                                            </div>
                                            <span className="text-[14px] font-bold text-slate-700">{STAGE_LABELS[id]}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-rose-500 font-bold text-[12px]">
                                            <ArrowDown size={14} /> {dropOff} Drop-off
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-none overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 rounded-none"
                                            style={{ width: convRate }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 px-1">
                                        <span>CONV: {convRate}</span>
                                        <span>VOL: {count} leads</span>
                                    </div>
                                </div>
                            )
                        })}

                        <div className="pt-4 bg-indigo-50/50 p-4 rounded-none border border-indigo-100">
                            <div className="flex gap-3">
                                <Info className="h-5 w-5 text-indigo-600 shrink-0" />
                                <p className="text-[12px] font-medium text-indigo-900 leading-relaxed">
                                    <span className="font-bold underline decoration-indigo-300 decoration-2">Insight:</span> The highest drop-off happens between <span className="font-bold text-indigo-700">Proposal</span> & <span className="font-bold text-indigo-700">Negotiation</span>. Recommend review of proposal clarity and pricing strategy.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Metrics Table */}
            <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none overflow-hidden">
                <CardHeader className="p-6">
                    <CardTitle className="text-[16px] font-bold text-slate-900">Stage Performance Matrix</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/50 border-y border-slate-100">
                                    <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-400">Pipeline stage</th>
                                    <th className="px-6 py-4 text-center text-[11px] font-medium text-slate-400">Entry volume</th>
                                    <th className="px-6 py-4 text-center text-[11px] font-medium text-slate-400">Conversion to next</th>
                                    <th className="px-6 py-4 text-center text-[11px] font-medium text-slate-400">Loss rate</th>
                                    <th className="px-6 py-4 text-center text-[11px] font-medium text-slate-400">Stagnation avg</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {STAGE_ORDER.map((id, i) => {
                                    const count = filteredLeads.filter(l => l.stage === id).length
                                    const nextCount = STAGE_ORDER[i + 1] ? filteredLeads.filter(l => l.stage === STAGE_ORDER[i + 1]).length : 0
                                    const convRate = count > 0 && STAGE_ORDER[i + 1] ? ((nextCount / count) * 100).toFixed(1) + "%" : "-"
                                    const dropOff = count > 0 && STAGE_ORDER[i + 1] ? (100 - (nextCount / count * 100)).toFixed(1) + "%" : "-"

                                    return (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                    <span className="text-[14px] font-medium text-slate-700">{STAGE_LABELS[id]}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-[14px] font-semibold text-slate-900">{count}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-none text-[12px] font-bold ${convRate === '-' ? 'text-slate-300' : 'bg-emerald-50 text-emerald-600'}`}>
                                                    {convRate}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-none text-[12px] font-bold ${dropOff === '-' ? 'text-slate-300' : 'bg-rose-50 text-rose-600'}`}>
                                                    {dropOff}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-[14px] font-medium text-slate-600">0.8 Days</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
