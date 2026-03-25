"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
    PieChart,
    Pie,
    Legend
} from "recharts"
import {
    Clock,
    ChevronLeft,
    Download,
    Zap,
    AlertTriangle,
    ShieldAlert,
    Timer,
    History,
    Filter,
    ArrowRight,
    Search,
    BadgeAlert,
    Gauge
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { Progress } from "@/shared/components/ui/progress"
import { useToast } from "@/shared/components/ui/use-toast"
import { Input } from "@/shared/components/ui/input"

// --- Mock Data ---
const AGING_DISTRIBUTION = [
    { range: '0-7 Days', count: 45, color: '#10b981' },
    { range: '8-14 Days', count: 28, color: '#f59e0b' },
    { range: '15-30 Days', count: 18, color: '#f97316' },
    { range: '30+ Days', count: 12, color: '#f43f5e' },
]

const STAGE_AGING = [
    { stage: 'New', avg: 0.8, critical: 2 },
    { stage: 'Contacted', avg: 1.5, critical: 3 },
    { stage: 'Engaged', avg: 3.2, critical: 5 },
    { stage: 'Qualified', avg: 5.1, critical: 8 },
    { stage: 'Proposal Shared', avg: 8.2, critical: 12 },
    { stage: 'Negotiation', avg: 4.5, critical: 7 },
    { stage: 'Decision Pending', avg: 12.0, critical: 18 },
]

const CRITICAL_LEADS = [
    { id: '1', name: 'Ava Robinson', company: 'Robinson Realty', stage: 'Decision Pending', days: 17, owner: 'Anita S.', value: '$95,000' },
    { id: '2', name: 'James Anderson', company: 'Anderson Finance', stage: 'Engaged', days: 12, owner: 'Rajesh K.', value: '$32,000' },
    { id: '3', name: 'Charlotte Walker', company: 'Media Net', stage: 'Proposal Shared', days: 14, owner: 'Anita S.', value: '$42,000' },
]

import { usePipelineData, PipelineLead } from "@/shared/hooks/use-pipeline-data"

export default function AgingAnalysisPage() {
    const { leads, isLoaded, pulseLead } = usePipelineData()
    const { toast } = useToast()
    const router = useRouter()
    const [threshold, setThreshold] = useState(15)
    const [isPulsing, setIsPulsing] = useState(false)

    // Filter leads that exceed the threshold (simulated logic based on stageTime string)
    const criticalLeads = leads.filter(l => {
        const days = parseInt(l.stageTime.replace(/[^0-9]/g, '')) || 0
        return days >= threshold && l.stage !== 'won' && l.stage !== 'lost'
    })

    const handlePulse = () => {
        setIsPulsing(true)
        setTimeout(() => {
            criticalLeads.forEach(l => pulseLead(l.id))
            setIsPulsing(false)
            toast({
                title: "Alerts Dispatched",
                description: `Owners of ${criticalLeads.length} stagnant leads have been notified.`,
            })
        }, 1500)
    }

    const handleThresholdChange = (val: string) => {
        const num = parseInt(val) || 0
        setThreshold(num)
        if (num < 10) {
            toast({
                title: "Aggressive Threshold Set",
                description: "You will now see leads stalling for more than " + num + " days.",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/lead-management/pipeline/board')}
                        className="-ml-2 h-7 text-[10px] font-medium text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back to Pipeline
                    </Button>
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                                <Timer className="h-4 w-4" />
                            </div>
                            <h1 className="text-[20px] font-semibold tracking-tight text-slate-900">
                                Aging Analysis
                            </h1>
                        </div>
                        <p className="text-[12px] text-slate-500 font-medium max-w-xl">
                            Identifying stagnation and pipeline rot to ensure continuous flow velocity.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex flex-col gap-1 mr-4">
                        <span className="text-[10px] font-medium text-slate-400">Critical Threshold</span>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                value={threshold}
                                onChange={(e) => handleThresholdChange(e.target.value)}
                                className="h-8 w-16 text-[12px] font-medium border-slate-100 focus:ring-rose-200"
                            />
                            <span className="text-[12px] font-medium text-slate-500">Days</span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => toast({ title: "Filter Results", description: "Filtering stagnation data by team members." })}
                        className="h-10 border-slate-100 text-slate-600 font-medium bg-white px-4"
                    >
                        <Filter className="h-4 w-4 mr-2 text-slate-400" /> All owners
                    </Button>
                    <Button
                        onClick={handlePulse}
                        disabled={isPulsing}
                        className="h-10 bg-rose-600 hover:bg-rose-700 text-white font-medium px-6 shadow-sm border-none disabled:opacity-50"
                    >
                        {isPulsing ? "Notifying..." : "Pulse All Stagnant"}
                    </Button>
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* Card 1 - Pipeline Velocity: light indigo */}
                <Card className="border border-indigo-100 shadow-sm rounded-2xl bg-indigo-50 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                        <Gauge size={100} />
                    </div>
                    <CardContent className="p-6 space-y-3 relative z-10">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600">
                                <Zap className="h-4 w-4" />
                            </div>
                            <span className="text-[12px] font-medium text-indigo-500">Overall pipeline velocity</span>
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="text-[28px] font-semibold tracking-tight text-indigo-900">8.4 Days</h3>
                            <p className="text-[12px] font-normal text-indigo-500">Average time to transition stages</p>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg w-fit">
                            <ArrowRight size={12} className="-rotate-45" /> +2.1d Faster than last month
                        </div>
                    </CardContent>
                </Card>

                {/* Card 2 - Stagnant Leads: light rose */}
                <Card className="border border-rose-100 shadow-sm rounded-2xl bg-rose-50 relative overflow-hidden group">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <span className="text-[12px] font-medium text-rose-400">Stagnant leads</span>
                                <h3 className="text-[28px] font-semibold text-rose-900">12</h3>
                            </div>
                            <div className="p-3 rounded-2xl bg-rose-100 text-rose-500">
                                <AlertTriangle size={22} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[11px] font-medium">
                                <span className="text-rose-400">Aging Risk Index</span>
                                <span className="text-rose-600">High Risk (45%)</span>
                            </div>
                            <Progress value={45} className="h-1.5 bg-rose-100" />
                        </div>
                        <p className="text-[12px] font-normal text-rose-500 leading-relaxed">
                            <span className="font-semibold text-rose-600">Critical:</span> Leads exceeding your 15-day threshold require immediate owner escalation.
                        </p>
                    </CardContent>
                </Card>

                {/* Card 3 - Aging Distribution: white/light */}
                <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
                    <CardHeader className="px-5 pt-5 pb-2">
                        <CardTitle className="text-[14px] font-semibold text-slate-700">Aging Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                        <div className="h-[170px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={AGING_DISTRIBUTION}>
                                    <XAxis
                                        dataKey="range"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 500, fill: '#94a3b8' }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={36}>
                                        {AGING_DISTRIBUTION.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Aging Heatmap / Breakdown */}
                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-2xl">
                    <CardHeader className="p-6 border-b border-slate-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-[16px] font-semibold text-slate-900">Stage Aging Intelligence</CardTitle>
                                <CardDescription className="text-[12px] font-medium">Heatmap of lead stagnation across lifecycle</CardDescription>
                            </div>
                            <Button variant="ghost" className="h-8 text-indigo-600 font-medium text-[11px]">
                                View Full Heatmap
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-400">Stage Name</th>
                                        <th className="px-6 py-4 text-center text-[11px] font-medium text-slate-400">Avg. Time</th>
                                        <th className="px-6 py-4 text-center text-[11px] font-medium text-slate-400">Max Stagnation</th>
                                        <th className="px-6 py-4 text-center text-[11px] font-medium text-slate-400">Attrition Rate</th>
                                        <th className="px-6 py-4 text-right text-[11px] font-medium text-slate-400">Flow Health</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {STAGE_AGING.map((s, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="text-[13px] font-medium text-slate-700">{s.stage}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-[13px] font-medium text-slate-600">{s.avg}d</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-[13px] font-medium text-rose-500">{s.critical}d</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-[12px] font-medium text-slate-400">{(s.critical / s.avg * 10).toFixed(1)}%</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${s.avg > 8 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                                                    <span className={`text-[11px] font-medium ${s.avg > 8 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                        {s.avg > 8 ? 'Stalling' : 'Fluid'}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Critical Stalling Leads */}
                <Card className="lg:col-span-4 border-none shadow-sm ring-1 ring-slate-100 rounded-2xl">
                    <CardHeader className="p-6">
                        <div className="flex items-center gap-2">
                            <BadgeAlert className="h-4 w-4 text-rose-600" />
                            <CardTitle className="text-[16px] font-bold text-slate-900">Escalation Queue</CardTitle>
                        </div>
                        <CardDescription className="text-[12px] font-medium leading-none mt-2">Leads stagnant for more than {threshold} days</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-4">
                        {criticalLeads.length > 0 ? (
                            criticalLeads.map((l, i) => (
                                <div key={l.id} className="group relative p-4 rounded-2xl border border-slate-100 hover:border-rose-100 hover:bg-rose-50/30 transition-all duration-300">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="space-y-1">
                                            <h4 className="text-[14px] font-semibold text-slate-800 group-hover:text-rose-600 transition-colors uppercase">{l.name}</h4>
                                            <p className="text-[11px] font-medium text-slate-500">{l.company}</p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[15px] font-medium text-slate-700">{l.value}</span>
                                            <Badge variant="outline" className="text-[9px] font-medium h-4 px-1.5 rounded bg-white text-rose-500 border-rose-100">
                                                {l.stageTime} aged
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6 border border-white">
                                                <AvatarFallback className="bg-slate-100 text-[9px] font-medium text-slate-500">{l.owner.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-[11px] font-medium text-slate-600">{l.owner}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 text-[10px] font-medium text-rose-500 hover:bg-rose-50 p-0 px-2 rounded-lg"
                                            onClick={() => {
                                                pulseLead(l.id)
                                                toast({ title: "Individual Pulse", description: `Owner of ${l.name} notified.` })
                                            }}
                                        >
                                            Pulse <ArrowRight size={10} className="ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center space-y-2">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full w-fit mx-auto">
                                    <Zap size={20} />
                                </div>
                                <p className="text-[13px] font-medium text-slate-500">No leads currently exceed the threshold.</p>
                            </div>
                        )}

                        <div className="pt-2">
                            <Button
                                onClick={() => router.push('/lead-management/all-leads')}
                                className="w-full h-10 bg-slate-800 hover:bg-slate-900 text-white font-medium text-[12px] rounded-xl shadow-sm border-none"
                            >
                                View all {leads.length} leads
                            </Button>
                        </div>

                        <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                            <History className="h-5 w-5 text-amber-600 shrink-0" />
                            <p className="text-[11px] font-medium text-amber-900 leading-relaxed">
                                <span className="font-medium underline decoration-amber-300 decoration-2 italic">System recommendation:</span> Auto-reassign leads that reach 30+ days without activity to prevent lead leakage.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}
