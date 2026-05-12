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
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
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
import { toast } from "sonner";

const MODULE_OPTIONS = ["All", "Leads", "Contacts", "Deals", "Tasks", "Campaigns"];

export default function AllowedActionsPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [actions, setActions] = useState([
        { id: "1", name: "Send Email", category: "Communication", risk: "Low", modules: ["Leads", "Contacts"], status: "Allowed" },
        { id: "2", name: "Update Field Values", category: "Data Modification", risk: "Medium", modules: ["All"], status: "Allowed" },
        { id: "3", name: "Delete Records", category: "Data Modification", risk: "High", modules: ["Leads"], status: "Restricted" },
        { id: "4", name: "Create Tasks", category: "Task Management", risk: "Low", modules: ["All"], status: "Allowed" },
    ]);

    const [form, setForm] = useState({
        name: "",
        category: "",
        risk: "",
        modules: [] as string[],
        description: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    const resetForm = () => {
        setForm({ name: "", category: "", risk: "", modules: [], description: "" });
        setErrors({});
    };

    const toggleModule = (m: string) => {
        setForm(prev => {
            if (m === "All") {
                return { ...prev, modules: prev.modules.includes("All") ? [] : ["All"] };
            }
            const next = prev.modules.includes(m)
                ? prev.modules.filter(x => x !== m)
                : [...prev.modules.filter(x => x !== "All"), m];
            return { ...prev, modules: next };
        });
    };

    const validate = () => {
        const next: Record<string, string> = {};
        if (!form.name.trim()) next.name = "Action name is required";
        if (!form.category) next.category = "Choose a category";
        if (!form.risk) next.risk = "Choose a risk level";
        if (form.modules.length === 0) next.modules = "Select at least one module";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSaving(true);
        setTimeout(() => {
            setActions(prev => [
                ...prev,
                {
                    id: String(Date.now()),
                    name: form.name.trim(),
                    category: form.category,
                    risk: form.risk,
                    modules: form.modules,
                    status: "Allowed",
                },
            ]);
            toast.success("Action added to whitelist");
            setSaving(false);
            setShowCreateModal(false);
            resetForm();
        }, 600);
    };

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

            {/* Add Allowed Action — side sheet */}
            <SideFormSheet
                open={showCreateModal}
                onOpenChange={(o) => {
                    setShowCreateModal(o);
                    if (!o) resetForm();
                }}
                title="Add Allowed Action"
                description="Define which automation actions are permitted across your modules."
                icon={<Shield className="w-5 h-5" />}
                accentColor="#059669"
                width="lg"
                loading={saving}
                onSubmit={handleCreate}
                submitLabel="Add Action"
            >
                <div className="space-y-5">
                    <Field label="Action Name" required error={errors.name}>
                        <Input
                            placeholder="e.g., Send Email"
                            value={form.name}
                            onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                            className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary"
                            maxLength={80}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Category" required error={errors.category}>
                            <Select
                                value={form.category}
                                onValueChange={(v) => setForm(p => ({ ...p, category: v }))}
                            >
                                <SelectTrigger className="h-11 rounded-lg border-slate-200">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Communication">Communication</SelectItem>
                                    <SelectItem value="Data Modification">Data Modification</SelectItem>
                                    <SelectItem value="Task Management">Task Management</SelectItem>
                                    <SelectItem value="Integration">Integration</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Risk Level" required error={errors.risk}>
                            <Select
                                value={form.risk}
                                onValueChange={(v) => setForm(p => ({ ...p, risk: v }))}
                            >
                                <SelectTrigger className="h-11 rounded-lg border-slate-200">
                                    <SelectValue placeholder="Select risk" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <Field label="Applicable Modules" required error={errors.modules} hint="Pick which modules can use this action.">
                        <div className="flex flex-wrap gap-2">
                            {MODULE_OPTIONS.map((m) => {
                                const active = form.modules.includes(m);
                                return (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => toggleModule(m)}
                                        className={`h-9 px-3 rounded-lg border text-[12px] font-medium transition-colors ${active ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700 border-slate-200 hover:border-emerald-400"}`}
                                    >
                                        {m}
                                    </button>
                                );
                            })}
                        </div>
                    </Field>

                    <Field label="Description" hint="Optional. Add context about why this action is allowed/restricted.">
                        <Textarea
                            placeholder="Describe usage, scope, and policy notes..."
                            value={form.description}
                            onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                            className="min-h-[100px] rounded-lg bg-white border-slate-200 focus:border-primary text-[13px]"
                            maxLength={500}
                        />
                    </Field>
                </div>
            </SideFormSheet>
        </div>
    );
}
