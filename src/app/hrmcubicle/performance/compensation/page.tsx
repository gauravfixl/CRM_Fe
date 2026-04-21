"use client"

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Search,
  TrendingUp,
  Users,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  ArrowUpRight,
  Star,
  XCircle,
  Edit,
  Plus,
  Trash2,
  MoreVertical,
  AlertCircle,
} from "lucide-react";
import {
  firstError,
  isNumberInRange,
  maxLength,
  required,
  type ValidationErrors,
} from "@/shared/utils/validators";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useToast } from "@/shared/components/ui/use-toast";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { cn } from "@/lib/utils";

interface CompReview {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  role: string;
  currentCTC: number;
  rating: number;
  recommendedIncrement: number;
  proposedCTC: number;
  status: "Pending" | "Manager Approved" | "HR Approved" | "Final Approved" | "Rejected";
}

const incrementRanges: Record<number, { min: number; max: number; label: string }> = {
  5: { min: 15, max: 20, label: "15-20%" },
  4: { min: 10, max: 15, label: "10-15%" },
  3: { min: 5, max: 10, label: "5-10%" },
  2: { min: 0, max: 5, label: "0-5%" },
  1: { min: 0, max: 0, label: "0%" },
};

const mockReviews: CompReview[] = [
  { id: "CR001", employeeName: "Aarav Sharma", employeeId: "E001", department: "Engineering", role: "Sr. Engineer", currentCTC: 1800000, rating: 4, recommendedIncrement: 12, proposedCTC: 2016000, status: "HR Approved" },
  { id: "CR002", employeeName: "Priya Patel", employeeId: "E002", department: "Engineering", role: "Tech Lead", currentCTC: 2400000, rating: 5, recommendedIncrement: 18, proposedCTC: 2832000, status: "Final Approved" },
  { id: "CR003", employeeName: "Rahul Verma", employeeId: "E003", department: "Marketing", role: "Marketing Exec", currentCTC: 1200000, rating: 3, recommendedIncrement: 7, proposedCTC: 1284000, status: "Manager Approved" },
  { id: "CR004", employeeName: "Sneha Gupta", employeeId: "E004", department: "Sales", role: "Sales Rep", currentCTC: 1000000, rating: 2, recommendedIncrement: 3, proposedCTC: 1030000, status: "Pending" },
  { id: "CR005", employeeName: "Vikram Singh", employeeId: "E005", department: "HR", role: "HR Manager", currentCTC: 1600000, rating: 3, recommendedIncrement: 8, proposedCTC: 1728000, status: "Manager Approved" },
  { id: "CR006", employeeName: "Ananya Reddy", employeeId: "E006", department: "Finance", role: "Sr. Accountant", currentCTC: 1500000, rating: 4, recommendedIncrement: 13, proposedCTC: 1695000, status: "HR Approved" },
  { id: "CR007", employeeName: "Karan Mehta", employeeId: "E007", department: "Engineering", role: "Jr. Engineer", currentCTC: 800000, rating: 1, recommendedIncrement: 0, proposedCTC: 800000, status: "Rejected" },
  { id: "CR008", employeeName: "Deepika Nair", employeeId: "E008", department: "Marketing", role: "Content Lead", currentCTC: 1400000, rating: 3, recommendedIncrement: 8, proposedCTC: 1512000, status: "Pending" },
  { id: "CR009", employeeName: "Arjun Das", employeeId: "E009", department: "Sales", role: "Sales Manager", currentCTC: 2000000, rating: 4, recommendedIncrement: 11, proposedCTC: 2220000, status: "Final Approved" },
  { id: "CR010", employeeName: "Meera Iyer", employeeId: "E010", department: "Engineering", role: "Staff Engineer", currentCTC: 3000000, rating: 5, recommendedIncrement: 16, proposedCTC: 3480000, status: "HR Approved" },
];

const departmentBudgets = [
  { dept: "Engineering", allocated: 2500000, utilized: 2128000 },
  { dept: "Marketing", allocated: 800000, utilized: 596000 },
  { dept: "Sales", allocated: 1000000, utilized: 850000 },
  { dept: "HR", allocated: 500000, utilized: 328000 },
  { dept: "Finance", allocated: 600000, utilized: 495000 },
];

const statusConfig: Record<string, { color: string; bg: string }> = {
  Pending: { color: "text-slate-600", bg: "bg-slate-100" },
  "Manager Approved": { color: "text-blue-700", bg: "bg-blue-50" },
  "HR Approved": { color: "text-purple-700", bg: "bg-purple-50" },
  "Final Approved": { color: "text-green-700", bg: "bg-green-50" },
  Rejected: { color: "text-red-700", bg: "bg-red-50" },
};

const emptyForm: Omit<CompReview, "id"> = {
  employeeName: "",
  employeeId: "",
  department: "Engineering",
  role: "",
  currentCTC: 1000000,
  rating: 3,
  recommendedIncrement: 7,
  proposedCTC: 1070000,
  status: "Pending",
};

const CompensationReviewPage = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<CompReview[]>(mockReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [comparisonDialog, setComparisonDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("review");

  const [formDialog, setFormDialog] = useState<"create" | "edit" | null>(null);
  const [formData, setFormData] = useState<Omit<CompReview, "id">>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<CompReview | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CompReview | null>(null);
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      const matchSearch = r.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = deptFilter === "All" || r.department === deptFilter;
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      return matchSearch && matchDept && matchStatus;
    });
  }, [reviews, searchTerm, deptFilter, statusFilter]);

  const stats = useMemo(() => {
    const totalBudget = departmentBudgets.reduce((s, d) => s + d.allocated, 0);
    const usedBudget = departmentBudgets.reduce((s, d) => s + d.utilized, 0);
    const avgIncrement = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.recommendedIncrement, 0) / reviews.length).toFixed(1) : "0";
    const reviewed = reviews.filter((r) => r.status !== "Pending").length;
    return { totalBudget, usedBudget, avgIncrement, reviewed, total: reviews.length, budgetPercent: Math.round((usedBudget / totalBudget) * 100) };
  }, [reviews]);

  const formatCurrency = (n: number) => "₹" + (n / 100000).toFixed(1) + "L";

  const handleApprove = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const nextStatus: Record<string, CompReview["status"]> = {
          Pending: "Manager Approved",
          "Manager Approved": "HR Approved",
          "HR Approved": "Final Approved",
        };
        return { ...r, status: nextStatus[r.status] || r.status };
      })
    );
    toast({ title: "Approved", description: "Compensation review advanced to next stage." });
  };

  const handleExport = () => {
    const rows = [["ID", "Employee", "Role", "Department", "Current CTC", "Rating", "Increment %", "Proposed CTC", "Status"]];
    filtered.forEach((r) => rows.push([
      r.id, r.employeeName, r.role, r.department,
      String(r.currentCTC), String(r.rating), `${r.recommendedIncrement}%`,
      String(r.proposedCTC), r.status,
    ]));
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compensation_review_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: `${filtered.length} compensation records downloaded.` });
  };

  const handleReject = () => {
    if (!rejectTarget) return;
    setReviews((prev) => prev.map((r) => (r.id === rejectTarget.id ? { ...r, status: "Rejected" } : r)));
    toast({ title: "Rejected", description: `Compensation for ${rejectTarget.employeeName} was rejected.` });
    setRejectTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    toast({ title: "Removed", description: `${deleteTarget.employeeName} removed from the review sheet.` });
    setDeleteTarget(null);
  };

  const syncProposedCTC = (ctc: number, pct: number) => Math.round(ctc * (1 + pct / 100));

  const validateForm = (): ValidationErrors => {
    const e: ValidationErrors = {};
    const n = firstError(required(formData.employeeName, "Employee name"), maxLength(formData.employeeName, 100, "Name"));
    if (n) e.employeeName = n;
    const r = firstError(required(formData.role, "Role"), maxLength(formData.role, 100, "Role"));
    if (r) e.role = r;
    const c = isNumberInRange(formData.currentCTC, 0, 1_000_000_000, "Current CTC");
    if (c) e.currentCTC = c;
    const inc = isNumberInRange(formData.recommendedIncrement, 0, 100, "Increment %");
    if (inc) e.recommendedIncrement = inc;
    const rt = isNumberInRange(formData.rating, 1, 5, "Rating");
    if (rt) e.rating = rt;
    return e;
  };

  const handleSaveForm = () => {
    const v = validateForm();
    setFormErrors(v);
    if (Object.keys(v).length > 0) {
      toast({ title: "Validation failed", description: "Please correct the highlighted fields.", variant: "destructive" });
      return;
    }
    const proposedCTC = syncProposedCTC(formData.currentCTC, formData.recommendedIncrement);
    if (formDialog === "create") {
      const id = `CR${String(reviews.length + 11).padStart(3, "0")}`;
      const employeeId = formData.employeeId || `E${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`;
      setReviews([{ ...formData, proposedCTC, id, employeeId }, ...reviews]);
      toast({ title: "Review Created", description: `New comp review for ${formData.employeeName}.` });
    } else if (formDialog === "edit" && editId) {
      setReviews((prev) => prev.map((r) => (r.id === editId ? { ...r, ...formData, proposedCTC } : r)));
      toast({ title: "Review Updated", description: `${formData.employeeName} updated.` });
    }
    setFormDialog(null);
    setEditId(null);
    setFormData(emptyForm);
    setFormErrors({});
  };

  // Comparison data: same role, different compensation
  const comparisonData = useMemo(() => {
    const roleGroups: Record<string, CompReview[]> = {};
    reviews.forEach((r) => {
      if (!roleGroups[r.role]) roleGroups[r.role] = [];
      roleGroups[r.role].push(r);
    });
    return Object.entries(roleGroups).filter(([, emps]) => emps.length > 1);
  }, [reviews]);

  const statCards = [
    { label: "Review Cycle", value: "H1 2026", sub: "In Progress", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Budget Utilized", value: `${stats.budgetPercent}%`, sub: `${formatCurrency(stats.usedBudget)} / ${formatCurrency(stats.totalBudget)}`, icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Avg Increment", value: `${stats.avgIncrement}%`, sub: "Across all ratings", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Employees Reviewed", value: `${stats.reviewed}/${stats.total}`, sub: `${stats.total - stats.reviewed} pending`, icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Compensation Review</h1>
          <p className="text-slate-500 text-sm mt-1">Performance-linked compensation management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setComparisonDialog(true)} className="gap-2"><Eye className="w-4 h-4" /> Equity Check</Button>
          <Button variant="outline" onClick={() => { setFormData(emptyForm); setFormErrors({}); setFormDialog("create"); }} className="gap-2"><Plus className="w-4 h-4" /> New Review</Button>
          <Button onClick={handleExport} className="gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"><Download className="w-4 h-4" /> Export</Button>
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
                <div className="text-[10px] text-slate-400">{s.sub}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100">
          <TabsTrigger value="review">Compensation Review</TabsTrigger>
          <TabsTrigger value="budget">Budget Allocation</TabsTrigger>
          <TabsTrigger value="engine">Increment Engine</TabsTrigger>
        </TabsList>

        <TabsContent value="review" className="space-y-4 mt-4">
          {/* Filters */}
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Search employee..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
              </div>
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Departments</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Manager Approved">Manager Approved</SelectItem>
                  <SelectItem value="HR Approved">HR Approved</SelectItem>
                  <SelectItem value="Final Approved">Final Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Employee</th>
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Department</th>
                      <th className="text-right py-3 px-3 text-slate-500 font-medium">Current CTC</th>
                      <th className="text-center py-3 px-3 text-slate-500 font-medium">Rating</th>
                      <th className="text-center py-3 px-3 text-slate-500 font-medium">Increment %</th>
                      <th className="text-right py-3 px-3 text-slate-500 font-medium">Proposed CTC</th>
                      <th className="text-center py-3 px-3 text-slate-500 font-medium">Status</th>
                      <th className="text-center py-3 px-3 text-slate-500 font-medium">Workflow</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => {
                      const sc = statusConfig[r.status];
                      const range = incrementRanges[r.rating];
                      const inRange = r.recommendedIncrement >= (range?.min || 0) && r.recommendedIncrement <= (range?.max || 0);
                      return (
                        <motion.tr key={r.id} layout className="border-b border-slate-50 hover:bg-slate-50/50">
                          <td className="py-3 px-3">
                            <div className="font-medium text-slate-800">{r.employeeName}</div>
                            <div className="text-xs text-slate-400">{r.role}</div>
                          </td>
                          <td className="py-3 px-3 text-slate-600">{r.department}</td>
                          <td className="py-3 px-3 text-right font-medium text-slate-700">{formatCurrency(r.currentCTC)}</td>
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={cn("w-3.5 h-3.5", i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={cn("font-semibold", inRange ? "text-green-600" : "text-amber-600")}>{r.recommendedIncrement}%</span>
                            {!inRange && <AlertTriangle className="w-3 h-3 text-amber-500 inline ml-1" />}
                          </td>
                          <td className="py-3 px-3 text-right font-medium text-slate-700">{formatCurrency(r.proposedCTC)}</td>
                          <td className="py-3 px-3 text-center">
                            <Badge className={cn("text-xs border-0", sc.bg, sc.color)}>{r.status}</Badge>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {r.status !== "Final Approved" && r.status !== "Rejected" && (
                                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => handleApprove(r.id)}>
                                  <CheckCircle2 className="w-3 h-3" /> Approve
                                </Button>
                              )}
                              {r.status === "Final Approved" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
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
                                      setEditId(r.id);
                                      setFormData({
                                        employeeName: r.employeeName, employeeId: r.employeeId, department: r.department,
                                        role: r.role, currentCTC: r.currentCTC, rating: r.rating,
                                        recommendedIncrement: r.recommendedIncrement, proposedCTC: r.proposedCTC, status: r.status,
                                      });
                                      setFormErrors({});
                                      setFormDialog("edit");
                                    }}
                                  >
                                    <Edit className="w-3.5 h-3.5 mr-2" /> Edit
                                  </DropdownMenuItem>
                                  {r.status !== "Rejected" && r.status !== "Final Approved" && (
                                    <DropdownMenuItem
                                      className="rounded-lg text-[11px] text-rose-600 focus:bg-rose-50"
                                      onClick={() => setRejectTarget(r)}
                                    >
                                      <XCircle className="w-3.5 h-3.5 mr-2" /> Reject
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="rounded-lg text-[11px] text-rose-600 focus:bg-rose-50"
                                    onClick={() => setDeleteTarget(r)}
                                  >
                                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="mt-4">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Department Budget Allocation</h2>
              <div className="space-y-4">
                {departmentBudgets.map((d) => {
                  const pct = Math.round((d.utilized / d.allocated) * 100);
                  const isOver = pct > 90;
                  return (
                    <div key={d.dept} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">{d.dept}</span>
                        <span className="text-xs text-slate-500">{formatCurrency(d.utilized)} / {formatCurrency(d.allocated)} ({pct}%)</span>
                      </div>
                      <div className="w-full h-6 bg-slate-100 rounded-lg overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8 }}
                          className={cn("h-full rounded-lg", isOver ? "bg-red-400" : pct > 70 ? "bg-amber-400" : "bg-[#8B5CF6]")}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-700">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Total Budget</span>
                  <span className="text-sm font-bold text-slate-800">
                    {formatCurrency(departmentBudgets.reduce((s, d) => s + d.utilized, 0))} / {formatCurrency(departmentBudgets.reduce((s, d) => s + d.allocated, 0))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engine" className="mt-4">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Increment Recommendation Engine</h2>
              <p className="text-sm text-slate-500 mb-4">Based on performance rating, the system recommends the following increment ranges:</p>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const range = incrementRanges[rating];
                  return (
                    <div key={rating} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-1 w-28">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={cn("w-4 h-4", i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
                        ))}
                      </div>
                      <div className="flex-1">
                        <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#8B5CF6] rounded-full" style={{ width: `${range.max * 5}%` }} />
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-slate-700 w-20 text-right">{range.label}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create / Edit Dialog */}
      <Dialog open={!!formDialog} onOpenChange={(open) => { if (!open) { setFormDialog(null); setEditId(null); setFormData(emptyForm); setFormErrors({}); } }}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{formDialog === "edit" ? `Edit Compensation — ${formData.employeeName}` : "New Compensation Review"}</DialogTitle>
            <DialogDescription>Create or adjust a compensation review record.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Employee Name *</Label>
                <Input
                  maxLength={100}
                  value={formData.employeeName}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  className={formErrors.employeeName ? "border-rose-400" : ""}
                />
                {formErrors.employeeName && <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {formErrors.employeeName}</p>}
              </div>
              <div><Label>Employee ID</Label><Input maxLength={50} value={formData.employeeId} placeholder="E###" onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} /></div>
              <div>
                <Label>Role *</Label>
                <Input
                  maxLength={100}
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={formErrors.role ? "border-rose-400" : ""}
                />
                {formErrors.role && <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {formErrors.role}</p>}
              </div>
              <div>
                <Label>Department</Label>
                <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Current CTC (₹) *</Label>
                <Input
                  type="number" min={0}
                  value={formData.currentCTC}
                  onChange={(e) => setFormData({ ...formData, currentCTC: Math.max(0, parseInt(e.target.value) || 0) })}
                  className={formErrors.currentCTC ? "border-rose-400" : ""}
                />
                {formErrors.currentCTC && <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {formErrors.currentCTC}</p>}
              </div>
              <div>
                <Label>Rating *</Label>
                <Select value={String(formData.rating)} onValueChange={(v) => setFormData({ ...formData, rating: parseInt(v) })}>
                  <SelectTrigger className={formErrors.rating ? "border-rose-400" : ""}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 — Exceptional</SelectItem>
                    <SelectItem value="4">4 — Exceeds</SelectItem>
                    <SelectItem value="3">3 — Meets</SelectItem>
                    <SelectItem value="2">2 — Below</SelectItem>
                    <SelectItem value="1">1 — Needs Improvement</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.rating && <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {formErrors.rating}</p>}
              </div>
              <div>
                <Label>Increment % *</Label>
                <Input
                  type="number" min={0} max={100}
                  value={formData.recommendedIncrement}
                  onChange={(e) => setFormData({ ...formData, recommendedIncrement: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })}
                  className={formErrors.recommendedIncrement ? "border-rose-400" : ""}
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Recommended for rating {formData.rating}: {incrementRanges[formData.rating]?.label}
                </p>
                {formErrors.recommendedIncrement && <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {formErrors.recommendedIncrement}</p>}
              </div>
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as CompReview["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Manager Approved">Manager Approved</SelectItem>
                    <SelectItem value="HR Approved">HR Approved</SelectItem>
                    <SelectItem value="Final Approved">Final Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-xs">
              Proposed CTC will be:{" "}
              <strong>{formatCurrency(syncProposedCTC(formData.currentCTC, formData.recommendedIncrement))}</strong>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setFormDialog(null); setEditId(null); setFormData(emptyForm); setFormErrors({}); }}>Cancel</Button>
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white" onClick={handleSaveForm}>
              {formDialog === "edit" ? "Save Changes" : "Create Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation */}
      <AlertDialog open={!!rejectTarget} onOpenChange={(open) => { if (!open) setRejectTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject compensation review?</AlertDialogTitle>
            <AlertDialogDescription>
              The proposed increment for {rejectTarget?.employeeName} will be marked as rejected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-rose-600 hover:bg-rose-700 text-white" onClick={handleReject}>
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete compensation review?</AlertDialogTitle>
            <AlertDialogDescription>
              The record for {deleteTarget?.employeeName} will be removed from the sheet.
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

      {/* Equity Comparison Dialog */}
      <Dialog open={comparisonDialog} onOpenChange={setComparisonDialog}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Internal Equity Check</DialogTitle>
            <DialogDescription>Same role, different compensation comparison</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {comparisonData.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No roles with multiple employees found.</p>}
            {comparisonData.map(([role, emps]) => (
              <div key={role} className="p-4 bg-slate-50 rounded-lg">
                <h4 className="text-sm font-semibold text-slate-700 mb-2">{role}</h4>
                <div className="space-y-2">
                  {emps.map((e) => (
                    <div key={e.id} className="flex items-center justify-between p-2 bg-white rounded border border-slate-100">
                      <span className="text-sm text-slate-700">{e.employeeName}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">Current: {formatCurrency(e.currentCTC)}</span>
                        <ArrowUpRight className="w-3 h-3 text-green-500" />
                        <span className="text-xs font-medium text-slate-700">Proposed: {formatCurrency(e.proposedCTC)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setComparisonDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompensationReviewPage;
