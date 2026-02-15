"use client"

import React, { useState } from "react"
import {
    CreditCard,
    Zap,
    ArrowUpCircle,
    ShieldCheck,
    Package,
    FileText,
    Receipt,
    Clock,
    X,
    Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function OrgSubscriptionPage() {
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)

    const usageMetrics = [
        { label: "Active Firms", current: 3, limit: 10, variant: "blue" },
        { label: "Total Users", current: 48, limit: 100, variant: "blue" },
        { label: "Storage Capacity", current: 74, limit: 100, variant: "emerald", unit: "GB" },
        { label: "API Monthly Calls", current: 1.2, limit: 5.0, variant: "amber", unit: "M" },
    ]

    const handleUpgrade = () => {
        toast.promise(new Promise(res => setTimeout(res, 2000)), {
            loading: "Authenticating with payment gateway...",
            success: "Plan upgraded to Ultimate Scale! Limits have been expanded.",
            error: "Payment failed. Please check card balance."
        })
        setIsUpgradeOpen(false)
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Subscription & Usage</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your enterprise plan, usage limits and billing information.</p>
                </div>
                <Dialog open={isUpgradeOpen} onOpenChange={setIsUpgradeOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-black uppercase text-[10px] tracking-widest px-6 shadow-xl shadow-emerald-100">
                            <ArrowUpCircle className="w-4 h-4" />
                            Upgrade Plan
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
                        <div className="grid md:grid-cols-2">
                            <div className="bg-slate-900 p-10 text-white space-y-8">
                                <Badge className="bg-emerald-500 text-slate-950 font-black text-[9px] uppercase px-3">Elite Tier</Badge>
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight leading-tight">Ultimate Scale</h2>
                                    <p className="text-slate-400 font-medium mt-2">Unlimited power for global giants.</p>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        "Unlimited Business Units",
                                        "DDoS Protection (L7)",
                                        "Custom CNAME Domain",
                                        "White-labeled Portal",
                                        "24/7 Priority Concierge"
                                    ].map(f => (
                                        <div key={f} className="flex items-center gap-3">
                                            <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-emerald-500" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-100">{f}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-8">
                                    <p className="text-4xl font-black">$4,999<span className="text-sm text-slate-500 font-medium">/mo</span></p>
                                </div>
                            </div>
                            <div className="p-10 bg-white space-y-6">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Confirm Expansion</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Method</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-6 bg-slate-900 rounded-md flex items-center justify-center text-[10px] font-black italic text-zinc-400">VISA</div>
                                                <p className="text-sm font-bold text-slate-900">•••• 4242</p>
                                            </div>
                                            <Button variant="link" className="text-blue-600 text-[11px] font-bold p-0">Change</Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Code (CVV)</Label>
                                        <Input type="password" placeholder="•••" className="h-12 rounded-xl bg-slate-50 border-slate-100 font-black text-center text-lg tracking-widest" maxLength={3} />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4">
                                    <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[11px] tracking-widest shadow-xl" onClick={handleUpgrade}>
                                        Commit Upgrade
                                    </Button>
                                    <p className="text-[10px] text-center text-slate-400 font-medium px-4">Billed immediately. Prorated credits from current plan will be applied to the next invoice.</p>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* PLAN OVERVIEW */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2 bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-none shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                        <Package className="w-64 h-64" />
                    </div>
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-500 rounded-lg">
                                <Zap className="w-5 h-5 text-white fill-white" />
                            </div>
                            <Badge className="bg-blue-400 text-[10px] text-zinc-950 font-bold hover:bg-blue-400 border-none">ACTIVE PLAN</Badge>
                        </div>
                        <CardTitle className="text-3xl font-black tracking-tight">Enterprise Scale Plus</CardTitle>
                        <CardDescription className="text-indigo-200 font-medium">Auto-renewing on Oct 24, 2026</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold text-indigo-300 tracking-widest">Monthly Price</p>
                                <p className="text-xl font-bold">$1,499.00</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold text-indigo-300 tracking-widest">Payment Method</p>
                                <p className="text-sm font-semibold flex items-center gap-2">•••• 4242 <CreditCard className="w-3 h-3" /></p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold text-indigo-300 tracking-widest">Billing Logic</p>
                                <p className="text-sm font-semibold">Consumption Post-paid</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold text-indigo-300 tracking-widest">Compliance</p>
                                <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Fully Vetted</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-white/5 border-t border-white/10 mt-6 flex justify-between px-6 py-4">
                        <p className="text-xs text-indigo-200">Your organization is currently using <span className="text-white font-bold text-sm">74%</span> of allocated infrastructure sources.</p>
                        <Button variant="link" className="text-blue-400 text-xs font-bold p-0" onClick={() => toast.info("Plan comparison matrix loading...")}>Compare Plans</Button>
                    </CardFooter>
                </Card>

                <Card className="border-slate-200 shadow-sm relative">
                    <CardHeader>
                        <CardTitle className="text-base font-black text-slate-800 uppercase tracking-tight">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start h-11 text-xs font-bold hover:bg-slate-50 border-slate-200 rounded-xl" onClick={() => toast.success("PDF Generation started...")}>
                            <FileText className="w-4 h-4 mr-3 text-slate-400" />
                            Download Latest Invoice
                        </Button>

                        <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full justify-start h-11 text-xs font-bold hover:bg-slate-50 border-slate-200 rounded-xl">
                                    <CreditCard className="w-4 h-4 mr-3 text-slate-400" />
                                    Update Payment Details
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[450px] p-8 border-none rounded-3xl shadow-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">Vault Secure Entry</DialogTitle>
                                    <DialogDescription className="text-slate-400 font-medium">Update your PCI-DSS compliant payment method.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-5 py-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cardholder Name</Label>
                                        <Input placeholder="John Doe" className="h-12 bg-slate-50 border-slate-100 rounded-xl font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Card Number</Label>
                                        <Input placeholder="0000 0000 0000 0000" className="h-12 bg-slate-50 border-slate-100 rounded-xl font-bold" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiry</Label>
                                            <Input placeholder="MM/YY" className="h-12 bg-slate-50 border-slate-100 rounded-xl font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CVC</Label>
                                            <Input placeholder="•••" className="h-12 bg-slate-50 border-slate-100 rounded-xl font-bold" />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button className="w-full h-12 bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-[11px] rounded-xl shadow-xl shadow-slate-200" onClick={() => { toast.success("Secure vault updated."); setIsPaymentOpen(false); }}>
                                        Save Securely
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button variant="outline" className="w-full justify-start h-11 text-xs font-bold hover:bg-slate-50 border-slate-200 rounded-xl" onClick={() => toast.info("Navigating to history...")}>
                            <Receipt className="w-4 h-4 mr-3 text-slate-400" />
                            Billing History
                        </Button>
                        <div className="pt-4 mt-4 border-t border-slate-100 italic">
                            <p className="text-[10px] text-slate-400 font-medium">Next billing attempt: Feb 01, 2026</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* USAGE LIMITS */}
            <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                    <CardTitle className="text-base font-black text-slate-900 uppercase tracking-tight">Consumption & Limits</CardTitle>
                    <CardDescription className="text-xs font-medium">Monitor your resource allocation and prevent overage charges.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {usageMetrics.map((metric, i) => (
                            <div key={i} className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</p>
                                        <p className="text-2xl font-black text-slate-900 mt-1">{metric.current}{metric.unit} <span className="text-sm font-medium text-slate-400">/ {metric.limit}{metric.unit}</span></p>
                                    </div>
                                    <Badge variant="outline" className={`text-[10px] font-black border-none ${metric.current > metric.limit * 0.8 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                                        {Math.round((metric.current / metric.limit) * 100)}%
                                    </Badge>
                                </div>
                                <Progress
                                    value={(metric.current / metric.limit) * 100}
                                    className={`h-2 rounded-full bg-slate-100 [&>div]:${metric.current > metric.limit * 0.8 ? 'bg-amber-500' : 'bg-blue-600'}`}
                                />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* RECENT INVOICES MINI TABLE */}
            <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50">
                    <div className="space-y-1">
                        <CardTitle className="text-base font-black text-slate-900 uppercase tracking-tight">Recent Billing Transactions</CardTitle>
                        <CardDescription className="text-xs font-medium">A log of your most recent plan charges and credits.</CardDescription>
                    </div>
                    <Button variant="ghost" className="text-[10px] font-black text-blue-600 uppercase tracking-widest" onClick={() => toast.info("Detailed ledger loading...")}>See All History</Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {[
                            { id: "#INV-2026-001", date: "Jan 24, 2026", amount: "$1,499.00", status: "Paid", method: "Visa •••• 4242" },
                            { id: "#INV-2025-012", date: "Dec 24, 2025", amount: "$1,499.00", status: "Paid", method: "Visa •••• 4242" },
                            { id: "#INV-2025-011", date: "Nov 24, 2025", amount: "$1,499.00", status: "Paid", method: "Visa •••• 4242" },
                        ].map((inv, i) => (
                            <div key={i} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{inv.id}</p>
                                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-tighter"><Clock className="w-3 h-3" /> {inv.date}</p>
                                    </div>
                                    <div className="hidden md:block">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{inv.method}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <p className="text-sm font-black text-slate-900">{inv.amount}</p>
                                    <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-black uppercase tracking-widest">SUCCESS</Badge>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-slate-600 border border-slate-100 rounded-xl" onClick={() => toast.success("PDF Downloaded.")}><FileText className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
