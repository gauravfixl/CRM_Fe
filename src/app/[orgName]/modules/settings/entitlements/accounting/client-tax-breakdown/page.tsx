"use client";

import React from "react";
import { BarChart3, Users, DollarSign, TrendingUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";

export default function ClientTaxBreakdownPage() {
    const clients = [
        { id: "1", name: "Acme Corporation", totalInvoices: 45, taxCollected: "$12,450", taxRate: "8.5%", jurisdiction: "US - California", compliance: 100 },
        { id: "2", name: "Tech Solutions Ltd", totalInvoices: 32, taxCollected: "€8,920", taxRate: "20%", jurisdiction: "EU - Germany", compliance: 98 },
        { id: "3", name: "Global Industries", totalInvoices: 28, taxCollected: "₹1,24,500", taxRate: "18%", jurisdiction: "India", compliance: 95 },
    ];

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Client Tax Breakdown</h1>
                    <p className="text-sm text-gray-600">Analyze tax collection and compliance by client.</p>
                </div>
                <Button className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6">
                    <Download size={16} /> Export Report
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Total Clients</p>
                    <h2 className="text-white text-2xl font-bold">{clients.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">With tax records</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Tax Collected</p>
                    <h3 className="text-2xl font-bold text-gray-900">$45,280</h3>
                    <p className="text-green-600 text-xs mt-1">This quarter</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Avg. Compliance</p>
                    <h3 className="text-2xl font-bold text-gray-900">97.7%</h3>
                    <p className="text-blue-600 text-xs mt-1">Excellent</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Jurisdictions</p>
                    <h3 className="text-2xl font-bold text-gray-900">12</h3>
                    <p className="text-purple-600 text-xs mt-1">Countries/States</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                    <h3 className="text-sm font-bold text-gray-900">Client-wise Tax Analysis</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Client Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Total Invoices</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Tax Collected</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Tax Rate</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Jurisdiction</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Compliance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {clients.map((client) => (
                                <tr key={client.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-none border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <Users size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{client.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-900">{client.totalInvoices}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <DollarSign size={14} className="text-green-600" />
                                            <span className="text-sm font-bold text-gray-900">{client.taxCollected}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-none text-[10px] font-bold px-2 py-0.5">{client.taxRate}</Badge></td>
                                    <td className="px-6 py-4"><span className="text-sm text-gray-700">{client.jurisdiction}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 min-w-[150px]">
                                            <Progress value={client.compliance} className="h-2 rounded-none flex-1" />
                                            <span className={`text-xs font-bold ${client.compliance >= 95 ? 'text-green-600' : 'text-amber-600'}`}>{client.compliance}%</span>
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
