"use client";

import React, { useState } from "react";
import {
    Shield,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    AlertTriangle,
    ChevronRight,
    ShieldCheck,
    ShieldAlert,
    Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
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

export default function AllowedActionsPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");

    const [newAction, setNewAction] = useState({ name: "", category: "", risk: "", modules: "" });
    const [editAction, setEditAction] = useState<any>(null);

    const [actions, setActions] = useState([
        { id: "1", name: "Send Email", category: "Communication", risk: "Low", modules: ["Leads", "Contacts"], status: "Allowed" },
        { id: "2", name: "Update Field Values", category: "Data Modification", risk: "Medium", modules: ["All"], status: "Allowed" },
        { id: "3", name: "Delete Records", category: "Data Modification", risk: "High", modules: ["Leads"], status: "Restricted" },
        { id: "4", name: "Create Tasks", category: "Task Management", risk: "Low", modules: ["All"], status: "Allowed" },
        { id: "5", name: "Bulk Import", category: "Data Modification", risk: "High", modules: ["Contacts", "Leads"], status: "Restricted" },
        { id: "6", name: "Send SMS", category: "Communication", risk: "Medium", modules: ["Leads"], status: "Allowed" },
    ]);

    const toggleStatus = (id: string) => {
        setActions(prev => prev.map(a =>
            a.id === id ? { ...a, status: a.status === "Allowed" ? "Restricted" : "Allowed" } : a
        ));
        toast.success("Action status updated");
    };

    const deleteAction = (id: string) => {
        setActions(prev => prev.filter(a => a.id !== id));
        toast.success("Action deleted successfully");
    };

    const handleCreate = () => {
        if (!newAction.name || !newAction.category || !newAction.risk) {
            toast.error("Please fill all required fields");
            return;
        }
        const a = {
            id: Date.now().toString(),
            name: newAction.name,
            category: newAction.category,
            risk: newAction.risk,
            modules: newAction.modules ? newAction.modules.split(",").map(m => m.trim()) : ["All"],
            status: "Allowed",
        };
        setActions(prev => [...prev, a]);
        setNewAction({ name: "", category: "", risk: "", modules: "" });
        setShowCreateModal(false);
        toast.success("Action added successfully");
    };

    const openEdit = (action: any) => {
        setEditAction({ ...action, modulesStr: action.modules.join(", ") });
        setShowEditModal(true);
    };

    const handleEdit = () => {
        if (!editAction) return;
        const updated = { ...editAction, modules: editAction.modulesStr.split(",").map((m: string) => m.trim()) };
        delete updated.modulesStr;
        setActions(prev => prev.map(a => a.id === updated.id ? updated : a));
        setShowEditModal(false);
        setEditAction(null);
        toast.success("Action updated successfully");
    };

    const filteredActions = actions.filter(a => {
        const matchSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchFilter = filterCategory === "all" || a.category === filterCategory;
        return matchSearch && matchFilter;
    });

    const categories = [...new Set(actions.map(a => a.category))];

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-outfit p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-lg">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">Allowed Actions</h1>
                        <p className="text-xs text-zinc-500 mt-1 font-medium">Control which automation actions are permitted in your organization.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-10 rounded-xl text-[11px] font-semibold border-zinc-200 dark:border-zinc-800">
                        <Lock className="w-4 h-4 mr-1.5" /> Security Log
                    </Button>
                    <Button onClick={() => setShowCreateModal(true)} className="h-10 rounded-xl text-[11px] font-semibold bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-1.5" /> Add Action
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard className="bg-gradient-to-r from-primary/70 to-primary border-none rounded-none shadow-lg text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-white opacity-80">Total Actions</p>
                            <p className="text-xl font-semibold text-white mt-1">{actions.length}</p>
                            <p className="text-[10px] text-white/80 mt-1">Configured</p>
                        </div>
                        <Shield className="w-6 h-6 text-white/80" />
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white dark:bg-zinc-900 border-0 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div className="text-left">
                            <span className="text-[10px] font-medium text-zinc-400 block mb-1">Allowed</span>
                            <span className="text-xl font-semibold text-zinc-900 dark:text-white block">{actions.filter(a => a.status === "Allowed").length}</span>
                            <span className="text-[10px] text-emerald-600 font-medium mt-1 block">Available for use</span>
                        </div>
                        <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-2xl flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white dark:bg-zinc-900 border-0 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div className="text-left">
                            <span className="text-[10px] font-medium text-zinc-400 block mb-1">Restricted</span>
                            <span className="text-xl font-semibold text-zinc-900 dark:text-white block">{actions.filter(a => a.status === "Restricted").length}</span>
                            <span className="text-[10px] text-rose-600 font-medium mt-1 block">Blocked</span>
                        </div>
                        <div className="h-10 w-10 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl flex items-center justify-center">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white dark:bg-zinc-900 border-0 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div className="text-left">
                            <span className="text-[10px] font-medium text-zinc-400 block mb-1">High Risk</span>
                            <span className="text-xl font-semibold text-zinc-900 dark:text-white block">{actions.filter(a => a.risk === "High").length}</span>
                            <span className="text-[10px] text-amber-600 font-medium mt-1 block">Needs review</span>
                        </div>
                        <div className="h-10 w-10 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-2xl flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Actions Table */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/20 dark:bg-zinc-900/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search actions..."
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            className="pl-10 rounded-xl border-zinc-200 dark:border-zinc-700 h-10 text-sm bg-white dark:bg-zinc-800"
                        />
                    </div>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-10 text-sm bg-white dark:bg-zinc-800 w-[180px]">
                            <Filter size={14} className="mr-2 text-zinc-400" />
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                                <th className="px-5 py-3 text-[11px] font-medium text-zinc-500">Action Name</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Category</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Risk Level</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Modules</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Status</th>
                                <th className="py-3 pr-5 text-[11px] font-medium text-zinc-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredActions.map((action) => (
                                <tr key={action.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0 group">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl border border-emerald-100 dark:border-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                                <Shield size={16} />
                                            </div>
                                            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{action.name}</p>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <Badge className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-0 rounded-full text-[9px] font-medium px-2 py-0.5">
                                            {action.category}
                                        </Badge>
                                    </td>
                                    <td className="py-3">
                                        <Badge className={`rounded-full text-[9px] font-medium px-2 py-0.5 border-0 flex items-center gap-1 w-fit ${action.risk === "High" ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600" :
                                            action.risk === "Medium" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600" :
                                                "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
                                            }`}>
                                            {action.risk === "High" && <AlertTriangle size={10} />} {action.risk}
                                        </Badge>
                                    </td>
                                    <td className="py-3">
                                        <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">{action.modules.join(", ")}</span>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={action.status === "Allowed"}
                                                onCheckedChange={() => toggleStatus(action.id)}
                                                className="data-[state=checked]:bg-emerald-600"
                                            />
                                            <Badge className={`rounded-full text-[9px] font-medium px-2 py-0.5 border-0 ${action.status === "Allowed" ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-rose-50 dark:bg-rose-900/20 text-rose-600"}`}>
                                                {action.status}
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
                                                <DropdownMenuItem onClick={() => openEdit(action)} className="text-xs p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer rounded-lg">
                                                    <Edit size={14} /> Edit Action
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-1" />
                                                <DropdownMenuItem onClick={() => deleteAction(action.id)} className="text-xs p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer rounded-lg">
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
                    <p className="text-[11px] text-zinc-500 font-medium">Showing {filteredActions.length} of {actions.length} actions</p>
                    <Button variant="link" className="p-0 h-auto text-[10px] font-semibold text-blue-600 hover:no-underline">
                        View Security Log <ChevronRight size={12} className="ml-1" />
                    </Button>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Shield size={80} /></div>
                        <h2 className="text-xl font-semibold flex items-center gap-3"><Plus size={22} /> Add Allowed Action</h2>
                        <p className="text-xs opacity-80 mt-2">Define which automation actions are permitted.</p>
                    </div>
                    <div className="p-8 space-y-5 bg-white dark:bg-zinc-900">
                        <div className="space-y-2">
                            <Label className="text-[11px] font-semibold text-zinc-500">Action Name</Label>
                            <Input placeholder="e.g., Send Email" value={newAction.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAction(p => ({ ...p, name: e.target.value }))} className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-zinc-500">Category</Label>
                                <Select value={newAction.category} onValueChange={(v) => setNewAction(p => ({ ...p, category: v }))}>
                                    <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11"><SelectValue placeholder="Select category" /></SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="Communication">Communication</SelectItem>
                                        <SelectItem value="Data Modification">Data Modification</SelectItem>
                                        <SelectItem value="Task Management">Task Management</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-zinc-500">Risk Level</Label>
                                <Select value={newAction.risk} onValueChange={(v) => setNewAction(p => ({ ...p, risk: v }))}>
                                    <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11"><SelectValue placeholder="Select risk" /></SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[11px] font-semibold text-zinc-500">Modules (comma separated)</Label>
                            <Input placeholder="e.g., Leads, Contacts" value={newAction.modules} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAction(p => ({ ...p, modules: e.target.value }))} className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11 text-sm" />
                        </div>
                    </div>
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-xl text-xs text-zinc-500">Cancel</Button>
                        <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs px-8 h-10">Add Action</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative">
                        <h2 className="text-xl font-semibold flex items-center gap-3"><Edit size={22} /> Edit Action</h2>
                        <p className="text-xs opacity-80 mt-2">Update action configuration.</p>
                    </div>
                    {editAction && (
                        <>
                            <div className="p-8 space-y-5 bg-white dark:bg-zinc-900">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-zinc-500">Action Name</Label>
                                    <Input value={editAction.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditAction((p: any) => ({ ...p, name: e.target.value }))} className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11 text-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-semibold text-zinc-500">Category</Label>
                                        <Select value={editAction.category} onValueChange={(v) => setEditAction((p: any) => ({ ...p, category: v }))}>
                                            <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="Communication">Communication</SelectItem>
                                                <SelectItem value="Data Modification">Data Modification</SelectItem>
                                                <SelectItem value="Task Management">Task Management</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-semibold text-zinc-500">Risk Level</Label>
                                        <Select value={editAction.risk} onValueChange={(v) => setEditAction((p: any) => ({ ...p, risk: v }))}>
                                            <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="Low">Low</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="High">High</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-zinc-500">Modules (comma separated)</Label>
                                    <Input value={editAction.modulesStr} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditAction((p: any) => ({ ...p, modulesStr: e.target.value }))} className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11 text-sm" />
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
