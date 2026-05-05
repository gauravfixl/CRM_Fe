"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Activity,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    Clock,
    Mail,
    Bell,
    Settings2,
    Trash2,
    Play,
    Pause,
    MoreHorizontal,
    TrendingUp,
    CheckCircle2,
    Users,
    Zap,
    MessageSquare,
    ArrowRight,
    MousePointer2,
    Target
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"
import { Switch } from "@/shared/components/ui/switch"

// --- Mock Data: Nurture Sequences ---
const NURTURE_SEQUENCES = [
    {
        id: "1",
        name: "Trial Onboarding Flow",
        steps: 5,
        target: "New Trial Users",
        activeLeads: 420,
        avgOpenRate: 68,
        conversion: 14.2,
        status: "Active",
        lastPulse: "5 mins ago"
    },
    {
        id: "2",
        name: "Enterprise Re-engagement",
        steps: 7,
        target: "Stale High-Value",
        activeLeads: 85,
        avgOpenRate: 42,
        conversion: 8.5,
        status: "Active",
        lastPulse: "1 hour ago"
    },
    {
        id: "3",
        name: "Webinar Post-Event Sync",
        steps: 3,
        target: "Attendees",
        activeLeads: 0,
        avgOpenRate: 0,
        conversion: 0,
        status: "Draft",
        lastPulse: "N/A"
    },
    {
        id: "4",
        name: "Nurture: Dormant Accounts",
        steps: 12,
        target: "Inactive > 90 days",
        activeLeads: 1240,
        avgOpenRate: 18,
        conversion: 2.1,
        status: "Active",
        lastPulse: "12 mins ago"
    },
]

export default function NurtureSequencesPage() {
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
                        className="-ml-2 h-7 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-pink-50 text-pink-600 border border-pink-100 shadow-sm">
                                <Users className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                Nurture Sequences
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Time-based communication flows designed to stay top-of-mind. Automate drip emails and reminders over days or months.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-bold text-[12px] px-5">
                        <TrendingUp className="h-4 w-4 mr-2 text-slate-400" /> Sequence Analytics
                    </Button>
                    <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-indigo-100 shadow-lg border-none">
                        <Plus className="h-4 w-4 mr-2" /> Design Sequence
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Global Nurture Stats */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: "Active in Sequences", val: "1,745", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
                        { label: "Avg Open Rate", val: "38.2%", icon: Mail, color: "text-indigo-600", bg: "bg-indigo-50" },
                        { label: "Conversion Lift", val: "+22%", icon: Target, color: "text-emerald-500", bg: "bg-emerald-50" },
                        { label: "Nurture Velocity", val: "High", icon: Activity, color: "text-pink-600", bg: "bg-pink-50" },
                    ].map((m, i) => (
                        <Card key={i} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl bg-white overflow-hidden">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
                                    <h4 className="text-[22px] font-black text-slate-900">{m.val}</h4>
                                </div>
                                <div className={`p-2.5 rounded-xl ${m.bg} ${m.color}`}>
                                    <m.icon size={18} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Sequences Area */}
                <div className="lg:col-span-12">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h2 className="text-[16px] font-bold text-slate-900">Communication Workflows</h2>
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-slate-300" />
                            <Badge variant="outline" className="border-slate-100 text-slate-400 font-bold px-2 h-6 text-[10px]">Filtering Active</Badge>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {NURTURE_SEQUENCES.map((seq) => (
                            <Card key={seq.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl group hover:ring-indigo-100 transition-all bg-white overflow-hidden flex flex-col">
                                <CardContent className="p-8 space-y-6 flex-1">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-[18px] font-bold text-slate-900 group-hover:text-pink-600 transition-colors">{seq.name}</h3>
                                                <Badge className={`
                                                    ${seq.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'} 
                                                    border-none h-4.5 px-2 text-[9px] font-black uppercase tracking-wider
                                                `}>
                                                    {seq.status}
                                                </Badge>
                                            </div>
                                            <p className="text-[13px] text-slate-500 font-medium">Target: <span className="text-slate-900 font-bold">{seq.target}</span></p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col items-end mr-3">
                                                <span className="text-[10px] font-black text-slate-300 uppercase leading-none">Status</span>
                                                <Switch checked={seq.status === 'Active'} className="mt-1 data-[state=checked]:bg-pink-500" />
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-slate-900 rounded-xl">
                                                        <MoreHorizontal size={20} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44 p-1 rounded-xl shadow-xl">
                                                    <DropdownMenuItem className="py-2.5 text-[12px] font-medium"><Play className="h-3.5 w-3.5 mr-2 text-indigo-500" /> Start Leads</DropdownMenuItem>
                                                    <DropdownMenuItem className="py-2.5 text-[12px] font-medium"><Pause className="h-3.5 w-3.5 mr-2 text-rose-500" /> Pause Global</DropdownMenuItem>
                                                    <DropdownMenuItem className="py-2.5 text-[12px] font-medium"><Settings2 className="h-3.5 w-3.5 mr-2 text-slate-400" /> Edit Steps</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    {/* Multi-step indicator */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <span>Flow Blueprint</span>
                                            <span>{seq.steps} Steps</span>
                                        </div>
                                        <div className="flex gap-1.5 h-1.5">
                                            {[...Array(seq.steps)].map((_, i) => (
                                                <div key={i} className={`flex-1 rounded-full ${seq.status === 'Active' ? 'bg-pink-500' : 'bg-slate-100'}`} />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 space-y-1">
                                            <p className="text-[11px] font-bold text-slate-400 uppercase">Leads IN</p>
                                            <h4 className="text-[20px] font-black text-slate-900 tabular-nums">{seq.activeLeads.toLocaleString()}</h4>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 space-y-1">
                                            <p className="text-[11px] font-bold text-slate-400 uppercase">Lift</p>
                                            <h4 className="text-[20px] font-black text-emerald-500 tabular-nums">+{seq.conversion}%</h4>
                                        </div>
                                    </div>
                                </CardContent>
                                <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400">
                                        <span className="flex items-center gap-1.5"><Mail size={14} className="text-indigo-400" /> {seq.avgOpenRate}% Open</span>
                                        <span className="flex items-center gap-1.5"><MousePointer2 size={14} className="text-cyan-400" /> 8.4% Click</span>
                                    </div>
                                    <Button variant="ghost" className="h-8 text-pink-600 font-bold text-[11px] hover:bg-white px-3 rounded-lg border border-transparent hover:border-pink-100">
                                        Timeline View
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Bottom Optimization Callout */}
                <div className="lg:col-span-12">
                    <Card className="border-none shadow-xl shadow-pink-100/20 ring-1 ring-slate-100 rounded-3xl bg-slate-900 text-white p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 group-hover:scale-125 transition-transform">
                            <Target size={200} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                            <div className="space-y-6">
                                <div className="p-3 rounded-2xl bg-pink-500 w-fit shadow-xl shadow-pink-500/20">
                                    <Zap size={32} className="fill-white" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-[28px] font-black tracking-tighter leading-tight">Exit Strategy Optimization</h3>
                                    <p className="text-[15px] text-slate-400 font-medium leading-relaxed">
                                        Nurture sequences are 40% more effective when leads are automatically removed the instant they reach "Discovery Done" stage.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Button className="h-11 bg-white text-slate-900 hover:bg-slate-100 font-black px-8 rounded-xl border-none">Configure Global Exit</Button>
                                    <Button variant="ghost" className="text-indigo-400 hover:text-white font-bold h-11 px-6">Learn Strategy</Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[12px] font-black text-slate-500 uppercase tracking-widest">Auto-Exit Impact</h4>
                                <div className="space-y-6">
                                    {[
                                        { label: "CRM Data Accuracy", val: 98, color: "bg-emerald-500" },
                                        { label: "Inbox Noise Reduction", val: 42, color: "bg-cyan-500" },
                                        { label: "Rep Focus Lift", val: 12, color: "bg-pink-500" },
                                    ].map((stat, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between items-center text-[13px] font-bold">
                                                <span>{stat.label}</span>
                                                <span className="text-slate-300">+{stat.val}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className={`h-full ${stat.color}`} style={{ width: `${stat.val}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>

        </div>
    )
}
