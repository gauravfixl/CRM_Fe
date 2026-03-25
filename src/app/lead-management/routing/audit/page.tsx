"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    History,
    Search,
    Filter,
    ChevronLeft,
    Clock,
    Zap,
    GitBranch,
    User,
    ArrowRight,
    Calendar,
    ArrowUpRight,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    Settings,
    MoreHorizontal,
    Table,
    FileText,
    Activity,
    Info,
    LayoutGrid,
    Target
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Progress } from "@/shared/components/ui/progress"

// --- Mock Data: Routing Decision Logs ---
const ROUTING_AUDIT = [
    {
        id: "1",
        lead: "Aarav Mehta",
        ruleMatched: "Enterprise Leads - US West",
        methodUsed: "High-Value RR Pool",
        assignedTo: "Sarah Jenkins",
        timestamp: "2 mins ago",
        status: "Success",
        latency: "140ms",
        type: "Direct Match"
    },
    {
        id: "2",
        lead: "Emma Wilson",
        ruleMatched: "Google Ads - Discovery",
        methodUsed: "Inbound BDR Queue",
        assignedTo: "Michael Chen",
        timestamp: "15 mins ago",
        status: "Success",
        latency: "85ms",
        type: "Sequential Pass"
    },
    {
        id: "3",
        lead: "James Anderson",
        ruleMatched: "No Rule (Fallback)",
        methodUsed: "Manual Assignment",
        assignedTo: "Admin Overwrite",
        timestamp: "1 hour ago",
        status: "Manual",
        latency: "N/A",
        type: "Override"
    },
    {
        id: "4",
        lead: "Sarah Jenkins",
        ruleMatched: "EMEA Geography",
        methodUsed: "EMEA Regional Hub",
        assignedTo: "Failed (No Rep Active)",
        timestamp: "3 hours ago",
        status: "Failed",
        latency: "210ms",
        type: "Routing Error"
    },
    {
        id: "5",
        lead: "Michael Chen",
        ruleMatched: "Security Domain Block",
        methodUsed: "Governance Queue",
        assignedTo: "System (Auto-Blocked)",
        timestamp: "Yesterday",
        status: "Success",
        latency: "45ms",
        type: "Pre-Assignment Rule"
    },
]

export default function RoutingAuditPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

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
                        className="-ml-2 h-7 text-[10px] font-semibold uppercase tracking-widest text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-slate-100 text-slate-600 shadow-sm border border-slate-200">
                                <History className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Routing Decision Audit
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            A complete trace of "Who got what lead and why." Debug failed routing attempts and track manual overrides in real-time.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => toast({ title: "Report Generating", description: "Audit trace report is being compiled." })} className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <FileText className="h-4 w-4 mr-2 text-slate-400" /> Decision Report
                    </Button>
                    <Button onClick={() => toast({ title: "Filters Active", description: "Audit trace is now filtered by current parameters." })} className="h-10 bg-white border border-slate-100 hover:bg-slate-50 text-slate-900 font-semibold px-6 shadow-sm">
                        <Filter className="h-4 w-4 mr-2 text-slate-400" /> Filter Trace
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Audit Timeline Feed */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[16px] font-semibold text-slate-900">Real-time Decision Trace</h2>
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-slate-300" />
                            <Input
                                placeholder="Trace by lead or owner..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-8 w-48 border-none bg-transparent text-[11px] font-semibold tracking-wider focus-visible:ring-0"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        {ROUTING_AUDIT.map((log) => (
                            <Card key={log.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl bg-white group hover:ring-indigo-100 transition-all overflow-hidden border-l-4 border-l-transparent hover:border-l-indigo-500">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            {/* Lead Info */}
                                            <div className="flex items-center gap-4 min-w-[200px]">
                                                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                    <GitBranch size={20} />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <h4 className="text-[14px] font-semibold text-slate-900 leading-none">{log.lead}</h4>
                                                    <p className="text-[11px] font-medium text-slate-400">{log.timestamp}</p>
                                                </div>
                                            </div>

                                            {/* Logic Trace */}
                                            <div className="flex-1 space-y-2 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="border-slate-100 bg-slate-50 text-[9px] font-semibold tracking-wider text-slate-400 px-1.5 h-5 rounded">{log.type}</Badge>
                                                    <span className="text-slate-200">/</span>
                                                    <p className="text-[12px] font-medium text-slate-600 line-clamp-1">{log.ruleMatched}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <ArrowRight size={12} className="text-emerald-500" />
                                                    <span className="text-[11px] font-semibold text-slate-400 italic">Method: {log.methodUsed}</span>
                                                </div>
                                            </div>

                                            {/* Outcome */}
                                            <div className="flex items-center gap-8 min-w-[220px] justify-end">
                                                <div className="text-right flex flex-col items-end gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <h5 className={`text-[13px] font-semibold ${log.status === 'Failed' ? 'text-rose-600' : log.status === 'Manual' ? 'text-amber-600' : 'text-slate-900'}`}>{log.assignedTo}</h5>
                                                        <div className={`h-2 w-2 rounded-full ${log.status === 'Success' ? 'bg-emerald-500' : log.status === 'Failed' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                                                    </div>
                                                    <span className="text-[10px] font-semibold text-slate-300 tracking-wider">{log.latency} Decision time</span>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-slate-900 rounded-xl">
                                                    <Info size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Audit Summary Side */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6 space-y-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-semibold text-slate-400 tracking-wider leading-none">Successful Routes</p>
                            <h3 className="text-[32px] font-semibold tracking-tighter text-slate-900 tabular-nums">98.2%</h3>
                            <Progress value={98.2} className="h-1.5 bg-slate-50 [&>div]:bg-emerald-500 mt-2" />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <h4 className="text-[12px] font-semibold text-slate-400 tracking-wider">Routing Distribution</h4>
                            <div className="space-y-3">
                                {[
                                    { label: "Direct Rule Match", val: 84, color: "bg-indigo-500" },
                                    { label: "Manual Overwrite", val: 12, color: "bg-amber-500" },
                                    { label: "Fallback (Catch-all)", val: 4, color: "bg-slate-400" },
                                ].map((d, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                                            <span>{d.label}</span>
                                            <span>{d.val}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <div className={`h-full ${d.color}`} style={{ width: `${d.val}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-rose-50 text-rose-900 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[14px] font-semibold tracking-tight text-rose-600">Active Failure Alerts</h4>
                            <AlertCircle size={20} className="text-rose-500" />
                        </div>
                        <div className="space-y-3">
                            <div className="p-3 rounded-2xl bg-white border border-rose-100 space-y-1">
                                <p className="text-[12px] font-semibold text-rose-600">No Owner Availability</p>
                                <p className="text-[11px] font-medium text-slate-500">EMEA Hub is currently without any active reps.</p>
                                <Button variant="ghost" onClick={() => toast({ title: "Opening Editor", description: "Loading assignment reassignment modal..." })} className="h-auto p-0 text-[10px] font-semibold tracking-wider text-indigo-600 hover:bg-transparent mt-2 uppercase">FIX ASSIGNMENT</Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-slate-50 text-slate-900 p-6 space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                            <ShieldCheck size={100} />
                        </div>
                        <h4 className="text-[15px] font-semibold">Audit Governance</h4>
                        <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                            Decision logs are cryptographically signed and stored for 365 days for SOC2 compliance.
                        </p>
                        <Button onClick={() => toast({ title: "Export Started", description: "Your compliance logs are being packaged." })} className="w-full h-9 bg-white text-slate-900 border border-slate-100 hover:bg-slate-100 font-semibold text-[11px] rounded-xl shadow-sm">
                            Download Compliance Log
                        </Button>
                    </Card>
                </div>

            </div>

        </div>
    )
}
