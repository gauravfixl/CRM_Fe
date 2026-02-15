"use client";

import React, { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    FileText,
    History,
    CheckCircle2,
    Clock,
    Archive,
    MoreHorizontal,
    Download,
    Eye,
    Trash2,
    Users,
    ChevronRight,
    ArrowUpRight,
    AlertCircle,
    Share2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/shared/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { useDocumentsStore, type CompanyPolicy } from "@/shared/data/documents-store";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const PolicyPage = () => {
    const { policies, addPolicy, updatePolicy, deletePolicy } = useDocumentsStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState<CompanyPolicy | null>(null);
    const [editingPolicy, setEditingPolicy] = useState<CompanyPolicy | null>(null);
    const [selectedPolicyIds, setSelectedPolicyIds] = useState<string[]>([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const [newPolicy, setNewPolicy] = useState({
        title: "",
        category: "General" as CompanyPolicy['category'],
        description: "",
        effectiveDate: new Date().toISOString().split('T')[0],
        currentVersion: "1.0.0",
        audience: ["All Employees"],
        documentUrl: "#"
    });

    const categories = ["General", "Code of Conduct", "Compliance", "Benefits", "IT", "Payroll", "Leave"];

    const filteredPolicies = policies.filter(policy => {
        const matchesSearch = policy.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || policy.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const stats = {
        total: policies.length,
        active: policies.filter(p => p.status === "Active").length,
        draft: policies.filter(p => p.status === "Draft").length,
        archived: policies.filter(p => p.status === "Archived").length
    };

    const handleAddPolicy = () => {
        if (!newPolicy.title || !newPolicy.description) {
            toast.error("Please fill in all required fields");
            return;
        }
        addPolicy({
            ...newPolicy,
            status: "Active"
        });
        setIsAddDialogOpen(false);
        setNewPolicy({
            title: "",
            category: "General",
            description: "",
            effectiveDate: new Date().toISOString().split('T')[0],
            currentVersion: "1.0.0",
            audience: ["All Employees"],
            documentUrl: "#"
        });
        toast.success("Policy added successfully");
    };

    const handleUpdatePolicy = () => {
        if (!editingPolicy?.title || !editingPolicy?.description) {
            toast.error("Required fields cannot be empty");
            return;
        }
        updatePolicy(editingPolicy.id, editingPolicy);
        setEditingPolicy(null);
        toast.success("Policy documentation synchronized");
    };

    const toggleSelect = (id: string) => {
        setSelectedPolicyIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Active":
                return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Active</Badge>;
            case "Draft":
                return <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">Draft</Badge>;
            case "Archived":
                return <Badge variant="outline" className="text-muted-foreground">Archived</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans relative" style={{ zoom: "80%" }}>
            {/* Header section */}
            <header className="py-2.5 px-8 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm rounded-b-3xl">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="text-start">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">Company Policies</h1>
                        <p className="text-slate-500 font-semibold text-sm mt-1">Manage and track organizational policies and compliance standards.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="hidden md:flex gap-2 border-slate-200 h-11 rounded-xl font-bold text-[10px] tracking-wide px-6">
                            <Download className="w-4 h-4" /> Export All
                        </Button>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100 transition-all gap-2 text-[10px] tracking-wide border-none">
                                    <Plus className="w-4 h-4" /> Create Policy
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl bg-white rounded-[2rem] border border-slate-200 p-10 shadow-3xl font-sans" style={{ zoom: "80%" }}>
                                <DialogHeader className="mb-4">
                                    <DialogTitle className="text-3xl font-black tracking-tight text-slate-900">Create New Policy</DialogTitle>
                                    <DialogDescription className="font-bold text-slate-400 text-xs tracking-wide">
                                        Define and publish organizational standards for compliance.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-3 gap-x-8 gap-y-6 py-6 transition-all duration-500">
                                    <div className="col-span-2 space-y-2.5">
                                        <label className="text-[11px] font-black tracking-wide text-slate-500 ml-1">Policy Title</label>
                                        <Input
                                            placeholder="e.g., Global Travel & Expense Policy"
                                            value={newPolicy.title}
                                            onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
                                            className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-[11px] font-black tracking-wide text-slate-500 ml-1">Category</label>
                                        <Select
                                            value={newPolicy.category}
                                            onValueChange={(val: any) => setNewPolicy({ ...newPolicy, category: val })}
                                        >
                                            <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold text-xs">
                                                {categories.map(cat => (
                                                    <SelectItem key={cat} value={cat} className="rounded-xl h-10">{cat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2.5">
                                        <label className="text-[11px] font-black tracking-wide text-slate-500 ml-1">Effective Date</label>
                                        <Input
                                            type="date"
                                            value={newPolicy.effectiveDate}
                                            onChange={(e) => setNewPolicy({ ...newPolicy, effectiveDate: e.target.value })}
                                            className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-[11px] font-black tracking-wide text-slate-500 ml-1">Initial Version</label>
                                        <Input
                                            placeholder="1.0.0"
                                            value={newPolicy.currentVersion}
                                            onChange={(e) => setNewPolicy({ ...newPolicy, currentVersion: e.target.value })}
                                            className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-[11px] font-black tracking-wide text-slate-500 ml-1">Target Audience</label>
                                        <Select defaultValue="all">
                                            <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all">
                                                <SelectValue placeholder="Select audience" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold text-xs">
                                                <SelectItem value="all" className="rounded-xl h-10">All Employees</SelectItem>
                                                <SelectItem value="it" className="rounded-xl h-10">IT Department</SelectItem>
                                                <SelectItem value="hr" className="rounded-xl h-10">HR Department</SelectItem>
                                                <SelectItem value="sales" className="rounded-xl h-10">Sales & Marketing</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="col-span-3 space-y-2.5">
                                        <label className="text-[11px] font-black tracking-wide text-slate-500 ml-1">Context & Description</label>
                                        <Textarea
                                            placeholder="Provide a brief summary and context for this policy..."
                                            rows={3}
                                            value={newPolicy.description}
                                            onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
                                            className="bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 py-4 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all min-h-[100px] text-sm"
                                        />
                                    </div>

                                    <div className="col-span-3 p-10 border-2 border-dashed border-indigo-100 rounded-[2rem] bg-indigo-50/20 flex flex-col items-center justify-center text-indigo-400 cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-200 transition-all group/upload">
                                        <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-md mb-3 group-hover/upload:scale-110 group-hover:rotate-6 transition-all duration-300">
                                            <Plus className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <span className="text-[12px] font-black tracking-wide text-indigo-600/80">Upload Document (PDF, DOCX)</span>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1">Maximum file size: 10MB</p>
                                    </div>
                                </div>
                                <DialogFooter className="gap-3 mt-4">
                                    <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="h-12 rounded-xl font-bold text-[11px] tracking-wide transition-all px-8 hover:bg-slate-50">Cancel</Button>
                                    <Button onClick={handleAddPolicy} className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-12 px-10 font-bold shadow-xl shadow-indigo-100 transition-all text-[11px] tracking-wide border-none">Activate Policy</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </header>

            <main className="p-8 max-w-[1600px] mx-auto w-full space-y-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: "Total Policies", value: stats.total, icon: FileText, color: "text-blue-700", bg: "bg-blue-100/70", border: "border-blue-200", iconBg: "bg-white/90" },
                        { label: "Active Policies", value: stats.active, icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-100/70", border: "border-emerald-200", iconBg: "bg-white/90" },
                        { label: "Pending Drafts", value: stats.draft, icon: Clock, color: "text-amber-700", bg: "bg-amber-100/70", border: "border-amber-200", iconBg: "bg-white/90" },
                        { label: "Archived", value: stats.archived, icon: Archive, color: "text-slate-700", bg: "bg-slate-200/70", border: "border-slate-300", iconBg: "bg-white/90" },
                    ].map((stat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                            <Card className={`border ${stat.border} shadow-sm rounded-[2.2rem] ${stat.bg} overflow-hidden group hover:shadow-md transition-all duration-300 h-full p-6 flex flex-row items-center justify-between`}>
                                <div className="text-start space-y-1 relative z-10">
                                    <p className="text-[11px] font-bold text-slate-500 tracking-wide">{stat.label}</p>
                                    <div className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
                                </div>
                                <div className={`${stat.iconBg} ${stat.color} h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm border border-black/5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative z-10`}>
                                    <stat.icon size={22} />
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Content Section */}
                <Card className="border border-slate-100 shadow-sm rounded-[2rem] overflow-hidden bg-white">
                    <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-5 px-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6 flex-1 max-w-md">
                                {selectedPolicyIds.length > 0 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-12 rounded-xl text-rose-600 font-bold border-rose-100 bg-rose-50/50"
                                        onClick={() => {
                                            selectedPolicyIds.forEach(id => deletePolicy(id));
                                            setSelectedPolicyIds([]);
                                            toast.success("Bulk purge completed");
                                        }}
                                    >
                                        Delete ({selectedPolicyIds.length})
                                    </Button>
                                )}
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        placeholder="Search policies by title..."
                                        className="h-12 pl-12 bg-white border-slate-200 rounded-xl font-bold text-sm focus:ring-4 focus:ring-indigo-100 transition-all"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="w-[200px] h-12 bg-white border-slate-200 rounded-xl font-bold text-xs px-5">
                                        <div className="flex items-center gap-2">
                                            <Filter size={16} className="text-slate-400" />
                                            <span>{categoryFilter === 'all' ? 'All Categories' : categoryFilter}</span>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold text-xs">
                                        <SelectItem value="all" className="rounded-lg h-10">All Categories</SelectItem>
                                        {categories.map(cat => (
                                            <SelectItem key={cat} value={cat} className="rounded-lg h-10">{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-none">
                                        <TableHead className="w-10 px-8 py-3">
                                            <input
                                                type="checkbox"
                                                className="rounded-lg border-slate-300 text-indigo-600 cursor-pointer w-4 h-4"
                                                checked={selectedPolicyIds.length === filteredPolicies.length && filteredPolicies.length > 0}
                                                onChange={(e) => {
                                                    if (e.target.checked) setSelectedPolicyIds(filteredPolicies.map(p => p.id));
                                                    else setSelectedPolicyIds([]);
                                                }}
                                            />
                                        </TableHead>
                                        <TableHead className="px-4 py-3 text-[10px] font-bold tracking-wide text-slate-400 w-[35%]">Policy Details</TableHead>
                                        <TableHead className="px-8 py-3 text-[10px] font-bold tracking-wide text-slate-400">Category</TableHead>
                                        <TableHead className="px-8 py-3 text-[10px] font-bold tracking-wide text-slate-400">Version</TableHead>
                                        <TableHead className="px-8 py-3 text-[10px] font-bold tracking-wide text-slate-400">Effective Date</TableHead>
                                        <TableHead className="px-8 py-3 text-[10px] font-bold tracking-wide text-slate-400">Status</TableHead>
                                        <TableHead className="px-8 py-3 text-[10px] font-bold tracking-wide text-slate-400 text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence mode="popLayout">
                                        {filteredPolicies.map((policy) => (
                                            <TableRow
                                                key={policy.id}
                                                className={`group hover:bg-indigo-50/20 transition-all border-b border-slate-50 last:border-0 ${selectedPolicyIds.includes(policy.id) ? 'bg-indigo-50/30' : ''}`}
                                            >
                                                <TableCell className="px-8 py-6 w-10">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded-lg border-slate-300 text-indigo-600 cursor-pointer w-4 h-4"
                                                        checked={selectedPolicyIds.includes(policy.id)}
                                                        onChange={() => toggleSelect(policy.id)}
                                                    />
                                                </TableCell>
                                                <TableCell className="px-4 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 group-hover:scale-110 transition-transform">
                                                            <FileText size={18} />
                                                        </div>
                                                        <div className="text-start">
                                                            <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{policy.title}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 line-clamp-1 mt-0.5">{policy.description}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-3.5">
                                                    <Badge className="bg-slate-100 text-slate-600 border-none px-3 py-1 font-bold text-[9px] tracking-wide rounded-lg">
                                                        {policy.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-8 py-3.5">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                                        <History size={14} className="text-slate-400" />
                                                        v{policy.currentVersion}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-3.5 text-slate-600 text-xs font-bold">
                                                    {new Date(policy.effectiveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </TableCell>
                                                <TableCell className="px-8 py-3.5">
                                                    <div className="flex items-center gap-2">
                                                        {policy.status === 'Active' ? (
                                                            <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[9px] tracking-wide">
                                                                <CheckCircle2 size={14} /> Active
                                                            </div>
                                                        ) : policy.status === 'Draft' ? (
                                                            <div className="flex items-center gap-1.5 text-amber-600 font-black text-[9px] tracking-wide">
                                                                <Clock size={14} /> Draft
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1.5 text-slate-400 font-black text-[9px] tracking-wide">
                                                                <Archive size={14} /> Archived
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-3.5 text-right">
                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-xl transition-all border-none" onClick={() => toast.success("Opening document viewer")}>
                                                            <Eye size={16} />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-xl transition-all border-none" onClick={() => toast.success("Asset shared via secure link")}>
                                                            <Share2 size={16} />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-xl transition-all border-none" onClick={() => toast.success("Downloading asset to local machine")}>
                                                            <Download size={16} />
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-white hover:shadow-sm rounded-xl border-none">
                                                                    <MoreHorizontal size={16} className="text-slate-400" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-none shadow-2xl bg-white">
                                                                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold text-slate-400 tracking-wide">Policy Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-indigo-50" onClick={() => toast.success("Accessing cloud document...")}>
                                                                    <Eye className="w-4 h-4 text-indigo-500" /> View Document
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-indigo-50" onClick={() => toast.success("Downloading PDF version...")}>
                                                                    <Download className="w-4 h-4 text-indigo-500" /> Download PDF
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-indigo-50" onClick={() => setEditingPolicy(policy)}>
                                                                    <FileText className="w-4 h-4 text-indigo-500" /> Edit Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-indigo-50"
                                                                    onClick={() => {
                                                                        setSelectedPolicy(policy);
                                                                        setIsHistoryOpen(true);
                                                                    }}
                                                                >
                                                                    <History className="w-4 h-4 text-indigo-500" /> Version History
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-indigo-50">
                                                                    <Users className="w-4 h-4 text-indigo-500" /> Acknowledgements
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="my-2 bg-slate-50" />
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs text-rose-600 hover:bg-rose-50" onClick={() => deletePolicy(policy.id)}>
                                                                    <Trash2 className="w-4 h-4" /> Delete Policy
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </div>
                        {filteredPolicies.length === 0 && (
                            <div className="py-24 text-center">
                                <div className="mx-auto w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner">
                                    <AlertCircle size={32} className="text-slate-200" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">No policies found</h3>
                                <p className="text-slate-400 font-bold text-xs mt-2 tracking-wide">Try adjusting your filters or search query</p>
                                <Button variant="link" className="mt-4 text-indigo-600 font-bold hover:no-underline" onClick={() => { setSearchQuery(""); setCategoryFilter("all"); }}>
                                    Clear all filters
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Version History Sheet */}
                <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                    <SheetContent className="sm:max-w-md bg-white border-none shadow-2xl p-0 font-sans">
                        <SheetHeader className="p-8 border-b border-slate-50">
                            <SheetTitle className="text-2xl font-black tracking-tight">Version History</SheetTitle>
                            <SheetDescription className="font-bold text-slate-400 text-[10px] tracking-wide">
                                Audit trail for {selectedPolicy?.title}
                            </SheetDescription>
                        </SheetHeader>
                        <div className="p-8 relative custom-scrollbar overflow-y-auto max-h-[calc(100vh-140px)]">
                            <div className="absolute left-10 top-10 bottom-10 w-px bg-slate-100" />
                            <div className="space-y-10 text-start">
                                {selectedPolicy?.versions.map((version, i) => (
                                    <div key={version.id} className="relative pl-12 group">
                                        <div className="absolute left-[-5px] top-1.5 w-3 h-3 rounded-full bg-white border-4 border-indigo-600 shadow-md group-hover:scale-125 transition-transform z-10" />
                                        <div className="flex flex-col gap-3 p-6 bg-slate-50/50 rounded-2xl border border-slate-50 group-hover:border-indigo-100 group-hover:bg-indigo-50/30 transition-all">
                                            <div className="flex items-center justify-between">
                                                <span className="font-black text-indigo-900 text-sm">v{version.version}</span>
                                                <span className="text-[10px] font-black text-slate-400 tracking-wide">{new Date(version.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-xs font-bold text-slate-600 leading-relaxed">{version.changeLog}</p>
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-100/50 mt-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-lg bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600">
                                                        {version.updatedBy.charAt(0)}
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-900 tracking-tight">{version.updatedBy}</span>
                                                </div>
                                                <Button variant="ghost" className="h-8 rounded-lg text-indigo-600 font-bold text-[9px] tracking-wide hover:bg-white">
                                                    <Download size={12} className="mr-1.5" /> Recover
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Edit Policy Dialog */}
                <Dialog open={!!editingPolicy} onOpenChange={(open) => !open && setEditingPolicy(null)}>
                    <DialogContent className="max-w-4xl bg-white rounded-[2rem] border border-slate-200 p-10 shadow-3xl font-sans" style={{ zoom: "80%" }}>
                        <DialogHeader className="mb-4 text-start">
                            <DialogTitle className="text-3xl font-black tracking-tight text-slate-900">Synchronize Policy</DialogTitle>
                            <DialogDescription className="font-bold text-slate-400 text-xs tracking-wide">
                                Update organizational blueprints for current compliance cycle.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-3 gap-x-8 gap-y-6 py-8">
                            <div className="col-span-2 space-y-2.5 text-start">
                                <label className="text-[11px] font-bold tracking-wide text-slate-500 ml-1">Document Title</label>
                                <Input
                                    placeholder="Policy title..."
                                    value={editingPolicy?.title || ""}
                                    onChange={(e) => setEditingPolicy(prev => prev ? { ...prev, title: e.target.value } : null)}
                                    className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-sm shadow-sm"
                                />
                            </div>
                            <div className="space-y-2.5 text-start">
                                <label className="text-[11px] font-bold tracking-wide text-slate-500 ml-1">Classification</label>
                                <Select
                                    value={editingPolicy?.category}
                                    onValueChange={(val: any) => setEditingPolicy(prev => prev ? { ...prev, category: val } : null)}
                                >
                                    <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold text-xs">
                                        {categories.map(cat => (
                                            <SelectItem key={cat} value={cat} className="rounded-xl h-10">{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2.5 text-start">
                                <label className="text-[11px] font-bold tracking-wide text-slate-500 ml-1">Status Cycle</label>
                                <Select
                                    value={editingPolicy?.status}
                                    onValueChange={(val: any) => setEditingPolicy(prev => prev ? { ...prev, status: val } : null)}
                                >
                                    <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold text-xs">
                                        <SelectItem value="Active" className="rounded-xl h-10">🌍 Active (Published)</SelectItem>
                                        <SelectItem value="Draft" className="rounded-xl h-10">📝 Internal Draft</SelectItem>
                                        <SelectItem value="Archived" className="rounded-xl h-10">📦 Legacy Archive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-2 space-y-2.5 text-start">
                                <label className="text-[11px] font-bold tracking-wide text-slate-500 ml-1">Documentation Summary</label>
                                <Textarea
                                    rows={3}
                                    value={editingPolicy?.description || ""}
                                    onChange={(e) => setEditingPolicy(prev => prev ? { ...prev, description: e.target.value } : null)}
                                    className="bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 py-4 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all min-h-[100px] text-sm shadow-sm"
                                />
                            </div>
                        </div>
                        <DialogFooter className="gap-3 mt-4">
                            <Button variant="ghost" onClick={() => setEditingPolicy(null)} className="h-12 rounded-xl font-bold text-[11px] tracking-wide transition-all px-8 hover:bg-slate-50">Discard</Button>
                            <Button onClick={handleUpdatePolicy} className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-12 px-10 font-bold shadow-xl shadow-indigo-100 transition-all text-[11px] tracking-wide border-none">Save Documentation</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
};

export default PolicyPage;
