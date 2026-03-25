"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Scale,
    Clock,
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    Calendar,
    Download,
    Filter,
    TrendingDown,
    TrendingUp,
    ShieldAlert,
    Zap,
    Briefcase,
    Activity,
    Layers,
    ArrowUpRight,
    Search,
    UserX,
    MessageSquare
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    AreaChart,
    Area,
} from "recharts"

// --- Mock Data ---
const RESPONSE_TIME_TREND = [
    { time: "08:00", avg: 12 },
    { time: "10:00", avg: 8 },
    { time: "12:00", avg: 15 },
    { time: "14:00", avg: 14 },
    { time: "16:00", avg: 9 },
    { time: "18:00", avg: 11 },
]

const BREACH_BY_SOURCE = [
    { source: "Meta Ads", count: 42, rate: 12.4 },
    { source: "Google Ads", count: 18, rate: 4.8 },
    { source: "LinkedIn", count: 24, rate: 8.2 },
    { source: "Web Organic", count: 8, rate: 1.2 },
    { source: "Cold Call", count: 32, rate: 15.6 },
]

export default function SLAReportsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
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
                            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 shadow-sm">
                                <Scale className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                SLA & Operational Compliance
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Monitor speed-to-lead and first-response compliance. Audit breaches and identify bottlenecks in your operational response engine.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={() => toast({ title: "Audit Log Opened", description: "Viewing all recent SLA breaches." })} variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-bold text-[12px] px-5">
                        <ShieldAlert className="h-4 w-4 mr-2 text-rose-400" /> Audit Breaches
                    </Button>
                    <Button onClick={() => toast({ title: "Syncing", description: "Fetching latest industry SLA benchmarks..." })} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-indigo-100 shadow-lg border-none">
                        <RefreshCw className="h-4 w-4 mr-2" /> Sync Benchmarks
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Global Compliance Gauge */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-8 space-y-8 flex flex-col items-center text-center">
                        <div className="space-y-1">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Global Compliance Rate</p>
                            <h2 className="text-[48px] font-black text-slate-900 tracking-tighter">94.8%</h2>
                        </div>

                        <div className="relative h-48 w-48 flex items-center justify-center">
                            <svg className="h-full w-full rotate-[-90deg]">
                                <circle cx="96" cy="96" r="80" className="stroke-slate-100 fill-none" strokeWidth="12" />
                                <circle
                                    cx="96" cy="96" r="80"
                                    className="stroke-emerald-500 fill-none transition-all duration-1000"
                                    strokeWidth="12"
                                    strokeDasharray="502"
                                    strokeDashoffset={502 * (1 - 0.948)}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <CheckCircle2 size={32} className="text-emerald-500 mb-2" />
                                <span className="text-[12px] font-black text-emerald-600 uppercase">Target: 95%</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 w-full pt-4 border-t border-slate-50">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase">Avg Response</p>
                                <h4 className="text-[18px] font-black text-slate-900">14.2m</h4>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase">Breach Vol</p>
                                <h4 className="text-[18px] font-black text-rose-500">124</h4>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-slate-900 text-white p-8 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Clock size={120} />
                        </div>
                        <h4 className="text-[16px] font-bold">First Response Velocity</h4>
                        <p className="text-[13px] text-slate-400 font-medium leading-relaxed">
                            Leads contacted within <strong>5 minutes</strong> show a <strong>400% higher</strong> conversion rate than those contacted after 1 hour.
                        </p>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase">
                                <span>Current Benchmark</span>
                                <span className="text-amber-400">Needs Optimization</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500" style={{ width: '68%' }} />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Response Time Trend */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8">
                        <div className="flex justify-between items-start mb-8">
                            <div className="space-y-1">
                                <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Response Time Volatility (24h)</h3>
                                <p className="text-[13px] text-slate-500 font-medium">Monitoring average response speed fluctuations during business hours.</p>
                            </div>
                            <div className="flex items-center gap-2 text-rose-500 font-bold text-[13px]">
                                <TrendingUp size={16} /> Peak at Noon
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={RESPONSE_TIME_TREND}>
                                    <defs>
                                        <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
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
                                        dataKey="avg"
                                        stroke="#f43f5e"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorAvg)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Breach by Source Table-like Grid */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[16px] font-bold text-slate-900">Breach Hotspots by Source</h3>
                            <Badge variant="outline" className="border-rose-100 text-rose-600 bg-rose-50/20 text-[10px] font-bold">SYSTEM ALERT</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {BREACH_BY_SOURCE.map((s, i) => (
                                <Card key={i} className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-5 group hover:ring-rose-100 transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-tight">{s.source}</h4>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Breaches: <span className="text-rose-500">{s.count}</span></span>
                                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Rate: <span className="text-slate-900">{s.rate}%</span></span>
                                            </div>
                                        </div>
                                        <div className={`h-1.5 w-24 rounded-full bg-slate-50 overflow-hidden relative`}>
                                            <div className={`h-full ${s.rate > 10 ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${s.rate * 4}%` }} />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tactical Action Footer */}
                <div className="lg:col-span-12">
                    <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="p-4 rounded-2xl bg-white shadow-xl shadow-emerald-200/50 text-emerald-600">
                                <Zap size={32} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[20px] font-black text-emerald-900 tracking-tight">Escalation Engine Optimized</h4>
                                <p className="text-[13px] text-emerald-700 font-medium">
                                    Last week's protocol update reduced manual escalations by <strong>24%</strong> across all High-Intent sources.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button onClick={() => toast({ title: "Log Engine", description: "Loading unified escalation matrix." })} className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 rounded-xl shadow-lg shadow-emerald-200 border-none">View Escalation Log</Button>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
