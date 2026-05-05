"use client"

import React, { useState, useEffect } from "react"
import {
    CreditCard, Zap, Package, History, Download, Plus, CheckCircle2,
    ArrowUpRight, Users, Database, Globe, DollarSign, Wallet,
    ChevronLeft, ShieldCheck, Mail, HardDrive, Clock, Receipt, X
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"
import { Label } from "@/shared/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

interface Invoice {
    id: string
    date: string
    amount: string
    status: "Paid" | "Pending" | "Overdue"
    method: string
}

const INVOICES: Invoice[] = [
    { id: "INV-2026-001", date: "Jan 15, 2026", amount: "$1,240.00", status: "Paid", method: "Visa (••• 4492)" },
    { id: "INV-2025-012", date: "Dec 15, 2025", amount: "$1,240.00", status: "Paid", method: "Visa (••• 4492)" },
    { id: "INV-2025-011", date: "Nov 15, 2025", amount: "$980.00", status: "Paid", method: "Visa (••• 4492)" },
]

const STAT_CARDS = [
    { label: "Account Balance", value: "$4.20", sub: "Auto-pay active", icon: Wallet, bg: "bg-emerald-50/10", text: "text-emerald-600", border: "border-emerald-100/20" },
    { label: "Active Nodes", value: "24/30", sub: "Seat utilization", icon: Zap, bg: "bg-blue-50/10", text: "text-blue-600", border: "border-blue-100/20" },
    { label: "Next Invoice", value: "Mar 15", sub: "Est. $1,240.00", icon: Clock, bg: "bg-indigo-50/10", text: "text-indigo-600", border: "border-indigo-100/20" },
    { label: "Resource Cap", value: "84%", sub: "Storage usage", icon: HardDrive, bg: "bg-amber-50/10", text: "text-amber-600", border: "border-amber-100/20" },
]

export default function BillingPlanPage() {
    const { toast } = useToast()
    const [isClient, setIsClient] = useState(false)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [usagePercentage, setUsagePercentage] = useState(44)

    useEffect(() => { setIsClient(true) }, [])

    const handleDownloadInvoice = (id: string) => {
        toast({ title: "Invoice Generating...", description: `Preparing ${id} for download.` })
    }

    const handleUpgrade = () => {
        toast({ title: "Upgrade Requested", description: "Our leadership success manager will contact you within 2 hours." })
    }

    const handleUpdatePayment = () => {
        setShowPaymentModal(false)
        toast({ title: "✅ Payment Method Updated", description: "Your default card ending in 4492 has been updated." })
    }

    const handleChangePlan = () => {
        toast({ title: "Plan Upgrade Flow", description: "Redirecting to enterprise pricing matrix. Our team will reach out within 2 hours." })
    }

    const handleViewHistory = () => {
        toast({ title: "Full Invoice History", description: "Loading all 36 invoices from your billing archive..." })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-[5px] border-l-indigo-600">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100"><CreditCard className="h-5 w-5" /></div>
                        <h1 className="text-[22px] font-bold tracking-tight text-slate-900">Billing & Subscription</h1>
                    </div>
                    <p className="text-[13px] text-slate-500 font-medium tracking-tight">Manage your plan, track high-volume resource usage, and access transaction history.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => setShowPaymentModal(true)} className="h-10 border-slate-200 font-bold text-[11px] px-5 uppercase tracking-widest bg-white">
                        <Wallet className="h-4 w-4 mr-2 text-slate-400" /> Payment Methods
                    </Button>
                    <Button onClick={handleUpgrade} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 border-none uppercase text-[11px] tracking-widest shadow-lg shadow-indigo-100">
                        <Zap className="h-4 w-4 mr-2" /> Upgrade Plan
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {STAT_CARDS.map((s, i) => (
                    <Card key={i} className={`border ${s.border} ${s.bg} rounded-2xl p-5 shadow-none space-y-3`}>
                        <div className={`h-9 w-9 rounded-xl bg-white flex items-center justify-center ${s.text} shadow-sm`}><s.icon size={18} /></div>
                        <div>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <h4 className={`text-[18px] font-semibold ${s.text}`}>{s.value}</h4>
                            <p className="text-[11px] text-slate-500 font-normal">{s.sub}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Plan Overview */}
                <Card className="lg:col-span-4 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-slate-900 text-white p-8 space-y-8 flex flex-col">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Badge className="bg-white/10 text-white border-none font-black text-[10px] px-3">CURRENT ACTIVE PLAN</Badge>
                            <span className="text-white/40"><Package size={20} /></span>
                        </div>
                        <h2 className="text-[32px] font-semibold tracking-tight leading-none">Enterprise<span className="text-indigo-400 ml-1">Plus</span></h2>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[18px] font-semibold">$1,240</span>
                            <span className="text-[12px] text-slate-500">/ per month</span>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1">
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Included Features</p>
                        <div className="space-y-3">
                            {[
                                "Unlimited Multi-Channel Ingestion",
                                "Custom Lead Life-Cycle Routing",
                                "API Webhook & SDK Access",
                                "Enterprise-Grade 2FA/SSO",
                                "24/7 Dedicated Support Lead"
                            ].map((f, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                    <span className="text-[13px] font-medium text-slate-300">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button onClick={handleChangePlan} className="w-full h-12 bg-white text-slate-900 hover:bg-slate-100 font-black rounded-2xl border-none uppercase text-[12px] tracking-widest">
                        Change Plan Tier
                    </Button>
                </Card>

                {/* Usage & History */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-8 space-y-8">
                        <div>
                            <h3 className="text-[17px] font-black text-slate-900 uppercase tracking-tight">Resource Consumption</h3>
                            <p className="text-[12px] text-slate-500 font-medium">Monitoring your usage against Enterprise quotas.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { label: "User Slots", val: "22", max: "50", unit: "Seats", color: "bg-indigo-600", percent: 44 },
                                { label: "Lead Ingestion", val: "1.2M", max: "5M", unit: "Records", color: "bg-emerald-600", percent: 24 },
                                { label: "Data Storage", val: "42GB", max: "100GB", unit: "Storage", color: "bg-blue-600", percent: 42 },
                            ].map((u, i) => (
                                <div key={i} className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-400">
                                        <span>{u.label}</span>
                                        <span className="text-slate-900">{u.percent}%</span>
                                    </div>
                                    <Progress value={u.percent} className={`h-1.5 [&>div]:${u.color}`} />
                                    <p className="text-[13px] font-bold text-slate-900">{u.val} <span className="text-slate-400 font-medium">/ {u.max} {u.unit}</span></p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-[17px] font-black text-slate-900 uppercase tracking-tight">Recent Invoices</h3>
                                <p className="text-[12px] text-slate-500 font-medium">Download and review your past transaction statements.</p>
                            </div>
                            <Button variant="link" onClick={handleViewHistory} className="text-[11px] font-black uppercase text-indigo-600">View All History →</Button>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-50 hover:bg-transparent">
                                    {["Invoice ID", "Billing Date", "Amount", "Payment Method", "Status", "Actions"].map(h => (
                                        <TableHead key={h} className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">{h}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {INVOICES.map((inv) => (
                                    <TableRow key={inv.id} className="border-slate-50 hover:bg-slate-50/60 transition-colors">
                                        <TableCell><span className="text-[13px] font-semibold text-slate-900">{inv.id}</span></TableCell>
                                        <TableCell><span className="text-[12px] font-medium text-slate-500">{inv.date}</span></TableCell>
                                        <TableCell><span className="text-[13px] font-semibold text-slate-900">{inv.amount}</span></TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Receipt size={13} className="text-slate-300" />
                                                <span className="text-[12px] font-medium">{inv.method}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`border-none h-5 px-2 text-[9px] font-black uppercase bg-emerald-50 text-emerald-600`}>
                                                {inv.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button size="icon" variant="ghost" onClick={() => handleDownloadInvoice(inv.id)} className="h-8 w-8 text-slate-300 hover:text-indigo-600 rounded-lg">
                                                <Download size={14} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </div>

            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[18px] font-black text-slate-900">Update Payment Method</h2>
                            <Button size="icon" variant="ghost" onClick={() => setShowPaymentModal(false)} className="h-8 w-8 text-slate-400 rounded-xl"><X size={16} /></Button>
                        </div>
                        <div className="space-y-4">
                            <div className="p-5 rounded-2xl border-2 border-indigo-500 bg-indigo-50/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-14 rounded-lg bg-indigo-600 flex items-center justify-center text-white"><CreditCard size={20} /></div>
                                    <div>
                                        <p className="text-[14px] font-black text-slate-900">Visa •••• 4492</p>
                                        <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest">Expires 08/28</p>
                                    </div>
                                </div>
                                <ShieldCheck size={20} className="text-indigo-600" />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Card Details</Label>
                                <Input placeholder="0000 0000 0000 0000" className="h-12 rounded-xl bg-slate-50 border-slate-100 font-mono" />
                                <div className="grid grid-cols-2 gap-3">
                                    <Input placeholder="MM/YY" className="h-12 rounded-xl bg-slate-50 border-slate-100" />
                                    <Input placeholder="CVC" className="h-12 rounded-xl bg-slate-50 border-slate-100" />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" onClick={() => setShowPaymentModal(false)} className="flex-1 h-11 rounded-xl border-slate-100 font-bold uppercase text-[11px] tracking-widest">Cancel</Button>
                            <Button onClick={handleUpdatePayment} className="flex-1 h-11 bg-slate-900 text-white font-bold rounded-xl border-none uppercase text-[11px] tracking-widest">Save Card</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
