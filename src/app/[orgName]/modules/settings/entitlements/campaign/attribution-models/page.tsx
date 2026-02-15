"use client";

import React, { useState } from "react";
import { TrendingUp, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Dialog, DialogContent, DialogFooter } from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

export default function AttributionModelsPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [models, setModels] = useState([
        { id: "1", name: "First Touch", type: "Single Touch", weight: "100%", description: "Credits first interaction", status: "Active", campaigns: 45 },
        { id: "2", name: "Last Touch", type: "Single Touch", weight: "100%", description: "Credits last interaction", status: "Active", campaigns: 89 },
        { id: "3", name: "Linear", type: "Multi Touch", weight: "Equal", description: "Equal credit to all", status: "Active", campaigns: 24 },
        { id: "4", name: "Time Decay", type: "Multi Touch", weight: "Weighted", description: "More recent gets more", status: "Paused", campaigns: 12 },
    ]);

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Attribution Models</h1>
                    <p className="text-sm text-gray-600">Configure how campaign success is attributed across touchpoints.</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6">
                    <Plus size={16} /> Create Model
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Attribution Models</p>
                    <h2 className="text-white text-2xl font-bold">{models.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Configured</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Active Models</p>
                    <h3 className="text-2xl font-bold text-gray-900">{models.filter(m => m.status === "Active").length}</h3>
                    <p className="text-green-600 text-xs mt-1">In use</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Total Campaigns</p>
                    <h3 className="text-2xl font-bold text-gray-900">{models.reduce((sum, m) => sum + m.campaigns, 0)}</h3>
                    <p className="text-blue-600 text-xs mt-1">Using attribution</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Accuracy</p>
                    <h3 className="text-2xl font-bold text-gray-900">92%</h3>
                    <p className="text-green-600 text-xs mt-1">Model performance</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input placeholder="Search models..." className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Model Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Weight Distribution</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Description</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Campaigns</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {models.map((model) => (
                                <tr key={model.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-50 text-green-600 rounded-none border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-all">
                                                <TrendingUp size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{model.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-none text-[10px] font-bold px-2 py-0.5">
                                            {model.type}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-900">{model.weight}</span></td>
                                    <td className="px-6 py-4"><span className="text-sm text-gray-700">{model.description}</span></td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-900">{model.campaigns}</span></td>
                                    <td className="px-6 py-4">
                                        <Switch checked={model.status === "Active"} className="data-[state=checked]:bg-green-600" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-green-700 to-emerald-800 p-8 text-white relative">
                        <h2 className="text-2xl font-bold flex items-center gap-3"><Plus size={24} /> Create Attribution Model</h2>
                        <p className="text-sm opacity-80 mt-2">Define how campaign touchpoints are credited.</p>
                    </div>
                    <div className="p-8 space-y-6 bg-white">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Model Name</Label>
                            <Input placeholder="e.g., First Touch" className="rounded-none border-zinc-200 h-12 text-sm" />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Model Type</Label>
                            <Select><SelectTrigger className="rounded-none border-zinc-200 h-12"><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent className="rounded-none"><SelectItem value="single">Single Touch</SelectItem><SelectItem value="multi">Multi Touch</SelectItem></SelectContent></Select>
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-none text-sm text-gray-600">Cancel</Button>
                        <Button className="bg-green-600 hover:bg-green-700 rounded-none text-sm px-10 h-12 shadow-xl shadow-green-100">Create Model</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
