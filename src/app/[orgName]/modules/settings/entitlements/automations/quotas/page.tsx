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
    AlertTriangle,
    ChevronRight,
    Activity,
    TrendingUp,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { SmallCard, SmallCardContent } from "@/shared/components/custom/SmallCard";
import {
    Dialog,
    DialogContent,
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
import { toast } from "sonner";

export default function LimitsQuotasPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [newQuota, setNewQuota] = useState({ name: "", type: "", limit: "", unit: "" });
    const [editQuota, setEditQuota] = useState<any>(null);

    const [quotas, setQuotas] = useState([
        { id: "1", name: "Daily Email Limit", type: "Communication", limit: 1000, used: 742, unit: "emails/day", status: "Active" },
        { id: "2", name: "API Calls Per Hour", type: "Integration", limit: 5000, used: 3420, unit: "calls/hour", status: "Active" },
        { id: "3", name: "Workflow Executions", type: "Automation", limit: 10000, used: 8950, unit: "runs/month", status: "Active" },
        { id: "4", name: "Data Export Limit", type: "Data", limit: 50, used: 12, unit: "exports/day", status: "Active" },
        { id: "5", name: "Bulk SMS Limit", type: "Communication", limit: 500, used: 340, unit: "sms/day", status: "Active" },
    ]);

    const toggleStatus = (id: string) => {
        setQuotas(prev => prev.map(q =>
            q.id === id ? { ...q, status: q.status === "Active" ? "Paused" : "Active" } : q
        ));
        toast.success("Quota status updated");
    };

    const deleteQuota = (id: string) => {
        setQuotas(prev => prev.filter(q => q.id !== id));
        toast.success("Quota deleted successfully");
    };

    const getUsagePercentage = (used: number, limit: number) => (used / limit) * 100;

    const handleCreate = () => {
        if (!newQuota.name || !newQuota.type || !newQuota.limit) {
            toast.error("Please fill all required fields");
            return;
        }
        const q = {
            id: Date.now().toString(),
            name: newQuota.name,
            type: newQuota.type,
            limit: parseInt(newQuota.limit),
            used: 0,
            unit: newQuota.unit || "units",
            status: "Active",
        };
        setQuotas(prev => [...prev, q]);
        setNewQuota({ name: "", type: "", limit: "", unit: "" });
        setShowCreateModal(false);
        toast.success("Quota created successfully");
    };

    const openEdit = (quota: any) => {
        setEditQuota({ ...quota, limitStr: quota.limit.toString() });
        setShowEditModal(true);
    };

    const handleEdit = () => {
        if (!editQuota) return;
        const updated = { ...editQuota, limit: parseInt(editQuota.limitStr) };
        delete updated.limitStr;
        setQuotas(prev => prev.map(q => q.id === updated.id ? updated : q));
        setShowEditModal(false);
        setEditQuota(null);
        toast.success("Quota updated successfully");
    };

    const filteredQuotas = quotas.filter(q =>
        q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const nearLimitCount = quotas.filter(q => getUsagePercentage(q.used, q.limit) > 80).length;
    const avgUsage = Math.round(quotas.reduce((sum, q) => sum + getUsagePercentage(q.used, q.limit), 0) / quotas.length);

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-outfit p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
                        <Gauge className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">Limits & Quotas</h1>
                        <p className="text-xs text-zinc-500 mt-1 font-medium">Manage resource limits and usage quotas for automation systems.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-10 rounded-xl text-[11px] font-semibold border-zinc-200 dark:border-zinc-800" onClick={() => toast.success("Usage report generated. Check your downloads.")}>
                        <TrendingUp className="w-4 h-4 mr-1.5" /> Usage Report
                    </Button>
                    <Button onClick={() => setShowCreateModal(true)} className="h-10 rounded-xl text-[11px] font-semibold bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-1.5" /> Add Quota
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard className="bg-gradient-to-r from-primary/70 to-primary border-none rounded-none shadow-lg text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-white opacity-80">Total Quotas</p>
                            <p className="text-xl font-semibold text-white mt-1">{quotas.length}</p>
                            <p className="text-[10px] text-white/80 mt-1">Configured limits</p>
                        </div>
                        <Gauge className="w-6 h-6 text-white/80" />
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white dark:bg-zinc-900 border-0 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div className="text-left">
                            <span className="text-[10px] font-medium text-zinc-400 block mb-1">Near Limit</span>
                            <span className="text-xl font-semibold text-zinc-900 dark:text-white block">{nearLimitCount}</span>
                            <span className="text-[10px] text-amber-600 font-medium mt-1 block">Needs attention</span>
                        </div>
                        <div className="h-10 w-10 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-2xl flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white dark:bg-zinc-900 border-0 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div className="text-left">
                            <span className="text-[10px] font-medium text-zinc-400 block mb-1">Avg. Usage</span>
                            <span className="text-xl font-semibold text-zinc-900 dark:text-white block">{avgUsage}%</span>
                            <span className="text-[10px] text-blue-600 font-medium mt-1 block">Across all quotas</span>
                        </div>
                        <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl flex items-center justify-center">
                            <Activity className="w-5 h-5" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white dark:bg-zinc-900 border-0 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div className="text-left">
                            <span className="text-[10px] font-medium text-zinc-400 block mb-1">Exceeded</span>
                            <span className="text-xl font-semibold text-emerald-600 block">0</span>
                            <span className="text-[10px] text-emerald-600 font-medium mt-1 block">All within limits</span>
                        </div>
                        <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Quotas Table */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search quotas..."
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
                                <th className="px-5 py-3 text-[11px] font-medium text-zinc-500">Quota Name</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Type</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Limit</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Usage</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Status</th>
                                <th className="py-3 pr-5 text-[11px] font-medium text-zinc-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredQuotas.map((quota) => {
                                const percentage = getUsagePercentage(quota.used, quota.limit);
                                return (
                                    <tr key={quota.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0 group">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl border border-amber-100 dark:border-amber-800 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                                    <Gauge size={16} />
                                                </div>
                                                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{quota.name}</p>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <Badge className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-0 rounded-full text-[9px] font-medium px-2 py-0.5">
                                                {quota.type}
                                            </Badge>
                                        </td>
                                        <td className="py-3">
                                            <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">{quota.limit.toLocaleString()} {quota.unit}</span>
                                        </td>
                                        <td className="py-3">
                                            <div className="space-y-1.5 min-w-[180px]">
                                                <div className="flex justify-between text-[10px]">
                                                    <span className="text-zinc-500 font-medium">{quota.used.toLocaleString()} used</span>
                                                    <span className={`font-semibold ${percentage > 90 ? 'text-rose-600' : percentage > 80 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                        {percentage.toFixed(0)}%
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={percentage}
                                                    className={`h-1.5 rounded-full ${percentage > 90 ? 'bg-rose-100 dark:bg-rose-900/20' : percentage > 80 ? 'bg-amber-100 dark:bg-amber-900/20' : 'bg-zinc-100 dark:bg-zinc-800'} [&>div]:${percentage > 90 ? 'bg-rose-600' : percentage > 80 ? 'bg-amber-600' : 'bg-emerald-600'} [&>div]:rounded-full`}
                                                />
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={quota.status === "Active"}
                                                    onCheckedChange={() => toggleStatus(quota.id)}
                                                    className="data-[state=checked]:bg-emerald-600"
                                                />
                                                <Badge className={`rounded-full text-[9px] font-medium px-2 py-0.5 border-0 ${quota.status === "Active" ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>
                                                    {quota.status}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="py-3 pr-5 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl border-zinc-200 dark:border-zinc-700 shadow-xl p-2 min-w-[180px]">
                                                    <DropdownMenuLabel className="text-[10px] font-medium text-zinc-400">Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => openEdit(quota)} className="text-xs p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer rounded-lg">
                                                        <Edit size={14} /> Edit Quota
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-1" />
                                                    <DropdownMenuItem onClick={() => deleteQuota(quota.id)} className="text-xs p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer rounded-lg">
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

                <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <p className="text-[11px] text-zinc-500 font-medium">Showing {filteredQuotas.length} of {quotas.length} quotas</p>
                    <Button variant="link" className="p-0 h-auto text-[10px] font-semibold text-blue-600 hover:no-underline">
                        View Usage Report <ChevronRight size={12} className="ml-1" />
                    </Button>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Gauge size={80} /></div>
                        <h2 className="text-xl font-semibold flex items-center gap-3"><Plus size={22} /> Add Quota Limit</h2>
                        <p className="text-xs opacity-80 mt-2">Define resource usage limits for your organization.</p>
                    </div>
                    <div className="p-8 space-y-5 bg-white dark:bg-zinc-900">
                        <div className="space-y-2">
                            <Label className="text-[11px] font-semibold text-zinc-500">Quota Name</Label>
                            <Input placeholder="e.g., Daily Email Limit" value={newQuota.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewQuota(p => ({ ...p, name: e.target.value }))} className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-zinc-500">Type</Label>
                                <Select value={newQuota.type} onValueChange={(v) => setNewQuota(p => ({ ...p, type: v }))}>
                                    <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11"><SelectValue placeholder="Select type" /></SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="Communication">Communication</SelectItem>
                                        <SelectItem value="Integration">Integration</SelectItem>
                                        <SelectItem value="Automation">Automation</SelectItem>
                                        <SelectItem value="Data">Data</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-zinc-500">Limit Value</Label>
                                <Input type="number" placeholder="e.g., 1000" value={newQuota.limit} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewQuota(p => ({ ...p, limit: e.target.value }))} className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11 text-sm" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[11px] font-semibold text-zinc-500">Unit</Label>
                            <Input placeholder="e.g., emails/day" value={newQuota.unit} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewQuota(p => ({ ...p, unit: e.target.value }))} className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11 text-sm" />
                        </div>
                    </div>
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-xl text-xs text-zinc-500">Cancel</Button>
                        <Button onClick={handleCreate} className="bg-amber-600 hover:bg-amber-700 rounded-xl text-xs px-8 h-10">Add Quota</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative">
                        <h2 className="text-xl font-semibold flex items-center gap-3"><Edit size={22} /> Edit Quota</h2>
                        <p className="text-xs opacity-80 mt-2">Update quota configuration.</p>
                    </div>
                    {editQuota && (
                        <>
                            <div className="p-8 space-y-5 bg-white dark:bg-zinc-900">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-zinc-500">Quota Name</Label>
                                    <Input value={editQuota.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditQuota((p: any) => ({ ...p, name: e.target.value }))} className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11 text-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-semibold text-zinc-500">Type</Label>
                                        <Select value={editQuota.type} onValueChange={(v) => setEditQuota((p: any) => ({ ...p, type: v }))}>
                                            <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="Communication">Communication</SelectItem>
                                                <SelectItem value="Integration">Integration</SelectItem>
                                                <SelectItem value="Automation">Automation</SelectItem>
                                                <SelectItem value="Data">Data</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-semibold text-zinc-500">Limit Value</Label>
                                        <Input type="number" value={editQuota.limitStr} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditQuota((p: any) => ({ ...p, limitStr: e.target.value }))} className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11 text-sm" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-zinc-500">Unit</Label>
                                    <Input value={editQuota.unit} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditQuota((p: any) => ({ ...p, unit: e.target.value }))} className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11 text-sm" />
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
