"use client"

import React, { useState, useMemo } from 'react'
import {
    Download,
    Users,
    TrendingUp,
    Heart,
    DollarSign,
    Search,
    Filter,
    Mail,
    Phone,
    MoreVertical,
    Plus,
    Clock,
    UserPlus,
    Activity,
    ShieldCheck,
    RefreshCw,
    Star,
    Loader2,
    HardDrive,
    Layers,
    PieChart,
    Calendar
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Progress } from "@/shared/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { toast } from "@/shared/utils/toast"

// --- Mock Data ---
// --- Enhanced Dynamic Data Mapping ---
const DATA_BY_PERIOD = {
    "monthly": {
        metrics: [
            { title: "Total Portfolio Value", value: "$4.82M", change: "+14.2%", trend: "up" as const, icon: DollarSign, color: "indigo" },
            { title: "Active Engagements", value: "847", change: "+12", trend: "up" as const, icon: Users, color: "emerald" },
            { title: "Average Satisfaction", value: "9.2/10", change: "+0.4", trend: "up" as const, icon: Star, color: "violet" },
            { title: "Risk Exposure", value: "2.4%", change: "-0.8%", trend: "down" as const, icon: Activity, color: "rose" }
        ],
        topClients: [
            { id: 1, name: "Innovation Labs", rev: "$142k", health: 94, status: "Vibrant", industry: "Technology", csm: "Sarah Smith" },
            { id: 2, name: "Global Solutions", rev: "$128k", health: 88, status: "Healthy", industry: "Finance", csm: "John Doe" },
            { id: 3, name: "Techstart Inc", rev: "$95k", health: 42, status: "At Risk", industry: "Saas", csm: "Alex Wong" },
            { id: 4, name: "Acme Dynamics", rev: "$88k", health: 91, status: "Vibrant", industry: "Manufacturing", csm: "Maria Garcia" }
        ],
        pulse: [
            { name: "Acme Dynamics", potential: "+$24k/yr", type: "Tier Upgrade", prob: 88 },
            { name: "Global Solutions", potential: "+$12k/yr", type: "Seat Expansion", prob: 72 }
        ],
        signals: [
            { msg: "Low usage alert for Techstart", time: "2h ago", color: "bg-rose-50 border-rose-100" },
            { msg: "Renewal success with Global", time: "5h ago", color: "bg-emerald-50 border-emerald-100" }
        ]
    },
    "quarterly": {
        metrics: [
            { title: "Total Portfolio Value", value: "$14.5M", change: "+16.8%", trend: "up" as const, icon: DollarSign, color: "indigo" },
            { title: "Active Engagements", value: "2.1k", change: "+45", trend: "up" as const, icon: Users, color: "emerald" },
            { title: "Average Satisfaction", value: "9.4/10", change: "+0.2", trend: "up" as const, icon: Star, color: "violet" },
            { title: "Risk Exposure", value: "1.8%", change: "-1.2%", trend: "down" as const, icon: Activity, color: "rose" }
        ],
        topClients: [
            { id: 1, name: "Global Solutions", rev: "$412k", health: 91, status: "Vibrant", industry: "Finance", csm: "John Doe" },
            { id: 2, name: "Innovation Labs", rev: "$385k", health: 89, status: "Healthy", industry: "Technology", csm: "Sarah Smith" },
            { id: 3, name: "Acme Dynamics", rev: "$256k", health: 93, status: "Vibrant", industry: "Manufacturing", csm: "Maria Garcia" },
            { id: 4, name: "Techstart Inc", rev: "$182k", health: 48, status: "At Risk", industry: "Saas", csm: "Alex Wong" }
        ],
        pulse: [
            { name: "Global Solutions", potential: "+$85k/yr", type: "Enterprise Plan", prob: 91 },
            { name: "Innovation Labs", potential: "+$42k/yr", type: "Multi-Cloud", prob: 78 }
        ],
        signals: [
            { msg: "Global Solutions expanded to EMEA", time: "1d ago", color: "bg-blue-50 border-blue-100" },
            { msg: "Innovation Labs Qbr scheduled", time: "3d ago", color: "bg-indigo-50 border-indigo-100" }
        ]
    },
    "yearly": {
        metrics: [
            { title: "Total Portfolio Value", value: "$58.4M", change: "+24.5%", trend: "up" as const, icon: DollarSign, color: "indigo" },
            { title: "Active Engagements", value: "8.4k", change: "+182", trend: "up" as const, icon: Users, color: "emerald" },
            { title: "Average Satisfaction", value: "9.5/10", change: "+0.3", trend: "up" as const, icon: Star, color: "violet" },
            { title: "Risk Exposure", value: "1.2%", change: "-2.4%", trend: "down" as const, icon: Activity, color: "rose" }
        ],
        topClients: [
            { id: 1, name: "Global Solutions", rev: "$1.8M", health: 95, status: "Vibrant", industry: "Finance", csm: "John Doe" },
            { id: 2, name: "Innovation Labs", rev: "$1.4M", health: 92, status: "Vibrant", industry: "Technology", csm: "Sarah Smith" },
            { id: 3, name: "Acme Dynamics", rev: "$1.1M", health: 94, status: "Vibrant", industry: "Manufacturing", csm: "Maria Garcia" },
            { id: 4, name: "Techstart Inc", rev: "$680k", health: 52, status: "Healthy", industry: "Saas", csm: "Alex Wong" }
        ],
        pulse: [
            { name: "Acme Dynamics", potential: "+$120k/yr", type: "Platform expansion", prob: 84 },
            { name: "Techstart Inc", potential: "+$45k/yr", type: "Tier upgrade", prob: 68 }
        ],
        signals: [
            { msg: "Acme Dynamics achieved goal status", time: "1w ago", color: "bg-emerald-50 border-emerald-100" },
            { msg: "Annual audit for Techstart passed", time: "2w ago", color: "bg-blue-50 border-blue-100" }
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
                            {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <Activity className="h-4 w-4 rotate-180" />}
                            <span className="text-sm font-medium font-outfit">{change}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function ClientReports() {
    const [period, setPeriod] = useState("monthly")
    const [isSyncing, setIsSyncing] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    // Dynamic Data Selection based on Period
    const activeData = useMemo(() => DATA_BY_PERIOD[period as keyof typeof DATA_BY_PERIOD], [period])

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1500)),
            {
                loading: 'Synchronizing client intelligence...',
                success: 'Client data synchronized successfully',
                error: 'Synchronization failed'
            }
        ).finally(() => setIsSyncing(false))
    }

    const handleExport = () => {
        setIsExporting(true)
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 2000)),
            {
                loading: 'Preparing portfolio report...',
                success: 'Full portfolio report exported',
                error: 'Export failed'
            }
        ).finally(() => setIsExporting(false))
    }

    const handleAction = (msg: string) => {
        toast.promise(new Promise(r => setTimeout(r, 1200)), {
            loading: 'Processing client request...',
            success: msg,
            error: 'Action failed'
        })
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Vibrant': return 'bg-emerald-100 text-emerald-700'
            case 'Healthy': return 'bg-blue-100 text-blue-700'
            case 'At Risk': return 'bg-rose-100 text-rose-700'
            default: return 'bg-slate-100 text-slate-700'
        }
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="px-6 py-6 font-outfit">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">Client Reports</h1>
                            <p className="text-[14px] text-slate-500 font-medium mt-1">Deep-dive performance monitoring and relationship health</p>
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
                                {isExporting ? "Exporting" : "Export Assets"}
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
            <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Search & Intelligence */}
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 p-1 font-outfit">
                        <div className="flex items-center p-2 gap-3">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
                                <Input
                                    placeholder="Search specific client or industry segment..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 h-12 bg-slate-50/50 border-0 rounded-2xl text-[14px] font-medium placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-indigo-100"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Detailed Analytics */}
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-bold text-slate-900">Premium Portfolio Segments</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-5">
                            {activeData.topClients.map((client: any) => (
                                <div key={client.id} className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-white transition-all group cursor-pointer">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-md font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{client.name}</h4>
                                            <Badge className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border-0 ${getStatusStyle(client.status)}`}>{client.status}</Badge>
                                        </div>
                                        <div className="flex items-center gap-6 text-[12px] font-medium text-slate-400">
                                            <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> {client.industry}</span>
                                            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Csm: {client.csm}</span>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <p className="text-lg font-semibold text-slate-900">{client.rev}</p>
                                        <div className="flex items-center justify-end gap-2 text-slate-400">
                                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full ${client.health >= 80 ? 'bg-emerald-500' : client.health >= 50 ? 'bg-indigo-500' : 'bg-rose-500'}`} style={{ width: `${client.health}%` }} />
                                            </div>
                                            <span className="text-[11px] font-semibold">{client.health}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full h-12 border-2 border-slate-100 rounded-xl text-slate-400 font-bold hover:bg-slate-50 gap-2 mt-4" onClick={() => handleAction("Accessing complete portfolio database...")}>
                                Full Portfolio Deep-Dive
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Sidebar Intelligence */}
                <div className="space-y-6">
                    {/* Expansion Pulse Card */}
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 overflow-hidden">
                        <CardHeader className="p-0">
                            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-b border-indigo-100 p-8">
                                <h4 className="text-xl font-bold text-slate-900 tracking-tight">Expansion Pulse</h4>
                                <p className="text-indigo-600 text-xs font-medium mt-1">Ai-detected upsell opportunities</p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6 bg-white">
                            {activeData.pulse.map((opp: any, idx: number) => (
                                <div key={idx} className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-bold text-slate-900">{opp.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400">{opp.type}</p>
                                        </div>
                                        <p className="text-emerald-600 font-semibold text-sm">{opp.potential}</p>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500" style={{ width: `${opp.prob}%` }} />
                                    </div>
                                </div>
                            ))}
                            <Button className="w-full rounded-xl bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 border-0 h-11 mt-2 shadow-sm" onClick={() => handleAction("Expansion playbook initiated")}>
                                View Strategic Map
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Relationship Signals */}
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 p-8 space-y-5 bg-white font-outfit">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 shadow-sm">
                                <Activity className="w-5 h-5 text-amber-600" />
                            </div>
                            <h4 className="text-[16px] font-bold text-slate-900">Relationship Signals</h4>
                        </div>
                        <div className="space-y-3">
                            {activeData.signals.map((sig: any, i: number) => (
                                <div key={i} className={`p-4 rounded-xl border flex justify-between items-center transition-all hover:shadow-sm cursor-pointer ${sig.color}`}>
                                    <span className="text-[12px] font-bold text-slate-600">{sig.msg}</span>
                                    <span className="text-[10px] font-medium opacity-50">{sig.time}</span>
                                </div>
                            ))}
                        </div>
                        <div className="pt-2 border-t border-slate-50">
                            <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">Intelligence engine is monitoring 847 active engagements for early churn signals.</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
