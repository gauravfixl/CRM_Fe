"use client";

import React, { useState } from "react";
import {
    Clock,
    Plus,
    Trash2,
    Archive,
    Search,
    Filter,
    MoreVertical,
    Edit,
    ChevronRight,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface RetentionRule {
    id: string;
    name: string;
    dataType: string;
    retention: string;
    action: string;
    status: string;
    affected: string;
}

const defaultFormState = {
    name: "",
    dataType: "",
    retention: "",
    action: "",
};

export default function RetentionRulesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editItem, setEditItem] = useState<RetentionRule | null>(null);
    const [createForm, setCreateForm] = useState(defaultFormState);
    const [editForm, setEditForm] = useState(defaultFormState);

    const [retentionRules, setRetentionRules] = useState<RetentionRule[]>([
        { id: "1", name: "Old Leads Cleanup", dataType: "Leads", retention: "180 days", action: "Archive", status: "Active", affected: "1,204" },
        { id: "2", name: "Closed Deals Archive", dataType: "Deals", retention: "365 days", action: "Archive", status: "Active", affected: "856" },
        { id: "3", name: "Inactive Contacts", dataType: "Contacts", retention: "730 days", action: "Delete", status: "Active", affected: "342" },
        { id: "4", name: "Old Support Tickets", dataType: "Tickets", retention: "90 days", action: "Archive", status: "Paused", affected: "2,103" },
    ]);

    const filteredRules = retentionRules.filter((rule) =>
        rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.dataType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleStatus = (id: string) => {
        setRetentionRules((prev) =>
            prev.map((rule) =>
                rule.id === id
                    ? { ...rule, status: rule.status === "Active" ? "Paused" : "Active" }
                    : rule
            )
        );
    };

    const deleteRule = (id: string) => {
        setRetentionRules((prev) => prev.filter((rule) => rule.id !== id));
        toast.success("Retention rule deleted successfully");
    };

    const handleCreate = () => {
        if (!createForm.name || !createForm.dataType || !createForm.retention || !createForm.action) {
            toast.error("Please fill in all required fields");
            return;
        }
        const newRule: RetentionRule = {
            id: Date.now().toString(),
            name: createForm.name,
            dataType: createForm.dataType,
            retention: createForm.retention,
            action: createForm.action,
            status: "Active",
            affected: "0",
        };
        setRetentionRules((prev) => [...prev, newRule]);
        setCreateForm(defaultFormState);
        setIsCreateOpen(false);
        toast.success("Retention rule created successfully");
    };

    const openEdit = (rule: RetentionRule) => {
        setEditItem(rule);
        setEditForm({
            name: rule.name,
            dataType: rule.dataType,
            retention: rule.retention,
            action: rule.action,
        });
        setIsEditOpen(true);
    };

    const handleEdit = () => {
        if (!editForm.name || !editForm.dataType || !editForm.retention || !editForm.action) {
            toast.error("Please fill in all required fields");
            return;
        }
        if (!editItem) return;
        setRetentionRules((prev) =>
            prev.map((rule) =>
                rule.id === editItem.id
                    ? { ...rule, name: editForm.name, dataType: editForm.dataType, retention: editForm.retention, action: editForm.action }
                    : rule
            )
        );
        setIsEditOpen(false);
        setEditItem(null);
        toast.success("Retention rule updated successfully");
    };

    const handleRunNow = (ruleName: string) => {
        toast.success(`Running retention rule "${ruleName}"...`);
    };

    const retentionOptions = [
        { value: "90 days", label: "90 days" },
        { value: "180 days", label: "180 days" },
        { value: "365 days", label: "1 year" },
        { value: "730 days", label: "2 years" },
    ];

    const dataTypeOptions = ["Leads", "Contacts", "Deals", "Tickets"];

    const renderFormFields = (
        form: typeof defaultFormState,
        setForm: React.Dispatch<React.SetStateAction<typeof defaultFormState>>
    ) => (
        <div className="p-5 space-y-4 bg-white">
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-start gap-3">
                <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                    <p className="text-xs font-semibold text-amber-900 mb-0.5">Important</p>
                    <p className="text-[10px] text-amber-800">Retention rules will automatically archive or delete data. Ensure you have backups before enabling.</p>
                </div>
            </div>
            <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-600">Rule Name</Label>
                <Input
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Old Leads Cleanup"
                    className="rounded-lg border-zinc-200 h-9 text-sm"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-600">Data Type</Label>
                    <Select value={form.dataType} onValueChange={(v) => setForm((prev) => ({ ...prev, dataType: v }))}>
                        <SelectTrigger className="rounded-lg border-zinc-200 h-9">
                            <SelectValue placeholder="Select data type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                            {dataTypeOptions.map((dt) => (
                                <SelectItem key={dt} value={dt}>{dt}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-600">Retention Period</Label>
                    <Select value={form.retention} onValueChange={(v) => setForm((prev) => ({ ...prev, retention: v }))}>
                        <SelectTrigger className="rounded-lg border-zinc-200 h-9">
                            <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                            {retentionOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-600">Action</Label>
                <Select value={form.action} onValueChange={(v) => setForm((prev) => ({ ...prev, action: v }))}>
                    <SelectTrigger className="rounded-lg border-zinc-200 h-9">
                        <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
                        <SelectItem value="Archive">Archive (Move to archive)</SelectItem>
                        <SelectItem value="Delete">Delete (Permanent removal)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );

    return (
        <div className="font-outfit space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Data Retention Rules</h1>
                    <p className="text-sm text-gray-600">Automate data lifecycle management with retention policies.</p>
                </div>
                <Button
                    onClick={() => setIsCreateOpen(true)}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-sm h-10 gap-2 shadow-lg px-5"
                >
                    <Plus size={16} /> Create Rule
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 rounded-xl">
                    <p className="text-xs opacity-80">Active Rules</p>
                    <h2 className="text-xl font-semibold">{retentionRules.filter((r) => r.status === "Active").length}</h2>
                    <p className="text-[10px] mt-1 opacity-80">Currently running</p>
                </div>

                <div className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 rounded-xl">
                    <p className="text-xs text-gray-600">Records Archived</p>
                    <h3 className="text-xl font-semibold text-gray-900">8,420</h3>
                    <p className="text-[10px] text-blue-600 mt-1">Last 30 days</p>
                </div>

                <div className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 rounded-xl">
                    <p className="text-xs text-gray-600">Records Deleted</p>
                    <h3 className="text-xl font-semibold text-gray-900">1,250</h3>
                    <p className="text-[10px] text-amber-600 mt-1">Last 30 days</p>
                </div>

                <div className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 rounded-xl">
                    <p className="text-xs text-gray-600">Storage Saved</p>
                    <h3 className="text-xl font-semibold text-gray-900">2.4 GB</h3>
                    <p className="text-[10px] text-green-600 mt-1">This month</p>
                </div>
            </div>

            {/* Rules List */}
            <div className="bg-white border rounded-xl shadow-lg overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search retention rules..."
                            className="pl-11 rounded-lg border-zinc-200 h-9 text-sm bg-white"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="rounded-xl border-zinc-200 h-9 text-sm gap-2 font-semibold bg-white flex-1 md:flex-none">
                            <Filter size={14} /> Filter
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Rule Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Data Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Retention Period</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Action</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Affected Records</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredRules.map((rule) => (
                                <tr key={rule.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                                <Clock size={18} />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">{rule.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-full text-[10px] font-semibold px-2 py-0.5">
                                            {rule.dataType}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-700">
                                            <Clock size={12} /> {rule.retention}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={`${rule.action === "Archive" ? "bg-amber-600" : "bg-red-600"} text-white border-none rounded-full text-[10px] font-semibold px-2 py-0.5 flex items-center gap-1 w-fit`}>
                                            {rule.action === "Archive" ? <Archive size={10} /> : <Trash2 size={10} />} {rule.action}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-semibold text-gray-900">{rule.affected}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={rule.status === "Active"}
                                                onCheckedChange={() => toggleStatus(rule.id)}
                                                className="data-[state=checked]:bg-green-600"
                                            />
                                            <Badge className={`${rule.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-full text-[10px] font-semibold px-2 py-0.5`}>
                                                {rule.status}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-zinc-100">
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border-zinc-200 shadow-xl p-2 min-w-[180px]">
                                                <DropdownMenuLabel className="text-xs font-semibold text-gray-500">Actions</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={() => openEdit(rule)}
                                                    className="text-sm p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer"
                                                >
                                                    <Edit size={14} /> Edit Rule
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleRunNow(rule.name)}
                                                    className="text-sm p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer"
                                                >
                                                    <Clock size={14} /> Run Now
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

                <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing {filteredRules.length} retention rules</p>
                    <Button variant="link" className="text-blue-600 text-sm flex items-center gap-1 group font-semibold">
                        View Execution History <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-2xl rounded-xl p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 text-white">
                        <h2 className="text-base font-semibold flex items-center gap-2">
                            <Plus size={18} /> Create Retention Rule
                        </h2>
                        <p className="text-xs opacity-80 mt-1">Define automated data lifecycle policies.</p>
                    </div>
                    {renderFormFields(createForm, setCreateForm)}
                    <DialogFooter className="px-5 pb-4 bg-zinc-50 border-t border-zinc-100 gap-3 sm:justify-end pt-4">
                        <Button variant="ghost" onClick={() => setIsCreateOpen(false)} className="rounded-xl text-sm font-semibold text-gray-600">
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold px-8 h-9 shadow-lg">
                            Create Rule
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-2xl rounded-xl p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 text-white">
                        <h2 className="text-base font-semibold flex items-center gap-2">
                            <Edit size={18} /> Edit Retention Rule
                        </h2>
                        <p className="text-xs opacity-80 mt-1">Update retention rule configuration.</p>
                    </div>
                    {renderFormFields(editForm, setEditForm)}
                    <DialogFooter className="px-5 pb-4 bg-zinc-50 border-t border-zinc-100 gap-3 sm:justify-end pt-4">
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)} className="rounded-xl text-sm font-semibold text-gray-600">
                            Cancel
                        </Button>
                        <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold px-8 h-9 shadow-lg">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
