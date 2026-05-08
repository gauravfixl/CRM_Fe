"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    LayoutGrid,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Settings2,
    Database,
    Table as TableIcon,
    BarChart3,
    PieChart as PieChartIcon,
    LineChart as LineChartIcon,
    Save,
    Share2,
    Download,
    MoreHorizontal,
    Trash2,
    Copy,
    PenLine,
    Columns,
    Layers,
    ListFilter,
    X
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"

interface Report {
    id: string
    name: string
    object: string
    type: string
    lastViewed: string
}

const INITIAL_REPORTS: Report[] = [
    { id: "1", name: "Weekly Sales Performance", object: "Pipeline", type: "Table", lastViewed: "2h ago" },
    { id: "2", name: "Lead Velocity by Channel", object: "Leads", type: "Line Chart", lastViewed: "1d ago" },
    { id: "3", name: "SLA Beach Audit (MQL)", object: "SLA", type: "Table", lastViewed: "3h ago" },
    { id: "4", name: "Owner Workload Balance", object: "Activity", type: "Bar Chart", lastViewed: "5d ago" },
]

const OBJECT_OPTIONS = ["Leads", "Pipeline", "Activity", "SLA", "Custom"]
const TYPE_OPTIONS = ["Table", "Bar Chart", "Line Chart", "Pie Chart"]

export default function CustomReportsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS)
    const [searchQuery, setSearchQuery] = useState("")
    const [showFilterForm, setShowFilterForm] = useState(false)
    const [filterObject, setFilterObject] = useState("all")
    const [filterType, setFilterType] = useState("all")
    const [appliedFilter, setAppliedFilter] = useState<{ object: string; type: string }>({ object: "all", type: "all" })
    const [isClient, setIsClient] = useState(false)

    const [showCreateForm, setShowCreateForm] = useState(false)
    const [editingReport, setEditingReport] = useState<Report | null>(null)
    const [formName, setFormName] = useState("")
    const [formObject, setFormObject] = useState("Leads")
    const [formType, setFormType] = useState("Table")
    const [formErrors, setFormErrors] = useState<{ name?: string; object?: string; type?: string }>({})

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleOpenCreate = () => {
        setEditingReport(null)
        setFormName("")
        setFormObject("Leads")
        setFormType("Table")
        setFormErrors({})
        setShowCreateForm(true)
    }

    const handleOpenEdit = (r: Report) => {
        setEditingReport(r)
        setFormName(r.name)
        setFormObject(r.object)
        setFormType(r.type)
        setFormErrors({})
        setShowCreateForm(true)
    }

    const handleDeleteReport = (id: string) => {
        setReports(reports.filter(r => r.id !== id))
        toast({ title: "Report Deleted", description: "The custom report has been permanently removed." })
    }

    const handleDuplicate = (r: Report) => {
        const copy: Report = { ...r, id: `rep-${Date.now()}`, name: `${r.name} (copy)`, lastViewed: "Just now" }
        setReports([copy, ...reports])
        toast({ title: "Report Duplicated", description: `"${copy.name}" added to your collection.` })
    }

    const handleSubmitForm = () => {
        const newErrors: { name?: string; object?: string; type?: string } = {}
        if (!formName.trim()) newErrors.name = "Report name is required"
        else if (formName.trim().length < 3) newErrors.name = "Name must be at least 3 characters"
        else if (formName.trim().length > 80) newErrors.name = "Name must be under 80 characters"
        if (!formObject) newErrors.object = "Data object is required"
        if (!formType) newErrors.type = "View type is required"

        if (Object.keys(newErrors).length) {
            setFormErrors(newErrors)
            return
        }
        setFormErrors({})

        if (editingReport) {
            setReports(reports.map(r => r.id === editingReport.id ? { ...r, name: formName.trim(), object: formObject, type: formType } : r))
            toast({ title: "Report Updated", description: `"${formName}" saved.` })
        } else {
            const newReport: Report = {
                id: `rep-${Date.now()}`,
                name: formName.trim(),
                object: formObject,
                type: formType,
                lastViewed: "Just now"
            }
            setReports([newReport, ...reports])
            toast({ title: "Report Saved", description: "Your custom report configuration has been saved." })
        }
        setShowCreateForm(false)
    }

    const handleApplyFilter = () => {
        setAppliedFilter({ object: filterObject, type: filterType })
        toast({ title: "Filter Applied", description: "Reports filtered by criteria." })
        setShowFilterForm(false)
    }

    const handleClearFilter = () => {
        setAppliedFilter({ object: "all", type: "all" })
        setFilterObject("all")
        setFilterType("all")
        toast({ title: "Filters Cleared", description: "All saved reports visible." })
    }

    const filteredReports = useMemo(() => {
        return reports.filter(r =>
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (appliedFilter.object === "all" || r.object === appliedFilter.object) &&
            (appliedFilter.type === "all" || r.type === appliedFilter.type)
        )
    }, [reports, searchQuery, appliedFilter])

    if (!isClient) return null

    return (
        <div style={{ zoom: 0.9 }}>
            <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-indigo-50 p-6 rounded-none border border-indigo-100 shadow-sm">
                    <div className="space-y-3">
                        <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-2 h-7 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600">
                            <ChevronLeft className="h-3 w-3 mr-1" /> Back
                        </Button>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-white text-indigo-600 border border-indigo-100 shadow-sm">
                                    <Columns className="h-5 w-5" />
                                </div>
                                <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                    Custom Report Builder
                                </h1>
                            </div>
                            <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                                Construct surgical-grade reports by selecting objects, filters, and visualization types. Save and share your unique business perspectives.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button onClick={() => toast({ title: "Export Started", description: "Compiling all reports for download..." })} variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-bold text-[12px] px-5">
                            <Download className="h-4 w-4 mr-2 text-slate-400" /> Export All
                        </Button>
                        <Button onClick={handleOpenCreate} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-indigo-100 shadow-lg border-none">
                            <Plus className="h-4 w-4 mr-2" /> New Report
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    <div className="lg:col-span-12 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[16px] font-bold text-slate-900">
                                Your Reports Collection
                                <span className="ml-2 text-[12px] text-slate-400 font-medium">({filteredReports.length} of {reports.length})</span>
                            </h3>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                                    <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search reports..." className="pl-9 h-9 w-64 text-[11px] font-bold uppercase tracking-wider" />
                                </div>
                                {(appliedFilter.object !== "all" || appliedFilter.type !== "all") && (
                                    <Button onClick={handleClearFilter} variant="outline" size="sm" className="h-9 text-[10px] font-bold uppercase">Clear</Button>
                                )}
                                <Button onClick={() => setShowFilterForm(true)} variant="ghost" size="icon" className="h-9 w-9 text-slate-400">
                                    <Filter size={18} />
                                </Button>
                            </div>
                        </div>

                        {filteredReports.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-none border border-slate-100">
                                <p className="text-[14px] font-medium text-slate-500">No reports match your filter or search.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {filteredReports.map((report) => (
                                    <Card key={report.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white group hover:ring-indigo-100 transition-all">
                                        <CardContent className="p-6 space-y-6">
                                            <div className="flex items-start justify-between">
                                                <div className={`p-3 rounded-2xl bg-indigo-50 text-indigo-600`}>
                                                    {report.type === "Table" ? <TableIcon size={22} /> : report.type === "Bar Chart" ? <BarChart3 size={22} /> : report.type === "Pie Chart" ? <PieChartIcon size={22} /> : <LineChartIcon size={22} />}
                                                </div>
                                                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-slate-100 text-slate-400 whitespace-nowrap">{report.object}</Badge>
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-[15px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{report.name}</h4>
                                                <p className="text-[11px] text-slate-400 font-medium">Last viewed: {report.lastViewed}</p>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                <div className="flex gap-1">
                                                    <Button size="icon" variant="ghost" onClick={() => handleOpenEdit(report)} className="h-8 w-8 text-slate-300 hover:text-indigo-600 transition-colors" title="Edit">
                                                        <PenLine size={14} />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" onClick={() => handleDuplicate(report)} className="h-8 w-8 text-slate-300 hover:text-slate-700 transition-colors" title="Duplicate">
                                                        <Copy size={14} />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" onClick={() => toast({ title: "Link Copied", description: "Report link copied to clipboard." })} className="h-8 w-8 text-slate-300 hover:text-slate-700 transition-colors" title="Share">
                                                        <Share2 size={14} />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" onClick={() => toast({ title: "Export Started", description: "Downloading report data..." })} className="h-8 w-8 text-slate-300 hover:text-slate-700 transition-colors" title="Download">
                                                        <Download size={14} />
                                                    </Button>
                                                </div>
                                                <Button size="icon" variant="ghost" onClick={() => handleDeleteReport(report.id)} className="h-8 w-8 text-slate-300 hover:text-rose-500 transition-colors" title="Delete">
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

            </div>

            {/* Create/Edit Slide-in */}
            {showCreateForm && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowCreateForm(false)} />
                    <div className="relative h-full w-full max-w-md bg-white shadow-2xl border-l border-slate-100 flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div>
                                <h3 className="text-[18px] font-bold text-slate-900">{editingReport ? "Edit Report" : "New Custom Report"}</h3>
                                <p className="text-[12px] text-slate-500">Configure your report definition</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setShowCreateForm(false)} className="h-9 w-9 text-slate-400 hover:text-slate-900">
                                <X size={18} />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Report Name <span className="text-rose-500">*</span></label>
                                <Input
                                    type="text"
                                    value={formName}
                                    onChange={(e) => { setFormName(e.target.value); if (formErrors.name) setFormErrors({ ...formErrors, name: undefined }) }}
                                    placeholder="e.g. Marketing ROI Q3"
                                    className={formErrors.name ? "border-rose-500" : ""}
                                />
                                {formErrors.name && <p className="text-[11px] text-rose-500 font-medium">{formErrors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Data Object <span className="text-rose-500">*</span></label>
                                <Select value={formObject} onValueChange={(v) => { setFormObject(v); if (formErrors.object) setFormErrors({ ...formErrors, object: undefined }) }}>
                                    <SelectTrigger className={`h-10 ${formErrors.object ? "border-rose-500" : ""}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {OBJECT_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {formErrors.object && <p className="text-[11px] text-rose-500 font-medium">{formErrors.object}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">View Type <span className="text-rose-500">*</span></label>
                                <Select value={formType} onValueChange={(v) => { setFormType(v); if (formErrors.type) setFormErrors({ ...formErrors, type: undefined }) }}>
                                    <SelectTrigger className={`h-10 ${formErrors.type ? "border-rose-500" : ""}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TYPE_OPTIONS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {formErrors.type && <p className="text-[11px] text-rose-500 font-medium">{formErrors.type}</p>}
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex gap-3">
                            <Button variant="outline" onClick={() => setShowCreateForm(false)} className="flex-1">Cancel</Button>
                            <Button onClick={handleSubmitForm} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
                                <Save className="h-4 w-4 mr-2" /> {editingReport ? "Update" : "Save"}
                            </Button>
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
                                <h3 className="text-[18px] font-bold text-slate-900">Filter Reports</h3>
                                <p className="text-[12px] text-slate-500">Refine the saved report list</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setShowFilterForm(false)} className="h-9 w-9 text-slate-400 hover:text-slate-900">
                                <X size={18} />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Data Object</label>
                                <Select value={filterObject} onValueChange={setFilterObject}>
                                    <SelectTrigger className="h-10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Objects</SelectItem>
                                        {OBJECT_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">View Type</label>
                                <Select value={filterType} onValueChange={setFilterType}>
                                    <SelectTrigger className="h-10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        {TYPE_OPTIONS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex gap-3">
                            <Button variant="outline" onClick={() => setShowFilterForm(false)} className="flex-1">Cancel</Button>
                            <Button onClick={handleApplyFilter} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">Apply</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
