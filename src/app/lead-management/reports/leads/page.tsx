"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    BarChart3,
    TrendingUp,
    Users,
    MapPin,
    UserCheck,
    ChevronLeft,
    Calendar,
    Download,
    Share2,
    Filter,
    LayoutGrid,
    Search,
    ArrowUpRight,
    Briefcase
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
    LineChart,
    Line,
} from "recharts"

// --- Mock Data ---
const LEADS_BY_STAGE = [
    { stage: "Discovery", count: 850 },
    { stage: "Qualified", count: 620 },
    { stage: "Proposal", count: 340 },
    { stage: "Negotiation", count: 180 },
    { stage: "Closed", count: 120 },
]

const LEADS_BY_OWNER = [
    { name: "Sarah J.", count: 240 },
    { name: "Michael C.", count: 210 },
    { name: "James W.", count: 190 },
    { name: "Emily B.", count: 180 },
    { name: "David L.", count: 140 },
]

const CREATION_TREND = [
    { date: "02/10", count: 42 },
    { date: "02/11", count: 56 },
    { date: "02/12", count: 38 },
    { date: "02/13", count: 65 },
    { date: "02/14", count: 72 },
    { date: "02/15", count: 48 },
    { date: "02/16", count: 52 },
]

export default function LeadReportsPage() {
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
                            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                                <Users className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                Lead Volume & Distribution Reports
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Analyze lead growth trends, pipeline distribution, and ownership balance across your organization.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                        <Button onClick={() => toast({ title: "View: Daily", description: "Showing daily lead volume." })} variant="ghost" size="sm" className="h-8 text-[11px] font-black uppercase text-indigo-600 bg-white shadow-sm px-4">Daily</Button>
                        <Button onClick={() => toast({ title: "View: Weekly", description: "Showing weekly lead volume." })} variant="ghost" size="sm" className="h-8 text-[11px] font-black uppercase text-slate-400 px-4">Weekly</Button>
                        <Button onClick={() => toast({ title: "View: Monthly", description: "Showing monthly lead volume." })} variant="ghost" size="sm" className="h-8 text-[11px] font-black uppercase text-slate-400 px-4">Monthly</Button>
                    </div>
                    <Button onClick={() => toast({ title: "Filters Applied", description: "Advanced data filter panel opened." })} variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-bold text-[12px] px-5">
                        <Filter className="h-4 w-4 mr-2 text-slate-400" /> Filter Data
                    </Button>
                    <Button onClick={() => toast({ title: "Export Started", description: "Compiling lead dataset for download..." })} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-indigo-100 shadow-lg border-none">
                        <Download className="h-4 w-4 mr-2" /> Export Dataset
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Creation Trend */}
                <Card className="lg:col-span-12 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Lead Creation Velocity</h3>
                            <p className="text-[13px] text-slate-500 font-medium">Daily count of new leads entering the system over the last 7 days.</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={CREATION_TREND}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
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
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#6366f1"
                                    strokeWidth={4}
                                    dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Distribution by Stage */}
                <Card className="lg:col-span-7 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8">
                    <div className="space-y-1 mb-8">
                        <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Leads by Pipeline Stage</h3>
                        <p className="text-[13px] text-slate-500 font-medium">Visualizing inventory saturation across the sales funnel.</p>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={LEADS_BY_STAGE} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="stage"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fontWeight: 'bold', fill: '#475569' }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="#6366f1"
                                    radius={[0, 8, 8, 0]}
                                    barSize={24}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Distribution by Owner */}
                <Card className="lg:col-span-5 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8">
                    <div className="space-y-1 mb-8">
                        <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Owner Workload Balance</h3>
                        <p className="text-[13px] text-slate-500 font-medium">Current active inventory assigned per sales representative.</p>
                    </div>
                    <div className="space-y-6">
                        {LEADS_BY_OWNER.map((owner, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center text-[12px] font-bold">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] uppercase font-black text-slate-500">
                                            {owner.name.split('')[0]}
                                        </div>
                                        <span className="text-slate-700">{owner.name}</span>
                                    </div>
                                    <span className="text-indigo-600">{owner.count}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${(owner.count / 300) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-8 mt-4 border-t border-slate-50 flex items-center justify-between">
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Capacity</p>
                            <h4 className="text-[18px] font-black text-slate-900">72.4%</h4>
                        </div>
                        <Button onClick={() => toast({ title: "Optimizing", description: "Rebalancing workload distribution across team." })} variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 px-4">
                            Optimize Distribution
                        </Button>
                    </div>
                </Card>

                {/* Regional Hotspots (Mock Grid) */}
                <Card className="lg:col-span-12 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Geographic Distribution</h3>
                            <p className="text-[13px] text-slate-500 font-medium">Targeting clusters and market penetration by region.</p>
                        </div>
                        <Button onClick={() => toast({ title: "Map View", description: "Loading interactive geographic heatmap..." })} variant="outline" size="sm" className="h-8 border-slate-100 text-[11px] font-black uppercase tracking-widest px-4">See Map View</Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {[
                            { region: "North America", count: 1240, growth: "+12%" },
                            { region: "Europe", count: 850, growth: "+8%" },
                            { region: "APAC", count: 1100, growth: "+24%" },
                            { region: "LATAM", count: 420, growth: "-2%" },
                            { region: "Middle East", count: 310, growth: "+15%" },
                            { region: "Africa", count: 180, growth: "+4%" },
                        ].map((r, i) => (
                            <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100/50 space-y-3">
                                <div className="p-2 rounded-xl bg-white border border-slate-100 w-fit">
                                    <MapPin size={18} className="text-indigo-600" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black text-slate-400 uppercase truncate">{r.region}</p>
                                    <h4 className="text-[18px] font-black text-slate-900">{r.count.toLocaleString()}</h4>
                                    <p className={`text-[10px] font-bold ${r.growth.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{r.growth} YoY</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

            </div>

        </div>
    )
}
