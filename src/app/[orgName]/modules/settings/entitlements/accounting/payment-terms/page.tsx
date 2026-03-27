"use client";

import React, { useState } from "react";
import { CreditCard, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";

export default function PaymentTermsPage() {
    const [terms, setTerms] = useState([
        { id: "1", name: "Net 30", days: 30, description: "Payment due in 30 days", default: true, status: "Active", usage: 1204 },
        { id: "2", name: "Net 15", days: 15, description: "Payment due in 15 days", default: false, status: "Active", usage: 856 },
        { id: "3", name: "Due on Receipt", days: 0, description: "Payment due immediately", default: false, status: "Active", usage: 342 },
        { id: "4", name: "Net 60", days: 60, description: "Payment due in 60 days", default: false, status: "Paused", usage: 120 },
    ]);

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-sm font-semibold">Payment Terms</h1>
                    <p className="text-xs text-slate-500">Define standard payment terms for invoices.</p>
                </div>
                <Button className="rounded-lg bg-blue-600 hover:bg-blue-700 font-medium text-xs h-8 gap-2 shadow-sm px-4">
                    <Plus size={14} /> Add Term
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-primary/70 to-primary p-4 rounded-xl shadow-sm text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-xs opacity-80">Total Terms</p>
                    <h2 className="text-xl font-semibold">{terms.length}</h2>
                    <p className="text-[10px] mt-1 opacity-80">Configured</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-gray-600 text-xs">Default Term</p>
                    <h3 className="text-xl font-semibold text-gray-900">Net 30</h3>
                    <p className="text-green-600 text-[10px] mt-1">Most used</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-gray-600 text-xs">Avg. Payment Days</p>
                    <h3 className="text-xl font-semibold text-gray-900">28</h3>
                    <p className="text-blue-600 text-[10px] mt-1">Across all invoices</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-gray-600 text-xs">Total Usage</p>
                    <h3 className="text-xl font-semibold text-gray-900">{terms.reduce((sum, t) => sum + t.usage, 0).toLocaleString()}</h3>
                    <p className="text-purple-600 text-[10px] mt-1">Invoices</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                        <Input placeholder="Search terms..." className="pl-11 rounded-lg border-zinc-200 h-8 text-xs bg-white" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Term Name</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Days</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Description</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Default</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Usage</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {terms.map((term) => (
                                <tr key={term.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <CreditCard size={14} />
                                            </div>
                                            <span className="text-xs font-medium text-gray-900">{term.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"><span className="text-xs font-medium text-gray-900">{term.days} days</span></td>
                                    <td className="px-4 py-3"><span className="text-xs text-gray-700">{term.description}</span></td>
                                    <td className="px-4 py-3">
                                        {term.default ? (
                                            <Badge className="bg-purple-600 text-white border-none rounded-md text-[10px] font-medium px-2 py-0.5">Default</Badge>
                                        ) : (
                                            <span className="text-xs text-gray-500">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3"><span className="text-xs font-medium text-gray-900">{term.usage.toLocaleString()}</span></td>
                                    <td className="px-4 py-3">
                                        <Switch checked={term.status === "Active"} className="data-[state=checked]:bg-green-600" />
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
