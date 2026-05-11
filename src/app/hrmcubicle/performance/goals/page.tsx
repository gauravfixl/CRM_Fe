"use client"

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Target,
    Plus,
    Search,
    Calendar,
    Edit,
    Trash2,
    CheckCircle2,
    Clock,
    Network,
    Scale,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useToast } from "@/shared/components/ui/use-toast";
import { usePerformanceStore, type Goal } from "@/shared/data/performance-store";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import {
    createGoal as apiCreateGoal,
    deleteGoal as apiDeleteGoal,
    getAllEmployees,
    getAllGoals,
    updateGoal as apiUpdateGoal,
} from "@/modules/hrm/hooks/hrmHooks";
import {
    firstError,
    isFutureDate,
    isNumberInRange,
    maxLength,
    required,
    type ValidationErrors,
} from "@/shared/utils/validators";

interface EmployeeOpt { id: string; label: string; }

const emptyGoalForm = {
    title: "",
    progress: 0,
    status: "Draft" as Goal["status"],
    dueDate: "",
    description: "",
    priority: "Medium" as Goal["priority"],
    category: "Technical" as Goal["category"],
    alignment: "Individual" as Goal["alignment"],
    weightage: 20,
    employee: "",
};
type GoalForm = typeof emptyGoalForm;

// Map frontend status to backend enum (backend only supports 3 statuses)
const toBackendStatus = (s: Goal["status"]): "In Progress" | "Completed" | "Delayed" => {
    if (s === "Completed") return "Completed";
    if (s === "At Risk" || s === "Behind") return "Delayed";
    return "In Progress";
};

const GoalsPage = () => {
    const { toast } = useToast();
    const { goals, addGoal, updateGoal, deleteGoal, approveGoal } = usePerformanceStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Goal | null>(null);
    const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
    const [filterCategory, setFilterCategory] = useState<string | "All">("All");
    const [employees, setEmployees] = useState<EmployeeOpt[]>([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});

    const [formData, setFormData] = useState<GoalForm>(emptyGoalForm);

    // Load goals + employees from backend on mount (fall back to local store on failure)
    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                const [goalsRes, empRes] = await Promise.allSettled([getAllGoals(), getAllEmployees()]);
                if (!mounted) return;

                if (goalsRes.status === "fulfilled") {
                    const rows = goalsRes.value?.data?.goals ?? goalsRes.value?.data?.data ?? [];
                    rows.forEach((g: any) => {
                        const id = String(g._id ?? g.id ?? "");
                        if (!id) return;
                        // Hydrate local store so the UI shows backend data immediately
                        const existing = usePerformanceStore.getState().goals.find((x) => x.id === id);
                        if (!existing) {
                            addGoal({
                                title: g.goal ?? g.title ?? "Untitled",
                                progress: Number(g.progress ?? 0),
                                status: (g.status === "Completed" ? "Completed" : g.status === "Delayed" ? "At Risk" : "On Track") as Goal["status"],
                                dueDate: g.targetDate ? new Date(g.targetDate).toISOString().split("T")[0] : "",
                                description: (g.keyPerformanceIndicators || []).join(" • "),
                                priority: "Medium",
                                category: "Operations",
                                alignment: "Department",
                                weightage: 20,
                            });
                            // Overwrite the fresh local id with backend id so subsequent updates hit the right record
                            usePerformanceStore.setState((state) => ({
                                goals: state.goals.map((x, i) => (i === 0 ? { ...x, id } : x)),
                            }));
                        }
                    });
                }

                if (empRes.status === "fulfilled") {
                    const list = empRes.value?.data?.employees ?? empRes.value?.data?.data ?? [];
                    setEmployees(
                        list.map((e: any) => ({
                            id: String(e._id ?? e.id ?? ""),
                            label: `${e.personalInfo?.fullName || e.firstName || e.name || ""} (${e.employeeId || e.personalInfo?.contact?.email || ""})`,
                        })).filter((e: EmployeeOpt) => e.id)
                    );
                }
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validate = (): ValidationErrors => {
        const e: ValidationErrors = {};
        const t = firstError(required(formData.title, "Title"), maxLength(formData.title, 200, "Title"));
        if (t) e.title = t;
        const d = firstError(required(formData.dueDate, "Due date"), isFutureDate(formData.dueDate, "Due date"));
        if (d) e.dueDate = d;
        const w = isNumberInRange(formData.weightage, 0, 100, "Weightage");
        if (w) e.weightage = w;
        const p = isNumberInRange(formData.progress, 0, 100, "Progress");
        if (p) e.progress = p;
        const desc = maxLength(formData.description, 1000, "Description");
        if (desc) e.description = desc;
        // Employee is required only when creating a new goal (backend requires it)
        if (!activeGoal) {
            const emp = required(formData.employee, "Employee");
            if (emp) e.employee = emp;
        }
        return e;
    };

    const handleSave = async () => {
        const v = validate();
        setErrors(v);
        if (Object.keys(v).length > 0) {
            toast({ title: "Validation failed", description: "Please correct the highlighted fields.", variant: "destructive" });
            return;
        }

        setSaving(true);
        try {
            if (activeGoal) {
                // Try backend update if the id looks like a Mongo ObjectId
                if (/^[a-f\d]{24}$/i.test(activeGoal.id)) {
                    await apiUpdateGoal(activeGoal.id, {
                        goal: formData.title,
                        targetDate: formData.dueDate,
                        status: toBackendStatus(formData.status),
                        progress: formData.progress,
                        keyPerformanceIndicators: formData.description ? formData.description.split(" • ") : [],
                    });
                }
                // Always mirror the full frontend state locally so the UI stays rich
                const { employee: _emp, ...local } = formData;
                updateGoal(activeGoal.id, local);
                toast({ title: "Objective Updated", description: "Goal updated successfully." });
            } else {
                let newId: string | null = null;
                try {
                    const res = await apiCreateGoal({
                        employee: formData.employee,
                        goal: formData.title,
                        keyPerformanceIndicators: formData.description ? formData.description.split(" • ") : [],
                        targetDate: formData.dueDate,
                    });
                    newId = res?.data?.goal?._id ? String(res.data.goal._id) : null;
                } catch {
                    // Backend unavailable — still save locally
                }
                const { employee: _emp, ...local } = formData;
                addGoal(local);
                if (newId) {
                    // Rename the just-added local record with backend id
                    usePerformanceStore.setState((state) => ({
                        goals: state.goals.map((x, i) => (i === 0 ? { ...x, id: newId! } : x)),
                    }));
                }
                toast({ title: "Goal Created", description: "New objective saved." });
            }
            setIsDialogOpen(false);
            setActiveGoal(null);
            setFormData(emptyGoalForm);
            setErrors({});
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            if (/^[a-f\d]{24}$/i.test(deleteTarget.id)) {
                await apiDeleteGoal(deleteTarget.id);
            }
        } catch { /* ignore — will still remove locally */ }
        deleteGoal(deleteTarget.id);
        toast({ title: "Goal Removed", description: "Objective purged from the directory." });
        setDeleteTarget(null);
    };

    const handleApprove = async (goal: Goal) => {
        if (/^[a-f\d]{24}$/i.test(goal.id)) {
            try { await apiUpdateGoal(goal.id, { status: "In Progress" }); } catch { /* ignore */ }
        }
        approveGoal(goal.id);
        toast({ title: "Goal Approved", description: "Goal is now On Track." });
    };

    const handleExport = () => {
        const rows = [["ID", "Title", "Status", "Progress", "Priority", "Category", "Alignment", "Weightage", "Due Date"]];
        goals.forEach((g) => rows.push([g.id, g.title, g.status, `${g.progress}%`, g.priority, g.category, g.alignment, `${g.weightage}%`, g.dueDate]));
        const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `goals_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast({ title: "Exported", description: `${goals.length} goals saved to CSV.` });
    };

    const getStatusStyles = (status: Goal['status']) => {
        const styles = {
            'Draft': 'bg-slate-100 text-slate-500 border-slate-200',
            'Awaiting Approval': 'bg-amber-100 text-amber-700 border-amber-200',
            'On Track': 'bg-indigo-50 text-indigo-600 border-indigo-100',
            'Ahead': 'bg-emerald-50 text-emerald-600 border-emerald-100',
            'At Risk': 'bg-rose-50 text-rose-600 border-rose-100',
            'Behind': 'bg-rose-100 text-rose-800 border-rose-200',
            'Completed': 'bg-slate-900 text-white border-transparent'
        };
        return styles[status];
    };

    const goalSource = goals;
    const filteredGoals = goalSource.filter((g) => {
        const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat =
            filterCategory === "All" ||
            g.category === filterCategory ||
            g.status === filterCategory;
        return matchesSearch && matchesCat;
    });

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans" style={{ zoom: "80%" }}>
            <header className="py-2.5 px-8 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm rounded-b-3xl">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1 text-start">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Goals & OKRs</h1>
                            <Badge className="bg-amber-100 text-amber-700 border-none font-bold text-[10px] tracking-widest h-6 px-3">HR Control</Badge>
                        </div>
                        <p className="text-slate-500 text-sm font-semibold">Define structure, set weightage, and manage goal approval workflows.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {loading && <Loader2 size={16} className="animate-spin text-indigo-500" />}
                        <Button
                            variant="outline"
                            onClick={handleExport}
                            className="rounded-xl h-11 px-5 font-bold gap-2 text-[10px] tracking-widest"
                        >
                            Export CSV
                        </Button>
                        <Button
                            onClick={() => { setActiveGoal(null); setFormData(emptyGoalForm); setErrors({}); setIsDialogOpen(true); }}
                            className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100 transition-all gap-2 text-[10px] tracking-widest border-none"
                        >
                            <Plus size={16} /> Configure New Goal
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-8 max-w-[1600px] mx-auto w-full space-y-8">
                {/* Visual Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="rounded-3xl bg-indigo-50 border border-indigo-100 p-7 shadow-sm text-start group hover:shadow-md transition-all">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-indigo-400 tracking-widest leading-none">Total Weightage</p>
                            <h3 className="text-4xl font-bold tracking-tight text-indigo-700">{goalSource.reduce((acc, g) => acc + (g.weightage || 0), 0)}%</h3>
                            <p className="text-[9px] font-bold text-indigo-300 tracking-tight">Across All Active Goals</p>
                        </div>
                    </Card>

                    <Card className="rounded-3xl bg-amber-50 border border-amber-100 p-7 flex flex-col justify-between text-start shadow-sm group hover:shadow-md transition-all">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-amber-500 tracking-widest">Awaiting Approval</p>
                            <h3 className="text-4xl font-bold text-amber-700 tracking-tight">{goalSource.filter(g => g.status === 'Draft' || g.status === 'Awaiting Approval').length}</h3>
                            <p className="text-[9px] font-bold text-amber-500/60">Action Required</p>
                        </div>
                    </Card>

                    <Card className="rounded-3xl bg-blue-50 border border-blue-100 p-7 flex flex-col justify-between text-start shadow-sm group hover:shadow-md transition-all">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-blue-500 tracking-widest">Alignment (Company)</p>
                            <h3 className="text-4xl font-bold text-blue-700 tracking-tight">{goalSource.filter(g => g.alignment === 'Company').length}</h3>
                            <p className="text-[9px] font-bold text-blue-500/60">Strategic Focus</p>
                        </div>
                    </Card>

                    <Card className="rounded-3xl bg-emerald-50 border border-emerald-100 p-7 flex flex-col justify-between text-start shadow-sm group hover:shadow-md transition-all">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-emerald-500 tracking-widest">Active Velocity</p>
                            <h3 className="text-4xl font-bold text-emerald-700 tracking-tight">{goalSource.filter(g => g.status === 'On Track').length}</h3>
                            <p className="text-[9px] font-bold text-emerald-500/60">Execution Rate</p>
                        </div>
                    </Card>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Goal List Header */}
                    <div className="flex items-center justify-between">
                        <div className="relative group max-w-md w-full">
                            <Search className="absolute left-4 top-1/2 -transform -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                            <Input
                                placeholder="Search by outcome or alignment..."
                                className="pl-11 h-12 rounded-xl bg-white border-slate-100 focus:border-indigo-500 shadow-sm font-semibold transition-all text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            {['All', 'Awaiting Approval', 'On Track', 'Completed'].map(status => (
                                <Button
                                    key={status}
                                    variant="ghost"
                                    className={`h-9 px-4 rounded-lg text-[10px] font-bold tracking-widest ${filterCategory === status ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'text-slate-400'}`}
                                    onClick={() => setFilterCategory(status)}
                                >
                                    {status}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="popLayout">
                        <div className="grid grid-cols-1 gap-4">
                            {filteredGoals.map((goal, i) => (
                                <motion.div
                                    key={goal.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card className="group border border-slate-100 shadow-sm hover:shadow-xl transition-all rounded-3xl bg-white overflow-hidden hover:border-indigo-100 p-0">
                                        <CardContent className="p-5 text-start">
                                            <div className="flex flex-col lg:flex-row gap-5">
                                                <div className="flex-1 space-y-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <Badge variant="outline" className={`border-none font-bold text-[9px] h-5 px-3 rounded-md shadow-sm tracking-widest ${getStatusStyles(goal.status)}`}>
                                                                {goal.status}
                                                            </Badge>
                                                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-none font-bold text-[9px] h-5 px-3 rounded-md tracking-widest">
                                                                <Network size={10} className="mr-1.5" /> {goal.alignment} Focus
                                                            </Badge>
                                                            <Badge variant="outline" className="bg-slate-50 text-slate-500 border-none font-bold text-[9px] h-5 px-3 rounded-md tracking-widest shadow-none">
                                                                <Scale size={10} className="mr-1.5" /> Weightage: {goal.weightage}%
                                                            </Badge>
                                                        </div>
                                                        <h3 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">
                                                            {goal.title}
                                                        </h3>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <div className="flex justify-between items-end">
                                                            <span className="text-[10px] font-bold text-slate-400 tracking-widest">Real-Time Progress</span>
                                                            <span className="text-sm font-bold tabular-nums text-slate-900">{goal.progress}%</span>
                                                        </div>
                                                        <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${goal.progress}%` }}
                                                                transition={{ duration: 1.5 }}
                                                                className="h-full bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.4)]"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex lg:flex-col justify-center gap-1.5 shrink-0 lg:border-l border-slate-50 lg:pl-5 min-w-[180px]">
                                                    {(goal.status === "Draft" || goal.status === "Awaiting Approval") && (
                                                        <Button
                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-9 px-4 font-bold text-[10px] tracking-widest gap-2 transition-all border-none shadow-md shadow-emerald-100"
                                                            onClick={() => handleApprove(goal)}
                                                        >
                                                            <CheckCircle2 size={12} /> Approve Goal
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl h-9 px-4 font-bold text-[10px] tracking-widest gap-2 transition-all border border-transparent hover:border-indigo-100"
                                                        onClick={() => {
                                                            setActiveGoal(goal);
                                                            setFormData({
                                                                title: goal.title,
                                                                progress: goal.progress,
                                                                status: goal.status,
                                                                dueDate: goal.dueDate,
                                                                description: goal.description || "",
                                                                priority: goal.priority,
                                                                category: goal.category,
                                                                alignment: goal.alignment,
                                                                weightage: goal.weightage,
                                                                employee: "",
                                                            });
                                                            setErrors({});
                                                            setIsDialogOpen(true);
                                                        }}
                                                    >
                                                        <Edit size={12} /> Edit Config
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl h-9 px-4 font-bold text-[10px] tracking-widest gap-2 transition-all"
                                                        onClick={() => setDeleteTarget(goal)}
                                                    >
                                                        <Trash2 size={12} /> Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Config SideFormSheet */}
            <SideFormSheet
                open={isDialogOpen}
                onOpenChange={(o) => { setIsDialogOpen(o); if (!o) { setActiveGoal(null); setFormData(emptyGoalForm); setErrors({}); } }}
                title={activeGoal ? "Edit Goal Configuration" : "Goal Configuration"}
                description="Define alignment, importance weightage, and approval status for the performance cycle."
                icon={<Target size={20} />}
                accentColor={activeGoal ? "#7c3aed" : "#4f46e5"}
                width="xl"
                loading={saving}
                submitLabel={saving ? "Saving..." : "Commit Objective Parameters"}
                onSubmit={(e) => { e.preventDefault(); handleSave(); }}
            >
                <div className="space-y-4">
                    <Field label="Goal Outcome / Title" required error={errors.title || undefined}>
                        <Input
                            maxLength={200}
                            placeholder="e.g. Increase revenue by 20% in Q1"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </Field>

                    {!activeGoal && (
                        <Field label="Assign Employee" required error={errors.employee || undefined}>
                            <Select value={formData.employee} onValueChange={(v) => setFormData({ ...formData, employee: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder={employees.length ? "Select an employee" : "Loading employees…"} />
                                </SelectTrigger>
                                <SelectContent className="max-h-72 overflow-y-auto">
                                    {employees.length === 0 && (
                                        <div className="px-3 py-2 text-xs text-slate-400 italic">No employees available</div>
                                    )}
                                    {employees.map((e) => (
                                        <SelectItem key={e.id} value={e.id}>{e.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Alignment Level">
                            <Select value={formData.alignment} onValueChange={(v) => setFormData({ ...formData, alignment: v as any })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Company">Company Objectives</SelectItem>
                                    <SelectItem value="Department">Departmental Goals</SelectItem>
                                    <SelectItem value="Individual">Individual Achievements</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field label="Goal Weightage (%)" error={errors.weightage || undefined}>
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                value={formData.weightage}
                                onChange={(e) => setFormData({ ...formData, weightage: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })}
                            />
                        </Field>

                        <Field label="Target Due Date" required error={errors.dueDate || undefined}>
                            <Input
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </Field>

                        <Field label="Launch Status">
                            <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as any })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Draft">Draft Mode</SelectItem>
                                    <SelectItem value="Awaiting Approval">Submit for Audit</SelectItem>
                                    <SelectItem value="On Track">Live (Effective)</SelectItem>
                                    <SelectItem value="Ahead">Ahead</SelectItem>
                                    <SelectItem value="At Risk">At Risk</SelectItem>
                                    <SelectItem value="Behind">Behind</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field label="Priority">
                            <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v as any })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field label="Category">
                            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as any })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Technical">Technical</SelectItem>
                                    <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                                    <SelectItem value="Leadership">Leadership</SelectItem>
                                    <SelectItem value="Sales">Sales</SelectItem>
                                    <SelectItem value="Operations">Operations</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field label="Progress (%)" error={errors.progress || undefined}>
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                value={formData.progress}
                                onChange={(e) => setFormData({ ...formData, progress: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })}
                            />
                        </Field>
                    </div>

                    <Field label="Operational Description" error={errors.description || undefined} hint={`${formData.description.length}/1000`}>
                        <Textarea
                            maxLength={1000}
                            className="min-h-[80px]"
                            placeholder="Details on key results and success metrics..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </Field>
                </div>
            </SideFormSheet>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove this goal?</AlertDialogTitle>
                        <AlertDialogDescription>
                            <strong>{deleteTarget?.title}</strong> will be permanently purged from the directory.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-rose-600 hover:bg-rose-700 text-white" onClick={handleDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default GoalsPage;
