"use client"

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  Download,
  Settings,
  Bell,
  CalendarCheck,
  Timer,
  CalendarX,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { cn } from "@/lib/utils";

interface CompOff {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  earnedDate: string;
  reason: "Weekend Work" | "Holiday Work" | "Extra Hours";
  expiryDate: string;
  status: "Pending" | "Approved" | "Availed" | "Expired" | "Lapsed";
  availDate?: string;
}

const mockCompOffs: CompOff[] = [
  { id: "CO001", employeeName: "Aarav Sharma", employeeId: "E001", department: "Engineering", earnedDate: "2026-03-15", reason: "Weekend Work", expiryDate: "2026-06-15", status: "Approved" },
  { id: "CO002", employeeName: "Priya Patel", employeeId: "E002", department: "Engineering", earnedDate: "2026-03-22", reason: "Holiday Work", expiryDate: "2026-06-22", status: "Pending" },
  { id: "CO003", employeeName: "Rahul Verma", employeeId: "E003", department: "Marketing", earnedDate: "2026-03-08", reason: "Extra Hours", expiryDate: "2026-06-08", status: "Availed", availDate: "2026-03-25" },
  { id: "CO004", employeeName: "Sneha Gupta", employeeId: "E004", department: "Sales", earnedDate: "2026-02-14", reason: "Weekend Work", expiryDate: "2026-05-14", status: "Approved" },
  { id: "CO005", employeeName: "Vikram Singh", employeeId: "E005", department: "HR", earnedDate: "2025-12-25", reason: "Holiday Work", expiryDate: "2026-03-25", status: "Expired" },
  { id: "CO006", employeeName: "Ananya Reddy", employeeId: "E006", department: "Finance", earnedDate: "2026-03-29", reason: "Weekend Work", expiryDate: "2026-06-29", status: "Pending" },
  { id: "CO007", employeeName: "Karan Mehta", employeeId: "E007", department: "Engineering", earnedDate: "2026-01-26", reason: "Holiday Work", expiryDate: "2026-04-26", status: "Lapsed" },
  { id: "CO008", employeeName: "Deepika Nair", employeeId: "E008", department: "Marketing", earnedDate: "2026-03-30", reason: "Extra Hours", expiryDate: "2026-06-30", status: "Pending" },
  { id: "CO009", employeeName: "Arjun Das", employeeId: "E009", department: "Sales", earnedDate: "2026-03-15", reason: "Weekend Work", expiryDate: "2026-06-15", status: "Approved" },
  { id: "CO010", employeeName: "Aarav Sharma", employeeId: "E001", department: "Engineering", earnedDate: "2026-03-29", reason: "Weekend Work", expiryDate: "2026-06-29", status: "Pending" },
];

const statusConfig: Record<string, { color: string; bg: string }> = {
  Pending: { color: "text-amber-700", bg: "bg-amber-50" },
  Approved: { color: "text-blue-700", bg: "bg-blue-50" },
  Availed: { color: "text-green-700", bg: "bg-green-50" },
  Expired: { color: "text-red-700", bg: "bg-red-50" },
  Lapsed: { color: "text-slate-500", bg: "bg-slate-100" },
};

const CompOffManagementPage = () => {
  const { toast } = useToast();
  const [compOffs, setCompOffs] = useState<CompOff[]>(mockCompOffs);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [grantDialog, setGrantDialog] = useState(false);
  const [availDialog, setAvailDialog] = useState<CompOff | null>(null);
  const [rulesDialog, setRulesDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const [newGrant, setNewGrant] = useState({ employee: "", employeeId: "", workedDate: "", reason: "Weekend Work" as CompOff["reason"], expiryDate: "" });
  const [availDate, setAvailDate] = useState("");

  const [autoRules, setAutoRules] = useState({ holidayAuto: true, weekendAuto: false, extraHoursThreshold: 4 });

  const stats = useMemo(() => ({
    earned: compOffs.filter((c) => {
      const d = new Date(c.earnedDate);
      return d.getMonth() === 2 && d.getFullYear() === 2026;
    }).length,
    pending: compOffs.filter((c) => c.status === "Pending").length,
    availed: compOffs.filter((c) => c.status === "Availed").length,
    expired: compOffs.filter((c) => c.status === "Expired" || c.status === "Lapsed").length,
  }), [compOffs]);

  const filtered = useMemo(() => {
    return compOffs.filter((c) => {
      const matchSearch = c.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "All" || c.status === statusFilter;
      const matchTab = activeTab === "all" || (activeTab === "my" && c.employeeId === "E001");
      return matchSearch && matchStatus && matchTab;
    });
  }, [compOffs, searchTerm, statusFilter, activeTab]);

  const expiringCompOffs = compOffs.filter((c) => {
    if (c.status !== "Approved") return false;
    const exp = new Date(c.expiryDate);
    const now = new Date("2026-04-02");
    const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 30 && diff > 0;
  });

  const handleGrant = () => {
    if (!newGrant.employee || !newGrant.workedDate || !newGrant.expiryDate) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    const co: CompOff = {
      id: `CO${String(compOffs.length + 1).padStart(3, "0")}`,
      employeeName: newGrant.employee,
      employeeId: newGrant.employeeId || `E${String(Math.floor(Math.random() * 100)).padStart(3, "0")}`,
      department: "Engineering",
      earnedDate: newGrant.workedDate,
      reason: newGrant.reason,
      expiryDate: newGrant.expiryDate,
      status: "Pending",
    };
    setCompOffs([co, ...compOffs]);
    setGrantDialog(false);
    setNewGrant({ employee: "", employeeId: "", workedDate: "", reason: "Weekend Work", expiryDate: "" });
    toast({ title: "Comp-Off Granted", description: `Comp-off granted for ${co.employeeName}.` });
  };

  const handleApprove = (id: string) => {
    setCompOffs((prev) => prev.map((c) => (c.id === id ? { ...c, status: "Approved" as const } : c)));
    toast({ title: "Approved", description: "Comp-off has been approved." });
  };

  const handleReject = (id: string) => {
    setCompOffs((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Rejected", description: "Comp-off request has been rejected." });
  };

  const handleAvail = () => {
    if (!availDialog || !availDate) return;
    setCompOffs((prev) => prev.map((c) => (c.id === availDialog.id ? { ...c, status: "Availed" as const, availDate } : c)));
    setAvailDialog(null);
    setAvailDate("");
    toast({ title: "Comp-Off Availed", description: "Comp-off has been marked as availed." });
  };

  const handleExport = () => {
    toast({ title: "Export Started", description: "Comp-off report is being generated." });
  };

  const statCards = [
    { label: "Earned This Month", value: stats.earned, icon: Gift, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Pending Approval", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Availed", value: stats.availed, icon: CalendarCheck, color: "text-green-600", bg: "bg-green-50" },
    { label: "Expired / Lapsed", value: stats.expired, icon: CalendarX, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Comp-Off Management</h1>
          <p className="text-slate-500 text-sm mt-1">Compensatory off tracking and management</p>
        </div>
        <div className="flex gap-2">
          {expiringCompOffs.length > 0 && (
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 gap-1"><Bell className="w-3 h-3" /> {expiringCompOffs.length} expiring soon</Badge>
          )}
          <Button variant="outline" onClick={() => setRulesDialog(true)} className="gap-2"><Settings className="w-4 h-4" /> Auto Rules</Button>
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="w-4 h-4" /> Export</Button>
          <Button onClick={() => setGrantDialog(true)} className="gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"><Plus className="w-4 h-4" /> Grant Comp-Off</Button>
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100">
          <TabsTrigger value="all">All Comp-Offs</TabsTrigger>
          <TabsTrigger value="my">My Comp-Offs</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4 space-y-4">
          {/* Filters */}
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Search employee..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Availed">Availed</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Lapsed">Lapsed</SelectItem>
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
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Earned Date</th>
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Reason</th>
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Expiry Date</th>
                      <th className="text-center py-3 px-3 text-slate-500 font-medium">Status</th>
                      <th className="text-center py-3 px-3 text-slate-500 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((co) => {
                      const sc = statusConfig[co.status];
                      const isExpiringSoon = co.status === "Approved" && (() => {
                        const diff = (new Date(co.expiryDate).getTime() - new Date("2026-04-02").getTime()) / (1000 * 60 * 60 * 24);
                        return diff <= 30 && diff > 0;
                      })();
                      return (
                        <tr key={co.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                          <td className="py-3 px-3">
                            <div className="font-medium text-slate-800">{co.employeeName}</div>
                            <div className="text-xs text-slate-400">{co.employeeId}</div>
                          </td>
                          <td className="py-3 px-3 text-slate-600">{co.department}</td>
                          <td className="py-3 px-3 text-slate-600">{co.earnedDate}</td>
                          <td className="py-3 px-3">
                            <Badge variant="outline" className="text-xs">{co.reason}</Badge>
                          </td>
                          <td className="py-3 px-3">
                            <span className={cn("text-slate-600", isExpiringSoon && "text-amber-600 font-medium")}>{co.expiryDate}</span>
                            {isExpiringSoon && <AlertTriangle className="w-3 h-3 text-amber-500 inline ml-1" />}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <Badge className={cn("text-xs border-0", sc.bg, sc.color)}>{co.status}</Badge>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {co.status === "Pending" && (
                                <>
                                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-green-600" onClick={() => handleApprove(co.id)}><CheckCircle2 className="w-4 h-4" /></Button>
                                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-600" onClick={() => handleReject(co.id)}><XCircle className="w-4 h-4" /></Button>
                                </>
                              )}
                              {co.status === "Approved" && (
                                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setAvailDialog(co); setAvailDate(""); }}>Avail</Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="text-center py-12 text-slate-400">No comp-off records found.</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Expiry Reminders */}
          {expiringCompOffs.length > 0 && (
            <Card className="rounded-2xl border border-amber-200 bg-amber-50/50 shadow-sm">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2"><Bell className="w-4 h-4" /> Expiry Reminders</h3>
                <div className="space-y-2">
                  {expiringCompOffs.map((co) => (
                    <div key={co.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100">
                      <div>
                        <span className="text-sm font-medium text-slate-700">{co.employeeName}</span>
                        <span className="text-xs text-slate-400 ml-2">({co.reason})</span>
                      </div>
                      <div className="text-xs text-amber-700">Expires: {co.expiryDate}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Grant Dialog */}
      <Dialog open={grantDialog} onOpenChange={setGrantDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Grant Comp-Off</DialogTitle>
            <DialogDescription>Grant compensatory off to an employee</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Employee Name *</Label><Input value={newGrant.employee} onChange={(e) => setNewGrant({ ...newGrant, employee: e.target.value })} /></div>
            <div><Label>Worked Date *</Label><Input type="date" value={newGrant.workedDate} onChange={(e) => setNewGrant({ ...newGrant, workedDate: e.target.value })} /></div>
            <div>
              <Label>Reason</Label>
              <Select value={newGrant.reason} onValueChange={(v) => setNewGrant({ ...newGrant, reason: v as CompOff["reason"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekend Work">Weekend Work</SelectItem>
                  <SelectItem value="Holiday Work">Holiday Work</SelectItem>
                  <SelectItem value="Extra Hours">Extra Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Expiry Date *</Label><Input type="date" value={newGrant.expiryDate} onChange={(e) => setNewGrant({ ...newGrant, expiryDate: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGrantDialog(false)}>Cancel</Button>
            <Button onClick={handleGrant} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">Grant</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Avail Dialog */}
      <Dialog open={!!availDialog} onOpenChange={() => setAvailDialog(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Avail Comp-Off</DialogTitle>
            <DialogDescription>Select date to avail comp-off for {availDialog?.employeeName}</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label>Avail Date *</Label>
            <Input type="date" value={availDate} onChange={(e) => setAvailDate(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAvailDialog(null)}>Cancel</Button>
            <Button onClick={handleAvail} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">Avail</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auto Rules Dialog */}
      <Dialog open={rulesDialog} onOpenChange={setRulesDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Auto-Grant Rules</DialogTitle>
            <DialogDescription>Configure automatic comp-off granting rules</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-slate-700">Holiday Work Auto Comp-Off</div>
                <div className="text-xs text-slate-400">Automatically grant comp-off when employee works on a holiday</div>
              </div>
              <button
                onClick={() => setAutoRules({ ...autoRules, holidayAuto: !autoRules.holidayAuto })}
                className={cn("relative w-11 h-6 rounded-full transition-colors", autoRules.holidayAuto ? "bg-[#8B5CF6]" : "bg-slate-300")}
              >
                <span className={cn("absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow", autoRules.holidayAuto && "translate-x-5")} />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-slate-700">Weekend Work Auto Comp-Off</div>
                <div className="text-xs text-slate-400">Automatically grant comp-off for weekend attendance</div>
              </div>
              <button
                onClick={() => setAutoRules({ ...autoRules, weekendAuto: !autoRules.weekendAuto })}
                className={cn("relative w-11 h-6 rounded-full transition-colors", autoRules.weekendAuto ? "bg-[#8B5CF6]" : "bg-slate-300")}
              >
                <span className={cn("absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow", autoRules.weekendAuto && "translate-x-5")} />
              </button>
            </div>
            <div>
              <Label>Extra Hours Threshold (hours)</Label>
              <Select value={String(autoRules.extraHoursThreshold)} onValueChange={(v) => setAutoRules({ ...autoRules, extraHoursThreshold: parseInt(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="8">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRulesDialog(false)}>Cancel</Button>
            <Button onClick={() => { setRulesDialog(false); toast({ title: "Rules Saved" }); }} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">Save Rules</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompOffManagementPage;
