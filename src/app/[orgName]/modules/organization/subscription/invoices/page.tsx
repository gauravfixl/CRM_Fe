"use client";

import React from "react";
import {
    Receipt,
    Download,
    CreditCard,
    CalendarClock,
    AlertCircle,
    CheckCircle2,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const currentInvoice = {
    id: "INV-2026-002",
    period: "January 1, 2026 - January 31, 2026",
    dueDate: "Feb 01, 2026",
    amount: "$1,389.00",
    status: "Unpaid",
    items: [
        { desc: "Enterprise Plan (Monthly)", cost: "$999.00" },
        { desc: "Add-on: 10 Additional Seats", cost: "$99.00" },
        { desc: "Add-on: SAML SSO Enforcer", cost: "$149.00" },
        { desc: "Tax (Estimated)", cost: "$142.00" }
    ]
};

export default function InvoicesPage() {
    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <Receipt className="w-6 h-6 text-slate-600" />
                        Invoices
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Manage open invoices and billing details.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ACTIVE INVOICE */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-lg rounded-none overflow-hidden hover:shadow-xl transition-shadow relative">
                        {/* Status Strip */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />

                        <div className="flex flex-col md:flex-row justify-between p-8 bg-white gap-6">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Invoice</p>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{currentInvoice.amount}</h2>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 rounded-none font-bold uppercase tracking-wider">
                                        <AlertCircle className="w-3 h-3 mr-1" /> Payment Due
                                    </Badge>
                                    <span className="text-xs text-slate-400">Due {currentInvoice.dueDate}</span>
                                </div>
                            </div>

                            <div className="text-right space-y-2">
                                <p className="text-sm font-bold text-slate-900">{currentInvoice.period}</p>
                                <p className="text-xs font-mono text-slate-400">Conf. ID: {currentInvoice.id}</p>
                                <Button className="w-full md:w-auto bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-none gap-2 shadow-sm transition-all">
                                    Pay Now <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <Separator />

                        <div className="bg-slate-50/50 p-8 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Itemized Breakdown</h3>
                            {currentInvoice.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-700">{item.desc}</span>
                                    <span className="font-mono font-medium text-slate-900">{item.cost}</span>
                                </div>
                            ))}
                            <Separator className="my-4" />
                            <div className="flex justify-between items-center bg-white p-4 border border-slate-200 shadow-sm">
                                <span className="font-black text-slate-900 uppercase tracking-widest text-sm">Total Due</span>
                                <span className="font-black text-xl text-blue-600">{currentInvoice.amount}</span>
                            </div>
                        </div>
                    </Card>

                    <div className="p-4 bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-blue-50 text-blue-600 flex items-center justify-center rounded-full">
                                <Download className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Download PDF</h4>
                                <p className="text-xs text-slate-500">Get a copy for your records.</p>
                            </div>
                        </div>
                        <Button variant="outline" className="rounded-none font-bold border-slate-200">
                            Download
                        </Button>
                    </div>
                </div>

                {/* SIDEBAR */}
                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm rounded-none bg-slate-900 text-white">
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <CreditCard className="w-5 h-5 text-emerald-400" />
                                <CardTitle className="text-sm font-bold uppercase tracking-widest">Auto-Pay</CardTitle>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Payments are automatically processed on the <strong>1st of every month</strong> using your default payment method.
                            </p>

                            <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-sm">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="text-sm font-bold text-emerald-100">Active</span>
                            </div>

                            <div className="pt-2">
                                <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">Primary Method</p>
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-10 bg-white rounded-sm flex items-center justify-center">
                                        <span className="text-[8px] font-black text-blue-800 italic">VISA</span>
                                    </div>
                                    <span className="font-mono text-sm text-white">•••• 4242</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-5 bg-blue-50 border border-blue-100 text-blue-900 space-y-2">
                        <h4 className="font-bold text-sm flex items-center gap-2">
                            <CalendarClock className="w-4 h-4" /> Next Billing Cycle
                        </h4>
                        <p className="text-xs leading-relaxed">
                            Your next invoice will be generated on <strong>February 1, 2026</strong>. Add-ons purchased mid-month will be prorated.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
