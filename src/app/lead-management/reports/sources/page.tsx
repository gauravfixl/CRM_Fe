"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Share2,
    Megaphone,
    Target,
    Activity,
    ChevronLeft,
    Calendar,
    Download,
    Filter,
    ArrowUpRight,
    TrendingUp,
    PieChart as PieChartIcon,
    DollarSign,
    Zap,
    Scale,
    Layers,
    MousePointer2,
    Globe,
    Linkedin,
    Facebook,
    Mail
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell,
    PieChart,
    Pie
} from "recharts"

// --- Mock Data ---
const SOURCE_VOLUME_DATA = [
    { name: "Meta Ads", leads: 1240, mqls: 420 },
    { name: "Google Ads", leads: 980, mqls: 310 },
    { name: "LinkedIn", leads: 450, mqls: 280 },
    { name: "Organic", leads: 2100, mqls: 850 },
    { name: "Referral", leads: 120, mqls: 95 },
]

const CAMPAIGN_ROI_DATA = [
    { name: "Q1 Outreach", spend: 45000, revenue: 185000 },
    { name: "Webinar", spend: 12000, revenue: 42000 },
    { name: "Social APAC", spend: 25000, revenue: 110000 },
    { name: "Email Blast", spend: 5000, revenue: 21000 },
]

const COLORS = ["#6366f1", "#06b6d4", "#ec4899", "#10b981", "#f59e0b"]

export default function SourceCampaignReportsPage() {
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
                            <div className="p-2 rounded-lg bg-pink-50 text-pink-600 border border-pink-100 shadow-sm">
                                <Share2 className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                Source & Campaign Performance
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Attribution-based reports identifying your most profitable lead channels and campaign initiatives.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-bold text-[12px] px-5">
                        <DollarSign className="h-4 w-4 mr-2 text-slate-400" /> ROI Calculator
                    </Button>
                    <Button onClick={(e) => { e.stopPropagation(); toast({ title: "Export Started", description: "Downloading report data..." }) }} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-indigo-100 shadow-lg border-none">
                        <Download className="h-4 w-4 mr-2" /> Export JSON
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Source Quality Stacked Bar */}
                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Lead Volume by Traffic Source</h3>
                            <p className="text-[13px] text-slate-500 font-medium">Comparison of raw leads vs qualified MQL volume by origin channel.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                                <span className="text-[11px] font-bold text-slate-500 uppercase">Leads</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                <span className="text-[11px] font-bold text-slate-500 uppercase">MQLs</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={SOURCE_VOLUME_DATA}>
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
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="leads" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                                <Bar dataKey="mqls" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Campaign ROI Radar/Pie */}
                <Card className="lg:col-span-4 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8 flex flex-col">
                    <div className="space-y-1 mb-8">
                        <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Campaign Spend vs Rev</h3>
                        <p className="text-[13px] text-slate-500 font-medium">Efficiency of capital allocation per initiative.</p>
                    </div>
                    <div className="h-[250px] w-full flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={CAMPAIGN_ROI_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={85}
                                    paddingAngle={5}
                                    dataKey="revenue"
                                >
                                    {CAMPAIGN_ROI_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 pt-6 border-t border-slate-50">
                        {CAMPAIGN_ROI_DATA.map((c, i) => (
                            <div key={i} className="flex justify-between items-center text-[12px] font-bold">
                                <div className="flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                    <span className="text-slate-600 line-clamp-1 max-w-[120px]">{c.name}</span>
                                </div>
                                <span className="text-indigo-600">{(c.revenue / c.spend).toFixed(1)}x ROI</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Conversion Heatmap / Quality Benchmarks */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Meta Ads Efficiency", val: "18.2%", detail: "Avg CPL: $24.50", icon: Facebook, color: "text-blue-600" },
                        { label: "LinkedIn SQL Ratio", val: "42.5%", detail: "Avg CPL: $110.20", icon: Linkedin, color: "text-indigo-600" },
                        { label: "Organic Yield", val: "32.4%", detail: "High Quality Band", icon: Globe, color: "text-emerald-600" },
                        { label: "Email Conversion", val: "8.4%", detail: "Retention Focus", icon: Mail, color: "text-pink-600" },
                    ].map((s, i) => (
                        <Card key={i} className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6 space-y-4 group hover:ring-indigo-100 transition-all">
                            <div className="flex items-center justify-between">
                                <div className={`p-2 rounded-xl bg-slate-50 group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100 ${s.color}`}>
                                    <s.icon size={20} />
                                </div>
                                <ArrowUpRight size={14} className="text-slate-300" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                                <h4 className="text-[20px] font-black text-slate-900">{s.val}</h4>
                                <p className="text-[11px] text-slate-500 font-medium">{s.detail}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Cost Analysis Callout */}
                <Card className="lg:col-span-12 border-none shadow-xl shadow-indigo-100/20 ring-1 ring-slate-100 rounded-3xl bg-slate-900 text-white p-8 overflow-hidden relative group">
                    <div className="absolute bottom-0 right-0 p-12 opacity-5 scale-150">
                        <Zap size={200} />
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
                        <div className="flex-1 space-y-4">
                            <div className="p-3 rounded-2xl bg-amber-500 w-fit">
                                <DollarSign size={24} className="text-white" />
                            </div>
                            <h3 className="text-[24px] font-black tracking-tighter">Budget Optimization Advisory</h3>
                            <p className="text-[15px] text-slate-400 font-medium leading-relaxed max-w-2xl">
                                Your **Organic** and **LinkedIn** channels are showing 4x the yield of **Meta Ads**. Reducing Meta spend by 15% and reallocating to LinkedIn could yield an additional 42 SQLs this quarter.
                            </p>
                            <Button onClick={(e) => { e.stopPropagation(); toast({ title: "Action Taken", description: "Reallocation request initiated." }) }} className="h-11 bg-white text-slate-900 hover:bg-slate-100 font-black px-8 rounded-xl border-none">Execute Reallocation</Button>
                        </div>
                        <div className="w-[300px] h-[200px] bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-500 uppercase">Projected Extra Revenue</p>
                                <h4 className="text-[32px] font-black tabular-nums text-emerald-400">$64,500</h4>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                                <Activity size={14} className="text-emerald-500" /> Confidence: 92% (High)
                            </div>
                        </div>
                    </div>
                </Card>

            </div>

        </div>
    )
}
