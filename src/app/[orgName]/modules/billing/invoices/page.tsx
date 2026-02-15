"use client";

import React, { useState } from "react";
import {
    Receipt,
    Download,
    ExternalLink,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    AlertCircle,
    TrendingUp,
    CreditCard,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function InvoicesPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const invoiceHistory = [
        { id: "INV-2025-001", date: "Feb 01, 2025", amount: "$499.00", status: "Paid", method: "Visa •••• 4242" },
        { id: "INV-2024-012", date: "Jan 01, 2025", amount: "$499.00", status: "Paid", method: "Visa •••• 4242" },
        { id: "INV-2024-011", date: "Dec 01, 2024", amount: "$512.50", status: "Paid", method: "Visa •••• 4242" },
        { id: "INV-2024-010", date: "Nov 01, 2024", amount: "$499.00", status: "Paid", method: "Visa •••• 4242" },
        { id: "INV-2024-009", date: "Oct 01, 2024", amount: "$499.00", status: "Paid", method: "Visa •••• 4242" },
    ];

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex flex-col gap-1">
                <h1 className="text-[22px] font-bold tracking-tight">Invoice Management</h1>
                <p className="text-[13px] text-zinc-500">Access and download all past transaction records and upcoming billing estimates.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white border-none p-7 rounded-none shadow-xl shadow-blue-200/50 space-y-5">
                    <div className="w-12 h-12 bg-white/10 text-white flex items-center justify-center rounded-none backdrop-blur-md border border-white/20">
                        <TrendingUp size={24} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[2pt] text-blue-100/70">Total Enterprise Spend (YTD)</p>
                        <h3 className="text-[32px] font-black tracking-tighter">$2,510.50</h3>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-black text-blue-100 uppercase tracking-widest bg-white/10 w-fit px-2 py-1">
                        <span>↑ 12% GROWTH</span>
                    </div>
                </div>

                <div className="bg-white border border-zinc-200 p-7 rounded-none shadow-xl shadow-zinc-100/50 space-y-5">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-none border border-emerald-100">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[2pt] text-zinc-400">Incoming Invoice Estimate</p>
                        <h3 className="text-[32px] font-black tracking-tighter text-zinc-900">$499.00</h3>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-tight flex items-center gap-2">
                        <Clock size={14} className="text-blue-500" /> MARCH 01, 2025
                    </p>
                </div>

                <div className="bg-zinc-900 p-7 rounded-none shadow-xl shadow-zinc-300/50 space-y-5 text-white">
                    <div className="w-12 h-12 bg-white/5 text-blue-400 flex items-center justify-center rounded-none border border-white/10">
                        <CreditCard size={24} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[2pt] text-zinc-500">Active Node Funding</p>
                        <h3 className="text-[22px] font-black tracking-tight">VISA •••• 4242</h3>
                    </div>
                    <div className="pt-2">
                        <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0 h-auto text-[11px] font-black gap-1 uppercase tracking-widest">
                            Security Settings <ArrowRight size={14} />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-2xl shadow-zinc-200/50 overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Filter by invoice ID or date..."
                            className="pl-11 rounded-none border-zinc-200 h-11 text-[13px] font-medium focus:ring-blue-600 bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="rounded-none border-zinc-200 text-[11px] h-11 gap-2 w-full md:w-auto font-black uppercase tracking-widest bg-white">
                        <Filter size={14} /> Fiscal Year
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-200">
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[2pt]">Invoice Identifier</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[2pt]">Ledger Date</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[2pt]">Net Amount</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[2pt]">Source Node</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[2pt]">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[2pt] text-right">Records</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {invoiceHistory.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="text-zinc-400 group-hover:text-blue-600 transition-colors">
                                                <Receipt size={20} />
                                            </div>
                                            <span className="text-[14px] font-black text-zinc-900 tracking-tight">{invoice.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-[13px] text-zinc-600 font-bold font-mono uppercase tracking-tighter">
                                        {invoice.date}
                                    </td>
                                    <td className="px-6 py-5 text-[15px] text-zinc-900 font-black tracking-tight underline decoration-blue-200 decoration-2 underline-offset-4">
                                        {invoice.amount}
                                    </td>
                                    <td className="px-6 py-5 text-[11px] text-zinc-500 font-black uppercase tracking-widest">
                                        {invoice.method}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-none w-fit">
                                            <CheckCircle2 size={12} className="stroke-[3px]" />
                                            <span className="text-[10px] font-black uppercase tracking-[1pt]">{invoice.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-3">
                                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-none hover:bg-zinc-100 text-blue-600 border border-transparent hover:border-zinc-200 shadow-sm">
                                                <Download size={18} />
                                            </Button>
                                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-none hover:bg-zinc-100 text-zinc-400 border border-transparent hover:border-zinc-200">
                                                <ExternalLink size={18} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 border-t border-zinc-100 bg-zinc-50/50">
                    <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-bold uppercase tracking-tight">
                        <AlertCircle size={16} className="text-blue-600" />
                        <span>Legacy invoice retrieval available through <a href="#" className="text-blue-600 font-black hover:underline underline-offset-4">Archive Gateway</a></span>
                    </div>
                </div>
            </div>
        </div>
    );
}
