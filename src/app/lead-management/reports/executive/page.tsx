"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    BarChart3,
    TrendingUp,
    Users,
    Target,
    Activity,
    ChevronLeft,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Download,
    Share2,
    RefreshCw,
    PieChart as PieChartIcon,
    Zap,
    Scale,
    Clock,
    Flame
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    PieChart,
    Cell,
    Pie
} from "recharts"

// --- Mock Data ---
const GROWTH_DATA = [
    { name: "Jan", leads: 420, conversion: 12 },
    { name: "Feb", leads: 480, conversion: 14 },
    { name: "Mar", leads: 520, conversion: 13 },
    { name: "Apr", leads: 610, conversion: 16 },
    { name: "May", leads: 580, conversion: 15 },
    { name: "Jun", leads: 720, conversion: 18 },
]

const SOURCE_DATA = [
    { name: "Meta Ads", value: 45, color: "#6366f1" },
    { name: "Google", value: 30, color: "#06b6d4" },
    { name: "LinkedIn", value: 15, color: "#ec4899" },
    { name: "Direct", value: 10, color: "#94a3b8" },
]

const PERFORMANCE_METRICS = [
    { label: "Total Leads", val: "4,640", delta: "+12.4%", trend: "up", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Avg Conversion", val: "16.2%", delta: "+2.1%", trend: "up", icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "SLA Compliance", val: "94.8%", delta: "-0.5%", trend: "down", icon: Scale, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Response Time", val: "14.2m", delta: "-4.8%", trend: "up", icon: Clock, color: "text-cyan-600", bg: "bg-cyan-50" },
]

export default function ExecutiveDashboardPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

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
                        className="-ml-2 h-7 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                                <BarChart3 className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Executive Intelligence Hub
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Consolidated cross-module insights for strategic decision making. A high-level view of growth, efficiency, and system health.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={() => toast({ title: "Date Range Changed", description: "Dashboard filtered by Last 30 Days." })} variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-bold text-[12px] px-5">
                        <Calendar className="h-4 w-4 mr-2 text-slate-400" /> Last 30 Days
                    </Button>
                    <Button onClick={() => toast({ title: "Export Started", description: "Downloading PDF report..." })} variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-bold text-[12px] px-5">
                        <Download className="h-4 w-4 mr-2 text-slate-400" /> Export PDF
                    </Button>
                    <Button onClick={() => toast({ title: "Link Copied", description: "Executive dashboard link copied to clipboard." })} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-indigo-100 shadow-lg border-none">
                        <Share2 className="h-4 w-4 mr-2" /> Share Insight
                    </Button>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {PERFORMANCE_METRICS.map((m, i) => (
                    <Card key={i} className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className={`p-2.5 rounded-2xl ${m.bg} ${m.color}`}>
                                <m.icon size={20} />
                            </div>
                            <div className={`flex items-center gap-1 text-[11px] font-semibold ${m.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {m.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {m.delta}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">{m.label}</p>
                            <h4 className="text-[28px] font-semibold text-slate-900 tabular-nums">{m.val}</h4>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Growth Trend Area */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8">
                        <div className="flex justify-between items-start mb-8">
                            <div className="space-y-1">
                                <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Lead Inflow & Conversion Engine</h3>
                                <p className="text-[13px] text-slate-500 font-medium">Monitoring the correlation between volume and quality trends.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Leads</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Conv %</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={GROWTH_DATA}>
                                    <defs>
                                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="leads"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorLeads)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[15px] font-black uppercase tracking-tight text-slate-900">Funnel Health Velocity</h4>
                                <Activity className="text-indigo-600" size={18} />
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: "Lead to MQL", val: 84, time: "4.2h" },
                                    { label: "MQL to SQL", val: 62, time: "18.5h" },
                                    { label: "SQL to Won", val: 24, time: "12.4d" },
                                ].map((step, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-end text-[11px] font-bold">
                                            <span className="text-slate-500 uppercase">{step.label}</span>
                                            <span className="text-slate-900">{step.val}% <span className="text-slate-300 mx-1">|</span> {step.time}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500" style={{ width: `${step.val}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-indigo-50 text-slate-900 p-8 space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-200 translate-x-4">
                                <Zap size={120} />
                            </div>
                            <h4 className="text-[15px] font-semibold relative z-10 text-indigo-600">AI Predictive Summary</h4>
                            <p className="text-[13px] text-slate-600 font-medium leading-relaxed relative z-10">
                                Based on current velocity, you are projected to hit **1,240 SQLs** by end of month. This is a **12% increase** over Q1 benchmark.
                            </p>
                            <Button onClick={() => toast({ title: "AI Models Loading", description: "Fetching real-time predictive data..." })} className="w-full h-10 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold text-[11px] uppercase tracking-widest rounded-xl border-none relative z-10">
                                View Predictions
                            </Button>
                        </Card>
                    </div>
                </div>

                {/* Breakdown Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-indigo-100 rounded-3xl bg-indigo-600 text-white p-8 space-y-8">
                        <div className="space-y-1">
                            <h4 className="text-[15px] font-semibold uppercase tracking-tight text-white">Source Portfolio</h4>
                            <p className="text-[11px] text-indigo-100 font-medium opacity-80">Top lead generators by volume.</p>
                        </div>

                        <div className="h-[220px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={SOURCE_DATA}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {SOURCE_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color === '#94a3b8' ? '#ffffff40' : entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <h4 className="text-[20px] font-semibold text-white">4.6k</h4>
                                <p className="text-[9px] font-semibold text-white opacity-60 uppercase">Leads</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {SOURCE_DATA.map((s, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color === '#94a3b8' ? '#ffffff' : s.color }} />
                                        <span className="text-[12px] font-semibold text-white/80">{s.name}</span>
                                    </div>
                                    <span className="text-[12px] font-semibold text-white">{s.value}%</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-indigo-600 text-white p-8 flex flex-col items-center text-center space-y-4">
                        <div className="p-4 rounded-full bg-white/10 ring-8 ring-white/5">
                            <Flame size={32} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-[20px] font-black tracking-tight">System Performance</h3>
                            <p className="text-[12px] text-indigo-100/70 font-medium">Platform automation health is at 99.8% with zero bottlenecks.</p>
                        </div>
                        <Button onClick={() => toast({ title: "Health Check", description: "Initiating platform operations health scan..." })} variant="outline" className="w-full h-10 border-white/20 hover:bg-white/10 text-white font-bold text-[11px] uppercase tracking-widest rounded-xl">
                            Operations Pulse
                        </Button>
                    </Card>

                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-white text-amber-600 border border-amber-200">
                            <RefreshCw size={18} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[13px] font-bold text-amber-900">Real-time Sync Active</p>
                            <p className="text-[11px] text-amber-700 font-medium leading-relaxed italic">
                                "Last report synchronization completed 2 minutes ago. Next auto-refresh in 8 minutes."
                            </p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
