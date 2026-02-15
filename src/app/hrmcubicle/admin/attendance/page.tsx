"use client"

import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
    CalendarClock,
    Plus,
    Clock,
    Calendar,
    Settings,
    Coffee,
    Moon,
    Sun,
    Briefcase,
    Trash2,
    Edit2,
    CalendarDays,
    MapPin,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { useAttendanceSettingsStore, type Shift, type AttendanceRule, type Holiday } from "@/shared/data/attendance-settings-store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Switch } from "@/shared/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";

const AttendanceRulesPage = () => {
    const { shifts, rules, holidays, createShift, updateShift, deleteShift, createRule, updateRule, deleteRule, addHoliday, removeHoliday } = useAttendanceSettingsStore();
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

    const handleEditShift = (shift: Shift) => {
        setCurrentShift(shift);
        setShiftDialogOpen(true);
    };

    const handleNewShift = () => {
        setCurrentShift({ name: "", startTime: "09:00", endTime: "18:00", workingHours: 9, breakDuration: 60, isActive: true, applicableDays: [1, 2, 3, 4, 5] });
        setShiftDialogOpen(true);
    };

    const saveShift = () => {
        if (!currentShift.name || !currentShift.startTime || !currentShift.endTime) return;
        if (currentShift.id) {
            updateShift(currentShift.id, currentShift);
            toast({ title: "Shift Updated", description: "Work hours adjusted successfully." });
        } else {
            createShift(currentShift as Shift);
            toast({ title: "New Shift Created", description: "Shift added to the roster." });
        }
        setShiftDialogOpen(false);
    };

    const handleEditRule = (rule: AttendanceRule) => {
        setCurrentRule(rule);
        setRuleDialogOpen(true);
    };

    const handleNewRule = () => {
        setCurrentRule({ name: "", type: "Grace Period", config: { gracePeriodMinutes: 15 }, isActive: true });
        setRuleDialogOpen(true);
    };

    const saveRule = () => {
        if (!currentRule.name) return;
        if (currentRule.id) {
            updateRule(currentRule.id, currentRule);
        } else {
            createRule(currentRule as AttendanceRule);
        }
        setRuleDialogOpen(false);
        toast({ title: "Policy Updated", description: "Attendance rules synchronized." });
    };

    const handleNewHoliday = () => {
        setCurrentHoliday({ name: "", date: new Date().toISOString().split('T')[0], type: "National" });
        setHolidayDialogOpen(true);
    };

    const saveHoliday = () => {
        if (!currentHoliday.name || !currentHoliday.date) return;
        addHoliday(currentHoliday as Holiday);
        setHolidayDialogOpen(false);
        toast({ title: "Holiday Added", description: "Calendar updated." });
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
                    <TabsContent value="shifts" className="m-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {shifts.map(shift => (
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
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-rose-600" onClick={() => deleteShift(shift.id)}>
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
                    </TabsContent>

                    {/* Policies Tab */}
                    <TabsContent value="policies" className="m-0 space-y-4">
                        {rules.map(rule => (
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
                                    <Button variant="outline" size="icon" onClick={() => deleteRule(rule.id)} className="text-slate-400 hover:text-rose-600">
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </TabsContent>

                    {/* Holidays Tab */}
                    <TabsContent value="calendar" className="m-0">
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
                                    {holidays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(holiday => (
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
                                                <Button variant="ghost" size="sm" onClick={() => removeHoliday(holiday.id)} className="text-slate-400 hover:text-rose-600">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {holidays.length === 0 && (
                                <div className="p-12 text-center text-slate-400">
                                    <CalendarDays size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-medium">No holidays configured yet.</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </ScrollArea>
            </Tabs>

            {/* Shift Dialog */}
            <Dialog open={shiftDialogOpen} onOpenChange={setShiftDialogOpen}>
                <DialogContent className="rounded-2xl border-none p-8 max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Configure Shift</DialogTitle>
                        <DialogDescription>Set working hours and breaks.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                            <Label>Shift Name</Label>
                            <Input value={currentShift.name} onChange={e => setCurrentShift({ ...currentShift, name: e.target.value })} className="bg-slate-50" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Start Time</Label>
                                <Input type="time" value={currentShift.startTime} onChange={e => setCurrentShift({ ...currentShift, startTime: e.target.value })} className="bg-slate-50" />
                            </div>
                            <div className="grid gap-2">
                                <Label>End Time</Label>
                                <Input type="time" value={currentShift.endTime} onChange={e => setCurrentShift({ ...currentShift, endTime: e.target.value })} className="bg-slate-50" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Work Hours</Label>
                                <Input type="number" value={currentShift.workingHours} onChange={e => setCurrentShift({ ...currentShift, workingHours: parseFloat(e.target.value) })} className="bg-slate-50" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Break (Mins)</Label>
                                <Input type="number" value={currentShift.breakDuration} onChange={e => setCurrentShift({ ...currentShift, breakDuration: parseInt(e.target.value) })} className="bg-slate-50" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label>Applicable Days</Label>
                            <div className="flex gap-2">
                                {daysOfWeek.map((day, idx) => (
                                    <button
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
                        </div>
                    </div>
                    <Button onClick={saveShift} className="bg-rose-600 text-white w-full h-12 rounded-xl font-bold">Save Shift Configuration</Button>
                </DialogContent>
            </Dialog>

            {/* Rule Dialog */}
            <Dialog open={ruleDialogOpen} onOpenChange={setRuleDialogOpen}>
                <DialogContent className="rounded-2xl border-none p-8 max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Policy Rule</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                            <Label>Rule Name</Label>
                            <Input value={currentRule.name} onChange={e => setCurrentRule({ ...currentRule, name: e.target.value })} className="bg-slate-50" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Rule Type</Label>
                            <Select value={currentRule.type} onValueChange={(val: any) => setCurrentRule({ ...currentRule, type: val })}>
                                <SelectTrigger className="bg-slate-50"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Grace Period">Grace Period</SelectItem>
                                    <SelectItem value="Late Mark">Late Mark</SelectItem>
                                    <SelectItem value="Overtime">Overtime</SelectItem>
                                    <SelectItem value="Half Day">Half Day</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Dynamic Config Fields based on Type */}
                        {currentRule.type === 'Grace Period' && (
                            <div className="grid gap-2">
                                <Label>Grace Minutes</Label>
                                <Input type="number" value={currentRule.config?.gracePeriodMinutes || ''} onChange={e => setCurrentRule({ ...currentRule, config: { ...currentRule.config, gracePeriodMinutes: parseInt(e.target.value) } })} className="bg-slate-50" />
                            </div>
                        )}
                        {currentRule.type === 'Late Mark' && (
                            <div className="grid gap-2">
                                <Label>Mark Late After (Minutes)</Label>
                                <Input type="number" value={currentRule.config?.lateMarkAfterMinutes || ''} onChange={e => setCurrentRule({ ...currentRule, config: { ...currentRule.config, lateMarkAfterMinutes: parseInt(e.target.value) } })} className="bg-slate-50" />
                            </div>
                        )}
                        {currentRule.type === 'Overtime' && (
                            <div className="grid gap-2">
                                <Label>Pay Multiplier (e.g. 1.5)</Label>
                                <Input type="number" step="0.1" value={currentRule.config?.overtimeMultiplier || ''} onChange={e => setCurrentRule({ ...currentRule, config: { ...currentRule.config, overtimeMultiplier: parseFloat(e.target.value) } })} className="bg-slate-50" />
                            </div>
                        )}
                    </div>
                    <Button onClick={saveRule} className="bg-rose-600 text-white w-full h-12 rounded-xl font-bold">Save Policy</Button>
                </DialogContent>
            </Dialog>

            {/* Holiday Dialog */}
            <Dialog open={holidayDialogOpen} onOpenChange={setHolidayDialogOpen}>
                <DialogContent className="rounded-2xl border-none p-8 max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Add Holiday</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                            <Label>Holiday Name</Label>
                            <Input value={currentHoliday.name} onChange={e => setCurrentHoliday({ ...currentHoliday, name: e.target.value })} className="bg-slate-50" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Date</Label>
                            <Input type="date" value={currentHoliday.date} onChange={e => setCurrentHoliday({ ...currentHoliday, date: e.target.value })} className="bg-slate-50" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Type</Label>
                            <Select value={currentHoliday.type} onValueChange={(val: any) => setCurrentHoliday({ ...currentHoliday, type: val })}>
                                <SelectTrigger className="bg-slate-50"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="National">National Holiday</SelectItem>
                                    <SelectItem value="Regional">Regional Holiday</SelectItem>
                                    <SelectItem value="Optional">Optional Holiday</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={saveHoliday} className="bg-rose-600 text-white w-full h-12 rounded-xl font-bold">Add to Calendar</Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AttendanceRulesPage;
