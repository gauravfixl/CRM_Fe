"use client";

import React from "react";
import { FileText, Download, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";

export default function InvoiceTaxBreakdownPage() {
    const invoices = [
        { id: "1", number: "INV-2024-156", client: "Acme Corp", subtotal: "$10,000", taxAmount: "$850", taxRate: "8.5%", total: "$10,850", status: "Paid" },
        { id: "2", number: "INV-2024-157", client: "Tech Solutions", subtotal: "€5,000", taxAmount: "€1,000", taxRate: "20%", total: "€6,000", status: "Pending" },
        { id: "3", number: "INV-2024-158", client: "Global Inc", subtotal: "₹50,000", taxAmount: "₹9,000", taxRate: "18%", total: "₹59,000", status: "Paid" },
    ];

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Invoice Tax Breakdown</h1>
                    <p className="text-sm text-gray-600">Detailed tax analysis for individual invoices.</p>
                </div>
                <Button className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6">
                    <Download size={16} /> Export Report
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Total Invoices</p>
                    <h2 className="text-white text-2xl font-bold">{invoices.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">With tax</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Total Tax</p>
                    <h3 className="text-2xl font-bold text-gray-900">$18,420</h3>
                    <p className="text-green-600 text-xs mt-1">Collected</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Avg. Tax Rate</p>
                    <h3 className="text-2xl font-bold text-gray-900">15.5%</h3>
                    <p className="text-blue-600 text-xs mt-1">Across all invoices</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Paid Invoices</p>
                    <h3 className="text-2xl font-bold text-gray-900">{invoices.filter(i => i.status === "Paid").length}</h3>
                    <p className="text-purple-600 text-xs mt-1">Tax remitted</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                    <h3 className="text-sm font-bold text-gray-900">Invoice-wise Tax Details</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Invoice #</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Client</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Subtotal</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Tax Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Tax Rate</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Total</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-none border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <FileText size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{invoice.number}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm text-gray-700">{invoice.client}</span></td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-900">{invoice.subtotal}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <DollarSign size={12} className="text-green-600" />
                                            <span className="text-sm font-bold text-green-600">{invoice.taxAmount}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><Badge className="bg-purple-50 text-purple-700 border-purple-200 rounded-none text-[10px] font-bold px-2 py-0.5">{invoice.taxRate}</Badge></td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-900">{invoice.total}</span></td>
                                    <td className="px-6 py-4">
                                        <Badge className={`${invoice.status === "Paid" ? "bg-green-600" : "bg-amber-600"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
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
