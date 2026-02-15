"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Clock,
    UserCheck,
    UserX,
    Calendar,
    CheckCircle2,
    XCircle,
    Filter,
    Search,
    ChevronRight,
    ArrowUpRight,
    MoreVertical
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/components/ui/use-toast";
import { useTeamStore } from "@/shared/data/team-store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

const TeamAttendancePage = () => {
    const { members, attendance } = useTeamStore();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");

    const presentCount = attendance.filter(a => a.status === 'Present').length;
    const absentCount = members.length - presentCount - attendance.filter(a => a.status === 'On Leave').length;

    const stats = [
        { label: "Present Today", value: presentCount, color: "bg-emerald-100", icon: <UserCheck className="text-emerald-600" /> },
        { label: "Absent", value: absentCount, color: "bg-rose-100", icon: <UserX className="text-rose-600" /> },
        { label: "On Leave", value: attendance.filter(a => a.status === 'On Leave').length, color: "bg-amber-100", icon: <Calendar className="text-amber-600" /> },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Present': return "bg-emerald-100 text-emerald-700";
            case 'Absent': return "bg-rose-100 text-rose-700";
            case 'On Leave': return "bg-amber-100 text-amber-700";
            default: return "bg-slate-100 text-slate-500";
        }
    };

    const handleApproveRegularization = (empId: string, name: string) => {
        const { updateAttendance } = useTeamStore.getState();
        updateAttendance(empId, { status: 'Present', checkIn: '09:00' });
        toast({ title: "Regularization Approved", description: `Attendance fixed for ${name}.` });
    };

    const handleRejectRegularization = (name: string) => {
        toast({ title: "Regularization Rejected", description: `Request for ${name} has been declined.`, variant: "destructive" });
    };

    // Filter attendance based on search
    const filteredAttendance = attendance.filter(record => {
        const member = members.find(m => m.id === record.empId);
        return member?.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="flex-1 min-h-screen bg-[#f8fafc] p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Team Attendance</h1>
                    <p className="text-slate-500 font-medium text-xs mt-2">Monitor daily presence and handle regularization requests.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl h-10 border-slate-200 font-bold bg-white text-xs px-5 border-none shadow-sm" onClick={() => toast({ title: "Report Generated", description: "Team attendance report has been sent to your email." })}>
                        <ArrowUpRight className="mr-2 h-4 w-4" /> Export Report
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap gap-5">
                {stats.map((stat, i) => (
                    <motion.div key={i} className="min-w-[200px] flex-1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-sm rounded-2xl ${stat.color} p-4 flex items-center gap-3 border border-white/20 h-full`}>
                            <div className="h-10 w-10 bg-white/40 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-sm ring-1 ring-white/30">
                                {React.cloneElement(stat.icon as React.ReactElement, { size: 18 })}
                            </div>
                            <div>
                                <p className={`text-[10px] font-bold tracking-widest text-slate-800 opacity-60 mb-1`}>{stat.label}</p>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-none">{stat.value}</h3>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Side: Daily Attendance List */}
                <div className="xl:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm rounded-[2rem] bg-indigo-50/50 p-6 border border-indigo-100 shadow-inner h-full">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 mt-2 ml-2">
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Live Status</h2>
                            <div className="relative w-full md:w-72 mr-2">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <Input
                                    placeholder="Search by name or designation..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-12 h-11 rounded-xl bg-white border-none shadow-sm font-bold text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            {filteredAttendance.map((record, i) => {
                                const member = members.find(m => m.id === record.empId);
                                return (
                                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl hover:shadow-lg transition-all group border border-white/50 mx-2">
                                            <div className="flex items-center gap-4 text-start">
                                                <Avatar className="h-11 w-11 ring-2 ring-slate-50 shadow-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                                                    <AvatarFallback>{member?.avatar}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-bold text-[15px] text-slate-900 leading-tight tracking-tight">{member?.name}</h3>
                                                    <p className="text-[11px] text-slate-400 font-bold tracking-wider mt-1">{member?.designation}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-10">
                                                <div className="hidden md:block text-right">
                                                    <p className="text-[10px] text-slate-400 font-bold tracking-widest mb-1.5 opacity-60">Entry / Exit</p>
                                                    <p className="font-bold text-slate-700 text-[13px] tracking-tight">{record.checkIn || '09:00'} — {record.checkOut || '--:--'}</p>
                                                </div>
                                                <Badge className={`${getStatusColor(record.status)} border-none font-bold px-4 py-1.5 rounded-lg text-[10px] shadow-sm tracking-wider`}>
                                                    {record.status}
                                                </Badge>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-all border-none">
                                                            <MoreVertical size={16} className="text-slate-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-xl p-1.5 border-none shadow-xl min-w-[160px] bg-white">
                                                        <DropdownMenuItem className="font-bold text-[11px] tracking-wider py-2.5 rounded-lg cursor-pointer focus:bg-indigo-50" onClick={() => toast({ title: "Attendance Logs", description: `Showing full logs for ${member?.name}` })}>
                                                            View Full Logs
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="font-bold text-[11px] tracking-wider py-2.5 rounded-lg cursor-pointer focus:bg-amber-50" onClick={() => toast({ title: "Correction Mode", description: "You can now edit previous entries for this member." })}>
                                                            Correct Attendance
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* Right Side: Regularization Requests */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm rounded-[2rem] bg-rose-50/50 p-6 border border-rose-100 shadow-inner">
                        <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center justify-between ml-2">
                            Pending Fixes <Badge className="bg-rose-500 text-white border-none h-6 px-2.5 text-[10px] font-bold shadow-md rounded-lg">2</Badge>
                        </h2>

                        <div className="space-y-4">
                            {[
                                { name: 'Rahul Sharma', time: '10:15 AM', reason: 'Metro Delay', date: 'Yesterday' },
                                { name: 'Priya Verma', time: '09:30 AM', reason: 'Bio-metric failure', date: '21 Jan' }
                            ].map((req, idx) => (
                                <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                                    <div className="bg-white p-5 rounded-2xl border border-white/50 text-start shadow-sm hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-[13px] leading-tight capitalize">{req.name}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold mt-1">{req.date} • {req.time}</p>
                                            </div>
                                            <Badge variant="outline" className="text-[9px] border-indigo-200 text-indigo-600 font-bold tracking-widest shadow-none bg-indigo-50 px-2 py-0.5">FIX</Badge>
                                        </div>
                                        <p className="text-[13px] text-slate-500 mb-5 font-bold border-l-4 border-rose-200 pl-3 leading-relaxed opacity-80">{req.reason}</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl h-10 text-[11px] shadow-sm tracking-wide"
                                                onClick={() => handleApproveRegularization(req.name === 'Rahul Sharma' ? 'EMP002' : 'EMP003', req.name)}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="border-rose-100 text-rose-500 hover:bg-rose-50 font-bold rounded-xl h-10 text-[11px] shadow-sm tracking-wide"
                                                onClick={() => handleRejectRegularization(req.name)}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TeamAttendancePage;
