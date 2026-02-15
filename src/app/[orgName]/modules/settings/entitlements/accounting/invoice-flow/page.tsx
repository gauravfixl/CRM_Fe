"use client";

import React, { useState } from "react";
import { FileText, Plus, Search, Filter, MoreVertical, Edit, Trash2, ChevronRight, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Dialog, DialogContent, DialogFooter } from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

export default function InvoiceDraftFlowPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [workflows, setWorkflows] = useState([
        { id: "1", name: "Standard Invoice Flow", stages: 4, approvalRequired: true, autoNumber: true, status: "Active", usage: 1204 },
        { id: "2", name: "Draft Review Process", stages: 3, approvalRequired: true, autoNumber: false, status: "Active", usage: 856 },
        { id: "3", name: "Quick Invoice", stages: 2, approvalRequired: false, autoNumber: true, status: "Active", usage: 342 },
        { id: "4", name: "Recurring Invoice", stages: 5, approvalRequired: true, autoNumber: true, status: "Paused", usage: 120 },
    ]);

    const toggleStatus = (id: string) => {
        setWorkflows(prev => prev.map(w => w.id === id ? { ...w, status: w.status === "Active" ? "Paused" : "Active" } : w));
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Invoice & Draft Flow</h1>
                    <p className="text-sm text-gray-600">Configure invoice creation and approval workflows.</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6">
                    <Plus size={16} /> Create Workflow
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Total Workflows</p>
                    <h2 className="text-white text-2xl font-bold">{workflows.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Configured</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Active Workflows</p>
                    <h3 className="text-2xl font-bold text-gray-900">{workflows.filter(w => w.status === "Active").length}</h3>
                    <p className="text-green-600 text-xs mt-1">Currently in use</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Total Usage</p>
                    <h3 className="text-2xl font-bold text-gray-900">{workflows.reduce((sum, w) => sum + w.usage, 0).toLocaleString()}</h3>
                    <p className="text-blue-600 text-xs mt-1">Invoices processed</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">With Approval</p>
                    <h3 className="text-2xl font-bold text-gray-900">{workflows.filter(w => w.approvalRequired).length}</h3>
                    <p className="text-purple-600 text-xs mt-1">Require approval</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input placeholder="Search workflows..." className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white" />
                    </div>
                    <Button variant="outline" className="rounded-none border-zinc-200 h-10 text-sm gap-2 bg-white"><Filter size={14} /> Filter</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Workflow Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Stages</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Approval</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Auto Number</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Usage</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {workflows.map((workflow) => (
                                <tr key={workflow.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-none border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <FileText size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{workflow.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-900">{workflow.stages} stages</span></td>
                                    <td className="px-6 py-4">
                                        {workflow.approvalRequired ? (
                                            <Badge className="bg-purple-600 text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 w-fit">
                                                <CheckCircle2 size={10} /> Required
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-zinc-400 text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5">Not Required</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {workflow.autoNumber ? (
                                            <Badge className="bg-green-600 text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5">Enabled</Badge>
                                        ) : (
                                            <Badge className="bg-zinc-400 text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5">Disabled</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-900">{workflow.usage.toLocaleString()}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={workflow.status === "Active"} onCheckedChange={() => toggleStatus(workflow.id)} className="data-[state=checked]:bg-green-600" />
                                            <Badge className={`${workflow.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>{workflow.status}</Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100"><MoreVertical size={16} /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-none border-zinc-200 shadow-xl p-2 min-w-[180px]">
                                                <DropdownMenuLabel className="text-xs font-bold text-gray-600">Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-sm p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer"><Edit size={14} /> Edit Workflow</DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-2" />
                                                <DropdownMenuItem className="text-sm p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer"><Trash2 size={14} /> Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing {workflows.length} workflows</p>
                    <Button variant="link" className="text-blue-600 text-sm flex items-center gap-1 group">View Invoice Analytics <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></Button>
                </div>
            </div>

            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white relative">
                        <h2 className="text-2xl font-bold flex items-center gap-3"><Plus size={24} /> Create Invoice Workflow</h2>
                        <p className="text-sm opacity-80 mt-2">Define how invoices are created and approved.</p>
                    </div>
                    <div className="p-8 space-y-6 bg-white">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Workflow Name</Label>
                            <Input placeholder="e.g., Standard Invoice Flow" className="rounded-none border-zinc-200 h-12 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-600">Number of Stages</Label>
                                <Input type="number" placeholder="e.g., 4" className="rounded-none border-zinc-200 h-12 text-sm" />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-600">Approval Required</Label>
                                <Select><SelectTrigger className="rounded-none border-zinc-200 h-12"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent className="rounded-none"><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent></Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-none text-sm text-gray-600">Cancel</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 rounded-none text-sm px-10 h-12 shadow-xl shadow-blue-100">Create Workflow</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
