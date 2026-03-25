"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Activity,
    Search,
    Filter,
    ChevronLeft,
    RefreshCw,
    Share2,
    Zap,
    Scale,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Settings2,
    ArrowUpRight,
    Layout,
    ExternalLink,
    Code,
    MoreHorizontal,
    Trash2,
    Terminal,
    FileSearch,
    ShieldAlert,
    Clock,
    Database,
    Webhook,
    User,
    ArrowRight,
    X,
    Check,
    History,
    SearchCheck,
    Cpu
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Switch } from "@/shared/components/ui/switch"
import { Progress } from "@/shared/components/ui/progress"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table"

interface LogEntry {
    id: string
    timestamp: string
    app: string
    event: string
    status: "Success" | "Failed" | "Warning"
    duration: string
    metadata: string
}

const INITIAL_LOGS: LogEntry[] = [
    { id: "LOG-9281", timestamp: "4:32:01 PM", app: "Salesforce CRM", event: "ObjectSync.Contacts", status: "Success", duration: "842ms", metadata: "14 records updated" },
    { id: "LOG-9280", timestamp: "4:31:45 PM", app: "Mailchimp ESP", event: "Audience.Sync", status: "Success", duration: "1.2s", metadata: "82 new subscribers" },
    { id: "LOG-9279", timestamp: "4:28:12 PM", app: "Twilio SMS", event: "Webhook.Inbound", status: "Failed", duration: "4.5s", metadata: "Timeout Error (504)" },
    { id: "LOG-9278", timestamp: "4:25:56 PM", app: "Google Ads", event: "LeadForm.Capture", status: "Warning", duration: "140ms", metadata: "Unknown UTM Mapping" },
    { id: "LOG-9277", timestamp: "4:22:10 PM", app: "Main Website", event: "API.LeadCreate", status: "Success", duration: "42ms", metadata: "Lead ID: 81273" },
]

export default function IntegrationLogsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS)
    const [isLiveStreaming, setIsLiveStreaming] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => { setIsClient(true) }, [])

    const toggleLiveStream = () => {
        setIsLiveStreaming(!isLiveStreaming)
        if (!isLiveStreaming) {
            toast({ title: "Live Pulse Active", description: "Inbound integration signals are now streaming to this view." })
        }
    }

    const filteredLogs = logs.filter(log =>
        log.app.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.event.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const STAT_CARDS = [
        { label: "Sync Stability", val: "94.8%", detail: "Pass rate (24h)", icon: ShieldAlert, bg: "bg-indigo-50/50", color: "text-indigo-600", border: "border-indigo-100" },
        { label: "Critical Failures", val: "14 Errors", detail: "Last 2 hours", icon: AlertCircle, bg: "bg-rose-50/50", color: "text-rose-600", border: "border-rose-100" },
        { label: "Ingestion Volume", val: "42.8 GB", detail: "Requests processed", icon: Database, bg: "bg-emerald-50/50", color: "text-emerald-600", border: "border-emerald-100" },
        { label: "Signal Latency", val: "142ms", detail: "Avg overhead", icon: Zap, bg: "bg-amber-50/50", color: "text-amber-600", border: "border-amber-100" },
    ]

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-[5px] border-l-rose-500">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 shadow-inner">
                                <FileSearch className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-black tracking-tight text-slate-900 uppercase">
                                Integration Sync Ledger
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-2xl">
                            The enterprise debugging layer. Monitor every sync event, audit failed webhooks, and drill down into API request/response payloads for deep troubleshooting.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={() => toast({ title: "Error Quarantine", description: "Isolating failed events for manual re-processing." })} variant="outline" className="h-10 border-slate-200 bg-white shadow-sm text-slate-600 font-black text-[11px] px-5 uppercase tracking-widest rounded-xl">
                        <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" /> Error Quarantine
                    </Button>
                    <Button
                        onClick={toggleLiveStream}
                        className={`h-10 font-black px-6 shadow-lg border-none uppercase text-[11px] tracking-widest transition-all rounded-xl ${isLiveStreaming ? 'bg-rose-100 text-rose-600 hover:bg-rose-200' : 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-200'}`}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLiveStreaming ? 'animate-spin' : ''}`} /> {isLiveStreaming ? 'Streaming...' : 'Live Stream'}
                    </Button>
                </div>
            </div>

            {/* Tactical Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {STAT_CARDS.map((s, i) => (
                    <Card key={i} className={`border ${s.border} ${s.bg} rounded-2xl p-5 shadow-none space-y-4 group hover:shadow-lg hover:shadow-slate-200/50 transition-all border-b-4 ${s.border.replace('border-', 'border-b-')}`}>
                        <div className={`h-10 w-10 rounded-xl bg-white flex items-center justify-center ${s.color} shadow-sm group-hover:scale-110 transition-transform`}><s.icon size={20} /></div>
                        <div>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <h4 className={`text-[22px] font-semibold ${s.color} tracking-tight`}>{s.val}</h4>
                            <p className="text-[11px] text-slate-500 font-normal">{s.detail}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Logs Table */}
            <Card className="lg:col-span-12 border-none shadow-sm ring-1 ring-slate-100 rounded-[32px] bg-white overflow-hidden p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 px-2">
                    <div className="space-y-1">
                        <h3 className="text-[17px] font-black text-slate-900 uppercase tracking-tight">Real-time Event Audit</h3>
                        <p className="text-[12px] text-slate-500 font-medium">Tracking all cross-platform data transactions and API heartbeats in the ledger.</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                            <Input
                                placeholder="Search by App, Event or Payload ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-11 rounded-2xl border-slate-100 bg-slate-50 text-[12px] font-black focus-visible:ring-rose-500"
                            />
                        </div>
                        <Button onClick={() => toast({ title: "Advanced Filter", description: "Opening log filter panel by app, status, and date range." })} variant="outline" className="h-11 border-slate-200 bg-white font-black text-[11px] px-5 rounded-2xl uppercase tracking-widest hover:bg-slate-50 transition-all">
                            <Filter size={16} className="mr-2 text-slate-400" /> Advanced Filter
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-50 hover:bg-transparent">
                                <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-6">Global Clock</TableHead>
                                <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Node / Service</TableHead>
                                <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trigger Action</TableHead>
                                <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fidelity / Response</TableHead>
                                <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</TableHead>
                                <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLogs.map((log) => (
                                <TableRow key={log.id} className="border-slate-50 group hover:bg-slate-50/50 transition-colors">
                                    <TableCell>
                                        <div className="space-y-0.5 min-w-[100px] py-4">
                                            <p className="text-[15px] font-black text-slate-900 tabular-nums">{log.timestamp}</p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">ID: {log.id}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-rose-50 group-hover:text-rose-600 transition-all shadow-sm">
                                                {log.app === 'Twilio SMS' ? <Webhook size={22} /> : <Cpu size={22} />}
                                            </div>
                                            <p className="text-[15px] font-black text-slate-900 uppercase tracking-tight">{log.app}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="h-6 px-3 text-[10px] font-black uppercase text-indigo-500 border-indigo-100 bg-indigo-50/50 tracking-wider">
                                            {log.event}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[320px]">
                                            <p className="text-[13px] text-slate-600 font-bold truncate tracking-tight uppercase">{log.metadata}</p>
                                            <div className="flex items-center gap-2 mt-1.5 px-2 py-0.5 bg-slate-50 rounded-lg w-fit border border-slate-100">
                                                <Clock size={10} className="text-slate-400" />
                                                <p className="text-[10px] font-black text-slate-500 uppercase leading-none">{log.duration}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className={`border shadow-sm h-7 px-4 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all ${log.status === 'Success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            log.status === 'Failed' ? 'bg-rose-50 text-rose-500 border-rose-100 shadow-[0_0_12px_rgba(244,63,94,0.2)]' : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            {log.status === 'Success' ? <Check size={14} className="mr-2" /> : log.status === 'Failed' ? <X size={14} className="mr-2" /> : null}
                                            {log.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button size="icon" variant="ghost" onClick={() => toast({ title: "Payload Audit", description: "Opening raw stack trace for " + log.id })} className="h-10 w-10 text-slate-300 hover:text-slate-900 hover:bg-white rounded-xl shadow-none hover:shadow-sm border-none transition-all">
                                                <Terminal size={18} />
                                            </Button>
                                            <Button size="icon" variant="ghost" onClick={() => toast({ title: "Retry protocol", description: "Re-emitting trigger for event " + log.event })} className="h-10 w-10 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border-none transition-all">
                                                <RefreshCw size={18} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Debug Advisor Footer */}
            <div className="lg:col-span-12 p-10 rounded-[40px] bg-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-12 group relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_30%_50%,rgba(244,63,94,0.1),transparent)] pointer-events-none" />
                <div className="flex items-center gap-8 relative z-10">
                    <div className="h-20 w-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-500 group-hover:scale-105 transition-transform shadow-2xl">
                        <ShieldAlert size={40} />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-[22px] font-black tracking-tighter uppercase">Intelligent Quarantine Protocol</h4>
                        <p className="text-[14px] text-slate-400 font-medium leading-relaxed max-w-2xl italic">
                            "We have isolated **3 recurring 504 Timeouts** on the Twilio SMS bridge. Adaptive backoff strategy is recommended to restore stability."
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 relative z-10 shrink-0">
                    <Button onClick={() => toast({ title: "Smart Policy Applied", description: "Adaptive backoff strategy activated for Twilio SMS bridge." })} className="h-14 bg-white text-slate-950 hover:bg-slate-100 font-black px-10 rounded-2xl border-none uppercase text-[12px] tracking-widest shadow-xl">
                        Apply Smart Policy
                    </Button>
                    <Button onClick={() => toast({ title: "Audit Report", description: "Generating full integration health report for export." })} variant="ghost" className="h-14 text-slate-400 hover:text-white font-black text-[12px] uppercase tracking-widest px-6 gap-2 hover:bg-white/5 rounded-2xl">
                        Audit Report <ArrowRight size={18} />
                    </Button>
                </div>
            </div>

        </div>
    )
}
