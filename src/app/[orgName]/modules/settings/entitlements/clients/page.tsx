"use client"

import React, { useState } from "react"
import {
    Users,
    History,
    Settings,
    UserCheck,
    ShieldCheck,
    Trash2,
    FolderKanban,
    Shield,
    ArrowRight,
    Activity,
    RefreshCcw,
    Database,
    Lock,
    Globe,
    FileCheck,
    AlertCircle,
    CheckCircle2,
    Layers,
    PieChart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { Progress } from "@/components/ui/progress"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"

export default function ClientGovernancePage() {
    const params = useParams()
    const [isSyncing, setIsSyncing] = useState(false)

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(new Promise(res => setTimeout(res, 1200)), {
            loading: "Syncing global client master schemes...",
            success: () => {
                setIsSyncing(false)
                return "Global client standards synchronized."
            },
            error: "Sync failed."
        })
    }

    const retentionPolicies = [
        { type: "Active Client Data", retention: "Indefinite", status: "Active", risk: "Low" },
        { type: "Closed Lead Records", retention: "24 Months", status: "Enforced", risk: "Low" },
        { type: "Financial Invoices", retention: "7 Years", status: "Legal Hold", risk: "Medium" },
        { type: "Employee Privacy Data", retention: "12 Months Post-Exit", status: "Enforced", risk: "High" },
    ]

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto font-sans">
            {/* HERO SECTION */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 border border-slate-200 rounded-none shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-lg">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none uppercase">Client Governance</h1>
                        <p className="text-xs text-slate-500 mt-1 font-medium italic">Govern the institutional master schemes for client accounts, lifecycles, and legal data retention.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className={`h-9 rounded-none border-slate-200 font-bold uppercase text-[10px] tracking-widest px-6 shadow-sm hover:bg-slate-50 ${isSyncing ? 'animate-pulse' : ''}`}
                        onClick={handleSync}
                        disabled={isSyncing}
                    >
                        <RefreshCcw className={`w-3.5 h-3.5 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                        Sync Policies
                    </Button>
                    <Button className="h-9 rounded-none text-[10px] font-bold uppercase tracking-widest bg-blue-600 hover:bg-blue-700">
                        Ownership Map
                    </Button>
                </div>
            </div>

            {/* TOP METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard className="bg-gradient-to-br from-blue-600 to-blue-700 border-none rounded-none shadow-lg text-white">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Global Clients</p>
                        <Globe className="w-4 h-4 text-blue-200" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-white">2,841</p>
                        <p className="text-[10px] text-blue-100 font-medium mt-1">Institutional Ledger</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Retention Health</p>
                        <FileCheck className="w-4 h-4 text-blue-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-slate-900">100%</p>
                        <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase italic text-xs">Compliant</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sync Discrepancy</p>
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-slate-900">03</p>
                        <p className="text-[10px] text-rose-500 font-bold mt-1 uppercase italic tracking-tighter">Requires Action</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security Lock</p>
                        <Lock className="w-4 h-4 text-blue-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-blue-600">Active</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 italic">High-Value Protected</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* DATA RETENTION PROTOCOLS */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-none shadow-sm h-full flex flex-col">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Data Retention & Legal Schemes</h3>
                            <p className="text-[11px] text-slate-500 italic">Institutional standards for data lifecycle and compliance purges.</p>
                        </div>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-5">Data Category</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Retention Period</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Governance Status</TableHead>
                                    <TableHead className="text-right px-5"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {retentionPolicies.map((item, idx) => (
                                    <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                                        <TableCell className="px-5 py-4">
                                            <p className="text-xs font-bold text-slate-700">{item.type}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-[11px] text-slate-600 font-medium italic">{item.retention}</p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Badge className={`rounded-none text-[9px] font-black uppercase tracking-tighter px-2 leading-tight ${item.status === 'Enforced' ? 'bg-blue-50 text-blue-600 border-none' :
                                                        item.status === 'Legal Hold' ? 'bg-amber-50 text-amber-600 border-none' :
                                                            'bg-emerald-50 text-emerald-600 border-none'
                                                    }`}>
                                                    {item.status}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right px-5">
                                            <div className={`w-2 h-2 rounded-full inline-block ${item.risk === 'Low' ? 'bg-emerald-500' :
                                                    item.risk === 'Medium' ? 'bg-amber-500' :
                                                        'bg-rose-500'
                                                }`} title={`Risk: ${item.risk}`} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* SIDEBAR DASHES */}
                <div className="lg:col-span-4 space-y-6">
                    {/* LIFECYCLE SCHEME */}
                    <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                            <History className="w-4 h-4 text-blue-500" /> Lifecycle Standard
                        </h3>
                        <div className="space-y-4">
                            {[
                                { stage: "Discovery", weight: "15%", color: "bg-slate-200" },
                                { stage: "Onboarding", weight: "25%", color: "bg-blue-300" },
                                { stage: "Active Contract", weight: "50%", color: "bg-blue-600" },
                                { stage: "Renewal Focus", weight: "10%", color: "bg-emerald-500" },
                            ].map((s, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                        <span>{s.stage}</span>
                                        <span>{s.weight}</span>
                                    </div>
                                    <div className="w-full h-1 bg-slate-50">
                                        <div className={`${s.color} h-full`} style={{ width: s.weight }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* QUICK ACCESS TITLES */}
                    <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                            <Settings className="w-4 h-4 text-blue-500" /> Ownership Protocols
                        </h3>
                        <div className="space-y-2">
                            {["Account Attribution", "Internal Transfers", "Privacy Scrubbing", "Visibility Tiers"].map((item) => (
                                <div key={item} className="flex items-center justify-between p-2.5 border border-slate-50 hover:bg-slate-50 cursor-pointer group transition-all">
                                    <span className="text-xs font-bold text-slate-600 group-hover:text-blue-600">{item}</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* SYSTEM STATUS LEDGER */}
            <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Institutional Database Integrity</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Master Schema", val: "Version 4.2", meta: "Last Updated 2d ago" },
                        { title: "Identity Sync", val: "Success", meta: "Standardized per Firm" },
                        { title: "Archival Vault", val: "Active", meta: "128.4GB Cold Storage" },
                    ].map((log, i) => (
                        <div key={i} className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.title}</span>
                            <span className="text-lg font-bold text-slate-900 mt-1">{log.val}</span>
                            <span className="text-[10px] text-blue-500 font-bold uppercase mt-1 italic tracking-tighter">{log.meta}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
