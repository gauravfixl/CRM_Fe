"use client";

import React, { useState } from "react";
import {
    AlertTriangle,
    Plus,
    Search,
    ChevronRight,
    MoreVertical,
    Edit,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Textarea } from "@/shared/components/ui/textarea";
import { toast } from "sonner";

export default function ErrorHandlingPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [handlers, setHandlers] = useState([
        { id: "1", errorType: "Timeout Error", action: "Retry 3 times", notification: "Admin", severity: "High" },
        { id: "2", errorType: "API Failure", action: "Log & Alert", notification: "Dev Team", severity: "Critical" },
        { id: "3", errorType: "Validation Error", action: "Skip & Continue", notification: "None", severity: "Low" },
    ]);

    const [form, setForm] = useState({
        errorType: "",
        action: "",
        notification: "",
        severity: "",
        notes: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    const resetForm = () => {
        setForm({ errorType: "", action: "", notification: "", severity: "", notes: "" });
        setErrors({});
    };

    const validate = () => {
        const next: Record<string, string> = {};
        if (!form.errorType) next.errorType = "Select an error type";
        if (!form.action) next.action = "Select an action";
        if (!form.notification) next.notification = "Choose who to notify";
        if (!form.severity) next.severity = "Choose a severity";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSaving(true);
        setTimeout(() => {
            setHandlers(prev => [
                ...prev,
                {
                    id: String(Date.now()),
                    errorType: form.errorType,
                    action: form.action,
                    notification: form.notification,
                    severity: form.severity,
                },
            ]);
            toast.success("Error handler added");
            setSaving(false);
            setShowCreateModal(false);
            resetForm();
        }, 600);
    };

    const deleteHandler = (id: string) => {
        setHandlers(prev => prev.filter(h => h.id !== id));
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Error Handling</h1>
                    <p className="text-sm text-gray-600">Configure how automation errors are handled and reported.</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6">
                    <Plus size={16} /> Add Handler
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Error Handlers</p>
                    <h2 className="text-white text-2xl font-bold">{handlers.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Configured</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Errors (24h)</p>
                    <h3 className="text-2xl font-bold text-gray-900">12</h3>
                    <p className="text-amber-600 text-xs mt-1">Handled automatically</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Recovery Rate</p>
                    <h3 className="text-2xl font-bold text-gray-900">94%</h3>
                    <p className="text-green-600 text-xs mt-1">Auto-recovered</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Critical Errors</p>
                    <h3 className="text-2xl font-bold text-gray-900">2</h3>
                    <p className="text-red-600 text-xs mt-1">Needs attention</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input placeholder="Search handlers..." className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Error Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Action</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Notification</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Severity</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {handlers.map((handler) => (
                                <tr key={handler.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-50 text-red-600 rounded-none border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-all">
                                                <AlertTriangle size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{handler.errorType}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm text-gray-700">{handler.action}</span></td>
                                    <td className="px-6 py-4"><Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-none text-[10px] font-bold px-2 py-0.5">{handler.notification}</Badge></td>
                                    <td className="px-6 py-4">
                                        <Badge className={`${handler.severity === "Critical" ? "bg-red-600" : handler.severity === "High" ? "bg-amber-600" : "bg-blue-600"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                            {handler.severity}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100"><MoreVertical size={16} /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-none border-zinc-200 shadow-xl p-2 min-w-[180px]">
                                                <DropdownMenuLabel className="text-xs font-bold text-gray-600">Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-sm p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer">
                                                    <Edit size={14} /> Edit Handler
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-2" />
                                                <DropdownMenuItem
                                                    onClick={() => deleteHandler(handler.id)}
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
                    <p className="text-sm text-gray-600">Showing {handlers.length} handlers</p>
                    <Button variant="link" className="text-blue-600 text-sm flex items-center gap-1 group">View Error Log <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></Button>
                </div>
            </div>

            {/* Add Error Handler — side sheet */}
            <SideFormSheet
                open={showCreateModal}
                onOpenChange={(o) => {
                    setShowCreateModal(o);
                    if (!o) resetForm();
                }}
                title="Add Error Handler"
                description="Define how specific automation errors should be handled."
                icon={<AlertTriangle className="w-5 h-5" />}
                accentColor="#DC2626"
                width="lg"
                loading={saving}
                onSubmit={handleCreate}
                submitLabel="Add Handler"
            >
                <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Error Type" required error={errors.errorType}>
                            <Select
                                value={form.errorType}
                                onValueChange={(v) => setForm(p => ({ ...p, errorType: v }))}
                            >
                                <SelectTrigger className="h-11 rounded-lg border-slate-200">
                                    <SelectValue placeholder="Select error type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Timeout Error">Timeout Error</SelectItem>
                                    <SelectItem value="API Failure">API Failure</SelectItem>
                                    <SelectItem value="Validation Error">Validation Error</SelectItem>
                                    <SelectItem value="Permission Denied">Permission Denied</SelectItem>
                                    <SelectItem value="Network Error">Network Error</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Action" required error={errors.action}>
                            <Select
                                value={form.action}
                                onValueChange={(v) => setForm(p => ({ ...p, action: v }))}
                            >
                                <SelectTrigger className="h-11 rounded-lg border-slate-200">
                                    <SelectValue placeholder="Select action" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Retry 3 times">Retry 3 times</SelectItem>
                                    <SelectItem value="Retry 5 times">Retry 5 times</SelectItem>
                                    <SelectItem value="Log & Alert">Log & Alert</SelectItem>
                                    <SelectItem value="Skip & Continue">Skip & Continue</SelectItem>
                                    <SelectItem value="Halt Execution">Halt Execution</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Notification Target" required error={errors.notification}>
                            <Select
                                value={form.notification}
                                onValueChange={(v) => setForm(p => ({ ...p, notification: v }))}
                            >
                                <SelectTrigger className="h-11 rounded-lg border-slate-200">
                                    <SelectValue placeholder="Who to notify" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="None">None</SelectItem>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                    <SelectItem value="Dev Team">Dev Team</SelectItem>
                                    <SelectItem value="Owner">Owner</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Severity" required error={errors.severity}>
                            <Select
                                value={form.severity}
                                onValueChange={(v) => setForm(p => ({ ...p, severity: v }))}
                            >
                                <SelectTrigger className="h-11 rounded-lg border-slate-200">
                                    <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <Field label="Internal Notes" hint="Optional. Document the recovery playbook for this handler.">
                        <Textarea
                            placeholder="Recovery steps, escalation chain, runbook link..."
                            value={form.notes}
                            onChange={(e) => setForm(p => ({ ...p, notes: e.target.value }))}
                            className="min-h-[100px] rounded-lg bg-white border-slate-200 focus:border-primary text-[13px]"
                            maxLength={500}
                        />
                    </Field>
                </div>
            </SideFormSheet>
        </div>
    );
}
