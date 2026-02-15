"use client"

import React, { useState } from "react"
import {
    FileDown,
    Search,
    Filter,
    Download,
    FileText,
    FileSpreadsheet,
    FileArchive,
    User,
    Clock,
    SearchX,
    ArrowUpRight,
    MoreVertical,
    ShieldCheck,
    Info,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

const exportLogs = [
    { id: "EXP-772", name: "Full_Client_Inventory_Q1.csv", type: "CSV", size: "4.2 MB", actor: "Sarah Jenkins", reason: "Quarterly Audit", date: "Mar 12, 2024", status: "Success" },
    { id: "EXP-771", name: "Lead_Conversion_Report.xlsx", type: "XLSX", size: "850 KB", actor: "Michael Chen", reason: "Sales Analysis", date: "Mar 11, 2024", status: "Success" },
    { id: "EXP-770", name: "Security_Audit_Trail_2023.pdf", type: "PDF", size: "12.4 MB", actor: "System Agent", reason: "Compliance Filing", date: "Mar 10, 2024", status: "Success" },
    { id: "EXP-769", name: "Brand_Assets_Library_Backup.zip", type: "ZIP", size: "420 MB", actor: "Jane Fisher", reason: "Manual Backup", date: "Mar 08, 2024", status: "Success" },
    { id: "EXP-768", name: "Employee_Payroll_Summary.csv", type: "CSV", size: "120 KB", actor: "HR Team", reason: "Internal Audit", date: "Mar 05, 2024", status: "Failed" },
]

export default function ExportLogsAuditPage() {
    const [searchQuery, setSearchQuery] = useState("")

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Data Disclosure & Export Logs</h1>
                    <p className="text-sm text-slate-500 mt-1">Institutional record of all data extraction and export operations.</p>
                </div>
                <Button variant="outline" className="h-9 gap-2 border-slate-200 font-bold" onClick={() => toast.info("Requesting full legal disclosure report...")}>
                    <FileText className="w-4 h-4" />
                    Legal Disclosure Report
                </Button>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-slate-900">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Exports</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-2xl font-black text-slate-900">142</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter italic">Past 30 days</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-blue-500">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data Extracted</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-2xl font-black text-blue-600">1.2 GB</p>
                        <p className="text-[10px] text-blue-400 font-bold flex items-center gap-1 mt-1 uppercase tracking-tighter">Approx. volume</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-indigo-500">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Requests</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-2xl font-black text-indigo-600">3</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter italic">Processing now</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-red-500">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Failed Tasks</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-2xl font-black text-red-600">1</p>
                        <p className="text-[10px] text-red-400 font-bold flex items-center gap-1 mt-1 uppercase tracking-tighter">Requires retry</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* FILTER BAR */}
            <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search export history by file name, actor or reason..."
                        className="pl-10 h-10 border-none bg-slate-50 focus-visible:ring-0 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* EXPORT LOGS TABLE */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-black text-slate-900 uppercase tracking-tight">Export Disclosure Ledger</CardTitle>
                        <CardDescription className="text-xs font-medium">Immutable record of every byte extracted from the system.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/30 border-b border-slate-100">
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Export Detail</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Extracted By</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Disclosed Reason</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Audit Envelope</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {exportLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-11 w-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm transition-colors">
                                                    {log.type === 'CSV' ? <FileText className="w-5 h-5 text-blue-500" /> :
                                                        log.type === 'XLSX' ? <FileSpreadsheet className="w-5 h-5 text-emerald-500" /> :
                                                            log.type === 'ZIP' ? <FileArchive className="w-5 h-5 text-amber-500" /> :
                                                                <FileText className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 leading-none truncate max-w-xs" title={log.name}>{log.name}</p>
                                                    <p className="text-[10px] text-slate-400 mt-1.5 uppercase tracking-widest font-bold flex items-center gap-2">
                                                        {log.type} <span className="text-slate-200">•</span> {log.size}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            <div className="flex items-center gap-2">
                                                <User className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-xs font-bold text-slate-700">{log.actor}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5">
                                            <span className="text-xs text-slate-500 italic">{log.reason}</span>
                                        </td>
                                        <td className="px-4 py-5">
                                            <Badge className={`text-[9px] font-black uppercase tracking-tight rounded-md border-none ${log.status === 'Success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                                                }`}>
                                                {log.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest">{log.id}</span>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-blue-600 transition-colors" onClick={() => toast.info(`Viewing metadata for ${log.id}`)}>
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
                <CardFooter className="bg-slate-50/50 border-t border-slate-100 py-4 flex justify-between items-center px-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-blue-500" /> All extraction events are permanent record
                    </p>
                    <div className="flex gap-1">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" disabled><ChevronLeft className="w-4 h-4" /></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg bg-white shadow-sm border-slate-300"><span className="text-xs font-bold text-slate-900">1</span></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" disabled><ChevronRight className="w-4 h-4" /></Button>
                    </div>
                </CardFooter>
            </Card>

            <div className="p-4 bg-blue-50/30 border border-blue-100 rounded-2xl flex gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium text-blue-700 leading-relaxed font-sans">
                    Data disclosure logs are monitored by the <span className="font-bold">Privacy Core Engine (PCE)</span>.
                    Large-scale extraction (exceeding 10% of total organization records) will trigger an immediate MFA challenge and identity verification for the acting administrator.
                </p>
            </div>
        </div>
    )
}
