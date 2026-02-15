"use client";

import React, { useState } from "react";
import { AlertCircle, Plus, Search, DollarSign, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Dialog, DialogContent, DialogFooter } from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

export default function OverpaymentPoliciesPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [policies, setPolicies] = useState([
        { id: "1", name: "Auto Credit Note", action: "Create Credit", threshold: "$10", autoApply: true, status: "Active", usage: 45 },
        { id: "2", name: "Refund Policy", action: "Refund", threshold: "$50", autoApply: false, status: "Active", usage: 28 },
        { id: "3", name: "Next Invoice Credit", action: "Apply to Next", threshold: "$5", autoApply: true, status: "Active", usage: 156 },
    ]);

    const toggleStatus = (id: string) => {
        setPolicies(prev => prev.map(p => p.id === id ? { ...p, status: p.status === "Active" ? "Paused" : "Active" } : p));
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Overpayment Policies</h1>
                    <p className="text-sm text-gray-600">Manage how overpayments are handled automatically.</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6">
                    <Plus size={16} /> Create Policy
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Active Policies</p>
                    <h2 className="text-white text-2xl font-bold">{policies.filter(p => p.status === "Active").length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Currently enforced</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Overpayments (30d)</p>
                    <h3 className="text-2xl font-bold text-gray-900">229</h3>
                    <p className="text-amber-600 text-xs mt-1">Cases handled</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Total Amount</p>
                    <h3 className="text-2xl font-bold text-gray-900">$12,450</h3>
                    <p className="text-blue-600 text-xs mt-1">Overpaid this month</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Auto-Applied</p>
                    <h3 className="text-2xl font-bold text-gray-900">85%</h3>
                    <p className="text-green-600 text-xs mt-1">Automated</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input placeholder="Search policies..." className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Policy Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Action</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Threshold</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Auto Apply</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Usage</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {policies.map((policy) => (
                                <tr key={policy.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-50 text-amber-600 rounded-none border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                                <AlertCircle size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{policy.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-none text-[10px] font-bold px-2 py-0.5">
                                            {policy.action}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-900">{policy.threshold}</span></td>
                                    <td className="px-6 py-4">
                                        {policy.autoApply ? (
                                            <Badge className="bg-green-600 text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5">Enabled</Badge>
                                        ) : (
                                            <Badge className="bg-zinc-400 text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5">Manual</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-900">{policy.usage}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={policy.status === "Active"} onCheckedChange={() => toggleStatus(policy.id)} className="data-[state=checked]:bg-green-600" />
                                            <Badge className={`${policy.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>{policy.status}</Badge>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing {policies.length} policies</p>
                    <Button variant="link" className="text-blue-600 text-sm flex items-center gap-1 group">View Overpayment Report <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></Button>
                </div>
            </div>

            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-amber-600 to-orange-700 p-8 text-white relative">
                        <h2 className="text-2xl font-bold flex items-center gap-3"><Plus size={24} /> Create Overpayment Policy</h2>
                        <p className="text-sm opacity-80 mt-2">Define how overpayments should be handled.</p>
                    </div>
                    <div className="p-8 space-y-6 bg-white">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Policy Name</Label>
                            <Input placeholder="e.g., Auto Credit Note" className="rounded-none border-zinc-200 h-12 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-600">Action</Label>
                                <Select><SelectTrigger className="rounded-none border-zinc-200 h-12"><SelectValue placeholder="Select action" /></SelectTrigger><SelectContent className="rounded-none"><SelectItem value="credit">Create Credit Note</SelectItem><SelectItem value="refund">Process Refund</SelectItem><SelectItem value="next">Apply to Next Invoice</SelectItem></SelectContent></Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-600">Threshold Amount</Label>
                                <Input type="number" placeholder="e.g., 10" className="rounded-none border-zinc-200 h-12 text-sm" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-none text-sm text-gray-600">Cancel</Button>
                        <Button className="bg-amber-600 hover:bg-amber-700 rounded-none text-sm px-10 h-12 shadow-xl shadow-amber-100">Create Policy</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
