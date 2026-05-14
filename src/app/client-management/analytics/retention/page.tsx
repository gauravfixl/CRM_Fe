"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Search, RefreshCw, Download,
    TrendingUp, Users, Calendar,
    ArrowUpRight, ArrowDownRight,
    UserMinus, ShieldCheck, Zap,
    AlertCircle, Mail, MessageSquare, PhoneCall,
    Filter
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { toast } from "@/shared/utils/toast"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'

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

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    email: (v: string) => v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email" : "",
}

export default function RetentionChurnPage() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [timeRange, setTimeRange] = useState("30")
    const [riskFilter, setRiskFilter] = useState("all")
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [churnStats, setChurnStats] = useState(getChurnStats("30"))
    const [atRiskClients, setAtRiskClients] = useState(AT_RISK_CLIENTS_DATA)

    const [selectedClient, setSelectedClient] = useState<any>(null)
    const [isReachOutOpen, setIsReachOutOpen] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [selectedChannel, setSelectedChannel] = useState("Email")

    const [outreachForm, setOutreachForm] = useState({ subject: "", message: "", contactEmail: "" })
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        setChurnStats(getChurnStats(timeRange))
    }, [timeRange])

    const topStats = useMemo(() => {
        const factor = timeRange === "7" ? 1.1 : timeRange === "90" ? 0.95 : timeRange === "365" ? 0.85 : 1.0
        return [
            { label: "Net revenue retention", value: (112.5 * factor).toFixed(1) + "%", trend: "+5.7%", trendUp: true, icon: ShieldCheck, bg: "bg-indigo-50/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-100", path: "/client-management/revenue/renewals" },
            { label: "Gross churn rate", value: (0.8 / factor).toFixed(2) + "%", trend: "-0.4%", trendUp: true, icon: UserMinus, bg: "bg-rose-50/50", iconBg: "bg-rose-100", iconColor: "text-rose-600", border: "border-rose-100", path: "/client-management/customers" },
            { label: "Client retention rate", value: "99.2%", trend: "+1.1%", trendUp: true, icon: Users, bg: "bg-emerald-50/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-100", path: "/client-management/analytics/cohorts" },
            { label: "Avg lifetime value", value: "$" + (42.4 * factor).toFixed(1) + "k", trend: "+$2.1k", trendUp: true, icon: TrendingUp, bg: "bg-violet-50/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-100", path: "/client-management/analytics/forecasting" },
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

    const handleExport = () => {
        toast.success("Report exported")
    }

    const openReachOut = (client: any) => {
        setSelectedClient(client)
        setOutreachForm({
            subject: `Checking in on your experience`,
            message: `Hi ${client.name.split(' ')[0]},\n\nI noticed some changes in your recent usage patterns. We'd like to ensure you're getting full value from the platform...`,
            contactEmail: client.contact
        })
        setErrors({})
        setSelectedChannel("Email")
        setIsReachOutOpen(true)
    }

    const openDetail = (client: any) => {
        setSelectedClient(client)
        setIsDetailOpen(true)
    }

    const setField = (f: string, v: any) => {
        setOutreachForm(prev => ({ ...prev, [f]: v }))
        if (errors[f]) setErrors(prev => { const c = { ...prev }; delete c[f]; return c })
    }

    const validateForm = (): boolean => {
        const errs: Record<string, string> = {}
        errs.contactEmail = validators.required(outreachForm.contactEmail) || validators.email(outreachForm.contactEmail)
        if (selectedChannel === "Email") {
            errs.subject = validators.required(outreachForm.subject) || validators.minLen(3)(outreachForm.subject)
            errs.message = validators.required(outreachForm.message) || validators.minLen(10)(outreachForm.message)
        } else {
            errs.message = validators.required(outreachForm.message) || validators.minLen(10)(outreachForm.message)
        }
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const sendOutreach = () => {
        if (!selectedClient) return
        if (!validateForm()) { toast.error("Please correct the highlighted fields"); return }

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

    const fmt = (val: number) => {
        if (val >= 1000) return "$" + (val / 1000).toFixed(1) + "k"
        return "$" + val
    }

    const filteredRisk = useMemo(() => {
        return atRiskClients.filter(c => {
            const matchSearch = !searchQuery ||
                c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.reason.toLowerCase().includes(searchQuery.toLowerCase())
            const matchRisk = riskFilter === "all" || c.risk === riskFilter
            return matchSearch && matchRisk
        })
    }, [searchQuery, atRiskClients, riskFilter])

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-none shadow-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">{label}</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-none bg-indigo-500"></div>
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
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Retention <span className="text-indigo-600">&amp; churn</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Monitor client health, revenue retention, and churn prevention metrics</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <Select value={timeRange} onValueChange={(v) => { setTimeRange(v); toast.success("Period updated") }}>
                        <SelectTrigger className="h-11 w-44 rounded-none border-slate-200 bg-white font-bold text-slate-700 shadow-sm gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="7">Last 7 days</SelectItem>
                            <SelectItem value="30">Last 30 days</SelectItem>
                            <SelectItem value="90">Last 90 days</SelectItem>
                            <SelectItem value="365">Last 1 year</SelectItem>
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

            {/* KPI Cards (clickable) */}
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

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="rounded-none border border-slate-100 shadow-sm bg-white overflow-hidden h-[450px] lg:col-span-2">
                    <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-900">Retention trend</CardTitle>
                            <p className="text-xs font-semibold text-slate-400 mt-0.5">Net revenue retention over time</p>
                        </div>
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-none bg-indigo-500"></div><span className="text-[11px] font-bold text-slate-500">NRR %</span></div>
                    </CardHeader>
                    <CardContent className="h-[350px] p-8 relative">
                        {isRefreshing && (
                            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                                <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                            </div>
                        )}
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={churnStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} domain={[0, 140]} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="nrr" barSize={40} animationDuration={1500}>
                                    {churnStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === churnStats.length - 1 ? '#6366f1' : '#e0e7ff'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="rounded-none border border-slate-100 shadow-sm bg-white overflow-hidden h-[450px]">
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
                            <div key={i} className="space-y-2 cursor-pointer" onClick={() => toast.info(`${item.label}: ${item.impact} of churn (${item.count} accounts)`)}>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700">{item.label}</span>
                                    <span className="text-[10px] font-bold text-slate-400">{item.impact}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 overflow-hidden">
                                    <div style={{ width: item.impact }} className={`h-full ${item.color}`}></div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* At-Risk Clients Table */}
            <Card className="rounded-none border border-slate-100 shadow-sm bg-white overflow-hidden">
                <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle className="text-lg font-bold text-slate-900">At-risk clients <span className="text-slate-400 text-sm font-semibold ml-2">({filteredRisk.length})</span></CardTitle>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            placeholder="Find clients at risk..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 h-11 bg-slate-50 border-0 rounded-none text-sm font-semibold focus-visible:ring-1 focus-visible:ring-indigo-500"
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
                                {filteredRisk.map((c) => (
                                    <tr key={c.id} className="group hover:bg-rose-50/20 transition-colors cursor-pointer" onClick={() => openDetail(c)}>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-9 w-9 rounded-none flex items-center justify-center font-bold text-xs ${c.risk === "Critical" ? "bg-rose-100 text-rose-600" :
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
                                                <div className="w-16 h-1.5 bg-slate-100 overflow-hidden shrink-0">
                                                    <div style={{ width: `${c.score}%` }} className={`h-full ${c.score > 80 ? "bg-rose-500" : c.score > 60 ? "bg-amber-500" : "bg-emerald-500"}`}></div>
                                                </div>
                                                <span className="text-[12px] font-bold text-slate-600">{c.score}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-[13px] font-semibold text-slate-600">{c.reason}</td>
                                        <td className="px-6 py-5 text-[13px] font-bold text-slate-900">{fmt(c.mrr)}</td>
                                        <td className="px-6 py-5">
                                            <Badge className={`rounded-none px-2 py-1 text-[10px] font-bold shadow-none border-0 ${c.risk === "Critical" ? "bg-rose-100 text-rose-600" :
                                                c.risk === "High" ? "bg-amber-100 text-amber-600" :
                                                    c.risk === "Low" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-600"
                                                }`}>
                                                {c.risk}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                                            <Button variant="ghost" size="sm" className="h-9 rounded-none font-bold text-xs text-indigo-600 hover:bg-indigo-50" onClick={() => openReachOut(c)}>Reach out</Button>
                                        </td>
                                    </tr>
                                ))}
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

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-rose-50 to-amber-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">At-risk client details</SheetTitle>
                        <p className="text-[12px] text-slate-500">Health diagnostics and recovery recommendation.</p>
                    </SheetHeader>
                    {selectedClient && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-5">
                                <div className="flex items-center gap-4">
                                    <div className={`h-14 w-14 rounded-none flex items-center justify-center text-xl font-bold ${selectedClient.risk === "Critical" ? "bg-rose-100 text-rose-600 border border-rose-200" :
                                        selectedClient.risk === "Low" ? "bg-emerald-100 text-emerald-600 border border-emerald-200" : "bg-indigo-100 text-indigo-600 border border-indigo-200"}`}>
                                        {selectedClient.name.substring(0, 2)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-lg font-bold text-slate-900">{selectedClient.name}</h2>
                                            <Badge className={`rounded-none text-[10px] font-bold ${selectedClient.risk === "Critical" ? "bg-rose-100 text-rose-600" :
                                                selectedClient.risk === "High" ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-600"}`}>{selectedClient.risk}</Badge>
                                        </div>
                                        <p className="text-xs font-semibold text-slate-400">{selectedClient.id} • {selectedClient.category}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 tracking-wider">HEALTH SCORE</p>
                                        <p className="text-xl font-bold text-slate-900 mt-1">{selectedClient.score}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 tracking-wider">MRR AT RISK</p>
                                        <p className="text-xl font-bold text-slate-900 mt-1">{fmt(selectedClient.mrr)}</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-none">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[12px] font-bold text-slate-900">Risk indicator</p>
                                            <p className="text-[12px] text-slate-600 mt-1">{selectedClient.reason}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <h4 className="text-[11px] font-bold text-slate-400 tracking-widest border-b border-slate-100 pb-2">CONTACT</h4>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Mail className="w-4 h-4 text-slate-300" />
                                        <span className="text-[13px] font-semibold">{selectedClient.contact}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsDetailOpen(false)}>Close</Button>
                                <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={() => { setIsDetailOpen(false); openReachOut(selectedClient) }}>
                                    <MessageSquare className="w-4 h-4 mr-2" /> Reach out
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>

            {/* Reach Out Sheet */}
            <Sheet open={isReachOutOpen} onOpenChange={setIsReachOutOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-emerald-50">
                        <SheetTitle className="text-[18px] font-semibold">Client outreach</SheetTitle>
                        <p className="text-[12px] text-slate-500">Prevention protocol for {selectedClient?.name}.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="p-4 bg-rose-50/50 rounded-none border border-rose-100 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[12px] font-bold text-slate-900">{selectedClient?.name} at {selectedClient?.risk} risk</p>
                                <p className="text-[11px] text-slate-500 mt-1">{selectedClient?.reason}</p>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Channel</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { icon: Mail, label: "Email" },
                                    { icon: PhoneCall, label: "Call" },
                                    { icon: MessageSquare, label: "In-app" },
                                ].map((channel, i) => {
                                    const Icon = channel.icon
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedChannel(channel.label)}
                                            className={`flex flex-col items-center gap-1.5 p-3 rounded-none border transition-all ${selectedChannel === channel.label
                                                ? "border-indigo-300 bg-indigo-50 ring-1 ring-indigo-200"
                                                : "border-slate-200 bg-white hover:bg-slate-50"
                                                }`}
                                            type="button"
                                        >
                                            <Icon className="w-4 h-4 text-indigo-600" />
                                            <span className="text-[11px] font-bold text-slate-700">{channel.label}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Contact email <span className="text-rose-500">*</span></Label>
                            <Input
                                value={outreachForm.contactEmail}
                                onChange={e => setField("contactEmail", e.target.value)}
                                placeholder="client@email.com"
                                className={`h-10 rounded-none ${errors.contactEmail ? "border-rose-500" : ""}`}
                            />
                            {errors.contactEmail && <p className="text-[11px] text-rose-500">{errors.contactEmail}</p>}
                        </div>

                        {selectedChannel === "Email" && (
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Subject <span className="text-rose-500">*</span></Label>
                                <Input
                                    value={outreachForm.subject}
                                    onChange={e => setField("subject", e.target.value)}
                                    placeholder="Subject line"
                                    className={`h-10 rounded-none ${errors.subject ? "border-rose-500" : ""}`}
                                />
                                {errors.subject && <p className="text-[11px] text-rose-500">{errors.subject}</p>}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">
                                {selectedChannel === "Email" ? "Message body" : selectedChannel === "Call" ? "Call notes" : "In-app message"}
                                <span className="text-rose-500"> *</span>
                            </Label>
                            <textarea
                                value={outreachForm.message}
                                onChange={e => setField("message", e.target.value)}
                                placeholder="Write your message..."
                                className={`w-full h-32 p-3 bg-white border rounded-none text-[13px] focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none ${errors.message ? "border-rose-500" : "border-slate-200"}`}
                            />
                            {errors.message && <p className="text-[11px] text-rose-500">{errors.message}</p>}
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsReachOutOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={sendOutreach}>
                            <Zap className="w-4 h-4 mr-2" /> Send outreach
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-rose-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter retention data</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Risk level</Label>
                            <Select value={riskFilter} onValueChange={setRiskFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All levels</SelectItem>
                                    <SelectItem value="Critical">Critical</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Time range</Label>
                            <Select value={timeRange} onValueChange={setTimeRange}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="7">Last 7 days</SelectItem>
                                    <SelectItem value="30">Last 30 days</SelectItem>
                                    <SelectItem value="90">Last 90 days</SelectItem>
                                    <SelectItem value="365">Last 1 year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setRiskFilter("all"); setTimeRange("30"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none text-white" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
