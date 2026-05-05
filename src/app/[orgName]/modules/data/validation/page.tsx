"use client";

import React, { useState } from "react";
import {
    CheckCircle,
    Plus,
    AlertTriangle,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Play,
    ChevronRight,
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

interface ValidationRule {
    id: string;
    name: string;
    field: string;
    module: string;
    type: string;
    status: string;
    violations: number;
}

const defaultFormState = {
    name: "",
    field: "",
    module: "",
    type: "",
};

export default function ValidationRulesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editItem, setEditItem] = useState<ValidationRule | null>(null);
    const [createForm, setCreateForm] = useState(defaultFormState);
    const [editForm, setEditForm] = useState(defaultFormState);

    const [validationRules, setValidationRules] = useState<ValidationRule[]>([
        { id: "1", name: "Email Format Check", field: "Email", module: "Contacts", type: "Format", status: "Active", violations: 12 },
        { id: "2", name: "Phone Number Validation", field: "Phone", module: "Leads", type: "Format", status: "Active", violations: 8 },
        { id: "3", name: "Required Field Check", field: "Company Name", module: "Accounts", type: "Required", status: "Active", violations: 24 },
        { id: "4", name: "Date Range Validation", field: "Deal Close Date", module: "Deals", type: "Range", status: "Paused", violations: 5 },
    ]);

    const filteredRules = validationRules.filter((rule) =>
        rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.module.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleStatus = (id: string) => {
        setValidationRules((prev) =>
            prev.map((rule) =>
                rule.id === id
                    ? { ...rule, status: rule.status === "Active" ? "Paused" : "Active" }
                    : rule
            )
        );
    };

    const deleteRule = (id: string) => {
        setValidationRules((prev) => prev.filter((rule) => rule.id !== id));
        toast.success("Validation rule deleted successfully");
    };

    const handleCreate = () => {
        const sanitizedName = createForm.name.trim();
        const sanitizedField = createForm.field.trim();
        
        if (!sanitizedName || !sanitizedField || !createForm.module || !createForm.type) {
            toast.error("Please fill in all required fields");
            return;
        }
        if (/\d/.test(sanitizedName)) {
            toast.error("Rule name cannot contain numbers");
            return;
        }
        if (/\d/.test(sanitizedField)) {
            toast.error("Field name cannot contain numbers");
            return;
        }
        const newRule: ValidationRule = {
            id: Date.now().toString(),
            name: sanitizedName,
            field: sanitizedField,
            module: createForm.module,
            type: createForm.type,
            status: "Active",
            violations: 0,
        };
        setValidationRules((prev) => [...prev, newRule]);
        setCreateForm(defaultFormState);
        setIsCreateOpen(false);
        toast.success("Validation rule created successfully");
    };

    const openEdit = (rule: ValidationRule) => {
        setEditItem(rule);
        setEditForm({
            name: rule.name,
            field: rule.field,
            module: rule.module,
            type: rule.type,
        });
        setIsEditOpen(true);
    };

    const handleEdit = () => {
        const sanitizedName = editForm.name.trim();
        const sanitizedField = editForm.field.trim();

        if (!sanitizedName || !sanitizedField || !editForm.module || !editForm.type) {
            toast.error("Please fill in all required fields");
            return;
        }
        if (/\d/.test(sanitizedName)) {
            toast.error("Rule name cannot contain numbers");
            return;
        }
        if (/\d/.test(sanitizedField)) {
            toast.error("Field name cannot contain numbers");
            return;
        }
        if (!editItem) return;
        setValidationRules((prev) =>
            prev.map((rule) =>
                rule.id === editItem.id
                    ? { ...rule, name: editForm.name, field: editForm.field, module: editForm.module, type: editForm.type }
                    : rule
            )
        );
        setIsEditOpen(false);
        setEditItem(null);
        toast.success("Validation rule updated successfully");
    };

    const handleRunValidation = (ruleName: string) => {
        toast.success(`Running validation for "${ruleName}"...`);
    };

    const moduleOptions = ["Contacts", "Leads", "Accounts", "Deals"];
    const typeOptions = [
        { value: "Format", label: "Format Validation" },
        { value: "Required", label: "Required Field" },
        { value: "Range", label: "Range Check" },
        { value: "Unique", label: "Unique Value" },
    ];

    const getTypeBadgeClass = (type: string) => {
        switch (type) {
            case "Required": return "bg-red-50 text-red-700 border-red-200";
            case "Format": return "bg-purple-50 text-purple-700 border-purple-200";
            case "Range": return "bg-blue-50 text-blue-700 border-blue-200";
            case "Unique": return "bg-emerald-50 text-emerald-700 border-emerald-200";
            default: return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const renderFormFields = (
        form: typeof defaultFormState,
        setForm: React.Dispatch<React.SetStateAction<typeof defaultFormState>>
    ) => (
        <div className="p-5 space-y-4 bg-white">
            <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-600">Rule Name</Label>
                <Input
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Email Format Check"
                    className="rounded-lg border-zinc-200 h-9 text-sm"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-600">Module</Label>
                    <Select value={form.module} onValueChange={(v) => setForm((prev) => ({ ...prev, module: v }))}>
                        <SelectTrigger className="rounded-lg border-zinc-200 h-9">
                            <SelectValue placeholder="Select module" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                            {moduleOptions.map((mod) => (
                                <SelectItem key={mod} value={mod}>{mod}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-600">Field Name</Label>
                    <Input
                        value={form.field}
                        onChange={(e) => setForm((prev) => ({ ...prev, field: e.target.value }))}
                        placeholder="e.g., Email"
                        className="rounded-lg border-zinc-200 h-9 text-sm"
                    />
                </div>
            </div>
            <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-600">Validation Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm((prev) => ({ ...prev, type: v }))}>
                    <SelectTrigger className="rounded-lg border-zinc-200 h-9">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
                        {typeOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
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
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Validation Rules</h1>
                    <p className="text-sm text-gray-600">Enforce data quality standards with automated validation checks.</p>
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
                    <p className="text-xs font-semibold text-white">Active Rules</p>
                    <h2 className="text-xl font-semibold text-white">{validationRules.filter((r) => r.status === "Active").length}</h2>
                    <p className="text-[10px] mt-1 opacity-80">Currently enforced</p>
                </div>

                <div className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 rounded-xl">
                    <p className="text-xs text-gray-600">Total Violations</p>
                    <h3 className="text-xl font-semibold text-gray-900">{validationRules.reduce((sum, r) => sum + r.violations, 0)}</h3>
                    <p className="text-[10px] text-amber-600 mt-1">Needs attention</p>
                </div>

                <div className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 rounded-xl">
                    <p className="text-xs text-gray-600">Data Quality</p>
                    <h3 className="text-xl font-semibold text-gray-900">97.5%</h3>
                    <p className="text-[10px] text-green-600 mt-1">Excellent</p>
                </div>

                <div className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 rounded-xl">
                    <p className="text-xs text-gray-600">Auto-Fixed</p>
                    <h3 className="text-xl font-semibold text-gray-900">1,204</h3>
                    <p className="text-[10px] text-blue-600 mt-1">Last 30 days</p>
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
                            placeholder="Search validation rules..."
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
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Field</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Module</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Violations</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredRules.map((rule) => (
                                <tr key={rule.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-50 text-green-600 rounded-lg border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-all">
                                                <CheckCircle size={18} />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">{rule.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-700 font-mono">{rule.field}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-full text-[10px] font-semibold px-2 py-0.5">
                                            {rule.module}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={`${getTypeBadgeClass(rule.type)} rounded-full text-[10px] font-semibold px-2 py-0.5`}>
                                            {rule.type}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {rule.violations > 0 ? (
                                                <>
                                                    <AlertTriangle size={14} className="text-amber-600" />
                                                    <span className="text-sm font-semibold text-amber-600">{rule.violations}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle size={14} className="text-green-600" />
                                                    <span className="text-sm font-semibold text-green-600">0</span>
                                                </>
                                            )}
                                        </div>
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
                                                    onClick={() => handleRunValidation(rule.name)}
                                                    className="text-sm p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer"
                                                >
                                                    <Play size={14} /> Run Validation
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
                    <p className="text-sm text-gray-600">Showing {filteredRules.length} validation rules</p>
                    <Button variant="link" className="text-blue-600 text-sm flex items-center gap-1 group font-semibold">
                        View Violation Report <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-2xl rounded-xl p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 text-white">
                        <h2 className="text-base font-semibold flex items-center gap-2">
                            <Plus size={18} /> Create Validation Rule
                        </h2>
                        <p className="text-xs opacity-80 mt-1">Define data quality standards for your CRM.</p>
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
                            <Edit size={18} /> Edit Validation Rule
                        </h2>
                        <p className="text-xs opacity-80 mt-1">Update validation rule configuration.</p>
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
