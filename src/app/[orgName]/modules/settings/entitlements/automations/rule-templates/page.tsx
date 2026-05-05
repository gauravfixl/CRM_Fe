"use client";

import React, { useState } from "react";
import {
    Zap,
    Plus,
    Copy,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Play,
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

export default function RuleTemplatesPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [templates, setTemplates] = useState([
        { id: "1", name: "Lead Auto-Assignment", category: "Lead Management", trigger: "On Create", actions: 3, usage: 24, status: "Active" },
        { id: "2", name: "Deal Stage Progression", category: "Sales Pipeline", trigger: "Field Update", actions: 5, usage: 18, status: "Active" },
        { id: "3", name: "Task Escalation", category: "Task Management", trigger: "Time-Based", actions: 2, usage: 12, status: "Active" },
        { id: "4", name: "Email Notification Chain", category: "Communication", trigger: "On Create", actions: 4, usage: 8, status: "Paused" },
    ]);

    const [form, setForm] = useState({ name: "", category: "", trigger: "", description: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    const resetForm = () => {
        setForm({ name: "", category: "", trigger: "", description: "" });
        setErrors({});
    };

    const validate = () => {
        const next: Record<string, string> = {};
        if (!form.name.trim()) next.name = "Template name is required";
        if (!form.category) next.category = "Choose a category";
        if (!form.trigger) next.trigger = "Choose a trigger type";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSaving(true);
        setTimeout(() => {
            setTemplates(prev => [
                ...prev,
                {
                    id: String(Date.now()),
                    name: form.name.trim(),
                    category: form.category,
                    trigger: form.trigger,
                    actions: 0,
                    usage: 0,
                    status: "Active",
                },
            ]);
            toast.success("Template created");
            setSaving(false);
            setShowCreateModal(false);
            resetForm();
        }, 600);
    };

    const toggleStatus = (id: string) => {
        setTemplates(prev => prev.map(t =>
            t.id === id ? { ...t, status: t.status === "Active" ? "Paused" : "Active" } : t
        ));
    };

    const deleteTemplate = (id: string) => {
        setTemplates(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Automation Rule Templates</h1>
                    <p className="text-sm text-gray-600">Pre-built automation templates for common business scenarios.</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6"
                >
                    <Plus size={16} /> Create Template
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Total Templates</p>
                    <h2 className="text-white text-2xl font-bold">{templates.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Available for use</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Active Templates</p>
                    <h3 className="text-2xl font-bold text-gray-900">{templates.filter(t => t.status === "Active").length}</h3>
                    <p className="text-green-600 text-xs mt-1">Currently in use</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Total Usage</p>
                    <h3 className="text-2xl font-bold text-gray-900">{templates.reduce((sum, t) => sum + t.usage, 0)}</h3>
                    <p className="text-blue-600 text-xs mt-1">Instances deployed</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Categories</p>
                    <h3 className="text-2xl font-bold text-gray-900">4</h3>
                    <p className="text-gray-600 text-xs mt-1">Template types</p>
                </div>
            </div>

            {/* Templates List */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search templates..."
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
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Template Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Trigger</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Actions</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Usage</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {templates.map((template) => (
                                <tr key={template.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-50 text-purple-600 rounded-none border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                                <Zap size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{template.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-none text-[10px] font-bold px-2 py-0.5">
                                            {template.category}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-700">{template.trigger}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-gray-900">{template.actions} actions</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-gray-900">{template.usage}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={template.status === "Active"}
                                                onCheckedChange={() => toggleStatus(template.id)}
                                                className="data-[state=checked]:bg-green-600"
                                            />
                                            <Badge className={`${template.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                                {template.status}
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
                                                    <Edit size={14} /> Edit Template
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-sm p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer">
                                                    <Copy size={14} /> Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-sm p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer">
                                                    <Play size={14} /> Deploy
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-2" />
                                                <DropdownMenuItem
                                                    onClick={() => deleteTemplate(template.id)}
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
                    <p className="text-sm text-gray-600">Showing {templates.length} templates</p>
                    <Button variant="link" className="text-blue-600 text-sm flex items-center gap-1 group">
                        Browse Template Library <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Create Template — side sheet */}
            <SideFormSheet
                open={showCreateModal}
                onOpenChange={(o) => {
                    setShowCreateModal(o);
                    if (!o) resetForm();
                }}
                title="Create Rule Template"
                description="Build reusable automation templates for your team."
                icon={<Zap className="w-5 h-5" />}
                accentColor="#7C3AED"
                width="lg"
                loading={saving}
                onSubmit={handleCreate}
                submitLabel="Create Template"
            >
                <div className="space-y-5">
                    <Field label="Template Name" required error={errors.name}>
                        <Input
                            placeholder="e.g., Lead Auto-Assignment"
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
                                    <SelectItem value="Lead Management">Lead Management</SelectItem>
                                    <SelectItem value="Sales Pipeline">Sales Pipeline</SelectItem>
                                    <SelectItem value="Task Management">Task Management</SelectItem>
                                    <SelectItem value="Communication">Communication</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Trigger Type" required error={errors.trigger}>
                            <Select
                                value={form.trigger}
                                onValueChange={(v) => setForm(p => ({ ...p, trigger: v }))}
                            >
                                <SelectTrigger className="h-11 rounded-lg border-slate-200">
                                    <SelectValue placeholder="Select trigger" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="On Create">On Create</SelectItem>
                                    <SelectItem value="Field Update">Field Update</SelectItem>
                                    <SelectItem value="Time-Based">Time-Based</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <Field label="Description" hint="Optional. Briefly explain what this template automates.">
                        <Textarea
                            placeholder="Describe what this template does..."
                            value={form.description}
                            onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                            className="min-h-[110px] rounded-lg bg-white border-slate-200 focus:border-primary text-[13px]"
                            maxLength={500}
                        />
                    </Field>
                </div>
            </SideFormSheet>
        </div>
    );
}
