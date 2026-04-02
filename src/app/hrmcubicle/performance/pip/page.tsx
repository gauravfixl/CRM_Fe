"use client"

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Download,
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Calendar,
  User,
  FileText,
  Bell,
  TrendingUp,
  Target,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useToast } from "@/shared/components/ui/use-toast";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/lib/utils";

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

const PIPTrackingPage = () => {
  const { toast } = useToast();
  const [pips, setPips] = useState<PIPRecord[]>(mockPIPs);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedPip, setExpandedPip] = useState<string | null>(null);
  const [newPipOpen, setNewPipOpen] = useState(false);
  const [reviewDialog, setReviewDialog] = useState<PIPRecord | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [reviewRecommendation, setReviewRecommendation] = useState("Continue");

  // New PIP form state
  const [newPip, setNewPip] = useState({ employee: "", department: "", startDate: "", endDate: "", goals: "", reviewFrequency: "Bi-weekly", manager: "", areas: [] as string[] });

  const improvementOptions = ["Code Quality", "Communication", "Deadlines", "Attendance", "Performance", "Team Collaboration", "Documentation", "Process Compliance", "Sales Targets", "Client Follow-up"];

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

  const handleCreatePip = () => {
    if (!newPip.employee || !newPip.startDate || !newPip.endDate) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    const pip: PIPRecord = {
      id: `PIP${String(pips.length + 1).padStart(3, "0")}`,
      employeeName: newPip.employee, employeeId: `E${String(Math.floor(Math.random() * 100)).padStart(3, "0")}`,
      department: newPip.department, manager: newPip.manager,
      startDate: newPip.startDate, endDate: newPip.endDate,
      status: "Active", progress: 0,
      improvementAreas: newPip.areas, goals: newPip.goals,
      reviewFrequency: newPip.reviewFrequency,
      milestones: [], reviewNotes: [],
    };
    setPips([pip, ...pips]);
    setNewPipOpen(false);
    setNewPip({ employee: "", department: "", startDate: "", endDate: "", goals: "", reviewFrequency: "Bi-weekly", manager: "", areas: [] });
    toast({ title: "PIP Created", description: `PIP created for ${pip.employeeName}.` });
  };

  const handleReviewSubmit = () => {
    if (!reviewDialog || !reviewNote) return;
    setPips((prev) =>
      prev.map((p) => {
        if (p.id !== reviewDialog.id) return p;
        const newNotes = [...p.reviewNotes, { date: new Date().toISOString().slice(0, 10), note: reviewNote, recommendation: reviewRecommendation }];
        let newStatus = p.status;
        let newProgress = p.progress;
        if (reviewRecommendation === "Complete") { newStatus = "Completed"; newProgress = 100; }
        if (reviewRecommendation === "Terminate") { newStatus = "Terminated"; }
        if (reviewRecommendation === "Extend") { newStatus = "Extended"; }
        return { ...p, reviewNotes: newNotes, status: newStatus as PIPRecord["status"], progress: newProgress };
      })
    );
    setReviewDialog(null);
    setReviewNote("");
    setReviewRecommendation("Continue");
    toast({ title: "Review Submitted", description: "PIP review has been recorded." });
  };

  const handleExport = (pipId: string) => {
    toast({ title: "Export Started", description: `PIP history for ${pipId} is being exported.` });
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
        <div className="flex gap-2">
          {upcomingReviews > 0 && (
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 gap-1"><Bell className="w-3 h-3" /> {upcomingReviews} reviews due</Badge>
          )}
          <Button onClick={() => setNewPipOpen(true)} className="gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
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
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleExport(pip.id)}>
                              <Download className="w-3.5 h-3.5" />
                            </Button>
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

      {/* New PIP Dialog */}
      <Dialog open={newPipOpen} onOpenChange={setNewPipOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New PIP</DialogTitle>
            <DialogDescription>Set up a Performance Improvement Plan for an employee</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Employee Name *</Label><Input value={newPip.employee} onChange={(e) => setNewPip({ ...newPip, employee: e.target.value })} /></div>
              <div><Label>Department</Label><Input value={newPip.department} onChange={(e) => setNewPip({ ...newPip, department: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Start Date *</Label><Input type="date" value={newPip.startDate} onChange={(e) => setNewPip({ ...newPip, startDate: e.target.value })} /></div>
              <div><Label>End Date *</Label><Input type="date" value={newPip.endDate} onChange={(e) => setNewPip({ ...newPip, endDate: e.target.value })} /></div>
            </div>
            <div><Label>Manager</Label><Input value={newPip.manager} onChange={(e) => setNewPip({ ...newPip, manager: e.target.value })} /></div>
            <div>
              <Label>Review Frequency</Label>
              <Select value={newPip.reviewFrequency} onValueChange={(v) => setNewPip({ ...newPip, reviewFrequency: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Improvement Areas</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {improvementOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setNewPip({ ...newPip, areas: newPip.areas.includes(opt) ? newPip.areas.filter((a) => a !== opt) : [...newPip.areas, opt] })}
                    className={cn("px-3 py-1 text-xs rounded-full border transition-colors", newPip.areas.includes(opt) ? "bg-[#8B5CF6] text-white border-[#8B5CF6]" : "bg-white text-slate-600 border-slate-200 hover:border-[#8B5CF6]")}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div><Label>Goals</Label><Textarea value={newPip.goals} onChange={(e) => setNewPip({ ...newPip, goals: e.target.value })} rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewPipOpen(false)}>Cancel</Button>
            <Button onClick={handleCreatePip} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">Create PIP</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={!!reviewDialog} onOpenChange={() => setReviewDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>PIP Review - {reviewDialog?.employeeName}</DialogTitle>
            <DialogDescription>Submit a progress review for this PIP</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Progress Notes *</Label>
              <Textarea value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} rows={3} placeholder="Enter review notes..." />
            </div>
            <div>
              <Label>Recommendation</Label>
              <Select value={reviewRecommendation} onValueChange={setReviewRecommendation}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Continue">Continue</SelectItem>
                  <SelectItem value="Extend">Extend</SelectItem>
                  <SelectItem value="Complete">Complete Successfully</SelectItem>
                  <SelectItem value="Terminate">Terminate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialog(null)}>Cancel</Button>
            <Button onClick={handleReviewSubmit} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PIPTrackingPage;
