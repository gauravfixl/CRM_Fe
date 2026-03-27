"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Workflow,
    Plus,
    Play,
    Pause,
    Trash2,
    Edit,
    Copy,
    ChevronRight,
    Zap,
    Clock,
    CheckCircle2,
    AlertCircle,
    Search,
    Filter,
    MoreVertical,
    Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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

const TRIGGER_OPTIONS = [
    { value: "lead-created", label: "Lead Created" },
    { value: "user-registered", label: "User Registered" },
    { value: "task-overdue", label: "Task Overdue" },
    { value: "leave-submitted", label: "Leave Submitted" },
    { value: "deal-won", label: "Deal Won" },
];

function getTriggerLabel(value: string): string {
    return TRIGGER_OPTIONS.find(t => t.value === value)?.label ?? value;
}

export default function WorkflowAutomationPage() {
    const router = useRouter();
    const params = useParams();
    const orgName = params?.orgName as string;

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Paused">("All");

    // Create form state
    const [newWorkflow, setNewWorkflow] = useState({ name: "", trigger: "", description: "" });
    const [formErrors, setFormErrors] = useState<{ name?: string; trigger?: string }>({});

    // Edit form state
    const [editWorkflow, setEditWorkflow] = useState<{
        id: string; name: string; trigger: string; description: string;
    } | null>(null);
    const [editFormErrors, setEditFormErrors] = useState<{ name?: string; trigger?: string }>({});

    const [workflows, setWorkflows] = useState([
        { id: "1", name: "Auto-Assign New Leads", trigger: "Lead Created", status: "Active", executions: "1,204", lastRun: "2 mins ago", description: "" },
        { id: "2", name: "Send Welcome Email", trigger: "User Registered", status: "Active", executions: "856", lastRun: "5 mins ago", description: "" },
        { id: "3", name: "Escalate Overdue Tasks", trigger: "Task Deadline Passed", status: "Paused", executions: "342", lastRun: "1 hour ago", description: "" },
        { id: "4", name: "Notify Manager on Leave", trigger: "Leave Submitted", status: "Active", executions: "2,103", lastRun: "10 mins ago", description: "" },
    ]);

    // Filtered workflows based on search and status filter
    const filteredWorkflows = useMemo(() => {
        return workflows.filter(wf => {
            const matchesSearch =
                searchQuery === "" ||
                wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                wf.trigger.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "All" || wf.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [workflows, searchQuery, statusFilter]);

    const toggleWorkflowStatus = (id: string) => {
        setWorkflows(prev => prev.map(wf =>
            wf.id === id ? { ...wf, status: wf.status === "Active" ? "Paused" : "Active" } : wf
        ));
    };

    const deleteWorkflow = (id: string) => {
        const workflow = workflows.find(wf => wf.id === id);
        if (!workflow) return;
        const confirmed = window.confirm(`Are you sure you want to delete "${workflow.name}"? This action cannot be undone.`);
        if (!confirmed) return;
        setWorkflows(prev => prev.filter(wf => wf.id !== id));
        showSuccess("Workflow deleted successfully");
    };

    // --- Create ---
    const handleCreate = () => {
        const errors: { name?: string; trigger?: string } = {};
        if (!newWorkflow.name.trim()) errors.name = "Workflow name is required";
        if (!newWorkflow.trigger) errors.trigger = "Trigger event is required";
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        const created = {
            id: Date.now().toString(),
            name: newWorkflow.name.trim(),
            trigger: getTriggerLabel(newWorkflow.trigger),
            status: "Active",
            executions: "0",
            lastRun: "Never",
            description: newWorkflow.description.trim(),
        };
        setWorkflows(prev => [...prev, created]);
        showSuccess(`Workflow "${created.name}" created successfully`);
        setNewWorkflow({ name: "", trigger: "", description: "" });
        setFormErrors({});
        setShowCreateModal(false);
    };

    const resetCreateForm = () => {
        setNewWorkflow({ name: "", trigger: "", description: "" });
        setFormErrors({});
    };

    // --- Edit ---
    const openEdit = (workflow: typeof workflows[0]) => {
        setEditWorkflow({
            id: workflow.id,
            name: workflow.name,
            trigger: workflow.trigger,
            description: workflow.description ?? "",
        });
        setEditFormErrors({});
        setShowEditModal(true);
    };

    const handleEdit = () => {
        if (!editWorkflow) return;
        const errors: { name?: string; trigger?: string } = {};
        if (!editWorkflow.name.trim()) errors.name = "Workflow name is required";
        if (!editWorkflow.trigger) errors.trigger = "Trigger event is required";
        setEditFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setWorkflows(prev => prev.map(wf =>
            wf.id === editWorkflow.id
                ? {
                    ...wf,
                    name: editWorkflow.name.trim(),
                    trigger: TRIGGER_OPTIONS.find(t => t.value === editWorkflow.trigger)
                        ? getTriggerLabel(editWorkflow.trigger)
                        : editWorkflow.trigger,
                    description: editWorkflow.description.trim(),
                }
                : wf
        ));
        showSuccess(`Workflow "${editWorkflow.name.trim()}" updated successfully`);
        setEditWorkflow(null);
        setEditFormErrors({});
        setShowEditModal(false);
    };

    // --- Duplicate ---
    const duplicateWorkflow = (workflow: typeof workflows[0]) => {
        const duplicate = {
            ...workflow,
            id: Date.now().toString(),
            name: `${workflow.name} (Copy)`,
            status: "Paused",
            executions: "0",
            lastRun: "Never",
        };
        setWorkflows(prev => [...prev, duplicate]);
        showSuccess(`Workflow duplicated as "${duplicate.name}"`);
    };

    // --- Navigation ---
    const viewExecutionHistory = () => {
        router.push(`/${orgName}/modules/settings/entitlements/automations/audit`);
    };

    // --- Filter toggle ---
    const cycleStatusFilter = () => {
        setStatusFilter(prev => {
            if (prev === "All") return "Active";
            if (prev === "Active") return "Paused";
            return "All";
        });
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Workflow Automation</h1>
                    <p className="text-sm text-gray-600">Design and manage automated business processes across your organization.</p>
                </div>
                <Button
                    onClick={() => { resetCreateForm(); setShowCreateModal(true); }}
                    className="rounded-none bg-primary hover:bg-primary/90 font-black text-sm h-11 gap-2 shadow-xl shadow-primary/20 px-6"
                >
                    <Plus size={16} /> Create Workflow
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-xs opacity-80">Total Workflows</p>
                    <p className="text-white text-xl font-semibold mt-1">{workflows.length}</p>
                    <p className="text-white text-[10px] mt-1 opacity-80">Across all modules</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Active Workflows</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{workflows.filter(w => w.status === "Active").length}</p>
                    <p className="text-green-600 text-[10px] mt-1">Running smoothly</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Total Executions</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">4,505</p>
                    <p className="text-primary text-[10px] mt-1">Last 30 days</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Success Rate</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">98.7%</p>
                    <p className="text-green-600 text-[10px] mt-1">Excellent performance</p>
                </div>
            </div>

            {/* Workflows List */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search workflows..."
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
                            <Filter size={14} /> {statusFilter === "All" ? "Filter" : statusFilter}
                            {statusFilter !== "All" && (
                                <Badge className="bg-primary text-white border-none rounded-none text-[10px] font-bold px-1.5 py-0 ml-1">
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
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Workflow Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Trigger Event</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Executions</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Last Run</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredWorkflows.map((workflow) => (
                                <tr key={workflow.id} className="hover:bg-primary/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 text-primary rounded-none border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
                                                <Workflow size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{workflow.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Zap size={14} className="text-amber-500" />
                                            <span className="text-sm text-gray-700">{workflow.trigger}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={workflow.status === "Active"}
                                                onCheckedChange={() => toggleWorkflowStatus(workflow.id)}
                                                className="data-[state=checked]:bg-green-600"
                                            />
                                            <Badge className={`${workflow.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                                {workflow.status}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-gray-900">{workflow.executions}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Clock size={12} /> {workflow.lastRun}
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
                                                    onClick={() => openEdit(workflow)}
                                                    className="text-sm p-2 flex items-center gap-2 focus:bg-primary focus:text-white cursor-pointer"
                                                >
                                                    <Edit size={14} /> Edit Workflow
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => duplicateWorkflow(workflow)}
                                                    className="text-sm p-2 flex items-center gap-2 focus:bg-primary focus:text-white cursor-pointer"
                                                >
                                                    <Copy size={14} /> Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => openEdit(workflow)}
                                                    className="text-sm p-2 flex items-center gap-2 focus:bg-primary focus:text-white cursor-pointer"
                                                >
                                                    <Settings size={14} /> Configure
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-2" />
                                                <DropdownMenuItem
                                                    onClick={() => deleteWorkflow(workflow.id)}
                                                    className="text-sm p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer"
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                            {filteredWorkflows.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                                        No workflows found matching your search or filter criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing {filteredWorkflows.length} of {workflows.length} workflows</p>
                    <Button
                        variant="link"
                        onClick={viewExecutionHistory}
                        className="text-primary text-sm flex items-center gap-1 group"
                    >
                        View Execution History <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Create Workflow Modal */}
            <Dialog open={showCreateModal} onOpenChange={(open) => { setShowCreateModal(open); if (!open) resetCreateForm(); }}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-primary/80 to-primary px-5 py-4 text-white">
                        <h2 className="text-base font-bold flex items-center gap-2">
                            <Plus size={16} /> Create New Workflow
                        </h2>
                        <p className="text-xs opacity-80 mt-1">Automate repetitive tasks and streamline processes.</p>
                    </div>
                    <div className="p-5 space-y-4 bg-white">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Workflow Name</Label>
                            <Input
                                placeholder="e.g., Auto-assign leads to sales team"
                                value={newWorkflow.name}
                                onChange={(e) => { setNewWorkflow(prev => ({ ...prev, name: e.target.value })); setFormErrors(prev => ({ ...prev, name: undefined })); }}
                                className={`rounded-none border-zinc-200 h-9 text-sm ${formErrors.name ? "border-red-500" : ""}`}
                            />
                            {formErrors.name && <p className="text-xs text-red-600">{formErrors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Trigger Event</Label>
                            <Select
                                value={newWorkflow.trigger}
                                onValueChange={(val) => { setNewWorkflow(prev => ({ ...prev, trigger: val })); setFormErrors(prev => ({ ...prev, trigger: undefined })); }}
                            >
                                <SelectTrigger className={`rounded-none border-zinc-200 h-9 ${formErrors.trigger ? "border-red-500" : ""}`}>
                                    <SelectValue placeholder="Select trigger event" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {TRIGGER_OPTIONS.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formErrors.trigger && <p className="text-xs text-red-600">{formErrors.trigger}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Description (Optional)</Label>
                            <Input
                                placeholder="Brief description of what this workflow does"
                                value={newWorkflow.description}
                                onChange={(e) => setNewWorkflow(prev => ({ ...prev, description: e.target.value }))}
                                className="rounded-none border-zinc-200 h-9 text-sm"
                            />
                        </div>
                    </div>
                    <DialogFooter className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 gap-3 sm:justify-end">
                        <Button variant="ghost" onClick={() => { setShowCreateModal(false); resetCreateForm(); }} className="rounded-none text-sm text-gray-600 h-9">
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90 rounded-none text-sm px-6 h-9 shadow-md shadow-primary/20">
                            Create & Configure
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Workflow Modal */}
            <Dialog open={showEditModal} onOpenChange={(open) => { setShowEditModal(open); if (!open) { setEditWorkflow(null); setEditFormErrors({}); } }}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-primary/80 to-primary px-5 py-4 text-white">
                        <h2 className="text-base font-bold flex items-center gap-2">
                            <Edit size={16} /> Edit Workflow
                        </h2>
                        <p className="text-xs opacity-80 mt-1">Update the workflow configuration and trigger settings.</p>
                    </div>
                    {editWorkflow && (
                        <>
                            <div className="p-5 space-y-4 bg-white">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-gray-600">Workflow Name</Label>
                                    <Input
                                        placeholder="e.g., Auto-assign leads to sales team"
                                        value={editWorkflow.name}
                                        onChange={(e) => { setEditWorkflow(prev => prev ? { ...prev, name: e.target.value } : prev); setEditFormErrors(prev => ({ ...prev, name: undefined })); }}
                                        className={`rounded-none border-zinc-200 h-9 text-sm ${editFormErrors.name ? "border-red-500" : ""}`}
                                    />
                                    {editFormErrors.name && <p className="text-xs text-red-600">{editFormErrors.name}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-gray-600">Trigger Event</Label>
                                    <Select
                                        value={editWorkflow.trigger}
                                        onValueChange={(val) => { setEditWorkflow(prev => prev ? { ...prev, trigger: val } : prev); setEditFormErrors(prev => ({ ...prev, trigger: undefined })); }}
                                    >
                                        <SelectTrigger className={`rounded-none border-zinc-200 h-9 ${editFormErrors.trigger ? "border-red-500" : ""}`}>
                                            <SelectValue placeholder="Select trigger event" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-none">
                                            {TRIGGER_OPTIONS.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {editFormErrors.trigger && <p className="text-xs text-red-600">{editFormErrors.trigger}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-gray-600">Description (Optional)</Label>
                                    <Input
                                        placeholder="Brief description of what this workflow does"
                                        value={editWorkflow.description}
                                        onChange={(e) => setEditWorkflow(prev => prev ? { ...prev, description: e.target.value } : prev)}
                                        className="rounded-none border-zinc-200 h-9 text-sm"
                                    />
                                </div>
                            </div>
                            <DialogFooter className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 gap-3 sm:justify-end">
                                <Button variant="ghost" onClick={() => { setShowEditModal(false); setEditWorkflow(null); setEditFormErrors({}); }} className="rounded-none text-sm text-gray-600 h-9">
                                    Cancel
                                </Button>
                                <Button onClick={handleEdit} className="bg-primary hover:bg-primary/90 rounded-none text-sm px-6 h-9 shadow-md shadow-primary/20">
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
