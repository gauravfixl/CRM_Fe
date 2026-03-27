"use client"

import React, { useState, useMemo } from 'react'
import {
    Search,
    Download,
    Filter,
    Calendar,
    TrendingUp,
    TrendingDown,
    DollarSign,
    CreditCard,
    AlertTriangle,
    CheckCircle,
    RefreshCw,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    SearchCheck,
    PieChart as PieIcon,
    Clock,
    ShieldCheck
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Progress } from "@/shared/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { toast } from "@/shared/utils/toast"

// --- Enhanced Mock Data ---
const METRICS_BY_PERIOD = {
    "current-month": [
        { title: "Recognized Revenue", value: "$847.5k", change: "+12.5%", trend: "up", icon: DollarSign, bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-200/50" },
        { title: "Operating Expenses", value: "$324.2k", change: "+8.3%", trend: "up", icon: Wallet, bg: "bg-gradient-to-br from-rose-50 to-rose-100/50", iconBg: "bg-rose-100", iconColor: "text-rose-600", border: "border-rose-200/50" },
        { title: "Net Gross Profit", value: "$523.3k", change: "+15.2%", trend: "up", icon: TrendingUp, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-200/50" },
        { title: "Cash Reserves", value: "$2.42m", change: "+6.8%", trend: "up", icon: ShieldCheck, bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-200/50" }
    ],
    "last-month": [
        { title: "Recognized Revenue", value: "$792.1k", change: "+4.2%", trend: "up", icon: DollarSign, bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-200/50" },
        { title: "Operating Expenses", value: "$310.5k", change: "-2.1%", trend: "down", icon: Wallet, bg: "bg-gradient-to-br from-rose-50 to-rose-100/50", iconBg: "bg-rose-100", iconColor: "text-rose-600", border: "border-rose-200/50" },
        { title: "Net Gross Profit", value: "$481.6k", change: "+10.5%", trend: "up", icon: TrendingUp, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-200/50" },
        { title: "Cash Reserves", value: "$2.15m", change: "+3.4%", trend: "up", icon: ShieldCheck, bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-200/50" }
    ],
    "quarter": [
        { title: "Recognized Revenue", value: "$2.48m", change: "+22.5%", trend: "up", icon: DollarSign, bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-200/50" },
        { title: "Operating Expenses", value: "$945.8k", change: "+15.3%", trend: "up", icon: Wallet, bg: "bg-gradient-to-br from-rose-50 to-rose-100/50", iconBg: "bg-rose-100", iconColor: "text-rose-600", border: "border-rose-200/50" },
        { title: "Net Gross Profit", value: "$1.53m", change: "+28.2%", trend: "up", icon: TrendingUp, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-200/50" },
        { title: "Cash Reserves", value: "$2.42m", change: "+18.8%", trend: "up", icon: ShieldCheck, bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-200/50" }
    ]
}

const DEFERRED_REVENUE = [
    { month: "Jan 2024", amount: 245000, recognized: 89000, remaining: 156000 },
    { month: "Feb 2024", amount: 267000, recognized: 95000, remaining: 172000 },
    { month: "Mar 2024", amount: 289000, recognized: 102000, remaining: 187000 },
    { month: "Apr 2024", amount: 312000, recognized: 108000, remaining: 204000 }
]

const OUTSTANDING_RECV = [
    { client: "Acme Corp", amount: 125000, dueDate: "Oct 12, 2024", status: "Overdue", invoice: "INV-2024-001" },
    { client: "TechStart Inc", amount: 48000, dueDate: "Oct 18, 2024", status: "Due", invoice: "INV-2024-002" },
    { client: "Global Solutions", amount: 189000, dueDate: "Oct 22, 2024", status: "Due", invoice: "INV-2024-003" }
]

export default function FinanceOverview() {
    const [dateRange, setDateRange] = useState("current-month")

    const handleAction = (msg: string) => {
        toast.promise(new Promise(r => setTimeout(r, 1200)), {
            loading: 'Synchronizing fiscal data...',
            success: msg,
            error: 'Failed to sync ledger'
        })
    }

    const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

    const activeMetrics = useMemo(() => METRICS_BY_PERIOD[dateRange as keyof typeof METRICS_BY_PERIOD], [dateRange])

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">Finance <span className="text-indigo-600">Overview</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Real-time fiscal monitoring and enterprise-grade ledger control</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-44 h-11 rounded-xl border-slate-200 bg-white font-semibold shadow-sm text-slate-700">
                            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200">
                            <SelectItem value="current-month" className="font-medium text-slate-700">Current Month</SelectItem>
                            <SelectItem value="last-month" className="font-medium text-slate-700">Last Month</SelectItem>
                            <SelectItem value="quarter" className="font-medium text-slate-700">This Quarter</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={() => handleAction("Financial ledger refreshed")}>
                        <RefreshCw className="w-4 h-4 text-slate-400" /> Sync
                    </Button>
                    <Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm gap-2" onClick={() => handleAction("Fiscal report exported successfully")}>
                        <Download className="w-4 h-4" /> Export Assets
                    </Button>
                </div>
            </div>

            {/* Fiscal Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {activeMetrics.map((metric, i) => (
                    <Card key={i} className={`${metric.bg} ${metric.border} border border-0 shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden group`}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm ${metric.iconBg} ${metric.iconColor}`}>
                                    <metric.icon className="w-6 h-6" />
                                </div>
                                <div className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${metric.trend === 'up' ? 'bg-emerald-100/50 text-emerald-700' : 'bg-rose-100/50 text-rose-700'
                                    }`}>
                                    {metric.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {metric.change}
                                </div>
                            </div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{metric.title}</p>
                            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">{metric.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Tabs Segment */}
            <Tabs defaultValue="dashboard" className="space-y-6">
                <TabsList className="bg-white border border-slate-200 p-1.5 rounded-2xl h-14 w-fit shadow-sm">
                    <TabsTrigger value="dashboard" className="px-8 rounded-xl data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500 transition-all">Fiscal Dashboard</TabsTrigger>
                    <TabsTrigger value="outstanding" className="px-8 rounded-xl data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500 transition-all">Outstanding Assets</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="lg:col-span-2 rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white border border-slate-100">
                            <CardHeader className="px-8 py-6 border-b border-slate-100">
                                <CardTitle className="text-xl font-semibold text-slate-900">Revenue Recognition Stream</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                {DEFERRED_REVENUE.map((data, idx) => (
                                    <div key={idx} className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <h4 className="text-md font-semibold text-slate-900">{data.month}</h4>
                                                <p className="text-[12px] font-medium text-slate-400">Total Liability: {fmt(data.amount)}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-semibold text-emerald-600">{fmt(data.recognized)}</span>
                                                <span className="text-xs text-slate-400 font-medium ml-2">Recognized</span>
                                            </div>
                                        </div>
                                        <Progress value={(data.recognized / data.amount) * 100} className="h-2 bg-slate-100 rounded-full" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-slate-900 text-white p-8 space-y-6">
                                <div className="space-y-2">
                                    <h4 className="text-xl font-semibold tracking-tight">Net Cash Flow Pulse</h4>
                                    <p className="text-slate-400 text-sm font-medium leading-relaxed">System-calculated delta between all inflows and organizational burn.</p>
                                </div>
                                <div className="space-y-4 pt-2">
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 group hover:bg-white/10 transition-all">
                                        <span className="text-xs font-semibold text-slate-300">Inflow Ops</span>
                                        <span className="text-sm font-semibold text-emerald-400">+$485k</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 group hover:bg-white/10 transition-all">
                                        <span className="text-xs font-semibold text-slate-300">Investing</span>
                                        <span className="text-sm font-semibold text-rose-400">-$125k</span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-white/10">
                                    <div className="flex justify-between items-end">
                                        <p className="text-[12px] font-medium text-slate-500">Net Delta</p>
                                        <p className="text-2xl font-semibold text-white">+$360.5k</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="outstanding">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white border border-slate-100">
                            <CardHeader className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                                <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" /> Receivables Ageing
                                </CardTitle>
                                <Button variant="ghost" className="text-indigo-600 font-semibold text-xs hover:bg-indigo-50 px-4">View All Invoices</Button>
                            </CardHeader>
                            <CardContent className="p-8 space-y-4">
                                {OUTSTANDING_RECV.map((item, idx) => (
                                    <div key={idx} className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-lg hover:border-indigo-100 transition-all group">
                                        <div className="space-y-1.5 flex-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-md font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{item.client}</h4>
                                                <Badge className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border-0 ${item.status === 'Overdue' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>{item.status}</Badge>
                                            </div>
                                            <div className="flex items-center gap-6 text-[11px] font-medium text-slate-400">
                                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Due: {item.dueDate}</span>
                                                <span className="flex items-center gap-1.5"><SearchCheck className="w-3.5 h-3.5" /> Id: {item.invoice}</span>
                                            </div>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <p className="text-lg font-semibold text-slate-900 tracking-tight">{fmt(item.amount)}</p>
                                            <Button variant="ghost" className="h-8 rounded-lg text-[10px] font-semibold text-indigo-600 hover:bg-indigo-50" onClick={() => handleAction(`Follow-up sent to ${item.client}`)}>Escalate</Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 p-8 space-y-6 bg-white border border-slate-100">
                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                    <PieIcon className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h4 className="text-xl font-semibold text-slate-900 tracking-tight">Global Liability Mix</h4>
                                <div className="space-y-5">
                                    {[
                                        { label: "Infrastructure", value: 45, color: "bg-indigo-500" },
                                        { label: "Operating Labor", value: 32, color: "bg-violet-500" },
                                        { label: "Marketing Burn", value: 23, color: "bg-emerald-500" }
                                    ].map((cat, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-[12px] font-medium text-slate-500">
                                                <span>{cat.label}</span>
                                                <span>{cat.value}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full ${cat.color}`} style={{ width: `${cat.value}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
