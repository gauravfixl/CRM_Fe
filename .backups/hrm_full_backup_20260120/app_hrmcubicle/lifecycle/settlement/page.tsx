"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Calculator,
    Banknote,
    Receipt,
    Download,
    CheckCircle2,
    Clock,
    Printer,
    Search,
    UserX
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
    const { employees } = useLifecycleStore();

    // Filter Exited Employees (Ready for Settlement)
    const exitedEmployees = employees.filter(e => e.status === 'Exited');

    const [selectedEmpId, setSelectedEmpId] = useState<string>(exitedEmployees[0]?.id || "");
    const selectedEmp = employees.find(e => e.id === selectedEmpId);

    // Mock Calculation Data (Dynamic based on selectedEmp)
    const calculations = selectedEmp ? [
        { label: "Basic Salary (Pro-rated)", amount: "+ ₹ 45,000", type: "credit" },
        { label: "Leave Encashment (12 Days)", amount: "+ ₹ 22,500", type: "credit" },
        { label: "Short Notice Recovery", amount: "- ₹ 0", type: "neutral" },
        { label: "Asset Damage Recovery", amount: "- ₹ 0", type: "neutral" },
        { label: "Variable Pay", amount: "+ ₹ 15,000", type: "credit" },
        { label: "Tax Deduction (TDS)", amount: "- ₹ 8,250", type: "debit" },
    ] : [];

    // Net Amount Mock
    const netAmount = "₹ 74,250";

    const handleProcess = () => {
        toast({
            title: "Settlement Processed",
            description: `Payment advice generated for ${selectedEmp?.name}.`,
            className: "bg-emerald-50 border-emerald-200 text-emerald-800"
        });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Full & Final Settlement</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">Stage 9: Final payout calculation and closure.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Panel: List of Exited Employees */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white p-6 min-h-[500px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-black text-lg text-slate-900">Pending Settlements</h3>
                        </div>

                        <div className="space-y-3">
                            {exitedEmployees.length === 0 ? (
                                <div className="text-center p-8 text-slate-400 font-medium">
                                    <UserX size={32} className="mx-auto mb-2 opacity-50" />
                                    No exited employees pending for settlement.
                                </div>
                            ) : exitedEmployees.map(emp => (
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
                                        <p className="text-xs font-bold text-slate-400">{emp.department}</p>
                                    </div>
                                    {selectedEmpId === emp.id && <Clock className="ml-auto text-[#CB9DF0]" size={18} />}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right Panel: Calculation Sheet */}
                <div className="lg:col-span-8">
                    {selectedEmp ? (
                        <>
                            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden mb-6">
                                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 bg-[#FFF9BF] text-slate-700 font-bold"><AvatarFallback>{selectedEmp.avatar}</AvatarFallback></Avatar>
                                        <div>
                                            <h3 className="font-black text-xl text-slate-900">{selectedEmp.name}</h3>
                                            <p className="text-sm font-bold text-slate-400">{selectedEmp.role} • <span className="text-slate-500">Exited</span></p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="border-slate-200 text-slate-500 font-bold bg-slate-50">Settlement Draft</Badge>
                                </div>
                                <div className="p-8 space-y-4">
                                    {calculations.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 border-dashed">
                                            <span className="font-bold text-slate-600">{item.label}</span>
                                            <span className={`font-black text-lg ${item.type === 'credit' ? 'text-emerald-500' :
                                                    item.type === 'debit' ? 'text-rose-500' : 'text-slate-400'
                                                }`}>
                                                {item.amount}
                                            </span>
                                        </div>
                                    ))}

                                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Net Payable Amount</p>
                                            <p className="text-xs text-slate-400 font-medium">To be credited via Bank Transfer</p>
                                        </div>
                                        <div className="text-right">
                                            <h2 className="text-4xl font-black text-[#9d5ccf]">{netAmount}</h2>
                                        </div>
                                    </div>

                                    <div className="pt-6 flex gap-4">
                                        <Button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 font-bold shadow-lg" onClick={handleProcess}>
                                            <CheckCircle2 className="mr-2 h-5 w-5" /> Approve & Process
                                        </Button>
                                        <Button variant="outline" className="flex-1 border-slate-200 text-slate-500 font-bold rounded-xl h-12">
                                            <Printer className="mr-2 h-5 w-5" /> Download Statement
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            <div className="grid grid-cols-2 gap-6">
                                <Card className="border-none shadow-lg rounded-[2rem] bg-[#E0F2F1] p-6 flex items-center gap-4 cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => toast({ title: "Downloading", description: "Experience_Letter.pdf" })}>
                                    <div className="h-10 w-10 bg-white/40 rounded-xl flex items-center justify-center text-teal-700">
                                        <Receipt />
                                    </div>
                                    <p className="font-bold text-teal-800">Generate Experience Letter</p>
                                </Card>
                                <Card className="border-none shadow-lg rounded-[2rem] bg-[#F3E5F5] p-6 flex items-center gap-4 cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => toast({ title: "Downloading", description: "Pay_Slip.pdf" })}>
                                    <div className="h-10 w-10 bg-white/40 rounded-xl flex items-center justify-center text-purple-700">
                                        <Banknote />
                                    </div>
                                    <p className="font-bold text-purple-800">Generate Final Pay Slip</p>
                                </Card>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-300 font-bold text-lg border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10">
                            Select an employee to view settlement details.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettlementPage;
