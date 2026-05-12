"use client"

import React, { useState, useMemo } from 'react'
import {
    Plus,
    Calendar,
    Trash2,
    Clock,
    Mail,
    RefreshCw,
    Bell,
    ArrowUpRight,
    Search,
    Settings,
    ShieldCheck,
    Zap,
    Users,
    Loader2,
    Download,
    FileText,
    PencilLine
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Switch } from "@/shared/components/ui/switch"
import { Input } from "@/shared/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { useRouter } from 'next/navigation'
import { toast } from "@/shared/utils/toast"

interface ScheduledReport {
    id: string
    name: string
    frequency: string
    cron: string
    nextRun: string
    recipients: string[]
    enabled: boolean
    lastSuccess: string
    notes: string
}

const INITIAL_SCHEDULED: ScheduledReport[] = [
    { id: "SR-001", name: "Weekly Strategic Summary", frequency: "Weekly", cron: "0 9 * * 1", nextRun: "Oct 12, 09:00", recipients: ["exec@company.com", "board@company.com"], enabled: true, lastSuccess: "2d ago", notes: "Top-line weekly digest" },
    { id: "SR-002", name: "Monthly Financial Pulse", frequency: "Monthly", cron: "0 8 1 * *", nextRun: "Nov 01, 08:00", recipients: ["finance@company.com"], enabled: true, lastSuccess: "28d ago", notes: "End-of-month P&L" },
    { id: "SR-003", name: "Daily Operational Brief", frequency: "Daily", cron: "0 7 * * *", nextRun: "Oct 08, 07:00", recipients: ["ops-lead@company.com"], enabled: false, lastSuccess: "N/A", notes: "Operations baseline" }
]

const DATA_BY_PERIOD = {
    monthly: { recipients: "142", reliability: "99.9%" },
    quarterly: { recipients: "584", reliability: "99.95%" },
    yearly: { recipients: "2,140", reliability: "99.99%" }
}

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    emails: (v: string) => {
        if (!v || !v.trim()) return "At least one recipient is required"
        const list = v.split(',').map(s => s.trim()).filter(Boolean)
        if (list.length === 0) return "At least one recipient is required"
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        for (const e of list) { if (!re.test(e)) return `Invalid email: ${e}` }
        return ""
    },
    cron: (v: string) => {
        if (!v || !v.trim()) return "Cron expression is required"
        const parts = v.trim().split(/\s+/)
        if (parts.length !== 5) return "Cron must have 5 fields (e.g. 0 9 * * 1)"
        return ""
    }
}

export default function ScheduledReports() {
    const router = useRouter()
    const [period, setPeriod] = useState("monthly")
    const [isSyncing, setIsSyncing] = useState(false)
    const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>(INITIAL_SCHEDULED)
    const [searchQuery, setSearchQuery] = useState("")

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState({ name: "", frequency: "Monthly", cron: "0 9 1 * *", recipients: "", notes: "" })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [selected, setSelected] = useState<ScheduledReport | null>(null)

    const activeData = useMemo(() => DATA_BY_PERIOD[period as keyof typeof DATA_BY_PERIOD], [period])

    const filteredSchedules = useMemo(() => {
        return scheduledReports.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.frequency.toLowerCase().includes(searchQuery.toLowerCase()))
    }, [scheduledReports, searchQuery])

    const setField = (k: string, v: any) => {
        setForm(prev => ({ ...prev, [k]: v }))
        if (errors[k]) setErrors(prev => { const c = { ...prev }; delete c[k]; return c })
    }

    const validate = () => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(3)(form.name)
        errs.recipients = validators.emails(form.recipients)
        errs.cron = validators.cron(form.cron)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", frequency: "Monthly", cron: "0 9 1 * *", recipients: "", notes: "" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (r: ScheduledReport) => {
        setEditingId(r.id)
        setForm({ name: r.name, frequency: r.frequency, cron: r.cron, recipients: r.recipients.join(", "), notes: r.notes })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        const recipientList = form.recipients.split(',').map(s => s.trim()).filter(Boolean)
        if (editingId) {
            setScheduledReports(scheduledReports.map(r => r.id === editingId ? { ...r, name: form.name.trim(), frequency: form.frequency, cron: form.cron.trim(), recipients: recipientList, notes: form.notes.trim() } : r))
            toast.success("Schedule updated")
        } else {
            const newSchedule: ScheduledReport = {
                id: `SR-${String(scheduledReports.length + 1).padStart(3, '0')}`,
                name: form.name.trim(),
                frequency: form.frequency,
                cron: form.cron.trim(),
                nextRun: "Pending Selection",
                recipients: recipientList,
                enabled: true,
                lastSuccess: "N/A",
                notes: form.notes.trim()
            }
            setScheduledReports([newSchedule, ...scheduledReports])
            toast.success("New schedule created")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: string, name: string) => {
        setScheduledReports(scheduledReports.filter(r => r.id !== id))
        toast.success(`Schedule "${name}" removed`)
    }

    const handleToggle = (id: string, enabled: boolean, name: string) => {
        setScheduledReports(scheduledReports.map(r => r.id === id ? { ...r, enabled: !enabled } : r))
        toast.info(`${name} ${!enabled ? 'activated' : 'paused'}`)
    }

    const openDetail = (r: ScheduledReport) => { setSelected(r); setIsDetailOpen(true) }

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(new Promise(r => setTimeout(r, 1500)),
            { loading: 'Synchronizing automation engine...', success: 'Sequences synchronized', error: 'Sync failed' }
        ).finally(() => setIsSyncing(false))
    }

    const handleExportPDF = () => {
        toast.promise(new Promise(r => setTimeout(r, 1800)),
            { loading: 'Generating delivery manifest PDF...', success: 'Manifest PDF exported', error: 'PDF export failed' })
    }

    const handleExportCSV = () => {
        toast.promise(new Promise(r => setTimeout(r, 1200)),
            { loading: 'Generating delivery manifest CSV...', success: 'Manifest CSV exported', error: 'CSV export failed' })
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b border-slate-200">
                <div className="px-6 py-6 font-outfit">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">Scheduled Reports</h1>
                            <p className="text-[14px] text-slate-500 font-medium mt-1">Manage automated strategic delivery sequences and scheduled bursts</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Select value={period} onValueChange={setPeriod}>
                                <SelectTrigger className="h-10 w-40 rounded-none border-slate-200 bg-white">
                                    <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="monthly">Monthly View</SelectItem>
                                    <SelectItem value="quarterly">Quarterly View</SelectItem>
                                    <SelectItem value="yearly">Fiscal Year</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" className="h-10 px-5 rounded-none border-slate-200 font-semibold bg-white shadow-sm gap-2" onClick={handleSync} disabled={isSyncing}>
                                {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                {isSyncing ? "Syncing" : "Sync"}
                            </Button>
                            <Button variant="outline" className="h-10 px-5 rounded-none border-slate-200 font-semibold bg-white shadow-sm gap-2" onClick={handleExportCSV}>
                                <FileText className="w-4 h-4" /> CSV
                            </Button>
                            <Button variant="outline" className="h-10 px-5 rounded-none border-slate-200 font-semibold bg-white shadow-sm gap-2" onClick={handleExportPDF}>
                                <Download className="w-4 h-4" /> PDF
                            </Button>
                            <Button className="h-10 px-6 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm gap-2" onClick={openCreate}>
                                <Plus className="w-4 h-4" /> New Schedule
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                        {[
                            { label: "Active Sequences", value: scheduledReports.filter(r => r.enabled).length, icon: Zap, bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-200/50", path: "/client-management/reports/custom" },
                            { label: "Recipients Engaged", value: activeData.recipients, icon: Users, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-200/50", path: "/client-management/reports/client" },
                            { label: "System Reliability", value: activeData.reliability, icon: ShieldCheck, bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-200/50", path: "/client-management/reports/executive" }
                        ].map((stat, i) => (
                            <Card key={i} className={`rounded-none cursor-pointer ${stat.bg} ${stat.border} border transition-all hover:shadow-md`} onClick={() => router.push(stat.path)}>
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-2.5 rounded-none ${stat.iconBg} shadow-sm`}>
                                            <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 font-outfit">{stat.label}</p>
                                            <p className="text-2xl font-semibold text-slate-900 font-outfit">{stat.value}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-6 py-6">
                <Card className="rounded-none border shadow-sm font-outfit">
                    <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <CardTitle className="text-xl font-bold text-slate-900">Automation Hub</CardTitle>
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors w-4 h-4" />
                            <Input
                                placeholder="Search automation hub..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-11 bg-slate-50 border-0 rounded-none text-sm font-medium focus:ring-1 focus:ring-indigo-100"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-4">
                        {filteredSchedules.map((report) => (
                            <div key={report.id} className="p-6 bg-slate-50/50 border border-slate-100 rounded-none flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-white hover:shadow-lg hover:border-indigo-100 transition-all group cursor-pointer shadow-sm" onClick={() => openDetail(report)}>
                                <div className="flex items-center gap-5 flex-1">
                                    <div className={`h-14 w-14 rounded-none bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0 ${!report.enabled && 'opacity-50'}`}>
                                        <Calendar className={`w-7 h-7 ${report.enabled ? 'text-indigo-600' : 'text-slate-400'}`} />
                                    </div>
                                    <div className="space-y-1.5 text-slate-600">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h4 className={`text-md font-bold group-hover:text-indigo-600 transition-colors leading-none ${report.enabled ? 'text-slate-900' : 'text-slate-400'}`}>{report.name}</h4>
                                            <Badge className={`text-[9px] font-bold px-2.5 py-0.5 rounded-none border-0 ${report.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{report.enabled ? 'Active' : 'Paused'}</Badge>
                                            <Badge variant="outline" className="text-[9px] font-bold px-2.5 py-0.5 rounded-none bg-slate-50 border-slate-200 text-slate-400">{report.frequency}</Badge>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-slate-400">
                                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Next: {report.nextRun}</span>
                                            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Targets: {report.recipients.length}</span>
                                            {report.lastSuccess !== 'N/A' && <span className="flex items-center gap-1.5 text-emerald-600"><ArrowUpRight className="w-3.5 h-3.5" /> Last: {report.lastSuccess}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 ml-auto lg:ml-0" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex flex-col items-center gap-1.5">
                                        <Switch
                                            checked={report.enabled}
                                            onCheckedChange={() => handleToggle(report.id, report.enabled, report.name)}
                                            className="data-[state=checked]:bg-indigo-600"
                                        />
                                        <span className="text-[10px] font-semibold text-slate-400">Status</span>
                                    </div>
                                    <div className="flex items-center border border-slate-100 rounded-none bg-white overflow-hidden shadow-sm shrink-0">
                                        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-none hover:bg-indigo-50 text-slate-400 hover:text-indigo-600" onClick={() => openEdit(report)}>
                                            <PencilLine className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-none hover:bg-indigo-50 text-slate-400 hover:text-indigo-600" onClick={() => toast.success(`Settings for ${report.name} opened`)}>
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-none hover:bg-rose-50 text-slate-400 hover:text-rose-600" onClick={() => handleDelete(report.id, report.name)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredSchedules.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <div className="h-20 w-20 rounded-none bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200">
                                    <Search className="w-8 h-8 text-slate-200" />
                                </div>
                                <p className="text-slate-400 font-bold">No sequences detected in current view.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 font-outfit">
                    <Card className="rounded-none border shadow-sm p-8 flex items-start gap-6 bg-white hover:border-indigo-100 transition-all cursor-pointer" onClick={() => toast.success("Slack & Email webhooks are operational")}>
                        <div className="h-12 w-12 rounded-none bg-indigo-50 flex items-center justify-center border border-indigo-100 shrink-0 shadow-sm">
                            <Bell className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="space-y-1.5">
                            <h4 className="text-lg font-bold text-slate-900 tracking-tight">Notification Pulse</h4>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">Integrated Slack and Email delivery webhooks are operating at 100% efficiency.</p>
                        </div>
                    </Card>
                    <Card className="rounded-none border shadow-sm p-8 flex items-start gap-6 bg-white hover:border-emerald-100 transition-all cursor-pointer" onClick={() => toast.success("All outbound reports verified")}>
                        <div className="h-12 w-12 rounded-none bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0 shadow-sm">
                            <Mail className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="space-y-1.5">
                            <h4 className="text-lg font-bold text-slate-900 tracking-tight">Delivery Verification</h4>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">All outbound premium reports are encrypted and verified against recipient organizational nodes.</p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Form Sheet (Create/Edit) */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-emerald-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Schedule" : "New Scheduled Report"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Configure automated strategic delivery.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g., Weekly Exec Pulse" className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`} />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Frequency</Label>
                            <Select value={form.frequency} onValueChange={(v: any) => setField("frequency", v)}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="Daily">Daily</SelectItem>
                                    <SelectItem value="Weekly">Weekly</SelectItem>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                                    <SelectItem value="Custom">Custom</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Cron Schedule <span className="text-rose-500">*</span></Label>
                            <Input value={form.cron} onChange={e => setField("cron", e.target.value)} placeholder="0 9 * * 1" className={`h-10 rounded-none font-mono ${errors.cron ? "border-rose-500" : ""}`} />
                            {errors.cron ? <p className="text-[11px] text-rose-500">{errors.cron}</p> : <p className="text-[11px] text-slate-400">Format: minute hour day-of-month month day-of-week</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Recipients <span className="text-rose-500">*</span></Label>
                            <Input value={form.recipients} onChange={e => setField("recipients", e.target.value)} placeholder="exec@company.com, board@company.com" className={`h-10 rounded-none ${errors.recipients ? "border-rose-500" : ""}`} />
                            {errors.recipients ? <p className="text-[11px] text-rose-500">{errors.recipients}</p> : <p className="text-[11px] text-slate-400">Comma-separated emails</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Notes</Label>
                            <Textarea value={form.notes} onChange={e => setField("notes", e.target.value)} placeholder="Internal context..." className="rounded-none min-h-[80px]" />
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>{editingId ? "Save Changes" : "Create Schedule"}</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Schedule Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">{selected.id}</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                                    <div className="flex gap-2 mt-2">
                                        <Badge className={`rounded-none border-0 ${selected.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{selected.enabled ? 'Active' : 'Paused'}</Badge>
                                        <Badge variant="outline" className="rounded-none">{selected.frequency}</Badge>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Next Run</p><p className="font-semibold text-slate-900">{selected.nextRun}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Last Success</p><p className="font-semibold text-slate-900">{selected.lastSuccess}</p></div>
                                    <div className="col-span-2">
                                        <p className="text-[11px] text-slate-400 uppercase">Cron</p>
                                        <p className="font-mono text-sm text-slate-900">{selected.cron}</p>
                                    </div>
                                </div>
                                <div className="pt-3 border-t">
                                    <p className="text-[11px] text-slate-400 uppercase mb-2">Recipients ({selected.recipients.length})</p>
                                    <div className="space-y-1">
                                        {selected.recipients.map((r, i) => (
                                            <div key={i} className="text-sm text-slate-700 flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5 text-slate-400" />{r}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {selected.notes && (
                                    <div className="pt-3 border-t">
                                        <p className="text-[11px] text-slate-400 uppercase mb-1">Notes</p>
                                        <p className="text-sm text-slate-700">{selected.notes}</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsDetailOpen(false); openEdit(selected) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDelete(selected.id, selected.name); setIsDetailOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" />Delete
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
