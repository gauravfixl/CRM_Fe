"use client"

import React, { useState } from "react";
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
    const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

    const [formData, setFormData] = useState<Partial<Policy>>({
        title: "",
        category: "HR",
        version: "1.0",
        effectiveDate: new Date().toISOString().split('T')[0],
        description: ""
    });

    const handleAddPolicy = () => {
        if (!formData.title || !formData.category) {
            toast({ title: "Validation Error", description: "Title and Category are required", variant: "destructive" });
            return;
        }
        addPolicy({
            ...formData,
            lastUpdated: new Date().toISOString().split('T')[0],
            fileSize: "0.0 MB"
        } as Omit<Policy, 'id'>);
        toast({ title: "Policy Added", description: `${formData.title} has been published.` });
        setIsAddDialogOpen(false);
        setFormData({ title: "", category: "HR", version: "1.0", effectiveDate: new Date().toISOString().split('T')[0], description: "" });
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
                                    className={`cursor-pointer group overflow-hidden border transition-all hover:shadow-xl rounded-[2.5rem] ${categoryFilter === cat ? 'ring-2 ring-indigo-500 bg-white' : 'hover:scale-[1.02]'} ${getCategoryStyles(cat).split(' ')[0]} ${getCategoryStyles(cat).split(' ')[2]}`}
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

                    <Card className="rounded-[2.5rem] bg-indigo-50/50 border border-indigo-100 p-8 shadow-sm relative overflow-hidden group">
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
                            <Button className="w-full bg-indigo-600 hover:bg-slate-900 text-white h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 border-none">
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
                                className="pl-11 h-9 rounded-xl bg-slate-50 border-none shadow-none font-bold text-[10px] focus-visible:ring-2 focus-visible:ring-indigo-50"
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
                                    <Card className={`group border transition-all rounded-[3rem] overflow-hidden ${getCategoryStyles(policy.category).split(' ')[0]} ${getCategoryStyles(policy.category).split(' ')[2]} shadow-sm hover:shadow-xl`}>
                                        <CardContent className="p-0">
                                            <div className="p-8 space-y-6">
                                                <div className="flex justify-between items-start">
                                                    <div className={`h-14 w-14 rounded-[1.5rem] flex items-center justify-center border-2 border-white shadow-lg ring-1 ring-slate-100 group-hover:scale-110 transition-transform ${getCategoryStyles(policy.category)}`}>
                                                        {getCategoryIcon(policy.category)}
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0 text-slate-300 hover:text-slate-600 rounded-full">
                                                                <MoreVertical size={16} />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 w-48 font-bold">
                                                            <DropdownMenuItem className="rounded-xl h-11 gap-2">
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
                                                            <DropdownMenuItem className="rounded-xl h-11 gap-2">
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

                                            <div className="bg-slate-50/50 p-4 border-t border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FileText size={14} className="text-slate-400" />
                                                    <span className="text-[10px] font-bold text-slate-500">{policy.fileSize || "1.2 MB"} • PDF</span>
                                                </div>
                                                <Button size="sm" className="h-8 rounded-lg bg-indigo-600 hover:bg-slate-900 text-white font-bold text-[10px] gap-2">
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

            {/* Add Policy Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="bg-white rounded-[2.5rem] border border-slate-300 p-8 max-w-lg shadow-3xl">
                    <DialogHeader className="space-y-2">
                        <div className="h-11 w-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-1 shadow-inner">
                            <Plus size={24} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Publish Policy</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-xs">
                            Upload and detail a new company policy for institutional awareness.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-5">
                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Policy Title *</Label>
                            <Input
                                className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                placeholder="e.g. Remote Work Policy"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Category</Label>
                                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as any })}>
                                    <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold">
                                        <SelectItem value="HR" className="rounded-lg h-9">HR & People</SelectItem>
                                        <SelectItem value="IT" className="rounded-lg h-9">IT & Assets</SelectItem>
                                        <SelectItem value="Finance" className="rounded-lg h-9">Finance & Travel</SelectItem>
                                        <SelectItem value="General" className="rounded-lg h-9">General</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Version</Label>
                                <Input
                                    className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                    placeholder="1.0"
                                    value={formData.version}
                                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Effective Date</Label>
                            <Input
                                type="date"
                                className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                value={formData.effectiveDate}
                                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                            />
                        </div>

                        <div className="space-y-3 pt-2">
                            <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Document Upload</Label>
                            <div className="border-2 border-dashed border-slate-200 rounded-[1.5rem] p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-indigo-50/30 hover:border-indigo-200 transition-all cursor-pointer group">
                                <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-3 group-hover:scale-110 transition-transform">
                                    <Download size={20} className="text-indigo-600 rotate-180" />
                                </div>
                                <p className="text-xs font-bold text-slate-900">Click to upload policy PDF</p>
                                <p className="text-[10px] text-slate-400 font-medium">Max size 10MB</p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-6 border-t border-slate-200 sm:justify-end">
                        <Button
                            className="flex-1 bg-indigo-600 hover:bg-slate-900 text-white rounded-lg h-10 font-bold text-xs shadow-xl shadow-indigo-100 transition-all"
                            onClick={handleAddPolicy}
                        >
                            Publish Policy
                        </Button>
                        <Button variant="outline" className="h-10 px-6 rounded-lg font-bold border-slate-300 text-slate-600 text-xs" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Policy Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="bg-white rounded-[2.5rem] border border-slate-300 p-8 max-w-lg shadow-3xl">
                    <DialogHeader className="space-y-2">
                        <div className="h-11 w-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-1 shadow-inner">
                            <Edit size={24} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Update Policy</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-xs">
                            Modify policy details or update versioning.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-5">
                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Policy Title *</Label>
                            <Input
                                className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Category</Label>
                                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as any })}>
                                    <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold">
                                        <SelectItem value="HR" className="rounded-lg h-9">HR & People</SelectItem>
                                        <SelectItem value="IT" className="rounded-lg h-9">IT & Assets</SelectItem>
                                        <SelectItem value="Finance" className="rounded-lg h-9">Finance & Travel</SelectItem>
                                        <SelectItem value="General" className="rounded-lg h-9">General</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Version Tag</Label>
                                <Input
                                    className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                    value={formData.version}
                                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Effective Date</Label>
                            <Input
                                type="date"
                                className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                value={formData.effectiveDate}
                                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-6 border-t border-slate-200 sm:justify-end">
                        <Button
                            className="flex-1 bg-indigo-600 hover:bg-slate-900 text-white rounded-lg h-10 font-bold text-xs shadow-xl shadow-indigo-100 transition-all"
                            onClick={handleUpdatePolicy}
                        >
                            Save Changes
                        </Button>
                        <Button variant="outline" className="h-10 px-6 rounded-lg font-bold border-slate-300 text-slate-600 text-xs" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PolicyCenterPage;
