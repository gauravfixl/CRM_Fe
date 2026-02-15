"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare,
    Plus,
    Search,
    Clock,
    EyeOff,
    MoreVertical,
    Zap,
    Users,
    ShieldAlert,
    ShieldCheck,
    Send,
    UserCircle,
    Layout,
    Activity,
    Heart,
    Star,
    Award,
    Trophy,
    Flame
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { usePerformanceStore, type Feedback } from "@/shared/data/performance-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

const ContinuousFeedbackPage = () => {
    const { toast } = useToast();
    const { feedbacks, addFeedback, moderateFeedback } = usePerformanceStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filterCategory, setFilterCategory] = useState<string | 'All'>('All');

    const [formData, setFormData] = useState({
        to: { name: "", avatar: "" },
        message: "",
        category: "Appreciation" as Feedback['category'],
        isPublic: true,
        isAnonymous: false,
        from: { name: "HR Admin", avatar: "HA", role: "Administrator" }
    });

    const handleSendFeedback = () => {
        if (!formData.to.name || !formData.message) {
            toast({ title: "Validation Error", description: "Recipient and message are required", variant: "destructive" });
            return;
        }
        addFeedback({
            ...formData,
            to: { ...formData.to, avatar: formData.to.name.charAt(0) }
        });
        toast({ title: "Feedback Dispatched", description: "Recognition has been queued for moderation/post." });
        setIsDialogOpen(false);
        setFormData({
            to: { name: "", avatar: "" },
            message: "",
            category: "Appreciation",
            isPublic: true,
            isAnonymous: false,
            from: { name: "HR Admin", avatar: "HA", role: "Administrator" }
        });
    };

    const getCategoryStyles = (cat: Feedback['category']) => {
        const styles = {
            'Appreciation': 'bg-emerald-50 text-emerald-600 border-emerald-100',
            'Improvement': 'bg-amber-50 text-amber-600 border-amber-100',
            'General': 'bg-indigo-50 text-indigo-600 border-indigo-100'
        };
        return styles[cat] || styles['General'];
    };

    const filteredFeedbacks = feedbacks.filter(f => {
        const matchesSearch = f.to.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.message.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = filterCategory === 'All' || f.category === filterCategory;
        return matchesSearch && matchesCat;
    });

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans" style={{ zoom: "80%" }}>
            <header className="py-4 px-8 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm rounded-b-3xl">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1 text-start">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Feedback Hub</h1>
                            <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-[10px] tracking-widest h-6 px-3">Culture & Moderation</Badge>
                        </div>
                        <p className="text-slate-500 text-sm font-semibold">Manage anonymous coachings, peer appreciations, and wall moderation settings.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setIsDialogOpen(true)}
                            className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100 transition-all gap-2 text-[10px] tracking-widest border-none"
                        >
                            <Plus size={16} /> Give Feedback
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-8 max-w-[1600px] mx-auto w-full space-y-8">
                <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-7 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden text-start group hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
                        <div className="h-12 w-12 rounded-2xl bg-white text-indigo-600 flex items-center justify-center shadow-sm border border-indigo-100">
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold tracking-tight text-indigo-900">Feedback Moderation</h3>
                            <p className="text-[10px] text-indigo-400 font-bold tracking-widest leading-none mt-1 uppercase">
                                {feedbacks.filter(f => f.moderationStatus === 'Pending').length} Pending Approvals for Culture Wall
                            </p>
                        </div>
                    </div>
                    <Button className="bg-indigo-600 text-white hover:bg-slate-900 rounded-xl h-10 px-6 font-bold text-[10px] tracking-widest relative z-10 border-none shadow-lg shadow-indigo-100 italic transition-all">Launch Mod Panel</Button>
                    <div className="absolute -right-10 -bottom-10 opacity-[0.05] text-indigo-900 group-hover:scale-110 transition-transform">
                        <ShieldCheck size={160} />
                    </div>
                </div>

                <div className="space-y-6 text-start">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative group flex-1">
                            <Search className="absolute left-4 top-1/2 -transform -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                            <Input
                                placeholder="Search by participants or specific feedback keywords..."
                                className="pl-11 h-12 rounded-xl bg-white border-slate-100 shadow-sm font-semibold text-sm focus:border-indigo-500 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="w-48 h-12 rounded-xl bg-white border-slate-100 font-bold text-[11px] tracking-widest shadow-sm">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none shadow-2xl p-1.5 font-bold">
                                <SelectItem value="All" className="rounded-lg h-10 text-[10px] tracking-wide">Everything</SelectItem>
                                <SelectItem value="Appreciation" className="rounded-lg h-10 text-[10px] tracking-wide">Appreciation</SelectItem>
                                <SelectItem value="Improvement" className="rounded-lg h-10 text-[10px] tracking-wide">Improvement</SelectItem>
                                <SelectItem value="General" className="rounded-lg h-10 text-[10px] tracking-wide">General</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <AnimatePresence mode="popLayout">
                        <div className="grid grid-cols-1 gap-4">
                            {filteredFeedbacks.map((fb, i) => {
                                const categoryStyles = getCategoryStyles(fb.category);
                                return (
                                    <motion.div
                                        key={fb.id}
                                        layout
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Card className="group border border-slate-100 shadow-sm hover:shadow-xl transition-all rounded-3xl bg-white overflow-hidden p-0">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                                    <div className="flex flex-col items-center gap-3 shrink-0 md:w-28">
                                                        <div className="relative">
                                                            <Avatar className={`h-14 w-14 border-2 border-white shadow-md ring-1 ring-slate-100 rounded-xl overflow-hidden ${fb.isAnonymous ? 'opacity-30 grayscale' : ''}`}>
                                                                <AvatarFallback className="bg-indigo-600 text-white font-bold text-lg">{fb.isAnonymous ? '?' : fb.to.avatar}</AvatarFallback>
                                                            </Avatar>
                                                            {fb.isAnonymous && <div className="absolute top-0 right-0 h-5 w-5 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-white"><EyeOff size={10} /></div>}
                                                        </div>
                                                        <p className="text-[10px] font-bold text-slate-400 tracking-widest text-center truncate w-full">{fb.isAnonymous ? 'Identity Hidden' : fb.to.name}</p>
                                                    </div>

                                                    <div className="flex-1 space-y-5">
                                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50/50 rounded-lg text-[9px] font-bold text-slate-400 tracking-widest">
                                                                    <UserCircle size={12} className="text-slate-300" /> From: {fb.isAnonymous ? 'Anonymous User' : fb.from.name}
                                                                </div>
                                                                <Badge variant="outline" className={`${categoryStyles} border-none font-bold text-[9px] h-6 px-3 rounded-lg tracking-widest shadow-sm`}>
                                                                    {fb.category}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-[9px] text-slate-300 font-bold tracking-widest">
                                                                {fb.moderationStatus === 'Approved' ? <Badge className="bg-emerald-100 text-emerald-700 border-none text-[8px] h-5 px-2 rounded-md font-bold">Approved</Badge> : <Badge className="bg-amber-100 text-amber-700 border-none text-[8px] h-5 px-2 rounded-md font-bold">In Moderation</Badge>}
                                                                <div className="flex items-center gap-1.5"><Clock size={12} className="text-slate-200" /> {new Date(fb.timestamp).toLocaleDateString()}</div>
                                                            </div>
                                                        </div>

                                                        <div className="relative">
                                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-50 rounded-full" />
                                                            <p className="text-base text-slate-600 font-semibold leading-relaxed italic pl-6 py-1">"{fb.message}"</p>
                                                        </div>
                                                    </div>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-9 w-9 text-slate-300 hover:text-slate-600 rounded-xl hover:bg-slate-50">
                                                                <MoreVertical size={16} />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl p-1.5 w-48 font-bold">
                                                            <DropdownMenuItem className="rounded-lg h-10 text-[10px] tracking-wide" onClick={() => moderateFeedback(fb.id, 'Approved')}>Approve for Wall</DropdownMenuItem>
                                                            <DropdownMenuItem className="rounded-lg h-10 text-[10px] tracking-wide" onClick={() => moderateFeedback(fb.id, 'Hidden')}>Hide Feedback</DropdownMenuItem>
                                                            <DropdownMenuItem className="rounded-lg h-10 text-[10px] tracking-wide text-rose-600 focus:bg-rose-50">Flag Inappropriate</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </AnimatePresence>
                </div>
            </main>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white rounded-[2.5rem] border-none p-10 max-w-2xl shadow-3xl font-sans" style={{ zoom: "80%" }}>
                    <DialogHeader className="space-y-3 text-start">
                        <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-2 shadow-inner border border-emerald-100">
                            <Zap size={28} fill="currentColor" />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Configure Recognition</DialogTitle>
                        <DialogDescription className="text-slate-500 font-semibold text-sm text-start">Select visibility, identity control, and participation category.</DialogDescription>
                    </DialogHeader>

                    <div className="py-8 space-y-5 text-start">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5 col-span-full md:col-span-1">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">To Participant *</Label>
                                <Input
                                    className="rounded-xl h-12 bg-slate-50 border-slate-100 font-bold px-5 focus:bg-white transition-all text-sm"
                                    placeholder="Employee name..."
                                    value={formData.to.name}
                                    onChange={(e) => setFormData({ ...formData, to: { ...formData.to, name: e.target.value } })}
                                />
                            </div>
                            <div className="space-y-1.5 col-span-full md:col-span-1">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Evaluation Category</Label>
                                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as any })}>
                                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold px-5 focus:bg-white text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl p-1.5 font-bold">
                                        <SelectItem value="Appreciation" className="rounded-lg h-10 text-[10px] uppercase tracking-wide">Appreciation</SelectItem>
                                        <SelectItem value="Improvement" className="rounded-lg h-10 text-[10px] uppercase tracking-wide">Coaching / Improvement</SelectItem>
                                        <SelectItem value="General" className="rounded-lg h-10 text-[10px] uppercase tracking-wide">General Observations</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Notes / Description *</Label>
                            <Textarea
                                className="rounded-2xl bg-slate-50 border-slate-100 min-h-[120px] p-5 font-semibold text-sm focus:bg-white transition-all shadow-inner"
                                placeholder="Describe the impact or behavior..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 transition-all hover:bg-white group cursor-pointer" onClick={() => setFormData({ ...formData, isAnonymous: !formData.isAnonymous })}>
                                <div className="flex items-center gap-3">
                                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all ${formData.isAnonymous ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-300 group-hover:text-indigo-600 shadow-sm border border-slate-100'}`}>
                                        <EyeOff size={16} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Anonymous</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Identity Hidden</p>
                                    </div>
                                </div>
                                <Switch checked={formData.isAnonymous} onCheckedChange={(val) => setFormData({ ...formData, isAnonymous: val })} />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 transition-all hover:bg-white group cursor-pointer" onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}>
                                <div className="flex items-center gap-3">
                                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all ${formData.isPublic ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-300 group-hover:text-amber-600 shadow-sm border border-slate-100'}`}>
                                        <Users size={16} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Public Post</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Live Wall</p>
                                    </div>
                                </div>
                                <Switch checked={formData.isPublic} onCheckedChange={(val) => setFormData({ ...formData, isPublic: val })} />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-6 border-t border-slate-50 sm:justify-start">
                        <Button
                            className="flex-1 bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-12 font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all flex gap-3 border-none"
                            onClick={handleSendFeedback}
                        >
                            <Send size={16} /> Dispatch Recognition
                        </Button>
                        <Button variant="ghost" className="h-12 px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest text-slate-400" onClick={() => setIsDialogOpen(false)}>Discard</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ContinuousFeedbackPage;
