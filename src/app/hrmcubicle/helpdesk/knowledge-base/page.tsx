"use client"

import React, { useState } from "react";
import {
    BookOpen,
    Plus,
    Search,
    Filter,
    ChevronRight,
    FileText,
    Eye,
    ThumbsUp,
    Clock,
    MoreHorizontal,
    LayoutGrid,
    LayoutList,
    Trash2,
    Edit,
    Send,
    Archive,
    History,
    Sparkles,
    CheckCircle2,
    BarChart3,
    ArrowUpRight,
    Tag,
    X,
    Save,
    Zap
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/shared/components/ui/sheet";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Separator } from "@/shared/components/ui/separator";
import { useHelpdeskStore, type KBArticle } from "@/shared/data/helpdesk-store";
import { useToast } from "@/shared/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const KnowledgeBasePage = () => {
    const { articles, addArticle, updateArticle, deleteArticle } = useHelpdeskStore();
    const { toast } = useToast();

    // UI state
    const [activeTab, setActiveTab] = useState<"All" | "Published" | "Draft">("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<KBArticle | null>(null);
    const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState<Partial<KBArticle>>({
        title: "",
        content: "",
        category: "Policies",
        status: "Published",
        tags: [],
        author: "HR Admin"
    });

    const handleSave = () => {
        if (!formData.title || !formData.content) {
            toast({ title: "Validation Error", description: "Headline and body are required.", variant: "destructive" });
            return;
        }

        if (selectedArticle) {
            updateArticle(selectedArticle.id, formData);
            toast({ title: "Article Sync Complete", description: "Changes reflected live in Employee Portal." });
        } else {
            addArticle(formData as any);
            toast({ title: "Article Published", description: "Knowledge base has been updated." });
        }
        setIsCreateDialogOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({ title: "", content: "", category: "Policies", status: "Published", tags: [], author: "HR Admin" });
        setSelectedArticle(null);
    };

    const filteredArticles = articles.filter(art => {
        const matchesTab = activeTab === "All" || art.status === activeTab;
        const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || art.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const categories = ["Policies", "Payroll", "Leave", "IT Help", "General"];

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 leading-tight tracking-tight uppercase">Knowledge Library</h1>
                            <p className="text-sm font-medium text-slate-500">Enable self-service support</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end border-r pr-6 border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Article reach</span>
                            <span className="text-lg font-black text-slate-900 leading-none tracking-tighter">4.2K Impressions</span>
                        </div>
                        <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 px-6 font-bold gap-2 text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 transition-all">
                            <Plus size={16} /> Draft Article
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 overflow-hidden flex flex-col p-6 gap-6">
                    {/* Unified Filter Bar */}
                    <div className="flex items-center justify-between bg-white px-2 py-2 border border-slate-200 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-1">
                            {["All", "Published", "Draft"].map((tab) => (
                                <Button
                                    key={tab}
                                    variant={activeTab === tab ? "default" : "ghost"}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`h-9 rounded-xl px-5 text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? "bg-slate-900 text-white shadow-lg" : "text-slate-500"
                                        }`}
                                >
                                    {tab} List
                                </Button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 pr-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <Input
                                    placeholder="Search library..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="h-9 w-52 bg-slate-50 border-none rounded-xl pl-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-emerald-100"
                                />
                            </div>
                            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-100 text-slate-400"><Filter size={14} /></Button>
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                            <AnimatePresence mode="popLayout">
                                {filteredArticles.map((article, i) => (
                                    <motion.div
                                        key={article.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => { setSelectedArticle(article); setIsDetailSheetOpen(true); }}
                                        className="cursor-pointer group"
                                    >
                                        <Card className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden transition-all hover:border-emerald-300 hover:shadow-xl relative">
                                            <div className={`absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
                                                <div className="h-7 w-7 bg-white/90 backdrop-blur rounded-lg shadow border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors">
                                                    <MoreHorizontal size={14} />
                                                </div>
                                            </div>
                                            <CardContent className="p-6 flex flex-col gap-6">
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <Badge variant="outline" className="text-[9px] font-bold border-emerald-100 text-emerald-600 uppercase tracking-widest px-2 h-4.5 bg-emerald-50/50">{article.category}</Badge>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{article.lastUpdated}</span>
                                                    </div>
                                                    <h3 className="text-[15px] font-bold text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors uppercase h-10 line-clamp-2">{article.title}</h3>
                                                </div>

                                                <p className="text-[12px] font-medium text-slate-500 line-clamp-2 leading-relaxed h-10">
                                                    {article.content}
                                                </p>

                                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                    <div className="flex items-center gap-5">
                                                        <div className="flex items-center gap-1.5 text-slate-400">
                                                            <Eye size={12} />
                                                            <span className="text-[10px] font-bold uppercase">{article.views}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-slate-400">
                                                            <ThumbsUp size={12} />
                                                            <span className="text-[10px] font-bold uppercase">{article.helpfulCount}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-widest group-hover:gap-2 transition-all">
                                                        Manage <ChevronRight size={12} />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </ScrollArea>
                </div>

                {/* Right Sidebar - Analytics & Trends */}
                <div className="w-[320px] bg-white border-l border-slate-200 flex flex-col p-8 shrink-0 space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles size={14} className="text-amber-500" /> Smart Insights
                        </h2>
                        <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden group shadow-xl">
                            <div className="relative z-10 text-center space-y-4">
                                <div className="space-y-1">
                                    <span className="text-[42px] font-black leading-none block tracking-tighter text-emerald-400">32%</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Ticket Reduction</span>
                                </div>
                                <p className="text-[11px] font-medium text-slate-300 leading-relaxed italic">Your "Leave Policy" article resolved 48 tickets automatically this week.</p>
                                <Button variant="link" className="text-indigo-400 p-0 h-auto text-[10px] font-bold uppercase tracking-widest flex items-center mx-auto gap-2">Explore Analytics <ArrowUpRight size={12} /></Button>
                            </div>
                            <Sparkles size={80} className="absolute -right-6 -bottom-6 text-white/10 group-hover:scale-125 transition-transform" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <BarChart3 size={14} className="text-emerald-500" /> Trending Topics
                        </h2>
                        <div className="space-y-3">
                            {[
                                { name: "Salary Structure", reach: "+24%", color: "text-emerald-500" },
                                { name: "Holidays 2024", reach: "+18%", color: "text-emerald-500" },
                                { name: "Medical Claims", reach: "-4%", color: "text-rose-500" }
                            ].map((trend, i) => (
                                <div key={i} className="p-4 rounded-xl border border-slate-50 bg-slate-50/50 flex flex-col gap-2 hover:border-emerald-100 transition-all cursor-pointer">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-800">{trend.name}</span>
                                        <span className={`text-[10px] font-bold ${trend.color}`}>{trend.reach}</span>
                                    </div>
                                    <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[60%]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto p-5 bg-emerald-50 rounded-2xl border border-emerald-100 border-dashed space-y-3">
                        <h4 className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">Employee Feedback</h4>
                        <p className="text-[10px] font-medium text-emerald-600/70">"The reimbursement article was super clear. Saved my time!" — Rahul (Eng)</p>
                    </div>
                </div>
            </div>

            {/* Article Builder Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-3xl p-0 overflow-hidden border-none rounded-3xl shadow-3xl bg-white outline-none">
                    <div className="bg-slate-50 border-b border-slate-200 px-8 py-6 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                                <Plus size={20} />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight leading-none uppercase">KB Article Factory</DialogTitle>
                                <DialogDescription className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">Construct self-help resources for the workforce</DialogDescription>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300" onClick={() => setIsCreateDialogOpen(false)}><X size={20} /></Button>
                    </div>

                    <div className="flex-1 flex flex-col p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Article Headline</Label>
                            <Input
                                placeholder="Core Headline (Optimized for Search)"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="h-14 border-slate-200 rounded-2xl px-6 font-bold text-slate-900 text-lg bg-slate-50/20 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Knowledge Cluster</Label>
                                <Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v })}>
                                    <SelectTrigger className="h-12 border-slate-200 rounded-xl font-bold bg-white shadow-sm focus:border-emerald-500"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-100 font-bold uppercase text-[10px]">
                                        {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Access Status</Label>
                                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl h-12">
                                    {["Published", "Draft"].map(s => (
                                        <button
                                            key={s}
                                            className={`rounded-lg text-[10px] font-black uppercase transition-all ${formData.status === s ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'
                                                }`}
                                            onClick={() => setFormData({ ...formData, status: s as any })}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document Content (Markdown Supported)</Label>
                                <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1"><Sparkles size={12} /> AI Enrich</button>
                            </div>
                            <Textarea
                                placeholder="Type your knowledge content here. Be detailed and use bullet points for clarity."
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                className="min-h-[250px] border-slate-200 rounded-2xl p-6 font-medium text-[13px] leading-relaxed resize-none focus-visible:ring-0 focus:border-emerald-500 transition-all bg-slate-50/20 shadow-inner"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">SEO Tags</Label>
                            <div className="flex flex-wrap gap-2 p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
                                {["policy", "new-guidelines", "hr-portal"].map(tag => (
                                    <Badge key={tag} className="bg-white border-slate-200 text-slate-500 font-bold text-[9px] h-6 px-3 uppercase tracking-tighter shadow-sm flex items-center gap-1">#{tag} <X size={10} className="ml-1 cursor-pointer" /></Badge>
                                ))}
                                <Button variant="ghost" className="h-6 px-2 text-[9px] font-black text-indigo-600 uppercase border border-dashed border-indigo-200">+ Tag</Button>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
                        <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)} className="h-12 px-8 font-bold text-slate-400 text-xs uppercase tracking-widest">Discard Entry</Button>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="h-12 px-6 border-slate-200 font-bold text-xs uppercase tracking-widest gap-2 bg-white rounded-xl"><Save size={16} /> Save Draft</Button>
                            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 px-10 font-bold text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 gap-2">
                                <Send size={16} /> Deploy Article
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Content Preview & Analytics Sheet */}
            <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
                <SheetContent side="right" className="w-[600px] p-0 border-l border-slate-200 shadow-3xl bg-white flex flex-col overflow-hidden outline-none">
                    <div className="bg-white border-b border-slate-100 p-8 shrink-0">
                        <div className="flex items-center justify-between mb-6">
                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] h-5 px-3 uppercase tracking-widest">{selectedArticle?.category}</Badge>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => { setFormData(selectedArticle!); setIsCreateDialogOpen(true); }} className="h-9 w-9 text-slate-400 hover:text-emerald-600 rounded-xl bg-slate-50"><Edit size={16} /></Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-900 rounded-xl bg-slate-50"><History size={16} /></Button>
                                <Button variant="ghost" size="icon" onClick={() => { deleteArticle(selectedArticle!.id); setIsDetailSheetOpen(false); }} className="h-9 w-9 text-slate-400 hover:text-rose-600 rounded-xl bg-slate-50"><Trash2 size={16} /></Button>
                            </div>
                        </div>
                        <SheetTitle className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-tight mb-2">
                            {selectedArticle?.title}
                        </SheetTitle>
                        <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4 pb-4 border-b border-slate-50">
                            <span>Author: {selectedArticle?.author}</span>
                            <div className="h-1 w-1 rounded-full bg-slate-200" />
                            <span>Last Sync: {selectedArticle?.lastUpdated}</span>
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-8 space-y-10">
                            {/* Performance Metrics */}
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: "Reach", val: selectedArticle?.views, icon: Eye, color: "text-indigo-500" },
                                    { label: "Helpfulness", val: `${Math.round(((selectedArticle?.helpfulCount || 0) / (selectedArticle?.views || 1)) * 100)}%`, icon: ThumbsUp, color: "text-emerald-500" },
                                    { label: "SLA Impact", val: "-14%", icon: Zap, color: "text-amber-500" }
                                ].map((m, i) => (
                                    <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-center space-y-2">
                                        <div className={`h-8 w-8 mx-auto rounded-lg bg-white border border-slate-100 flex items-center justify-center ${m.color} shadow-sm`}>
                                            <m.icon size={14} />
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{m.label}</span>
                                            <span className="text-lg font-black text-slate-900 tracking-tight">{m.val}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Article Body Preview */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <FileText size={14} /> Document Preview (Live)
                                </h4>
                                <div className="prose prose-slate max-w-none font-medium text-[14px] text-slate-600 leading-relaxed bg-slate-50/20 p-8 rounded-3xl border border-slate-50 shadow-inner italic">
                                    {selectedArticle?.content}
                                </div>
                            </div>

                            {/* Interaction Analytics */}
                            <div className="space-y-6 pb-20">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <BarChart3 size={14} /> Consumer Sentiment
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs font-bold text-slate-700">Positive Adoption</span>
                                        <span className="text-xs font-black text-emerald-600">88%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[88%] shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000" />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 leading-relaxed pt-2">
                                        Based on 420 "Found this helpful" responses from employees. This article is currently in top 5%.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default KnowledgeBasePage;
