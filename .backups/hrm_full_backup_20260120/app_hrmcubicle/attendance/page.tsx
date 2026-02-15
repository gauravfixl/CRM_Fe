"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Plus,
    History,
    FileEdit,
    LogIn,
    LogOut,
    Check
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/components/ui/use-toast";
import { useAttendanceStore } from "@/shared/data/attendance-store";
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
    const { toast } = useToast();
    const { logs } = useAttendanceStore();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [checkInTime, setCheckInTime] = useState<string | null>(null);
    const [isRegularizeOpen, setIsRegularizeOpen] = useState(false);
    const [regularizeForm, setRegularizeForm] = useState({
        date: new Date().toISOString().split('T')[0],
        checkIn: '',
        checkOut: '',
        reason: ''
    });

    // Filter logs for current month
    const myLogs = logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate.getMonth() === selectedMonth;
    });

    const presentDays = myLogs.filter(l => l.status === 'Present').length;
    const absentDays = myLogs.filter(l => l.status === 'Absent').length;
    const halfDays = myLogs.filter(l => l.status === 'Half Day').length;
    const totalHours = myLogs.reduce((sum, l) => {
        const hours = parseFloat(l.totalHours.replace('h', ''));
        return sum + (isNaN(hours) ? 0 : hours);
    }, 0);

    const stats = [
        { label: "Present Days", value: presentDays, color: "bg-emerald-100", icon: <CheckCircle2 className="text-emerald-600" />, textColor: "text-emerald-900" },
        { label: "Total Hours", value: `${totalHours.toFixed(1)}h`, color: "bg-[#CB9DF0]", icon: <Clock className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Absent", value: absentDays, color: "bg-rose-100", icon: <XCircle className="text-rose-600" />, textColor: "text-rose-900" },
        { label: "Half Days", value: halfDays, color: "bg-amber-100", icon: <AlertTriangle className="text-amber-600" />, textColor: "text-amber-900" },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Present': return "bg-emerald-100 text-emerald-700";
            case 'Absent': return "bg-rose-100 text-rose-700";
            case 'Half Day': return "bg-amber-100 text-amber-700";
            default: return "bg-slate-100 text-slate-500";
        }
    };

    const handleCheckIn = () => {
        const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        setIsCheckedIn(true);
        setCheckInTime(time);
        toast({ title: "Checked In", description: `You checked in at ${time}`, variant: "default" });
    };

    const handleCheckOut = () => {
        setIsCheckedIn(false);
        setCheckInTime(null);
        toast({ title: "Checked Out", description: "Successfully checked out for the day.", variant: "default" });
    };

    const handleRegularize = () => {
        if (!regularizeForm.date || !regularizeForm.checkIn || !regularizeForm.reason) {
            toast({ title: "Error", description: "Date, Check-in and Reason are required", variant: "destructive" });
            return;
        }
        setIsRegularizeOpen(false);
        setRegularizeForm({ date: new Date().toISOString().split('T')[0], checkIn: '', checkOut: '', reason: '' });
        toast({ title: "Request Submitted", description: "Regularization request sent to your manager." });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Attendance</h1>
                    <p className="text-slate-500 font-medium">Track your daily attendance and work hours.</p>
                </div>

                <div className="flex items-center gap-4">
                    <Dialog open={isRegularizeOpen} onOpenChange={setIsRegularizeOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="rounded-xl h-12 px-6 font-bold border-slate-200">
                                <FileEdit className="mr-2 h-5 w-5" /> Regularize
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-[2rem] border-none p-8 max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Request Regularization</DialogTitle>
                                <DialogDescription>Fix missing attendance or incorrect timestamps.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-4">
                                <div className="space-y-2">
                                    <Label>Date *</Label>
                                    <Input
                                        type="date"
                                        value={regularizeForm.date}
                                        onChange={e => setRegularizeForm({ ...regularizeForm, date: e.target.value })}
                                        className="rounded-xl bg-slate-50 border-none h-12"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Log In *</Label>
                                        <Input
                                            type="time"
                                            value={regularizeForm.checkIn}
                                            onChange={e => setRegularizeForm({ ...regularizeForm, checkIn: e.target.value })}
                                            className="rounded-xl bg-slate-50 border-none h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Log Out</Label>
                                        <Input
                                            type="time"
                                            value={regularizeForm.checkOut}
                                            onChange={e => setRegularizeForm({ ...regularizeForm, checkOut: e.target.value })}
                                            className="rounded-xl bg-slate-50 border-none h-12"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Reason *</Label>
                                    <Textarea
                                        placeholder="Explain why you need regularization..."
                                        value={regularizeForm.reason}
                                        onChange={e => setRegularizeForm({ ...regularizeForm, reason: e.target.value })}
                                        className="rounded-xl bg-slate-50 border-none min-h-[100px]"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold" onClick={handleRegularize}>
                                    Submit Request
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button
                        onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
                        className={`rounded-xl h-12 px-8 font-black shadow-lg transition-all ${isCheckedIn ? 'bg-rose-500 hover:bg-rose-600' : 'bg-[#CB9DF0] hover:bg-[#b580e0]'} text-white`}
                    >
                        {isCheckedIn ? (
                            <><LogOut className="mr-2 h-5 w-5" /> Check Out</>
                        ) : (
                            <><LogIn className="mr-2 h-5 w-5" /> Check In</>
                        )}
                    </Button>
                </div>
            </div>

            {/* Check-in Info */}
            {isCheckedIn && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="border-none shadow-md bg-emerald-50 p-4 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                <Check className="text-emerald-600" size={20} />
                            </div>
                            <p className="font-bold text-emerald-900">Active Session: Started at {checkInTime}</p>
                        </div>
                        <Badge className="bg-emerald-200 text-emerald-700 border-none">Online</Badge>
                    </Card>
                </motion.div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Calendar View */}
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8">
                <h2 className="text-xl font-black text-slate-900 mb-6 font-display">Monthly Overview</h2>
                <div className="space-y-3">
                    {myLogs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] hover:bg-slate-100 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <Calendar className="text-slate-400" size={24} />
                                </div>
                                <div>
                                    <p className="font-black text-slate-900">{new Date(log.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                    <p className="text-sm text-slate-500 font-medium">In: {log.checkIn || '--'} | Out: {log.checkOut || '--'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className="font-black text-xl text-slate-900">{log.totalHours}</p>
                                    <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Total Hours</p>
                                </div>
                                <div className="w-32 flex justify-end">
                                    <Badge className={`${getStatusColor(log.status)} border-none font-bold py-1.5 px-4 rounded-xl`}>
                                        {log.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default MyAttendancePage;
