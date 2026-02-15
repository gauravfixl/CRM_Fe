"use client";

import React, { useState } from "react";
import { Percent, Plus, Search, Edit, Trash2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Dialog, DialogContent, DialogFooter } from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

export default function ProbabilityRulesPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [rules, setRules] = useState([
        { id: "1", stage: "Qualification", probability: 20, autoAdjust: true, basedOn: "Stage Entry", status: "Active", deals: 45 },
        { id: "2", stage: "Proposal", probability: 50, autoAdjust: true, basedOn: "Activity Level", status: "Active", deals: 28 },
        { id: "3", stage: "Negotiation", probability: 75, autoAdjust: false, basedOn: "Manual", status: "Active", deals: 18 },
        { id: "4", stage: "Closed Won", probability: 100, autoAdjust: false, basedOn: "Fixed", status: "Active", deals: 156 },
    ]);

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Probability Rules</h1>
                    <p className="text-sm text-gray-600">Configure win probability calculations for pipeline stages.</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6">
                    <Plus size={16} /> Create Rule
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Total Rules</p>
                    <h2 className="text-white text-2xl font-bold">{rules.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Configured</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Auto-Adjust</p>
                    <h3 className="text-2xl font-bold text-gray-900">{rules.filter(r => r.autoAdjust).length}</h3>
                    <p className="text-green-600 text-xs mt-1">Dynamic rules</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Avg. Probability</p>
                    <h3 className="text-2xl font-bold text-gray-900">61%</h3>
                    <p className="text-blue-600 text-xs mt-1">Across pipeline</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Forecast Accuracy</p>
                    <h3 className="text-2xl font-bold text-gray-900">94%</h3>
                    <p className="text-green-600 text-xs mt-1">Last quarter</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input placeholder="Search rules..." className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Stage</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Probability</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Auto-Adjust</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Based On</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Active Deals</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {rules.map((rule) => (
                                <tr key={rule.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-50 text-purple-600 rounded-none border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                                <Percent size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{rule.stage}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp size={14} className="text-green-600" />
                                            <span className="text-sm font-bold text-gray-900">{rule.probability}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {rule.autoAdjust ? (
                                            <Badge className="bg-green-600 text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5">Enabled</Badge>
                                        ) : (
                                            <Badge className="bg-zinc-400 text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5">Disabled</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-none text-[10px] font-bold px-2 py-0.5">{rule.basedOn}</Badge>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-900">{rule.deals}</span></td>
                                    <td className="px-6 py-4">
                                        <Switch checked={rule.status === "Active"} className="data-[state=checked]:bg-green-600" />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" className="rounded-none border-zinc-200 h-8 text-xs px-3"><Edit size={12} className="mr-1" /> Edit</Button>
                                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100 text-red-600"><Trash2 size={14} /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-purple-700 to-indigo-800 p-8 text-white relative">
                        <h2 className="text-2xl font-bold flex items-center gap-3"><Plus size={24} /> Create Probability Rule</h2>
                        <p className="text-sm opacity-80 mt-2">Define win probability for pipeline stages.</p>
                    </div>
                    <div className="p-8 space-y-6 bg-white">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-600">Stage</Label>
                                <Select><SelectTrigger className="rounded-none border-zinc-200 h-12"><SelectValue placeholder="Select stage" /></SelectTrigger><SelectContent className="rounded-none"><SelectItem value="qual">Qualification</SelectItem><SelectItem value="prop">Proposal</SelectItem></SelectContent></Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-600">Probability (%)</Label>
                                <Input type="number" placeholder="e.g., 50" className="rounded-none border-zinc-200 h-12 text-sm" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-none text-sm text-gray-600">Cancel</Button>
                        <Button className="bg-purple-600 hover:bg-purple-700 rounded-none text-sm px-10 h-12 shadow-xl shadow-purple-100">Create Rule</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
