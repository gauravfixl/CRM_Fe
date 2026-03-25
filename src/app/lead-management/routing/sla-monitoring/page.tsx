"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Activity,
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    Clock,
    Filter,
    Flame,
    LayoutGrid,
    PieChart,
    Search,
    ShieldAlert,
    TrendingUp,
    Users,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    Gauge,
    Timer,
    History,
    RefreshCw
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"

// --- Mock Data: SLA Incidents ---
const AT_RISK_LEADS = [
    { id: "1", lead: "Alex Rivera", timeRemaining: "4m 20s", policy: "Enterprise First Response", owner: "Sarah J.", score: 92 },
    { id: "2", lead: "Jordan Lee", timeRemaining: "12m 45s", policy: "Standard Inbound", owner: "Mike R.", score: 74 },
    { id: "3", lead: "Casey Chen", timeRemaining: "18m 10s", policy: "High Intent Follow-up", owner: "Unassigned", score: 88 },
]

const RECENT_BREACHES = [
    { id: "b1", lead: "Taylor Smith", delay: "+14m", policy: "First Response", owner: "James K.", severity: "Critical" },
    { id: "b2", lead: "Morgan Day", delay: "+2.5h", policy: "Next Step Follow-up", owner: "Sarah J.", severity: "Moderate" },
]

export default function SLAMonitoringPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleRefresh = () => {
        setIsRefreshing(true)
        toast({ title: "Monitoring Sync", description: "Fetching latest incident heartbeats from assignment engine..." })
        setTimeout(() => setIsRefreshing(false), 1500)
    }

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
                                <Activity className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                SLA Live Monitoring
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Real-time view of response discipline. Monitor leads at risk of breach and track incident intensity across the pipeline.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5"
                    >
                        {isRefreshing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2 text-slate-400" />}
                        {isRefreshing ? "Syncing..." : "Sync Monitor"}
                    </Button>
                    <Badge className="h-10 px-4 bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-2 font-semibold text-[11px] uppercase tracking-wider rounded-xl">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Global Engine: Healthy
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Real-time Compliance Gauges */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] font-semibold text-slate-400 tracking-wider">Global Compliance</p>
                                <Gauge size={18} className="text-indigo-600" />
                            </div>
                            <div className="flex flex-col items-center">
                                <h3 className="text-[36px] font-semibold tabular-nums text-slate-900 tracking-tighter">88.4%</h3>
                                <div className="h-1.5 w-full bg-slate-50 rounded-full mt-2 overflow-hidden">
                                    <div className="h-full bg-indigo-600 w-[88.4%]" />
                                </div>
                                <p className="text-[11px] font-semibold text-emerald-500 mt-3 flex items-center gap-1">
                                    <ArrowUpRight size={14} /> +2.1% improvement
                                </p>
                            </div>
                        </Card>

                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6 space-y-4 text-center">
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] font-semibold text-slate-400 tracking-wider">Active Incidents</p>
                                <Zap size={18} className="text-rose-500 fill-rose-500" />
                            </div>
                            <h3 className="text-[36px] font-semibold tabular-nums text-rose-500 tracking-tighter mt-2">12</h3>
                            <p className="text-[11px] font-medium text-slate-400">Breaches requiring resolution</p>
                            <Button onClick={() => toast({ title: "Incident Queue", description: "Redirecting to active breach resolution log." })} className="w-full bg-rose-50 text-rose-600 hover:bg-rose-100 border-none font-semibold text-[10px] uppercase tracking-wider h-8 mt-2">
                                Jump to Resolution
                            </Button>
                        </Card>

                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] font-semibold text-slate-400 tracking-wider">Avg. Response</p>
                                <Timer size={18} className="text-cyan-600" />
                            </div>
                            <div className="flex flex-col items-center">
                                <h3 className="text-[36px] font-semibold tabular-nums text-slate-900 tracking-tighter">12.4m</h3>
                                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mt-2">
                                    Target <span className="text-indigo-600">15m</span>
                                </div>
                                <p className="text-[11px] font-semibold text-emerald-500 mt-3 flex items-center gap-1">
                                    <ShieldAlert size={14} /> 98% within SLA
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Leads At Risk Timeline */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-[16px] font-semibold text-slate-900 flex items-center gap-2">
                                Leads At Immediate Risk <Badge className="bg-rose-100 text-rose-600 border-none font-semibold px-2 h-5 text-[10px]">{AT_RISK_LEADS.length}</Badge>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {AT_RISK_LEADS.map((lead) => (
                                <Card key={lead.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl bg-white group hover:ring-rose-200 transition-all overflow-hidden relative">
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500 animate-pulse" />
                                    <CardContent className="p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="p-3 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                                                <Flame size={20} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <h4 className="text-[15px] font-semibold text-slate-900">{lead.lead}</h4>
                                                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                                                    <span>Policy: <span className="text-slate-900 font-semibold">{lead.policy}</span></span>
                                                    <span>•</span>
                                                    <span>Owner: <span className="text-indigo-600 font-semibold">{lead.owner}</span></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1">
                                            <span className="text-[10px] font-semibold text-rose-500 tracking-wider">Time Remaining</span>
                                            <Badge className="bg-rose-50 text-rose-600 border border-rose-100 font-semibold text-[14px] tabular-nums px-3 h-8 flex items-center gap-2">
                                                <Clock size={14} /> {lead.timeRemaining}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Performance Side-bars */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden">
                        <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/10">
                            <CardTitle className="text-[16px] font-semibold">Recent Breaches</CardTitle>
                            <CardDescription className="text-[11px] font-medium text-slate-400 tracking-wider">Last 60 Minutes</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            {RECENT_BREACHES.map((b) => (
                                <div key={b.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 group hover:bg-white hover:shadow-sm transition-all">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-0.5 min-w-0">
                                            <h5 className="text-[13px] font-semibold text-slate-900 truncate">{b.lead}</h5>
                                            <p className="text-[10px] font-medium text-slate-400">{b.policy}</p>
                                        </div>
                                        <Badge className={`border-none font-semibold text-[9px] h-4.5 px-1.5 uppercase ${b.severity === 'Critical' ? 'bg-rose-100 text-rose-500' : 'bg-amber-100 text-amber-500'}`}>{b.severity}</Badge>
                                    </div>
                                    <div className="flex justify-between items-center text-[12px] font-semibold">
                                        <span className="text-slate-400">Total Delay</span>
                                        <span className="text-rose-600 tabular-nums">{b.delay}</span>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-indigo-600 font-semibold tracking-wider uppercase text-[10px] h-9 hover:bg-indigo-50 flex items-center justify-center gap-2 mt-2">
                                <History size={14} /> View Full Breach Log
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-emerald-50 text-emerald-900 p-6 space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-emerald-100/50 text-emerald-600">
                                <TrendingUp size={20} className="" />
                            </div>
                            <h4 className="text-[16px] font-semibold">SLA Performance Delta</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-semibold text-emerald-600/80 tracking-wider">This Week</p>
                                <h4 className="text-[20px] font-semibold text-emerald-700 tabular-nums">94.2%</h4>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-semibold text-emerald-600/80 tracking-wider">Last Week</p>
                                <h4 className="text-[20px] font-semibold text-emerald-700/50 line-through decoration-rose-300 tabular-nums">88.1%</h4>
                            </div>
                        </div>
                        <div className="pt-2">
                            <p className="text-[12px] text-emerald-700/80 leading-relaxed font-medium italic">
                                "Consistency is improving. High-Intent leads are being picked up 15% faster since Tuesday's rule update."
                            </p>
                        </div>
                    </Card>

                    <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-100 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[13px] font-semibold text-indigo-900">Compliance by Segment</h4>
                            <PieChart size={16} className="text-indigo-600" />
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: "Enterprise", val: 98, color: "bg-indigo-500" },
                                { label: "SMB / Mid-Market", val: 74, color: "bg-amber-500" },
                                { label: "General Inbound", val: 82, color: "bg-emerald-500" },
                            ].map((s, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-[11px] font-semibold tracking-wider text-indigo-900">
                                        <span>{s.label}</span>
                                        <span className="tabular-nums">{s.val}%</span>
                                    </div>
                                    <Progress value={s.val} className={`h-1.5 bg-indigo-100 [&>div]:${s.color}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
