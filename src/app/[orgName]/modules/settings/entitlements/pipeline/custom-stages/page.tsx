"use client";

import React, { useState } from "react";
import { Layers, Plus, Search, Filter, MoreVertical, Edit, Trash2, GripVertical, ChevronRight, Users, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard";
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

    const [newStage, setNewStage] = useState({ name: "", pipeline: "", probability: "", description: "" });

    const toggleStatus = (id: string) => {
        setStages(prev => prev.map(s => s.id === id ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s));
    };

    const deleteStage = (id: string) => {
        setStages(prev => prev.filter(s => s.id !== id));
    };

    const handleCreateStage = () => {
        if (!newStage.name) return;
        const stage = {
            id: String(stages.length + 1),
            name: newStage.name,
            pipeline: newStage.pipeline || "Sales Pipeline",
            order: stages.length + 1,
            probability: newStage.probability ? `${newStage.probability}%` : "0%",
            duration: "—",
            status: "Active",
            deals: 0,
        };
        setStages(prev => [...prev, stage]);
        setNewStage({ name: "", pipeline: "", probability: "", description: "" });
        setShowCreateModal(false);
    };

    return (
        <div className="space-y-6 font-outfit p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold tracking-tight text-gray-900">Custom Pipeline Stages</h1>
                    <p className="text-xs text-gray-500 font-medium">Configure and manage stages for your sales pipelines.</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5">
                    <Plus size={16} /> Create Stage
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">Total Stages</p>
                                <p className="text-white text-xl font-semibold mt-1">{stages.length}</p>
                                <p className="text-white text-[10px] mt-1">Configured</p>
                            </div>
                            <Layers className="w-5 h-5 text-white" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Active Stages</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">{stages.filter(s => s.status === "Active").length}</p>
                                <p className="text-green-600 text-[10px] mt-1">Currently in use</p>
                            </div>
                            <Activity className="w-5 h-5 text-green-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Total Deals</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">{stages.reduce((sum, s) => sum + s.deals, 0)}</p>
                                <p className="text-blue-600 text-[10px] mt-1">Across all stages</p>
                            </div>
                            <Users className="w-5 h-5 text-blue-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Avg. Duration</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">4 days</p>
                                <p className="text-purple-600 text-[10px] mt-1">Per stage</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-purple-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Stages List */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <Input placeholder="Search stages..." className="pl-11 rounded-xl border-gray-200 h-10 text-sm bg-white" />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="rounded-xl border-gray-200 h-10 text-xs gap-2 bg-white flex-1 md:flex-none font-medium">
                            <Filter size={14} /> Filter
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Order</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Stage Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Pipeline</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Probability</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Avg. Duration</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Active Deals</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stages.map((stage) => (
                                <tr key={stage.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <GripVertical size={16} className="text-gray-400 cursor-move" />
                                            <Badge className="bg-gray-600 text-white border-none rounded-full text-xs font-medium px-2.5 py-0.5">{stage.order}</Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <Layers size={18} />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">{stage.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-full text-xs font-medium px-2.5 py-0.5">
                                            {stage.pipeline}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-600 rounded-full" style={{ width: stage.probability }}></div>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">{stage.probability}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm text-gray-700">{stage.duration}</span></td>
                                    <td className="px-6 py-4"><span className="text-sm font-semibold text-gray-900">{stage.deals}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={stage.status === "Active"} onCheckedChange={() => toggleStatus(stage.id)} className="data-[state=checked]:bg-green-600" />
                                            <Badge className={`${stage.status === "Active" ? "bg-green-600" : "bg-gray-400"} text-white border-none rounded-full text-xs font-medium px-2.5 py-0.5`}>{stage.status}</Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100"><MoreVertical size={16} /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border-gray-200 shadow-xl p-2 min-w-[180px]">
                                                <DropdownMenuLabel className="text-xs font-semibold text-gray-500">Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-sm p-2 rounded-lg flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer">
                                                    <Edit size={14} /> Edit Stage
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-2" />
                                                <DropdownMenuItem onClick={() => deleteStage(stage.id)} className="text-sm p-2 rounded-lg text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer">
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

                <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing {stages.length} stages</p>
                    <Button variant="link" className="text-blue-600 text-sm flex items-center gap-1 group font-medium">
                        View Pipeline Analytics <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 text-white">
                        <h2 className="text-sm font-semibold flex items-center gap-2"><Plus size={16} /> Create Pipeline Stage</h2>
                        <p className="text-xs opacity-80 mt-0.5">Add a new stage to your sales pipeline.</p>
                    </div>
                    <div className="px-5 py-4 space-y-4 bg-white">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-600">Stage Name</Label>
                            <Input
                                placeholder="e.g., Qualification"
                                value={newStage.name}
                                onChange={(e) => setNewStage(prev => ({ ...prev, name: e.target.value }))}
                                className="rounded-lg border-gray-200 h-9 text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">Pipeline</Label>
                                <Select onValueChange={(val) => setNewStage(prev => ({ ...prev, pipeline: val }))}>
                                    <SelectTrigger className="rounded-lg border-gray-200 h-9 text-sm">
                                        <SelectValue placeholder="Select pipeline" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg">
                                        <SelectItem value="Sales Pipeline">Sales Pipeline</SelectItem>
                                        <SelectItem value="Support Pipeline">Support Pipeline</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">Probability (%)</Label>
                                <Input
                                    type="number"
                                    placeholder="e.g., 20"
                                    value={newStage.probability}
                                    onChange={(e) => setNewStage(prev => ({ ...prev, probability: e.target.value }))}
                                    className="rounded-lg border-gray-200 h-9 text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-600">Description (Optional)</Label>
                            <Textarea
                                placeholder="Describe this stage..."
                                value={newStage.description}
                                onChange={(e) => setNewStage(prev => ({ ...prev, description: e.target.value }))}
                                className="rounded-lg border-gray-200 min-h-[60px] text-sm"
                            />
                        </div>
                    </div>
                    <DialogFooter className="px-5 py-3 bg-gray-50 border-t border-gray-100 gap-3 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-lg text-xs text-gray-600 h-9">Cancel</Button>
                        <Button onClick={handleCreateStage} className="bg-blue-600 hover:bg-blue-700 rounded-lg text-xs px-6 h-9 shadow-sm font-semibold">Create Stage</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
