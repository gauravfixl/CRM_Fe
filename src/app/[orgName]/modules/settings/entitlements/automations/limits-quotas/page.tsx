"use client";

import React, { useState } from "react";
import {
    Gauge,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    AlertTriangle,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Progress } from "@/shared/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";

export default function LimitsQuotasPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [quotas, setQuotas] = useState([
        { id: "1", name: "Daily Email Limit", type: "Communication", limit: 1000, used: 742, unit: "emails/day", status: "Active" },
        { id: "2", name: "API Calls Per Hour", type: "Integration", limit: 5000, used: 3420, unit: "calls/hour", status: "Active" },
        { id: "3", name: "Workflow Executions", type: "Automation", limit: 10000, used: 8950, unit: "runs/month", status: "Active" },
        { id: "4", name: "Data Export Limit", type: "Data", limit: 50, used: 12, unit: "exports/day", status: "Active" },
    ]);

    const toggleStatus = (id: string) => {
        setQuotas(prev => prev.map(q =>
            q.id === id ? { ...q, status: q.status === "Active" ? "Paused" : "Active" } : q
        ));
    };

    const deleteQuota = (id: string) => {
        setQuotas(prev => prev.filter(q => q.id !== id));
    };

    const getUsagePercentage = (used: number, limit: number) => (used / limit) * 100;

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Limits & Quotas</h1>
                    <p className="text-sm text-gray-600">Manage resource limits and usage quotas for automation systems.</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6"
                >
                    <Plus size={16} /> Add Quota
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Total Quotas</p>
                    <h2 className="text-white text-2xl font-bold">{quotas.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Configured limits</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Near Limit</p>
                    <h3 className="text-2xl font-bold text-gray-900">{quotas.filter(q => getUsagePercentage(q.used, q.limit) > 80).length}</h3>
                    <p className="text-amber-600 text-xs mt-1">Needs attention</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Avg. Usage</p>
                    <h3 className="text-2xl font-bold text-gray-900">68%</h3>
                    <p className="text-blue-600 text-xs mt-1">Across all quotas</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Exceeded</p>
                    <h3 className="text-2xl font-bold text-gray-900">0</h3>
                    <p className="text-green-600 text-xs mt-1">All within limits</p>
                </div>
            </div>

            {/* Quotas List */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search quotas..."
                            className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white"
                        />
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
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Quota Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Limit</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Usage</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {quotas.map((quota) => {
                                const percentage = getUsagePercentage(quota.used, quota.limit);
                                return (
                                    <tr key={quota.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-amber-50 text-amber-600 rounded-none border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                                    <Gauge size={18} />
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{quota.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-none text-[10px] font-bold px-2 py-0.5">
                                                {quota.type}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-gray-900">{quota.limit.toLocaleString()} {quota.unit}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-2 min-w-[200px]">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-600">{quota.used.toLocaleString()} used</span>
                                                    <span className={`font-bold ${percentage > 90 ? 'text-red-600' : percentage > 80 ? 'text-amber-600' : 'text-green-600'}`}>
                                                        {percentage.toFixed(0)}%
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={percentage}
                                                    className={`h-2 rounded-none ${percentage > 90 ? 'bg-red-100' : percentage > 80 ? 'bg-amber-100' : 'bg-zinc-100'} [&>div]:${percentage > 90 ? 'bg-red-600' : percentage > 80 ? 'bg-amber-600' : 'bg-green-600'}`}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={quota.status === "Active"}
                                                    onCheckedChange={() => toggleStatus(quota.id)}
                                                    className="data-[state=checked]:bg-green-600"
                                                />
                                                <Badge className={`${quota.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                                    {quota.status}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-none border-zinc-200 shadow-xl p-2 min-w-[180px]">
                                                    <DropdownMenuLabel className="text-xs font-bold text-gray-600">Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="text-sm p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer">
                                                        <Edit size={14} /> Edit Quota
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-2" />
                                                    <DropdownMenuItem
                                                        onClick={() => deleteQuota(quota.id)}
                                                        className="text-sm p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing {quotas.length} quotas</p>
                    <Button variant="link" className="text-blue-600 text-sm flex items-center gap-1 group">
                        View Usage Report <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-amber-600 to-orange-700 p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Gauge size={80} />
                        </div>
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Plus size={24} /> Add Quota Limit
                        </h2>
                        <p className="text-sm opacity-80 mt-2">Define resource usage limits for your organization.</p>
                    </div>
                    <div className="p-8 space-y-6 bg-white">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Quota Name</Label>
                            <Input placeholder="e.g., Daily Email Limit" className="rounded-none border-zinc-200 h-12 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-600">Type</Label>
                                <Select>
                                    <SelectTrigger className="rounded-none border-zinc-200 h-12">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="comm">Communication</SelectItem>
                                        <SelectItem value="integration">Integration</SelectItem>
                                        <SelectItem value="automation">Automation</SelectItem>
                                        <SelectItem value="data">Data</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-600">Limit Value</Label>
                                <Input type="number" placeholder="e.g., 1000" className="rounded-none border-zinc-200 h-12 text-sm" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-none text-sm text-gray-600">
                            Cancel
                        </Button>
                        <Button className="bg-amber-600 hover:bg-amber-700 rounded-none text-sm px-10 h-12 shadow-xl shadow-amber-100">
                            Add Quota
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
