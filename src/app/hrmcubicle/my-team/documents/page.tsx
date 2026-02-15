"use client"

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Folder,
    FileText,
    Search,
    Download,
    Eye,
    Share2,
    MoreHorizontal,
    Plus,
    ShieldCheck,
    Lock,
    History,
    FileCheck,
    Briefcase,
    Zap,
    TrendingUp,
    Filter,
    X,
    FileCode,
    Archive,
    Maximize2,
    RotateCw,
    ZoomIn,
    ZoomOut,
    Printer,
    FileUp,
    ChevronLeft,
    ChevronRight,
    Settings
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/shared/components/ui/dropdown-menu";
import { useToast } from "@/shared/components/ui/use-toast";

const TeamDocumentsPage = () => {
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [fileTypeFilter, setFileTypeFilter] = useState("all");
    const [isRecentOnly, setIsRecentOnly] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [extraCategories, setExtraCategories] = useState<string[]>([]);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [selectedUploadCategory, setSelectedUploadCategory] = useState("Handbooks");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [documents, setDocuments] = useState([
        { id: 1, name: "Employee Handbook 2026.pdf", format: "PDF", category: "Handbooks", date: "Jan 01, 2026", owner: "HR Dept", status: "Active", size: "4.2 MB", timestamp: new Date('2026-01-01').getTime() },
        { id: 2, name: "Social Media Guidelines.pdf", format: "PDF", category: "Policies", date: "Jan 05, 2026", owner: "Legal", status: "Published", size: "1.1 MB", timestamp: new Date('2026-01-05').getTime() },
        { id: 3, name: "Offer Letter Template_v4.docx", format: "DOCX", category: "Templates", date: "Jan 10, 2026", owner: "HR Team", status: "Managed", size: "850 KB", timestamp: new Date('2026-01-10').getTime() },
        { id: 4, name: "Q1 Productivity Roadmap.pdf", format: "PDF", category: "Handbooks", date: "Jan 15, 2025", owner: "Strategy", status: "Confidential", size: "2.5 MB", timestamp: new Date('2025-01-15').getTime() },
        { id: 5, name: "Branding Assets Kit.zip", format: "ZIP", category: "Media Assets", date: "Dec 20, 2025", owner: "Design", status: "Active", size: "15.4 MB", timestamp: new Date('2025-12-20').getTime() },
        { id: 6, name: "Leave Policy v2.pdf", format: "PDF", category: "Policies", date: "Jan 20, 2026", owner: "HR Dept", status: "Active", size: "1.2 MB", timestamp: new Date('2026-01-20').getTime() },
        { id: 7, name: "Email Signature Template.docx", format: "DOCX", category: "Templates", date: "Jan 22, 2026", owner: "Design", status: "Active", size: "300 KB", timestamp: new Date('2026-01-22').getTime() },
    ]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const categories = [
        { label: "Handbooks", icon: <Briefcase />, color: "text-indigo-600", bg: "bg-indigo-100", cardBg: "bg-indigo-100", borderColor: "border-indigo-200" },
        { label: "Policies", icon: <ShieldCheck />, color: "text-emerald-600", bg: "bg-emerald-100", cardBg: "bg-emerald-100", borderColor: "border-emerald-200" },
        { label: "Templates", icon: <FileText />, color: "text-amber-600", bg: "bg-amber-100", cardBg: "bg-amber-100", borderColor: "border-amber-200" },
        { label: "Media Assets", icon: <Zap />, color: "text-rose-600", bg: "bg-rose-100", cardBg: "bg-rose-100", borderColor: "border-rose-200" }
    ];

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || doc.category === selectedCategory;
        const matchesType = fileTypeFilter === "all" || doc.format.toLowerCase() === fileTypeFilter.toLowerCase();
        const matchesRecent = !isRecentOnly || (Date.now() - doc.timestamp < 7 * 24 * 60 * 60 * 1000); // Last 7 days
        return matchesSearch && matchesCategory && matchesType && matchesRecent;
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedFile(e.target.files[0]);
        }
    };

    const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const nameInput = formData.get('name') as string;
        const category = formData.get('category') as string;

        const name = nameInput || (uploadedFile?.name || "Untitled Document");
        const format = name.split('.').pop()?.toUpperCase() || "PDF";
        const size = uploadedFile ? (uploadedFile.size / (1024 * 1024)).toFixed(1) + " MB" : "0.5 MB";

        const newDoc = {
            id: Date.now(),
            name: name,
            format: format,
            category,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            owner: "You",
            status: "Active",
            size: size,
            timestamp: Date.now()
        };

        setDocuments([newDoc, ...documents]);
        setIsUploadOpen(false);
        setUploadedFile(null);
        setSelectedUploadCategory("Handbooks"); // Reset to default
        toast({ title: "File Uploaded", description: `${name} has been added to ${category}.` });
    };

    if (!mounted) return null;

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans relative" style={{ zoom: "80%" }}>
            <header className="py-2.5 px-8 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm rounded-b-3xl">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="text-start">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-none">Team Repository</h1>
                        <p className="text-slate-500 font-semibold text-sm mt-2">Shared team assets, policy documents, and employee letters.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant={isRecentOnly ? "default" : "outline"}
                            className={`rounded-xl h-11 border-none shadow-sm font-bold text-[10px] tracking-widest px-5 transition-all ${isRecentOnly ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'}`}
                            onClick={() => setIsRecentOnly(!isRecentOnly)}
                        >
                            <History className="h-4 w-4 mr-2" /> RECENT FILES
                        </Button>
                        <Button
                            className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl font-bold h-11 px-6 shadow-lg shadow-indigo-100 transition-all text-[10px] tracking-widest border-none"
                            onClick={() => setIsUploadOpen(true)}
                        >
                            <Plus className="h-4 w-4 mr-2" /> UPLOAD DOCUMENT
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-8 max-w-[1600px] mx-auto w-full space-y-8">

                {/* Folder shortcuts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((f, i) => (
                        <Card
                            key={i}
                            className={`min-w-[190px] border-2 shadow-sm transition-all cursor-pointer group rounded-[1.75rem] ${f.borderColor} ${selectedCategory === f.label ? 'ring-4 ring-indigo-500/10 bg-white translate-y-[-4px] shadow-xl' : `${f.cardBg} hover:bg-white hover:translate-y-[-2px] hover:shadow-lg`}`}
                            onClick={() => setSelectedCategory(selectedCategory === f.label ? null : f.label)}
                        >
                            <CardContent className="p-5 text-start">
                                <div className={`h-12 w-12 rounded-2xl mb-5 ${f.bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                                    {React.cloneElement(f.icon as React.ReactElement, { size: 20, className: f.color })}
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h4 className="font-black text-slate-800 text-sm tracking-tight">{f.label}</h4>
                                        <p className="text-[10px] font-black text-slate-400 tracking-widest mt-1.5 uppercase">
                                            {documents.filter(d => d.category === f.label).length.toString().padStart(2, '0')} Resources
                                        </p>
                                    </div>
                                    {selectedCategory === f.label ? (
                                        <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                                            <FileCheck size={12} className="text-white" />
                                        </div>
                                    ) : (
                                        <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-slate-100">
                                            <Plus size={12} className="text-slate-400" />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="border-none shadow-sm overflow-hidden bg-white rounded-2xl border border-slate-100/50">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/10 p-6">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search files..."
                                className="pl-10 h-10 rounded-xl border-none bg-slate-100/50 text-sm font-bold focus:bg-white transition-all shadow-inner"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                                <SelectTrigger className="w-[120px] h-10 border-none shadow-sm rounded-xl font-bold text-xs bg-white text-slate-600">
                                    <SelectValue placeholder="Format" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-none shadow-xl rounded-xl">
                                    <SelectItem value="all" className="text-xs font-bold py-2">All Formats</SelectItem>
                                    <SelectItem value="pdf" className="text-xs font-bold py-2">PDF Records</SelectItem>
                                    <SelectItem value="docx" className="text-xs font-bold py-2">Word Files</SelectItem>
                                    <SelectItem value="zip" className="text-xs font-bold py-2">Archives</SelectItem>
                                </SelectContent>
                            </Select>
                            {(selectedCategory || fileTypeFilter !== "all" || isRecentOnly) && (
                                <Button variant="ghost" size="icon" className="h-10 w-10 text-rose-500 hover:bg-rose-50 rounded-xl" onClick={() => {
                                    setSelectedCategory(null);
                                    setFileTypeFilter("all");
                                    setIsRecentOnly(false);
                                }}>
                                    <X size={16} />
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 tracking-widest border-b border-slate-100">
                                        <th className="px-6 py-4">Document</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4 text-center">Owner</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right pr-12">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/30">
                                    {filteredDocuments.length > 0 ? filteredDocuments.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-indigo-50/20 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-9 w-9 flex items-center justify-center rounded-xl shadow-sm border ${doc.format === 'PDF' ? 'bg-rose-50 text-rose-600 border-rose-100/30' :
                                                        doc.format === 'DOCX' ? 'bg-blue-50 text-blue-600 border-blue-100/30' :
                                                            'bg-indigo-50 text-indigo-600 border-indigo-100/30'
                                                        }`}>
                                                        {doc.format === 'ZIP' ? <Archive size={16} /> : <FileText size={16} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 leading-tight truncate max-w-[200px]">{doc.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold mt-1 tracking-tight">{doc.date} • {doc.size}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className={`text-[9px] font-bold tracking-widest px-2.5 py-1 border-none shadow-none ${doc.category === 'Handbooks' ? 'bg-indigo-50 text-indigo-600' :
                                                    doc.category === 'Policies' ? 'bg-emerald-50 text-emerald-600' :
                                                        doc.category === 'Templates' ? 'bg-amber-50 text-amber-600' :
                                                            'bg-rose-50 text-rose-600'
                                                    } rounded-lg`}>
                                                    {doc.category}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-xs font-bold text-slate-600 tracking-tight">{doc.owner}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-bold text-[9px] tracking-widest leading-none">
                                                    <ShieldCheck size={14} className="text-emerald-500" /> {doc.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right pr-6">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm text-slate-400 hover:text-indigo-600 border-none"
                                                        onClick={() => {
                                                            setSelectedFile(doc);
                                                            setIsPreviewOpen(true);
                                                        }}
                                                    >
                                                        <Eye size={14} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm text-slate-400 hover:text-indigo-600 border-none" onClick={() => toast({ title: "Downloading", description: `Fetching ${doc.name} (${doc.size})` })}><Download size={14} /></Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg border-none"><MoreHorizontal size={14} className="text-slate-300" /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl p-1.5 border-none shadow-xl bg-white min-w-[160px]">
                                                            <DropdownMenuItem className="p-2.5 rounded-lg font-bold text-[10px] tracking-widest text-slate-600 cursor-pointer focus:bg-indigo-50" onClick={() => toast({ title: "Sharing", description: "Generating shareable link..." })}>
                                                                <Share2 className="h-3.5 w-3.5 mr-2.5" /> Share Access
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="p-2.5 rounded-lg font-bold text-[10px] tracking-widest text-rose-600 cursor-pointer focus:bg-rose-50" onClick={() => toast({ title: "Archived", description: "File moved to vault history." })}>
                                                                <History className="h-3.5 w-3.5 mr-2.5" /> Archive
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-4">
                                                    <div className="h-16 w-16 bg-slate-50 flex items-center justify-center rounded-2xl text-slate-200">
                                                        <Search size={32} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">No documents found</p>
                                                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">Try adjusting your filters or search query</p>
                                                    </div>
                                                    <Button variant="outline" className="rounded-xl font-bold text-[10px] tracking-widest h-9 border-slate-200" onClick={() => {
                                                        setSearchQuery("");
                                                        setSelectedCategory(null);
                                                        setFileTypeFilter("all");
                                                        setIsRecentOnly(false);
                                                    }}>Reset All Filters</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </main>

            {/* Upload Modal - Redesigned Horizontal Layout */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[3rem] border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] p-0 bg-white max-w-5xl w-[90vw] overflow-hidden z-[99999] ring-1 ring-slate-100">
                    <div className="flex flex-col md:flex-row min-h-[500px]">
                        {/* Left Side: Configuration & Category */}
                        <div className="w-full md:w-[45%] p-10 bg-slate-50/50 border-r border-slate-100 flex flex-col">
                            <div className="mb-10">
                                <div className="h-16 w-16 bg-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-indigo-100 mb-6">
                                    <FileUp size={32} />
                                </div>
                                <DialogTitle className="text-3xl font-black tracking-tighter text-slate-900 leading-none">Asset Configuration</DialogTitle>
                                <DialogDescription className="font-bold text-slate-400 text-[11px] tracking-[0.2em] uppercase mt-3">Define document metadata v2.4</DialogDescription>
                            </div>

                            <form id="upload-form" onSubmit={handleUpload} className="space-y-8 flex-1">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-1">Document Identity</Label>
                                    <Input
                                        name="name"
                                        placeholder={uploadedFile ? uploadedFile.name : "e.g. Annual Compliance 2026"}
                                        className="h-16 bg-white border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-2xl font-bold text-slate-700 transition-all text-sm px-6 shadow-sm"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center ml-1">
                                        <Label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Category Management</Label>
                                        <button
                                            type="button"
                                            onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                                            className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                                        >
                                            {isCreatingCategory ? "Cancel" : "+ Create New"}
                                        </button>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {isCreatingCategory ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex gap-2"
                                            >
                                                <Input
                                                    value={newCategoryName}
                                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                                    placeholder="Enter name..."
                                                    className="h-14 bg-white border-2 border-indigo-100 rounded-xl font-bold text-sm"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        if (newCategoryName.trim()) {
                                                            const cat = newCategoryName.trim();
                                                            setExtraCategories([...extraCategories, cat]);
                                                            setSelectedUploadCategory(cat);
                                                            setNewCategoryName("");
                                                            setIsCreatingCategory(false);
                                                            toast({ title: "Category Created", description: `Added "${cat}" to library.` });
                                                        }
                                                    }}
                                                    className="h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4"
                                                >
                                                    Add
                                                </Button>
                                            </motion.div>
                                        ) : (
                                            <Select
                                                name="category"
                                                value={selectedUploadCategory}
                                                onValueChange={setSelectedUploadCategory}
                                            >
                                                <SelectTrigger className="h-16 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-700 shadow-sm px-6">
                                                    <SelectValue placeholder="Select existing..." />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border-none shadow-2xl rounded-2xl p-2 z-[99999]">
                                                    {categories.map((c, i) => (
                                                        <SelectItem key={i} value={c.label} className="font-bold text-xs py-4 rounded-xl focus:bg-indigo-50 cursor-pointer">{c.label}</SelectItem>
                                                    ))}
                                                    {extraCategories.map((c, i) => (
                                                        <SelectItem key={`extra-${i}`} value={c} className="font-bold text-xs py-4 rounded-xl focus:bg-indigo-50 cursor-pointer text-indigo-600 font-black">{c}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="p-6 bg-indigo-50/50 rounded-[1.5rem] border border-indigo-100 flex items-center gap-4">
                                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Enhanced Security</p>
                                        <p className="text-[9px] font-bold text-indigo-400 mt-1 leading-tight">Document will be encrypted & stored in the internal team vault.</p>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Right Side: Drag & Drop Area */}
                        <div className="flex-1 p-10 flex flex-col justify-center items-center relative overflow-hidden">
                            {/* Visual background element */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />

                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />

                            <div
                                className={`w-full flex-1 border-[3px] border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-6 transition-all cursor-pointer group hover:scale-[0.98] ${uploadedFile ? 'bg-indigo-50/20 border-indigo-200' : 'bg-slate-50/30 border-slate-100 hover:border-indigo-300 hover:bg-slate-50/50'}`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <AnimatePresence mode="wait">
                                    {uploadedFile ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="flex flex-col items-center gap-4"
                                        >
                                            <div className="h-24 w-24 bg-white rounded-[2rem] flex items-center justify-center text-emerald-500 shadow-2xl border-4 border-emerald-50">
                                                <FileCheck size={48} />
                                            </div>
                                            <div className="text-center px-8">
                                                <p className="text-xl font-black text-slate-900 truncate max-w-[300px] leading-tight mb-2">{uploadedFile.name}</p>
                                                <div className="flex items-center justify-center gap-3">
                                                    <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold">{(uploadedFile.size / 1024).toFixed(0)} KB</Badge>
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ready to Archive</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex flex-col items-center gap-5"
                                        >
                                            <div className="h-24 w-24 bg-white rounded-[2rem] flex items-center justify-center text-indigo-600 shadow-2xl border-4 border-indigo-50 group-hover:rotate-12 transition-transform duration-500">
                                                <RotateCw className="group-hover:animate-spin-slow" size={40} />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-black text-slate-800 tracking-tighter mb-2">Drop New Asset Here</p>
                                                <p className="text-[11px] font-bold text-slate-400 tracking-[0.15em] uppercase">Supports PDF, DOCX, ZIP, MEDIA</p>
                                            </div>
                                            <Button variant="outline" className="h-12 rounded-2xl px-8 border-2 border-slate-200 font-bold text-xs uppercase tracking-widest hover:border-indigo-300 hover:text-indigo-600 transition-all">Select manually</Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="w-full pt-10 flex gap-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsUploadOpen(false)}
                                    className="h-16 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all flex-1"
                                >
                                    Discard
                                </Button>
                                <Button
                                    form="upload-form"
                                    type="submit"
                                    disabled={!uploadedFile}
                                    className="h-16 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:grayscale text-white rounded-2xl font-black text-xs tracking-[0.2em] uppercase shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] transition-all active:scale-95 border-none flex-[2]"
                                >
                                    {uploadedFile ? "Initialize Synchronization" : "Select a File to Start"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Enhanced Professional Preview Modal */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[2.5rem] border-none shadow-[0_0_100px_rgba(0,0,0,0.2)] p-0 bg-[#1e1e1e] max-w-7xl w-[95vw] h-[90vh] overflow-hidden flex flex-col z-[9999]">
                    {selectedFile && (
                        <>
                            {/* PDF Viewer Header/Toolbar */}
                            <div className="h-16 bg-[#2d2d2d] border-b border-white/10 flex items-center justify-between px-6 shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 flex items-center justify-center bg-rose-600 text-white rounded-xl shadow-lg">
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="font-black text-white text-sm leading-none tracking-tight">{selectedFile.name}</h4>
                                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                                            <ShieldCheck size={10} className="text-emerald-500" /> Authorized • SECURE VAULT ACCESS
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 bg-[#363636] p-1.5 rounded-2xl border border-white/5 shadow-inner">
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-white/70 hover:text-white rounded-xl hover:bg-white/5 border-none"><ZoomOut size={16} /></Button>
                                    <div className="h-4 w-px bg-white/10 mx-1" />
                                    <span className="text-[10px] font-black text-white/60 w-12 text-center">125%</span>
                                    <div className="h-4 w-px bg-white/10 mx-1" />
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-white/70 hover:text-white rounded-xl hover:bg-white/5 border-none"><ZoomIn size={16} /></Button>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 bg-black/20 px-4 py-2 rounded-xl">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-white/40 hover:text-white rounded-lg border-none"><ChevronLeft size={16} /></Button>
                                        <span className="text-[10px] font-bold text-white mx-2">01 / 12</span>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-white/40 hover:text-white rounded-lg border-none"><ChevronRight size={16} /></Button>
                                    </div>
                                    <div className="h-8 w-px bg-white/10 mx-1" />
                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-white/70 hover:text-white rounded-xl hover:bg-white/10 border-none" onClick={() => toast({ title: "Printing", description: "Preparing document for print..." })}><Printer size={18} /></Button>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-white/70 hover:text-white rounded-xl hover:bg-white/10 border-none" onClick={() => toast({ title: "Authorized", description: "Fetching download stream..." })}><Download size={18} /></Button>
                                    <Button variant="ghost" size="icon" className="h-11 w-11 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-2xl border-none transition-all ml-2" onClick={() => setIsPreviewOpen(false)}><X size={24} /></Button>
                                </div>
                            </div>

                            {/* Viewer Body */}
                            <div className="flex-1 flex overflow-hidden">
                                {/* Left Sidebar (Thumbnails) */}
                                <div className="w-64 bg-[#252525] border-r border-white/5 p-4 flex flex-col gap-4 overflow-y-auto shrink-0 hidden lg:flex">
                                    <Label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 px-2">Thumbnails</Label>
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className={`relative group cursor-pointer transition-all ${i === 1 ? 'ring-2 ring-indigo-500 bg-white/5 p-2 rounded-xl' : 'hover:bg-white/5 p-2 rounded-xl'}`}>
                                            <div className="aspect-[1/1.4] bg-[#333] rounded-lg shadow-2xl flex items-center justify-center p-4">
                                                <div className="w-full space-y-2">
                                                    <div className="h-1 bg-white/10 rounded w-full" />
                                                    <div className="h-1 bg-white/10 rounded w-2/3" />
                                                    <div className="h-1 bg-white/10 rounded w-full" />
                                                    <div className="h-1 bg-white/10 rounded w-1/2" />
                                                </div>
                                            </div>
                                            <span className="absolute bottom-4 right-4 text-[9px] font-bold text-white/20">{i.toString().padStart(2, '0')}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Main Document Rendering Surface */}
                                <div className="flex-1 bg-[#1e1e1e] overflow-auto p-12 flex justify-center custom-scrollbar">
                                    {/* The Document Page */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="relative w-full max-w-4xl min-h-[1400px] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.5)] rounded-sm p-24 text-start font-serif"
                                    >
                                        {/* Document Watermark */}
                                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.03]">
                                            <h1 className="text-[12rem] font-black -rotate-45 select-none uppercase tracking-widest whitespace-nowrap">CONFIDENTIAL</h1>
                                        </div>

                                        {/* Official Header */}
                                        <div className="flex justify-between items-start mb-24 border-b-2 border-slate-900 pb-8">
                                            <div>
                                                <div className="h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-6">
                                                    <Briefcase size={32} />
                                                </div>
                                                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-1">Corporate Repository</h1>
                                                <p className="text-xs font-bold text-slate-500 tracking-[0.3em] uppercase">Document ID: {selectedFile.id}-RESO-2026</p>
                                            </div>
                                            <div className="text-right">
                                                <Badge className="bg-rose-50 text-rose-600 border-2 border-rose-100 font-black text-[10px] tracking-widest px-4 py-1.5 rounded-full mb-6">HIGHLY CLASSIFIED</Badge>
                                                <p className="text-sm font-bold text-slate-900">Effective Date: {selectedFile.date}</p>
                                                <p className="text-sm font-medium text-slate-400">Ver: 4.0.2 Stable</p>
                                            </div>
                                        </div>

                                        {/* Document Content Strategy */}
                                        <div className="space-y-12">
                                            <div className="space-y-6">
                                                <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-indigo-600 pl-6">{selectedFile.name.split('.')[0]}</h2>
                                                <p className="text-lg leading-relaxed text-slate-600 font-medium">
                                                    This document serves as the official record for <span className="text-slate-900 font-bold underline decoration-indigo-300">{selectedFile.category}</span> management.
                                                    All internal teams are required to acknowledge the protocols defined herein by the end of Q1 2026 fiscal cycle.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-12 py-8 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                                <div className="space-y-4">
                                                    <h4 className="text-[10px] font-black text-indigo-400 tracking-[0.25em] uppercase">Section A (Protocol)</h4>
                                                    <div className="space-y-2">
                                                        {[1, 2, 3].map(i => (
                                                            <div key={i} className="flex gap-4">
                                                                <span className="text-xs font-bold text-indigo-600">0{i}.</span>
                                                                <div className="h-2.5 bg-slate-200 rounded-full w-full" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <h4 className="text-[10px] font-black text-emerald-400 tracking-[0.25em] uppercase">Section B (Compliance)</h4>
                                                    <div className="space-y-2">
                                                        {[1, 2, 3].map(i => (
                                                            <div key={i} className="flex gap-4">
                                                                <span className="text-xs font-bold text-emerald-600">0{i}.</span>
                                                                <div className="h-2.5 bg-slate-200 rounded-full w-full" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-8 pt-6">
                                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">1. Executive Summary</h3>
                                                <div className="space-y-4">
                                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                                        <div key={i} className={`h-3 bg-slate-100 rounded-full ${i % 3 === 0 ? 'w-2/3' : 'w-full'} opacity-80`} />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-32 flex justify-between items-end border-t border-slate-100">
                                                <div className="space-y-6">
                                                    <div className="h-20 w-48 border-2 border-indigo-100 bg-indigo-50/20 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                                                        <div className="text-[8px] font-black text-indigo-300 uppercase absolute top-2">Digital Signature</div>
                                                        <div className="h-10 w-32 border-b-2 border-indigo-200 flex items-end justify-center pb-1">
                                                            <span className="font-serif italic text-xl text-indigo-800 opacity-60">HR Director</span>
                                                        </div>
                                                        <div className="text-[6px] font-bold text-slate-300 mt-1">Verified: SHA-256 Protocol</div>
                                                    </div>
                                                    <p className="text-[10px] font-black text-slate-900 tracking-widest uppercase">Authorized By: Senior Management</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="h-24 w-24 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] flex items-center justify-center p-2 mb-4">
                                                        <div className="h-full w-full border-4 border-slate-200 rounded-lg flex flex-col items-center justify-center gap-1 opacity-40">
                                                            <div className="h-1 w-12 bg-slate-300" />
                                                            <div className="h-1 w-8 bg-slate-300" />
                                                            <div className="h-1 w-10 bg-slate-300" />
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Page 01 of 12</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TeamDocumentsPage;
