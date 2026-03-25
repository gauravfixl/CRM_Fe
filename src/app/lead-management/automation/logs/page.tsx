"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Activity,
    Search,
    Filter,
    ChevronLeft,
    Clock,
    Zap,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ArrowRight,
    RefreshCw,
    Download,
    ExternalLink,
    MoreHorizontal,
    GitBranch,
    Box,
    Database,
    ShieldAlert
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
} from "@/shared/components/ui/dropdown-menu"

// --- Mock Data: Automation Logs ---
const AUTOMATION_LOGS = [
    {
        id: "1",
        workflow: "Enterprise Welcome Flow",
        lead: "Aarav Mehta",
        trigger: "Lead Created",
        step: "Send Email: Welcome",
        status: "Success",
        duration: "142ms",
        timestamp: "2 mins ago"
    },
    {
        id: "2",
        workflow: "Lost Lead Feedback",
        lead: "Emma Wilson",
        trigger: "Stage == 'Lost'",
        step: "Wait (2 days)",
        status: "Running",
        duration: "N/A",
        timestamp: "5 mins ago"
    },
    {
        id: "3",
        workflow: "High Score Alert",
        lead: "Michael Chen",
        trigger: "Score > 85",
        step: "Push Notify",
        status: "Failed",
        duration: "850ms",
        timestamp: "1 hour ago",
        error: "Template not found"
    },
    {
        id: "4",
        workflow: "Direct Assignment",
        lead: "Sarah Jenkins",
        trigger: "Manual Force",
        step: "Assign Owner",
        status: "Success",
        duration: "45ms",
        timestamp: "3 hours ago"
    },
    {
        id: "5",
        workflow: "Nurture: Dormant",
        lead: "James Anderson",
        trigger: "Inactivity: 90d",
        step: "Tag: Stale",
        status: "Success",
        duration: "210ms",
        timestamp: "Yesterday"
    },
]

export default function AutomationLogsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleRefresh = () => {
        setIsRefreshing(true)
        setTimeout(() => {
            setIsRefreshing(false)
            toast({ title: "Logs Synced", description: "Fetched latest execution traces from the cloud hub." })
        }, 1200)
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
                        className="-ml-2 h-7 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-slate-900 text-white shadow-lg shadow-slate-200">
                                <Activity className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                Workflow Execution Logs
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Real-time audit trail of every automation fire. Debug issues, track latencies, and verify successful lead processing at scale.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-bold text-[12px] px-5"
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 text-slate-400 ${isRefreshing ? 'animate-spin' : ''}`} /> Sync Logs
                    </Button>
                    <Button className="h-10 bg-white border-slate-100 hover:bg-slate-50 text-slate-900 font-bold px-6 shadow-sm">
                        <Download className="h-4 w-4 mr-2 text-slate-400" /> Export CSV
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Real-time Feed Area */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[16px] font-bold text-slate-900">Live Execution Feed</h2>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                                <Input placeholder="Filter by workflow..." className="pl-9 h-9 w-48 border-none bg-transparent text-[11px] font-bold uppercase tracking-wider focus-visible:ring-0" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {AUTOMATION_LOGS.map((log) => (
                            <Card key={log.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl group hover:ring-indigo-100 transition-all bg-white overflow-hidden border-l-4 border-l-transparent hover:border-l-indigo-600">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            {/* Info Section */}
                                            <div className="flex items-center gap-4 min-w-[280px]">
                                                <div className={`p-3 rounded-xl ${log.status === 'Success' ? 'bg-emerald-50 text-emerald-600' :
                                                        log.status === 'Failed' ? 'bg-rose-50 text-rose-600' :
                                                            'bg-amber-50 text-amber-600'
                                                    } transition-colors`}>
                                                    {log.status === 'Success' ? <CheckCircle2 size={20} /> :
                                                        log.status === 'Failed' ? <XCircle size={20} /> :
                                                            <RefreshCw size={20} className="animate-spin" />}
                                                </div>
                                                <div className="space-y-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-[14px] font-bold text-slate-900 truncate">{log.workflow}</h4>
                                                        <Badge variant="outline" className="border-slate-100 bg-slate-50 text-[8px] font-black text-slate-400 px-1.5 h-4.5 rounded uppercase">{log.status}</Badge>
                                                    </div>
                                                    <p className="text-[11px] font-medium text-slate-500">Lead: <span className="text-slate-900 font-bold">{log.lead}</span> • {log.timestamp}</p>
                                                </div>
                                            </div>

                                            {/* Operational Trace */}
                                            <div className="flex-1 space-y-1.5 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <Zap size={12} className="text-amber-500" />
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight truncate">Trigger: {log.trigger}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <ArrowRight size={12} className="text-indigo-400" />
                                                    <span className={`text-[12px] font-medium ${log.status === 'Failed' ? 'text-rose-500' : 'text-slate-600'} line-clamp-1`}>
                                                        {log.step} {log.error && `(${log.error})`}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Latency & Actions */}
                                            <div className="flex items-center gap-8 min-w-[180px] justify-end">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Latency</p>
                                                    <span className="text-[13px] font-bold text-slate-900 tabular-nums">{log.duration}</span>
                                                </div>
                                                <div className="w-px h-10 bg-slate-50" />
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-slate-900 rounded-xl">
                                                            <MoreHorizontal size={18} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40 p-1 rounded-xl shadow-xl">
                                                        <DropdownMenuItem className="py-2.5 text-[12px] font-medium"><ExternalLink className="h-3.5 w-3.5 mr-2" /> View Trace</DropdownMenuItem>
                                                        <DropdownMenuItem className="py-2.5 text-[12px] font-medium"><RefreshCw className="h-3.5 w-3.5 mr-2" /> Retry Step</DropdownMenuItem>
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

                {/* Automation Summary Sidebars */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-6 space-y-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Health</p>
                            <h3 className="text-[32px] font-black tracking-tighter text-slate-900">99.4%</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge className="bg-emerald-50 text-emerald-600 border-none px-1.5 h-4 text-[9px] font-black tracking-tight uppercase">Nominal</Badge>
                                <span className="text-[11px] font-bold text-slate-400">Target 99.9%</span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-2xl bg-slate-50 text-center space-y-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase">Failures</p>
                                    <h5 className="text-[16px] font-black text-rose-600">12</h5>
                                </div>
                                <div className="p-3 rounded-2xl bg-slate-50 text-center space-y-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase">Success</p>
                                    <h5 className="text-[16px] font-black text-emerald-600">4,204</h5>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {[
                                    { label: "Trigger Reliability", val: 100 },
                                    { label: "Action Delivery", val: 98.2 },
                                    { label: "Webhook Latency", val: 84 },
                                ].map((s, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                                            <span>{s.label}</span>
                                            <span>{s.val}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500" style={{ width: `${s.val}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-rose-50 text-rose-900 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[14px] font-black uppercase tracking-tight">System Anomalies</h4>
                            <ShieldAlert size={20} className="text-rose-500" />
                        </div>
                        <div className="p-3 rounded-2xl bg-white/60 border border-rose-100 space-y-2">
                            <p className="text-[11px] font-bold leading-relaxed text-rose-900">
                                4 executions of "High Score SMS Alert" failed due to missing API credentials.
                            </p>
                            <Button variant="ghost" className="h-auto p-0 text-[10px] font-black text-rose-600 uppercase hover:bg-transparent">Resolve Now</Button>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-slate-900 text-white p-6 space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Box size={100} />
                        </div>
                        <h4 className="text-[15px] font-bold">Cold Storage Logs</h4>
                        <p className="text-[12px] text-slate-400 font-medium leading-relaxed">
                            Executions older than 90 days are archived for compliance. Your archive contains 1.2M entries.
                        </p>
                        <Button className="w-full h-9 bg-white text-slate-900 hover:bg-slate-100 font-bold text-[11px] rounded-xl border-none">
                            Access Archives
                        </Button>
                    </Card>
                </div>

            </div>

        </div>
    )
}
