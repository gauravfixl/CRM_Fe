"use client"

import React, { useState, useMemo } from 'react'
import {
    Search,
    Plus,
    Filter,
    Download,
    Play,
    Pause,
    AlertTriangle,
    CheckCircle,
    Clock,
    Zap,
    RefreshCw,
    Activity,
    Workflow,
    ShieldAlert,
    Timer,
    ArrowUpRight,
    Terminal,
    Target,
    Settings2,
    SearchCheck,
    Cpu,
    Boxes
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
const ACTIVE_WORKFLOWS = [
    { id: "WF-001", name: "Client Health Sentinel", type: "Monitoring", status: "Running", rate: 98, load: "High" },
    { id: "WF-002", name: "Renewal Velocity Sync", type: "Lifecycle", status: "Running", rate: 100, load: "Medium" },
    { id: "WF-003", name: "Structural Integrity Audit", type: "Security", status: "Paused", rate: 95, load: "Low" }
]

const EXECUTIONS = [
    { id: "EXE-01", flow: "Sentinel Health", trigger: "Telemetry", status: "Success", duration: "1.2s", actions: 12 },
    { id: "EXE-02", flow: "Velocity Sync", trigger: "Scheduler", status: "Running", duration: "Active", actions: 4 }
]

export default function AutomationOverview() {
    const [searchQuery, setSearchQuery] = useState("")

    const handleAction = (msg: string) => {
        toast.promise(new Promise(r => setTimeout(r, 1000)), {
            loading: 'Synchronizing automation pulse nodes...',
            success: msg,
            error: 'Node synchronization failed'
        })
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50 min-h-screen font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Automation <span className="text-blue-600">Pulse</span></h1>
                    <p className="text-lg font-medium text-slate-500 mt-1 text-[15px]">Real-time telemetry, workflow orchestration, and high-fidelity execution audit</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-bold shadow-sm gap-2" onClick={() => handleAction("System telemetry audit exported")}>
                        <Terminal className="w-4 h-4 text-slate-400" /> System Logs
                    </Button>
                    <Button className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 gap-2" onClick={() => handleAction("New workflow architect opened")}>
                        <Plus className="w-4 h-4" /> Build Workflow
                    </Button>
                </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Active Nodes", value: "24 Workflows", change: "+3", trend: "up", icon: Boxes, color: "blue" },
                    { label: "Execution Success", value: "98.5%", change: "+1.2%", trend: "up", icon: CheckCircle, color: "emerald" },
                    { label: "Alert Latency", value: "0.4ms", icon: Activity, color: "rose" },
                    { label: "Pending Approvals", value: "08 Tickets", icon: Timer, color: "amber" }
                ].map((stat, i) => (
                    <Card key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`h-11 w-11 rounded-2xl flex items-center justify-center border shadow-sm ${stat.color === 'blue' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                                    stat.color === 'emerald' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                        stat.color === 'rose' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                                            'bg-amber-50 border-amber-100 text-amber-600'
                                }`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            {stat.change && (
                                <Badge variant="outline" className="font-black text-[9px] border-emerald-100 text-emerald-600 tracking-widest uppercase">{stat.change} ↑</Badge>
                            )}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                        <h4 className="text-xl font-black text-slate-900">{stat.value}</h4>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="nodes" className="space-y-6">
                <TabsList className="bg-white border border-slate-200 p-1.5 rounded-2xl h-14 w-fit shadow-md">
                    <TabsTrigger value="nodes" className="px-8 rounded-xl data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold text-sm h-full text-slate-500 transition-all">Node Overview</TabsTrigger>
                    <TabsTrigger value="executions" className="px-8 rounded-xl data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold text-sm h-full text-slate-500 transition-all">Live Executions</TabsTrigger>
                </TabsList>

                <TabsContent value="nodes">
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <CardTitle className="text-xl font-bold text-slate-900">Automation Node Registry</CardTitle>
                            <div className="relative w-full md:w-80 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors w-4 h-4" />
                                <Input
                                    placeholder="Search nodes or flows..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 h-11 bg-slate-50 border-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4">
                            {ACTIVE_WORKFLOWS.map((wf, idx) => (
                                <div key={idx} className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:bg-white hover:shadow-xl transition-all">
                                    <div className="flex items-center gap-5 flex-1">
                                        <div className="h-16 w-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                                            <Workflow className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="space-y-1.5 flex-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-md font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors leading-none">{wf.name}</h4>
                                                <Badge className={`text-[9px] font-black px-2.5 py-0.5 rounded-full border-0 uppercase tracking-widest ${wf.status === 'Running' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                                                    }`}>{wf.status}</Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> Core: Standard</span>
                                                <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Type: {wf.type}</span>
                                                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Priority: {wf.load}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-10">
                                        <div className="w-32 space-y-2 text-right">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                                <span>Health</span>
                                                <span>{wf.rate}%</span>
                                            </div>
                                            <Progress value={wf.rate} className="h-1.5 bg-slate-100" />
                                        </div>
                                        <div className="flex items-center gap-2 border-l border-slate-200 pl-8 shrink-0">
                                            {wf.status === 'Running' ? (
                                                <Button variant="outline" size="icon" className="h-10 w-10 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl" onClick={() => handleAction(`Workflow ${wf.id} execution suspended`)}><Pause className="w-4 h-4" /></Button>
                                            ) : (
                                                <Button variant="outline" size="icon" className="h-10 w-10 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl" onClick={() => handleAction(`Workflow ${wf.id} execution resumed`)}><Play className="w-4 h-4" /></Button>
                                            )}
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-blue-600 rounded-xl"><Settings2 className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="executions">
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 p-8 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Live Execution Registry</h4>
                            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest animate-pulse border-emerald-200 text-emerald-600 flex items-center gap-2 bg-emerald-50">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live Stream
                            </Badge>
                        </div>
                        <div className="space-y-4">
                            {EXECUTIONS.map((ex, idx) => (
                                <div key={idx} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-6 hover:bg-white hover:shadow-lg transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">#{ex.id}</div>
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-black text-slate-900 text-sm uppercase">{ex.flow}</h5>
                                                <Badge className={`text-[9px] font-black px-2 py-0.5 rounded-lg border-0 ${ex.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>{ex.status}</Badge>
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trigger: {ex.trigger} • Duration: {ex.duration}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-sm font-black text-slate-900">{ex.actions}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase">Sub-Actions</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-blue-600"><SearchCheck className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
