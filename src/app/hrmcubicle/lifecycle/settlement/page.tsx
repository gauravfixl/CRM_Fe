"use client"

import React, { useState, useMemo } from "react";
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
    Download,
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
import { Label } from "@/shared/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";

function downloadTextFile(filename: string, content: string) {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

const SettlementPage = () => {
    const { toast } = useToast();
    const { employees, finalizeSettlement } = useLifecycleStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);

    // Custom settlement amounts dialog
    const [isCustomAmountOpen, setIsCustomAmountOpen] = useState(false);
    const [customAmounts, setCustomAmounts] = useState({
        basicSalary: "45000",
        leaveEncashment: "22500",
        performanceIncentive: "15000",
        tds: "8250",
        gratuity: "0",
    });

    const exitedEmployees = useMemo(
        () => employees.filter((e) => e.status === "Exited"),
        [employees]
    );

    const filteredExitedEmployees = useMemo(
        () => exitedEmployees.filter(e =>
            e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.department.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [exitedEmployees, searchTerm]
    );

    const [selectedEmpId, setSelectedEmpId] = useState<string>(
        exitedEmployees[0]?.id || ""
    );

    const selectedEmp = useMemo(
        () => employees.find((e) => e.id === selectedEmpId),
        [employees, selectedEmpId]
    );

    const calculationItems = useMemo(() => {
        if (!selectedEmp) return [];
        return [
            { label: "Pro-rated basic salary", amount: parseInt(customAmounts.basicSalary) || 0, type: "credit", desc: "For final service month" },
            { label: "Leave encashment (14 days)", amount: parseInt(customAmounts.leaveEncashment) || 0, type: "credit", desc: "Unused privilege leaves" },
            { label: "Performance incentive", amount: parseInt(customAmounts.performanceIncentive) || 0, type: "credit", desc: "Q1 pro-rata bonus" },
            { label: "TDS / income tax", amount: parseInt(customAmounts.tds) || 0, type: "debit", desc: "Statutory deduction" },
            { label: "Gratuity (if applicable)", amount: parseInt(customAmounts.gratuity) || 0, type: "neutral", desc: "Tenure check pending" },
        ];
    }, [selectedEmp, customAmounts]);

    const netAmount = useMemo(() => {
        return calculationItems.reduce((acc, item) => {
            if (item.type === "credit") return acc + item.amount;
            if (item.type === "debit") return acc - item.amount;
            return acc;
        }, 0);
    }, [calculationItems]);

    const isPaid = selectedEmp?.settlement?.status === "Paid";

    // Stats
    const totalExited = exitedEmployees.length;
    const paidCount = exitedEmployees.filter(e => e.settlement?.status === "Paid").length;
    const pendingCount = totalExited - paidCount;
    const totalPayout = exitedEmployees.filter(e => e.settlement?.status === "Paid").reduce((acc, e) => acc + (e.settlement?.netPayable || 0), 0);

    const stats = [
        { label: "Total Settlements", value: totalExited, color: "bg-[#CB9DF0]", icon: <Calculator className="text-slate-800" size={20} /> },
        { label: "Pending Payout", value: pendingCount, color: "bg-[#F0C1E1]", icon: <Clock className="text-slate-800" size={20} /> },
        { label: "Paid Out", value: paidCount, color: "bg-[#FFF9BF]", icon: <CheckCircle2 className="text-slate-800" size={20} /> },
        { label: "Total Disbursed", value: `₹${totalPayout.toLocaleString()}`, color: "bg-[#FDDBBB]", icon: <IndianRupee className="text-slate-800" size={20} /> },
    ];

    const handleProcess = () => {
        setIsProcessDialogOpen(true);
    };

    const confirmProcess = () => {
        if (!selectedEmpId) return;
        finalizeSettlement(selectedEmpId, netAmount);
        toast({
            title: "Settlement finalized",
            description: `Payment of ₹${netAmount.toLocaleString()} has been processed for ${selectedEmp?.name}.`,
        });
        setIsProcessDialogOpen(false);
    };

    const handleDownloadSummary = () => {
        if (!selectedEmp) return;
        const lines = [
            `Full & final settlement summary`,
            `${"=".repeat(40)}`,
            `Employee: ${selectedEmp.name}`,
            `Id: ${selectedEmp.id}`,
            `Department: ${selectedEmp.department}`,
            `Role: ${selectedEmp.role}`,
            `Status: ${isPaid ? "Paid" : "Draft"}`,
            ``,
            `--- Breakdown ---`,
            ...calculationItems.map(
                (item) =>
                    `${item.label}: ${item.type === "debit" ? "-" : "+"}₹${item.amount.toLocaleString()} (${item.desc})`
            ),
            ``,
            `Net payable: ₹${netAmount.toLocaleString()}`,
            `Generated: ${new Date().toLocaleDateString()}`,
        ];
        downloadTextFile(
            `settlement_summary_${selectedEmp.name.replace(/\s+/g, "_")}.txt`,
            lines.join("\n")
        );
        toast({ title: "Downloaded", description: "Settlement summary has been downloaded." });
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
            `This is to certify that ${selectedEmp.name} was employed with our organization as ${selectedEmp.role} in the ${selectedEmp.department} department.`,
            ``,
            `${selectedEmp.name} has been relieved from duties effective ${selectedEmp.lwd || new Date().toLocaleDateString()}.`,
            ``,
            `During their tenure, they conducted themselves with professionalism and integrity.`,
            `We wish them all the best in their future endeavors.`,
            ``,
            `Regards,`,
            `Human Resources Department`,
        ];
        downloadTextFile(
            `relieving_letter_${selectedEmp.name.replace(/\s+/g, "_")}.txt`,
            letter.join("\n")
        );
        toast({ title: "Downloaded", description: "Relieving letter has been downloaded." });
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
            ...calculationItems
                .filter((i) => i.type === "credit")
                .map((i) => `${i.label}: ₹${i.amount.toLocaleString()}`),
            ``,
            `--- Deductions ---`,
            ...calculationItems
                .filter((i) => i.type === "debit")
                .map((i) => `${i.label}: ₹${i.amount.toLocaleString()}`),
            ``,
            `Net payable: ₹${netAmount.toLocaleString()}`,
            `Status: ${isPaid ? "Paid" : "Pending"}`,
            `Generated: ${new Date().toLocaleDateString()}`,
        ];
        downloadTextFile(
            `final_payslip_${selectedEmp.name.replace(/\s+/g, "_")}.txt`,
            slip.join("\n")
        );
        toast({ title: "Downloaded", description: "Final pay slip has been downloaded." });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-4 space-y-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Full & Final Settlement</h1>
                    <p className="text-slate-500 font-bold text-[10px] mt-0.5">Stage 9: Final payout calculation and closure.</p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-sm rounded-2xl ${stat.color} relative overflow-hidden transition-all hover:shadow-md`}>
                            <CardContent className="p-5 flex items-center justify-between relative z-10">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-slate-700">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                </div>
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-sm shadow-sm">{stat.icon}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
                {/* Left panel - Pending queue */}
                <div className="lg:col-span-1">
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm h-full flex flex-col p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-sm text-slate-900">Pending Queue</h3>
                            <Badge variant="outline" className="text-[10px] font-bold border-slate-200">{exitedEmployees.length}</Badge>
                        </div>

                        <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <Input
                                placeholder="Search..."
                                className="pl-9 rounded-xl h-9 text-xs font-bold border border-slate-200"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                            {filteredExitedEmployees.length === 0 ? (
                                <div className="py-16 text-center space-y-3">
                                    <UserX size={40} className="mx-auto text-slate-300" />
                                    <p className="text-sm text-slate-400 font-medium">No settlements pending</p>
                                </div>
                            ) : (
                                filteredExitedEmployees.map((emp) => (
                                    <div
                                        key={emp.id}
                                        onClick={() => setSelectedEmpId(emp.id)}
                                        className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-colors
                                            ${selectedEmpId === emp.id
                                                ? "bg-[#8B5CF6] border-[#8B5CF6] text-white"
                                                : "bg-white border-slate-100 hover:border-[#8B5CF6]/30 text-slate-700"
                                            }`}
                                    >
                                        <Avatar className="h-9 w-9 rounded-xl">
                                            <AvatarFallback
                                                className={`text-xs font-bold rounded-xl ${selectedEmpId === emp.id
                                                    ? "bg-white/20 text-white"
                                                    : "bg-violet-50 text-[#8B5CF6]"
                                                    }`}
                                            >
                                                {emp.avatar}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate">{emp.name}</p>
                                            <p className={`text-xs ${selectedEmpId === emp.id ? "text-white/70" : "text-slate-400"}`}>
                                                {emp.department}
                                            </p>
                                        </div>
                                        {emp.settlement?.status === "Paid" ? (
                                            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                                        ) : (
                                            <Clock size={16} className={`shrink-0 ${selectedEmpId === emp.id ? "text-white/50" : "text-slate-300"}`} />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right panel - Settlement sheet */}
                <div className="lg:col-span-2 space-y-4 overflow-y-auto custom-scrollbar">
                    {selectedEmp ? (
                        <>
                            {/* Settlement card */}
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                {/* Employee info header */}
                                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-11 w-11 rounded-xl">
                                            <AvatarFallback className="bg-violet-50 text-[#8B5CF6] font-bold rounded-xl">
                                                {selectedEmp.avatar}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900">{selectedEmp.name}</h3>
                                            <p className="text-xs text-slate-400">{selectedEmp.role} · {selectedEmp.department} · {selectedEmp.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            className={`px-3 py-1 rounded-lg text-xs font-semibold border-none ${isPaid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                                        >
                                            {isPaid ? "Paid" : "Draft"}
                                        </Badge>
                                        {!isPaid && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 rounded-lg border-slate-200 text-xs font-bold text-slate-500"
                                                onClick={() => setIsCustomAmountOpen(true)}
                                            >
                                                Edit Amounts
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Calculation breakdown */}
                                <div className="p-5 space-y-1">
                                    {calculationItems.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex justify-between items-center py-3 border-b border-slate-50 last:border-b-0"
                                        >
                                            <div>
                                                <p className="font-semibold text-sm text-slate-800">{item.label}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                                            </div>
                                            <span
                                                className={`text-base font-bold tabular-nums ${item.type === "credit"
                                                    ? "text-emerald-600"
                                                    : item.type === "debit"
                                                        ? "text-rose-500"
                                                        : "text-slate-400"
                                                    }`}
                                            >
                                                {item.type === "credit" ? "+" : item.type === "debit" ? "-" : ""}{" "}
                                                ₹{item.amount.toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Net payable */}
                                <div className="mx-5 mb-5 p-5 rounded-xl bg-slate-900 text-white flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-semibold text-violet-300">Net payable amount</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Calculated as per policy v4.2</p>
                                    </div>
                                    <p className="text-2xl font-black tracking-tight text-white">₹{netAmount.toLocaleString()}</p>
                                </div>

                                {/* Action buttons */}
                                <div className="px-5 pb-5 flex gap-3">
                                    <Button
                                        className={`flex-1 h-11 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2
                                            ${isPaid ? "bg-emerald-500 hover:bg-emerald-600" : "bg-[#8B5CF6] hover:bg-[#7C3AED]"} text-white`}
                                        onClick={handleProcess}
                                        disabled={isPaid}
                                    >
                                        <ShieldCheck size={18} />
                                        {isPaid ? "Payment finalized" : "Approve & process payout"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-11 rounded-xl font-semibold text-sm border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2"
                                        onClick={handleDownloadSummary}
                                    >
                                        <FileText size={18} />
                                        Download summary
                                    </Button>
                                </div>
                            </Card>

                            {/* Document action cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card
                                    className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 flex items-center gap-4 cursor-pointer hover:border-[#8B5CF6]/30 transition-colors group"
                                    onClick={handleDownloadRelievingLetter}
                                >
                                    <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                                        <Receipt size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-slate-800">Relieving Letter</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Official separation document</p>
                                    </div>
                                    <ArrowRight size={18} className="text-slate-300 group-hover:text-[#8B5CF6] transition-colors shrink-0" />
                                </Card>

                                <Card
                                    className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 flex items-center gap-4 cursor-pointer hover:border-[#8B5CF6]/30 transition-colors group"
                                    onClick={handleDownloadPaySlip}
                                >
                                    <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center text-[#8B5CF6] shrink-0">
                                        <Banknote size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-slate-800">Final Pay Slip</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Payout breakdown statement</p>
                                    </div>
                                    <ArrowRight size={18} className="text-slate-300 group-hover:text-[#8B5CF6] transition-colors shrink-0" />
                                </Card>
                            </div>
                        </>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
                            <Calculator size={48} className="text-slate-200 mb-4" />
                            <p className="text-sm text-slate-400 font-medium max-w-xs">
                                Select a separation record to begin final settlement calculations
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Process Confirmation Dialog */}
            <Dialog open={isProcessDialogOpen} onOpenChange={setIsProcessDialogOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-sm shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Confirm Settlement Payout</DialogTitle>
                        <DialogDescription className="text-sm text-slate-500">
                            Are you sure you want to process a payout of <strong className="text-slate-900">₹{netAmount.toLocaleString()}</strong> for {selectedEmp?.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsProcessDialogOpen(false)} className="rounded-xl font-bold text-slate-400 h-9 px-4 text-xs border border-slate-200">Cancel</Button>
                        <Button onClick={confirmProcess} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold h-9 px-6 text-xs">
                            Process Payout
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Custom Amounts Dialog */}
            <Dialog open={isCustomAmountOpen} onOpenChange={setIsCustomAmountOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-md shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Edit Settlement Amounts</DialogTitle>
                        <DialogDescription className="text-sm text-slate-500">Adjust the individual components of the settlement.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-700 ml-1">Basic Salary (₹)</Label>
                            <Input
                                type="number"
                                value={customAmounts.basicSalary}
                                onChange={e => setCustomAmounts({ ...customAmounts, basicSalary: e.target.value })}
                                className="rounded-xl h-9 bg-slate-50/50 border border-slate-200 font-bold px-4 text-xs"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-700 ml-1">Leave Encashment (₹)</Label>
                            <Input
                                type="number"
                                value={customAmounts.leaveEncashment}
                                onChange={e => setCustomAmounts({ ...customAmounts, leaveEncashment: e.target.value })}
                                className="rounded-xl h-9 bg-slate-50/50 border border-slate-200 font-bold px-4 text-xs"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-700 ml-1">Performance Incentive (₹)</Label>
                            <Input
                                type="number"
                                value={customAmounts.performanceIncentive}
                                onChange={e => setCustomAmounts({ ...customAmounts, performanceIncentive: e.target.value })}
                                className="rounded-xl h-9 bg-slate-50/50 border border-slate-200 font-bold px-4 text-xs"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-700 ml-1">TDS Deduction (₹)</Label>
                            <Input
                                type="number"
                                value={customAmounts.tds}
                                onChange={e => setCustomAmounts({ ...customAmounts, tds: e.target.value })}
                                className="rounded-xl h-9 bg-slate-50/50 border border-slate-200 font-bold px-4 text-xs"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-700 ml-1">Gratuity (₹)</Label>
                            <Input
                                type="number"
                                value={customAmounts.gratuity}
                                onChange={e => setCustomAmounts({ ...customAmounts, gratuity: e.target.value })}
                                className="rounded-xl h-9 bg-slate-50/50 border border-slate-200 font-bold px-4 text-xs"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsCustomAmountOpen(false)} className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl font-bold h-9 px-6 text-xs w-full">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SettlementPage;
