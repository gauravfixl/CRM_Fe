"use client"

import React from "react"
import {
    Workflow,
    LayoutDashboard,
    Target,
    Bell,
    Lock,
    ArrowRight,
    Activity,
    Cpu,
    Network,
    Layers,
    History,
    CheckCircle,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    Settings,
    Timer,
    BarChart3
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

export default function PipelineGovernancePage() {
    const params = useParams()
    const router = useRouter()

    const stagnationRules = [
        { stage: "Initial Capture", maxDays: "2 Days", alertTier: "L1 (Team)", action: "Auto-Reassign" },
        { stage: "Discovery Call", maxDays: "5 Days", alertTier: "L2 (Manager)", action: "Notification" },
        { stage: "Proposal Phase", maxDays: "10 Days", alertTier: "L3 (Executive)", action: "Manual Review" },
        { stage: "Closed Won", maxDays: "Indefinite", alertTier: "None", action: "None" },
    ]

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto font-sans">
            {/* HERO SECTION */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 border border-slate-200 rounded-none shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-lg">
                        <Workflow className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none uppercase">Pipeline & Process Governance</h1>
                        <p className="text-xs text-slate-500 mt-1 font-medium italic">Standardize institutional workflow stages, stagnation alerts, and cross-firm Stage-Probability rules.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-9 rounded-none text-[10px] font-bold uppercase tracking-widest border-slate-200">
                        Flow Schema
                    </Button>
                    <Button className="h-9 rounded-none text-[10px] font-bold uppercase tracking-widest bg-blue-600 hover:bg-blue-700">
                        Validate Flows
                    </Button>
                </div>
            </div>

            {/* TOP METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard className="bg-gradient-to-br from-blue-600 to-blue-700 border-none rounded-none shadow-lg text-white">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Global Workflows</p>
                        <Network className="w-4 h-4 text-blue-200" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-white">124</p>
                        <p className="text-[10px] text-blue-100 font-medium mt-1">Active Institutional Nodes</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Process Velocity</p>
                        <Timer className="w-4 h-4 text-blue-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-slate-900">14d</p>
                        <Progress value={65} className="h-1 mt-2 bg-slate-100 [&>div]:bg-blue-600" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Health State</p>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-emerald-600">Optimal</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase italic text-xs">0 Flow Deadlocks</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stagnation Alerts</p>
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-rose-500">08</p>
                        <p className="text-[10px] text-rose-400 font-bold mt-1 uppercase italic tracking-tighter">Review required</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* STAGNATION MONITORING TABLE */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-none shadow-sm h-full flex flex-col">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Stage Stagnation Guardrails</h3>
                            <p className="text-[11px] text-slate-500 italic">Governing institutional time limits per lifecycle stage.</p>
                        </div>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-5">Standard Stage</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Max Hold Time</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Alert Tier</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Enforcement Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stagnationRules.map((item, idx) => (
                                    <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                                        <TableCell className="px-5 py-4">
                                            <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">{item.stage}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-[11px] text-slate-600 font-bold uppercase italic">{item.maxDays}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-[11px] text-slate-500 font-bold uppercase">{item.alertTier}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`rounded-none text-[9px] font-black uppercase tracking-tighter px-2 leading-tight ${item.action === 'Auto-Reassign' ? 'bg-blue-600 text-white' :
                                                    item.action === 'None' ? 'bg-slate-100 text-slate-300 border-none' :
                                                        'bg-blue-50 text-blue-600 border-none'
                                                }`}>
                                                {item.action}
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
                    {/* AUTOMATION HEALTH */}
                    <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                            <Settings className="w-4 h-4 text-blue-500" /> Automation Status
                        </h3>
                        <div className="space-y-4">
                            {[
                                { protocol: "Stage Probability Sync", ok: true },
                                { protocol: "Trigger Validation", ok: true },
                                { protocol: "Cross-Firm Stages", ok: true },
                                { protocol: "Deadlock Detection", ok: true },
                            ].map((p, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{p.protocol}</span>
                                </div>
                            ))}
                        </div>
                        <Button variant="link" className="p-0 h-auto text-[10px] font-bold uppercase tracking-widest text-blue-600 mt-6 hover:no-underline">Configure Protocols <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    </div>

                    {/* QUICK ACCESS */}
                    <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-blue-500" /> Visibility Guardrails
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                            {["Identity Scopes", "Stage Permissions", "Global Stage Mapping"].map((item) => (
                                <div key={item} className="flex items-center justify-between p-2 border border-slate-50 hover:bg-slate-50 cursor-pointer group transition-all">
                                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-blue-600 uppercase tracking-tighter">{item}</span>
                                    <ArrowRight className="w-3 h-3 text-slate-200 group-hover:text-blue-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* FLOW INTEGRITY LEDGER */}
            <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                    <History className="w-4 h-4 text-blue-500" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Institutional Flow Integrity Ledger</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Stage Compliance", val: "100%", meta: "All firms using Master Stages" },
                        { title: "Avg. Bottleneck", val: "0.2 Days", meta: "Discovery to Proposal" },
                        { title: "Automation Sync", val: "Active", meta: "Propagated to 32 Nodes" },
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
