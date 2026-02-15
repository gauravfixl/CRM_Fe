"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    ShieldAlert,
    FileCheck,
    BellRing,
    Search,
    CheckCircle2,
    XCircle,
    User,
    Lock,
    Scale
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { useToast } from "@/shared/components/ui/use-toast";
import { Input } from "@/shared/components/ui/input";
import { useLifecycleStore } from "@/shared/data/lifecycle-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

const CompliancePage = () => {
    const { toast } = useToast();
    const { employees } = useLifecycleStore();

    // Focus on Active employees for ongoing compliance
    const activeEmployees = employees.filter(e => e.status === 'Active' || e.status === 'Probation');
    const [searchTerm, setSearchTerm] = useState("");

    // Mock Compliance Data (In real app, living in Store)
    // We will simulate state here since store schema update is heavy, but UI will look functional
    const policies = [
        { id: "P1", name: "POSH Policy", icon: <ShieldAlert size={18} />, required: true },
        { id: "P2", name: "NDA Agreement", icon: <Lock size={18} />, required: true },
        { id: "P3", name: "IT Security", icon: <FileCheck size={18} />, required: true },
        { id: "P4", name: "Code of Conduct", icon: <Scale size={18} />, required: true },
    ];

    const [complianceState, setComplianceState] = useState<Record<string, string[]>>({}); // EmpID -> [PolicyIDs]

    // Initialize mock random data if empty
    if (Object.keys(complianceState).length === 0 && activeEmployees.length > 0) {
        const initialState: Record<string, string[]> = {};
        activeEmployees.forEach(e => {
            // Randomly assign some policies as done
            initialState[e.id] = Math.random() > 0.5 ? ["P1", "P2", "P3", "P4"] : ["P1", "P2"];
        });
        setComplianceState(initialState);
    }

    const filteredEmployees = activeEmployees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Stats
    const fullyCompliantCount = activeEmployees.filter(e => (complianceState[e.id]?.length || 0) === policies.length).length;
    const pendingCount = activeEmployees.length - fullyCompliantCount;

    const stats = [
        { label: "Compliance Rate", value: `${Math.round((fullyCompliantCount / activeEmployees.length) * 100) || 0}%`, color: "bg-[#CB9DF0]", icon: <FileCheck className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Pending Actions", value: pendingCount, color: "bg-[#F0C1E1]", icon: <ShieldAlert className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Audit Due", value: "Q1 2026", color: "bg-[#FDDBBB]", icon: <Scale className="text-slate-800" />, textColor: "text-slate-900" },
    ];

    const handleNudge = (empName: string) => {
        toast({ title: "Reminder Sent", description: `Compliance nudge sent to ${empName}.` });
    };

    const handleMarkCompliant = (empId: string, policyId: string) => {
        setComplianceState(prev => {
            const current = prev[empId] || [];
            if (current.includes(policyId)) return prev;
            return { ...prev, [empId]: [...current, policyId] };
        });
        toast({ title: "Updated", description: "Policy marked as signed." });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Compliance & Policies</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">Stage 6: Manage regulatory acknowledgements and audits.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-lg rounded-[2rem] ${stat.color} p-6 flex items-center justify-between overflow-hidden relative group`}>
                            <div className="relative z-10">
                                <h3 className={`text-3xl font-black ${stat.textColor || 'text-white'}`}>{stat.value}</h3>
                                <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${stat.textColor || 'text-white/80'}`}>{stat.label}</p>
                            </div>
                            <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-sm relative z-10">
                                {stat.icon}
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden p-8 min-h-[500px]">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h3 className="font-black text-xl text-slate-900">Employee Compliance Audit</h3>
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <Input className="pl-10 rounded-xl bg-slate-50 border-none w-full md:w-64 font-medium" placeholder="Search employee..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredEmployees.length === 0 ? (
                        <div className="text-center p-10 text-slate-400 font-medium">No active employees found.</div>
                    ) : filteredEmployees.map((emp, i) => {
                        const signedPolicies = complianceState[emp.id] || [];
                        const progress = (signedPolicies.length / policies.length) * 100;
                        const isComplete = progress === 100;

                        return (
                            <motion.div key={emp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                                <div className={`p-6 rounded-[2rem] border transition-all ${isComplete ? 'bg-white border-slate-100' : 'bg-amber-50/50 border-amber-100'}`}>
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">

                                        {/* Employee Info */}
                                        <div className="flex items-center gap-4 min-w-[250px]">
                                            <Avatar className="h-14 w-14 rounded-2xl bg-[#CB9DF0] text-white font-bold text-lg">
                                                <AvatarFallback>{emp.avatar}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-black text-slate-900">{emp.name}</h4>
                                                <p className="text-xs font-bold text-slate-400">{emp.department}</p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="flex-1 space-y-2 min-w-[200px]">
                                            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wide">
                                                <span>Adherence</span>
                                                <span className={isComplete ? "text-emerald-500" : "text-amber-500"}>{progress}%</span>
                                            </div>
                                            <Progress value={progress} className="h-3 rounded-full bg-slate-100" indicatorClassName={isComplete ? "bg-emerald-400" : "bg-amber-400"} />
                                        </div>

                                        {/* Policies Grid */}
                                        <div className="flex gap-2 flex-wrap max-w-[400px]">
                                            {policies.map(p => {
                                                const isSigned = signedPolicies.includes(p.id);
                                                return (
                                                    <div
                                                        key={p.id}
                                                        onClick={() => !isSigned && handleMarkCompliant(emp.id, p.id)}
                                                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${isSigned
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                            : 'bg-white text-slate-400 border border-details-200 hover:border-amber-300 hover:text-amber-600'
                                                            }`}
                                                        title={isSigned ? "Signed" : "Click to Mark Signed"}
                                                    >
                                                        {isSigned ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                                        <span className="hidden sm:inline">{p.name}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex justify-end min-w-[120px]">
                                            {isComplete ? (
                                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-4 py-2 rounded-xl font-bold">
                                                    Verified
                                                </Badge>
                                            ) : (
                                                <Button size="sm" className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl font-bold shadow-md" onClick={() => handleNudge(emp.name)}>
                                                    <BellRing size={16} className="mr-2" /> Nudge
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};

export default CompliancePage;
