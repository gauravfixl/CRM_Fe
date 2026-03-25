"use client"

import React, { useState, useMemo } from 'react'
import {
    Plus,
    Download,
    Edit,
    Trash2,
    FileText,
    Search,
    Filter,
    Play,
    MoreVertical,
    RefreshCw,
    Clock,
    Database,
    Zap,
    Share2,
    Settings,
    Calendar,
    Loader2
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from "@/shared/components/ui/dialog"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { toast } from "@/shared/utils/toast"

// --- Mock Data ---
const INITIAL_REPORTS = [
    { id: "Cr-001", name: "Monthly Revenue Matrix", created: "2024-01-15", lastRun: "2h ago", runs: 142, status: "Active", type: "Financial" },
    { id: "Cr-002", name: "Strategic Churn Forecast", created: "2024-02-20", lastRun: "1d ago", runs: 28, status: "Active", type: "Intelligence" },
    { id: "Cr-003", name: "Sales Pipeline Dynamics", created: "2024-03-10", lastRun: "3d ago", runs: 15, status: "Draft", type: "Operations" }
]

const DATA_BY_PERIOD = {
    monthly: {
        generated: "1,420",
        automated: "24"
    },
    quarterly: {
        generated: "4,260",
        automated: "32"
    },
    yearly: {
        generated: "18,450",
        automated: "48"
    }
}

export default function CustomReports() {
    const [period, setPeriod] = useState("monthly")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isSyncing, setIsSyncing] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [newReport, setNewReport] = useState({ name: "", description: "", type: "Standard" })
    const [reports, setReports] = useState(INITIAL_REPORTS)

    const activeData = useMemo(() => DATA_BY_PERIOD[period as keyof typeof DATA_BY_PERIOD], [period])

    const filteredReports = useMemo(() => {
        return reports.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }, [reports, searchQuery])

    const handleCreate = () => {
        if (!newReport.name) {
            toast.error("Structural requirement: Report name is mandatory")
            return
        }
        const report = {
            id: `Cr-${String(reports.length + 1).padStart(3, '0')}`,
            ...newReport,
            created: new Date().toISOString().split('T')[0],
            lastRun: "Never",
            runs: 0,
            status: "Draft",
            type: newReport.type || "Custom"
        }
        setReports([report, ...reports])
        setNewReport({ name: "", description: "", type: "Standard" })
        setIsCreateOpen(false)
        handleAction("Strategic report template initialized")
    }

    const handleDelete = (id: string, name: string) => {
        setReports(reports.filter(r => r.id !== id))
        toast.info(`${name} archived from custom library`)
    }

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(new Promise(r => setTimeout(r, 1500)), {
            loading: 'Synchronizing custom assets...',
            success: 'Custom library synchronized',
            error: 'Sync failed'
        }).finally(() => setIsSyncing(false))
    }

    const handleExport = () => {
        setIsExporting(true)
        toast.promise(new Promise(r => setTimeout(r, 2000)), {
            loading: 'Generating asset audit...',
            success: 'Custom asset inventory exported',
            error: 'Export failed'
        }).finally(() => setIsExporting(false))
    }

    const handleAction = (msg: string) => {
        toast.promise(new Promise(r => setTimeout(r, 1200)), {
            loading: 'Constructing strategic report...',
            success: msg,
            error: 'Construction failed'
        })
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="px-6 py-6 font-outfit">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">Custom Reports</h1>
                            <p className="text-[14px] text-slate-500 font-medium mt-1">Architect custom strategic assets and automated data pipelines</p>
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
                                        <Plus className="w-4 h-4" /> Architect Report
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md rounded-2xl p-8">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold text-slate-900">New Report Architect</DialogTitle>
                                        <DialogDescription className="text-slate-500 font-medium">Define the core parameters for your custom strategic asset.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-5 pt-4">
                                        <div className="space-y-2">
                                            <Label className="font-semibold text-slate-700 text-[11px] tracking-wide">Asset Name</Label>
                                            <Input
                                                value={newReport.name}
                                                onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                                                className="h-12 rounded-xl bg-slate-50 border-slate-200 font-semibold"
                                                placeholder="e.g., Regional Performance Matrix"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold text-slate-700 text-[11px] tracking-wide">Description</Label>
                                            <Textarea
                                                value={newReport.description}
                                                onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                                                className="rounded-xl bg-slate-50 border-slate-200 font-medium min-h-[100px]"
                                                placeholder="Outline the strategic purpose..."
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

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                        {[
                            { label: "Active Custom Assets", value: reports.length, icon: Database, bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-200/50" },
                            { label: "Reports Generated (7d)", value: activeData.generated, icon: Zap, bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", iconBg: "bg-amber-100", iconColor: "text-amber-600", border: "border-amber-200/50" },
                            { label: "Automated Schedules", value: activeData.automated, icon: Clock, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-200/50" }
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

            {/* Main Library Section */}
            <div className="px-6 py-6">
                <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 font-outfit">
                    <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <CardTitle className="text-xl font-bold text-slate-900">Custom Intelligence Library</CardTitle>
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors w-4 h-4" />
                            <Input
                                placeholder="Find strategic asset..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-11 bg-slate-50 border-0 rounded-xl text-sm font-medium focus:ring-1 focus:ring-indigo-100"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-4">
                        {filteredReports.map((report) => (
                            <div key={report.id} className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-white hover:shadow-lg hover:border-indigo-100 transition-all group cursor-pointer">
                                <div className="flex items-center gap-5 flex-1">
                                    <div className="h-14 w-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                                        <FileText className="w-7 h-7 text-indigo-600" />
                                    </div>
                                    <div className="space-y-1.5 text-slate-600">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-md font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors leading-none">{report.name}</h4>
                                            <Badge className={`text-[9px] font-semibold px-2.5 py-0.5 rounded-full border-0 ${report.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                                                }`}>{report.status}</Badge>
                                            <Badge variant="outline" className="text-[9px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-50 border-slate-200 text-slate-400">{report.type}</Badge>
                                        </div>
                                        <div className="flex items-center gap-6 text-[11px] font-bold text-slate-400">
                                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Last Run: {report.lastRun}</span>
                                            <span className="flex items-center gap-1.5"><Play className="w-3.5 h-3.5 text-indigo-600" /> Total Executions: {report.runs}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 ml-auto lg:ml-0">
                                    <Button variant="outline" className="h-11 px-6 rounded-xl border-slate-200 font-bold text-slate-600 bg-white shadow-sm hover:bg-indigo-50 group-hover:border-indigo-200 gap-2" onClick={() => handleAction(`${report.name} execution sequence initiated`)}>
                                        <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" /> Run Intelligence
                                    </Button>
                                    <div className="flex items-center border border-slate-100 rounded-xl bg-white overflow-hidden shadow-sm">
                                        <Button variant="ghost" size="icon" className="h-11 w-11 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600" onClick={() => handleAction("Asset architecture updated")}>
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-11 w-11 hover:bg-rose-50 text-slate-400 hover:text-rose-600" onClick={() => handleDelete(report.id, report.name)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredReports.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200">
                                    <Search className="w-8 h-8 text-slate-200" />
                                </div>
                                <p className="text-slate-400 font-bold">No assets match your defined parameters.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Bottom Context Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <Card className="rounded-3xl border-0 shadow-sm p-8 space-y-4 bg-white border border-slate-100 hover:border-indigo-100 transition-all font-outfit">
                        <CardContent className="p-0 space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                <Share2 className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 tracking-tight">Collaboration Hub</h4>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">Share custom reporting templates across various organizational nodes for synchronized intelligence.</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-3xl border-0 shadow-sm p-8 space-y-4 bg-white border border-slate-100 hover:border-amber-100 transition-all font-outfit">
                        <CardContent className="p-0 space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100">
                                <Settings className="w-6 h-6 text-amber-600" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 tracking-tight">Dynamic Data Layer</h4>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">Map custom report parameters directly to your organization's unified data lake for zero-latency lookups.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
