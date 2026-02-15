"use client";

import React, { useState } from "react";
import { Layers, Plus, Search, Filter, MoreVertical, Edit, Trash2, GripVertical, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Dialog, DialogContent, DialogFooter } from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

export default function CustomStagesPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [stages, setStages] = useState([
        { id: "1", name: "Qualification", pipeline: "Sales Pipeline", order: 1, probability: "20%", duration: "3 days", status: "Active", deals: 45 },
        { id: "2", name: "Proposal", pipeline: "Sales Pipeline", order: 2, probability: "50%", duration: "7 days", status: "Active", deals: 28 },
        { id: "3", name: "Negotiation", pipeline: "Sales Pipeline", order: 3, probability: "75%", duration: "5 days", status: "Active", deals: 18 },
        { id: "4", name: "Closed Won", pipeline: "Sales Pipeline", order: 4, probability: "100%", duration: "1 day", status: "Active", deals: 156 },
    ]);

    const toggleStatus = (id: string) => {
        setStages(prev => prev.map(s => s.id === id ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s));
    };

    const deleteStage = (id: string) => {
        setStages(prev => prev.filter(s => s.id !== id));
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Custom Pipeline Stages</h1>
                    <p className="text-sm text-gray-600">Configure and manage stages for your sales pipelines.</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6">
                    <Plus size={16} /> Create Stage
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Total Stages</p>
                    <h2 className="text-white text-2xl font-bold">{stages.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Configured</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Active Stages</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stages.filter(s => s.status === "Active").length}</h3>
                    <p className="text-green-600 text-xs mt-1">Currently in use</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Total Deals</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stages.reduce((sum, s) => sum + s.deals, 0)}</h3>
                    <p className="text-blue-600 text-xs mt-1">Across all stages</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Avg. Duration</p>
                    <h3 className="text-2xl font-bold text-gray-900">4 days</h3>
                    <p className="text-purple-600 text-xs mt-1">Per stage</p>
                </div>
            </div>

            {/* Stages List */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input placeholder="Search stages..." className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white" />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="rounded-none border-zinc-200 h-10 text-sm gap-2 bg-white flex-1 md:flex-none">
                            <Filter size={14} /> Filter
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Order</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Stage Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Pipeline</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Probability</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Avg. Duration</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Active Deals</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {stages.map((stage) => (
                                <tr key={stage.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <GripVertical size={16} className="text-gray-400 cursor-move" />
                                            <Badge className="bg-gray-600 text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5">{stage.order}</Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-none border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <Layers size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{stage.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-none text-[10px] font-bold px-2 py-0.5">
                                            {stage.pipeline}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-2 bg-zinc-100 rounded-none overflow-hidden">
                                                <div className="h-full bg-green-600" style={{ width: stage.probability }}></div>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{stage.probability}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm text-gray-700">{stage.duration}</span></td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-900">{stage.deals}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={stage.status === "Active"} onCheckedChange={() => toggleStatus(stage.id)} className="data-[state=checked]:bg-green-600" />
                                            <Badge className={`${stage.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>{stage.status}</Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100"><MoreVertical size={16} /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-none border-zinc-200 shadow-xl p-2 min-w-[180px]">
                                                <DropdownMenuLabel className="text-xs font-bold text-gray-600">Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-sm p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer">
                                                    <Edit size={14} /> Edit Stage
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-2" />
                                                <DropdownMenuItem onClick={() => deleteStage(stage.id)} className="text-sm p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer">
                                                    <Trash2 size={14} /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing {stages.length} stages</p>
                    <Button variant="link" className="text-blue-600 text-sm flex items-center gap-1 group">
                        View Pipeline Analytics <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-indigo-700 to-purple-800 p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Layers size={80} /></div>
                        <h2 className="text-2xl font-bold flex items-center gap-3"><Plus size={24} /> Create Pipeline Stage</h2>
                        <p className="text-sm opacity-80 mt-2">Add a new stage to your sales pipeline.</p>
                    </div>
                    <div className="p-8 space-y-6 bg-white">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Stage Name</Label>
                            <Input placeholder="e.g., Qualification" className="rounded-none border-zinc-200 h-12 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-600">Pipeline</Label>
                                <Select><SelectTrigger className="rounded-none border-zinc-200 h-12"><SelectValue placeholder="Select pipeline" /></SelectTrigger><SelectContent className="rounded-none"><SelectItem value="sales">Sales Pipeline</SelectItem><SelectItem value="support">Support Pipeline</SelectItem></SelectContent></Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-600">Probability (%)</Label>
                                <Input type="number" placeholder="e.g., 20" className="rounded-none border-zinc-200 h-12 text-sm" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Description (Optional)</Label>
                            <Textarea placeholder="Describe this stage..." className="rounded-none border-zinc-200 min-h-[80px] text-sm" />
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-none text-sm text-gray-600">Cancel</Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-none text-sm px-10 h-12 shadow-xl shadow-indigo-100">Create Stage</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
