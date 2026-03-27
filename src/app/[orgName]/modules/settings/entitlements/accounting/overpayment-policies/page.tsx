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
        <div className="space-y-4 text-[12.5px]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-sm font-semibold tracking-tight">Overpayment Policies</h1>
                    <p className="text-xs text-slate-500">Manage how overpayments are handled automatically.</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-medium text-xs h-8 gap-2 shadow-sm px-4">
                    <Plus size={16} /> Create Policy
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-primary/70 to-primary p-4 rounded-xl shadow-sm text-white transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-white opacity-80">Active Policies</p>
                    <h2 className="text-xl font-semibold text-white">{policies.filter(p => p.status === "Active").length}</h2>
                    <p className="text-[10px] text-white mt-1 opacity-80">Currently enforced</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-slate-500">Overpayments (30d)</p>
                    <h3 className="text-xl font-semibold text-gray-900">229</h3>
                    <p className="text-[10px] text-amber-600 mt-1">Cases handled</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-slate-500">Total Amount</p>
                    <h3 className="text-xl font-semibold text-gray-900">$12,450</h3>
                    <p className="text-[10px] text-blue-600 mt-1">Overpaid this month</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-slate-500">Auto-Applied</p>
                    <h3 className="text-xl font-semibold text-gray-900">85%</h3>
                    <p className="text-[10px] text-green-600 mt-1">Automated</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input placeholder="Search policies..." className="pl-11 rounded-lg border-zinc-200 h-9 text-xs bg-white" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Policy Name</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Action</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Threshold</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Auto Apply</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Usage</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {policies.map((policy) => (
                                <tr key={policy.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                                <AlertCircle size={16} />
                                            </div>
                                            <span className="text-xs font-medium text-gray-900">{policy.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-md text-[10px] font-medium px-2 py-0.5">
                                            {policy.action}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-3"><span className="text-xs font-medium text-gray-900">{policy.threshold}</span></td>
                                    <td className="px-5 py-3">
                                        {policy.autoApply ? (
                                            <Badge className="bg-green-600 text-white border-none rounded-md text-[10px] font-medium px-2 py-0.5">Enabled</Badge>
                                        ) : (
                                            <Badge className="bg-zinc-400 text-white border-none rounded-md text-[10px] font-medium px-2 py-0.5">Manual</Badge>
                                        )}
                                    </td>
                                    <td className="px-5 py-3"><span className="text-xs font-medium text-gray-900">{policy.usage}</span></td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={policy.status === "Active"} onCheckedChange={() => toggleStatus(policy.id)} className="data-[state=checked]:bg-green-600" />
                                            <Badge className={`${policy.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-md text-[10px] font-medium px-2 py-0.5`}>{policy.status}</Badge>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-xs text-slate-500">Showing {policies.length} policies</p>
                    <Button variant="link" className="text-blue-600 text-xs flex items-center gap-1 group">View Overpayment Report <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></Button>
                </div>
            </div>

            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-lg rounded-xl p-0 overflow-hidden shadow-lg border-none">
                    <div className="bg-gradient-to-r from-amber-600 to-orange-700 p-5 text-white relative">
                        <h2 className="text-sm font-semibold flex items-center gap-3"><Plus size={18} /> Create Overpayment Policy</h2>
                        <p className="text-xs opacity-80 mt-1">Define how overpayments should be handled.</p>
                    </div>
                    <div className="p-5 space-y-4 bg-white">
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-slate-500">Policy Name</Label>
                            <Input placeholder="e.g., Auto Credit Note" className="rounded-lg border-zinc-200 h-9 text-xs" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-slate-500">Action</Label>
                                <Select><SelectTrigger className="rounded-lg border-zinc-200 h-9 text-xs"><SelectValue placeholder="Select action" /></SelectTrigger><SelectContent className="rounded-lg"><SelectItem value="credit">Create Credit Note</SelectItem><SelectItem value="refund">Process Refund</SelectItem><SelectItem value="next">Apply to Next Invoice</SelectItem></SelectContent></Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-slate-500">Threshold Amount</Label>
                                <Input type="number" placeholder="e.g., 10" className="rounded-lg border-zinc-200 h-9 text-xs" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-5 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-lg text-xs text-slate-500">Cancel</Button>
                        <Button className="bg-amber-600 hover:bg-amber-700 rounded-lg text-xs font-medium px-4 h-8 shadow-sm">Create Policy</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
