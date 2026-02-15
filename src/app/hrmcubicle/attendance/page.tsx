"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Calendar as CalendarIcon,
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Plus,
    History,
    FileEdit,
    LogIn,
    LogOut,
    Check,
    ChevronLeft,
    ChevronRight,
    Briefcase,
    Plane,
    Info,
    LayoutGrid,
    List
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/components/ui/use-toast";
import { useMeStore } from "@/shared/data/me-store";
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
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

const MyAttendancePage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const { attendance, checkIn, checkOut } = useMeStore();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
    const [isRegularizeOpen, setIsRegularizeOpen] = useState(false);
    const [regularizeForm, setRegularizeForm] = useState({
        date: new Date().toISOString().split('T')[0],
        checkIn: '',
        checkOut: '',
        reason: ''
    });

    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();

    // Filter logs for selected month
    const myLogs = attendance.logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
    });

    // Generate calendar days
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    // --- DYNAMIC STATS CALCULATION ---
    let presentDays = 0;
    let absentDays = 0;
    let halfDays = 0;
    let totalHours = 0;
    const now = new Date();

    for (let d = 1; d <= daysInMonth; d++) {
        // Create date objects for comparison (ignoring time)
        const dDate = new Date(currentYear, currentMonth, d);
        const checkDate = new Date(dDate.getFullYear(), dDate.getMonth(), dDate.getDate());
        const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const isFuture = checkDate > todayDate;
        const isToday = checkDate.getTime() === todayDate.getTime();
        const isWeekend = dDate.getDay() === 0 || dDate.getDay() === 6;

        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const log = myLogs.find(l => l.date === dateStr);

        if (log) {
            // Explicit log exists
            if (['Present', 'On-Time', 'Late'].includes(log.status)) presentDays++;
            if (log.status === 'Half Day') halfDays++;
            if (log.status === 'Absent') absentDays++;

            const hours = parseFloat(log.totalHours?.replace('h', '') || '0');
            totalHours += (isNaN(hours) ? 0 : hours);
        } else {
            // No log exists
            if (!isFuture && !isToday && !isWeekend) {
                // IMPLICIT ABSENCE: Past weekday with no log
                absentDays++;
            }
        }
    }

    const stats = [
        { label: "Present Days", value: presentDays, gradient: "from-emerald-100 via-teal-100 to-emerald-100", border: "border-emerald-200", iconBox: "bg-white/60", icon: <CheckCircle2 className="text-emerald-700" />, textColor: "text-emerald-900" },
        { label: "Total Hours", value: `${totalHours.toFixed(1)}h`, gradient: "from-indigo-100 via-blue-100 to-indigo-100", border: "border-indigo-200", iconBox: "bg-white/60", icon: <Clock className="text-indigo-700" />, textColor: "text-indigo-900" },
        { label: "Absent Days", value: absentDays, gradient: "from-rose-100 via-pink-100 to-rose-100", border: "border-rose-200", iconBox: "bg-white/60", icon: <XCircle className="text-rose-700" />, textColor: "text-rose-900" },
        { label: "Half Days", value: halfDays, gradient: "from-amber-100 via-orange-100 to-amber-100", border: "border-amber-200", iconBox: "bg-white/60", icon: <AlertTriangle className="text-amber-700" />, textColor: "text-amber-900" },
    ];



    // Create calendar grid
    const calendarDays = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null);
    }
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    const getAttendanceForDay = (day: number) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return myLogs.find(log => log.date === dateStr);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Present':
            case 'On-Time': return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case 'Absent': return "bg-rose-100 text-rose-700 border-rose-200";
            case 'Half Day': return "bg-amber-100 text-amber-700 border-amber-200";
            case 'Late': return "bg-orange-100 text-orange-700 border-orange-200";
            default: return "bg-slate-100 text-slate-500 border-slate-200";
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Present':
            case 'On-Time': return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 shadow-none hover:bg-emerald-200">Present</Badge>;
            case 'Absent': return <Badge className="bg-rose-100 text-rose-700 border-rose-200 shadow-none hover:bg-rose-200">Absent</Badge>;
            case 'Half Day': return <Badge className="bg-amber-100 text-amber-700 border-amber-200 shadow-none hover:bg-amber-200">Half Day</Badge>;
            case 'Late': return <Badge className="bg-orange-100 text-orange-700 border-orange-200 shadow-none hover:bg-orange-200">Late</Badge>;
            default: return <Badge className="bg-slate-100 text-slate-500 border-slate-200 shadow-none hover:bg-slate-200">No Data</Badge>;
        }
    };

    const handleCheckInAction = () => {
        checkIn();
        toast({ title: "Checked In", description: `You checked in at ${new Date().toLocaleTimeString()}`, variant: "default" });
    };

    const handleCheckOutAction = () => {
        checkOut();
        toast({ title: "Checked Out", description: "Successfully checked out for the day.", variant: "default" });
    };

    const handleRegularizeRequest = (dateStr?: string) => {
        setRegularizeForm({
            date: dateStr || new Date().toISOString().split('T')[0],
            checkIn: '',
            checkOut: '',
            reason: ''
        });
        setIsRegularizeOpen(true);
    };

    const handleRegularizeSubmit = () => {
        if (!regularizeForm.date || !regularizeForm.checkIn || !regularizeForm.reason) {
            toast({ title: "Error", description: "Date, Check-in and Reason are required", variant: "destructive" });
            return;
        }
        setIsRegularizeOpen(false);
        setRegularizeForm({ date: new Date().toISOString().split('T')[0], checkIn: '', checkOut: '', reason: '' });
        toast({ title: "Request Submitted", description: "Regularization request sent to your manager." });
    };

    const goToPreviousMonth = () => {
        setSelectedDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const goToNextMonth = () => {
        setSelectedDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const goToCurrentMonth = () => {
        setSelectedDate(new Date());
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const isCurrentMonth = currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();

    return (
        <div className="flex-1 min-h-screen bg-[#f8fafc] p-6 space-y-6" style={{ zoom: "80%" }}>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Attendance</h1>
                    <p className="text-slate-500 text-sm font-medium">Track your daily attendance and work hours.</p>
                </div>

                <div className="flex items-center gap-4">
                    <Dialog open={isRegularizeOpen} onOpenChange={setIsRegularizeOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="rounded-xl h-12 px-6 font-bold border-slate-200 transition-all hover:bg-white hover:border-indigo-400 hover:text-indigo-600 shadow-sm">
                                <FileEdit className="mr-2 h-5 w-5" /> Regularize Attendance
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-[2rem] border-0 shadow-2xl p-0 max-w-xl overflow-hidden outline-none ring-1 ring-slate-200">
                            <div className="p-8 pb-6 bg-slate-900 text-white relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16" />
                                <DialogHeader className="relative z-10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-10 w-10 bg-indigo-500/30 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10">
                                            <FileEdit size={20} className="text-white" />
                                        </div>
                                        <Badge className="bg-indigo-500 text-white border-none text-[10px] font-black tracking-widest px-3 h-5">ADMIN REVIEW REQUIRED</Badge>
                                    </div>
                                    <DialogTitle className="text-2xl font-black tracking-tight text-white capitalize">Record Correction</DialogTitle>
                                    <DialogDescription className="text-slate-400 font-medium">Please provide accurate timestamps and a valid justification.</DialogDescription>
                                </DialogHeader>
                            </div>

                            <div className="p-8 grid gap-6 bg-white">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Applied Date *</Label>
                                    <Input
                                        type="date"
                                        value={regularizeForm.date}
                                        onChange={e => setRegularizeForm({ ...regularizeForm, date: e.target.value })}
                                        className="rounded-xl bg-slate-50 border-slate-200 h-12 font-bold focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Shift Start *</Label>
                                        <div className="relative">
                                            <LogIn className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <Input
                                                type="time"
                                                value={regularizeForm.checkIn}
                                                onChange={e => setRegularizeForm({ ...regularizeForm, checkIn: e.target.value })}
                                                className="rounded-xl bg-slate-50 border-slate-200 h-12 pl-10 font-bold focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Shift End *</Label>
                                        <div className="relative">
                                            <LogOut className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <Input
                                                type="time"
                                                value={regularizeForm.checkOut}
                                                onChange={e => setRegularizeForm({ ...regularizeForm, checkOut: e.target.value })}
                                                className="rounded-xl bg-slate-50 border-slate-200 h-12 pl-10 font-bold focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Correction Reason *</Label>
                                    <Textarea
                                        placeholder="Detailed explanation for the discrepancy..."
                                        value={regularizeForm.reason}
                                        onChange={e => setRegularizeForm({ ...regularizeForm, reason: e.target.value })}
                                        className="rounded-xl bg-slate-50 border-slate-200 min-h-[120px] font-medium p-4 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all resize-none shadow-inner"
                                    />
                                </div>
                            </div>
                            <DialogFooter className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                                <Button variant="ghost" onClick={() => setIsRegularizeOpen(false)} className="rounded-xl h-12 px-6 font-bold text-slate-500 hover:bg-slate-200">Cancel</Button>
                                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 font-black shadow-xl shadow-indigo-100 uppercase tracking-widest text-xs" onClick={handleRegularizeSubmit}>
                                    Send for Approval
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button
                        onClick={attendance.isCheckedIn ? handleCheckOutAction : handleCheckInAction}
                        className={`rounded-xl h-12 px-8 font-bold shadow-lg transition-all ${attendance.isCheckedIn ? 'bg-rose-500 hover:bg-rose-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white border-none`}
                    >
                        {attendance.isCheckedIn ? (
                            <><LogOut className="mr-2 h-5 w-5" /> Check Out</>
                        ) : (
                            <><LogIn className="mr-2 h-5 w-5" /> Check In</>
                        )}
                    </Button>
                </div>
            </div>

            {/* Check-in Info */}
            {attendance.isCheckedIn && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                    <Card className="border border-emerald-200 shadow-sm bg-emerald-100 p-4 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                <Check className="text-emerald-600" size={20} />
                            </div>
                            <p className="font-bold text-emerald-900">Active Session: Started at {attendance.checkInTime}</p>
                        </div>
                        <Badge className="bg-emerald-200 text-emerald-700 border-none">Online</Badge>
                    </Card>
                </motion.div>
            )}

            {/* 1. Top Stats Row (Full Width) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`bg-gradient-to-br ${stat.gradient} border ${stat.border} shadow-sm rounded-2xl p-4 flex flex-col justify-between h-full hover:shadow-md transition-all group`}>
                            <div className="flex justify-between items-start mb-2">
                                <div className={`h-8 w-8 ${stat.iconBox} rounded-lg flex items-center justify-center backdrop-blur-sm`}>
                                    {React.cloneElement(stat.icon as React.ReactElement, { size: 16 })}
                                </div>
                            </div>
                            <div>
                                <p className={`text-[10px] font-bold capitalize tracking-wide ${stat.textColor} opacity-60 mb-1`}>{stat.label}</p>
                                <h3 className={`text-xl font-black ${stat.textColor} tracking-tight leading-none`}>{stat.value}</h3>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* 2. Main Split Layout (Calendar vs Sidebar) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

                {/* Left Column: Calendar (75%) */}
                <div className="xl:col-span-9 space-y-6">
                    {/* Content Card (Calendar or List) */}
                    <Card className="border-none shadow-sm rounded-2xl bg-white p-6 w-full">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900 font-sans tracking-tight">Monthly Overview</h2>

                            <div className="flex items-center gap-4">
                                {/* View Toggles */}
                                <div className="bg-slate-100 p-1 rounded-xl flex items-center">
                                    <button
                                        onClick={() => setViewMode('calendar')}
                                        className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        <LayoutGrid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        <List size={18} />
                                    </button>
                                </div>

                                <div className="h-6 w-px bg-slate-200" />

                                <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1">
                                    <Button
                                        onClick={goToPreviousMonth}
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 rounded-lg hover:bg-white"
                                    >
                                        <ChevronLeft size={18} />
                                    </Button>
                                    <span className="text-sm font-bold text-slate-900 px-3 min-w-[140px] text-center">
                                        {monthNames[currentMonth]} {currentYear}
                                    </span>
                                    <Button
                                        onClick={goToNextMonth}
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 rounded-lg hover:bg-white"
                                    >
                                        <ChevronRight size={18} />
                                    </Button>
                                    {!isCurrentMonth && (
                                        <Button
                                            onClick={goToCurrentMonth}
                                            variant="ghost"
                                            className="h-8 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 px-2"
                                        >
                                            Today
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {viewMode === 'calendar' ? (
                            <>
                                {/* Calendar Grid - Dynamic */}
                                <div className="grid grid-cols-7 gap-1.5 mb-2">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                        <div key={day} className="text-center py-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{day}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1.5">
                                    {calendarDays.map((day, index) => {
                                        if (day === null) {
                                            return <div key={`empty-${index}`} className="h-14" />;
                                        }

                                        const attendanceData = getAttendanceForDay(day);
                                        const today = new Date();
                                        const currentDate = new Date(currentYear, currentMonth, day);
                                        const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                                        const isFutureDate = currentDate > today;
                                        const hasAttendance = !!attendanceData;

                                        // Determine cell styling based on conditions
                                        let cellStyle = '';
                                        let textStyle = '';

                                        if (isToday) {
                                            cellStyle = 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200';
                                            textStyle = 'text-indigo-700';
                                        } else if (hasAttendance) {
                                            cellStyle = getStatusColor(attendanceData.status);
                                            textStyle = '';
                                        } else if (isFutureDate) {
                                            cellStyle = 'border-slate-100 bg-slate-50/30';
                                            textStyle = 'text-slate-300';
                                        } else {
                                            // Handling Past Dates with No Data
                                            const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
                                            if (isWeekend) {
                                                cellStyle = 'border-slate-100 bg-slate-50 text-slate-300';
                                            } else {
                                                // Implicit Absence (Past Weekday, No Log)
                                                cellStyle = 'bg-rose-50 text-rose-700 border-rose-200';
                                                textStyle = 'text-rose-700';
                                            }
                                        }

                                        return (
                                            <div
                                                key={day}
                                                className={`h-14 rounded-lg border-2 p-1.5 flex flex-col items-center justify-center transition-all ${hasAttendance || isToday ? 'hover:shadow-md cursor-pointer' : 'cursor-default'
                                                    } ${cellStyle}`}
                                                title={
                                                    attendanceData
                                                        ? `${attendanceData.status} - ${attendanceData.totalHours}`
                                                        : isFutureDate
                                                            ? 'Future date'
                                                            : 'No attendance data'
                                                }
                                            >
                                                <span className={`text-xs font-bold mb-0.5 ${textStyle}`}>
                                                    {day}
                                                </span>
                                                {hasAttendance && (
                                                    <div className="text-center">
                                                        <div className="text-[8px] font-bold opacity-70">
                                                            {attendanceData.totalHours}
                                                        </div>
                                                        {attendanceData.checkIn && (
                                                            <div className="text-[7px] opacity-60">
                                                                {attendanceData.checkIn}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {!hasAttendance && !isFutureDate && !isToday && (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) && (
                                                    <div className="text-[7px] text-rose-400 font-bold opacity-70">
                                                        Absent
                                                    </div>
                                                )}
                                                {!hasAttendance && (currentDate.getDay() === 0 || currentDate.getDay() === 6) && (
                                                    <div className="text-[7px] text-slate-400 opacity-50">Weekend</div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead className="bg-[#f8fafc] text-[10px] text-slate-500 uppercase font-black tracking-widest border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4">Date & Day</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Effective Shift</th>
                                            <th className="px-6 py-4">In / Out</th>
                                            <th className="px-6 py-4 bg-indigo-50/30 text-indigo-700">Effective Hrs</th>
                                            <th className="px-6 py-4 text-right">Self Service</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                                            const today = new Date();
                                            const currentDate = new Date(currentYear, currentMonth, day);
                                            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                            const attendanceData = getAttendanceForDay(day);
                                            const isFutureDate = currentDate > today;
                                            const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                                            const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;

                                            // Determine data to show
                                            let status: string | undefined = attendanceData?.status;
                                            if (!status) {
                                                if (isFutureDate) status = '';
                                                else if (isWeekend) status = 'Weekend';
                                                else status = 'Absent';
                                            }

                                            if (!attendanceData && !isFutureDate && !isWeekend && !isToday) status = 'Absent';
                                            if (!attendanceData && isToday) status = 'No Data';

                                            if (isFutureDate) return null;

                                            return (
                                                <tr key={day} className={`group hover:bg-slate-50/50 transition-all ${isToday ? 'bg-indigo-50/30' : ''}`}>
                                                    <td className="px-6 py-3.5 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-10 w-10 rounded-xl flex flex-col items-center justify-center font-bold border ${isToday ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-400 border-slate-200 group-hover:border-indigo-200 group-hover:text-indigo-600'}`}>
                                                                <span className="text-xs leading-none">{day}</span>
                                                                <span className="text-[7px] uppercase tracking-tighter opacity-70">
                                                                    {currentDate.toLocaleDateString('en-US', { weekday: 'short' })}
                                                                </span>
                                                            </div>
                                                            <div className="text-start">
                                                                <span className={`block font-bold text-[11px] ${isToday ? 'text-indigo-600' : 'text-slate-700'}`}>
                                                                    {currentDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3.5">
                                                        {status === 'Weekend' ? (
                                                            <Badge variant="outline" className="border-slate-200 text-slate-400 bg-slate-50/50 text-[9px] font-bold tracking-tight">WEEKEND</Badge>
                                                        ) : status ? (
                                                            <div className="scale-90 origin-left">{getStatusBadge(status)}</div>
                                                        ) : (
                                                            <span className="text-slate-400 text-xs">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-3.5">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] font-bold text-slate-800">General Shift</span>
                                                            <span className="text-[9px] font-medium text-slate-400">09:00 AM - 06:00 PM</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3.5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-black text-slate-700">{attendanceData?.checkIn || '--:--'}</span>
                                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">In Time</span>
                                                            </div>
                                                            <ArrowRight size={10} className="text-slate-300" />
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-black text-slate-700">{attendanceData?.checkOut || '--:--'}</span>
                                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Out Time</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3.5 bg-indigo-50/20">
                                                        <div className="flex items-center gap-1.5">
                                                            <Badge className="bg-white border border-indigo-100 text-indigo-700 font-black text-[10px] px-2 py-0.5 shadow-sm">
                                                                {attendanceData?.totalHours || '0.0h'}
                                                            </Badge>
                                                            {status === 'Late' && <AlertTriangle size={12} className="text-orange-500" title="Late Check-in Policy Applied" />}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3.5 text-right">
                                                        {(!attendanceData && !isFutureDate && !isWeekend) || status === 'Absent' || status === 'Late' || status === 'Half Day' ? (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 px-4 text-[10px] font-black text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-lg border border-indigo-100 transition-all uppercase tracking-widest shadow-sm"
                                                                onClick={() => handleRegularizeRequest(dateStr)}
                                                            >
                                                                CORRECT LOG
                                                            </Button>
                                                        ) : (
                                                            <Badge variant="ghost" className="text-slate-300 pointer-events-none">
                                                                <CheckCircle2 size={14} />
                                                            </Badge>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Compact Legend for Calendar View Only */}
                        {viewMode === 'calendar' && (
                            <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-slate-100">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Legend:</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                    <span className="text-xs font-medium text-slate-600">Present</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                    <span className="text-xs font-medium text-slate-600">Half Day</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                                    <span className="text-xs font-medium text-slate-600">Absent</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                                    <span className="text-xs font-medium text-slate-600">Late</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full border-2 border-indigo-500 bg-indigo-50"></div>
                                    <span className="text-xs font-medium text-slate-600">Today</span>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Column: Sidebar (25%) */}
                <div className="xl:col-span-3 space-y-6 w-full">

                    {/* Shift Details Card */}
                    <Card className="border-none shadow-sm rounded-2xl bg-white p-5">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Clock size={16} className="text-indigo-500" /> Shift Details
                        </h3>

                        <div className="space-y-4">
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">General Shift</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-800">09:00 AM</span>
                                    <span className="text-slate-400 text-xs">to</span>
                                    <span className="text-sm font-bold text-slate-800">06:00 PM</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-start gap-3 text-xs text-slate-600">
                                    <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                                    <span>Late mark applies after <strong>09:15 AM</strong></span>
                                </div>
                                <div className="flex items-start gap-3 text-xs text-slate-600">
                                    <History size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                                    <span>Avg. working hours: <strong>9h</strong></span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Leave Balances Card */}
                    <Card className="border-none shadow-sm rounded-2xl bg-white p-5">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center">
                                <span className="text-[10px]">🌴</span>
                            </div>
                            Leave Balance
                        </h3>

                        <div className="space-y-3">
                            {[
                                { label: "Casual Leave", used: 4, total: 12, color: "bg-purple-500", bg: "bg-purple-100" },
                                { label: "Sick Leave", used: 2, total: 10, color: "bg-rose-500", bg: "bg-rose-100" },
                                { label: "Earned Leave", used: 0, total: 15, color: "bg-emerald-500", bg: "bg-emerald-100" }
                            ].map((leave, i) => (
                                <div key={i} className="flex flex-col gap-1.5">
                                    <div className="flex justify-between text-xs">
                                        <span className="font-medium text-slate-600">{leave.label}</span>
                                        <span className="font-bold text-slate-900">{leave.total - leave.used}/{leave.total}</span>
                                    </div>
                                    <div className={`h-2 w-full ${leave.bg} rounded-full overflow-hidden`}>
                                        <div
                                            className={`h-full ${leave.color} rounded-full`}
                                            style={{ width: `${((leave.total - leave.used) / leave.total) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button
                            variant="link"
                            className="w-full text-indigo-600 text-xs font-bold mt-2 h-auto p-0"
                            onClick={() => router.push('/hrmcubicle/leave')}
                        >
                            Apply for Leave →
                        </Button>
                    </Card>

                    {/* Upcoming Holidays Card */}
                    <Card className="border-none shadow-sm rounded-2xl bg-white p-5">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <CalendarIcon size={16} className="text-rose-500" /> Upcoming Holidays
                        </h3>

                        <div className="space-y-3">
                            {[
                                { name: "Republic Day", date: "Jan 26, Mon", type: "National" },
                                { name: "Maha Shivaratri", date: "Feb 26, Wed", type: "Religious" },
                            ].map((holiday, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                    <div className="h-10 w-10 bg-rose-50 text-rose-600 rounded-xl flex flex-col items-center justify-center border border-rose-100 shrink-0">
                                        <span className="text-[9px] font-bold uppercase">{holiday.date.split(' ')[0]}</span>
                                        <span className="text-sm font-bold leading-none">{holiday.date.split(' ')[1].replace(',', '')}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">{holiday.name}</p>
                                        <p className="text-[10px] text-slate-500 font-medium">{holiday.type} Holiday • {holiday.date.split(', ')[1]}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
};

export default MyAttendancePage;
