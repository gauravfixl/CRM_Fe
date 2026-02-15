"use client"

import React from "react"
import {
    Megaphone,
    PieChart,
    Calculator,
    Clock,
    ShieldCheck,
    ArrowRight,
    Activity,
    Target,
    Zap,
    History,
    TrendingUp,
    Globe,
    AlertCircle,
    CheckCircle2,
    Settings,
    FileText,
    MousePointer2
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

export default function CampaignGovernancePage() {
    const params = useParams()
    const router = useRouter()

    const spendGuardrails = [
        { type: "Email Outreach", dailyCap: "$5k", used: "52%", status: "Optimal" },
        { type: "Social Campaigns", dailyCap: "$12k", used: "88%", status: "Warning" },
        { type: "Event Marketing", dailyCap: "$50k", used: "12%", status: "Active" },
        { type: "Affiliate Payouts", dailyCap: "$25k", used: "4%", status: "Active" },
    ]

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto font-sans">
            {/* HERO SECTION */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 border border-slate-200 rounded-none shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-lg">
                        <Megaphone className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none uppercase">Campaign Governance</h1>
                        <p className="text-xs text-slate-500 mt-1 font-medium italic">Govern institutional marketing outreach, spend guardrails, and cross-channel attribution models.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-9 rounded-none text-[10px] font-bold uppercase tracking-widest border-slate-200">
                        ROI Ledger
                    </Button>
                    <Button className="h-9 rounded-none text-[10px] font-bold uppercase tracking-widest bg-blue-600 hover:bg-blue-700">
                        Sync Limits
                    </Button>
                </div>
            </div>

            {/* TOP METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard className="bg-gradient-to-br from-blue-600 to-blue-700 border-none rounded-none shadow-lg text-white">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Active Runs</p>
                        <Activity className="w-4 h-4 text-blue-200" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-white">42</p>
                        <p className="text-[10px] text-blue-100 font-medium mt-1">Cross-Firm Campaigns</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Reach</p>
                        <Globe className="w-4 h-4 text-blue-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-slate-900">2.1M</p>
                        <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase italic">+12% vs LY</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg. Attribution</p>
                        <PieChart className="w-4 h-4 text-blue-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-slate-900">Multi-T</p>
                        <p className="text-[10px] text-blue-500 font-bold mt-1 uppercase italic text-xs">Verified Model</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Spam Health</p>
                        <ShieldCheck className="w-4 h-4 text-rose-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-emerald-600">Clean</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase italic">0 Flags Raised</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* SPEND GUARDRAILS TABLE */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-none shadow-sm h-full flex flex-col">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Institutional Spend Guardrails</h3>
                            <p className="text-[11px] text-slate-500 italic">Governing daily marketing allocation limits per channel nodes.</p>
                        </div>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-5">Campaign Channel</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Institutional Cap</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Curr. Burn</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {spendGuardrails.map((item, idx) => (
                                    <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                                        <TableCell className="px-5 py-4">
                                            <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">{item.type}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-[11px] text-slate-600 font-bold uppercase italic">{item.dailyCap}</p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 h-1 bg-slate-50 overflow-hidden">
                                                    <div className="bg-blue-600 h-full" style={{ width: item.used }} />
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-bold">{item.used}</span>
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
                    {/* ATTRIBUTION MODEL */}
                    <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-500" /> Attribution Model
                        </h3>
                        <div className="space-y-4">
                            {[
                                { model: "Multi-Touch", weight: "100%", active: true },
                                { model: "Last-Click", weight: "0%", active: false },
                                { model: "Time Decay", weight: "0%", active: false },
                            ].map((m, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-600 tracking-tight uppercase">{m.model}</span>
                                    <Badge className={`rounded-none text-[8px] font-black uppercase px-1.5 ${m.active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-300 border-none'}`}>{m.active ? 'Active' : 'Locked'}</Badge>
                                </div>
                            ))}
                        </div>
                        <Button variant="link" className="p-0 h-auto text-[10px] font-bold uppercase tracking-widest text-blue-600 mt-6 hover:no-underline">Edit Master Model <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    </div>

                    {/* COMPLIANCE CHECKLIST */}
                    <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-blue-500" /> Policy Sync
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                            {["GDPR Outreach Sync", "CAN-SPAM Registry", "Global Blacklist", "PII Masking"].map((item) => (
                                <div key={item} className="flex items-center gap-2 p-2 border border-slate-50">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* PERFORMANCE LEDGER */}
            <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                    <MousePointer2 className="w-4 h-4 text-blue-500" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Institutional Performance Ledger</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Avg. ROI", val: "4.2x", meta: "Institutional Standard" },
                        { title: "Conv. Threshold", val: "2.4%", meta: "Target Baseline Met" },
                        { title: "Spend Accuracy", val: "99.8%", meta: "Verified per Firm" },
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
