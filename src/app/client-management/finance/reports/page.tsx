"use client"

import React, { useState, useMemo } from 'react'
import { useRouter } from "next/navigation"
import {
    Search,
    Plus,
    Trash2,
    Eye,
    FileText,
    TrendingUp,
    Calendar,
    BarChart3,
    DownloadCloud,
    PieChart,
    Clock,
    Database,
    Zap,
    FileCode,
    Printer,
    PencilLine,
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Label } from "@/shared/components/ui/label"
import { toast } from "@/shared/utils/toast"

interface Report {
    id: string
    name: string
    type: 'Financial' | 'Compliance' | 'Strategy'
    period: string
    date: string
    status: 'Ready' | 'Generated' | 'Processing'
    size: string
}

interface Template {
    title: string
    desc: string
    frequency: 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual'
    color: string
}

const INITIAL_REPORTS: Report[] = [
    { id: "RPT-001", name: "Executive P&L Snapshot", type: "Financial", period: "Sep 2024", date: "2024-10-01", status: "Ready", size: "2.4MB" },
    { id: "RPT-002", name: "Global Balance Nexus", type: "Compliance", period: "Q3 2024", date: "2024-10-02", status: "Generated", size: "1.8MB" },
    { id: "RPT-003", name: "Cash Velocity Audit", type: "Strategy", period: "Sep 2024", date: "2024-10-02", status: "Processing", size: "-" }
]

const INITIAL_TEMPLATES: Template[] = [
    { title: "Standard Profit & Loss", desc: "ASC 606 compliant income summary", frequency: "Monthly", color: "bg-blue-500" },
    { title: "Liquidity Pulse", desc: "Real-time cash flow and burn analysis", frequency: "Weekly", color: "bg-emerald-500" },
    { title: "Tax Liability Matrix", desc: "Multi-regional tax exposure report", frequency: "Quarterly", color: "bg-amber-500" }
]

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
}

export default function FinancialReports() {
    const router = useRouter()
    const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS)
    const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES)
    const [searchQuery, setSearchQuery] = useState("")

    // Report form
    const [isReportFormOpen, setIsReportFormOpen] = useState(false)
    const [editingReportId, setEditingReportId] = useState<string | null>(null)
    const [reportForm, setReportForm] = useState<{ name: string; type: Report['type']; period: string; size: string; status: Report['status'] }>({
        name: '', type: 'Financial', period: '', size: '1.0MB', status: 'Ready'
    })
    const [reportErrors, setReportErrors] = useState<Record<string, string>>({})
    const [isReportDetailOpen, setIsReportDetailOpen] = useState(false)
    const [selectedReport, setSelectedReport] = useState<Report | null>(null)

    // Template form
    const [isTemplateFormOpen, setIsTemplateFormOpen] = useState(false)
    const [editingTemplateTitle, setEditingTemplateTitle] = useState<string | null>(null)
    const [templateForm, setTemplateForm] = useState<{ title: string; desc: string; frequency: Template['frequency']; color: string }>({
        title: '', desc: '', frequency: 'Monthly', color: 'bg-blue-500'
    })
    const [templateErrors, setTemplateErrors] = useState<Record<string, string>>({})

    // Report helpers
    const setReportFieldFn = (f: string, v: any) => {
        setReportForm(p => ({ ...p, [f]: v }))
        if (reportErrors[f]) setReportErrors(p => { const c = { ...p }; delete c[f]; return c })
    }
    const validateReport = () => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(reportForm.name) || validators.minLen(3)(reportForm.name)
        errs.period = validators.required(reportForm.period)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setReportErrors(errs)
        return Object.keys(errs).length === 0
    }
    const openCreateReport = () => {
        setEditingReportId(null)
        setReportForm({ name: '', type: 'Financial', period: '', size: '1.0MB', status: 'Ready' })
        setReportErrors({})
        setIsReportFormOpen(true)
    }
    const openEditReport = (r: Report) => {
        setEditingReportId(r.id)
        setReportForm({ name: r.name, type: r.type, period: r.period, size: r.size, status: r.status })
        setReportErrors({})
        setIsReportFormOpen(true)
    }
    const handleSaveReport = () => {
        if (!validateReport()) { toast.error("Please correct the highlighted fields"); return }
        if (editingReportId) {
            setReports(reports.map(r => r.id === editingReportId ? { ...r, name: reportForm.name.trim(), type: reportForm.type, period: reportForm.period.trim(), size: reportForm.size, status: reportForm.status } : r))
            toast.success("Report updated")
        } else {
            const id = `RPT-${String(reports.length + 1).padStart(3, '0')}`
            const report: Report = {
                id, name: reportForm.name.trim(), type: reportForm.type,
                period: reportForm.period.trim(),
                date: new Date().toISOString().split('T')[0],
                status: reportForm.status, size: reportForm.size,
            }
            setReports([report, ...reports])
            toast.success(`Report ${id} generated`)
        }
        setIsReportFormOpen(false)
    }
    const handleDeleteReport = (id: string) => {
        setReports(reports.filter(r => r.id !== id))
        toast.success("Report removed")
    }
    const openReportDetail = (r: Report) => {
        setSelectedReport(r)
        setIsReportDetailOpen(true)
    }

    // Template helpers
    const setTemplateFieldFn = (f: string, v: any) => {
        setTemplateForm(p => ({ ...p, [f]: v }))
        if (templateErrors[f]) setTemplateErrors(p => { const c = { ...p }; delete c[f]; return c })
    }
    const validateTemplate = () => {
        const errs: Record<string, string> = {}
        errs.title = validators.required(templateForm.title) || validators.minLen(3)(templateForm.title)
        errs.desc = validators.required(templateForm.desc)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setTemplateErrors(errs)
        return Object.keys(errs).length === 0
    }
    const openCreateTemplate = () => {
        setEditingTemplateTitle(null)
        setTemplateForm({ title: '', desc: '', frequency: 'Monthly', color: 'bg-blue-500' })
        setTemplateErrors({})
        setIsTemplateFormOpen(true)
    }
    const openEditTemplate = (t: Template) => {
        setEditingTemplateTitle(t.title)
        setTemplateForm({ title: t.title, desc: t.desc, frequency: t.frequency, color: t.color })
        setTemplateErrors({})
        setIsTemplateFormOpen(true)
    }
    const handleSaveTemplate = () => {
        if (!validateTemplate()) { toast.error("Please correct the highlighted fields"); return }
        const data: Template = { title: templateForm.title.trim(), desc: templateForm.desc.trim(), frequency: templateForm.frequency, color: templateForm.color }
        if (editingTemplateTitle) {
            setTemplates(templates.map(t => t.title === editingTemplateTitle ? data : t))
            toast.success("Template updated")
        } else {
            setTemplates([data, ...templates])
            toast.success("Template created")
        }
        setIsTemplateFormOpen(false)
    }
    const handleDeleteTemplate = (title: string) => {
        setTemplates(templates.filter(t => t.title !== title))
        toast.success("Template removed")
    }

    const filteredReports = useMemo(() =>
        reports.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.type.toLowerCase().includes(searchQuery.toLowerCase()))
        , [reports, searchQuery])

    const kpis = [
        { label: "Net Revenue (MTD)", value: "$1.24m", change: "+12.5%", icon: TrendingUp, color: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100/50 text-emerald-600", path: "/client-management/revenue/overview" },
        { label: "Operating Burn", value: "$324k", change: "+8.3%", icon: BarChart3, color: "bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-100/50 text-rose-600", path: "/client-management/finance/expenses" },
        { label: "Cash On Hand", value: "$1.18m", icon: Database, color: "bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-100/50 text-indigo-600", path: "/client-management/finance/accounting" },
        { label: "Profit Margin", value: "74.2%", icon: Zap, color: "bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-100/50 text-amber-600", path: "/client-management/analytics/forecasting" }
    ]

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">Financial <span className="text-indigo-600">Intel</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Generate deep-dive fiscal analysis, compliance documentation, and strategic templates</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-none border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={() => toast.success("Bulk report archive triggered")}>
                        <Printer className="w-4 h-4 text-slate-400" /> Print All
                    </Button>
                    <Button className="h-11 px-6 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm gap-2" onClick={openCreateReport}>
                        <Plus className="w-4 h-4" /> New Report
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {kpis.map((stat, i) => (
                    <Card key={i} className={`${stat.color} p-6 rounded-none border shadow-sm hover:shadow-md transition-all cursor-pointer`} onClick={() => router.push(stat.path)}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-11 w-11 rounded-none flex items-center justify-center bg-white shadow-sm border border-current opacity-90">
                                <stat.icon className="w-5 h-5" />
                            </div>
                            {stat.change && (
                                <Badge variant="outline" className="font-semibold text-[10px] bg-white border-emerald-100 text-emerald-600 tracking-tight rounded-none">{stat.change} ↑</Badge>
                            )}
                        </div>
                        <p className="text-[12px] font-medium text-slate-500 leading-none mb-1">{stat.label}</p>
                        <h4 className="text-xl font-semibold text-slate-900">{stat.value}</h4>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="archive" className="space-y-6">
                <TabsList className="bg-white border border-slate-200 p-1.5 rounded-none h-14 w-fit shadow-sm">
                    <TabsTrigger value="archive" className="px-8 rounded-none data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500">Report Archive</TabsTrigger>
                    <TabsTrigger value="templates" className="px-8 rounded-none data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500">Strategy Templates</TabsTrigger>
                </TabsList>

                <TabsContent value="archive">
                    <Card className="rounded-none shadow-xl shadow-slate-200/50 bg-white border border-slate-100">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <CardTitle className="text-xl font-semibold text-slate-900">Document Repository</CardTitle>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative w-full md:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search documents..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 h-11 bg-slate-50 border-slate-100 rounded-none text-sm font-medium"
                                    />
                                </div>
                                <Button className="h-11 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2 px-4" onClick={openCreateReport}>
                                    <Plus className="w-4 h-4" /> New
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4 text-slate-900">
                            {filteredReports.length > 0 ? filteredReports.map((rpt) => (
                                <div
                                    key={rpt.id}
                                    className="p-6 bg-slate-50/50 border border-slate-100 rounded-none flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:bg-white hover:shadow-xl transition-all cursor-pointer"
                                    onClick={() => openReportDetail(rpt)}
                                >
                                    <div className="flex items-center gap-5 flex-1">
                                        <div className="h-14 w-14 rounded-none bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                                            <FileText className="w-7 h-7 text-indigo-600 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h4 className="text-md font-semibold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors leading-none">{rpt.name}</h4>
                                                <Badge className={`text-[10px] font-semibold px-2.5 py-0.5 border-0 rounded-none ${rpt.status === 'Ready' || rpt.status === 'Generated' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{rpt.status}</Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-6 text-[11px] font-medium text-slate-400">
                                                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {rpt.date}</span>
                                                <span className="flex items-center gap-1.5"><PieChart className="w-3.5 h-3.5" /> {rpt.type}</span>
                                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {rpt.period}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 ml-auto lg:ml-0" onClick={(e) => e.stopPropagation()}>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-slate-900">{rpt.size}</p>
                                            <p className="text-[10px] font-medium text-slate-400">File Volume</p>
                                        </div>
                                        <div className="flex items-center gap-2 border-l border-slate-200 pl-6 shrink-0">
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none text-slate-400 hover:text-indigo-600" onClick={() => toast.success("Downloading...")}><DownloadCloud className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none text-slate-400 hover:text-indigo-600" onClick={() => openReportDetail(rpt)}><Eye className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none text-slate-400 hover:text-indigo-600" onClick={() => openEditReport(rpt)}><PencilLine className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none text-slate-400 hover:text-rose-600" onClick={() => handleDeleteReport(rpt.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12 text-sm text-slate-500">No reports match your search.</div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="templates">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-900">
                        {templates.map((tmpl, idx) => (
                            <Card key={idx} className="rounded-none shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all bg-white border border-slate-100 group">
                                <CardContent className="p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className={`h-12 w-12 rounded-none flex items-center justify-center border border-current ${tmpl.color.replace('bg-', 'text-')}`}>
                                            <FileCode className="w-6 h-6" />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Badge className="bg-slate-100 text-slate-500 font-semibold text-[10px] border-0 rounded-none">{tmpl.frequency}</Badge>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none text-slate-400 hover:text-indigo-600" onClick={() => openEditTemplate(tmpl)}><PencilLine className="w-3.5 h-3.5" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none text-slate-400 hover:text-rose-600" onClick={() => handleDeleteTemplate(tmpl.title)}><Trash2 className="w-3.5 h-3.5" /></Button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-semibold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">{tmpl.title}</h4>
                                        <p className="text-[11px] font-medium text-slate-400">{tmpl.desc}</p>
                                    </div>
                                    <Button className="w-full rounded-none h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs gap-2 transition-all" onClick={() => toast.success(`Compilation for ${tmpl.title} started`)}>
                                        <Zap className="w-3 h-3 text-amber-400" /> Run Engine
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                        <Card className="rounded-none border-2 border-dashed border-slate-200 bg-transparent shadow-none hover:border-indigo-400 hover:bg-slate-50 transition-all cursor-pointer" onClick={openCreateTemplate}>
                            <CardContent className="p-8 flex flex-col items-center justify-center gap-3 h-full min-h-[260px]">
                                <div className="h-12 w-12 rounded-none border-2 border-dashed border-slate-300 flex items-center justify-center">
                                    <Plus className="w-5 h-5 text-slate-400" />
                                </div>
                                <span className="text-sm font-semibold text-slate-500">New Template</span>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Report Form Sheet */}
            <Sheet open={isReportFormOpen} onOpenChange={setIsReportFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold">{editingReportId ? "Edit Report" : "New Report"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Forge a fiscal intelligence report.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Report Title <span className="text-rose-500">*</span></Label>
                            <Input value={reportForm.name} onChange={e => setReportFieldFn("name", e.target.value)} placeholder="e.g., Q4 Growth Projection" className={`h-10 rounded-none ${reportErrors.name ? "border-rose-500" : ""}`} />
                            {reportErrors.name && <p className="text-[11px] text-rose-500">{reportErrors.name}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Type</Label>
                                <Select value={reportForm.type} onValueChange={(v: any) => setReportFieldFn("type", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Financial">Financial Statement</SelectItem>
                                        <SelectItem value="Compliance">Compliance Audit</SelectItem>
                                        <SelectItem value="Strategy">Strategy Matrix</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Status</Label>
                                <Select value={reportForm.status} onValueChange={(v: any) => setReportFieldFn("status", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Ready">Ready</SelectItem>
                                        <SelectItem value="Generated">Generated</SelectItem>
                                        <SelectItem value="Processing">Processing</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Fiscal Period <span className="text-rose-500">*</span></Label>
                                <Input value={reportForm.period} onChange={e => setReportFieldFn("period", e.target.value)} placeholder="Q4 2024" className={`h-10 rounded-none ${reportErrors.period ? "border-rose-500" : ""}`} />
                                {reportErrors.period && <p className="text-[11px] text-rose-500">{reportErrors.period}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">File Size</Label>
                                <Select value={reportForm.size} onValueChange={(v) => setReportFieldFn("size", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="0.5MB">0.5 MB</SelectItem>
                                        <SelectItem value="1.0MB">1.0 MB</SelectItem>
                                        <SelectItem value="1.8MB">1.8 MB</SelectItem>
                                        <SelectItem value="2.4MB">2.4 MB</SelectItem>
                                        <SelectItem value="3.2MB">3.2 MB</SelectItem>
                                        <SelectItem value="-">N/A</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsReportFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSaveReport}>{editingReportId ? "Save Changes" : "Generate"}</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Report Detail Sheet */}
            <Sheet open={isReportDetailOpen} onOpenChange={setIsReportDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Report Details</SheetTitle>
                    </SheetHeader>
                    {selectedReport && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="flex justify-between items-center p-5 bg-slate-50 rounded-none border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-none bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-slate-400 uppercase tracking-wider">Document ID</p>
                                            <p className="text-lg font-bold text-slate-900">{selectedReport.id}</p>
                                        </div>
                                    </div>
                                    <Badge className={`rounded-none border-0 ${selectedReport.status === 'Ready' || selectedReport.status === 'Generated' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{selectedReport.status}</Badge>
                                </div>
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase">Title</p>
                                    <p className="text-md font-bold text-slate-900">{selectedReport.name}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Type</p><Badge variant="outline" className="rounded-none bg-indigo-50 border-indigo-100 text-indigo-600">{selectedReport.type}</Badge></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Period</p><p className="text-sm font-bold text-slate-900">{selectedReport.period}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Size</p><p className="text-sm font-bold text-slate-900">{selectedReport.size}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Date</p><p className="text-sm font-bold text-slate-900">{selectedReport.date}</p></div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button className="flex-1 h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-none gap-2" onClick={() => toast.success(`Downloading ${selectedReport.id}...`)}>
                                    <DownloadCloud className="h-4 w-4" /> Download
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsReportDetailOpen(false); openEditReport(selectedReport) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDeleteReport(selectedReport.id); setIsReportDetailOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" />Delete
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>

            {/* Template Form Sheet */}
            <Sheet open={isTemplateFormOpen} onOpenChange={setIsTemplateFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-emerald-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold">{editingTemplateTitle ? "Edit Template" : "New Template"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Define a reusable report template.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Title <span className="text-rose-500">*</span></Label>
                            <Input value={templateForm.title} onChange={e => setTemplateFieldFn("title", e.target.value)} placeholder="e.g., Quarterly Cash Flow" className={`h-10 rounded-none ${templateErrors.title ? "border-rose-500" : ""}`} />
                            {templateErrors.title && <p className="text-[11px] text-rose-500">{templateErrors.title}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Description <span className="text-rose-500">*</span></Label>
                            <Input value={templateForm.desc} onChange={e => setTemplateFieldFn("desc", e.target.value)} placeholder="Brief description..." className={`h-10 rounded-none ${templateErrors.desc ? "border-rose-500" : ""}`} />
                            {templateErrors.desc && <p className="text-[11px] text-rose-500">{templateErrors.desc}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Frequency</Label>
                                <Select value={templateForm.frequency} onValueChange={(v: any) => setTemplateFieldFn("frequency", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Weekly">Weekly</SelectItem>
                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                                        <SelectItem value="Annual">Annual</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Color Theme</Label>
                                <Select value={templateForm.color} onValueChange={(v) => setTemplateFieldFn("color", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="bg-blue-500">Blue</SelectItem>
                                        <SelectItem value="bg-emerald-500">Emerald</SelectItem>
                                        <SelectItem value="bg-amber-500">Amber</SelectItem>
                                        <SelectItem value="bg-indigo-500">Indigo</SelectItem>
                                        <SelectItem value="bg-rose-500">Rose</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsTemplateFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSaveTemplate}>{editingTemplateTitle ? "Save Changes" : "Create"}</Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
