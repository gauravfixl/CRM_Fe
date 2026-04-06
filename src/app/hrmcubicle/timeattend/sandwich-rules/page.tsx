"use client"

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  Plus,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Calculator,
  ToggleLeft,
  ToggleRight,
  Shield,
  FileText,
  Search,
  Info,
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

interface SandwichRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  active: boolean;
  leaveTypes: string[];
}

interface SandwichApplication {
  id: string;
  employeeName: string;
  employeeId: string;
  leaveType: string;
  leaveDates: string;
  sandwichDays: number;
  totalCounted: number;
  appliedOn: string;
  isException: boolean;
}

interface SimulationResult {
  startDate: string;
  endDate: string;
  leaveDays: number;
  weekends: number;
  holidays: number;
  sandwichDays: number;
  totalCounted: number;
}

const mockRules: SandwichRule[] = [
  { id: "SR001", name: "Weekend Sandwich", condition: "Leave taken on Friday AND Monday", action: "Count Saturday & Sunday as leave", active: true, leaveTypes: ["Casual Leave", "Sick Leave"] },
  { id: "SR002", name: "Holiday Sandwich", condition: "Leave taken before AND after a public holiday", action: "Count holiday(s) as leave", active: true, leaveTypes: ["Casual Leave", "Earned Leave"] },
  { id: "SR003", name: "Extended Weekend", condition: "Leave on Thursday or Tuesday creating 4+ day gap", action: "Count intervening days as leave", active: false, leaveTypes: ["Casual Leave"] },
  { id: "SR004", name: "Consecutive Holiday Bridge", condition: "Leave bridges two holidays within 5 days", action: "Count all intervening non-working days as leave", active: true, leaveTypes: ["Casual Leave", "Sick Leave", "Earned Leave"] },
];

const mockApplications: SandwichApplication[] = [
  { id: "SA001", employeeName: "Aarav Sharma", employeeId: "E001", leaveType: "Casual Leave", leaveDates: "Fri 28 Mar - Mon 31 Mar", sandwichDays: 2, totalCounted: 4, appliedOn: "2026-03-25", isException: false },
  { id: "SA002", employeeName: "Priya Patel", employeeId: "E002", leaveType: "Sick Leave", leaveDates: "Thu 26 Mar - Mon 31 Mar", sandwichDays: 3, totalCounted: 6, appliedOn: "2026-03-24", isException: false },
  { id: "SA003", employeeName: "Rahul Verma", employeeId: "E003", leaveType: "Casual Leave", leaveDates: "Fri 14 Aug - Mon 17 Aug", sandwichDays: 2, totalCounted: 4, appliedOn: "2026-08-10", isException: true },
  { id: "SA004", employeeName: "Sneha Gupta", employeeId: "E004", leaveType: "Earned Leave", leaveDates: "Wed 14 Jan - Fri 16 Jan", sandwichDays: 1, totalCounted: 4, appliedOn: "2026-01-10", isException: false },
  { id: "SA005", employeeName: "Vikram Singh", employeeId: "E005", leaveType: "Casual Leave", leaveDates: "Fri 20 Mar - Mon 23 Mar", sandwichDays: 2, totalCounted: 4, appliedOn: "2026-03-17", isException: false },
];

const SandwichRulesPage = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<SandwichRule[]>(mockRules);
  const [applications, setApplications] = useState<SandwichApplication[]>(mockApplications);
  const [addRuleDialog, setAddRuleDialog] = useState(false);
  const [simulationOpen, setSimulationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [newRule, setNewRule] = useState({ name: "", condition: "", action: "", leaveTypes: [] as string[] });

  // Simulation state
  const [simStartDate, setSimStartDate] = useState("");
  const [simEndDate, setSimEndDate] = useState("");
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);

  const leaveTypeOptions = ["Casual Leave", "Sick Leave", "Earned Leave", "Privilege Leave", "Maternity Leave"];

  const toggleRule = (id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
    toast({ title: "Rule Updated", description: "Rule status has been toggled." });
  };

  const handleAddRule = () => {
    if (!newRule.name || !newRule.condition || !newRule.action) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    const rule: SandwichRule = {
      id: `SR${String(rules.length + 1).padStart(3, "0")}`,
      ...newRule,
      active: true,
    };
    setRules([...rules, rule]);
    setAddRuleDialog(false);
    setNewRule({ name: "", condition: "", action: "", leaveTypes: [] });
    toast({ title: "Rule Created", description: `${rule.name} has been added.` });
  };

  const handleSimulate = () => {
    if (!simStartDate || !simEndDate) {
      toast({ title: "Error", description: "Please enter both dates.", variant: "destructive" });
      return;
    }
    const start = new Date(simStartDate);
    const end = new Date(simEndDate);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    let weekends = 0;
    let current = new Date(start);
    while (current <= end) {
      if (current.getDay() === 0 || current.getDay() === 6) weekends++;
      current.setDate(current.getDate() + 1);
    }

    const leaveDays = diffDays - weekends;
    const sandwichDays = weekends;
    const anyActiveRule = rules.some((r) => r.active);

    setSimResult({
      startDate: simStartDate,
      endDate: simEndDate,
      leaveDays,
      weekends,
      holidays: 0,
      sandwichDays: anyActiveRule ? sandwichDays : 0,
      totalCounted: anyActiveRule ? diffDays : leaveDays,
    });
  };

  const handleGrantException = (id: string) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, isException: true } : a)));
    toast({ title: "Exception Granted", description: "Sandwich rule exception has been approved." });
  };

  const filteredApplications = applications.filter((a) =>
    a.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sandwich Leave Rules</h1>
          <p className="text-slate-500 text-sm mt-1">Configure and manage sandwich leave policies</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSimulationOpen(true)} className="gap-2"><Calculator className="w-4 h-4" /> Simulate</Button>
          <Button onClick={() => setAddRuleDialog(true)} className="gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"><Plus className="w-4 h-4" /> Add Rule</Button>
        </div>
      </div>

      {/* Rule Explanation */}
      <Card className="rounded-2xl border border-blue-200 bg-blue-50/50 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-800 mb-2">How Sandwich Leave Works</h3>
              <p className="text-xs text-blue-700 mb-3">
                When an employee takes leave on both sides of a weekend or holiday, the intervening non-working days are also counted as leave.
              </p>
              {/* Visual Diagram */}
              <div className="flex items-center gap-1 bg-white p-3 rounded-lg border border-blue-100">
                {["Thu", "Fri", "Sat", "Sun", "Mon", "Tue"].map((day, i) => {
                  const isLeave = i === 1 || i === 4;
                  const isSandwich = i === 2 || i === 3;
                  const isNormal = i === 0 || i === 5;
                  return (
                    <div key={day} className="flex-1 text-center">
                      <div className="text-[10px] text-slate-400 mb-1">{day}</div>
                      <div className={cn(
                        "h-8 rounded flex items-center justify-center text-xs font-medium",
                        isLeave ? "bg-red-100 text-red-700 border border-red-200" :
                        isSandwich ? "bg-amber-100 text-amber-700 border border-amber-200 border-dashed" :
                        "bg-green-50 text-green-600 border border-green-200"
                      )}>
                        {isLeave ? "Leave" : isSandwich ? "Counted" : "Work"}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-blue-600 mt-2">
                Example: Leave on Friday + Monday = 4 days counted (Fri + Sat + Sun + Mon)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Rules */}
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Current Rules</h2>
          <div className="space-y-3">
            {rules.map((rule) => (
              <div key={rule.id} className={cn("p-4 rounded-xl border transition-all", rule.active ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-60")}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-slate-800">{rule.name}</h3>
                      <Badge className={cn("text-[10px] border-0", rule.active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500")}>
                        {rule.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-500 mb-1"><span className="font-medium text-slate-600">Condition:</span> {rule.condition}</div>
                    <div className="text-xs text-slate-500 mb-2"><span className="font-medium text-slate-600">Action:</span> {rule.action}</div>
                    <div className="flex flex-wrap gap-1">
                      {rule.leaveTypes.map((lt) => (
                        <Badge key={lt} variant="outline" className="text-[10px]">{lt}</Badge>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => toggleRule(rule.id)} className="flex-shrink-0 ml-4">
                    {rule.active ? (
                      <ToggleRight className="w-8 h-8 text-[#8B5CF6]" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-300" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Recent Sandwich Rule Applications</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-56" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-3 text-slate-500 font-medium">Employee</th>
                  <th className="text-left py-3 px-3 text-slate-500 font-medium">Leave Type</th>
                  <th className="text-left py-3 px-3 text-slate-500 font-medium">Leave Dates</th>
                  <th className="text-center py-3 px-3 text-slate-500 font-medium">Sandwich Days</th>
                  <th className="text-center py-3 px-3 text-slate-500 font-medium">Total Counted</th>
                  <th className="text-center py-3 px-3 text-slate-500 font-medium">Exception</th>
                  <th className="text-center py-3 px-3 text-slate-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{app.employeeName}</div>
                      <div className="text-xs text-slate-400">{app.employeeId}</div>
                    </td>
                    <td className="py-3 px-3"><Badge variant="outline" className="text-xs">{app.leaveType}</Badge></td>
                    <td className="py-3 px-3 text-slate-600 text-xs">{app.leaveDates}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-amber-600 font-medium">+{app.sandwichDays}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-bold text-slate-800">{app.totalCounted} days</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {app.isException ? (
                        <Badge className="bg-purple-50 text-purple-700 border-0 text-xs">Exception</Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-500 border-0 text-xs">Standard</Badge>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {!app.isException && (
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleGrantException(app.id)}>
                          <Shield className="w-3 h-3 mr-1" /> Grant Exception
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Rule Dialog */}
      <Dialog open={addRuleDialog} onOpenChange={setAddRuleDialog}>
        <DialogContent className="sm:max-w-md border-2 border-slate-200">
          <DialogHeader>
            <DialogTitle>Configure Sandwich Rule</DialogTitle>
            <DialogDescription>Define when intervening days should be counted as leave</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Rule Name *</Label><Input value={newRule.name} onChange={(e) => setNewRule({ ...newRule, name: e.target.value })} /></div>
            <div><Label>Condition *</Label><Textarea value={newRule.condition} onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })} rows={2} placeholder="e.g., Leave taken before AND after weekend" /></div>
            <div><Label>Action *</Label><Textarea value={newRule.action} onChange={(e) => setNewRule({ ...newRule, action: e.target.value })} rows={2} placeholder="e.g., Count weekend days as leave" /></div>
            <div>
              <Label>Applicable Leave Types</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {leaveTypeOptions.map((lt) => (
                  <button
                    key={lt}
                    onClick={() => setNewRule({ ...newRule, leaveTypes: newRule.leaveTypes.includes(lt) ? newRule.leaveTypes.filter((t) => t !== lt) : [...newRule.leaveTypes, lt] })}
                    className={cn("px-3 py-1 text-xs rounded-full border transition-colors", newRule.leaveTypes.includes(lt) ? "bg-[#8B5CF6] text-white border-[#8B5CF6]" : "bg-white text-slate-600 border-slate-200 hover:border-[#8B5CF6]")}
                  >
                    {lt}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddRuleDialog(false)}>Cancel</Button>
            <Button onClick={handleAddRule} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">Add Rule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Simulation Dialog */}
      <Dialog open={simulationOpen} onOpenChange={setSimulationOpen}>
        <DialogContent className="sm:max-w-md border-2 border-slate-200">
          <DialogHeader>
            <DialogTitle>Impact Simulation</DialogTitle>
            <DialogDescription>See how sandwich rules affect leave balance for given dates</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Leave Start Date</Label><Input type="date" value={simStartDate} onChange={(e) => setSimStartDate(e.target.value)} /></div>
              <div><Label>Leave End Date</Label><Input type="date" value={simEndDate} onChange={(e) => setSimEndDate(e.target.value)} /></div>
            </div>
            <Button onClick={handleSimulate} className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white gap-2"><Calculator className="w-4 h-4" /> Calculate Impact</Button>
            {simResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-slate-50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm"><span className="text-slate-600">Leave Days (working)</span><span className="font-medium">{simResult.leaveDays}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-600">Weekends in range</span><span className="font-medium">{simResult.weekends}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-600">Holidays in range</span><span className="font-medium">{simResult.holidays}</span></div>
                <div className="flex justify-between text-sm text-amber-700"><span>Sandwich Days Added</span><span className="font-medium">+{simResult.sandwichDays}</span></div>
                <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between text-sm">
                  <span className="font-semibold text-slate-800">Total Days Counted</span>
                  <span className="font-bold text-lg text-[#8B5CF6]">{simResult.totalCounted}</span>
                </div>
                {simResult.sandwichDays > 0 && (
                  <div className="flex items-center gap-1.5 p-2 bg-amber-50 rounded border border-amber-200 text-xs text-amber-700">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Sandwich rule adds {simResult.sandwichDays} extra day(s) to this leave
                  </div>
                )}
              </motion.div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setSimulationOpen(false); setSimResult(null); }}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SandwichRulesPage;
