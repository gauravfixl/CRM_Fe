"use client"

import React, { useState, useMemo } from 'react'
import {
    Search,
    Filter,
    Download,
    Eye,
    AlertTriangle,
    CheckCircle,
    Clock,
    Activity,
    RefreshCw,
    ShieldCheck,
    Terminal,
    Database,
    Cpu,
    Webhook,
    MessageSquare,
    Link2,
    ChevronRight,
    Star,
    Zap,
    ScrollText,
    History,
    FileSearch,
    Network
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Progress } from "@/shared/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { toast } from "@/shared/utils/toast"

// --- Mock Data ---
const LOGS = [
    { id: "LOG-01", event: "Sentinel Breach", flow: "Health sentinel", status: "Success", time: "10:30 AM", latency: "0.2s" },
    { id: "LOG-02", event: "Payment Pulse", flow: "Recovery Seq", status: "Failed", time: "10:25 AM", latency: "1.8s" },
    { id: "LOG-03", event: "Renewal Audit", flow: "Renewal Pulse", status: "Success", time: "09:15 AM", latency: "4.1s" }
]

export default function LogsAudit() {
    const [searchQuery, setSearchQuery] = useState("")

    const handleAction = (msg: string) => {
        toast.promise(new Promise(r => setTimeout(r, 1000)), {
            loading: 'Decrypting audit telemetry streams...',
            success: msg,
            error: 'Telemetry decryption failed'
        })
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50 min-h-screen font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Audit <span className="text-blue-600">Telemetry</span></h1>
                    <p className="text-lg font-medium text-slate-500 mt-1 text-[15px]">Real-time execution logs, system action forensics, and recursive error diagnostics</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-bold shadow-sm gap-2" onClick={() => handleAction("Audit database cleared")}>
                        <History className="w-4 h-4 text-slate-400" /> Purge Logs
                    </Button>
                    <Button className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 gap-2" onClick={() => handleAction("Global telemetry report generated")}>
                        <FileSearch className="w-4 h-4" /> Export Report
                    </Button>
                </div>
            </div>

            {/* Telemetry Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Events", value: "1.2K Signals", icon: Activity, color: "blue" },
                    { label: "Terminal Success", value: "96.4%", icon: ShieldCheck, color: "emerald" },
                    { label: "Failed Nodes", value: "48 Errors", icon: AlertTriangle, color: "rose" },
                    { label: "Avg Execution", value: "1.8s / Task", icon: Clock, color: "indigo" }
                ].map((stat, i) => (
                    <Card key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`h-11 w-11 rounded-2xl flex items-center justify-center border shadow-sm ${stat.color === 'blue' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                                    stat.color === 'emerald' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                        stat.color === 'rose' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                                            'bg-indigo-50 border-indigo-100 text-indigo-600'
                                }`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <Badge variant="outline" className="font-black text-[9px] border-blue-100 text-blue-600 tracking-widest uppercase">Realtime</Badge>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                        <h4 className="text-xl font-black text-slate-900">{stat.value}</h4>
                    </Card>
                ))}
            </div>

            {/* Main Log Console */}
            <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
                <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900">
                    <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-rose-500 animate-pulse" />
                        <CardTitle className="text-lg font-bold text-white tracking-widest uppercase">Live Telemetry Console</CardTitle>
                    </div>
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors w-4 h-4" />
                        <Input
                            placeholder="Grep audit records..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-10 bg-slate-800 border-slate-700 text-white rounded-xl text-xs font-mono focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {LOGS.map((log, idx) => (
                            <div key={idx} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group hover:bg-slate-50 transition-all">
                                <div className="flex items-center gap-6 flex-1">
                                    <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                        <Terminal className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors leading-none">{log.event}</h4>
                                            <Badge className={`text-[9px] font-black px-2 py-0.5 rounded-lg border-0 uppercase tracking-widest ${log.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                                }`}>{log.status}</Badge>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5 font-mono"><Database className="w-3.5 h-3.5" /> Flow_Ref: {log.flow}</span>
                                            <span className="flex items-center gap-1.5"><Network className="w-3.5 h-3.5" /> Execution: {log.latency}</span>
                                            <span className="flex items-center gap-1.5 text-blue-600"><Clock className="w-3.5 h-3.5" /> Stamp: {log.time}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-blue-600 rounded-xl" onClick={() => handleAction(`Log ${log.id} forensic drilldown started`)}>
                                        <FileSearch className="w-5 h-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-blue-600 rounded-xl">
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing 3 of 1,247 Recursive Signals</p>
                    <Button variant="link" className="text-blue-600 font-black text-[10px] uppercase tracking-widest p-0 h-auto">Download Full Console Feed</Button>
                </div>
            </Card>
        </div>
    )
}
