"use client"

import React, { useState, useEffect } from "react"
import {
    TrendingUp,
    Zap,
    Target,
    Activity,
    LineChart,
    ChevronDown,
    Calendar,
    Download,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"

/**
 * 📊 Sprint & Progress Report
 * Focuses on velocity, burn-down, and cycle time.
 */
export default function SprintProgressReport() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="w-full h-full p-6 space-y-8 font-outfit" style={{ zoom: "80%" }}>
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
                        <LineChart size={14} />
                        Performance Analytics
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sprint & Progress Report</h1>
                    <p className="text-sm text-slate-500 font-medium italic">
                        Real-time visualization of sprint velocity and development throughput.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-10 border-slate-200 text-slate-600 font-bold gap-2">
                        <Calendar size={16} />
                        Active Sprint
                        <ChevronDown size={14} className="text-slate-400" />
                    </Button>
                    <Button size="sm" className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shadow-lg shadow-indigo-100 transition-all hover:scale-105">
                        <Download size={16} />
                        Export Insights
                    </Button>
                </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Avg. Velocity", value: "48 pts", trend: "+12%", up: true, icon: <Zap />, color: "text-indigo-600", bg: "bg-indigo-50/50" },
                    { title: "Completion Rate", value: "94.2%", trend: "+2.4%", up: true, icon: <Target />, color: "text-emerald-600", bg: "bg-emerald-50/50" },
                    { title: "Scope Creep", value: "8 pts", trend: "-5%", up: false, icon: <Activity />, color: "text-amber-600", bg: "bg-amber-50/50" },
                    { title: "Cycle Time", value: "3.4d", trend: "+0.2d", up: false, icon: <BarChart3 />, color: "text-rose-600", bg: "bg-rose-50/50" }
                ].map((metric, i) => (
                    <Card key={metric.title} className={`border border-slate-100 shadow-sm ${metric.bg} overflow-hidden group`}>
                        <CardContent className="p-5 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div className={`h-10 w-10 bg-white shadow-sm border border-slate-100 ${metric.color} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                                    {metric.icon}
                                </div>
                                <div className={`flex items-center gap-1 text-[11px] font-bold ${metric.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {metric.trend}
                                    {metric.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{metric.title}</p>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{metric.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Burn-down Visualization */}
                <Card className="lg:col-span-2 border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-50 px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-bold text-slate-800 tracking-tight">Active Burn-down</CardTitle>
                                <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Sprint-014: Enterprise Core Navigation</CardDescription>
                            </div>
                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px]">On Track</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="relative h-[300px] w-full flex items-end gap-2">
                            {/* Mock Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full border-t border-slate-300 border-dashed" />)}
                            </div>

                            {/* Visual Representation of Burn-down */}
                            {Array.from({ length: 14 }).map((_, i) => (
                                <div key={i} className="flex-1 flex flex-col justify-end gap-1 group cursor-pointer h-full relative z-10">
                                    <div
                                        className="w-full bg-slate-100 group-hover:bg-indigo-600 transition-all rounded-t-lg relative"
                                        style={{ height: `${Math.max(10, 100 - (i * 7) + Math.sin(i) * 10)}%` }}
                                    >
                                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                            {Math.round(100 - (i * 7) + Math.sin(i) * 10)} pts
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-tighter">Day {i + 1}</span>
                                </div>
                            ))}

                            {/* Ideal Burn Line (Visual Trick) */}
                            <div className="absolute inset-x-8 top-0 bottom-10 pointer-events-none border-b-2 border-slate-200 border-dashed transform rotate-[13deg] origin-top-left opacity-30" />
                        </div>
                    </CardContent>
                </Card>

                {/* Velocity History */}
                <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-50 px-8 py-6">
                        <CardTitle className="text-[14px] font-black text-slate-800 uppercase tracking-widest">Velocity History</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        {[
                            { sprint: "Sprint 13", points: "42 pts", target: "45 pts", status: "80%" },
                            { sprint: "Sprint 12", points: "45 pts", target: "45 pts", status: "100%" },
                            { sprint: "Sprint 11", points: "38 pts", target: "40 pts", status: "95%" },
                            { sprint: "Sprint 10", points: "52 pts", target: "45 pts", status: "115%" },
                        ].map((s, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                                    <span className="text-slate-500">{s.sprint}</span>
                                    <span className="text-slate-800">{s.points} / {s.target}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${parseInt(s.status) >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'} rounded-full transition-all duration-1000`}
                                        style={{
                                            width: mounted ? (parseInt(s.status) > 100 ? "100%" : s.status) : "0%",
                                            transitionDelay: `${i * 100}ms`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        <Button variant="ghost" className="w-full text-indigo-600 font-bold text-xs uppercase tracking-widest hover:bg-indigo-50">View Older Sprints</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
