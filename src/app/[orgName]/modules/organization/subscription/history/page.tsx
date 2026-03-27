"use client";

import React, { useState, useMemo } from "react";
import {
    FileText,
    Download,
    Search,
    Filter,
    Calendar,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronDown
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

const allInvoices = [
    { id: "Inv-2026-001", date: "Jan 01, 2026", year: 2026, amount: "$1,389.00", rawAmount: 1389, status: "Paid", items: "Enterprise Plan + 2 Addons", due: "Jan 01, 2026" },
    { id: "Inv-2025-12-004", date: "Dec 01, 2025", year: 2025, amount: "$1,290.00", rawAmount: 1290, status: "Paid", items: "Enterprise Plan + 1 Addon", due: "Dec 01, 2025" },
    { id: "Inv-2025-11-012", date: "Nov 01, 2025", year: 2025, amount: "$1,290.00", rawAmount: 1290, status: "Paid", items: "Enterprise Plan + 1 Addon", due: "Nov 01, 2025" },
    { id: "Inv-2025-10-008", date: "Oct 01, 2025", year: 2025, amount: "$890.00", rawAmount: 890, status: "Refunded", items: "Pro Plan (Downgrade)", due: "Oct 01, 2025" },
    { id: "Inv-2025-09-022", date: "Sep 01, 2025", year: 2025, amount: "$1,290.00", rawAmount: 1290, status: "Paid", items: "Enterprise Plan", due: "Sep 01, 2025" },
];

const years = [{ label: "All Years", value: "all" }, { label: "2026", value: "2026" }, { label: "2025", value: "2025" }];

export default function BillingHistoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedYear, setSelectedYear] = useState("all");

    const filteredInvoices = useMemo(() => {
        return allInvoices.filter(inv => {
            const matchesSearch = searchQuery.trim() === "" ||
                inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                inv.amount.includes(searchQuery) ||
                inv.items.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesYear = selectedYear === "all" || inv.year.toString() === selectedYear;
            return matchesSearch && matchesYear;
        });
    }, [searchQuery, selectedYear]);

    const handleDownload = (invoiceId: string) => {
        toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
            loading: `Generating PDF for ${invoiceId}...`,
            success: `Invoice ${invoiceId} downloaded.`,
            error: "Download failed."
        });
    };

    const handleExportCsv = () => {
        const headers = ["Invoice Id,Date,Amount,Status,Description"];
        const rows = filteredInvoices.map(inv =>
            `${inv.id},${inv.date},${inv.amount},${inv.status},"${inv.items}"`
        );
        const csvContent = [headers, ...rows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `billing-history-${selectedYear === "all" ? "all" : selectedYear}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success(`CSV exported with ${filteredInvoices.length} records.`);
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-5 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-sm font-semibold tracking-tight text-slate-900">Billing History</h1>
                    <p className="text-xs text-slate-500 mt-0.5">View and download past invoices and statements.</p>
                </div>
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-8 gap-1.5 border-slate-200 font-medium text-xs rounded-lg bg-white">
                                <Filter className="w-3.5 h-3.5" /> {selectedYear === "all" ? "All Years" : selectedYear} <ChevronDown className="w-3 h-3 ml-0.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-lg">
                            {years.map(year => (
                                <DropdownMenuItem
                                    key={year.value}
                                    onClick={() => setSelectedYear(year.value)}
                                    className={`text-xs ${selectedYear === year.value ? "bg-slate-100 font-semibold" : ""}`}
                                >
                                    {year.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" className="h-8 gap-1.5 border-slate-200 font-medium text-xs rounded-lg bg-white" onClick={handleExportCsv}>
                        <Download className="w-3.5 h-3.5" /> Export Csv
                    </Button>
                </div>
            </div>

            {/* Quick Search */}
            <div className="bg-white p-3 border border-slate-200 shadow-sm rounded-xl flex items-center gap-3">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <Input
                    placeholder="Search by invoice #, amount, or description..."
                    className="border-none shadow-none focus-visible:ring-0 p-0 text-xs font-medium h-auto"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600">
                        <span className="text-xs">Clear</span>
                    </button>
                )}
            </div>

            {/* Results Count */}
            {(searchQuery || selectedYear !== "all") && (
                <p className="text-[10px] text-slate-400">
                    Showing {filteredInvoices.length} of {allInvoices.length} invoices
                    {selectedYear !== "all" && ` for ${selectedYear}`}
                    {searchQuery && ` matching "${searchQuery}"`}
                </p>
            )}

            {/* Invoices Table */}
            <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden min-h-[350px]">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-3">
                    <CardTitle className="text-[10px] font-medium text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400" /> Transactions
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/30 text-[10px] text-slate-500 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="px-4 py-2.5">Invoice Details</th>
                                    <th className="px-4 py-2.5">Billing Period</th>
                                    <th className="px-4 py-2.5">Amount</th>
                                    <th className="px-4 py-2.5">Status</th>
                                    <th className="px-4 py-2.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                                {filteredInvoices.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center">
                                            <p className="text-xs text-slate-400">No invoices found matching your criteria.</p>
                                            <Button variant="link" className="text-[10px] text-blue-600 mt-1 p-0 h-auto" onClick={() => { setSearchQuery(""); setSelectedYear("all") }}>
                                                Clear filters
                                            </Button>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInvoices.map((inv) => (
                                        <tr key={inv.id} className="group hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="h-7 w-7 bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 rounded-lg">
                                                        <FileText className="w-3.5 h-3.5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900">{inv.items}</p>
                                                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{inv.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5 text-slate-600">
                                                    <Calendar className="w-3 h-3 text-slate-400" />
                                                    <span className="text-[10px]">{inv.date}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-semibold text-slate-900">{inv.amount}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {inv.status === 'Paid' && (
                                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 rounded-md shadow-none font-medium text-[10px]">
                                                        <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> Paid
                                                    </Badge>
                                                )}
                                                {inv.status === 'Refunded' && (
                                                    <Badge className="bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200 rounded-md shadow-none font-medium text-[10px]">
                                                        Refunded
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0 rounded-lg hover:bg-slate-100 text-slate-500"
                                                    onClick={() => handleDownload(inv.id)}
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
