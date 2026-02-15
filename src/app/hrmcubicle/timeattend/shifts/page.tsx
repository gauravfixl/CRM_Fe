"use client"

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Clock,
    Users,
    Plus,
    PlusCircle,
    LayoutGrid,
    CalendarDays,
    Settings,
    ShieldCheck,
    Download,
    Filter,
    ArrowRightLeft,
    Check,
    TrendingUp,
    AlertTriangle,
    XCircle,
    MoreHorizontal,
    Trash2,
    Save
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { useAttendanceSettingsStore, Shift, Holiday, AttendanceRule } from "@/shared/data/attendance-settings-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";

const ShiftsAdminPage = () => {
    const { toast } = useToast();
    const {
        shifts,
        holidays,
        addHoliday,
        removeHoliday,
        createShift,
        updateShift,
        deleteShift,
        rules,
        updateRule,
        roster,
        updateRoster,
        bulkAssignRoster
    } = useAttendanceSettingsStore();

    const [activeTab, setActiveTab] = useState("shifts");

    // Dialog States
    const [isHolidayOpen, setIsHolidayOpen] = useState(false);
    const [isShiftOpen, setIsShiftOpen] = useState(false);
    const [isRosterOpen, setIsRosterOpen] = useState(false);
    const [isRuleOpen, setIsRuleOpen] = useState(false);
    const [isModifySlotOpen, setIsModifySlotOpen] = useState(false);

    // Form States
    const [newHoliday, setNewHoliday] = useState<Omit<Holiday, 'id'>>({ name: "", date: "", type: "National" });
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
    const [newShift, setNewShift] = useState<Omit<Shift, 'id'>>({
        name: "",
        startTime: "09:00",
        endTime: "18:00",
        workingHours: 9,
        breakDuration: 60,
        isActive: true,
        applicableDays: [1, 2, 3, 4, 5]
    });

    const [selectedRule, setSelectedRule] = useState<AttendanceRule | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<any>(null);
    const [targetShiftId, setTargetShiftId] = useState("");

    const handleHolidaySubmit = () => {
        if (!newHoliday.name || !newHoliday.date) return;
        addHoliday(newHoliday);
        setIsHolidayOpen(false);
        setNewHoliday({ name: "", date: "", type: "National" });
        toast({ title: "Holiday Added", description: "The new holiday has been saved to the calendar." });
    };

    const handleShiftSubmit = () => {
        if (!newShift.name) return;
        if (selectedShift) {
            updateShift(selectedShift.id, newShift);
            toast({ title: "Shift Updated", description: `${newShift.name} has been modified successfully.` });
        } else {
            createShift(newShift);
            toast({ title: "Shift Created", description: `New shift "${newShift.name}" is now active.` });
        }
        setIsShiftOpen(false);
        setSelectedShift(null);
    };

    const handleRuleToggle = (ruleId: string, current: boolean) => {
        updateRule(ruleId, { isActive: !current });
        toast({ title: "Rule Updated", description: "System configuration changed successfully." });
    };

    const handleRosterUpdate = () => {
        if (!selectedStaff || !targetShiftId) return;
        updateRoster(selectedStaff.id, targetShiftId);
        setIsModifySlotOpen(false);
        toast({ title: "Roster Updated", description: `${selectedStaff.name} is now assigned to the selected shift.` });
    };

    const handleBulkRoster = () => {
        if (!targetShiftId) return;
        bulkAssignRoster(roster.map(r => r.id), targetShiftId);
        setIsRosterOpen(false);
        toast({ title: "Bulk Update Done", description: `All staff members moved to ${shifts.find(s => s.id === targetShiftId)?.name}.` });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] overflow-x-hidden overflow-y-auto">
            <div style={{
                zoom: '0.75',
                width: '100%',
            }} className="p-12 space-y-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 pb-2 border-b border-slate-100">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tighter capitalize">Shifts & Compliance</h1>
                        <p className="text-slate-500 font-bold text-base mt-0.5 ml-1">HR Admin: Configure rosters, holiday calendars, and shift logic.</p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="rounded-xl font-bold border-slate-200 h-14 px-8"
                            onClick={() => toast({ title: "Global Settings", description: "Redirecting to organization-wide policy dashboard..." })}
                        >
                            Global settings
                        </Button>
                        <Button
                            className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl font-bold h-14 px-10 shadow-2xl shadow-purple-200"
                            onClick={() => setIsRosterOpen(true)}
                        >
                            <ArrowRightLeft size={18} className="mr-2" /> Bulk shift reassignment
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl gap-2 h-auto flex justify-start items-center max-w-fit border border-slate-200">
                        {[
                            { id: "shifts", label: "Shift Types", icon: <Clock size={16} /> },
                            { id: "roster", label: "Live Roster", icon: <LayoutGrid size={16} /> },
                            { id: "holidays", label: "Holiday Deck", icon: <CalendarDays size={16} /> },
                            { id: "rules", label: "System Rules", icon: <ShieldCheck size={16} /> }
                        ].map(tab => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className="px-8 py-3 rounded-xl font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#CB9DF0] data-[state=active]:shadow-sm transition-all flex items-center gap-2"
                            >
                                {tab.icon} {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* Content: Shift Types */}
                    <TabsContent value="shifts" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {shifts.map((shift, i) => (
                                <motion.div key={shift.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                    <Card className="border border-slate-100 shadow-2xl rounded-[3rem] bg-white overflow-hidden p-0 group h-full flex flex-col">
                                        <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{shift.name}</h3>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-300 hover:text-rose-500" onClick={() => deleteShift(shift.id)}>
                                                    <Trash2 size={16} />
                                                </Button>
                                                <Badge className="bg-white text-[#CB9DF0] border-slate-200 px-3 py-1 font-bold">Active</Badge>
                                            </div>
                                        </div>
                                        <div className="p-8 space-y-6 flex-1 flex flex-col">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Start time</p>
                                                    <p className="font-bold text-slate-900 text-lg">{shift.startTime}</p>
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">End time</p>
                                                    <p className="font-bold text-slate-900 text-lg">{shift.endTime}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm font-bold text-slate-500 bg-purple-50 p-4 rounded-2xl">
                                                <div className="flex items-center gap-2 text-[#9d5ccf]">
                                                    <Calendar size={16} /> {shift.applicableDays.length === 7 ? 'Full Week' : 'Mon - Fri'}
                                                </div>
                                                <span>{shift.workingHours}h Coverage</span>
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="w-full h-14 rounded-2xl border-slate-200 font-bold hover:bg-[#CB9DF0] hover:text-white transition-all mt-auto"
                                                onClick={() => {
                                                    setSelectedShift(shift);
                                                    setNewShift(shift);
                                                    setIsShiftOpen(true);
                                                }}
                                            >
                                                Configurate Shift
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                            <button
                                onClick={() => {
                                    setSelectedShift(null);
                                    setNewShift({ name: "", startTime: "09:00", endTime: "18:00", workingHours: 9, breakDuration: 60, isActive: true, applicableDays: [1, 2, 3, 4, 5] });
                                    setIsShiftOpen(true);
                                }}
                                className="border-4 border-dashed border-slate-100 rounded-[3.5rem] p-8 min-h-[400px] flex flex-col items-center justify-center text-slate-300 hover:border-[#CB9DF0]/50 hover:text-[#CB9DF0] transition-all group shadow-sm bg-white"
                            >
                                <PlusCircle size={64} className="mb-4 group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-xl uppercase tracking-tighter">Add shift logic</span>
                            </button>
                        </div>
                    </TabsContent>

                    {/* Content: Roster */}
                    <TabsContent value="roster">
                        <Card className="border border-slate-200 shadow-2xl rounded-[3rem] bg-white overflow-hidden p-0">
                            <div className="bg-slate-50/50 px-8 border-b border-slate-100">
                                <div className="grid grid-cols-5 py-8 font-bold text-xs uppercase tracking-widest text-slate-400">
                                    <div className="col-span-2">Staff member</div>
                                    <div>Department</div>
                                    <div>Allocated shift</div>
                                    <div className="text-right">Roster audit</div>
                                </div>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {roster.map((staff, i) => {
                                    const currentShift = shifts.find(s => s.id === staff.currentShiftId);
                                    return (
                                        <motion.div key={staff.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="grid grid-cols-5 p-8 items-center group hover:bg-slate-50/50 transition-colors">
                                            <div className="col-span-2 flex items-center gap-4">
                                                <Avatar className="h-14 w-14 rounded-2xl shadow-xl border-4 border-white">
                                                    <AvatarFallback className="bg-purple-100 text-purple-600 font-bold">{staff.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-xl tracking-tight leading-tight">{staff.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400">{staff.id}</p>
                                                </div>
                                            </div>
                                            <div className="font-bold text-slate-500">{staff.dept}</div>
                                            <div>
                                                <Badge className={`px-4 py-2 rounded-xl font-bold shadow-sm border-none bg-indigo-50 text-indigo-700`}>
                                                    {currentShift?.name || 'Unassigned'}
                                                </Badge>
                                            </div>
                                            <div className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    className="h-10 px-4 rounded-xl text-indigo-600 font-bold hover:bg-indigo-50"
                                                    onClick={() => {
                                                        setSelectedStaff(staff);
                                                        setTargetShiftId(staff.currentShiftId);
                                                        setIsModifySlotOpen(true);
                                                    }}
                                                >
                                                    Modify slot
                                                </Button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Content: Holidays */}
                    <TabsContent value="holidays">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            <div className="lg:col-span-8">
                                <Card className="border border-slate-200 shadow-2xl rounded-[3rem] bg-white overflow-hidden p-0">
                                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                        <h3 className="font-bold text-xl text-slate-900">2026 Statutory Holidays</h3>
                                        <Button
                                            size="sm"
                                            className="bg-slate-900 text-white rounded-xl h-10 px-6 font-bold"
                                            onClick={() => setIsHolidayOpen(true)}
                                        >
                                            Add holiday
                                        </Button>
                                    </div>
                                    <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto no-scrollbar">
                                        {holidays.length === 0 ? (
                                            <div className="p-20 text-center text-slate-300 font-bold italic">No holidays configured for 2026.</div>
                                        ) : holidays.map(h => (
                                            <div key={h.id} className="p-8 flex justify-between items-center group hover:bg-slate-50/50 transition-colors">
                                                <div className="flex items-center gap-6">
                                                    <div className="h-16 w-16 bg-white shadow-xl rounded-[1.5rem] flex flex-col items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                                                        <span className="text-xs font-bold text-rose-500 uppercase">{new Date(h.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                                                        <span className="text-xl font-bold text-slate-900 leading-none">{new Date(h.date).getDate()}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-xl tracking-tight leading-tight">{h.name}</p>
                                                        <Badge className="bg-slate-100 text-slate-400 border-none text-[9px] uppercase tracking-widest mt-1">{h.type}</Badge>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-12 w-12 rounded-xl text-slate-200 hover:text-rose-500 hover:bg-rose-50 transition-all"
                                                    onClick={() => {
                                                        removeHoliday(h.id);
                                                        toast({ title: "Holiday Removed", description: `${h.name} has been deleted.`, variant: "destructive" });
                                                    }}
                                                >
                                                    <XCircle size={20} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                            <div className="lg:col-span-4 space-y-8">
                                <Card className="p-8 border-none bg-indigo-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                                    <h3 className="text-2xl font-bold tracking-tight mb-4 leading-tight">Regional settings</h3>
                                    <p className="text-indigo-200 text-sm mb-8 font-medium opacity-80">Configure holidays based on office location or regional compliance zones.</p>
                                    <div className="space-y-3 relative z-10">
                                        {["India - Delhi NCR", "India - Bangalore", "USA - Texas"].map(loc => (
                                            <div key={loc} className="flex justify-between items-center p-5 bg-white/10 rounded-2xl backdrop-blur-sm group cursor-pointer hover:bg-white/20 transition-all border border-white/5">
                                                <span className="font-bold text-sm tracking-tight">{loc}</span>
                                                <div className="h-6 w-6 rounded-lg bg-emerald-500 flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform">
                                                    <Check size={14} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="absolute -bottom-10 -left-10 h-40 w-40 bg-indigo-500 rounded-full blur-3xl opacity-20" />
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <Settings size={120} />
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Content: Rules */}
                    <TabsContent value="rules">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {rules.map((rule, idx) => (
                                <Card key={rule.id} className="p-8 border border-slate-100 shadow-xl rounded-[2.5rem] bg-white group hover:shadow-2xl transition-all flex flex-col justify-between h-full">
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-[#CB9DF0]/10 transition-colors">
                                                {rule.type === 'Grace Period' ? <Clock className="text-[#CB9DF0]" /> :
                                                    rule.type === 'Overtime' ? <TrendingUp className="text-emerald-500" /> :
                                                        rule.type === 'Weekly Off' ? <CalendarDays className="text-indigo-500" /> :
                                                            <ShieldCheck className="text-amber-500" />}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge className={`border-none rounded-lg px-4 py-1.5 font-bold uppercase text-[9px] ${rule.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                    {rule.isActive ? 'Enabled' : 'Disabled'}
                                                </Badge>
                                                <Switch
                                                    checked={rule.isActive}
                                                    onCheckedChange={() => handleRuleToggle(rule.id, rule.isActive)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1 mb-8">
                                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">{rule.name}</h3>
                                            <p className="text-slate-500 font-bold text-sm opacity-80">Automatic system logic for {rule.type.toLowerCase()} threshold.</p>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                                        <span className="text-3xl font-bold text-[#9d5ccf] tracking-tighter">
                                            {rule.type === 'Grace Period' ? `${rule.config.gracePeriodMinutes} mins` :
                                                rule.type === 'Overtime' ? `${rule.config.overtimeMultiplier}x Pay` :
                                                    rule.type === 'Weekly Off' ? 'Sat - Sun' : 'Active'}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-12 w-12 rounded-xl text-slate-200 hover:text-[#CB9DF0] hover:bg-slate-50 transition-all"
                                            onClick={() => {
                                                setSelectedRule(rule);
                                                setIsRuleOpen(true);
                                            }}
                                        >
                                            <Settings size={20} />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* --- Dialogs --- */}

                {/* Holiday Dialog */}
                <Dialog open={isHolidayOpen} onOpenChange={setIsHolidayOpen}>
                    <DialogContent className="bg-white rounded-[2.5rem] border-none p-10 max-w-md shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Register new holiday</DialogTitle>
                            <DialogDescription className="font-bold text-slate-400 text-sm">Add statutory holidays to the 2026 corporate calendar.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 py-6 font-sans">
                            <div className="space-y-2">
                                <Label className="font-bold ml-1 text-slate-600">Event name</Label>
                                <Input
                                    placeholder="e.g. Diwali Pooja"
                                    className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold text-lg"
                                    value={newHoliday.name}
                                    onChange={e => setNewHoliday({ ...newHoliday, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold ml-1 text-slate-600">Calendar date</Label>
                                <Input
                                    type="date"
                                    className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold text-lg"
                                    value={newHoliday.date}
                                    onChange={e => setNewHoliday({ ...newHoliday, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold ml-1 text-slate-600">Holiday type</Label>
                                <Select value={newHoliday.type} onValueChange={(v: any) => setNewHoliday({ ...newHoliday, type: v })}>
                                    <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold px-6 text-lg">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                                        <SelectItem value="National">National statutory</SelectItem>
                                        <SelectItem value="Regional">Regional / State</SelectItem>
                                        <SelectItem value="Optional">Optional / Floating</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button className="w-full h-16 bg-slate-900 text-white rounded-[1.5rem] font-bold text-xl shadow-2xl shadow-slate-200 tracking-tight" onClick={handleHolidaySubmit}>Save holiday record</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Shift Dialog */}
                <Dialog open={isShiftOpen} onOpenChange={setIsShiftOpen}>
                    <DialogContent className="bg-white rounded-[2.5rem] border-none p-10 max-w-lg shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">{selectedShift ? 'Configure shift logic' : 'Create new shift'}</DialogTitle>
                            <DialogDescription className="font-bold text-slate-400 text-sm">Define working hours and operational window for this shift.</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                            <div className="space-y-2 md:col-span-2">
                                <Label className="font-bold ml-1 text-slate-600">Shift name</Label>
                                <Input
                                    placeholder="e.g. Asia-Pac Morning"
                                    className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold text-lg"
                                    value={newShift.name}
                                    onChange={e => setNewShift({ ...newShift, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold ml-1 text-slate-600">Start time</Label>
                                <Input
                                    type="time"
                                    className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold text-lg text-center"
                                    value={newShift.startTime}
                                    onChange={e => setNewShift({ ...newShift, startTime: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold ml-1 text-slate-600">End time</Label>
                                <Input
                                    type="time"
                                    className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold text-lg text-center"
                                    value={newShift.endTime}
                                    onChange={e => setNewShift({ ...newShift, endTime: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold ml-1 text-slate-600">Working hours</Label>
                                <Input
                                    type="number"
                                    className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold text-lg"
                                    value={newShift.workingHours}
                                    onChange={e => setNewShift({ ...newShift, workingHours: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold ml-1 text-slate-600">Break duration (mins)</Label>
                                <Input
                                    type="number"
                                    className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold text-lg"
                                    value={newShift.breakDuration}
                                    onChange={e => setNewShift({ ...newShift, breakDuration: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button className="w-full h-16 bg-[#CB9DF0] text-white rounded-[1.5rem] font-bold text-xl shadow-2xl shadow-purple-100 tracking-tight" onClick={handleShiftSubmit}>
                                {selectedShift ? 'Update configuration' : 'Enable new shift'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Bulk Roster Dialog */}
                <Dialog open={isRosterOpen} onOpenChange={setIsRosterOpen}>
                    <DialogContent className="bg-white rounded-[2.5rem] border-none p-10 max-w-md shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Bulk shift assignment</DialogTitle>
                            <DialogDescription className="font-bold text-slate-400 text-sm">Reassign entire team to a different operational shift.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-8 py-8">
                            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                                <p className="font-bold text-indigo-700 text-xs uppercase tracking-widest mb-1">Team impact</p>
                                <p className="text-indigo-900 font-bold text-2xl tracking-tight leading-none">{roster.length} staff members</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold ml-1 text-slate-600">Target operational shift</Label>
                                <Select value={targetShiftId} onValueChange={setTargetShiftId}>
                                    <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold px-6 text-lg">
                                        <SelectValue placeholder="Select target shift" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                                        {shifts.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.startTime}-{s.endTime})</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button
                                className="w-full h-16 bg-indigo-600 text-white rounded-[1.5rem] font-bold text-xl shadow-2xl shadow-indigo-100 tracking-tight"
                                onClick={handleBulkRoster}
                            >
                                Execute reassignment
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Modify Individual Slot Dialog */}
                <Dialog open={isModifySlotOpen} onOpenChange={setIsModifySlotOpen}>
                    <DialogContent className="bg-white rounded-[2.5rem] border-none p-10 max-w-md shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Modify staff slot</DialogTitle>
                            <DialogDescription className="font-bold text-slate-400 text-sm">Change individual shift assignment for {selectedStaff?.name}.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-8 py-8">
                            <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <Avatar className="h-14 w-14 rounded-2xl shadow-lg border-4 border-white">
                                    <AvatarFallback className="bg-purple-100 text-purple-600 font-bold">{selectedStaff?.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-slate-900 text-lg leading-tight">{selectedStaff?.name}</p>
                                    <p className="text-xs font-bold text-slate-400">{selectedStaff?.id} • {selectedStaff?.dept}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold ml-1 text-slate-600">Assign to shift</Label>
                                <Select value={targetShiftId} onValueChange={setTargetShiftId}>
                                    <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold px-6 text-lg">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                                        {shifts.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button
                                className="w-full h-16 bg-slate-900 text-white rounded-[1.5rem] font-bold text-xl shadow-2xl shadow-slate-200 tracking-tight"
                                onClick={handleRosterUpdate}
                            >
                                Save slot update
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Rule Config Dialog */}
                <Dialog open={isRuleOpen} onOpenChange={setIsRuleOpen}>
                    <DialogContent className="bg-white rounded-[2.5rem] border-none p-10 max-w-md shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">System rule config</DialogTitle>
                            <DialogDescription className="font-bold text-slate-400 text-sm">Adjust global threshold for {selectedRule?.name}.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-8 py-8">
                            <div className="space-y-2">
                                <Label className="font-bold ml-1 text-slate-600">Configure value</Label>
                                <div className="relative group">
                                    <Input
                                        type="number"
                                        className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold text-2xl text-[#CB9DF0]"
                                        defaultValue={selectedRule?.config.gracePeriodMinutes || selectedRule?.config.overtimeMultiplier || ""}
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                                        {selectedRule?.type === 'Grace Period' ? 'Mins' : 'Multiplier'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button
                                className="w-full h-16 bg-[#CB9DF0] text-white rounded-[1.5rem] font-bold text-xl shadow-2xl shadow-purple-100 tracking-tight"
                                onClick={() => {
                                    setIsRuleOpen(false);
                                    toast({ title: "Rule Optimized", description: "Global attendance logic has been successfully calibrated." });
                                }}
                            >
                                <Save size={20} className="mr-2" /> Synchronize rule
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
};

export default ShiftsAdminPage;
