"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
    MessageSquare,
    Filter,
    Search,
    Lock,
    User,
    Ban,
    CheckSquare,
    TrendingUp,
    History,
    MoreHorizontal,
    Flag,
    CheckCircle2,
    Clock,
    ShieldCheck,
    BarChart3,
    ArrowUpRight,
    SearchCheck,
    Zap,
    AlertCircle,
    UserCheck,
    Send,
    ChevronRight,
    CornerDownRight,
    Layout,
    Inbox,
    Shield,
    Tag,
    Lightbulb,
    Flame,
    Smile,
    Sparkles,
    SearchX,
    Trash2
} from "lucide-react";
import { useEngageStore, type Feedback } from "@/shared/data/engage-store";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/shared/components/ui/sheet";
import { Separator } from "@/shared/components/ui/separator";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useToast } from "@/shared/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";

const EmployeeFeedbackEngagePage = () => {
    const { feedbacks, updateFeedback, deleteFeedback } = useEngageStore();
    const { toast } = useToast();

    const [activeTab, setActiveTab] = useState<Feedback["status"]>("Open");
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [assignTo, setAssignTo] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const stats = {
        total: feedbacks.length,
        open: feedbacks.filter(f => f.status === "Open").length,
        reviewed: feedbacks.filter(f => f.status === "Reviewed").length,
        resolved: feedbacks.filter(f => f.status === "Resolved").length,
        anonymous: feedbacks.filter(f => f.isAnonymous).length
    };

    const handleAction = (id: string, status: Feedback["status"]) => {
        updateFeedback(id, { status });
        const titleMap = {
            "Open": "Idea is Fresh! 💡",
            "Reviewed": "Under Review 🔍",
            "Resolved": "Success! 🏆"
        };
        toast({
            title: titleMap[status],
            description: `This voice has been moved to ${status}.`,
            className: "bg-rose-500 text-white font-bold"
        });
        if (selectedFeedback?.id === id) {
            setSelectedFeedback(prev => prev ? { ...prev, status } : null);
        }
    };

    const handlePostReply = () => {
        if (!replyText.trim() || !selectedFeedback) return;
        updateFeedback(selectedFeedback.id, { adminResponse: replyText });
        toast({ title: "Comment Shared", description: "Your thoughts have been recorded." });
        setReplyText("");
    };

    const getStatusStyles = (status: Feedback["status"]) => {
        switch (status) {
            case "Open": return "bg-rose-50 text-rose-600 border-rose-100";
            case "Resolved": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "Reviewed": return "bg-indigo-50 text-indigo-600 border-indigo-100";
            default: return "bg-slate-50 text-slate-500 border-slate-100";
        }
    };

    const filteredFeedbacks = feedbacks.filter(f =>
        f.status === activeTab &&
        (f.subject.toLowerCase().includes(searchTerm.toLowerCase()) || f.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="flex flex-col h-full bg-[#fcfdff] overflow-hidden text-start" style={{ zoom: "80%" }}>
            {/* Informal Creative Header */}
            <div className="px-8 py-10 bg-gradient-to-r from-rose-500 via-pink-600 to-orange-500 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                    <Lightbulb size={180} />
                </div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="text-rose-200 fill-rose-200 h-5 w-5" />
                            <span className="text-[10px] font-bold tracking-[0.3em] text-white/80">Employee Voice Box</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tighter leading-none mb-3">The Idea Box &<br />Sentiment Studio</h1>
                        <p className="text-white/70 font-bold text-sm max-w-md italic">Where every whisper counts. Transform our workplace with your insights.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-center min-w-[140px]">
                            <p className="text-[10px] font-bold text-white/60 mb-1 tracking-widest capitalize">Sentiment</p>
                            <p className="text-xl font-bold text-rose-200 flex items-center justify-center gap-2">92% <Smile size={20} /></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="p-8 space-y-10">
                    {/* Horizontal Intelligence Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Impact Stats */}
                        <Card className="p-5 bg-indigo-100/60 rounded-[2.5rem] border-2 border-indigo-200 shadow-sm text-center flex flex-col justify-center">
                            <p className="text-[10px] font-bold text-slate-400 tracking-widest mb-1 capitalize">Total Voices</p>
                            <p className="text-2xl font-bold text-indigo-700 leading-none">{stats.total}</p>
                        </Card>
                        <Card className="p-5 bg-rose-100/60 rounded-[2.5rem] border-2 border-rose-200 shadow-sm text-center flex flex-col justify-center">
                            <p className="text-[10px] font-bold text-slate-400 tracking-widest mb-1 capitalize">Anonymous</p>
                            <p className="text-2xl font-bold text-rose-600 leading-none">{stats.anonymous}</p>
                        </Card>

                        {/* Resolution Proximity */}
                        <Card className="p-5 bg-rose-500/10 rounded-[2.5rem] border-2 border-rose-200 shadow-sm flex flex-col justify-center gap-3">
                            <div className="flex justify-between items-end">
                                <span className="text-[9px] font-bold text-rose-400 tracking-widest capitalize">Resolution Rate</span>
                                <span className="text-xs font-bold text-rose-700">{Math.round((stats.resolved / stats.total) * 100) || 0}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-rose-100 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.resolved / stats.total) * 100}%` }} className="h-full bg-rose-500" />
                            </div>
                        </Card>

                        {/* Urgent Alert - Horizontalized */}
                        <Card className="p-5 bg-slate-900 rounded-[2.5rem] border-none shadow-xl text-white relative overflow-hidden flex flex-col justify-center">
                            <div className="relative z-10">
                                <h3 className="text-xs font-bold tracking-tight mb-1 capitalize">Urgent Matters</h3>
                                <div className="flex gap-2">
                                    {feedbacks.filter(f => f.priority === "High" && f.status !== "Resolved").slice(0, 1).map((f, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="h-1 w-1 rounded-full bg-rose-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-white/80 truncate">{f.subject}</span>
                                        </div>
                                    ))}
                                    {feedbacks.filter(f => f.priority === "High" && f.status !== "Resolved").length === 0 && (
                                        <span className="text-[8px] font-bold text-white/40 italic">All Clear ✨</span>
                                    )}
                                </div>
                            </div>
                            <Flame size={50} className="absolute top-1/2 -translate-y-1/2 right-[-5px] text-white/5 rotate-[-15deg]" />
                        </Card>
                    </div>

                    {/* Filter & Search Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                        <Tabs defaultValue="Open" value={activeTab} onValueChange={(v) => setActiveTab(v as Feedback["status"])} className="h-12 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50 flex">
                            <TabsList className="bg-transparent border-none gap-2">
                                <TabsTrigger value="Open" className="rounded-xl px-6 h-full font-black text-[10px] tracking-widest transition-all capitalize data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-lg">Fresh Ideas 💡</TabsTrigger>
                                <TabsTrigger value="Reviewed" className="rounded-xl px-6 h-full font-black text-[10px] tracking-widest transition-all capitalize data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-lg">Investigating 🔍</TabsTrigger>
                                <TabsTrigger value="Resolved" className="rounded-xl px-6 h-full font-black text-[10px] tracking-widest transition-all capitalize data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-lg">Implemented 🏆</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="relative group w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <Input
                                placeholder="Search for ideas..."
                                className="h-12 pl-12 rounded-2xl border-slate-200 bg-white shadow-sm font-bold text-slate-900 focus:ring-4 focus:ring-rose-50 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Feedback Grid - Full Width / Column flow */}
                    <div className="flex flex-col gap-6 pb-12">
                        <AnimatePresence mode="popLayout">
                            {filteredFeedbacks.length === 0 ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-20 text-center">
                                    <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                        <SearchX size={48} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-300 tracking-tight">The box is empty for now</h3>
                                    <p className="text-slate-400 font-bold mt-2 text-center">Waiting for the next big spark!</p>
                                </motion.div>
                            ) : (
                                filteredFeedbacks.map((item, idx) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        layout
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <Card
                                            onClick={() => { setSelectedFeedback(item); setIsDetailOpen(true); }}
                                            className={`group relative rounded-[2rem] border-2 border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 bg-white overflow-hidden p-0 flex flex-col cursor-pointer ${selectedFeedback?.id === item.id ? 'border-rose-200 ring-4 ring-rose-50 shadow-xl' : ''}`}
                                        >
                                            <CardContent className="p-8">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-6">
                                                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-inner ${getStatusStyles(item.status)}`}>
                                                            {item.status === 'Open' ? <Lightbulb size={32} /> :
                                                                item.status === 'Resolved' ? <CheckCircle2 size={32} /> : <Zap size={32} />}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none group-hover:text-rose-600 transition-colors capitalize italic">{item.subject}</h3>
                                                                {item.isAnonymous && (
                                                                    <Badge className="bg-slate-900 text-white border-none font-black text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1">
                                                                        <Shield size={10} /> SECRET
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-3 mt-3">
                                                                <span className="text-[10px] font-black text-slate-400 tracking-wider capitalize">{item.category}</span>
                                                                <div className="h-1 w-1 rounded-full bg-slate-200" />
                                                                <span className="text-[10px] font-black text-slate-400 tracking-wider capitalize">Ref: {item.id}</span>
                                                                <div className="h-1 w-1 rounded-full bg-slate-200" />
                                                                <span className="text-[10px] font-black text-slate-400 tracking-wider capitalize">{new Date(item.date).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="h-12 w-12 p-0 rounded-2xl bg-slate-50 text-slate-300 group-hover:bg-rose-50 group-hover:text-rose-500 transition-all flex items-center justify-center">
                                                        <ChevronRight size={24} />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Idea Detail Modal - Vibrant */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="w-[580px] p-0 border-l-2 border-slate-300 shadow-3xl bg-white flex flex-col overflow-hidden text-start" style={{ zoom: "67%" }}>
                    <div className="bg-gradient-to-br from-rose-900 to-indigo-900 p-10 text-white shadow-2xl relative">
                        <div className="flex justify-between items-start">
                            <div>
                                <SheetTitle className="text-3xl font-bold text-white leading-none tracking-tighter mb-4 capitalize">{selectedFeedback?.subject}</SheetTitle>
                                <div className="flex items-center gap-4">
                                    <Badge className={`${getStatusStyles(selectedFeedback?.status || 'Open')} border-none text-[10px] font-bold h-6 px-3 rounded-xl capitalize tracking-[0.2em] shadow-lg`}>
                                        {selectedFeedback?.status}
                                    </Badge>
                                    <span className="text-white/40 font-medium text-[10px] capitalize tracking-[0.3em]">REF: {selectedFeedback?.id}</span>
                                </div>
                            </div>
                            <Button variant="ghost" onClick={() => { if (selectedFeedback) { deleteFeedback(selectedFeedback.id); setIsDetailOpen(false); toast({ title: "Feedback Deleted", description: "Record removed." }) } }} className="text-white/60 hover:text-rose-400 hover:bg-white/10 rounded-xl h-10 w-10 p-0">
                                <Trash2 size={20} />
                            </Button>
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-10 space-y-12">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-300 tracking-widest ml-1 capitalize">The Voice</Label>
                                    <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-300 flex items-center gap-4 shadow-inner">
                                        <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                                            {selectedFeedback?.isAnonymous ? <ShieldCheck size={24} className="text-rose-500" /> : <User size={24} />}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-900 leading-none">{selectedFeedback?.isAnonymous ? "Secret Source" : "Public Opinion"}</span>
                                            <span className="text-[10px] font-black text-slate-300 tracking-widest mt-1 capitalize">Identity Shielded</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-300 tracking-widest ml-1 capitalize">Perspective</Label>
                                    <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-300 flex items-center gap-4 shadow-inner">
                                        <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100">
                                            <Tag size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-900 leading-none truncate">{selectedFeedback?.category}</span>
                                            <span className="text-[10px] font-black text-slate-300 tracking-widest mt-1 capitalize">Classification</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-[10px] font-black text-slate-300 tracking-widest ml-1 capitalize">The Message</Label>
                                <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] relative group shadow-inner">
                                    <MessageSquare className="absolute top-6 right-8 text-slate-100 group-hover:text-rose-100 transition-colors" size={60} />
                                    <p className="text-lg font-bold text-slate-600 leading-relaxed italic relative z-10">
                                        &ldquo;{selectedFeedback?.content}&rdquo;
                                    </p>
                                </div>
                            </div>

                            <Separator className="opacity-50" />

                            <div className="space-y-8 bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-black text-slate-900 capitalize tracking-[0.2em] flex items-center gap-2">
                                        <Zap size={16} className="text-rose-500" /> Take Action
                                    </h4>
                                    <Badge className="bg-white/50 text-rose-600 border-none px-3 py-1 rounded-full text-[10px] font-black italic">SECURE GATEWAY</Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-slate-400 tracking-widest ml-1 capitalize">Shift Status</Label>
                                        <Select defaultValue={selectedFeedback?.status} onValueChange={(v) => handleAction(selectedFeedback?.id || '', v as any)}>
                                            <SelectTrigger className="h-14 border-slate-300 rounded-2xl font-black text-xs bg-white tracking-widest"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-2xl border-none shadow-2xl font-black">
                                                <SelectItem value="Open" className="text-rose-600 py-3">Fresh Idea 💡</SelectItem>
                                                <SelectItem value="Reviewed" className="text-indigo-600 py-3">In Progress ⚒️</SelectItem>
                                                <SelectItem value="Resolved" className="text-emerald-600 py-3">Implemented 🏆</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-slate-400 tracking-widest ml-1 capitalize">Leader Assigned</Label>
                                        <Select value={selectedFeedback?.assignedTo || assignTo} onValueChange={(v) => { setAssignTo(v); updateFeedback(selectedFeedback?.id || '', { assignedTo: v }); }}>
                                            <SelectTrigger className="h-14 border-slate-300 rounded-2xl font-black text-xs bg-white tracking-widest"><SelectValue placeholder="Choose Owner" /></SelectTrigger>
                                            <SelectContent className="rounded-2xl border-none shadow-2xl font-black">
                                                <SelectItem value="HR Manager" className="py-3">HR Lead</SelectItem>
                                                <SelectItem value="Dept. Head" className="py-3">Dept. Head</SelectItem>
                                                <SelectItem value="Executive" className="py-3">CXO Council</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 tracking-widest ml-1 capitalize">Official Response</Label>
                                    <Textarea
                                        placeholder="Record your thoughts or reply..."
                                        value={replyText || selectedFeedback?.adminResponse || ""}
                                        onChange={e => setReplyText(e.target.value)}
                                        className="h-32 border-slate-300 rounded-[2rem] p-6 font-bold text-sm leading-relaxed focus:ring-4 focus:ring-rose-50 bg-white shadow-inner resize-none"
                                    />
                                </div>

                                <Button onClick={handlePostReply} className="w-full bg-slate-900 hover:bg-black text-white rounded-2xl h-14 font-black text-xs capitalize tracking-[0.2em] shadow-xl shadow-slate-200 transition-all active:scale-95">
                                    Commit Entry 🚀
                                </Button>
                            </div>
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default EmployeeFeedbackEngagePage;
