"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    ShieldAlert,
    Search,
    Filter,
    Download,
    ChevronLeft,
    Clock,
    AlertCircle,
    User,
    ArrowRight,
    ArrowUpRight,
    ExternalLink,
    MoreHorizontal,
    RefreshCw,
    MessageSquare,
    Zap,
    Scale,
    Trash2,
    Calendar
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/shared/components/ui/dropdown-menu"
import { Progress } from "@/shared/components/ui/progress"

// --- Mock Data: Breach Logs ---
const BREACH_LOGS = [
    {
        id: "1",
        lead: "Aarav Mehta",
        policy: "Enterprise First Response",
        owner: "Sarah Jenkins",
        delay: "42 min",
        timestamp: "1 hour ago",
        severity: "Critical",
        reason: "Rep Busy",
        action: "Auto-Reassigned"
    },
    {
        id: "2",
        lead: "Emma Wilson",
        policy: "High Intent Follow-up",
        owner: "Michael Chen",
        delay: "3.5 hours",
        timestamp: "3 hours ago",
        severity: "High",
        reason: "Offline / OOO",
        action: "Notified Manager"
    },
    {
        id: "3",
        lead: "James Anderson",
        policy: "Standard Inbound",
        owner: "Unassigned",
        delay: "1.2 hours",
        timestamp: "5 hours ago",
        severity: "Moderate",
        reason: "Queue Congestion",
        action: "Returned to Pool"
    },
    {
        id: "4",
        lead: "Sarah Jenkins",
        policy: "Trial Conversion Speed",
        owner: "James K.",
        delay: "14 min",
        timestamp: "Yesterday",
        severity: "Low",
        reason: "Missed Notification",
        action: "Re-Notified Rep"
    },
    {
        id: "5",
        lead: "Michael Chen",
        policy: "Enterprise First Response",
        owner: "Aarav Mehta",
        delay: "1.8 hours",
        timestamp: "Yesterday",
        severity: "Critical",
        reason: "No Activity",
        action: "Escalated to L2"
    },
]

export default function BreachLogPage() {
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
                            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 shadow-sm">
                                <ShieldAlert className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                SLA Breach Audit Log
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            A historical audit of every service level failure. Use this data to identify training needs, process bottlenecks, or capacity gaps.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => toast({ title: "Date Range Filter", description: "Opening historical date picker..." })} className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <Calendar className="h-4 w-4 mr-2 text-slate-400" /> Filter by Date
                    </Button>
                    <Button onClick={() => toast({ title: "CSV Export Started", description: "Downloading SLA breach audit log." })} className="h-10 bg-white rounded-xl border border-slate-100/50 hover:bg-slate-50 text-slate-900 font-semibold px-6 shadow-sm">
                        <Download className="h-4 w-4 mr-2 text-slate-400" /> Export CSV
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Audit List */}
                <div className="lg:col-span-12 space-y-4">
                    <div className="flex items-center justify-between gap-4 bg-slate-50/50 p-2 rounded-2xl border border-slate-100/50 shadow-sm">
                        <div className="relative flex-1 lg:max-w-[500px]">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by lead, policy or owner..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 h-10 border-slate-100 bg-white text-[13px] rounded-xl focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => toast({ title: "Severity Filter", description: "Selecting Critical and High priority breaches..." })} className="h-10 border-slate-100 bg-white font-semibold text-[12px] px-4 rounded-xl">
                                <Filter className="h-3.5 w-3.5 mr-2 text-slate-400" /> Severity
                            </Button>
                            <Button variant="outline" onClick={() => { setSearchTerm(""); toast({ title: "Filters Reset", description: "Showing all data." }) }} className="h-10 border-slate-100 bg-white font-semibold text-[12px] px-4 rounded-xl">
                                <RefreshCw className="h-3.5 w-3.5 mr-2 text-slate-400" /> Reset
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {BREACH_LOGS.map((log) => (
                            <Card key={log.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl bg-white group hover:ring-rose-100 transition-all overflow-hidden border-l-4 border-l-transparent hover:border-l-rose-500">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                            {/* Lead & Incident */}
                                            <div className="flex items-center gap-4 min-w-[280px]">
                                                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-300 group-hover:bg-rose-50 group-hover:text-rose-400 transition-colors">
                                                    <AlertCircle size={20} />
                                                </div>
                                                <div className="space-y-1 min-w-0">
                                                    <h4 className="text-[14px] font-semibold text-slate-900 truncate">{log.lead}</h4>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="h-4.5 border-slate-100 bg-slate-50 text-[8px] font-semibold text-slate-400 uppercase tracking-widest px-1">{log.policy}</Badge>
                                                        <span className="text-slate-200">•</span>
                                                        <span className="text-[11px] font-semibold text-slate-400">{log.timestamp}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Delay Info */}
                                            <div className="flex flex-col items-center gap-1 min-w-[120px]">
                                                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest leading-none">Total Delay</span>
                                                <span className="text-[16px] font-semibold text-rose-600 tabular-nums">{log.delay}</span>
                                            </div>

                                            {/* Context Info */}
                                            <div className="flex-1 space-y-2 min-w-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-100/50 px-2 py-1 rounded-lg">
                                                        <User size={12} /> {log.owner}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-100/50 px-2 py-1 rounded-lg">
                                                        <MessageSquare size={12} /> {log.reason}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status & Actions */}
                                            <div className="flex items-center gap-8 min-w-[220px] justify-end">
                                                <div className="text-right flex flex-col items-end gap-1.5">
                                                    <Badge className={`border-none font-semibold tracking-wider text-[9px] h-5 px-2 uppercase shadow-sm ${log.severity === 'Critical' ? 'bg-rose-500 text-white' : 'bg-amber-100 text-amber-600'}`}>{log.severity}</Badge>
                                                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5"><Zap size={10} className={log.action === "Escalated to L2" ? "text-amber-500" : ""} /> {log.action}</span>
                                                </div>
                                                <div className="w-px h-10 bg-slate-50" />
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-900 rounded-xl">
                                                            <MoreHorizontal size={18} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl shadow-xl border-slate-100">
                                                        <DropdownMenuItem onClick={() => toast({ description: "Opening lead timeline viewer..." })} className="text-[12px] font-medium py-2.5">Lead Details</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast({ description: "Re-assigning SLA parameters..." })} className="text-[12px] font-medium py-2.5">Edit Owner SLA</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast({ description: "Training module queued for agent." })} className="text-[12px] font-medium py-2.5">Assign Training</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => toast({ description: "Entry dismissed from view." })} className="text-[12px] font-semibold py-2.5 text-rose-500">Dismiss Log</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Audit Trends Side */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl bg-white p-6 transition-all hover:ring-rose-100">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[12px] font-semibold text-slate-400 uppercase tracking-widest">
                                Repeat Breachers
                                <ArrowUpRight size={14} className="text-rose-400" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[16px] font-semibold text-slate-900 leading-none">Sarah Jenkins</h4>
                                <p className="text-[11px] text-slate-500 font-medium">14 breaches in last 7 days.</p>
                            </div>
                            <div className="pt-2">
                                <div className="flex justify-between items-center text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-1.5">
                                    <span>Compliance Impact</span>
                                    <span className="text-slate-500">Significant</span>
                                </div>
                                <Progress value={32} className="h-1.5 bg-slate-50 [&>div]:bg-rose-500" />
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl bg-white p-6 transition-all hover:ring-rose-100">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[12px] font-semibold text-slate-400 uppercase tracking-widest">
                                Top Breach Reason
                                <Scale size={14} className="text-amber-400" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[16px] font-semibold text-slate-900 leading-none">Queue Congestion</h4>
                                <p className="text-[11px] text-slate-500 font-medium">42% of all L1 breaches.</p>
                            </div>
                            <div className="pt-2">
                                <div className="flex justify-between items-center text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-1.5">
                                    <span>Bottleneck Risk</span>
                                    <span className="text-slate-500">Critical</span>
                                </div>
                                <div className="flex gap-1 h-1.5">
                                    {[1, 1, 1, 1, 1, 1, 0, 0, 0, 0].map((v, i) => (
                                        <div key={i} className={`flex-1 rounded-full ${v === 1 ? 'bg-amber-500' : 'bg-slate-100'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl bg-indigo-50 text-indigo-900 p-6 relative overflow-hidden group">
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center text-[10px] font-semibold text-indigo-500 uppercase tracking-widest">
                                Discipline Hub
                                <Zap size={14} className="text-indigo-400 fill-indigo-400" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[16px] font-semibold leading-none">Automated Coaching</h4>
                                <p className="text-[11px] text-indigo-600/80 font-medium">5 reps flagged for SLA training.</p>
                            </div>
                            <Button onClick={() => toast({ title: "AI Plan View", description: "Loading automated remediation suggestions..." })} className="w-full h-9 bg-white shadow-sm border border-transparent hover:border-slate-100 text-indigo-600 hover:bg-slate-50 font-semibold text-[11px] uppercase tracking-wider rounded-xl">
                                Review Coaching Plans
                            </Button>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform translate-x-4 text-indigo-600">
                            <ShieldAlert size={120} />
                        </div>
                    </Card>
                </div>

            </div>

        </div>
    )
}
