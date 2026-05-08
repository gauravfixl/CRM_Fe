"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    History,
    Search,
    Filter,
    ChevronLeft,
    GitBranch,
    ArrowRight,
    ShieldCheck,
    AlertCircle,
    FileText,
    Info,
    X,
    Download,
    Eye,
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"

type AuditLog = {
    id: string
    lead: string
    ruleMatched: string
    methodUsed: string
    assignedTo: string
    timestamp: string
    status: "Success" | "Failed" | "Manual"
    latency: string
    type: string
}

const ROUTING_AUDIT: AuditLog[] = [
    { id: "1", lead: "Aarav Mehta", ruleMatched: "Enterprise Leads - US West", methodUsed: "High-Value RR Pool", assignedTo: "Sarah Jenkins", timestamp: "2 mins ago", status: "Success", latency: "140ms", type: "Direct Match" },
    { id: "2", lead: "Emma Wilson", ruleMatched: "Google Ads - Discovery", methodUsed: "Inbound BDR Queue", assignedTo: "Michael Chen", timestamp: "15 mins ago", status: "Success", latency: "85ms", type: "Sequential Pass" },
    { id: "3", lead: "James Anderson", ruleMatched: "No Rule (Fallback)", methodUsed: "Manual Assignment", assignedTo: "Admin Overwrite", timestamp: "1 hour ago", status: "Manual", latency: "N/A", type: "Override" },
    { id: "4", lead: "Sarah Jenkins", ruleMatched: "EMEA Geography", methodUsed: "EMEA Regional Hub", assignedTo: "Failed (No Rep Active)", timestamp: "3 hours ago", status: "Failed", latency: "210ms", type: "Routing Error" },
    { id: "5", lead: "Michael Chen", ruleMatched: "Security Domain Block", methodUsed: "Governance Queue", assignedTo: "System (Auto-Blocked)", timestamp: "Yesterday", status: "Success", latency: "45ms", type: "Pre-Assignment Rule" },
]

const STATUSES = ["Success", "Failed", "Manual"]
const TYPES = ["Direct Match", "Sequential Pass", "Override", "Routing Error", "Pre-Assignment Rule"]

type FilterForm = { from: string; to: string; minLatency: string }
type FilterErrors = Partial<Record<keyof FilterForm, string>>

export default function RoutingAuditPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [typeFilter, setTypeFilter] = useState<string>("all")

    const [filterOpen, setFilterOpen] = useState(false)
    const [filterForm, setFilterForm] = useState<FilterForm>({ from: "", to: "", minLatency: "" })
    const [filterErrors, setFilterErrors] = useState<FilterErrors>({})

    const [detailsOpen, setDetailsOpen] = useState(false)
    const [activeLog, setActiveLog] = useState<AuditLog | null>(null)

    useEffect(() => { setIsClient(true) }, [])

    const validateFilter = (s: FilterForm): FilterErrors => {
        const e: FilterErrors = {}
        if (!s.from.trim()) e.from = "From date is required"
        if (!s.to.trim()) e.to = "To date is required"
        if (s.from && s.to && new Date(s.from) > new Date(s.to)) e.to = "End date must be after start"
        if (s.minLatency.trim() && !/^\d+$/.test(s.minLatency.trim())) e.minLatency = "Must be a number (ms)"
        return e
    }

    const submitFilter = (e: React.FormEvent) => {
        e.preventDefault()
        const v = validateFilter(filterForm)
        setFilterErrors(v)
        if (Object.keys(v).length > 0) {
            toast({ title: "Validation failed", description: "Please correct the filter inputs.", variant: "destructive" })
            return
        }
        toast({ title: "Filters applied", description: `Showing decisions ${filterForm.from} → ${filterForm.to}.` })
        setFilterOpen(false)
    }

    const exportReport = () => {
        const csv = ["Lead,RuleMatched,Method,AssignedTo,Status,Latency,Type,Timestamp", ...ROUTING_AUDIT.map(l =>
            `"${l.lead}","${l.ruleMatched}","${l.methodUsed}","${l.assignedTo}","${l.status}","${l.latency}","${l.type}","${l.timestamp}"`
        )].join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url; a.download = "routing-audit.csv"; a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Report exported", description: "Audit trace downloaded." })
    }

    const openDetails = (log: AuditLog) => { setActiveLog(log); setDetailsOpen(true) }

    const filtered = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        return ROUTING_AUDIT.filter(l => {
            if (term && !l.lead.toLowerCase().includes(term) && !l.assignedTo.toLowerCase().includes(term) && !l.ruleMatched.toLowerCase().includes(term)) return false
            if (statusFilter !== "all" && l.status !== statusFilter) return false
            if (typeFilter !== "all" && l.type !== typeFilter) return false
            return true
        })
    }, [searchTerm, statusFilter, typeFilter])

    const clearFilters = () => { setSearchTerm(""); setStatusFilter("all"); setTypeFilter("all") }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500" style={{ zoom: 0.9 }}>

            {/* Header (light bg) */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-slate-100 p-6 rounded-none border border-slate-200 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold uppercase tracking-widest text-slate-500 hover:text-slate-900"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white text-slate-700 shadow-sm border border-slate-200">
                                <History className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Routing Decision Audit
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            A complete trace of "Who got what lead and why." Debug failed routing attempts and track manual overrides in real-time.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={exportReport}
                        className="h-10 border-slate-200 bg-white shadow-sm text-slate-700 font-semibold text-[12px] px-5 rounded-none"
                    >
                        <FileText className="h-4 w-4 mr-2 text-slate-500" /> Decision Report
                    </Button>
                    <Button
                        onClick={() => setFilterOpen(true)}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none rounded-none"
                    >
                        <Filter className="h-4 w-4 mr-2" /> Advanced Filter
                    </Button>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50 p-2 rounded-none border border-slate-100/50 shadow-sm">
                <div className="relative flex-1 lg:max-w-[400px]">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Trace by lead, owner, or rule name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-10 border-slate-100 bg-white text-[13px] rounded-none focus-visible:ring-indigo-500"
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-10 w-[140px] border-slate-100 bg-white text-[12px] font-semibold rounded-none">
                            <Filter className="h-3.5 w-3.5 mr-1 text-slate-400" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="all">All Status</SelectItem>
                            {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="h-10 w-[180px] border-slate-100 bg-white text-[12px] font-semibold rounded-none">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="all">All Types</SelectItem>
                            {TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {(searchTerm || statusFilter !== "all" || typeFilter !== "all") && (
                        <Button variant="ghost" onClick={clearFilters} className="h-10 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 px-3 rounded-none">
                            <X className="h-3.5 w-3.5 mr-1" /> Clear
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Audit Timeline Feed */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[16px] font-semibold text-slate-900">Real-time Decision Trace <span className="text-slate-400 font-medium ml-1">({filtered.length})</span></h2>
                    </div>

                    <div className="space-y-2">
                        {filtered.length === 0 ? (
                            <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white">
                                <CardContent className="p-10 text-center">
                                    <Filter className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                                    <p className="text-[14px] font-semibold text-slate-700">No decisions match your filters</p>
                                    <Button variant="outline" onClick={clearFilters} className="mt-4 h-9 rounded-none">Clear filters</Button>
                                </CardContent>
                            </Card>
                        ) : filtered.map((log) => (
                            <Card key={log.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white group hover:ring-indigo-100 transition-all overflow-hidden border-l-4 border-l-transparent hover:border-l-indigo-500">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-4 min-w-[200px]">
                                                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                    <GitBranch size={20} />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <h4 className="text-[14px] font-semibold text-slate-900 leading-none">{log.lead}</h4>
                                                    <p className="text-[11px] font-medium text-slate-500">{log.timestamp}</p>
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-2 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Badge variant="outline" className="border-slate-100 bg-slate-50 text-[9px] font-semibold tracking-wider text-slate-500 px-1.5 h-5 rounded">{log.type}</Badge>
                                                    <span className="text-slate-300">/</span>
                                                    <p className="text-[12px] font-medium text-slate-600 line-clamp-1">{log.ruleMatched}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <ArrowRight size={12} className="text-emerald-500" />
                                                    <span className="text-[11px] font-semibold text-slate-500 italic">Method: {log.methodUsed}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8 min-w-[220px] justify-end">
                                                <div className="text-right flex flex-col items-end gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <h5 className={`text-[13px] font-semibold ${log.status === 'Failed' ? 'text-rose-600' : log.status === 'Manual' ? 'text-amber-600' : 'text-slate-900'}`}>{log.assignedTo}</h5>
                                                        <div className={`h-2 w-2 rounded-full ${log.status === 'Success' ? 'bg-emerald-500' : log.status === 'Failed' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                                                    </div>
                                                    <span className="text-[10px] font-semibold text-slate-400 tracking-wider">{log.latency} Decision time</span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openDetails(log)}
                                                    className="h-9 w-9 text-slate-400 hover:text-slate-900 rounded-md"
                                                >
                                                    <Eye size={16} />
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
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white p-6 space-y-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase leading-none">Successful Routes</p>
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

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-rose-50 text-rose-900 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[14px] font-semibold tracking-tight text-rose-700">Active Failure Alerts</h4>
                            <AlertCircle size={20} className="text-rose-500" />
                        </div>
                        <div className="space-y-3">
                            <div className="p-3 rounded-none bg-white border border-rose-100 space-y-1">
                                <p className="text-[12px] font-semibold text-rose-700">No Owner Availability</p>
                                <p className="text-[11px] font-medium text-slate-600">EMEA Hub is currently without any active reps.</p>
                                <Button
                                    variant="ghost"
                                    onClick={() => toast({ title: "Opening editor", description: "Loading assignment reassignment modal..." })}
                                    className="h-auto p-0 text-[10px] font-semibold tracking-wider text-indigo-600 hover:bg-transparent mt-2 uppercase"
                                >
                                    Fix Assignment
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-slate-50 text-slate-900 p-6 space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                            <ShieldCheck size={100} />
                        </div>
                        <h4 className="text-[15px] font-semibold relative z-10">Audit Governance</h4>
                        <p className="text-[12px] text-slate-600 font-medium leading-relaxed relative z-10">
                            Decision logs are cryptographically signed and stored for 365 days for SOC2 compliance.
                        </p>
                        <Button
                            onClick={() => toast({ title: "Export started", description: "Compliance logs are being packaged." })}
                            className="w-full h-9 bg-white text-slate-900 border border-slate-200 hover:bg-slate-100 font-semibold text-[11px] rounded-none shadow-sm relative z-10"
                        >
                            <Download className="h-3.5 w-3.5 mr-2" /> Download Compliance Log
                        </Button>
                    </Card>
                </div>

            </div>

            {/* Advanced Filter Side Form */}
            <SideFormSheet
                open={filterOpen}
                onOpenChange={setFilterOpen}
                title="Advanced Audit Filter"
                description="Refine the decision trace by date range and latency."
                icon={<Filter className="h-5 w-5" />}
                accentColor="#4f46e5"
                onSubmit={submitFilter}
                submitLabel="Apply Filters"
                width="md"
            >
                <div className="space-y-5">
                    <Field label="From Date" required error={filterErrors.from}>
                        <Input
                            type="date"
                            name="from"
                            value={filterForm.from}
                            onChange={(e) => setFilterForm({ ...filterForm, from: e.target.value })}
                            className="h-10 rounded-none"
                        />
                    </Field>

                    <Field label="To Date" required error={filterErrors.to}>
                        <Input
                            type="date"
                            name="to"
                            value={filterForm.to}
                            onChange={(e) => setFilterForm({ ...filterForm, to: e.target.value })}
                            className="h-10 rounded-none"
                        />
                    </Field>

                    <Field label="Min. Latency (ms)" error={filterErrors.minLatency} hint="Optional. Show only decisions taking longer than N ms.">
                        <Input
                            name="minLatency"
                            value={filterForm.minLatency}
                            onChange={(e) => setFilterForm({ ...filterForm, minLatency: e.target.value })}
                            placeholder="e.g., 100"
                            className="h-10 rounded-none"
                        />
                    </Field>
                </div>
            </SideFormSheet>

            {/* Decision Details Side Form */}
            <SideFormSheet
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                title={activeLog ? `Decision: ${activeLog.lead}` : "Decision Details"}
                description="Complete trace for this routing decision."
                icon={<Info className="h-5 w-5" />}
                accentColor="#4f46e5"
                hideFooter
                width="md"
            >
                {activeLog && (
                    <div className="space-y-4 text-[13px]">
                        {[
                            ["Lead", activeLog.lead],
                            ["Rule Matched", activeLog.ruleMatched],
                            ["Method Used", activeLog.methodUsed],
                            ["Assigned To", activeLog.assignedTo],
                            ["Status", activeLog.status],
                            ["Decision Latency", activeLog.latency],
                            ["Type", activeLog.type],
                            ["Timestamp", activeLog.timestamp],
                        ].map(([label, val]) => (
                            <div key={label} className="flex justify-between items-center p-3 border border-slate-100 bg-slate-50/50">
                                <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">{label}</span>
                                <span className="text-[13px] font-semibold text-slate-900">{val}</span>
                            </div>
                        ))}
                    </div>
                )}
            </SideFormSheet>
        </div>
    )
}
