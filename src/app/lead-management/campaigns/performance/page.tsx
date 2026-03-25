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
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Settings2,
    Layers,
    Target,
    Zap,
    Users,
    MousePointer2,
    CheckCircle2,
    Calendar,
    ArrowRight,
    LayoutGrid,
    Flame,
    PieChart
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"

// --- Mock Data: Performance Trends ---
const PERFORMANCE_CAMPAIGNS = [
    {
        id: "1",
        name: "Q1 Global Enterprise",
        leads: 460,
        mqls: 180,
        sqls: 94,
        customers: 22,
        velocity: "18.2h",
        trend: "+12.4%",
        efficiency: 92
    },
    {
        id: "2",
        name: "Webinar: Future Ops",
        leads: 1240,
        mqls: 420,
        sqls: 110,
        customers: 14,
        velocity: "4.5d",
        trend: "-4.2%",
        efficiency: 68
    },
    {
        id: "3",
        name: "APAC Retention Social",
        leads: 210,
        mqls: 140,
        sqls: 85,
        customers: 38,
        velocity: "12.0h",
        trend: "+28.1%",
        efficiency: 96
    },
]

export default function CampaignPerformancePage() {
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
                        className="-ml-2 h-7 text-[10px] font-semibold uppercase tracking-widest text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-pink-50 text-pink-600 border border-pink-100 shadow-sm">
                                <BarChart3 className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Campaign Performance Hub
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            The "Results Lens" for your marketing efforts. Trace every lead from click to conversion and identify bottlenecks in the campaign funnel.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <Calendar className="h-4 w-4 mr-2 text-slate-400" /> Comparison Period
                    </Button>
                    <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                        <TrendingUp className="h-4 w-4 mr-2" /> Global Summary
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Performance Analytics Grid */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[16px] font-semibold tracking-tight text-slate-900">Funnel Performance by Campaign</h2>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-7 text-[10px] font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 rounded-lg">Real-time Feed</Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {PERFORMANCE_CAMPAIGNS.map((p) => (
                            <Card key={p.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl group hover:ring-indigo-100 transition-all bg-white overflow-hidden p-8 space-y-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <h3 className="text-[18px] font-semibold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">{p.name}</h3>
                                        <div className="flex items-center gap-3">
                                            <Badge className={`bg-slate-50 text-slate-500 border-none h-5 px-2 text-[9px] font-semibold uppercase tracking-wider`}>Enterprise Stack</Badge>
                                            <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-500 flex items-center gap-1"><TrendingUp size={12} /> {p.trend} growth</span>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-0.5 min-w-[120px]">
                                        <p className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">Efficiency Score</p>
                                        <h4 className={`text-[24px] font-semibold tracking-tight tabular-nums ${p.efficiency > 90 ? 'text-emerald-500' : 'text-amber-500'}`}>{p.efficiency}%</h4>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-8">
                                    {[
                                        { label: "Total Leads", val: p.leads, sub: "Inbound" },
                                        { label: "MQL Stage", val: p.mqls, sub: "42% Ratio" },
                                        { label: "SQL Ready", val: p.sqls, sub: "Qual. Leads" },
                                        { label: "Conversions", val: p.customers, sub: "Closed Won" },
                                    ].map((stat, i) => (
                                        <div key={i} className="space-y-1 relative">
                                            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">{stat.label}</p>
                                            <h4 className="text-[20px] font-semibold tracking-tight text-slate-900 tabular-nums">{stat.val}</h4>
                                            <p className="text-[11px] font-medium text-slate-500">{stat.sub}</p>
                                            {i < 3 && <ArrowRight size={14} className="absolute -right-4 top-1/2 -translate-y-1/2 text-slate-200" />}
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-50">
                                    <div className="flex justify-between items-center text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                        <span>Funnel Health (Lead to Conversion)</span>
                                        <span className="text-indigo-600">Saturation: {Math.round(p.leads / 20)}%</span>
                                    </div>
                                    <div className="flex gap-1.5 h-3">
                                        <div className="flex-1 bg-indigo-600 rounded-lg group-hover:shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all" style={{ width: '100%' }} />
                                        <div className="flex-1 bg-indigo-400 rounded-lg" style={{ width: '100%' }} />
                                        <div className="flex-1 bg-indigo-200 rounded-lg" style={{ width: '100%' }} />
                                        <div className={`flex-1 ${p.customers > 20 ? 'bg-emerald-500' : 'bg-rose-400'} rounded-lg`} style={{ width: '100%' }} />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Global Velocity Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-slate-900 text-white p-8 space-y-6 relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 p-8 opacity-5">
                            <Activity size={120} />
                        </div>
                        <div className="space-y-1 relative z-10">
                            <p className="text-[10px] font-semibold tracking-wider text-indigo-400 uppercase leading-none">Global Sales Velocity</p>
                            <h3 className="text-[32px] font-semibold tracking-tight">14.2 Hours</h3>
                            <p className="text-[13px] text-slate-400 font-medium leading-relaxed">Average time from click to first human engagement.</p>
                        </div>
                        <div className="pt-4 border-t border-white/5 space-y-4 relative z-10">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px] font-semibold tracking-wider uppercase text-slate-400">
                                    <span>Benchmark</span>
                                    <span className="tabular-nums">12.0h</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500" style={{ width: '82%' }} />
                                </div>
                            </div>
                            <Button className="w-full h-10 bg-white text-slate-900 hover:bg-slate-50 font-semibold text-[11px] uppercase tracking-widest rounded-xl border-none">
                                Optimize Velocity
                            </Button>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100">
                                <PieChart size={20} />
                            </div>
                            <h4 className="text-[15px] font-semibold text-slate-900">Volume Breakdown</h4>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: "Standard Inbound", val: 62, color: "bg-indigo-500" },
                                { label: "Webhook Integration", val: 24, color: "bg-cyan-500" },
                                { label: "Manual Override", val: 14, color: "bg-slate-200" },
                            ].map((b, i) => (
                                <div key={i} className="flex justify-between items-center text-[12px] font-semibold text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-2 w-2 rounded-full ${b.color}`} />
                                        <span>{b.label}</span>
                                    </div>
                                    <span className="tabular-nums">{b.val}%</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-white text-amber-600 border border-amber-200 shadow-sm">
                            <Flame size={18} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[13px] font-semibold text-amber-900">Funnel Drop-off Alert</p>
                            <p className="text-[11px] text-amber-700 font-medium leading-relaxed italic">
                                "Webinar: Future Ops" campaign showing 72% drop-off between MQL and SQL. Check lead scoring criteria for this source.
                            </p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
