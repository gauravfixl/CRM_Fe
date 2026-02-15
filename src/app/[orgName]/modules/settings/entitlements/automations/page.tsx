"use client"

import React from "react"
import {
    Zap,
    Workflow,
    BarChart3,
    Settings,
    ShieldAlert,
    Lock,
    History,
    ArrowRight,
    Activity,
    Cpu,
    Network,
    Layers,
    Terminal,
    AlertCircle,
    CheckCircle2,
    Database,
    ShieldCheck
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

export default function AutomationsGovernancePage() {
    const params = useParams()
    const router = useRouter()

    const executionQuotas = [
        { node: "Enterprise CRM", dailyLimit: "100k", usage: "42k", status: "Optimal" },
        { node: "Institutional API", dailyLimit: "250k", usage: "18k", status: "Optimal" },
        { node: "Firm-Level Flows", dailyLimit: "10k", usage: "9.2k", status: "Warning" },
        { node: "Guest Portals", dailyLimit: "5k", usage: "0.2k", status: "Active" },
    ]

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto font-sans">
            {/* HERO SECTION */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 border border-slate-200 rounded-none shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-lg">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none uppercase">Automation Governance</h1>
                        <p className="text-xs text-slate-500 mt-1 font-medium italic">Control institutional execution quotas, engine health, and systemic trigger whitelist protocols.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-9 rounded-none text-[10px] font-bold uppercase tracking-widest border-slate-200">
                        Engine Logs
                    </Button>
                    <Button className="h-9 rounded-none text-[10px] font-bold uppercase tracking-widest bg-blue-600 hover:bg-blue-700">
                        Update Quotas
                    </Button>
                </div>
            </div>

            {/* TOP METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard className="bg-gradient-to-br from-blue-600 to-blue-700 border-none rounded-none shadow-lg text-white">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Global Triggers</p>
                        <Network className="w-4 h-4 text-blue-200" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-white">428k</p>
                        <p className="text-[10px] text-blue-100 font-medium mt-1">Institutional Throughput</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Engine Load</p>
                        <Cpu className="w-4 h-4 text-blue-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-slate-900">12%</p>
                        <Progress value={12} className="h-1 mt-2 bg-slate-100 [&>div]:bg-blue-600" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Efficiency Rate</p>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-emerald-600">98.4%</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase italic text-xs">Success Nominal</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Circuit Breakers</p>
                        <ShieldAlert className="w-4 h-4 text-rose-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-slate-900">00</p>
                        <p className="text-[10px] text-blue-500 font-bold mt-1 uppercase italic">Nominal Health</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* EXECUTION QUOTAS TABLE */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-none shadow-sm h-full flex flex-col">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Institutional Execution Quotas</h3>
                            <p className="text-[11px] text-slate-500 italic">Governing daily computational limits per business node.</p>
                        </div>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-5">Business Node</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Daily Quota</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Curr. Usage</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {executionQuotas.map((item, idx) => (
                                    <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                                        <TableCell className="px-5 py-4">
                                            <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">{item.node}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-[11px] text-slate-600 font-bold uppercase italic">{item.dailyLimit}</p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 h-1 bg-slate-50 overflow-hidden">
                                                    <div className="bg-blue-600 h-full" style={{ width: `${(parseInt(item.usage) / parseInt(item.dailyLimit)) * 100}%` }} />
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-bold">{item.usage}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`rounded-none text-[9px] font-black uppercase tracking-tighter px-2 leading-tight ${item.status === 'Optimal' ? 'bg-emerald-50 text-emerald-600 border-none' :
                                                    item.status === 'Warning' ? 'bg-amber-50 text-amber-600 border-none' :
                                                        'bg-blue-50 text-blue-600 border-none'
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
                    {/* WHITELISTED PROTOCOLS */}
                    <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-blue-500" /> Action Whitelist
                        </h3>
                        <div className="space-y-4">
                            {[
                                { action: "Lead Sync", status: "Global", ok: true },
                                { action: "Financial Recap", status: "Admin Only", ok: true },
                                { action: "Database Deletes", status: "Locked", ok: false },
                                { action: "Script Injection", status: "Locked", ok: false },
                            ].map((a, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{a.action}</span>
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${a.ok ? 'text-blue-500' : 'text-slate-300'}`}>{a.status}</span>
                                </div>
                            ))}
                        </div>
                        <Button variant="link" className="p-0 h-auto text-[10px] font-bold uppercase tracking-widest text-blue-600 mt-6 hover:no-underline">Edit Master Whitelist <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    </div>

                    {/* QUICK ACCESS */}
                    <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-blue-500" /> Runtime Guardrails
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {["Retry Logic", "Error Map", "Sync Window", "Tier Limits"].map((item) => (
                                <div key={item} className="p-2.5 border border-slate-100 hover:border-blue-100 hover:bg-blue-50/20 transition-all cursor-pointer group text-center">
                                    <p className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 uppercase tracking-tighter leading-tight">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ENGINE INTEGRITY */}
            <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                    <History className="w-4 h-4 text-blue-500" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Institutional Runtime History</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Peak Triggers", val: "1.2M", meta: "Recorded Jan 12" },
                        { title: "Average Latency", val: "24ms", meta: "Nominal Performance" },
                        { title: "Error Re-runs", val: "0.02%", meta: "Self-healing Enabled" },
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
