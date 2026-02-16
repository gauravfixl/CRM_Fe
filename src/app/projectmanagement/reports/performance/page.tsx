"use client"

import React, { useState, useEffect } from "react"
import {
    Target,
    Zap,
    Trophy,
    TrendingUp,
    Activity,
    ChevronDown,
    Calendar,
    Download,
    PieChart,
    Award,
    CheckCircle2,
    Star
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"

/**
 * 🏆 Performance & Recognition Report
 * High-level individual output and quality metrics.
 */
export default function PerformanceReport() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const performers = [
        { name: "Sahil S.", avatar: "SS", score: 98, tasks: 24, quality: "99.2%", badge: "Top Performer" },
        { name: "Sarah K.", avatar: "SK", score: 92, tasks: 31, quality: "98.5%", badge: "Efficiency King" },
        { name: "James W.", avatar: "JW", score: 88, tasks: 19, quality: "100%", badge: "Bug Buster" },
    ]

    return (
        <div className="w-full h-full p-6 space-y-8 font-outfit" style={{ zoom: "80%" }}>
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-widest">
                        <Award size={14} />
                        Talent Optimization
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Performance Analytics</h1>
                    <p className="text-sm text-slate-500 font-medium italic">
                        Evaluate delivery excellence and individual contribution across the workspace.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-10 border-slate-200 text-slate-600 font-bold gap-2">
                        <Calendar size={16} />
                        This Quarter
                        <ChevronDown size={14} className="text-slate-400" />
                    </Button>
                    <Button size="sm" className="h-10 bg-amber-500 hover:bg-amber-600 text-white font-bold gap-2 shadow-lg shadow-amber-100 transition-all hover:scale-105">
                        <Trophy size={16} />
                        Leaderboard View
                    </Button>
                </div>
            </div>

            {/* Performance High-level Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Delivery Score", value: "92/100", icon: <Target />, color: "text-indigo-600", bg: "bg-indigo-50/50" },
                    { label: "PR Cycle Time", value: "1.2h", icon: <Zap />, color: "text-amber-500", bg: "bg-amber-50/50" },
                    { label: "Bug Density", value: "0.4%", icon: <Activity />, color: "text-emerald-500", bg: "bg-emerald-50/50" },
                    { label: "Task completion", value: "142", icon: <CheckCircle2 />, color: "text-blue-600", bg: "bg-blue-50/50" }
                ].map((stat, i) => (
                    <Card key={i} className={`border border-slate-100 shadow-sm ${stat.bg} p-5 group flex items-start gap-4 transition-all hover:shadow-md`}>
                        <div className={`h-10 w-10 ${stat.color} bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h4 className="text-lg font-bold text-slate-900 tracking-tight">{stat.value}</h4>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Individual Performers Showcase */}
                <Card className="lg:col-span-2 border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-6">
                        <CardTitle className="text-[14px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                            <Star size={16} className="text-amber-500 fill-amber-500" />
                            Elite Performance Metrics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team Member</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Throughput</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Badge</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {performers.map((p, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8 ring-2 ring-white">
                                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${p.avatar}`} />
                                                        <AvatarFallback>{p.avatar}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm font-black text-slate-700 tracking-tight">{p.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-500" style={{ width: `${p.score}%` }} />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-900">{p.score}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-slate-800 tracking-tight">{p.tasks} tasks</span>
                                                    <span className="text-[10px] font-bold text-emerald-600 mt-0.5">{p.quality} Quality</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <Badge className="bg-amber-50 text-amber-600 border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1">
                                                    {p.badge}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Quality Radar / Chart Placeholder */}
                <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-6">
                        <CardTitle className="text-[14px] font-black text-slate-800 uppercase tracking-widest">Quality Heatmap</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 flex flex-col items-center gap-6">
                        <div className="relative h-48 w-48 rounded-full border-8 border-slate-50 flex items-center justify-center group cursor-pointer transition-transform hover:scale-105">
                            <div className="absolute inset-0 border-[8px] border-indigo-600 rounded-full" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0)' }} />
                            <div className="flex flex-col items-center">
                                <span className="text-4xl font-black text-slate-900 tracking-tighter">98.2%</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Global Quality</span>
                            </div>
                        </div>
                        <div className="w-full space-y-4 pt-4 border-t border-slate-50">
                            {[
                                { label: "Code Coverage", val: "94%" },
                                { label: "Testing Density", val: "88%" },
                                { label: "Peer Review Sat", val: "99.2%" },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                                    <span className="text-slate-400">{item.label}</span>
                                    <span className="text-slate-800">{item.val}</span>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full h-10 bg-slate-100 text-slate-900 hover:bg-slate-200 font-bold text-xs uppercase tracking-widest rounded-xl transition-all">
                            Full Quality Audit
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
