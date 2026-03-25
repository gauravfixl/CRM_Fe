"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Activity,
    Target,
    Activity as ActivityIcon,
    ChevronLeft,
    Calendar,
    Download,
    Share2,
    Filter,
    ArrowRight,
    MousePointer2,
    TrendingUp,
    TrendingDown,
    Flame,
    Zap,
    Scale,
    Layers,
    Clock,
    UserCheck,
    Briefcase
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
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
    Cell
} from "recharts"

// --- Mock Data ---
const CONVERSION_TREND = [
    { name: "Jan", rate: 12.4 },
    { name: "Feb", rate: 14.2 },
    { name: "Mar", rate: 13.8 },
    { name: "Apr", rate: 16.5 },
    { name: "May", rate: 15.1 },
    { name: "Jun", rate: 18.2 },
]

const FUNNEL_DATA = [
    { stage: "Total Leads", count: 4640, conversion: 100, color: "#6366f1" },
    { stage: "MQL", count: 1940, conversion: 41.8, color: "#818cf8" },
    { stage: "SQL", count: 850, conversion: 18.3, color: "#a5b4fc" },
    { stage: "Proposal", count: 320, conversion: 6.9, color: "#c7d2fe" },
    { stage: "Won", count: 140, conversion: 3.0, color: "#10b981" },
]

export default function FunnelConversionPage() {
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
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                                <Target className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                Funnel & Conversion Analytics
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Deep dive into your sales funnel performance. Analyze drop-off rates and identify where leads are losing momentum.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={() => toast({ title: "Attribution Changed", description: "Switched to Multi-Touch attribution mode." })} variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-bold text-[12px] px-5">
                        <Layers className="h-4 w-4 mr-2 text-slate-400" /> Attribution Mode
                    </Button>
                    <Button onClick={() => toast({ title: "Export Started", description: "Gathering funnel data for download..." })} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-indigo-100 shadow-lg border-none">
                        <Download className="h-4 w-4 mr-2" /> Download Report
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Visual Funnel Stack */}
                <Card className="lg:col-span-12 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8">
                    <div className="flex justify-between items-start mb-12">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Stage-to-Stage Funnel Transition</h3>
                            <p className="text-[13px] text-slate-500 font-medium">Measuring the "Leakage" in your sales pipeline process.</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Overall Yield</p>
                            <h4 className="text-[24px] font-black text-emerald-600">3.0%</h4>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2 relative">
                        {FUNNEL_DATA.map((item, i) => (
                            <div key={i} className="flex flex-col items-center group">
                                <div
                                    className="w-full flex flex-col items-center justify-center p-8 transition-all hover:scale-[1.02] cursor-default relative"
                                    style={{
                                        backgroundColor: item.color,
                                        clipPath: i < 4 ? 'polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%)' : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                                        marginTop: i * -4 + 'px',
                                        height: 160 - (i * 12) + 'px',
                                        opacity: 1 - (i * 0.1)
                                    }}
                                >
                                    <h4 className="text-[24px] font-black text-white tabular-nums">{item.count.toLocaleString()}</h4>
                                    <p className="text-[11px] font-bold text-white/80 uppercase tracking-widest">{item.stage}</p>

                                    {/* Drop-off Label for Funnel */}
                                    {i > 0 && (
                                        <div className="absolute -top-6 bg-white shadow-lg border border-slate-100 rounded-full h-8 w-16 flex items-center justify-center text-[11px] font-black text-indigo-600 z-10">
                                            {item.conversion}%
                                        </div>
                                    )}
                                </div>
                                <div className="mt-8 text-center space-y-1 hidden md:block">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stage Retention</p>
                                    <h4 className="text-[14px] font-black text-slate-900">{item.conversion}%</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Conversion Performance Trend */}
                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Conversion Trend (Lead-to-Won)</h3>
                            <p className="text-[13px] text-slate-500 font-medium">Monthly efficiency progression of the closing engine.</p>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-500 font-bold text-[13px]">
                            <TrendingUp size={16} /> +14% vs Q1
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={CONVERSION_TREND}>
                                <defs>
                                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                                    dataKey="rate"
                                    stroke="#10b981"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorRate)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Velocity & Bottlenecks Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6 space-y-6">
                        <h4 className="text-[15px] font-black uppercase tracking-tight text-slate-900">Time-to-Convert Metrics</h4>
                        <div className="space-y-6">
                            {[
                                { label: "Lead to Qualified", time: "1.2 Days", trend: "up", score: 82 },
                                { label: "Qualified to Won", time: "24.5 Days", trend: "down", score: 45 },
                                { label: "Avg Sales Cycle", time: "28.4 Days", trend: "up", score: 74 },
                            ].map((m, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-600">
                                        <Clock size={20} />
                                    </div>
                                    <div className="flex-1 space-y-0.5">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-[16px] font-black text-slate-900">{m.time}</h4>
                                            {m.trend === 'up' ? <TrendingUp size={12} className="text-emerald-500" /> : <TrendingDown size={12} className="text-rose-500" />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-slate-900 text-white p-8 space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Flame size={120} />
                        </div>
                        <h4 className="text-[16px] font-black tracking-tighter">Bottleneck Detected</h4>
                        <p className="text-[12px] text-slate-400 font-medium leading-relaxed">
                            Leads are spending <strong>45% more time</strong> in "Negotiation" than the company benchmark. This is a primary risk to the conversion yield.
                        </p>
                        <Button onClick={() => toast({ title: "Analysis Started", description: "Running deep diagnostic on Negotiation stage." })} className="w-full h-10 bg-white text-slate-900 hover:bg-slate-50 font-black text-[11px] uppercase tracking-widest rounded-xl border-none">
                            Diagnose Bottleneck
                        </Button>
                    </Card>

                    <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-white text-indigo-600 border border-indigo-200">
                            <Zap size={18} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[13px] font-bold text-indigo-900">Conversion Insight</p>
                            <p className="text-[11px] text-indigo-700 font-medium leading-relaxed italic">
                                "Improving SQL-to-Proposal response time by 2 hours could increase closing rate by 4%."
                            </p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
