"use client";

import React, { useState, useMemo } from "react";
import { CreditCard, Plus, Search, MoreVertical, Edit, Trash2, Star, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Textarea } from "@/shared/components/ui/textarea";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { showSuccess, showWarning } from "@/shared/utils/toast";

interface PaymentTerm {
    id: string;
    name: string;
    days: number;
    description: string;
    default: boolean;
    status: "Active" | "Paused";
    usage: number;
}

const initialTerms: PaymentTerm[] = [
    { id: "1", name: "Net 30", days: 30, description: "Payment due in 30 days", default: true, status: "Active", usage: 1204 },
    { id: "2", name: "Net 15", days: 15, description: "Payment due in 15 days", default: false, status: "Active", usage: 856 },
    { id: "3", name: "Due on Receipt", days: 0, description: "Payment due immediately", default: false, status: "Active", usage: 342 },
    { id: "4", name: "Net 60", days: 60, description: "Payment due in 60 days", default: false, status: "Paused", usage: 120 },
];

export default function PaymentTermsPage() {
    const [terms, setTerms] = useState<PaymentTerm[]>(initialTerms);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editing, setEditing] = useState<PaymentTerm | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState("");

    const [formName, setFormName] = useState("");
    const [formDays, setFormDays] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formDefault, setFormDefault] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const resetForm = () => {
        setFormName("");
        setFormDays("");
        setFormDescription("");
        setFormDefault(false);
        setTouched({});
        setEditing(null);
    };

    const openCreate = () => {
        resetForm();
        setShowAddModal(true);
    };

    const openEdit = (term: PaymentTerm) => {
        setEditing(term);
        setFormName(term.name);
        setFormDays(String(term.days));
        setFormDescription(term.description);
        setFormDefault(term.default);
        setTouched({});
        setShowAddModal(true);
    };

    const errors = useMemo(() => {
        const e: Record<string, string> = {};
        const name = formName.trim();
        const days = formDays.trim();

        if (touched.name) {
            if (!name) e.name = "Term name is required";
            else if (name.length < 2) e.name = "Name is too short";
            else if (name.length > 40) e.name = "Name must be under 40 characters";
        }
        if (touched.days) {
            if (!days) e.days = "Number of days is required";
            else {
                const n = Number(days);
                if (!Number.isInteger(n)) e.days = "Must be a whole number";
                else if (n < 0) e.days = "Days cannot be negative";
                else if (n > 365) e.days = "Days cannot exceed 365";
            }
        }
        return e;
    }, [formName, formDays, touched]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return terms;
        return terms.filter((t) =>
            t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
        );
    }, [terms, search]);

    const toggleStatus = (id: string) => {
        setTerms((prev) =>
            prev.map((t) =>
                t.id === id
                    ? { ...t, status: t.status === "Active" ? "Paused" : "Active" }
                    : t
            )
        );
        showSuccess("Status updated");
    };

    const setDefault = (id: string) => {
        setTerms((prev) => prev.map((t) => ({ ...t, default: t.id === id })));
        showSuccess("Default term updated");
    };

    const removeTerm = (id: string) => {
        const term = terms.find((t) => t.id === id);
        if (!term) return;
        if (!window.confirm(`Remove payment term "${term.name}"?`)) return;
        setTerms((prev) => prev.filter((t) => t.id !== id));
        showSuccess("Payment term removed");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ name: true, days: true });

        const name = formName.trim();
        const days = formDays.trim();
        const fresh: Record<string, string> = {};
        if (!name) fresh.name = "Term name is required";
        const n = Number(days);
        if (!days || !Number.isInteger(n) || n < 0 || n > 365) fresh.days = "Enter valid days (0-365)";

        if (Object.keys(fresh).length > 0) {
            showWarning("Please fix the errors before submitting");
            return;
        }

        setSubmitting(true);
        try {
            await new Promise((r) => setTimeout(r, 400));
            if (editing) {
                setTerms((prev) =>
                    prev.map((t) =>
                        t.id === editing.id
                            ? {
                                ...t,
                                name,
                                days: n,
                                description: formDescription.trim(),
                                default: formDefault,
                            }
                            : formDefault
                                ? { ...t, default: false }
                                : t
                    )
                );
                showSuccess("Payment term updated successfully");
            } else {
                const newTerm: PaymentTerm = {
                    id: Date.now().toString(),
                    name,
                    days: n,
                    description: formDescription.trim() || `Payment due in ${n} days`,
                    default: formDefault,
                    status: "Active",
                    usage: 0,
                };
                setTerms((prev) =>
                    formDefault
                        ? [...prev.map((t) => ({ ...t, default: false })), newTerm]
                        : [...prev, newTerm]
                );
                showSuccess("Payment term added successfully");
            }
            setShowAddModal(false);
            resetForm();
        } finally {
            setSubmitting(false);
        }
    };

    const defaultTerm = terms.find((t) => t.default);

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-sm font-semibold">Payment Terms</h1>
                    <p className="text-xs text-slate-500">Define standard payment terms for invoices.</p>
                </div>
                <Button
                    onClick={openCreate}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 font-medium text-xs h-8 gap-2 shadow-sm px-4"
                >
                    <Plus size={14} /> Add Term
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-primary/70 to-primary p-4 rounded-xl shadow-sm text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-xs opacity-80">Total Terms</p>
                    <h2 className="text-xl font-semibold">{terms.length}</h2>
                    <p className="text-[10px] mt-1 opacity-80">Configured</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-gray-600 text-xs">Default Term</p>
                    <h3 className="text-xl font-semibold text-gray-900">{defaultTerm?.name || "-"}</h3>
                    <p className="text-green-600 text-[10px] mt-1">Most used</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-gray-600 text-xs">Avg. Payment Days</p>
                    <h3 className="text-xl font-semibold text-gray-900">
                        {terms.length ? Math.round(terms.reduce((s, t) => s + t.days, 0) / terms.length) : 0}
                    </h3>
                    <p className="text-blue-600 text-[10px] mt-1">Across all terms</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-gray-600 text-xs">Total Usage</p>
                    <h3 className="text-xl font-semibold text-gray-900">
                        {terms.reduce((sum, t) => sum + t.usage, 0).toLocaleString()}
                    </h3>
                    <p className="text-purple-600 text-[10px] mt-1">Invoices</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search terms..."
                            className="pl-11 rounded-lg border-zinc-200 h-8 text-xs bg-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Term Name</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Days</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Description</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Default</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Usage</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Status</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center">
                                        <span className="text-xs text-slate-500">No payment terms found.</span>
                                    </td>
                                </tr>
                            ) : filtered.map((term) => (
                                <tr key={term.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <CreditCard size={14} />
                                            </div>
                                            <span className="text-xs font-medium text-gray-900">{term.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"><span className="text-xs font-medium text-gray-900">{term.days} days</span></td>
                                    <td className="px-4 py-3"><span className="text-xs text-gray-700">{term.description}</span></td>
                                    <td className="px-4 py-3">
                                        {term.default ? (
                                            <Badge className="bg-purple-600 text-white border-none rounded-md text-[10px] font-medium px-2 py-0.5">Default</Badge>
                                        ) : (
                                            <span className="text-xs text-gray-500">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3"><span className="text-xs font-medium text-gray-900">{term.usage.toLocaleString()}</span></td>
                                    <td className="px-4 py-3">
                                        <Switch
                                            checked={term.status === "Active"}
                                            onCheckedChange={() => toggleStatus(term.id)}
                                            className="data-[state=checked]:bg-green-600"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-zinc-100">
                                                    <MoreVertical size={14} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border-zinc-200 shadow-lg p-2 min-w-[180px]">
                                                <DropdownMenuItem
                                                    onClick={() => openEdit(term)}
                                                    className="text-xs p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer"
                                                >
                                                    <Edit size={14} /> Edit Term
                                                </DropdownMenuItem>
                                                {!term.default && (
                                                    <DropdownMenuItem
                                                        onClick={() => setDefault(term.id)}
                                                        className="text-xs p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer"
                                                    >
                                                        <Star size={14} /> Set as Default
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem
                                                    onClick={() => removeTerm(term.id)}
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
            </div>

            <SideFormSheet
                open={showAddModal}
                onOpenChange={(o) => {
                    setShowAddModal(o);
                    if (!o) resetForm();
                }}
                title={editing ? "Edit Payment Term" : "Add Payment Term"}
                description={editing ? "Update this payment term configuration." : "Define a new payment term for your invoices."}
                icon={<CreditCard className="w-5 h-5" />}
                onSubmit={handleSubmit}
                submitLabel={editing ? "Save Changes" : "Add Term"}
                loading={submitting}
                width="md"
            >
                <div className="space-y-4">
                    <Field
                        label="Term Name"
                        required
                        error={errors.name}
                        hint="Short identifier like Net 30 or Due on Receipt"
                    >
                        <Input
                            placeholder="e.g., Net 30"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>

                    <Field
                        label="Payment Days"
                        required
                        error={errors.days}
                        hint="Number of days until payment is due (0 = immediate)"
                    >
                        <Input
                            type="number"
                            placeholder="30"
                            value={formDays}
                            onChange={(e) => setFormDays(e.target.value.replace(/[^0-9]/g, ""))}
                            onBlur={() => setTouched((t) => ({ ...t, days: true }))}
                            min={0}
                            max={365}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>

                    <Field
                        label="Description"
                        hint="Optional, shown to customers on invoices"
                    >
                        <Textarea
                            placeholder="Payment due in 30 days"
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            className="min-h-[80px] rounded-lg border-[#E5E7EB] bg-white focus:border-primary text-[13px]"
                        />
                    </Field>

                    <div className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg bg-[#FAFBFC]">
                        <div>
                            <p className="text-[13px] font-semibold text-[#374151]">Set as Default</p>
                            <p className="text-[11.5px] text-[#64748B] mt-0.5">
                                Applied automatically to new invoices
                            </p>
                        </div>
                        <Switch
                            checked={formDefault}
                            onCheckedChange={setFormDefault}
                            className="data-[state=checked]:bg-primary"
                        />
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-[#F0F7FF] border border-[#DBEAFE] rounded-lg">
                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-[11.5px] text-[#475569] leading-relaxed">
                            Setting a new default will replace the currently active default term.
                        </p>
                    </div>
                </div>
            </SideFormSheet>
        </div>
    );
}
