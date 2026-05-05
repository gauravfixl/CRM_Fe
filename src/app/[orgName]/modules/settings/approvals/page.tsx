"use client";

import React, { useState, useMemo } from "react";
import {
    CheckCircle,
    Plus,
    Users,
    Clock,
    XCircle,
    ChevronRight,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Play,
    Pause,
    GitBranch,
    ArrowUp,
    ArrowDown,
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

interface ApprovalProcess {
    id: string;
    name: string;
    module: string;
    approvers: string;
    avgTime: string;
    status: string;
    pending: number;
}

interface ProcessForm {
    name: string;
    module: string;
    firstApprover: string;
    secondApprover: string;
}

const emptyForm: ProcessForm = { name: "", module: "", firstApprover: "", secondApprover: "" };

const approverLabels: Record<string, string> = {
    manager: "Direct Manager",
    "dept-head": "Department Head",
    "hr-head": "HR Head",
    cfo: "CFO",
    "sales-lead": "Sales Lead",
    director: "Director",
    finance: "Finance",
};

const moduleLabels: Record<string, string> = {
    hrm: "HRM",
    finance: "Finance",
    sales: "Sales",
    procurement: "Procurement",
};

function buildApproverChain(first: string, second: string): string {
    const a = approverLabels[first] || first;
    const b = approverLabels[second] || second;
    if (a && b) return `${a} \u2192 ${b}`;
    if (a) return a;
    return "";
}

export default function ApprovalProcessesPage() {
    // Modal visibility
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showManageModal, setShowManageModal] = useState(false);

    // Search and filter
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Paused">("All");

    // Create form
    const [newProcess, setNewProcess] = useState<ProcessForm>({ ...emptyForm });
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProcessForm, string>>>({});

    // Edit form
    const [editProcess, setEditProcess] = useState<ApprovalProcess & ProcessForm>({
        id: "", name: "", module: "", approvers: "", avgTime: "", status: "", pending: 0,
        firstApprover: "", secondApprover: "",
    });
    const [editFormErrors, setEditFormErrors] = useState<Partial<Record<keyof ProcessForm, string>>>({});

    // Manage approvers target
    const [manageTarget, setManageTarget] = useState<ApprovalProcess | null>(null);

    // Data
    const [approvalProcesses, setApprovalProcesses] = useState<ApprovalProcess[]>([
        { id: "1", name: "Leave Approval", module: "HRM", approvers: "Manager \u2192 HR Head", avgTime: "4.2 hours", status: "Active", pending: 12 },
        { id: "2", name: "Purchase Order", module: "Finance", approvers: "Department Head \u2192 CFO", avgTime: "1.5 days", status: "Active", pending: 5 },
        { id: "3", name: "Expense Reimbursement", module: "Finance", approvers: "Manager \u2192 Finance", avgTime: "6 hours", status: "Active", pending: 8 },
        { id: "4", name: "Client Proposal", module: "Sales", approvers: "Sales Lead \u2192 Director", avgTime: "12 hours", status: "Paused", pending: 0 },
    ]);

    // Filtered list
    const filteredProcesses = useMemo(() => {
        return approvalProcesses.filter((p) => {
            const matchesSearch =
                !searchQuery ||
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.approvers.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "All" || p.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [approvalProcesses, searchQuery, statusFilter]);

    // --- Handlers ---

    const handleCreate = () => {
        const errors: Partial<Record<keyof ProcessForm, string>> = {};
        const sanitizedName = newProcess.name.trim();

        if (!sanitizedName) {
            errors.name = "Process name is required";
        } else if (/\d/.test(sanitizedName)) {
            errors.name = "Process name cannot contain numbers";
        }

        if (!newProcess.module) errors.module = "Module is required";
        
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            showWarning(errors.name || "Please fill in all required fields");
            return;
        }
        const moduleName = moduleLabels[newProcess.module] || newProcess.module;
        const chain = buildApproverChain(newProcess.firstApprover, newProcess.secondApprover);
        const created: ApprovalProcess = {
            id: Date.now().toString(),
            name: sanitizedName,
            module: moduleName,
            approvers: chain || "Not configured",
            avgTime: "N/A",
            status: "Active",
            pending: 0,
        };
        setApprovalProcesses((prev) => [...prev, created]);
        setShowCreateModal(false);
        setNewProcess({ ...emptyForm });
        setFormErrors({});
        showSuccess(`Approval process "${created.name}" created successfully`);
    };

    const openEdit = (process: ApprovalProcess) => {
        // Reverse-lookup module key
        const moduleKey = Object.entries(moduleLabels).find(([, v]) => v === process.module)?.[0] || process.module.toLowerCase();
        // Parse approver chain
        const parts = process.approvers.split(" \u2192 ").map((s) => s.trim());
        const firstKey = Object.entries(approverLabels).find(([, v]) => v === parts[0])?.[0] || "";
        const secondKey = Object.entries(approverLabels).find(([, v]) => v === parts[1])?.[0] || "";
        setEditProcess({
            ...process,
            module: moduleKey,
            firstApprover: firstKey,
            secondApprover: secondKey,
        });
        setEditFormErrors({});
        setShowEditModal(true);
    };

    const handleEdit = () => {
        const errors: Partial<Record<keyof ProcessForm, string>> = {};
        const sanitizedName = editProcess.name.trim();

        if (!sanitizedName) {
            errors.name = "Process name is required";
        } else if (/\d/.test(sanitizedName)) {
            errors.name = "Process name cannot contain numbers";
        }

        if (!editProcess.module) errors.module = "Module is required";

        if (Object.keys(errors).length > 0) {
            setEditFormErrors(errors);
            showWarning(errors.name || "Please fill in all required fields");
            return;
        }
        const moduleName = moduleLabels[editProcess.module] || editProcess.module;
        const chain = buildApproverChain(editProcess.firstApprover, editProcess.secondApprover);
        setApprovalProcesses((prev) =>
            prev.map((p) =>
                p.id === editProcess.id
                    ? { ...p, name: sanitizedName, module: moduleName, approvers: chain || p.approvers }
                    : p
            )
        );
        setShowEditModal(false);
        showSuccess(`Approval process "${sanitizedName}" updated successfully`);
    };

    const deleteProcess = (id: string) => {
        const target = approvalProcesses.find((p) => p.id === id);
        if (!window.confirm(`Are you sure you want to delete "${target?.name}"? This action cannot be undone.`)) return;
        setApprovalProcesses((prev) => prev.filter((ap) => ap.id !== id));
        showSuccess(`Approval process "${target?.name}" deleted successfully`);
    };

    const toggleStatus = (id: string) => {
        setApprovalProcesses((prev) =>
            prev.map((ap) =>
                ap.id === id ? { ...ap, status: ap.status === "Active" ? "Paused" : "Active" } : ap
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

    const openManageApprovers = (process: ApprovalProcess) => {
        setManageTarget(process);
        setShowManageModal(true);
    };

    const moveApprover = (direction: "up" | "down") => {
        if (!manageTarget) return;
        const parts = manageTarget.approvers.split(" \u2192 ").map((s) => s.trim());
        if (parts.length < 2) return;
        const reversed = [...parts].reverse();
        const newChain = reversed.join(" \u2192 ");
        const updated = { ...manageTarget, approvers: newChain };
        setManageTarget(updated);
        setApprovalProcesses((prev) =>
            prev.map((p) => (p.id === updated.id ? { ...p, approvers: newChain } : p))
        );
    };

    // Reset create form when modal closes
    const handleCreateModalChange = (open: boolean) => {
        setShowCreateModal(open);
        if (!open) {
            setNewProcess({ ...emptyForm });
            setFormErrors({});
        }
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Approval Processes</h1>
                    <p className="text-sm text-gray-600">Configure multi-level approval workflows for critical business operations.</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-none bg-primary hover:bg-primary/90 font-black text-sm h-11 gap-2 shadow-xl shadow-primary/20 px-6"
                >
                    <Plus size={16} /> Create Process
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-xs opacity-80">Total Processes</p>
                    <p className="text-white text-xl font-semibold mt-1">{approvalProcesses.length}</p>
                    <p className="text-white text-[10px] mt-1 opacity-80">Across all modules</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Pending Approvals</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{approvalProcesses.reduce((sum, ap) => sum + ap.pending, 0)}</p>
                    <p className="text-amber-600 text-[10px] mt-1">Awaiting action</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Active Processes</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{approvalProcesses.filter((ap) => ap.status === "Active").length}</p>
                    <p className="text-green-600 text-[10px] mt-1">Currently running</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Avg. Approval Time</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">8.4 hrs</p>
                    <p className="text-primary text-[10px] mt-1">Across all processes</p>
                </div>
            </div>

            {/* Processes List */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search approval processes..."
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
                                <Badge className={`ml-1 rounded-none text-[10px] font-bold px-1.5 py-0 border-none ${statusFilter === "Active" ? "bg-green-600 text-white" : "bg-zinc-400 text-white"}`}>
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
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Process Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Module</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Approval Chain</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Avg. Time</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Pending</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredProcesses.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 bg-zinc-100 rounded-full">
                                                <Search size={24} className="text-zinc-400" />
                                            </div>
                                            <p className="text-sm font-bold text-gray-500">No approval processes found</p>
                                            <p className="text-xs text-gray-400">
                                                {searchQuery || statusFilter !== "All"
                                                    ? "Try adjusting your search or filter criteria"
                                                    : "Create your first approval process to get started"}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProcesses.map((process) => (
                                    <tr key={process.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-green-50 text-green-600 rounded-none border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-all">
                                                    <CheckCircle size={18} />
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{process.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className="bg-primary/10 text-primary border-primary/20 rounded-none text-[10px] font-bold px-2 py-0.5">
                                                {process.module}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <GitBranch size={14} className="text-gray-400" />
                                                <span className="text-sm text-gray-700">{process.approvers}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                <Clock size={12} /> {process.avgTime}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-bold ${process.pending > 0 ? "text-amber-600" : "text-gray-400"}`}>
                                                {process.pending}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={process.status === "Active"}
                                                    onCheckedChange={() => toggleStatus(process.id)}
                                                    className="data-[state=checked]:bg-green-600"
                                                />
                                                <Badge className={`${process.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                                    {process.status}
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
                                                        onClick={() => openEdit(process)}
                                                        className="text-sm p-2 flex items-center gap-2 focus:bg-primary focus:text-white cursor-pointer"
                                                    >
                                                        <Edit size={14} /> Edit Process
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => openManageApprovers(process)}
                                                        className="text-sm p-2 flex items-center gap-2 focus:bg-primary focus:text-white cursor-pointer"
                                                    >
                                                        <Users size={14} /> Manage Approvers
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-2" />
                                                    <DropdownMenuItem
                                                        onClick={() => deleteProcess(process.id)}
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
                    <p className="text-sm text-gray-600">
                        Showing {filteredProcesses.length} of {approvalProcesses.length} approval processes
                    </p>
                    <Button variant="link" className="text-primary text-sm flex items-center gap-1 group" onClick={() => showSuccess("Approval history exported")}>
                        View Approval History <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={handleCreateModalChange}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-primary/80 to-primary px-5 py-4 text-white relative">
                        <h2 className="text-base font-bold flex items-center gap-2">
                            <Plus size={16} /> Create Approval Process
                        </h2>
                        <p className="text-xs opacity-80 mt-1">Define multi-level approval chains for your business operations.</p>
                    </div>
                    <div className="p-5 space-y-4 bg-white">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Process Name <span className="text-red-500">*</span></Label>
                            <Input
                                placeholder="e.g., Leave Approval"
                                value={newProcess.name}
                                onChange={(e) => {
                                    setNewProcess({ ...newProcess, name: e.target.value });
                                    if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                                }}
                                className={`rounded-none border-zinc-200 h-9 text-sm ${formErrors.name ? "border-red-400" : ""}`}
                            />
                            {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Module <span className="text-red-500">*</span></Label>
                            <Select
                                value={newProcess.module}
                                onValueChange={(val) => {
                                    setNewProcess({ ...newProcess, module: val });
                                    if (formErrors.module) setFormErrors({ ...formErrors, module: undefined });
                                }}
                            >
                                <SelectTrigger className={`rounded-none border-zinc-200 h-9 ${formErrors.module ? "border-red-400" : ""}`}>
                                    <SelectValue placeholder="Select module" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="hrm">HRM</SelectItem>
                                    <SelectItem value="finance">Finance</SelectItem>
                                    <SelectItem value="sales">Sales</SelectItem>
                                    <SelectItem value="procurement">Procurement</SelectItem>
                                </SelectContent>
                            </Select>
                            {formErrors.module && <p className="text-xs text-red-500">{formErrors.module}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">First Approver</Label>
                            <Select
                                value={newProcess.firstApprover}
                                onValueChange={(val) => setNewProcess({ ...newProcess, firstApprover: val })}
                            >
                                <SelectTrigger className="rounded-none border-zinc-200 h-9">
                                    <SelectValue placeholder="Select approver role" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="manager">Direct Manager</SelectItem>
                                    <SelectItem value="dept-head">Department Head</SelectItem>
                                    <SelectItem value="hr-head">HR Head</SelectItem>
                                    <SelectItem value="cfo">CFO</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Second Approver</Label>
                            <Select
                                value={newProcess.secondApprover}
                                onValueChange={(val) => setNewProcess({ ...newProcess, secondApprover: val })}
                            >
                                <SelectTrigger className="rounded-none border-zinc-200 h-9">
                                    <SelectValue placeholder="Select second approver role" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="manager">Direct Manager</SelectItem>
                                    <SelectItem value="dept-head">Department Head</SelectItem>
                                    <SelectItem value="hr-head">HR Head</SelectItem>
                                    <SelectItem value="cfo">CFO</SelectItem>
                                    <SelectItem value="sales-lead">Sales Lead</SelectItem>
                                    <SelectItem value="director">Director</SelectItem>
                                    <SelectItem value="finance">Finance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 gap-3 sm:justify-end">
                        <Button variant="ghost" onClick={() => handleCreateModalChange(false)} className="rounded-none text-sm text-gray-600 h-9">
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90 rounded-none text-sm px-6 h-9 shadow-md shadow-primary/20">
                            Create Process
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-primary/80 to-primary px-5 py-4 text-white relative">
                        <h2 className="text-base font-bold flex items-center gap-2">
                            <Edit size={16} /> Edit Approval Process
                        </h2>
                        <p className="text-xs opacity-80 mt-1">Update the approval process configuration.</p>
                    </div>
                    <div className="p-5 space-y-4 bg-white">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Process Name <span className="text-red-500">*</span></Label>
                            <Input
                                placeholder="e.g., Leave Approval"
                                value={editProcess.name}
                                onChange={(e) => {
                                    setEditProcess({ ...editProcess, name: e.target.value });
                                    if (editFormErrors.name) setEditFormErrors({ ...editFormErrors, name: undefined });
                                }}
                                className={`rounded-none border-zinc-200 h-9 text-sm ${editFormErrors.name ? "border-red-400" : ""}`}
                            />
                            {editFormErrors.name && <p className="text-xs text-red-500">{editFormErrors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Module <span className="text-red-500">*</span></Label>
                            <Select
                                value={editProcess.module}
                                onValueChange={(val) => {
                                    setEditProcess({ ...editProcess, module: val });
                                    if (editFormErrors.module) setEditFormErrors({ ...editFormErrors, module: undefined });
                                }}
                            >
                                <SelectTrigger className={`rounded-none border-zinc-200 h-9 ${editFormErrors.module ? "border-red-400" : ""}`}>
                                    <SelectValue placeholder="Select module" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="hrm">HRM</SelectItem>
                                    <SelectItem value="finance">Finance</SelectItem>
                                    <SelectItem value="sales">Sales</SelectItem>
                                    <SelectItem value="procurement">Procurement</SelectItem>
                                </SelectContent>
                            </Select>
                            {editFormErrors.module && <p className="text-xs text-red-500">{editFormErrors.module}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">First Approver</Label>
                            <Select
                                value={editProcess.firstApprover}
                                onValueChange={(val) => setEditProcess({ ...editProcess, firstApprover: val })}
                            >
                                <SelectTrigger className="rounded-none border-zinc-200 h-9">
                                    <SelectValue placeholder="Select approver role" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="manager">Direct Manager</SelectItem>
                                    <SelectItem value="dept-head">Department Head</SelectItem>
                                    <SelectItem value="hr-head">HR Head</SelectItem>
                                    <SelectItem value="cfo">CFO</SelectItem>
                                    <SelectItem value="sales-lead">Sales Lead</SelectItem>
                                    <SelectItem value="director">Director</SelectItem>
                                    <SelectItem value="finance">Finance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Second Approver</Label>
                            <Select
                                value={editProcess.secondApprover}
                                onValueChange={(val) => setEditProcess({ ...editProcess, secondApprover: val })}
                            >
                                <SelectTrigger className="rounded-none border-zinc-200 h-9">
                                    <SelectValue placeholder="Select second approver role" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="manager">Direct Manager</SelectItem>
                                    <SelectItem value="dept-head">Department Head</SelectItem>
                                    <SelectItem value="hr-head">HR Head</SelectItem>
                                    <SelectItem value="cfo">CFO</SelectItem>
                                    <SelectItem value="sales-lead">Sales Lead</SelectItem>
                                    <SelectItem value="director">Director</SelectItem>
                                    <SelectItem value="finance">Finance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 gap-3 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowEditModal(false)} className="rounded-none text-sm text-gray-600 h-9">
                            Cancel
                        </Button>
                        <Button onClick={handleEdit} className="bg-primary hover:bg-primary/90 rounded-none text-sm px-6 h-9 shadow-md shadow-primary/20">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Manage Approvers Modal */}
            <Dialog open={showManageModal} onOpenChange={setShowManageModal}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-primary/80 to-primary px-5 py-4 text-white relative">
                        <h2 className="text-base font-bold flex items-center gap-2">
                            <Users size={16} /> Manage Approvers
                        </h2>
                        <p className="text-xs opacity-80 mt-1">
                            {manageTarget ? manageTarget.name : "Approval chain configuration"}
                        </p>
                    </div>
                    <div className="p-5 space-y-4 bg-white">
                        {manageTarget && (
                            <>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-600">Process</Label>
                                    <p className="text-sm font-bold text-gray-900">{manageTarget.name}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-600">Module</Label>
                                    <Badge className="bg-primary/10 text-primary border-primary/20 rounded-none text-[10px] font-bold px-2 py-0.5">
                                        {manageTarget.module}
                                    </Badge>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-gray-600">Approval Chain</Label>
                                    <div className="space-y-1.5">
                                        {manageTarget.approvers.split(" \u2192 ").map((approver, idx, arr) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="flex-1 flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-none">
                                                    <div className="w-6 h-6 bg-primary text-white flex items-center justify-center text-xs font-bold rounded-none">
                                                        {idx + 1}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{approver.trim()}</p>
                                                        <p className="text-xs text-gray-500">Level {idx + 1} Approver</p>
                                                    </div>
                                                </div>
                                                {arr.length > 1 && (
                                                    <div className="flex flex-col gap-1">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            disabled={idx === 0}
                                                            onClick={() => moveApprover("up")}
                                                            className="h-7 w-7 rounded-none border-zinc-200"
                                                        >
                                                            <ArrowUp size={12} />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            disabled={idx === arr.length - 1}
                                                            onClick={() => moveApprover("down")}
                                                            className="h-7 w-7 rounded-none border-zinc-200"
                                                        >
                                                            <ArrowDown size={12} />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <DialogFooter className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 gap-3 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowManageModal(false)} className="rounded-none text-sm text-gray-600 h-9">
                            Close
                        </Button>
                        <Button
                            onClick={() => {
                                setShowManageModal(false);
                                showSuccess("Approver chain updated successfully");
                            }}
                            className="bg-primary hover:bg-primary/90 rounded-none text-sm px-6 h-9 shadow-md shadow-primary/20"
                        >
                            Save Order
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
