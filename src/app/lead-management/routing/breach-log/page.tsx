"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    ShieldAlert,
    Search,
    Filter,
    Download,
    ChevronLeft,
    AlertCircle,
    User,
    ArrowUpRight,
    MoreHorizontal,
    RefreshCw,
    MessageSquare,
    Zap,
    Scale,
    Calendar,
    X,
    Eye,
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/shared/components/ui/dropdown-menu"
import { Progress } from "@/shared/components/ui/progress"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"

type Log = {
    id: string
    lead: string
    policy: string
    owner: string
    delay: string
    timestamp: string
    severity: "Critical" | "High" | "Moderate" | "Low"
    reason: string
    action: string
}

const INITIAL_LOGS: Log[] = [
    { id: "1", lead: "Aarav Mehta", policy: "Enterprise First Response", owner: "Sarah Jenkins", delay: "42 min", timestamp: "1 hour ago", severity: "Critical", reason: "Rep Busy", action: "Auto-Reassigned" },
    { id: "2", lead: "Emma Wilson", policy: "High Intent Follow-up", owner: "Michael Chen", delay: "3.5 hours", timestamp: "3 hours ago", severity: "High", reason: "Offline / OOO", action: "Notified Manager" },
    { id: "3", lead: "James Anderson", policy: "Standard Inbound", owner: "Unassigned", delay: "1.2 hours", timestamp: "5 hours ago", severity: "Moderate", reason: "Queue Congestion", action: "Returned to Pool" },
    { id: "4", lead: "Sarah Jenkins", policy: "Trial Conversion Speed", owner: "James K.", delay: "14 min", timestamp: "Yesterday", severity: "Low", reason: "Missed Notification", action: "Re-Notified Rep" },
    { id: "5", lead: "Michael Chen", policy: "Enterprise First Response", owner: "Aarav Mehta", delay: "1.8 hours", timestamp: "Yesterday", severity: "Critical", reason: "No Activity", action: "Escalated to L2" },
]

const SEVERITIES = ["Critical", "High", "Moderate", "Low"]
const POLICIES = ["Enterprise First Response", "High Intent Follow-up", "Standard Inbound", "Trial Conversion Speed"]

type DateForm = { from: string; to: string }
type DateErrors = Partial<Record<keyof DateForm, string>>

export default function BreachLogPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [logs, setLogs] = useState<Log[]>(INITIAL_LOGS)
    const [searchTerm, setSearchTerm] = useState("")
    const [severityFilter, setSeverityFilter] = useState<string>("all")
    const [policyFilter, setPolicyFilter] = useState<string>("all")

    const [detailsOpen, setDetailsOpen] = useState(false)
    const [activeLog, setActiveLog] = useState<Log | null>(null)

    const [dateOpen, setDateOpen] = useState(false)
    const [dateForm, setDateForm] = useState<DateForm>({ from: "", to: "" })
    const [dateErrors, setDateErrors] = useState<DateErrors>({})

    const [dismissOpen, setDismissOpen] = useState(false)
    const [dismissingId, setDismissingId] = useState<string | null>(null)

    useEffect(() => { setIsClient(true) }, [])

    const validateDate = (s: DateForm): DateErrors => {
        const e: DateErrors = {}
        if (!s.from.trim()) e.from = "From date is required"
        if (!s.to.trim()) e.to = "To date is required"
        if (s.from && s.to && new Date(s.from) > new Date(s.to)) e.to = "End date must be after start"
        return e
    }

    const submitDate = (e: React.FormEvent) => {
        e.preventDefault()
        const v = validateDate(dateForm)
        setDateErrors(v)
        if (Object.keys(v).length > 0) {
            toast({ title: "Validation failed", description: "Please correct the dates.", variant: "destructive" })
            return
        }
        toast({ title: "Range applied", description: `Showing breaches from ${dateForm.from} to ${dateForm.to}.` })
        setDateOpen(false)
    }

    const exportCSV = () => {
        const csv = ["Lead,Policy,Owner,Delay,Severity,Reason,Action,Timestamp", ...logs.map(l =>
            `"${l.lead}","${l.policy}","${l.owner}","${l.delay}","${l.severity}","${l.reason}","${l.action}","${l.timestamp}"`
        )].join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url; a.download = "breach-log.csv"; a.click()
        URL.revokeObjectURL(url)
        toast({ title: "CSV exported", description: "Breach log downloaded." })
    }

    const askDismiss = (id: string) => { setDismissingId(id); setDismissOpen(true) }
    const confirmDismiss = () => {
        if (dismissingId) {
            setLogs(logs.filter(l => l.id !== dismissingId))
            toast({ title: "Log dismissed", description: "Entry removed from view." })
        }
        setDismissOpen(false); setDismissingId(null)
    }

    const openDetails = (log: Log) => { setActiveLog(log); setDetailsOpen(true) }

    const filtered = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        return logs.filter(l => {
            if (term && !l.lead.toLowerCase().includes(term) && !l.policy.toLowerCase().includes(term) && !l.owner.toLowerCase().includes(term)) return false
            if (severityFilter !== "all" && l.severity !== severityFilter) return false
            if (policyFilter !== "all" && l.policy !== policyFilter) return false
            return true
        })
    }, [logs, searchTerm, severityFilter, policyFilter])

    const clearFilters = () => { setSearchTerm(""); setSeverityFilter("all"); setPolicyFilter("all") }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500" style={{ zoom: 0.9 }}>

            {/* Header (light bg) */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-rose-50 p-6 rounded-none border border-rose-100 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold uppercase tracking-widest text-slate-500 hover:text-rose-700"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-rose-100 text-rose-700 border border-rose-200 shadow-sm">
                                <ShieldAlert className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                SLA Breach Audit Log
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            A historical audit of every service level failure. Use this data to identify training needs, process bottlenecks, or capacity gaps.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setDateOpen(true)}
                        className="h-10 border-rose-200 bg-white shadow-sm text-slate-700 font-semibold text-[12px] px-5 rounded-none"
                    >
                        <Calendar className="h-4 w-4 mr-2 text-rose-500" /> Filter by Date
                    </Button>
                    <Button onClick={exportCSV} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none rounded-none">
                        <Download className="h-4 w-4 mr-2" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Audit List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 bg-slate-50/50 p-2 rounded-none border border-slate-100/50 shadow-sm flex-wrap">
                    <div className="relative flex-1 lg:max-w-[400px]">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search by lead, policy or owner..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-10 border-slate-100 bg-white text-[13px] rounded-none focus-visible:ring-rose-500"
                        />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Select value={severityFilter} onValueChange={setSeverityFilter}>
                            <SelectTrigger className="h-10 w-[150px] border-slate-100 bg-white text-[12px] font-semibold rounded-none">
                                <Filter className="h-3.5 w-3.5 mr-1 text-slate-400" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                                <SelectItem value="all">All Severity</SelectItem>
                                {SEVERITIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={policyFilter} onValueChange={setPolicyFilter}>
                            <SelectTrigger className="h-10 w-[200px] border-slate-100 bg-white text-[12px] font-semibold rounded-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                                <SelectItem value="all">All Policies</SelectItem>
                                {POLICIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {(searchTerm || severityFilter !== "all" || policyFilter !== "all") && (
                            <Button variant="ghost" onClick={clearFilters} className="h-10 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 px-3 rounded-none">
                                <X className="h-3.5 w-3.5 mr-1" /> Clear
                            </Button>
                        )}
                        <Button variant="outline" onClick={clearFilters} className="h-10 border-slate-100 bg-white font-semibold text-[12px] px-4 rounded-none">
                            <RefreshCw className="h-3.5 w-3.5 mr-2 text-slate-400" /> Reset
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    {filtered.length === 0 ? (
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white">
                            <CardContent className="p-10 text-center">
                                <Filter className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                                <p className="text-[14px] font-semibold text-slate-700">No breaches match your filters</p>
                                <Button variant="outline" onClick={clearFilters} className="mt-4 h-9 rounded-none">Clear filters</Button>
                            </CardContent>
                        </Card>
                    ) : filtered.map((log) => (
                        <Card key={log.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white group hover:ring-rose-100 transition-all overflow-hidden border-l-4 border-l-transparent hover:border-l-rose-500">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row md:items-center">
                                    <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="flex items-center gap-4 min-w-[280px]">
                                            <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                                                <AlertCircle size={20} />
                                            </div>
                                            <div className="space-y-1 min-w-0">
                                                <h4 className="text-[14px] font-semibold text-slate-900 truncate">{log.lead}</h4>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Badge variant="outline" className="h-4.5 border-slate-100 bg-slate-50 text-[8px] font-semibold text-slate-500 uppercase tracking-widest px-1">{log.policy}</Badge>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="text-[11px] font-semibold text-slate-500">{log.timestamp}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center gap-1 min-w-[120px]">
                                            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest leading-none">Total Delay</span>
                                            <span className="text-[16px] font-semibold text-rose-600 tabular-nums">{log.delay}</span>
                                        </div>

                                        <div className="flex-1 space-y-2 min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-100/50 px-2 py-1 rounded">
                                                    <User size={12} /> {log.owner}
                                                </div>
                                                <div className="flex items-center gap-2 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-100/50 px-2 py-1 rounded">
                                                    <MessageSquare size={12} /> {log.reason}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 min-w-[220px] justify-end">
                                            <div className="text-right flex flex-col items-end gap-1.5">
                                                <Badge className={`border-none font-semibold tracking-wider text-[9px] h-5 px-2 uppercase shadow-sm ${log.severity === 'Critical' ? 'bg-rose-500 text-white' : log.severity === 'High' ? 'bg-amber-100 text-amber-700' : log.severity === 'Moderate' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{log.severity}</Badge>
                                                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                                                    <Zap size={10} className={log.action === "Escalated to L2" ? "text-amber-500" : ""} /> {log.action}
                                                </span>
                                            </div>
                                            <div className="w-px h-10 bg-slate-100" />
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-900 rounded-md">
                                                        <MoreHorizontal size={18} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 p-1 rounded-none shadow-xl border-slate-100">
                                                    <DropdownMenuItem onClick={() => openDetails(log)} className="text-[12px] font-medium py-2.5">
                                                        <Eye className="h-3.5 w-3.5 mr-2 text-indigo-500" /> Lead Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => toast({ description: "Re-assigning SLA parameters..." })} className="text-[12px] font-medium py-2.5">
                                                        Edit Owner SLA
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => toast({ description: "Training module queued for agent." })} className="text-[12px] font-medium py-2.5">
                                                        Assign Training
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => askDismiss(log.id)} className="text-[12px] font-semibold py-2.5 text-rose-500">
                                                        Dismiss Log
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Audit Trends Side - colored fills */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                    <Card className="border border-rose-100 shadow-sm rounded-none bg-rose-50 p-6 transition-all hover:ring-1 hover:ring-rose-200">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[12px] font-semibold text-rose-700 uppercase tracking-widest">
                                Repeat Breachers
                                <ArrowUpRight size={14} className="text-rose-500" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[16px] font-semibold text-slate-900 leading-none">Sarah Jenkins</h4>
                                <p className="text-[11px] text-slate-600 font-medium">14 breaches in last 7 days.</p>
                            </div>
                            <div className="pt-2">
                                <div className="flex justify-between items-center text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-1.5">
                                    <span>Compliance Impact</span>
                                    <span className="text-slate-700">Significant</span>
                                </div>
                                <Progress value={32} className="h-1.5 bg-white [&>div]:bg-rose-500" />
                            </div>
                        </div>
                    </Card>

                    <Card className="border border-amber-100 shadow-sm rounded-none bg-amber-50 p-6 transition-all hover:ring-1 hover:ring-amber-200">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[12px] font-semibold text-amber-700 uppercase tracking-widest">
                                Top Breach Reason
                                <Scale size={14} className="text-amber-500" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[16px] font-semibold text-slate-900 leading-none">Queue Congestion</h4>
                                <p className="text-[11px] text-slate-600 font-medium">42% of all L1 breaches.</p>
                            </div>
                            <div className="pt-2">
                                <div className="flex justify-between items-center text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-1.5">
                                    <span>Bottleneck Risk</span>
                                    <span className="text-slate-700">Critical</span>
                                </div>
                                <div className="flex gap-1 h-1.5">
                                    {[1, 1, 1, 1, 1, 1, 0, 0, 0, 0].map((v, i) => (
                                        <div key={i} className={`flex-1 rounded-full ${v === 1 ? 'bg-amber-500' : 'bg-white'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="border border-indigo-100 shadow-sm rounded-none bg-indigo-50 text-indigo-900 p-6 relative overflow-hidden group">
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center text-[10px] font-semibold text-indigo-600 uppercase tracking-widest">
                                Discipline Hub
                                <Zap size={14} className="text-indigo-500 fill-indigo-500" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[16px] font-semibold leading-none">Automated Coaching</h4>
                                <p className="text-[11px] text-indigo-700 font-medium">5 reps flagged for SLA training.</p>
                            </div>
                            <Button onClick={() => toast({ title: "AI plan view", description: "Loading automated remediation suggestions..." })} className="w-full h-9 bg-white border border-indigo-100 text-indigo-600 hover:bg-slate-50 font-semibold text-[11px] uppercase tracking-wider rounded-none">
                                Review Coaching Plans
                            </Button>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform translate-x-4 text-indigo-600">
                            <ShieldAlert size={120} />
                        </div>
                    </Card>
                </div>
            </div>

            {/* Date filter side form */}
            <SideFormSheet
                open={dateOpen}
                onOpenChange={setDateOpen}
                title="Filter by Date Range"
                description="Show breach entries within a specific window."
                icon={<Calendar className="h-5 w-5" />}
                accentColor="#e11d48"
                onSubmit={submitDate}
                submitLabel="Apply Range"
                width="sm"
            >
                <div className="space-y-5">
                    <Field label="From Date" required error={dateErrors.from}>
                        <Input
                            type="date"
                            name="from"
                            value={dateForm.from}
                            onChange={(e) => setDateForm({ ...dateForm, from: e.target.value })}
                            className="h-10 rounded-none"
                        />
                    </Field>

                    <Field label="To Date" required error={dateErrors.to}>
                        <Input
                            type="date"
                            name="to"
                            value={dateForm.to}
                            onChange={(e) => setDateForm({ ...dateForm, to: e.target.value })}
                            className="h-10 rounded-none"
                        />
                    </Field>
                </div>
            </SideFormSheet>

            {/* Details side form (read-only-ish) */}
            <SideFormSheet
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                title={activeLog ? `Breach: ${activeLog.lead}` : "Breach Details"}
                description="Full audit trace of this breach event."
                icon={<AlertCircle className="h-5 w-5" />}
                accentColor="#e11d48"
                hideFooter
                width="md"
            >
                {activeLog && (
                    <div className="space-y-4 text-[13px]">
                        {[
                            ["Lead", activeLog.lead],
                            ["Policy", activeLog.policy],
                            ["Owner", activeLog.owner],
                            ["Delay", activeLog.delay],
                            ["Severity", activeLog.severity],
                            ["Reason", activeLog.reason],
                            ["Action Taken", activeLog.action],
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

            <AlertDialog open={dismissOpen} onOpenChange={setDismissOpen}>
                <AlertDialogContent className="rounded-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Dismiss this entry?</AlertDialogTitle>
                        <AlertDialogDescription>
                            The breach record will be hidden from the audit log view. The underlying compliance event still exists in your historical audit.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDismiss} className="bg-rose-600 hover:bg-rose-700 rounded-none">
                            Dismiss
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
