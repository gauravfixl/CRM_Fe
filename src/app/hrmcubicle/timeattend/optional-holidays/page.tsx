"use client"

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Plus,
  Search,
  Star,
  Settings,
  Users,
  CheckCircle2,
  Clock,
  Calendar,
  Gift,
  Globe,
  Heart,
  MapPin,
  TrendingUp,
  BarChart3,
} from "lucide-react";
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

interface Holiday {
  id: string;
  name: string;
  date: string;
  type: "Mandatory" | "Optional" | "Floating";
  category: "Religious" | "Cultural" | "Regional" | "National";
  availableSlots: number;
  selectedCount: number;
}

interface EmployeeSelection {
  employeeId: string;
  employeeName: string;
  department: string;
  chosenHolidays: string[];
  maxAllowed: number;
  remaining: number;
}

const mockHolidays: Holiday[] = [
  { id: "H001", name: "Republic Day", date: "2026-01-26", type: "Mandatory", category: "National", availableSlots: -1, selectedCount: 0 },
  { id: "H002", name: "Independence Day", date: "2026-08-15", type: "Mandatory", category: "National", availableSlots: -1, selectedCount: 0 },
  { id: "H003", name: "Gandhi Jayanti", date: "2026-10-02", type: "Mandatory", category: "National", availableSlots: -1, selectedCount: 0 },
  { id: "H004", name: "Diwali", date: "2026-10-20", type: "Mandatory", category: "Religious", availableSlots: -1, selectedCount: 0 },
  { id: "H005", name: "Christmas", date: "2026-12-25", type: "Mandatory", category: "Religious", availableSlots: -1, selectedCount: 0 },
  { id: "H006", name: "Holi", date: "2026-03-17", type: "Optional", category: "Religious", availableSlots: 120, selectedCount: 85 },
  { id: "H007", name: "Eid ul-Fitr", date: "2026-03-20", type: "Optional", category: "Religious", availableSlots: 120, selectedCount: 42 },
  { id: "H008", name: "Pongal", date: "2026-01-14", type: "Optional", category: "Regional", availableSlots: 120, selectedCount: 35 },
  { id: "H009", name: "Onam", date: "2026-09-03", type: "Optional", category: "Regional", availableSlots: 120, selectedCount: 28 },
  { id: "H010", name: "Guru Nanak Jayanti", date: "2026-11-08", type: "Optional", category: "Religious", availableSlots: 120, selectedCount: 22 },
  { id: "H011", name: "Buddha Purnima", date: "2026-05-12", type: "Optional", category: "Religious", availableSlots: 120, selectedCount: 18 },
  { id: "H012", name: "Navratri (Start)", date: "2026-10-10", type: "Optional", category: "Cultural", availableSlots: 120, selectedCount: 55 },
  { id: "H013", name: "Birthday Leave", date: "-", type: "Floating", category: "Cultural", availableSlots: 120, selectedCount: 90 },
  { id: "H014", name: "Anniversary Leave", date: "-", type: "Floating", category: "Cultural", availableSlots: 120, selectedCount: 45 },
];

const mockSelections: EmployeeSelection[] = [
  { employeeId: "E001", employeeName: "Aarav Sharma", department: "Engineering", chosenHolidays: ["Holi", "Navratri (Start)"], maxAllowed: 3, remaining: 1 },
  { employeeId: "E002", employeeName: "Priya Patel", department: "Engineering", chosenHolidays: ["Holi", "Eid ul-Fitr", "Buddha Purnima"], maxAllowed: 3, remaining: 0 },
  { employeeId: "E003", employeeName: "Rahul Verma", department: "Marketing", chosenHolidays: ["Pongal"], maxAllowed: 3, remaining: 2 },
  { employeeId: "E004", employeeName: "Sneha Gupta", department: "Sales", chosenHolidays: [], maxAllowed: 3, remaining: 3 },
  { employeeId: "E005", employeeName: "Vikram Singh", department: "HR", chosenHolidays: ["Guru Nanak Jayanti", "Holi"], maxAllowed: 3, remaining: 1 },
  { employeeId: "E006", employeeName: "Ananya Reddy", department: "Finance", chosenHolidays: ["Onam", "Pongal", "Navratri (Start)"], maxAllowed: 3, remaining: 0 },
];

const typeColors: Record<string, { color: string; bg: string }> = {
  Mandatory: { color: "text-red-700", bg: "bg-red-50" },
  Optional: { color: "text-blue-700", bg: "bg-blue-50" },
  Floating: { color: "text-purple-700", bg: "bg-purple-50" },
};

const catIcons: Record<string, React.ElementType> = {
  Religious: Heart,
  Cultural: Star,
  Regional: MapPin,
  National: Globe,
};

const OptionalHolidaysPage = () => {
  const { toast } = useToast();
  const [holidays, setHolidays] = useState<Holiday[]>(mockHolidays);
  const [selections, setSelections] = useState<EmployeeSelection[]>(mockSelections);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("calendar");
  const [addHolidayDialog, setAddHolidayDialog] = useState(false);
  const [requestDialog, setRequestDialog] = useState(false);
  const [configDialog, setConfigDialog] = useState(false);
  const [maxOptional, setMaxOptional] = useState(3);

  const [newHoliday, setNewHoliday] = useState({ name: "", date: "", type: "Optional" as Holiday["type"], category: "Religious" as Holiday["category"] });
  const [selectedHolidayForRequest, setSelectedHolidayForRequest] = useState("");

  const optionalHolidays = holidays.filter((h) => h.type === "Optional");
  const mandatoryHolidays = holidays.filter((h) => h.type === "Mandatory");
  const floatingHolidays = holidays.filter((h) => h.type === "Floating");

  const popularHolidays = useMemo(() => {
    return [...optionalHolidays].sort((a, b) => b.selectedCount - a.selectedCount).slice(0, 5);
  }, [optionalHolidays]);

  const totalUtilization = useMemo(() => {
    const totalSlots = selections.length * maxOptional;
    const usedSlots = selections.reduce((s, sel) => s + sel.chosenHolidays.length, 0);
    return totalSlots > 0 ? Math.round((usedSlots / totalSlots) * 100) : 0;
  }, [selections, maxOptional]);

  const handleAddHoliday = () => {
    if (!newHoliday.name) {
      toast({ title: "Error", description: "Holiday name is required.", variant: "destructive" });
      return;
    }
    const h: Holiday = {
      id: `H${String(holidays.length + 1).padStart(3, "0")}`,
      name: newHoliday.name,
      date: newHoliday.date || "-",
      type: newHoliday.type,
      category: newHoliday.category,
      availableSlots: 120,
      selectedCount: 0,
    };
    setHolidays([...holidays, h]);
    setAddHolidayDialog(false);
    setNewHoliday({ name: "", date: "", type: "Optional", category: "Religious" });
    toast({ title: "Holiday Added", description: `${h.name} has been added to the list.` });
  };

  const handleRequestHoliday = () => {
    if (!selectedHolidayForRequest) {
      toast({ title: "Error", description: "Please select a holiday.", variant: "destructive" });
      return;
    }
    // Simulate request for employee E001
    setSelections((prev) =>
      prev.map((s) => {
        if (s.employeeId !== "E001" || s.remaining <= 0) return s;
        if (s.chosenHolidays.includes(selectedHolidayForRequest)) return s;
        return { ...s, chosenHolidays: [...s.chosenHolidays, selectedHolidayForRequest], remaining: s.remaining - 1 };
      })
    );
    setHolidays((prev) =>
      prev.map((h) => (h.name === selectedHolidayForRequest ? { ...h, selectedCount: h.selectedCount + 1 } : h))
    );
    setRequestDialog(false);
    setSelectedHolidayForRequest("");
    toast({ title: "Holiday Requested", description: `${selectedHolidayForRequest} has been selected.` });
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Optional / Restricted Holidays</h1>
          <p className="text-slate-500 text-sm mt-1">Manage holiday selections and quotas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setConfigDialog(true)} className="gap-2"><Settings className="w-4 h-4" /> Config</Button>
          <Button variant="outline" onClick={() => setRequestDialog(true)} className="gap-2"><Calendar className="w-4 h-4" /> Request Holiday</Button>
          <Button onClick={() => setAddHolidayDialog(true)} className="gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"><Plus className="w-4 h-4" /> Add Holiday</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Mandatory Holidays", value: mandatoryHolidays.length, icon: Globe, color: "text-red-600", bg: "bg-red-50" },
          { label: "Optional Holidays", value: optionalHolidays.length, icon: CalendarDays, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Floating Holidays", value: floatingHolidays.length, icon: Gift, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Utilization Rate", value: `${totalUtilization}%`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
        ].map((s) => (
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
          <TabsTrigger value="calendar">Holiday Calendar</TabsTrigger>
          <TabsTrigger value="optional">Optional Holidays</TabsTrigger>
          <TabsTrigger value="selections">Employee Selections</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-4">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">2026 Holiday Calendar</h2>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {months.map((month, mIdx) => {
                  const monthHolidays = holidays.filter((h) => {
                    if (h.date === "-") return false;
                    return new Date(h.date).getMonth() === mIdx;
                  });
                  return (
                    <div key={month} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="text-sm font-semibold text-slate-700 mb-2">{month} 2026</div>
                      {monthHolidays.length === 0 ? (
                        <div className="text-xs text-slate-400">No holidays</div>
                      ) : (
                        <div className="space-y-1">
                          {monthHolidays.map((h) => {
                            const tc = typeColors[h.type];
                            return (
                              <div key={h.id} className="flex items-center gap-1.5">
                                <div className={cn("w-1.5 h-1.5 rounded-full", h.type === "Mandatory" ? "bg-red-500" : h.type === "Optional" ? "bg-blue-500" : "bg-purple-500")} />
                                <span className="text-[10px] text-slate-600 truncate">{h.name}</span>
                                <span className="text-[9px] text-slate-400">{new Date(h.date).getDate()}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /><span className="text-xs text-slate-500">Mandatory</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500" /><span className="text-xs text-slate-500">Optional</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-purple-500" /><span className="text-xs text-slate-500">Floating</span></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optional" className="mt-4">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Optional Holiday List</h2>
                <Badge variant="outline">Max {maxOptional} per employee per year</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Holiday</th>
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Date</th>
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Type</th>
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Category</th>
                      <th className="text-center py-3 px-3 text-slate-500 font-medium">Selected By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {optionalHolidays.map((h) => {
                      const CatIcon = catIcons[h.category] || Globe;
                      const pct = h.availableSlots > 0 ? Math.round((h.selectedCount / h.availableSlots) * 100) : 0;
                      return (
                        <tr key={h.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                          <td className="py-3 px-3 font-medium text-slate-800">{h.name}</td>
                          <td className="py-3 px-3 text-slate-600">{h.date}</td>
                          <td className="py-3 px-3">
                            <Badge className={cn("text-xs border-0", typeColors[h.type].bg, typeColors[h.type].color)}>{h.type}</Badge>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <CatIcon className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-slate-600">{h.category}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#8B5CF6] rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs text-slate-500">{h.selectedCount}/{h.availableSlots}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="selections" className="mt-4">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Employee Selections</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-56" />
                </div>
              </div>
              <div className="space-y-3">
                {selections.filter((s) => s.employeeName.toLowerCase().includes(searchTerm.toLowerCase())).map((sel) => (
                  <div key={sel.employeeId} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium text-slate-800">{sel.employeeName}</span>
                        <span className="text-xs text-slate-400 ml-2">{sel.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{sel.chosenHolidays.length}/{sel.maxAllowed} used</span>
                        <Badge className={cn("text-xs border-0", sel.remaining > 0 ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500")}>
                          {sel.remaining} remaining
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {sel.chosenHolidays.length > 0 ? sel.chosenHolidays.map((h) => (
                        <Badge key={h} className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-0 text-xs">{h}</Badge>
                      )) : <span className="text-xs text-slate-400">No holidays selected yet</span>}
                    </div>
                    <div className="mt-2 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#8B5CF6] rounded-full transition-all" style={{ width: `${(sel.chosenHolidays.length / sel.maxAllowed) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-4">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Most Popular Optional Holidays</h2>
              <div className="space-y-3">
                {popularHolidays.map((h, i) => (
                  <div key={h.id} className="flex items-center gap-4">
                    <span className="text-lg font-bold text-slate-300 w-6 text-right">#{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">{h.name}</span>
                        <span className="text-xs text-slate-500">{h.selectedCount} selections</span>
                      </div>
                      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${h.availableSlots > 0 ? (h.selectedCount / h.availableSlots) * 100 : 0}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className="h-full bg-[#8B5CF6] rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Overall Utilization</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#8B5CF6] rounded-full" style={{ width: `${totalUtilization}%` }} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{totalUtilization}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Holiday Dialog */}
      <Dialog open={addHolidayDialog} onOpenChange={setAddHolidayDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Holiday</DialogTitle>
            <DialogDescription>Add a new holiday to the optional list</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Holiday Name *</Label><Input value={newHoliday.name} onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })} /></div>
            <div><Label>Date</Label><Input type="date" value={newHoliday.date} onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })} /></div>
            <div>
              <Label>Type</Label>
              <Select value={newHoliday.type} onValueChange={(v) => setNewHoliday({ ...newHoliday, type: v as Holiday["type"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mandatory">Mandatory</SelectItem>
                  <SelectItem value="Optional">Optional</SelectItem>
                  <SelectItem value="Floating">Floating</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={newHoliday.category} onValueChange={(v) => setNewHoliday({ ...newHoliday, category: v as Holiday["category"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Religious">Religious</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                  <SelectItem value="Regional">Regional</SelectItem>
                  <SelectItem value="National">National</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddHolidayDialog(false)}>Cancel</Button>
            <Button onClick={handleAddHoliday} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">Add Holiday</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Holiday Dialog */}
      <Dialog open={requestDialog} onOpenChange={setRequestDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Optional Holiday</DialogTitle>
            <DialogDescription>Select an optional holiday to add to your selections</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Select Holiday</Label>
              <Select value={selectedHolidayForRequest} onValueChange={setSelectedHolidayForRequest}>
                <SelectTrigger><SelectValue placeholder="Choose a holiday..." /></SelectTrigger>
                <SelectContent>
                  {optionalHolidays.map((h) => (
                    <SelectItem key={h.id} value={h.name}>{h.name} - {h.date}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestDialog(false)}>Cancel</Button>
            <Button onClick={handleRequestHoliday} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Config Dialog */}
      <Dialog open={configDialog} onOpenChange={setConfigDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Holiday Configuration</DialogTitle>
            <DialogDescription>Set max optional holidays per employee</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label>Max Optional Holidays Per Year</Label>
            <Select value={String(maxOptional)} onValueChange={(v) => setMaxOptional(parseInt(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((n) => <SelectItem key={n} value={String(n)}>{n} holidays</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigDialog(false)}>Cancel</Button>
            <Button onClick={() => { setConfigDialog(false); toast({ title: "Config Saved" }); }} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OptionalHolidaysPage;
