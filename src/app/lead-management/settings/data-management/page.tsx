"use client"

import React, { useState, useEffect } from "react"
import {
    Database, HardDrive, ShieldCheck, Zap, Activity, History, Trash2,
    Download, Upload, MoreHorizontal, CheckCircle2, X, Plus, Search,
    HelpCircle, RefreshCw, Layers, BarChart2 as AlertBarChart, FileText,
    FileUp, FileDown, Clock, Filter
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Label } from "@/shared/components/ui/label"
import { Progress } from "@/shared/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

interface DataJob {
    id: string
    name: string
    type: "Import" | "Export" | "Cleanup" | "Sync"
    status: "Processing" | "Completed" | "Failed" | "Queued"
    progress: number
    records: string
    startTime: string
}

const INITIAL_JOBS: DataJob[] = [
    { id: "JOB-771", name: "Enterprise List Import Q1", type: "Import", status: "Completed", progress: 100, records: "12,450", startTime: "2h ago" },
    { id: "JOB-772", name: "Weekly CRM Export", type: "Export", status: "Processing", progress: 65, records: "45,000", startTime: "14m ago" },
    { id: "JOB-773", name: "Duplicate Cleanup (Global)", type: "Cleanup", status: "Queued", progress: 0, records: "Unknown", startTime: "Scheduled" },
    { id: "JOB-774", name: "LinkedIn Lead Gen Sync", type: "Sync", status: "Completed", progress: 100, records: "842", startTime: "Yesterday" },
    { id: "JOB-775", name: "Stale Records Archive", type: "Cleanup", status: "Failed", progress: 45, records: "2,100", startTime: "3 days ago" },
]

const STAT_CARDS = [
    { label: "Storage Capacity", value: "820 GB", sub: "Of 1 TB allocated", icon: HardDrive, bg: "bg-blue-50/10", text: "text-blue-600", border: "border-blue-100/20" },
    { label: "Data Integrity", value: "99.9%", sub: "Zero corrupt nodes", icon: ShieldCheck, bg: "bg-emerald-50/10", text: "text-emerald-600", border: "border-emerald-100/20" },
    { label: "Pending Tasks", value: "3", sub: "Sync jobs in queue", icon: Zap, bg: "bg-amber-50/10", text: "text-amber-600", border: "border-amber-100/20" },
    { label: "Last Backup", value: "2h ago", sub: "Georedundant", icon: Database, bg: "bg-indigo-50/10", text: "text-indigo-600", border: "border-indigo-100/20" },
]

export default function DataManagementPage() {
    const { toast } = useToast()
    const [isClient, setIsClient] = useState(false)
    const [jobs, setJobs] = useState<DataJob[]>(INITIAL_JOBS)
    const [search, setSearch] = useState("")
    const [showImportModal, setShowImportModal] = useState(false)
    const [showExportModal, setShowExportModal] = useState(false)
    const [retentionDays, setRetentionDays] = useState("365")

    useEffect(() => { setIsClient(true) }, [])

    const filteredJobs = jobs.filter(j => j.name.toLowerCase().includes(search.toLowerCase()))

    const handleStartImport = () => {
        const newJob: DataJob = {
            id: `JOB-${Math.floor(Math.random() * 1000)}`,
            name: "Manual CSV Upload",
            type: "Import",
            status: "Queued",
            progress: 0,
            records: "calculating...",
            startTime: "Just now"
        }
        setJobs([newJob, ...jobs])
        setShowImportModal(false)
        toast({ title: "Import Job Started", description: "Your data is being queued for processing." })
    }

    const handleDeleteJob = (id: string) => {
        setJobs(jobs.filter(j => j.id !== id))
        toast({ title: "Job Entry Removed" })
    }

    const handleRunIntegrityCheck = () => {
        toast({ title: "Integrity Check Started", description: "Scanning 1.2M records for orphans and duplicates..." })
    }

    const handleUpdatePolicy = () => {
        toast({ title: "Retention Policy Updated", description: `Auto-archive cycle synchronized to ${retentionDays} days.` })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-[5px] border-l-blue-500">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100"><Database className="h-5 w-5" /></div>
                        <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                            Enterprise Data Governance
                        </h1>
                    </div>
                    <p className="text-[13px] text-slate-500 font-medium">Control data flow, manage large-scale imports, and monitor system storage health.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => setShowExportModal(true)} className="h-10 border-slate-200 font-bold text-[12px] px-5 bg-white">
                        <Download className="h-4 w-4 mr-2 text-slate-400" /> Export All
                    </Button>
                    <Button onClick={() => setShowImportModal(true)} className="h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 border-none uppercase text-[11px] tracking-widest shadow-lg shadow-blue-100">
                        <Upload className="h-4 w-4 mr-2" /> Start Import
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {STAT_CARDS.map((s, i) => (
                    <Card key={i} className={`border ${s.border} ${s.bg} rounded-2xl p-5 shadow-none space-y-3`}>
                        <div className={`h-9 w-9 rounded-xl bg-white flex items-center justify-center ${s.text} shadow-sm`}><s.icon size={18} /></div>
                        <div>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <h4 className={`text-[18px] font-semibold ${s.text}`}>{s.value}</h4>
                            <p className="text-[11px] text-slate-500 font-normal">{s.sub}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Operations Grid */}
                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h3 className="text-[17px] font-black text-slate-900">System Data Jobs</h3>
                            <p className="text-[12px] text-slate-500 font-medium tracking-tight">Active and historical data operations ledger.</p>
                        </div>
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                            <Input placeholder="Search jobs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10 rounded-xl border-slate-100 bg-slate-50 text-[12px]" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredJobs.map(job => (
                            <div key={job.id} className="p-5 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 transition-all group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${job.type === 'Import' ? 'bg-indigo-50 text-indigo-600' : job.type === 'Export' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                            {job.type === 'Import' ? <Upload size={18} /> : job.type === 'Export' ? <Download size={18} /> : <Trash2 size={18} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-[14px] font-bold text-slate-900">{job.name}</h4>
                                                <Badge className={`h-5 border-none text-[9px] font-black uppercase ${job.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : job.status === 'Processing' ? 'bg-blue-50 text-blue-600' : job.status === 'Failed' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                                                    {job.status}
                                                </Badge>
                                            </div>
                                            <p className="text-[11px] text-slate-400 font-medium tracking-wide mt-0.5">{job.id} • {job.records} records • {job.startTime}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 md:max-w-[200px] space-y-2">
                                        <div className="flex justify-between text-[11px] font-black uppercase text-slate-400">
                                            <span>Progress</span>
                                            <span>{job.progress}%</span>
                                        </div>
                                        <Progress value={job.progress} className={`h-1.5 ${job.status === 'Failed' ? '[&>div]:bg-rose-500' : '[&>div]:bg-blue-500'}`} />
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <Button size="icon" variant="ghost" onClick={() => toast({ title: "Fetching Logs..." })} className="h-8 w-8 text-slate-300 hover:text-slate-900 rounded-lg"><History size={14} /></Button>
                                        <Button size="icon" variant="ghost" onClick={() => handleDeleteJob(job.id)} className="h-8 w-8 text-slate-300 hover:text-rose-600 rounded-lg"><X size={14} /></Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Sidebar Controls */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-slate-900 text-white p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/10 text-blue-400"><ShieldCheck size={20} /></div>
                            <h4 className="text-[15px] font-black uppercase tracking-tight">Retention Policy</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Auto-Archive After</Label>
                                <Select value={retentionDays} onValueChange={setRetentionDays}>
                                    <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/5 font-black text-white"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="90">90 Days</SelectItem>
                                        <SelectItem value="180">180 Days (6 Months)</SelectItem>
                                        <SelectItem value="365">365 Days (1 Year)</SelectItem>
                                        <SelectItem value="never">Never (Keep Forever)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" />
                                <span className="text-[11px] font-bold text-slate-300">Next scheduled cleanup in 4 days</span>
                            </div>
                            <Button onClick={handleUpdatePolicy} className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl border-none uppercase text-[10px] tracking-widest">Update Policy</Button>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-8 space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><AlertBarChart size={20} /></div>
                            <h4 className="text-[15px] font-black text-slate-900">Sync Integrity</h4>
                        </div>
                        <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                            Run a system-wide scan to identify orphan records, broken lead-contact links, and metadata inconsistencies.
                        </p>
                        <Button variant="outline" onClick={handleRunIntegrityCheck} className="w-full h-10 border-slate-100 hover:bg-slate-50 text-slate-700 font-black rounded-xl uppercase text-[10px] tracking-widest">
                            <RefreshCw className="h-3.5 w-3.5 mr-2" /> Run Health Check
                        </Button>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-blue-50 p-8 space-y-4">
                        <div className="flex items-center gap-3 text-blue-700">
                            <Layers size={20} /><h4 className="text-[13px] font-black uppercase">Active Integrations</h4>
                        </div>
                        <div className="space-y-3">
                            {["Salesforce", "Marketo", "Twilio"].map(sys => (
                                <div key={sys} className="flex items-center justify-between p-3 rounded-xl bg-white border border-blue-100 shadow-sm">
                                    <span className="text-[12px] font-bold text-slate-700">{sys}</span>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[9px] font-black text-emerald-600 uppercase">Live</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

            </div>

            {/* Import Modal */}
            {showImportModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[18px] font-black text-slate-900">Import Data</h2>
                            <Button size="icon" variant="ghost" onClick={() => setShowImportModal(false)} className="h-8 w-8 text-slate-400 rounded-xl"><X size={16} /></Button>
                        </div>
                        <div className="space-y-6">
                            <div className="p-8 rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-300 transition-all">
                                <Upload className="text-slate-300" size={32} />
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Drop CSV / JSON / Excel</span>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Destination Object</Label>
                                <Select defaultValue="leads">
                                    <SelectTrigger className="h-11 rounded-xl border-slate-100 bg-slate-50 font-bold"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="leads">Leads Master</SelectItem>
                                        <SelectItem value="contacts">Account Contacts</SelectItem>
                                        <SelectItem value="opps">Opportunities</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" onClick={() => setShowImportModal(false)} className="flex-1 h-11 rounded-xl border-slate-100 font-bold">Cancel</Button>
                            <Button onClick={handleStartImport} className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl border-none uppercase text-[11px] tracking-widest">Process Data</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Export Modal */}
            {showExportModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 space-y-6 animate-in zoom-in-95 duration-200 text-center">
                        <div className="h-16 w-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600 border border-indigo-100 shadow-sm"><Download size={28} /></div>
                        <div>
                            <h2 className="text-[18px] font-black text-slate-900">Configure Export</h2>
                            <p className="text-[13px] text-slate-500 font-medium">Download a complete snapshot of your system data.</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button className="h-11 bg-slate-900 text-white font-bold rounded-xl border-none" onClick={() => { toast({ title: "Export Queued", description: "Format: CSV (UTF-8)" }); setShowExportModal(false) }}>Download CSV</Button>
                            <Button variant="outline" className="h-11 rounded-xl border-slate-100 font-bold" onClick={() => { toast({ title: "Export Queued", description: "Format: JSON" }); setShowExportModal(false) }}>Download JSON</Button>
                            <Button variant="ghost" onClick={() => setShowExportModal(false)} className="h-10 text-[11px] font-black uppercase text-slate-400">Cancel</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
