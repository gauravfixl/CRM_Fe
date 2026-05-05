"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Phone,
    PhoneCall,
    PhoneForwarded,
    PhoneIncoming,
    PhoneMissed,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    Download,
    MoreHorizontal,
    Clock,
    Zap,
    Scale,
    AlertCircle,
    UserCheck,
    Mic,
    Play,
    Pause,
    SkipForward,
    Volume2,
    Calendar,
    ArrowUpRight,
    TrendingUp
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"

// --- Mock Data ---
const INITIAL_QUEUE = [
    { id: "CAL-001", lead: "Aarav Sharma", company: "Nexus Tech", phone: "+91 98765 43210", reason: "Discovery Call", priority: "High", status: "Ready" },
    { id: "CAL-002", lead: "Ishani Gupta", company: "Quantum Solutions", phone: "+91 87654 32109", reason: "Follow-up", priority: "Medium", status: "In 15m" },
    { id: "CAL-003", lead: "Rajesh Malhotra", company: "Malhotra Group", phone: "+91 76543 21098", reason: "Price Negotiation", priority: "Critical", status: "Overdue" },
    { id: "CAL-004", lead: "Zoya Khan", company: "Khan & Co", phone: "+91 65432 10987", reason: "Demo Confirmation", priority: "Low", status: "Tomorrow" },
]

const INITIAL_HISTORY = [
    { id: "HIS-001", lead: "Arjun Reddy", duration: "12:45", outcome: "Interested", date: "Today, 10:15 AM" },
    { id: "HIS-002", lead: "Pooja Singh", duration: "5:20", outcome: "No Answer", date: "Today, 9:30 AM" },
    { id: "HIS-003", lead: "Karan Johar", duration: "24:10", outcome: "MQL Qualified", date: "Yesterday, 4:00 PM" },
]

export default function CallsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [isDialing, setIsDialing] = useState(false)
    const [activeLead, setActiveLead] = useState<any>(null)
    const [queue, setQueue] = useState(INITIAL_QUEUE)
    const [history, setHistory] = useState(INITIAL_HISTORY)
    const [showOutcome, setShowOutcome] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleDial = (leadObj: any) => {
        setActiveLead(leadObj)
        setIsDialing(true)
        setShowOutcome(false)
        toast({
            title: "Dialing Lead",
            description: `Connecting to ${leadObj.lead}...`,
        })
    }

    const handleEndCall = () => {
        setIsDialing(false)
        setShowOutcome(true)
    }

    const logOutcome = (outcome: string) => {
        const newHistoryItem = {
            id: `HIS-00${history.length + 1}`,
            lead: activeLead.lead,
            duration: "03:42",
            outcome: outcome,
            date: "Just now"
        }
        setHistory([newHistoryItem, ...history])
        setQueue(queue.filter(q => q.id !== activeLead.id))
        setShowOutcome(false)
        setActiveLead(null)
        toast({
            title: "Call Logged",
            description: `Outcome for ${newHistoryItem.lead} saved as ${outcome}.`,
        })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
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
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                                <Phone size={20} />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Global Call Center
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            The primary outreach engine. Manage your call queue, track talk time, and log outcomes with precision to increase connect rates.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-4 px-6 border-r border-slate-100">
                        <div className="text-right">
                            <p className="text-[10px] font-semibold text-slate-400">Daily Talk Time</p>
                            <h4 className="text-[18px] font-bold text-slate-900 tabular-nums">1h 24m</h4>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-indigo-600">
                            <Mic size={20} />
                        </div>
                    </div>
                    <Button
                        onClick={() => queue.length > 0 && handleDial(queue[0])}
                        disabled={queue.length === 0}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none disabled:opacity-50"
                    >
                        <SkipForward className="h-4 w-4 mr-2" /> Dial Next Lead
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Dialing Interface Mock */}
                {isDialing && activeLead && (
                    <Card className="lg:col-span-12 border-none shadow-xl shadow-indigo-100/50 ring-1 ring-indigo-100 rounded-3xl bg-indigo-50 text-slate-900 overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-200">
                                <Volume2 size={120} />
                            </div>
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="h-20 w-20 rounded-3xl bg-indigo-600 flex items-center justify-center animate-pulse">
                                    <PhoneCall size={40} className="text-white" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-emerald-500 text-white border-none h-5 text-[9px] font-semibold">Active Call</Badge>
                                        <span className="text-[14px] font-semibold tabular-nums tracking-wider text-emerald-600">03:42</span>
                                    </div>
                                    <h2 className="text-[28px] font-semibold tracking-tight text-slate-900">{activeLead.lead}</h2>
                                    <p className="text-[14px] text-slate-500 font-medium tracking-wide">{activeLead.phone} • {activeLead.company}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 relative z-10">
                                <Button size="icon" className="h-14 w-14 rounded-2xl bg-white/10 hover:bg-white/20 text-white border-none">
                                    <Pause size={24} />
                                </Button>
                                <Button size="icon" className="h-14 w-14 rounded-2xl bg-white/10 hover:bg-white/20 text-white border-none">
                                    <Mic size={24} />
                                </Button>
                                <Button onClick={handleEndCall} className="h-14 bg-rose-500 hover:bg-rose-600 text-white font-bold px-10 rounded-2xl border-none shadow-lg shadow-rose-900/40">
                                    End Session
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {showOutcome && activeLead && (
                    <Card className="lg:col-span-12 border-none shadow-xl ring-2 ring-emerald-500 rounded-3xl bg-white p-8 animate-in slide-in-from-top duration-500">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-1">
                                <h3 className="text-[20px] font-semibold text-slate-900 tracking-tight">Call Outcome: {activeLead.lead}</h3>
                                <p className="text-[13px] text-slate-500 font-medium">Select the result of this call to update lead status and history.</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {["Interested", "No Answer", "Busy", "Not Interested", "Qualified"].map((outcome) => (
                                    <Button
                                        key={outcome}
                                        variant="outline"
                                        className="h-10 rounded-xl border-slate-100 font-semibold text-[11px] hover:bg-indigo-50 hover:text-indigo-600 px-6"
                                        onClick={() => logOutcome(outcome)}
                                    >
                                        {outcome}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </Card>
                )}

                {/* Call Queue */}
                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Today's Outreach Queue</h3>
                            <p className="text-[13px] text-slate-500 font-medium">Prioritized leads waiting for a call.</p>
                        </div>
                        <Button variant="outline" className="h-9 border-slate-100 text-slate-400 font-semibold text-[10px] px-4">Shuffle Queue</Button>
                    </div>

                    <div className="space-y-4">
                        {queue.map((call) => (
                            <div key={call.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all cursor-default group gap-6">
                                <div className="flex items-center gap-5">
                                    <div className="h-12 w-12 rounded-xl bg-white border border-slate-100 text-slate-400 group-hover:text-indigo-600 transition-colors flex items-center justify-center">
                                        <PhoneIncoming size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[16px] font-semibold text-slate-900 tracking-tight">{call.lead}</h4>
                                        <p className="text-[12px] text-slate-500 font-medium">{call.reason} • <span className="text-indigo-600 font-semibold">{call.company}</span></p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-12">
                                    <div className="text-right hidden md:block">
                                        <p className="text-[10px] font-semibold text-slate-400">Availability</p>
                                        <h4 className={`text-[13px] font-semibold ${call.status === 'Overdue' ? 'text-rose-500' : call.status === 'Ready' ? 'text-emerald-500' : 'text-slate-900'}`}>{call.status}</h4>
                                    </div>
                                    <Button
                                        onClick={() => handleDial(call)}
                                        className="h-10 bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white border-2 border-emerald-100 hover:border-emerald-600 font-semibold text-[11px] px-6 rounded-xl transition-all shadow-sm"
                                    >
                                        <Phone size={14} className="mr-2" /> Dial
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Performance Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6 space-y-6">
                        <div className="space-y-1 text-center">
                            <p className="text-[11px] font-semibold text-slate-400 tracking-wider">Connect Efficiency</p>
                            <h3 className="text-[32px] font-semibold text-slate-900 tabular-nums">42%</h3>
                            <div className="flex items-center justify-center gap-2 text-emerald-500 font-semibold text-[12px]">
                                <TrendingUp size={14} /> +8% vs last week
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            {[
                                { label: "Total Calls", val: 42 },
                                { label: "Connected", val: 18 },
                                { label: "MQL Handoffs", val: 4 },
                            ].map((s, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-[12px] font-semibold text-slate-500">{s.label}</span>
                                    <span className="text-[14px] font-semibold text-slate-900 tabular-nums">{s.val}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6 space-y-4">
                        <h4 className="text-[14px] font-semibold text-slate-900 tracking-tight">Recent Outcomes</h4>
                        <div className="space-y-4">
                            {history.map((h, i) => (
                                <div key={i} className="flex items-center justify-between text-[13px]">
                                    <div className="space-y-0.5">
                                        <p className="font-semibold text-slate-900">{h.lead}</p>
                                        <p className="text-[10px] text-slate-400 font-semibold">{h.date}</p>
                                    </div>
                                    <Badge className="bg-slate-50 text-slate-600 border-none font-semibold text-[10px] h-5">{h.outcome}</Badge>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full h-8 text-indigo-600 font-semibold text-[11px] hover:bg-slate-50 underline decoration-indigo-200">View Recording Library</Button>
                    </Card>
                </div>

            </div>

        </div>
    )
}
