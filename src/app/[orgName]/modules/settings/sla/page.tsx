"use client";

import React, { useState, useMemo } from "react";
import {
    Shield,
    Plus,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    TrendingUp,
    Activity
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
import { showSuccess, showWarning } from "@/utils/toast";

interface SLAPolicy {
    id: string;
    name: string;
    module: string;
    responseTime: string;
    resolutionTime: string;
    status: string;
    compliance: number;
}

interface PolicyForm {
    name: string;
    module: string;
    responseTime: string;
    resolutionTime: string;
}

interface FormErrors {
    name?: string;
    module?: string;
    responseTime?: string;
}

const defaultFormState: PolicyForm = {
    name: "",
    module: "",
    responseTime: "",
    resolutionTime: "",
};

export default function SLAPoliciesPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showMetricsModal, setShowMetricsModal] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Paused">("All");

    const [newPolicy, setNewPolicy] = useState<PolicyForm>({ ...defaultFormState });
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const [editPolicy, setEditPolicy] = useState<SLAPolicy | null>(null);
    const [editForm, setEditForm] = useState<PolicyForm>({ ...defaultFormState });
    const [editFormErrors, setEditFormErrors] = useState<FormErrors>({});

    const [selectedPolicy, setSelectedPolicy] = useState<SLAPolicy | null>(null);

    const [slaPolicies, setSLAPolicies] = useState<SLAPolicy[]>([
        { id: "1", name: "Critical Support Ticket", module: "Support", responseTime: "15 mins", resolutionTime: "4 hours", status: "Active", compliance: 98 },
        { id: "2", name: "High Priority Bug", module: "Development", responseTime: "30 mins", resolutionTime: "24 hours", status: "Active", compliance: 95 },
        { id: "3", name: "Sales Lead Follow-up", module: "CRM", responseTime: "1 hour", resolutionTime: "48 hours", status: "Active", compliance: 92 },
        { id: "4", name: "HR Onboarding", module: "HRM", responseTime: "2 hours", resolutionTime: "3 days", status: "Paused", compliance: 88 },
    ]);

    const filteredPolicies = useMemo(() => {
        return slaPolicies.filter((policy) => {
            const matchesSearch =
                searchQuery === "" ||
                policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                policy.module.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus =
                statusFilter === "All" || policy.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [slaPolicies, searchQuery, statusFilter]);

    const validateForm = (form: PolicyForm): FormErrors => {
        const errors: FormErrors = {};
        const sanitizedName = form.name.trim();

        if (!sanitizedName) {
            errors.name = "Policy name is required";
        } else if (/\d/.test(sanitizedName)) {
            errors.name = "Policy name cannot contain numbers";
        }

        if (!form.module) errors.module = "Module is required";
        if (!form.responseTime.trim()) errors.responseTime = "Response time is required";
        return errors;
    };

    const handleCreate = () => {
        const errors = validateForm(newPolicy);
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        const created: SLAPolicy = {
            id: Date.now().toString(),
            name: newPolicy.name.trim(),
            module: newPolicy.module,
            responseTime: newPolicy.responseTime.trim(),
            resolutionTime: newPolicy.resolutionTime.trim() || "N/A",
            status: "Active",
            compliance: 100,
        };
        setSLAPolicies((prev) => [...prev, created]);
        setNewPolicy({ ...defaultFormState });
        setFormErrors({});
        setShowCreateModal(false);
        showSuccess(`SLA policy "${created.name}" created successfully`);
    };

    const openEdit = (policy: SLAPolicy) => {
        setEditPolicy(policy);
        setEditForm({
            name: policy.name,
            module: policy.module,
            responseTime: policy.responseTime,
            resolutionTime: policy.resolutionTime,
        });
        setEditFormErrors({});
        setShowEditModal(true);
    };

    const handleEdit = () => {
        if (!editPolicy) return;
        const errors = validateForm(editForm);
        setEditFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setSLAPolicies((prev) =>
            prev.map((p) =>
                p.id === editPolicy.id
                    ? {
                          ...p,
                          name: editForm.name.trim(),
                          module: editForm.module,
                          responseTime: editForm.responseTime.trim(),
                          resolutionTime: editForm.resolutionTime.trim() || "N/A",
                      }
                    : p
            )
        );
        setShowEditModal(false);
        setEditPolicy(null);
        setEditForm({ ...defaultFormState });
        setEditFormErrors({});
        showSuccess(`SLA policy "${editForm.name.trim()}" updated successfully`);
    };

    const deletePolicy = (id: string) => {
        const policy = slaPolicies.find((p) => p.id === id);
        if (!policy) return;
        const confirmed = window.confirm(
            `Are you sure you want to delete "${policy.name}"? This action cannot be undone.`
        );
        if (!confirmed) return;
        setSLAPolicies((prev) => prev.filter((sla) => sla.id !== id));
        showWarning(`SLA policy "${policy.name}" deleted`);
    };

    const toggleStatus = (id: string) => {
        setSLAPolicies((prev) =>
            prev.map((sla) =>
                sla.id === id
                    ? { ...sla, status: sla.status === "Active" ? "Paused" : "Active" }
                    : sla
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

    const viewMetrics = (policy: SLAPolicy) => {
        setSelectedPolicy(policy);
        setShowMetricsModal(true);
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">SLA Policies</h1>
                    <p className="text-sm text-gray-600">Define Service Level Agreements for response and resolution times.</p>
                </div>
                <Button
                    onClick={() => {
                        setNewPolicy({ ...defaultFormState });
                        setFormErrors({});
                        setShowCreateModal(true);
                    }}
                    className="rounded-none bg-primary hover:bg-primary/90 font-black text-sm h-11 gap-2 shadow-xl shadow-primary/20 px-6"
                >
                    <Plus size={16} /> Create SLA Policy
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-xs opacity-80">Active SLAs</p>
                    <p className="text-white text-xl font-semibold mt-1">{slaPolicies.filter(s => s.status === "Active").length}</p>
                    <p className="text-white text-[10px] mt-1 opacity-80">Currently enforced</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Avg. Compliance</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">93.2%</p>
                    <p className="text-green-600 text-[10px] mt-1">Excellent performance</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Breaches (30d)</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">12</p>
                    <p className="text-amber-600 text-[10px] mt-1">Needs attention</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">On-Time Resolution</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">96.8%</p>
                    <p className="text-green-600 text-[10px] mt-1">Above target</p>
                </div>
            </div>

            {/* SLA Policies List */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search SLA policies..."
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
                                <Badge className={`ml-1 rounded-none text-[10px] font-bold px-2 py-0.5 border-none text-white ${statusFilter === "Active" ? "bg-green-600" : "bg-zinc-400"}`}>
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
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Module</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Response Time</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Resolution Time</th>
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
                                            <p className="text-sm font-bold text-gray-500">No SLA policies found</p>
                                            <p className="text-xs text-gray-400">
                                                {searchQuery || statusFilter !== "All"
                                                    ? "Try adjusting your search or filter criteria"
                                                    : "Create your first SLA policy to get started"}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPolicies.map((policy) => (
                                    <tr key={policy.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-50 text-purple-600 rounded-none border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                                    <Shield size={18} />
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{policy.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className="bg-primary/10 text-primary border-primary/20 rounded-none text-[10px] font-bold px-2 py-0.5">
                                                {policy.module}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-700">
                                                <Clock size={12} className="text-primary" /> {policy.responseTime}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-700">
                                                <Clock size={12} className="text-green-500" /> {policy.resolutionTime}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm font-bold ${policy.compliance >= 95 ? 'text-green-600' : policy.compliance >= 90 ? 'text-primary' : 'text-amber-600'}`}>
                                                    {policy.compliance}%
                                                </span>
                                                {policy.compliance >= 95 && <CheckCircle2 size={14} className="text-green-600" />}
                                            </div>
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
                                                        onClick={() => viewMetrics(policy)}
                                                        className="text-sm p-2 flex items-center gap-2 focus:bg-primary focus:text-white cursor-pointer"
                                                    >
                                                        <Activity size={14} /> View Metrics
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
                    <p className="text-sm text-gray-600">Showing {filteredPolicies.length} of {slaPolicies.length} SLA policies</p>
                    <Button variant="link" className="text-primary text-sm flex items-center gap-1 group" onClick={() => showSuccess("Compliance report generated")}>
                        View Compliance Report <TrendingUp size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-primary/80 to-primary px-5 py-4 text-white relative">
                        <h2 className="text-base font-bold flex items-center gap-2">
                            <Plus size={16} /> Create SLA Policy
                        </h2>
                        <p className="text-xs opacity-80 mt-1">Define service level commitments for your team.</p>
                    </div>
                    <div className="p-5 space-y-4 bg-white">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Policy Name</Label>
                            <Input
                                placeholder="e.g., Critical Support Ticket"
                                value={newPolicy.name}
                                onChange={(e) => {
                                    setNewPolicy((prev) => ({ ...prev, name: e.target.value }));
                                    if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));
                                }}
                                className={`rounded-none border-zinc-200 h-9 text-sm ${formErrors.name ? "border-red-500" : ""}`}
                            />
                            {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Module</Label>
                            <Select
                                value={newPolicy.module}
                                onValueChange={(val) => {
                                    setNewPolicy((prev) => ({ ...prev, module: val }));
                                    if (formErrors.module) setFormErrors((prev) => ({ ...prev, module: undefined }));
                                }}
                            >
                                <SelectTrigger className={`rounded-none border-zinc-200 h-9 ${formErrors.module ? "border-red-500" : ""}`}>
                                    <SelectValue placeholder="Select module" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="Support">Support</SelectItem>
                                    <SelectItem value="CRM">CRM</SelectItem>
                                    <SelectItem value="HRM">HRM</SelectItem>
                                    <SelectItem value="Development">Development</SelectItem>
                                </SelectContent>
                            </Select>
                            {formErrors.module && <p className="text-xs text-red-500">{formErrors.module}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-gray-600">Response Time</Label>
                                <Input
                                    placeholder="e.g., 15 mins"
                                    value={newPolicy.responseTime}
                                    onChange={(e) => {
                                        setNewPolicy((prev) => ({ ...prev, responseTime: e.target.value }));
                                        if (formErrors.responseTime) setFormErrors((prev) => ({ ...prev, responseTime: undefined }));
                                    }}
                                    className={`rounded-none border-zinc-200 h-9 text-sm ${formErrors.responseTime ? "border-red-500" : ""}`}
                                />
                                {formErrors.responseTime && <p className="text-xs text-red-500">{formErrors.responseTime}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-gray-600">Resolution Time</Label>
                                <Input
                                    placeholder="e.g., 4 hours"
                                    value={newPolicy.resolutionTime}
                                    onChange={(e) => setNewPolicy((prev) => ({ ...prev, resolutionTime: e.target.value }))}
                                    className="rounded-none border-zinc-200 h-9 text-sm"
                                />
                            </div>
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
                            <Edit size={16} /> Edit SLA Policy
                        </h2>
                        <p className="text-xs opacity-80 mt-1">Update service level commitments for this policy.</p>
                    </div>
                    <div className="p-5 space-y-4 bg-white">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Policy Name</Label>
                            <Input
                                placeholder="e.g., Critical Support Ticket"
                                value={editForm.name}
                                onChange={(e) => {
                                    setEditForm((prev) => ({ ...prev, name: e.target.value }));
                                    if (editFormErrors.name) setEditFormErrors((prev) => ({ ...prev, name: undefined }));
                                }}
                                className={`rounded-none border-zinc-200 h-9 text-sm ${editFormErrors.name ? "border-red-500" : ""}`}
                            />
                            {editFormErrors.name && <p className="text-xs text-red-500">{editFormErrors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Module</Label>
                            <Select
                                value={editForm.module}
                                onValueChange={(val) => {
                                    setEditForm((prev) => ({ ...prev, module: val }));
                                    if (editFormErrors.module) setEditFormErrors((prev) => ({ ...prev, module: undefined }));
                                }}
                            >
                                <SelectTrigger className={`rounded-none border-zinc-200 h-9 ${editFormErrors.module ? "border-red-500" : ""}`}>
                                    <SelectValue placeholder="Select module" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="Support">Support</SelectItem>
                                    <SelectItem value="CRM">CRM</SelectItem>
                                    <SelectItem value="HRM">HRM</SelectItem>
                                    <SelectItem value="Development">Development</SelectItem>
                                </SelectContent>
                            </Select>
                            {editFormErrors.module && <p className="text-xs text-red-500">{editFormErrors.module}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-gray-600">Response Time</Label>
                                <Input
                                    placeholder="e.g., 15 mins"
                                    value={editForm.responseTime}
                                    onChange={(e) => {
                                        setEditForm((prev) => ({ ...prev, responseTime: e.target.value }));
                                        if (editFormErrors.responseTime) setEditFormErrors((prev) => ({ ...prev, responseTime: undefined }));
                                    }}
                                    className={`rounded-none border-zinc-200 h-9 text-sm ${editFormErrors.responseTime ? "border-red-500" : ""}`}
                                />
                                {editFormErrors.responseTime && <p className="text-xs text-red-500">{editFormErrors.responseTime}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-gray-600">Resolution Time</Label>
                                <Input
                                    placeholder="e.g., 4 hours"
                                    value={editForm.resolutionTime}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, resolutionTime: e.target.value }))}
                                    className="rounded-none border-zinc-200 h-9 text-sm"
                                />
                            </div>
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

            {/* Metrics Modal */}
            <Dialog open={showMetricsModal} onOpenChange={setShowMetricsModal}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-primary/80 to-primary px-5 py-4 text-white relative">
                        <h2 className="text-base font-bold flex items-center gap-2">
                            <Activity size={16} /> Policy Metrics
                        </h2>
                        <p className="text-xs opacity-80 mt-1">
                            {selectedPolicy ? selectedPolicy.name : "SLA Policy"}
                        </p>
                    </div>
                    {selectedPolicy && (
                        <div className="p-5 space-y-4 bg-white">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold text-gray-600">Compliance Rate</Label>
                                    <span
                                        className={`text-sm font-bold ${
                                            selectedPolicy.compliance >= 95
                                                ? "text-green-600"
                                                : selectedPolicy.compliance >= 90
                                                ? "text-primary"
                                                : "text-amber-600"
                                        }`}
                                    >
                                        {selectedPolicy.compliance}%
                                    </span>
                                </div>
                                <div className="w-full h-3 bg-zinc-100 rounded-none overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${
                                            selectedPolicy.compliance >= 95
                                                ? "bg-green-500"
                                                : selectedPolicy.compliance >= 90
                                                ? "bg-primary"
                                                : "bg-amber-500"
                                        }`}
                                        style={{ width: `${selectedPolicy.compliance}%` }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="border border-zinc-200 rounded-none p-3 space-y-1">
                                    <p className="text-xs font-bold text-gray-500">Response Time</p>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-primary" />
                                        <span className="text-sm font-bold text-gray-900">{selectedPolicy.responseTime}</span>
                                    </div>
                                </div>
                                <div className="border border-zinc-200 rounded-none p-3 space-y-1">
                                    <p className="text-xs font-bold text-gray-500">Resolution Time</p>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-green-500" />
                                        <span className="text-sm font-bold text-gray-900">{selectedPolicy.resolutionTime}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="border border-zinc-200 rounded-none p-3 space-y-1">
                                    <p className="text-xs font-bold text-gray-500">Module</p>
                                    <Badge className="bg-primary/10 text-primary border-primary/20 rounded-none text-[10px] font-bold px-2 py-0.5">
                                        {selectedPolicy.module}
                                    </Badge>
                                </div>
                                <div className="border border-zinc-200 rounded-none p-3 space-y-1">
                                    <p className="text-xs font-bold text-gray-500">Status</p>
                                    <Badge className={`${selectedPolicy.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                        {selectedPolicy.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowMetricsModal(false)} className="rounded-none text-sm text-gray-600 h-9">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
