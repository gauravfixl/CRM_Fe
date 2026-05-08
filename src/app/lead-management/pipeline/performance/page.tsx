"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
    Cell
} from "recharts"
import {
    BarChart3,
    ChevronLeft,
    Download,
    Zap,
    History,
    Target,
    UserPlus,
    Filter,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Clock,
    Activity,
    Briefcase,
    CheckCircle2,
    XCircle
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { Progress } from "@/shared/components/ui/progress"
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

const STAGES = [
    { id: 'new', name: 'New', icon: UserPlus, color: 'slate' },
    { id: 'contacted', name: 'Contacted', icon: Search, color: 'blue' },
    { id: 'engaged', name: 'Engaged', icon: Activity, color: 'indigo' },
    { id: 'qualified', name: 'Qualified', icon: Target, color: 'emerald' },
    { id: 'proposal', name: 'Proposal Shared', icon: Zap, color: 'amber' },
    { id: 'negotiation', name: 'Negotiation', icon: Briefcase, color: 'orange' },
    { id: 'pending', name: 'Decision Pending', icon: Clock, color: 'rose' },
    { id: 'won', name: 'Won', icon: CheckCircle2, color: 'emerald' },
    { id: 'lost', name: 'Lost', icon: XCircle, color: 'rose' },
]

const PERFORMANCE_TREND = [
    { name: 'Week 1', new: 95, contacted: 85, engaged: 70, qualified: 60, proposal: 45, negotiation: 30, pending: 20, won: 15, lost: 10 },
    { name: 'Week 2', new: 88, contacted: 88, engaged: 72, qualified: 65, proposal: 48, negotiation: 32, pending: 22, won: 18, lost: 12 },
    { name: 'Week 3', new: 102, contacted: 82, engaged: 75, qualified: 62, proposal: 50, negotiation: 35, pending: 25, won: 22, lost: 15 },
    { name: 'Week 4', new: 110, contacted: 90, engaged: 80, qualified: 68, proposal: 55, negotiation: 40, pending: 30, won: 28, lost: 18 },
]

const DROP_OFF_REASONS = [
    { name: 'Budget mismatch', value: 35, color: '#f43f5e' },
    { name: 'No authority', value: 25, color: '#f59e0b' },
    { name: 'Timing/Priority', value: 20, color: '#6366f1' },
    { name: 'Competitive loss', value: 15, color: '#8b5cf6' },
    { name: 'Others', value: 5, color: '#94a3b8' },
]

const ALL_PERFORMERS = [
    { name: 'Anita Sharma', role: 'Sales Lead', conv: '78%', deals: 24, score: 92 },
    { name: 'Rajesh Kumar', role: 'Account Exec', conv: '72%', deals: 18, score: 88 },
    { name: 'David Miller', role: 'SDR', conv: '65%', deals: 32, score: 85 },
    { name: 'Sunil Moitra', role: 'Sales Architect', conv: '58%', deals: 12, score: 76 },
]

export default function StagePerformancePage() {
    const { toast } = useToast()
    const router = useRouter()
    const [selectedStage, setSelectedStage] = useState('new')
    const [isExporting, setIsExporting] = useState(false)
    const [periodLabel, setPeriodLabel] = useState("Current Month")

    // Filters
    const [filterOpen, setFilterOpen] = useState(false)
    const [performerSearch, setPerformerSearch] = useState("")
    const [minDeals, setMinDeals] = useState("")
    const [period, setPeriod] = useState("month")

    const filteredPerformers = useMemo(() => {
        return ALL_PERFORMERS.filter(p => {
            if (performerSearch && !(
                p.name.toLowerCase().includes(performerSearch.toLowerCase()) ||
                p.role.toLowerCase().includes(performerSearch.toLowerCase())
            )) return false
            if (minDeals) {
                const m = parseInt(minDeals) || 0
                if (p.deals < m) return false
            }
            return true
        })
    }, [performerSearch, minDeals])

    const activeFilterCount = (performerSearch ? 1 : 0) + (minDeals ? 1 : 0)

    const handleExport = () => {
        setIsExporting(true)
        setTimeout(() => {
            const headers = ["Stage", "Growth", "Incoming", "Stagnation", "Exit Rate", "Loss Rate"]
            const data = STAGES.map(s => [s.name, "+8.4%", "245", "4.2d", "82%", "18%"])

            const csvContent = [headers, ...data].map(e => e.join(",")).join("\n")
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.setAttribute("href", url)
            link.setAttribute("download", `Stage_Performance_Report_${new Date().toISOString().split('T')[0]}.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            setIsExporting(false)
            toast({
                title: "Report Generated",
                description: "Stage performance summary has been exported to CSV.",
            })
        }, 600)
    }

    const handlePeriodChange = (val: string) => {
        setPeriod(val)
        const labels: Record<string, string> = { month: "Current Month", quarter: "Current Quarter", year: "Current Year", week: "This Week" }
        setPeriodLabel(labels[val] || "Current Month")
        toast({ title: "Period Updated", description: `Now showing performance for ${labels[val]}.` })
    }

    const handleClearFilters = () => {
        setPerformerSearch("")
        setMinDeals("")
        setFilterOpen(false)
    }

    const currentStage = STAGES.find(s => s.id === selectedStage) || STAGES[0]

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
                                <BarChart3 className="h-4 w-4" />
                            </div>
                            <h1 className="text-[20px] font-bold tracking-tight text-slate-900">
                                Stage Performance
                            </h1>
                        </div>
                        <p className="text-[12px] text-slate-600 font-medium max-w-xl">
                            Granular intelligence into individual stage throughput and conversion health.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <Select value={period} onValueChange={handlePeriodChange}>
                        <SelectTrigger className="w-[160px] h-10 border-slate-200 font-medium text-[12px] bg-white rounded-none">
                            <Calendar className="h-3 w-3 mr-2 text-slate-400" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">Current Month</SelectItem>
                            <SelectItem value="quarter">Current Quarter</SelectItem>
                            <SelectItem value="year">Current Year</SelectItem>
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
                                    <h4 className="text-[13px] font-semibold">Filter Performers</h4>
                                    <button
                                        type="button"
                                        onClick={handleClearFilters}
                                        className="text-[11px] font-medium text-indigo-600 hover:underline"
                                    >
                                        Clear
                                    </button>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase text-slate-500">Search</label>
                                    <Input
                                        name="performerSearch"
                                        value={performerSearch}
                                        onChange={(e) => setPerformerSearch(e.target.value)}
                                        placeholder="Name or role..."
                                        className="h-9 rounded-none border-slate-200"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase text-slate-500">Min Deals</label>
                                    <Input
                                        name="minDeals"
                                        type="number"
                                        min="0"
                                        value={minDeals}
                                        onChange={(e) => setMinDeals(e.target.value)}
                                        placeholder="0"
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
                        <Download className="h-4 w-4 mr-2 text-slate-400" /> {isExporting ? "Generating..." : "Export CSV"}
                    </Button>
                </div>
            </div>

            {/* Stage Grid Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {STAGES.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setSelectedStage(s.id)}
                        className={`group relative p-4 rounded-none border-2 transition-all duration-300 text-left ${selectedStage === s.id
                            ? "border-indigo-500 shadow-lg shadow-indigo-100"
                            : "border-slate-100 hover:border-slate-200 hover:shadow-md"
                            }`}
                        style={
                            selectedStage === s.id
                                ? { background: "linear-gradient(135deg, #6366f120 0%, #6366f10a 45%, #ffffff 100%)" }
                                : { background: "linear-gradient(135deg, #f1f5f9 0%, #f8fafc 45%, #ffffff 100%)" }
                        }
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-1.5 rounded-none ${selectedStage === s.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'} transition-colors`}>
                                <s.icon className="h-3.5 w-3.5" />
                            </div>
                            {selectedStage === s.id && <Zap className="h-3 w-3 text-indigo-500 fill-indigo-500" />}
                        </div>
                        <h3 className={`text-[14px] font-bold truncate ${selectedStage === s.id ? 'text-indigo-900' : 'text-slate-700'}`}>{s.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[9px] font-medium text-slate-400">Growth:</span>
                            <span className="text-[9px] font-medium text-emerald-600">+8.4%</span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Detailed Stage Metrics */}
                <div className="lg:col-span-8 space-y-6">
                    <Card
                        className="border-none shadow-sm ring-1 ring-indigo-100 rounded-none"
                        style={{ background: "linear-gradient(135deg, #6366f114 0%, #6366f106 45%, #ffffff 100%)" }}
                    >
                        <CardHeader className="border-b border-indigo-100 p-6 flex-row items-center justify-between" style={{ background: "#6366f10d" }}>
                            <div>
                                <CardTitle className="text-[16px] font-bold text-slate-900">Stage Conversion Trend</CardTitle>
                                <CardDescription className="text-[12px] font-medium leading-none mt-1.5 flex items-center gap-2">
                                    {periodLabel} performance for <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 h-5 px-1.5 font-medium text-[9px] rounded-none">{currentStage.name}</Badge>
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                                    <span className="text-[10px] font-medium text-slate-500">Active leads</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-medium text-slate-500">Conversion</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={PERFORMANCE_TREND}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
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
                                        <Line
                                            type="monotone"
                                            dataKey={selectedStage}
                                            stroke="#6366f1"
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div
                                className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 p-6 rounded-none border border-indigo-100"
                                style={{ background: "linear-gradient(135deg, #6366f114 0%, #6366f108 45%, #ffffff 100%)" }}
                            >
                                {[
                                    { label: "Incoming Leads", value: "245", trend: "+12%", icon: UserPlus },
                                    { label: "Avg Stagnation", value: "4.2d", trend: "-0.5d", icon: Clock },
                                    { label: "Exit Rate", value: "82%", trend: "+5%", icon: ArrowUpRight },
                                    { label: "Loss Rate", value: "18%", trend: "-2%", icon: ArrowDownRight },
                                ].map((m, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <m.icon className="h-3.5 w-3.5 text-slate-400" />
                                            <span className="text-[10px] font-medium text-slate-400">{m.label}</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-[18px] font-semibold text-slate-900 tracking-tight">{m.value}</span>
                                            <span className={`text-[10px] font-medium ${m.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{m.trend}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card
                            className="border-none shadow-sm ring-1 ring-emerald-100 rounded-none"
                            style={{ background: "linear-gradient(135deg, #10b98114 0%, #10b98106 45%, #ffffff 100%)" }}
                        >
                            <CardHeader className="p-6">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-[15px] font-bold text-slate-900">Leading Stage Owners</CardTitle>
                                    <span className="text-[10px] font-medium text-slate-400">{filteredPerformers.length} matches</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-4">
                                {filteredPerformers.length > 0 ? filteredPerformers.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-none border border-slate-50 hover:border-indigo-100 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border-2 border-white shadow-sm rounded-none">
                                                <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold text-[11px] rounded-none">{p.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="text-[13px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{p.name}</h4>
                                                <p className="text-[10px] font-medium text-slate-400">{p.role}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[13px] font-semibold text-indigo-600">{p.conv} Win</div>
                                            <div className="text-[10px] font-medium text-slate-400">{p.deals} High-score leads</div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-8 text-center text-[12px] font-medium text-slate-400">No performers match your filter.</div>
                                )}
                            </CardContent>
                        </Card>

                        <Card
                            className="border-none shadow-sm ring-1 ring-amber-100 rounded-none"
                            style={{ background: "linear-gradient(135deg, #f59e0b14 0%, #f59e0b06 45%, #ffffff 100%)" }}
                        >
                            <CardHeader className="p-6">
                                <CardTitle className="text-[15px] font-bold text-slate-900">Conversion Milestones</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-5">
                                {[
                                    { label: "Profile Enrichment", val: 85, color: "bg-blue-500" },
                                    { label: "Engagement Started", val: 92, color: "bg-emerald-500" },
                                    { label: "Qualification Review", val: 68, color: "bg-amber-500" },
                                    { label: "SLA Compliant", val: 98, color: "bg-indigo-500" },
                                ].map((m, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-center text-[12px] font-bold">
                                            <span className="text-slate-600">{m.label}</span>
                                            <span className="text-indigo-600 tracking-tight">{m.val}% Progress</span>
                                        </div>
                                        <Progress value={m.val} className={`h-1.5 bg-slate-100 ${m.color}`} />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Drop-off Distribution */}
                <div className="lg:col-span-4 space-y-6">
                    <Card
                        className="border-none shadow-sm ring-1 ring-rose-100 rounded-none h-full"
                        style={{ background: "linear-gradient(135deg, #f43f5e14 0%, #f43f5e06 45%, #ffffff 100%)" }}
                    >
                        <CardHeader className="p-6">
                            <CardTitle className="text-[16px] font-bold text-slate-900">Loss Distribution</CardTitle>
                            <CardDescription className="text-[12px] font-medium mt-1">Primary reasons for drop-off at <span className="text-indigo-600 font-bold">{currentStage.name}</span></CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <div className="h-[280px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart layout="vertical" data={DROP_OFF_REASONS}>
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            axisLine={false}
                                            tickLine={false}
                                            width={100}
                                            tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '0px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="value" radius={[0, 0, 0, 0]} barSize={20}>
                                            {DROP_OFF_REASONS.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="space-y-4 mt-8">
                                {DROP_OFF_REASONS.map((r, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-none bg-slate-50/50 border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                                            <span className="text-[13px] font-bold text-slate-700">{r.name}</span>
                                        </div>
                                        <span className="text-[13px] font-semibold text-slate-900">{r.value}%</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 p-4 bg-emerald-50 rounded-none border border-emerald-100">
                                <div className="flex gap-3">
                                    <History className="h-5 w-5 text-emerald-600 shrink-0" />
                                    <p className="text-[12px] font-medium text-emerald-900 leading-relaxed">
                                        <span className="font-bold underline decoration-emerald-300 decoration-2">Strategy Tip:</span> Budget mismatch is high. Consider introducing a "Lite" pricing tier or specialized qualification filters earlier.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
