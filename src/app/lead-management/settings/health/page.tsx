"use client"

import React, { useState, useEffect } from "react"
import {
    Activity, Zap, Database, Server, Cpu, Network, RefreshCw, AlertTriangle,
    ShieldCheck, Terminal, MoreHorizontal, CheckCircle2, XCircle, Clock,
    BarChart3, Layers, Globe, Radio, HardDrive, Cpu as CpuIcon
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

interface ComponentStatus {
    id: string
    name: string
    status: "Healthy" | "Degraded" | "Down" | "Maintenance"
    latency: string
    uptime: string
    region: string
}

const COMPONENTS: ComponentStatus[] = [
    { id: "S-1", name: "Main API Cluster", status: "Healthy", latency: "24ms", uptime: "99.99%", region: "US-East-1" },
    { id: "S-2", name: "Primary PostgreSQL", status: "Healthy", latency: "4ms", uptime: "99.98%", region: "AWS RDS" },
    { id: "S-3", name: "ElasticSearch Indexer", status: "Degraded", latency: "450ms", uptime: "98.5%", region: "Azure" },
    { id: "S-4", name: "Redis Cache Layer", status: "Healthy", latency: "1ms", uptime: "100%", region: "Local Cluster" },
    { id: "S-5", name: "Email SMTP Relay", status: "Maintenance", latency: "N/A", uptime: "99.4%", region: "SendGrid" },
]

const STAT_CARDS = [
    { label: "Global Uptime", value: "99.98%", sub: "Past 30 days", icon: ShieldCheck, bg: "bg-emerald-50/10", text: "text-emerald-600", border: "border-emerald-100/20" },
    { label: "Avg Latency", value: "32ms", sub: "P99 Response", icon: Zap, bg: "bg-blue-50/10", text: "text-blue-600", border: "border-blue-100/20" },
    { label: "Request Volume", value: "1.4M", sub: "Last 24 hours", icon: Activity, bg: "bg-indigo-50/10", text: "text-indigo-600", border: "border-indigo-100/20" },
    { label: "Data Ingest", value: "84 GB", sub: "Daily through-put", icon: Database, bg: "bg-amber-50/10", text: "text-amber-600", border: "border-amber-100/20" },
]

const LOGS = [
    { time: "14:22:04", event: "Auto-scaled cluster 'API-M' (+2 nodes)", level: "Info" },
    { time: "13:45:12", event: "PostgreSQL read-replica lag spike (8s)", level: "Warning" },
    { time: "12:10:45", event: "SSL Certificate auto-renewed (DigiCert)", level: "Success" },
    { time: "11:05:33", event: "Failed login spike from IP 45.1.2.1", level: "Blocked" },
]

export default function SystemHealthPage() {
    const { toast } = useToast()
    const [isClient, setIsClient] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [cpuUsage, setCpuUsage] = useState(42)
    const [ramUsage, setRamUsage] = useState(64)
    const [diskUsage, setDiskUsage] = useState(28)

    useEffect(() => {
        setIsClient(true)
        const interval = setInterval(() => {
            setCpuUsage(prev => Math.min(100, Math.max(0, prev + (Math.random() * 10 - 5))))
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    const handleForceCheck = () => {
        setIsRefreshing(true)
        setTimeout(() => {
            setIsRefreshing(false)
            toast({ title: "Health Check Complete", description: "All 14 core microservices reported back within 400ms." })
        }, 1500)
    }

    const handleClearLogs = () => {
        toast({ title: "Dev Logs Cleared", description: "Local stream cache flushed." })
    }

    const handleClearEvents = () => {
        // Assuming LOGS is managed by state if it were to be cleared
        // For this example, LOGS is a constant, so we'll just show a toast
        toast({ title: "Event Stream Cleared", description: "All historical event hashes have been purged from local buffer." })
    }

    const handleScaleInfrastructure = () => {
        toast({ title: "Scaling Protocol Engaged", description: "Broadcasting resource reallocation to cluster manager..." })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-[5px] border-l-emerald-500">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100"><Activity className="h-5 w-5" /></div>
                        <h1 className="text-[22px] font-bold tracking-tight text-slate-900">Operational Diagnostics</h1>
                    </div>
                    <p className="text-[13px] text-slate-500 font-medium tracking-tight">Real-time infrastructure vitals, microservice health, and performance benchmarking.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleForceCheck} disabled={isRefreshing} className="h-10 border-slate-200 font-bold text-[11px] px-5 uppercase tracking-widest bg-white">
                        <RefreshCw className={`h-4 w-4 mr-2 text-slate-400 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} /> Force Scan
                    </Button>
                    <Button onClick={() => toast({ title: "Exporting Diagnostic...", description: "Health dump generated in JSON format." })} className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 border-none uppercase text-[11px] tracking-widest shadow-lg shadow-emerald-100">
                        <Terminal className="h-4 w-4 mr-2" /> Dev Console
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {STAT_CARDS.map((s, i) => (
                    <Card key={i} className={`border ${s.border} ${s.bg} rounded-2xl p-5 shadow-none space-y-3`}>
                        <div className={`h-9 w-9 rounded-xl bg-white flex items-center justify-center ${s.text} shadow-sm`}><s.icon size={18} /></div>
                        <div>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <h4 className={`text-[18px] font-semibold ${s.text}`}>{s.value}</h4>
                            <p className="text-[11px] text-slate-500 font-normal">{s.sub}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Infrastructure Grid */}
                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-[17px] font-semibold text-slate-900">System Infrastructure Health</h3>
                            <p className="text-[12px] text-slate-500 font-medium tracking-tight">Monitoring all core services and external relays.</p>
                        </div>
                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] px-3">ACTIVE MONITORING</Badge>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-50 hover:bg-transparent">
                                {["Component Name", "Real-time Status", "Latency", "Region", "Uptime"].map(h => (
                                    <TableHead key={h} className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">{h}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {COMPONENTS.map((c) => (
                                <TableRow key={c.id} className="border-slate-50 hover:bg-slate-50/60 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Server size={14} /></div>
                                            <span className="text-[13px] font-bold text-slate-900">{c.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {c.status === 'Healthy' ? <CheckCircle2 size={14} className="text-emerald-500" /> : c.status === 'Down' ? <XCircle size={14} className="text-rose-500" /> : <AlertTriangle size={14} className="text-amber-500" />}
                                            <span className={`text-[11px] font-black uppercase ${c.status === 'Healthy' ? 'text-emerald-600' : 'text-amber-600'}`}>{c.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell><p className="text-[12px] font-mono font-bold text-slate-600">{c.latency}</p></TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <Globe size={11} /><span className="text-[11px] font-medium">{c.region}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell><p className="text-[12px] font-black text-slate-900">{c.uptime}</p></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                {/* Capacity Insights */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-slate-900 text-white p-8 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/10 text-emerald-400"><Layers size={20} /></div>
                            <h4 className="text-[15px] font-black uppercase tracking-tight text-white">Resource Capacity</h4>
                        </div>

                        <div className="space-y-6">
                            {[
                                { label: "CPU Utilization", value: cpuUsage, icon: CpuIcon, color: "bg-emerald-500", raw: `${cpuUsage.toFixed(1)}%` },
                                { label: "Memory Reserved", value: ramUsage, icon: BarChart3, color: "bg-indigo-500", raw: `${ramUsage} GB` },
                                { label: "SSD Storage", value: diskUsage, icon: HardDrive, color: "bg-amber-500", raw: `${diskUsage} TB` },
                            ].map((res, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                                        <div className="flex items-center gap-2"><res.icon size={12} /><span>{res.label}</span></div>
                                        <span className="text-white">{res.raw}</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full ${res.color} transition-all duration-700`} style={{ width: `${res.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <Button onClick={handleScaleInfrastructure} className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl border-none uppercase text-[11px] tracking-widest mt-2 shadow-xl shadow-slate-900/10">
                                Scale Infrastructure
                            </Button>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-7 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-indigo-600">
                                <Radio size={16} className="animate-pulse" /><h4 className="text-[12px] font-black uppercase">Live Event Stream</h4>
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleClearLogs} className="h-6 px-2 text-[10px] font-black text-slate-400 uppercase">Clear</Button>
                        </div>
                        <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar font-mono">
                            {LOGS.map((log, i) => (
                                <div key={i} className="flex gap-3 text-[11px] border-b border-slate-50 pb-2 last:border-none">
                                    <span className="text-slate-400 shrink-0">{log.time}</span>
                                    <span className={`font-medium ${log.level === 'Warning' ? 'text-amber-600' : log.level === 'Blocked' ? 'text-rose-600' : 'text-slate-600'}`}>
                                        {log.event}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    )
}
