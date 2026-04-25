"use client"

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Calculator,
    Banknote,
    Receipt,
    CheckCircle2,
    Clock,
    UserX,
    ShieldCheck,
    ArrowRight,
    FileText,
    IndianRupee,
    Search,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { useLifecycleStore } from "@/shared/data/lifecycle-store";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";

function downloadTextFile(filename: string, content: string) {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

const DEFAULT_AMOUNTS = {
    basicSalary: "45000",
    leaveEncashment: "22500",
    performanceIncentive: "15000",
    tds: "8250",
    gratuity: "0",
};

const SettlementPage = () => {
    const { toast } = useToast();
    const { employees, finalizeSettlement } = useLifecycleStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);
    const [isCustomAmountOpen, setIsCustomAmountOpen] = useState(false);
    const [selectedEmpId, setSelectedEmpId] = useState<string>("");

    // Per-employee amounts map
    const [amountsByEmp, setAmountsByEmp] = useState<Record<string, typeof DEFAULT_AMOUNTS>>({});
    const [draftAmounts, setDraftAmounts] = useState(DEFAULT_AMOUNTS);

    const exitedEmployees = useMemo(() => employees.filter(e => e.status === "Exited"), [employees]);

    const filteredExitedEmployees = useMemo(() => exitedEmployees.filter(e => {
        const q = searchTerm.toLowerCase();
        return !q || e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q) || e.role.toLowerCase().includes(q);
    }), [exitedEmployees, searchTerm]);

    // Sort: unpaid first
    const sortedExitedEmployees = useMemo(() => [...filteredExitedEmployees].sort((a, b) => {
        const aPaid = a.settlement?.status === 'Paid' ? 1 : 0;
        const bPaid = b.settlement?.status === 'Paid' ? 1 : 0;
        return aPaid - bPaid;
    }), [filteredExitedEmployees]);

    // Auto-select and keep valid
    useEffect(() => {
        const list = exitedEmployees;
        if (list.length === 0) { if (selectedEmpId) setSelectedEmpId(""); return; }
        if (!selectedEmpId || !list.some(e => e.id === selectedEmpId)) setSelectedEmpId(list[0].id);
    }, [exitedEmployees, selectedEmpId]);

    const selectedEmp = useMemo(() => employees.find(e => e.id === selectedEmpId), [employees, selectedEmpId]);

    const currentAmounts = amountsByEmp[selectedEmpId] || DEFAULT_AMOUNTS;

    const calculationItems = useMemo(() => {
        if (!selectedEmp) return [];
        return [
            { key: 'basicSalary', label: "Pro-rated basic salary", amount: parseInt(currentAmounts.basicSalary) || 0, type: "credit" as const, desc: "For final service month" },
            { key: 'leaveEncashment', label: "Leave encashment", amount: parseInt(currentAmounts.leaveEncashment) || 0, type: "credit" as const, desc: "Unused privilege leaves" },
            { key: 'performanceIncentive', label: "Performance incentive", amount: parseInt(currentAmounts.performanceIncentive) || 0, type: "credit" as const, desc: "Pro-rata bonus" },
            { key: 'tds', label: "TDS / income tax", amount: parseInt(currentAmounts.tds) || 0, type: "debit" as const, desc: "Statutory deduction" },
            { key: 'gratuity', label: "Gratuity (if applicable)", amount: parseInt(currentAmounts.gratuity) || 0, type: "neutral" as const, desc: "Tenure-based benefit" },
        ];
    }, [selectedEmp, currentAmounts]);

    const netAmount = useMemo(() => calculationItems.reduce((acc, item) => {
        if (item.type === "credit") return acc + item.amount;
        if (item.type === "debit") return acc - item.amount;
        return acc;
    }, 0), [calculationItems]);

    const isPaid = selectedEmp?.settlement?.status === "Paid";

    // Stats
    const totalExited = exitedEmployees.length;
    const paidCount = exitedEmployees.filter(e => e.settlement?.status === "Paid").length;
    const pendingCount = totalExited - paidCount;
    const totalPayout = exitedEmployees.filter(e => e.settlement?.status === "Paid").reduce((acc, e) => acc + (e.settlement?.netPayable || 0), 0);

    const stats = [
        { label: "Total Settlements", value: totalExited, color: "bg-[#CB9DF0]", icon: <Calculator className="text-slate-800" size={18} /> },
        { label: "Pending Payout", value: pendingCount, color: "bg-[#F0C1E1]", icon: <Clock className="text-slate-800" size={18} /> },
        { label: "Paid Out", value: paidCount, color: "bg-[#FFF9BF]", icon: <CheckCircle2 className="text-slate-800" size={18} /> },
        { label: "Total Disbursed", value: `₹${totalPayout.toLocaleString()}`, color: "bg-[#FDDBBB]", icon: <IndianRupee className="text-slate-800" size={18} /> },
    ];

    const openEditAmounts = () => {
        setDraftAmounts(currentAmounts);
        setIsCustomAmountOpen(true);
    };

    const validateAmounts = (a: typeof DEFAULT_AMOUNTS) => {
        return Object.values(a).every(v => {
            const n = parseInt(v);
            return !isNaN(n) && n >= 0;
        });
    };

    const saveDraftAmounts = () => {
        if (!validateAmounts(draftAmounts)) {
            toast({ title: "Invalid amounts", description: "All values must be valid non-negative numbers.", variant: "destructive" });
            return;
        }
        setAmountsByEmp({ ...amountsByEmp, [selectedEmpId]: draftAmounts });
        setIsCustomAmountOpen(false);
        toast({ title: "Amounts Updated", description: "Settlement breakdown saved." });
    };

    const handleProcess = () => {
        if (netAmount < 0) {
            toast({ title: "Invalid Payout", description: "Net payable cannot be negative. Review amounts.", variant: "destructive" });
            return;
        }
        setIsProcessDialogOpen(true);
    };

    const confirmProcess = () => {
        if (!selectedEmpId) return;
        finalizeSettlement(selectedEmpId, netAmount);
        toast({ title: "Settlement Finalized", description: `₹${netAmount.toLocaleString()} processed for ${selectedEmp?.name}.` });
        setIsProcessDialogOpen(false);
    };

    const handleDownloadSummary = () => {
        if (!selectedEmp) return;
        const lines = [
            `Full & Final Settlement Summary`,
            `${"=".repeat(40)}`,
            `Employee: ${selectedEmp.name}`,
            `Id: ${selectedEmp.id}`,
            `Department: ${selectedEmp.department}`,
            `Role: ${selectedEmp.role}`,
            `Status: ${isPaid ? "Paid" : "Draft"}`,
            ``,
            `--- Breakdown ---`,
            ...calculationItems.map(item => `${item.label}: ${item.type === "debit" ? "-" : "+"}₹${item.amount.toLocaleString()} (${item.desc})`),
            ``,
            `Net payable: ₹${netAmount.toLocaleString()}`,
            isPaid && selectedEmp.settlement?.processedDate ? `Processed on: ${selectedEmp.settlement.processedDate}` : '',
            `Generated: ${new Date().toLocaleDateString()}`,
        ].filter(Boolean);
        downloadTextFile(`settlement_summary_${selectedEmp.name.replace(/\s+/g, "_")}.txt`, lines.join("\n"));
        toast({ title: "Downloaded", description: "Settlement summary saved." });
    };

    const handleDownloadRelievingLetter = () => {
        if (!selectedEmp) return;
        const letter = [
            `Relieving Letter`,
            `${"=".repeat(40)}`,
            `Date: ${new Date().toLocaleDateString()}`,
            ``,
            `To whom it may concern,`,
            ``,
            `This is to certify that ${selectedEmp.name} was employed with our organization as ${selectedEmp.role} in the ${selectedEmp.department} department from ${selectedEmp.joinDate}.`,
            ``,
            `${selectedEmp.name} has been relieved from duties effective ${selectedEmp.lwd || new Date().toLocaleDateString()}.`,
            ``,
            `During their tenure, they conducted themselves with professionalism and integrity.`,
            `We wish them all the best in their future endeavors.`,
            ``,
            `Regards,`,
            `Human Resources Department`,
        ];
        downloadTextFile(`relieving_letter_${selectedEmp.name.replace(/\s+/g, "_")}.txt`, letter.join("\n"));
        toast({ title: "Downloaded", description: "Relieving letter saved." });
    };

    const handleDownloadPaySlip = () => {
        if (!selectedEmp) return;
        const slip = [
            `Final Pay Slip`,
            `${"=".repeat(40)}`,
            `Employee: ${selectedEmp.name}`,
            `Id: ${selectedEmp.id}`,
            `Department: ${selectedEmp.department}`,
            `Role: ${selectedEmp.role}`,
            `Period: Final settlement`,
            ``,
            `--- Earnings ---`,
            ...calculationItems.filter(i => i.type === "credit").map(i => `${i.label}: ₹${i.amount.toLocaleString()}`),
            ``,
            `--- Deductions ---`,
            ...calculationItems.filter(i => i.type === "debit").map(i => `${i.label}: ₹${i.amount.toLocaleString()}`),
            ``,
            `Net payable: ₹${netAmount.toLocaleString()}`,
            `Status: ${isPaid ? "Paid" : "Pending"}`,
            `Generated: ${new Date().toLocaleDateString()}`,
        ];
        downloadTextFile(`final_payslip_${selectedEmp.name.replace(/\s+/g, "_")}.txt`, slip.join("\n"));
        toast({ title: "Downloaded", description: "Final pay slip saved." });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-4 space-y-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Full & Final Settlement</h1>
                    <p className="text-slate-500 font-bold text-[10px] mt-0.5">Stage 9: Final payout calculation and closure.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <Card className={`border-none shadow-sm rounded-2xl ${stat.color} overflow-hidden hover:shadow-md transition-all`}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-slate-700">{stat.label}</p>
                                    <h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
                                </div>
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-sm">{stat.icon}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm h-full flex flex-col p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-sm text-slate-900">Settlement Queue</h3>
                            <Badge variant="outline" className="text-[10px] font-bold border-slate-200">{sortedExitedEmployees.length}</Badge>
                        </div>
                        <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <Input placeholder="Search..." className="pl-9 rounded-xl h-9 text-xs font-bold border border-slate-200" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 max-h-[520px]">
                            {sortedExitedEmployees.length === 0 ? (
                                <div className="py-12 text-center space-y-3">
                                    <UserX size={36} className="mx-auto text-slate-300" />
                                    <p className="text-xs text-slate-400 font-bold">{exitedEmployees.length === 0 ? 'No settlements yet.' : 'No matches for your search.'}</p>
                                </div>
                            ) : (
                                sortedExitedEmployees.map((emp) => (
                                    <div key={emp.id} onClick={() => setSelectedEmpId(emp.id)} className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-colors ${selectedEmpId === emp.id ? "bg-[#CB9DF0] border-[#CB9DF0] text-white" : "bg-white border-slate-100 hover:border-[#CB9DF0]/30 text-slate-700"}`}>
                                        <Avatar className="h-9 w-9 rounded-xl">
                                            <AvatarFallback className={`text-xs font-bold rounded-xl ${selectedEmpId === emp.id ? "bg-white/20 text-white" : "bg-violet-50 text-[#8B5CF6]"}`}>{emp.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-xs truncate">{emp.name}</p>
                                            <p className={`text-[10px] font-bold truncate ${selectedEmpId === emp.id ? "text-white/70" : "text-slate-400"}`}>{emp.department}</p>
                                        </div>
                                        {emp.settlement?.status === "Paid" ? (
                                            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                        ) : (
                                            <Clock size={14} className={`shrink-0 ${selectedEmpId === emp.id ? "text-white/50" : "text-slate-300"}`} />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Detail */}
                <div className="lg:col-span-2 space-y-4 overflow-y-auto custom-scrollbar">
                    {selectedEmp ? (
                        <>
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-11 w-11 rounded-xl">
                                            <AvatarFallback className="bg-violet-50 text-[#8B5CF6] font-bold rounded-xl text-sm">{selectedEmp.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900">{selectedEmp.name}</h3>
                                            <p className="text-[10px] text-slate-400 font-bold">{selectedEmp.role} · {selectedEmp.department} · {selectedEmp.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={`px-3 py-1 rounded-lg text-[10px] font-bold border-none ${isPaid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                                            {isPaid ? "Paid" : "Draft"}
                                        </Badge>
                                        {!isPaid && (
                                            <Button variant="outline" size="sm" className="h-8 rounded-lg border-slate-200 text-[10px] font-bold text-slate-500" onClick={openEditAmounts}>
                                                Edit Amounts
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="p-5 space-y-1">
                                    {calculationItems.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-b-0">
                                            <div>
                                                <p className="font-bold text-xs text-slate-800">{item.label}</p>
                                                <p className="text-[10px] text-slate-400 mt-0.5 font-bold">{item.desc}</p>
                                            </div>
                                            <span className={`text-sm font-bold tabular-nums ${item.type === "credit" ? "text-emerald-600" : item.type === "debit" ? "text-rose-500" : "text-slate-400"}`}>
                                                {item.type === "credit" ? "+" : item.type === "debit" ? "-" : ""} ₹{item.amount.toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mx-5 mb-5 p-4 rounded-xl bg-slate-900 text-white flex justify-between items-center">
                                    <div>
                                        <p className="text-xs font-bold text-violet-300">Net Payable Amount</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5 font-bold">{isPaid ? `Processed on ${selectedEmp.settlement?.processedDate}` : 'Calculated as per current breakdown'}</p>
                                    </div>
                                    <p className="text-2xl font-bold tabular-nums tracking-tight text-white">₹{(isPaid ? (selectedEmp.settlement?.netPayable || 0) : netAmount).toLocaleString()}</p>
                                </div>

                                <div className="px-5 pb-5 flex gap-3 flex-wrap">
                                    <Button className={`flex-1 h-10 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 min-w-[180px] ${isPaid ? "bg-emerald-500 hover:bg-emerald-600" : "bg-[#CB9DF0] hover:bg-[#b580e0]"} text-white`} onClick={handleProcess} disabled={isPaid}>
                                        <ShieldCheck size={14} />
                                        {isPaid ? "Payment Finalized" : "Approve & Process Payout"}
                                    </Button>
                                    <Button variant="outline" className="flex-1 h-10 rounded-xl font-bold text-xs border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 min-w-[180px]" onClick={handleDownloadSummary}>
                                        <FileText size={14} />
                                        Download Summary
                                    </Button>
                                </div>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 flex items-center gap-3 cursor-pointer hover:border-[#CB9DF0]/30 transition-colors group" onClick={handleDownloadRelievingLetter}>
                                    <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                                        <Receipt size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-xs text-slate-800">Relieving Letter</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Official separation document</p>
                                    </div>
                                    <ArrowRight size={16} className="text-slate-300 group-hover:text-[#CB9DF0] transition-colors shrink-0" />
                                </Card>

                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 flex items-center gap-3 cursor-pointer hover:border-[#CB9DF0]/30 transition-colors group" onClick={handleDownloadPaySlip}>
                                    <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center text-[#8B5CF6] shrink-0">
                                        <Banknote size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-xs text-slate-800">Final Pay Slip</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Payout breakdown statement</p>
                                    </div>
                                    <ArrowRight size={16} className="text-slate-300 group-hover:text-[#CB9DF0] transition-colors shrink-0" />
                                </Card>
                            </div>
                        </>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
                            <Calculator size={48} className="text-slate-200 mb-3" />
                            <p className="text-sm text-slate-400 font-bold max-w-xs">Select a separation record to begin final settlement calculations.</p>
                            <p className="text-[10px] text-slate-300 mt-2 font-bold">Employees appear here only after Clearance is finalized.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Process Confirm */}
            <Dialog open={isProcessDialogOpen} onOpenChange={setIsProcessDialogOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-md shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Confirm Settlement Payout?</DialogTitle>
                        <DialogDescription className="text-xs font-bold text-slate-400">
                            A payout of <strong className="text-slate-900">₹{netAmount.toLocaleString()}</strong> will be processed for {selectedEmp?.name}. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 mt-2">
                        <Button variant="outline" onClick={() => setIsProcessDialogOpen(false)} className="rounded-xl font-bold text-slate-500 h-10 px-5 text-xs border-slate-200">Cancel</Button>
                        <Button onClick={confirmProcess} className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl font-bold h-10 text-xs flex-1">Yes, Process Payout</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Amounts Side Form */}
            <SideFormSheet
                open={isCustomAmountOpen}
                onOpenChange={setIsCustomAmountOpen}
                title="Edit Settlement Amounts"
                description="Adjust the individual components. All values in ₹."
                icon={<Calculator size={20} />}
                accentColor="#7c3aed"
                width="md"
                submitLabel="Save Changes"
                onSubmit={(e) => { e.preventDefault(); saveDraftAmounts(); }}
            >
                <div className="space-y-4">
                    {[
                        { key: 'basicSalary', label: 'Basic Salary' },
                        { key: 'leaveEncashment', label: 'Leave Encashment' },
                        { key: 'performanceIncentive', label: 'Performance Incentive' },
                        { key: 'tds', label: 'TDS Deduction' },
                        { key: 'gratuity', label: 'Gratuity' },
                    ].map(f => (
                        <Field key={f.key} label={`${f.label} (₹)`}>
                            <Input type="number" min={0} value={(draftAmounts as any)[f.key]} onChange={e => setDraftAmounts({ ...draftAmounts, [f.key]: e.target.value })} />
                        </Field>
                    ))}
                </div>
            </SideFormSheet>
        </div>
    );
};

export default SettlementPage;
