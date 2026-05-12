"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Calendar,
    Clock,
    Mail,
    ChevronLeft,
    Plus,
    Download,
    Filter,
    ArrowUpRight,
    TrendingUp,
    CheckCircle2,
    XCircle,
    UserCheck,
    Briefcase,
    Search,
    RefreshCw,
    Share2,
    FileText,
    Settings2,
    Play,
    Bell,
    Layers,
    Scale,
    Trash2,
    MoreVertical,
    PenLine,
    X
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Switch } from "@/shared/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"

interface Schedule {
    id: string
    name: string
    report: string
    frequency: string
    format: string
    recipients: number
    lastSent: string
    status: string
    email?: string
}

const INITIAL_SCHEDULES: Schedule[] = [
    { id: "1", name: "Weekly CEO Summary", report: "Executive Dashboard", frequency: "Weekly", format: "PDF", recipients: 4, lastSent: "Today, 8:00 AM", status: "success", email: "ceo@example.com" },
    { id: "2", name: "Daily Sales Activity Audit", report: "Activity Productivity", frequency: "Daily", format: "Excel", recipients: 12, lastSent: "Yesterday, 6:00 PM", status: "success", email: "sales@example.com" },
    { id: "3", name: "Monthly Attribution ROI", report: "Source Performance", frequency: "Monthly", format: "PDF", recipients: 2, lastSent: "Feb 1st, 9:00 AM", status: "success", email: "marketing@example.com" },
    { id: "4", name: "Critical Bottleneck Alert", report: "Aging Analysis", frequency: "Triggered", format: "Link", recipients: 1, lastSent: "2h ago", status: "failed", email: "ops@example.com" },
]

const REPORT_OPTIONS = ["Executive Dashboard", "Activity Productivity", "Source Performance", "Aging Analysis", "SLA Compliance", "Qualification Index", "Custom Selection"]
const FREQUENCY_OPTIONS = ["Daily", "Weekly", "Monthly", "Triggered"]
const FORMAT_OPTIONS = ["PDF", "Excel", "CSV", "Link"]
const STATUS_OPTIONS = ["all", "success", "failed"]

export default function ScheduledReportsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [schedules, setSchedules] = useState<Schedule[]>(INITIAL_SCHEDULES)

    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<Schedule | null>(null)
    const [name, setName] = useState("")
    const [report, setReport] = useState("Executive Dashboard")
    const [frequency, setFrequency] = useState("Daily")
    const [format, setFormat] = useState("PDF")
    const [recipients, setRecipients] = useState("")
    const [email, setEmail] = useState("")
    const [errors, setErrors] = useState<{ name?: string; report?: string; frequency?: string; format?: string; recipients?: string; email?: string }>({})

    const [showFilterForm, setShowFilterForm] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterFreq, setFilterFreq] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")
    const [appliedFilter, setAppliedFilter] = useState<{ freq: string; status: string }>({ freq: "all", status: "all" })

    useEffect(() => {
        setIsClient(true)
    }, [])

    const filteredSchedules = useMemo(() => {
        return schedules.filter(s =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (appliedFilter.freq === "all" || s.frequency === appliedFilter.freq) &&
            (appliedFilter.status === "all" || s.status === appliedFilter.status)
        )
    }, [schedules, searchQuery, appliedFilter])

    const handleRunNow = (s: Schedule) => {
        toast({ title: "Manual Trigger Initiated", description: `Sending "${s.name}" to all recipients now...` })
    }

    const handleDelete = (id: string) => {
        setSchedules(schedules.filter(s => s.id !== id))
        toast({ title: "Schedule Deleted", description: "Automated delivery for this report has been stopped." })
    }

    const handleOpenCreate = () => {
        setEditing(null)
        setName("")
        setReport("Executive Dashboard")
        setFrequency("Daily")
        setFormat("PDF")
        setRecipients("")
        setEmail("")
        setErrors({})
        setShowForm(true)
    }

    const handleOpenEdit = (s: Schedule) => {
        setEditing(s)
        setName(s.name)
        setReport(s.report)
        setFrequency(s.frequency)
        setFormat(s.format)
        setRecipients(String(s.recipients))
        setEmail(s.email || "")
        setErrors({})
        setShowForm(true)
    }

    const handleSubmit = () => {
        const newErrors: typeof errors = {}
        if (!name.trim()) newErrors.name = "Schedule name is required"
        else if (name.trim().length < 3) newErrors.name = "Name must be at least 3 characters"
        else if (name.trim().length > 60) newErrors.name = "Name must be under 60 characters"
        if (!report) newErrors.report = "Report is required"
        if (!frequency) newErrors.frequency = "Frequency is required"
        if (!format) newErrors.format = "Format is required"
        if (!recipients.trim()) newErrors.recipients = "Recipient count is required"
        else if (!/^\d+$/.test(recipients) || parseInt(recipients) < 1) newErrors.recipients = "Must be a positive integer"
        if (!email.trim()) newErrors.email = "Distribution email is required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Enter a valid email address"

        if (Object.keys(newErrors).length) {
            setErrors(newErrors)
            return
        }
        setErrors({})

        if (editing) {
            setSchedules(schedules.map(s => s.id === editing.id ? {
                ...s,
                name: name.trim(),
                report,
                frequency,
                format,
                recipients: parseInt(recipients),
                email
            } : s))
            toast({ title: "Schedule Updated", description: `"${name}" has been updated.` })
        } else {
            const newSchedule: Schedule = {
                id: `sch-${Date.now()}`,
                name: name.trim(),
                report,
                frequency,
                format,
                recipients: parseInt(recipients),
                email,
                lastSent: "Pending",
                status: "success"
            }
            setSchedules([newSchedule, ...schedules])
            toast({ title: "Schedule Created", description: "Report queued for automated delivery." })
        }
        setShowForm(false)
    }

    const handleApplyFilter = () => {
        setAppliedFilter({ freq: filterFreq, status: filterStatus })
        toast({ title: "Filter Applied", description: "Schedule list has been filtered." })
        setShowFilterForm(false)
    }

    const handleClearFilter = () => {
        setAppliedFilter({ freq: "all", status: "all" })
        setFilterFreq("all")
        setFilterStatus("all")
        toast({ title: "Filters Cleared" })
    }

    if (!isClient) return null

    return (
        <div style={{ zoom: 0.9 }}>
            <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-amber-50 p-6 rounded-none border border-amber-100 shadow-sm">
                    <div className="space-y-3">
                        <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-2 h-7 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-amber-600">
                            <ChevronLeft className="h-3 w-3 mr-1" /> Back
                        </Button>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-white text-amber-600 border border-amber-100 shadow-sm">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                    Scheduled Report Delivery
                                </h1>
                            </div>
                            <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                                Automate your business intelligence. Schedule reports to be delivered directly to your team's inbox in PDF, Excel, or live link formats.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => toast({ title: "Recipients Synced", description: "All distribution lists updated from directory." })} className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-bold text-[12px] px-5">
                            <RefreshCw className="h-4 w-4 mr-2 text-slate-400" /> Sync Recipients
                        </Button>
                        <Button onClick={handleOpenCreate} className="h-10 bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 shadow-amber-100 shadow-lg border-none">
                            <Plus className="h-4 w-4 mr-2" /> Create Schedule
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Top Stats */}
                    <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: "Active Schedules", val: `${schedules.length} Logs`, icon: Calendar, color: "text-indigo-600", bg: "bg-indigo-50" },
                            { label: "Total Recipients", val: `${schedules.reduce((a, s) => a + s.recipients, 0)} Users`, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
                            { label: "Daily Volume", val: `${schedules.filter(s => s.frequency === "Daily").length} reports/day`, icon: RefreshCw, color: "text-cyan-600", bg: "bg-cyan-50" },
                        ].map((s, i) => (
                            <Card key={i} className={`border-none shadow-sm ring-1 ring-slate-100 rounded-none ${s.bg} overflow-hidden p-6 flex flex-col justify-between`}>
                                <div className="flex items-center justify-between h-fit">
                                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
                                    <div className={`p-2 rounded-lg bg-white ${s.color}`}>
                                        <s.icon size={18} />
                                    </div>
                                </div>
                                <h4 className="text-[24px] font-black text-slate-900 mt-4">{s.val}</h4>
                            </Card>
                        ))}
                    </div>

                    {/* Schedules List */}
                    <Card className="lg:col-span-12 border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden p-8">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                            <div className="space-y-1">
                                <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Active Reporting Schedulers</h3>
                                <p className="text-[13px] text-slate-500 font-medium">
                                    Monitoring automated delivery cadence and execution status.
                                    {(appliedFilter.freq !== "all" || appliedFilter.status !== "all") && (
                                        <span className="ml-2 text-amber-600">[Filter active]</span>
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                                    <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search schedules..." className="pl-9 h-9 w-56 text-[12px]" />
                                </div>
                                {(appliedFilter.freq !== "all" || appliedFilter.status !== "all") && (
                                    <Button onClick={handleClearFilter} variant="outline" size="sm" className="h-9 text-[10px] font-bold uppercase">Clear</Button>
                                )}
                                <Button onClick={() => setShowFilterForm(true)} variant="outline" size="sm" className="h-9 border-slate-100">
                                    <Filter className="h-4 w-4 mr-2 text-slate-400" /> Filter
                                </Button>
                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] px-2 h-5 uppercase tracking-wider">Engine: Healthy</Badge>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredSchedules.length === 0 ? (
                                <div className="text-center py-12 text-[13px] text-slate-400 font-medium">No schedules match your search or filter.</div>
                            ) : filteredSchedules.map((s) => (
                                <Card key={s.id} className="border-none shadow-none ring-1 ring-slate-100 rounded-none bg-slate-50/20 group hover:bg-white hover:ring-amber-100 transition-all cursor-default">
                                    <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="flex items-center gap-5 min-w-[300px]">
                                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black ${s.status === 'success' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                                <FileText size={24} />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-[15px] font-black text-slate-900 group-hover:text-amber-600 transition-colors uppercase tracking-tight">{s.name}</h4>
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline" className="text-[9px] font-black uppercase border-slate-100 text-slate-400 px-1.5 h-4.5">{s.format}</Badge>
                                                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1"><Clock size={12} /> {s.frequency}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center min-w-[150px] space-y-1">
                                            <p className="text-[10px] font-black text-slate-300 uppercase">Recipients</p>
                                            <div className="flex items-center gap-1">
                                                <UserCheck size={14} className="text-slate-400" />
                                                <h4 className="text-[14px] font-black text-slate-900">{s.recipients} Users</h4>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end min-w-[180px] space-y-1">
                                            <p className="text-[10px] font-black text-slate-300 uppercase">Last Delivery</p>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[12px] font-bold ${s.status === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>{s.lastSent}</span>
                                                {s.status === 'success' ? <CheckCircle2 size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-rose-500" />}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button onClick={() => handleRunNow(s)} size="icon" variant="ghost" className="h-10 w-10 text-slate-300 hover:text-amber-600 hover:bg-amber-50 rounded-xl" title="Run Now">
                                                <Play size={18} />
                                            </Button>
                                            <Button onClick={() => handleOpenEdit(s)} size="icon" variant="ghost" className="h-10 w-10 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl" title="Edit">
                                                <PenLine size={18} />
                                            </Button>
                                            <Button onClick={() => toast({ title: "Settings Modal", description: "Configuring logic for " + s.name })} size="icon" variant="ghost" className="h-10 w-10 text-slate-300 hover:text-slate-900 rounded-xl" title="Settings">
                                                <Settings2 size={18} />
                                            </Button>
                                            <Button onClick={() => handleDelete(s.id)} size="icon" variant="ghost" className="h-10 w-10 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl" title="Delete">
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </Card>

                    <div className="lg:col-span-12">
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-slate-900 text-white p-8 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150">
                                <Bell size={200} />
                            </div>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                                <div className="flex-1 space-y-4">
                                    <h3 className="text-[24px] font-black tracking-tighter">Strategic Insight Delivery</h3>
                                    <p className="text-[15px] text-slate-400 font-medium leading-relaxed max-w-2xl">
                                        Companies that distribute <strong>Daily Activity Audits</strong> to their sales managers see a <strong>22% increase</strong> in follow-up speed. Use "Link Only" delivery for real-time mobile viewing during team standups.
                                    </p>
                                </div>
                                <Button onClick={() => toast({ title: "Suggestions Loaded", description: "Showing recommended schedule templates." })} className="h-11 bg-white text-slate-900 hover:bg-slate-100 font-black px-8 rounded-xl border-none">Browse Suggested Schedules</Button>
                            </div>
                        </Card>
                    </div>

                </div>

            </div>

            {/* Create/Edit Slide-in */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
                    <div className="relative h-full w-full max-w-md bg-white shadow-2xl border-l border-slate-100 flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div>
                                <h3 className="text-[18px] font-bold text-slate-900">{editing ? "Edit Schedule" : "New Schedule"}</h3>
                                <p className="text-[12px] text-slate-500">Configure automated delivery</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} className="h-9 w-9 text-slate-400 hover:text-slate-900">
                                <X size={18} />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Schedule Name <span className="text-rose-500">*</span></label>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({ ...errors, name: undefined }) }}
                                    placeholder="e.g. Weekly CEO Summary"
                                    className={errors.name ? "border-rose-500" : ""}
                                />
                                {errors.name && <p className="text-[11px] text-rose-500 font-medium">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Report <span className="text-rose-500">*</span></label>
                                <Select value={report} onValueChange={(v) => { setReport(v); if (errors.report) setErrors({ ...errors, report: undefined }) }}>
                                    <SelectTrigger className={`h-10 ${errors.report ? "border-rose-500" : ""}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {REPORT_OPTIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {errors.report && <p className="text-[11px] text-rose-500 font-medium">{errors.report}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Frequency <span className="text-rose-500">*</span></label>
                                    <Select value={frequency} onValueChange={(v) => { setFrequency(v); if (errors.frequency) setErrors({ ...errors, frequency: undefined }) }}>
                                        <SelectTrigger className={`h-10 ${errors.frequency ? "border-rose-500" : ""}`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {FREQUENCY_OPTIONS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.frequency && <p className="text-[11px] text-rose-500 font-medium">{errors.frequency}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Format <span className="text-rose-500">*</span></label>
                                    <Select value={format} onValueChange={(v) => { setFormat(v); if (errors.format) setErrors({ ...errors, format: undefined }) }}>
                                        <SelectTrigger className={`h-10 ${errors.format ? "border-rose-500" : ""}`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {FORMAT_OPTIONS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.format && <p className="text-[11px] text-rose-500 font-medium">{errors.format}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Recipient Count <span className="text-rose-500">*</span></label>
                                <Input
                                    type="number"
                                    value={recipients}
                                    onChange={(e) => { setRecipients(e.target.value); if (errors.recipients) setErrors({ ...errors, recipients: undefined }) }}
                                    placeholder="e.g. 5"
                                    min="1"
                                    className={errors.recipients ? "border-rose-500" : ""}
                                />
                                {errors.recipients && <p className="text-[11px] text-rose-500 font-medium">{errors.recipients}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Distribution Email <span className="text-rose-500">*</span></label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }) }}
                                    placeholder="team@company.com"
                                    className={errors.email ? "border-rose-500" : ""}
                                />
                                {errors.email && <p className="text-[11px] text-rose-500 font-medium">{errors.email}</p>}
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex gap-3">
                            <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                            <Button onClick={handleSubmit} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">{editing ? "Update" : "Queue Schedule"}</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Slide-in */}
            {showFilterForm && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilterForm(false)} />
                    <div className="relative h-full w-full max-w-md bg-white shadow-2xl border-l border-slate-100 flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div>
                                <h3 className="text-[18px] font-bold text-slate-900">Filter Schedules</h3>
                                <p className="text-[12px] text-slate-500">Refine the active list</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setShowFilterForm(false)} className="h-9 w-9 text-slate-400 hover:text-slate-900">
                                <X size={18} />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Frequency</label>
                                <Select value={filterFreq} onValueChange={setFilterFreq}>
                                    <SelectTrigger className="h-10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Frequencies</SelectItem>
                                        {FREQUENCY_OPTIONS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Status</label>
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="h-10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="success">Success</SelectItem>
                                        <SelectItem value="failed">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex gap-3">
                            <Button variant="outline" onClick={() => setShowFilterForm(false)} className="flex-1">Cancel</Button>
                            <Button onClick={handleApplyFilter} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">Apply</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
