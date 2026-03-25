"use client"

import React, { useState, useEffect } from "react"
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
    MoreVertical
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Switch } from "@/shared/components/ui/switch"

// --- Mock Data ---
const INITIAL_SCHEDULES = [
    {
        id: "1",
        name: "Weekly CEO Summary",
        report: "Executive Dashboard",
        frequency: "Every Monday, 8:00 AM",
        format: "PDF",
        recipients: 4,
        lastSent: "Today, 8:00 AM",
        status: "success"
    },
    {
        id: "2",
        name: "Daily Sales Activity Audit",
        report: "Activity Productivity",
        frequency: "Daily, 6:00 PM",
        format: "Excel",
        recipients: 12,
        lastSent: "Yesterday, 6:00 PM",
        status: "success"
    },
    {
        id: "3",
        name: "Monthly Attribution ROI",
        report: "Source Performance",
        frequency: "1st of Month, 9:00 AM",
        format: "PDF",
        recipients: 2,
        lastSent: "Feb 1st, 9:00 AM",
        status: "success"
    },
    {
        id: "4",
        name: "Critical Bottleneck Alert",
        report: "Aging Analysis",
        frequency: "As triggered (SLA Breach)",
        format: "Link Only",
        recipients: 1,
        lastSent: "2h ago",
        status: "failed"
    },
]

export default function ScheduledReportsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [schedules, setSchedules] = useState(INITIAL_SCHEDULES)
    const [showAddModal, setShowAddModal] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleRunNow = (name: string) => {
        toast({
            title: "Manual Trigger Initiated",
            description: `Sending "${name}" to all recipients now...`,
        })
    }

    const handleDelete = (id: string) => {
        setSchedules(schedules.filter(s => s.id !== id))
        toast({ title: "Schedule Deleted", description: "Automated delivery for this report has been stopped." })
    }

    const handleCreate = () => {
        const newSchedule = {
            id: `sch-${Date.now()}`,
            name: "New Custom Delivery",
            report: "Custom Selection",
            frequency: "Daily, 9:00 AM",
            format: "Secure Link",
            recipients: 1,
            lastSent: "Pending",
            status: "success"
        }
        setSchedules([newSchedule, ...schedules])
        setShowAddModal(false)
        toast({ title: "Schedule Created", description: "Report queued for automated delivery." })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                                <Mail className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                Scheduled Report Delivery
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Automate your business intelligence. Schedule reports to be delivered directly to your team's inbox in PDF, Excel, or live link formats.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => toast({ title: "Recipients Synced", description: "All distribution lists updated from directory." })} className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-bold text-[12px] px-5">
                        <RefreshCw className="h-4 w-4 mr-2 text-slate-400" /> Sync Recipients
                    </Button>
                    <Button onClick={() => setShowAddModal(true)} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-indigo-100 shadow-lg border-none">
                        <Plus className="h-4 w-4 mr-2" /> Create Schedule
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Global Scheduling Metrics */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Active Schedules", val: `${schedules.length} Logs`, icon: Calendar, color: "text-indigo-600", bg: "bg-indigo-50" },
                        { label: "Total Recipients", val: "142 Users", icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
                        { label: "Daily Volume", val: "8 reports/day", icon: RefreshCw, color: "text-cyan-600", bg: "bg-cyan-50" },
                    ].map((s, i) => (
                        <Card key={i} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl bg-white overflow-hidden p-6 flex flex-col justify-between">
                            <div className="flex items-center justify-between h-fit">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                                <div className={`p-2 rounded-lg ${s.bg} ${s.color}`}>
                                    <s.icon size={18} />
                                </div>
                            </div>
                            <h4 className="text-[24px] font-black text-slate-900 mt-4">{s.val}</h4>
                        </Card>
                    ))}
                </div>

                {/* Schedules List Area */}
                <Card className="lg:col-span-12 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Active Reporting Schedulers</h3>
                            <p className="text-[13px] text-slate-500 font-medium">Monitoring automated delivery cadence and execution status.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] px-2 h-5 uppercase tracking-wider">Engine: Healthy</Badge>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {schedules.map((s, i) => (
                            <Card key={i} className="border-none shadow-none ring-1 ring-slate-100 rounded-2xl bg-slate-50/20 group hover:bg-white hover:ring-indigo-100 transition-all cursor-default">
                                <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div className="flex items-center gap-5 min-w-[300px]">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black ${s.status === 'success' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
                                            <FileText size={24} />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-[15px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{s.name}</h4>
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
                                        <Button
                                            onClick={() => handleRunNow(s.name)}
                                            size="icon"
                                            variant="ghost"
                                            className="h-10 w-10 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl"
                                        >
                                            <Play size={18} />
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={() => toast({ title: "Settings Modal", description: "Configuring logic for " + s.name })} className="h-10 w-10 text-slate-300 hover:text-slate-900 rounded-xl">
                                            <Settings2 size={18} />
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={() => handleDelete(s.id)} className="h-10 w-10 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl">
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </Card>

                {/* Automation Tip Sidebar */}
                <div className="lg:col-span-12">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-slate-900 text-white p-8 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150">
                            <Bell size={200} />
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                            <div className="flex-1 space-y-4">
                                <h3 className="text-[24px] font-black tracking-tighter">Strategic Insight Delivery</h3>
                                <p className="text-[15px] text-slate-400 font-medium leading-relaxed max-w-2xl">
                                    Companies that distribute **Daily Activity Audits** to their sales managers see a **22% increase** in follow-up speed. Use "Link Only" delivery for real-time mobile viewing during team standups.
                                </p>
                            </div>
                            <Button className="h-11 bg-white text-slate-900 hover:bg-slate-100 font-black px-8 rounded-xl border-none">Browse Suggested Schedules</Button>
                        </div>
                    </Card>
                </div>

            </div>

            {/* Add Schedule Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-10 space-y-8 animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="flex flex-col items-center text-center space-y-2">
                            <div className="h-16 w-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                                <Calendar size={32} />
                            </div>
                            <h3 className="text-[24px] font-black text-slate-900 tracking-tight uppercase leading-none">Schedule Report</h3>
                            <p className="text-[13px] text-slate-500 font-medium italic">"Automate the delivery of business intelligence."</p>
                        </div>
                        <div className="flex gap-4 pt-2">
                            <Button variant="ghost" onClick={() => setShowAddModal(false)} className="flex-1 h-14 rounded-2xl font-black uppercase text-[12px] tracking-widest text-slate-400 hover:bg-slate-50">Cancel</Button>
                            <Button onClick={handleCreate} className="flex-1 h-14 bg-indigo-600 text-white hover:bg-indigo-700 font-black rounded-2xl border-none uppercase text-[12px] tracking-widest shadow-xl shadow-indigo-100">Queue Schedule</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
