"use client"

import React from "react"
import {
    Calculator,
    Receipt,
    DollarSign,
    Banknote,
    CreditCard,
    Trash2,
    ListTree,
    PieChart,
    ShieldCheck,
    ArrowRight,
    Activity,
    Scale,
    TrendingUp,
    Globe,
    FileText,
    AlertCircle,
    CheckCircle2,
    Lock,
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

export default function AccountingGovernancePage() {
    const params = useParams()
    const router = useRouter()

    const taxJurisdictions = [
        { territory: "European Union", standard: "VAT (20%)", status: "Nominally Synced", audits: "Monthly" },
        { territory: "United States", standard: "Sales Tax (State-wide)", status: "Active", audits: "Quarterly" },
        { territory: "United Kingdom", standard: "VAT (20%)", status: "Active", audits: "Monthly" },
        { territory: "Middle East / UAE", standard: "VAT (5%)", status: "Review Required", audits: "Bi-Annual" },
    ]

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto font-sans">
            {/* HERO SECTION */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 border border-slate-200 rounded-none shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-lg">
                        <Calculator className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none uppercase">Accounting Governance</h1>
                        <p className="text-xs text-slate-500 mt-1 font-medium italic">Control institutional financial standards, global tax residency, and transactional audit trails.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-9 rounded-none text-[10px] font-bold uppercase tracking-widest border-slate-200">
                        Ledger Audit
                    </Button>
                    <Button className="h-9 rounded-none text-[10px] font-bold uppercase tracking-widest bg-blue-600 hover:bg-blue-700">
                        Update Tax Schema
                    </Button>
                </div>
            </div>

            {/* TOP METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard className="bg-gradient-to-br from-blue-600 to-blue-700 border-none rounded-none shadow-lg text-white">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Global AUM</p>
                        <TrendingUp className="w-4 h-4 text-blue-200" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-white">$24.8M</p>
                        <p className="text-[10px] text-blue-100 font-medium mt-1">+15.2% Quarterly Growth</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reconciliation</p>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-slate-900">99.8%</p>
                        <Progress value={99.8} className="h-1 mt-2 bg-slate-100 [&>div]:bg-emerald-500" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audit Status</p>
                        <ShieldCheck className="w-4 h-4 text-blue-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-slate-900">Verified</p>
                        <p className="text-[10px] text-blue-500 font-bold mt-1 uppercase italic text-xs">Ledger Nominal</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 rounded-none shadow-md">
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Tax</p>
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-2xl font-bold text-rose-500">$142k</p>
                        <p className="text-[10px] text-rose-400 font-bold mt-1 uppercase italic">Next Due: Feb 15</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* TAX RESIDENCY STANDARDS */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-none shadow-sm h-full flex flex-col">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Financial Jurisdiction Matrix</h3>
                            <p className="text-[11px] text-slate-500 italic">Governing global tax templates and regional compliance status.</p>
                        </div>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-5">Regulated Territory</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Standard Rate</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Audit Cycle</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {taxJurisdictions.map((item, idx) => (
                                    <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                                        <TableCell className="px-5 py-4">
                                            <p className="text-xs font-bold text-slate-700">{item.territory}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-[11px] text-slate-600 font-medium italic">{item.standard}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-[11px] text-slate-500 font-bold uppercase">{item.audits}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`rounded-none text-[9px] font-black uppercase tracking-tighter px-2 leading-tight ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-none' :
                                                    item.status === 'Review Required' ? 'bg-rose-50 text-rose-600 border-none' :
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
                    {/* PAYMENT TERM PROTOCOLS */}
                    <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-blue-500" /> Payment Standards
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: "NET 15", status: "Primary", nodes: "12" },
                                { label: "NET 30", status: "Allowed", nodes: "08" },
                                { label: "Immediate (COD)", status: "Active", nodes: "02" },
                                { label: "Custom Institutional", status: "Limited", nodes: "01" },
                            ].map((p, i) => (
                                <div key={i} className="flex justify-between items-center group cursor-pointer">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{p.label}</span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">{p.nodes} Active Nodes</span>
                                    </div>
                                    <Badge className={`rounded-none text-[8px] font-black uppercase tracking-widest px-1.5 ${p.status === 'Primary' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 border-none'}`}>{p.status}</Badge>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CURRENCY COVERAGE */}
                    <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-blue-500" /> Currency Layer
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {["USD (Base)", "EUR (Master Sync)", "GBP (Active)", "AED (Active)"].map((curr) => (
                                <div key={curr} className="p-2.5 border border-slate-100 hover:border-blue-100 hover:bg-blue-50/20 transition-all cursor-pointer group">
                                    <p className="text-[10px] font-bold text-slate-400 group-hover:text-blue-500 uppercase tracking-tighter leading-tight">{curr}</p>
                                </div>
                            ))}
                        </div>
                        <Button variant="link" className="p-0 h-auto text-[10px] font-bold uppercase tracking-widest text-blue-600 mt-4 hover:no-underline">Edit FX Rules <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    </div>
                </div>
            </div>

            {/* INTEGRITY MONITOR */}
            <div className="bg-white border border-slate-200 rounded-none shadow-sm p-5">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Institutional Financial Integrity</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Last Audit", val: "Complete", meta: "Verified by Prime-Ledger" },
                        { title: "FX Invalidation", val: "0.00%", meta: "All currencies synced 1h ago" },
                        { title: "Compliance Score", val: "100/100", meta: "Institutional Standard Met" },
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
