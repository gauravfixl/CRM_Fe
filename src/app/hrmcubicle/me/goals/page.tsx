"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Target,
    Plus,
    TrendingUp,
    CheckCircle2,
    Zap,
    Calendar,
    Flag,
    Award,
    Edit3,
    Trash2,
    MoreVertical,
    Filter,
    Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/shared/components/ui/dropdown-menu";
import { useToast } from "@/shared/components/ui/use-toast";
import { useMeStore } from "@/shared/data/me-store";
import { firstError, required, maxLength, isValidDate, isFutureOrToday, isNumberInRange, isUnique } from "@/shared/utils/validators";

type Goal = {
    id: string;
    title: string;
    description: string;
    category: string;
    progress: number;
    dueDate: string;
    priority: string;
    status: string;
    keyResults: number;
};

const priorityColors: Record<string, string> = {
    High: "bg-rose-50 text-rose-700 border-rose-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    Low: "bg-blue-50 text-blue-700 border-blue-200",
};

const statusColors: Record<string, string> = {
    "Not Started": "bg-slate-100 text-slate-600 border-slate-200",
    "In Progress": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "Completed": "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const categoryColors: Record<string, string> = {
    Sales: "emerald",
    Learning: "blue",
    Team: "rose",
    Product: "indigo",
    Growth: "amber",
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };

const deriveStatus = (p: number): Goal["status"] => p === 0 ? "Not Started" : p === 100 ? "Completed" : "In Progress";

export default function MyGoalsPage() {
    const { toast } = useToast();
    const storeGoals = useMeStore(s => s.performance.goals);
    const loadMyGoals = useMeStore(s => s.loadMyGoals);
    const createMyGoal = useMeStore(s => s.createMyGoal);
    const updateMyGoal = useMeStore(s => s.updateMyGoal);
    const deleteMyGoal = useMeStore(s => s.deleteMyGoal);

    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<Goal | null>(null);
    const [progressOpen, setProgressOpen] = useState<Goal | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Goal | null>(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterPriority, setFilterPriority] = useState("all");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ title: "", category: "Sales", priority: "Medium", dueDate: "", description: "", keyResults: "1" });
    const [progressVal, setProgressVal] = useState(0);
    const [formError, setFormError] = useState<string | null>(null);

    const goals: Goal[] = storeGoals.map(g => ({
        id: String(g.id),
        title: g.title,
        description: (g as any).description || "",
        category: g.category,
        progress: g.progress,
        dueDate: g.dueDate,
        priority: g.priority,
        status: deriveStatus(g.progress),
        keyResults: (g as any).keyResults || (g as any).weightage || 1,
    }));

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                await loadMyGoals();
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [loadMyGoals]);

    const filtered = goals.filter(g =>
        (filterStatus === "all" || g.status === filterStatus) &&
        (filterPriority === "all" || g.priority === filterPriority)
    );

    const stats = {
        total: goals.length,
        inProgress: goals.filter(g => g.status === "In Progress").length,
        completed: goals.filter(g => g.status === "Completed").length,
        avgProgress: goals.length ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0,
    };

    const openCreate = () => {
        setEditing(null);
        setFormError(null);
        setForm({ title: "", category: "Sales", priority: "Medium", dueDate: "", description: "", keyResults: "1" });
        setFormOpen(true);
    };

    const openEdit = (g: Goal) => {
        setEditing(g);
        setFormError(null);
        setForm({ title: g.title, category: g.category, priority: g.priority, dueDate: g.dueDate, description: g.description, keyResults: String(g.keyResults) });
        setFormOpen(true);
    };

    const validateForm = (): string | null => {
        const existingTitles = goals
            .filter(g => !editing || g.id !== editing.id)
            .map(g => g.title);
        return firstError(
            required(form.title, "Goal title"),
            maxLength(form.title, 255, "Title"),
            isUnique(form.title, existingTitles, "Title"),
            required(form.dueDate, "Due date"),
            isValidDate(form.dueDate, "Due date"),
            !editing ? isFutureOrToday(form.dueDate, "Due date") : null,
            maxLength(form.description, 1000, "Description"),
            isNumberInRange(form.keyResults, 1, 10, "Key Results"),
        );
    };

    const saveGoal = async () => {
        const err = validateForm();
        if (err) {
            setFormError(err);
            toast({ title: "Invalid input", description: err, variant: "destructive" });
            return;
        }
        setFormError(null);
        setSubmitting(true);
        try {
            if (editing) {
                await updateMyGoal(editing.id, {
                    goal: form.title.trim(),
                    title: form.title.trim(),
                    targetDate: form.dueDate,
                    dueDate: form.dueDate,
                    description: form.description.trim(),
                    category: form.category,
                    priority: form.priority,
                    keyResults: Number(form.keyResults),
                });
                toast({ title: "Goal updated", description: "Changes saved successfully." });
            } else {
                await createMyGoal({
                    goal: form.title.trim(),
                    targetDate: form.dueDate,
                    keyPerformanceIndicators: form.description ? [form.description.trim()] : [],
                });
                toast({ title: "Goal created", description: "Your new goal is ready to track." });
            }
            setFormOpen(false);
            setEditing(null);
        } catch (err: any) {
            toast({ title: "Save failed", description: err?.response?.data?.message || "Please try again.", variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    const deleteGoalAction = async () => {
        if (!deleteConfirm) return;
        setSubmitting(true);
        try {
            await deleteMyGoal(deleteConfirm.id);
            toast({ title: "Goal deleted", description: `"${deleteConfirm.title}" has been removed.` });
            setDeleteConfirm(null);
        } catch (err: any) {
            toast({ title: "Delete failed", description: err?.response?.data?.message || "Please try again.", variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    const openProgress = (g: Goal) => {
        setProgressOpen(g);
        setProgressVal(g.progress);
    };

    const saveProgress = async () => {
        if (!progressOpen) return;
        const newProgress = Math.max(0, Math.min(100, progressVal));
        setSubmitting(true);
        try {
            await updateMyGoal(progressOpen.id, { progress: newProgress });
            toast({ title: "Progress updated", description: `"${progressOpen.title}" is now ${newProgress}% complete.` });
            setProgressOpen(null);
        } catch (err: any) {
            toast({ title: "Update failed", description: err?.response?.data?.message || "Please try again.", variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    const markComplete = async (g: Goal) => {
        try {
            await updateMyGoal(g.id, { progress: 100 });
            toast({ title: "Goal completed", description: `"${g.title}" marked as done. 🎉` });
        } catch (err: any) {
            toast({ title: "Update failed", description: err?.response?.data?.message || "Please try again.", variant: "destructive" });
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-[#f8fafc] p-6 space-y-6 font-sans" style={{ zoom: "80%" }}>
            <div className="mx-auto space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">My Goals</h1>
                        <p className="text-sm text-slate-500 mt-1">Objectives and Key Results (OKRs) for 2026</p>
                    </div>
                    <Button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100">
                        <Plus size={16} className="mr-2" /> New Goal
                    </Button>
                </div>

                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Total Goals", value: stats.total, icon: Target, color: "indigo" },
                        { label: "In Progress", value: stats.inProgress, icon: Zap, color: "amber" },
                        { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "emerald" },
                        { label: "Avg. Progress", value: `${stats.avgProgress}%`, icon: TrendingUp, color: "blue" },
                    ].map((s, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <Card className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-xl bg-${s.color}-50 flex items-center justify-center`}>
                                        <s.icon className={`text-${s.color}-600`} size={22} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                                        <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <Card className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3 flex-wrap">
                        <Filter size={14} className="text-slate-400" />
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[160px] h-9 rounded-lg text-sm"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Not Started">Not Started</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterPriority} onValueChange={setFilterPriority}>
                            <SelectTrigger className="w-[160px] h-9 rounded-lg text-sm"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priorities</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-500 ml-auto">{filtered.length} of {goals.length} goals</p>
                    </CardContent>
                </Card>

                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map(g => {
                        const catColor = categoryColors[g.category] || "indigo";
                        return (
                            <motion.div key={g.id} variants={itemVariants}>
                                <Card className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:border-indigo-200 transition-all">
                                    <CardContent className="p-5 space-y-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className={`h-10 w-10 rounded-xl bg-${catColor}-50 flex items-center justify-center shrink-0`}>
                                                <Target className={`text-${catColor}-600`} size={18} />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className={`${priorityColors[g.priority]} border text-[10px] font-semibold`}>
                                                    <Flag size={10} className="mr-1" /> {g.priority}
                                                </Badge>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-lg"><MoreVertical size={14} /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44">
                                                        <DropdownMenuItem onClick={() => openProgress(g)}><TrendingUp size={13} className="mr-2" />Update Progress</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openEdit(g)}><Edit3 size={13} className="mr-2" />Edit Goal</DropdownMenuItem>
                                                        {g.status !== "Completed" && <DropdownMenuItem onClick={() => void markComplete(g)}><CheckCircle2 size={13} className="mr-2" />Mark Complete</DropdownMenuItem>}
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => setDeleteConfirm(g)} className="text-rose-600 focus:text-rose-700 focus:bg-rose-50"><Trash2 size={13} className="mr-2" />Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                        <div>
                                            <Badge className={`bg-${catColor}-50 text-${catColor}-700 border-${catColor}-200 border text-[9px] font-semibold mb-2`}>{g.category}</Badge>
                                            <h3 className="font-bold text-slate-900 text-sm leading-snug">{g.title}</h3>
                                            {g.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{g.description}</p>}
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between text-xs mb-1.5">
                                                <span className="text-slate-500">Progress</span>
                                                <span className="font-bold text-slate-900">{g.progress}%</span>
                                            </div>
                                            <Progress value={g.progress} className="h-2" />
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                            <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                                <Calendar size={11} /> {new Date(g.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                            </div>
                                            <Badge className={`${statusColors[g.status]} border text-[10px] font-semibold`}>{g.status}</Badge>
                                        </div>
                                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                            <Award size={11} /> {g.keyResults} key result{g.keyResults !== 1 && "s"}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {filtered.length === 0 && (
                    <Card className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
                        <Target size={40} className="mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No goals match your filters</p>
                    </Card>
                )}
            </div>

            <SideFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                title={editing ? "Edit Goal" : "Create New Goal"}
                description={editing ? "Update goal details." : "Define an objective to track your progress."}
                icon={editing ? <Edit3 size={20} /> : <Target size={20} />}
                accentColor="#4f46e5"
                width="md"
                loading={submitting}
                submitLabel={editing ? "Save Changes" : "Create Goal"}
                onSubmit={(e) => { e.preventDefault(); saveGoal(); }}
            >
                <div className="space-y-4">
                    {formError && (
                        <div className="bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 text-xs text-rose-700">{formError}</div>
                    )}
                    <Field label="Goal Title" required hint={`${form.title.length}/255 chars`}>
                        <Input maxLength={255} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Ship v2 of dashboard" />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Category">
                            <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.keys(categoryColors).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Priority">
                            <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Due Date" required>
                            <Input type="date" min={editing ? undefined : new Date().toISOString().split("T")[0]} value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
                        </Field>
                        <Field label="Key Results" hint="1-10">
                            <Input type="number" min="1" max="10" value={form.keyResults} onChange={e => setForm({ ...form, keyResults: e.target.value })} />
                        </Field>
                    </div>
                    <Field label="Description" hint={`${form.description.length}/1000 chars`}>
                        <Textarea maxLength={1000} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What does success look like?" />
                    </Field>
                </div>
            </SideFormSheet>

            <SideFormSheet
                open={!!progressOpen}
                onOpenChange={v => !v && setProgressOpen(null)}
                title="Update Progress"
                description={progressOpen?.title}
                icon={<TrendingUp size={20} />}
                accentColor="#4f46e5"
                width="sm"
                loading={submitting}
                submitLabel="Save Progress"
                onSubmit={(e) => { e.preventDefault(); saveProgress(); }}
            >
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-slate-600">Current progress</span>
                            <span className="text-2xl font-bold text-indigo-700">{progressVal}%</span>
                        </div>
                        <input type="range" min="0" max="100" step="5" value={progressVal} onChange={e => setProgressVal(Number(e.target.value))} className="w-full accent-indigo-600" />
                        <Progress value={progressVal} className="h-2 mt-2" />
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {[0, 25, 50, 75, 100].map(v => (
                            <Button key={v} type="button" size="sm" variant={progressVal === v ? "default" : "outline"} onClick={() => setProgressVal(v)} className={progressVal === v ? "bg-indigo-600 text-white" : ""}>{v}%</Button>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500">Status will auto-update to <strong>{deriveStatus(progressVal)}</strong></p>
                </div>
            </SideFormSheet>

            <Dialog open={!!deleteConfirm} onOpenChange={v => !v && setDeleteConfirm(null)}>
                <DialogContent className="bg-white rounded-2xl border-none p-8 max-w-md">
                    <DialogHeader className="space-y-3">
                        <div className="h-12 w-12 bg-rose-50 rounded-xl flex items-center justify-center">
                            <Trash2 className="text-rose-600" size={24} />
                        </div>
                        <DialogTitle className="text-xl font-bold">Delete Goal?</DialogTitle>
                        <DialogDescription>
                            "{deleteConfirm?.title}" will be permanently removed. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3 mt-2">
                        <Button variant="ghost" onClick={() => setDeleteConfirm(null)} disabled={submitting}>Cancel</Button>
                        <Button onClick={deleteGoalAction} disabled={submitting} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl">
                            {submitting ? <><Loader2 size={14} className="mr-2 animate-spin" />Deleting...</> : "Delete Goal"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {loading && goals.length === 0 && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-white rounded-2xl shadow-xl p-6 flex items-center gap-3 border border-slate-100">
                        <Loader2 size={18} className="animate-spin text-indigo-600" />
                        <span className="text-sm font-semibold text-slate-700">Loading goals from server...</span>
                    </div>
                </div>
            )}
        </div>
    );
}
