"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, Users, DollarSign, TrendingUp, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { toast } from "sonner";
import { getAllOrgTaxes, getClientTax } from "@/hooks/taxHooks";

interface ClientTaxRow {
    id: string;
    name: string;
    totalInvoices: number;
    taxCollected: string;
    taxRate: string;
    jurisdiction: string;
    compliance: number;
}

export default function ClientTaxBreakdownPage() {
    const [clients, setClients] = useState<ClientTaxRow[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            // 1. Get all org taxes
            const taxRes = await getAllOrgTaxes();
            const taxes = taxRes?.data?.data || taxRes?.data || [];
            if (!Array.isArray(taxes) || taxes.length === 0) {
                setClients([]);
                return;
            }

            // 2. For each tax, fetch clients using it
            const results = await Promise.allSettled(
                taxes.map((t: any) => getClientTax(t._id || t.id))
            );

            // 3. Aggregate client → tax collected
            const byClient = new Map<string, ClientTaxRow>();
            results.forEach((r, idx) => {
                if (r.status !== "fulfilled") return;
                const tax = taxes[idx];
                const list = r.value?.data?.data || r.value?.data || [];
                if (!Array.isArray(list)) return;
                for (const record of list) {
                    const cId = record.clientId?._id || record.clientId || record.client?._id || record._id;
                    if (!cId) continue;
                    const cName =
                        record.clientName ||
                        record.client?.name ||
                        record.clientId?.name ||
                        "Unknown Client";
                    const existing = byClient.get(cId);
                    const amt = Number(record.taxAmount || record.amount || 0);
                    if (existing) {
                        existing.totalInvoices += Number(record.invoiceCount || 1);
                        const prev = parseFloat(existing.taxCollected.replace(/[^0-9.-]/g, "")) || 0;
                        existing.taxCollected = `$${(prev + amt).toLocaleString()}`;
                    } else {
                        byClient.set(cId, {
                            id: cId,
                            name: cName,
                            totalInvoices: Number(record.invoiceCount || 1),
                            taxCollected: `$${amt.toLocaleString()}`,
                            taxRate: tax?.rate != null ? `${tax.rate}%` : "—",
                            jurisdiction: tax?.region || tax?.jurisdiction || "—",
                            compliance: 100,
                        });
                    }
                }
            });

            setClients(Array.from(byClient.values()));
        } catch (err: any) {
            console.error("Failed to load client tax breakdown:", err);
            toast.error(err?.response?.data?.message || "Failed to load client tax breakdown");
            setClients([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const totalTaxCollected = clients.reduce((sum, c) => {
        const n = parseFloat(c.taxCollected.replace(/[^0-9.-]/g, "")) || 0;
        return sum + n;
    }, 0);
    const avgCompliance = clients.length
        ? (clients.reduce((sum, c) => sum + c.compliance, 0) / clients.length).toFixed(1)
        : "0";
    const uniqueJurisdictions = new Set(clients.map((c) => c.jurisdiction)).size;

    const handleExport = () => {
        if (clients.length === 0) {
            toast.info("No data to export");
            return;
        }
        const csv = [
            ["Client", "Invoices", "Tax Collected", "Tax Rate", "Jurisdiction", "Compliance %"],
            ...clients.map((c) => [c.name, c.totalInvoices, c.taxCollected, c.taxRate, c.jurisdiction, c.compliance]),
        ]
            .map((r) => r.join(","))
            .join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `client-tax-breakdown-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Report exported");
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-sm font-semibold">Client Tax Breakdown</h1>
                    <p className="text-xs text-slate-500">Analyze tax collection and compliance by client.</p>
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
                    <p className="text-xs opacity-80">Total Clients</p>
                    <h2 className="text-xl font-semibold">{clients.length}</h2>
                    <p className="text-[10px] mt-1 opacity-80">With tax records</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-gray-600 text-xs">Tax Collected</p>
                    <h3 className="text-xl font-semibold text-gray-900">${totalTaxCollected.toLocaleString()}</h3>
                    <p className="text-green-600 text-[10px] mt-1">All periods</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-gray-600 text-xs">Avg. Compliance</p>
                    <h3 className="text-xl font-semibold text-gray-900">{avgCompliance}%</h3>
                    <p className="text-blue-600 text-[10px] mt-1">Live</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-gray-600 text-xs">Jurisdictions</p>
                    <h3 className="text-xl font-semibold text-gray-900">{uniqueJurisdictions}</h3>
                    <p className="text-purple-600 text-[10px] mt-1">Countries/States</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                    <h3 className="text-sm font-semibold text-gray-900">Client-wise Tax Analysis</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Client Name</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Total Invoices</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Tax Collected</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Tax Rate</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Jurisdiction</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Compliance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {loading && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center">
                                        <Loader2 size={20} className="mx-auto animate-spin text-blue-600" />
                                        <p className="text-xs text-gray-500 mt-2">Loading client tax data...</p>
                                    </td>
                                </tr>
                            )}
                            {!loading && clients.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-xs text-gray-500">
                                        No client tax records found.
                                    </td>
                                </tr>
                            )}
                            {!loading && clients.map((client) => (
                                <tr key={client.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <Users size={14} />
                                            </div>
                                            <span className="text-xs font-medium text-gray-900">{client.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"><span className="text-xs font-medium text-gray-900">{client.totalInvoices}</span></td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <DollarSign size={12} className="text-green-600" />
                                            <span className="text-xs font-medium text-gray-900">{client.taxCollected}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"><Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-md text-[10px] font-medium px-2 py-0.5">{client.taxRate}</Badge></td>
                                    <td className="px-4 py-3"><span className="text-xs text-gray-700">{client.jurisdiction}</span></td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3 min-w-[150px]">
                                            <Progress value={client.compliance} className="h-1.5 rounded-full flex-1" />
                                            <span className={`text-xs font-medium ${client.compliance >= 95 ? 'text-green-600' : 'text-amber-600'}`}>{client.compliance}%</span>
                                        </div>
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
