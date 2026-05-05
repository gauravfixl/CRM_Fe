"use client";

import React, { useState } from "react";
import {
    Settings,
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
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
import { toast } from "sonner";

export default function ExecutionRulesPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [rules, setRules] = useState([
        { id: "1", name: "Sequential Execution", priority: "High", scope: "All Workflows", retryAttempts: 3, timeout: "30s", status: "Active" },
        { id: "2", name: "Parallel Processing", priority: "Medium", scope: "Bulk Operations", retryAttempts: 2, timeout: "60s", status: "Active" },
        { id: "3", name: "Rate Limiting", priority: "High", scope: "API Calls", retryAttempts: 5, timeout: "15s", status: "Active" },
    ]);

    const [form, setForm] = useState({
        name: "",
        priority: "",
        scope: "",
        retryAttempts: "3",
        timeout: "30",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    const resetForm = () => {
        setForm({ name: "", priority: "", scope: "", retryAttempts: "3", timeout: "30" });
        setErrors({});
    };

    const validate = () => {
        const next: Record<string, string> = {};
        if (!form.name.trim()) next.name = "Rule name is required";
        if (!form.priority) next.priority = "Choose a priority";
        if (!form.scope.trim()) next.scope = "Specify the scope";
        const retries = Number(form.retryAttempts);
        if (Number.isNaN(retries) || retries < 0 || retries > 10) next.retryAttempts = "Retries must be 0–10";
        const timeout = Number(form.timeout);
        if (Number.isNaN(timeout) || timeout <= 0) next.timeout = "Enter a positive number of seconds";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSaving(true);
        setTimeout(() => {
            setRules(prev => [
                ...prev,
                {
                    id: String(Date.now()),
                    name: form.name.trim(),
                    priority: form.priority,
                    scope: form.scope.trim(),
                    retryAttempts: Number(form.retryAttempts),
                    timeout: `${form.timeout}s`,
                    status: "Active",
                },
            ]);
            toast.success("Execution rule created");
            setSaving(false);
            setShowCreateModal(false);
            resetForm();
        }, 600);
    };

    const toggleStatus = (id: string) => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, status: r.status === "Active" ? "Paused" : "Active" } : r));
    };

    const deleteRule = (id: string) => {
        setRules(prev => prev.filter(r => r.id !== id));
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Execution Rules</h1>
                    <p className="text-sm text-gray-600">Configure how automations execute and handle concurrency.</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6">
                    <Plus size={16} /> Create Rule
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Total Rules</p>
                    <h2 className="text-white text-2xl font-bold">{rules.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Configured</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Active Rules</p>
                    <h3 className="text-2xl font-bold text-gray-900">{rules.filter(r => r.status === "Active").length}</h3>
                    <p className="text-green-600 text-xs mt-1">Currently enforced</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Avg. Retry</p>
                    <h3 className="text-2xl font-bold text-gray-900">3.3</h3>
                    <p className="text-blue-600 text-xs mt-1">Attempts</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Success Rate</p>
                    <h3 className="text-2xl font-bold text-gray-900">98.2%</h3>
                    <p className="text-green-600 text-xs mt-1">Excellent</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input placeholder="Search rules..." className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Rule Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Priority</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Scope</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Retry</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Timeout</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {rules.map((rule) => (
                                <tr key={rule.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-none border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <Settings size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{rule.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={`${rule.priority === "High" ? "bg-red-600" : rule.priority === "Medium" ? "bg-amber-600" : "bg-blue-600"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                            {rule.priority}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm text-gray-700">{rule.scope}</span></td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-900">{rule.retryAttempts}x</span></td>
                                    <td className="px-6 py-4"><span className="text-sm text-gray-700">{rule.timeout}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={rule.status === "Active"} onCheckedChange={() => toggleStatus(rule.id)} className="data-[state=checked]:bg-green-600" />
                                            <Badge className={`${rule.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>{rule.status}</Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100"><MoreVertical size={16} /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-none border-zinc-200 shadow-xl p-2 min-w-[180px]">
                                                <DropdownMenuLabel className="text-xs font-bold text-gray-600">Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-sm p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer">
                                                    <Edit size={14} /> Edit Rule
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
            </div>

            {/* Create Execution Rule — side sheet */}
            <SideFormSheet
                open={showCreateModal}
                onOpenChange={(o) => {
                    setShowCreateModal(o);
                    if (!o) resetForm();
                }}
                title="Create Execution Rule"
                description="Define how automations should execute, retry, and time out."
                icon={<Settings className="w-5 h-5" />}
                accentColor="#2563EB"
                width="lg"
                loading={saving}
                onSubmit={handleCreate}
                submitLabel="Create Rule"
            >
                <div className="space-y-5">
                    <Field label="Rule Name" required error={errors.name}>
                        <Input
                            placeholder="e.g., Sequential Execution"
                            value={form.name}
                            onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                            className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary"
                            maxLength={80}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Priority" required error={errors.priority}>
                            <Select
                                value={form.priority}
                                onValueChange={(v) => setForm(p => ({ ...p, priority: v }))}
                            >
                                <SelectTrigger className="h-11 rounded-lg border-slate-200">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Scope" required error={errors.scope} hint="e.g., All Workflows, API Calls">
                            <Input
                                placeholder="All Workflows"
                                value={form.scope}
                                onChange={(e) => setForm(p => ({ ...p, scope: e.target.value }))}
                                className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary"
                                maxLength={64}
                            />
                        </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Retry Attempts" required error={errors.retryAttempts} hint="Number of automatic retries on failure (0–10).">
                            <Input
                                type="number"
                                inputMode="numeric"
                                placeholder="3"
                                value={form.retryAttempts}
                                onChange={(e) => setForm(p => ({ ...p, retryAttempts: e.target.value }))}
                                className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary"
                                min={0}
                                max={10}
                            />
                        </Field>
                        <Field label="Timeout (seconds)" required error={errors.timeout}>
                            <Input
                                type="number"
                                inputMode="numeric"
                                placeholder="30"
                                value={form.timeout}
                                onChange={(e) => setForm(p => ({ ...p, timeout: e.target.value }))}
                                className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary"
                                min={1}
                            />
                        </Field>
                    </div>
                </div>
            </SideFormSheet>
        </div>
    );
}
