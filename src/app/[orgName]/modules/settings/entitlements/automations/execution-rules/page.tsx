"use client";

import React, { useState } from "react";
import { Settings, Plus, Search, Filter, MoreVertical, Edit, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Dialog, DialogContent, DialogFooter } from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

export default function ExecutionRulesPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [rules, setRules] = useState([
        { id: "1", name: "Sequential Execution", priority: "High", scope: "All Workflows", retryAttempts: 3, timeout: "30s", status: "Active" },
        { id: "2", name: "Parallel Processing", priority: "Medium", scope: "Bulk Operations", retryAttempts: 2, timeout: "60s", status: "Active" },
        { id: "3", name: "Rate Limiting", priority: "High", scope: "API Calls", retryAttempts: 5, timeout: "15s", status: "Active" },
    ]);

    const toggleStatus = (id: string) => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, status: r.status === "Active" ? "Paused" : "Active" } : r));
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Execution Rules</h1>
                    <p className="text-sm text-gray-600">Configure how automations execute and handle concurrency.</p>
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
                    <p className="text-gray-600 text-sm">Active Rules</p>
                    <h3 className="text-2xl font-bold text-gray-900">{rules.filter(r => r.status === "Active").length}</h3>
                    <p className="text-green-600 text-xs mt-1">Currently enforced</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Avg. Retry</p>
                    <h3 className="text-2xl font-bold text-gray-900">3.3</h3>
                    <p className="text-blue-600 text-xs mt-1">Attempts</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Success Rate</p>
                    <h3 className="text-2xl font-bold text-gray-900">98.2%</h3>
                    <p className="text-green-600 text-xs mt-1">Excellent</p>
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
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Rule Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Priority</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Scope</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Retry</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Timeout</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {rules.map((rule) => (
                                <tr key={rule.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-none border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <Settings size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{rule.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={`${rule.priority === "High" ? "bg-red-600" : "bg-blue-600"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                            {rule.priority}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm text-gray-700">{rule.scope}</span></td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-900">{rule.retryAttempts}x</span></td>
                                    <td className="px-6 py-4"><span className="text-sm text-gray-700">{rule.timeout}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={rule.status === "Active"} onCheckedChange={() => toggleStatus(rule.id)} className="data-[state=checked]:bg-green-600" />
                                            <Badge className={`${rule.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>{rule.status}</Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100"><MoreVertical size={16} /></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white relative">
                        <h2 className="text-2xl font-bold flex items-center gap-3"><Plus size={24} /> Create Execution Rule</h2>
                        <p className="text-sm opacity-80 mt-2">Define how automations should execute.</p>
                    </div>
                    <div className="p-8 space-y-6 bg-white">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Rule Name</Label>
                            <Input placeholder="e.g., Sequential Execution" className="rounded-none border-zinc-200 h-12 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-600">Priority</Label>
                                <Select><SelectTrigger className="rounded-none border-zinc-200 h-12"><SelectValue placeholder="Select priority" /></SelectTrigger><SelectContent className="rounded-none"><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent></Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-600">Retry Attempts</Label>
                                <Input type="number" placeholder="e.g., 3" className="rounded-none border-zinc-200 h-12 text-sm" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-none text-sm text-gray-600">Cancel</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 rounded-none text-sm px-10 h-12 shadow-xl shadow-blue-100">Create Rule</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
