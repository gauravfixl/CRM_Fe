"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Settings,
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    ChevronRight,
    Cpu,
    CheckCircle2,
    RefreshCw,
    Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { SmallCard, SmallCardContent } from "@/shared/components/custom/SmallCard";
import { Dialog, DialogContent, DialogFooter } from "@/shared/components/ui/dialog";
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
import { toast } from "sonner";

export default function ExecutionRulesPage() {
    const router = useRouter();
    const params = useParams();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [newRule, setNewRule] = useState({ name: "", priority: "", scope: "", retryAttempts: "", timeout: "" });
    const [editRule, setEditRule] = useState<any>(null);

    const [rules, setRules] = useState([
        { id: "1", name: "Sequential Execution", priority: "High", scope: "All Workflows", retryAttempts: 3, timeout: "30s", status: "Active" },
        { id: "2", name: "Parallel Processing", priority: "Medium", scope: "Bulk Operations", retryAttempts: 2, timeout: "60s", status: "Active" },
        { id: "3", name: "Rate Limiting", priority: "High", scope: "API Calls", retryAttempts: 5, timeout: "15s", status: "Active" },
        { id: "4", name: "Queue Management", priority: "Low", scope: "Background Jobs", retryAttempts: 3, timeout: "120s", status: "Paused" },
        { id: "5", name: "Priority Routing", priority: "High", scope: "Critical Flows", retryAttempts: 1, timeout: "10s", status: "Active" },
    ]);

    const toggleStatus = (id: string) => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, status: r.status === "Active" ? "Paused" : "Active" } : r));
        toast.success("Rule status updated");
    };

    const deleteRule = (id: string) => {
        setRules(prev => prev.filter(r => r.id !== id));
        toast.success("Rule deleted successfully");
    };

    const handleCreate = () => {
        if (!newRule.name || !newRule.priority || !newRule.scope) {
            toast.error("Please fill all required fields");
            return;
        }
        const r = {
            id: Date.now().toString(),
            name: newRule.name,
            priority: newRule.priority,
            scope: newRule.scope,
            retryAttempts: parseInt(newRule.retryAttempts) || 3,
            timeout: newRule.timeout || "30s",
            status: "Active",
        };
        setRules(prev => [...prev, r]);
        setNewRule({ name: "", priority: "", scope: "", retryAttempts: "", timeout: "" });
        setShowCreateModal(false);
        toast.success("Rule created successfully");
    };

    const openEdit = (rule: any) => {
        setEditRule({ ...rule, retryStr: rule.retryAttempts.toString() });
        setShowEditModal(true);
    };

    const handleEdit = () => {
        if (!editRule) return;
        const updated = { ...editRule, retryAttempts: parseInt(editRule.retryStr) };
        delete updated.retryStr;
        setRules(prev => prev.map(r => r.id === updated.id ? updated : r));
        setShowEditModal(false);
        setEditRule(null);
        toast.success("Rule updated successfully");
    };

    const filteredRules = rules.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.scope.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const avgRetry = (rules.reduce((sum, r) => sum + r.retryAttempts, 0) / rules.length).toFixed(1);

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-outfit p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary/70 to-primary flex items-center justify-center text-white shadow-lg">
                        <Settings className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">Execution Rules</h1>
                        <p className="text-xs text-zinc-500 mt-1 font-medium">Configure how automations execute and handle concurrency.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-10 rounded-xl text-[11px] font-semibold border-zinc-200 dark:border-zinc-800" onClick={() => router.push(`/${params.orgName}/modules/settings/entitlements/automations/audit`)}>
                        <RefreshCw className="w-4 h-4 mr-1.5" /> Execution Log
                    </Button>
                    <Button onClick={() => setShowCreateModal(true)} className="h-10 rounded-xl text-[11px] font-semibold bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-1.5" /> Create Rule
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard className="bg-gradient-to-r from-primary/70 to-primary border-none rounded-none shadow-lg text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-white opacity-80">Total Rules</p>
                            <p className="text-xl font-semibold text-white mt-1">{rules.length}</p>
                            <p className="text-[10px] text-white/80 mt-1">Configured</p>
                        </div>
                        <Settings className="w-6 h-6 text-white/80" />
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white dark:bg-zinc-900 border-0 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div className="text-left">
                            <span className="text-[10px] font-medium text-zinc-400 block mb-1">Active Rules</span>
                            <span className="text-xl font-semibold text-zinc-900 dark:text-white block">{rules.filter(r => r.status === "Active").length}</span>
                            <span className="text-[10px] text-emerald-600 font-medium mt-1 block">Currently enforced</span>
                        </div>
                        <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white dark:bg-zinc-900 border-0 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div className="text-left">
                            <span className="text-[10px] font-medium text-zinc-400 block mb-1">Avg. Retry</span>
                            <span className="text-xl font-semibold text-zinc-900 dark:text-white block">{avgRetry}</span>
                            <span className="text-[10px] text-zinc-500 font-medium mt-1 block">Attempts</span>
                        </div>
                        <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl flex items-center justify-center">
                            <RefreshCw className="w-5 h-5" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white dark:bg-zinc-900 border-0 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div className="text-left">
                            <span className="text-[10px] font-medium text-zinc-400 block mb-1">Success Rate</span>
                            <span className="text-xl font-semibold text-emerald-600 block">98.2%</span>
                            <span className="text-[10px] text-emerald-600 font-medium mt-1 block">Excellent</span>
                        </div>
                        <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-2xl flex items-center justify-center">
                            <Cpu className="w-5 h-5" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Rules Table */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search rules..."
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            className="pl-10 rounded-xl border-zinc-200 dark:border-zinc-700 h-10 text-sm bg-white dark:bg-zinc-800"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                                <th className="px-5 py-3 text-[11px] font-medium text-zinc-500">Rule Name</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Priority</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Scope</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Retry</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Timeout</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Status</th>
                                <th className="py-3 pr-5 text-[11px] font-medium text-zinc-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRules.map((rule) => (
                                <tr key={rule.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0 group">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl border border-blue-100 dark:border-blue-800 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <Settings size={16} />
                                            </div>
                                            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{rule.name}</p>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <Badge className={`rounded-full text-[9px] font-medium px-2 py-0.5 border-0 ${rule.priority === "High" ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600" :
                                            rule.priority === "Medium" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600" :
                                                "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                                            }`}>
                                            {rule.priority}
                                        </Badge>
                                    </td>
                                    <td className="py-3"><span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">{rule.scope}</span></td>
                                    <td className="py-3"><span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">{rule.retryAttempts}x</span></td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-1">
                                            <Timer size={12} className="text-zinc-400" />
                                            <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">{rule.timeout}</span>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={rule.status === "Active"} onCheckedChange={() => toggleStatus(rule.id)} className="data-[state=checked]:bg-emerald-600" />
                                            <Badge className={`rounded-full text-[9px] font-medium px-2 py-0.5 border-0 ${rule.status === "Active" ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>{rule.status}</Badge>
                                        </div>
                                    </td>
                                    <td className="py-3 pr-5 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"><MoreVertical size={16} /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border-zinc-200 dark:border-zinc-700 shadow-xl p-2 min-w-[180px]">
                                                <DropdownMenuLabel className="text-[10px] font-medium text-zinc-400">Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => openEdit(rule)} className="text-xs p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer rounded-lg">
                                                    <Edit size={14} /> Edit Rule
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-1" />
                                                <DropdownMenuItem onClick={() => deleteRule(rule.id)} className="text-xs p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer rounded-lg">
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

                <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <p className="text-[11px] text-zinc-500 font-medium">Showing {filteredRules.length} of {rules.length} rules</p>
                    <Button variant="link" className="p-0 h-auto text-[10px] font-semibold text-blue-600 hover:no-underline">
                        View Execution Log <ChevronRight size={12} className="ml-1" />
                    </Button>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Settings size={80} /></div>
                        <h2 className="text-xl font-semibold flex items-center gap-3"><Plus size={22} /> Create Execution Rule</h2>
                        <p className="text-xs opacity-80 mt-2">Define how automations should execute.</p>
                    </div>
                    <div className="p-8 space-y-5 bg-white dark:bg-zinc-900">
                        <div className="space-y-2">
                            <Label className="text-[11px] font-semibold text-zinc-500">Rule Name</Label>
                            <Input placeholder="e.g., Sequential Execution" value={newRule.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRule(p => ({ ...p, name: e.target.value }))} className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-zinc-500">Priority</Label>
                                <Select value={newRule.priority} onValueChange={(v) => setNewRule(p => ({ ...p, priority: v }))}>
                                    <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11"><SelectValue placeholder="Select priority" /></SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-zinc-500">Scope</Label>
                                <Select value={newRule.scope} onValueChange={(v) => setNewRule(p => ({ ...p, scope: v }))}>
                                    <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11"><SelectValue placeholder="Select scope" /></SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="All Workflows">All Workflows</SelectItem>
                                        <SelectItem value="Bulk Operations">Bulk Operations</SelectItem>
                                        <SelectItem value="API Calls">API Calls</SelectItem>
                                        <SelectItem value="Background Jobs">Background Jobs</SelectItem>
                                        <SelectItem value="Critical Flows">Critical Flows</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-zinc-500">Retry Attempts</Label>
                                <Input type="number" placeholder="e.g., 3" value={newRule.retryAttempts} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRule(p => ({ ...p, retryAttempts: e.target.value }))} className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11 text-sm" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-zinc-500">Timeout</Label>
                                <Input placeholder="e.g., 30s" value={newRule.timeout} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRule(p => ({ ...p, timeout: e.target.value }))} className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11 text-sm" />
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-xl text-xs text-zinc-500">Cancel</Button>
                        <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 rounded-xl text-xs px-8 h-10">Create Rule</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative">
                        <h2 className="text-xl font-semibold flex items-center gap-3"><Edit size={22} /> Edit Rule</h2>
                        <p className="text-xs opacity-80 mt-2">Update rule configuration.</p>
                    </div>
                    {editRule && (
                        <>
                            <div className="p-8 space-y-5 bg-white dark:bg-zinc-900">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-zinc-500">Rule Name</Label>
                                    <Input value={editRule.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditRule((p: any) => ({ ...p, name: e.target.value }))} className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11 text-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-semibold text-zinc-500">Priority</Label>
                                        <Select value={editRule.priority} onValueChange={(v) => setEditRule((p: any) => ({ ...p, priority: v }))}>
                                            <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="High">High</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="Low">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-semibold text-zinc-500">Scope</Label>
                                        <Select value={editRule.scope} onValueChange={(v) => setEditRule((p: any) => ({ ...p, scope: v }))}>
                                            <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="All Workflows">All Workflows</SelectItem>
                                                <SelectItem value="Bulk Operations">Bulk Operations</SelectItem>
                                                <SelectItem value="API Calls">API Calls</SelectItem>
                                                <SelectItem value="Background Jobs">Background Jobs</SelectItem>
                                                <SelectItem value="Critical Flows">Critical Flows</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-semibold text-zinc-500">Retry Attempts</Label>
                                        <Input type="number" value={editRule.retryStr} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditRule((p: any) => ({ ...p, retryStr: e.target.value }))} className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11 text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-semibold text-zinc-500">Timeout</Label>
                                        <Input value={editRule.timeout} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditRule((p: any) => ({ ...p, timeout: e.target.value }))} className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11 text-sm" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
                                <Button variant="ghost" onClick={() => setShowEditModal(false)} className="rounded-xl text-xs text-zinc-500">Cancel</Button>
                                <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 rounded-xl text-xs px-8 h-10">Save Changes</Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
