"use client";

import React, { useState } from "react";
import {
    Clock,
    Plus,
    Trash2,
    Archive,
    Search,
    Filter,
    MoreVertical,
    Edit,
    ChevronRight,
    AlertCircle
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

export default function RetentionRulesPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [retentionRules, setRetentionRules] = useState([
        { id: "1", name: "Old Leads Cleanup", dataType: "Leads", retention: "180 days", action: "Archive", status: "Active", affected: "1,204" },
        { id: "2", name: "Closed Deals Archive", dataType: "Deals", retention: "365 days", action: "Archive", status: "Active", affected: "856" },
        { id: "3", name: "Inactive Contacts", dataType: "Contacts", retention: "730 days", action: "Delete", status: "Active", affected: "342" },
        { id: "4", name: "Old Support Tickets", dataType: "Tickets", retention: "90 days", action: "Archive", status: "Paused", affected: "2,103" },
    ]);

    const toggleStatus = (id: string) => {
        setRetentionRules(prev => prev.map(rule =>
            rule.id === id ? { ...rule, status: rule.status === "Active" ? "Paused" : "Active" } : rule
        ));
    };

    const deleteRule = (id: string) => {
        setRetentionRules(prev => prev.filter(rule => rule.id !== id));
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Data Retention Rules</h1>
                    <p className="text-sm text-gray-600">Automate data lifecycle management with retention policies.</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6"
                >
                    <Plus size={16} /> Create Rule
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Active Rules</p>
                    <h2 className="text-white text-2xl font-bold">{retentionRules.filter(r => r.status === "Active").length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Currently running</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Records Archived</p>
                    <h3 className="text-2xl font-bold text-gray-900">8,420</h3>
                    <p className="text-blue-600 text-xs mt-1">Last 30 days</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Records Deleted</p>
                    <h3 className="text-2xl font-bold text-gray-900">1,250</h3>
                    <p className="text-amber-600 text-xs mt-1">Last 30 days</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Storage Saved</p>
                    <h3 className="text-2xl font-bold text-gray-900">2.4 GB</h3>
                    <p className="text-green-600 text-xs mt-1">This month</p>
                </div>
            </div>

            {/* Rules List */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search retention rules..."
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
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Rule Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Data Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Retention Period</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Action</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Affected Records</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {retentionRules.map((rule) => (
                                <tr key={rule.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-50 text-purple-600 rounded-none border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                                <Clock size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{rule.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-none text-[10px] font-bold px-2 py-0.5">
                                            {rule.dataType}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-700">
                                            <Clock size={12} /> {rule.retention}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={`${rule.action === "Archive" ? "bg-amber-600" : "bg-red-600"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 w-fit`}>
                                            {rule.action === "Archive" ? <Archive size={10} /> : <Trash2 size={10} />} {rule.action}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-gray-900">{rule.affected}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={rule.status === "Active"}
                                                onCheckedChange={() => toggleStatus(rule.id)}
                                                className="data-[state=checked]:bg-green-600"
                                            />
                                            <Badge className={`${rule.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                                {rule.status}
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
                                                    <Edit size={14} /> Edit Rule
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-sm p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer">
                                                    <Clock size={14} /> Run Now
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-2" />
                                                <DropdownMenuItem
                                                    onClick={() => deleteRule(rule.id)}
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
                    <p className="text-sm text-gray-600">Showing {retentionRules.length} retention rules</p>
                    <Button variant="link" className="text-blue-600 text-sm flex items-center gap-1 group">
                        View Execution History <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-purple-700 to-indigo-800 p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Clock size={80} />
                        </div>
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Plus size={24} /> Create Retention Rule
                        </h2>
                        <p className="text-sm opacity-80 mt-2">Define automated data lifecycle policies.</p>
                    </div>
                    <div className="p-8 space-y-6 bg-white">
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-none flex items-start gap-3">
                            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-amber-900 mb-1">Important</p>
                                <p className="text-xs text-amber-800">Retention rules will automatically archive or delete data. Ensure you have backups before enabling.</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Rule Name</Label>
                            <Input placeholder="e.g., Old Leads Cleanup" className="rounded-none border-zinc-200 h-12 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-600">Data Type</Label>
                                <Select>
                                    <SelectTrigger className="rounded-none border-zinc-200 h-12">
                                        <SelectValue placeholder="Select data type" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="leads">Leads</SelectItem>
                                        <SelectItem value="contacts">Contacts</SelectItem>
                                        <SelectItem value="deals">Deals</SelectItem>
                                        <SelectItem value="tickets">Support Tickets</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-600">Retention Period</Label>
                                <Select>
                                    <SelectTrigger className="rounded-none border-zinc-200 h-12">
                                        <SelectValue placeholder="Select period" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="90">90 days</SelectItem>
                                        <SelectItem value="180">180 days</SelectItem>
                                        <SelectItem value="365">1 year</SelectItem>
                                        <SelectItem value="730">2 years</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Action</Label>
                            <Select>
                                <SelectTrigger className="rounded-none border-zinc-200 h-12">
                                    <SelectValue placeholder="Select action" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="archive">Archive (Move to archive)</SelectItem>
                                    <SelectItem value="delete">Delete (Permanent removal)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-none text-sm text-gray-600">
                            Cancel
                        </Button>
                        <Button className="bg-purple-600 hover:bg-purple-700 rounded-none text-sm px-10 h-12 shadow-xl shadow-purple-100">
                            Create Rule
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
