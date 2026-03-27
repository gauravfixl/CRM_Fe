"use client";

import React, { useState } from "react";
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

export default function RuleTemplatesPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    const [newTemplate, setNewTemplate] = useState({ name: "", category: "", trigger: "", description: "" });
    const [editTemplate, setEditTemplate] = useState<any>(null);

    const [templates, setTemplates] = useState([
        { id: "1", name: "Lead Auto-Assignment", category: "Lead Management", trigger: "On Create", actions: 3, usage: 24, status: "Active", description: "Automatically assigns leads based on territory and workload." },
        { id: "2", name: "Deal Stage Progression", category: "Sales Pipeline", trigger: "Field Update", actions: 5, usage: 18, status: "Active", description: "Moves deals through stages based on criteria." },
        { id: "3", name: "Task Escalation", category: "Task Management", trigger: "Time-Based", actions: 2, usage: 12, status: "Active", description: "Escalates overdue tasks to managers." },
        { id: "4", name: "Email Notification Chain", category: "Communication", trigger: "On Create", actions: 4, usage: 8, status: "Paused", description: "Sends sequential email notifications." },
        { id: "5", name: "Invoice Auto-Generation", category: "Sales Pipeline", trigger: "Field Update", actions: 3, usage: 15, status: "Active", description: "Generates invoices when deal is won." },
    ]);

    const toggleStatus = (id: string) => {
        setTemplates(prev => prev.map(t =>
            t.id === id ? { ...t, status: t.status === "Active" ? "Paused" : "Active" } : t
        ));
        toast.success("Template status updated");
    };

    const deleteTemplate = (id: string) => {
        setTemplates(prev => prev.filter(t => t.id !== id));
        toast.success("Template deleted successfully");
    };

    const duplicateTemplate = (template: any) => {
        const newT = { ...template, id: Date.now().toString(), name: `${template.name} (Copy)`, usage: 0 };
        setTemplates(prev => [...prev, newT]);
        toast.success("Template duplicated");
    };

    const handleCreate = () => {
        if (!newTemplate.name || !newTemplate.category || !newTemplate.trigger) {
            toast.error("Please fill all required fields");
            return;
        }
        const t = {
            id: Date.now().toString(),
            name: newTemplate.name,
            category: newTemplate.category,
            trigger: newTemplate.trigger,
            actions: 0,
            usage: 0,
            status: "Active",
            description: newTemplate.description,
        };
        setTemplates(prev => [...prev, t]);
        setNewTemplate({ name: "", category: "", trigger: "", description: "" });
        setShowCreateModal(false);
        toast.success("Template created successfully");
    };

    const handleEdit = () => {
        if (!editTemplate) return;
        setTemplates(prev => prev.map(t => t.id === editTemplate.id ? editTemplate : t));
        setShowEditModal(false);
        setEditTemplate(null);
        toast.success("Template updated successfully");
    };

    const openEdit = (template: any) => {
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
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
                        <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-2xl flex items-center justify-center">
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
                        <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl flex items-center justify-center">
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
                        <div className="h-10 w-10 bg-purple-50 dark:bg-purple-900/20 text-purple-500 rounded-2xl flex items-center justify-center">
                            <Code className="w-5 h-5" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Templates Table */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
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
                <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden shadow-2xl border-none">
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
                        <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700 rounded-xl text-xs px-8 h-10">Create Template</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden shadow-2xl border-none">
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
                                <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 rounded-xl text-xs px-8 h-10">Save Changes</Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
