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
    MoreVertical,
    ArrowUpRight,
    Search,
    Filter,
    Settings,
    ShieldCheck,
    Zap,
    Users,
    Loader2,
    Download
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Switch } from "@/shared/components/ui/switch"
import { Input } from "@/shared/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { toast } from "@/shared/utils/toast"

// --- Mock Data ---
const INITIAL_SCHEDULED = [
    { id: "Sr-001", name: "Weekly Strategic Summary", frequency: "Weekly", nextRun: "Oct 12, 09:00", recipients: ["exec@company.com", "board@company.com"], enabled: true, lastSuccess: "2d ago" },
    { id: "Sr-002", name: "Monthly Financial Pulse", frequency: "Monthly", nextRun: "Nov 01, 08:00", recipients: ["finance@company.com"], enabled: true, lastSuccess: "28d ago" },
    { id: "Sr-003", name: "Daily Operational Brief", frequency: "Daily", nextRun: "Oct 08, 07:00", recipients: ["ops-lead@company.com"], enabled: false, lastSuccess: "N/A" }
]

const DATA_BY_PERIOD = {
    monthly: {
        recipients: "142",
        reliability: "99.9%"
    },
    quarterly: {
        recipients: "584",
        reliability: "99.95%"
    },
    yearly: {
        recipients: "2,140",
        reliability: "99.99%"
    }
}

export default function ScheduledReports() {
    const [period, setPeriod] = useState("monthly")
    const [isSyncing, setIsSyncing] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [scheduledReports, setScheduledReports] = useState(INITIAL_SCHEDULED)
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newSchedule, setNewSchedule] = useState({ name: "", frequency: "Monthly", recipients: "" })

    const activeData = useMemo(() => DATA_BY_PERIOD[period as keyof typeof DATA_BY_PERIOD], [period])

    const filteredSchedules = useMemo(() => {
        return scheduledReports.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }, [scheduledReports, searchQuery])

    const handleToggle = (id: string, enabled: boolean, name: string) => {
        setScheduledReports(scheduledReports.map(r => r.id === id ? { ...r, enabled: !enabled } : r))
        toast.info(`Automation sequence for ${name} ${!enabled ? 'activated' : 'deactivated'}`)
    }

    const handleDelete = (id: string, name: string) => {
        setScheduledReports(scheduledReports.filter(r => r.id !== id))
        toast.success(`Schedule ${name} successfully removed from automation hub`)
    }

    const handleCreate = () => {
        if (!newSchedule.name) {
            toast.error("Sequence name is required for initialization")
            return
        }
        const schedule = {
            id: `Sr-${String(scheduledReports.length + 1).padStart(3, '0')}`,
            name: newSchedule.name,
            frequency: newSchedule.frequency,
            nextRun: "Pending Selection",
            recipients: newSchedule.recipients.split(',').map(e => e.trim()),
            enabled: true,
            lastSuccess: "N/A"
        }
        setScheduledReports([schedule, ...scheduledReports])
        setNewSchedule({ name: "", frequency: "Monthly", recipients: "" })
        setIsCreateOpen(false)
        toast.success("New automation sequence architected successfully")
    }

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(new Promise(r => setTimeout(r, 1500)), {
            loading: 'Synchronizing automation engine...',
            success: 'Automation sequences synchronized',
            error: 'Sync failed'
        }).finally(() => setIsSyncing(false))
    }

    const handleExport = () => {
        setIsExporting(true)
        toast.promise(new Promise(r => setTimeout(r, 2000)), {
            loading: 'Generating delivery manifest...',
            success: 'Automation manifest exported',
            error: 'Export failed'
        }).finally(() => setIsExporting(false))
    }

    const handleAction = (msg: string) => {
        toast.promise(new Promise(r => setTimeout(r, 1200)), {
            loading: 'Updating automation parameters...',
            success: msg,
            error: 'Update failed'
        })
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="px-6 py-6 font-outfit">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">Scheduled Reports</h1>
                            <p className="text-[14px] text-slate-500 font-medium mt-1">Manage automated strategic delivery sequences and scheduled bursts</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm mr-2">
                                <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                                <select
                                    className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer text-slate-700 outline-none"
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                >
                                    <option value="monthly">Monthly View</option>
                                    <option value="quarterly">Quarterly View</option>
                                    <option value="yearly">Fiscal Year</option>
                                </select>
                            </div>
                            <Button
                                variant="outline"
                                className="h-10 px-5 rounded-lg border-slate-200 font-semibold bg-white shadow-sm gap-2"
                                onClick={handleSync}
                                disabled={isSyncing}
                            >
                                {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                {isSyncing ? "Syncing" : "Sync"}
                            </Button>
                            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                                <DialogTrigger asChild>
                                    <Button className="h-10 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm gap-2">
                                        <Plus className="w-4 h-4" /> Design Sequence
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md rounded-2xl p-8 font-outfit">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold text-slate-900 font-outfit">Design Sequence</DialogTitle>
                                        <DialogDescription className="text-slate-500 font-medium">Configure automated strategic delivery parameters.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-5 pt-4">
                                        <div className="space-y-2">
                                            <Label className="font-semibold text-slate-700 text-[11px] tracking-wide uppercase">Sequence Name</Label>
                                            <Input
                                                value={newSchedule.name}
                                                onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                                                className="h-12 rounded-xl bg-slate-50 border-slate-200 font-semibold"
                                                placeholder="e.g., Executive Growth Pulse"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-semibold text-slate-700 text-[11px] tracking-wide uppercase">Cadence</Label>
                                            <select
                                                className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 font-semibold px-4 outline-none focus:ring-1 focus:ring-indigo-100"
                                                value={newSchedule.frequency}
                                                onChange={(e) => setNewSchedule({ ...newSchedule, frequency: e.target.value })}
                                            >
                                                <option>Daily</option>
                                                <option>Weekly</option>
                                                <option>Monthly</option>
                                                <option>Fiscal Quarter</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-semibold text-slate-700 text-[11px] tracking-wide uppercase">Recipients (Comma Separated)</Label>
                                            <Input
                                                value={newSchedule.recipients}
                                                onChange={(e) => setNewSchedule({ ...newSchedule, recipients: e.target.value })}
                                                className="h-12 rounded-xl bg-slate-50 border-slate-200 font-semibold"
                                                placeholder="exec@company.com, board@company.com"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter className="pt-6 gap-2">
                                        <Button variant="ghost" className="rounded-xl font-semibold" onClick={() => setIsCreateOpen(false)}>Abort</Button>
                                        <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold px-8 text-white" onClick={handleCreate}>Initialize</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Automation Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                        {[
                            { label: "Active Sequences", value: scheduledReports.filter(r => r.enabled).length, icon: Zap, bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-200/50" },
                            { label: "Recipients Engaged", value: activeData.recipients, icon: Users, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-200/50" },
                            { label: "System Reliability", value: activeData.reliability, icon: ShieldCheck, bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-200/50" }
                        ].map((stat, i) => (
                            <Card key={i} className={`${stat.bg} ${stat.border} border transition-all hover:shadow-md`}>
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-2.5 rounded-xl ${stat.iconBg} shadow-sm`}>
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

            {/* Main Automation Section */}
            <div className="px-6 py-6">
                <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 font-outfit">
                    <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <CardTitle className="text-xl font-bold text-slate-900">Automation Hub</CardTitle>
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors w-4 h-4" />
                            <Input
                                placeholder="Search automation hub..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-11 bg-slate-50 border-0 rounded-xl text-sm font-medium focus:ring-1 focus:ring-indigo-100"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-4">
                        {filteredSchedules.map((report) => (
                            <div key={report.id} className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-white hover:shadow-lg hover:border-indigo-100 transition-all group cursor-pointer shadow-sm">
                                <div className="flex items-center gap-5 flex-1">
                                    <div className={`h-14 w-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0 ${!report.enabled && 'opacity-50'}`}>
                                        <Calendar className={`w-7 h-7 ${report.enabled ? 'text-indigo-600' : 'text-slate-400'}`} />
                                    </div>
                                    <div className="space-y-1.5 text-slate-600">
                                        <div className="flex items-center gap-3">
                                            <h4 className={`text-md font-bold group-hover:text-indigo-600 transition-colors leading-none ${report.enabled ? 'text-slate-900' : 'text-slate-400'}`}>{report.name}</h4>
                                            <Badge className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border-0 ${report.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                                                }`}>{report.enabled ? 'Active' : 'Paused'}</Badge>
                                            <Badge variant="outline" className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-slate-50 border-slate-200 text-slate-400">{report.frequency}</Badge>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-slate-400">
                                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Next Pulse: {report.nextRun}</span>
                                            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Targets: {report.recipients.length} Organizational Nodes</span>
                                            {report.lastSuccess !== 'N/A' && <span className="flex items-center gap-1.5 text-emerald-600"><ArrowUpRight className="w-3.5 h-3.5" /> Last Handshake: {report.lastSuccess}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 ml-auto lg:ml-0">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <Switch
                                            checked={report.enabled}
                                            onCheckedChange={() => handleToggle(report.id, report.enabled, report.name)}
                                            className="data-[state=checked]:bg-indigo-600"
                                        />
                                        <span className="text-[10px] font-semibold text-slate-400">Status</span>
                                    </div>
                                    <div className="flex items-center border border-slate-100 rounded-xl bg-white overflow-hidden shadow-sm shrink-0">
                                        <Button variant="ghost" size="icon" className="h-11 w-11 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600" onClick={() => handleAction("Automation settings updated")}>
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-11 w-11 hover:bg-rose-50 text-slate-400 hover:text-rose-600" onClick={() => handleDelete(report.id, report.name)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredSchedules.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200">
                                    <Search className="w-8 h-8 text-slate-200" />
                                </div>
                                <p className="text-slate-400 font-bold">No sequences detected in current view.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Bottom Stats / Alerts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 font-outfit">
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 p-8 flex items-start gap-6 bg-white border border-slate-100 hover:border-indigo-100 transition-all">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shrink-0 shadow-sm">
                            <Bell className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="space-y-1.5">
                            <h4 className="text-lg font-bold text-slate-900 tracking-tight">Notification Pulse</h4>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">Integrated Slack and Email delivery webhooks are operating at 100% efficiency.</p>
                        </div>
                    </Card>
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 p-8 flex items-start gap-6 bg-white border border-slate-100 hover:border-emerald-100 transition-all">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0 shadow-sm">
                            <Mail className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="space-y-1.5">
                            <h4 className="text-lg font-bold text-slate-900 tracking-tight">Delivery Verification</h4>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">All outbound premium reports are encrypted and verified against recipient organizational nodes.</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
