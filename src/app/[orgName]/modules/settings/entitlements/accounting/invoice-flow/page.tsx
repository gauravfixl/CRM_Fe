"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FileText, Plus, Search, Filter, MoreVertical, Edit, Trash2, ChevronRight, CheckCircle2, Loader2, XCircle, Info } from "lucide-react";
import { getAllInvoices, getAllDrafts, cancelInvoice, softDeleteInvoice } from "@/modules/crm/invoices/hooks/invoiceHooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import { showSuccess, showError, showWarning } from "@/shared/utils/toast";

export default function InvoiceDraftFlowPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [workflows, setWorkflows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState("");

    const [formName, setFormName] = useState("");
    const [formStages, setFormStages] = useState("");
    const [formApproval, setFormApproval] = useState("");
    const [formAutoNumber, setFormAutoNumber] = useState(true);
    const [formDescription, setFormDescription] = useState("");
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const resetForm = () => {
        setFormName("");
        setFormStages("");
        setFormApproval("");
        setFormAutoNumber(true);
        setFormDescription("");
        setTouched({});
    };

    const errors = useMemo(() => {
        const e: Record<string, string> = {};
        const name = formName.trim();
        const stages = formStages.trim();

        if (touched.name) {
            if (!name) e.name = "Workflow name is required";
            else if (name.length < 3) e.name = "Name is too short";
            else if (name.length > 60) e.name = "Name must be under 60 characters";
        }
        if (touched.stages) {
            if (!stages) e.stages = "Number of stages is required";
            else {
                const n = Number(stages);
                if (!Number.isInteger(n)) e.stages = "Must be a whole number";
                else if (n < 1) e.stages = "At least 1 stage required";
                else if (n > 10) e.stages = "Maximum 10 stages";
            }
        }
        if (touched.approval && !formApproval) e.approval = "Approval setting is required";
        return e;
    }, [formName, formStages, formApproval, touched]);

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
            showError(err?.response?.data?.message || "Failed to load invoices");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return workflows;
        return workflows.filter((w) =>
            (w.name || "").toLowerCase().includes(q) ||
            (w.status || "").toLowerCase().includes(q)
        );
    }, [workflows, search]);

    const handleCancel = async (id: string) => {
        try {
            setActionLoading(id);
            await cancelInvoice(id);
            showSuccess("Invoice cancelled successfully");
            fetchData();
        } catch (err: any) {
            showError(err?.response?.data?.message || "Failed to cancel invoice");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Move this invoice to trash?")) return;
        try {
            setActionLoading(id);
            await softDeleteInvoice(id);
            showSuccess("Invoice deleted successfully");
            fetchData();
        } catch (err: any) {
            showError(err?.response?.data?.message || "Failed to delete invoice");
        } finally {
            setActionLoading(null);
        }
    };

    const toggleStatus = (id: string) => {
        setWorkflows((prev) =>
            prev.map((w) =>
                w.id === id
                    ? { ...w, status: w.status === "Active" ? "Paused" : "Active" }
                    : w
            )
        );
    };

    const handleCreateWorkflow = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ name: true, stages: true, approval: true });

        const name = formName.trim();
        const n = Number(formStages);
        const fresh: Record<string, string> = {};
        if (!name || name.length < 3) fresh.name = "Invalid name";
        if (!Number.isInteger(n) || n < 1 || n > 10) fresh.stages = "Invalid stages";
        if (!formApproval) fresh.approval = "Required";

        if (Object.keys(fresh).length > 0) {
            showWarning("Please fix the errors before submitting");
            return;
        }

        setSubmitting(true);
        try {
            await new Promise((r) => setTimeout(r, 400));
            showSuccess("Workflow created successfully");
            setShowCreateModal(false);
            resetForm();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-4 text-[12.5px]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-sm font-semibold tracking-tight">Invoice & Draft Flow</h1>
                    <p className="text-xs text-slate-500">Configure invoice creation and approval workflows.</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 font-medium text-xs h-8 gap-2 shadow-sm px-4"
                >
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
                    <h3 className="text-xl font-semibold text-gray-900">{workflows.filter((w) => w.status === "Active").length}</h3>
                    <p className="text-[10px] text-green-600 mt-1">Currently in use</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-slate-500">Total Usage</p>
                    <h3 className="text-xl font-semibold text-gray-900">
                        {workflows.reduce((sum, w) => sum + (typeof w.usage === "number" ? w.usage : 0), 0).toLocaleString()}
                    </h3>
                    <p className="text-[10px] text-blue-600 mt-1">Invoices processed</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-slate-500">With Approval</p>
                    <h3 className="text-xl font-semibold text-gray-900">{workflows.filter((w) => w.approvalRequired).length}</h3>
                    <p className="text-[10px] text-purple-600 mt-1">Require approval</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search workflows..."
                            className="pl-11 rounded-lg border-zinc-200 h-9 text-xs bg-white"
                        />
                    </div>
                    <Button variant="outline" className="rounded-lg border-zinc-200 h-8 text-xs font-medium gap-2 bg-white">
                        <Filter size={14} /> Filter
                    </Button>
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
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center">
                                        <span className="text-xs text-slate-500">No invoices found.</span>
                                    </td>
                                </tr>
                            ) : filtered.map((workflow) => (
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
                                    <td className="px-5 py-3"><span className="text-xs font-medium text-gray-900">{typeof workflow.usage === "number" ? workflow.usage.toLocaleString() : workflow.usage}</span></td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={workflow.status === "Active" || workflow.status === "Paid" || workflow.status === "Sent"}
                                                onCheckedChange={() => toggleStatus(workflow.id)}
                                                className="data-[state=checked]:bg-green-600"
                                            />
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
                                                <DropdownMenuItem className="text-xs p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer">
                                                    <Edit size={14} /> Edit Workflow
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleCancel(workflow.id)}
                                                    className="text-xs p-2 flex items-center gap-2 text-amber-600 focus:bg-amber-600 focus:text-white cursor-pointer"
                                                >
                                                    <XCircle size={14} /> Cancel Invoice
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-2" />
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(workflow.id)}
                                                    className="text-xs p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer"
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

                <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-xs text-slate-500">Showing {filtered.length} workflows</p>
                    <Button variant="link" className="text-blue-600 text-xs flex items-center gap-1 group">
                        View Invoice Analytics <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            <SideFormSheet
                open={showCreateModal}
                onOpenChange={(o) => {
                    setShowCreateModal(o);
                    if (!o) resetForm();
                }}
                title="Create Invoice Workflow"
                description="Define how invoices are created and approved."
                icon={<FileText className="w-5 h-5" />}
                onSubmit={handleCreateWorkflow}
                submitLabel="Create Workflow"
                loading={submitting}
                width="md"
            >
                <div className="space-y-4">
                    <Field
                        label="Workflow Name"
                        required
                        error={errors.name}
                        hint="Internal name shown to accounting team"
                    >
                        <Input
                            placeholder="e.g., Standard Invoice Flow"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field
                            label="Number of Stages"
                            required
                            error={errors.stages}
                            hint="Between 1 and 10"
                        >
                            <Input
                                type="number"
                                placeholder="4"
                                value={formStages}
                                onChange={(e) => setFormStages(e.target.value.replace(/[^0-9]/g, ""))}
                                onBlur={() => setTouched((t) => ({ ...t, stages: true }))}
                                min={1}
                                max={10}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>
                        <Field
                            label="Approval Required"
                            required
                            error={errors.approval}
                        >
                            <Select
                                value={formApproval}
                                onValueChange={(v) => {
                                    setFormApproval(v);
                                    setTouched((t) => ({ ...t, approval: true }));
                                }}
                            >
                                <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary text-[13px]">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg">
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg bg-[#FAFBFC]">
                        <div>
                            <p className="text-[13px] font-semibold text-[#374151]">Auto-Number Invoices</p>
                            <p className="text-[11.5px] text-[#64748B] mt-0.5">
                                Generate sequential numbers on creation
                            </p>
                        </div>
                        <Switch
                            checked={formAutoNumber}
                            onCheckedChange={setFormAutoNumber}
                            className="data-[state=checked]:bg-primary"
                        />
                    </div>

                    <Field
                        label="Description"
                        hint="Optional notes for your team"
                    >
                        <Textarea
                            placeholder="When this workflow should be used..."
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            className="min-h-[80px] rounded-lg border-[#E5E7EB] bg-white focus:border-primary text-[13px]"
                        />
                    </Field>

                    <div className="flex items-start gap-2 p-3 bg-[#F0F7FF] border border-[#DBEAFE] rounded-lg">
                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-[11.5px] text-[#475569] leading-relaxed">
                            Enabling approval routes invoices through the reviewer before they can be sent to clients.
                        </p>
                    </div>
                </div>
            </SideFormSheet>
        </div>
    );
}
