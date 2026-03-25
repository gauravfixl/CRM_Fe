"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Activity,
    Phone,
    Mail,
    Calendar,
    CheckCircle2,
    ChevronLeft,
    Download,
    Filter,
    ArrowUpRight,
    TrendingUp,
    Users,
    Clock,
    Zap,
    Scale,
    Layers,
    MessageSquare,
    BarChart3,
    Trophy
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
const ACTIVITY_TREND = [
    { date: "Mon", calls: 120, emails: 450, meetings: 24 },
    { date: "Tue", calls: 145, emails: 380, meetings: 32 },
    { date: "Wed", calls: 168, emails: 520, meetings: 28 },
    { date: "Thu", calls: 132, emails: 410, meetings: 45 },
    { date: "Fri", calls: 110, emails: 290, meetings: 20 },
]

const REP_LEADERBOARD = [
    { name: "Sarah Johnson", calls: 420, conversion: 14.2 },
    { name: "Michael Chen", calls: 380, conversion: 12.8 },
    { name: "James Wilson", calls: 350, conversion: 15.5 },
    { name: "Emily Davis", calls: 310, conversion: 11.2 },
    { name: "David Brown", calls: 280, conversion: 9.8 },
]

export default function ActivityReportsPage() {
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
                                <Activity size={20} />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                Activity Productivity Hub
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Track the execution engine. Monitor calls, emails, and meetings to measure rep productivity vs conversion success.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={() => toast({ title: "Filter Applied", description: "Showing activities during business hours only." })} variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-bold text-[12px] px-5">
                        <Clock className="h-4 w-4 mr-2 text-slate-400" /> Business Hours Only
                    </Button>
                    <Button onClick={() => toast({ title: "Top Performer", description: "Loading rep leaderboard with current rankings." })} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-indigo-100 shadow-lg border-none">
                        <Trophy className="h-4 w-4 mr-2" /> View Winners
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Global Activity Stats */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Phone Outreach", val: "2,840 Calls", pct: 72, icon: Phone, color: "text-indigo-600", bg: "bg-indigo-50" },
                        { label: "Email Engagement", val: "12,650 Sent", pct: 88, icon: Mail, color: "text-cyan-600", bg: "bg-cyan-50" },
                        { label: "Meetings Booked", val: "420 Secured", pct: 45, icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-50" },
                    ].map((s, i) => (
                        <Card key={i} className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className={`p-3 rounded-2xl ${s.bg} ${s.color}`}>
                                    <s.icon size={22} />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Target Progress</p>
                                    <span className="text-[14px] font-black text-slate-900">{s.pct}%</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                                <h4 className="text-[24px] font-black text-slate-900">{s.val}</h4>
                            </div>
                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                <div className={`h-full ${i === 0 ? 'bg-indigo-500' : i === 1 ? 'bg-cyan-500' : 'bg-emerald-500'}`} style={{ width: `${s.pct}%` }} />
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Activity Trend Chart */}
                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Execution Pulse (Last 5 Days)</h3>
                            <p className="text-[13px] text-slate-500 font-medium">Daily distribution of high-value activities by the sales team.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                                <span className="text-[11px] font-bold text-slate-500 uppercase">Calls</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                <span className="text-[11px] font-bold text-slate-500 uppercase">Mtgs</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ACTIVITY_TREND}>
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
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="calls" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={32} />
                                <Bar dataKey="meetings" fill="#10b981" radius={[6, 6, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Leaderboard Sidebar */}
                <Card className="lg:col-span-4 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-8 space-y-8 flex flex-col">
                    <div className="space-y-1">
                        <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Activity Leaderboard</h3>
                        <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest font-black">Success Ratio focused</p>
                    </div>
                    <div className="space-y-6 flex-1">
                        {REP_LEADERBOARD.map((rep, i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-[12px] ${i === 0 ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-50 text-slate-400'}`}>
                                        {i === 0 ? <Zap size={16} /> : i + 1}
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="text-[14px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{rep.name}</h4>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">{rep.calls} Activities</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h4 className="text-[14px] font-black text-emerald-600">{rep.conversion}%</h4>
                                    <p className="text-[9px] font-black text-slate-300 uppercase">CR</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button onClick={() => toast({ title: "Full Roster", description: "Loading complete sales rep activity table." })} variant="outline" className="w-full h-10 border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:bg-indigo-50">
                        View Full Roster
                    </Button>
                </Card>

                {/* Automation Impact Callout */}
                <div className="lg:col-span-12">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-indigo-600 text-white p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <Scale size={200} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                            <div className="space-y-6">
                                <h3 className="text-[28px] font-black tracking-tighter leading-tight">Activity-to-Revenue Efficiency</h3>
                                <p className="text-[15px] text-indigo-100/80 font-medium leading-relaxed">
                                    Your team is performing <strong>14.2 activities per lead</strong> on average. Automated sequences have reduced manual email burden by <strong>62%</strong>, allowing reps to focus <strong>2x more time</strong> on high-value calls.
                                </p>
                                <div className="flex items-center gap-4">
                                    <Button onClick={() => toast({ title: "Task ROI Report", description: "Calculating ROI per activity type." })} className="h-11 bg-white text-slate-900 hover:bg-slate-100 font-black px-8 rounded-xl border-none">View Task ROI</Button>
                                    <Button onClick={() => toast({ title: "Benchmark Mode", description: "Loading industry benchmark comparison view." })} variant="ghost" className="text-indigo-200 hover:text-white font-bold h-11 px-6 underline decoration-indigo-400/50">Benchmark Analysis</Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Call Connect Rate", val: "24%", trend: "+2%" },
                                    { label: "Avg Call Duration", val: "6.4m", trend: "+1.2m" },
                                    { label: "Email Open Rate", val: "48%", trend: "+15%" },
                                    { label: "Meeting Show Rate", val: "92%", trend: "Peak" },
                                ].map((stat, i) => (
                                    <div key={i} className="p-5 rounded-2xl bg-white/10 border border-white/10 space-y-1">
                                        <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">{stat.label}</p>
                                        <div className="flex justify-between items-end">
                                            <h4 className="text-[20px] font-black">{stat.val}</h4>
                                            <span className="text-[10px] font-bold text-emerald-400">{stat.trend}</span>
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
