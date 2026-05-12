"use client";

import React, { useState, useMemo } from "react";
import { AlertCircle, Plus, Search, ChevronRight, MoreVertical, Edit, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { showSuccess, showWarning } from "@/shared/utils/toast";

interface OverpaymentPolicy {
    id: string;
    name: string;
    action: string;
    threshold: string;
    autoApply: boolean;
    status: "Active" | "Paused";
    usage: number;
    description?: string;
}

const actionLabels: Record<string, string> = {
    credit: "Create Credit Note",
    refund: "Process Refund",
    next: "Apply to Next Invoice",
};

const initialPolicies: OverpaymentPolicy[] = [
    { id: "1", name: "Auto Credit Note", action: "Create Credit Note", threshold: "$10", autoApply: true, status: "Active", usage: 45 },
    { id: "2", name: "Refund Policy", action: "Process Refund", threshold: "$50", autoApply: false, status: "Active", usage: 28 },
    { id: "3", name: "Next Invoice Credit", action: "Apply to Next Invoice", threshold: "$5", autoApply: true, status: "Active", usage: 156 },
];

export default function OverpaymentPoliciesPage() {
    const [policies, setPolicies] = useState<OverpaymentPolicy[]>(initialPolicies);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<OverpaymentPolicy | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState("");

    const [formName, setFormName] = useState("");
    const [formAction, setFormAction] = useState("");
    const [formThreshold, setFormThreshold] = useState("");
    const [formAutoApply, setFormAutoApply] = useState(true);
    const [formDescription, setFormDescription] = useState("");
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const resetForm = () => {
        setFormName("");
        setFormAction("");
        setFormThreshold("");
        setFormAutoApply(true);
        setFormDescription("");
        setTouched({});
        setEditing(null);
    };

    const openCreate = () => {
        resetForm();
        setShowModal(true);
    };

    const openEdit = (p: OverpaymentPolicy) => {
        setEditing(p);
        setFormName(p.name);
        const actionKey = Object.keys(actionLabels).find((k) => actionLabels[k] === p.action) || "";
        setFormAction(actionKey);
        setFormThreshold(p.threshold.replace(/[^0-9.]/g, ""));
        setFormAutoApply(p.autoApply);
        setFormDescription(p.description || "");
        setTouched({});
        setShowModal(true);
    };

    const errors = useMemo(() => {
        const e: Record<string, string> = {};
        const name = formName.trim();
        const threshold = formThreshold.trim();

        if (touched.name) {
            if (!name) e.name = "Policy name is required";
            else if (name.length < 3) e.name = "Name is too short";
        }
        if (touched.action && !formAction) e.action = "Action is required";
        if (touched.threshold) {
            if (!threshold) e.threshold = "Threshold is required";
            else {
                const n = parseFloat(threshold);
                if (isNaN(n) || n < 0) e.threshold = "Must be a positive number";
                else if (n > 100000) e.threshold = "Threshold is too high";
            }
        }
        return e;
    }, [formName, formAction, formThreshold, touched]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return policies;
        return policies.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.action.toLowerCase().includes(q)
        );
    }, [policies, search]);

    const toggleStatus = (id: string) => {
        setPolicies((prev) =>
            prev.map((p) =>
                p.id === id
                    ? { ...p, status: p.status === "Active" ? "Paused" : "Active" }
                    : p
            )
        );
    };

    const removePolicy = (id: string) => {
        const p = policies.find((x) => x.id === id);
        if (!p) return;
        if (!window.confirm(`Remove policy "${p.name}"?`)) return;
        setPolicies((prev) => prev.filter((x) => x.id !== id));
        showSuccess("Policy removed");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ name: true, action: true, threshold: true });

        const name = formName.trim();
        const n = parseFloat(formThreshold);
        const fresh: Record<string, string> = {};
        if (!name || name.length < 3) fresh.name = "Invalid name";
        if (!formAction) fresh.action = "Required";
        if (isNaN(n) || n < 0 || n > 100000) fresh.threshold = "Invalid threshold";

        if (Object.keys(fresh).length > 0) {
            showWarning("Please fix the errors before submitting");
            return;
        }

        setSubmitting(true);
        try {
            await new Promise((r) => setTimeout(r, 400));
            const actionLabel = actionLabels[formAction];
            if (editing) {
                setPolicies((prev) =>
                    prev.map((p) =>
                        p.id === editing.id
                            ? {
                                ...p,
                                name,
                                action: actionLabel,
                                threshold: `$${n.toLocaleString()}`,
                                autoApply: formAutoApply,
                                description: formDescription.trim(),
                            }
                            : p
                    )
                );
                showSuccess("Policy updated successfully");
            } else {
                const newPolicy: OverpaymentPolicy = {
                    id: Date.now().toString(),
                    name,
                    action: actionLabel,
                    threshold: `$${n.toLocaleString()}`,
                    autoApply: formAutoApply,
                    status: "Active",
                    usage: 0,
                    description: formDescription.trim(),
                };
                setPolicies((prev) => [...prev, newPolicy]);
                showSuccess("Policy created successfully");
            }
            setShowModal(false);
            resetForm();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-4 text-[12.5px]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-sm font-semibold tracking-tight">Overpayment Policies</h1>
                    <p className="text-xs text-slate-500">Manage how overpayments are handled automatically.</p>
                </div>
                <Button
                    onClick={openCreate}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 font-medium text-xs h-8 gap-2 shadow-sm px-4"
                >
                    <Plus size={16} /> Create Policy
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-primary/70 to-primary p-4 rounded-xl shadow-sm text-white transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-white opacity-80">Active Policies</p>
                    <h2 className="text-xl font-semibold text-white">{policies.filter((p) => p.status === "Active").length}</h2>
                    <p className="text-[10px] text-white mt-1 opacity-80">Currently enforced</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-slate-500">Overpayments (30d)</p>
                    <h3 className="text-xl font-semibold text-gray-900">229</h3>
                    <p className="text-[10px] text-amber-600 mt-1">Cases handled</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-slate-500">Total Amount</p>
                    <h3 className="text-xl font-semibold text-gray-900">$12,450</h3>
                    <p className="text-[10px] text-blue-600 mt-1">Overpaid this month</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-slate-500">Auto-Applied</p>
                    <h3 className="text-xl font-semibold text-gray-900">85%</h3>
                    <p className="text-[10px] text-green-600 mt-1">Automated</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search policies..."
                            className="pl-11 rounded-lg border-zinc-200 h-9 text-xs bg-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Policy Name</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Action</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Threshold</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Auto Apply</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Usage</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Status</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center">
                                        <span className="text-xs text-slate-500">No policies found.</span>
                                    </td>
                                </tr>
                            ) : filtered.map((policy) => (
                                <tr key={policy.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                                <AlertCircle size={16} />
                                            </div>
                                            <span className="text-xs font-medium text-gray-900">{policy.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-md text-[10px] font-medium px-2 py-0.5">
                                            {policy.action}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-3"><span className="text-xs font-medium text-gray-900">{policy.threshold}</span></td>
                                    <td className="px-5 py-3">
                                        {policy.autoApply ? (
                                            <Badge className="bg-green-600 text-white border-none rounded-md text-[10px] font-medium px-2 py-0.5">Enabled</Badge>
                                        ) : (
                                            <Badge className="bg-zinc-400 text-white border-none rounded-md text-[10px] font-medium px-2 py-0.5">Manual</Badge>
                                        )}
                                    </td>
                                    <td className="px-5 py-3"><span className="text-xs font-medium text-gray-900">{policy.usage}</span></td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={policy.status === "Active"}
                                                onCheckedChange={() => toggleStatus(policy.id)}
                                                className="data-[state=checked]:bg-green-600"
                                            />
                                            <Badge className={`${policy.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-md text-[10px] font-medium px-2 py-0.5`}>{policy.status}</Badge>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-zinc-100">
                                                    <MoreVertical size={14} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border-zinc-200 shadow-lg p-2 min-w-[160px]">
                                                <DropdownMenuItem
                                                    onClick={() => openEdit(policy)}
                                                    className="text-xs p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer"
                                                >
                                                    <Edit size={14} /> Edit Policy
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => removePolicy(policy.id)}
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
                    <p className="text-xs text-slate-500">Showing {filtered.length} policies</p>
                    <Button variant="link" className="text-blue-600 text-xs flex items-center gap-1 group">
                        View Overpayment Report <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            <SideFormSheet
                open={showModal}
                onOpenChange={(o) => {
                    setShowModal(o);
                    if (!o) resetForm();
                }}
                title={editing ? "Edit Overpayment Policy" : "Create Overpayment Policy"}
                description={editing ? "Adjust how this overpayment rule behaves." : "Define how overpayments should be handled."}
                icon={<AlertCircle className="w-5 h-5" />}
                onSubmit={handleSubmit}
                submitLabel={editing ? "Save Changes" : "Create Policy"}
                loading={submitting}
                width="md"
            >
                <div className="space-y-4">
                    <Field
                        label="Policy Name"
                        required
                        error={errors.name}
                        hint="Clear label for accounting reports"
                    >
                        <Input
                            placeholder="e.g., Auto Credit Note"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field
                            label="Action"
                            required
                            error={errors.action}
                        >
                            <Select
                                value={formAction}
                                onValueChange={(v) => {
                                    setFormAction(v);
                                    setTouched((t) => ({ ...t, action: true }));
                                }}
                            >
                                <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary text-[13px]">
                                    <SelectValue placeholder="Select action" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg">
                                    <SelectItem value="credit">Create Credit Note</SelectItem>
                                    <SelectItem value="refund">Process Refund</SelectItem>
                                    <SelectItem value="next">Apply to Next Invoice</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field
                            label="Threshold Amount"
                            required
                            error={errors.threshold}
                            hint="Trigger policy above this value"
                        >
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] text-[13px]">$</span>
                                <Input
                                    type="number"
                                    placeholder="10"
                                    value={formThreshold}
                                    onChange={(e) => setFormThreshold(e.target.value)}
                                    onBlur={() => setTouched((t) => ({ ...t, threshold: true }))}
                                    min={0}
                                    step="0.01"
                                    className="h-11 pl-7 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                                />
                            </div>
                        </Field>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg bg-[#FAFBFC]">
                        <div>
                            <p className="text-[13px] font-semibold text-[#374151]">Auto Apply</p>
                            <p className="text-[11.5px] text-[#64748B] mt-0.5">
                                Apply automatically without manual approval
                            </p>
                        </div>
                        <Switch
                            checked={formAutoApply}
                            onCheckedChange={setFormAutoApply}
                            className="data-[state=checked]:bg-primary"
                        />
                    </div>

                    <Field
                        label="Description"
                        hint="Optional context for finance team"
                    >
                        <Textarea
                            placeholder="When and why this policy applies..."
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            className="min-h-[80px] rounded-lg border-[#E5E7EB] bg-white focus:border-primary text-[13px]"
                        />
                    </Field>

                    <div className="flex items-start gap-2 p-3 bg-[#F0F7FF] border border-[#DBEAFE] rounded-lg">
                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-[11.5px] text-[#475569] leading-relaxed">
                            Refund actions must be manually approved even if auto-apply is enabled. Credit notes and next-invoice credits are automatic.
                        </p>
                    </div>
                </div>
            </SideFormSheet>
        </div>
    );
}
