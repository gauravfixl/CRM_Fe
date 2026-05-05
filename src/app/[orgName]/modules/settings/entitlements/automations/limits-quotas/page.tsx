"use client";

import React, { useState } from "react";
import {
    Gauge,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Progress } from "@/shared/components/ui/progress";
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

export default function LimitsQuotasPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [quotas, setQuotas] = useState([
        { id: "1", name: "Daily Email Limit", type: "Communication", limit: 1000, used: 742, unit: "emails/day", status: "Active" },
        { id: "2", name: "API Calls Per Hour", type: "Integration", limit: 5000, used: 3420, unit: "calls/hour", status: "Active" },
        { id: "3", name: "Workflow Executions", type: "Automation", limit: 10000, used: 8950, unit: "runs/month", status: "Active" },
        { id: "4", name: "Data Export Limit", type: "Data", limit: 50, used: 12, unit: "exports/day", status: "Active" },
    ]);

    const [form, setForm] = useState({ name: "", type: "", limit: "", unit: "", alertThreshold: "80" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    const resetForm = () => {
        setForm({ name: "", type: "", limit: "", unit: "", alertThreshold: "80" });
        setErrors({});
    };

    const validate = () => {
        const next: Record<string, string> = {};
        if (!form.name.trim()) next.name = "Quota name is required";
        if (!form.type) next.type = "Choose a type";
        const limitNum = Number(form.limit);
        if (!form.limit.trim() || Number.isNaN(limitNum) || limitNum <= 0) next.limit = "Enter a positive number";
        if (!form.unit.trim()) next.unit = "Specify the unit (e.g., emails/day)";
        const threshold = Number(form.alertThreshold);
        if (form.alertThreshold && (Number.isNaN(threshold) || threshold < 1 || threshold > 100)) next.alertThreshold = "Threshold must be 1–100";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSaving(true);
        setTimeout(() => {
            setQuotas(prev => [
                ...prev,
                {
                    id: String(Date.now()),
                    name: form.name.trim(),
                    type: form.type,
                    limit: Number(form.limit),
                    used: 0,
                    unit: form.unit.trim(),
                    status: "Active",
                },
            ]);
            toast.success("Quota added");
            setSaving(false);
            setShowCreateModal(false);
            resetForm();
        }, 600);
    };

    const toggleStatus = (id: string) => {
        setQuotas(prev => prev.map(q =>
            q.id === id ? { ...q, status: q.status === "Active" ? "Paused" : "Active" } : q
        ));
    };

    const deleteQuota = (id: string) => {
        setQuotas(prev => prev.filter(q => q.id !== id));
    };

    const getUsagePercentage = (used: number, limit: number) => (used / limit) * 100;

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Limits & Quotas</h1>
                    <p className="text-sm text-gray-600">Manage resource limits and usage quotas for automation systems.</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6"
                >
                    <Plus size={16} /> Add Quota
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Total Quotas</p>
                    <h2 className="text-white text-2xl font-bold">{quotas.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Configured limits</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Near Limit</p>
                    <h3 className="text-2xl font-bold text-gray-900">{quotas.filter(q => getUsagePercentage(q.used, q.limit) > 80).length}</h3>
                    <p className="text-amber-600 text-xs mt-1">Needs attention</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Avg. Usage</p>
                    <h3 className="text-2xl font-bold text-gray-900">68%</h3>
                    <p className="text-blue-600 text-xs mt-1">Across all quotas</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Exceeded</p>
                    <h3 className="text-2xl font-bold text-gray-900">0</h3>
                    <p className="text-green-600 text-xs mt-1">All within limits</p>
                </div>
            </div>

            {/* Quotas List */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search quotas..."
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
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Quota Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Limit</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Usage</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {quotas.map((quota) => {
                                const percentage = getUsagePercentage(quota.used, quota.limit);
                                return (
                                    <tr key={quota.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-amber-50 text-amber-600 rounded-none border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                                    <Gauge size={18} />
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{quota.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-none text-[10px] font-bold px-2 py-0.5">
                                                {quota.type}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-gray-900">{quota.limit.toLocaleString()} {quota.unit}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-2 min-w-[200px]">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-600">{quota.used.toLocaleString()} used</span>
                                                    <span className={`font-bold ${percentage > 90 ? 'text-red-600' : percentage > 80 ? 'text-amber-600' : 'text-green-600'}`}>
                                                        {percentage.toFixed(0)}%
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={percentage}
                                                    className={`h-2 rounded-none ${percentage > 90 ? 'bg-red-100' : percentage > 80 ? 'bg-amber-100' : 'bg-zinc-100'} [&>div]:${percentage > 90 ? 'bg-red-600' : percentage > 80 ? 'bg-amber-600' : 'bg-green-600'}`}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={quota.status === "Active"}
                                                    onCheckedChange={() => toggleStatus(quota.id)}
                                                    className="data-[state=checked]:bg-green-600"
                                                />
                                                <Badge className={`${quota.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                                    {quota.status}
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
                                                        <Edit size={14} /> Edit Quota
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-2" />
                                                    <DropdownMenuItem
                                                        onClick={() => deleteQuota(quota.id)}
                                                        className="text-sm p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing {quotas.length} quotas</p>
                    <Button variant="link" className="text-blue-600 text-sm flex items-center gap-1 group">
                        View Usage Report <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Add Quota — side sheet */}
            <SideFormSheet
                open={showCreateModal}
                onOpenChange={(o) => {
                    setShowCreateModal(o);
                    if (!o) resetForm();
                }}
                title="Add Quota Limit"
                description="Define resource usage limits for your organization."
                icon={<Gauge className="w-5 h-5" />}
                accentColor="#D97706"
                width="lg"
                loading={saving}
                onSubmit={handleCreate}
                submitLabel="Add Quota"
            >
                <div className="space-y-5">
                    <Field label="Quota Name" required error={errors.name}>
                        <Input
                            placeholder="e.g., Daily Email Limit"
                            value={form.name}
                            onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                            className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary"
                            maxLength={80}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Type" required error={errors.type}>
                            <Select
                                value={form.type}
                                onValueChange={(v) => setForm(p => ({ ...p, type: v }))}
                            >
                                <SelectTrigger className="h-11 rounded-lg border-slate-200">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Communication">Communication</SelectItem>
                                    <SelectItem value="Integration">Integration</SelectItem>
                                    <SelectItem value="Automation">Automation</SelectItem>
                                    <SelectItem value="Data">Data</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Limit Value" required error={errors.limit}>
                            <Input
                                type="number"
                                inputMode="numeric"
                                placeholder="e.g., 1000"
                                value={form.limit}
                                onChange={(e) => setForm(p => ({ ...p, limit: e.target.value }))}
                                className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary"
                                min={1}
                            />
                        </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Unit" required error={errors.unit} hint="e.g., emails/day, calls/hour">
                            <Input
                                placeholder="emails/day"
                                value={form.unit}
                                onChange={(e) => setForm(p => ({ ...p, unit: e.target.value }))}
                                className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary"
                                maxLength={32}
                            />
                        </Field>
                        <Field label="Alert Threshold (%)" error={errors.alertThreshold} hint="Notify when usage crosses this %.">
                            <Input
                                type="number"
                                inputMode="numeric"
                                placeholder="80"
                                value={form.alertThreshold}
                                onChange={(e) => setForm(p => ({ ...p, alertThreshold: e.target.value }))}
                                className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary"
                                min={1}
                                max={100}
                            />
                        </Field>
                    </div>
                </div>
            </SideFormSheet>
        </div>
    );
}
