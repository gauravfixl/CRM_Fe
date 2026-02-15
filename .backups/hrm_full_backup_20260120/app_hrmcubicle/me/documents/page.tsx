"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
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
    Settings
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/components/ui/use-toast";
import { Progress } from "@/shared/components/ui/progress";

import { ME_DATA } from "@/shared/data/me-store";

const MyDocumentsPage = () => {
    const { toast } = useToast();
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [searchQuery, setSearchQuery] = useState("");

    const categories = [
        { name: "Identity Docs", count: 8, icon: <FileText size={20} />, color: "from-indigo-600 to-indigo-400" },
        { name: "Company Policies", count: 4, icon: <ShieldCheck size={20} />, color: "from-rose-600 to-rose-400" },
        { name: "Financial / Tax", count: 12, icon: <FileSignature size={20} />, color: "from-emerald-600 to-emerald-400" },
        { name: "Certifications", count: 3, icon: <FolderOpen size={20} />, color: "from-amber-600 to-amber-400" },
    ];

    const documents = ME_DATA.documents.map(doc => ({
        ...doc,
        size: "2.4 MB",
        type: doc.name.endsWith('.pdf') ? 'pdf' : 'image'
    })).filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                <div className="space-y-1 text-start">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">Secure Documents</h1>
                    <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                        <Lock size={14} className="text-[#6366f1]" />
                        End-to-end encrypted storage for your critical professional records
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 mr-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-9 w-9 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#6366f1] text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
                            onClick={() => {
                                setViewMode("list");
                                toast({ title: "View Switched", description: "Displaying documents in sequential list mode." });
                            }}
                        >
                            <List size={18} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-9 w-9 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#6366f1] text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
                            onClick={() => {
                                setViewMode("grid");
                                toast({ title: "View Switched", description: "Displaying documents in modern grid layout." });
                            }}
                        >
                            <LayoutGrid size={18} />
                        </Button>
                    </div>
                    <Button
                        className="bg-[#6366f1] hover:bg-[#5558e6] text-white rounded-xl h-12 px-8 font-black shadow-xl shadow-indigo-100 transition-all active:scale-95 group"
                        onClick={() => toast({ title: "Upload Ready", description: "Select source files to securely encrypt and upload." })}
                    >
                        <Upload className="mr-2 h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                        UPLOAD FILE
                    </Button>
                </div>
            </div>

            {/* Document Categories Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {categories.map((cat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] p-8 text-start group cursor-pointer hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all bg-white relative overflow-hidden">
                            <div className={`absolute top-0 right-0 h-24 w-24 bg-gradient-to-br ${cat.color} opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-125 transition-all rounded-bl-[4rem]`}></div>
                            <div className="flex flex-col gap-6 relative z-10">
                                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform`}>
                                    {cat.icon}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-base font-black text-slate-900 tracking-tight leading-none">{cat.name}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">{cat.count} Items Store</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-10">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-8">
                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[3rem] overflow-hidden bg-white">
                        <CardHeader className="p-12 border-b border-slate-50 text-start flex flex-row items-center justify-between bg-slate-50/20">
                            <div className="space-y-2">
                                <CardTitle className="text-2xl font-black text-slate-900 tracking-tight leading-none">Resource Manager</CardTitle>
                                <CardDescription className="text-sm font-medium text-slate-500">Managed via AES-256 standard cryptographic protocol.</CardDescription>
                            </div>
                            <div className="relative w-80 hidden md:block">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <Input
                                    className="h-14 rounded-2xl border-slate-100 bg-white shadow-xl shadow-slate-100/50 pl-14 text-sm font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-100/30 transition-all"
                                    placeholder="Search by filename..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {viewMode === 'list' ? (
                                <div className="divide-y divide-slate-50">
                                    {documents.length > 0 ? documents.map((doc, i) => (
                                        <div key={i} className="group flex items-center p-10 hover:bg-slate-50/50 transition-all text-start gap-8 cursor-pointer">
                                            <div className="h-16 w-16 bg-white ring-1 ring-slate-100 shadow-xl shadow-slate-100/50 rounded-2xl flex items-center justify-center text-slate-400 shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                                {doc.type === 'pdf' ? <FileText className="text-rose-500" size={32} /> : <FileImage className="text-[#6366f1]" size={32} />}
                                            </div>
                                            <div className="flex-1 space-y-2 min-w-0">
                                                <h4 className="text-base font-black text-slate-900 truncate tracking-tight group-hover:text-[#6366f1] transition-colors">{doc.name}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{doc.size} • Encrypted {doc.date}</p>
                                            </div>
                                            <div className="hidden lg:block">
                                                <Badge variant="outline" className="border-slate-100 bg-white text-slate-400 text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-sm">{doc.cat}</Badge>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl text-slate-300 hover:text-[#6366f1] hover:bg-indigo-50 shadow-sm border border-slate-50 transition-all" onClick={() => toast({ title: "Decryption Service", description: `Authorizing access for ${doc.name}. Decrypting...` })}>
                                                    <Eye size={20} />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 shadow-sm border border-slate-50 transition-all" onClick={() => toast({ title: "Secure Download", description: `Generating unique download link for ${doc.name}.` })}>
                                                    <Download size={20} />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl text-slate-300 hover:bg-slate-100 transition-all" onClick={() => toast({ title: "More Options", description: "Loading document control menu..." })}>
                                                    <MoreVertical size={20} />
                                                </Button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-20 text-center space-y-4 opacity-50">
                                            <Search size={48} className="mx-auto text-slate-200" />
                                            <p className="font-black text-slate-400 uppercase tracking-widest">No matching documents found</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-12 grid grid-cols-2 md:grid-cols-3 gap-10">
                                    {documents.map((doc, i) => (
                                        <Card key={i} className="border border-slate-50 shadow-xl shadow-slate-100/50 rounded-[2.5rem] p-10 text-center group hover:bg-slate-50 transition-all cursor-pointer relative overflow-hidden" onClick={() => toast({ title: "Preview Mode", description: `Opening ${doc.name} in secure reader.` })}>
                                            <div className="h-32 bg-white ring-1 ring-slate-100 shadow-inner rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform relative z-10">
                                                {doc.type === 'pdf' ? <FileText className="text-rose-500" size={56} /> : <FileImage className="text-[#6366f1]" size={56} />}
                                            </div>
                                            <div className="relative z-10 space-y-2">
                                                <h4 className="text-sm font-black text-slate-800 truncate leading-none tracking-tight">{doc.name}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{doc.size}</p>
                                            </div>
                                            <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-all"></div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                            <div className="p-12 text-center bg-slate-50/20 border-t border-slate-50">
                                <p className="text-[11px] text-slate-300 font-black uppercase tracking-[0.3em]">Authorized Access Only • User session: 0xA4F2B</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-4 space-y-10">
                    <Card className="border-none shadow-2xl bg-[#0f172a] text-white rounded-[3rem] p-12 text-start relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.05] group-hover:rotate-12 transition-transform duration-700 pointer-events-none grayscale">
                            <History size={180} />
                        </div>
                        <div className="relative z-10 space-y-10">
                            <div className="space-y-4">
                                <Badge className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-black text-[10px] px-4 py-1 uppercase tracking-widest">VAULT PROTOCOL</Badge>
                                <h3 className="text-3xl font-black tracking-tighter leading-tight">Security Intel</h3>
                                <p className="text-sm text-white/50 font-medium leading-relaxed">
                                    Multi-Factor Authentication and bio-key verification are required for sensitive HR records.
                                </p>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-white/30">
                                    <span>Quota Consumption</span>
                                    <span className="text-emerald-400">12.4%</span>
                                </div>
                                <Progress value={12.4} className="h-3 bg-white/10 rounded-full" />
                                <div className="flex items-center gap-4 bg-white/5 p-5 rounded-[2rem] border border-white/10">
                                    <div className="h-10 w-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed">Last verified access: <span className="text-white block mt-1 font-black">Today, 02:24 PM</span></p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[3rem] p-12 text-start bg-white group cursor-pointer relative overflow-hidden border border-slate-50 hover:shadow-2xl transition-all">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                            <InfoIcon size={180} />
                        </div>
                        <div className="relative z-10 space-y-8">
                            <div className="space-y-4">
                                <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-100 mb-6 group-hover:rotate-12 transition-transform">
                                    <Plus size={28} />
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Compliance Gap</h4>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                    You have **2 pending** mandatory validation tasks. Please sync your Degree Certificate PDF.
                                </p>
                            </div>
                            <Button
                                className="w-full bg-[#6366f1] hover:bg-[#5558e6] text-white h-16 rounded-[1.2rem] font-black shadow-xl shadow-indigo-100 transition-all active:scale-95 group/btn"
                                onClick={() => toast({ title: "Compliance Wizard", description: "Scanning local storage for identified certificate tags..." })}
                            >
                                FIX COMPLIANCE <MousePointer2 size={18} className="ml-3 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MyDocumentsPage;
