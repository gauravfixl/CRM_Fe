"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Hourglass,
    CalendarCheck,
    AlertTriangle,
    CheckCircle,
    UserX,
    MoreHorizontal,
    Search,
    Filter,
    CheckCircle2,
    Clock
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { Input } from "@/shared/components/ui/input";
import { useLifecycleStore } from "@/shared/data/lifecycle-store";

const ProbationPage = () => {
    const { toast } = useToast();
    const { employees, confirmProbation } = useLifecycleStore();

    // Filter only Probation Employees
    const probationEmployees = employees.filter(e => e.status === 'Probation');

    // Stats
    const totalProbation = probationEmployees.length;
    // Mock logic for "Due" (e.g. joined > 5 months ago)
    const dueForConfirmation = probationEmployees.length;

    const stats = [
        { label: "Check-ins Due", value: dueForConfirmation, color: "bg-[#F0C1E1]", icon: <CalendarCheck className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Active Probation", value: totalProbation, color: "bg-[#CB9DF0]", icon: <Hourglass className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Extended Cases", value: 0, color: "bg-[#FDDBBB]", icon: <AlertTriangle className="text-slate-800" />, textColor: "text-slate-900" },
    ];

    const handleConfirm = (id: string, name: string) => {
        confirmProbation(id);
        toast({
            title: "Probation Confirmed",
            description: `${name} is now a permanent employee (Active).`,
            className: "bg-emerald-50 border-emerald-200 text-emerald-800"
        });
    };

    const handleExtend = (name: string) => {
        toast({ title: "Extended", description: `Probation for ${name} extended by 3 months.` });
        // Logic to update date would go here
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Probation Management</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">Stage 5: Track performance and confirmation.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-lg rounded-[2rem] ${stat.color} p-6 flex items-center gap-4 relative overflow-hidden`}>
                            <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-sm relative z-10">
                                {stat.icon}
                            </div>
                            <div className="relative z-10">
                                <h3 className={`text-3xl font-black ${stat.textColor || 'text-white'}`}>{stat.value}</h3>
                                <p className={`text-xs font-bold uppercase tracking-widest ${stat.textColor || 'text-white/80'}`}>{stat.label}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* List */}
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden p-8 min-h-[400px]">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-black text-xl text-slate-900">Probation List</h3>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            <Input className="pl-10 rounded-xl bg-slate-50 border-none w-64 h-10 font-bold text-sm" placeholder="Search employee..." />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {probationEmployees.length === 0 ? (
                        <div className="text-center p-10 text-slate-400 font-medium">No employees currently on probation.</div>
                    ) : probationEmployees.map((emp, i) => (
                        <div key={emp.id} className="p-6 rounded-[1.5rem] border border-slate-100 hover:border-[#CB9DF0]/30 hover:shadow-lg transition-all flex flex-col md:flex-row items-center gap-6 group">
                            <Avatar className="h-14 w-14 rounded-2xl bg-[#CB9DF0] text-white font-bold border-2 border-slate-50 shadow-md">
                                <AvatarFallback>{emp.avatar}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1 text-center md:text-left">
                                <h4 className="font-black text-lg text-slate-900 group-hover:text-[#9d5ccf] transition-colors">{emp.name}</h4>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{emp.role} • Joined {emp.joinDate}</p>
                            </div>

                            <div className="text-center w-40 hidden md:block">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Performance</p>
                                <div className="flex items-center gap-2">
                                    <Progress value={emp.performance || 70} className="h-2 w-24 bg-slate-100" indicatorClassName="bg-gradient-to-r from-[#CB9DF0] to-[#F0C1E1]" />
                                    <span className="text-xs font-bold text-slate-600">{emp.performance || 70}%</span>
                                </div>
                            </div>

                            <div className="text-center w-32">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ends On</p>
                                <p className="text-sm font-bold text-slate-900">{emp.probationEnd}</p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-lg font-bold shadow-md"
                                    onClick={() => handleConfirm(emp.id, emp.name)}
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4" /> Confirm
                                </Button>
                                <Button size="sm" variant="outline" className="border-slate-200 text-slate-500 hover:text-slate-700" onClick={() => handleExtend(emp.name)}>
                                    <Clock className="mr-2 h-4 w-4" /> Extend
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default ProbationPage;
