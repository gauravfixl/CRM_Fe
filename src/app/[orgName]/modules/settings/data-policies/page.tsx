"use client";

import React, { useState, useMemo } from "react";
import {
    FileText,
    Plus,
    Shield,
    Lock,
    Eye,
    EyeOff,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
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
import { showSuccess, showWarning } from "@/shared/utils/toast";

interface Policy {
    id: string;
    name: string;
    type: string;
    scope: string;
    enforcement: string;
    status: string;
    compliance: number;
    description: string;
}

interface PolicyForm {
    name: string;
    type: string;
    enforcement: string;
    scope: string;
    description: string;
}

interface FormErrors {
    name?: string;
    type?: string;
    enforcement?: string;
}

export default function DataPoliciesPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Paused">("All");

    const [newPolicy, setNewPolicy] = useState<PolicyForm>({
        name: "",
        type: "",
        enforcement: "",
        scope: "",
        description: "",
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const [editPolicy, setEditPolicy] = useState<PolicyForm & { id: string }>({
        id: "",
        name: "",
        type: "",
        enforcement: "",
        scope: "",
        description: "",
    });
    const [editFormErrors, setEditFormErrors] = useState<FormErrors>({});

    const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

    const [dataPolicies, setDataPolicies] = useState<Policy[]>([
        { id: "1", name: "GDPR Compliance", type: "Privacy", scope: "All Modules", enforcement: "Strict", status: "Active", compliance: 98, description: "Ensures all data handling complies with GDPR regulations across all modules." },
        { id: "2", name: "Data Encryption at Rest", type: "Security", scope: "Database", enforcement: "Mandatory", status: "Active", compliance: 100, description: "All database records must be encrypted at rest using AES-256 encryption." },
        { id: "3", name: "PII Data Masking", type: "Privacy", scope: "Reports", enforcement: "Strict", status: "Active", compliance: 95, description: "Personally identifiable information must be masked in all report outputs." },
        { id: "4", name: "Data Anonymization", type: "Privacy", scope: "Analytics", enforcement: "Standard", status: "Paused", compliance: 92, description: "Analytics data should be anonymized before processing to protect user identity." },
    ]);

    const filteredPolicies = useMemo(() => {
        return dataPolicies.filter((policy) => {
            const matchesSearch =
                searchQuery === "" ||
                policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                policy.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                policy.scope.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus =
                statusFilter === "All" || policy.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [dataPolicies, searchQuery, statusFilter]);

    const handleCreate = () => {
        const errors: FormErrors = {};
        const sanitizedName = newPolicy.name.trim();

        if (!sanitizedName) {
            errors.name = "Policy name is required";
        } else if (/\d/.test(sanitizedName)) {
            errors.name = "Policy name cannot contain numbers";
        }

        if (!newPolicy.type) errors.type = "Policy type is required";
        if (!newPolicy.enforcement) errors.enforcement = "Enforcement level is required";

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            showWarning(errors.name || "Please fill in all required fields");
            return;
        }

        const created: Policy = {
            id: Date.now().toString(),
            name: newPolicy.name.trim(),
            type: newPolicy.type,
            scope: newPolicy.scope || "All Modules",
            enforcement: newPolicy.enforcement,
            status: "Active",
            compliance: 100,
            description: newPolicy.description,
        };

        setDataPolicies((prev) => [...prev, created]);
        setShowCreateModal(false);
        setNewPolicy({ name: "", type: "", enforcement: "", scope: "", description: "" });
        setFormErrors({});
        showSuccess(`Policy "${created.name}" created successfully`);
    };

    const openEdit = (policy: Policy) => {
        setEditPolicy({
            id: policy.id,
            name: policy.name,
            type: policy.type,
            enforcement: policy.enforcement,
            scope: policy.scope,
            description: policy.description,
        });
        setEditFormErrors({});
        setShowEditModal(true);
    };

    const handleEdit = () => {
        const errors: FormErrors = {};
        const sanitizedName = editPolicy.name.trim();

        if (!sanitizedName) {
            errors.name = "Policy name is required";
        } else if (/\d/.test(sanitizedName)) {
            errors.name = "Policy name cannot contain numbers";
        }

        if (!editPolicy.type) errors.type = "Policy type is required";
        if (!editPolicy.enforcement) errors.enforcement = "Enforcement level is required";

        if (Object.keys(errors).length > 0) {
            setEditFormErrors(errors);
            showWarning(errors.name || "Please fill in all required fields");
            return;
        }

        setDataPolicies((prev) =>
            prev.map((p) =>
                p.id === editPolicy.id
                    ? {
                          ...p,
                          name: editPolicy.name.trim(),
                          type: editPolicy.type,
                          enforcement: editPolicy.enforcement,
                          scope: editPolicy.scope || p.scope,
                          description: editPolicy.description,
                      }
                    : p
            )
        );
        setShowEditModal(false);
        setEditFormErrors({});
        showSuccess(`Policy "${editPolicy.name}" updated successfully`);
    };

    const deletePolicy = (id: string) => {
        const policy = dataPolicies.find((p) => p.id === id);
        if (!policy) return;
        const confirmed = window.confirm(
            `Are you sure you want to delete "${policy.name}"? This action cannot be undone.`
        );
        if (!confirmed) return;
        setDataPolicies((prev) => prev.filter((p) => p.id !== id));
        showWarning(`Policy "${policy.name}" deleted`);
    };

    const toggleStatus = (id: string) => {
        setDataPolicies((prev) =>
            prev.map((policy) =>
                policy.id === id
                    ? {
                          ...policy,
                          status: policy.status === "Active" ? "Paused" : "Active",
                      }
                    : policy
            )
        );
    };

    const cycleStatusFilter = () => {
        setStatusFilter((prev) => {
            if (prev === "All") return "Active";
            if (prev === "Active") return "Paused";
            return "All";
        });
    };

    const viewDetails = (policy: Policy) => {
        setSelectedPolicy(policy);
        setShowDetailsModal(true);
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Data Policies</h1>
                    <p className="text-sm text-gray-600">Manage data privacy, security, and compliance policies.</p>
                </div>
                <Button
                    onClick={() => {
                        setNewPolicy({ name: "", type: "", enforcement: "", scope: "", description: "" });
                        setFormErrors({});
                        setShowCreateModal(true);
                    }}
                    className="rounded-none bg-primary hover:bg-primary/90 font-black text-sm h-11 gap-2 shadow-xl shadow-primary/20 px-6"
                >
                    <Plus size={16} /> Create Policy
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-xs opacity-80">Active Policies</p>
                    <p className="text-white text-xl font-semibold mt-1">{dataPolicies.filter(p => p.status === "Active").length}</p>
                    <p className="text-white text-[10px] mt-1 opacity-80">Currently enforced</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Compliance Score</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">96.2%</p>
                    <p className="text-green-600 text-[10px] mt-1">Excellent</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Protected Records</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">24,580</p>
                    <p className="text-primary text-[10px] mt-1">Under governance</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Policy Violations</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">3</p>
                    <p className="text-amber-600 text-[10px] mt-1">Last 30 days</p>
                </div>
            </div>

            {/* Policies List */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search data policies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button
                            variant="outline"
                            onClick={cycleStatusFilter}
                            className="rounded-none border-zinc-200 h-10 text-sm gap-2 bg-white flex-1 md:flex-none"
                        >
                            <Filter size={14} /> Filter
                            {statusFilter !== "All" && (
                                <Badge className={`${statusFilter === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5 ml-1`}>
                                    {statusFilter}
                                </Badge>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Policy Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Scope</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Enforcement</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Compliance</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredPolicies.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Shield size={40} className="text-zinc-300" />
                                            <p className="text-sm font-bold text-gray-500">No policies found</p>
                                            <p className="text-xs text-gray-400">Try adjusting your search or filter criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPolicies.map((policy) => (
                                    <tr key={policy.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-none border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                    <Shield size={18} />
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{policy.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={`${policy.type === "Privacy" ? "bg-purple-50 text-purple-700 border-purple-200" : policy.type === "Security" ? "bg-red-50 text-red-700 border-red-200" : "bg-primary/10 text-primary border-primary/20"} rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                                {policy.type}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-700">{policy.scope}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={`${policy.enforcement === "Mandatory" || policy.enforcement === "Strict" ? "bg-red-600" : "bg-primary"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                                {policy.enforcement}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-bold ${policy.compliance >= 95 ? 'text-green-600' : 'text-amber-600'}`}>
                                                {policy.compliance}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={policy.status === "Active"}
                                                    onCheckedChange={() => toggleStatus(policy.id)}
                                                    className="data-[state=checked]:bg-green-600"
                                                />
                                                <Badge className={`${policy.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                                    {policy.status}
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
                                                    <DropdownMenuItem
                                                        onClick={() => openEdit(policy)}
                                                        className="text-sm p-2 flex items-center gap-2 focus:bg-primary focus:text-white cursor-pointer"
                                                    >
                                                        <Edit size={14} /> Edit Policy
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => viewDetails(policy)}
                                                        className="text-sm p-2 flex items-center gap-2 focus:bg-primary focus:text-white cursor-pointer"
                                                    >
                                                        <Eye size={14} /> View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-2" />
                                                    <DropdownMenuItem
                                                        onClick={() => deletePolicy(policy.id)}
                                                        className="text-sm p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing {filteredPolicies.length} of {dataPolicies.length} data policies</p>
                    <Button variant="link" className="text-primary text-sm flex items-center gap-1 group" onClick={() => showSuccess("Compliance report generated")}>
                        View Compliance Report <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-primary/80 to-primary px-5 py-4 text-white relative">
                        <h2 className="text-base font-bold flex items-center gap-2">
                            <Plus size={16} /> Create Data Policy
                        </h2>
                        <p className="text-xs opacity-80 mt-1">Define governance rules for data protection and compliance.</p>
                    </div>
                    <div className="p-5 space-y-4 bg-white">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Policy Name</Label>
                            <Input
                                placeholder="e.g., GDPR Compliance"
                                value={newPolicy.name}
                                onChange={(e) => {
                                    setNewPolicy((prev) => ({ ...prev, name: e.target.value }));
                                    if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));
                                }}
                                className={`rounded-none border-zinc-200 h-9 text-sm ${formErrors.name ? "border-red-500" : ""}`}
                            />
                            {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-gray-600">Policy Type</Label>
                                <Select
                                    value={newPolicy.type}
                                    onValueChange={(value) => {
                                        setNewPolicy((prev) => ({ ...prev, type: value }));
                                        if (formErrors.type) setFormErrors((prev) => ({ ...prev, type: undefined }));
                                    }}
                                >
                                    <SelectTrigger className={`rounded-none border-zinc-200 h-9 ${formErrors.type ? "border-red-500" : ""}`}>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Privacy">Privacy</SelectItem>
                                        <SelectItem value="Security">Security</SelectItem>
                                        <SelectItem value="Compliance">Compliance</SelectItem>
                                    </SelectContent>
                                </Select>
                                {formErrors.type && <p className="text-xs text-red-500">{formErrors.type}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-gray-600">Enforcement Level</Label>
                                <Select
                                    value={newPolicy.enforcement}
                                    onValueChange={(value) => {
                                        setNewPolicy((prev) => ({ ...prev, enforcement: value }));
                                        if (formErrors.enforcement) setFormErrors((prev) => ({ ...prev, enforcement: undefined }));
                                    }}
                                >
                                    <SelectTrigger className={`rounded-none border-zinc-200 h-9 ${formErrors.enforcement ? "border-red-500" : ""}`}>
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Mandatory">Mandatory</SelectItem>
                                        <SelectItem value="Strict">Strict</SelectItem>
                                        <SelectItem value="Standard">Standard</SelectItem>
                                    </SelectContent>
                                </Select>
                                {formErrors.enforcement && <p className="text-xs text-red-500">{formErrors.enforcement}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Scope</Label>
                            <Select
                                value={newPolicy.scope}
                                onValueChange={(value) => setNewPolicy((prev) => ({ ...prev, scope: value }))}
                            >
                                <SelectTrigger className="rounded-none border-zinc-200 h-9">
                                    <SelectValue placeholder="Select scope" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="All Modules">All Modules</SelectItem>
                                    <SelectItem value="Database">Database</SelectItem>
                                    <SelectItem value="Reports">Reports</SelectItem>
                                    <SelectItem value="Analytics">Analytics</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Description</Label>
                            <Textarea
                                placeholder="Describe the policy requirements..."
                                value={newPolicy.description}
                                onChange={(e) => setNewPolicy((prev) => ({ ...prev, description: e.target.value }))}
                                className="rounded-none border-zinc-200 min-h-[70px] text-sm"
                            />
                        </div>
                    </div>
                    <DialogFooter className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 gap-3 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-none text-sm text-gray-600 h-9">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            className="bg-primary hover:bg-primary/90 rounded-none text-sm px-6 h-9 shadow-md shadow-primary/20"
                        >
                            Create Policy
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-primary/80 to-primary px-5 py-4 text-white relative">
                        <h2 className="text-base font-bold flex items-center gap-2">
                            <Edit size={16} /> Edit Data Policy
                        </h2>
                        <p className="text-xs opacity-80 mt-1">Update governance rules for this data policy.</p>
                    </div>
                    <div className="p-5 space-y-4 bg-white">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Policy Name</Label>
                            <Input
                                placeholder="e.g., GDPR Compliance"
                                value={editPolicy.name}
                                onChange={(e) => {
                                    setEditPolicy((prev) => ({ ...prev, name: e.target.value }));
                                    if (editFormErrors.name) setEditFormErrors((prev) => ({ ...prev, name: undefined }));
                                }}
                                className={`rounded-none border-zinc-200 h-9 text-sm ${editFormErrors.name ? "border-red-500" : ""}`}
                            />
                            {editFormErrors.name && <p className="text-xs text-red-500">{editFormErrors.name}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-gray-600">Policy Type</Label>
                                <Select
                                    value={editPolicy.type}
                                    onValueChange={(value) => {
                                        setEditPolicy((prev) => ({ ...prev, type: value }));
                                        if (editFormErrors.type) setEditFormErrors((prev) => ({ ...prev, type: undefined }));
                                    }}
                                >
                                    <SelectTrigger className={`rounded-none border-zinc-200 h-9 ${editFormErrors.type ? "border-red-500" : ""}`}>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Privacy">Privacy</SelectItem>
                                        <SelectItem value="Security">Security</SelectItem>
                                        <SelectItem value="Compliance">Compliance</SelectItem>
                                    </SelectContent>
                                </Select>
                                {editFormErrors.type && <p className="text-xs text-red-500">{editFormErrors.type}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-gray-600">Enforcement Level</Label>
                                <Select
                                    value={editPolicy.enforcement}
                                    onValueChange={(value) => {
                                        setEditPolicy((prev) => ({ ...prev, enforcement: value }));
                                        if (editFormErrors.enforcement) setEditFormErrors((prev) => ({ ...prev, enforcement: undefined }));
                                    }}
                                >
                                    <SelectTrigger className={`rounded-none border-zinc-200 h-9 ${editFormErrors.enforcement ? "border-red-500" : ""}`}>
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Mandatory">Mandatory</SelectItem>
                                        <SelectItem value="Strict">Strict</SelectItem>
                                        <SelectItem value="Standard">Standard</SelectItem>
                                    </SelectContent>
                                </Select>
                                {editFormErrors.enforcement && <p className="text-xs text-red-500">{editFormErrors.enforcement}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Scope</Label>
                            <Select
                                value={editPolicy.scope}
                                onValueChange={(value) => setEditPolicy((prev) => ({ ...prev, scope: value }))}
                            >
                                <SelectTrigger className="rounded-none border-zinc-200 h-9">
                                    <SelectValue placeholder="Select scope" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="All Modules">All Modules</SelectItem>
                                    <SelectItem value="Database">Database</SelectItem>
                                    <SelectItem value="Reports">Reports</SelectItem>
                                    <SelectItem value="Analytics">Analytics</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Description</Label>
                            <Textarea
                                placeholder="Describe the policy requirements..."
                                value={editPolicy.description}
                                onChange={(e) => setEditPolicy((prev) => ({ ...prev, description: e.target.value }))}
                                className="rounded-none border-zinc-200 min-h-[70px] text-sm"
                            />
                        </div>
                    </div>
                    <DialogFooter className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 gap-3 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowEditModal(false)} className="rounded-none text-sm text-gray-600 h-9">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEdit}
                            className="bg-primary hover:bg-primary/90 rounded-none text-sm px-6 h-9 shadow-md shadow-primary/20"
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Details Modal */}
            <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-primary/80 to-primary px-5 py-4 text-white relative">
                        <h2 className="text-base font-bold flex items-center gap-2">
                            <Eye size={16} /> Policy Details
                        </h2>
                        <p className="text-xs opacity-80 mt-1">Read-only view of this data policy.</p>
                    </div>
                    {selectedPolicy && (
                        <div className="p-5 space-y-4 bg-white">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Policy Name</Label>
                                <p className="text-sm font-bold text-gray-900">{selectedPolicy.name}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Type</Label>
                                    <div>
                                        <Badge className={`${selectedPolicy.type === "Privacy" ? "bg-purple-50 text-purple-700 border-purple-200" : selectedPolicy.type === "Security" ? "bg-red-50 text-red-700 border-red-200" : "bg-primary/10 text-primary border-primary/20"} rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                            {selectedPolicy.type}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Enforcement</Label>
                                    <div>
                                        <Badge className={`${selectedPolicy.enforcement === "Mandatory" || selectedPolicy.enforcement === "Strict" ? "bg-red-600" : "bg-primary"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                            {selectedPolicy.enforcement}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Scope</Label>
                                    <p className="text-sm font-medium text-gray-700">{selectedPolicy.scope}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Compliance</Label>
                                    <p className={`text-lg font-bold ${selectedPolicy.compliance >= 95 ? "text-green-600" : "text-amber-600"}`}>
                                        {selectedPolicy.compliance}%
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</Label>
                                <div>
                                    <Badge className={`${selectedPolicy.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                        {selectedPolicy.status}
                                    </Badge>
                                </div>
                            </div>
                            {selectedPolicy.description && (
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</Label>
                                    <p className="text-sm text-gray-700 leading-relaxed">{selectedPolicy.description}</p>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowDetailsModal(false)} className="rounded-none text-sm text-gray-600 h-9">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
