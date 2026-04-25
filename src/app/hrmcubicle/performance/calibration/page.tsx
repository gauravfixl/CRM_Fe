"use client"

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Search,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  RotateCcw,
  History,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { isNumberInRange, maxLength, required, type ValidationErrors } from "@/shared/utils/validators";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useToast } from "@/shared/components/ui/use-toast";
import { Input } from "@/shared/components/ui/input";
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
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import { cn } from "@/lib/utils";

interface CalibrationEmployee {
  id: string;
  name: string;
  department: string;
  managerRating: number;
  selfRating: number;
  peerRating: number;
  finalRating: number;
  percentile: number;
  category: string;
  ratingHistory: { cycle: string; rating: number }[];
}

const CATEGORIES = [
  { label: "Needs Improvement", expected: 5, color: "bg-red-500", textColor: "text-red-700", bgLight: "bg-red-50" },
  { label: "Below Expectations", expected: 15, color: "bg-orange-500", textColor: "text-orange-700", bgLight: "bg-orange-50" },
  { label: "Meets Expectations", expected: 60, color: "bg-blue-500", textColor: "text-blue-700", bgLight: "bg-blue-50" },
  { label: "Exceeds Expectations", expected: 15, color: "bg-emerald-500", textColor: "text-emerald-700", bgLight: "bg-emerald-50" },
  { label: "Exceptional", expected: 5, color: "bg-purple-500", textColor: "text-purple-700", bgLight: "bg-purple-50" },
];

const DEPARTMENTS = ["Engineering", "Marketing", "Sales", "HR", "Finance"];

const mockEmployees: CalibrationEmployee[] = [
  { id: "E001", name: "Aarav Sharma", department: "Engineering", managerRating: 4.5, selfRating: 4.2, peerRating: 4.0, finalRating: 4.3, percentile: 88, category: "Exceeds Expectations", ratingHistory: [{ cycle: "H1 2025", rating: 4.0 }, { cycle: "H2 2025", rating: 4.3 }] },
  { id: "E002", name: "Priya Patel", department: "Engineering", managerRating: 5.0, selfRating: 4.8, peerRating: 4.9, finalRating: 4.9, percentile: 97, category: "Exceptional", ratingHistory: [{ cycle: "H1 2025", rating: 4.7 }, { cycle: "H2 2025", rating: 4.9 }] },
  { id: "E003", name: "Rahul Verma", department: "Marketing", managerRating: 3.5, selfRating: 3.8, peerRating: 3.2, finalRating: 3.5, percentile: 55, category: "Meets Expectations", ratingHistory: [{ cycle: "H1 2025", rating: 3.3 }, { cycle: "H2 2025", rating: 3.5 }] },
  { id: "E004", name: "Sneha Gupta", department: "Sales", managerRating: 2.8, selfRating: 3.2, peerRating: 2.5, finalRating: 2.8, percentile: 22, category: "Below Expectations", ratingHistory: [{ cycle: "H1 2025", rating: 3.0 }, { cycle: "H2 2025", rating: 2.8 }] },
  { id: "E005", name: "Vikram Singh", department: "HR", managerRating: 3.2, selfRating: 3.5, peerRating: 3.0, finalRating: 3.2, percentile: 42, category: "Meets Expectations", ratingHistory: [{ cycle: "H1 2025", rating: 3.1 }, { cycle: "H2 2025", rating: 3.2 }] },
  { id: "E006", name: "Ananya Reddy", department: "Finance", managerRating: 4.2, selfRating: 4.0, peerRating: 4.3, finalRating: 4.2, percentile: 82, category: "Exceeds Expectations", ratingHistory: [{ cycle: "H1 2025", rating: 3.8 }, { cycle: "H2 2025", rating: 4.2 }] },
  { id: "E007", name: "Karan Mehta", department: "Engineering", managerRating: 1.8, selfRating: 2.5, peerRating: 2.0, finalRating: 2.0, percentile: 8, category: "Needs Improvement", ratingHistory: [{ cycle: "H1 2025", rating: 2.2 }, { cycle: "H2 2025", rating: 2.0 }] },
  { id: "E008", name: "Deepika Nair", department: "Marketing", managerRating: 3.6, selfRating: 3.4, peerRating: 3.5, finalRating: 3.5, percentile: 58, category: "Meets Expectations", ratingHistory: [{ cycle: "H1 2025", rating: 3.4 }, { cycle: "H2 2025", rating: 3.5 }] },
  { id: "E009", name: "Arjun Das", department: "Sales", managerRating: 3.8, selfRating: 3.6, peerRating: 3.9, finalRating: 3.8, percentile: 65, category: "Meets Expectations", ratingHistory: [{ cycle: "H1 2025", rating: 3.5 }, { cycle: "H2 2025", rating: 3.8 }] },
  { id: "E010", name: "Meera Iyer", department: "Engineering", managerRating: 4.8, selfRating: 4.5, peerRating: 4.7, finalRating: 4.7, percentile: 95, category: "Exceptional", ratingHistory: [{ cycle: "H1 2025", rating: 4.5 }, { cycle: "H2 2025", rating: 4.7 }] },
  { id: "E011", name: "Siddharth Joshi", department: "Finance", managerRating: 3.4, selfRating: 3.6, peerRating: 3.3, finalRating: 3.4, percentile: 50, category: "Meets Expectations", ratingHistory: [{ cycle: "H1 2025", rating: 3.2 }, { cycle: "H2 2025", rating: 3.4 }] },
  { id: "E012", name: "Ritu Agarwal", department: "HR", managerRating: 2.5, selfRating: 3.0, peerRating: 2.3, finalRating: 2.5, percentile: 18, category: "Below Expectations", ratingHistory: [{ cycle: "H1 2025", rating: 2.8 }, { cycle: "H2 2025", rating: 2.5 }] },
];

const categoryFromRating = (r: number) => {
  if (r < 2) return "Needs Improvement";
  if (r < 3) return "Below Expectations";
  if (r < 4) return "Meets Expectations";
  if (r < 4.5) return "Exceeds Expectations";
  return "Exceptional";
};

const emptyEmployee: Omit<CalibrationEmployee, "id"> = {
  name: "",
  department: "Engineering",
  managerRating: 3,
  selfRating: 3,
  peerRating: 3,
  finalRating: 3,
  percentile: 50,
  category: "Meets Expectations",
  ratingHistory: [],
};

const BellCurveCalibrationPage = () => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<CalibrationEmployee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [forceDistribution, setForceDistribution] = useState(false);
  const [historyDialog, setHistoryDialog] = useState<CalibrationEmployee | null>(null);
  const [editDialog, setEditDialog] = useState<CalibrationEmployee | null>(null);
  const [addDialog, setAddDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<CalibrationEmployee | null>(null);
  const [formData, setFormData] = useState<Omit<CalibrationEmployee, "id">>(emptyEmployee);
  const [activeDeptTab, setActiveDeptTab] = useState("all");
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});

  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      const matchSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTab = activeDeptTab === "all" || e.department.toLowerCase() === activeDeptTab;
      return matchSearch && matchTab;
    });
  }, [employees, searchTerm, activeDeptTab]);

  const distribution = useMemo(() => {
    const total = filteredEmployees.length;
    return CATEGORIES.map((cat) => {
      const count = filteredEmployees.filter((e) => e.category === cat.label).length;
      return { ...cat, actual: total > 0 ? Math.round((count / total) * 100) : 0, count };
    });
  }, [filteredEmployees]);

  const hasDistributionMismatch = distribution.some((d) => Math.abs(d.actual - d.expected) > 5);

  const moveCategory = (empId: string, direction: "up" | "down") => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id !== empId) return e;
        const currentIdx = CATEGORIES.findIndex((c) => c.label === e.category);
        const newIdx = direction === "up" ? Math.min(currentIdx + 1, CATEGORIES.length - 1) : Math.max(currentIdx - 1, 0);
        return { ...e, category: CATEGORIES[newIdx].label };
      })
    );
    toast({ title: "Category Updated", description: `Employee moved ${direction}.` });
  };

  const handleNormalize = () => {
    // Re-bucket employees by their current final rating to enforce consistency
    const normalized = employees.map((e) => ({
      ...e,
      category: categoryFromRating(e.finalRating),
    }));
    // Nudge to target distribution by shuffling borderline cases
    const total = normalized.length;
    const targetCount = CATEGORIES.reduce<Record<string, number>>((acc, c) => {
      acc[c.label] = Math.round((c.expected / 100) * total);
      return acc;
    }, {});
    const byCat: Record<string, CalibrationEmployee[]> = {};
    normalized.forEach((e) => {
      (byCat[e.category] ||= []).push(e);
    });
    // Sort each bucket by finalRating desc to find redistribution candidates
    Object.keys(byCat).forEach((k) => byCat[k].sort((a, b) => b.finalRating - a.finalRating));
    const orderedCats = CATEGORIES.map((c) => c.label);
    for (let i = 0; i < orderedCats.length; i++) {
      const cat = orderedCats[i];
      const overflow = (byCat[cat] || []).length - (targetCount[cat] || 0);
      if (overflow > 0 && i < orderedCats.length - 1) {
        const moved = byCat[cat].splice(byCat[cat].length - overflow, overflow);
        moved.forEach((m) => (m.category = orderedCats[i + 1]));
        byCat[orderedCats[i + 1]] = [...(byCat[orderedCats[i + 1]] || []), ...moved];
      }
    }
    setEmployees(Object.values(byCat).flat());
    toast({ title: "Normalization Applied", description: "Ratings re-bucketed to match the target bell curve." });
  };

  const handleExport = () => {
    const rows = [
      ["ID", "Name", "Department", "Manager", "Self", "Peer", "Final", "Percentile", "Category"],
      ...filteredEmployees.map((e) => [
        e.id,
        e.name,
        e.department,
        e.managerRating.toFixed(1),
        e.selfRating.toFixed(1),
        e.peerRating.toFixed(1),
        e.finalRating.toFixed(1),
        `P${e.percentile}`,
        e.category,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `calibration_report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Report Exported", description: `${filteredEmployees.length} records exported.` });
  };

  const validateEmployee = (): ValidationErrors => {
    const e: ValidationErrors = {};
    const n = required(formData.name, "Employee name");
    if (n) e.name = n;
    else if (maxLength(formData.name, 100, "Name")) e.name = maxLength(formData.name, 100, "Name")!;
    const mr = isNumberInRange(formData.managerRating, 0, 5, "Manager rating");
    if (mr) e.managerRating = mr;
    const sr = isNumberInRange(formData.selfRating, 0, 5, "Self rating");
    if (sr) e.selfRating = sr;
    const pr = isNumberInRange(formData.peerRating, 0, 5, "Peer rating");
    if (pr) e.peerRating = pr;
    const fr = isNumberInRange(formData.finalRating, 0, 5, "Final rating");
    if (fr) e.finalRating = fr;
    const pc = isNumberInRange(formData.percentile, 0, 100, "Percentile");
    if (pc) e.percentile = pc;
    return e;
  };

  const handleSaveEmployee = (isNew: boolean) => {
    const v = validateEmployee();
    setFormErrors(v);
    if (Object.keys(v).length > 0) {
      toast({ title: "Validation failed", description: "Please correct the highlighted fields.", variant: "destructive" });
      return;
    }
    const category = categoryFromRating(formData.finalRating);
    if (isNew) {
      const id = `E${String(employees.length + 13).padStart(3, "0")}`;
      setEmployees([
        ...employees,
        { ...formData, id, category, ratingHistory: formData.ratingHistory.length ? formData.ratingHistory : [{ cycle: "H1 2025", rating: formData.finalRating }] },
      ]);
      toast({ title: "Employee Added", description: `${formData.name} joined calibration pool.` });
      setAddDialog(false);
    } else if (editDialog) {
      setEmployees(employees.map((e) => (e.id === editDialog.id ? { ...formData, id: editDialog.id, category } : e)));
      toast({ title: "Employee Updated", description: `${formData.name}'s ratings saved.` });
      setEditDialog(null);
    }
    setFormData(emptyEmployee);
    setFormErrors({});
  };

  const handleDelete = () => {
    if (!deleteDialog) return;
    setEmployees(employees.filter((e) => e.id !== deleteDialog.id));
    toast({ title: "Removed", description: `${deleteDialog.name} removed from pool.` });
    setDeleteDialog(null);
  };

  const bellCurvePoints = [5, 15, 60, 15, 5];
  const maxHeight = 140;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Bell Curve Calibration</h1>
          <p className="text-slate-500 text-sm mt-1">Calibrate performance ratings to match expected distribution</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setFormData(emptyEmployee); setFormErrors({}); setAddDialog(true); }} className="gap-2">
            <Plus className="w-4 h-4" /> Add Employee
          </Button>
          <Button variant="outline" onClick={handleNormalize} className="gap-2">
            <RotateCcw className="w-4 h-4" /> Normalize
          </Button>
          <Button onClick={handleExport} className="gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
            <Download className="w-4 h-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Bell Curve Visual */}
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Expected Bell Curve Distribution</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Force Distribution</span>
              <button
                onClick={() => setForceDistribution(!forceDistribution)}
                className={cn("relative w-11 h-6 rounded-full transition-colors", forceDistribution ? "bg-[#8B5CF6]" : "bg-slate-300")}
              >
                <span className={cn("absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow", forceDistribution && "translate-x-5")} />
              </button>
            </div>
          </div>
          {forceDistribution && hasDistributionMismatch && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              Actual distribution does not match expected. Consider normalizing ratings.
            </div>
          )}
          <div className="flex items-end justify-center gap-2 h-[180px] mb-4">
            {CATEGORIES.map((cat, i) => (
              <div key={cat.label} className="flex flex-col items-center gap-1" style={{ width: "18%" }}>
                <span className="text-xs font-medium text-slate-600">{bellCurvePoints[i]}%</span>
                <div
                  className={cn("w-full rounded-t-lg transition-all", cat.color)}
                  style={{ height: `${(bellCurvePoints[i] / 60) * maxHeight}px`, opacity: 0.8 }}
                />
                <span className="text-[10px] text-slate-500 text-center leading-tight mt-1">{cat.label}</span>
              </div>
            ))}
          </div>
          {/* Actual vs Expected */}
          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Actual vs Expected Distribution</h3>
            <div className="space-y-2">
              {distribution.map((d) => (
                <div key={d.label} className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 w-40 truncate">{d.label}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden relative">
                      <div className={cn("h-full rounded-full", d.color)} style={{ width: `${d.actual}%`, opacity: 0.7 }} />
                      <div className="absolute top-0 left-0 h-full border-r-2 border-dashed border-slate-400" style={{ left: `${d.expected}%` }} />
                    </div>
                    <span className="text-xs text-slate-500 w-20">
                      {d.actual}% <span className="text-slate-400">/ {d.expected}%</span>
                    </span>
                    <Badge variant="outline" className={cn("text-[10px]", Math.abs(d.actual - d.expected) > 5 ? "border-red-300 text-red-600" : "border-green-300 text-green-600")}>
                      {d.count} emp
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Department Tabs + Calibration Table */}
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <Tabs value={activeDeptTab} onValueChange={setActiveDeptTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-slate-100">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="engineering">Engineering</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="hr">HR</TabsTrigger>
                <TabsTrigger value="finance">Finance</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input placeholder="Search employee..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-56" />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-3 text-slate-500 font-medium">Employee</th>
                    <th className="text-left py-3 px-3 text-slate-500 font-medium">Department</th>
                    <th className="text-center py-3 px-3 text-slate-500 font-medium">Manager</th>
                    <th className="text-center py-3 px-3 text-slate-500 font-medium">Self</th>
                    <th className="text-center py-3 px-3 text-slate-500 font-medium">Peer</th>
                    <th className="text-center py-3 px-3 text-slate-500 font-medium">Final</th>
                    <th className="text-center py-3 px-3 text-slate-500 font-medium">Percentile</th>
                    <th className="text-left py-3 px-3 text-slate-500 font-medium">Category</th>
                    <th className="text-center py-3 px-3 text-slate-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => {
                    const cat = CATEGORIES.find((c) => c.label === emp.category)!;
                    return (
                      <motion.tr key={emp.id} layout className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] font-semibold text-xs">
                              {emp.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div>
                              <div className="font-medium text-slate-800">{emp.name}</div>
                              <div className="text-xs text-slate-400">{emp.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{emp.department}</td>
                        <td className="py-3 px-3 text-center font-medium text-slate-700">{emp.managerRating.toFixed(1)}</td>
                        <td className="py-3 px-3 text-center font-medium text-slate-700">{emp.selfRating.toFixed(1)}</td>
                        <td className="py-3 px-3 text-center font-medium text-slate-700">{emp.peerRating.toFixed(1)}</td>
                        <td className="py-3 px-3 text-center font-bold text-slate-800">{emp.finalRating.toFixed(1)}</td>
                        <td className="py-3 px-3 text-center">
                          <span className="text-xs font-medium text-slate-600">P{emp.percentile}</span>
                        </td>
                        <td className="py-3 px-3">
                          <Badge className={cn("text-xs", cat.bgLight, cat.textColor, "border-0")}>{emp.category}</Badge>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-center gap-1">
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => moveCategory(emp.id, "up")} title="Move Up">
                              <ChevronUp className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => moveCategory(emp.id, "down")} title="Move Down">
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setHistoryDialog(emp)} title="View History">
                              <History className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-indigo-500"
                              title="Edit"
                              onClick={() => {
                                setEditDialog(emp);
                                setFormData({
                                  name: emp.name,
                                  department: emp.department,
                                  managerRating: emp.managerRating,
                                  selfRating: emp.selfRating,
                                  peerRating: emp.peerRating,
                                  finalRating: emp.finalRating,
                                  percentile: emp.percentile,
                                  category: emp.category,
                                  ratingHistory: emp.ratingHistory,
                                });
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-rose-500"
                              title="Remove"
                              onClick={() => setDeleteDialog(emp)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredEmployees.length === 0 && (
                <div className="text-center py-12 text-slate-400">No employees found matching your criteria.</div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Rating History Dialog */}
      <Dialog open={!!historyDialog} onOpenChange={() => setHistoryDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rating History - {historyDialog?.name}</DialogTitle>
            <DialogDescription>Performance rating across review cycles</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {historyDialog?.ratingHistory.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">{h.cycle}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#8B5CF6] rounded-full" style={{ width: `${(h.rating / 5) * 100}%` }} />
                  </div>
                  <span className="text-sm font-bold text-slate-800">{h.rating.toFixed(1)}</span>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
              <span className="text-sm font-medium text-purple-700">Current</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-purple-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#8B5CF6] rounded-full" style={{ width: `${((historyDialog?.finalRating || 0) / 5) * 100}%` }} />
                </div>
                <span className="text-sm font-bold text-purple-800">{historyDialog?.finalRating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryDialog(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add / Edit Employee SideFormSheet */}
      <SideFormSheet
        open={addDialog || !!editDialog}
        onOpenChange={(open) => { if (!open) { setAddDialog(false); setEditDialog(null); setFormData(emptyEmployee); setFormErrors({}); } }}
        title={editDialog ? `Edit ${editDialog.name}` : "Add Calibration Employee"}
        description="Enter ratings; category auto-computes from final rating."
        icon={editDialog ? <Edit size={20} /> : <Plus size={20} />}
        accentColor={editDialog ? "#7c3aed" : "#4f46e5"}
        width="lg"
        submitLabel={editDialog ? "Save Changes" : "Add Employee"}
        onSubmit={(e) => { e.preventDefault(); handleSaveEmployee(!editDialog); }}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name" required error={formErrors.name || undefined}>
              <Input maxLength={100} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </Field>
            <Field label="Department">
              <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Manager Rating" error={formErrors.managerRating || undefined}>
              <Input
                type="number" step="0.1" min={0} max={5}
                value={formData.managerRating}
                onChange={(e) => setFormData({ ...formData, managerRating: Math.max(0, Math.min(5, parseFloat(e.target.value) || 0)) })}
              />
            </Field>
            <Field label="Self Rating" error={formErrors.selfRating || undefined}>
              <Input
                type="number" step="0.1" min={0} max={5}
                value={formData.selfRating}
                onChange={(e) => setFormData({ ...formData, selfRating: Math.max(0, Math.min(5, parseFloat(e.target.value) || 0)) })}
              />
            </Field>
            <Field label="Peer Rating" error={formErrors.peerRating || undefined}>
              <Input
                type="number" step="0.1" min={0} max={5}
                value={formData.peerRating}
                onChange={(e) => setFormData({ ...formData, peerRating: Math.max(0, Math.min(5, parseFloat(e.target.value) || 0)) })}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Final Rating" error={formErrors.finalRating || undefined}>
              <Input
                type="number" step="0.1" min={0} max={5}
                value={formData.finalRating}
                onChange={(e) => setFormData({ ...formData, finalRating: Math.max(0, Math.min(5, parseFloat(e.target.value) || 0)) })}
              />
            </Field>
            <Field label="Percentile" error={formErrors.percentile || undefined}>
              <Input
                type="number" min={0} max={100}
                value={formData.percentile}
                onChange={(e) => setFormData({ ...formData, percentile: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })}
              />
            </Field>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">
              Auto-bucketed category: <strong>{categoryFromRating(formData.finalRating)}</strong>
            </p>
          </div>
        </div>
      </SideFormSheet>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteDialog} onOpenChange={(open) => { if (!open) setDeleteDialog(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from calibration pool?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialog?.name} will be removed from the bell curve distribution.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-rose-600 hover:bg-rose-700 text-white" onClick={handleDelete}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BellCurveCalibrationPage;
