"use client";

import React, { useState } from 'react';
import {
    Plus,
    Search,
    Upload,
    Folder,
    File,
    MoreVertical,
    Download,
    Trash2,
    Share2,
    Eye,
    Filter,
    LayoutGrid,
    List,
    ChevronRight,
    HardDrive,
    Info,
    Calendar,
    User,
    CheckCircle,
    Activity,
    ArrowUpRight,
    FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/shared/components/ui/sheet";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { useDocumentsStore, type HRDocument } from "@/shared/data/documents-store";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const HRDocsPage = () => {
    const { hrDocuments, addHRDocument, updateHRDocument, deleteHRDocument, bulkDeleteHRDocuments } = useDocumentsStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedDocForAudit, setSelectedDocForAudit] = useState<HRDocument | null>(null);
    const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
    const [isAuditOpen, setIsAuditOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState<HRDocument | null>(null);

    const categories = ["All", "General", "Compliance", "Benefits", "Training", "Financial", "Onboarding"];

    const filteredDocs = hrDocuments.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const [newDoc, setNewDoc] = useState({
        name: "",
        category: "General",
        status: "Published" as HRDocument['status'],
        fileUrl: "#"
    });

    const handleUpload = () => {
        if (!newDoc.name) {
            toast.error("Please enter a document name");
            return;
        }
        addHRDocument({
            ...newDoc,
            size: "1.2 MB", // Mock size
            uploadedBy: "Admin"
        });
        setIsUploadOpen(false);
        setNewDoc({ name: "", category: "General", status: "Published", fileUrl: "#" });
        toast.success("Document uploaded successfully");
    };

    const handleUpdate = () => {
        if (!editingDoc?.name) {
            toast.error("Document name cannot be empty");
            return;
        }
        updateHRDocument(editingDoc.id, editingDoc);
        setEditingDoc(null);
        toast.success("Document updated successfully");
    };

    const toggleSelect = (id: string) => {
        setSelectedDocIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = () => {
        bulkDeleteHRDocuments(selectedDocIds);
        setSelectedDocIds([]);
        toast.success(`${selectedDocIds.length} documents deleted`);
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "Benefits": return <Badge className="bg-pink-50 text-pink-600 border-none p-1.5"><CheckCircle className="w-3.5 h-3.5" /></Badge>;
            case "Compliance": return <Badge className="bg-amber-50 text-amber-600 border-none p-1.5"><FileText className="w-3.5 h-3.5" /></Badge>;
            case "Training": return <Badge className="bg-emerald-50 text-emerald-600 border-none p-1.5"><Folder className="w-3.5 h-3.5" /></Badge>;
            case "Financial": return <Badge className="bg-blue-50 text-blue-600 border-none p-1.5"><HardDrive className="w-3.5 h-3.5" /></Badge>;
            case "Onboarding": return <Badge className="bg-indigo-50 text-indigo-600 border-none p-1.5"><User className="w-3.5 h-3.5" /></Badge>;
            default: return <Badge className="bg-slate-50 text-slate-500 border-none p-1.5"><File className="w-3.5 h-3.5" /></Badge>;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans relative" style={{ zoom: "80%" }}>
            <div className="grid grid-cols-12 flex-1">
                {/* 1. Left Sidebar Navigator */}
                <div className="col-span-12 lg:col-span-2 border-r border-slate-200 bg-[#f1f5f9] p-8 space-y-12 h-screen sticky top-0">
                    <div className="space-y-8">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[10px] font-bold text-slate-400 tracking-wide ml-1">Repository</h3>
                            <HardDrive size={16} className="text-slate-300" />
                        </div>
                        <nav className="space-y-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`w-full flex items-center justify-between px-4 h-12 rounded-2xl transition-all duration-300 group ${selectedCategory === cat
                                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Folder size={18} className={`${selectedCategory === cat ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} transition-colors`} />
                                        <span className="text-[11px] font-bold tracking-wide">{cat}</span>
                                    </div>
                                    <Badge variant="outline" className={`border-none text-[9px] font-bold py-0 h-5 px-1.5 rounded-lg ${selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        {cat === "All" ? hrDocuments.length : hrDocuments.filter(d => d.category === cat).length}
                                    </Badge>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="pt-8 border-t border-slate-100">
                        <Card className="border border-indigo-200 bg-white shadow-sm p-6 overflow-hidden relative rounded-[2.5rem] group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
                            <div className="absolute top-[-10px] right-[-10px] h-20 w-20 bg-indigo-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <h4 className="text-[10px] font-bold text-indigo-400 tracking-wide mb-4 uppercase">Storage Vault</h4>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-3xl font-black tracking-tight text-slate-900">1.2</span>
                                <span className="text-[10px] text-slate-500 font-bold tracking-wide">/ 2.5 GB</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden border border-slate-200 shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "48%" }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.2)]"
                                />
                            </div>
                            <Button variant="outline" className="w-full h-11 text-[9px] text-indigo-700 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 font-bold tracking-wide rounded-xl transition-all shadow-md">
                                Upgrade Cloud <ArrowUpRight size={14} className="ml-2" />
                            </Button>
                        </Card>
                    </div>
                </div>

                {/* 2. Right Content Area */}
                <div className="col-span-12 lg:col-span-10 flex flex-col bg-[#f8fafc]">
                    <header className="py-2.5 px-8 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm rounded-b-3xl">
                        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="text-start">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">HR Documents</h1>
                                    <Badge className="bg-indigo-50 text-indigo-600 border-none font-bold text-[9px] px-2.5 h-6 rounded-lg tracking-wide">Vault v2.4</Badge>
                                </div>
                                <p className="text-slate-500 font-semibold text-sm mt-1">Manage and secure organizational digital assets with cryptographical precision.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                {selectedDocIds.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-3 bg-white p-2 px-4 rounded-2xl border border-slate-200 shadow-sm"
                                    >
                                        <span className="text-[10px] font-bold text-slate-500">{selectedDocIds.length} Selected</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleBulkDelete}
                                            className="h-8 text-[10px] font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Bulk Delete
                                        </Button>
                                    </motion.div>
                                )}
                                <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-12 px-8 font-bold shadow-lg shadow-indigo-100 transition-all gap-2 text-[10px] tracking-wide border-none">
                                            <Plus size={20} /> Upload New Asset
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-xl bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-3xl font-sans" style={{ zoom: "80%" }}>
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Deposit New Asset</DialogTitle>
                                            <DialogDescription className="font-bold text-slate-400 text-[11px] tracking-wide mt-2 leading-relaxed">
                                                Files are encrypted and stored in the secure end-to-end organizational vault.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-6 py-8">
                                            <div className="space-y-3 text-start">
                                                <label className="text-[10px] font-bold tracking-wide text-slate-400 ml-1">Asset Reference Name</label>
                                                <Input
                                                    placeholder="Internal Security Audit - Q1"
                                                    value={newDoc.name}
                                                    onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                                                    className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-3 text-start">
                                                    <label className="text-[10px] font-bold tracking-wide text-slate-400 ml-1">Classification Target</label>
                                                    <Select value={newDoc.category} onValueChange={(val) => setNewDoc({ ...newDoc, category: val })}>
                                                        <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold text-xs font-sans">
                                                            {categories.filter(c => c !== "All").map(cat => (
                                                                <SelectItem key={cat} value={cat} className="rounded-xl h-10">{cat}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-3 text-start">
                                                    <label className="text-[10px] font-bold tracking-wide text-slate-400 ml-1">Security Visibility</label>
                                                    <Select value={newDoc.status} onValueChange={(val: any) => setNewDoc({ ...newDoc, status: val })}>
                                                        <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-6 focus:bg-white transition-all shadow-sm">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold text-xs font-sans">
                                                            <SelectItem value="Published" className="rounded-xl h-10">Public (Open)</SelectItem>
                                                            <SelectItem value="Internal" className="rounded-xl h-10">Internal (Locked)</SelectItem>
                                                            <SelectItem value="Confidential" className="rounded-xl h-10">Encrypted (Confidential)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="p-10 border-2 border-dashed rounded-[2.5rem] bg-indigo-50/30 border-indigo-200/50 flex flex-col items-center justify-center text-slate-500 hover:bg-indigo-50/50 transition-all cursor-pointer group mt-4 relative overflow-hidden">
                                                <div className="absolute top-[-10px] left-[-10px] h-20 w-20 bg-indigo-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
                                                <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all border border-indigo-100/50 relative z-10">
                                                    <Upload size={30} className="text-indigo-600" />
                                                </div>
                                                <p className="text-sm font-black text-slate-900 tracking-tight leading-tight relative z-10">Drop your secure assets here</p>
                                                <p className="text-[10px] mt-2 text-indigo-400 font-bold tracking-[0.2em] relative z-10">Maximum bitstream: 50MB</p>
                                            </div>
                                        </div>
                                        <DialogFooter className="gap-3">
                                            <Button variant="ghost" onClick={() => setIsUploadOpen(false)} className="h-12 rounded-xl font-bold text-[10px] tracking-wide transition-all px-6">Discard</Button>
                                            <Button onClick={handleUpload} className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-12 px-10 font-bold shadow-lg shadow-indigo-100 transition-all text-[10px] tracking-wide border-none">Secure Upload</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </header>

                    <main className="p-8 max-w-[1600px] mx-auto w-full space-y-8 text-start flex-1 overflow-y-auto">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="relative flex-1 max-w-2xl">
                                <Search className="absolute left-4 top-1/2 -transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Search by name, tags or author..."
                                    className="h-14 pl-12 bg-white border-slate-200 rounded-2xl font-bold text-sm focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-white rounded-2xl border border-slate-100 p-1.5 shadow-sm">
                                    <Button
                                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                                        className={`h-11 px-5 rounded-xl font-bold text-[10px] tracking-wide transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <LayoutGrid size={16} className="mr-2" /> Grid
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                                        className={`h-11 px-5 rounded-xl font-bold text-[10px] tracking-wide transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                        onClick={() => setViewMode('list')}
                                    >
                                        <List size={16} className="mr-2" /> List
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-12">
                                <AnimatePresence mode="popLayout">
                                    {filteredDocs.map((doc) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            key={doc.id}
                                            className="group cursor-pointer"
                                        >
                                            <Card className="border border-slate-300 shadow-sm group-hover:shadow-2xl transition-all duration-500 overflow-hidden bg-slate-50/50 rounded-[2rem] h-full flex flex-col relative border-b-8 border-b-transparent hover:border-b-indigo-500">
                                                <div className="h-36 bg-white flex items-center justify-center border-b border-slate-200 group-hover:bg-indigo-50/30 transition-colors relative">
                                                    <div className="absolute top-4 left-4 z-20">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedDocIds.includes(doc.id)}
                                                            onChange={() => toggleSelect(doc.id)}
                                                            className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer opacity-0 group-hover:opacity-100 checked:opacity-100"
                                                        />
                                                    </div>
                                                    <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-slate-100 relative z-10">
                                                        {doc.name.endsWith('.pdf') ? (
                                                            <div className="text-rose-500 font-bold text-xl">Pdf</div>
                                                        ) : doc.name.endsWith('.xlsx') ? (
                                                            <div className="text-emerald-500 font-bold text-xl">Xls</div>
                                                        ) : (
                                                            <File size={32} className="text-indigo-600" />
                                                        )}
                                                    </div>
                                                    <div className="absolute top-4 right-4 z-20">
                                                        {getCategoryIcon(doc.category)}
                                                    </div>
                                                    <div className="absolute bottom-[-10px] left-[-10px] h-24 w-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                                </div>
                                                <CardContent className="p-6 flex-1 flex flex-col">
                                                    <div className="flex justify-between items-start gap-4 mb-6">
                                                        <div className="flex-1 min-w-0 text-start">
                                                            <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate tracking-tight text-lg leading-tight mb-2">{doc.name}</h4>
                                                            <div className="flex flex-wrap items-center gap-3">
                                                                <span className="text-[10px] text-slate-400 font-bold tracking-wide bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">{doc.size}</span>
                                                                <span className="text-[10px] text-indigo-500 font-bold tracking-wide bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100/50">{doc.status}</span>
                                                            </div>
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-xl transition-all border-none">
                                                                    <MoreVertical size={18} />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-60 p-2 rounded-2xl border-none shadow-2xl bg-white font-sans">
                                                                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold text-slate-400 tracking-wide">Asset Management</DropdownMenuLabel>
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-indigo-50 text-start" onClick={() => { setSelectedDocForAudit(doc); setIsAuditOpen(true); }}>
                                                                    <Activity className="w-4 h-4 text-indigo-500" /> Access Audit Log
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-indigo-50 text-start" onClick={() => setEditingDoc(doc)}>
                                                                    <FileText className="w-4 h-4 text-indigo-500" /> Edit Metadata
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-emerald-50 text-start" onClick={() => toast.success("Secure link generated for download")}>
                                                                    <Download className="w-4 h-4 text-emerald-500" /> Secure Download
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-indigo-50 text-start" onClick={() => toast.success("Public sharing link copied to clipboard")}>
                                                                    <Share2 className="w-4 h-4 text-indigo-500" /> Generate Link
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="my-2 bg-slate-50" />
                                                                <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs text-rose-600 hover:bg-rose-50 text-start" onClick={() => deleteHRDocument(doc.id)}>
                                                                    <Trash2 className="w-4 h-4" /> Purge Asset
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[11px] font-black text-slate-500 border border-white shadow-sm ring-1 ring-slate-200">
                                                                {doc.uploadedBy.charAt(0)}
                                                            </div>
                                                            <div className="text-start">
                                                                <p className="text-[10px] font-bold text-slate-900 tracking-wide leading-none">{doc.uploadedBy}</p>
                                                                <p className="text-[9px] text-slate-400 font-bold mt-1 tracking-tight opacity-60">{doc.uploadedAt}</p>
                                                            </div>
                                                        </div>
                                                        {doc.expiryDate && (
                                                            <Badge variant="outline" className="text-[9px] font-bold border-rose-100 text-rose-600 bg-rose-50/50 py-0.5 px-2 rounded-lg tracking-tight">Exp: {doc.expiryDate}</Badge>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Card className="border border-slate-100 shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
                                <div className="overflow-x-auto text-start">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                                <TableHead className="px-8 py-5 text-[10px] font-bold tracking-wide text-slate-400">Asset Name</TableHead>
                                                <TableHead className="px-8 py-5 text-[10px] font-bold tracking-wide text-slate-400">Classification</TableHead>
                                                <TableHead className="px-8 py-5 text-[10px] font-bold tracking-wide text-slate-400">Metadata</TableHead>
                                                <TableHead className="px-8 py-5 text-[10px] font-bold tracking-wide text-slate-400">Security Status</TableHead>
                                                <TableHead className="px-8 py-5 text-[10px] font-bold tracking-wide text-slate-400 text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredDocs.map((doc) => (
                                                <TableRow key={doc.id} className={`group hover:bg-indigo-50/20 transition-all border-b border-slate-50 last:border-0 border-l-4 ${selectedDocIds.includes(doc.id) ? 'border-l-indigo-500 bg-indigo-50/10' : 'border-l-transparent hover:border-l-indigo-500'}`}>
                                                    <TableCell className="px-8 py-6">
                                                        <div className="flex items-center gap-6">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedDocIds.includes(doc.id)}
                                                                onChange={() => toggleSelect(doc.id)}
                                                                className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                                                            />
                                                            <div className="flex items-center gap-4">
                                                                <div className="p-3 rounded-2xl bg-white shadow-sm border border-slate-100 group-hover:scale-110 group-hover:rotate-6 transition-all">
                                                                    <File size={20} className={doc.name.endsWith('.pdf') ? 'text-rose-500' : 'text-indigo-600'} />
                                                                </div>
                                                                <div className="text-start">
                                                                    <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight text-sm mb-1">{doc.name}</p>
                                                                    <span className="text-[10px] font-bold text-slate-400 tracking-wide opacity-60">Authored by {doc.uploadedBy}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-8 py-6">
                                                        <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-none text-[9px] font-bold px-3 h-6 rounded-lg tracking-wide">{doc.category}</Badge>
                                                    </TableCell>
                                                    <TableCell className="px-8 py-6">
                                                        <div className="space-y-1.5 text-start">
                                                            <p className="text-[10px] font-bold text-slate-900 tracking-wide leading-none">{doc.size}</p>
                                                            <p className="text-[9px] font-bold text-slate-400 tracking-tight opacity-60 leading-none">{doc.uploadedAt}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-8 py-6">
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 tracking-wide">
                                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                                                            {doc.status}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-8 py-6 text-right">
                                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-xl transition-all border-none" onClick={() => { setSelectedDocForAudit(doc); setIsAuditOpen(true); }}>
                                                                <Activity size={18} />
                                                            </Button>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-xl transition-all border-none">
                                                                        <MoreVertical size={18} />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-none shadow-2xl bg-white font-sans">
                                                                    <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-indigo-50" onClick={() => setEditingDoc(doc)}>
                                                                        <FileText className="w-4 h-4 text-indigo-500" /> Edit Metadata
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs hover:bg-indigo-50">Secure Share</DropdownMenuItem>
                                                                    <DropdownMenuSeparator className="my-2 bg-slate-50" />
                                                                    <DropdownMenuItem className="gap-3 p-3 rounded-xl cursor-pointer font-bold text-xs text-rose-600 hover:bg-rose-50" onClick={() => deleteHRDocument(doc.id)}>
                                                                        <Trash2 className="w-4 h-4" /> Purge permanently
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </Card>
                        )}
                    </main>
                </div>
            </div>

            <Sheet open={isAuditOpen} onOpenChange={setIsAuditOpen}>
                <SheetContent side="right" className="sm:max-w-md bg-white border-none shadow-[0_0_100px_rgba(0,0,0,0.1)] p-10 font-sans">
                    <SheetHeader className="mb-12 text-start">
                        <div className="w-16 h-16 rounded-[2rem] bg-indigo-50 flex items-center justify-center mb-8 shadow-inner border border-indigo-100/50 ring-4 ring-white">
                            <Activity size={32} className="text-indigo-600" />
                        </div>
                        <SheetTitle className="text-3xl font-black tracking-tight text-slate-900 leading-tight">Security Audit</SheetTitle>
                        <SheetDescription className="font-bold text-slate-400 text-xs mt-4 leading-relaxed tracking-wide">
                            Comprehensive activity log for organizational asset: <br />
                            <span className="text-indigo-600 border-b-2 border-indigo-100 pb-1 mt-2 inline-block">"{selectedDocForAudit?.name}"</span>
                        </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-10 relative pl-2 overflow-y-auto max-h-[calc(100vh-350px)] pr-2 custom-scrollbar">
                        <div className="absolute left-[26px] top-4 bottom-4 w-[2px] bg-slate-100" />
                        {selectedDocForAudit?.auditLog?.map((log, i) => (
                            <div key={i} className="flex gap-8 relative group">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0 z-10 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 scale-100 group-hover:scale-110">
                                    <Activity size={18} />
                                </div>
                                <div className="flex-1 pb-10 border-b border-slate-50 last:border-0 text-start">
                                    <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-wide mb-4 leading-none">{log.action}</p>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold tracking-wide">
                                            <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors"><User size={12} /></div>
                                            {log.user}
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold tracking-wide">
                                            <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors"><Calendar size={12} /></div>
                                            {log.timestamp}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default HRDocsPage;
