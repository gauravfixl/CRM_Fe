"use client"

import { useState, useMemo, useEffect } from "react"
import {
    Plus, Search, RefreshCw, Download, Layers,
    TrendingUp, TrendingDown, Users, Calendar,
    BarChart3, LineChart, ArrowUpRight, ArrowDownRight,
    Target, UserMinus, ShieldCheck, Zap,
    AlertCircle, Clock, ShieldX, X, Mail, MessageSquare,
    Phone, PhoneCall, ExternalLink
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { toast } from "@/shared/utils/toast"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { motion, AnimatePresence } from "framer-motion"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/shared/components/ui/dialog"

// Mock data generator for dynamic values
const getChurnStats = (range: string) => {
    const factor = range === "7" ? 1.05 : range === "90" ? 0.9 : range === "365" ? 0.8 : 1.0
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].slice(0, range === "365" ? 8 : 6)
    return months.map((m, i) => ({
        month: m,
        retention: (98 + Math.random() * 1.5) * factor,
        churn: (1.5 + Math.random() * 1) / factor,
        nrr: (105 + i * 1.5) * factor
    }))
}

const AT_RISK_CLIENTS_DATA = [
    { id: "CL-842", name: "Apex Systems", score: 84, reason: "Inactive for 14 days", mrr: 2400, risk: "High", contact: "sarah@apex.io", category: "Usage" },
    { id: "CL-521", name: "Velocity Group", score: 62, reason: "Payment failure", mrr: 1800, risk: "Medium", contact: "mike@velocity.com", category: "Billing" },
    { id: "CL-109", name: "Pioneer Tech", score: 55, reason: "Declining usage", mrr: 4500, risk: "Medium", contact: "admin@pioneer.tech", category: "Adoption" },
    { id: "CL-931", name: "Summit Media", score: 92, reason: "Manual downgrade", mrr: 1200, risk: "Critical", contact: "lee@summit.media", category: "Downgrade" },
    { id: "CL-408", name: "Nexus Design", score: 48, reason: "Support escalation", mrr: 3100, risk: "Medium", contact: "art@nexus.design", category: "Support" },
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

export default function RetentionChurnPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [timeRange, setTimeRange] = useState("30")
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [churnStats, setChurnStats] = useState(getChurnStats("30"))
    const [atRiskClients, setAtRiskClients] = useState(AT_RISK_CLIENTS_DATA)
    const [selectedClient, setSelectedClient] = useState<any>(null)
    const [isReachOutOpen, setIsReachOutOpen] = useState(false)
    const [selectedChannel, setSelectedChannel] = useState("Email")

    useEffect(() => {
        setChurnStats(getChurnStats(timeRange))
    }, [timeRange])

    const topStats = useMemo(() => {
        const factor = timeRange === "7" ? 1.1 : timeRange === "90" ? 0.95 : timeRange === "365" ? 0.85 : 1.0
        return [
            { label: "Net revenue retention", value: (112.5 * factor).toFixed(1) + "%", trend: "+5.7%", trendUp: true, icon: ShieldCheck, bg: "bg-indigo-50/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-100/50" },
            { label: "Gross churn rate", value: (0.8 / factor).toFixed(2) + "%", trend: "-0.4%", trendUp: true, icon: UserMinus, bg: "bg-rose-50/50", iconBg: "bg-rose-100", iconColor: "text-rose-600", border: "border-rose-100/50" },
            { label: "Client retention rate", value: "99.2%", trend: "+1.1%", trendUp: true, icon: Users, bg: "bg-emerald-50/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-100/50" },
            { label: "Avg lifetime value", value: "$" + (42.4 * factor).toFixed(1) + "k", trend: "+$2.1k", trendUp: true, icon: TrendingUp, bg: "bg-violet-50/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-100/50" },
        ]
    }, [timeRange])

    const handleRefresh = () => {
        setIsRefreshing(true)
        toast.promise(new Promise(r => setTimeout(r, 1500)), {
            loading: "Calculating churn risk factors...",
            success: "Retention analysis updated",
            error: "Failed to sync retention metrics"
        })
        setTimeout(() => {
            setChurnStats(getChurnStats(timeRange))
            setIsRefreshing(false)
        }, 1500)
    }

    const handleReachOutClick = (client: any) => {
        setSelectedClient(client)
        setIsReachOutOpen(true)
    }

    const sendOutreach = () => {
        if (!selectedClient) return

        toast.promise(new Promise(r => setTimeout(r, 1500)), {
            loading: `Sending personalized outreach to ${selectedClient.name}...`,
            success: "Outreach message delivered",
            error: "Connectivity error"
        })

        setTimeout(() => {
            setAtRiskClients(prev => prev.map(c => c.id === selectedClient.id ? { ...c, risk: "Low", score: 20 } : c))
            setIsReachOutOpen(false)
        }, 1500)
    }

    const handleExport = () => {
        const csv = [
            ["ID", "Name", "Risk Score", "Reason", "MRR", "Risk Level"],
            ...atRiskClients.map(c => [c.id, c.name, c.score, c.reason, c.mrr, c.risk])
        ].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "retention-analysis.csv"
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Retention data exported successfully")
    }

    const fmt = (val: number, isPercent = false) => {
        if (isPercent) return val.toFixed(1) + "%"
        if (val >= 1000) return "$" + (val / 1000).toFixed(1) + "k"
        return "$" + val
    }

    const filteredRisk = useMemo(() => {
        return atRiskClients.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.reason.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [searchQuery, atRiskClients])

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-50">
                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">{label}</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        <p className="text-[13px] font-bold text-slate-900">
                            NRR: <span className="text-indigo-600 font-semibold">{payload[0].value.toFixed(1)}%</span>
                        </p>
                    </div>
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
                    <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Retention <span className="text-indigo-600">&amp; churn</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Monitor client health, revenue retention, and churn prevention metrics</p>
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
                            <SelectItem value="365">Last 1 year</SelectItem>
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

            {/* Visual Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card className="rounded-[28px] border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden h-[450px]">
                        <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-900">Retention trend</CardTitle>
                                <p className="text-xs font-semibold text-slate-400 mt-0.5">Net revenue retention over time</p>
                            </div>
                            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div><span className="text-[11px] font-bold text-slate-500">NRR %</span></div>
                        </CardHeader>
                        <CardContent className="h-[350px] p-8 relative">
                            {isRefreshing && (
                                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-b-[28px]">
                                    <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                                </div>
                            )}
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={churnStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                                        domain={[0, 140]}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                                    <Bar
                                        dataKey="nrr"
                                        radius={[8, 8, 0, 0]}
                                        barSize={40}
                                        animationDuration={1500}
                                    >
                                        {churnStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === churnStats.length - 1 ? '#6366f1' : '#e0e7ff'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="rounded-[28px] border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden h-[450px]">
                        <CardHeader className="px-8 py-6 border-b border-slate-50">
                            <CardTitle className="text-lg font-bold text-slate-900">Common churn reasons</CardTitle>
                            <p className="text-xs font-semibold text-slate-400 mt-0.5">Primary drivers of attrition</p>
                        </CardHeader>
                        <CardContent className="p-8 space-y-7">
                            {[
                                { label: "Price sensitivity", impact: "34%", count: 12, color: "bg-rose-500" },
                                { label: "Feature gap", impact: "28%", count: 10, color: "bg-amber-500" },
                                { label: "Product adoption", impact: "22%", count: 8, color: "bg-indigo-500" },
                                { label: "Customer service", impact: "16%", count: 6, color: "bg-teal-500" },
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-700">{item.label}</span>
                                        <span className="text-[10px] font-bold text-slate-400">{item.impact}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: item.impact }}
                                            transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                            className={`h-full ${item.color} rounded-full`}
                                        ></motion.div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* At-Risk Clients Table */}
            <motion.div variants={itemVariants}>
                <Card className="rounded-[28px] border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                    <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-lg font-bold text-slate-900">At-risk clients <span className="text-slate-400 text-sm font-semibold ml-2">({filteredRisk.length})</span></CardTitle>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input
                                placeholder="Find clients at risk..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 h-11 bg-slate-50 border-0 rounded-xl text-sm font-semibold focus-visible:ring-1 focus-visible:ring-indigo-500"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-400">
                                        <th className="px-8 py-5 text-[11px] font-bold tracking-wider">Client name</th>
                                        <th className="px-6 py-5 text-[11px] font-bold tracking-wider">Health score</th>
                                        <th className="px-6 py-5 text-[11px] font-bold tracking-wider">Reason for risk</th>
                                        <th className="px-6 py-5 text-[11px] font-bold tracking-wider">Impact (mrr)</th>
                                        <th className="px-6 py-5 text-[11px] font-bold tracking-wider">Risk level</th>
                                        <th className="px-8 py-5 text-[11px] font-bold tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <AnimatePresence mode="popLayout">
                                        {filteredRisk.map((c, idx) => (
                                            <motion.tr
                                                key={c.id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                                className="group hover:bg-rose-50/20 transition-colors"
                                            >
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs ${c.risk === "Critical" ? "bg-rose-100 text-rose-600" :
                                                            c.risk === "Low" ? "bg-emerald-100 text-emerald-600" : "bg-indigo-100 text-indigo-600"
                                                            }`}>{c.name.substring(0, 2)}</div>
                                                        <div>
                                                            <p className="text-[13px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{c.name}</p>
                                                            <p className="text-[11px] font-semibold text-slate-400">{c.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden shrink-0">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${c.score}%` }}
                                                                transition={{ duration: 1, delay: 0.8 }}
                                                                className={`h-full rounded-full ${c.score > 80 ? "bg-rose-500" : c.score > 60 ? "bg-amber-500" : "bg-emerald-500"
                                                                    }`}
                                                            ></motion.div>
                                                        </div>
                                                        <span className="text-[12px] font-bold text-slate-600">{c.score}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-[13px] font-semibold text-slate-600">{c.reason}</td>
                                                <td className="px-6 py-5 text-[13px] font-bold text-slate-900">{fmt(c.mrr)}</td>
                                                <td className="px-6 py-5">
                                                    <Badge className={`rounded-lg px-2 py-1 text-[10px] font-bold shadow-none border-0 ${c.risk === "Critical" ? "bg-rose-100 text-rose-600" :
                                                        c.risk === "High" ? "bg-amber-100 text-amber-600" :
                                                            c.risk === "Low" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-600"
                                                        }`}>
                                                        {c.risk}
                                                    </Badge>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <Button variant="ghost" size="sm" className="h-9 rounded-xl font-bold text-xs text-indigo-600 hover:bg-indigo-50" onClick={() => handleReachOutClick(c)}>Reach out</Button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                    {filteredRisk.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <ShieldCheck className="w-10 h-10 text-emerald-100 mb-3" />
                                                    <p className="text-sm font-medium text-slate-500">Great news! No high-risk clients found.</p>
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

            {/* Reach out Dialog */}
            <Dialog open={isReachOutOpen} onOpenChange={setIsReachOutOpen}>
                <DialogContent className="sm:max-w-[550px] rounded-[32px] border-0 shadow-2xl p-0 overflow-hidden font-outfit">
                    <div className="bg-indigo-50/50 h-28 relative flex items-center px-8 border-b border-indigo-100">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Client outreach</h2>
                                <p className="text-indigo-600 text-xs font-bold tracking-wider">Prevention protocol</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-8 space-y-6">
                        <div className="flex items-start gap-4 p-5 bg-rose-50/50 rounded-2xl border border-rose-100">
                            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-[13px] font-bold text-slate-900">{selectedClient?.name} is at {selectedClient?.risk} focus</h4>
                                <p className="text-xs font-medium text-slate-500 leading-relaxed mt-1">Churn detected due to {selectedClient?.reason}. We recommend an immediate intervention.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[11px] font-bold text-slate-400 tracking-widest px-1">Select channel</h4>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { icon: Mail, label: "Email", color: "text-indigo-600", activeBg: "bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100" },
                                    { icon: PhoneCall, label: "Call", color: "text-emerald-600", activeBg: "bg-emerald-50 border-emerald-200 ring-2 ring-emerald-100" },
                                    { icon: MessageSquare, label: "In-app", color: "text-amber-600", activeBg: "bg-amber-50 border-amber-200 ring-2 ring-amber-100" },
                                ].map((channel, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedChannel(channel.label)}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${selectedChannel === channel.label
                                            ? channel.activeBg
                                            : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                                            }`}
                                    >
                                        <channel.icon className={`w-5 h-5 ${channel.color}`} />
                                        <span className="text-[11px] font-bold text-slate-700">{channel.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-[11px] font-bold text-slate-400 tracking-widest px-1">
                                {selectedChannel === "Email" ? "Email template" : selectedChannel === "Call" ? "Call script & talking points" : "In-app notification"}
                            </h4>
                            <div className="relative group">
                                {selectedChannel === "Email" && (
                                    <>
                                        <Zap className="absolute right-4 top-4 text-amber-500 w-4 h-4 opacity-40" />
                                        <textarea
                                            key="email-tpl"
                                            className="w-full h-32 p-4 bg-slate-50 border-0 rounded-2xl text-[13px] font-medium text-slate-600 focus:ring-1 focus:ring-indigo-500 resize-none transition-all"
                                            defaultValue={`Subject: Checking in on your experience with our platform\n\nHi ${selectedClient?.name.split(' ')[0]},\n\nI noticed some changes in your recent usage patterns. I wanted to reach out and see if there is anything we can do to help you get more value from the platform...`}
                                        />
                                    </>
                                )}
                                {selectedChannel === "Call" && (
                                    <div key="call-tpl" className="w-full p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-3">
                                        <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                                            <PhoneCall className="w-3 h-3" /> Recommended script
                                        </div>
                                        <ul className="space-y-2">
                                            {[
                                                "Confirm if they are experiencing technical blockers",
                                                "Inquire about recent billing/payment issues",
                                                "Offer a 15-minute strategy review session",
                                                "Highlight new features relevant to their use case"
                                            ].map((point, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-[12px] text-slate-600 font-medium">
                                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {selectedChannel === "In-app" && (
                                    <div key="inapp-tpl" className="w-full p-4 bg-amber-50/50 border border-amber-100 rounded-2xl">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Push Notification Preview</span>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl shadow-sm border border-amber-100/50">
                                            <p className="text-[13px] font-bold text-slate-900">Support Check-in</p>
                                            <p className="text-[11px] text-slate-500 mt-0.5">Hi {selectedClient?.name.split(' ')[0]}, need any help with your account? We're here to assist!</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                className={`flex-1 h-12 rounded-xl font-bold text-sm shadow-xl transition-all ${selectedChannel === "Email" ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100" :
                                    selectedChannel === "Call" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100" :
                                        "bg-amber-500 hover:bg-amber-600 shadow-amber-100"
                                    }`}
                                onClick={sendOutreach}
                            >
                                {selectedChannel === "Call" ? <PhoneCall className="w-4 h-4 mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                                {selectedChannel === "Email" ? "Send email intervention" : selectedChannel === "Call" ? "Initiate client call" : "Send push notification"}
                            </Button>
                            <Button
                                variant="outline"
                                className="h-12 px-6 rounded-xl border-slate-200 font-bold text-sm hover:bg-slate-50 text-slate-600"
                                onClick={() => setIsReachOutOpen(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}
