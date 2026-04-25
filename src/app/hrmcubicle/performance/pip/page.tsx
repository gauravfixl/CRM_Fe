"use client"

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Bell,
  Edit,
  Trash2,
  MoreVertical,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useToast } from "@/shared/components/ui/use-toast";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
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
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import {
  createImprovementPlan,
  deleteImprovementPlan,
  getAllEmployees,
  getAllImprovementPlans,
  updateImprovementPlan,
} from "@/modules/hrm/hooks/hrmHooks";
import {
  firstError,
  isAfter,
  isFutureDate,
  maxLength,
  required,
  type ValidationErrors,
} from "@/shared/utils/validators";

interface EmployeeOpt { id: string; label: string; name: string; empCode: string; department: string; }

interface Milestone {
  title: string;
  dueDate: string;
  status: "Pending" | "In Progress" | "Completed" | "Overdue";
  notes: string;
}

interface PIPRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  manager: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Extended" | "Completed" | "Terminated";
  progress: number;
  improvementAreas: string[];
  goals: string;
  reviewFrequency: string;
  milestones: Milestone[];
  reviewNotes: { date: string; note: string; recommendation: string }[];
}

const mockPIPs: PIPRecord[] = [
  {
    id: "PIP001", employeeName: "Karan Mehta", employeeId: "E007", department: "Engineering", manager: "Aarav Sharma",
    startDate: "2026-01-15", endDate: "2026-04-15", status: "Active", progress: 45,
    improvementAreas: ["Code Quality", "Communication", "Deadlines"],
    goals: "Improve code review scores to 4+, attend all standups, meet 90% of sprint deadlines",
    reviewFrequency: "Bi-weekly",
    milestones: [
      { title: "Complete code quality workshop", dueDate: "2026-02-01", status: "Completed", notes: "Attended successfully" },
      { title: "Achieve 3.5+ code review avg", dueDate: "2026-03-01", status: "In Progress", notes: "Currently at 3.2" },
      { title: "Zero missed deadlines for 30 days", dueDate: "2026-04-01", status: "Pending", notes: "" },
    ],
    reviewNotes: [
      { date: "2026-02-01", note: "Showing improvement in code quality. Communication still needs work.", recommendation: "Continue" },
      { date: "2026-02-15", note: "Attended all standups. Code review scores improving.", recommendation: "Continue" },
    ],
  },
  {
    id: "PIP002", employeeName: "Ritu Agarwal", employeeId: "E012", department: "HR", manager: "Vikram Singh",
    startDate: "2025-10-01", endDate: "2026-01-01", status: "Extended", progress: 60,
    improvementAreas: ["Process Compliance", "Documentation"],
    goals: "100% compliance with HR processes, complete documentation backlog",
    reviewFrequency: "Weekly",
    milestones: [
      { title: "Clear documentation backlog", dueDate: "2025-11-15", status: "Completed", notes: "Done" },
      { title: "Zero compliance issues for 60 days", dueDate: "2026-02-28", status: "In Progress", notes: "2 minor issues remaining" },
    ],
    reviewNotes: [
      { date: "2025-11-01", note: "Documentation backlog clearing progressing well.", recommendation: "Continue" },
      { date: "2026-01-01", note: "Good progress but not enough for completion. Extending by 3 months.", recommendation: "Extend" },
    ],
  },
  {
    id: "PIP003", employeeName: "Sneha Gupta", employeeId: "E004", department: "Sales", manager: "Arjun Das",
    startDate: "2025-08-01", endDate: "2025-11-01", status: "Completed", progress: 100,
    improvementAreas: ["Sales Targets", "Client Follow-up"],
    goals: "Achieve 80% of quarterly target, follow up with all leads within 24 hours",
    reviewFrequency: "Bi-weekly",
    milestones: [
      { title: "Achieve 50% monthly target", dueDate: "2025-09-01", status: "Completed", notes: "Achieved 55%" },
      { title: "100% follow-up compliance", dueDate: "2025-10-01", status: "Completed", notes: "Maintained for 30 days" },
      { title: "Achieve 80% quarterly target", dueDate: "2025-11-01", status: "Completed", notes: "Achieved 85%" },
    ],
    reviewNotes: [
      { date: "2025-09-01", note: "Good improvement in targets.", recommendation: "Continue" },
      { date: "2025-11-01", note: "Successfully completed all goals. PIP closed.", recommendation: "Complete" },
    ],
  },
  {
    id: "PIP004", employeeName: "Amit Jha", employeeId: "E015", department: "Engineering", manager: "Priya Patel",
    startDate: "2025-06-01", endDate: "2025-09-01", status: "Terminated", progress: 20,
    improvementAreas: ["Attendance", "Performance", "Team Collaboration"],
    goals: "Maintain 95% attendance, complete assigned tasks, participate in team activities",
    reviewFrequency: "Weekly",
    milestones: [
      { title: "95% attendance for 30 days", dueDate: "2025-07-01", status: "Overdue", notes: "Only 70% attendance" },
      { title: "Complete 3 assigned projects", dueDate: "2025-08-01", status: "Overdue", notes: "1 of 3 completed" },
    ],
    reviewNotes: [
      { date: "2025-07-01", note: "No improvement in attendance. Verbal warning given.", recommendation: "Continue" },
      { date: "2025-08-01", note: "Continued non-compliance. Recommending termination of PIP.", recommendation: "Terminate" },
    ],
  },
];

const statusConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  Active: { color: "text-blue-700", bg: "bg-blue-50", icon: Clock },
  Extended: { color: "text-amber-700", bg: "bg-amber-50", icon: RefreshCw },
  Completed: { color: "text-green-700", bg: "bg-green-50", icon: CheckCircle2 },
  Terminated: { color: "text-red-700", bg: "bg-red-50", icon: XCircle },
};

const emptyPipForm = {
  employeeId: "",           // backend ObjectId
  employee: "",             // display name
  employeeCode: "",
  department: "",
  startDate: "",
  endDate: "",
  goals: "",
  reviewFrequency: "Bi-weekly",
  manager: "",
  areas: [] as string[],
};

// Frontend <-> Backend status mapping (backend enum: In Progress, Completed, Delayed)
const toBackendStatus = (s: PIPRecord["status"]): "In Progress" | "Completed" | "Delayed" => {
  if (s === "Completed") return "Completed";
  if (s === "Terminated") return "Delayed";
  if (s === "Extended") return "Delayed";
  return "In Progress";
};

const PIPTrackingPage = () => {
  const { toast } = useToast();
  const [pips, setPips] = useState<PIPRecord[]>(mockPIPs);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedPip, setExpandedPip] = useState<string | null>(null);
  const [newPipOpen, setNewPipOpen] = useState(false);
  const [editPip, setEditPip] = useState<PIPRecord | null>(null);
  const [deletePip, setDeletePip] = useState<PIPRecord | null>(null);
  const [milestonePip, setMilestonePip] = useState<PIPRecord | null>(null);
  const [reviewDialog, setReviewDialog] = useState<PIPRecord | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [reviewRecommendation, setReviewRecommendation] = useState("Continue");
  const [newMilestone, setNewMilestone] = useState<Milestone>({ title: "", dueDate: "", status: "Pending", notes: "" });

  const [employees, setEmployees] = useState<EmployeeOpt[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pipErrors, setPipErrors] = useState<ValidationErrors>({});
  const [reviewErrors, setReviewErrors] = useState<ValidationErrors>({});
  const [milestoneErrors, setMilestoneErrors] = useState<ValidationErrors>({});

  // PIP form state (used for both new + edit)
  const [newPip, setNewPip] = useState(emptyPipForm);

  const improvementOptions = ["Code Quality", "Communication", "Deadlines", "Attendance", "Performance", "Team Collaboration", "Documentation", "Process Compliance", "Sales Targets", "Client Follow-up"];

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [pipRes, empRes] = await Promise.allSettled([getAllImprovementPlans(), getAllEmployees()]);
        if (!mounted) return;
        if (pipRes.status === "fulfilled") {
          const rows = pipRes.value?.data?.plans ?? pipRes.value?.data?.data ?? [];
          const mapped: PIPRecord[] = rows.map((p: any) => ({
            id: String(p.id ?? p._id ?? ""),
            employeeName: p.employee?.email || "Employee",
            employeeId: p.employee?.employeeId || "-",
            department: "",
            manager: p.createdBy || "",
            startDate: p.planDate ? new Date(p.planDate).toISOString().slice(0, 10) : "",
            endDate: p.timeline ? new Date(p.timeline).toISOString().slice(0, 10) : "",
            status: p.status === "Completed" ? "Completed" : p.status === "Delayed" ? "Extended" : "Active",
            progress: 0,
            improvementAreas: p.objectives || [],
            goals: (p.actions || []).join(" • "),
            reviewFrequency: "Bi-weekly",
            milestones: [],
            reviewNotes: [],
          }));
          if (mapped.length > 0) setPips((prev) => {
            const byId = new Map(prev.map((x) => [x.id, x]));
            mapped.forEach((m) => byId.set(m.id, { ...byId.get(m.id), ...m } as PIPRecord));
            return Array.from(byId.values());
          });
        }
        if (empRes.status === "fulfilled") {
          const list = empRes.value?.data?.employees ?? empRes.value?.data?.data ?? [];
          setEmployees(
            list.map((e: any) => {
              const name = e.personalInfo?.fullName || e.firstName || e.name || "";
              return {
                id: String(e._id ?? e.id ?? ""),
                empCode: String(e.employeeId || ""),
                department: e.department?.name || e.department || "",
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

  const validatePip = (): ValidationErrors => {
    const e: ValidationErrors = {};
    const emp = required(newPip.employee, "Employee");
    if (emp) e.employee = emp;
    const sd = firstError(required(newPip.startDate, "Start date"), isFutureDate(newPip.startDate, "Start date"));
    if (!editPip && sd) e.startDate = sd;
    const ed = firstError(required(newPip.endDate, "End date"), isAfter(newPip.endDate, newPip.startDate, "End date", "start date"));
    if (ed) e.endDate = ed;
    const g = firstError(required(newPip.goals, "Goals"), maxLength(newPip.goals, 1000, "Goals"));
    if (g) e.goals = g;
    if (newPip.areas.length === 0) e.areas = "Select at least one improvement area";
    return e;
  };

  const filtered = useMemo(() => {
    return pips.filter((p) => {
      const matchSearch = p.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [pips, searchTerm, statusFilter]);

  const stats = useMemo(() => ({
    active: pips.filter((p) => p.status === "Active").length,
    completed: pips.filter((p) => p.status === "Completed").length,
    extended: pips.filter((p) => p.status === "Extended").length,
    terminated: pips.filter((p) => p.status === "Terminated").length,
  }), [pips]);

  const upcomingReviews = pips.filter((p) => p.status === "Active" || p.status === "Extended").length;

  const handleCreatePip = async () => {
    const v = validatePip();
    setPipErrors(v);
    if (Object.keys(v).length > 0) {
      toast({ title: "Validation failed", description: "Please correct the highlighted fields.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editPip) {
        if (/^[a-f\d]{24}$/i.test(editPip.id)) {
          try {
            await updateImprovementPlan(editPip.id, {
              objectives: newPip.areas,
              actions: newPip.goals ? newPip.goals.split(" • ") : [],
              timeline: newPip.endDate,
              managerComments: newPip.manager,
            });
          } catch { /* local fallback */ }
        }
        setPips(pips.map((p) => (p.id === editPip.id ? {
          ...p,
          employeeName: newPip.employee,
          department: newPip.department,
          manager: newPip.manager,
          startDate: newPip.startDate,
          endDate: newPip.endDate,
          goals: newPip.goals,
          reviewFrequency: newPip.reviewFrequency,
          improvementAreas: newPip.areas,
        } : p)));
        setEditPip(null);
        setNewPipOpen(false);
        setNewPip(emptyPipForm);
        setPipErrors({});
        toast({ title: "PIP Updated", description: `Saved changes for ${newPip.employee}.` });
        return;
      }

      let backendId: string | null = null;
      if (newPip.employeeId) {
        try {
          const res = await createImprovementPlan({
            employee: newPip.employeeId,
            objectives: newPip.areas,
            actions: newPip.goals ? newPip.goals.split(" • ") : [],
            timeline: newPip.endDate,
            planDate: newPip.startDate,
            managerComments: newPip.manager,
          });
          backendId = res?.data?.newPlan?._id ? String(res.data.newPlan._id) : null;
        } catch { /* local fallback */ }
      }

      const pip: PIPRecord = {
        id: backendId || `PIP${String(pips.length + 1).padStart(3, "0")}`,
        employeeName: newPip.employee,
        employeeId: newPip.employeeCode || `E${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`,
        department: newPip.department,
        manager: newPip.manager,
        startDate: newPip.startDate,
        endDate: newPip.endDate,
        status: "Active",
        progress: 0,
        improvementAreas: newPip.areas,
        goals: newPip.goals,
        reviewFrequency: newPip.reviewFrequency,
        milestones: [],
        reviewNotes: [],
      };
      setPips([pip, ...pips]);
      setNewPipOpen(false);
      setNewPip(emptyPipForm);
      setPipErrors({});
      toast({ title: "PIP Created", description: `PIP created for ${pip.employeeName}.` });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePip = async () => {
    if (!deletePip) return;
    if (/^[a-f\d]{24}$/i.test(deletePip.id)) {
      try { await deleteImprovementPlan(deletePip.id); } catch { /* proceed */ }
    }
    setPips(pips.filter((p) => p.id !== deletePip.id));
    toast({ title: "PIP Removed", description: `${deletePip.employeeName}'s PIP record deleted.` });
    setDeletePip(null);
  };

  const handleAddMilestone = () => {
    if (!milestonePip) return;
    const v: ValidationErrors = {};
    const t = firstError(required(newMilestone.title, "Title"), maxLength(newMilestone.title, 200, "Title"));
    if (t) v.title = t;
    const d = required(newMilestone.dueDate, "Due date");
    if (d) v.dueDate = d;
    setMilestoneErrors(v);
    if (Object.keys(v).length > 0) return;

    setPips(pips.map((p) => (p.id === milestonePip.id ? { ...p, milestones: [...p.milestones, newMilestone] } : p)));
    setMilestonePip({ ...milestonePip, milestones: [...milestonePip.milestones, newMilestone] });
    setNewMilestone({ title: "", dueDate: "", status: "Pending", notes: "" });
    setMilestoneErrors({});
    toast({ title: "Milestone Added", description: `"${newMilestone.title}" tracked.` });
  };

  const handleUpdateMilestoneStatus = (idx: number, status: Milestone["status"]) => {
    if (!milestonePip) return;
    const updated = milestonePip.milestones.map((m, i) => (i === idx ? { ...m, status } : m));
    const completedPct = Math.round((updated.filter((m) => m.status === "Completed").length / Math.max(updated.length, 1)) * 100);
    setPips(pips.map((p) => (p.id === milestonePip.id ? { ...p, milestones: updated, progress: completedPct } : p)));
    setMilestonePip({ ...milestonePip, milestones: updated, progress: completedPct });
  };

  const handleRemoveMilestone = (idx: number) => {
    if (!milestonePip) return;
    const updated = milestonePip.milestones.filter((_, i) => i !== idx);
    const completedPct = updated.length === 0 ? 0 : Math.round((updated.filter((m) => m.status === "Completed").length / updated.length) * 100);
    setPips(pips.map((p) => (p.id === milestonePip.id ? { ...p, milestones: updated, progress: completedPct } : p)));
    setMilestonePip({ ...milestonePip, milestones: updated, progress: completedPct });
  };

  const handleReviewSubmit = async () => {
    if (!reviewDialog) return;
    const v: ValidationErrors = {};
    const n = firstError(required(reviewNote, "Progress notes"), maxLength(reviewNote, 1000, "Notes"));
    if (n) v.reviewNote = n;
    setReviewErrors(v);
    if (Object.keys(v).length > 0) return;

    let newStatus = reviewDialog.status;
    let newProgress = reviewDialog.progress;
    if (reviewRecommendation === "Complete") { newStatus = "Completed"; newProgress = 100; }
    if (reviewRecommendation === "Terminate") { newStatus = "Terminated"; }
    if (reviewRecommendation === "Extend") { newStatus = "Extended"; }

    setSaving(true);
    try {
      if (/^[a-f\d]{24}$/i.test(reviewDialog.id)) {
        try {
          await updateImprovementPlan(reviewDialog.id, {
            status: toBackendStatus(newStatus),
            managerComments: reviewNote,
          });
        } catch { /* local fallback */ }
      }
      setPips((prev) =>
        prev.map((p) => {
          if (p.id !== reviewDialog.id) return p;
          const newNotes = [...p.reviewNotes, { date: new Date().toISOString().slice(0, 10), note: reviewNote, recommendation: reviewRecommendation }];
          return { ...p, reviewNotes: newNotes, status: newStatus, progress: newProgress };
        })
      );
      setReviewDialog(null);
      setReviewNote("");
      setReviewRecommendation("Continue");
      setReviewErrors({});
      toast({ title: "Review Submitted", description: "PIP review has been recorded." });
    } finally {
      setSaving(false);
    }
  };

  const handleExport = (pipId: string) => {
    const pip = pips.find((p) => p.id === pipId);
    if (!pip) return;
    const text = [
      `PIP REPORT: ${pip.id}`,
      "=".repeat(50),
      `Employee: ${pip.employeeName} (${pip.employeeId})`,
      `Department: ${pip.department}`,
      `Manager: ${pip.manager}`,
      `Period: ${pip.startDate} → ${pip.endDate}`,
      `Status: ${pip.status}    Progress: ${pip.progress}%`,
      `Review Frequency: ${pip.reviewFrequency}`,
      "",
      "Improvement Areas:",
      ...pip.improvementAreas.map((a) => ` - ${a}`),
      "",
      `Goals: ${pip.goals}`,
      "",
      "Milestones:",
      ...pip.milestones.map((m) => ` - [${m.status}] ${m.title} (due ${m.dueDate}) ${m.notes ? `— ${m.notes}` : ""}`),
      "",
      "Review Notes:",
      ...pip.reviewNotes.map((r) => ` - ${r.date} [${r.recommendation}] ${r.note}`),
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `PIP_${pip.id}_${pip.employeeName.replace(/\s/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: `PIP history for ${pip.employeeName} downloaded.` });
  };

  const handleExportAll = () => {
    const rows = [["ID", "Employee", "Dept", "Start", "End", "Status", "Progress", "Manager"]];
    filtered.forEach((p) => rows.push([p.id, p.employeeName, p.department, p.startDate, p.endDate, p.status, `${p.progress}%`, p.manager]));
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pip_tracker_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Bulk Export", description: `${filtered.length} PIP records exported.` });
  };

  const statCards = [
    { label: "Active PIPs", value: stats.active, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Extended", value: stats.extended, icon: RefreshCw, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Terminated", value: stats.terminated, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">PIP Tracking</h1>
          <p className="text-slate-500 text-sm mt-1">Performance Improvement Plans management</p>
        </div>
        <div className="flex gap-2 items-center">
          {loading && <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />}
          {upcomingReviews > 0 && (
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 gap-1"><Bell className="w-3 h-3" /> {upcomingReviews} reviews due</Badge>
          )}
          <Button variant="outline" onClick={handleExportAll} className="gap-2">
            <Download className="w-4 h-4" /> Export All
          </Button>
          <Button onClick={() => { setEditPip(null); setNewPip(emptyPipForm); setPipErrors({}); setNewPipOpen(true); }} className="gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
            <Plus className="w-4 h-4" /> New PIP
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", s.bg)}>
                <s.icon className={cn("w-5 h-5", s.color)} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search employee..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Extended">Extended</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* PIP Table */}
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-3 text-slate-500 font-medium w-8"></th>
                  <th className="text-left py-3 px-3 text-slate-500 font-medium">Employee</th>
                  <th className="text-left py-3 px-3 text-slate-500 font-medium">Department</th>
                  <th className="text-left py-3 px-3 text-slate-500 font-medium">Start</th>
                  <th className="text-left py-3 px-3 text-slate-500 font-medium">End</th>
                  <th className="text-center py-3 px-3 text-slate-500 font-medium">Status</th>
                  <th className="text-center py-3 px-3 text-slate-500 font-medium">Progress</th>
                  <th className="text-left py-3 px-3 text-slate-500 font-medium">Manager</th>
                  <th className="text-center py-3 px-3 text-slate-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((pip) => {
                  const sc = statusConfig[pip.status];
                  const isExpanded = expandedPip === pip.id;
                  return (
                    <React.Fragment key={pip.id}>
                      <tr className="border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer" onClick={() => setExpandedPip(isExpanded ? null : pip.id)}>
                        <td className="py-3 px-3">{isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}</td>
                        <td className="py-3 px-3 font-medium text-slate-800">{pip.employeeName}</td>
                        <td className="py-3 px-3 text-slate-600">{pip.department}</td>
                        <td className="py-3 px-3 text-slate-600">{pip.startDate}</td>
                        <td className="py-3 px-3 text-slate-600">{pip.endDate}</td>
                        <td className="py-3 px-3 text-center">
                          <Badge className={cn("text-xs border-0", sc.bg, sc.color)}>{pip.status}</Badge>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2 justify-center">
                            <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#8B5CF6] rounded-full transition-all" style={{ width: `${pip.progress}%` }} />
                            </div>
                            <span className="text-xs text-slate-600">{pip.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{pip.manager}</td>
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            {(pip.status === "Active" || pip.status === "Extended") && (
                              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setReviewDialog(pip)}>Review</Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                  <MoreVertical className="w-3.5 h-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl p-1.5 w-48 font-bold shadow-2xl border-none">
                                <DropdownMenuItem
                                  className="rounded-lg text-[11px]"
                                  onClick={() => {
                                    setEditPip(pip);
                                    setNewPip({
                                      employeeId: pip.employeeId && /^[a-f\d]{24}$/i.test(pip.employeeId) ? pip.employeeId : "",
                                      employee: pip.employeeName,
                                      employeeCode: pip.employeeId,
                                      department: pip.department,
                                      startDate: pip.startDate,
                                      endDate: pip.endDate,
                                      goals: pip.goals,
                                      reviewFrequency: pip.reviewFrequency,
                                      manager: pip.manager,
                                      areas: pip.improvementAreas,
                                    });
                                    setPipErrors({});
                                    setNewPipOpen(true);
                                  }}
                                >
                                  <Edit className="w-3.5 h-3.5 mr-2" /> Edit PIP
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg text-[11px]" onClick={() => setMilestonePip(pip)}>
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> Manage Milestones
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg text-[11px]" onClick={() => handleExport(pip.id)}>
                                  <Download className="w-3.5 h-3.5 mr-2" /> Export History
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="rounded-lg text-[11px] text-rose-600 focus:bg-rose-50"
                                  onClick={() => setDeletePip(pip)}
                                >
                                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                      <AnimatePresence>
                        {isExpanded && (
                          <tr>
                            <td colSpan={9} className="p-0">
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="p-5 bg-slate-50/50 space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Improvement Areas</h4>
                                      <div className="flex flex-wrap gap-1">
                                        {pip.improvementAreas.map((a) => (<Badge key={a} variant="outline" className="text-xs">{a}</Badge>))}
                                      </div>
                                      <h4 className="text-sm font-semibold text-slate-700 mt-3 mb-1">Goals</h4>
                                      <p className="text-xs text-slate-600">{pip.goals}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Milestones</h4>
                                      <div className="space-y-2">
                                        {pip.milestones.map((m, i) => (
                                          <div key={i} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-100">
                                            <div className={cn("w-2 h-2 rounded-full", m.status === "Completed" ? "bg-green-500" : m.status === "Overdue" ? "bg-red-500" : m.status === "In Progress" ? "bg-blue-500" : "bg-slate-300")} />
                                            <div className="flex-1">
                                              <div className="text-xs font-medium text-slate-700">{m.title}</div>
                                              <div className="text-[10px] text-slate-400">Due: {m.dueDate} {m.notes && `- ${m.notes}`}</div>
                                            </div>
                                            <Badge variant="outline" className="text-[10px]">{m.status}</Badge>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  {pip.reviewNotes.length > 0 && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Review Notes</h4>
                                      <div className="space-y-2">
                                        {pip.reviewNotes.map((r, i) => (
                                          <div key={i} className="p-2 bg-white rounded-lg border border-slate-100 flex items-start gap-3">
                                            <span className="text-[10px] text-slate-400 w-20 flex-shrink-0">{r.date}</span>
                                            <span className="text-xs text-slate-600 flex-1">{r.note}</span>
                                            <Badge variant="outline" className="text-[10px]">{r.recommendation}</Badge>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* New / Edit PIP SideFormSheet */}
      <SideFormSheet
        open={newPipOpen}
        onOpenChange={(open) => { setNewPipOpen(open); if (!open) { setEditPip(null); setNewPip(emptyPipForm); setPipErrors({}); } }}
        title={editPip ? `Edit PIP — ${editPip.employeeName}` : "Create New PIP"}
        description={editPip ? "Update the plan details." : "Set up a Performance Improvement Plan for an employee"}
        icon={editPip ? <Edit size={20} /> : <Plus size={20} />}
        accentColor={editPip ? "#7c3aed" : "#e11d48"}
        width="lg"
        loading={saving}
        submitLabel={saving ? "Saving..." : editPip ? "Save Changes" : "Create PIP"}
        onSubmit={(e) => { e.preventDefault(); handleCreatePip(); }}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Employee" required error={pipErrors.employee || undefined}>
              {editPip ? (
                <Input value={newPip.employee} onChange={(e) => setNewPip({ ...newPip, employee: e.target.value })} />
              ) : (
                <Select value={newPip.employeeId} onValueChange={(v) => {
                  const emp = employees.find((e) => e.id === v);
                  setNewPip({
                    ...newPip,
                    employeeId: v,
                    employee: emp?.name || "",
                    employeeCode: emp?.empCode || "",
                    department: emp?.department || newPip.department,
                  });
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder={employees.length ? "Choose employee" : "Loading employees…"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-72 overflow-y-auto">
                    {employees.length === 0 && <div className="px-3 py-2 text-xs text-slate-400 italic">No employees available</div>}
                    {employees.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
            <Field label="Department">
              <Input value={newPip.department} onChange={(e) => setNewPip({ ...newPip, department: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Date" required error={pipErrors.startDate || undefined}>
              <Input type="date" value={newPip.startDate} onChange={(e) => setNewPip({ ...newPip, startDate: e.target.value })} />
            </Field>
            <Field label="End Date" required error={pipErrors.endDate || undefined}>
              <Input type="date" value={newPip.endDate} onChange={(e) => setNewPip({ ...newPip, endDate: e.target.value })} />
            </Field>
          </div>
          <Field label="Manager">
            <Input value={newPip.manager} onChange={(e) => setNewPip({ ...newPip, manager: e.target.value })} />
          </Field>
          <Field label="Review Frequency">
            <Select value={newPip.reviewFrequency} onValueChange={(v) => setNewPip({ ...newPip, reviewFrequency: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Improvement Areas" required error={pipErrors.areas || undefined}>
            <div className="flex flex-wrap gap-2 p-2 rounded-md border border-slate-200 bg-white">
              {improvementOptions.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setNewPip({ ...newPip, areas: newPip.areas.includes(opt) ? newPip.areas.filter((a) => a !== opt) : [...newPip.areas, opt] })}
                  className={cn("px-3 py-1 text-xs rounded-full border transition-colors", newPip.areas.includes(opt) ? "bg-[#8B5CF6] text-white border-[#8B5CF6]" : "bg-white text-slate-600 border-slate-200 hover:border-[#8B5CF6]")}
                >
                  {opt}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Goals" required error={pipErrors.goals || undefined} hint={`${newPip.goals.length}/1000`}>
            <Textarea
              maxLength={1000}
              value={newPip.goals}
              onChange={(e) => setNewPip({ ...newPip, goals: e.target.value })}
              rows={3}
            />
          </Field>
        </div>
      </SideFormSheet>

      {/* Milestone Manager SideFormSheet */}
      <SideFormSheet
        open={!!milestonePip}
        onOpenChange={(open) => { if (!open) { setMilestonePip(null); setNewMilestone({ title: "", dueDate: "", status: "Pending", notes: "" }); setMilestoneErrors({}); } }}
        title={`Milestones — ${milestonePip?.employeeName || ""}`}
        description="Add, update status, or remove milestones. Progress updates automatically."
        icon={<CheckCircle2 size={20} />}
        accentColor="#0ea5e9"
        width="lg"
        hideFooter
      >
        <div className="space-y-3">
          {(milestonePip?.milestones || []).length === 0 && (
            <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded">No milestones yet.</p>
          )}
          {(milestonePip?.milestones || []).map((m, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-lg space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-700">{m.title}</span>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-rose-500" onClick={() => handleRemoveMilestone(i)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <p className="text-xs text-slate-400">Due: {m.dueDate}{m.notes ? ` — ${m.notes}` : ""}</p>
              <Select value={m.status} onValueChange={(v) => handleUpdateMilestoneStatus(i, v as Milestone["status"])}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}

          <div className="mt-3 p-3 bg-indigo-50 rounded-lg space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-indigo-600 font-bold">Add Milestone</Label>
            <Input
              maxLength={200}
              placeholder="Title *"
              value={newMilestone.title}
              onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
              className={milestoneErrors.title ? "border-rose-400" : ""}
            />
            {milestoneErrors.title && <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1"><AlertCircle size={10} /> {milestoneErrors.title}</p>}
            <Input
              type="date"
              value={newMilestone.dueDate}
              onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
              className={milestoneErrors.dueDate ? "border-rose-400" : ""}
            />
            {milestoneErrors.dueDate && <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1"><AlertCircle size={10} /> {milestoneErrors.dueDate}</p>}
            <Input maxLength={500} placeholder="Notes (optional)" value={newMilestone.notes} onChange={(e) => setNewMilestone({ ...newMilestone, notes: e.target.value })} />
            <Button type="button" className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white" onClick={handleAddMilestone}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add
            </Button>
          </div>
        </div>
      </SideFormSheet>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletePip} onOpenChange={(open) => { if (!open) setDeletePip(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this PIP?</AlertDialogTitle>
            <AlertDialogDescription>
              The PIP record for {deletePip?.employeeName} will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-rose-600 hover:bg-rose-700 text-white" onClick={handleDeletePip}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Review SideFormSheet */}
      <SideFormSheet
        open={!!reviewDialog}
        onOpenChange={(open) => { if (!open) { setReviewDialog(null); setReviewErrors({}); } }}
        title={`PIP Review — ${reviewDialog?.employeeName || ""}`}
        description="Submit a progress review for this PIP"
        icon={<CheckCircle2 size={20} />}
        accentColor="#4f46e5"
        width="md"
        loading={saving}
        submitLabel={saving ? "Submitting..." : "Submit Review"}
        onSubmit={(e) => { e.preventDefault(); handleReviewSubmit(); }}
      >
        <div className="space-y-4">
          <Field label="Progress Notes" required error={reviewErrors.reviewNote || undefined} hint={`${reviewNote.length}/1000`}>
            <Textarea
              maxLength={1000}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              rows={3}
              placeholder="Enter review notes..."
            />
          </Field>
          <Field label="Recommendation">
            <Select value={reviewRecommendation} onValueChange={setReviewRecommendation}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Continue">Continue</SelectItem>
                <SelectItem value="Extend">Extend</SelectItem>
                <SelectItem value="Complete">Complete Successfully</SelectItem>
                <SelectItem value="Terminate">Terminate</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </SideFormSheet>
    </div>
  );
};

export default PIPTrackingPage;
