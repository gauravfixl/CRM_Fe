"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
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
    ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { useLifecycleStore } from "@/shared/data/lifecycle-store"; // STORE IMPORT
import { Badge } from "@/shared/components/ui/badge";

const ClearancePage = () => {
    const { toast } = useToast();
    const { employees, completeClearance } = useLifecycleStore();

    // Only employees in 'Notice Period' need clearance
    const noticeEmployees = employees.filter(e => e.status === 'Notice Period');

    // Select first available employee by default
    const [selectedEmpId, setSelectedEmpId] = useState<string>(noticeEmployees[0]?.id || "");
    const selectedEmp = employees.find(e => e.id === selectedEmpId);

    // Mock Checklists State (In real app, this would be in store per employee)
    const [checklistStatus, setChecklistStatus] = useState({
        IT: false,
        Finance: false,
        Admin: false,
        Manager: false
    });

    const clearanceItems = [
        { id: "IT", dept: "IT Assets", items: ["Laptop Return", "ID Card", "Email Deactivation"], icon: <Laptop size={20} />, color: "bg-[#CB9DF0]", isCleared: checklistStatus.IT },
        { id: "Finance", dept: "Finance", items: ["Dues Clearance", "Loan Recovery", "Expense Claims"], icon: <DollarSign size={20} />, color: "bg-[#FFF9BF]", textColor: "text-slate-700", isCleared: checklistStatus.Finance },
        { id: "Admin", dept: "Admin", items: ["Drawer Keys", "Parking Sticker"], icon: <Key size={20} />, color: "bg-[#F0C1E1]", isCleared: checklistStatus.Admin },
        { id: "Manager", dept: "Manager", items: ["KT Completion", "Project Handover"], icon: <UserCheck size={20} />, color: "bg-[#FDDBBB]", isCleared: checklistStatus.Manager },
    ];

    const toggleGroupClearance = (groupId: string) => {
        setChecklistStatus(prev => ({ ...prev, [groupId]: !prev[groupId as keyof typeof prev] }));
    };

    const allCleared = Object.values(checklistStatus).every(Boolean);

    const handleCompleteClearance = () => {
        if (!selectedEmpId) return;
        completeClearance(selectedEmpId);
        toast({
            title: "Clearance Complete",
            description: "Employee marked as 'Exited'. Ready for F&F Settlement.",
            className: "bg-emerald-50 border-emerald-200 text-emerald-800"
        });
        // Reset local state
        setChecklistStatus({ IT: false, Finance: false, Admin: false, Manager: false });
        setSelectedEmpId("");
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Clearance Checklist</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">Stage 8: Manage No-Due Certificates across departments.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Employee Selector */}
                <div className="lg:w-1/3 space-y-6">
                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white p-6 min-h-[500px]">
                        <h3 className="font-black text-lg text-slate-900 mb-4">Pending Clearance</h3>
                        <div className="space-y-3">
                            {noticeEmployees.length === 0 ? (
                                <p className="text-slate-400 text-center py-10 font-medium">No employees in Notice Period.</p>
                            ) : noticeEmployees.map(emp => (
                                <div
                                    key={emp.id}
                                    onClick={() => setSelectedEmpId(emp.id)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${selectedEmpId === emp.id
                                            ? 'bg-[#CB9DF0]/10 border-[#CB9DF0]'
                                            : 'bg-slate-50 border-transparent hover:bg-slate-100'
                                        }`}
                                >
                                    <Avatar className={`${selectedEmpId === emp.id ? 'bg-[#CB9DF0] text-white' : 'bg-slate-200 text-slate-500'}`}>
                                        <AvatarFallback>{emp.avatar}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{emp.name}</h4>
                                        <p className="text-xs font-bold text-slate-400">{emp.role}</p>
                                    </div>
                                    {selectedEmpId === emp.id && <CheckCircle2 className="ml-auto text-[#CB9DF0]" size={20} />}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Checklist Grid */}
                {selectedEmpId ? (
                    <div className="lg:w-2/3 space-y-6">
                        <Card className="border-none shadow-lg rounded-[2.5rem] bg-[#CB9DF0] text-white p-8 text-center relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-4xl font-black">
                                    {Math.round((Object.values(checklistStatus).filter(Boolean).length / 4) * 100)}%
                                </h2>
                                <p className="text-sm font-bold uppercase tracking-widest mt-1 opacity-80">Clearance Status for {selectedEmp?.name}</p>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {clearanceItems.map((dept, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                    <Card className="border-none shadow-lg shadow-slate-100/50 rounded-[2rem] bg-white h-full hover:shadow-xl transition-all group overflow-hidden">
                                        <div className={`p-6 ${dept.color} flex justify-between items-center`}>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-sm text-white">
                                                    {dept.icon}
                                                </div>
                                                <h3 className={`font-black text-lg ${dept.textColor || 'text-white'}`}>{dept.dept}</h3>
                                            </div>
                                            {dept.isCleared ? (
                                                <Badge className="bg-white/90 text-emerald-700 border-none font-bold shadow-sm">CLEARED</Badge>
                                            ) : (
                                                <Badge className="bg-white/50 text-slate-700 border-none font-bold shadow-sm">PENDING</Badge>
                                            )}
                                        </div>
                                        <div className="p-6 space-y-4">
                                            {dept.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3 opacity-70">
                                                    <CheckSquare size={16} className="text-slate-400" />
                                                    <span className="font-bold text-slate-600 text-sm">{item}</span>
                                                </div>
                                            ))}
                                            <div className="pt-4 mt-2 border-t border-slate-50">
                                                <Button
                                                    size="sm"
                                                    className={`w-full rounded-xl font-bold ${dept.isCleared ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                                    onClick={() => toggleGroupClearance(dept.id)}
                                                >
                                                    {dept.isCleared ? 'Mark Pending' : `Approve ${dept.dept}`}
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {allCleared && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <Button className="w-full h-16 rounded-[1.5rem] bg-slate-900 text-white font-black text-lg shadow-2xl hover:bg-slate-800" onClick={handleCompleteClearance}>
                                    Finalize Separation & Exit <ArrowRight className="ml-2" />
                                </Button>
                            </motion.div>
                        )}
                    </div>
                ) : (
                    <div className="lg:w-2/3 flex items-center justify-center text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                        Select an employee to manage clearance.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClearancePage;
