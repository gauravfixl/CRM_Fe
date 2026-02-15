"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Clock,
    Plus,
    Edit,
    Trash2,
    Power,
    PowerOff,
    Calendar,
    Sun,
    Moon,
    Sunrise
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/components/ui/use-toast";
import { useAttendanceSettingsStore, type Shift, type AttendanceRule, type Holiday } from "@/shared/data/attendance-settings-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Checkbox } from "@/shared/components/ui/checkbox";

const AttendanceRulesPage = () => {
    const { toast } = useToast();
    const { shifts, rules, holidays, createShift, updateShift, deleteShift, createRule, updateRule, addHoliday, removeHoliday } = useAttendanceSettingsStore();
    const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false);
    const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
    const [isHolidayDialogOpen, setIsHolidayDialogOpen] = useState(false);

    const [shiftForm, setShiftForm] = useState({
        name: "",
        startTime: "09:00",
        endTime: "18:00",
        workingHours: 9,
        breakDuration: 60,
        applicableDays: [1, 2, 3, 4, 5] as number[]
    });

    const [ruleForm, setRuleForm] = useState({
        name: "",
        type: "Grace Period" as AttendanceRule['type'],
        value: 15
    });

    const [holidayForm, setHolidayForm] = useState({
        name: "",
        date: "",
        type: "National" as Holiday['type']
    });

    const handleCreateShift = () => {
        if (!shiftForm.name) {
            toast({ title: "Error", description: "Shift name is required", variant: "destructive" });
            return;
        }

        createShift({
            ...shiftForm,
            isActive: true
        });

        setIsShiftDialogOpen(false);
        setShiftForm({ name: "", startTime: "09:00", endTime: "18:00", workingHours: 9, breakDuration: 60, applicableDays: [1, 2, 3, 4, 5] });
        toast({ title: "Shift Created", description: `${shiftForm.name} has been added.` });
    };

    const handleCreateRule = () => {
        if (!ruleForm.name) {
            toast({ title: "Error", description: "Rule name is required", variant: "destructive" });
            return;
        }

        const config: AttendanceRule['config'] = {};
        if (ruleForm.type === 'Grace Period') config.gracePeriodMinutes = ruleForm.value;
        if (ruleForm.type === 'Late Mark') config.lateMarkAfterMinutes = ruleForm.value;
        if (ruleForm.type === 'Half Day') config.halfDayThresholdHours = ruleForm.value;
        if (ruleForm.type === 'Overtime') config.overtimeMultiplier = ruleForm.value / 10; // e.g., 15 = 1.5x

        createRule({
            name: ruleForm.name,
            type: ruleForm.type,
            config,
            isActive: true
        });

        setIsRuleDialogOpen(false);
        setRuleForm({ name: "", type: "Grace Period", value: 15 });
        toast({ title: "Rule Created", description: `${ruleForm.name} has been added.` });
    };

    const handleAddHoliday = () => {
        if (!holidayForm.name || !holidayForm.date) {
            toast({ title: "Error", description: "All fields are required", variant: "destructive" });
            return;
        }

        addHoliday(holidayForm);
        setIsHolidayDialogOpen(false);
        setHolidayForm({ name: "", date: "", type: "National" });
        toast({ title: "Holiday Added", description: `${holidayForm.name} has been added to calendar.` });
    };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const stats = [
        { label: "Active Shifts", value: shifts.filter(s => s.isActive).length, color: "bg-[#CB9DF0]", icon: <Clock className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Active Rules", value: rules.filter(r => r.isActive).length, color: "bg-[#F0C1E1]", icon: <Power className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Holidays", value: holidays.length, color: "bg-[#FFF9BF]", icon: <Calendar className="text-slate-800" />, textColor: "text-slate-900" },
    ];

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Attendance Rules</h1>
                    <p className="text-slate-500 font-medium">Configure shifts, grace periods, and attendance policies.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-lg rounded-[2rem] ${stat.color} p-6 flex items-center gap-4`}>
                            <div className="h-14 w-14 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-sm">
                                {stat.icon}
                            </div>
                            <div>
                                <h3 className={`text-3xl font-black ${stat.textColor}`}>{stat.value}</h3>
                                <p className={`text-xs font-bold uppercase tracking-widest ${stat.textColor} opacity-80`}>{stat.label}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Tabs defaultValue="shifts" className="w-full">
                <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                    <TabsTrigger value="shifts" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white font-bold">Shifts</TabsTrigger>
                    <TabsTrigger value="rules" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white font-bold">Rules</TabsTrigger>
                    <TabsTrigger value="holidays" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white font-bold">Holidays</TabsTrigger>
                </TabsList>

                {/* SHIFTS TAB */}
                <TabsContent value="shifts" className="space-y-6 mt-6">
                    <div className="flex justify-end">
                        <Dialog open={isShiftDialogOpen} onOpenChange={setIsShiftDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-12 px-6 shadow-lg font-bold">
                                    <Plus className="mr-2 h-5 w-5" /> Create Shift
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white rounded-[2rem] border-none p-8">
                                <DialogHeader>
                                    <DialogTitle>Create New Shift</DialogTitle>
                                    <DialogDescription>Define shift timings and working days.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-6 py-4">
                                    <div className="space-y-2">
                                        <Label>Shift Name *</Label>
                                        <Input
                                            placeholder="e.g. Evening Shift"
                                            value={shiftForm.name}
                                            onChange={e => setShiftForm({ ...shiftForm, name: e.target.value })}
                                            className="rounded-xl bg-slate-50 border-none h-12"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Start Time</Label>
                                            <Input
                                                type="time"
                                                value={shiftForm.startTime}
                                                onChange={e => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                                                className="rounded-xl bg-slate-50 border-none h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>End Time</Label>
                                            <Input
                                                type="time"
                                                value={shiftForm.endTime}
                                                onChange={e => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                                                className="rounded-xl bg-slate-50 border-none h-12"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Working Hours</Label>
                                            <Input
                                                type="number"
                                                value={shiftForm.workingHours}
                                                onChange={e => setShiftForm({ ...shiftForm, workingHours: parseInt(e.target.value) })}
                                                className="rounded-xl bg-slate-50 border-none h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Break (minutes)</Label>
                                            <Input
                                                type="number"
                                                value={shiftForm.breakDuration}
                                                onChange={e => setShiftForm({ ...shiftForm, breakDuration: parseInt(e.target.value) })}
                                                className="rounded-xl bg-slate-50 border-none h-12"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Applicable Days</Label>
                                        <div className="flex gap-2">
                                            {dayNames.map((day, idx) => (
                                                <Button
                                                    key={idx}
                                                    type="button"
                                                    variant={shiftForm.applicableDays.includes(idx) ? "default" : "outline"}
                                                    className="rounded-lg h-10 w-12 p-0 text-xs font-bold"
                                                    onClick={() => {
                                                        const days = shiftForm.applicableDays.includes(idx)
                                                            ? shiftForm.applicableDays.filter(d => d !== idx)
                                                            : [...shiftForm.applicableDays, idx];
                                                        setShiftForm({ ...shiftForm, applicableDays: days });
                                                    }}
                                                >
                                                    {day}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold" onClick={handleCreateShift}>
                                        Create Shift
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {shifts.map((shift) => (
                            <Card key={shift.id} className="border-none shadow-lg hover:shadow-xl transition-all rounded-[2rem] bg-white p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                                            {shift.name.includes('Night') ? <Moon size={20} /> : shift.name.includes('Morning') ? <Sunrise size={20} /> : <Sun size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg text-slate-900">{shift.name}</h3>
                                            <Badge className={`mt-1 ${shift.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'} border-none text-xs font-bold`}>
                                                {shift.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-400 uppercase">Timing</span>
                                        <span className="text-sm font-black text-slate-900">{shift.startTime} - {shift.endTime}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-400 uppercase">Work Hours</span>
                                        <span className="text-sm font-black text-indigo-600">{shift.workingHours}h</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-400 uppercase">Break</span>
                                        <span className="text-sm font-black text-slate-900">{shift.breakDuration} min</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-400 uppercase block mb-2">Days</span>
                                        <div className="flex gap-1">
                                            {shift.applicableDays.map(d => (
                                                <Badge key={d} className="bg-indigo-100 text-indigo-700 border-none text-[10px] font-bold">
                                                    {dayNames[d]}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 rounded-xl border-slate-200 font-bold"
                                        onClick={() => updateShift(shift.id, { isActive: !shift.isActive })}
                                    >
                                        {shift.isActive ? <PowerOff size={14} className="mr-2" /> : <Power size={14} className="mr-2" />}
                                        {shift.isActive ? 'Deactivate' : 'Activate'}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-xl text-rose-500 hover:bg-rose-50"
                                        onClick={() => {
                                            deleteShift(shift.id);
                                            toast({ title: "Shift Deleted" });
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* RULES TAB */}
                <TabsContent value="rules" className="space-y-6 mt-6">
                    <div className="flex justify-end">
                        <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-12 px-6 shadow-lg font-bold">
                                    <Plus className="mr-2 h-5 w-5" /> Create Rule
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white rounded-[2rem] border-none p-8">
                                <DialogHeader>
                                    <DialogTitle>Create Attendance Rule</DialogTitle>
                                    <DialogDescription>Define policies for attendance management.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-6 py-4">
                                    <div className="space-y-2">
                                        <Label>Rule Name *</Label>
                                        <Input
                                            placeholder="e.g. Extended Grace Period"
                                            value={ruleForm.name}
                                            onChange={e => setRuleForm({ ...ruleForm, name: e.target.value })}
                                            className="rounded-xl bg-slate-50 border-none h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Rule Type</Label>
                                        <Select value={ruleForm.type} onValueChange={(v) => setRuleForm({ ...ruleForm, type: v as AttendanceRule['type'] })}>
                                            <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Grace Period">Grace Period</SelectItem>
                                                <SelectItem value="Late Mark">Late Mark</SelectItem>
                                                <SelectItem value="Half Day">Half Day</SelectItem>
                                                <SelectItem value="Overtime">Overtime</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Value</Label>
                                        <Input
                                            type="number"
                                            placeholder={ruleForm.type === 'Overtime' ? "15 (for 1.5x)" : "Minutes/Hours"}
                                            value={ruleForm.value}
                                            onChange={e => setRuleForm({ ...ruleForm, value: parseInt(e.target.value) })}
                                            className="rounded-xl bg-slate-50 border-none h-12"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold" onClick={handleCreateRule}>
                                        Create Rule
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {rules.map((rule) => (
                            <Card key={rule.id} className="border-none shadow-lg rounded-[2rem] bg-white p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-black text-lg text-slate-900">{rule.name}</h3>
                                        <Badge className="mt-2 bg-violet-100 text-violet-700 border-none text-xs font-bold">
                                            {rule.type}
                                        </Badge>
                                    </div>
                                    <Badge className={`${rule.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'} border-none font-bold`}>
                                        {rule.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-2xl mb-4">
                                    <p className="text-sm font-bold text-slate-900">
                                        {rule.config.gracePeriodMinutes && `${rule.config.gracePeriodMinutes} minutes grace period`}
                                        {rule.config.lateMarkAfterMinutes && `Late mark after ${rule.config.lateMarkAfterMinutes} minutes`}
                                        {rule.config.halfDayThresholdHours && `Half day if < ${rule.config.halfDayThresholdHours} hours`}
                                        {rule.config.overtimeMultiplier && `${rule.config.overtimeMultiplier}x pay for overtime`}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 rounded-xl border-slate-200 font-bold"
                                        onClick={() => updateRule(rule.id, { isActive: !rule.isActive })}
                                    >
                                        {rule.isActive ? 'Deactivate' : 'Activate'}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* HOLIDAYS TAB */}
                <TabsContent value="holidays" className="space-y-6 mt-6">
                    <div className="flex justify-end">
                        <Dialog open={isHolidayDialogOpen} onOpenChange={setIsHolidayDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-12 px-6 shadow-lg font-bold">
                                    <Plus className="mr-2 h-5 w-5" /> Add Holiday
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white rounded-[2rem] border-none p-8">
                                <DialogHeader>
                                    <DialogTitle>Add Holiday</DialogTitle>
                                    <DialogDescription>Add a holiday to the calendar.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-6 py-4">
                                    <div className="space-y-2">
                                        <Label>Holiday Name *</Label>
                                        <Input
                                            placeholder="e.g. Christmas"
                                            value={holidayForm.name}
                                            onChange={e => setHolidayForm({ ...holidayForm, name: e.target.value })}
                                            className="rounded-xl bg-slate-50 border-none h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date *</Label>
                                        <Input
                                            type="date"
                                            value={holidayForm.date}
                                            onChange={e => setHolidayForm({ ...holidayForm, date: e.target.value })}
                                            className="rounded-xl bg-slate-50 border-none h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Type</Label>
                                        <Select value={holidayForm.type} onValueChange={(v) => setHolidayForm({ ...holidayForm, type: v as Holiday['type'] })}>
                                            <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="National">National</SelectItem>
                                                <SelectItem value="Regional">Regional</SelectItem>
                                                <SelectItem value="Optional">Optional</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold" onClick={handleAddHoliday}>
                                        Add Holiday
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {holidays.map((holiday) => (
                            <Card key={holiday.id} className="border-none shadow-lg rounded-[2rem] bg-white p-6 hover:shadow-xl transition-all">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="h-12 w-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600">
                                        <Calendar size={20} />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-500"
                                        onClick={() => {
                                            removeHoliday(holiday.id);
                                            toast({ title: "Holiday Removed" });
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                                <h3 className="font-black text-lg text-slate-900 mb-2">{holiday.name}</h3>
                                <p className="text-sm font-bold text-slate-500 mb-2">{new Date(holiday.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                <Badge className="bg-blue-100 text-blue-700 border-none text-xs font-bold">
                                    {holiday.type}
                                </Badge>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AttendanceRulesPage;
