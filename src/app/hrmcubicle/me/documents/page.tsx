"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    FolderOpen,
    Download,
    Eye,
    Upload,
    ShieldCheck,
    Search,
    ChevronRight,
    MoreVertical,
    FileImage,
    FileSignature,
    FileArchive,
    History,
    Info as InfoIcon,
    Plus,
    LayoutGrid,
    List,
    MousePointer2,
    Lock,
    Settings,
    Share2,
    Edit3,
    Trash2,
    CheckSquare,
    Square,
    AlertTriangle,
    CheckCircle2
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/components/ui/use-toast";
import { Progress } from "@/shared/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Checkbox } from "@/shared/components/ui/checkbox";

import { useMeStore } from "@/shared/data/me-store";

const MyDocumentsPage = () => {
    const { toast } = useToast();
    const { documents: storeDocs } = useMeStore();
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");

    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isComplianceOpen, setIsComplianceOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [isDocUnlocked, setIsDocUnlocked] = useState(false);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
    const [localDocs, setLocalDocs] = useState<any[]>([]);
    const [uploadForm, setUploadForm] = useState({ name: "", category: "Personal" });
    const [deleteConfirm, setDeleteConfirm] = useState<{ ids: string[]; bulk: boolean } | null>(null);

    const allDocs = [...localDocs, ...storeDocs].filter(d => !deletedIds.has(d.id));

    const categories = [
        { name: "Identity Docs", filter: "Personal", count: allDocs.filter(d => d.cat === 'Personal').length, icon: <FileText size={16} />, color: "from-indigo-600 to-indigo-400", bg: "bg-indigo-100", border: "border-indigo-200" },
        { name: "Company Policies", filter: "Company", count: allDocs.filter(d => d.cat === 'Company').length, icon: <ShieldCheck size={16} />, color: "from-rose-600 to-rose-400", bg: "bg-rose-100", border: "border-rose-200" },
        { name: "Financial / Tax", filter: "Financial", count: allDocs.filter(d => d.cat === 'Financial').length, icon: <FileSignature size={16} />, color: "from-emerald-600 to-emerald-400", bg: "bg-emerald-100", border: "border-emerald-200" },
        { name: "Certifications", filter: "Certifications", count: allDocs.filter(d => d.cat === 'Certifications').length, icon: <FolderOpen size={16} />, color: "from-amber-600 to-amber-400", bg: "bg-amber-100", border: "border-amber-200" },
    ];

    const documents = allDocs.map(doc => {
        // Adding dummy expiry dates for logic demonstration
        let expiryStatus = null;
        if (doc.name.includes("Aadhar")) expiryStatus = { date: "12 Dec 2030", label: "Valid", color: "text-emerald-500" };
        if (doc.name.includes("Offer")) expiryStatus = { date: "N/A", label: "Permanent", color: "text-slate-400" };

        return {
            ...doc,
            type: doc.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image',
            expiry: expiryStatus
        };
    }).filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (categoryFilter === "All" || doc.cat === categoryFilter)
    );

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === documents.length) setSelectedIds([]);
        else setSelectedIds(documents.map(d => d.id));
    };

    const handleUpload = () => {
        const name = uploadForm.name.trim();
        if (!name) {
            toast({ title: "Filename required", description: "Please enter a name for the document.", variant: "destructive" });
            return;
        }
        if (name.length > 255) {
            toast({ title: "Name too long", description: "Filename must be under 255 characters.", variant: "destructive" });
            return;
        }
        // Extract extension if present and validate
        const dotIndex = name.lastIndexOf(".");
        if (dotIndex > -1) {
            const ext = name.slice(dotIndex + 1).toLowerCase();
            const allowed = ["pdf", "jpg", "jpeg", "png"];
            if (!allowed.includes(ext)) {
                toast({ title: "Unsupported file type", description: "Only PDF, JPG, or PNG files are accepted.", variant: "destructive" });
                return;
            }
        }
        setIsUploading(true);
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setIsUploading(false);
                setIsUploadOpen(false);
                setUploadProgress(0);
                const newId = `local-${Date.now()}`;
                const newDoc = {
                    id: newId,
                    name: uploadForm.name.includes(".") ? uploadForm.name : `${uploadForm.name}.pdf`,
                    cat: uploadForm.category,
                    size: "0.5 MB",
                    uploadedAt: new Date().toISOString().split("T")[0],
                };
                setLocalDocs(prev => [newDoc, ...prev]);
                setUploadForm({ name: "", category: "Personal" });
                toast({ title: "Upload Complete", description: `"${newDoc.name}" has been encrypted and stored in the vault.` });
            }
        }, 150);
    };

    const confirmDelete = (ids: string[], bulk = false) => {
        setDeleteConfirm({ ids, bulk });
    };

    const executeDelete = () => {
        if (!deleteConfirm) return;
        const idsToDelete = deleteConfirm.ids;
        setDeletedIds(prev => {
            const next = new Set(prev);
            idsToDelete.forEach(id => next.add(id));
            return next;
        });
        setLocalDocs(prev => prev.filter(d => !idsToDelete.includes(d.id)));
        setSelectedIds(prev => prev.filter(id => !idsToDelete.includes(id)));
        toast({
            title: deleteConfirm.bulk ? "Documents deleted" : "Document deleted",
            description: `${idsToDelete.length} record${idsToDelete.length !== 1 ? "s" : ""} removed from your vault.`,
        });
        setDeleteConfirm(null);
    };

    const handleDeleteBulk = () => {
        if (selectedIds.length === 0) {
            toast({ title: "Select documents first", description: "Choose files to delete using the checkbox.", variant: "destructive" });
            return;
        }
        confirmDelete(selectedIds, true);
    };

    const handleDeleteSingle = (id: string) => {
        confirmDelete([id], false);
    };

    const handleDownloadBulk = () => {
        toast({
            title: "Bulk Download Initiated",
            description: `Preparing encrypted ZIP for ${selectedIds.length} files.`
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans relative" style={{ zoom: "90%" }}>
            <header className="py-2.5 px-8 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm rounded-b-3xl">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1 text-start">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Secure Documents</h1>
                        <p className="text-slate-500 font-semibold text-sm flex items-center gap-2">
                            <Lock size={14} className="text-[#6366f1]" />
                            End-to-end encrypted storage for your critical professional records
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-sm mr-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`h-9 w-9 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#6366f1] text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
                                onClick={() => setViewMode("list")}
                            >
                                <List size={18} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`h-9 w-9 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#6366f1] text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
                                onClick={() => setViewMode("grid")}
                            >
                                <LayoutGrid size={18} />
                            </Button>
                        </div>
                        <Button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100/50 transition-all active:scale-95 group border-none"
                            onClick={() => setIsUploadOpen(true)}
                        >
                            <Upload className="mr-2 h-4 w-4 group-hover:-translate-y-1 transition-transform" />
                            Upload File
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-8 max-w-[1600px] mx-auto w-full space-y-8">

                {/* Categories */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.map((cat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                            <Card
                                className={`border ${categoryFilter === cat.filter ? 'ring-2 ring-indigo-500' : ''} ${cat.border} shadow-sm rounded-2xl p-6 text-start group cursor-pointer hover:shadow-md transition-all ${cat.bg} relative overflow-hidden`}
                                onClick={() => setCategoryFilter(categoryFilter === cat.filter ? "All" : cat.filter)}
                            >
                                <div className={`absolute top-0 right-0 h-20 w-20 bg-gradient-to-br ${cat.color} opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-125 transition-all rounded-bl-[3rem]`}></div>
                                <div className="flex flex-col gap-5 relative z-10">
                                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform`}>
                                        {React.cloneElement(cat.icon as React.ReactElement, { size: 16 })}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-slate-900 tracking-tight leading-none">{cat.name}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold tracking-tight mt-1">{cat.count} {cat.count === 1 ? 'Item' : 'Items'} Store</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-10">
                    <div className="lg:col-span-8 space-y-6">
                        <Card className="border border-indigo-100 shadow-sm rounded-[2rem] overflow-hidden bg-gradient-to-br from-indigo-50/60 via-purple-50/60 to-pink-50/60 h-fit">
                            <CardHeader className="p-8 border-b border-white/50 text-start flex flex-row items-center justify-between backdrop-blur-sm">
                                <div className="flex items-center gap-4">
                                    <Checkbox
                                        checked={selectedIds.length === documents.length && documents.length > 0}
                                        onCheckedChange={toggleSelectAll}
                                        className="h-5 w-5 rounded-md border-indigo-200 data-[state=checked]:bg-indigo-600"
                                    />
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl font-bold text-slate-900 tracking-tight leading-none">Resource Manager</CardTitle>
                                        <CardDescription className="text-[11px] font-bold text-slate-500">Managed via AES-256 cryptographic protocol.</CardDescription>
                                    </div>
                                </div>
                                <div className="relative w-64 hidden md:block">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" size={16} />
                                    <Input
                                        className="h-10 rounded-xl border-white bg-white/80 shadow-sm pl-11 text-xs font-bold placeholder:text-indigo-300 focus:ring-4 focus:ring-indigo-200/50 transition-all text-indigo-900"
                                        placeholder="Search records..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {viewMode === 'list' ? (
                                    <div className="divide-y divide-slate-50">
                                        {documents.length > 0 ? documents.map((doc, i) => (
                                            <div key={i} className={`group flex items-center p-6 hover:bg-white/80 transition-all text-start gap-6 cursor-pointer ${selectedIds.includes(doc.id) ? 'bg-indigo-50/30' : ''}`} onClick={() => setDetailDoc(doc)}>
                                                <Checkbox
                                                    checked={selectedIds.includes(doc.id)}
                                                    onCheckedChange={() => toggleSelect(doc.id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="h-5 w-5 rounded-md border-indigo-100"
                                                />
                                                <div className="h-12 w-12 bg-white ring-1 ring-slate-100 shadow-sm rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                    {doc.type === 'pdf' ? <FileText className="text-rose-500" size={24} /> : <FileImage className="text-indigo-600" size={24} />}
                                                </div>
                                                <div className="flex-1 space-y-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-slate-900 truncate tracking-tight group-hover:text-indigo-600 transition-colors">{doc.name}</h4>
                                                    <div className="flex items-center gap-3">
                                                        <p className="text-[10px] text-slate-400 font-bold tracking-tight">{doc.size} • {doc.date}</p>
                                                        {doc.expiry && (
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-slate-300 text-[10px]">•</span>
                                                                <span className={`text-[9px] font-bold ${doc.expiry.color}`}>Exp: {doc.expiry.date}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="hidden lg:block">
                                                    <Badge variant="outline" className="border-slate-100 bg-white text-slate-400 text-[10px] font-bold px-3 py-0.5 rounded-full shadow-sm">{doc.cat}</Badge>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-300 hover:text-indigo-600 hover:bg-white transition-all border-none" onClick={(e) => { e.stopPropagation(); setSelectedDoc(doc); setIsPreviewOpen(true); }} title="Preview">
                                                        <Eye size={16} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-300 hover:text-emerald-500 hover:bg-white transition-all border-none" onClick={(e) => { e.stopPropagation(); toast({ title: "Secure Download", description: `Downloading ${doc.name}...` }); }} title="Download">
                                                        <Download size={16} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-white transition-all border-none" onClick={(e) => { e.stopPropagation(); handleDeleteSingle(doc.id); }} title="Delete">
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-12 text-center">
                                                <h4 className="text-sm font-bold text-slate-400">No records found matching criteria.</h4>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {documents.map((doc, i) => (
                                            <div key={i} className={`relative group cursor-pointer`} onClick={() => setDetailDoc(doc)}>
                                                <div className={`absolute top-2 left-2 z-20`} onClick={(e) => { e.stopPropagation(); toggleSelect(doc.id); }}>
                                                    <Checkbox checked={selectedIds.includes(doc.id)} className="h-4 w-4 rounded border-indigo-200" />
                                                </div>
                                                <Card className={`bg-white border rounded-2xl p-6 text-center transition-all ${selectedIds.includes(doc.id) ? 'ring-2 ring-indigo-500 border-transparent shadow-md' : 'border-slate-200/60 shadow-sm hover:shadow-md'}`}>
                                                    <div className="h-20 w-20 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                                                        {doc.type === 'pdf' ? <FileText className="text-rose-400" size={32} /> : <FileImage className="text-indigo-400" size={32} />}
                                                    </div>
                                                    <h4 className="text-xs font-bold text-slate-900 truncate tracking-tight">{doc.name}</h4>
                                                    <p className="text-[10px] text-slate-400 font-bold mt-1">{doc.size}</p>
                                                </Card>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="py-6 text-center bg-slate-50/20 border-t border-slate-50">
                                    <p className="text-[11px] text-slate-300 font-bold capitalize tracking-widest text-[8px]">Authorized Access Only • AES-256 Protection</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <Card className="h-fit border border-indigo-100 shadow-xl bg-indigo-50/40 text-slate-900 rounded-2xl p-8 text-start relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform duration-700 pointer-events-none text-indigo-600">
                                <History size={150} />
                            </div>
                            <div className="relative z-10 space-y-8">
                                <div className="space-y-3">
                                    <Badge className="bg-white text-indigo-600 border border-indigo-100 font-bold text-[10px] px-3 py-1 tracking-tight shadow-sm capitalize">Vault Status</Badge>
                                    <h3 className="text-2xl font-bold tracking-tight leading-tight">Security Intel</h3>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                        Multi-Factor Authentication is currently **Enabled** for sensitive records.
                                    </p>
                                </div>
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between text-[10px] font-bold capitalize tracking-wide text-slate-400">
                                        <span>Vault Quota</span>
                                        <span className="text-indigo-600 font-bold">12 / 100 GB</span>
                                    </div>
                                    <Progress value={12} className="h-2 bg-white rounded-full" />
                                    <div className="flex items-center gap-3 bg-white/60 p-4 rounded-xl border border-indigo-50">
                                        <div className="h-8 w-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                                            <ShieldCheck size={18} />
                                        </div>
                                        <p className="text-[9px] text-slate-400 font-bold capitalize tracking-wide leading-relaxed">System Health: <span className="text-emerald-600 block font-bold">Encrypted & Secure</span></p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="h-fit border-none shadow-md rounded-2xl p-8 text-start bg-white group cursor-pointer relative overflow-hidden border border-slate-50 hover:shadow-lg transition-all">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-1000">
                                <AlertTriangle size={150} />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className="space-y-4">
                                    <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-md shadow-rose-100 group-hover:rotate-12 transition-transform">
                                        <AlertTriangle size={24} />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Compliance Gap</h4>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                        Your **Degree Certificate** is missing. This is a mandatory requirement for Q1 verification.
                                    </p>
                                </div>
                                <Button
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11 rounded-xl font-bold shadow-lg shadow-indigo-100/50 transition-all active:scale-95 group/btn border-none capitalize text-[11px]"
                                    onClick={() => setIsComplianceOpen(true)}
                                >
                                    Fix Now <MousePointer2 size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Bulk Actions Toolbar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl border border-slate-800"
                    >
                        <div className="flex items-center gap-3 border-r border-slate-700 pr-6 mr-2">
                            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm">
                                {selectedIds.length}
                            </div>
                            <p className="text-xs font-bold text-slate-300">Items Selected</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" className="text-indigo-400 hover:text-white hover:bg-slate-800 font-bold text-xs h-10 px-4 rounded-xl gap-2" onClick={handleDownloadBulk}>
                                <Download size={14} /> Download ZIP
                            </Button>
                            <Button variant="ghost" className="text-rose-400 hover:text-white hover:bg-slate-800 font-bold text-xs h-10 px-4 rounded-xl gap-2" onClick={handleDeleteBulk}>
                                <Trash2 size={14} /> Delete
                            </Button>
                            <div className="w-[1px] h-6 bg-slate-700 mx-2"></div>
                            <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800 font-bold text-xs h-10 px-4 rounded-xl" onClick={() => setSelectedIds([])}>
                                Deselect
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dialogs */}
            <SideFormSheet
                open={isUploadOpen}
                onOpenChange={setIsUploadOpen}
                title="Secure Vault Upload"
                description="AES-256 client-side encryption active."
                icon={<Upload size={20} />}
                accentColor="#4f46e5"
                width="md"
                loading={isUploading}
                submitLabel={isUploading ? "Uploading..." : "Upload & Encrypt"}
                onSubmit={(e) => { e.preventDefault(); handleUpload(); }}
            >
                <div className="space-y-4">
                    {!isUploading ? (
                        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-3 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group">
                            <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                <Plus size={24} className="text-slate-300 group-hover:text-indigo-500" />
                            </div>
                            <p className="text-sm font-bold text-slate-900 leading-none">Drop file to encrypt</p>
                            <p className="text-[10px] text-slate-400">PDF, JPG, PNG · Max 10 MB</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Progress value={uploadProgress} className="h-2 bg-slate-50" />
                            <p className="text-center text-[10px] font-bold text-indigo-600">Encrypting Content... {uploadProgress}%</p>
                        </div>
                    )}
                    <Field label="Document Name" required>
                        <Input
                            value={uploadForm.name}
                            onChange={e => setUploadForm({ ...uploadForm, name: e.target.value })}
                            placeholder="e.g., PAN Card.pdf"
                            disabled={isUploading}
                        />
                    </Field>
                    <Field label="Category">
                        <Select defaultValue="Personal">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Personal">Personal Docs</SelectItem>
                                <SelectItem value="Company">Company Policies</SelectItem>
                                <SelectItem value="Financial">Financial / Tax</SelectItem>
                                <SelectItem value="Certifications">Certifications</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </SideFormSheet>

            <Dialog open={isPreviewOpen} onOpenChange={(val) => { setIsPreviewOpen(val); if (!val) setIsDocUnlocked(false); }}>
                <DialogContent className="bg-white border-slate-100 p-0 max-w-4xl overflow-hidden rounded-[2rem] h-[80vh] flex flex-col shadow-2xl font-sans" style={{ zoom: "90%" }}>
                    <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-600 shadow-inner">
                                {selectedDoc?.type === 'pdf' ? <FileText size={20} /> : <FileImage size={20} />}
                            </div>
                            <div>
                                <DialogTitle className="text-base font-bold text-slate-900 tracking-tight">{selectedDoc?.name || "Preview"}</DialogTitle>
                                <p className="text-[10px] font-bold text-slate-400">Secure Viewer • {selectedDoc?.size}</p>
                            </div>
                        </div>
                        {!isDocUnlocked ? (
                            <Button className="rounded-xl h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 gap-2" onClick={() => setIsDocUnlocked(true)}>
                                Unlock Content <Lock size={14} />
                            </Button>
                        ) : (
                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] px-4 py-2">
                                <CheckCircle2 size={14} className="mr-1.5" /> Unlocked
                            </Badge>
                        )}
                    </div>
                    <div className="flex-1 bg-slate-50/50 flex items-center justify-center p-12">
                        {!isDocUnlocked ? (
                            <div className="w-full max-w-xl aspect-[1/1.4] bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col items-center justify-center text-center p-10 space-y-4">
                                <div className="h-20 w-20 bg-indigo-50 rounded-full flex items-center justify-center">
                                    <ShieldCheck size={40} className="text-indigo-200" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900">Protected Preview</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">This record is end-to-end encrypted. Click 'Unlock' or download to view the full details.</p>
                            </div>
                        ) : (
                            <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-slate-200 p-10 space-y-6 overflow-y-auto max-h-full">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">Document Decrypted</h4>
                                        <p className="text-[10px] text-slate-400 font-bold">Verified and authenticated</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">{selectedDoc?.name}</h3>
                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                        <div className="p-3 bg-slate-50 rounded-xl">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Category</span>
                                            <span className="font-bold text-slate-700">{selectedDoc?.cat}</span>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-xl">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">File Size</span>
                                            <span className="font-bold text-slate-700">{selectedDoc?.size}</span>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-xl">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Upload Date</span>
                                            <span className="font-bold text-slate-700">{selectedDoc?.date}</span>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-xl">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Format</span>
                                            <span className="font-bold text-slate-700 uppercase">{selectedDoc?.type}</span>
                                        </div>
                                    </div>
                                    {selectedDoc?.expiry && (
                                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                            <span className="text-[9px] font-bold text-emerald-500 uppercase block mb-1">Validity</span>
                                            <span className="text-sm font-bold text-emerald-700">{selectedDoc.expiry.label} — Expires {selectedDoc.expiry.date}</span>
                                        </div>
                                    )}
                                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                        <FileText size={48} className="text-slate-200 mx-auto mb-3" />
                                        <p className="text-xs font-bold text-slate-500">Full document content rendered here.</p>
                                        <p className="text-[10px] text-slate-400 mt-1">For security, download the original file for complete access.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isComplianceOpen} onOpenChange={setIsComplianceOpen}>
                <DialogContent className="bg-white rounded-[2rem] border border-slate-200 p-8 max-w-lg shadow-2xl font-sans" style={{ zoom: "90%" }}>
                    <DialogHeader className="space-y-4">
                        <div className="h-14 w-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-inner">
                            <AlertTriangle size={28} />
                        </div>
                        <div className="space-y-1">
                            <DialogTitle className="text-2xl font-bold tracking-tight">Compliance Calibration</DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium">Please resolve missing mandatory records.</DialogDescription>
                        </div>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                            <div className="flex items-center gap-4 text-start">
                                <div className="h-11 w-11 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-rose-500 shadow-sm">
                                    <FileArchive size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Degree Certificate</p>
                                    <p className="text-[10px] font-bold text-rose-500">Status: Missing</p>
                                </div>
                            </div>
                            <Button size="icon" className="h-9 w-9 bg-white text-slate-400 hover:text-indigo-600 rounded-lg shadow-sm border-none" onClick={() => setIsUploadOpen(true)}>
                                <Upload size={14} />
                            </Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 font-bold shadow-lg" onClick={() => setIsComplianceOpen(false)}>I'll do it later</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!deleteConfirm} onOpenChange={v => !v && setDeleteConfirm(null)}>
                <DialogContent className="bg-white rounded-2xl border-none p-8 max-w-md">
                    <DialogHeader className="space-y-3">
                        <div className="h-12 w-12 bg-rose-50 rounded-xl flex items-center justify-center">
                            <Trash2 className="text-rose-600" size={24} />
                        </div>
                        <DialogTitle className="text-xl font-bold">Delete {deleteConfirm?.bulk ? "Documents" : "Document"}?</DialogTitle>
                        <DialogDescription>
                            {deleteConfirm?.ids.length === 1
                                ? "This document will be permanently removed from your vault."
                                : `${deleteConfirm?.ids.length} documents will be permanently removed from your vault.`}
                            {" "}This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3 mt-2">
                        <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                        <Button onClick={executeDelete} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl">
                            <Trash2 size={14} className="mr-2" />Delete {deleteConfirm?.bulk && deleteConfirm.ids.length > 1 ? `${deleteConfirm.ids.length} Documents` : "Document"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
};

export default MyDocumentsPage;
