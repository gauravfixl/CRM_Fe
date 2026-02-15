"use client"

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calculator,
    Banknote,
    Receipt,
    Download,
    CheckCircle2,
    Clock,
    Printer,
    Search,
    UserX,
    TrendingUp,
    ShieldCheck,
    AlertCircle,
    ArrowRight,
    LayoutGrid
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { useLifecycleStore } from "@/shared/data/lifecycle-store";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";

const SettlementPage = () => {
    const { toast } = useToast();
    const { employees, finalizeSettlement } = useLifecycleStore();

    const exitedEmployees = useMemo(() =>
        employees.filter(e => e.status === 'Exited'),
        [employees]
    );

    const [selectedEmpId, setSelectedEmpId] = useState<string>(exitedEmployees[0]?.id || "");
    const selectedEmp = useMemo(() =>
        employees.find(e => e.id === selectedEmpId),
        [employees, selectedEmpId]
    );

    // Dynamic Calculation Mock (Reactive to selected employee metadata)
    const calculationItems = useMemo(() => {
        if (!selectedEmp) return [];
        return [
            { label: "Pro-rated basic salary", amount: 45000, type: "credit", desc: "For final service month" },
            { label: "Leave encashment (14 days)", amount: 22500, type: "credit", desc: "Unused privilege leaves" },
            { label: "Performance incentive", amount: 15000, type: "credit", desc: "Q1 Pro-rata bonus" },
            { label: "TDS / Income tax", amount: 8250, type: "debit", desc: "Statutory deduction" },
            { label: "Gratuity (if applicable)", amount: 0, type: "neutral", desc: "Tenure check pending" },
        ];
    }, [selectedEmp]);

    const netAmount = useMemo(() => {
        return calculationItems.reduce((acc, item) => {
            if (item.type === "credit") return acc + item.amount;
            if (item.type === "debit") return acc - item.amount;
            return acc;
        }, 0);
    }, [calculationItems]);

    const isPaid = selectedEmp?.settlement?.status === 'Paid';

    const handleProcess = () => {
        if (!selectedEmpId) return;
        finalizeSettlement(selectedEmpId, netAmount);
        toast({
            title: "F&F Finalized 💰",
            description: `Payment of ₹${netAmount.toLocaleString()} has been processed for ${selectedEmp?.name}.`,
        });
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
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic capitalize">Full & Final Settlement</h1>
                        <p className="text-slate-500 font-bold text-base mt-0.5 ml-1">Stage 9: Final payout calculation and closure.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Panel: Pending Queue */}
                    <div className="lg:col-span-4 max-h-[700px]">
                        <Card className="h-full border border-slate-200 shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white p-8 flex flex-col">
                            <h3 className="font-black text-xl text-slate-900 italic mb-8">Pending queue</h3>
                            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
                                {exitedEmployees.length === 0 ? (
                                    <div className="py-24 text-center space-y-4">
                                        <UserX size={48} className="mx-auto text-slate-100" />
                                        <p className="text-slate-300 font-black italic uppercase tracking-tighter">No settlements pending</p>
                                    </div>
                                ) : exitedEmployees.map(emp => (
                                    <motion.div
                                        key={emp.id}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => setSelectedEmpId(emp.id)}
                                        className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center gap-5
                                            ${selectedEmpId === emp.id ? 'bg-slate-900 border-slate-900 shadow-2xl text-white' : 'bg-white border-slate-50 hover:border-purple-100 text-slate-600'}`}
                                    >
                                        <Avatar className="h-14 w-14 rounded-2xl bg-white shadow-xl flex items-center justify-center text-[#CB9DF0] font-black text-xl border border-slate-50">
                                            <AvatarFallback className={selectedEmpId === emp.id ? 'bg-purple-500 text-white' : 'bg-slate-50 text-slate-300'}>{emp.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h4 className="font-black text-lg tracking-tight leading-tight">{emp.name}</h4>
                                            <p className={`text-xs font-bold italic ${selectedEmpId === emp.id ? 'text-purple-400' : 'text-slate-400'}`}>{emp.department}</p>
                                        </div>
                                        {emp.settlement?.status === 'Paid' ? (
                                            <CheckCircle2 size={24} className="text-emerald-400" />
                                        ) : (
                                            <Clock size={20} className={selectedEmpId === emp.id ? 'text-purple-400' : 'text-slate-200'} />
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Panel: Settlement Sheet */}
                    <div className="lg:col-span-8 space-y-8">
                        {selectedEmp ? (
                            <>
                                <Card className="border border-slate-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] rounded-[3rem] bg-white overflow-hidden p-0 relative">
                                    <div className="p-10 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                        <div className="flex items-center gap-6">
                                            <Avatar className="h-20 w-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center text-[#CB9DF0] font-black text-3xl border border-white">
                                                <AvatarFallback className="bg-gradient-to-br from-purple-100 to-indigo-50 text-purple-600">{selectedEmp.avatar}</AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1">
                                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Settlement draft</h3>
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{selectedEmp.name} — <span className="text-rose-400">{selectedEmp.id}</span></p>
                                            </div>
                                        </div>
                                        <Badge className={`px-6 py-2.5 rounded-xl font-black italic shadow-sm border-none ${isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {isPaid ? 'Settlement Paid' : 'Draft stage'}
                                        </Badge>
                                    </div>

                                    <div className="p-10 space-y-6">
                                        <div className="space-y-4">
                                            {calculationItems.map((item, i) => (
                                                <div key={i} className="flex justify-between items-center py-4 border-b border-slate-50 border-dashed group">
                                                    <div>
                                                        <p className="font-black text-slate-900 text-lg italic tracking-tight">{item.label}</p>
                                                        <p className="text-xs font-bold text-slate-400">{item.desc}</p>
                                                    </div>
                                                    <span className={`text-2xl font-black tracking-tighter ${item.type === 'credit' ? 'text-emerald-500' :
                                                            item.type === 'debit' ? 'text-rose-500' : 'text-slate-300'
                                                        }`}>
                                                        {item.type === 'credit' ? '+' : item.type === 'debit' ? '-' : ''} ₹{item.amount.toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-12 p-8 rounded-[2.5rem] bg-slate-900 text-white flex justify-between items-center shadow-2xl">
                                            <div>
                                                <p className="text-sm font-bold text-[#CB9DF0] italic tracking-tight capitalize">Net payable amount</p>
                                                <p className="text-xs font-bold opacity-50 mt-1">Calculated as per policy V4.2</p>
                                            </div>
                                            <div className="text-right">
                                                <h2 className="text-5xl font-black tracking-tighter text-white">₹{netAmount.toLocaleString()}</h2>
                                            </div>
                                        </div>

                                        <div className="pt-8 flex gap-5">
                                            <Button
                                                className={`flex-1 h-16 rounded-2xl font-black text-lg shadow-2xl transition-all hover:scale-[1.02] flex items-center gap-3
                                                    ${isPaid ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white shadow-indigo-100`}
                                                onClick={handleProcess}
                                                disabled={isPaid}
                                            >
                                                <ShieldCheck size={24} /> {isPaid ? 'Payment Finalized' : 'Approve & process payout'}
                                            </Button>
                                            <Button variant="outline" className="flex-1 h-16 border-slate-200 text-slate-500 font-black rounded-2xl text-lg hover:bg-slate-50 flex items-center gap-3">
                                                <Printer size={24} /> Download summary
                                            </Button>
                                        </div>
                                    </div>
                                </Card>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <Card className="border border-slate-100 shadow-xl rounded-[2rem] bg-teal-50/50 p-8 flex items-center gap-6 cursor-pointer hover:bg-teal-50 transition-all group" onClick={() => toast({ title: "Generating Docs", description: "Experience certificate is being prepared." })}>
                                        <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-xl shadow-teal-100 group-hover:scale-110 transition-transform">
                                            <Receipt size={32} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-xl italic tracking-tight">Relieving letter</h4>
                                            <p className="text-sm font-bold text-teal-700 opacity-70">Official separation document</p>
                                        </div>
                                        <ArrowRight className="ml-auto text-teal-200 group-hover:text-teal-500 transition-colors" size={24} />
                                    </Card>

                                    <Card className="border border-slate-100 shadow-xl rounded-[2rem] bg-purple-50/50 p-8 flex items-center gap-6 cursor-pointer hover:bg-purple-50 transition-all group" onClick={() => toast({ title: "Generating Docs", description: "Final pay slip is being prepared." })}>
                                        <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-xl shadow-purple-100 group-hover:scale-110 transition-transform">
                                            <Banknote size={32} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-xl italic tracking-tight">Final pay slip</h4>
                                            <p className="text-sm font-bold text-purple-700 opacity-70">Payout breakdown statement</p>
                                        </div>
                                        <ArrowRight className="ml-auto text-purple-200 group-hover:text-purple-500 transition-colors" size={24} />
                                    </Card>
                                </div>
                            </>
                        ) : (
                            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-slate-300 space-y-6 border-2 border-dashed border-slate-100 rounded-[3rem] p-20 text-center">
                                <Calculator size={80} className="text-slate-100" />
                                <p className="font-black italic text-2xl uppercase tracking-tighter opacity-50">Select a separation record to begin final settlement calculations.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettlementPage;
