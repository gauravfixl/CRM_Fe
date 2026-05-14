"use client"

import React, { useState, useMemo } from 'react'
import {
    Plus,
    Download,
    Trash2,
    FileText,
    Search,
    Play,
    RefreshCw,
    Clock,
    Database,
    Zap,
    Share2,
    Settings,
    Calendar,
    Loader2,
    PencilLine,
    Eye
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { useRouter } from 'next/navigation'
import { toast } from "@/shared/utils/toast"

interface CustomReport {
    id: string
    name: string
    type: string
    description: string
    filters: string
    columns: string
    created: string
    lastRun: string
    runs: number
    status: 'Active' | 'Draft'
}

const INITIAL_REPORTS: CustomReport[] = [
    { id: "CR-001", name: "Monthly Revenue Matrix", type: "Financial", description: "Aggregated revenue per stream", filters: "stream,region", columns: "stream,amount,target,growth", created: "2024-01-15", lastRun: "2h ago", runs: 142, status: "Active" },
    { id: "CR-002", name: "Strategic Churn Forecast", type: "Intelligence", description: "Churn-risk projections by cohort", filters: "industry,health", columns: "client,risk,csm,revenue", created: "2024-02-20", lastRun: "1d ago", runs: 28, status: "Active" },
    { id: "CR-003", name: "Sales Pipeline Dynamics", type: "Operations", description: "Pipeline movement breakdown", filters: "stage,owner", columns: "deal,stage,value,close", created: "2024-03-10", lastRun: "3d ago", runs: 15, status: "Draft" }
]

const DATA_BY_PERIOD = {
    monthly: { generated: "1,420", automated: "24" },
    quarterly: { generated: "4,260", automated: "32" },
    yearly: { generated: "18,450", automated: "48" }
}

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
}

export default function CustomReports() {
    const router = useRouter()
    const [period, setPeriod] = useState("monthly")
    const [isSyncing, setIsSyncing] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [reports, setReports] = useState<CustomReport[]>(INITIAL_REPORTS)

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState({ name: "", type: "Custom", description: "", filters: "", columns: "" })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [selected, setSelected] = useState<CustomReport | null>(null)

    const activeData = useMemo(() => DATA_BY_PERIOD[period as keyof typeof DATA_BY_PERIOD], [period])

    const filteredReports = useMemo(() => {
        return reports.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.type.toLowerCase().includes(searchQuery.toLowerCase()))
    }, [reports, searchQuery])

    const setField = (k: string, v: any) => {
        setForm(prev => ({ ...prev, [k]: v }))
        if (errors[k]) setErrors(prev => { const c = { ...prev }; delete c[k]; return c })
    }

    const validate = () => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(3)(form.name)
        errs.columns = validators.required(form.columns) || validators.minLen(2)(form.columns)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", type: "Custom", description: "", filters: "", columns: "" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (r: CustomReport) => {
        setEditingId(r.id)
        setForm({ name: r.name, type: r.type, description: r.description, filters: r.filters, columns: r.columns })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setReports(reports.map(r => r.id === editingId ? { ...r, ...form } as CustomReport : r))
            toast.success("Report updated")
        } else {
            const newReport: CustomReport = {
                id: `CR-${String(reports.length + 1).padStart(3, '0')}`,
                name: form.name.trim(),
                type: form.type,
                description: form.description.trim(),
                filters: form.filters.trim(),
                columns: form.columns.trim(),
                created: new Date().toISOString().split('T')[0],
                lastRun: "Never",
                runs: 0,
                status: "Draft"
            }
            setReports([newReport, ...reports])
            toast.success("Custom report created")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: string, name: string) => {
        setReports(reports.filter(r => r.id !== id))
        toast.success(`${name} removed from library`)
    }

    const handleRun = (r: CustomReport) => {
        setReports(reports.map(x => x.id === r.id ? { ...x, runs: x.runs + 1, lastRun: "Just now", status: "Active" as const } : x))
        toast.success(`${r.name} execution started`)
    }

    const openDetail = (r: CustomReport) => { setSelected(r); setIsDetailOpen(true) }

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(new Promise(r => setTimeout(r, 1500)),
            { loading: 'Synchronizing custom library...', success: 'Library synchronized', error: 'Sync failed' }
        ).finally(() => setIsSyncing(false))
    }

    const handleExportPDF = () => {
        toast.promise(new Promise(r => setTimeout(r, 1800)),
            { loading: 'Generating inventory PDF...', success: 'Custom inventory PDF exported', error: 'PDF export failed' })
    }

    const handleExportCSV = () => {
        toast.promise(new Promise(r => setTimeout(r, 1200)),
            { loading: 'Generating inventory CSV...', success: 'Custom inventory CSV exported', error: 'CSV export failed' })
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b border-slate-200">
                <div className="px-6 py-6 font-outfit">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">Custom Reports</h1>
                            <p className="text-[14px] text-slate-500 font-medium mt-1">Architect custom strategic assets and automated data pipelines</p>
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
                                <Plus className="w-4 h-4" /> New Report
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                        {[
                            { label: "Active Custom Assets", value: reports.length, icon: Database, bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-200/50", path: "/client-management/reports/scheduled" },
                            { label: "Reports Generated (7d)", value: activeData.generated, icon: Zap, bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", iconBg: "bg-amber-100", iconColor: "text-amber-600", border: "border-amber-200/50", path: "/client-management/reports/executive" },
                            { label: "Automated Schedules", value: activeData.automated, icon: Clock, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-200/50", path: "/client-management/reports/scheduled" }
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
                        <CardTitle className="text-xl font-bold text-slate-900">Custom Intelligence Library</CardTitle>
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors w-4 h-4" />
                            <Input
                                placeholder="Find strategic asset..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-11 bg-slate-50 border-0 rounded-none text-sm font-medium focus:ring-1 focus:ring-indigo-100"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-4">
                        {filteredReports.map((report) => (
                            <div key={report.id} className="p-6 bg-slate-50/50 border border-slate-100 rounded-none flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-white hover:shadow-lg hover:border-indigo-100 transition-all group cursor-pointer" onClick={() => openDetail(report)}>
                                <div className="flex items-center gap-5 flex-1">
                                    <div className="h-14 w-14 rounded-none bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                                        <FileText className="w-7 h-7 text-indigo-600" />
                                    </div>
                                    <div className="space-y-1.5 text-slate-600">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h4 className="text-md font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors leading-none">{report.name}</h4>
                                            <Badge className={`text-[9px] font-semibold px-2.5 py-0.5 rounded-none border-0 ${report.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{report.status}</Badge>
                                            <Badge variant="outline" className="text-[9px] font-semibold px-2.5 py-0.5 rounded-none bg-slate-50 border-slate-200 text-slate-400">{report.type}</Badge>
                                        </div>
                                        <div className="flex items-center gap-6 text-[11px] font-bold text-slate-400 flex-wrap">
                                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Last Run: {report.lastRun}</span>
                                            <span className="flex items-center gap-1.5"><Play className="w-3.5 h-3.5 text-indigo-600" /> Executions: {report.runs}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 ml-auto lg:ml-0" onClick={(e) => e.stopPropagation()}>
                                    <Button variant="outline" className="h-11 px-6 rounded-none border-slate-200 font-bold text-slate-600 bg-white shadow-sm hover:bg-indigo-50 group-hover:border-indigo-200 gap-2" onClick={() => handleRun(report)}>
                                        <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" /> Run
                                    </Button>
                                    <div className="flex items-center border border-slate-100 rounded-none bg-white overflow-hidden shadow-sm">
                                        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-none hover:bg-indigo-50 text-slate-400 hover:text-indigo-600" onClick={() => openEdit(report)}>
                                            <PencilLine className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-none hover:bg-rose-50 text-slate-400 hover:text-rose-600" onClick={() => handleDelete(report.id, report.name)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredReports.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <div className="h-20 w-20 rounded-none bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200">
                                    <Search className="w-8 h-8 text-slate-200" />
                                </div>
                                <p className="text-slate-400 font-bold">No assets match your defined parameters.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <Card className="rounded-none border shadow-sm p-8 space-y-4 bg-white hover:border-indigo-100 transition-all font-outfit cursor-pointer" onClick={() => router.push('/client-management/reports/scheduled')}>
                        <CardContent className="p-0 space-y-4">
                            <div className="h-12 w-12 rounded-none bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                <Share2 className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 tracking-tight">Collaboration Hub</h4>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">Share custom reporting templates across various organizational nodes for synchronized intelligence.</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-none border shadow-sm p-8 space-y-4 bg-white hover:border-amber-100 transition-all font-outfit cursor-pointer" onClick={() => toast.success("Opening data layer configuration...")}>
                        <CardContent className="p-0 space-y-4">
                            <div className="h-12 w-12 rounded-none bg-amber-50 flex items-center justify-center border border-amber-100">
                                <Settings className="w-6 h-6 text-amber-600" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 tracking-tight">Dynamic Data Layer</h4>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">Map custom report parameters directly to your organization's unified data lake for zero-latency lookups.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Sheet (Create/Edit) */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Custom Report" : "Create Custom Report"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Configure a tailored intelligence asset.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g., Regional Performance Matrix" className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`} />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Type</Label>
                            <Select value={form.type} onValueChange={(v: any) => setField("type", v)}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="Custom">Custom</SelectItem>
                                    <SelectItem value="Financial">Financial</SelectItem>
                                    <SelectItem value="Operations">Operations</SelectItem>
                                    <SelectItem value="Intelligence">Intelligence</SelectItem>
                                    <SelectItem value="Performance">Performance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Description</Label>
                            <Textarea value={form.description} onChange={e => setField("description", e.target.value)} placeholder="Outline the strategic purpose..." className="rounded-none min-h-[80px]" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Filters (comma separated)</Label>
                            <Input value={form.filters} onChange={e => setField("filters", e.target.value)} placeholder="e.g., region, status, owner" className="h-10 rounded-none" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Columns (comma separated) <span className="text-rose-500">*</span></Label>
                            <Input value={form.columns} onChange={e => setField("columns", e.target.value)} placeholder="e.g., name, value, status, date" className={`h-10 rounded-none ${errors.columns ? "border-rose-500" : ""}`} />
                            {errors.columns && <p className="text-[11px] text-rose-500">{errors.columns}</p>}
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>{editingId ? "Save Changes" : "Create Report"}</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Report Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">{selected.id}</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                                    <div className="flex gap-2 mt-2">
                                        <Badge className={`rounded-none border-0 ${selected.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{selected.status}</Badge>
                                        <Badge variant="outline" className="rounded-none">{selected.type}</Badge>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Created</p><p className="font-semibold text-slate-900">{selected.created}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Last Run</p><p className="font-semibold text-slate-900">{selected.lastRun}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Total Runs</p><p className="font-semibold text-slate-900">{selected.runs}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Type</p><p className="font-semibold text-slate-900">{selected.type}</p></div>
                                </div>
                                {selected.description && (
                                    <div className="pt-3 border-t">
                                        <p className="text-[11px] text-slate-400 uppercase mb-1">Description</p>
                                        <p className="text-sm text-slate-700">{selected.description}</p>
                                    </div>
                                )}
                                <div className="pt-3 border-t">
                                    <p className="text-[11px] text-slate-400 uppercase mb-1">Filters</p>
                                    <p className="text-sm text-slate-700">{selected.filters || "—"}</p>
                                </div>
                                <div className="pt-3 border-t">
                                    <p className="text-[11px] text-slate-400 uppercase mb-1">Columns</p>
                                    <p className="text-sm text-slate-700">{selected.columns}</p>
                                </div>
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
