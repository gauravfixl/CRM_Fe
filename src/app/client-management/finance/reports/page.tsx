"use client"

import React, { useState, useMemo } from 'react'
import {
    Search,
    Plus,
    Filter,
    Download,
    Edit,
    Trash2,
    Eye,
    FileText,
    TrendingUp,
    Calendar,
    BarChart3,
    RefreshCw,
    DownloadCloud,
    PieChart,
    ChevronDown,
    Clock,
    UserCircle2,
    Database,
    Zap,
    SearchCheck,
    FileCode,
    Printer
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { toast } from "@/shared/utils/toast"

// --- Mock Data ---
const REPORTS = [
    { id: "RPT-001", name: "Executive P&L Snapshot", type: "Financial", period: "Sep 2024", date: "Oct 01, 2024", status: "Ready", size: "2.4MB" },
    { id: "RPT-002", name: "Global Balance Nexus", type: "Compliance", period: "Q3 2024", date: "Oct 02, 2024", status: "Generated", size: "1.8MB" },
    { id: "RPT-003", name: "Cash Velocity Audit", type: "Strategy", period: "Sep 2024", date: "Oct 02, 2024", status: "Processing", size: "-" }
]

const TEMPLATES = [
    { title: "Standard Profit & Loss", desc: "ASC 606 compliant income summary", frequency: "Monthly", color: "bg-blue-500" },
    { title: "Liquidity Pulse", desc: "Real-time cash flow and burn analysis", frequency: "Weekly", color: "bg-emerald-500" },
    { title: "Tax Liability Matrix", desc: "Multi-regional tax exposure report", frequency: "Quarterly", color: "bg-amber-500" }
]

export default function FinancialReports() {
    const [reports, setReports] = useState(REPORTS)
    const [templates, setTemplates] = useState(TEMPLATES)
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateReportOpen, setIsCreateReportOpen] = useState(false)
    const [newReport, setNewReport] = useState({ name: '', type: 'Financial', period: '', size: '1.0MB', status: 'Ready' })
    const [selectedReport, setSelectedReport] = useState<any>(null)

    const handleAction = (msg: string) => {
        toast.promise(new Promise(r => setTimeout(r, 1000)), {
            loading: 'Compiling financial intelligence data...',
            success: msg,
            error: 'Report generation failed'
        })
    }

    const handleCreateReport = () => {
        if (!newReport.name) {
            toast.error("Please fill in report name")
            return
        }
        if (!newReport.period) {
            toast.error("Please specify a fiscal period")
            return
        }
        const report = {
            id: `RPT-00${reports.length + 1}`,
            name: newReport.name,
            type: newReport.type,
            period: newReport.period,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            status: newReport.status,
            size: newReport.size || '1.0MB'
        }
        setReports([report, ...reports])
        setIsCreateReportOpen(false)
        setNewReport({ name: '', type: 'Financial', period: '', size: '1.0MB', status: 'Ready' })
        toast.success(`Report ${report.id} generated`)
    }

    const handleDeleteReport = (id: string) => {
        setReports(reports.filter(r => r.id !== id))
        toast.success("Report removed from archive")
    }

    const handleDeleteTemplate = (title: string) => {
        setTemplates(templates.filter(t => t.title !== title))
        toast.success("Template removed from registry")
    }

    const filteredReports = useMemo(() => {
        return reports.filter(r =>
            r.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [reports, searchQuery])

    const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">Financial <span className="text-indigo-600">Intel</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Generate deep-dive fiscal analysis, compliance documentation, and strategic templates</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={() => handleAction("Bulk report archive triggered")}>
                        <Printer className="w-4 h-4 text-slate-400" /> Print All
                    </Button>
                    <Dialog open={isCreateReportOpen} onOpenChange={setIsCreateReportOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm gap-2">
                                <Plus className="w-4 h-4" /> New Report
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[480px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">Report <span className="text-indigo-600">Forge</span></DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-5 py-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Report Title</Label>
                                    <Input value={newReport.name} onChange={(e) => setNewReport({ ...newReport, name: e.target.value })} placeholder="e.g. Q4 Growth Projection" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700">Perspective</Label>
                                        <Select value={newReport.type} onValueChange={(v) => setNewReport({ ...newReport, type: v })}>
                                            <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold shadow-none text-slate-900">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="Financial">Financial Statement</SelectItem>
                                                <SelectItem value="Compliance">Compliance Audit</SelectItem>
                                                <SelectItem value="Strategy">Strategy Matrix</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700">Initial Status</Label>
                                        <Select value={newReport.status} onValueChange={(v) => setNewReport({ ...newReport, status: v })}>
                                            <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold shadow-none text-slate-900">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="Ready">Ready</SelectItem>
                                                <SelectItem value="Generated">Generated</SelectItem>
                                                <SelectItem value="Processing">Processing</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700">Fiscal Period</Label>
                                        <Input value={newReport.period} onChange={(e) => setNewReport({ ...newReport, period: e.target.value })} placeholder="e.g. Q4 2024" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700">Est. File Size</Label>
                                        <Select value={newReport.size} onValueChange={(v) => setNewReport({ ...newReport, size: v })}>
                                            <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold shadow-none text-slate-900">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="0.5MB">0.5 MB</SelectItem>
                                                <SelectItem value="1.0MB">1.0 MB</SelectItem>
                                                <SelectItem value="1.8MB">1.8 MB</SelectItem>
                                                <SelectItem value="2.4MB">2.4 MB</SelectItem>
                                                <SelectItem value="3.2MB">3.2 MB</SelectItem>
                                                <SelectItem value="-">Not available yet</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/20" onClick={handleCreateReport}>Provision Intelligence</Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Core Snapshot Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Net Revenue (Mtd)", value: "$1.24m", change: "+12.5%", trend: "up", icon: TrendingUp, color: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100/50 text-emerald-600" },
                    { label: "Operating Burn", value: "$324k", change: "+8.3%", trend: "up", icon: BarChart3, color: "bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-100/50 text-rose-600" },
                    { label: "Cash On Hand", value: "$1.18m", icon: Database, color: "bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-100/50 text-indigo-600" },
                    { label: "Profit Margin", value: "74.2%", icon: Zap, color: "bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-100/50 text-amber-600" }
                ].map((stat, i) => (
                    <Card key={i} className={`${stat.color} p-6 rounded-3xl border shadow-sm group hover:shadow-md transition-all`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-11 w-11 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-current opacity-20">
                                <stat.icon className="w-5 h-5" />
                            </div>
                            {stat.change && (
                                <Badge variant="outline" className="font-semibold text-[10px] bg-white border-emerald-100 text-emerald-600 tracking-tight">{stat.change} ↑</Badge>
                            )}
                        </div>
                        <p className="text-[12px] font-medium text-slate-500 leading-none mb-1">{stat.label}</p>
                        <h4 className="text-xl font-semibold text-slate-900">{stat.value}</h4>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="archive" className="space-y-6">
                <TabsList className="bg-white border border-slate-200 p-1.5 rounded-2xl h-14 w-fit shadow-sm">
                    <TabsTrigger value="archive" className="px-8 rounded-xl data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500 transition-all">Report Archive</TabsTrigger>
                    <TabsTrigger value="templates" className="px-8 rounded-xl data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500 transition-all">Strategy Templates</TabsTrigger>
                </TabsList>

                <TabsContent value="archive">
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white border border-slate-100">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <CardTitle className="text-xl font-semibold text-slate-900">Document Repository</CardTitle>
                            <div className="relative w-full md:w-80 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors w-4 h-4" />
                                <Input
                                    placeholder="Search documents by name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 h-11 bg-slate-50 border-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4 text-slate-900">
                            {filteredReports.map((rpt, idx) => (
                                <div key={idx} className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:bg-white hover:shadow-xl transition-all">
                                    <div className="flex items-center gap-5 flex-1">
                                        <div className="h-14 w-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                                            <FileText className="w-7 h-7 text-indigo-600 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-md font-semibold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors leading-none">{rpt.name}</h4>
                                                <Badge className={`text-[10px] font-semibold px-2.5 py-0.5 border-0 rounded-full ${rpt.status === 'Ready' || rpt.status === 'Generated' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>{rpt.status}</Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-6 text-[11px] font-medium text-slate-400">
                                                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date: {rpt.date}</span>
                                                <span className="flex items-center gap-1.5"><PieChart className="w-3.5 h-3.5" /> Type: {rpt.type}</span>
                                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Period: {rpt.period}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 ml-auto lg:ml-0">
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-slate-900">{rpt.size}</p>
                                            <p className="text-[10px] font-medium text-slate-400">File Volume</p>
                                        </div>
                                        <div className="flex items-center gap-2 border-l border-slate-200 pl-6 shrink-0 text-slate-900">
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-indigo-600" onClick={() => handleAction("Downloading asset package")}><DownloadCloud className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-indigo-600" onClick={() => setSelectedReport(rpt)}><Eye className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-rose-600" onClick={() => handleDeleteReport(rpt.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="templates">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-900">
                        {templates.map((tmpl, idx) => (
                            <Card key={idx} className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 p-8 space-y-6 hover:shadow-2xl transition-all bg-white border border-slate-100 group">
                                <div className="flex items-center justify-between">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border border-current opacity-20 ${tmpl.color.replace('bg-', 'text-')}`}>
                                        <FileCode className="w-6 h-6" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-slate-100 text-slate-500 font-semibold text-[10px] border-0">{tmpl.frequency}</Badge>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-rose-600" onClick={() => handleDeleteTemplate(tmpl.title)}><Trash2 className="w-3 h-3" /></Button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-lg font-semibold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">{tmpl.title}</h4>
                                    <p className="text-[11px] font-medium text-slate-400">{tmpl.desc}</p>
                                </div>
                                <Button className="w-full rounded-xl h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs gap-2 transition-all" onClick={() => handleAction(`Dynamic compilation for ${tmpl.title} started`)}>
                                    <Zap className="w-3 h-3 text-amber-400" /> Run Intel Engine
                                </Button>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* View Report Modal */}
            <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit text-slate-900">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">Intelligence <span className="text-indigo-600">Snapshot</span></DialogTitle>
                    </DialogHeader>
                    {selectedReport && (
                        <div className="space-y-6 py-4">
                            <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Document ID</p>
                                        <p className="text-lg font-bold text-slate-900">{selectedReport.id}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge className={`${selectedReport.status === 'Ready' || selectedReport.status === 'Generated' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{selectedReport.status}</Badge>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-slate-400">Report Label</p>
                                    <p className="text-md font-bold text-slate-900">{selectedReport.name}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-slate-400">Perspective</p>
                                        <Badge variant="outline" className="bg-indigo-50 border-indigo-100 text-indigo-600 font-bold">{selectedReport.type}</Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-slate-400">Fiscal Period</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedReport.period}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-slate-400">File Volume</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedReport.size}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-slate-400">Generation Date</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedReport.date}</p>
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold gap-2 transition-all mt-4" onClick={() => handleAction(`Downloading ${selectedReport.id} package...`)}>
                                <DownloadCloud className="w-4 h-4" /> Secure Download
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
