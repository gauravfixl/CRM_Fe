"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    History,
    Search,
    Filter,
    ChevronLeft,
    Zap,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    Calendar,
    Table,
    Activity,
    Info,
    LayoutGrid,
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Input } from "@/shared/components/ui/input"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { Progress } from "@/shared/components/ui/progress"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"

const AUDIT_LOGS = [
    {
        id: "1",
        lead: "Aarav Mehta",
        delta: +25,
        newScore: 78,
        reason: "Job Title Match: Chief Technology Officer",
        trigger: "Profile Enrichment",
        timestamp: "2 mins ago",
        ruleType: "Persona",
        impact: "MQL Threshold Reached"
    },
    {
        id: "2",
        lead: "Emma Wilson",
        delta: +15,
        newScore: 52,
        reason: "Pricing Page Visit (3 mins duration)",
        trigger: "Behavioral Tracking",
        timestamp: "15 mins ago",
        ruleType: "Engagement",
        impact: ""
    },
    {
        id: "3",
        lead: "James Anderson",
        delta: -5,
        newScore: 42,
        reason: "Inactivity Decay (7 days)",
        trigger: "System Automation",
        timestamp: "1 hour ago",
        ruleType: "Decay",
        impact: "SLA Warning"
    },
    {
        id: "4",
        lead: "Michael Chen",
        delta: +20,
        newScore: 92,
        reason: "Whitepaper Download: Q1 Roadmap",
        trigger: "Content Download",
        timestamp: "3 hours ago",
        ruleType: "Intent",
        impact: "SQL Threshold Reached"
    },
    {
        id: "5",
        lead: "Sarah Jenkins",
        delta: -50,
        newScore: 22,
        reason: "Manual Adjustment by Admin",
        trigger: "Human Overwrite",
        timestamp: "Yesterday",
        ruleType: "Correction",
        impact: "Disqualified"
    },
]

type LogEntry = typeof AUDIT_LOGS[number]

export default function ScoreHistoryPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")
    const [dateRange, setDateRange] = useState({ from: "", to: "" })
    const [isDateOpen, setIsDateOpen] = useState(false)
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
    const [errors, setErrors] = useState<{ from?: string; to?: string }>({})

    useEffect(() => {
        setIsClient(true)
    }, [])

    const filteredLogs = useMemo(() => {
        return AUDIT_LOGS.filter(l => {
            const term = searchTerm.toLowerCase()
            const matchSearch = !term ||
                l.lead.toLowerCase().includes(term) ||
                l.reason.toLowerCase().includes(term) ||
                l.ruleType.toLowerCase().includes(term) ||
                l.trigger.toLowerCase().includes(term)
            const matchType = typeFilter === "all" || l.ruleType === typeFilter
            return matchSearch && matchType
        })
    }, [searchTerm, typeFilter])

    const handleExport = () => {
        const rows = [
            ["Lead", "Delta", "New Score", "Reason", "Trigger", "Rule Type", "Impact", "Timestamp"],
            ...filteredLogs.map(l => [l.lead, l.delta.toString(), l.newScore.toString(), l.reason, l.trigger, l.ruleType, l.impact, l.timestamp])
        ]
        const csv = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `score-audit-${Date.now()}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Audit Exported", description: `${filteredLogs.length} entries downloaded.` })
    }

    const validateDateRange = (): boolean => {
        const e: { from?: string; to?: string } = {}
        if (!dateRange.from) e.from = "Start date is required"
        if (!dateRange.to) e.to = "End date is required"
        if (dateRange.from && dateRange.to && new Date(dateRange.from) > new Date(dateRange.to)) {
            e.to = "End date must be after start date"
        }
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleApplyDateRange = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!validateDateRange()) return
        toast({ title: "Date range applied", description: `Showing entries between ${dateRange.from} and ${dateRange.to}.` })
        setIsDateOpen(false)
    }

    if (!isClient) return null

    return (
        <div style={{ zoom: 0.9 }} className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header — colorful light fill */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-slate-100 p-6 border border-slate-200 shadow-sm">
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
                            <div className="p-2 rounded-lg bg-slate-900 text-white shadow-lg shadow-slate-200">
                                <History className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Score History & Audit
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            Full transparency into lead quality changes. Track automated rule triggers, manual adjustments, and lifecycle movements.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setIsDateOpen(true)}
                        className="h-10 border-slate-200 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5"
                    >
                        <Calendar className="h-4 w-4 mr-2 text-slate-400" /> Date Range
                    </Button>
                    <Button
                        onClick={handleExport}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none"
                    >
                        <ArrowUpRight className="h-4 w-4 mr-2" /> Export Audit
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Audit Feed */}
                <div className="lg:col-span-12 space-y-4">
                    <div className="flex items-center justify-between gap-4 bg-slate-50/50 p-2 border border-slate-100/50 shadow-sm">
                        <div className="relative flex-1 lg:max-w-[500px]">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by lead name, rule or reason..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 h-10 border-slate-100 bg-white text-[13px] rounded-lg focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="h-10 w-[160px] border-slate-100 bg-white font-semibold text-[12px] rounded-lg">
                                    <Filter className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="Persona">Persona</SelectItem>
                                    <SelectItem value="Engagement">Engagement</SelectItem>
                                    <SelectItem value="Decay">Decay</SelectItem>
                                    <SelectItem value="Intent">Intent</SelectItem>
                                    <SelectItem value="Correction">Correction</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {filteredLogs.length === 0 ? (
                            <div className="p-10 border-2 border-dashed border-slate-200 text-center bg-white">
                                <p className="text-[13px] font-semibold text-slate-400">No audit entries match your filters.</p>
                            </div>
                        ) : filteredLogs.map((log) => (
                            <Card key={log.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white group hover:ring-indigo-100 transition-all overflow-hidden border-l-4 border-l-transparent hover:border-l-indigo-500">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            {/* Lead Info */}
                                            <div className="flex items-center gap-4 min-w-[240px]">
                                                <Avatar className="h-9 w-9 ring-2 ring-slate-100">
                                                    <AvatarFallback className="bg-slate-100 text-slate-500 text-[10px] font-semibold uppercase">
                                                        {log.lead.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-0.5 min-w-0">
                                                    <h4 className="text-[14px] font-semibold text-slate-900 leading-none truncate">{log.lead}</h4>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[11px] font-semibold text-slate-400 tracking-tight">{log.timestamp}</span>
                                                        <span className="text-slate-200">•</span>
                                                        <Badge variant="outline" className="h-4 border-slate-100 text-[8px] font-semibold text-slate-400 px-1 uppercase">{log.trigger}</Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Change Reason */}
                                            <div className="flex-1 space-y-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[13px] font-semibold text-slate-600 line-clamp-1 flex-1">{log.reason}</p>
                                                    {log.impact && <Badge className="bg-amber-50 text-amber-600 border-none font-semibold text-[9px] h-4.5 px-2 uppercase shadow-sm shadow-amber-100/20">{log.impact}</Badge>}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge className="bg-slate-50 text-slate-400 hover:bg-slate-100 border-none font-semibold text-[9px] h-4.5 px-1.5 uppercase tracking-wide">Rule: {log.ruleType}</Badge>
                                                </div>
                                            </div>

                                            {/* Impact Scoring */}
                                            <div className="flex items-center gap-10 min-w-[180px] justify-end">
                                                <div className="text-right">
                                                    <span className="text-[9px] font-semibold text-slate-400 tracking-widest leading-none">Change</span>
                                                    <div className={`flex items-center justify-end gap-1.5 mt-0.5 ${log.delta > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        {log.delta > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                        <span className="text-[18px] font-semibold tracking-tighter tabular-nums">{log.delta > 0 ? '+' : ''}{log.delta}</span>
                                                    </div>
                                                </div>
                                                <div className="w-px h-10 bg-slate-50" />
                                                <div className="text-right">
                                                    <span className="text-[9px] font-semibold text-slate-400 tracking-widest leading-none">New Score</span>
                                                    <h4 className="text-[20px] font-semibold text-slate-900 tabular-nums leading-none mt-1">{log.newScore}</h4>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setSelectedLog(log)}
                                                    className="h-9 w-9 text-slate-300 hover:text-slate-900 rounded-lg"
                                                >
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

                {/* Audit Trends Side */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                    <Card className="border-none shadow-sm ring-1 ring-emerald-100 rounded-none bg-emerald-50 p-6 transition-all">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[12px] font-semibold text-slate-500 uppercase tracking-widest">
                                Top Scoring Rule
                                <ArrowUpRight size={14} className="text-indigo-400" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[16px] font-semibold text-slate-900 leading-none">Profile Enrichment</h4>
                                <p className="text-[11px] text-slate-600 font-medium">Triggered 424 times today.</p>
                            </div>
                            <div className="pt-2">
                                <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500 tracking-wider mb-1.5">
                                    <span>Avg. Impact</span>
                                    <span>+18.4 pts</span>
                                </div>
                                <Progress value={78} className="h-1.5 bg-white" />
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-blue-100 rounded-none bg-blue-50 p-6 transition-all">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[12px] font-semibold text-slate-500 uppercase tracking-widest">
                                Threshold Velocity
                                <Activity size={14} className="text-emerald-400" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[16px] font-semibold text-slate-900 leading-none">84.2% Consistency</h4>
                                <p className="text-[11px] text-slate-600 font-medium">Leads hitting MQL within 4.1 days.</p>
                            </div>
                            <div className="pt-2">
                                <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500 tracking-wider mb-1.5">
                                    <span>Model Alignment</span>
                                    <span>High</span>
                                </div>
                                <div className="flex gap-1 h-1.5">
                                    {[1, 1, 1, 1, 1, 1, 1, 1, 0, 0].map((v, i) => (
                                        <div key={i} className={`flex-1 rounded-full ${v === 1 ? 'bg-emerald-500' : 'bg-white'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-indigo-100 rounded-none bg-indigo-50 text-slate-900 p-6 relative overflow-hidden group">
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center text-[10px] font-semibold text-indigo-400 uppercase tracking-widest">
                                Governance Hub
                                <Zap size={14} className="text-amber-400 fill-amber-400" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[16px] font-semibold leading-none text-indigo-600">Manual Overwrites</h4>
                                <p className="text-[12px] text-slate-600 font-semibold">12 adjustments requiring review.</p>
                            </div>
                            <Button
                                onClick={() => toast({ title: "Conflict Review", description: "Opening 12 manual override entries..." })}
                                className="w-full h-9 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold text-[11px] rounded-lg border-none"
                            >
                                Review Score Conflicts
                            </Button>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-200 -translate-y-4">
                            <Table size={120} />
                        </div>
                    </Card>
                </div>

            </div>

            {/* Date Range side-drawer */}
            <SideFormSheet
                open={isDateOpen}
                onOpenChange={(o) => { setIsDateOpen(o); if (!o) setErrors({}) }}
                title="Filter by Date Range"
                description="Limit audit entries to a specific time window."
                icon={<Calendar size={18} />}
                onSubmit={handleApplyDateRange}
                submitLabel="Apply Range"
                accentColor="#4f46e5"
            >
                <div className="space-y-5">
                    <Field label="Start Date" required error={errors.from}>
                        <Input
                            type="date"
                            value={dateRange.from}
                            onChange={e => { setDateRange({ ...dateRange, from: e.target.value }); if (errors.from) setErrors({ ...errors, from: undefined }) }}
                            className="h-11 rounded-lg"
                        />
                    </Field>
                    <Field label="End Date" required error={errors.to}>
                        <Input
                            type="date"
                            value={dateRange.to}
                            onChange={e => { setDateRange({ ...dateRange, to: e.target.value }); if (errors.to) setErrors({ ...errors, to: undefined }) }}
                            className="h-11 rounded-lg"
                        />
                    </Field>
                </div>
            </SideFormSheet>

            {/* Log Detail side-drawer */}
            <SideFormSheet
                open={!!selectedLog}
                onOpenChange={(o) => { if (!o) setSelectedLog(null) }}
                title={selectedLog?.lead || ""}
                description="Score change details"
                icon={<Info size={18} />}
                hideFooter
                accentColor="#4f46e5"
            >
                {selectedLog && (
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-slate-50 border border-slate-100 space-y-1">
                                <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Score Change</p>
                                <p className={`text-[20px] font-semibold tabular-nums ${selectedLog.delta > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{selectedLog.delta > 0 ? '+' : ''}{selectedLog.delta}</p>
                            </div>
                            <div className="p-4 bg-slate-50 border border-slate-100 space-y-1">
                                <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">New Score</p>
                                <p className="text-[20px] font-semibold tabular-nums text-slate-900">{selectedLog.newScore}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Reason</p>
                            <p className="text-[13px] font-medium text-slate-700">{selectedLog.reason}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Trigger Source</p>
                            <Badge variant="outline" className="text-[10px]">{selectedLog.trigger}</Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Rule Type</p>
                            <Badge className="bg-slate-100 text-slate-600 border-none">{selectedLog.ruleType}</Badge>
                        </div>
                        {selectedLog.impact && (
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Impact</p>
                                <Badge className="bg-amber-50 text-amber-700 border-none">{selectedLog.impact}</Badge>
                            </div>
                        )}
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Timestamp</p>
                            <p className="text-[12px] font-semibold text-slate-600">{selectedLog.timestamp}</p>
                        </div>
                    </div>
                )}
            </SideFormSheet>

        </div>
    )
}
