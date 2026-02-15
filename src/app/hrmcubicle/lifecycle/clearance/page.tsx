"use client"

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckSquare,
    Laptop,
    Key,
    DollarSign,
    UserCheck,
    ChevronDown,
    AlertCircle,
    CheckCircle2,
    ShieldCheck,
    ArrowRight,
    Search,
    History,
    MoreHorizontal
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { useLifecycleStore, ClearanceStatus } from "@/shared/data/lifecycle-store";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";

const ClearancePage = () => {
    const { toast } = useToast();
    const { employees, approveClearance, completeClearance } = useLifecycleStore();

    const noticeEmployees = useMemo(() =>
        employees.filter(e => e.status === 'Notice Period'),
        [employees]
    );

    const [selectedEmpId, setSelectedEmpId] = useState<string>(noticeEmployees[0]?.id || "");
    const selectedEmp = useMemo(() =>
        employees.find(e => e.id === selectedEmpId),
        [employees, selectedEmpId]
    );

    const clearanceItems = useMemo(() => {
        if (!selectedEmp?.clearance) return [];
        const c = selectedEmp.clearance;
        return [
            { id: "it", dept: "IT Assets", items: ["Laptop Return", "ID Card", "Email Deactivation"], icon: <Laptop size={20} />, color: "bg-[#CB9DF0]", isCleared: c.it },
            { id: "finance", dept: "Finance", items: ["Dues Clearance", "Loan Recovery", "Expense Claims"], icon: <DollarSign size={20} />, color: "bg-[#FDDBBB]", textColor: "text-slate-700", isCleared: c.finance },
            { id: "admin", dept: "Admin", items: ["Drawer Keys", "Parking Sticker", "Access Card"], icon: <Key size={20} />, color: "bg-[#F0C1E1]", isCleared: c.admin },
            { id: "manager", dept: "Reporting Manager", items: ["KT Completion", "Project Handover", "Team Feedback"], icon: <UserCheck size={20} />, color: "bg-[#FFF9BF]", textColor: "text-slate-700", isCleared: c.manager },
        ];
    }, [selectedEmp]);

    const progressValue = useMemo(() => {
        if (!selectedEmp?.clearance) return 0;
        const c = selectedEmp.clearance;
        const clearedCount = [c.it, c.finance, c.admin, c.manager].filter(Boolean).length;
        return (clearedCount / 4) * 100;
    }, [selectedEmp]);

    const allCleared = progressValue === 100;

    const handleApprove = (dept: string) => {
        if (!selectedEmpId) return;
        approveClearance(selectedEmpId, dept as keyof ClearanceStatus);
        toast({
            title: "Department Cleared ✅",
            description: `${dept.toUpperCase()} clearances finalized for ${selectedEmp?.name}.`
        });
    };

    const handleFinalize = () => {
        if (!selectedEmpId) return;
        completeClearance(selectedEmpId);
        toast({
            title: "Separation Finalized! 🏁",
            description: `${selectedEmp?.name} is now moved to 'Exited' status for F&F settlement.`,
        });
        setSelectedEmpId("");
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
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic capitalize">Clearance Checklist</h1>
                        <p className="text-slate-500 font-bold text-base mt-0.5 ml-1">Stage 8: Manage No-Due Certificates across departments.</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Employee Selector */}
                    <div className="lg:w-1/3">
                        <Card className="border border-slate-200 shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white p-8 min-h-[600px] flex flex-col">
                            <div className="flex items-center gap-4 mb-8">
                                <History size={24} className="text-[#CB9DF0]" />
                                <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">Pending Approval</h3>
                            </div>

                            <div className="flex-1 space-y-3 overflow-y-auto pr-2 no-scrollbar">
                                {noticeEmployees.length === 0 ? (
                                    <div className="py-24 text-center space-y-6">
                                        <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-100">
                                            <ShieldCheck size={48} />
                                        </div>
                                        <p className="text-slate-300 font-black italic text-lg max-w-[200px] mx-auto leading-relaxed tracking-tighter uppercase text-center">No personnel in notice period found.</p>
                                    </div>
                                ) : noticeEmployees.map(emp => (
                                    <motion.div
                                        key={emp.id}
                                        whileHover={{ x: 5 }}
                                        onClick={() => setSelectedEmpId(emp.id)}
                                        className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center gap-5
                                            ${selectedEmpId === emp.id ? 'bg-slate-900 border-slate-900 shadow-2xl text-white' : 'bg-white border-slate-50 hover:border-[#CB9DF0]/20 text-slate-600'}`}
                                    >
                                        <Avatar className={`h-12 w-12 rounded-xl transition-transform ${selectedEmpId === emp.id ? 'scale-110 shadow-lg ring-4 ring-white/10' : ''}`}>
                                            <AvatarFallback className={selectedEmpId === emp.id ? 'bg-[#CB9DF0] text-white' : 'bg-slate-100 text-slate-400'}>{emp.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h4 className="font-black text-lg tracking-tight">{emp.name}</h4>
                                            <p className={`text-xs font-bold italic ${selectedEmpId === emp.id ? 'text-[#CB9DF0]' : 'text-slate-400'}`}>{emp.role}</p>
                                        </div>
                                        {selectedEmpId === emp.id && <CheckCircle2 size={24} className="text-[#CB9DF0]" />}
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Clearance Board */}
                    <div className="lg:w-2/3 space-y-8">
                        {selectedEmp ? (
                            <>
                                {/* Progress Header */}
                                <Card className="border-none shadow-2xl rounded-[3rem] bg-slate-900 text-white p-10 relative overflow-hidden group">
                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                                        <div className="space-y-2 text-center md:text-left">
                                            <p className="text-lg font-bold text-[#CB9DF0] italic tracking-tight capitalize">Consolidated Clearance Status</p>
                                            <h2 className="text-3xl font-black tracking-tighter uppercase">{selectedEmp.name}</h2>
                                            <Badge className="bg-white/10 text-[#CB9DF0] border-none font-black px-4 py-1">Last Day: {selectedEmp.lwd}</Badge>
                                        </div>
                                        <div className="relative h-40 w-40 flex items-center justify-center">
                                            <svg className="h-full w-full rotate-[-90deg]">
                                                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                                                <motion.circle
                                                    cx="80" cy="80" r="70" stroke="#CB9DF0" strokeWidth="12" fill="transparent"
                                                    strokeDasharray={440}
                                                    strokeDashoffset={440 - (440 * progressValue) / 100}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-5xl font-black tracking-tighter">{progressValue}%</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[#CB9DF0]">cleared</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-20 -right-20 h-64 w-64 bg-[#CB9DF0]/10 rounded-full blur-[80px]" />
                                </Card>

                                {/* Group Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {clearanceItems.map((dept, i) => (
                                        <motion.div
                                            key={dept.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <Card className="border border-slate-100 shadow-2xl rounded-[2.5rem] bg-white h-full group overflow-hidden hover:shadow-purple-100/50 transition-all">
                                                <div className={`p-8 ${dept.color} flex justify-between items-center`}>
                                                    <div className="flex items-center gap-4 text-slate-900">
                                                        <div className="h-12 w-12 bg-white/40 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-sm">
                                                            {dept.icon}
                                                        </div>
                                                        <h3 className="font-black text-xl italic tracking-tight">{dept.dept}</h3>
                                                    </div>
                                                    <Badge className={`px-4 py-2 rounded-xl font-black text-[10px] italic shadow-sm border-none ${dept.isCleared ? 'bg-emerald-500 text-white' : 'bg-white/60 text-slate-600'
                                                        }`}>
                                                        {dept.isCleared ? 'Cleared' : 'Pending'}
                                                    </Badge>
                                                </div>
                                                <div className="p-8 space-y-5">
                                                    <div className="space-y-3">
                                                        {dept.items.map((item, idx) => (
                                                            <div key={idx} className="flex items-center gap-3">
                                                                <div className={`h-5 w-5 rounded-md flex items-center justify-center ${dept.isCleared ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                                                                    <CheckSquare size={14} className={dept.isCleared ? 'text-emerald-500' : 'text-slate-300'} />
                                                                </div>
                                                                <span className="font-bold text-slate-600 text-sm">{item}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="pt-6 border-t border-slate-50">
                                                        <Button
                                                            className={`w-full h-12 rounded-xl font-black text-sm shadow-xl transition-all
                                                                ${dept.isCleared
                                                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100'
                                                                    : 'bg-[#CB9DF0] hover:bg-[#b580e0] text-white shadow-purple-100'
                                                                }`}
                                                            disabled={dept.isCleared}
                                                            onClick={() => handleApprove(dept.id)}
                                                        >
                                                            {dept.isCleared ? 'Department Cleared' : `Approve ${dept.dept}`}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Multi-stage Actions */}
                                <AnimatePresence>
                                    {allCleared && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 50 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                        >
                                            <Button
                                                className="w-full h-20 rounded-[2rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl shadow-2xl shadow-indigo-200 transition-all hover:scale-[1.02] flex items-center justify-center gap-4"
                                                onClick={handleFinalize}
                                            >
                                                <ShieldCheck size={28} /> Finalize Full separation workflow <ArrowRight size={24} />
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        ) : (
                            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-slate-300 space-y-6 border-2 border-dashed border-slate-100 rounded-[3rem] p-20 text-center">
                                <UserCheck size={80} className="text-slate-100" />
                                <p className="font-black italic text-2xl uppercase tracking-tighter opacity-50">Select an employee from the queue to start their departmental clearance.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClearancePage;
