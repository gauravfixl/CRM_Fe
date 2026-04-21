"use client";

import React, { useState, useEffect } from "react";
import { FileText, Plus, Search, Filter, MoreVertical, Edit, Trash2, ChevronRight, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { getAllInvoices, getAllDrafts, cancelInvoice, softDeleteInvoice, updateInvoice } from "@/modules/crm/invoices/hooks/invoiceHooks";
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
    const [workflows, setWorkflows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [invoicesRes, draftsRes] = await Promise.all([
                getAllInvoices(),
                getAllDrafts(),
            ]);
            const invoices = invoicesRes?.data?.data || invoicesRes?.data || [];
            const drafts = draftsRes?.data?.data || draftsRes?.data || [];

            const allItems = [
                ...drafts.map((d: any) => ({
                    id: d._id || d.id,
                    name: d.invoiceNumber || d.number || "Draft",
                    stages: 1,
                    approvalRequired: false,
                    autoNumber: true,
                    status: "Draft",
                    usage: 0,
                    _raw: d,
                })),
                ...invoices.map((inv: any) => ({
                    id: inv._id || inv.id,
                    name: inv.invoiceNumber || inv.number || "Invoice",
                    stages: inv.status === "Paid" ? 3 : inv.status === "Sent" ? 2 : 1,
                    approvalRequired: inv.status === "Pending",
                    autoNumber: true,
                    status: inv.status || "Pending",
                    usage: inv.totalAmount || inv.total || 0,
                    _raw: inv,
                })),
            ];
            setWorkflows(allItems);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to load invoices");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCancel = async (id: string) => {
        try {
            setActionLoading(id);
            await cancelInvoice(id);
            toast.success("Invoice cancelled successfully");
            fetchData();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to cancel invoice");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            setActionLoading(id);
            await softDeleteInvoice(id);
            toast.success("Invoice deleted successfully");
            fetchData();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to delete invoice");
        } finally {
            setActionLoading(null);
        }
    };

    const toggleStatus = (id: string) => {
        setWorkflows(prev => prev.map(w => w.id === id ? { ...w, status: w.status === "Active" ? "Paused" : "Active" } : w));
    };

    return (
        <div className="space-y-4 text-[12.5px]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-sm font-semibold tracking-tight">Invoice & Draft Flow</h1>
                    <p className="text-xs text-slate-500">Configure invoice creation and approval workflows.</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-medium text-xs h-8 gap-2 shadow-sm px-4">
                    <Plus size={16} /> Create Workflow
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-primary/70 to-primary p-4 rounded-xl shadow-sm text-white transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-white opacity-80">Total Workflows</p>
                    <h2 className="text-xl font-semibold text-white">{workflows.length}</h2>
                    <p className="text-[10px] text-white mt-1 opacity-80">Configured</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-slate-500">Active Workflows</p>
                    <h3 className="text-xl font-semibold text-gray-900">{workflows.filter(w => w.status === "Active").length}</h3>
                    <p className="text-[10px] text-green-600 mt-1">Currently in use</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-slate-500">Total Usage</p>
                    <h3 className="text-xl font-semibold text-gray-900">{workflows.reduce((sum, w) => sum + w.usage, 0).toLocaleString()}</h3>
                    <p className="text-[10px] text-blue-600 mt-1">Invoices processed</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-slate-500">With Approval</p>
                    <h3 className="text-xl font-semibold text-gray-900">{workflows.filter(w => w.approvalRequired).length}</h3>
                    <p className="text-[10px] text-purple-600 mt-1">Require approval</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input placeholder="Search workflows..." className="pl-11 rounded-lg border-zinc-200 h-9 text-xs bg-white" />
                    </div>
                    <Button variant="outline" className="rounded-lg border-zinc-200 h-8 text-xs font-medium gap-2 bg-white"><Filter size={14} /> Filter</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Workflow Name</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Stages</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Approval</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Auto Number</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Usage</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Status</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center">
                                        <div className="flex items-center justify-center gap-2 text-slate-500">
                                            <Loader2 size={18} className="animate-spin" />
                                            <span className="text-xs">Loading invoices...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : workflows.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center">
                                        <span className="text-xs text-slate-500">No invoices found.</span>
                                    </td>
                                </tr>
                            ) : workflows.map((workflow) => (
                                <tr key={workflow.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <FileText size={16} />
                                            </div>
                                            <span className="text-xs font-medium text-gray-900">{workflow.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3"><span className="text-xs font-medium text-gray-900">{workflow.stages} stages</span></td>
                                    <td className="px-5 py-3">
                                        {workflow.approvalRequired ? (
                                            <Badge className="bg-purple-600 text-white border-none rounded-md text-[10px] font-medium px-2 py-0.5 flex items-center gap-1 w-fit">
                                                <CheckCircle2 size={10} /> Required
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-zinc-400 text-white border-none rounded-md text-[10px] font-medium px-2 py-0.5">Not Required</Badge>
                                        )}
                                    </td>
                                    <td className="px-5 py-3">
                                        {workflow.autoNumber ? (
                                            <Badge className="bg-green-600 text-white border-none rounded-md text-[10px] font-medium px-2 py-0.5">Enabled</Badge>
                                        ) : (
                                            <Badge className="bg-zinc-400 text-white border-none rounded-md text-[10px] font-medium px-2 py-0.5">Disabled</Badge>
                                        )}
                                    </td>
                                    <td className="px-5 py-3"><span className="text-xs font-medium text-gray-900">{typeof workflow.usage === 'number' ? workflow.usage.toLocaleString() : workflow.usage}</span></td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={workflow.status === "Active" || workflow.status === "Paid" || workflow.status === "Sent"} onCheckedChange={() => toggleStatus(workflow.id)} className="data-[state=checked]:bg-green-600" />
                                            <Badge className={`${workflow.status === "Draft" ? "bg-zinc-400" : workflow.status === "Paid" ? "bg-green-600" : workflow.status === "Cancelled" ? "bg-red-600" : "bg-blue-600"} text-white border-none rounded-md text-[10px] font-medium px-2 py-0.5`}>{workflow.status}</Badge>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-zinc-100" disabled={actionLoading === workflow.id}>
                                                    {actionLoading === workflow.id ? <Loader2 size={16} className="animate-spin" /> : <MoreVertical size={16} />}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border-zinc-200 shadow-lg p-2 min-w-[180px]">
                                                <DropdownMenuLabel className="text-[10px] font-medium text-slate-500">Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-xs p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer"><Edit size={14} /> Edit Workflow</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleCancel(workflow.id)} className="text-xs p-2 flex items-center gap-2 text-amber-600 focus:bg-amber-600 focus:text-white cursor-pointer"><XCircle size={14} /> Cancel Invoice</DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-2" />
                                                <DropdownMenuItem onClick={() => handleDelete(workflow.id)} className="text-xs p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer"><Trash2 size={14} /> Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-xs text-slate-500">Showing {workflows.length} workflows</p>
                    <Button variant="link" className="text-blue-600 text-xs flex items-center gap-1 group">View Invoice Analytics <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></Button>
                </div>
            </div>

            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-lg rounded-xl p-0 overflow-hidden shadow-lg border-none">
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5 text-white relative">
                        <h2 className="text-sm font-semibold flex items-center gap-3"><Plus size={18} /> Create Invoice Workflow</h2>
                        <p className="text-xs opacity-80 mt-1">Define how invoices are created and approved.</p>
                    </div>
                    <div className="p-5 space-y-4 bg-white">
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-slate-500">Workflow Name</Label>
                            <Input placeholder="e.g., Standard Invoice Flow" className="rounded-lg border-zinc-200 h-9 text-xs" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-slate-500">Number of Stages</Label>
                                <Input type="number" placeholder="e.g., 4" className="rounded-lg border-zinc-200 h-9 text-xs" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-slate-500">Approval Required</Label>
                                <Select><SelectTrigger className="rounded-lg border-zinc-200 h-9 text-xs"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent className="rounded-lg"><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent></Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-5 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-lg text-xs text-slate-500">Cancel</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-medium px-4 h-8 shadow-sm">Create Workflow</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
