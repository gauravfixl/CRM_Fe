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
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-4 space-y-4 overflow-y-auto font-sans text-[12.5px]">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
                <div>
                    <h1 className="text-sm font-semibold text-slate-900 leading-none">Accounting Governance</h1>
                    <p className="text-xs text-slate-500 mt-1">Control institutional financial standards, global tax residency, and transactional audit trails.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-8 rounded-lg text-xs font-medium border-slate-200">
                        Ledger Audit
                    </Button>
                    <Button className="h-8 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700">
                        Update Tax Schema
                    </Button>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard
                    onClick={() => router.push(`/${params.orgName}/modules/billing/usage`)}
                    className="bg-gradient-to-r from-primary/70 to-primary border-none rounded-xl shadow-sm text-white cursor-pointer hover:shadow-lg transition-all"
                >
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-medium text-blue-100">Global AUM</p>
                        <TrendingUp className="w-4 h-4 text-blue-200" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-xl font-semibold text-white">$24.8M</p>
                        <p className="text-[10px] text-blue-100 font-medium mt-1">+15.2% Quarterly Growth</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard
                    onClick={() => router.push(`/${params.orgName}/modules/settings/entitlements/accounting/invoice-flow`)}
                    className="bg-white border-slate-200 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all"
                >
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-medium text-slate-500">Reconciliation</p>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-xl font-semibold text-slate-900">99.8%</p>
                        <Progress value={99.8} className="h-1 mt-2 bg-slate-100 [&>div]:bg-emerald-500" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard
                    onClick={() => router.push(`/${params.orgName}/modules/settings/entitlements/accounting/audit-permissions`)}
                    className="bg-white border-slate-200 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all"
                >
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-medium text-slate-500">Audit Status</p>
                        <ShieldCheck className="w-4 h-4 text-blue-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-xl font-semibold text-slate-900">Verified</p>
                        <p className="text-[10px] text-blue-500 font-medium mt-1">Ledger Nominal</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard
                    onClick={() => router.push(`/${params.orgName}/modules/settings/entitlements/accounting/tax-config`)}
                    className="bg-white border-slate-200 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all"
                >
                    <SmallCardHeader className="pb-1 text-left px-4 pt-4 flex flex-row justify-between items-center">
                        <p className="text-[10px] font-medium text-slate-500">Pending Tax</p>
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="text-left px-4 pb-4">
                        <p className="text-xl font-semibold text-rose-500">$142k</p>
                        <p className="text-[10px] text-rose-400 font-medium mt-1">Next Due: Feb 15</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                {/* Tax Residency Standards */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm h-full flex flex-col">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900">Financial Jurisdiction Matrix</h3>
                            <p className="text-[10px] text-slate-500">Governing global tax templates and regional compliance status.</p>
                        </div>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                    <TableHead className="text-[10px] font-medium text-slate-500 px-5">Regulated Territory</TableHead>
                                    <TableHead className="text-[10px] font-medium text-slate-500">Standard Rate</TableHead>
                                    <TableHead className="text-[10px] font-medium text-slate-500">Audit Cycle</TableHead>
                                    <TableHead className="text-[10px] font-medium text-slate-500">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {taxJurisdictions.map((item, idx) => (
                                    <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                                        <TableCell className="px-5 py-4">
                                            <p className="text-xs font-medium text-slate-700">{item.territory}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-xs text-slate-600 font-medium">{item.standard}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-xs text-slate-500 font-medium">{item.audits}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`rounded-md text-[10px] font-medium px-2 leading-tight ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-none' :
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

                {/* Sidebar Widgets */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Payment Term Protocols */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
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
                                        <span className="text-xs font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{p.label}</span>
                                        <span className="text-[10px] font-medium text-slate-400">{p.nodes} Active Nodes</span>
                                    </div>
                                    <Badge className={`rounded-md text-[10px] font-medium px-1.5 ${p.status === 'Primary' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 border-none'}`}>{p.status}</Badge>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Currency Coverage */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-blue-500" /> Currency Layer
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {["USD (Base)", "EUR (Master Sync)", "GBP (Active)", "AED (Active)"].map((curr) => (
                                <div key={curr} className="p-2.5 border border-slate-100 rounded-lg hover:border-blue-100 hover:bg-blue-50/20 transition-all cursor-pointer group">
                                    <p className="text-[10px] font-medium text-slate-400 group-hover:text-blue-500 leading-tight">{curr}</p>
                                </div>
                            ))}
                        </div>
                        <Button variant="link" className="p-0 h-auto text-[10px] font-medium text-blue-600 mt-4 hover:no-underline">Edit FX Rules <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    </div>
                </div>
            </div>

            {/* Integrity Monitor */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                <div className="flex items-center gap-3 mb-4 border-b border-slate-50 pb-4">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <h3 className="text-sm font-semibold text-slate-900">Institutional Financial Integrity</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { title: "Last Audit", val: "Complete", meta: "Verified by Prime-Ledger" },
                        { title: "FX Invalidation", val: "0.00%", meta: "All currencies synced 1h ago" },
                        { title: "Compliance Score", val: "100/100", meta: "Institutional Standard Met" },
                    ].map((log, i) => (
                        <div key={i} className="flex flex-col">
                            <span className="text-[10px] font-medium text-slate-500">{log.title}</span>
                            <span className="text-xl font-semibold text-slate-900 mt-1">{log.val}</span>
                            <span className="text-[10px] text-blue-500 font-medium mt-1">{log.meta}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
