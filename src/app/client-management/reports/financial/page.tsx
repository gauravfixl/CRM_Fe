"use client"

import React, { useState, useMemo } from 'react'
import {
    Download,
    DollarSign,
    TrendingUp,
    TrendingDown,
    CreditCard,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Filter,
    Search,
    ShieldCheck,
    BarChart3,
    Loader2,
    Activity,
    HardDrive,
    Layers,
    PieChart,
    RefreshCw
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Badge } from "@/shared/components/ui/badge"
import { Progress } from "@/shared/components/ui/progress"
import { Input } from "@/shared/components/ui/input"
import { toast } from "@/shared/utils/toast"

// --- Enhanced Mock Data ---
// --- Dynamic Period Data Mapping ---
const DATA_BY_PERIOD = {
    "monthly": {
        metrics: [
            { title: "Total Monthly Gross", value: "$2.7M", change: "+12.2%", trend: "up" as const, icon: DollarSign, color: "indigo" },
            { title: "Operating Expenses", value: "$1.1M", change: "+2.3%", trend: "up" as const, icon: Wallet, color: "rose" },
            { title: "Net Profit Margin", value: "22.4%", change: "+1.2%", trend: "up" as const, icon: TrendingUp, color: "emerald" },
            { title: "Accounts Receivable", value: "$350k", change: "-5.1%", trend: "down" as const, icon: CreditCard, color: "violet" }
        ],
        revenueStreams: [
            { source: "Saas Subscriptions", amount: 152000, target: 160000, growth: "+12%", color: "bg-blue-500" },
            { source: "Premium Support", amount: 35000, target: 40000, growth: "+8%", color: "bg-violet-500" },
            { source: "Implementation Services", amount: 15000, target: 12000, growth: "+5%", color: "bg-emerald-500" }
        ],
        expenses: [
            { category: "Salaries and Wages", amount: 43000, percentage: 60, status: "Normal" },
            { category: "Infrastructure and Aws", amount: 15000, percentage: 21, status: "Optimized" },
            { category: "Marketing and Ads", amount: 9000, percentage: 13, status: "Scaling" },
            { category: "Office and Operations", amount: 4000, percentage: 6, status: "Fixed" }
        ],
        burnRate: "$38k",
        runway: "24 Months",
        vendors: [
            { name: "Amazon Web Services", type: "Infrastructure", amount: "$1,400", share: 38 },
            { name: "Salesforce Cloud", type: "Software", amount: "$900", share: 25 },
            { name: "Google Workspace", type: "Operations", amount: "$500", share: 14 }
        ]
    },
    "quarterly": {
        metrics: [
            { title: "Total Quarterly Gross", value: "$8.1M", change: "+15.4%", trend: "up" as const, icon: DollarSign, color: "indigo" },
            { title: "Operating Expenses", value: "$3.2M", change: "+4.1%", trend: "up" as const, icon: Wallet, color: "rose" },
            { title: "Net Profit Margin", value: "23.2%", change: "+2.1%", trend: "up" as const, icon: TrendingUp, color: "emerald" },
            { title: "Accounts Receivable", value: "$1.1M", change: "-1.2%", trend: "down" as const, icon: CreditCard, color: "violet" }
        ],
        revenueStreams: [
            { source: "Saas Subscriptions", amount: 456000, target: 480000, growth: "+18%", color: "bg-blue-500" },
            { source: "Premium Support", amount: 105000, target: 120000, growth: "+10%", color: "bg-violet-500" },
            { source: "Implementation Services", amount: 45000, target: 36000, growth: "+7%", color: "bg-emerald-500" }
        ],
        expenses: [
            { category: "Salaries and Wages", amount: 129000, percentage: 59, status: "Normal" },
            { category: "Infrastructure and Aws", amount: 45000, percentage: 20, status: "Optimized" },
            { category: "Marketing and Ads", amount: 27000, percentage: 12, status: "Scaling" },
            { category: "Office and Operations", amount: 12000, percentage: 9, status: "Fixed" }
        ],
        burnRate: "$105k",
        runway: "22 Months",
        vendors: [
            { name: "Amazon Web Services", type: "Infrastructure", amount: "$4,200", share: 40 },
            { name: "Salesforce Cloud", type: "Software", amount: "$2,800", share: 28 },
            { name: "Google Workspace", type: "Operations", amount: "$1,400", share: 12 }
        ]
    },
    "yearly": {
        metrics: [
            { title: "Total Annual Gross", value: "$32.4M", change: "+18.2%", trend: "up" as const, icon: DollarSign, color: "indigo" },
            { title: "Operating Expenses", value: "$12.8M", change: "+5.3%", trend: "up" as const, icon: Wallet, color: "rose" },
            { title: "Net Profit Margin", value: "24.1%", change: "+3.2%", trend: "up" as const, icon: TrendingUp, color: "emerald" },
            { title: "Accounts Receivable", value: "$4.2M", change: "-2.1%", trend: "down" as const, icon: CreditCard, color: "violet" }
        ],
        revenueStreams: [
            { source: "Saas Subscriptions", amount: 1820000, target: 2000000, growth: "+20%", color: "bg-blue-500" },
            { source: "Premium Support", amount: 420000, target: 500000, growth: "+15%", color: "bg-violet-500" },
            { source: "Implementation Services", amount: 180000, target: 150000, growth: "+12%", color: "bg-emerald-500" }
        ],
        expenses: [
            { category: "Salaries and Wages", amount: 520000, percentage: 58, status: "Normal" },
            { category: "Infrastructure and Aws", amount: 180000, percentage: 20, status: "Optimized" },
            { category: "Marketing and Ads", amount: 120000, percentage: 14, status: "Scaling" },
            { category: "Office and Operations", amount: 70000, percentage: 8, status: "Fixed" }
        ],
        burnRate: "$420k",
        runway: "18 Months",
        vendors: [
            { name: "Amazon Web Services", type: "Infrastructure", amount: "$12,400", share: 45 },
            { name: "Salesforce Cloud", type: "Software", amount: "$8,200", share: 30 },
            { name: "Google Workspace", type: "Operations", amount: "$4,100", share: 15 }
        ]
    }
}

// Helper Components
const MetricCard = ({ title, value, change, trend, icon: Icon, color }: {
    title: string
    value: string
    change: string
    trend: "up" | "down"
    icon: any
    color: string
}) => {
    const getColorClasses = (color: string) => {
        switch (color) {
            case 'indigo':
                return {
                    bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100/50',
                    iconBg: 'bg-indigo-100',
                    iconColor: 'text-indigo-600',
                    border: 'border-indigo-200/50'
                }
            case 'emerald':
                return {
                    bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50',
                    iconBg: 'bg-emerald-100',
                    iconColor: 'text-emerald-600',
                    border: 'border-emerald-200/50'
                }
            case 'violet':
                return {
                    bg: 'bg-gradient-to-br from-violet-50 to-violet-100/50',
                    iconBg: 'bg-violet-100',
                    iconColor: 'text-violet-600',
                    border: 'border-violet-200/50'
                }
            case 'rose':
                return {
                    bg: 'bg-gradient-to-br from-rose-50 to-rose-100/50',
                    iconBg: 'bg-rose-100',
                    iconColor: 'text-rose-600',
                    border: 'border-rose-200/50'
                }
            default:
                return {
                    bg: 'bg-gradient-to-br from-gray-50 to-gray-100/50',
                    iconBg: 'bg-slate-100',
                    iconColor: 'text-slate-500',
                    border: 'border-slate-200/50'
                }
        }
    }

    const colorClasses = getColorClasses(color)

    return (
        <Card className={`transition-all duration-200 hover:shadow-lg hover:shadow-${color}-100/50 ${colorClasses.bg} ${colorClasses.border} border`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${colorClasses.iconBg} shadow-sm`}>
                            <Icon className={`h-5 w-5 ${colorClasses.iconColor}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 font-outfit">{title}</p>
                            <p className="text-2xl font-semibold text-slate-900 font-outfit">{value}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            <span className="text-sm font-semibold font-outfit">{change}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function FinancialReports() {
    const [period, setPeriod] = useState("monthly")
    const [isSyncing, setIsSyncing] = useState(false)
    const [isExporting, setIsExporting] = useState(false)

    // Dynamic Data Selection based on Period
    const activeData = useMemo(() => DATA_BY_PERIOD[period as keyof typeof DATA_BY_PERIOD], [period])

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1500)),
            {
                loading: 'Synchronizing fiscal ledger...',
                success: 'Ledger synchronized with real-time data',
                error: 'Synchronization failed'
            }
        ).finally(() => setIsSyncing(false))
    }

    const handleExport = () => {
        setIsExporting(true)
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 2000)),
            {
                loading: 'Generating Pdf fiscal report...',
                success: 'Fiscal report exported successfully',
                error: 'Export failed'
            }
        ).finally(() => setIsExporting(false))
    }

    const handleAction = (msg: string) => {
        toast.promise(new Promise(r => setTimeout(r, 1200)), {
            loading: 'Processing fiscal request...',
            success: msg,
            error: 'Action failed'
        })
    }

    const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="px-6 py-6 font-outfit">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">Financial Reports</h1>
                            <p className="text-[14px] text-slate-500 font-medium mt-1">Fiscal health monitoring and revenue breakdown analysis</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm mr-2">
                                <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                                <select
                                    className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer text-slate-700 outline-none"
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                >
                                    <option value="monthly">Monthly View</option>
                                    <option value="quarterly">Quarterly View</option>
                                    <option value="yearly">Fiscal Year</option>
                                </select>
                            </div>
                            <Button
                                variant="outline"
                                className="h-10 px-5 rounded-lg border-slate-200 font-semibold bg-white shadow-sm gap-2"
                                onClick={handleSync}
                                disabled={isSyncing}
                            >
                                {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                {isSyncing ? "Syncing" : "Sync"}
                            </Button>
                            <Button
                                className="h-10 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm gap-2"
                                onClick={handleExport}
                                disabled={isExporting}
                            >
                                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                {isExporting ? "Exporting" : "Export Ledger"}
                            </Button>
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {activeData.metrics.map((metric: any, i: number) => (
                            <MetricCard key={i} {...metric} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Areas */}
            <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left & Center Main Content (8/12 Columns) */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Performance Trend Visualization */}
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                        <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between font-outfit">
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-900">Fiscal Performance Trend</CardTitle>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">Projected vs actual revenue growth across periods</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2 w-2 rounded-full bg-slate-100" />
                                    <span className="text-[11px] font-bold text-slate-400">Projected</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2 w-2 rounded-full bg-indigo-600" />
                                    <span className="text-[11px] font-bold text-indigo-600">Actual</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="h-[200px] w-full flex items-end justify-between gap-1 md:gap-2 font-outfit">
                                {[55, 40, 70, 50, 85, 65, 80, 95, 55, 75, 70, 90].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                                        <div className="w-full max-w-[32px] h-[160px] bg-slate-50/50 rounded-t-lg relative overflow-hidden mb-3">
                                            {/* Projected Ghost Bar */}
                                            <div className="w-full bg-indigo-50/40 absolute bottom-0 transition-all duration-300" style={{ height: `${h + 10}%` }}></div>

                                            {/* Actual Growth Bar */}
                                            <div className="w-full bg-gradient-to-t from-indigo-600 to-indigo-500 absolute bottom-0 transition-all duration-500 group-hover:from-indigo-400 shadow-md" style={{ height: `${h}%` }}>
                                                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-2xl whitespace-nowrap transition-all z-20 pointer-events-none">
                                                    +{h}%
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400">Period {i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Fiscal Tabbed Breakdown */}
                    <Tabs defaultValue="revenue" className="space-y-6 font-outfit">
                        <TabsList className="bg-white border border-slate-200 p-1 rounded-xl h-12 w-fit shadow-sm">
                            <TabsTrigger value="revenue" className="px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm font-bold text-sm h-full text-slate-400 transition-all">Revenue Allocation</TabsTrigger>
                            <TabsTrigger value="expenses" className="px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm font-bold text-sm h-full text-slate-400 transition-all">Expense Mapping</TabsTrigger>
                        </TabsList>

                        <TabsContent value="revenue">
                            <div className="grid grid-cols-1 gap-6">
                                <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50">
                                    <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-row items-center justify-between">
                                        <CardTitle className="text-xl font-bold text-slate-900">Revenue Performance by Stream</CardTitle>
                                        <Button variant="ghost" size="sm" className="text-xs font-bold text-indigo-600 hover:bg-indigo-50">Detailed Audit</Button>
                                    </CardHeader>
                                    <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                                        {activeData.revenueStreams.map((rev, i) => (
                                            <div key={i} className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <div className="space-y-1.5">
                                                        <h4 className="text-md font-bold text-slate-900 tracking-tight">{rev.source}</h4>
                                                        <Badge className="bg-emerald-50 text-emerald-600 border-0 text-[10px] font-bold px-2 py-0.5">Trend: {rev.growth}</Badge>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-semibold text-slate-900 tracking-tight">{fmt(rev.amount)}</p>
                                                        <p className="text-[10px] text-slate-400 font-semibold">Target: {fmt(rev.target)}</p>
                                                    </div>
                                                </div>
                                                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(rev.amount / rev.target) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="expenses">
                            <div className="grid grid-cols-1 gap-6">
                                <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50">
                                    <CardHeader className="px-8 py-6 border-b border-slate-100">
                                        <CardTitle className="text-xl font-bold text-slate-900">Expense Optimization Matrix</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {activeData.expenses.map((exp: any, i: number) => (
                                            <div key={i} className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-white hover:border-indigo-100 transition-all group cursor-pointer">
                                                <div className="space-y-1.5">
                                                    <h4 className="text-md font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{exp.category}</h4>
                                                    <Badge className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border-0 ${exp.status === 'Optimized' ? 'bg-emerald-100 text-emerald-700' :
                                                        exp.status === 'Scaling' ? 'bg-indigo-100 text-indigo-700' :
                                                            'bg-slate-200 text-slate-600'
                                                        }`}>{exp.status}</Badge>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-semibold text-slate-900 tracking-tight">{fmt(exp.amount)}</p>
                                                    <p className="text-[10px] font-semibold text-slate-400">{exp.percentage}% Share</p>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Recent Ledger Activity */}
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 overflow-hidden font-outfit">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 bg-white flex flex-row items-center justify-between">
                            <CardTitle className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-indigo-600" /> Recent Fiscal Journal
                            </CardTitle>
                            <Button variant="outline" className="text-[11px] font-bold border-slate-200 h-8 px-4">Export Log</Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400">Transaction Details</th>
                                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 text-center">Reference No.</th>
                                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 text-center">Condition</th>
                                            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 text-right">Magnitude</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {[
                                            { desc: "Institutional Payroll - Q1-P3", ref: "TXN-88022", status: "Settled", amount: "-$142,500", color: "blue" },
                                            { desc: "Enterprise Saas Subscription", ref: "TXN-88023", status: "Verified", amount: "+$89,200", color: "emerald" },
                                            { desc: "Cloud Infrastructure - Aws", ref: "TXN-88024", status: "Pending", amount: "-$4,120", color: "amber" },
                                            { desc: "Professional Services Retainer", ref: "TXN-88025", status: "Verified", amount: "+$12,000", color: "emerald" }
                                        ].map((act, i) => (
                                            <tr key={i} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                                                <td className="px-8 py-5">
                                                    <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{act.desc}</p>
                                                    <p className="text-[11px] text-slate-400 font-medium">Recorded Today</p>
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{act.ref}</span>
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className={`h-1.5 w-1.5 rounded-full bg-${act.color}-500 shadow-sm`} />
                                                        <span className="text-[11px] font-bold text-slate-600">{act.status}</span>
                                                    </div>
                                                </td>
                                                <td className={`px-8 py-5 text-right font-semibold text-sm ${act.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-900'}`}>{act.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Sidebar (4/12 Columns) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Fiscal Risk Score */}
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-900 p-8">
                        <h4 className="text-xl font-bold tracking-tight mb-2 font-outfit">Fiscal Risk Score</h4>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-16 w-16 rounded-2xl bg-white/50 border border-white flex items-center justify-center text-3xl font-bold font-outfit">A+</div>
                            <p className="text-indigo-700/70 text-[11px] font-medium leading-relaxed font-outfit">Excellent liquidity ratio and optimized debt-to-equity exposure maintained for this cycle.</p>
                        </div>
                        <Button className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 text-sm font-outfit" onClick={() => handleAction("Accessing deep audit archives...")}>
                            Deep Audit Report
                        </Button>
                    </Card>

                    {/* Burn Rate & Runway Card */}
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 p-8 bg-white font-outfit">
                        <div className="flex items-center justify-between mb-8">
                            <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-orange-500" />
                            </div>
                            <Badge className="bg-orange-50 text-orange-600 border-0 text-[10px] font-bold">Live Status</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-1.5 border-l-2 border-orange-500/20 pl-4">
                                <p className="text-[10px] font-semibold text-slate-400">Actual Burn</p>
                                <p className="text-2xl font-semibold text-slate-900">{(activeData as any).burnRate}</p>
                            </div>
                            <div className="space-y-1.5 border-l-2 border-emerald-500/20 pl-4">
                                <p className="text-[10px] font-semibold text-slate-400">Cash Runway</p>
                                <p className="text-2xl font-semibold text-slate-900">{(activeData as any).runway}</p>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-50">
                            <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">Strategic health is within optimal parameters. Runway exceeds tactical targets.</p>
                        </div>
                    </Card>

                    {/* Top Strategic Partners */}
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 overflow-hidden font-outfit">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 bg-white">
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Layers className="w-4 h-4 text-indigo-500" /> Strategic Partners
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6 bg-white">
                            {(activeData as any).vendors.map((vendor: any, i: number) => (
                                <div key={i} className="flex justify-between items-center group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                            <HardDrive className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors tracking-tight">{vendor.name}</p>
                                            <p className="text-[10px] font-bold text-slate-300">{vendor.type}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-slate-900 tracking-tight">{vendor.amount}</p>
                                        <p className="text-[10px] font-semibold text-emerald-600">Share: {vendor.share}%</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Proactive Fiscal Alert */}
                    <Card className="rounded-3xl border border-blue-100 shadow-xl shadow-blue-700/5 bg-gradient-to-br from-blue-50 to-white overflow-hidden group">
                        <CardContent className="p-8 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" />
                                <span className="text-[10px] font-bold text-blue-600 font-outfit">Fiscal Alert</span>
                            </div>
                            <h4 className="text-[16px] font-bold leading-tight text-slate-900 font-outfit">Corporate Tax Filing Phase Begins In 12 Days.</h4>
                            <p className="text-[12px] text-slate-500 font-medium leading-relaxed font-outfit">Ensure all operational expense receipts for the current month are attached before the reconciliation lock date.</p>
                            <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold h-10 rounded-xl mt-2 transition-all shadow-lg shadow-blue-200">Prepare Tax Ledger</Button>
                        </CardContent>
                    </Card>

                    {/* Compliance and Tax Status */}
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 p-7 space-y-5 bg-white font-outfit">
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h4 className="text-md font-bold text-slate-900 tracking-tight">Tax Compliance</h4>
                        </div>
                        <p className="text-[12px] text-slate-500 font-medium leading-relaxed">Current filing is <span className="text-emerald-600 font-bold">In Compliance</span>. No outstanding audits detected for this fiscal period.</p>
                        <Button variant="outline" className="w-full h-10 rounded-xl border-slate-100 font-bold text-slate-600 hover:bg-slate-50 text-[11px]" onClick={() => handleAction("Opening digital tax certificate portal...")}>View Certificates</Button>
                    </Card>
                </div>
            </div>
        </div>
    )
}
