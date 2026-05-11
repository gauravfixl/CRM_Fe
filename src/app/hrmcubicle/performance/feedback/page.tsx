"use client"

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
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
    Edit,
    Trash2,
    CheckCircle2,
    FlagTriangleRight,
    AlertCircle,
    Loader2,
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
import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import {
    createFeedback as apiCreateFeedback,
    deleteFeedback as apiDeleteFeedback,
    getAllEmployees,
    getAllFeedback,
} from "@/modules/hrm/hooks/hrmHooks";
import {
    firstError,
    isNumberInRange,
    maxLength,
    required,
    type ValidationErrors,
} from "@/shared/utils/validators";

interface EmployeeOpt { id: string; label: string; name: string; }

// Maps frontend-friendly categories to backend enum Peer/Subordinate/Manager/Self
const toBackendFeedbackType = (c: Feedback["category"]): "Peer" | "Subordinate" | "Manager" | "Self" => {
    if (c === "Improvement") return "Manager";   // coaching style feedback
    if (c === "General") return "Peer";          // informal peer note
    return "Peer";                                // appreciation defaults to Peer
};

const emptyForm = {
    toId: "",       // backend employee ObjectId
    to: { name: "", avatar: "" },
    message: "",
    rating: 4,
    category: "Appreciation" as Feedback["category"],
    isPublic: true,
    isAnonymous: false,
    from: { name: "HR Admin", avatar: "HA", role: "Administrator" },
};

const ContinuousFeedbackPage = () => {
    const { toast } = useToast();
    const { feedbacks, addFeedback, moderateFeedback, updateFeedback, deleteFeedback } = usePerformanceStore();
    const [employees, setEmployees] = useState<EmployeeOpt[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [sendErrors, setSendErrors] = useState<ValidationErrors>({});
    const [editErrors, setEditErrors] = useState<ValidationErrors>({});

    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isModPanelOpen, setIsModPanelOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [activeFeedback, setActiveFeedback] = useState<Feedback | null>(null);
    const [filterCategory, setFilterCategory] = useState<string | "All">("All");

    const [formData, setFormData] = useState(emptyForm);
    const [editData, setEditData] = useState({
        message: "",
        category: "Appreciation" as Feedback["category"],
        isPublic: true,
        isAnonymous: false,
    });

    // Initial load — feedback + employees
    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                const [fbRes, empRes] = await Promise.allSettled([getAllFeedback(), getAllEmployees()]);
                if (!mounted) return;
                if (fbRes.status === "fulfilled") {
                    const items = fbRes.value?.data?.feedbacks ?? [];
                    items.forEach((f: any) => {
                        const id = String(f.id ?? f._id ?? "");
                        if (!id) return;
                        const existing = usePerformanceStore.getState().feedbacks.find((x) => x.id === id);
                        if (!existing) {
                            const senderEmail = f.feedbackFrom?.email || "Manager";
                            const targetEmail = f.employee?.email || "Employee";
                            addFeedback({
                                from: { name: senderEmail, avatar: senderEmail[0].toUpperCase(), role: "Manager" },
                                to: { name: targetEmail, avatar: targetEmail[0].toUpperCase() },
                                message: f.comments || "",
                                category:
                                    f.feedbackType === "Manager"
                                        ? "Improvement"
                                        : f.feedbackType === "Peer" || f.feedbackType === "Subordinate"
                                            ? "Appreciation"
                                            : "General",
                                isPublic: true,
                                isAnonymous: false,
                            });
                            usePerformanceStore.setState((state) => ({
                                feedbacks: state.feedbacks.map((x, i) => (i === 0 ? { ...x, id, moderationStatus: "Approved" } : x)),
                            }));
                        }
                    });
                }
                if (empRes.status === "fulfilled") {
                    const list = empRes.value?.data?.employees ?? empRes.value?.data?.data ?? [];
                    setEmployees(
                        list.map((e: any) => {
                            const name = e.personalInfo?.fullName || e.firstName || e.name || "";
                            return {
                                id: String(e._id ?? e.id ?? ""),
                                name,
                                label: `${name} (${e.employeeId || e.personalInfo?.contact?.email || ""})`,
                            };
                        }).filter((e: EmployeeOpt) => e.id)
                    );
                }
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validateSend = (): ValidationErrors => {
        const e: ValidationErrors = {};
        const to = required(formData.toId, "Recipient");
        if (to) e.toId = to;
        const m = firstError(required(formData.message, "Message"), maxLength(formData.message, 1000, "Message"));
        if (m) e.message = m;
        const r = isNumberInRange(formData.rating, 1, 5, "Rating");
        if (r) e.rating = r;
        return e;
    };

    const handleSendFeedback = async () => {
        const v = validateSend();
        setSendErrors(v);
        if (Object.keys(v).length > 0) {
            toast({ title: "Validation failed", description: "Please complete required fields.", variant: "destructive" });
            return;
        }
        setSaving(true);
        try {
            const selected = employees.find((x) => x.id === formData.toId);
            const recipientName = selected?.name || formData.to.name || "Employee";

            let newId: string | null = null;
            try {
                const res = await apiCreateFeedback({
                    employee: formData.toId,
                    feedbackType: toBackendFeedbackType(formData.category),
                    rating: formData.rating,
                    comments: formData.message,
                });
                newId = res?.data?.feedback?._id ? String(res.data.feedback._id) : null;
            } catch { /* fallback to local */ }

            addFeedback({
                ...formData,
                to: { name: recipientName, avatar: recipientName.charAt(0).toUpperCase() },
            });
            if (newId) {
                usePerformanceStore.setState((state) => ({
                    feedbacks: state.feedbacks.map((x, i) => (i === 0 ? { ...x, id: newId!, moderationStatus: "Approved" } : x)),
                }));
            }
            toast({ title: "Feedback Dispatched", description: "Recognition has been queued." });
            setIsDialogOpen(false);
            setFormData(emptyForm);
            setSendErrors({});
        } finally {
            setSaving(false);
        }
    };

    const validateEdit = (): ValidationErrors => {
        const e: ValidationErrors = {};
        const m = firstError(required(editData.message, "Message"), maxLength(editData.message, 1000, "Message"));
        if (m) e.message = m;
        return e;
    };

    const handleEdit = () => {
        if (!activeFeedback) return;
        const v = validateEdit();
        setEditErrors(v);
        if (Object.keys(v).length > 0) return;
        // Backend has no update endpoint — frontend-only update
        updateFeedback(activeFeedback.id, editData);
        toast({ title: "Feedback Updated", description: "Message and visibility saved (local only — no backend update endpoint)." });
        setIsEditOpen(false);
        setEditErrors({});
    };

    const handleDelete = async () => {
        if (!activeFeedback) return;
        if (/^[a-f\d]{24}$/i.test(activeFeedback.id)) {
            try { await apiDeleteFeedback(activeFeedback.id); } catch { /* proceed locally */ }
        }
        deleteFeedback(activeFeedback.id);
        toast({ title: "Feedback Deleted", description: "Entry removed from the wall." });
        setIsDeleteOpen(false);
        setActiveFeedback(null);
    };

    const getCategoryStyles = (cat: Feedback["category"]) => {
        const styles = {
            Appreciation: "bg-emerald-50 text-emerald-600 border-emerald-100",
            Improvement: "bg-amber-50 text-amber-600 border-amber-100",
            General: "bg-indigo-50 text-indigo-600 border-indigo-100",
        };
        return styles[cat] || styles["General"];
    };

    const filteredFeedbacks = feedbacks.filter((f) => {
        const matchesSearch =
            f.to.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.message.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = filterCategory === "All" || f.category === filterCategory;
        return matchesSearch && matchesCat;
    });

    const pendingMod = feedbacks.filter((f) => f.moderationStatus === "Pending");

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
                        {loading && <Loader2 size={16} className="animate-spin text-indigo-500" />}
                        <Button
                            onClick={() => { setFormData(emptyForm); setSendErrors({}); setIsDialogOpen(true); }}
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
                                {pendingMod.length} Pending Approval{pendingMod.length === 1 ? "" : "s"} for Culture Wall
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setIsModPanelOpen(true)}
                        className="bg-indigo-600 text-white hover:bg-slate-900 rounded-xl h-10 px-6 font-bold text-[10px] tracking-widest relative z-10 border-none shadow-lg shadow-indigo-100 italic transition-all"
                    >
                        Launch Mod Panel
                    </Button>
                    <div className="absolute -right-10 -bottom-10 opacity-[0.05] text-indigo-900 group-hover:scale-110 transition-transform">
                        <ShieldCheck size={160} />
                    </div>
                </div>

                <div className="space-y-6 text-start">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative group flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
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
                            {filteredFeedbacks.length === 0 && (
                                <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 text-sm font-semibold">No feedback records match your filters.</p>
                                </div>
                            )}
                            {filteredFeedbacks.map((fb, i) => {
                                const categoryStyles = getCategoryStyles(fb.category);
                                return (
                                    <motion.div
                                        key={fb.id}
                                        layout
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Card className="group border border-slate-100 shadow-sm hover:shadow-xl transition-all rounded-3xl bg-white overflow-hidden p-0">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                                    <div className="flex flex-col items-center gap-3 shrink-0 md:w-28">
                                                        <div className="relative">
                                                            <Avatar className={`h-14 w-14 border-2 border-white shadow-md ring-1 ring-slate-100 rounded-xl overflow-hidden ${fb.isAnonymous ? "opacity-30 grayscale" : ""}`}>
                                                                <AvatarFallback className="bg-indigo-600 text-white font-bold text-lg">
                                                                    {fb.isAnonymous ? "?" : fb.to.avatar}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            {fb.isAnonymous && (
                                                                <div className="absolute top-0 right-0 h-5 w-5 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-white">
                                                                    <EyeOff size={10} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] font-bold text-slate-400 tracking-widest text-center truncate w-full">
                                                            {fb.isAnonymous ? "Identity Hidden" : fb.to.name}
                                                        </p>
                                                    </div>

                                                    <div className="flex-1 space-y-5">
                                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50/50 rounded-lg text-[9px] font-bold text-slate-400 tracking-widest">
                                                                    <UserCircle size={12} className="text-slate-300" /> From: {fb.isAnonymous ? "Anonymous User" : fb.from.name}
                                                                </div>
                                                                <Badge variant="outline" className={`${categoryStyles} border-none font-bold text-[9px] h-6 px-3 rounded-lg tracking-widest shadow-sm`}>
                                                                    {fb.category}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-[9px] text-slate-300 font-bold tracking-widest">
                                                                {fb.moderationStatus === "Approved" ? (
                                                                    <Badge className="bg-emerald-100 text-emerald-700 border-none text-[8px] h-5 px-2 rounded-md font-bold">Approved</Badge>
                                                                ) : fb.moderationStatus === "Hidden" ? (
                                                                    <Badge className="bg-slate-200 text-slate-700 border-none text-[8px] h-5 px-2 rounded-md font-bold">Hidden</Badge>
                                                                ) : (
                                                                    <Badge className="bg-amber-100 text-amber-700 border-none text-[8px] h-5 px-2 rounded-md font-bold">In Moderation</Badge>
                                                                )}
                                                                <div className="flex items-center gap-1.5">
                                                                    <Clock size={12} className="text-slate-200" /> {new Date(fb.timestamp).toLocaleDateString()}
                                                                </div>
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
                                                        <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl p-1.5 w-52 font-bold">
                                                            <DropdownMenuItem className="rounded-lg h-10 text-[10px] tracking-wide"
                                                                onClick={() => {
                                                                    setActiveFeedback(fb);
                                                                    setEditData({ message: fb.message, category: fb.category, isPublic: fb.isPublic, isAnonymous: fb.isAnonymous });
                                                                    setIsEditOpen(true);
                                                                }}
                                                            >
                                                                <Edit size={12} className="mr-2" /> Edit Message
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="rounded-lg h-10 text-[10px] tracking-wide" onClick={() => { moderateFeedback(fb.id, "Approved"); toast({ title: "Approved", description: "Feedback published to wall." }); }}>
                                                                <CheckCircle2 size={12} className="mr-2" /> Approve for Wall
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="rounded-lg h-10 text-[10px] tracking-wide" onClick={() => { moderateFeedback(fb.id, "Hidden"); toast({ title: "Hidden", description: "Feedback hidden from wall." }); }}>
                                                                <EyeOff size={12} className="mr-2" /> Hide Feedback
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="rounded-lg h-10 text-[10px] tracking-wide text-rose-600 focus:bg-rose-50"
                                                                onClick={() => { setActiveFeedback(fb); setIsDeleteOpen(true); }}
                                                            >
                                                                <Trash2 size={12} className="mr-2" /> Delete
                                                            </DropdownMenuItem>
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

            {/* Give Feedback SideFormSheet */}
            <SideFormSheet
                open={isDialogOpen}
                onOpenChange={(o) => { setIsDialogOpen(o); if (!o) setSendErrors({}); }}
                title="Configure Recognition"
                description="Select visibility, identity control, and participation category."
                icon={<Zap size={20} />}
                accentColor="#059669"
                width="lg"
                loading={saving}
                submitLabel={saving ? "Sending..." : "Dispatch Recognition"}
                onSubmit={(e) => { e.preventDefault(); handleSendFeedback(); }}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="To Participant" required error={sendErrors.toId || undefined}>
                            <Select value={formData.toId} onValueChange={(v) => {
                                const emp = employees.find((e) => e.id === v);
                                setFormData({ ...formData, toId: v, to: { name: emp?.name || "", avatar: (emp?.name || "").charAt(0).toUpperCase() } });
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder={employees.length ? "Choose recipient" : "Loading employees…"} />
                                </SelectTrigger>
                                <SelectContent className="max-h-72 overflow-y-auto">
                                    {employees.length === 0 && <div className="px-3 py-2 text-xs text-slate-400 italic">No employees available</div>}
                                    {employees.map((e) => (
                                        <SelectItem key={e.id} value={e.id}>{e.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Evaluation Category">
                            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as any })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Appreciation">Appreciation</SelectItem>
                                    <SelectItem value="Improvement">Coaching / Improvement</SelectItem>
                                    <SelectItem value="General">General Observations</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <Field label="Rating (1-5)" required error={sendErrors.rating || undefined}>
                        <Input
                            type="number" min={1} max={5}
                            value={formData.rating}
                            onChange={(e) => setFormData({ ...formData, rating: Math.max(1, Math.min(5, parseInt(e.target.value) || 1)) })}
                        />
                    </Field>

                    <Field label="Notes / Description" required error={sendErrors.message || undefined} hint={`${formData.message.length}/1000`}>
                        <Textarea
                            maxLength={1000}
                            className="min-h-[120px]"
                            placeholder="Describe the impact or behavior..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                    </Field>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer" onClick={() => setFormData({ ...formData, isAnonymous: !formData.isAnonymous })}>
                            <div className="flex items-center gap-3">
                                <div className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all ${formData.isAnonymous ? "bg-slate-900 text-white" : "bg-white text-slate-300 border border-slate-100"}`}>
                                    <EyeOff size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Anonymous</p>
                                    <p className="text-[11px] text-slate-400">Identity Hidden</p>
                                </div>
                            </div>
                            <Switch checked={formData.isAnonymous} onCheckedChange={(val) => setFormData({ ...formData, isAnonymous: val })} />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer" onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}>
                            <div className="flex items-center gap-3">
                                <div className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all ${formData.isPublic ? "bg-indigo-600 text-white" : "bg-white text-slate-300 border border-slate-100"}`}>
                                    <Users size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Public Post</p>
                                    <p className="text-[11px] text-slate-400">Live Wall</p>
                                </div>
                            </div>
                            <Switch checked={formData.isPublic} onCheckedChange={(val) => setFormData({ ...formData, isPublic: val })} />
                        </div>
                    </div>
                </div>
            </SideFormSheet>

            {/* Edit Feedback SideFormSheet */}
            <SideFormSheet
                open={isEditOpen}
                onOpenChange={(o) => { setIsEditOpen(o); if (!o) setEditErrors({}); }}
                title="Edit Feedback"
                description="Revise message, category, and visibility."
                icon={<Edit size={20} />}
                accentColor="#7c3aed"
                width="md"
                submitLabel="Save"
                onSubmit={(e) => { e.preventDefault(); handleEdit(); }}
            >
                <div className="space-y-4">
                    <Field label="Message" required error={editErrors.message || undefined} hint={`${editData.message.length}/1000`}>
                        <Textarea
                            maxLength={1000}
                            className="min-h-[100px]"
                            value={editData.message}
                            onChange={(e) => setEditData({ ...editData, message: e.target.value })}
                        />
                    </Field>
                    <Field label="Category">
                        <Select value={editData.category} onValueChange={(v) => setEditData({ ...editData, category: v as any })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Appreciation">Appreciation</SelectItem>
                                <SelectItem value="Improvement">Improvement</SelectItem>
                                <SelectItem value="General">General</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <Label className="text-xs font-bold">Anonymous</Label>
                        <Switch checked={editData.isAnonymous} onCheckedChange={(v) => setEditData({ ...editData, isAnonymous: v })} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <Label className="text-xs font-bold">Public</Label>
                        <Switch checked={editData.isPublic} onCheckedChange={(v) => setEditData({ ...editData, isPublic: v })} />
                    </div>
                </div>
            </SideFormSheet>

            {/* Mod Panel */}
            <Dialog open={isModPanelOpen} onOpenChange={setIsModPanelOpen}>
                <DialogContent className="bg-white rounded-[2.5rem] border-none p-10 max-w-3xl shadow-3xl max-h-[85vh] overflow-y-auto" style={{ zoom: "80%" }}>
                    <DialogHeader className="space-y-3">
                        <div className="h-14 w-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-2 shadow-inner border border-amber-100">
                            <ShieldAlert size={26} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight uppercase">Moderation Queue</DialogTitle>
                        <DialogDescription>Review pending feedback entries before they go live on the wall.</DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-3 text-start">
                        {pendingMod.length === 0 ? (
                            <div className="py-12 text-center bg-slate-50 rounded-2xl">
                                <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={32} />
                                <p className="text-sm font-bold text-slate-600">Queue is clean</p>
                                <p className="text-xs text-slate-400 mt-1">All feedback has been moderated.</p>
                            </div>
                        ) : (
                            pendingMod.map((fb) => (
                                <Card key={fb.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Badge className={getCategoryStyles(fb.category) + " border-none text-[9px] font-bold tracking-widest"}>
                                                    {fb.category}
                                                </Badge>
                                                <span className="text-[10px] text-slate-400 font-bold">
                                                    From {fb.isAnonymous ? "Anonymous" : fb.from.name} → {fb.to.name}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-700 italic">"{fb.message}"</p>
                                        </div>
                                        <div className="flex flex-col gap-2 shrink-0">
                                            <Button
                                                size="sm"
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold tracking-widest h-8 gap-1"
                                                onClick={() => { moderateFeedback(fb.id, "Approved"); toast({ title: "Approved", description: "Posted to wall." }); }}
                                            >
                                                <CheckCircle2 size={12} /> Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-[10px] font-bold tracking-widest h-8 gap-1"
                                                onClick={() => { moderateFeedback(fb.id, "Hidden"); toast({ title: "Hidden", description: "Kept off the wall." }); }}
                                            >
                                                <EyeOff size={12} /> Hide
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-rose-600 text-[10px] font-bold tracking-widest h-8 gap-1"
                                                onClick={() => { deleteFeedback(fb.id); toast({ title: "Deleted", description: "Flagged feedback removed." }); }}
                                            >
                                                <FlagTriangleRight size={12} /> Flag & Remove
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsModPanelOpen(false)}>Close Panel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this feedback?</AlertDialogTitle>
                        <AlertDialogDescription>
                            The entry will be permanently removed from the wall.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-rose-600 hover:bg-rose-700 text-white" onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ContinuousFeedbackPage;
