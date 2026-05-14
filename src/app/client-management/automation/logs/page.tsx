"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Activity,
    ShieldCheck,
    AlertTriangle,
    Clock,
    Search,
    Filter,
    RefreshCw,
    Download,
    Terminal,
    Database,
    Network,
    CheckCircle,
    Eye,
    FileSearch,
    History,
    Sparkles,
    Trash2,
    Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { toast } from "@/shared/utils/toast"

interface LogEntry {
    id: string
    event: string
    flow: string
    status: "Success" | "Failed" | "Warning"
    time: string
    latency: string
    trigger: string
    actor: string
}

const INITIAL_LOGS: LogEntry[] = [
    { id: "LOG-01", event: "Sentinel Breach", flow: "Health Sentinel", status: "Success", time: "10:30 AM", latency: "0.2s", trigger: "Telemetry", actor: "system" },
    { id: "LOG-02", event: "Payment Pulse", flow: "Recovery Sequence", status: "Failed", time: "10:25 AM", latency: "1.8s", trigger: "Webhook", actor: "billing" },
    { id: "LOG-03", event: "Renewal Audit", flow: "Renewal Pulse", status: "Success", time: "09:15 AM", latency: "4.1s", trigger: "Scheduler", actor: "cron" },
    { id: "LOG-04", event: "Health Score Drop", flow: "Risk Sentinel", status: "Warning", time: "09:02 AM", latency: "1.1s", trigger: "Threshold", actor: "system" },
    { id: "LOG-05", event: "Welcome Email", flow: "Onboarding Flow", status: "Success", time: "08:55 AM", latency: "0.4s", trigger: "Event", actor: "automation" },
    { id: "LOG-06", event: "Invoice Reminder", flow: "Finance Loop", status: "Success", time: "08:40 AM", latency: "0.6s", trigger: "Schedule", actor: "billing" },
]

const STATUS_COLORS: Record<string, string> = {
    Success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Failed: "bg-rose-50 text-rose-700 border-rose-100",
    Warning: "bg-amber-50 text-amber-700 border-amber-100",
}

export default function LogsPage() {
    const router = useRouter()
    const [logs, setLogs] = React.useState<LogEntry[]>(INITIAL_LOGS)
    const [search, setSearch] = React.useState("")
    const [filterStatus, setFilterStatus] = React.useState("all")
    const [filterTrigger, setFilterTrigger] = React.useState("all")

    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [selected, setSelected] = React.useState<LogEntry | null>(null)
    const [isSyncing, setIsSyncing] = React.useState(false)

    const stats = React.useMemo(() => {
        const total = logs.length
        const success = logs.filter(l => l.status === "Success").length
        const failed = logs.filter(l => l.status === "Failed").length
        const successRate = total ? Math.round((success / total) * 100) : 0
        const avgLatencyMs = total ? (logs.reduce((a, l) => a + parseFloat(l.latency), 0) / total).toFixed(1) : "0"
        return { total, success, failed, successRate, avgLatencyMs }
    }, [logs])

    const filtered = React.useMemo(() => {
        return logs.filter(l => {
            const matchSearch = !search || l.event.toLowerCase().includes(search.toLowerCase()) || l.flow.toLowerCase().includes(search.toLowerCase()) || l.trigger.toLowerCase().includes(search.toLowerCase())
            const matchStatus = filterStatus === "all" || l.status === filterStatus
            const matchTrigger = filterTrigger === "all" || l.trigger === filterTrigger
            return matchSearch && matchStatus && matchTrigger
        })
    }, [logs, search, filterStatus, filterTrigger])

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(new Promise(r => setTimeout(r, 1200)), {
            loading: "Refreshing telemetry...",
            success: "Telemetry stream refreshed",
            error: "Refresh failed",
        })
        setTimeout(() => setIsSyncing(false), 1200)
    }

    const handleExport = () => {
        const csv = [
            ["ID", "Event", "Flow", "Trigger", "Status", "Latency", "Time", "Actor"],
            ...logs.map(l => [l.id, l.event, l.flow, l.trigger, l.status, l.latency, l.time, l.actor]),
        ].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "automation-logs.csv"
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Logs exported")
    }

    const handlePurge = () => {
        if (logs.length === 0) { toast.error("No logs to purge"); return }
        setLogs([])
        toast.success("Audit log purged")
    }

    const openDetail = (log: LogEntry) => {
        setSelected(log)
        setIsDetailOpen(true)
    }

    const kpiCards = [
        { title: "Total Events", value: stats.total.toLocaleString(), subtitle: "Recorded signals", icon: Activity, color: "indigo", trend: `+${stats.total}`, path: "/client-management/automation/workflows" },
        { title: "Success Rate", value: `${stats.successRate}%`, subtitle: "Terminal accuracy", icon: ShieldCheck, color: "emerald", trend: "+1.4%", path: "/client-management/analytics/overview" },
        { title: "Failed Events", value: String(stats.failed), subtitle: "Requires triage", icon: AlertTriangle, color: "rose", trend: `${stats.failed}`, path: "/client-management/automation/approvals" },
        { title: "Avg Latency", value: `${stats.avgLatencyMs}s`, subtitle: "Per execution", icon: Clock, color: "violet", trend: "-0.2s", path: "/client-management/automation/triggers" },
    ]

    const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        indigo: { bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", border: "border-indigo-200/50", text: "text-indigo-600", iconBg: "bg-indigo-100" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        rose: { bg: "bg-gradient-to-br from-rose-50 to-rose-100/50", border: "border-rose-200/50", text: "text-rose-600", iconBg: "bg-rose-100" },
        violet: { bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", border: "border-violet-200/50", text: "text-violet-600", iconBg: "bg-violet-100" },
    }

    const triggerOptions = Array.from(new Set(INITIAL_LOGS.map(l => l.trigger)))

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Audit <span className="text-indigo-600">Logs</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Real-time execution telemetry, system action forensics, and error diagnostics.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={handleSync}>
                        {isSyncing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                        {isSyncing ? "Refreshing" : "Refresh"}
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={handlePurge}>
                        <Trash2 className="h-4 w-4 mr-2" /> Purge
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" /> Filter
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-none h-10 px-5" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" /> Export Report
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((kpi, i) => {
                    const cc = colorMap[kpi.color]
                    const Icon = kpi.icon
                    return (
                        <Card key={i} className={`rounded-none cursor-pointer hover:shadow-md transition ${cc.bg} ${cc.border} border`} onClick={() => router.push(kpi.path)}>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 tracking-wide mb-1">{kpi.title}</p>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
                                            <span className="text-xs font-bold text-emerald-600">{kpi.trend}</span>
                                        </div>
                                        <p className="mt-2 text-xs text-slate-400">{kpi.subtitle}</p>
                                    </div>
                                    <div className={`h-10 w-10 rounded-none flex items-center justify-center ${cc.iconBg}`}>
                                        <Icon className={`h-5 w-5 ${cc.text}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-none">
                        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Terminal className="h-4 w-4" /> Telemetry Console
                                </CardTitle>
                                <Badge className="rounded-none bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                                </Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {filtered.length > 0 ? filtered.map(log => (
                                    <div key={log.id} className="px-6 py-4 hover:bg-slate-50/80 transition cursor-pointer group flex items-center gap-4" onClick={() => openDetail(log)}>
                                        <div className="h-10 w-10 rounded-none bg-white border border-slate-100 flex items-center justify-center shrink-0">
                                            <Terminal className="h-4 w-4 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-sm font-semibold text-slate-800">{log.event}</p>
                                                <Badge className={`rounded-none text-[10px] border ${STATUS_COLORS[log.status]}`}>{log.status}</Badge>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-[10px] text-slate-400 font-semibold">
                                                <span className="flex items-center gap-1 font-mono"><Database className="h-3 w-3" /> {log.flow}</span>
                                                <span className="flex items-center gap-1"><Network className="h-3 w-3" /> {log.latency}</span>
                                                <span className="flex items-center gap-1 text-indigo-600"><Clock className="h-3 w-3" /> {log.time}</span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="rounded-none shrink-0" onClick={(e) => { e.stopPropagation(); openDetail(log) }}>
                                            <FileSearch className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )) : (
                                    <div className="px-6 py-12 text-center text-sm text-slate-500">No log entries match your filters.</div>
                                )}
                            </div>
                        </CardContent>
                        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-[11px] font-semibold text-slate-500">Showing {filtered.length} of {logs.length} signals</p>
                            <Button variant="ghost" className="rounded-none text-indigo-600 hover:bg-indigo-50 text-[11px] font-bold h-8" onClick={handleExport}>
                                Download Full Feed
                            </Button>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {(["Success", "Failed", "Warning"] as const).map(s => {
                                const list = logs.filter(l => l.status === s)
                                return (
                                    <div key={s} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-2 rounded-none transition" onClick={() => setFilterStatus(s)}>
                                        <div className="flex items-center gap-3">
                                            <div className={`h-9 w-9 rounded-none flex items-center justify-center border ${STATUS_COLORS[s]}`}>
                                                {s === "Success" ? <CheckCircle className="h-4 w-4" /> : s === "Failed" ? <AlertTriangle className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800 leading-none">{s}</p>
                                                <p className="text-[10px] text-slate-400 mt-1">{list.length} events</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-slate-900">{list.length}</span>
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-indigo-100 bg-indigo-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-indigo-600 tracking-wider flex items-center gap-2 uppercase">
                                <Sparkles className="h-4 w-4" /> Audit Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    Pipeline maintained <span className="text-indigo-600 font-bold">{stats.successRate}%</span> success rate across {stats.total} signals.
                                </p>
                            </div>
                            <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    {stats.failed} failures need triage in the recovery queue.
                                </p>
                            </div>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-none mt-2" onClick={() => { toast.success("Opening overview"); router.push('/client-management/automation/overview') }}>
                                Open Pulse Dashboard
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Recent History</CardTitle>
                            <History className="h-4 w-4 text-indigo-400" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {logs.slice(0, 3).map((log, i) => (
                                <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1 transition" onClick={() => openDetail(log)}>
                                    <div className="h-9 w-9 rounded-none bg-white border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">{log.id.slice(-2)}</div>
                                    <div className="flex-1">
                                        <p className="text-[12px] font-bold text-slate-700 leading-tight">{log.event}</p>
                                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{log.flow} • {log.time}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Logs</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Status</Label>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All statuses</SelectItem>
                                    <SelectItem value="Success">Success</SelectItem>
                                    <SelectItem value="Failed">Failed</SelectItem>
                                    <SelectItem value="Warning">Warning</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Trigger Source</Label>
                            <Select value={filterTrigger} onValueChange={setFilterTrigger}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All triggers</SelectItem>
                                    {triggerOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setFilterStatus("all"); setFilterTrigger("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Log Forensics</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Event</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.event}</p>
                                    <p className="text-sm text-slate-500">{selected.id}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Flow</p><p className="font-semibold text-slate-900">{selected.flow}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <Badge className={`rounded-none border ${STATUS_COLORS[selected.status]}`}>{selected.status}</Badge>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Trigger</p><p className="font-semibold text-slate-900">{selected.trigger}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Actor</p><p className="font-semibold text-slate-900">{selected.actor}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Latency</p><p className="font-semibold text-slate-900">{selected.latency}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Timestamp</p><p className="font-semibold text-slate-900">{selected.time}</p></div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { router.push('/client-management/automation/workflows'); toast.success("Opening workflow") }}>
                                    <Eye className="h-4 w-4 mr-2" />View Workflow
                                </Button>
                                <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={() => toast.success(`Forensic drilldown started for ${selected.id}`)}>
                                    <FileSearch className="h-4 w-4 mr-2" />Drill Down
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
