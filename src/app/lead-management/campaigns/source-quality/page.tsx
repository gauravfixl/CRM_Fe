"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Activity,
    Search,
    Filter,
    ChevronLeft,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ArrowUpRight,
    TrendingUp,
    Star,
    ShieldCheck,
    GitBranch,
    BarChart3,
    MoreHorizontal,
    LayoutGrid,
    Flame,
    Zap,
    ThumbsUp,
    ThumbsDown,
    Clock,
    Target
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"

// --- Mock Data: Source Quality ---
const SOURCE_QUALITY_METRICS = [
    {
        id: "1",
        source: "LinkedIn Ads",
        mqlRate: 64,
        sqlRate: 42,
        conversion: 18.2,
        avgScore: 82,
        lossReason: "Budget Constraints",
        timeToConvert: "4.2 Days"
    },
    {
        id: "2",
        source: "Website Organic",
        mqlRate: 88,
        sqlRate: 56,
        conversion: 24.1,
        avgScore: 91,
        lossReason: "Competitor Choice",
        timeToConvert: "2.1 Days"
    },
    {
        id: "3",
        source: "Meta Ads",
        mqlRate: 32,
        sqlRate: 12,
        conversion: 4.8,
        avgScore: 45,
        lossReason: "Low Intent / Spam",
        timeToConvert: "12 Days"
    },
    {
        id: "4",
        source: "Cold Outbound",
        mqlRate: 18,
        sqlRate: 8,
        conversion: 2.4,
        avgScore: 32,
        lossReason: "No Response",
        timeToConvert: "18 Days"
    },
]

export default function SourceQualityPage() {
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
                            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                                <Star className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Source Quality Index
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            The "Quality Lens" for your marketing mix. Identify where your best-converting leads come from and which sources generate low-intent noise.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <ShieldCheck className="h-4 w-4 mr-2 text-slate-400" /> Integrity Audit
                    </Button>
                    <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                        <Activity className="h-4 w-4 mr-2" /> View Deep Trends
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Global Quality Distribution */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: "MQL % (Avg)", val: "42.5%", icon: ThumbsUp, color: "text-indigo-600", bg: "bg-indigo-50" },
                        { label: "High Intent Ratio", val: "0.64", icon: Flame, color: "text-orange-600", bg: "bg-orange-50" },
                        { label: "Loss Rate (Spam)", val: "8.2%", icon: ThumbsDown, color: "text-rose-600", bg: "bg-rose-50" },
                        { label: "Integrity Index", val: "A+", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
                    ].map((m, i) => (
                        <Card key={i} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl bg-white overflow-hidden">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">{m.label}</p>
                                    <h4 className="text-[22px] font-semibold tracking-tight text-slate-900 tabular-nums">{m.val}</h4>
                                </div>
                                <div className={`p-2.5 rounded-xl ${m.bg} ${m.color}`}>
                                    <m.icon size={18} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Source Quality Table Area */}
                <div className="lg:col-span-12 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[16px] font-semibold tracking-tight text-slate-900">Source Performance Benchmark</h2>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                                <Input placeholder="Filter sources..." className="pl-9 h-9 w-48 border-none bg-transparent text-[11px] font-semibold uppercase tracking-wider focus-visible:ring-0 placeholder:text-slate-400/70" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {SOURCE_QUALITY_METRICS.map((s) => (
                            <Card key={s.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl group hover:ring-indigo-100 transition-all bg-white overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-50 items-center">
                                        {/* Source & Score */}
                                        <div className="flex-1 p-6 flex items-center gap-4 min-w-[250px]">
                                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-semibold text-[18px] tabular-nums ${s.avgScore > 80 ? 'bg-emerald-50 text-emerald-600' : s.avgScore > 60 ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600 shadow-sm shadow-rose-100'}`}>
                                                {s.avgScore}
                                            </div>
                                            <div className="space-y-0.5">
                                                <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">{s.source}</h3>
                                                <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1"><Clock size={12} /> {s.timeToConvert} avg. conversion</p>
                                            </div>
                                        </div>

                                        <div className="flex-1 p-6 max-w-[400px] space-y-3">
                                            <div className="flex justify-between items-end text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <span>MQL Rate</span>
                                                    <span className="text-slate-900 text-[12px] tabular-nums">{s.mqlRate}%</span>
                                                </div>
                                                <div className="flex flex-col gap-1 items-center">
                                                    <span>SQL Rate</span>
                                                    <span className="text-slate-900 text-[12px] tabular-nums">{s.sqlRate}%</span>
                                                </div>
                                                <div className="flex flex-col gap-1 items-end">
                                                    <span>CONV.</span>
                                                    <span className="text-emerald-600 text-[12px] font-semibold tabular-nums">{s.conversion}%</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 h-2 relative">
                                                <div className="h-full bg-indigo-600 rounded-l-full" style={{ width: `${s.mqlRate}%` }} />
                                                <div className="h-full bg-indigo-400" style={{ width: `${s.sqlRate}%` }} />
                                                <div className="h-full bg-emerald-500 rounded-r-full" style={{ width: `${s.conversion}%` }} />
                                            </div>
                                        </div>

                                        {/* Qualitative Section */}
                                        <div className="flex-1 p-6 flex flex-col items-start min-w-[180px]">
                                            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase leading-none mb-1">Primary Loss Reason</p>
                                            <span className={`text-[12px] font-semibold ${s.lossReason === 'Low Intent / Spam' ? 'text-rose-600' : 'text-slate-700'}`}>{s.lossReason}</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="p-6 flex items-center justify-end">
                                            <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-indigo-50">
                                                <MoreHorizontal size={18} />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Optimization Callout Bottom */}
                <div className="lg:col-span-12">
                    <Card className="border-none shadow-xl shadow-indigo-100/20 ring-1 ring-slate-100 rounded-3xl bg-slate-900 text-white p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 group-hover:scale-125 transition-transform">
                            <Target size={200} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                            <div className="space-y-6">
                                <div className="p-3 rounded-2xl bg-emerald-500 w-fit shadow-xl shadow-emerald-500/20">
                                    <ThumbsUp size={32} className="fill-white" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-[28px] font-semibold tracking-tight leading-tight">High-Quality Channel Identified</h3>
                                    <p className="text-[15px] text-slate-400 font-medium leading-relaxed">
                                        <strong className="font-semibold text-white">Website Organic</strong> leads are converting 4x faster than any other source. We recommend shifting 12% of the cold outbound budget to SEO initiatives.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Button className="h-11 bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 rounded-xl border-none">Allocate Budget</Button>
                                    <Button variant="ghost" className="text-emerald-400 hover:text-white font-semibold h-11 px-6">Source Comparison</Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { label: "Lead-to-SQL Velocity", val: 98, status: "Peak" },
                                    { label: "Data Integrity Rank", val: 94, status: "A+" },
                                    { label: "Rep Preference Rate", val: 82, status: "High" },
                                    { label: "Revenue Efficiency", val: 88, status: "Gold" },
                                ].map((stat, i) => (
                                    <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                        <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase leading-none">{stat.label}</p>
                                        <div className="flex justify-between items-end">
                                            <h4 className="text-[20px] font-semibold tracking-tight tabular-nums">{stat.val}%</h4>
                                            <span className="text-[10px] font-semibold text-emerald-400 tracking-wider uppercase">{stat.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

            </div>

        </div>
    )
}
