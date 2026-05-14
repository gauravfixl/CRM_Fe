"use client"

import React from "react"
import {
    Megaphone,
    PieChart,
    ShieldCheck,
    ArrowRight,
    Activity,
    Target,
    Globe,
    CheckCircle2,
    MousePointer2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
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
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">Campaign Governance</h1>
                        <p className="text-xs text-slate-500 mt-1 font-medium italic">Govern institutional marketing outreach, spend guardrails, and cross-channel attribution models.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-9 rounded-none text-[10px] font-bold tracking-wide border-slate-200">
                        Roi ledger
                    </Button>
                    <Button className="h-9 rounded-none text-[10px] font-bold tracking-wide bg-blue-600 hover:bg-blue-700">
                        Sync limits
                    </Button>
                </div>
            </div>

            {/* TOP METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard
                    onClick={() => router.push(`/${params.orgName}/modules/settings/entitlements/campaigns/limits`)}
                    className="bg-gradient-to-br from-blue-600 to-blue-700 border-none rounded-none shadow-lg text-white cursor-pointer hover:shadow-xl transition-all"
                >
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-blue-100 tracking-wide">Active runs</p>
                        <Activity className="w-4 h-4 text-blue-200" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-lg font-bold text-white">42</p>
                        <p className="text-[10px] text-blue-100 font-medium mt-1">Cross-firm campaigns</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard
                    onClick={() => router.push(`/${params.orgName}/modules/settings/entitlements/campaigns/roi`)}
                    className="bg-white border-slate-200 rounded-none shadow-md cursor-pointer hover:shadow-lg transition-all"
                >
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 tracking-wide">Global reach</p>
                        <Globe className="w-4 h-4 text-blue-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-lg font-bold text-slate-900">2.1M</p>
                        <p className="text-[10px] text-emerald-600 font-bold mt-1 italic">+12% vs Ly</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard
                    onClick={() => router.push(`/${params.orgName}/modules/settings/entitlements/campaigns/attribution`)}
                    className="bg-white border-slate-200 rounded-none shadow-md cursor-pointer hover:shadow-lg transition-all"
                >
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 tracking-wide">Avg. attribution</p>
                        <PieChart className="w-4 h-4 text-blue-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-lg font-bold text-slate-900">Multi-t</p>
                        <p className="text-[10px] text-blue-500 font-bold mt-1 italic">Verified model</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard
                    onClick={() => router.push(`/${params.orgName}/modules/settings/entitlements/campaigns/spam`)}
                    className="bg-white border-slate-200 rounded-none shadow-md cursor-pointer hover:shadow-lg transition-all"
                >
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 tracking-wide">Spam health</p>
                        <ShieldCheck className="w-4 h-4 text-rose-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-lg font-bold text-emerald-600">Clean</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 italic">0 flags raised</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* SPEND GUARDRAILS TABLE */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-none shadow-sm h-full flex flex-col">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Institutional spend guardrails</h3>
                            <p className="text-[11px] text-slate-500 italic">Governing daily marketing allocation limits per channel nodes.</p>
                        </div>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                    <TableHead className="text-[10px] font-bold tracking-wide text-slate-400 px-5">Campaign channel</TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-wide text-slate-400">Institutional cap</TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-wide text-slate-400">Curr. burn</TableHead>
                                    <TableHead className="text-[10px] font-bold tracking-wide text-slate-400">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {spendGuardrails.map((item, idx) => (
                                    <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                                        <TableCell className="px-5 py-4">
                                            <p className="text-xs font-bold text-slate-700 tracking-tight">{item.type}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-[11px] text-slate-600 font-bold italic">{item.dailyCap}</p>
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
                                            <Badge className={`rounded-none text-[9px] font-black tracking-tight px-2 leading-tight ${item.status === 'Optimal' ? 'bg-emerald-50 text-emerald-600 border-none' :
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
                        <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-500" /> Attribution model
                        </h3>
                        <div className="space-y-4">
                            {[
                                { model: "Multi-Touch", weight: "100%", active: true },
                                { model: "Last-Click", weight: "0%", active: false },
                                { model: "Time Decay", weight: "0%", active: false },
                            ].map((m, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-600 tracking-tight">{m.model}</span>
                                    <Badge className={`rounded-none text-[8px] font-black px-1.5 ${m.active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-300 border-none'}`}>{m.active ? 'Active' : 'Locked'}</Badge>
                                </div>
                            ))}
                        </div>
                        <Button variant="link" className="p-0 h-auto text-[10px] font-bold tracking-wide text-blue-600 mt-6 hover:no-underline">Edit master model <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    </div>

                    {/* COMPLIANCE CHECKLIST */}
                    <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                        <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-blue-500" /> Policy sync
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                            {["Gdpr outreach sync", "Can-spam registry", "Global blacklist", "Pii masking"].map((item) => (
                                <div key={item} className="flex items-center gap-2 p-2 border border-slate-50">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    <span className="text-[10px] font-bold text-slate-600 tracking-tight">{item}</span>
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
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">Institutional performance ledger</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Avg. roi", val: "4.2x", meta: "Institutional standard" },
                        { title: "Conv. threshold", val: "2.4%", meta: "Target baseline met" },
                        { title: "Spend accuracy", val: "99.8%", meta: "Verified per firm" },
                    ].map((log, i) => (
                        <div key={i} className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 tracking-wide">{log.title}</span>
                            <span className="text-base font-bold text-slate-900 mt-1">{log.val}</span>
                            <span className="text-[10px] text-blue-500 font-bold mt-1 italic tracking-tight">{log.meta}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
