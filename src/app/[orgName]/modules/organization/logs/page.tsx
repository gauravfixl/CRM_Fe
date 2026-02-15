"use client"

import React, { useState } from "react"
import {
    FileText,
    Search,
    Filter,
    Download,
    User,
    Clock,
    Building2,
    Trash2,
    ShieldCheck,
    Info,
    MoreVertical,
    Database,
    SearchX,
    ChevronLeft,
    ChevronRight,
    ArrowUpRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

const deletionLogs = [
    { id: "LOG-001", entityName: "Fox Solutions East", type: "Business Unit", deletedBy: "Admin Sarah", reason: "Operational Consolidation", date: "2024-03-12", method: "Soft Delete" },
    { id: "LOG-002", entityName: "Legacy Users Group", type: "Identity Store", deletedBy: "System (Auto)", reason: "Idle Retention Expired", date: "2024-03-10", method: "Permanent Purge" },
    { id: "LOG-003", entityName: "Campaign Media Assets", type: "Storage Container", deletedBy: "Mark (Lead)", reason: "Space Optimization", date: "2024-03-08", method: "Soft Delete" },
    { id: "LOG-004", entityName: "Finance Audit 2021", type: "Document Library", deletedBy: "Compliance Bot", reason: "Privacy Compliance (RTBF)", date: "2024-03-05", method: "Permanent Purge" },
]

export default function DeletionLogsPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredLogs = deletionLogs.filter(log =>
        log.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.deletedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.reason.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleExport = () => {
        toast.success("Downloading compliance record (deletion_logs_audit.pdf)...")
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Deletion & Purge Logs</h1>
                    <p className="text-sm text-slate-500 mt-1">Immutable audit trail of all data disposal operations within the organization.</p>
                </div>
                <Button variant="outline" className="h-9 gap-2 border-slate-200 font-bold" onClick={handleExport}>
                    <Download className="w-4 h-4" />
                    Export Disclosure Report
                </Button>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-slate-900">
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Disposals (30d)</p>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <p className="text-2xl font-black text-slate-900 text-left">124</p>
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1 text-left uppercase tracking-tighter">
                            Total events logged
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-red-500">
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Permanent Purges</p>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <p className="text-2xl font-black text-red-600 text-left">18</p>
                        <p className="text-[10px] text-red-400 font-bold flex items-center gap-1 mt-1 text-left uppercase tracking-tighter">
                            Irreversible actions
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-blue-500">
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Soft Deletions</p>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <p className="text-2xl font-black text-blue-600 text-left">106</p>
                        <p className="text-[10px] text-blue-400 font-bold flex items-center gap-1 mt-1 text-left uppercase tracking-tighter">
                            Restore window active
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-emerald-500">
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Compliance Health</p>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <p className="text-2xl font-black text-emerald-600 text-left">Verified</p>
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1 text-left uppercase tracking-tighter">
                            Signed audit chain
                        </p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* FILTER BAR */}
            <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search logs by entity name, admin or reason..."
                        className="pl-10 h-10 border-none bg-slate-50 focus-visible:ring-0 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" className="h-10 text-xs font-bold gap-2 text-slate-600">
                    <Filter className="w-4 h-4" />
                    All logs
                </Button>
            </div>

            {/* LOGS TABLE */}
            <Card className="border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between space-y-0 bg-slate-50/30">
                    <div>
                        <CardTitle className="text-base font-bold text-slate-900">Event Ledger</CardTitle>
                        <CardDescription className="text-xs font-medium">History of all resource disposal events.</CardDescription>
                    </div>
                    <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[9px] uppercase tracking-widest">Read Only - Immutable</Badge>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Deleted Entity</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Executed By</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Justification</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Disposal Method</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] text-right">Audit Ref</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredLogs.length > 0 ? (
                                    filteredLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                                                        {log.type === 'Business Unit' ? <Building2 className="w-4 h-4" /> : <Database className="w-4 h-4" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 leading-none">{log.entityName}</p>
                                                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">{log.type}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="text-xs font-semibold text-slate-700">{log.deletedBy}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs text-slate-500 italic max-w-xs block truncate" title={log.reason}>{log.reason}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className={`text-[9px] font-black uppercase rounded-md shadow-sm border-none ${log.method === 'Permanent Purge' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                                                    }`}>
                                                    {log.method}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <span className="text-[11px] font-bold text-slate-400 font-mono">{log.id}</span>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-blue-600 transition-colors" onClick={() => toast.info(`Viewing full audit envelope for ${log.id}`)}>
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-20">
                                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                                <div className="p-4 bg-slate-50 rounded-full">
                                                    <SearchX className="w-10 h-10 text-slate-200" />
                                                </div>
                                                <h3 className="text-base font-bold text-slate-900">No disposal records found</h3>
                                                <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>Clear Filters</Button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
                <CardFooter className="bg-slate-50/50 border-t border-slate-100 py-4 flex justify-between px-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Logs verified by Security Hub
                    </p>
                    <div className="flex gap-1">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" disabled><ChevronLeft className="w-4 h-4" /></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg bg-white"><span className="text-xs font-bold">1</span></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg"><ChevronRight className="w-4 h-4" /></Button>
                    </div>
                </CardFooter>
            </Card>

            <div className="p-4 bg-blue-50/30 border border-blue-100 rounded-xl flex gap-3">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-blue-700 leading-relaxed">
                    Deletion logs are retained for a minimum of 7 years in accordance with enterprise compliance mandates.
                    These logs cannot be modified or deleted by any user, including top-level organization admins.
                </p>
            </div>
        </div>
    )
}
