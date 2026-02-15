"use client"

import React, { useState } from "react"
import {
    Target,
    ListTree,
    Trash2,
    PieChart,
    Globe,
    CheckCircle,
    Settings,
    Download,
    UserCheck,
    ChartBar,
    Copy,
    Lock,
    Clock,
    ArrowRight,
    Activity,
    ShieldCheck,
    RefreshCcw,
    Workflow,
    Zap,
    Users,
    MousePointer2,
    Filter
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

export default function LeadGovernancePage() {
    const params = useParams()
    const [isSyncing, setIsSyncing] = useState(false)

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(new Promise(res => setTimeout(res, 1200)), {
            loading: "Propagating leads governance to all units...",
            success: () => {
                setIsSyncing(false)
                return "Global lead standards synchronized."
            },
            error: "Sync failed."
        })
    }

    const assignmentRules = [
        { name: "Global Round Robin", scope: "International", status: "Active", volume: "42%" },
        { name: "Enterprise Territory", scope: "Americas", status: "Active", volume: "28%" },
        { name: "Direct Source Match", scope: "APAC", status: "Active", volume: "15%" },
        { name: "SDR Overflow", scope: "Global", status: "Standby", volume: "5%" },
    ]

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto font-sans">
            {/* HERO SECTION */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 border border-slate-200 rounded-none shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-lg">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none uppercase">Lead Governance</h1>
                        <p className="text-xs text-slate-500 mt-1 font-medium italic">Govern lead capture, global distribution logic, and conversion standards across all firms.</p>
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
                        Sync Standards
                    </Button>
                    <Button className="h-9 rounded-none text-[10px] font-bold uppercase tracking-widest bg-blue-600 hover:bg-blue-700">
                        Capture API
                    </Button>
                </div>
            </div>

            {/* TOP METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard className="bg-gradient-to-br from-blue-600 to-blue-700 border-none rounded-none shadow-lg text-white">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Master Records</p>
                        <Users className="w-4 h-4 text-blue-200" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-white">14,2k</p>
                        <p className="text-[10px] text-blue-100 font-medium mt-1">Cross-Firm Nexus</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Ingestion</p>
                        <Activity className="w-4 h-4 text-blue-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-slate-900">1,204</p>
                        <p className="text-[10px] text-emerald-600 font-bold mt-1">Last 24 Hours</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duplicate Rate</p>
                        <Copy className="w-4 h-4 text-rose-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-rose-500">2.1%</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase italic">Within Margin</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg. Conversion</p>
                        <MousePointer2 className="w-4 h-4 text-blue-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-slate-900">14.8%</p>
                        <Progress value={45} className="h-1 mt-2 bg-slate-100 [&>div]:bg-blue-600" />
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* MAIN GOVERNANCE SECTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* ASSIGNMENT RULES TABLE */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-none shadow-sm h-full flex flex-col">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Lead Distribution Guardrails</h3>
                            <p className="text-[11px] text-slate-500 italic">Governing how leads are routed to institutional sales nodes.</p>
                        </div>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-5">Rule Protocol</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Institutional Scope</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Throughput</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignmentRules.map((item, idx) => (
                                    <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                                        <TableCell className="px-5 py-4">
                                            <p className="text-xs font-bold text-slate-700">{item.name}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-[11px] text-slate-600 font-medium italic">{item.scope}</p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 h-1 bg-slate-100 overflow-hidden">
                                                    <div className="bg-blue-500 h-full" style={{ width: item.volume }} />
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-bold">{item.volume}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`rounded-none text-[9px] font-black uppercase tracking-tighter px-2 leading-tight ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-none' : 'bg-slate-100 text-slate-400 border-none'
                                                }`}>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* SIDEBAR WIDGETS */}
                <div className="lg:col-span-4 space-y-6">
                    {/* PIPELINE INTEGRITY */}
                    <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                            <Workflow className="w-4 h-4 text-blue-500" /> Pipeline Integrity
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: "Standardized Stages", val: "100%", ok: true },
                                { label: "Custom Layouts Sync", val: "94%", ok: true },
                                { label: "Field Mapping", val: "Clean", ok: true },
                                { label: "Orphaned Leads", val: "12", ok: false },
                            ].map((stat, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-600">{stat.label}</span>
                                    <span className={`text-[10px] font-black uppercase ${stat.ok ? 'text-blue-500' : 'text-rose-500'}`}>{stat.val}</span>
                                </div>
                            ))}
                        </div>
                        <Button variant="link" className="p-0 h-auto text-[10px] font-bold uppercase tracking-widest text-blue-600 mt-6 hover:no-underline">Edit Master Pipelines <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    </div>

                    {/* SOURCE STANDARDS */}
                    <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                            <Filter className="w-4 h-4 text-blue-500" /> Lead Source Map
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {["Direct Email", "Web Forms", "Zapier Sync", "CSV Imports"].map((item) => (
                                <div key={item} className="p-3 border border-slate-100 hover:border-blue-100 hover:bg-blue-50/20 transition-all cursor-pointer group">
                                    <p className="text-[10px] font-bold text-slate-400 group-hover:text-blue-500 uppercase tracking-widest leading-tight">{item}</p>
                                    <Settings className="w-3.5 h-3.5 text-slate-200 group-hover:text-blue-400 mt-2" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* AUDIT & COMPLIANCE */}
            <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-blue-500" />
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Privacy & Security Ledger</h3>
                    </div>
                    <Badge className="bg-blue-50 text-blue-600 border-none text-[9px] font-black uppercase italic rounded-none tracking-widest px-3 py-1">Standardized</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "PII Scrubbing", val: "Automated", meta: "GDPR Compliant" },
                        { title: "Retention Limit", val: "2 Years", meta: "Global Standard" },
                        { title: "Permission Sync", val: "Active", meta: "IdentityForge Linked" },
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
