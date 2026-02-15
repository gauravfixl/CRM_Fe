"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    DollarSign,
    CreditCard,
    Download,
    TrendingUp,
    Users,
    FileText,
    ArrowRight,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useToast } from "@/shared/components/ui/use-toast";
import { Progress } from "@/shared/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";

const PayrollDashboard = () => {
    const { toast } = useToast();
    const [isRunning, setIsRunning] = useState(false);
    const [step, setStep] = useState(1);

    const runPayroll = () => {
        setIsRunning(true);
        // Simulate wizard
        setTimeout(() => setStep(2), 1500); // Sync Attendance
        setTimeout(() => setStep(3), 3000); // Calculate Tax
        setTimeout(() => setStep(4), 4500); // Finalize
        setTimeout(() => {
            setIsRunning(false);
            setStep(1);
            toast({ title: "Payroll Processed", description: "Payslips generated for Jan 2026." });
        }, 6000);
    };

    const stats = [
        { label: "Total Payroll Cost", value: "₹ 1,45,00,000", color: "bg-[#CB9DF0]", icon: <DollarSign className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Pending Claims", value: "12 Requests", color: "bg-[#F0C1E1]", icon: <CreditCard className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Tax Deductions", value: "₹ 12,50,000", color: "bg-[#FFF9BF]", icon: <TrendingUp className="text-slate-800" />, textColor: "text-slate-900" },
    ];

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payroll Overview</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">Manage salaries, bonuses, and compliance.</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 px-6 shadow-xl font-bold">
                            Run Payroll for Jan
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-[2rem] border-none p-8 max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Processing Payroll: Jan 2026</DialogTitle>
                            <DialogDescription>Please wait while we crunch the numbers.</DialogDescription>
                        </DialogHeader>
                        <div className="py-8 space-y-6">
                            <div className="space-y-4">
                                <StepItem current={step} target={1} label="Syncing Attendance Data" />
                                <StepItem current={step} target={2} label="Calculating Deductions & Bonuses" />
                                <StepItem current={step} target={3} label="Computing TDS & Tax" />
                                <StepItem current={step} target={4} label="Generating Payslips" />
                            </div>
                            {isRunning && <Progress value={step * 25} className="h-2 bg-slate-100" indicatorClassName="bg-[#CB9DF0]" />}
                        </div>
                        <DialogFooter>
                            {!isRunning && step === 1 && (
                                <Button className="w-full bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-12 font-bold" onClick={runPayroll}>
                                    Start Processing
                                </Button>
                            )}
                            {step === 1 && !isRunning ? null : (
                                <Button disabled className="w-full bg-slate-100 text-slate-400 rounded-xl h-12 font-bold">
                                    {isRunning ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : "Completed"}
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-lg rounded-[2rem] ${stat.color} p-6 flex items-center gap-4 relative overflow-hidden`}>
                            <div className="h-14 w-14 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-sm relative z-10">
                                {stat.icon}
                            </div>
                            <div className="relative z-10">
                                <h3 className={`text-2xl font-black ${stat.textColor}`}>{stat.value}</h3>
                                <p className={`text-xs font-bold uppercase tracking-widest ${stat.textColor} opacity-80`}>{stat.label}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Payslips */}
                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white p-8">
                    <h3 className="font-black text-xl text-slate-900 mb-6">Recent Payslips Generated</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-[#CB9DF0]/10 transition-colors group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">December 2025</p>
                                        <p className="text-xs text-slate-400 font-medium">Processed on Jan 1st</p>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost" className="text-slate-300 group-hover:text-[#9d5ccf]">
                                    <Download size={20} />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Button variant="link" className="w-full mt-4 text-slate-400 font-bold">View All History</Button>
                </Card>

                {/* Department Cost Distribution */}
                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-slate-900 text-white p-8 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-black text-xl mb-6">Department Wise Cost</h3>
                        <div className="space-y-6">
                            <DeptBar name="Engineering" amount="₹ 65L" percent={45} />
                            <DeptBar name="Sales & Marketing" amount="₹ 40L" percent={30} />
                            <DeptBar name="Product" amount="₹ 25L" percent={15} />
                            <DeptBar name="HR & Admin" amount="₹ 15L" percent={10} />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

function StepItem({ current, target, label }: { current: number, target: number, label: string }) {
    const status = current > target ? 'done' : current === target ? 'active' : 'pending';
    return (
        <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border-2 ${status === 'done' ? 'bg-emerald-500 border-emerald-500 text-white' : status === 'active' ? 'border-[#CB9DF0] text-[#CB9DF0]' : 'border-slate-200 text-slate-300'}`}>
                {status === 'done' ? <CheckCircle2 size={16} /> : target}
            </div>
            <span className={`font-bold text-sm ${status === 'active' ? 'text-slate-900' : status === 'done' ? 'text-emerald-600' : 'text-slate-400'}`}>
                {label}
            </span>
        </div>
    );
}

function DeptBar({ name, amount, percent }: any) {
    return (
        <div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2 opacity-80">
                <span>{name}</span>
                <span>{amount}</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#CB9DF0] to-[#F0C1E1]" style={{ width: `${percent}%` }} />
            </div>
        </div>
    )
}

export default PayrollDashboard;
