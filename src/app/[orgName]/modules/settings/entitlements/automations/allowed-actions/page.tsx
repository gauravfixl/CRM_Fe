"use client";

import React, { useState } from "react";
import {
    Shield,
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

export default function AllowedActionsPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [actions, setActions] = useState([
        { id: "1", name: "Send Email", category: "Communication", risk: "Low", modules: ["Leads", "Contacts"], status: "Allowed" },
        { id: "2", name: "Update Field Values", category: "Data Modification", risk: "Medium", modules: ["All"], status: "Allowed" },
        { id: "3", name: "Delete Records", category: "Data Modification", risk: "High", modules: ["Leads"], status: "Restricted" },
        { id: "4", name: "Create Tasks", category: "Task Management", risk: "Low", modules: ["All"], status: "Allowed" },
    ]);

    const toggleStatus = (id: string) => {
        setActions(prev => prev.map(a =>
            a.id === id ? { ...a, status: a.status === "Allowed" ? "Restricted" : "Allowed" } : a
        ));
    };

    const deleteAction = (id: string) => {
        setActions(prev => prev.filter(a => a.id !== id));
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Allowed Actions</h1>
                    <p className="text-sm text-gray-600">Control which automation actions are permitted in your organization.</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6"
                >
                    <Plus size={16} /> Add Action
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Total Actions</p>
                    <h2 className="text-white text-2xl font-bold">{actions.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Configured</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Allowed Actions</p>
                    <h3 className="text-2xl font-bold text-gray-900">{actions.filter(a => a.status === "Allowed").length}</h3>
                    <p className="text-green-600 text-xs mt-1">Available for use</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Restricted Actions</p>
                    <h3 className="text-2xl font-bold text-gray-900">{actions.filter(a => a.status === "Restricted").length}</h3>
                    <p className="text-red-600 text-xs mt-1">Blocked</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">High Risk Actions</p>
                    <h3 className="text-2xl font-bold text-gray-900">{actions.filter(a => a.risk === "High").length}</h3>
                    <p className="text-amber-600 text-xs mt-1">Needs review</p>
                </div>
            </div>

            {/* Actions List */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search actions..."
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
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Action Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Risk Level</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Modules</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {actions.map((action) => (
                                <tr key={action.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-50 text-green-600 rounded-none border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-all">
                                                <Shield size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{action.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-none text-[10px] font-bold px-2 py-0.5">
                                            {action.category}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={`${action.risk === "High" ? "bg-red-600" :
                                                action.risk === "Medium" ? "bg-amber-600" :
                                                    "bg-green-600"
                                            } text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 w-fit`}>
                                            {action.risk === "High" && <AlertTriangle size={10} />} {action.risk}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-700">{action.modules.join(", ")}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={action.status === "Allowed"}
                                                onCheckedChange={() => toggleStatus(action.id)}
                                                className="data-[state=checked]:bg-green-600"
                                            />
                                            <Badge className={`${action.status === "Allowed" ? "bg-green-600" : "bg-red-600"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                                {action.status}
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
                                                    <Edit size={14} /> Edit Action
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-2" />
                                                <DropdownMenuItem
                                                    onClick={() => deleteAction(action.id)}
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
                    <p className="text-sm text-gray-600">Showing {actions.length} actions</p>
                    <Button variant="link" className="text-blue-600 text-sm flex items-center gap-1 group">
                        View Security Log <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-green-700 to-emerald-800 p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Shield size={80} />
                        </div>
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Plus size={24} /> Add Allowed Action
                        </h2>
                        <p className="text-sm opacity-80 mt-2">Define which automation actions are permitted.</p>
                    </div>
                    <div className="p-8 space-y-6 bg-white">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Action Name</Label>
                            <Input placeholder="e.g., Send Email" className="rounded-none border-zinc-200 h-12 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-600">Category</Label>
                                <Select>
                                    <SelectTrigger className="rounded-none border-zinc-200 h-12">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="comm">Communication</SelectItem>
                                        <SelectItem value="data">Data Modification</SelectItem>
                                        <SelectItem value="task">Task Management</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-600">Risk Level</Label>
                                <Select>
                                    <SelectTrigger className="rounded-none border-zinc-200 h-12">
                                        <SelectValue placeholder="Select risk" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-none text-sm text-gray-600">
                            Cancel
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700 rounded-none text-sm px-10 h-12 shadow-xl shadow-green-100">
                            Add Action
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
