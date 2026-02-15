"use client"

import React from "react"
import {
    FolderKanban,
    Workflow,
    CheckCircle,
    ChartBar,
    Timer,
    Building2,
    Lock,
    Clock,
    ArrowRight,
    Activity,
    Layers,
    Target,
    BarChart3,
    AlertTriangle,
    ShieldAlert,
    CheckCircle2,
    Calendar,
    Settings
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

export default function ProjectGovernancePage() {
    const params = useParams()
    const router = useRouter()

    const slaStandards = [
        { priority: "Urgent (P0)", response: "30 Mins", resolution: "4 Hours", status: "Active" },
        { priority: "High (P1)", response: "2 Hours", resolution: "24 Hours", status: "Active" },
        { priority: "Medium (P2)", response: "1 Business Day", resolution: "3 Days", status: "Active" },
        { priority: "Low (P3)", response: "2 Business Days", resolution: "7 Days", status: "Review" },
    ]

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto font-sans">
            {/* HERO SECTION */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 border border-slate-200 rounded-none shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-lg">
                        <FolderKanban className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none uppercase">Project Governance</h1>
                        <p className="text-xs text-slate-500 mt-1 font-medium italic">Standardize execution frameworks, task delivery SLAs, and lifecycle monitoring.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-9 rounded-none text-[10px] font-bold uppercase tracking-widest border-slate-200">
                        Workflow Schema
                    </Button>
                    <Button className="h-9 rounded-none text-[10px] font-bold uppercase tracking-widest bg-blue-600 hover:bg-blue-700">
                        Institutional Sync
                    </Button>
                </div>
            </div>

            {/* TOP METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard className="bg-gradient-to-br from-blue-600 to-blue-700 border-none rounded-none shadow-lg text-white">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Global Velocity</p>
                        <BarChart3 className="w-4 h-4 text-blue-200" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-white">42</p>
                        <p className="text-[10px] text-blue-100 font-medium mt-1">Sprints Unified / Month</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SLA Compliance</p>
                        <ShieldAlert className="w-4 h-4 text-blue-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-slate-900">88.2%</p>
                        <Progress value={88} className="h-1 mt-2 bg-slate-100 [&>div]:bg-blue-600" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Units</p>
                        <Building2 className="w-4 h-4 text-blue-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-slate-900">32</p>
                        <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase italic">Stable Nodes</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Overdue Tasks</p>
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-rose-500">124</p>
                        <p className="text-[10px] text-rose-400 font-bold mt-1 uppercase italic">Attention Needed</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* LOWER SECTION: WORKFLOW VISUALIZATION & SLA TABLE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* GLOBAL SLA STANDARDS */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-none shadow-sm h-full flex flex-col">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Institutional Response Standards (SLA)</h3>
                            <p className="text-[11px] text-slate-500 italic">Governing maximum response and resolution times by priority.</p>
                        </div>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-5">Priority Level</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Response Target</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Resolution Target</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Governance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {slaStandards.map((item, idx) => (
                                    <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                                        <TableCell className="px-5 py-4">
                                            <p className="text-xs font-bold text-slate-700">{item.priority}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-[11px] text-slate-600 font-medium">{item.response}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-[11px] text-slate-600 font-medium">{item.resolution}</p>
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
                    {/* WORKFLOW SNAPSHOT */}
                    <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                            <Workflow className="w-4 h-4 text-blue-500" /> Master Workflow
                        </h3>
                        <div className="space-y-4">
                            {[
                                { stage: "Backlog", status: "Open" },
                                { stage: "Analysis", status: "Active" },
                                { stage: "Execution", status: "Active" },
                                { stage: "Institutional QA", status: "Active" },
                                { stage: "Archive", status: "Locked" },
                            ].map((stage, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-1.5 h-1.5 rounded-full ${stage.status === 'Open' ? 'bg-slate-300' : stage.status === 'Active' ? 'bg-blue-500' : 'bg-slate-900'}`} />
                                    <div className="flex-1 flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-600">{stage.stage}</span>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stage.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="link" className="p-0 h-auto text-[10px] font-bold uppercase tracking-widest text-blue-600 mt-6 hover:no-underline">Edit Master Schema <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    </div>

                    {/* SECURITY & DEFAULTS */}
                    <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-blue-500" /> Guardrails
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {["Permissions", "Workspaces", "Archival", "Timesheets"].map((item) => (
                                <div key={item} className="p-3 border border-slate-100 hover:border-blue-100 hover:bg-blue-50/20 transition-all cursor-pointer group">
                                    <p className="text-[10px] font-bold text-slate-400 group-hover:text-blue-500 uppercase tracking-widest leading-tight">{item}</p>
                                    <Settings className="w-3.5 h-3.5 text-slate-200 group-hover:text-blue-400 mt-2" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* RECENT ARCHIVAL / SYSTEM LOGS */}
            <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">System Integrity Ledger</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Last Archival", val: "12 Projects", meta: "Success - Jan 14" },
                        { title: "Permission Sync", val: "All Nodes", meta: "Nominal - 12m ago" },
                        { title: "SLA Violations", val: "08 Tasks", meta: "Review Required" },
                    ].map((log, i) => (
                        <div key={i} className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.title}</span>
                            <span className="text-lg font-bold text-slate-900 mt-1">{log.val}</span>
                            <span className="text-[10px] text-blue-500 font-bold uppercase mt-1 italic">{log.meta}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
