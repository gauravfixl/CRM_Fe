"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    CheckCircle2,
    Plus,
    Search,
    ArrowRight,
    Calendar,
    MoreVertical,
    MessageCircle,
    ClipboardCheck,
    ListChecks,
    Notebook,
    Download,
    Edit,
    Trash2,
    UserCog,
    XCircle,
    AlertCircle,
} from "lucide-react";
import {
    firstError,
    isFutureDate,
    maxLength,
    required,
    type ValidationErrors,
} from "@/shared/utils/validators";
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

const emptyForm: Omit<Review, "id" | "status"> = {
    reviewerName: "",
    reviewerAvatar: "",
    revieweeName: "",
    revieweeId: "",
    type: "Peer",
    dueDate: "",
    notes: "",
    actionItems: [],
};

const ReviewsPage = () => {
    const { toast } = useToast();
    const { reviews, addReview, updateReview, deleteReview } = usePerformanceStore();

    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isReassignOpen, setIsReassignOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [activeReview, setActiveReview] = useState<Review | null>(null);

    const [formData, setFormData] = useState<Omit<Review, "id" | "status">>(emptyForm);
    const [editData, setEditData] = useState<Omit<Review, "id" | "status">>(emptyForm);
    const [newReviewerName, setNewReviewerName] = useState("");

    const [newActionItem, setNewActionItem] = useState("");
    const [isAddingAction, setIsAddingAction] = useState(false);
    const [detailNotes, setDetailNotes] = useState("");
    const [detailStatus, setDetailStatus] = useState<Review["status"]>("Pending");

    const [createErrors, setCreateErrors] = useState<ValidationErrors>({});
    const [editErrors, setEditErrors] = useState<ValidationErrors>({});
    const [reassignError, setReassignError] = useState<string | null>(null);

    const validateReviewForm = (data: Omit<Review, "id" | "status">): ValidationErrors => {
        const e: ValidationErrors = {};
        const r = firstError(required(data.reviewerName, "Reviewer name"), maxLength(data.reviewerName, 100, "Name"));
        if (r) e.reviewerName = r;
        const rv = firstError(required(data.revieweeName, "Reviewee name"), maxLength(data.revieweeName, 100, "Name"));
        if (rv) e.revieweeName = rv;
        const d = firstError(required(data.dueDate, "Due date"), isFutureDate(data.dueDate, "Due date"));
        if (d) e.dueDate = d;
        const n = maxLength(data.notes || "", 1000, "Notes");
        if (n) e.notes = n;
        return e;
    };

    const handleAddReview = () => {
        const v = validateReviewForm(formData);
        setCreateErrors(v);
        if (Object.keys(v).length > 0) {
            toast({ title: "Validation failed", description: "Please correct the highlighted fields.", variant: "destructive" });
            return;
        }
        addReview({
            ...formData,
            reviewerAvatar: formData.reviewerName.charAt(0).toUpperCase(),
        });
        toast({ title: "Review Initialized", description: `Task assigned to ${formData.reviewerName}.` });
        setIsDialogOpen(false);
        setFormData(emptyForm);
        setCreateErrors({});
    };

    const handleEditSave = () => {
        if (!activeReview) return;
        const v = validateReviewForm(editData);
        // When editing, allow past dates since an existing review's deadline may already be in the past
        delete v.dueDate;
        const d = required(editData.dueDate, "Due date");
        if (d) v.dueDate = d;
        setEditErrors(v);
        if (Object.keys(v).length > 0) {
            toast({ title: "Validation failed", description: "Please correct the highlighted fields.", variant: "destructive" });
            return;
        }
        updateReview(activeReview.id, {
            ...editData,
            reviewerAvatar: editData.reviewerName.charAt(0).toUpperCase(),
        });
        toast({ title: "Review Updated", description: "Assignment details saved." });
        setIsEditOpen(false);
        setEditErrors({});
    };

    const handleReassign = () => {
        if (!activeReview) return;
        const err = firstError(required(newReviewerName, "Reviewer name"), maxLength(newReviewerName, 100, "Name"));
        if (err) { setReassignError(err); return; }
        updateReview(activeReview.id, {
            reviewerName: newReviewerName,
            reviewerAvatar: newReviewerName.charAt(0).toUpperCase(),
        });
        toast({ title: "Reviewer Changed", description: `Reassigned to ${newReviewerName}.` });
        setIsReassignOpen(false);
        setNewReviewerName("");
        setReassignError(null);
    };

    const handleDelete = () => {
        if (!activeReview) return;
        deleteReview(activeReview.id);
        toast({ title: "Review Cancelled", description: "Review assignment removed." });
        setIsDeleteOpen(false);
        setActiveReview(null);
    };

    const downloadForms = (r: Review) => {
        const txt = [
            "PERFORMANCE REVIEW FORM",
            "=========================",
            `Review ID: ${r.id}`,
            `Type: ${r.type}`,
            `Status: ${r.status}`,
            `Reviewer: ${r.reviewerName}`,
            `Reviewee: ${r.revieweeName} (${r.revieweeId})`,
            `Due Date: ${r.dueDate}`,
            `Submitted At: ${r.submittedAt || "—"}`,
            "",
            `Notes: ${r.notes || "—"}`,
            "",
            "Action Items:",
            ...(r.actionItems || []).map((a, i) => `  ${i + 1}. ${a}`),
        ].join("\n");
        const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Review_${r.id}_${r.revieweeName.replace(/\s/g, "_")}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast({ title: "Form Downloaded", description: "Review form exported." });
    };

    const getTypeStyles = (type: Review["type"]) => {
        const styles = {
            Peer: "bg-blue-50 text-blue-600 border-blue-100",
            Manager: "bg-purple-50 text-purple-600 border-purple-100",
            "Direct Report": "bg-amber-50 text-amber-600 border-amber-100",
            "1-on-1": "bg-emerald-50 text-emerald-600 border-emerald-100",
        };
        return styles[type];
    };

    const filteredReviews = reviews.filter((r) => {
        const matchesSearch =
            r.revieweeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.reviewerName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab =
            activeTab === "all" ||
            r.status.toLowerCase() === activeTab ||
            (activeTab === "1-on-1" && r.type === "1-on-1");
        return matchesSearch && matchesTab;
    });

    const pendingReviews = reviews.filter((r) => r.status === "Pending");

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
                            onClick={() => { setFormData(emptyForm); setCreateErrors({}); setIsDialogOpen(true); }}
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
                            <h3 className="text-2xl font-bold tracking-tight text-amber-700">
                                {pendingReviews.length} Pending {pendingReviews.length === 1 ? "Review" : "Reviews"}
                            </h3>
                        </div>
                        <Button
                            className="w-fit bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold px-4 h-8 rounded-lg z-10 transition-all tracking-widest border-none"
                            onClick={() => { setActiveTab("pending"); toast({ title: "Filtered", description: "Showing pending reviews that need reviewer attention." }); }}
                        >
                            Jump to Pending
                        </Button>
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
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
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
                                    {filteredReviews.length === 0 && (
                                        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                                            <p className="text-slate-400 text-sm font-semibold">No review records match your filters.</p>
                                        </div>
                                    )}
                                    {filteredReviews.map((review, i) => (
                                        <motion.div
                                            key={review.id}
                                            layout
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
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
                                                                    setDetailNotes(review.notes || "");
                                                                    setDetailStatus(review.status);
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
                                                                <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl p-1.5 w-52 font-bold">
                                                                    <DropdownMenuItem
                                                                        className="rounded-lg h-10 text-[10px] uppercase tracking-wide"
                                                                        onClick={() => {
                                                                            setActiveReview(review);
                                                                            setEditData({
                                                                                reviewerName: review.reviewerName,
                                                                                reviewerAvatar: review.reviewerAvatar,
                                                                                revieweeName: review.revieweeName,
                                                                                revieweeId: review.revieweeId,
                                                                                type: review.type,
                                                                                dueDate: review.dueDate,
                                                                                notes: review.notes || "",
                                                                                actionItems: review.actionItems || [],
                                                                            });
                                                                            setEditErrors({});
                                                                            setIsEditOpen(true);
                                                                        }}
                                                                    >
                                                                        <Edit size={12} className="mr-2" /> Edit Review
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        className="rounded-lg h-10 text-[10px] uppercase tracking-wide"
                                                                        onClick={() => downloadForms(review)}
                                                                    >
                                                                        <Download size={12} className="mr-2" /> Download Form
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        className="rounded-lg h-10 text-[10px] uppercase tracking-wide"
                                                                        onClick={() => {
                                                                            setActiveReview(review);
                                                                            setNewReviewerName(review.reviewerName);
                                                                            setReassignError(null);
                                                                            setIsReassignOpen(true);
                                                                        }}
                                                                    >
                                                                        <UserCog size={12} className="mr-2" /> Change Reviewer
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        className="rounded-lg h-10 text-[10px] uppercase tracking-wide text-rose-600 focus:bg-rose-50"
                                                                        onClick={() => {
                                                                            setActiveReview(review);
                                                                            setIsDeleteOpen(true);
                                                                        }}
                                                                    >
                                                                        <XCircle size={12} className="mr-2" /> Cancel Review
                                                                    </DropdownMenuItem>
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

            {/* Audit Detail Dialog */}
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status</Label>
                                <Select value={detailStatus} onValueChange={(v) => setDetailStatus(v as Review["status"])}>
                                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold px-5 focus:bg-white text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl p-1.5 font-bold">
                                        <SelectItem value="Pending" className="rounded-lg h-10 text-[10px] uppercase tracking-wide">Pending</SelectItem>
                                        <SelectItem value="Completed" className="rounded-lg h-10 text-[10px] uppercase tracking-wide">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Due</Label>
                                <Input
                                    className="rounded-xl h-12 bg-slate-50 border-slate-100 font-bold px-5 text-sm"
                                    value={activeReview?.dueDate || ""}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Review Notes / Summary</Label>
                            <Textarea
                                className="rounded-2xl bg-slate-50 border-slate-100 min-h-[120px] p-5 font-semibold text-sm focus:bg-white transition-all shadow-inner"
                                placeholder="Summary of discussion points..."
                                value={detailNotes}
                                onChange={(e) => setDetailNotes(e.target.value)}
                            />
                        </div>

                        <div className="space-y-4">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tracked Action Items</Label>
                            <div className="space-y-2">
                                {(activeReview?.actionItems || []).length === 0 && (
                                    <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl">No action items yet.</p>
                                )}
                                {(activeReview?.actionItems || []).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white transition-all">
                                        <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                                            <CheckCircle2 size={14} />
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex-1">{item}</span>
                                        <Button
                                            variant="ghost"
                                            className="h-7 w-7 p-0 text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                                            onClick={() => {
                                                if (!activeReview) return;
                                                const updated = (activeReview.actionItems || []).filter((_, i) => i !== idx);
                                                updateReview(activeReview.id, { actionItems: updated });
                                                setActiveReview({ ...activeReview, actionItems: updated });
                                            }}
                                        >
                                            <Trash2 size={12} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            {isAddingAction ? (
                                <div className="flex items-center gap-2">
                                    <Input
                                        className="rounded-xl h-9 bg-slate-50 border-slate-100 font-bold px-4 text-sm flex-1"
                                        placeholder="Enter action item..."
                                        value={newActionItem}
                                        onChange={(e) => setNewActionItem(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && newActionItem.trim() && activeReview) {
                                                const updatedItems = [...(activeReview.actionItems || []), newActionItem.trim()];
                                                updateReview(activeReview.id, { actionItems: updatedItems });
                                                setActiveReview({ ...activeReview, actionItems: updatedItems });
                                                setNewActionItem("");
                                                setIsAddingAction(false);
                                                toast({ title: "Action Item Added", description: "New action item tracked." });
                                            }
                                        }}
                                        autoFocus
                                    />
                                    <Button
                                        className="bg-indigo-600 text-white rounded-xl h-9 px-4 font-bold text-[10px] tracking-widest border-none"
                                        onClick={() => {
                                            if (newActionItem.trim() && activeReview) {
                                                const updatedItems = [...(activeReview.actionItems || []), newActionItem.trim()];
                                                updateReview(activeReview.id, { actionItems: updatedItems });
                                                setActiveReview({ ...activeReview, actionItems: updatedItems });
                                                setNewActionItem("");
                                                setIsAddingAction(false);
                                                toast({ title: "Action Item Added", description: "New action item tracked." });
                                            }
                                        }}
                                    >
                                        Save
                                    </Button>
                                    <Button variant="ghost" className="h-9 px-3 rounded-xl text-slate-400" onClick={() => { setIsAddingAction(false); setNewActionItem(""); }}>Cancel</Button>
                                </div>
                            ) : (
                                <Button variant="ghost" className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest gap-2 hover:bg-indigo-50 px-4 h-9 rounded-xl border-none" onClick={() => setIsAddingAction(true)}>
                                    <Plus size={14} /> Add Action Item
                                </Button>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-6 border-t border-slate-50 sm:justify-start">
                        <Button
                            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 font-bold text-[11px] uppercase tracking-widest shadow-xl transition-all border-none"
                            onClick={() => {
                                if (activeReview) {
                                    updateReview(activeReview.id, {
                                        notes: detailNotes,
                                        status: detailStatus,
                                        submittedAt: detailStatus === "Completed" ? new Date().toISOString() : activeReview.submittedAt,
                                    });
                                    toast({ title: "Audit Trail Updated", description: "Notes and status saved successfully." });
                                }
                                setIsDetailOpen(false);
                            }}
                        >
                            Update Live Status
                        </Button>
                        <Button variant="ghost" className="h-12 px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest text-slate-400" onClick={() => setIsDetailOpen(false)}>Close View</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Schedule New Dialog */}
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
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Reviewer Name *</Label>
                                <Input
                                    maxLength={100}
                                    className={`rounded-xl h-12 bg-slate-50 border-slate-100 font-bold px-5 focus:bg-white transition-all text-sm ${createErrors.reviewerName ? "border-rose-400" : ""}`}
                                    placeholder="Name"
                                    value={formData.reviewerName}
                                    onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
                                />
                                {createErrors.reviewerName && <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1 ml-1"><AlertCircle size={10} /> {createErrors.reviewerName}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Reviewee Name *</Label>
                                <Input
                                    maxLength={100}
                                    className={`rounded-xl h-12 bg-slate-50 border-slate-100 font-bold px-5 focus:bg-white transition-all text-sm ${createErrors.revieweeName ? "border-rose-400" : ""}`}
                                    placeholder="Name"
                                    value={formData.revieweeName}
                                    onChange={(e) => setFormData({ ...formData, revieweeName: e.target.value })}
                                />
                                {createErrors.revieweeName && <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1 ml-1"><AlertCircle size={10} /> {createErrors.revieweeName}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Reviewee ID</Label>
                                <Input
                                    maxLength={50}
                                    className="rounded-xl h-12 bg-slate-50 border-slate-100 font-bold px-5 focus:bg-white transition-all text-sm"
                                    placeholder="EMP001"
                                    value={formData.revieweeId}
                                    onChange={(e) => setFormData({ ...formData, revieweeId: e.target.value })}
                                />
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
                                        <SelectItem value="Direct Report" className="rounded-lg h-10 text-[10px] uppercase tracking-wide">Direct Report</SelectItem>
                                        <SelectItem value="1-on-1" className="rounded-lg h-10 text-[10px] uppercase tracking-wide text-indigo-600 font-black">1-on-1 Check-in</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Due Date *</Label>
                            <Input
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                className={`rounded-xl h-12 bg-slate-50 border-slate-100 font-bold px-5 focus:bg-white transition-all text-sm ${createErrors.dueDate ? "border-rose-400" : ""}`}
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                            {createErrors.dueDate && <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1 ml-1"><AlertCircle size={10} /> {createErrors.dueDate}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Notes</Label>
                            <Textarea
                                maxLength={1000}
                                className={`rounded-xl bg-slate-50 border-slate-100 font-semibold px-5 py-3 text-sm ${createErrors.notes ? "border-rose-400" : ""}`}
                                placeholder="Optional context or agenda..."
                                value={formData.notes || ""}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                            <p className="text-[10px] text-slate-400 ml-1">{(formData.notes || "").length}/1000</p>
                            {createErrors.notes && <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1 ml-1"><AlertCircle size={10} /> {createErrors.notes}</p>}
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button variant="ghost" className="h-12 px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest text-slate-400" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button className="flex-1 bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-12 font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all border-none" onClick={handleAddReview}>
                                Deploy Review Cycle
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="bg-white rounded-[2.5rem] border-none p-10 max-w-xl shadow-3xl font-sans" style={{ zoom: "80%" }}>
                    <DialogHeader className="space-y-3 text-start">
                        <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-2 shadow-inner border border-emerald-100">
                            <Edit size={26} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight uppercase text-slate-900">Edit Review</DialogTitle>
                    </DialogHeader>

                    <div className="py-6 space-y-5 text-start">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Reviewer *</Label>
                                <Input
                                    maxLength={100}
                                    className={`rounded-xl h-12 bg-slate-50 border-slate-100 font-bold px-5 text-sm ${editErrors.reviewerName ? "border-rose-400" : ""}`}
                                    value={editData.reviewerName}
                                    onChange={(e) => setEditData({ ...editData, reviewerName: e.target.value })}
                                />
                                {editErrors.reviewerName && <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1 ml-1"><AlertCircle size={10} /> {editErrors.reviewerName}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Reviewee *</Label>
                                <Input
                                    maxLength={100}
                                    className={`rounded-xl h-12 bg-slate-50 border-slate-100 font-bold px-5 text-sm ${editErrors.revieweeName ? "border-rose-400" : ""}`}
                                    value={editData.revieweeName}
                                    onChange={(e) => setEditData({ ...editData, revieweeName: e.target.value })}
                                />
                                {editErrors.revieweeName && <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1 ml-1"><AlertCircle size={10} /> {editErrors.revieweeName}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Type</Label>
                                <Select value={editData.type} onValueChange={(v) => setEditData({ ...editData, type: v as any })}>
                                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold px-5 focus:bg-white text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl p-1.5 font-bold">
                                        <SelectItem value="Peer" className="rounded-lg h-10 text-[10px] uppercase tracking-wide">Peer</SelectItem>
                                        <SelectItem value="Manager" className="rounded-lg h-10 text-[10px] uppercase tracking-wide">Manager</SelectItem>
                                        <SelectItem value="Direct Report" className="rounded-lg h-10 text-[10px] uppercase tracking-wide">Direct Report</SelectItem>
                                        <SelectItem value="1-on-1" className="rounded-lg h-10 text-[10px] uppercase tracking-wide">1-on-1</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Due Date *</Label>
                                <Input
                                    type="date"
                                    className={`rounded-xl h-12 bg-slate-50 border-slate-100 font-bold px-5 text-sm ${editErrors.dueDate ? "border-rose-400" : ""}`}
                                    value={editData.dueDate}
                                    onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                                />
                                {editErrors.dueDate && <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1 ml-1"><AlertCircle size={10} /> {editErrors.dueDate}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Notes</Label>
                            <Textarea
                                maxLength={1000}
                                className={`rounded-xl bg-slate-50 border-slate-100 font-semibold px-5 py-3 text-sm ${editErrors.notes ? "border-rose-400" : ""}`}
                                value={editData.notes || ""}
                                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                            />
                            <p className="text-[10px] text-slate-400 ml-1">{(editData.notes || "").length}/1000</p>
                            {editErrors.notes && <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1 ml-1"><AlertCircle size={10} /> {editErrors.notes}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" className="h-10 px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest text-slate-400" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button className="bg-emerald-600 hover:bg-slate-900 text-white rounded-xl h-10 px-6 font-bold text-[10px] uppercase tracking-widest border-none" onClick={handleEditSave}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reassign Dialog */}
            <Dialog open={isReassignOpen} onOpenChange={setIsReassignOpen}>
                <DialogContent className="bg-white rounded-[2.5rem] border-none p-8 max-w-md shadow-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Change Reviewer</DialogTitle>
                        <DialogDescription>Assign this review to a different reviewer.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">New Reviewer Name *</Label>
                        <Input
                            maxLength={100}
                            className={`h-11 rounded-xl bg-slate-50 border-slate-100 ${reassignError ? "border-rose-400" : ""}`}
                            value={newReviewerName}
                            onChange={(e) => { setNewReviewerName(e.target.value); setReassignError(null); }}
                            placeholder="Enter name..."
                        />
                        {reassignError && <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1"><AlertCircle size={12} /> {reassignError}</p>}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsReassignOpen(false)}>Cancel</Button>
                        <Button className="bg-indigo-600 text-white hover:bg-slate-900 border-none" onClick={handleReassign}>
                            Reassign
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel review?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will log a cancellation and remove this review assignment.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep Review</AlertDialogCancel>
                        <AlertDialogAction className="bg-rose-600 hover:bg-rose-700 text-white" onClick={handleDelete}>
                            Cancel Review
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ReviewsPage;
