"use client"

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
    Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useToast } from "@/shared/components/ui/use-toast";

const TeamDocumentsPage = () => {
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    const documents = [
        { id: 1, name: "Sneha Reddy - Offer Letter.pdf", type: "Letter", date: "Jan 12, 2026", owner: "Sneha Reddy", status: "Signed", size: "1.2 MB" },
        { id: 2, name: "Annual Appraisal 2025 - Team.pdf", type: "Appraisal", date: "Jan 05, 2026", owner: "HR Team", status: "Published", size: "2.5 MB" },
        { id: 3, name: "Viral Vora - Promotion Letter.pdf", type: "Letter", date: "Jan 15, 2026", owner: "Viral Vora", status: "Signed", size: "850 KB" },
        { id: 4, name: "Productivity Policy v2.pdf", type: "Policy", date: "Dec 20, 2025", owner: "Admin", status: "Active", size: "4.1 MB" },
    ];

    if (!mounted) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-[#fcfdff] min-h-screen text-start">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Team Repository</h1>
                    <p className="text-slate-500 font-medium">Shared team assets, policy documents, and employee letters.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-xl border-slate-200">
                        <History className="h-4 w-4 mr-2 text-slate-400" /> Recent Downloads
                    </Button>
                    <Button className="bg-[#6366f1] hover:bg-[#4f46e5] rounded-xl font-bold shadow-lg shadow-indigo-100">
                        <Plus className="h-4 w-4 mr-2" /> Upload Document
                    </Button>
                </div>
            </div>

            {/* Folder shortcuts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: "Letters", count: "14 Items", color: "indigo", icon: <FileCheck /> },
                    { label: "Policies", count: "08 Items", color: "amber", icon: <Lock /> },
                    { label: "Appraisals", count: "12 Items", color: "emerald", icon: <TrendingUp /> },
                    { label: "Others", count: "05 Items", color: "rose", icon: <Folder /> }
                ].map((f, i) => (
                    <Card key={i} className="border-none shadow-sm hover:translate-y-[-4px] transition-all cursor-pointer group">
                        <CardContent className="p-6 text-start">
                            <div className={`h-11 w-11 rounded-2xl mb-4 bg-${f.color}-50 text-${f.color}-600 flex items-center justify-center`}>
                                {React.cloneElement(f.icon as React.ReactElement, { size: 20 })}
                            </div>
                            <h4 className="font-black text-slate-800">{f.label}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{f.count}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-none shadow-sm overflow-hidden bg-white text-start">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/30 p-8">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search in files..."
                            className="pl-10 h-12 rounded-2xl border-slate-200 bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="text-slate-400"><Filter size={18} /></Button>
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[140px] h-10 border-slate-200">
                                <SelectValue placeholder="File Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Files</SelectItem>
                                <SelectItem value="pdf">PDF Only</SelectItem>
                                <SelectItem value="docx">Docx Only</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-50">
                            <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                                <th className="px-8 py-4">Document Name</th>
                                <th className="px-8 py-4">Type</th>
                                <th className="px-8 py-4">Owner</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {documents.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())).map((doc) => (
                                <tr key={doc.id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 flex items-center justify-center bg-indigo-50 rounded-xl text-indigo-500">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800">{doc.name}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">Added on {doc.date} • {doc.size}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Badge className={`text-[9px] font-black uppercase tracking-widest px-2 border-none ${doc.type === 'Letter' ? 'bg-indigo-50 text-indigo-600' :
                                            doc.type === 'Appraisal' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                            {doc.type}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-bold text-slate-600">{doc.owner}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase tracking-tighter">
                                            <ShieldCheck size={14} /> {doc.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200 rounded-lg hover:bg-white text-slate-500 hover:text-indigo-600"><Eye size={16} /></Button>
                                            <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200 rounded-lg hover:bg-white text-slate-500 hover:text-indigo-600"><Download size={16} /></Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg"><MoreHorizontal size={16} /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

        </div>
    );
};

export default TeamDocumentsPage;
