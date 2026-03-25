"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Activity,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Target,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Settings2,
    CheckCircle2,
    Flame,
    Zap,
    Scale,
    PieChart,
    PieChart as PieChartIcon,
    Layers,
    Activity as ActivityIcon,
    RefreshCw,
    ExternalLink,
    Wallet
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"

// --- Mock Data: ROI & Cost Metrics ---
const CAMPAIGN_ROI_STATS = [
    {
        id: "1",
        name: "Q1 Global Outreach",
        spend: "$45,000",
        cpl: "$36.29",
        cpql: "$107.14",
        revenue: "$210,000",
        roi: "4.6x",
        pace: "On Track",
        trend: "up"
    },
    {
        id: "2",
        name: "Webinar: Future Ops",
        spend: "$12,000",
        cpl: "$14.12",
        cpql: "$100.00",
        revenue: "$32,000",
        roi: "2.6x",
        pace: "Under Budget",
        trend: "down"
    },
    {
        id: "3",
        name: "LinkedIn APAC Retention",
        spend: "$25,000",
        cpl: "$55.56",
        cpql: "$294.11",
        revenue: "$185,000",
        roi: "7.4x",
        pace: "Aggressive",
        trend: "up"
    },
]

export default function CostROIPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [roiStats, setRoiStats] = useState(CAMPAIGN_ROI_STATS)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newStat, setNewStat] = useState({ name: "", spend: "", cpl: "" })

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleCreateStat = () => {
        if (!newStat.name || !newStat.spend) {
            toast({ title: "Incomplete Parameters", description: "Name and total budget allocation are critical fields.", variant: "destructive" })
            return
        }
        setRoiStats([...roiStats, {
            ...newStat,
            id: Math.random().toString(36).substr(2, 9),
            cpl: newStat.cpl || "$0.00",
            cpql: "$0.00",
            revenue: "$0.00",
            roi: "0.0x",
            pace: "Planned",
            trend: "up"
        }])
        toast({ title: "Budget Provisioned", description: "Financial metrics successfully integrated." })
        setIsAddOpen(false)
        setNewStat({ name: "", spend: "", cpl: "" })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
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
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                                <DollarSign className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Cost & ROI Intelligence
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Track every dollar spent vs every lead generated. Measure CPL, CPQL, and predicted revenue ROI across all active campaigns.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => toast({ description: "Pulling metrics from core financial database..." })} className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <RefreshCw className="h-4 w-4 mr-2 text-slate-400" /> Sync Spend Data
                    </Button>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                                <Plus className="h-4 w-4 mr-2" /> Budget Entry
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-3xl p-6">
                            <DialogHeader>
                                <DialogTitle>Allocate New Campaign Budget</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Campaign Identifier</Label>
                                    <Input value={newStat.name} onChange={e => setNewStat({ ...newStat, name: e.target.value })} placeholder="e.g., APAC Expansion Q3" className="h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Total Projected Spend</Label>
                                    <Input value={newStat.spend} onChange={e => setNewStat({ ...newStat, spend: e.target.value })} placeholder="e.g., $25,000" className="h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Target Baseline CPL</Label>
                                    <Input value={newStat.cpl} onChange={e => setNewStat({ ...newStat, cpl: e.target.value })} placeholder="e.g., $15.50" className="h-11 rounded-xl" />
                                </div>
                            </div>
                            <Button className="h-11 w-full bg-indigo-600 font-semibold rounded-xl" onClick={handleCreateStat}>Initialize Budget Line</Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Global Financial Metrics */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: "Total Spend (MTD)", val: "$82.5k", icon: Wallet, color: "text-indigo-600", bg: "bg-indigo-50" },
                        { label: "Avg CPL", val: "$34.12", icon: Target, color: "text-cyan-600", bg: "bg-cyan-50" },
                        { label: "Avg CPQL", val: "$112.40", icon: Flame, color: "text-amber-600", bg: "bg-amber-50" },
                        { label: "Overall ROI", val: "4.2x", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
                    ].map((m, i) => (
                        <Card key={i} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl bg-white overflow-hidden">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">{m.label}</p>
                                    <h4 className="text-[22px] font-semibold tabular-nums text-slate-900">{m.val}</h4>
                                </div>
                                <div className={`p-2.5 rounded-xl ${m.bg} ${m.color}`}>
                                    <m.icon size={18} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Campaign Financial Inventory */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[16px] font-semibold text-slate-900">Campaign Financials</h2>
                        <div className="flex items-center gap-4">
                            <Search className="h-4 w-4 text-slate-300" />
                            <Badge variant="outline" className="border-emerald-100 text-emerald-600 bg-emerald-50/20 text-[10px] font-semibold h-6 px-2">BUDGET TRACKING ACTIVE</Badge>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {roiStats.map((stat) => (
                            <Card key={stat.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl group hover:ring-emerald-100 transition-all bg-white overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            {/* Campaign & Spend */}
                                            <div className="flex items-center gap-4 min-w-[280px]">
                                                <div className="p-3 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                                    <DollarSign size={22} />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-[15px] font-semibold text-slate-900">{stat.name}</h3>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Spent: <span className="text-slate-900">{stat.spend}</span></span>
                                                        <Badge className={`bg-slate-50 text-slate-400 border-none px-1.5 h-4.5 text-[9px] font-semibold uppercase tracking-wider`}>{stat.pace}</Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Efficiency Section */}
                                            <div className="grid grid-cols-2 gap-8 min-w-[180px]">
                                                <div className="space-y-0.5">
                                                    <p className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">CPL</p>
                                                    <div className="flex items-center gap-1.5">
                                                        <h4 className="text-[15px] font-semibold tabular-nums text-slate-900">{stat.cpl}</h4>
                                                        {stat.trend === 'up' ? <ArrowUpRight size={10} className="text-emerald-500" /> : <ArrowDownRight size={10} className="text-rose-500" />}
                                                    </div>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">CPQL</p>
                                                    <h4 className="text-[15px] font-semibold tabular-nums text-indigo-600">{stat.cpql}</h4>
                                                </div>
                                            </div>

                                            {/* ROI Section */}
                                            <div className="flex flex-col items-end min-w-[150px]">
                                                <p className="text-[9px] font-semibold tracking-wider text-slate-300 uppercase leading-none mb-1">Total ROI</p>
                                                <div className="flex items-baseline gap-1">
                                                    <h3 className="text-[20px] font-semibold tabular-nums text-emerald-600 tracking-tighter">{stat.roi}</h3>
                                                </div>
                                                <span className="text-[10px] font-semibold text-slate-400">Rev: {stat.revenue}</span>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 justify-end">
                                                <Button size="icon" variant="ghost" onClick={() => toast({ description: "Detail view initializing..." })} className="h-9 w-9 text-slate-300 hover:text-slate-900 rounded-xl">
                                                    <ExternalLink size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Efficiency Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-6 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                                <Scale size={24} />
                            </div>
                            <h4 className="text-[16px] font-semibold text-slate-900">Spend Efficiency</h4>
                        </div>

                        <div className="space-y-6 pt-4 border-t border-slate-50">
                            {[
                                { label: "Budget Pacing", val: 84, color: "bg-indigo-600", status: "Nominal" },
                                { label: "Market CPQL Baseline", val: 120, color: "bg-amber-500", status: "High Cost" },
                                { label: "Channel Saturation", val: 42, color: "bg-emerald-500", status: "Scaleable" },
                            ].map((s, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-[11px] font-semibold tracking-wider uppercase">
                                        <span className="text-slate-400">{s.label}</span>
                                        <span className="text-slate-900">{s.status}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div className={`h-full ${s.color}`} style={{ width: `${s.val > 100 ? 100 : s.val}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-indigo-50 text-indigo-900 p-8 space-y-4 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-500 transition-transform group-hover:scale-110">
                            <PieChartIcon size={120} />
                        </div>
                        <h4 className="text-[16px] font-semibold tracking-tight relative z-10">Financial Modeling</h4>
                        <p className="text-[12px] text-indigo-700 font-medium leading-relaxed relative z-10">
                            Project future results by adjusting your CPL and Budget variables.
                        </p>
                        <Button onClick={() => toast({ description: "Calculator tool loading dependencies..." })} className="w-full h-10 bg-white text-indigo-600 hover:bg-slate-50 font-semibold text-[11px] uppercase tracking-widest rounded-xl border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative z-10">
                            Launch Calculator
                        </Button>
                    </Card>

                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-white text-emerald-600 border border-emerald-200 shadow-sm">
                            <TrendingUp size={18} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[13px] font-semibold text-emerald-900">Optimization Goal</p>
                            <p className="text-[11px] text-emerald-700 font-medium leading-relaxed italic">
                                "Reducing CPQL by 12% on APAC Retention would yield an additional $22k in projected revenue."
                            </p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
