"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
    ScrollText, Search, Filter, Download, RefreshCw, CheckCircle2,
    AlertCircle, AlertTriangle, Info,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import { PageHeader, Stat } from "@/shared/components/lead-management/sheets/IntegrationListBits"

type LogLevel = "Info" | "Success" | "Warning" | "Error"

interface LogEntry {
    id: string
    timestamp: string
    level: LogLevel
    integration: string
    event: string
    details: string
}

const ACCENT = "#64748b"

const INITIAL_LOGS: LogEntry[] = [
    { id: "L-1024", timestamp: "2026-05-08 12:04:21", level: "Success", integration: "Mailchimp Production", event: "sync.completed", details: "1240 contacts synced in 8.2s" },
    { id: "L-1023", timestamp: "2026-05-08 12:01:11", level: "Error", integration: "Stripe Customer Push", event: "webhook.delivery_failed", details: "HTTP 500 from receiver after 3 retries" },
    { id: "L-1022", timestamp: "2026-05-08 11:58:02", level: "Warning", integration: "Zoho APAC", event: "sync.conflict", details: "12 records have conflicting field values" },
    { id: "L-1021", timestamp: "2026-05-08 11:55:38", level: "Info", integration: "GA4 Production", event: "config.updated", details: "Tracking ID rotated by admin" },
    { id: "L-1020", timestamp: "2026-05-08 11:52:14", level: "Success", integration: "Twilio SMS", event: "message.batch_sent", details: "320 messages dispatched, 318 delivered" },
    { id: "L-1019", timestamp: "2026-05-08 11:48:01", level: "Error", integration: "LinkedIn Sponsored", event: "auth.token_expired", details: "OAuth token requires re-authorization" },
    { id: "L-1018", timestamp: "2026-05-08 11:42:27", level: "Info", integration: "Calendly Booking Plugin", event: "plugin.installed", details: "Version 2.4.1 enabled by admin" },
    { id: "L-1017", timestamp: "2026-05-08 11:38:55", level: "Success", integration: "Salesforce Production", event: "sync.completed", details: "8200 leads matched, 0 conflicts" },
]

const LEVEL_META: Record<LogLevel, { color: string; bg: string; icon: React.ReactNode }> = {
    Info: { color: "#3b82f6", bg: "bg-blue-50 text-blue-700 border-blue-200", icon: <Info className="w-3.5 h-3.5" /> },
    Success: { color: "#10b981", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    Warning: { color: "#f59e0b", bg: "bg-amber-50 text-amber-700 border-amber-200", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    Error: { color: "#ef4444", bg: "bg-red-50 text-red-700 border-red-200", icon: <AlertCircle className="w-3.5 h-3.5" /> },
}

export default function LogsPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS)
    const [search, setSearch] = useState("")
    const [levelFilter, setLevelFilter] = useState<string>("all")
    const [integrationFilter, setIntegrationFilter] = useState<string>("all")

    const integrations = useMemo(
        () => Array.from(new Set(logs.map((l) => l.integration))).sort(),
        [logs]
    )

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        return logs.filter((l) => {
            if (levelFilter !== "all" && l.level !== levelFilter) return false
            if (integrationFilter !== "all" && l.integration !== integrationFilter) return false
            if (!q) return true
            return l.event.toLowerCase().includes(q) || l.details.toLowerCase().includes(q) || l.integration.toLowerCase().includes(q)
        })
    }, [logs, search, levelFilter, integrationFilter])

    const stats = useMemo(() => ({
        total: logs.length,
        success: logs.filter((l) => l.level === "Success").length,
        warnings: logs.filter((l) => l.level === "Warning").length,
        errors: logs.filter((l) => l.level === "Error").length,
    }), [logs])

    const handleExport = () => {
        const headers = ["ID", "Timestamp", "Level", "Integration", "Event", "Details"]
        const rows = filtered.map((l) => [l.id, l.timestamp, l.level, l.integration, l.event, l.details])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `integration-logs-${new Date().toISOString().slice(0, 10)}.csv`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} log entries exported.` })
    }

    const handleRefresh = () => {
        toast({ title: "Logs refreshed", description: "Pulled latest events from the audit trail." })
    }

    return (
        <div className="space-y-5 pb-12 max-w-[1600px] mx-auto" style={{ zoom: 0.9 }}>
            <PageHeader
                icon={<ScrollText className="h-5 w-5" />}
                title="Integration Logs"
                description="Audit trail of every sync, webhook delivery, error and configuration change across integrations."
                accent={ACCENT}
                onBack={() => router.push("/lead-management")}
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Stat label="Total Events" value={stats.total} accent={ACCENT} icon={<ScrollText className="w-4 h-4" />} />
                <Stat label="Success" value={stats.success} accent="#10b981" icon={<CheckCircle2 className="w-4 h-4" />} />
                <Stat label="Warnings" value={stats.warnings} accent="#f59e0b" icon={<AlertTriangle className="w-4 h-4" />} />
                <Stat label="Errors" value={stats.errors} accent="#ef4444" icon={<AlertCircle className="w-4 h-4" />} helper={stats.errors === 0 ? "all healthy" : "needs review"} />
            </div>

            <div className="bg-white border border-[#EEF1F6] shadow-sm rounded-none p-3 flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#94A3B8]" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search events, details, integration..."
                        className="pl-8 h-9 rounded-none border-[#E5E7EB] text-[13px]"
                    />
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#64748B]">
                    <Filter className="w-3.5 h-3.5" /> Filter
                </span>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="h-9 w-[140px] rounded-none border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All levels</SelectItem>
                        <SelectItem value="Info">Info</SelectItem>
                        <SelectItem value="Success">Success</SelectItem>
                        <SelectItem value="Warning">Warning</SelectItem>
                        <SelectItem value="Error">Error</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={integrationFilter} onValueChange={setIntegrationFilter}>
                    <SelectTrigger className="h-9 w-[200px] rounded-none border-[#E5E7EB] text-[13px]"><SelectValue placeholder="All integrations" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All integrations</SelectItem>
                        {integrations.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                </Select>
                {(levelFilter !== "all" || integrationFilter !== "all" || search) && (
                    <Button
                        variant="ghost"
                        onClick={() => { setSearch(""); setLevelFilter("all"); setIntegrationFilter("all") }}
                        className="h-9 rounded-none text-[12px] text-[#64748B]"
                    >
                        Clear
                    </Button>
                )}
                <span className="text-[11.5px] text-[#94A3B8] ml-auto">{filtered.length} of {logs.length}</span>
                <Button variant="outline" onClick={handleRefresh} className="h-9 rounded-none border-[#E5E7EB] text-[12px]">
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
                </Button>
                <Button variant="outline" onClick={handleExport} className="h-9 rounded-none border-[#E5E7EB] text-[12px]">
                    <Download className="w-3.5 h-3.5 mr-1.5" /> Export
                </Button>
            </div>

            <div className="bg-white border border-[#EEF1F6] shadow-sm rounded-none overflow-x-auto">
                <table className="w-full text-[12.5px]">
                    <thead className="bg-slate-50 border-b border-[#EEF1F6] text-[10.5px] font-bold uppercase tracking-wider text-[#64748B]">
                        <tr>
                            <th className="px-4 py-2.5 text-left w-[150px]">Timestamp</th>
                            <th className="px-4 py-2.5 text-left w-[110px]">Level</th>
                            <th className="px-4 py-2.5 text-left w-[200px]">Integration</th>
                            <th className="px-4 py-2.5 text-left w-[200px]">Event</th>
                            <th className="px-4 py-2.5 text-left">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-10 text-center text-[#94A3B8]">
                                    No log entries match the current filters.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((l) => {
                                const meta = LEVEL_META[l.level]
                                return (
                                    <tr key={l.id} className="hover:bg-slate-50/60">
                                        <td className="px-4 py-2.5 font-mono text-[11px] text-[#64748B] tabular-nums">{l.timestamp}</td>
                                        <td className="px-4 py-2.5">
                                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider rounded-none border ${meta.bg}`}>
                                                {meta.icon}
                                                {l.level}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5 text-[#0F172A]">{l.integration}</td>
                                        <td className="px-4 py-2.5 font-mono text-[11.5px] text-[#475569]">{l.event}</td>
                                        <td className="px-4 py-2.5 text-[#475569]">{l.details}</td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
