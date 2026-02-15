"use client";

import React, { useState } from "react";
import {
    FileText,
    Download,
    Search,
    Filter,
    Calendar,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const invoices = [
    { id: "INV-2024-001", date: "Jan 01, 2026", amount: "$1,389.00", status: "Paid", items: "Enterprise Plan + 2 Addons", due: "Jan 01, 2026" },
    { id: "INV-2023-12-004", date: "Dec 01, 2025", amount: "$1,290.00", status: "Paid", items: "Enterprise Plan + 1 Addon", due: "Dec 01, 2025" },
    { id: "INV-2023-11-012", date: "Nov 01, 2025", amount: "$1,290.00", status: "Paid", items: "Enterprise Plan + 1 Addon", due: "Nov 01, 2025" },
    { id: "INV-2023-10-008", date: "Oct 01, 2025", amount: "$890.00", status: "Refunded", items: "Pro Plan (Downgrade)", due: "Oct 01, 2025" },
    { id: "INV-2023-09-022", date: "Sep 01, 2025", amount: "$1,290.00", status: "Paid", items: "Enterprise Plan", due: "Sep 01, 2025" },
];

export default function BillingHistoryPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const handleDownload = (invoiceId: string) => {
        toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: "Generating PDF...",
            success: `Invoice ${invoiceId} downloaded.`,
            error: "Download failed."
        });
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Billing History</h1>
                    <p className="text-sm text-slate-500 mt-1">View and download past invoices and statements.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-9 gap-2 border-slate-200 font-bold rounded-none bg-white">
                        <Filter className="w-4 h-4" /> Filter Year
                    </Button>
                    <Button variant="outline" className="h-9 gap-2 border-slate-200 font-bold rounded-none bg-white">
                        <Download className="w-4 h-4" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* QUICK SEARCH */}
            <div className="bg-white p-4 border border-slate-200 shadow-sm rounded-none flex items-center gap-4">
                <Search className="w-4 h-4 text-slate-400" />
                <Input
                    placeholder="Search by invoice # or amount..."
                    className="border-none shadow-none focus-visible:ring-0 p-0 text-sm font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* INVOICES TABLE */}
            <Card className="border-none shadow-sm rounded-none overflow-hidden min-h-[400px]">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-4">
                    <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" /> Transactions
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/30 text-[10px] uppercase text-slate-500 font-bold tracking-widest border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3">Invoice Details</th>
                                    <th className="px-6 py-3">Billing Period</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="group hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 rounded-none">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{inv.items}</p>
                                                    <p className="text-xs text-slate-400 font-mono mt-0.5">{inv.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600 font-medium">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                {inv.date}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-black text-slate-900">{inv.amount}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {inv.status === 'Paid' && (
                                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 rounded-none shadow-none font-bold uppercase text-[10px]">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Paid
                                                </Badge>
                                            )}
                                            {inv.status === 'Refunded' && (
                                                <Badge className="bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200 rounded-none shadow-none font-bold uppercase text-[10px]">
                                                    Refunded
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 rounded-none hover:bg-slate-100 text-slate-500"
                                                onClick={() => handleDownload(inv.id)}
                                            >
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
