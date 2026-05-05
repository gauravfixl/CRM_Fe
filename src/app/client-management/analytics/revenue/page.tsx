"use client"

import { useState, useMemo, useEffect } from "react"
import {
    Plus, Search, RefreshCw, Download, DollarSign,
    TrendingUp, TrendingDown, Activity, Calendar,
    BarChart3, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight,
    Target, LayoutDashboard, Filter, ChevronDown,
    MapPin, Globe, CreditCard, X, ExternalLink,
    Mail, Phone, Building2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { toast } from "@/shared/utils/toast"
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts'
import { motion, AnimatePresence } from "framer-motion"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog"

// Mock data generator for dynamic values
const getRevenueData = (range: string) => {
    const base = range === "30" ? 80000 : range === "90" ? 70000 : range === "7" ? 95000 : 50000
    const monthsCount = range === "all" ? 12 : range === "90" ? 6 : 4
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].slice(0, monthsCount)
    return months.map((m, i) => ({
        month: m,
        mrr: base + (i * 5000) + Math.random() * 5000,
        target: base + (i * 4500) + 4000
    }))
}

const SUBSCRIPTIONS_DATA = [
    { id: "SUB-001", client: "Acme Corp", plan: "Enterprise", mrr: 5000, status: "Active", billing: "Monthly", email: "contact@acme.com", phone: "+1 234 567 890", joined: "Jan 2024" },
    { id: "SUB-002", client: "Global Tech", plan: "Professional", mrr: 1200, status: "Active", billing: "Annual", email: "info@globaltech.io", phone: "+44 20 7946 0000", joined: "Mar 2024" },
    { id: "SUB-003", client: "Horizon Labs", plan: "Enterprise", mrr: 4500, status: "Active", billing: "Monthly", email: "billing@horizon.co", phone: "+1 888 432 1122", joined: "Feb 2024" },
    { id: "SUB-004", client: "Cloud Nine", plan: "Starter", mrr: 299, status: "Trialing", billing: "Monthly", email: "hello@cloudnine.com", phone: "+1 555 010 3344", joined: "Jun 2024" },
    { id: "SUB-005", client: "Nexus Inc", plan: "Professional", mrr: 1500, status: "Past Due", billing: "Monthly", email: "support@nexus.inc", phone: "+1 999 888 7766", joined: "Apr 2024" },
    { id: "SUB-006", client: "Starlight", plan: "Enterprise", mrr: 6000, status: "Active", billing: "Annual", email: "ops@starlight.com", phone: "+1 444 333 2221", joined: "May 2024" },
]

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

export default function RevenueMrrPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [timeRange, setTimeRange] = useState("30")
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [subscriptions, setSubscriptions] = useState(SUBSCRIPTIONS_DATA)
    const [revenueData, setRevenueData] = useState(getRevenueData("30"))
    const [selectedClient, setSelectedClient] = useState<any>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isConnectingPortal, setIsConnectingPortal] = useState(false)
    const [isPortalView, setIsPortalView] = useState(false)

    // Update charts when filters change
    useEffect(() => {
        setRevenueData(getRevenueData(timeRange))
    }, [timeRange])

    const stats = useMemo(() => {
        const factor = timeRange === "30" ? 1.0 : timeRange === "90" ? 0.85 : timeRange === "7" ? 1.15 : 0.6
        const totalMrr = subscriptions.reduce((acc, sub) => acc + sub.mrr, 0) * factor
        return {
            mrr: totalMrr,
            arr: totalMrr * 12,
            avgRevenue: totalMrr / subscriptions.length,
            growth: (7.4 * factor).toFixed(1),
        }
    }, [subscriptions, timeRange])

    const pieData = useMemo(() => {
        const plans = ["Enterprise", "Professional", "Starter"]
        const colors = ["#6366f1", "#2dd4bf", "#fbbf24"]
        return plans.map((p, i) => ({
            name: p,
            value: subscriptions.filter(s => s.plan === p).reduce((acc, curr) => acc + curr.mrr, 0),
            color: colors[i]
        }))
    }, [subscriptions])

    const filteredSubscriptions = useMemo(() => {
        return subscriptions.filter(sub =>
            sub.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.plan.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [searchQuery, subscriptions])

    const handleRefresh = () => {
        setIsRefreshing(true)
        toast.promise(new Promise(r => setTimeout(r, 1200)), {
            loading: "Recalculating revenue metrics...",
            success: "Metrics updated for current month",
            error: "Failed to sync billing data"
        })
        setTimeout(() => {
            setRevenueData(getRevenueData(timeRange))
            setIsRefreshing(false)
        }, 1200)
    }

    const handleExport = () => {
        const csv = [
            ["ID", "Client", "Plan", "MRR", "Status", "Billing"],
            ...subscriptions.map(s => [s.id, s.client, s.plan, s.mrr, s.status, s.billing])
        ].map(r => r.join(",")).join("\n")

        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "revenue-report.csv"
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Revenue report exported")
    }

    const handleViewDetails = (client: any) => {
        setSelectedClient(client)
        setIsDetailsOpen(true)
    }

    const fmt = (val: number) => {
        if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
        if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`
        return `$${val.toFixed(0)}`
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-50">
                    <p className="text-xs font-bold text-slate-400 mb-2 tracking-wider">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                            <p className="text-[13px] font-bold text-slate-900">
                                {entry.name}: <span className="text-indigo-600 font-semibold">{fmt(entry.value)}</span>
                            </p>
                        </div>
                    ))}
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
                    <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Revenue <span className="text-indigo-600">&amp; mrr</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Track recurring revenue growth and subscription performance</p>
                </motion.div>
                <div className="flex items-center gap-3">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="h-11 w-44 rounded-xl border-slate-200 bg-white font-bold text-slate-700 shadow-sm gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="7">Last 7 days</SelectItem>
                            <SelectItem value="30">Last 30 days</SelectItem>
                            <SelectItem value="90">Last 90 days</SelectItem>
                            <SelectItem value="all">All time</SelectItem>
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
                {[
                    { label: "Monthly recurring revenue", value: fmt(stats.mrr), trend: "+7.4%", trendUp: true, icon: DollarSign, bg: "bg-indigo-50/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-100/50" },
                    { label: "Annual recurring revenue", value: fmt(stats.arr), trend: "+6.1%", trendUp: true, icon: TrendingUp, bg: "bg-emerald-50/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-100/50" },
                    { label: "Average revenue per client", value: fmt(stats.avgRevenue), trend: "+2.8%", trendUp: true, icon: Activity, bg: "bg-violet-50/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-100/50" },
                    { label: "Net revenue growth", value: `${stats.growth}%`, trend: "-0.5%", trendUp: false, icon: BarChart3, bg: "bg-amber-50/50", iconBg: "bg-amber-100", iconColor: "text-amber-600", border: "border-amber-100/50" },
                ].map((stat, i) => (
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

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card className="rounded-[28px] border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden h-[480px]">
                        <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-900">Revenue trend</CardTitle>
                                <p className="text-xs font-semibold text-slate-400 mt-0.5">Monthly recurring revenue growth</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div><span className="text-[11px] font-bold text-slate-500">MRR</span></div>
                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-teal-400"></div><span className="text-[11px] font-bold text-slate-500">Target</span></div>
                            </div>
                        </CardHeader>
                        <CardContent className="h-[380px] p-8 relative">
                            {isRefreshing && (
                                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-b-[28px]">
                                    <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                                </div>
                            )}
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
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
                                        dataKey="mrr"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorMrr)"
                                        animationDuration={1500}
                                        name="MRR"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="target"
                                        stroke="#2dd4bf"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        fill="transparent"
                                        animationDuration={1500}
                                        name="Target"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="rounded-[28px] border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden h-[480px]">
                        <CardHeader className="px-8 py-6 border-b border-slate-50">
                            <CardTitle className="text-lg font-bold text-slate-900">Plan distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="h-[200px] relative flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={85}
                                            paddingAngle={5}
                                            dataKey="value"
                                            animationBegin={400}
                                            animationDuration={1200}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute flex flex-col items-center justify-center pointer-events-none translate-y-2">
                                    <span className="text-2xl font-bold text-slate-900 leading-tight">{subscriptions.length}</span>
                                    <span className="text-[10px] font-bold text-slate-400 tracking-wider">TOTAL</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {pieData.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl border border-slate-50 hover:border-slate-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900">{p.name}</p>
                                                <p className="text-[10px] font-semibold text-slate-400">{subscriptions.filter(s => s.plan === p.name).length} active</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-slate-700">{fmt(p.value)}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* List Section */}
            <motion.div variants={itemVariants}>
                <Card className="rounded-[28px] border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                    <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-lg font-bold text-slate-900">Subscription breakdown</CardTitle>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input
                                placeholder="Find clients or plans..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 h-11 bg-slate-50 border-0 rounded-xl text-sm font-semibold focus-visible:ring-1 focus-visible:ring-indigo-500"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-8 py-5 text-[11px] font-bold text-slate-400 tracking-wider">Client name</th>
                                        <th className="px-6 py-5 text-[11px] font-bold text-slate-400 tracking-wider">Plan type</th>
                                        <th className="px-6 py-5 text-[11px] font-bold text-slate-400 tracking-wider">MRR</th>
                                        <th className="px-6 py-5 text-[11px] font-bold text-slate-400 tracking-wider">Billing cycle</th>
                                        <th className="px-6 py-5 text-[11px] font-bold text-slate-400 tracking-wider">Status</th>
                                        <th className="px-8 py-5 text-[11px] font-bold text-slate-400 tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <AnimatePresence mode="popLayout">
                                        {filteredSubscriptions.map((sub, idx) => (
                                            <motion.tr
                                                key={sub.id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                                className="group hover:bg-indigo-50/30 transition-colors"
                                            >
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">{sub.client.substring(0, 2)}</div>
                                                        <div>
                                                            <p className="text-[13px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{sub.client}</p>
                                                            <p className="text-[11px] font-semibold text-slate-400">{sub.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-[13px] font-semibold text-slate-600">{sub.plan}</td>
                                                <td className="px-6 py-5 text-[13px] font-bold text-slate-900">{fmt(sub.mrr)}</td>
                                                <td className="px-6 py-5 text-[13px] font-semibold text-slate-600">{sub.billing}</td>
                                                <td className="px-6 py-5">
                                                    <Badge className={`rounded-lg px-2 py-1 text-[10px] font-bold shadow-none border-0 ${sub.status === "Active" ? "bg-emerald-50 text-emerald-600" :
                                                        sub.status === "Past Due" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                                                        }`}>
                                                        {sub.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <Button variant="ghost" size="sm" className="h-9 rounded-xl font-bold text-xs text-indigo-600 hover:bg-indigo-50" onClick={() => handleViewDetails(sub)}>View details</Button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                    {filteredSubscriptions.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-16 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3"><Search className="w-5 h-5 text-slate-300" /></div>
                                                    <p className="text-sm font-medium text-slate-400">No subscriptions found matching your search</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Client Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={(open) => {
                setIsDetailsOpen(open)
                if (!open) {
                    setIsPortalView(false)
                    setIsConnectingPortal(false)
                }
            }}>
                <DialogContent className="sm:max-w-[500px] rounded-[32px] border-0 shadow-2xl p-0 overflow-hidden font-outfit">
                    <AnimatePresence mode="wait">
                        {!isPortalView ? (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <div className="bg-indigo-600 h-32 relative">
                                    <div className="absolute -bottom-10 left-8 h-20 w-20 rounded-3xl bg-white shadow-xl flex items-center justify-center border-4 border-white">
                                        <span className="text-2xl font-bold text-indigo-600">{selectedClient?.client.substring(0, 2)}</span>
                                    </div>

                                </div>
                                <div className="px-8 pt-14 pb-8 space-y-6">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-2xl font-bold text-slate-900">{selectedClient?.client}</h2>
                                            <Badge className="bg-indigo-50 text-indigo-600 border-0 rounded-lg py-1 px-2.5 text-[10px] font-bold">{selectedClient?.plan}</Badge>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-400 mt-0.5">Customer ID: {selectedClient?.id}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                                            <p className="text-[10px] font-bold text-slate-400 tracking-wider">Monthly revenue</p>
                                            <p className="text-xl font-bold text-slate-900">{fmt(selectedClient?.mrr || 0)}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                                            <p className="text-[10px] font-bold text-slate-400 tracking-wider">Billing cycle</p>
                                            <p className="text-[15px] font-bold text-slate-700">{selectedClient?.billing}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        <h4 className="text-[11px] font-bold text-slate-400 tracking-widest border-b border-slate-50 pb-2">Contact information</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <Mail className="w-4 h-4 text-slate-300" />
                                                <span className="text-[13px] font-semibold">{selectedClient?.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <Phone className="w-4 h-4 text-slate-300" />
                                                <span className="text-[13px] font-semibold">{selectedClient?.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <Building2 className="w-4 h-4 text-slate-300" />
                                                <span className="text-[13px] font-semibold">Active since {selectedClient?.joined}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-sm shadow-xl shadow-indigo-100 disabled:opacity-70"
                                            disabled={isConnectingPortal}
                                            onClick={() => {
                                                setIsConnectingPortal(true)
                                                toast.promise(new Promise(r => setTimeout(r, 1500)), {
                                                    loading: "Connecting to management portal...",
                                                    success: "Portal opened successfully",
                                                    error: "Failed to connect"
                                                })
                                                setTimeout(() => {
                                                    setIsConnectingPortal(false)
                                                    setIsPortalView(true)
                                                }, 1500)
                                            }}
                                        >
                                            {isConnectingPortal ? (
                                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                            )}
                                            {isConnectingPortal ? "Connecting..." : "Manage account"}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-12 px-6 rounded-xl border-slate-200 font-bold text-sm hover:bg-slate-50"
                                            onClick={() => setIsDetailsOpen(false)}
                                        >
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="portal"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-8 space-y-7"
                            >
                                <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                                            <LayoutDashboard className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">{selectedClient?.client}</h3>
                                            <p className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase">{selectedClient?.plan} ACCOUNT</p>
                                        </div>
                                    </div>

                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[11px] font-bold text-slate-400 tracking-widest px-1">Subscription management</h4>
                                    <div className="space-y-3">
                                        {[
                                            { label: "Upgrade subscription plan", icon: TrendingUp },
                                            { label: "View billing history", icon: CreditCard },
                                            { label: "Update payment method", icon: CreditCard },
                                            { label: "Download latest invoice", icon: Download },
                                        ].map((action, i) => (
                                            <Button
                                                key={i}
                                                variant="outline"
                                                className="w-full h-14 rounded-2xl border-slate-100 bg-white hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-600 transition-all justify-between px-6 font-bold text-[13px]"
                                                onClick={() => toast.success(`${action.label} portal opened`)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <action.icon className="w-4 h-4 text-slate-400" />
                                                    {action.label}
                                                </div>
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12 rounded-xl border-slate-200 font-bold text-sm hover:bg-slate-50"
                                        onClick={() => setIsPortalView(false)}
                                    >
                                        Back to details
                                    </Button>
                                    <Button
                                        className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-black font-bold text-sm text-white"
                                        onClick={() => setIsDetailsOpen(false)}
                                    >
                                        Done
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}
