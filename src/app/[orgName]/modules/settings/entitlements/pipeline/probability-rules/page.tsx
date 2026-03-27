"use client";

import React, { useState } from "react";
import { Percent, Plus, Search, Edit, Trash2, TrendingUp, Target, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard";
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

    const [newRule, setNewRule] = useState({ stage: "", probability: "", basedOn: "" });

    const deleteRule = (id: string) => {
        setRules(prev => prev.filter(r => r.id !== id));
    };

    const toggleAutoAdjust = (id: string) => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, autoAdjust: !r.autoAdjust } : r));
    };

    const handleCreateRule = () => {
        if (!newRule.stage || !newRule.probability) return;
        const rule = {
            id: String(rules.length + 1),
            stage: newRule.stage,
            probability: Number(newRule.probability),
            autoAdjust: false,
            basedOn: newRule.basedOn || "Manual",
            status: "Active",
            deals: 0,
        };
        setRules(prev => [...prev, rule]);
        setNewRule({ stage: "", probability: "", basedOn: "" });
        setShowCreateModal(false);
    };

    return (
        <div className="space-y-6 font-outfit p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold tracking-tight text-gray-900">Probability Rules</h1>
                    <p className="text-xs text-gray-500 font-medium">Configure win probability calculations for pipeline stages.</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5">
                    <Plus size={16} /> Create Rule
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">Total Rules</p>
                                <p className="text-white text-xl font-semibold mt-1">{rules.length}</p>
                                <p className="text-white text-[10px] mt-1">Configured</p>
                            </div>
                            <Target className="w-5 h-5 text-white" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Auto-Adjust</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">{rules.filter(r => r.autoAdjust).length}</p>
                                <p className="text-green-600 text-[10px] mt-1">Dynamic rules</p>
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Avg. Probability</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">61%</p>
                                <p className="text-blue-600 text-[10px] mt-1">Across pipeline</p>
                            </div>
                            <Percent className="w-5 h-5 text-blue-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Forecast Accuracy</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">94%</p>
                                <p className="text-green-600 text-[10px] mt-1">Last quarter</p>
                            </div>
                            <BarChart3 className="w-5 h-5 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <Input placeholder="Search rules..." className="pl-11 rounded-xl border-gray-200 h-10 text-sm bg-white" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Stage</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Probability</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Auto-Adjust</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Based On</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Active Deals</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {rules.map((rule) => (
                                <tr key={rule.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                                <Percent size={18} />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">{rule.stage}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp size={14} className="text-green-600" />
                                            <span className="text-sm font-semibold text-gray-900">{rule.probability}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={rule.autoAdjust} onCheckedChange={() => toggleAutoAdjust(rule.id)} className="data-[state=checked]:bg-green-600" />
                                            <Badge className={`${rule.autoAdjust ? "bg-green-600" : "bg-gray-400"} text-white border-none rounded-full text-xs font-medium px-2.5 py-0.5`}>
                                                {rule.autoAdjust ? "Enabled" : "Disabled"}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-full text-xs font-medium px-2.5 py-0.5">{rule.basedOn}</Badge>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm font-semibold text-gray-900">{rule.deals}</span></td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-green-600 text-white border-none rounded-full text-xs font-medium px-2.5 py-0.5">{rule.status}</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" className="rounded-xl border-gray-200 h-8 text-xs px-3 font-medium"><Edit size={12} className="mr-1" /> Edit</Button>
                                            <Button variant="ghost" onClick={() => deleteRule(rule.id)} className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100 text-red-600"><Trash2 size={14} /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 text-white">
                        <h2 className="text-sm font-semibold flex items-center gap-2"><Plus size={16} /> Create Probability Rule</h2>
                        <p className="text-xs opacity-80 mt-0.5">Define win probability for pipeline stages.</p>
                    </div>
                    <div className="px-5 py-4 space-y-4 bg-white">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">Stage</Label>
                                <Select onValueChange={(val) => setNewRule(prev => ({ ...prev, stage: val }))}>
                                    <SelectTrigger className="rounded-lg border-gray-200 h-9 text-sm">
                                        <SelectValue placeholder="Select stage" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg">
                                        <SelectItem value="Qualification">Qualification</SelectItem>
                                        <SelectItem value="Proposal">Proposal</SelectItem>
                                        <SelectItem value="Negotiation">Negotiation</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">Probability (%)</Label>
                                <Input
                                    type="number"
                                    placeholder="e.g., 50"
                                    value={newRule.probability}
                                    onChange={(e) => setNewRule(prev => ({ ...prev, probability: e.target.value }))}
                                    className="rounded-lg border-gray-200 h-9 text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-600">Based On</Label>
                            <Select onValueChange={(val) => setNewRule(prev => ({ ...prev, basedOn: val }))}>
                                <SelectTrigger className="rounded-lg border-gray-200 h-9 text-sm">
                                    <SelectValue placeholder="Select basis" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg">
                                    <SelectItem value="Stage Entry">Stage Entry</SelectItem>
                                    <SelectItem value="Activity Level">Activity Level</SelectItem>
                                    <SelectItem value="Manual">Manual</SelectItem>
                                    <SelectItem value="Fixed">Fixed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="px-5 py-3 bg-gray-50 border-t border-gray-100 gap-3 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-lg text-xs text-gray-600 h-9">Cancel</Button>
                        <Button onClick={handleCreateRule} className="bg-blue-600 hover:bg-blue-700 rounded-lg text-xs px-6 h-9 shadow-sm font-semibold">Create Rule</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
