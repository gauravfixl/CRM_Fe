"use client"

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Plus,
    Search,
    Download,
    Eye,
    Trash2,
    Calendar,
    Shield,
    BookOpen,
    Laptop,
    DollarSign,
    MoreVertical,
    Edit,
    Clock,
    Share2,
    Users,
    X
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useToast } from "@/shared/components/ui/use-toast";
import { useOrganisationStore, type Policy } from "@/shared/data/organisation-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

const PolicyCenterPage = () => {
    const { toast } = useToast();
    const { policies, addPolicy, updatePolicy, deletePolicy } = useOrganisationStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("All");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isComplianceDialogOpen, setIsComplianceDialogOpen] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

    const [formData, setFormData] = useState<Partial<Policy>>({
        title: "",
        category: "HR",
        version: "1.0",
        effectiveDate: new Date().toISOString().split('T')[0],
        description: ""
    });
    const [uploadedFileName, setUploadedFileName] = useState<string>("");
    const addFileInputRef = useRef<HTMLInputElement>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            toast({ title: "File too large", description: "Policy document must be under 10 MB.", variant: "destructive" });
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setFormData((prev) => ({
                ...prev,
                fileUrl: reader.result as string,
                fileSize: formatBytes(file.size),
            }));
            setUploadedFileName(file.name);
            toast({ title: "File ready", description: `${file.name} attached.` });
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    };

    const resetAddForm = () => {
        setFormData({ title: "", category: "HR", version: "1.0", effectiveDate: new Date().toISOString().split('T')[0], description: "" });
        setUploadedFileName("");
    };

    const handleAddPolicy = () => {
        if (!formData.title || !formData.category) {
            toast({ title: "Validation Error", description: "Title and Category are required", variant: "destructive" });
            return;
        }
        addPolicy({
            ...formData,
            lastUpdated: new Date().toISOString().split('T')[0],
            fileSize: formData.fileSize || "0.0 MB"
        } as Omit<Policy, 'id'>);
        toast({ title: "Policy Added", description: `${formData.title} has been published.` });
        setIsAddDialogOpen(false);
        resetAddForm();
    };

    const handleUpdatePolicy = () => {
        if (!selectedPolicy || !formData.title) return;
        updatePolicy(selectedPolicy.id, {
            ...formData,
            lastUpdated: new Date().toISOString().split('T')[0]
        });
        toast({ title: "Policy Updated", description: "The policy has been updated successfully." });
        setIsEditDialogOpen(false);
        setSelectedPolicy(null);
    };

    const handleDeletePolicy = (id: string) => {
        deletePolicy(id);
        toast({ title: "Policy Removed", description: "The policy has been archived." });
    };

    const filteredPolicies = policies.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const getCategoryIcon = (category: Policy['category']) => {
        switch (category) {
            case 'HR': return <Users size={20} className="text-indigo-600" />;
            case 'IT': return <Laptop size={20} className="text-emerald-600" />;
            case 'Finance': return <DollarSign size={20} className="text-amber-600" />;
            case 'General': return <BookOpen size={20} className="text-rose-600" />;
            default: return <FileText size={20} className="text-slate-600" />;
        }
    };

    const getCategoryStyles = (category: Policy['category']) => {
        switch (category) {
            case 'HR': return 'bg-[#eef2ff] text-[#4f46e5] border-[#c7d2fe]';
            case 'IT': return 'bg-[#ecfdf5] text-[#10b981] border-[#a7f3d0]';
            case 'Finance': return 'bg-[#fffbeb] text-[#f59e0b] border-[#fde68a]';
            case 'General': return 'bg-[#fff1f2] text-[#e11d48] border-[#fecdd3]';
            default: return 'bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]';
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc]/50" style={{ zoom: "90%" }}>
            <header className="py-4 px-8 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Policy Center</h1>
                            <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-[10px] uppercase tracking-wider h-5 px-3 italic">
                                Compliance Ready
                            </Badge>
                        </div>
                        <p className="text-slate-500 text-[11px] font-medium leading-none">Centralized repository for all company guidelines and documentation.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setIsAddDialogOpen(true)}
                            className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-10 px-8 font-bold shadow-xl shadow-indigo-100 transition-all gap-2 text-xs"
                        >
                            <Plus size={16} /> New Policy
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-8 pt-6 max-w-[1440px] mx-auto w-full space-y-8">
                {/* 📊 Metrics & Categories */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {(["HR", "IT", "Finance", "General"] as const).map((cat) => (
                                <Card
                                    key={cat}
                                    className={`cursor-pointer group overflow-hidden border-none transition-all hover:shadow-xl rounded-xl ${categoryFilter === cat ? 'ring-2 ring-indigo-500 bg-white' : 'hover:scale-[1.02]'} ${getCategoryStyles(cat).split(' ')[0]} ${getCategoryStyles(cat).split(' ')[2]}`}
                                    onClick={() => setCategoryFilter(categoryFilter === cat ? 'All' : cat)}
                                >
                                    <div className="p-6 space-y-4">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 bg-white shadow-sm`}>
                                            {getCategoryIcon(cat)}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-slate-900 tracking-tight">{cat} Policies</h3>
                                            <p className="text-[10px] font-bold text-slate-500/80 capitalize whitespace-nowrap italic">
                                                {policies.filter(p => p.category === cat).length} Documents Active
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <Card className="rounded-xl bg-indigo-50/50 border-none p-8 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                            <Shield size={120} className="text-indigo-600" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 mb-2">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-slate-900 text-lg font-black tracking-tight">Security Vault</h3>
                            <p className="text-slate-500 text-[11px] font-bold leading-relaxed italic">
                                All policies are encrypted and follow standard compliance protocols.
                            </p>
                            <Button
                                className="w-full bg-indigo-600 hover:bg-slate-900 text-white h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 border-none"
                                onClick={() => setIsComplianceDialogOpen(true)}
                            >
                                View Compliance Logs
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* 🔍 Search & Grid */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 max-w-md bg-white p-1.5 px-3 rounded-2xl border border-indigo-100 shadow-sm h-12">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search policies by title..."
                                className="pl-11 h-9 rounded-xl bg-slate-50 border border-slate-200 shadow-none font-bold text-[10px] focus-visible:ring-2 focus-visible:ring-indigo-50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {categoryFilter !== 'All' && (
                            <Badge
                                className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 cursor-pointer h-11 px-6 rounded-xl border border-indigo-100 gap-2 font-bold text-xs"
                                onClick={() => setCategoryFilter('All')}
                            >
                                {categoryFilter} <X size={14} />
                            </Badge>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredPolicies.map((policy, i) => (
                                <motion.div
                                    key={policy.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card
                                        onClick={() => { setSelectedPolicy(policy); setIsViewDialogOpen(true); }}
                                        className={`group border transition-all rounded-[3rem] overflow-hidden ${getCategoryStyles(policy.category).split(' ')[0]} ${getCategoryStyles(policy.category).split(' ')[2]} shadow-sm hover:shadow-xl cursor-pointer`}
                                    >
                                        <CardContent className="p-0">
                                            <div className="p-8 space-y-6">
                                                <div className="flex justify-between items-start">
                                                    <div className={`h-14 w-14 rounded-[1.5rem] flex items-center justify-center border-2 border-white shadow-lg ring-1 ring-slate-100 group-hover:scale-110 transition-transform ${getCategoryStyles(policy.category)}`}>
                                                        {getCategoryIcon(policy.category)}
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0 text-slate-300 hover:text-slate-600 rounded-full" onClick={(e) => e.stopPropagation()}>
                                                                <MoreVertical size={16} />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 w-48 font-bold">
                                                            <DropdownMenuItem className="rounded-xl h-11 gap-2" onClick={() => { setSelectedPolicy(policy); setIsViewDialogOpen(true); }}>
                                                                <Eye size={16} /> View Document
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="rounded-xl h-11 gap-2"
                                                                onClick={() => {
                                                                    setSelectedPolicy(policy);
                                                                    setFormData(policy);
                                                                    setIsEditDialogOpen(true);
                                                                }}
                                                            >
                                                                <Edit size={16} /> Edit Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="rounded-xl h-11 gap-2" onClick={() => {
                                                                navigator.clipboard.writeText(`${window.location.origin}/hrmcubicle/organization/policies?id=${policy.id}`);
                                                                toast({ title: "Link Copied", description: `Shareable link for "${policy.title}" copied to clipboard.` });
                                                            }}>
                                                                <Share2 size={16} /> Share Internal
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="rounded-xl h-11 text-rose-600 focus:bg-rose-50 gap-2"
                                                                onClick={() => handleDeletePolicy(policy.id)}
                                                            >
                                                                <Trash2 size={16} /> Archive
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                                                            {policy.title}
                                                        </h3>
                                                        <Badge variant="outline" className="border-slate-200 text-slate-400 font-bold text-[8px] h-4 px-1 rounded uppercase">v{policy.version}</Badge>
                                                    </div>
                                                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed line-clamp-2 italic">
                                                        Guidelines regarding {policy.title.toLowerCase()} for all business units.
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-50 italic">
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Effective From</p>
                                                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                                                            <Calendar size={12} className="text-slate-300" />
                                                            {new Date(policy.effectiveDate).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Last Update</p>
                                                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                                                            <Clock size={12} className="text-slate-300" />
                                                            {new Date(policy.lastUpdated).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50/50 p-4 border-t border-slate-100 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center gap-2">
                                                    <FileText size={14} className="text-slate-400" />
                                                    <span className="text-[10px] font-bold text-slate-500">{policy.fileSize || "1.2 MB"} • PDF</span>
                                                </div>
                                                <Button size="sm" className="h-8 rounded-lg bg-indigo-600 hover:bg-slate-900 text-white font-bold text-[10px] gap-2" onClick={() => {
                                                    const link = document.createElement("a");
                                                    if (policy.fileUrl) {
                                                        link.href = policy.fileUrl;
                                                        link.download = `${policy.title.replace(/\s+/g, '_')}_v${policy.version}`;
                                                    } else {
                                                        const content = `POLICY DOCUMENT\n\nTitle: ${policy.title}\nCategory: ${policy.category}\nVersion: ${policy.version}\nEffective Date: ${policy.effectiveDate}\nLast Updated: ${policy.lastUpdated}\n\n${policy.description || `This document contains the official policy guidelines for ${policy.title.toLowerCase()}.`}`;
                                                        const blob = new Blob([content], { type: "text/plain" });
                                                        link.href = URL.createObjectURL(blob);
                                                        link.download = `${policy.title.replace(/\s+/g, '_')}_v${policy.version}.txt`;
                                                    }
                                                    link.click();
                                                    toast({ title: "Downloaded", description: `${policy.title} document downloaded.` });
                                                }}>
                                                    <Download size={14} /> Download
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Add Policy Sheet */}
            <SideFormSheet
                open={isAddDialogOpen}
                onOpenChange={(o) => { setIsAddDialogOpen(o); if (!o) resetAddForm(); }}
                title="Publish Policy"
                description="Upload and detail a new company policy for institutional awareness."
                icon={<Plus size={20} />}
                accentColor="#4f46e5"
                width="md"
                submitLabel="Publish Policy"
                onSubmit={(e) => { e.preventDefault(); handleAddPolicy(); }}
            >
                <div className="space-y-4">
                    <Field label="Policy Title" required>
                        <Input
                            placeholder="e.g. Remote Work Policy"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Category">
                            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as any })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="HR">HR & People</SelectItem>
                                    <SelectItem value="IT">IT & Assets</SelectItem>
                                    <SelectItem value="Finance">Finance & Travel</SelectItem>
                                    <SelectItem value="General">General</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Version">
                            <Input
                                placeholder="1.0"
                                value={formData.version}
                                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                            />
                        </Field>
                    </div>

                    <Field label="Effective Date">
                        <Input
                            type="date"
                            value={formData.effectiveDate}
                            onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                        />
                    </Field>

                    <Field label="Description">
                        <Input
                            placeholder="Short summary (optional)"
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </Field>

                    <Field label="Document Upload">
                        <>
                            <input
                                ref={addFileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx,.txt,.md,application/pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <div
                                onClick={() => addFileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-indigo-50/30 hover:border-indigo-200 transition-all cursor-pointer group"
                            >
                                <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-3 group-hover:scale-110 transition-transform">
                                    <Download size={20} className="text-indigo-600 rotate-180" />
                                </div>
                                {uploadedFileName ? (
                                    <>
                                        <p className="text-xs font-bold text-emerald-600">{uploadedFileName}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{formData.fileSize} · Click to replace</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-xs font-bold text-slate-900">Click to upload policy document</p>
                                        <p className="text-[10px] text-slate-400 font-medium">PDF, DOC, DOCX, TXT · Max 10 MB</p>
                                    </>
                                )}
                            </div>
                        </>
                    </Field>
                </div>
            </SideFormSheet>

            {/* Edit Policy Sheet */}
            <SideFormSheet
                open={isEditDialogOpen}
                onOpenChange={(o) => { setIsEditDialogOpen(o); if (!o) setUploadedFileName(""); }}
                title="Update Policy"
                description="Modify policy details or update versioning."
                icon={<Edit size={20} />}
                accentColor="#7c3aed"
                width="md"
                submitLabel="Save Changes"
                onSubmit={(e) => { e.preventDefault(); handleUpdatePolicy(); }}
            >
                <div className="space-y-4">
                    <Field label="Policy Title" required>
                        <Input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Category">
                            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as any })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="HR">HR & People</SelectItem>
                                    <SelectItem value="IT">IT & Assets</SelectItem>
                                    <SelectItem value="Finance">Finance & Travel</SelectItem>
                                    <SelectItem value="General">General</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Version Tag">
                            <Input
                                value={formData.version}
                                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                            />
                        </Field>
                    </div>

                    <Field label="Effective Date">
                        <Input
                            type="date"
                            value={formData.effectiveDate}
                            onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                        />
                    </Field>

                    <Field label="Description">
                        <Input
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </Field>

                    <Field label="Replace Document (optional)">
                        <>
                            <input
                                ref={editFileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx,.txt,.md,application/pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <div
                                onClick={() => editFileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-200 rounded-2xl p-5 flex items-center gap-3 bg-slate-50 hover:bg-indigo-50/30 hover:border-indigo-200 transition-all cursor-pointer"
                            >
                                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                                    <FileText size={16} className="text-indigo-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-slate-900">{uploadedFileName || (formData.fileUrl ? "Current document" : "No file attached")}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">{formData.fileSize || ""} · Click to replace</p>
                                </div>
                            </div>
                        </>
                    </Field>
                </div>
            </SideFormSheet>
            {/* View Document Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="bg-white rounded-[2.5rem] border border-slate-300 p-8 max-w-lg shadow-3xl">
                    <DialogHeader className="space-y-2">
                        <div className="h-11 w-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-1 shadow-inner">
                            <Eye size={24} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">{selectedPolicy?.title}</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-xs">
                            Policy document preview
                        </DialogDescription>
                    </DialogHeader>
                    {selectedPolicy && (
                        <div className="py-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Category</p>
                                    <p className="text-sm font-bold text-slate-700">{selectedPolicy.category}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Version</p>
                                    <p className="text-sm font-bold text-slate-700">v{selectedPolicy.version}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Effective Date</p>
                                    <p className="text-sm font-bold text-slate-700">{new Date(selectedPolicy.effectiveDate).toLocaleDateString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Last Updated</p>
                                    <p className="text-sm font-bold text-slate-700">{new Date(selectedPolicy.lastUpdated).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                                <p className="text-xs font-bold text-slate-700">Document Content</p>
                                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                                    This document outlines the official guidelines regarding {selectedPolicy.title.toLowerCase()} applicable to all business units and employees.
                                    All employees are required to comply with the provisions stated herein effective from {new Date(selectedPolicy.effectiveDate).toLocaleDateString()}.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                                <FileText size={14} /> {selectedPolicy.fileSize || "1.2 MB"} • PDF Format
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2 pt-6 border-t border-slate-200 sm:justify-end">
                        <Button variant="outline" className="h-10 px-6 rounded-lg font-bold border-slate-300 text-slate-600 text-xs" onClick={() => setIsViewDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Compliance Logs Dialog */}
            <Dialog open={isComplianceDialogOpen} onOpenChange={setIsComplianceDialogOpen}>
                <DialogContent className="bg-white rounded-[2.5rem] border border-slate-300 p-8 max-w-lg shadow-3xl">
                    <DialogHeader className="space-y-2">
                        <div className="h-11 w-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-1 shadow-inner">
                            <Shield size={24} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Compliance Logs</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-xs">
                            Audit trail of policy compliance and encryption events.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        {[
                            { action: "Policy vault encrypted", timestamp: "2026-03-31 09:00", status: "Secure" },
                            { action: "Annual compliance audit passed", timestamp: "2026-03-15 14:30", status: "Verified" },
                            { action: "Data protection review completed", timestamp: "2026-03-01 10:15", status: "Compliant" },
                            { action: "Access permissions updated", timestamp: "2026-02-20 16:45", status: "Updated" },
                            { action: "Policy backup created", timestamp: "2026-02-10 08:00", status: "Archived" },
                        ].map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        <Shield size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700">{log.action}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{log.timestamp}</p>
                                    </div>
                                </div>
                                <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold text-[8px] h-5 px-2 rounded-lg">{log.status}</Badge>
                            </div>
                        ))}
                    </div>
                    <DialogFooter className="gap-2 pt-6 border-t border-slate-200 sm:justify-end">
                        <Button variant="outline" className="h-10 px-6 rounded-lg font-bold border-slate-300 text-slate-600 text-xs" onClick={() => setIsComplianceDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PolicyCenterPage;
