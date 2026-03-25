"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Calendar,
    Clock,
    Zap,
    ChevronLeft,
    Plus,
    Search,
    Filter,
    ArrowUpRight,
    TrendingUp,
    CheckCircle2,
    Users,
    Phone,
    Mail,
    MoreHorizontal,
    Briefcase,
    LayoutGrid,
    MessageSquare,
    Globe,
    ExternalLink,
    Timer,
    Compass
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"

// --- Mock Data ---
const INITIAL_UPCOMING = [
    {
        id: "UP-101",
        time: "In 45 min",
        type: "Meeting",
        title: "Product Roadmap Walkthrough",
        lead: "Aarav Sharma",
        company: "Nexus Tech",
        prepStatus: "Ready",
        priority: "High"
    },
    {
        id: "UP-102",
        time: "3:00 PM",
        type: "Call",
        title: "Commercial Terms Discussion",
        lead: "Ishani Gupta",
        company: "Quantum Solutions",
        prepStatus: "Action Needed",
        priority: "Critical"
    },
    {
        id: "UP-103",
        time: "5:30 PM",
        type: "Task",
        title: "Review LinkedIn Outreach Seq",
        lead: "Pooja Singh",
        company: "Singh Logistics",
        prepStatus: "Ready",
        priority: "Medium"
    },
]

const TOMORROW_PREVIEW = [
    { time: "09:00 AM", title: "Daily Sales Blitz", attendees: 12 },
    { time: "11:30 AM", title: "Contract Signing @ Malhotra HO", attendees: 4 },
    { time: "02:00 PM", title: "Technical Demo: V2 API", attendees: 8 },
]

export default function UpcomingActivitiesPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [activities, setActivities] = useState(INITIAL_UPCOMING)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const togglePrep = (id: string) => {
        setActivities(activities.map(act =>
            act.id === id ? { ...act, prepStatus: act.prepStatus === 'Ready' ? 'Action Needed' : 'Ready' } : act
        ))
        toast({
            title: "Status Updated",
            description: "Readiness status has been toggled.",
        })
    }

    const handleSync = () => {
        toast({
            title: "Calendar Syncing",
            description: "Fetching latest slots from G-Suite and Outlook...",
        })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm border-l-[6px] border-l-indigo-600">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                                <Timer size={20} />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Upcoming Readiness Hub
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Next 48 hours of operational planning. Audit your preparation status for upcoming stakeholder sessions and high-value outreach.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-4">
                        <p className="text-[10px] font-semibold text-slate-400">Next Activity</p>
                        <h4 className="text-[18px] font-semibold text-indigo-600">Starting in 45m</h4>
                    </div>
                    <Button
                        onClick={handleSync}
                        className="h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 rounded-xl shadow-lg shadow-indigo-100 border-none text-[11px]"
                    >
                        <Calendar className="h-4 w-4 mr-2" /> Calendar Sync
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Immediate Horizon (Next 12 Hours) */}
                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Immediate Horizon (Next 12h)</h3>
                            <p className="text-[13px] text-slate-500 font-medium">Prioritized activities with readiness indicators.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {activities.map((act) => (
                            <div key={act.id} className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 group hover:border-indigo-200 hover:bg-white transition-all cursor-default">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div className="flex items-center gap-6">
                                        <div className="h-14 w-12 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                            <span className="text-[10px] font-semibold text-slate-400 group-hover:text-indigo-100 leading-none mb-1">Time</span>
                                            <span className="text-[13px] font-semibold text-slate-900 group-hover:text-white tabular-nums tracking-tighter">{act.time.split(' ')[1] || act.time}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-[16px] font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{act.title}</h4>
                                            <div className="flex items-center gap-3">
                                                <Badge className="bg-indigo-600 text-white border-none h-4.5 px-2 text-[9px] font-semibold uppercase">{act.lead}</Badge>
                                                <p className="text-[11px] text-slate-400 font-semibold tracking-wider">{act.type}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="text-right cursor-pointer" onClick={() => togglePrep(act.id)}>
                                            <p className="text-[10px] font-semibold text-slate-300 tracking-wider">Readiness</p>
                                            <div className="flex items-center gap-2 justify-end">
                                                <span className={`text-[12px] font-semibold ${act.prepStatus === 'Ready' ? 'text-emerald-500' : 'text-amber-500'}`}>{act.prepStatus}</span>
                                                {act.prepStatus === 'Ready' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Zap size={12} className="text-amber-500" />}
                                            </div>
                                        </div>
                                        <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-300 hover:text-slate-900">
                                            <MoreHorizontal size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Tomorrow Preview Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-indigo-100 rounded-3xl bg-indigo-50 text-slate-900 p-8 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-400 translate-x-4">
                            <Calendar size={120} />
                        </div>
                        <h4 className="text-[16px] font-semibold text-indigo-600 leading-none">Tomorrow Preview</h4>
                        <div className="space-y-6 flex-1 relative z-10">
                            {TOMORROW_PREVIEW.map((p, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="text-[12px] font-semibold text-slate-400 tabular-nums w-16">{p.time}</div>
                                    <div className="space-y-1">
                                        <h4 className="text-[14px] font-semibold text-slate-900 leading-tight">{p.title}</h4>
                                        <p className="text-[10px] text-slate-500 font-medium">{p.attendees} confirmed</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl border-none text-[11px] shadow-lg shadow-indigo-100">
                            Full Week Agenda
                        </Button>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6 space-y-6 flex flex-col items-center text-center">
                        <div className="p-4 rounded-3xl bg-indigo-50 text-indigo-600">
                            <Compass size={32} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[18px] font-semibold text-slate-900">Strategy Focus</h4>
                            <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                                You have **3 commercial sessions** today. Avoid booking new discovery calls to focus on high-ticket closing.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full h-9 border-slate-100 text-indigo-600 font-semibold text-[10px] rounded-xl"
                            onClick={() => toast({ title: "Schedule Frozen", description: "No new slots will be accepted for the next 24 hours." })}
                        >
                            Freeze Schedule
                        </Button>
                    </Card>
                </div>

                {/* Preparation Checklist */}
                <div className="lg:col-span-12">
                    <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-2xl bg-white shadow-xl shadow-emerald-200/50 flex items-center justify-center text-emerald-600">
                                <CheckCircle2 size={32} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[20px] font-semibold text-emerald-900 tracking-tight">Sync Complete: Readiness Audit</h4>
                                <p className="text-[14px] text-emerald-700 font-medium">
                                    All collateral for technical vetting (ACT-101) has been verified. You're ready for the 10:30 AM session.
                                </p>
                            </div>
                        </div>
                        <Button className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-10 rounded-xl shadow-lg shadow-emerald-200 border-none text-[11px]">Open Prep Notes</Button>
                    </div>
                </div>

            </div>

        </div>
    )
}
