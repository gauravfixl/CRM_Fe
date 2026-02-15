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

    const handleApproveRegularization = (name: string) => {
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
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Team Attendance</h1>
                    <p className="text-slate-500 font-medium">Monitor daily presence and handle regularization requests.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl h-12 border-slate-200 font-bold bg-white">
                        <ArrowUpRight className="mr-2 h-4 w-4" /> Export Report
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-lg rounded-[2.5rem] ${stat.color} p-8 relative overflow-hidden group`}>
                            <h3 className="text-5xl font-black text-slate-900 relative z-10 mb-2">{stat.value}</h3>
                            <p className="text-sm font-black uppercase tracking-widest text-slate-800 opacity-60 relative z-10">{stat.label}</p>
                            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:scale-125 transition-transform duration-500">
                                {React.cloneElement(stat.icon as any, { size: 120 })}
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Side: Daily Attendance List */}
                <div className="xl:col-span-2 space-y-6">
                    <Card className="border-none shadow-xl rounded-[3rem] bg-white p-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                            <h2 className="text-2xl font-black text-slate-900">Live Status</h2>
                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <Input
                                    placeholder="Search team member..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-12 h-12 rounded-2xl bg-slate-50 border-none font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredAttendance.map((record, i) => {
                                const member = members.find(m => m.id === record.empId);
                                return (
                                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] hover:bg-slate-100 transition-all group">
                                            <div className="flex items-center gap-5">
                                                <Avatar className="h-16 w-16 ring-4 ring-white shadow-sm bg-indigo-100 text-indigo-700 font-black text-xl">
                                                    <AvatarFallback>{member?.avatar}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-black text-xl text-slate-900">{member?.name}</h3>
                                                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">{member?.designation}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-10">
                                                <div className="hidden md:block text-right">
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Entry / Exit</p>
                                                    <p className="font-black text-slate-700">{record.checkIn || '09:00'} — {record.checkOut || '--:--'}</p>
                                                </div>
                                                <Badge className={`${getStatusColor(record.status)} border-none font-black px-5 py-2 rounded-xl text-xs`}>
                                                    {record.status}
                                                </Badge>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-all">
                                                            <MoreVertical size={20} className="text-slate-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-2xl p-2 border-none shadow-2xl">
                                                        <DropdownMenuItem className="font-bold rounded-xl" onClick={() => toast({ title: "Viewing Details" })}>
                                                            View Full Logs
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="font-bold rounded-xl" onClick={() => toast({ title: "Correcting Logs" })}>
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
                    <Card className="border-none shadow-xl rounded-[3rem] bg-indigo-50/50 p-8 border border-white">
                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                            Pending Fixes <Badge className="bg-rose-500 text-white border-none">2</Badge>
                        </h2>

                        <div className="space-y-4">
                            {[
                                { name: 'Rahul Sharma', time: '10:15 AM', reason: 'Metro Delay', date: 'Yesterday' },
                                { name: 'Priya Verma', time: '09:30 AM', reason: 'Bio-metric failure', date: '21 Jan' }
                            ].map((req, idx) => (
                                <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-indigo-100/50">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-black text-slate-900">{req.name}</h4>
                                                <p className="text-xs text-slate-400 font-bold">{req.date} • {req.time}</p>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] border-indigo-200 text-indigo-600 font-black">REGULARIZATION</Badge>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-4 font-medium italic">"{req.reason}"</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl h-10 text-xs"
                                                onClick={() => handleApproveRegularization(req.name)}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="border-rose-200 text-rose-600 hover:bg-rose-50 font-bold rounded-xl h-10 text-xs"
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

                    <Card className="border-none shadow-xl rounded-[2.5rem] bg-slate-900 text-white p-8 overflow-hidden relative">
                        <div className="relative z-10">
                            <h3 className="font-black text-xl mb-2">Team Punctuality</h3>
                            <p className="text-slate-400 text-sm font-medium mb-6">Average on-time arrival: 92%</p>
                            <div className="h-2 w-full bg-white/10 rounded-full mb-2">
                                <div className="h-full w-[92%] bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">+5% from last week</p>
                        </div>
                        <Clock className="absolute right-[-20px] bottom-[-20px] text-white/5 h-40 w-40" />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TeamAttendancePage;
