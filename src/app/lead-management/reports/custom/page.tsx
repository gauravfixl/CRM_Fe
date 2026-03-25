"use client"

import React, { useState, useEffect } from "react"
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
    ListFilter
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

// --- Mock Data ---
const INITIAL_REPORTS = [
    { id: "1", name: "Weekly Sales Performance", object: "Pipeline", type: "Table", lastViewed: "2h ago" },
    { id: "2", name: "Lead Velocity by Channel", object: "Leads", type: "Line Chart", lastViewed: "1d ago" },
    { id: "3", name: "SLA Beach Audit (MQL)", object: "SLA", type: "Table", lastViewed: "3h ago" },
    { id: "4", name: "Owner Workload Balance", object: "Activity", type: "Bar Chart", lastViewed: "5d ago" },
]

export default function CustomReportsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [reports, setReports] = useState(INITIAL_REPORTS)
    const [isBuilding, setIsBuilding] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [reportName, setReportName] = useState("")
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleCreateReport = () => {
        setIsBuilding(true)
        setReportName("")
        toast({
            title: "Report Builder Initialized",
            description: "Select your primary data object to begin.",
        })
    }

    const handleDeleteReport = (id: string) => {
        setReports(reports.filter(r => r.id !== id))
        toast({ title: "Report Deleted", description: "The custom report has been permanently removed." })
    }

    const handleSaveReport = () => {
        if (!reportName.trim()) {
            toast({ title: "Validation Error", description: "Please enter a report name to save.", variant: "destructive" })
            return
        }
        const newReport = {
            id: `rep-${Date.now()}`,
            name: reportName,
            object: "Custom",
            type: "Table",
            lastViewed: "Just now"
        }
        setReports([newReport, ...reports])
        setIsBuilding(false)
        setReportName("")
        toast({ title: "Report Saved", description: "Your custom report configuration has been saved." })
    }

    const filteredReports = reports.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))

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
                                <Columns className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                Custom Report Builder
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Construct surgical-grade reports by selecting objects, filters, and visualization types. Save and share your unique business perspectives.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-bold text-[12px] px-5">
                        <Download className="h-4 w-4 mr-2 text-slate-400" /> Export All
                    </Button>
                    <Button
                        onClick={handleCreateReport}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-indigo-100 shadow-lg border-none"
                    >
                        <Plus className="h-4 w-4 mr-2" /> New Report
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Saved Reports Gallery */}
                {!isBuilding ? (
                    <div className="lg:col-span-12 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[16px] font-bold text-slate-900">Your Reports Collection</h3>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                                    <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search reports..." className="pl-9 h-9 w-64 rounded-xl border-slate-100 bg-white text-[11px] font-bold uppercase tracking-wider" />
                                </div>
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400"><Filter size={18} /></Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredReports.map((report) => (
                                <Card key={report.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white group hover:ring-indigo-100 transition-all cursor-pointer">
                                    <CardContent className="p-6 space-y-6">
                                        <div className="flex items-start justify-between">
                                            <div className={`p-3 rounded-2xl ${report.id === '1' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                                                {report.type === "Table" ? <TableIcon size={22} /> : report.type === "Bar Chart" ? <BarChart3 size={22} /> : <LineChartIcon size={22} />}
                                            </div>
                                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-slate-100 text-slate-400 whitespace-nowrap">{report.object}</Badge>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-[15px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{report.name}</h4>
                                            <p className="text-[11px] text-slate-400 font-medium">Last viewed: {report.lastViewed}</p>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                            <div className="flex gap-1">
                                                <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); toast({ title: "Link Copied", description: "Report link copied to clipboard." }) }} className="h-8 w-8 text-slate-300 hover:text-slate-600 transition-colors">
                                                    <Share2 size={14} />
                                                </Button>
                                                <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); toast({ title: "Export Started", description: "Downloading report data..." }) }} className="h-8 w-8 text-slate-300 hover:text-slate-600 transition-colors">
                                                    <Download size={14} />
                                                </Button>
                                            </div>
                                            <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleDeleteReport(report.id); }} className="h-8 w-8 text-slate-300 hover:text-rose-500 transition-colors">
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Builder Mock Interface */
                    <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                        {/* Configuration Sidebar */}
                        <Card className="lg:col-span-1 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6 space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">1. Data Source</p>
                                    <Select defaultValue="leads">
                                        <SelectTrigger className="h-10 rounded-xl border-slate-100 font-bold text-[13px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="leads">Leads</SelectItem>
                                            <SelectItem value="pipeline">Pipeline Engine</SelectItem>
                                            <SelectItem value="activities">Activity Logs</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">2. Report View</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'table', icon: TableIcon },
                                            { id: 'bar', icon: BarChart3 },
                                            { id: 'line', icon: LineChartIcon },
                                        ].map((t) => (
                                            <Button key={t.id} variant="outline" className="h-10 border-slate-100 rounded-xl hover:bg-slate-50">
                                                <t.icon size={16} className="text-slate-400" />
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-slate-50">
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">3. Select Fields</p>
                                    <div className="space-y-2">
                                        {['Lead Phase', 'Source Channel', 'Estimated Value', 'Owner', 'Days in Stage'].map((f) => (
                                            <div key={f} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer group">
                                                <Plus size={14} className="text-slate-300 group-hover:text-indigo-600" />
                                                <span className="text-[12px] font-medium text-slate-600">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 mt-4 border-t border-slate-50 space-y-3">
                                <div className="space-y-2 mb-4">
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Report Name</p>
                                    <Input value={reportName} onChange={(e) => setReportName(e.target.value)} placeholder="Marketing ROI..." className="h-10 rounded-xl" />
                                </div>
                                <Button
                                    onClick={() => setIsBuilding(false)}
                                    variant="outline"
                                    className="w-full h-10 border-slate-100 text-slate-400 font-bold text-[11px] uppercase tracking-widest rounded-xl"
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveReport} className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-100 text-none">
                                    <Save className="h-4 w-4 mr-2" /> Save Report
                                </Button>
                            </div>
                        </Card>

                        {/* Builder Preview Area */}
                        <Card className="lg:col-span-3 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-slate-50/50 flex flex-col items-center justify-center p-12 text-center overflow-hidden relative">
                            <div className="absolute inset-0 p-8 opacity-5 pointer-events-none">
                                <Database size={400} />
                            </div>
                            <div className="space-y-6 relative z-10">
                                <div className="p-6 rounded-3xl bg-white shadow-xl shadow-slate-200/50 inline-block">
                                    <Layers size={48} className="text-indigo-600" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-[22px] font-black text-slate-900 tracking-tight">Stage: Constructing View</h3>
                                    <p className="text-[14px] text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                                        Select fields from the left panel to populate your real-time report preview.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 justify-center">
                                    <Badge className="bg-slate-900 text-white border-none h-6 px-3 text-[10px] font-black uppercase">Live Engine</Badge>
                                    <Badge className="bg-emerald-50 text-emerald-600 border-none h-6 px-3 text-[10px] font-black uppercase tracking-widest">Draft Mode</Badge>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

            </div>

        </div>
    )
}
