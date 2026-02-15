"use client";

import React, { useState } from "react";
import {
    Shield,
    Plus,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    TrendingUp,
    Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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

export default function SLAPoliciesPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [slaPolicies, setSLAPolicies] = useState([
        { id: "1", name: "Critical Support Ticket", module: "Support", responseTime: "15 mins", resolutionTime: "4 hours", status: "Active", compliance: 98 },
        { id: "2", name: "High Priority Bug", module: "Development", responseTime: "30 mins", resolutionTime: "24 hours", status: "Active", compliance: 95 },
        { id: "3", name: "Sales Lead Follow-up", module: "CRM", responseTime: "1 hour", resolutionTime: "48 hours", status: "Active", compliance: 92 },
        { id: "4", name: "HR Onboarding", module: "HRM", responseTime: "2 hours", resolutionTime: "3 days", status: "Paused", compliance: 88 },
    ]);

    const toggleStatus = (id: string) => {
        setSLAPolicies(prev => prev.map(sla =>
            sla.id === id ? { ...sla, status: sla.status === "Active" ? "Paused" : "Active" } : sla
        ));
    };

    const deletePolicy = (id: string) => {
        setSLAPolicies(prev => prev.filter(sla => sla.id !== id));
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">SLA Policies</h1>
                    <p className="text-sm text-gray-600">Define Service Level Agreements for response and resolution times.</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6"
                >
                    <Plus size={16} /> Create SLA Policy
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Active SLAs</p>
                    <h2 className="text-white text-2xl font-bold">{slaPolicies.filter(s => s.status === "Active").length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Currently enforced</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Avg. Compliance</p>
                    <h3 className="text-2xl font-bold text-gray-900">93.2%</h3>
                    <p className="text-green-600 text-xs mt-1">Excellent performance</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Breaches (30d)</p>
                    <h3 className="text-2xl font-bold text-gray-900">12</h3>
                    <p className="text-amber-600 text-xs mt-1">Needs attention</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">On-Time Resolution</p>
                    <h3 className="text-2xl font-bold text-gray-900">96.8%</h3>
                    <p className="text-green-600 text-xs mt-1">Above target</p>
                </div>
            </div>

            {/* SLA Policies List */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search SLA policies..."
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
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Policy Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Module</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Response Time</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Resolution Time</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Compliance</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {slaPolicies.map((policy) => (
                                <tr key={policy.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-50 text-purple-600 rounded-none border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                                <Shield size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{policy.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-none text-[10px] font-bold px-2 py-0.5">
                                            {policy.module}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-700">
                                            <Clock size={12} className="text-blue-500" /> {policy.responseTime}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-700">
                                            <Clock size={12} className="text-green-500" /> {policy.resolutionTime}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-bold ${policy.compliance >= 95 ? 'text-green-600' : policy.compliance >= 90 ? 'text-blue-600' : 'text-amber-600'}`}>
                                                {policy.compliance}%
                                            </span>
                                            {policy.compliance >= 95 && <CheckCircle2 size={14} className="text-green-600" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={policy.status === "Active"}
                                                onCheckedChange={() => toggleStatus(policy.id)}
                                                className="data-[state=checked]:bg-green-600"
                                            />
                                            <Badge className={`${policy.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                                {policy.status}
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
                                                    <Edit size={14} /> Edit Policy
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-sm p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer">
                                                    <Activity size={14} /> View Metrics
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-2" />
                                                <DropdownMenuItem
                                                    onClick={() => deletePolicy(policy.id)}
                                                    className="text-sm p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer"
                                                >
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
                    <p className="text-sm text-gray-600">Showing {slaPolicies.length} SLA policies</p>
                    <Button variant="link" className="text-blue-600 text-sm flex items-center gap-1 group">
                        View Compliance Report <TrendingUp size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-purple-700 to-indigo-800 p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Shield size={80} />
                        </div>
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Plus size={24} /> Create SLA Policy
                        </h2>
                        <p className="text-sm opacity-80 mt-2">Define service level commitments for your team.</p>
                    </div>
                    <div className="p-8 space-y-6 bg-white">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Policy Name</Label>
                            <Input placeholder="e.g., Critical Support Ticket" className="rounded-none border-zinc-200 h-12 text-sm" />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Module</Label>
                            <Select>
                                <SelectTrigger className="rounded-none border-zinc-200 h-12">
                                    <SelectValue placeholder="Select module" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="support">Support</SelectItem>
                                    <SelectItem value="crm">CRM</SelectItem>
                                    <SelectItem value="hrm">HRM</SelectItem>
                                    <SelectItem value="development">Development</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-600">Response Time</Label>
                                <Input placeholder="e.g., 15 mins" className="rounded-none border-zinc-200 h-12 text-sm" />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-600">Resolution Time</Label>
                                <Input placeholder="e.g., 4 hours" className="rounded-none border-zinc-200 h-12 text-sm" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-none text-sm text-gray-600">
                            Cancel
                        </Button>
                        <Button className="bg-purple-600 hover:bg-purple-700 rounded-none text-sm px-10 h-12 shadow-xl shadow-purple-100">
                            Create Policy
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
