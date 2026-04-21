"use client"

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    BookOpen,
    Plus,
    Search,
    Filter,
    ChevronRight,
    FileText,
    Eye,
    ThumbsUp,
    MoreHorizontal,
    Trash2,
    Edit,
    Send,
    History,
    Sparkles,
    BarChart3,
    ArrowUpRight,
    X,
    Save,
    Zap,
    Copy,
    Archive,
    RotateCcw
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/shared/components/ui/sheet";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/shared/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { useHelpdeskStore, type KBArticle } from "@/shared/data/helpdesk-store";
import { useToast } from "@/shared/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const defaultForm: Partial<KBArticle> = {
    title: "",
    content: "",
    category: "Policies",
    status: "Published",
    tags: [],
    author: "HR Admin"
};

// Simple heuristic-based enrichment that adds structure to markdown content
const aiEnrich = (content: string, title: string, category: string): string => {
    if (!content.trim()) {
        return `# ${title || "Untitled"}\n\n## Overview\nThis ${category} article provides guidance on the topic.\n\n## Steps\n1. Step one description\n2. Step two description\n3. Step three description\n\n## Common Issues\n- Issue 1: resolution\n- Issue 2: resolution\n\n## FAQs\n**Q:** Frequently asked question?\n**A:** Detailed answer here.\n\n## Need Help?\nIf you need further assistance, raise a ticket via the Support portal.`;
    }
    if (content.startsWith("#")) {
        return `${content}\n\n## Related Resources\n- Support portal\n- Employee handbook\n\n## Need Help?\nRaise a ticket if this article did not resolve your query.`;
    }
    const lines = content.split("\n").filter(l => l.trim());
    const intro = lines[0] || content;
    const rest = lines.slice(1).join("\n");
    return `# ${title || "Article"}\n\n## Overview\n${intro}\n\n## Details\n${rest || content}\n\n## Summary\nThis article covers the core aspects of ${category}. Reach out to Support if you need clarification.`;
};

const KnowledgeBasePage = () => {
    const router = useRouter();
    const { articles, addArticle, updateArticle, deleteArticle, duplicateArticle } = useHelpdeskStore();
    const { toast } = useToast();

    // UI state
    const [activeTab, setActiveTab] = useState<"All" | "Published" | "Draft">("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<KBArticle | null>(null);
    const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // Filter popover
    const [filterCategory, setFilterCategory] = useState("all");
    const [sortBy, setSortBy] = useState<"recent" | "oldest" | "views" | "helpful">("recent");

    // Form state
    const [formData, setFormData] = useState<Partial<KBArticle>>(defaultForm);
    const [newTagInput, setNewTagInput] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    // Delete confirmation
    const [deleteTarget, setDeleteTarget] = useState<KBArticle | null>(null);

    const liveSelectedArticle = useMemo(() =>
        selectedArticle ? articles.find(a => a.id === selectedArticle.id) || null : null
        , [articles, selectedArticle]);

    const categoryOptions = ["Policies", "Payroll", "Leave", "IT Help", "General", "HR Ops"];

    const filteredArticles = useMemo(() => {
        const list = articles.filter(art => {
            const matchesTab = activeTab === "All" || art.status === activeTab;
            const q = searchQuery.toLowerCase();
            const matchesSearch = !q
                || art.title.toLowerCase().includes(q)
                || art.category.toLowerCase().includes(q)
                || art.tags.some(t => t.toLowerCase().includes(q));
            const matchesCat = filterCategory === "all" || art.category === filterCategory;
            return matchesTab && matchesSearch && matchesCat;
        });
        return [...list].sort((a, b) => {
            switch (sortBy) {
                case "recent": return b.lastUpdated.localeCompare(a.lastUpdated);
                case "oldest": return a.lastUpdated.localeCompare(b.lastUpdated);
                case "views": return b.views - a.views;
                case "helpful": return b.helpfulCount - a.helpfulCount;
            }
        });
    }, [articles, activeTab, searchQuery, filterCategory, sortBy]);

    const resetForm = () => {
        setFormData(defaultForm);
        setNewTagInput("");
        setEditingId(null);
    };

    const openNewDialog = () => {
        resetForm();
        setIsCreateDialogOpen(true);
    };

    const openEditDialog = (art: KBArticle) => {
        setFormData({ ...art });
        setEditingId(art.id);
        setIsCreateDialogOpen(true);
    };

    const handleSave = (explicitStatus?: "Draft" | "Published") => {
        const title = (formData.title || "").trim();
        const content = (formData.content || "").trim();
        const isDraft = explicitStatus === "Draft";
        if (!title) {
            toast({ title: "Validation Error", description: "Headline is required.", variant: "destructive" });
            return;
        }
        if (title.length < 5) {
            toast({ title: "Too Short", description: "Headline must be at least 5 characters.", variant: "destructive" });
            return;
        }
        if (title.length > 150) {
            toast({ title: "Too Long", description: "Headline must be under 150 characters.", variant: "destructive" });
            return;
        }
        if (!isDraft) {
            if (!content) {
                toast({ title: "Validation Error", description: "Body is required to publish.", variant: "destructive" });
                return;
            }
            if (content.length < 20) {
                toast({ title: "Too Short", description: "Body must be at least 20 characters before publishing.", variant: "destructive" });
                return;
            }
        }
        if (content.length > 20000) {
            toast({ title: "Body Too Long", description: "Body must be under 20,000 characters.", variant: "destructive" });
            return;
        }
        if (!categoryOptions.includes(formData.category || "")) {
            toast({ title: "Invalid Category", description: "Select a valid knowledge cluster.", variant: "destructive" });
            return;
        }
        const payload = { ...formData, title, content, status: explicitStatus || formData.status || "Published" };

        if (editingId) {
            updateArticle(editingId, payload);
            toast({ title: isDraft ? "Draft Saved" : "Article Updated", description: "Changes saved successfully." });
        } else {
            addArticle(payload as any);
            toast({ title: isDraft ? "Draft Saved" : "Article Published", description: isDraft ? "Your draft is safe." : "Knowledge base updated." });
        }
        setIsCreateDialogOpen(false);
        resetForm();
    };

    const handleEnrich = () => {
        const enriched = aiEnrich(formData.content || "", formData.title || "", formData.category || "General");
        setFormData({ ...formData, content: enriched });
        toast({ title: "Content Enriched", description: "AI has structured your article with sections." });
    };

    const handleAddTag = () => {
        const val = newTagInput.trim().replace(/^#+/, "").toLowerCase();
        if (!val) return;
        if (val.length < 2) {
            toast({ title: "Too Short", description: "Tags must be at least 2 characters.", variant: "destructive" });
            return;
        }
        if (val.length > 30) {
            toast({ title: "Too Long", description: "Tags must be under 30 characters.", variant: "destructive" });
            return;
        }
        if (!/^[a-z0-9-]+$/.test(val)) {
            toast({ title: "Invalid", description: "Tags may only contain lowercase letters, digits, and dashes.", variant: "destructive" });
            return;
        }
        if ((formData.tags || []).includes(val)) {
            toast({ title: "Duplicate", description: "Tag already exists.", variant: "destructive" });
            return;
        }
        if ((formData.tags || []).length >= 10) {
            toast({ title: "Limit", description: "Maximum 10 tags allowed.", variant: "destructive" });
            return;
        }
        setFormData({ ...formData, tags: [...(formData.tags || []), val] });
        setNewTagInput("");
    };

    const handleRemoveTag = (tag: string) => {
        setFormData({ ...formData, tags: (formData.tags || []).filter(t => t !== tag) });
    };

    const handleDuplicate = (id: string) => {
        duplicateArticle(id);
        toast({ title: "Duplicated", description: "A draft copy was created." });
    };

    const handleArchive = (id: string) => {
        updateArticle(id, { status: "Draft" });
        toast({ title: "Archived to Draft", description: "Article is no longer public." });
    };

    const handlePublish = (id: string) => {
        updateArticle(id, { status: "Published" });
        toast({ title: "Published", description: "Article is now live." });
    };

    const handleMarkHelpful = (id: string) => {
        const art = articles.find(a => a.id === id);
        if (!art) return;
        updateArticle(id, { helpfulCount: art.helpfulCount + 1, views: art.views + 1 });
        toast({ title: "Thanks!", description: "Your feedback has been recorded." });
    };

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
                            <span className="text-lg font-black text-slate-900 leading-none tracking-tighter">{articles.reduce((acc, a) => acc + a.views, 0).toLocaleString()} Impressions</span>
                        </div>
                        <Button onClick={openNewDialog} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 px-6 font-bold gap-2 text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 transition-all">
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
                                    className={`h-9 rounded-xl px-5 text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? "bg-slate-900 text-white shadow-lg" : "text-slate-500"}`}
                                >
                                    {tab}
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
                                    className="h-9 w-52 bg-slate-50 border border-slate-200 rounded-xl pl-9 text-xs font-semibold focus-visible:ring-1 focus-visible:ring-emerald-100"
                                />
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-100 text-slate-400"><Filter size={14} /></Button>
                                </PopoverTrigger>
                                <PopoverContent align="end" className="w-64 p-4 rounded-2xl space-y-3">
                                    <div>
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</Label>
                                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                                            <SelectTrigger className="h-9 rounded-xl mt-1"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Categories</SelectItem>
                                                {categoryOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sort By</Label>
                                        <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                                            <SelectTrigger className="h-9 rounded-xl mt-1"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="recent">Most Recent</SelectItem>
                                                <SelectItem value="oldest">Oldest</SelectItem>
                                                <SelectItem value="views">Most Viewed</SelectItem>
                                                <SelectItem value="helpful">Most Helpful</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button variant="ghost" className="w-full h-8 text-xs" onClick={() => { setFilterCategory("all"); setSortBy("recent"); toast({ title: "Reset" }); }}>Reset</Button>
                                </PopoverContent>
                            </Popover>
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
                                        transition={{ delay: i * 0.03 }}
                                        onClick={() => { setSelectedArticle(article); setIsDetailSheetOpen(true); }}
                                        className="cursor-pointer group"
                                    >
                                        <Card className="rounded-2xl border border-slate-200 shadow-sm bg-white overflow-hidden transition-all hover:border-emerald-300 hover:shadow-xl relative">
                                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 bg-white/90 backdrop-blur rounded-lg shadow border border-slate-100 text-slate-400 hover:text-emerald-600">
                                                            <MoreHorizontal size={14} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-xl">
                                                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => openEditDialog(article)}>
                                                            <Edit size={13} /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleDuplicate(article.id)}>
                                                            <Copy size={13} /> Duplicate
                                                        </DropdownMenuItem>
                                                        {article.status === "Published" ? (
                                                            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleArchive(article.id)}>
                                                                <Archive size={13} /> Unpublish
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handlePublish(article.id)}>
                                                                <Send size={13} /> Publish
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="gap-2 text-rose-500 cursor-pointer" onClick={() => setDeleteTarget(article)}>
                                                            <Trash2 size={13} /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <CardContent className="p-6 flex flex-col gap-6">
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <Badge variant="outline" className="text-[9px] font-bold border-emerald-100 text-emerald-600 uppercase tracking-widest px-2 h-4.5 bg-emerald-50/50">{article.category}</Badge>
                                                        <Badge className={`${article.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"} text-[9px] font-bold h-5 px-2 border-none`}>{article.status}</Badge>
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
                            {filteredArticles.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 italic text-slate-400">
                                    <BookOpen size={48} className="mb-4 opacity-10" />
                                    <p className="text-sm font-bold">No articles match your filters.</p>
                                    <Button variant="ghost" size="sm" className="mt-4 text-emerald-600" onClick={openNewDialog}>Draft a new article</Button>
                                </div>
                            )}
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
                                    <span className="text-[42px] font-black leading-none block tracking-tighter text-emerald-400">
                                        {articles.filter(a => a.status === "Published").length}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Articles</span>
                                </div>
                                <p className="text-[11px] font-medium text-slate-300 leading-relaxed italic">Published articles reducing ticket volume across departments.</p>
                                <Button variant="link" className="text-indigo-400 p-0 h-auto text-[10px] font-bold uppercase tracking-widest flex items-center mx-auto gap-2" onClick={() => router.push("/hrmcubicle/helpdesk/reports")}>Explore Analytics <ArrowUpRight size={12} /></Button>
                            </div>
                            <Sparkles size={80} className="absolute -right-6 -bottom-6 text-white/10 group-hover:scale-125 transition-transform" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <BarChart3 size={14} className="text-emerald-500" /> Top Performers
                        </h2>
                        <div className="space-y-3">
                            {[...articles].sort((a, b) => b.helpfulCount - a.helpfulCount).slice(0, 3).map((art) => (
                                <div key={art.id} className="p-4 rounded-xl border border-slate-50 bg-slate-50/50 flex flex-col gap-2 hover:border-emerald-100 transition-all cursor-pointer" onClick={() => { setSelectedArticle(art); setIsDetailSheetOpen(true); }}>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-800 line-clamp-1">{art.title}</span>
                                        <span className="text-[10px] font-bold text-emerald-500">{art.helpfulCount}</span>
                                    </div>
                                    <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (art.helpfulCount / Math.max(1, art.views)) * 100)}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto p-5 bg-emerald-50 rounded-2xl border border-emerald-100 border-dashed space-y-3">
                        <h4 className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">Employee Feedback</h4>
                        <p className="text-[10px] font-medium text-emerald-600/70 italic">"The reimbursement article was super clear. Saved my time!" — Rahul (Eng)</p>
                    </div>
                </div>
            </div>

            {/* Article Builder Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={(v) => { if (!v) resetForm(); setIsCreateDialogOpen(v); }}>
                <DialogContent className="max-w-3xl p-0 overflow-hidden border-2 border-slate-200 rounded-3xl shadow-3xl bg-white outline-none">
                    <div className="bg-slate-50 border-b border-slate-200 px-8 py-6 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                                <Plus size={20} />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight leading-none uppercase">{editingId ? "Edit Article" : "KB Article Factory"}</DialogTitle>
                                <DialogDescription className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">Construct self-help resources for the workforce</DialogDescription>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300" onClick={() => setIsCreateDialogOpen(false)}><X size={20} /></Button>
                    </div>

                    <div className="flex-1 flex flex-col p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Article Headline</Label>
                            <Input
                                placeholder="Core Headline (Optimized for Search)"
                                value={formData.title || ""}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="h-14 border-slate-200 rounded-2xl px-6 font-bold text-slate-900 text-lg bg-slate-50/20 focus-visible:ring-emerald-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Knowledge Cluster</Label>
                                <Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v })}>
                                    <SelectTrigger className="h-12 border-slate-200 rounded-xl font-bold bg-white shadow-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-100 font-bold uppercase text-[10px]">
                                        {categoryOptions.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Access Status</Label>
                                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl h-12">
                                    {["Published", "Draft"].map(s => (
                                        <button
                                            key={s}
                                            className={`rounded-lg text-[10px] font-black uppercase transition-all ${formData.status === s ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
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
                                <Button type="button" variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-indigo-600 uppercase tracking-widest gap-1.5" onClick={handleEnrich}>
                                    <Sparkles size={12} /> AI Enrich
                                </Button>
                            </div>
                            <Textarea
                                placeholder="Type your knowledge content here. Be detailed and use bullet points for clarity."
                                value={formData.content || ""}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                className="min-h-[250px] border-slate-200 rounded-2xl p-6 font-medium text-[13px] leading-relaxed resize-none focus-visible:ring-0 focus:border-emerald-500 transition-all bg-slate-50/20 shadow-inner"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">SEO Tags</Label>
                            <div className="flex flex-wrap gap-2 p-4 border border-slate-100 rounded-2xl bg-slate-50/50 items-center">
                                {(formData.tags || []).map(tag => (
                                    <Badge key={tag} className="bg-white border-slate-200 text-slate-500 font-bold text-[9px] h-6 px-3 uppercase tracking-tighter shadow-sm flex items-center gap-1">
                                        #{tag}
                                        <X size={10} className="ml-1 cursor-pointer hover:text-rose-500" onClick={() => handleRemoveTag(tag)} />
                                    </Badge>
                                ))}
                                <Input
                                    placeholder="Add tag + Enter"
                                    value={newTagInput}
                                    onChange={(e) => setNewTagInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTag(); } }}
                                    className="h-7 w-32 text-[10px] font-bold border-dashed border-indigo-200"
                                />
                                <Button variant="ghost" size="sm" className="h-7 px-2 text-[9px] font-black text-indigo-600 uppercase" onClick={handleAddTag}>+ Add</Button>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
                        <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)} className="h-12 px-8 font-bold text-slate-400 text-xs uppercase tracking-widest">Discard Entry</Button>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="h-12 px-6 border-slate-200 font-bold text-xs uppercase tracking-widest gap-2 bg-white rounded-xl" onClick={() => handleSave("Draft")}>
                                <Save size={16} /> Save Draft
                            </Button>
                            <Button onClick={() => handleSave(formData.status as any)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 px-10 font-bold text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 gap-2">
                                <Send size={16} /> {editingId ? "Save Changes" : "Deploy Article"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Content Preview Sheet */}
            <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
                <SheetContent side="right" className="w-[600px] p-0 border-l border-slate-200 shadow-3xl bg-white flex flex-col overflow-hidden outline-none">
                    <div className="bg-white border-b border-slate-100 p-8 shrink-0">
                        <div className="flex items-center justify-between mb-6">
                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] h-5 px-3 uppercase tracking-widest">{liveSelectedArticle?.category}</Badge>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => liveSelectedArticle && openEditDialog(liveSelectedArticle)} className="h-9 w-9 text-slate-400 hover:text-emerald-600 rounded-xl bg-slate-50"><Edit size={16} /></Button>
                                <Button variant="ghost" size="icon" onClick={() => setIsHistoryOpen(true)} className="h-9 w-9 text-slate-400 hover:text-slate-900 rounded-xl bg-slate-50"><History size={16} /></Button>
                                <Button variant="ghost" size="icon" onClick={() => liveSelectedArticle && setDeleteTarget(liveSelectedArticle)} className="h-9 w-9 text-slate-400 hover:text-rose-600 rounded-xl bg-slate-50"><Trash2 size={16} /></Button>
                            </div>
                        </div>
                        <SheetTitle className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-tight mb-2">
                            {liveSelectedArticle?.title}
                        </SheetTitle>
                        <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4 pb-4 border-b border-slate-50">
                            <span>By {liveSelectedArticle?.author}</span>
                            <div className="h-1 w-1 rounded-full bg-slate-200" />
                            <span>Updated {liveSelectedArticle?.lastUpdated}</span>
                            <div className="h-1 w-1 rounded-full bg-slate-200" />
                            <Badge className={`${liveSelectedArticle?.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"} text-[9px] font-bold h-5 px-2 border-none`}>
                                {liveSelectedArticle?.status}
                            </Badge>
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-8 space-y-10">
                            {/* Performance Metrics */}
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: "Views", val: liveSelectedArticle?.views, icon: Eye, color: "text-indigo-500" },
                                    { label: "Helpful", val: liveSelectedArticle?.helpfulCount, icon: ThumbsUp, color: "text-emerald-500" },
                                    { label: "Helpfulness", val: liveSelectedArticle?.views ? `${Math.round(((liveSelectedArticle.helpfulCount) / liveSelectedArticle.views) * 100)}%` : "0%", icon: Zap, color: "text-amber-500" }
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

                            {/* Tags */}
                            {liveSelectedArticle && liveSelectedArticle.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {liveSelectedArticle.tags.map(tag => (
                                        <Badge key={tag} className="bg-slate-100 text-slate-600 border-none font-bold text-[10px] h-6 px-3">#{tag}</Badge>
                                    ))}
                                </div>
                            )}

                            {/* Article Body Preview */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <FileText size={14} /> Document Preview
                                </h4>
                                <div className="font-medium text-[14px] text-slate-600 leading-relaxed bg-slate-50/20 p-8 rounded-3xl border border-slate-50 shadow-inner whitespace-pre-wrap">
                                    {liveSelectedArticle?.content}
                                </div>
                            </div>

                            {/* Feedback */}
                            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                                <div>
                                    <h4 className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">Was this helpful?</h4>
                                    <p className="text-[10px] text-emerald-600/70 italic mt-1">Your feedback improves the library.</p>
                                </div>
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded-xl" onClick={() => liveSelectedArticle && handleMarkHelpful(liveSelectedArticle.id)}>
                                    <ThumbsUp size={13} /> Yes, Helpful
                                </Button>
                            </div>

                            {/* Quick actions */}
                            <div className="grid grid-cols-2 gap-3 pb-20">
                                {liveSelectedArticle?.status === "Published" ? (
                                    <Button variant="outline" className="h-11 rounded-xl gap-2" onClick={() => liveSelectedArticle && handleArchive(liveSelectedArticle.id)}>
                                        <Archive size={14} /> Unpublish
                                    </Button>
                                ) : (
                                    <Button variant="outline" className="h-11 rounded-xl gap-2 bg-emerald-50 border-emerald-200 text-emerald-700" onClick={() => liveSelectedArticle && handlePublish(liveSelectedArticle.id)}>
                                        <Send size={14} /> Publish
                                    </Button>
                                )}
                                <Button variant="outline" className="h-11 rounded-xl gap-2" onClick={() => liveSelectedArticle && handleDuplicate(liveSelectedArticle.id)}>
                                    <Copy size={14} /> Duplicate
                                </Button>
                            </div>
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>

            {/* History Dialog */}
            <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl">
                    <DialogHeader className="bg-slate-50 border-b border-slate-200 p-6">
                        <DialogTitle>Version History</DialogTitle>
                        <DialogDescription>Recent edits to this article.</DialogDescription>
                    </DialogHeader>
                    <div className="p-6 space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">V2</div>
                            <div className="flex-1">
                                <span className="text-xs font-bold text-slate-800 block">Current Version</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Updated {liveSelectedArticle?.lastUpdated} by {liveSelectedArticle?.author}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl opacity-60">
                            <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-bold">V1</div>
                            <div className="flex-1">
                                <span className="text-xs font-bold text-slate-800 block">Initial Draft</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Created on publication</span>
                            </div>
                            <Button variant="ghost" size="sm" className="text-[10px] gap-1" onClick={() => toast({ title: "Restore", description: "Rollback queued." })}>
                                <RotateCcw size={12} /> Restore
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{deleteTarget?.title}"?</AlertDialogTitle>
                        <AlertDialogDescription>This permanently removes the article from the library.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteTarget) {
                                    deleteArticle(deleteTarget.id);
                                    toast({ title: "Article Deleted" });
                                    setDeleteTarget(null);
                                    setIsDetailSheetOpen(false);
                                }
                            }}
                            className="bg-rose-600 hover:bg-rose-700 text-white"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default KnowledgeBasePage;
