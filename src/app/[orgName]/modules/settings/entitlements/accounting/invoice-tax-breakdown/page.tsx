"use client";

import React, { useState, useEffect } from "react";
import { FileText, Download, TrendingUp, DollarSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { toast } from "sonner";
import { getAllInvoices } from "@/modules/crm/invoices/hooks/invoiceHooks";

interface InvoiceTaxRow {
    id: string;
    number: string;
    client: string;
    subtotal: string;
    taxAmount: string;
    taxRate: string;
    total: string;
    status: string;
    _rawSubtotal: number;
    _rawTax: number;
    _rawRate: number;
}

export default function InvoiceTaxBreakdownPage() {
    const [invoices, setInvoices] = useState<InvoiceTaxRow[]>([]);
    const [loading, setLoading] = useState(true);

    const fmt = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const res = await getAllInvoices();
            const data = res?.data?.data || res?.data?.invoices || res?.data || [];
            const list = Array.isArray(data) ? data : [];
            const mapped: InvoiceTaxRow[] = list
                .map((inv: any) => {
                    const subtotal = Number(inv.subtotal || inv.subTotal || inv.baseAmount || 0);
                    const total = Number(inv.totalAmount || inv.total || 0);
                    const taxAmount = Number(
                        inv.taxAmount ??
                            inv.totalTax ??
                            (total && subtotal ? total - subtotal : 0)
                    );
                    const taxRate = subtotal > 0 ? (taxAmount / subtotal) * 100 : 0;
                    return {
                        id: inv._id || inv.id || Math.random().toString(36),
                        number: inv.invoiceNumber || inv.number || "—",
                        client: inv.clientName || inv.client?.name || inv.client || "—",
                        subtotal: fmt(subtotal),
                        taxAmount: fmt(taxAmount),
                        taxRate: `${taxRate.toFixed(1)}%`,
                        total: fmt(total),
                        status:
                            inv.status === "paid" || inv.status === "Paid"
                                ? "Paid"
                                : inv.status === "pending" || inv.status === "Pending"
                                ? "Pending"
                                : inv.status || "—",
                        _rawSubtotal: subtotal,
                        _rawTax: taxAmount,
                        _rawRate: taxRate,
                    };
                })
                .filter((row) => row._rawTax > 0);

            setInvoices(mapped);
        } catch (err: any) {
            console.error("Failed to load invoice tax breakdown:", err);
            toast.error(err?.response?.data?.message || "Failed to load invoices");
            setInvoices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const totalTax = invoices.reduce((s, i) => s + i._rawTax, 0);
    const avgRate = invoices.length
        ? (invoices.reduce((s, i) => s + i._rawRate, 0) / invoices.length).toFixed(1)
        : "0.0";
    const paidCount = invoices.filter((i) => i.status === "Paid").length;

    const handleExport = () => {
        if (invoices.length === 0) {
            toast.info("No data to export");
            return;
        }
        const csv = [
            ["Invoice", "Client", "Subtotal", "Tax Amount", "Tax Rate", "Total", "Status"],
            ...invoices.map((i) => [i.number, i.client, i.subtotal, i.taxAmount, i.taxRate, i.total, i.status]),
        ]
            .map((r) => r.join(","))
            .join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-tax-breakdown-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Report exported");
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-sm font-semibold">Invoice Tax Breakdown</h1>
                    <p className="text-xs text-slate-500">Detailed tax analysis for individual invoices.</p>
                </div>
                <Button
                    onClick={handleExport}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 font-medium text-xs h-8 gap-2 shadow-sm px-4"
                >
                    <Download size={14} /> Export Report
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-primary/70 to-primary p-4 rounded-xl shadow-sm text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-xs opacity-80">Total Invoices</p>
                    <h2 className="text-xl font-semibold">{invoices.length}</h2>
                    <p className="text-[10px] mt-1 opacity-80">With tax</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-gray-600 text-xs">Total Tax</p>
                    <h3 className="text-xl font-semibold text-gray-900">{fmt(totalTax)}</h3>
                    <p className="text-green-600 text-[10px] mt-1">Collected</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-gray-600 text-xs">Avg. Tax Rate</p>
                    <h3 className="text-xl font-semibold text-gray-900">{avgRate}%</h3>
                    <p className="text-blue-600 text-[10px] mt-1">Across all invoices</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-gray-600 text-xs">Paid Invoices</p>
                    <h3 className="text-xl font-semibold text-gray-900">{paidCount}</h3>
                    <p className="text-purple-600 text-[10px] mt-1">Tax remitted</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                    <h3 className="text-sm font-semibold text-gray-900">Invoice-wise Tax Details</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Invoice #</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Client</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Subtotal</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Tax Amount</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Tax Rate</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Total</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {loading && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center">
                                        <Loader2 size={20} className="mx-auto animate-spin text-blue-600" />
                                        <p className="text-xs text-gray-500 mt-2">Loading invoices...</p>
                                    </td>
                                </tr>
                            )}
                            {!loading && invoices.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-xs text-gray-500">
                                        No invoices with tax found.
                                    </td>
                                </tr>
                            )}
                            {!loading && invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <FileText size={14} />
                                            </div>
                                            <span className="text-xs font-medium text-gray-900">{invoice.number}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"><span className="text-xs text-gray-700">{invoice.client}</span></td>
                                    <td className="px-4 py-3"><span className="text-xs font-medium text-gray-900">{invoice.subtotal}</span></td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <DollarSign size={12} className="text-green-600" />
                                            <span className="text-xs font-medium text-green-600">{invoice.taxAmount}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"><Badge className="bg-purple-50 text-purple-700 border-purple-200 rounded-md text-[10px] font-medium px-2 py-0.5">{invoice.taxRate}</Badge></td>
                                    <td className="px-4 py-3"><span className="text-xs font-medium text-gray-900">{invoice.total}</span></td>
                                    <td className="px-4 py-3">
                                        <Badge className={`${invoice.status === "Paid" ? "bg-green-600" : "bg-amber-600"} text-white border-none rounded-md text-[10px] font-medium px-2 py-0.5`}>
                                            {invoice.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
