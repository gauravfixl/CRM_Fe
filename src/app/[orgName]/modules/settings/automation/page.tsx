"use client";

import React, { useState } from "react";
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

export default function WorkflowAutomationPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [workflows, setWorkflows] = useState([
        { id: "1", name: "Auto-Assign New Leads", trigger: "Lead Created", status: "Active", executions: "1,204", lastRun: "2 mins ago" },
        { id: "2", name: "Send Welcome Email", trigger: "User Registered", status: "Active", executions: "856", lastRun: "5 mins ago" },
        { id: "3", name: "Escalate Overdue Tasks", trigger: "Task Deadline Passed", status: "Paused", executions: "342", lastRun: "1 hour ago" },
        { id: "4", name: "Notify Manager on Leave", trigger: "Leave Submitted", status: "Active", executions: "2,103", lastRun: "10 mins ago" },
    ]);

    const toggleWorkflowStatus = (id: string) => {
        setWorkflows(prev => prev.map(wf =>
            wf.id === id ? { ...wf, status: wf.status === "Active" ? "Paused" : "Active" } : wf
        ));
    };

    const deleteWorkflow = (id: string) => {
        setWorkflows(prev => prev.filter(wf => wf.id !== id));
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
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6"
                >
                    <Plus size={16} /> Create Workflow
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Total Workflows</p>
                    <h2 className="text-white text-2xl font-bold">{workflows.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Across all modules</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Active Workflows</p>
                    <h3 className="text-2xl font-bold text-gray-900">{workflows.filter(w => w.status === "Active").length}</h3>
                    <p className="text-green-600 text-xs mt-1">Running smoothly</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Total Executions</p>
                    <h3 className="text-2xl font-bold text-gray-900">4,505</h3>
                    <p className="text-blue-600 text-xs mt-1">Last 30 days</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Success Rate</p>
                    <h3 className="text-2xl font-bold text-gray-900">98.7%</h3>
                    <p className="text-green-600 text-xs mt-1">Excellent performance</p>
                </div>
            </div>

            {/* Workflows List */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search workflows..."
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
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Workflow Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Trigger Event</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Executions</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Last Run</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {workflows.map((workflow) => (
                                <tr key={workflow.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-none border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
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
                                                <DropdownMenuItem className="text-sm p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer">
                                                    <Edit size={14} /> Edit Workflow
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-sm p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer">
                                                    <Copy size={14} /> Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-sm p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer">
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
                        </tbody>
                    </table>
                </div>

                <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing {workflows.length} workflows</p>
                    <Button variant="link" className="text-blue-600 text-sm flex items-center gap-1 group">
                        View Execution History <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Create Workflow Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Workflow size={80} />
                        </div>
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Plus size={24} /> Create New Workflow
                        </h2>
                        <p className="text-sm opacity-80 mt-2">Automate repetitive tasks and streamline your business processes.</p>
                    </div>
                    <div className="p-8 space-y-6 bg-white">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Workflow Name</Label>
                            <Input placeholder="e.g., Auto-assign leads to sales team" className="rounded-none border-zinc-200 h-12 text-sm" />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Trigger Event</Label>
                            <Select>
                                <SelectTrigger className="rounded-none border-zinc-200 h-12">
                                    <SelectValue placeholder="Select trigger event" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="lead-created">Lead Created</SelectItem>
                                    <SelectItem value="user-registered">User Registered</SelectItem>
                                    <SelectItem value="task-overdue">Task Overdue</SelectItem>
                                    <SelectItem value="leave-submitted">Leave Submitted</SelectItem>
                                    <SelectItem value="deal-won">Deal Won</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Description (Optional)</Label>
                            <Input placeholder="Brief description of what this workflow does" className="rounded-none border-zinc-200 h-12 text-sm" />
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-none text-sm text-gray-600">
                            Cancel
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 rounded-none text-sm px-10 h-12 shadow-xl shadow-blue-100">
                            Create & Configure
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
