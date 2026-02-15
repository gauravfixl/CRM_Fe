"use client";

import React, { useState } from "react";
import { Trash2, Search, Filter, RotateCcw, FileX, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function TrashCancelledInvoicesPage() {
    const [invoices, setInvoices] = useState([
        { id: "1", number: "INV-2024-001", client: "Acme Corp", amount: "$5,240", reason: "Duplicate", deletedBy: "Admin", deletedDate: "2 days ago", status: "Cancelled" },
        { id: "2", number: "INV-2024-045", client: "Tech Solutions", amount: "$12,800", reason: "Client Request", deletedBy: "Sarah M.", deletedDate: "5 days ago", status: "Trashed" },
        { id: "3", number: "INV-2024-089", client: "Global Inc", amount: "$8,450", reason: "Error", deletedBy: "John D.", deletedDate: "1 week ago", status: "Cancelled" },
    ]);

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Trash & Cancelled Invoices</h1>
                    <p className="text-sm text-gray-600">Manage deleted and cancelled invoices with recovery options.</p>
                </div>
                <Button className="rounded-none bg-red-600 hover:bg-red-700 font-black text-sm h-11 gap-2 shadow-xl shadow-red-100 px-6">
                    <Trash2 size={16} /> Empty Trash
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Total Deleted</p>
                    <h2 className="text-white text-2xl font-bold">{invoices.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Last 30 days</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Cancelled</p>
                    <h3 className="text-2xl font-bold text-gray-900">{invoices.filter(i => i.status === "Cancelled").length}</h3>
                    <p className="text-amber-600 text-xs mt-1">Can be recovered</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">In Trash</p>
                    <h3 className="text-2xl font-bold text-gray-900">{invoices.filter(i => i.status === "Trashed").length}</h3>
                    <p className="text-red-600 text-xs mt-1">Pending deletion</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Total Value</p>
                    <h3 className="text-2xl font-bold text-gray-900">$26,490</h3>
                    <p className="text-gray-600 text-xs mt-1">Deleted invoices</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input placeholder="Search deleted invoices..." className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white" />
                    </div>
                    <Button variant="outline" className="rounded-none border-zinc-200 h-10 text-sm gap-2 bg-white"><Filter size={14} /> Filter</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Invoice #</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Client</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Reason</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Deleted By</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-50 text-red-600 rounded-none border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-all">
                                                <FileX size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{invoice.number}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm text-gray-700">{invoice.client}</span></td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-900">{invoice.amount}</span></td>
                                    <td className="px-6 py-4"><Badge className="bg-amber-50 text-amber-700 border-amber-200 rounded-none text-[10px] font-bold px-2 py-0.5">{invoice.reason}</Badge></td>
                                    <td className="px-6 py-4"><span className="text-sm text-gray-700">{invoice.deletedBy}</span></td>
                                    <td className="px-6 py-4"><span className="text-sm text-gray-600">{invoice.deletedDate}</span></td>
                                    <td className="px-6 py-4">
                                        <Badge className={`${invoice.status === "Cancelled" ? "bg-amber-600" : "bg-red-600"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                            {invoice.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="outline" className="rounded-none border-zinc-200 h-8 text-xs px-3 gap-1">
                                            <RotateCcw size={12} /> Restore
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing {invoices.length} deleted invoices</p>
                    <Button variant="link" className="text-blue-600 text-sm flex items-center gap-1 group">View Deletion History <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></Button>
                </div>
            </div>
        </div>
    );
}
