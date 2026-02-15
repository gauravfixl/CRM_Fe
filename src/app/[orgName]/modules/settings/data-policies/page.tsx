"use client";

import React, { useState } from "react";
import {
    FileText,
    Plus,
    Shield,
    Lock,
    Eye,
    EyeOff,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    ChevronRight
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
import { Textarea } from "@/shared/components/ui/textarea";

export default function DataPoliciesPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [dataPolicies, setDataPolicies] = useState([
        { id: "1", name: "GDPR Compliance", type: "Privacy", scope: "All Modules", enforcement: "Strict", status: "Active", compliance: 98 },
        { id: "2", name: "Data Encryption at Rest", type: "Security", scope: "Database", enforcement: "Mandatory", status: "Active", compliance: 100 },
        { id: "3", name: "PII Data Masking", type: "Privacy", scope: "Reports", enforcement: "Strict", status: "Active", compliance: 95 },
        { id: "4", name: "Data Anonymization", type: "Privacy", scope: "Analytics", enforcement: "Standard", status: "Paused", compliance: 92 },
    ]);

    const toggleStatus = (id: string) => {
        setDataPolicies(prev => prev.map(policy =>
            policy.id === id ? { ...policy, status: policy.status === "Active" ? "Paused" : "Active" } : policy
        ));
    };

    const deletePolicy = (id: string) => {
        setDataPolicies(prev => prev.filter(policy => policy.id !== id));
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Data Policies</h1>
                    <p className="text-sm text-gray-600">Manage data privacy, security, and compliance policies.</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6"
                >
                    <Plus size={16} /> Create Policy
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Active Policies</p>
                    <h2 className="text-white text-2xl font-bold">{dataPolicies.filter(p => p.status === "Active").length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Currently enforced</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Compliance Score</p>
                    <h3 className="text-2xl font-bold text-gray-900">96.2%</h3>
                    <p className="text-green-600 text-xs mt-1">Excellent</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Protected Records</p>
                    <h3 className="text-2xl font-bold text-gray-900">24,580</h3>
                    <p className="text-blue-600 text-xs mt-1">Under governance</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Policy Violations</p>
                    <h3 className="text-2xl font-bold text-gray-900">3</h3>
                    <p className="text-amber-600 text-xs mt-1">Last 30 days</p>
                </div>
            </div>

            {/* Policies List */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search data policies..."
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
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Scope</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Enforcement</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Compliance</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {dataPolicies.map((policy) => (
                                <tr key={policy.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-none border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <Shield size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{policy.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={`${policy.type === "Privacy" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-red-50 text-red-700 border-red-200"} rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                            {policy.type}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-700">{policy.scope}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={`${policy.enforcement === "Mandatory" || policy.enforcement === "Strict" ? "bg-red-600" : "bg-blue-600"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                            {policy.enforcement}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm font-bold ${policy.compliance >= 95 ? 'text-green-600' : 'text-amber-600'}`}>
                                            {policy.compliance}%
                                        </span>
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
                                                    <Eye size={14} /> View Details
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
                    <p className="text-sm text-gray-600">Showing {dataPolicies.length} data policies</p>
                    <Button variant="link" className="text-blue-600 text-sm flex items-center gap-1 group">
                        View Compliance Report <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-indigo-700 to-purple-800 p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Shield size={80} />
                        </div>
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Plus size={24} /> Create Data Policy
                        </h2>
                        <p className="text-sm opacity-80 mt-2">Define governance rules for data protection and compliance.</p>
                    </div>
                    <div className="p-8 space-y-6 bg-white">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Policy Name</Label>
                            <Input placeholder="e.g., GDPR Compliance" className="rounded-none border-zinc-200 h-12 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-600">Policy Type</Label>
                                <Select>
                                    <SelectTrigger className="rounded-none border-zinc-200 h-12">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="privacy">Privacy</SelectItem>
                                        <SelectItem value="security">Security</SelectItem>
                                        <SelectItem value="compliance">Compliance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-600">Enforcement Level</Label>
                                <Select>
                                    <SelectTrigger className="rounded-none border-zinc-200 h-12">
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="mandatory">Mandatory</SelectItem>
                                        <SelectItem value="strict">Strict</SelectItem>
                                        <SelectItem value="standard">Standard</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Description</Label>
                            <Textarea placeholder="Describe the policy requirements..." className="rounded-none border-zinc-200 min-h-[100px] text-sm" />
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-none text-sm text-gray-600">
                            Cancel
                        </Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-none text-sm px-10 h-12 shadow-xl shadow-indigo-100">
                            Create Policy
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
