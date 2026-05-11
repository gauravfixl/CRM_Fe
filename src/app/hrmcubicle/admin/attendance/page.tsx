"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
    CalendarClock,
    Plus,
    Clock,
    Coffee,
    Moon,
    Sun,
    Briefcase,
    Trash2,
    Edit2,
    CalendarDays,
    AlertCircle,
    Search
} from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { useAttendanceSettingsStore, type Shift, type AttendanceRule, type Holiday } from "@/shared/data/attendance-settings-store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/components/ui/alert-dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Switch } from "@/shared/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { shiftsApi, holidaysApi, attendancePolicyApi, extractApiError } from "@/shared/api/settings-api";
import { validateShift, validateAttendanceRule, validateHoliday, type ValidationErrors } from "@/shared/api/settings-validators";

const deriveShiftType = (startTime: string): "morning" | "noon" | "night" => {
    const hh = parseInt((startTime || "09:00").split(":")[0], 10);
    if (hh >= 20 || hh < 5) return "night";
    if (hh >= 12) return "noon";
    return "morning";
};

const minutesBetween = (start: string, end: string): number => {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    let diff = eh * 60 + em - (sh * 60 + sm);
    if (diff <= 0) diff += 24 * 60;
    return diff;
};

const FieldError = ({ msg }: { msg?: string }) =>
    msg ? <p className="text-[11px] text-rose-600 font-medium mt-1">{msg}</p> : null;

const AttendanceRulesPage = () => {
    const { shifts, rules, holidays, createShift, updateShift, deleteShift, createRule, updateRule, deleteRule, addHoliday, updateHoliday, removeHoliday } = useAttendanceSettingsStore();
    const [activeTab, setActiveTab] = useState("shifts");
    const { toast } = useToast();

    // Dialog States
    const [shiftDialogOpen, setShiftDialogOpen] = useState(false);
    const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
    const [holidayDialogOpen, setHolidayDialogOpen] = useState(false);

    // Form States
    const [currentShift, setCurrentShift] = useState<Partial<Shift>>({});
    const [currentRule, setCurrentRule] = useState<Partial<AttendanceRule>>({});
    const [currentHoliday, setCurrentHoliday] = useState<Partial<Holiday>>({});

    // Search
    const [shiftSearch, setShiftSearch] = useState("");
    const [ruleSearch, setRuleSearch] = useState("");
    const [holidaySearch, setHolidaySearch] = useState("");

    // Delete confirmations
    const [deleteTarget, setDeleteTarget] = useState<{ type: "shift" | "rule" | "holiday"; id: string; name: string } | null>(null);

    // Validation errors per form
    const [shiftErrors, setShiftErrors] = useState<ValidationErrors>({});
    const [ruleErrors, setRuleErrors] = useState<ValidationErrors>({});
    const [holidayErrors, setHolidayErrors] = useState<ValidationErrors>({});

    const [isLoading, setIsLoading] = useState(false);

    // Load from backend on mount
    useEffect(() => {
        let cancel = false;
        const load = async () => {
            setIsLoading(true);
            try {
                const [shiftsRes, holidaysRes] = await Promise.allSettled([
                    shiftsApi.list(),
                    holidaysApi.list(new Date().getFullYear()),
                ]);

                if (cancel) return;

                if (shiftsRes.status === "fulfilled" && Array.isArray(shiftsRes.value.data)) {
                    const mapped: Shift[] = shiftsRes.value.data.map(s => ({
                        id: s._id,
                        name: `${s.shiftType.charAt(0).toUpperCase() + s.shiftType.slice(1)} Shift`,
                        startTime: s.startTime,
                        endTime: s.endTime,
                        workingHours: Math.round(minutesBetween(s.startTime, s.endTime) / 60 * 10) / 10,
                        breakDuration: s.breakMinutes,
                        isActive: s.isActive,
                        applicableDays: [1, 2, 3, 4, 5],
                    }));
                    if (mapped.length) useAttendanceSettingsStore.setState({ shifts: mapped });
                }

                if (holidaysRes.status === "fulfilled" && Array.isArray(holidaysRes.value.data)) {
                    const mapped: Holiday[] = holidaysRes.value.data.map(h => ({
                        id: h._id,
                        name: h.name,
                        date: new Date(h.date).toISOString().split("T")[0],
                        type: (h.type === "Optional" ? "Optional" : "National") as Holiday["type"],
                    }));
                    if (mapped.length) useAttendanceSettingsStore.setState({ holidays: mapped });
                }
            } catch {
                // Silently fall back to local store
            } finally {
                if (!cancel) setIsLoading(false);
            }
        };
        load();
        return () => { cancel = true; };
    }, []);

    const filteredShifts = shifts.filter(s => s.name.toLowerCase().includes(shiftSearch.toLowerCase()));
    const filteredRules = rules.filter(r =>
        r.name.toLowerCase().includes(ruleSearch.toLowerCase()) ||
        r.type.toLowerCase().includes(ruleSearch.toLowerCase())
    );
    const filteredHolidays = holidays.filter(h =>
        h.name.toLowerCase().includes(holidaySearch.toLowerCase()) ||
        h.type.toLowerCase().includes(holidaySearch.toLowerCase())
    );

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        const { type, id, name } = deleteTarget;
        if (type === "shift") {
            deleteShift(id);
            toast({ title: "Shift Deleted", description: `${name} removed from roster.`, variant: "destructive" });
            try { await shiftsApi.remove(id); } catch (e) { toast({ title: "Backend Sync Failed", description: extractApiError(e, "Local change only."), variant: "destructive" }); }
        } else if (type === "rule") {
            deleteRule(id);
            toast({ title: "Rule Deleted", description: `${name} policy removed.`, variant: "destructive" });
        } else {
            removeHoliday(id);
            toast({ title: "Holiday Removed", description: `${name} removed from calendar.`, variant: "destructive" });
            try { await holidaysApi.remove(id); } catch (e) { toast({ title: "Backend Sync Failed", description: extractApiError(e, "Local change only."), variant: "destructive" }); }
        }
        setDeleteTarget(null);
    };

    const handleEditHoliday = (holiday: Holiday) => {
        setCurrentHoliday(holiday);
        setHolidayDialogOpen(true);
    };

    const handleEditShift = (shift: Shift) => {
        setCurrentShift(shift);
        setShiftDialogOpen(true);
    };

    const handleNewShift = () => {
        setCurrentShift({ name: "", startTime: "09:00", endTime: "18:00", workingHours: 9, breakDuration: 60, isActive: true, applicableDays: [1, 2, 3, 4, 5] });
        setShiftDialogOpen(true);
    };

    const saveShift = async () => {
        const errs = validateShift(currentShift);
        setShiftErrors(errs);
        if (Object.keys(errs).length > 0) {
            toast({ title: "Please fix the highlighted fields", variant: "destructive" });
            return;
        }
        const payload = {
            shiftType: deriveShiftType(currentShift.startTime || "09:00"),
            startTime: currentShift.startTime!,
            endTime: currentShift.endTime!,
            breakMinutes: Number(currentShift.breakDuration || 0),
            halfDayAfterMinutes: Math.max(120, Math.floor(Number(currentShift.workingHours || 8) * 60 / 2)),
            graceInMinutes: 0,
            graceOutMinutes: 0,
        };
        try {
            if (currentShift.id) {
                const res = await shiftsApi.update(currentShift.id, payload);
                updateShift(currentShift.id, currentShift);
                toast({ title: "Shift Updated", description: "Saved to backend." });
            } else {
                const res = await shiftsApi.create(payload);
                const newShift: Shift = {
                    ...(currentShift as Shift),
                    id: res.data?._id || `shift-${Date.now()}`,
                };
                useAttendanceSettingsStore.setState((s) => ({ shifts: [...s.shifts, newShift] }));
                toast({ title: "Shift Created", description: "Saved to backend." });
            }
            setShiftDialogOpen(false);
            setShiftErrors({});
            setCurrentShift({});
        } catch (e) {
            // Fallback to local save
            if (currentShift.id) {
                updateShift(currentShift.id, currentShift);
            } else {
                createShift(currentShift as Shift);
            }
            setShiftDialogOpen(false);
            setShiftErrors({});
            setCurrentShift({});
            toast({ title: "Saved Locally", description: extractApiError(e, "Backend unreachable — change kept locally."), variant: "destructive" });
        }
    };

    const handleEditRule = (rule: AttendanceRule) => {
        setCurrentRule(rule);
        setRuleDialogOpen(true);
    };

    const handleNewRule = () => {
        setCurrentRule({ name: "", type: "Grace Period", config: { gracePeriodMinutes: 15 }, isActive: true });
        setRuleDialogOpen(true);
    };

    const saveRule = async () => {
        const errs = validateAttendanceRule(currentRule);
        setRuleErrors(errs);
        if (Object.keys(errs).length > 0) {
            toast({ title: "Please fix the highlighted fields", variant: "destructive" });
            return;
        }
        if (currentRule.id) {
            updateRule(currentRule.id, currentRule);
        } else {
            createRule(currentRule as AttendanceRule);
        }
        // Sync a best-effort attendance policy to backend (policy is singleton per org)
        try {
            const policyPayload = {
                lateAllowedMinutes: currentRule.config?.gracePeriodMinutes ?? 0,
                halfDayThresholdMinutes: (currentRule.config?.halfDayThresholdHours ?? 4) * 60,
                absentThresholdMinutes: 240,
                overtimeMinMinutes: 30,
                allowEarlyPunch: true,
                allowLatePunch: true,
                sandwichLeaveRule: false,
                allowBackdatedRegularization: true,
                maxBackdateDays: 30,
            };
            await attendancePolicyApi.upsert(policyPayload);
        } catch (e) {
            // Not fatal — rule save still succeeds locally
        }
        setRuleDialogOpen(false);
        setRuleErrors({});
        setCurrentRule({});
        toast({ title: "Policy Updated", description: "Attendance rule saved." });
    };

    const handleNewHoliday = () => {
        setCurrentHoliday({ name: "", date: new Date().toISOString().split('T')[0], type: "National" });
        setHolidayDialogOpen(true);
    };

    const saveHoliday = async () => {
        const errs = validateHoliday(currentHoliday);
        setHolidayErrors(errs);
        if (Object.keys(errs).length > 0) {
            toast({ title: "Please fix the highlighted fields", variant: "destructive" });
            return;
        }
        const backendType = currentHoliday.type === "Optional" ? "Optional" : "National";
        const payload = {
            name: currentHoliday.name!,
            date: currentHoliday.date!,
            type: backendType as "National" | "Optional",
            isPaid: true,
            isMandatory: backendType === "National",
        };
        try {
            if (currentHoliday.id) {
                const res = await holidaysApi.update(currentHoliday.id, payload);
                updateHoliday(currentHoliday.id, currentHoliday);
                toast({ title: "Holiday Updated", description: "Saved to backend." });
            } else {
                const res = await holidaysApi.create(payload);
                const newHoliday: Holiday = { ...(currentHoliday as Holiday), id: res.data?._id || `h-${Date.now()}` };
                useAttendanceSettingsStore.setState((s) => ({ holidays: [...s.holidays, newHoliday] }));
                toast({ title: "Holiday Added", description: "Saved to backend." });
            }
        } catch (e) {
            if (currentHoliday.id) {
                updateHoliday(currentHoliday.id, currentHoliday);
            } else {
                addHoliday(currentHoliday as Holiday);
            }
            toast({ title: "Saved Locally", description: extractApiError(e, "Backend unreachable — change kept locally."), variant: "destructive" });
        }
        setHolidayDialogOpen(false);
        setHolidayErrors({});
        setCurrentHoliday({});
    };

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="h-20 px-8 flex justify-between items-center bg-white border-b border-slate-200">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
                        <Clock size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance & Shifts</h1>
                        <p className="text-sm font-medium text-slate-500">Configure work timings, policies, and holiday calendars.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    {activeTab === "shifts" && (
                        <Button onClick={handleNewShift} className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-100 rounded-xl px-6 font-bold">
                            <Plus size={18} className="mr-2" /> Add Shift
                        </Button>
                    )}
                    {activeTab === "policies" && (
                        <Button onClick={handleNewRule} className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-100 rounded-xl px-6 font-bold">
                            <Plus size={18} className="mr-2" /> Add Rule
                        </Button>
                    )}
                    {activeTab === "calendar" && (
                        <Button onClick={handleNewHoliday} className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-100 rounded-xl px-6 font-bold">
                            <Plus size={18} className="mr-2" /> Add Holiday
                        </Button>
                    )}
                </div>
            </div>

            {/* Content */}
            <Tabs defaultValue="shifts" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col p-8 overflow-hidden">
                <TabsList className="bg-white border border-slate-200 rounded-xl p-1 h-12 w-fit shadow-sm self-start mb-6">
                    <TabsTrigger value="shifts" className="rounded-lg px-6 font-semibold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700">Shift Roster</TabsTrigger>
                    <TabsTrigger value="policies" className="rounded-lg px-6 font-semibold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700">Attendance Policies</TabsTrigger>
                    <TabsTrigger value="calendar" className="rounded-lg px-6 font-semibold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700">Holidays</TabsTrigger>
                </TabsList>

                <ScrollArea className="flex-1 -mx-4 px-4 pb-10">
                    {/* Shifts Tab */}
                    <TabsContent value="shifts" className="m-0 space-y-6">
                        <div className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search shifts by name..."
                                    className="pl-9 bg-slate-50 border-slate-200"
                                    value={shiftSearch}
                                    onChange={(e) => setShiftSearch(e.target.value)}
                                />
                            </div>
                            <div className="text-xs font-semibold text-slate-500">{filteredShifts.length} shifts</div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredShifts.map(shift => (
                            <Card key={shift.id} className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-1.5 h-full ${shift.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            {parseInt(shift.startTime) < 12 ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-indigo-500" />}
                                            <Badge variant="outline" className="font-bold text-slate-600 border-slate-200">{shift.name}</Badge>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-indigo-600" onClick={() => handleEditShift(shift)}>
                                                <Edit2 size={14} />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-rose-600" onClick={() => setDeleteTarget({ type: "shift", id: shift.id, name: shift.name })}>
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardTitle className="text-3xl font-bold text-slate-800 tracking-tight mt-2">
                                        {shift.startTime} <span className="text-slate-300 text-xl font-medium">-</span> {shift.endTime}
                                    </CardTitle>
                                    <CardDescription className="font-semibold text-slate-500 flex items-center gap-2">
                                        <Briefcase size={14} /> {shift.workingHours} Hrs Work • <Coffee size={14} /> {shift.breakDuration} Mins Break
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-1 mt-4">
                                        {daysOfWeek.map((day, idx) => (
                                            <div
                                                key={day}
                                                className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${shift.applicableDays.includes(idx) ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-300'}`}
                                            >
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className={`text-xs font-bold ${shift.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            {shift.isActive ? 'ACTIVE SHIFT' : 'INACTIVE'}
                                        </span>
                                        <Switch checked={shift.isActive} onCheckedChange={() => updateShift(shift.id, { isActive: !shift.isActive })} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        </div>
                        {filteredShifts.length === 0 && (
                            <div className="text-center py-16 text-slate-400">
                                <p className="font-bold">No shifts match your search.</p>
                            </div>
                        )}
                    </TabsContent>

                    {/* Policies Tab */}
                    <TabsContent value="policies" className="m-0 space-y-4">
                        <div className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search policies by name or type..."
                                    className="pl-9 bg-slate-50 border-slate-200"
                                    value={ruleSearch}
                                    onChange={(e) => setRuleSearch(e.target.value)}
                                />
                            </div>
                            <div className="text-xs font-semibold text-slate-500">{filteredRules.length} rules</div>
                        </div>
                        {filteredRules.map(rule => (
                            <div key={rule.id} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center gap-6">
                                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${rule.type === 'Grace Period' ? 'bg-amber-100 text-amber-600' :
                                            rule.type === 'Late Mark' ? 'bg-rose-100 text-rose-600' :
                                                rule.type === 'Overtime' ? 'bg-emerald-100 text-emerald-600' :
                                                    'bg-blue-100 text-blue-600'
                                        }`}>
                                        {rule.type === 'Overtime' ? <CalendarClock size={24} /> : <AlertCircle size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">{rule.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-600">{rule.type}</Badge>

                                            {rule.config.gracePeriodMinutes && <span>Allowed: {rule.config.gracePeriodMinutes} mins</span>}
                                            {rule.config.lateMarkAfterMinutes && <span>Trigger: {rule.config.lateMarkAfterMinutes} mins</span>}
                                            {rule.config.overtimeMultiplier && <span>Rate: {rule.config.overtimeMultiplier}x</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-slate-500">Status</span>
                                        <Switch checked={rule.isActive} onCheckedChange={() => updateRule(rule.id, { isActive: !rule.isActive })} />
                                    </div>
                                    <Button variant="outline" size="icon" onClick={() => handleEditRule(rule)} className="text-slate-400 hover:text-indigo-600">
                                        <Edit2 size={16} />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => setDeleteTarget({ type: "rule", id: rule.id, name: rule.name })} className="text-slate-400 hover:text-rose-600">
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {filteredRules.length === 0 && (
                            <div className="text-center py-16 text-slate-400">
                                <p className="font-bold">No attendance policies match your search.</p>
                            </div>
                        )}
                    </TabsContent>

                    {/* Holidays Tab */}
                    <TabsContent value="calendar" className="m-0 space-y-4">
                        <div className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search holidays..."
                                    className="pl-9 bg-slate-50 border-slate-200"
                                    value={holidaySearch}
                                    onChange={(e) => setHolidaySearch(e.target.value)}
                                />
                            </div>
                            <div className="text-xs font-semibold text-slate-500">{filteredHolidays.length} holidays</div>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Holiday Name</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredHolidays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(holiday => (
                                        <tr key={holiday.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500 font-bold text-xs">
                                                    {new Date(holiday.date).getDate()}
                                                </div>
                                                {holiday.name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 font-medium">
                                                {new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className={`${holiday.type === 'National' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'} border-none`}>
                                                    {holiday.type} Holiday
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="sm" onClick={() => handleEditHoliday(holiday)} className="text-slate-400 hover:text-indigo-600 mr-1">
                                                    <Edit2 size={14} />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => setDeleteTarget({ type: "holiday", id: holiday.id, name: holiday.name })} className="text-slate-400 hover:text-rose-600">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredHolidays.length === 0 && (
                                <div className="p-12 text-center text-slate-400">
                                    <CalendarDays size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-medium">No holidays match your search.</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </ScrollArea>
            </Tabs>

            {/* Shift Sheet */}
            <SideFormSheet
                open={shiftDialogOpen}
                onOpenChange={(v) => { setShiftDialogOpen(v); if (!v) setCurrentShift({}); }}
                title={currentShift.id ? "Edit Shift" : "Configure Shift"}
                description="Set working hours and breaks."
                icon={<Clock size={20} />}
                accentColor={currentShift.id ? "#7c3aed" : "#e11d48"}
                width="md"
                submitLabel={currentShift.id ? "Save Changes" : "Create Shift"}
                onSubmit={(e) => { e.preventDefault(); saveShift(); }}
            >
                <div className="space-y-4">
                    <Field label="Shift Name" required error={shiftErrors.name || undefined}>
                        <Input value={currentShift.name || ""} onChange={e => setCurrentShift({ ...currentShift, name: e.target.value })} />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Start Time" required error={shiftErrors.startTime || undefined}>
                            <Input type="time" value={currentShift.startTime || ""} onChange={e => setCurrentShift({ ...currentShift, startTime: e.target.value })} />
                        </Field>
                        <Field label="End Time" required error={shiftErrors.endTime || undefined}>
                            <Input type="time" value={currentShift.endTime || ""} onChange={e => setCurrentShift({ ...currentShift, endTime: e.target.value })} />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Work Hours" error={shiftErrors.workingHours || undefined}>
                            <Input type="number" min="0" max="24" step="0.5" value={currentShift.workingHours ?? ""} onChange={e => setCurrentShift({ ...currentShift, workingHours: parseFloat(e.target.value) })} />
                        </Field>
                        <Field label="Break (Mins)" error={shiftErrors.breakDuration || undefined}>
                            <Input type="number" min="0" max="480" value={currentShift.breakDuration ?? ""} onChange={e => setCurrentShift({ ...currentShift, breakDuration: parseInt(e.target.value) })} />
                        </Field>
                    </div>
                    <Field label="Applicable Days" required error={shiftErrors.applicableDays || undefined}>
                        <div className="flex gap-2">
                            {daysOfWeek.map((day, idx) => (
                                <button
                                    type="button"
                                    key={day}
                                    onClick={() => {
                                        const days = currentShift.applicableDays || [];
                                        const newDays = days.includes(idx) ? days.filter(d => d !== idx) : [...days, idx];
                                        setCurrentShift({ ...currentShift, applicableDays: newDays });
                                    }}
                                    className={`h-8 w-8 rounded-full text-xs font-bold transition-all ${(currentShift.applicableDays || []).includes(idx) ? 'bg-rose-600 text-white shadow-md shadow-rose-200' : 'bg-slate-100 text-slate-400'
                                        }`}
                                >
                                    {day.charAt(0)}
                                </button>
                            ))}
                        </div>
                    </Field>
                </div>
            </SideFormSheet>

            {/* Rule Sheet */}
            <SideFormSheet
                open={ruleDialogOpen}
                onOpenChange={(v) => { setRuleDialogOpen(v); if (!v) setCurrentRule({}); }}
                title={currentRule.id ? "Edit Policy Rule" : "New Policy Rule"}
                description="Configure attendance rule parameters."
                icon={<AlertCircle size={20} />}
                accentColor={currentRule.id ? "#7c3aed" : "#e11d48"}
                width="md"
                submitLabel={currentRule.id ? "Save Changes" : "Create Rule"}
                onSubmit={(e) => { e.preventDefault(); saveRule(); }}
            >
                <div className="space-y-4">
                    <Field label="Rule Name" required error={ruleErrors.name || undefined}>
                        <Input value={currentRule.name || ""} onChange={e => setCurrentRule({ ...currentRule, name: e.target.value })} />
                    </Field>
                    <Field label="Rule Type" required error={ruleErrors.type || undefined}>
                        <Select value={currentRule.type} onValueChange={(val: any) => setCurrentRule({ ...currentRule, type: val })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Grace Period">Grace Period</SelectItem>
                                <SelectItem value="Late Mark">Late Mark</SelectItem>
                                <SelectItem value="Overtime">Overtime</SelectItem>
                                <SelectItem value="Half Day">Half Day</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>

                    {currentRule.type === 'Grace Period' && (
                        <Field label="Grace Minutes" required error={ruleErrors.gracePeriodMinutes || undefined}>
                            <Input type="number" min="0" max="120" value={currentRule.config?.gracePeriodMinutes ?? ''} onChange={e => setCurrentRule({ ...currentRule, config: { ...currentRule.config, gracePeriodMinutes: parseInt(e.target.value) } })} />
                        </Field>
                    )}
                    {currentRule.type === 'Late Mark' && (
                        <Field label="Mark Late After (Minutes)" required error={ruleErrors.lateMarkAfterMinutes || undefined}>
                            <Input type="number" min="0" max="240" value={currentRule.config?.lateMarkAfterMinutes ?? ''} onChange={e => setCurrentRule({ ...currentRule, config: { ...currentRule.config, lateMarkAfterMinutes: parseInt(e.target.value) } })} />
                        </Field>
                    )}
                    {currentRule.type === 'Overtime' && (
                        <Field label="Pay Multiplier (e.g. 1.5)" required error={ruleErrors.overtimeMultiplier || undefined}>
                            <Input type="number" step="0.1" min="0" max="10" value={currentRule.config?.overtimeMultiplier ?? ''} onChange={e => setCurrentRule({ ...currentRule, config: { ...currentRule.config, overtimeMultiplier: parseFloat(e.target.value) } })} />
                        </Field>
                    )}
                </div>
            </SideFormSheet>

            {/* Holiday Sheet */}
            <SideFormSheet
                open={holidayDialogOpen}
                onOpenChange={(v) => { setHolidayDialogOpen(v); if (!v) setCurrentHoliday({}); }}
                title={currentHoliday.id ? "Edit Holiday" : "Add Holiday"}
                description="Mark a non-working day on the calendar."
                icon={<CalendarDays size={20} />}
                accentColor={currentHoliday.id ? "#7c3aed" : "#e11d48"}
                width="md"
                submitLabel={currentHoliday.id ? "Save Changes" : "Add to Calendar"}
                onSubmit={(e) => { e.preventDefault(); saveHoliday(); }}
            >
                <div className="space-y-4">
                    <Field label="Holiday Name" required error={holidayErrors.name || undefined}>
                        <Input value={currentHoliday.name || ""} onChange={e => setCurrentHoliday({ ...currentHoliday, name: e.target.value })} />
                    </Field>
                    <Field label="Date" required error={holidayErrors.date || undefined}>
                        <Input type="date" value={currentHoliday.date || ""} onChange={e => setCurrentHoliday({ ...currentHoliday, date: e.target.value })} />
                    </Field>
                    <Field label="Type" required error={holidayErrors.type || undefined}>
                        <Select value={currentHoliday.type} onValueChange={(val: any) => setCurrentHoliday({ ...currentHoliday, type: val })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="National">National Holiday</SelectItem>
                                <SelectItem value="Regional">Regional Holiday</SelectItem>
                                <SelectItem value="Optional">Optional Holiday</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </SideFormSheet>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {deleteTarget?.type}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            "{deleteTarget?.name}" will be permanently removed. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-rose-600 hover:bg-rose-700" onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AttendanceRulesPage;
