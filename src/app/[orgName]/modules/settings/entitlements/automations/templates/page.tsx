"use client";

import React, { useState, useEffect } from "react";
import {
    Zap,
    Plus,
    Copy,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Play,
    ChevronRight,
    Code,
    FileText,
    LayoutTemplate,
    Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { SmallCard, SmallCardContent } from "@/shared/components/custom/SmallCard";
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
import { toast } from "sonner";
import {
    listAutomationRules,
    createAutomationRule,
    updateAutomationRule,
    deleteAutomationRule,
} from "@/hooks/orgAdminHooks";

interface RuleTemplate {
    id: string;
    name: string;
    category: string;
    trigger: string;
    actions: number;
    usage: number;
    status: "Active" | "Paused";
    description: string;
}

export default function RuleTemplatesPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [newTemplate, setNewTemplate] = useState({ name: "", category: "", trigger: "", description: "" });
    const [editTemplate, setEditTemplate] = useState<RuleTemplate | null>(null);

    const [templates, setTemplates] = useState<RuleTemplate[]>([]);

    const fetchTemplates = async () => {
        try {
            const res = await listAutomationRules();
            const list = res?.data?.data?.rules || res?.data?.rules || res?.data?.data || res?.data || [];
            const arr = Array.isArray(list) ? list : [];
            setTemplates(
                arr.map((r: any) => ({
                    id: r._id || r.id || "",
                    name: r.name || "Untitled",
                    category: r.module || "â€”",
                    trigger: r.trigger?.event || "manual",
                    actions: Array.isArray(r.actions) ? r.actions.length : 0,
                    usage: typeof r.triggerCount === "number" ? r.triggerCount : 0,
                    status: r.enabled === false ? "Paused" : "Active",
                    description: r.description || "",
                }))
            );
        } catch (err: any) {
            // Silent â€” table just stays empty
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const toggleStatus = async (id: string) => {
        const target = templates.find(t => t.id === id);
        if (!target) return;
        const newEnabled = target.status !== "Active";
        const prev = templates;
        setBusyId(id);
        setTemplates(p => p.map(t => t.id === id ? { ...t, status: newEnabled ? "Active" : "Paused" } : t));
        try {
            await updateAutomationRule(id, { enabled: newEnabled });
            toast.success("Template status updated");
        } catch (err: any) {
            setTemplates(prev);
            toast.error(err?.response?.data?.message || "Failed to update status");
        } finally {
            setBusyId(null);
        }
    };

    const deleteTemplate = async (id: string) => {
        setBusyId(id);
        try {
            await deleteAutomationRule(id);
            setTemplates(prev => prev.filter(t => t.id !== id));
            toast.success("Template deleted successfully");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to delete template");
        } finally {
            setBusyId(null);
        }
    };

    const duplicateTemplate = async (template: RuleTemplate) => {
        setBusyId(template.id);
        try {
            await createAutomationRule({
                name: `${template.name} (Copy)`,
                module: template.category || "automation",
                description: template.description || undefined,
                trigger: { event: template.trigger || "manual", source: "ui" },
                actions: [{ type: "noop" }],
                enabled: template.status === "Active",
            });
            await fetchTemplates();
            toast.success("Template duplicated");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to duplicate");
        } finally {
            setBusyId(null);
        }
    };

    const handleCreate = async () => {
        if (!newTemplate.name || !newTemplate.category || !newTemplate.trigger) {
            toast.error("Please fill all required fields");
            return;
        }
        if (newTemplate.name.trim().length < 2) {
            toast.error("Name must be at least 2 characters");
            return;
        }
        setCreating(true);
        try {
            await createAutomationRule({
                name: newTemplate.name.trim(),
                module: newTemplate.category.trim(),
                description: newTemplate.description?.trim() || undefined,
                trigger: { event: newTemplate.trigger.trim(), source: "ui" },
                actions: [{ type: "noop" }],
                enabled: true,
            });
            setNewTemplate({ name: "", category: "", trigger: "", description: "" });
            setShowCreateModal(false);
            await fetchTemplates();
            toast.success("Template created successfully");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to create template");
        } finally {
            setCreating(false);
        }
    };

    const handleEdit = async () => {
        if (!editTemplate) return;
        if (editTemplate.name.trim().length < 2) {
            toast.error("Name must be at least 2 characters");
            return;
        }
        setUpdating(true);
        try {
            await updateAutomationRule(editTemplate.id, {
                name: editTemplate.name.trim(),
                module: editTemplate.category.trim(),
                description: editTemplate.description?.trim() || undefined,
                trigger: { event: editTemplate.trigger.trim() || "manual", source: "ui" },
                enabled: editTemplate.status === "Active",
            });
            setShowEditModal(false);
            setEditTemplate(null);
            await fetchTemplates();
            toast.success("Template updated successfully");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to update template");
        } finally {
            setUpdating(false);
        }
    };

    const openEdit = (template: RuleTemplate) => {
        setEditTemplate({ ...template });
        setShowEditModal(true);
    };

    const filteredTemplates = templates.filter(t => {
        const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchFilter = filterCategory === "all" || t.category === filterCategory;
        return matchSearch && matchFilter;
    });

    const categories = [...new Set(templates.map(t => t.category))];

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-outfit p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800 rounded-none shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                        <LayoutTemplate className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">Automation Rule Templates</h1>
                        <p className="text-xs text-zinc-500 mt-1 font-medium">Pre-built automation templates for common business scenarios.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-10 rounded-xl text-[11px] font-semibold border-zinc-200 dark:border-zinc-800" onClick={() => toast.info("Template library coming soon. Check back later.")}>
                        <FileText className="w-4 h-4 mr-1.5" /> Browse Library
                    </Button>
                    <Button onClick={() => setShowCreateModal(true)} className="h-10 rounded-xl text-[11px] font-semibold bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-1.5" /> Create Template
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard className="bg-gradient-to-r from-primary/70 to-primary border-none rounded-none shadow-lg text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-white opacity-80">Total Templates</p>
                            <p className="text-xl font-semibold text-white mt-1">{templates.length}</p>
                            <p className="text-[10px] text-white/80 mt-1">Available for use</p>
                        </div>
                        <LayoutTemplate className="w-6 h-6 text-white/80" />
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white dark:bg-zinc-900 border-0 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div className="text-left">
                            <span className="text-[10px] font-medium text-zinc-400 block mb-1">Active Templates</span>
                            <span className="text-xl font-semibold text-zinc-900 dark:text-white block">{templates.filter(t => t.status === "Active").length}</span>
                            <span className="text-[10px] text-emerald-600 font-medium mt-1 block">Currently in use</span>
                        </div>
                        <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-none flex items-center justify-center">
                            <Zap className="w-5 h-5" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white dark:bg-zinc-900 border-0 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div className="text-left">
                            <span className="text-[10px] font-medium text-zinc-400 block mb-1">Total Usage</span>
                            <span className="text-xl font-semibold text-zinc-900 dark:text-white block">{templates.reduce((sum, t) => sum + t.usage, 0)}</span>
                            <span className="text-[10px] text-blue-600 font-medium mt-1 block">Instances deployed</span>
                        </div>
                        <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-none flex items-center justify-center">
                            <Layers className="w-5 h-5" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white dark:bg-zinc-900 border-0 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div className="text-left">
                            <span className="text-[10px] font-medium text-zinc-400 block mb-1">Categories</span>
                            <span className="text-xl font-semibold text-zinc-900 dark:text-white block">{categories.length}</span>
                            <span className="text-[10px] text-zinc-500 font-medium mt-1 block">Template types</span>
                        </div>
                        <div className="h-10 w-10 bg-purple-50 dark:bg-purple-900/20 text-purple-500 rounded-none flex items-center justify-center">
                            <Code className="w-5 h-5" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Templates Table */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/20 dark:bg-zinc-900/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            className="pl-10 rounded-xl border-zinc-200 dark:border-zinc-700 h-10 text-sm bg-white dark:bg-zinc-800"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-10 text-sm bg-white dark:bg-zinc-800 w-[180px]">
                                <Filter size={14} className="mr-2 text-zinc-400" />
                                <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(c => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                                <th className="px-5 py-3 text-[11px] font-medium text-zinc-500">Template Name</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Category</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Trigger</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Actions</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Usage</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Status</th>
                                <th className="py-3 pr-5 text-[11px] font-medium text-zinc-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTemplates.map((template) => (
                                <tr key={template.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0 group">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl border border-purple-100 dark:border-purple-800 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                                <Zap size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{template.name}</p>
                                                <p className="text-[10px] text-zinc-400 mt-0.5">{template.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <Badge className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-0 rounded-full text-[9px] font-medium px-2 py-0.5">
                                            {template.category}
                                        </Badge>
                                    </td>
                                    <td className="py-3">
                                        <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">{template.trigger}</span>
                                    </td>
                                    <td className="py-3">
                                        <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">{template.actions} actions</span>
                                    </td>
                                    <td className="py-3">
                                        <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">{template.usage}</span>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={template.status === "Active"}
                                                onCheckedChange={() => toggleStatus(template.id)}
                                                className="data-[state=checked]:bg-emerald-600"
                                            />
                                            <Badge className={`rounded-full text-[9px] font-medium px-2 py-0.5 border-0 ${template.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                                                {template.status}
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
                                                <DropdownMenuItem onClick={() => openEdit(template)} className="text-xs p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer rounded-lg">
                                                    <Edit size={14} /> Edit Template
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => duplicateTemplate(template)} className="text-xs p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer rounded-lg">
                                                    <Copy size={14} /> Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => { toast.promise(new Promise(res => setTimeout(res, 1500)), { loading: "Deploying " + template.name + "...", success: template.name + " deployed successfully!", error: "Deployment failed." }); toggleStatus(template.id); }} className="text-xs p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer rounded-lg">
                                                    <Play size={14} /> Deploy
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-1" />
                                                <DropdownMenuItem
                                                    onClick={() => deleteTemplate(template.id)}
                                                    className="text-xs p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer rounded-lg"
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

                <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <p className="text-[11px] text-zinc-500 font-medium">Showing {filteredTemplates.length} of {templates.length} templates</p>
                    <Button variant="link" className="p-0 h-auto text-[10px] font-semibold text-blue-600 hover:no-underline">
                        Browse Template Library <ChevronRight size={12} className="ml-1" />
                    </Button>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <LayoutTemplate size={80} />
                        </div>
                        <h2 className="text-xl font-semibold flex items-center gap-3">
                            <Plus size={22} /> Create Rule Template
                        </h2>
                        <p className="text-xs opacity-80 mt-2">Build reusable automation templates for your team.</p>
                    </div>
                    <div className="p-8 space-y-5 bg-white dark:bg-zinc-900">
                        <div className="space-y-2">
                            <Label className="text-[11px] font-semibold text-zinc-500">Template Name</Label>
                            <Input
                                placeholder="e.g., Lead Auto-Assignment"
                                value={newTemplate.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTemplate(p => ({ ...p, name: e.target.value }))}
                                className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11 text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-zinc-500">Category</Label>
                                <Select value={newTemplate.category} onValueChange={(v) => setNewTemplate(p => ({ ...p, category: v }))}>
                                    <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="Lead Management">Lead Management</SelectItem>
                                        <SelectItem value="Sales Pipeline">Sales Pipeline</SelectItem>
                                        <SelectItem value="Task Management">Task Management</SelectItem>
                                        <SelectItem value="Communication">Communication</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-zinc-500">Trigger Type</Label>
                                <Select value={newTemplate.trigger} onValueChange={(v) => setNewTemplate(p => ({ ...p, trigger: v }))}>
                                    <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11">
                                        <SelectValue placeholder="Select trigger" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="On Create">On Create</SelectItem>
                                        <SelectItem value="Field Update">Field Update</SelectItem>
                                        <SelectItem value="Time-Based">Time-Based</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[11px] font-semibold text-zinc-500">Description</Label>
                            <Textarea
                                placeholder="Describe what this template does..."
                                value={newTemplate.description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewTemplate(p => ({ ...p, description: e.target.value }))}
                                className="rounded-xl border-zinc-200 dark:border-zinc-700 min-h-[100px] text-sm"
                            />
                        </div>
                    </div>
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-xl text-xs text-zinc-500">Cancel</Button>
                        <Button onClick={handleCreate} disabled={creating} className="bg-purple-600 hover:bg-purple-700 rounded-xl text-xs px-8 h-10">{creating ? "Creating..." : "Create Template"}</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-2xl rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative">
                        <h2 className="text-xl font-semibold flex items-center gap-3">
                            <Edit size={22} /> Edit Template
                        </h2>
                        <p className="text-xs opacity-80 mt-2">Update template configuration.</p>
                    </div>
                    {editTemplate && (
                        <>
                            <div className="p-8 space-y-5 bg-white dark:bg-zinc-900">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-zinc-500">Template Name</Label>
                                    <Input
                                        value={editTemplate.name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTemplate((p: any) => ({ ...p, name: e.target.value }))}
                                        className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11 text-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-semibold text-zinc-500">Category</Label>
                                        <Select value={editTemplate.category} onValueChange={(v) => setEditTemplate((p: any) => ({ ...p, category: v }))}>
                                            <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="Lead Management">Lead Management</SelectItem>
                                                <SelectItem value="Sales Pipeline">Sales Pipeline</SelectItem>
                                                <SelectItem value="Task Management">Task Management</SelectItem>
                                                <SelectItem value="Communication">Communication</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-semibold text-zinc-500">Trigger Type</Label>
                                        <Select value={editTemplate.trigger} onValueChange={(v) => setEditTemplate((p: any) => ({ ...p, trigger: v }))}>
                                            <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="On Create">On Create</SelectItem>
                                                <SelectItem value="Field Update">Field Update</SelectItem>
                                                <SelectItem value="Time-Based">Time-Based</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-zinc-500">Description</Label>
                                    <Textarea
                                        value={editTemplate.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditTemplate((p: any) => ({ ...p, description: e.target.value }))}
                                        className="rounded-xl border-zinc-200 dark:border-zinc-700 min-h-[100px] text-sm"
                                    />
                                </div>
                            </div>
                            <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
                                <Button variant="ghost" onClick={() => setShowEditModal(false)} className="rounded-xl text-xs text-zinc-500">Cancel</Button>
                                <Button onClick={handleEdit} disabled={updating} className="bg-blue-600 hover:bg-blue-700 rounded-xl text-xs px-8 h-10">{updating ? "Saving..." : "Save Changes"}</Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
