"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    CheckCircle2,
    Timer,
    Plus,
    Search,
    Filter,
    ArrowRight,
    Star,
    Calendar,
    Clock,
    MoreVertical,
    FileText,
    History,
    ShieldCheck,
    Eye,
    Zap,
    MessageSquare,
    ClipboardCheck,
    MessageCircle,
    ListChecks,
    Notebook,
    Download
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { usePerformanceStore, type Review } from "@/shared/data/performance-store";
import { useToast } from "@/shared/components/ui/use-toast";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

const ReviewsPage = () => {
    const { toast } = useToast();
    const { reviews, addReview, updateReview } = usePerformanceStore();

    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [activeReview, setActiveReview] = useState<Review | null>(null);

    const [formData, setFormData] = useState<Omit<Review, 'id' | 'status'>>({
        reviewerName: "",
        reviewerAvatar: "",
        revieweeName: "",
        revieweeId: "",
        type: "Peer",
        dueDate: "",
        notes: "",
        actionItems: []
    });

    const handleAddReview = () => {
        if (!formData.reviewerName || !formData.revieweeName || !formData.dueDate) {
            toast({ title: "Error", description: "Reviewer, Reviewee and Date are required", variant: "destructive" });
            return;
        }
        addReview({
            ...formData,
            reviewerAvatar: formData.reviewerName.charAt(0)
        });
        toast({ title: "Review Initialized", description: `Task assigned to ${formData.reviewerName}.` });
        setIsDialogOpen(false);
        setFormData({
            reviewerName: "",
            reviewerAvatar: "",
            revieweeName: "",
            revieweeId: "",
            type: "Peer",
            dueDate: "",
            notes: "",
            actionItems: []
        });
    };

    const handleUpdateReview = (id: string, updates: Partial<Review>) => {
        updateReview(id, updates);
        toast({ title: "Audit Trail Updated", description: "Notes and status saved successfully." });
    };

    const getTypeStyles = (type: Review['type']) => {
        const styles = {
            'Peer': 'bg-blue-50 text-blue-600 border-blue-100',
            'Manager': 'bg-purple-50 text-purple-600 border-purple-100',
            'Direct Report': 'bg-amber-50 text-amber-600 border-amber-100',
            '1-on-1': 'bg-emerald-50 text-emerald-600 border-emerald-100'
        };
        return styles[type];
    };

    const filteredReviews = reviews.filter(r => {
        const matchesSearch = r.revieweeName.toLowerCase().includes(searchQuery.toLowerCase()) || r.reviewerName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'all' || r.status.toLowerCase() === activeTab || (activeTab === '1-on-1' && r.type === '1-on-1');
        return matchesSearch && matchesTab;
    });

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans" style={{ zoom: "80%" }}>
            <header className="py-2.5 px-8 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm rounded-b-3xl">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1 text-start">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Review Cycles & 1-on-1s</h1>
                            <Badge className="bg-indigo-600 text-white border-none font-bold text-[10px] tracking-widest h-6 px-3">HR Monitoring</Badge>
                        </div>
                        <p className="text-slate-500 text-sm font-semibold">Track continuous check-ins, quarterly reviews, and peer evaluation assignments.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setIsDialogOpen(true)}
                            className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100 transition-all gap-2 text-[10px] tracking-widest border-none"
                        >
                            <Plus size={16} /> Schedule Review/1-on-1
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-8 max-w-[1600px] mx-auto w-full space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="rounded-3xl border border-indigo-100 bg-indigo-50 p-7 flex flex-col justify-between h-44 shadow-sm group hover:shadow-md transition-all text-start">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-indigo-400 tracking-widest">Active 1-on-1 Tasks</p>
                                <h3 className="text-4xl font-black text-indigo-700 tracking-tight">{reviews.filter(r => r.type === '1-on-1' && r.status === 'Pending').length}</h3>
                            </div>
                            <div className="h-11 w-11 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner">
                                <MessageCircle size={22} />
                            </div>
                        </div>
                        <p className="text-[9px] font-bold text-indigo-400 tracking-widest flex items-center gap-2 italic">Real-time check-in velocity</p>
                    </Card>

                    <Card className="rounded-3xl border border-emerald-100 bg-emerald-50 p-7 flex flex-col justify-between h-44 shadow-sm group hover:shadow-md transition-all text-start">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-emerald-500 tracking-widest">Quarterly Audits</p>
                                <h3 className="text-4xl font-black text-emerald-700 tracking-tight">{reviews.filter(r => r.type !== '1-on-1').length}</h3>
                            </div>
                            <div className="h-11 w-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                                <Notebook size={22} />
                            </div>
                        </div>
                        <p className="text-[9px] font-bold text-emerald-600 tracking-widest flex items-center gap-2 italic">Audit lifecycle healthy</p>
                    </Card>

                    <Card className="rounded-3xl border border-amber-100 bg-amber-50 p-7 flex flex-col justify-between h-44 shadow-sm group hover:shadow-md transition-all text-start relative overflow-hidden">
                        <div className="z-10 space-y-1">
                            <p className="text-[10px] font-bold text-amber-500 tracking-widest">Action Required</p>
                            <h3 className="text-2xl font-bold tracking-tight text-amber-700">Assign Reviewers</h3>
                        </div>
                        <Button className="w-fit bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold px-4 h-8 rounded-lg z-10 transition-all tracking-widest border-none">Quick Assign</Button>
                        <Users size={100} className="absolute -bottom-8 -right-8 opacity-10 group-hover:scale-110 transition-transform text-amber-400" />
                    </Card>
                </div>

                <div className="space-y-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                            <TabsList className="bg-slate-100/50 p-1 rounded-xl h-12 shadow-inner border border-slate-100">
                                <TabsTrigger value="all" className="rounded-lg px-6 font-bold text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all border-none">Everything</TabsTrigger>
                                <TabsTrigger value="1-on-1" className="rounded-lg px-6 font-bold text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all border-none">1-on-1 Records</TabsTrigger>
                                <TabsTrigger value="pending" className="rounded-lg px-6 font-bold text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all border-none">Open Tasks</TabsTrigger>
                                <TabsTrigger value="completed" className="rounded-lg px-6 font-bold text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all border-none">Finalized</TabsTrigger>
                            </TabsList>

                            <div className="relative group flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -transform -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                <Input
                                    placeholder="Search by participants or type..."
                                    className="pl-11 h-12 rounded-xl bg-white border-slate-100 shadow-sm font-semibold text-sm focus:border-indigo-500 transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <TabsContent value={activeTab}>
                            <AnimatePresence mode="popLayout">
                                <div className="grid grid-cols-1 gap-4 text-start">
                                    {filteredReviews.map((review, i) => (
                                        <motion.div
                                            key={review.id}
                                            layout
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Card className="group border border-slate-100 shadow-sm hover:shadow-xl transition-all rounded-3xl bg-white overflow-hidden p-0">
                                                <CardContent className="p-6">
                                                    <div className="flex flex-col lg:flex-row items-center gap-8">
                                                        <div className="flex items-center gap-10 shrink-0">
                                                            <div className="flex flex-col items-center gap-2">
                                                                <Avatar className="h-14 w-14 border-2 border-white shadow-md ring-1 ring-slate-100 rounded-xl overflow-hidden">
                                                                    <AvatarFallback className="bg-slate-900 text-white font-bold">{review.reviewerAvatar}</AvatarFallback>
                                                                </Avatar>
                                                                <p className="text-[9px] font-bold text-slate-400 tracking-widest leading-none">Reviewer</p>
                                                            </div>
                                                            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                                                                <ArrowRight size={20} />
                                                            </div>
                                                            <div className="flex flex-col items-center gap-2">
                                                                <Avatar className="h-14 w-14 border-2 border-indigo-50 shadow-md ring-1 ring-indigo-100 rounded-xl overflow-hidden">
                                                                    <AvatarFallback className="bg-indigo-600 text-white font-bold">{review.revieweeName.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                <p className="text-[9px] font-bold text-slate-400 tracking-widest leading-none">Reviewee</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 space-y-4">
                                                            <div className="flex flex-wrap items-center gap-3">
                                                                <h4 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                                                                    {review.reviewerName} & {review.revieweeName}
                                                                </h4>
                                                                <Badge variant="outline" className={`border-none font-bold text-[9px] h-6 px-3 rounded-lg tracking-widest shadow-sm ${getTypeStyles(review.type)}`}>
                                                                    {review.type} Workflow
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center gap-8">
                                                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
                                                                    <Calendar size={13} className="text-slate-300" /> Deadline: {new Date(review.dueDate).toLocaleDateString()}
                                                                </div>
                                                                <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${review.status === 'Completed' ? 'text-emerald-600' : 'text-amber-500'}`}>
                                                                    <div className={`h-2.5 w-2.5 rounded-full ${review.status === 'Completed' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 animate-pulse'}`} />
                                                                    {review.status}
                                                                </div>
                                                            </div>
                                                            {review.notes && (
                                                                <p className="text-xs text-slate-500 font-semibold italic line-clamp-1 border-l-2 border-slate-100 pl-4 py-0.5">"{review.notes}"</p>
                                                            )}
                                                        </div>

                                                        <div className="flex lg:flex-col items-center justify-end gap-3 pt-6 lg:pt-0 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-50 lg:pl-8 w-full lg:w-auto">
                                                            <Button
                                                                variant="secondary"
                                                                className="bg-slate-50 hover:bg-white text-slate-600 rounded-xl h-10 px-5 border-none font-bold text-[10px] uppercase tracking-widest gap-2 shadow-sm flex-1 lg:flex-none"
                                                                onClick={() => {
                                                                    setActiveReview(review);
                                                                    setIsDetailOpen(true);
                                                                }}
                                                            >
                                                                <ClipboardCheck size={16} /> Audit Record
                                                            </Button>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" className="h-10 w-10 text-slate-300 hover:text-slate-600 rounded-xl hover:bg-slate-50">
                                                                        <MoreVertical size={18} />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl p-1.5 w-48 font-bold">
                                                                    <DropdownMenuItem className="rounded-lg h-10 text-[10px] uppercase tracking-wide">Download Forms</DropdownMenuItem>
                                                                    <DropdownMenuItem className="rounded-lg h-10 text-[10px] uppercase tracking-wide">Change Reviewer</DropdownMenuItem>
                                                                    <DropdownMenuItem className="rounded-lg h-10 text-[10px] uppercase tracking-wide text-rose-600 focus:bg-rose-50">Log Cancellation</DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            </AnimatePresence>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="bg-white rounded-[2.5rem] border-none p-10 max-w-2xl shadow-3xl font-sans" style={{ zoom: "80%" }}>
                    <DialogHeader className="space-y-3 text-start">
                        <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-2 shadow-inner border border-indigo-100">
                            <ListChecks size={28} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Review Audit Trail</DialogTitle>
                        <DialogDescription className="text-slate-500 font-semibold text-sm text-start">View check-in notes, action items and record final summary.</DialogDescription>
                    </DialogHeader>

                    <div className="py-8 space-y-5 text-start">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Review Notes / Summary</Label>
                            <Textarea
                                className="rounded-2xl bg-slate-50 border-slate-100 min-h-[120px] p-5 font-semibold text-sm focus:bg-white transition-all shadow-inner"
                                placeholder="Summary of discussion points..."
                                defaultValue={activeReview?.notes}
                            />
                        </div>

                        <div className="space-y-4">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tracked Action Items</Label>
                            <div className="space-y-2">
                                {(activeReview?.actionItems || ["Complete Goal Setting", "Improve team collaboration"]).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white transition-all">
                                        <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                                            <CheckCircle2 size={14} />
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest gap-2 hover:bg-indigo-50 px-4 h-9 rounded-xl border-none"><Plus size={14} /> Add Action Item</Button>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-6 border-t border-slate-50 sm:justify-start">
                        <Button
                            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 font-bold text-[11px] uppercase tracking-widest shadow-xl transition-all border-none"
                            onClick={() => setIsDetailOpen(false)}
                        >
                            Update Live Status
                        </Button>
                        <Button variant="ghost" className="h-12 px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest text-slate-400" onClick={() => setIsDetailOpen(false)}>Close View</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white rounded-[2.5rem] border-none p-10 max-w-xl shadow-3xl font-sans" style={{ zoom: "80%" }}>
                    <DialogHeader className="space-y-3 text-start">
                        <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-2 shadow-inner border border-indigo-100">
                            <Plus size={28} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight uppercase text-slate-900">Schedule Review Audit</DialogTitle>
                        <DialogDescription className="text-slate-500 font-semibold text-sm text-start">Assign participants and category cycle.</DialogDescription>
                    </DialogHeader>

                    <div className="py-8 space-y-5 text-start">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Reviewer Name</Label>
                                <Input
                                    className="rounded-xl h-12 bg-slate-50 border-slate-100 font-bold px-5 focus:bg-white transition-all text-sm"
                                    placeholder="Name"
                                    value={formData.reviewerName}
                                    onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Reviewee Name</Label>
                                <Input
                                    className="rounded-xl h-12 bg-slate-50 border-slate-100 font-bold px-5 focus:bg-white transition-all text-sm"
                                    placeholder="Name"
                                    value={formData.revieweeName}
                                    onChange={(e) => setFormData({ ...formData, revieweeName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Review Type</Label>
                            <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
                                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold px-5 focus:bg-white text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl p-1.5 font-bold">
                                    <SelectItem value="Peer" className="rounded-lg h-10 text-[10px] uppercase tracking-wide">Peer Evaluation</SelectItem>
                                    <SelectItem value="Manager" className="rounded-lg h-10 text-[10px] uppercase tracking-wide">Manager Review</SelectItem>
                                    <SelectItem value="1-on-1" className="rounded-lg h-10 text-[10px] uppercase tracking-wide text-indigo-600 font-black">1-on-1 Check-in</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Due Date</Label>
                            <Input
                                type="date"
                                className="rounded-xl h-12 bg-slate-50 border-slate-100 font-bold px-5 focus:bg-white transition-all text-sm"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>

                        <Button className="w-full bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-12 font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all border-none mt-2" onClick={handleAddReview}>
                            Deploy Review Cycle
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ReviewsPage;
