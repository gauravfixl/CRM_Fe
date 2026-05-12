"use client"

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Star,
    Rocket,
    Search,
    Calendar,
    Download,
    Eye,
    FileText,
    Percent,
    Award,
    Trash2,
    Edit,
    Plus,
    MoreVertical,
    ShieldCheck,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { usePerformanceStore, type Appraisal, type CompetencyRating } from "@/shared/data/performance-store";
import {
    Tabs,
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
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import {
    createAppraisal as apiCreateAppraisal,
    deleteAppraisal as apiDeleteAppraisal,
    getAllAppraisals,
    getAllEmployees,
    updateAppraisal as apiUpdateAppraisal,
} from "@/modules/hrm/hooks/hrmHooks";
import {
    firstError,
    isNumberInRange,
    maxLength,
    required,
    type ValidationErrors,
} from "@/shared/utils/validators";

interface EmployeeOpt { id: string; label: string; empCode: string; }

const PerformanceAppraisalsPage = () => {
    const { toast } = useToast();
    const { appraisals, addAppraisal, updateAppraisal, deleteAppraisal } = usePerformanceStore();
    const [employees, setEmployees] = useState<EmployeeOpt[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [launchErrors, setLaunchErrors] = useState<ValidationErrors>({});
    const [reviewErrors, setReviewErrors] = useState<ValidationErrors>({});
    const [editErrors, setEditErrors] = useState<ValidationErrors>({});

    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLaunchOpen, setIsLaunchOpen] = useState(false);
    const [activeAppraisal, setActiveAppraisal] = useState<Appraisal | null>(null);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [formData, setFormData] = useState({
        employee: "",            // backend ObjectId
        employeeName: "",
        employeeId: "",
        employeeAvatar: "",
        cycle: "Annual Appraisal 2026",
        initialRating: 3,        // backend requires a rating on create
    });

    const [editData, setEditData] = useState({
        employeeName: "",
        employeeId: "",
        cycle: "",
        overallRating: 0,
        competencies: [] as CompetencyRating[],
    });

    const [reviewData, setReviewData] = useState({
        proposedIncrement: "",
        proposedPromotion: "",
        hrNotes: "",
        status: "Manager Review" as Appraisal["status"],
    });

    const resetForm = () =>
        setFormData({ employee: "", employeeName: "", employeeId: "", employeeAvatar: "", cycle: "Annual Appraisal 2026", initialRating: 3 });

    // Initial load — pull appraisals and employees from backend
    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                const [appRes, empRes] = await Promise.allSettled([getAllAppraisals(), getAllEmployees()]);
                if (!mounted) return;
                if (appRes.status === "fulfilled") {
                    const rows = appRes.value?.data?.data ?? [];
                    rows.forEach((a: any) => {
                        const id = String(a.id ?? a._id ?? "");
                        if (!id) return;
                        const existing = usePerformanceStore.getState().appraisals.find((x) => x.id === id);
                        if (!existing) {
                            addAppraisal({
                                employeeName: a.employee?.email || "Employee",
                                employeeId: a.employee?.employeeId || "-",
                                employeeAvatar: (a.employee?.email || "E").charAt(0).toUpperCase(),
                                cycle: a.period || "Appraisal",
                            });
                            usePerformanceStore.setState((state) => ({
                                appraisals: state.appraisals.map((x, i) => (i === 0 ? {
                                    ...x,
                                    id,
                                    overallRating: a.rating,
                                    status: "HR Review",
                                    competencies: (a.criteria || []).map((c: any) => ({
                                        name: c.label || "Criteria",
                                        rating: c.score || 0,
                                        feedback: c.comments || "",
                                    })),
                                } : x)),
                            }));
                        }
                    });
                }
                if (empRes.status === "fulfilled") {
                    const list = empRes.value?.data?.employees ?? empRes.value?.data?.data ?? [];
                    setEmployees(
                        list.map((e: any) => ({
                            id: String(e._id ?? e.id ?? ""),
                            empCode: String(e.employeeId || ""),
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

    const validateLaunch = (): ValidationErrors => {
        const e: ValidationErrors = {};
        const emp = required(formData.employee, "Employee");
        if (emp) e.employee = emp;
        const c = firstError(required(formData.cycle, "Cycle"), maxLength(formData.cycle, 100, "Cycle"));
        if (c) e.cycle = c;
        const r = isNumberInRange(formData.initialRating, 1, 5, "Rating");
        if (r) e.initialRating = r;
        return e;
    };

    const handleLaunch = async () => {
        const v = validateLaunch();
        setLaunchErrors(v);
        if (Object.keys(v).length > 0) {
            toast({ title: "Validation failed", description: "Please complete required fields.", variant: "destructive" });
            return;
        }
        setSaving(true);
        try {
            const selected = employees.find((x) => x.id === formData.employee);
            const displayName = selected?.label.split(" (")[0] || formData.employeeName || "Employee";
            const displayEmpId = selected?.empCode || formData.employeeId || "-";

            let newId: string | null = null;
            try {
                const res = await apiCreateAppraisal({
                    employee: formData.employee,
                    period: formData.cycle,
                    rating: formData.initialRating,
                    comments: "",
                });
                newId = res?.data?.appraisal?._id ? String(res.data.appraisal._id) : null;
            } catch { /* fall through to local-only */ }

            addAppraisal({
                employeeName: displayName,
                employeeId: displayEmpId,
                employeeAvatar: displayName.charAt(0).toUpperCase(),
                cycle: formData.cycle,
            });
            if (newId) {
                usePerformanceStore.setState((state) => ({
                    appraisals: state.appraisals.map((x, i) => (i === 0 ? { ...x, id: newId!, overallRating: formData.initialRating } : x)),
                }));
            }
            toast({ title: "Cycle Initialized", description: `Framework deployed for ${displayName}.` });
            setIsLaunchOpen(false);
            resetForm();
            setLaunchErrors({});
        } finally {
            setSaving(false);
        }
    };

    const validateReview = (): ValidationErrors => {
        const e: ValidationErrors = {};
        if (reviewData.proposedIncrement) {
            // Accept formats like "10", "10%", "12.5%"
            const num = parseFloat(reviewData.proposedIncrement.replace(/%/g, ""));
            if (Number.isNaN(num) || num < 0 || num > 100) e.proposedIncrement = "Increment must be 0–100 (percent)";
        }
        const m = maxLength(reviewData.hrNotes, 1000, "Notes");
        if (m) e.hrNotes = m;
        return e;
    };

    const handleUpdateReview = async () => {
        if (!activeAppraisal) return;
        const v = validateReview();
        setReviewErrors(v);
        if (Object.keys(v).length > 0) return;
        setSaving(true);
        try {
            if (/^[a-f\d]{24}$/i.test(activeAppraisal.id)) {
                try {
                    await apiUpdateAppraisal(activeAppraisal.id, {
                        comments: reviewData.hrNotes,
                        status: reviewData.status === "Completed" ? "Completed" : "Pending",
                        recommendation: reviewData.proposedPromotion
                            ? "Promotion"
                            : reviewData.proposedIncrement
                                ? "Salary Hike"
                                : "None",
                    });
                } catch { /* still persist locally */ }
            }
            updateAppraisal(activeAppraisal.id, reviewData);
            toast({ title: "Audit Updated", description: "Mapping and notes saved successfully." });
            setIsReviewOpen(false);
            setReviewErrors({});
        } finally {
            setSaving(false);
        }
    };

    const validateEdit = (): ValidationErrors => {
        const e: ValidationErrors = {};
        const n = firstError(required(editData.employeeName, "Employee name"), maxLength(editData.employeeName, 100, "Name"));
        if (n) e.employeeName = n;
        const c = firstError(required(editData.cycle, "Cycle"), maxLength(editData.cycle, 100, "Cycle"));
        if (c) e.cycle = c;
        if (editData.overallRating) {
            const r = isNumberInRange(editData.overallRating, 0, 5, "Rating");
            if (r) e.overallRating = r;
        }
        editData.competencies.forEach((comp, i) => {
            if (comp.name && !comp.name.trim()) e[`comp_${i}_name`] = "Name required";
            const cr = isNumberInRange(comp.rating, 1, 5, `Rating`);
            if (cr) e[`comp_${i}_rating`] = cr;
        });
        return e;
    };

    const handleEdit = async () => {
        if (!activeAppraisal) return;
        const v = validateEdit();
        setEditErrors(v);
        if (Object.keys(v).length > 0) return;
        setSaving(true);
        try {
            if (/^[a-f\d]{24}$/i.test(activeAppraisal.id)) {
                try {
                    await apiUpdateAppraisal(activeAppraisal.id, {
                        criteria: editData.competencies.map((c) => ({ label: c.name, score: c.rating, comments: c.feedback })),
                        overallRating: editData.overallRating || undefined,
                    });
                } catch { /* local-only */ }
            }
            updateAppraisal(activeAppraisal.id, {
                employeeName: editData.employeeName,
                employeeId: editData.employeeId,
                employeeAvatar: editData.employeeName.charAt(0).toUpperCase(),
                cycle: editData.cycle,
                overallRating: editData.overallRating || undefined,
                competencies: editData.competencies,
            });
            toast({ title: "Appraisal Updated", description: "Employee appraisal record has been updated." });
            setIsEditOpen(false);
            setEditErrors({});
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!activeAppraisal) return;
        if (/^[a-f\d]{24}$/i.test(activeAppraisal.id)) {
            try { await apiDeleteAppraisal(activeAppraisal.id); } catch { /* proceed */ }
        }
        deleteAppraisal(activeAppraisal.id);
        toast({ title: "Appraisal Removed", description: `Record for ${activeAppraisal.employeeName} has been removed.` });
        setIsDeleteOpen(false);
        setActiveAppraisal(null);
    };

    const downloadAsPdf = (a: Appraisal) => {
        const txt = [
            "APPRAISAL DRAFT REPORT",
            `====================================`,
            `Employee: ${a.employeeName} (${a.employeeId})`,
            `Cycle: ${a.cycle}`,
            `Status: ${a.status}`,
            `Overall Rating: ${a.overallRating ?? "N/A"}`,
            `Proposed Increment: ${a.proposedIncrement || "N/A"}`,
            `Proposed Promotion: ${a.proposedPromotion || "N/A"}`,
            `Last Updated: ${a.lastUpdated}`,
            ``,
            `Competencies:`,
            ...a.competencies.map((c) => ` - ${c.name}: ${c.rating}/5 ${c.feedback ? `(${c.feedback})` : ""}`),
            ``,
            `HR Notes: ${a.hrNotes || "—"}`,
            `Manager Notes: ${a.managerNotes || "—"}`,
            `Self Notes: ${a.selfNotes || "—"}`,
        ].join("\n");

        const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Appraisal_${a.employeeId}_${a.cycle.replace(/\s/g, "_")}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast({ title: "PDF Draft Generated", description: `Downloaded: ${a.employeeName}` });
    };

    const getStatusStyles = (status: Appraisal["status"]) => {
        const styles = {
            Draft: "bg-slate-100 text-slate-500 border-slate-200",
            "Self Review": "bg-blue-50 text-blue-600 border-blue-100",
            "Manager Review": "bg-purple-50 text-purple-600 border-purple-100",
            "HR Review": "bg-amber-50 text-amber-600 border-amber-100",
            Calibration: "bg-rose-50 text-rose-600 border-rose-100",
            Completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
        };
        return styles[status] || styles["Draft"];
    };

    const filteredAppraisals = appraisals.filter((a) => {
        const matchesSearch =
            a.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === "all" || a.status.toLowerCase().replace(" ", "-") === activeTab;
        return matchesSearch && matchesTab;
    });

    const globalCompletion =
        appraisals.length > 0
            ? Math.round((appraisals.filter((a) => a.status === "Completed").length / appraisals.length) * 100)
            : 0;

    const avgRating =
        appraisals.filter((a) => a.overallRating).length > 0
            ? (
                appraisals.reduce((s, a) => s + (a.overallRating || 0), 0) /
                appraisals.filter((a) => a.overallRating).length
            ).toFixed(1)
            : "—";

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans" style={{ zoom: "80%" }}>
            <header className="py-2.5 px-8 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm rounded-b-3xl">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1 text-start">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Appraisals & Increments</h1>
                            <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-[10px] uppercase tracking-widest h-6 px-3">
                                HR MASTER CONTROL
                            </Badge>
                        </div>
                        <p className="text-slate-500 text-sm font-semibold">
                            Manage end-to-end evaluation cycles, calibration, and promotion mapping.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {loading && <Loader2 size={16} className="animate-spin text-indigo-500" />}
                        <Button
                            onClick={() => { resetForm(); setLaunchErrors({}); setIsLaunchOpen(true); }}
                            className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100 transition-all gap-2 text-[10px] tracking-widest border-none"
                        >
                            <Rocket size={16} /> Deploy Appraisal Cycle
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-8 max-w-[1600px] mx-auto w-full space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="rounded-3xl border border-indigo-100 bg-indigo-50 p-7 shadow-sm flex flex-col justify-between text-start group hover:shadow-md transition-all">
                        <p className="text-[10px] font-bold text-indigo-400 tracking-widest leading-none">Global Completion</p>
                        <h3 className="text-4xl font-black tracking-tight text-indigo-700">{globalCompletion}%</h3>
                        <div className="h-1.5 w-full bg-indigo-200/50 rounded-full overflow-hidden mt-4">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${globalCompletion}%` }} />
                        </div>
                    </Card>

                    <Card className="rounded-3xl border border-amber-100 bg-amber-50 p-7 flex flex-col justify-between text-start shadow-sm group hover:shadow-md transition-all">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-amber-500 tracking-widest">In HR Review</p>
                            <h3 className="text-4xl font-black text-amber-700 tracking-tight">
                                {appraisals.filter((a) => a.status === "HR Review").length}
                            </h3>
                            <p className="text-[9px] font-bold text-amber-500/60 tracking-tight">Awaiting Final Signoff</p>
                        </div>
                    </Card>

                    <Card className="rounded-3xl border border-rose-100 bg-rose-50 p-7 flex flex-col justify-between text-start shadow-sm group hover:shadow-md transition-all">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-rose-500 tracking-widest">In Calibration</p>
                            <h3 className="text-4xl font-black text-rose-700 tracking-tight">
                                {appraisals.filter((a) => a.status === "Calibration").length}
                            </h3>
                            <p className="text-[9px] font-bold text-rose-500/60 tracking-tight">Manager Audit Logic</p>
                        </div>
                    </Card>

                    <Card className="rounded-3xl border border-emerald-100 bg-emerald-50 p-7 flex flex-col justify-between text-start shadow-sm group hover:shadow-md transition-all">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-emerald-500 tracking-widest">Avg. Rating Scored</p>
                            <h3 className="text-4xl font-black text-emerald-700 tracking-tight">{avgRating}</h3>
                            <p className="text-[9px] font-bold text-emerald-500/60 tracking-tight">Company Benchmark</p>
                        </div>
                    </Card>
                </div>

                <div className="space-y-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="bg-slate-50 border border-slate-100 p-1 rounded-2xl h-12 flex items-center"
                        >
                            <TabsList className="bg-transparent border-none gap-1">
                                <TabsTrigger
                                    value="all"
                                    className="rounded-xl px-5 font-bold text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 shadow-none"
                                >
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger
                                    value="hr-review"
                                    className="rounded-xl px-5 font-bold text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 shadow-none"
                                >
                                    HR Review
                                </TabsTrigger>
                                <TabsTrigger
                                    value="calibration"
                                    className="rounded-xl px-5 font-bold text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 shadow-none"
                                >
                                    Calibration
                                </TabsTrigger>
                                <TabsTrigger
                                    value="completed"
                                    className="rounded-xl px-5 font-bold text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 shadow-none"
                                >
                                    Completed
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="relative group flex-1 max-w-sm">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                            <Input
                                placeholder="Search by name or ID..."
                                className="pl-11 h-12 rounded-xl bg-white border-slate-100 shadow-sm font-semibold text-sm focus-visible:ring-indigo-100"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <AnimatePresence mode="popLayout">
                        <div className="grid grid-cols-1 gap-4">
                            {filteredAppraisals.length === 0 && (
                                <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 text-sm font-semibold">No appraisal records match your filters.</p>
                                </div>
                            )}
                            {filteredAppraisals.map((appraisal, i) => (
                                <motion.div
                                    key={appraisal.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card
                                        onClick={() => { setActiveAppraisal(appraisal); setIsViewOpen(true); }}
                                        className="group border border-slate-100 shadow-sm hover:shadow-xl transition-all rounded-3xl bg-white overflow-hidden p-0 ring-1 ring-slate-100/50 cursor-pointer"
                                    >
                                        <div className="flex flex-col lg:flex-row">
                                            <div className="p-6 lg:w-72 shrink-0 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-50 bg-slate-50/20 text-start">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-12 w-12 border-2 border-white shadow-md ring-1 ring-slate-100 overflow-hidden rounded-xl">
                                                        <AvatarFallback className="bg-slate-900 text-white font-bold text-sm">
                                                            {appraisal.employeeAvatar}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-slate-900 truncate tracking-tight text-xs leading-none">
                                                            {appraisal.employeeName}
                                                        </h4>
                                                        <p className="text-[9px] text-slate-400 font-bold tracking-widest mt-1">
                                                            {appraisal.employeeId}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-6 space-y-3">
                                                    <div className="space-y-0.5">
                                                        <p className="text-[8px] font-bold text-slate-300 tracking-widest">Active Cycle</p>
                                                        <p className="text-[10px] font-bold text-slate-600 italic leading-tight tracking-tight">
                                                            {appraisal.cycle}
                                                        </p>
                                                    </div>
                                                    {appraisal.proposedIncrement && (
                                                        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-100 w-fit">
                                                            <Percent size={12} className="text-emerald-600" />
                                                            <span className="text-[9px] font-bold text-emerald-900">
                                                                PROPOSED: {appraisal.proposedIncrement}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex-1 p-6 space-y-5 text-start">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Badge
                                                            className={`border-none font-bold text-[9px] h-6 px-3 rounded-lg tracking-widest shadow-sm ${getStatusStyles(
                                                                appraisal.status
                                                            )}`}
                                                        >
                                                            {appraisal.status}
                                                        </Badge>
                                                        <span className="text-[9px] text-slate-300 font-bold tracking-widest italic flex items-center gap-1.5">
                                                            <Calendar size={12} className="text-slate-200" /> Last Touch:{" "}
                                                            {new Date(appraisal.lastUpdated).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    {appraisal.overallRating && (
                                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-xl border border-amber-100">
                                                            <Star size={12} className="text-amber-500 fill-amber-500" />
                                                            <span className="text-xs font-bold text-amber-900">
                                                                {appraisal.overallRating}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {appraisal.competencies.length > 0 ? (
                                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 py-1">
                                                        {appraisal.competencies.map((comp, ci) => (
                                                            <div key={ci} className="space-y-1.5">
                                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate">
                                                                    {comp.name}
                                                                </p>
                                                                <div className="flex gap-0.5">
                                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                                        <div
                                                                            key={s}
                                                                            className={`h-1 flex-1 rounded-full ${s <= comp.rating ? "bg-indigo-500" : "bg-slate-100"
                                                                                }`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-[10px] text-slate-400 italic font-bold tracking-widest uppercase py-1">
                                                        No competencies logged yet — Use Edit to configure.
                                                    </p>
                                                )}

                                                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            className="text-slate-400 hover:text-indigo-600 font-bold text-[10px] gap-2 uppercase tracking-widest border-none h-8"
                                                            onClick={() => downloadAsPdf(appraisal)}
                                                        >
                                                            <Download size={12} /> PDF Draft
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            className="text-slate-400 hover:text-indigo-600 font-bold text-[10px] gap-2 uppercase tracking-widest border-none h-8"
                                                            onClick={() => {
                                                                setActiveAppraisal(appraisal);
                                                                setIsViewOpen(true);
                                                            }}
                                                        >
                                                            <Eye size={12} /> View Details
                                                        </Button>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            className="bg-slate-900 hover:bg-indigo-600 text-white rounded-xl h-10 px-6 font-bold text-[10px] gap-2 transition-all uppercase tracking-widest border-none shadow-md shadow-slate-100"
                                                            onClick={() => {
                                                                setActiveAppraisal(appraisal);
                                                                setReviewData({
                                                                    proposedIncrement: appraisal.proposedIncrement || "",
                                                                    proposedPromotion: appraisal.proposedPromotion || "",
                                                                    hrNotes: appraisal.hrNotes || "",
                                                                    status: appraisal.status,
                                                                });
                                                                setIsReviewOpen(true);
                                                            }}
                                                        >
                                                            <ShieldCheck size={14} /> HR Master Audit
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    className="h-10 w-10 text-slate-300 hover:text-slate-600 rounded-xl hover:bg-slate-50"
                                                                >
                                                                    <MoreVertical size={18} />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent
                                                                align="end"
                                                                className="rounded-xl border-none shadow-2xl p-1.5 w-48 font-bold"
                                                            >
                                                                <DropdownMenuItem
                                                                    className="rounded-lg h-10 text-[10px] uppercase tracking-wide"
                                                                    onClick={() => {
                                                                        setActiveAppraisal(appraisal);
                                                                        setEditData({
                                                                            employeeName: appraisal.employeeName,
                                                                            employeeId: appraisal.employeeId,
                                                                            cycle: appraisal.cycle,
                                                                            overallRating: appraisal.overallRating || 0,
                                                                            competencies: [...appraisal.competencies],
                                                                        });
                                                                        setIsEditOpen(true);
                                                                    }}
                                                                >
                                                                    <Edit size={12} className="mr-2" /> Edit Record
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    className="rounded-lg h-10 text-[10px] uppercase tracking-wide text-rose-600 focus:bg-rose-50"
                                                                    onClick={() => {
                                                                        setActiveAppraisal(appraisal);
                                                                        setIsDeleteOpen(true);
                                                                    }}
                                                                >
                                                                    <Trash2 size={12} className="mr-2" /> Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                </div>
            </main>

            {/* HR Audit SideFormSheet */}
            <SideFormSheet
                open={isReviewOpen}
                onOpenChange={(o) => { setIsReviewOpen(o); if (!o) setReviewErrors({}); }}
                title="HR Master Audit & Mapping"
                description="Finalize rating, propose increments, and select promotion tracks."
                icon={<Award size={20} />}
                accentColor="#4f46e5"
                width="lg"
                loading={saving}
                submitLabel={saving ? "Saving..." : "Commit Audit Decision"}
                onSubmit={(e) => { e.preventDefault(); handleUpdateReview(); }}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Proposed Increment (%)" error={reviewErrors.proposedIncrement || undefined}>
                            <Input
                                placeholder="e.g. 10 or 10%"
                                value={reviewData.proposedIncrement}
                                onChange={(e) => setReviewData({ ...reviewData, proposedIncrement: e.target.value })}
                            />
                        </Field>
                        <Field label="Proposed Promotion">
                            <Input
                                placeholder="e.g. Senior Lead"
                                value={reviewData.proposedPromotion}
                                onChange={(e) => setReviewData({ ...reviewData, proposedPromotion: e.target.value })}
                            />
                        </Field>
                    </div>

                    <Field label="Workflow Status">
                        <Select
                            value={reviewData.status}
                            onValueChange={(v) => setReviewData({ ...reviewData, status: v as any })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Self Review">Self Review</SelectItem>
                                <SelectItem value="Manager Review">With Manager</SelectItem>
                                <SelectItem value="HR Review">With HR Auditor</SelectItem>
                                <SelectItem value="Calibration">In Calibration</SelectItem>
                                <SelectItem value="Completed">Finalized</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Audit Notes" error={reviewErrors.hrNotes || undefined} hint={`${reviewData.hrNotes.length}/1000`}>
                        <Textarea
                            maxLength={1000}
                            className="min-h-[100px]"
                            placeholder="Confidential summary..."
                            value={reviewData.hrNotes}
                            onChange={(e) => setReviewData({ ...reviewData, hrNotes: e.target.value })}
                        />
                    </Field>
                </div>
            </SideFormSheet>

            {/* Launch SideFormSheet */}
            <SideFormSheet
                open={isLaunchOpen}
                onOpenChange={(o) => { setIsLaunchOpen(o); if (!o) setLaunchErrors({}); }}
                title="Initiate Appraisal Cycle"
                description="Select an employee to start their performance audit."
                icon={<Rocket size={20} />}
                accentColor="#7c3aed"
                width="lg"
                loading={saving}
                submitLabel={saving ? "Deploying..." : "Deploy Review Framework"}
                onSubmit={(e) => { e.preventDefault(); handleLaunch(); }}
            >
                <div className="space-y-4">
                    <Field label="Select Employee" required error={launchErrors.employee || undefined}>
                        <Select value={formData.employee} onValueChange={(v) => setFormData({ ...formData, employee: v })}>
                            <SelectTrigger>
                                <SelectValue placeholder={employees.length ? "Choose an employee" : "Loading employees…"} />
                            </SelectTrigger>
                            <SelectContent className="max-h-72 overflow-y-auto">
                                {employees.length === 0 && <div className="px-3 py-2 text-xs text-slate-400 italic">No employees available</div>}
                                {employees.map((e) => (
                                    <SelectItem key={e.id} value={e.id}>{e.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Review Framework / Cycle" required error={launchErrors.cycle || undefined}>
                            <Select value={formData.cycle} onValueChange={(v) => setFormData({ ...formData, cycle: v })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Annual Appraisal 2026">Annual Audit 2026</SelectItem>
                                    <SelectItem value="Mid-Year Review 2026">Mid-Year Review 2026</SelectItem>
                                    <SelectItem value="Q1 2026 Review">Q1 2026 Review</SelectItem>
                                    <SelectItem value="Q2 2026 Review">Q2 2026 Review</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Initial Rating (1-5)" required error={launchErrors.initialRating || undefined}>
                            <Input
                                type="number" min={1} max={5} step={0.1}
                                value={formData.initialRating}
                                onChange={(e) => setFormData({ ...formData, initialRating: Math.max(1, Math.min(5, parseFloat(e.target.value) || 1)) })}
                            />
                        </Field>
                    </div>
                </div>
            </SideFormSheet>

            {/* View Details Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent
                    className="bg-white rounded-[2.5rem] border-none p-10 max-w-3xl shadow-3xl font-sans max-h-[85vh] overflow-y-auto"
                    style={{ zoom: "80%" }}
                >
                    <DialogHeader className="space-y-3">
                        <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-2 shadow-inner border border-blue-100">
                            <FileText size={26} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
                            Appraisal Full Report
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-semibold text-sm">
                            Complete appraisal snapshot for {activeAppraisal?.employeeName}.
                        </DialogDescription>
                    </DialogHeader>

                    {activeAppraisal && (
                        <div className="py-6 space-y-6 text-start">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Employee</p>
                                    <p className="text-sm font-bold text-slate-900 mt-1">{activeAppraisal.employeeName}</p>
                                    <p className="text-xs text-slate-500 font-semibold">{activeAppraisal.employeeId}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Cycle</p>
                                    <p className="text-sm font-bold text-slate-900 mt-1">{activeAppraisal.cycle}</p>
                                    <Badge
                                        className={`mt-2 border-none font-bold text-[9px] tracking-widest ${getStatusStyles(
                                            activeAppraisal.status
                                        )}`}
                                    >
                                        {activeAppraisal.status}
                                    </Badge>
                                </div>
                                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                    <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">Overall Rating</p>
                                    <p className="text-2xl font-black text-amber-900 mt-1">
                                        {activeAppraisal.overallRating ?? "—"} / 5
                                    </p>
                                </div>
                                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Proposed</p>
                                    <p className="text-xs font-bold text-emerald-900 mt-1">
                                        Increment: {activeAppraisal.proposedIncrement || "—"}
                                    </p>
                                    <p className="text-xs font-bold text-emerald-900">
                                        Promotion: {activeAppraisal.proposedPromotion || "—"}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Competencies</h4>
                                {activeAppraisal.competencies.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic">No competencies recorded.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {activeAppraisal.competencies.map((c, i) => (
                                            <div key={i} className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                                                <div>
                                                    <p className="text-xs font-bold text-slate-800">{c.name}</p>
                                                    {c.feedback && (
                                                        <p className="text-[10px] text-slate-500 italic">{c.feedback}</p>
                                                    )}
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star
                                                            key={s}
                                                            size={12}
                                                            className={
                                                                s <= c.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {activeAppraisal.hrNotes && (
                                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                    <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest mb-1">HR Notes</p>
                                    <p className="text-xs text-slate-700 italic">{activeAppraisal.hrNotes}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="ghost"
                            className="h-10 px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest text-slate-500"
                            onClick={() => setIsViewOpen(false)}
                        >
                            Close
                        </Button>
                        {activeAppraisal && (
                            <Button
                                className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-10 px-6 font-bold text-[10px] uppercase tracking-widest border-none"
                                onClick={() => downloadAsPdf(activeAppraisal)}
                            >
                                <Download size={14} className="mr-2" /> Download
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit SideFormSheet */}
            <SideFormSheet
                open={isEditOpen}
                onOpenChange={(o) => { setIsEditOpen(o); if (!o) setEditErrors({}); }}
                title="Edit Appraisal Record"
                description="Update identity, cycle, and competency scoring."
                icon={<Edit size={20} />}
                accentColor="#059669"
                width="xl"
                loading={saving}
                submitLabel={saving ? "Saving..." : "Save Changes"}
                onSubmit={(e) => { e.preventDefault(); handleEdit(); }}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Employee Name" required error={editErrors.employeeName || undefined}>
                            <Input
                                maxLength={100}
                                value={editData.employeeName}
                                onChange={(e) => setEditData({ ...editData, employeeName: e.target.value })}
                            />
                        </Field>
                        <Field label="Work ID">
                            <Input
                                value={editData.employeeId}
                                onChange={(e) => setEditData({ ...editData, employeeId: e.target.value })}
                            />
                        </Field>
                        <Field label="Cycle" required error={editErrors.cycle || undefined}>
                            <Input
                                maxLength={100}
                                value={editData.cycle}
                                onChange={(e) => setEditData({ ...editData, cycle: e.target.value })}
                            />
                        </Field>
                        <Field label="Overall Rating (0–5)" error={editErrors.overallRating || undefined}>
                            <Input
                                type="number" step="0.1" min={0} max={5}
                                value={editData.overallRating}
                                onChange={(e) => setEditData({ ...editData, overallRating: Math.max(0, Math.min(5, parseFloat(e.target.value) || 0)) })}
                            />
                        </Field>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[13px] font-semibold text-[#374151]">Competencies</label>
                            <Button
                                type="button"
                                variant="ghost"
                                className="h-7 text-[11px] font-bold text-indigo-600 gap-1"
                                onClick={() =>
                                    setEditData({
                                        ...editData,
                                        competencies: [...editData.competencies, { name: "", rating: 3, feedback: "" }],
                                    })
                                }
                            >
                                <Plus size={12} /> Add Competency
                            </Button>
                        </div>
                        {editData.competencies.length === 0 ? (
                            <p className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-xl">
                                No competencies. Click "Add Competency" to start.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {editData.competencies.map((c, i) => (
                                    <div
                                        key={i}
                                        className="p-3 bg-slate-50 rounded-xl grid grid-cols-12 gap-2 items-center"
                                    >
                                        <Input
                                            className="col-span-4 h-9 bg-white text-xs"
                                            placeholder="Name"
                                            value={c.name}
                                            onChange={(e) => {
                                                const arr = [...editData.competencies];
                                                arr[i] = { ...arr[i], name: e.target.value };
                                                setEditData({ ...editData, competencies: arr });
                                            }}
                                        />
                                        <Input
                                            type="number"
                                            min={1}
                                            max={5}
                                            className="col-span-2 h-9 bg-white text-xs text-center"
                                            value={c.rating}
                                            onChange={(e) => {
                                                const arr = [...editData.competencies];
                                                arr[i] = { ...arr[i], rating: parseInt(e.target.value) || 0 };
                                                setEditData({ ...editData, competencies: arr });
                                            }}
                                        />
                                        <Input
                                            className="col-span-5 h-9 bg-white text-xs"
                                            placeholder="Feedback (optional)"
                                            value={c.feedback || ""}
                                            onChange={(e) => {
                                                const arr = [...editData.competencies];
                                                arr[i] = { ...arr[i], feedback: e.target.value };
                                                setEditData({ ...editData, competencies: arr });
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="col-span-1 h-9 w-9 p-0 text-rose-500 hover:bg-rose-50"
                                            onClick={() =>
                                                setEditData({
                                                    ...editData,
                                                    competencies: editData.competencies.filter((_, idx) => idx !== i),
                                                })
                                            }
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </SideFormSheet>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove appraisal?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This permanently removes the appraisal record for{" "}
                            <strong>{activeAppraisal?.employeeName}</strong>. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-rose-600 hover:bg-rose-700 text-white"
                            onClick={handleDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default PerformanceAppraisalsPage;
