"use client"

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    CheckSquare,
    Laptop,
    DollarSign,
    Key,
    UserCheck,
    ShieldCheck,
    ArrowRight,
    ClipboardList,
    Search,
    AlertCircle,
    Clock,
    CheckCircle2,
    Download,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { useLifecycleStore, ClearanceStatus } from "@/shared/data/lifecycle-store";
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

const ClearancePage = () => {
    const { toast } = useToast();
    const { employees, approveClearance, completeClearance } = useLifecycleStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{ type: "approve" | "finalize"; dept?: string } | null>(null);

    const noticeEmployees = useMemo(() =>
        employees.filter(e => e.status === "Notice Period"),
        [employees]
    );

    const filteredNoticeEmployees = useMemo(() =>
        noticeEmployees.filter(e =>
            e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.role.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [noticeEmployees, searchTerm]
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
            { id: "it", dept: "IT Assets", items: ["Laptop return", "ID card", "Email deactivation"], icon: <Laptop size={18} />, headerBg: "bg-blue-50", headerText: "text-blue-700", badgeBg: "bg-blue-100 text-blue-700", isCleared: c.it },
            { id: "finance", dept: "Finance", items: ["Dues clearance", "Loan recovery", "Expense claims"], icon: <DollarSign size={18} />, headerBg: "bg-amber-50", headerText: "text-amber-700", badgeBg: "bg-amber-100 text-amber-700", isCleared: c.finance },
            { id: "admin", dept: "Admin", items: ["Drawer keys", "Parking sticker", "Access card"], icon: <Key size={18} />, headerBg: "bg-rose-50", headerText: "text-rose-700", badgeBg: "bg-rose-100 text-rose-700", isCleared: c.admin },
            { id: "manager", dept: "Reporting Manager", items: ["KT completion", "Project handover", "Team feedback"], icon: <UserCheck size={18} />, headerBg: "bg-emerald-50", headerText: "text-emerald-700", badgeBg: "bg-emerald-100 text-emerald-700", isCleared: c.manager },
        ];
    }, [selectedEmp]);

    const progressValue = useMemo(() => {
        if (!selectedEmp?.clearance) return 0;
        const c = selectedEmp.clearance;
        const clearedCount = [c.it, c.finance, c.admin, c.manager].filter(Boolean).length;
        return (clearedCount / 4) * 100;
    }, [selectedEmp]);

    const allCleared = progressValue === 100;

    const clearedCount = useMemo(() => {
        if (!selectedEmp?.clearance) return 0;
        const c = selectedEmp.clearance;
        return [c.it, c.finance, c.admin, c.manager].filter(Boolean).length;
    }, [selectedEmp]);

    // Stats
    const totalPending = noticeEmployees.length;
    const totalFullyCleared = noticeEmployees.filter(e => {
        if (!e.clearance) return false;
        return e.clearance.it && e.clearance.finance && e.clearance.admin && e.clearance.manager;
    }).length;
    const totalPartial = totalPending - totalFullyCleared;

    const stats = [
        { label: "Pending Clearance", value: totalPending, color: "bg-[#CB9DF0]", icon: <Clock className="text-slate-800" size={20} /> },
        { label: "Partially Cleared", value: totalPartial, color: "bg-[#F0C1E1]", icon: <AlertCircle className="text-slate-800" size={20} /> },
        { label: "Fully Cleared", value: totalFullyCleared, color: "bg-[#FFF9BF]", icon: <CheckCircle2 className="text-slate-800" size={20} /> },
        { label: "Departments", value: 4, color: "bg-[#FDDBBB]", icon: <ClipboardList className="text-slate-800" size={20} /> },
    ];

    const handleApprove = (dept: string) => {
        setConfirmAction({ type: "approve", dept });
        setConfirmDialogOpen(true);
    };

    const handleFinalize = () => {
        setConfirmAction({ type: "finalize" });
        setConfirmDialogOpen(true);
    };

    const executeAction = () => {
        if (!selectedEmpId || !confirmAction) return;

        if (confirmAction.type === "approve" && confirmAction.dept) {
            approveClearance(selectedEmpId, confirmAction.dept as keyof ClearanceStatus);
            toast({
                title: "Department cleared",
                description: `${confirmAction.dept} clearance finalized for ${selectedEmp?.name}.`,
            });
        } else if (confirmAction.type === "finalize") {
            completeClearance(selectedEmpId);
            toast({
                title: "Separation finalized",
                description: `${selectedEmp?.name} has been moved to exited status.`,
            });
            setSelectedEmpId("");
        }

        setConfirmDialogOpen(false);
        setConfirmAction(null);
    };

    const handleExportClearance = () => {
        if (!selectedEmp) return;
        const lines = [
            `Clearance Checklist Report`,
            `${"=".repeat(40)}`,
            `Employee: ${selectedEmp.name}`,
            `ID: ${selectedEmp.id}`,
            `Department: ${selectedEmp.department}`,
            `Role: ${selectedEmp.role}`,
            `Last Working Day: ${selectedEmp.lwd || "N/A"}`,
            ``,
            `--- Department Clearance Status ---`,
            `IT Assets: ${selectedEmp.clearance?.it ? "Cleared" : "Pending"}`,
            `Finance: ${selectedEmp.clearance?.finance ? "Cleared" : "Pending"}`,
            `Admin: ${selectedEmp.clearance?.admin ? "Cleared" : "Pending"}`,
            `Reporting Manager: ${selectedEmp.clearance?.manager ? "Cleared" : "Pending"}`,
            ``,
            `Overall: ${clearedCount}/4 departments cleared`,
            `Generated: ${new Date().toLocaleDateString()}`,
        ];
        const blob = new Blob([lines.join("\n")], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `clearance_report_${selectedEmp.name.replace(/\s+/g, "_")}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: "Downloaded", description: "Clearance report has been downloaded." });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-4 space-y-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Clearance Checklist</h1>
                    <p className="text-slate-500 font-bold text-[10px] mt-0.5">Stage 8: Department-wise no-due certificate management.</p>
                </div>
                <div className="flex gap-2">
                    {selectedEmp && (
                        <Button
                            variant="outline"
                            className="rounded-xl h-9 px-4 border-slate-200 text-slate-500 font-bold text-[10px] hover:bg-slate-50"
                            onClick={handleExportClearance}
                        >
                            <Download className="mr-1.5 h-3.5 w-3.5" /> Export Report
                        </Button>
                    )}
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

            <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
                {/* Left sidebar - Employee list */}
                <div className="lg:w-1/3">
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-slate-900">Pending Clearance</h3>
                            <Badge variant="outline" className="text-[10px] font-bold border-slate-200">{noticeEmployees.length}</Badge>
                        </div>

                        <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <Input
                                placeholder="Search employees..."
                                className="pl-9 rounded-xl h-9 text-xs font-bold border border-slate-200"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
                            {filteredNoticeEmployees.length === 0 ? (
                                <div className="py-16 text-center flex flex-col items-center gap-3">
                                    <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center">
                                        <ShieldCheck size={32} className="text-slate-300" />
                                    </div>
                                    <p className="text-sm text-slate-400 max-w-[200px]">No employees in notice period</p>
                                </div>
                            ) : filteredNoticeEmployees.map(emp => {
                                const empCleared = emp.clearance ? [emp.clearance.it, emp.clearance.finance, emp.clearance.admin, emp.clearance.manager].filter(Boolean).length : 0;
                                return (
                                    <div
                                        key={emp.id}
                                        onClick={() => setSelectedEmpId(emp.id)}
                                        className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-colors
                                        ${selectedEmpId === emp.id
                                                ? "bg-[#8B5CF6]/5 border-[#8B5CF6]/20"
                                                : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                                            }`}
                                    >
                                        <Avatar className="h-9 w-9 rounded-xl">
                                            <AvatarFallback className={selectedEmpId === emp.id ? "bg-[#8B5CF6] text-white text-xs font-semibold" : "bg-slate-100 text-slate-500 text-xs font-semibold"}>{emp.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm text-slate-800 truncate">{emp.name}</h4>
                                            <p className="text-xs text-slate-400">{emp.role}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <Badge className="text-[8px] rounded-full bg-slate-100 text-slate-500 border-none px-1.5">
                                                {empCleared}/4
                                            </Badge>
                                            {selectedEmpId === emp.id && (
                                                <div className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* Right panel - Clearance details */}
                <div className="lg:w-2/3 space-y-4">
                    {selectedEmp ? (
                        <>
                            {/* Progress bar */}
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">{selectedEmp.name}</h2>
                                        <p className="text-xs text-slate-400">{selectedEmp.role} · {selectedEmp.department}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className="text-[10px] rounded-full bg-slate-100 text-slate-600 border-none font-medium px-2.5 py-0.5">
                                            Last day: {selectedEmp.lwd || "N/A"}
                                        </Badge>
                                        <Badge className={`text-[10px] rounded-full border-none font-medium px-2.5 py-0.5 ${allCleared ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                            {allCleared ? "All Cleared" : "In Progress"}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressValue}%` }}
                                            className="h-full bg-[#8B5CF6] rounded-full transition-all duration-500 ease-out"
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 min-w-[60px] text-right">{clearedCount}/4 cleared</span>
                                </div>
                            </Card>

                            {/* Department cards grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {clearanceItems.map((dept) => (
                                    <Card key={dept.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                        <div className={`px-5 py-3.5 ${dept.headerBg} flex items-center justify-between`}>
                                            <div className={`flex items-center gap-2.5 ${dept.headerText}`}>
                                                {dept.icon}
                                                <span className="font-semibold text-sm">{dept.dept}</span>
                                            </div>
                                            <Badge className={`text-[10px] rounded-full border-none font-medium px-2 py-0.5 ${dept.isCleared
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-white/70 text-slate-500"
                                                }`}>
                                                {dept.isCleared ? "Cleared" : "Pending"}
                                            </Badge>
                                        </div>
                                        <div className="p-5 space-y-4">
                                            <div className="space-y-2.5">
                                                {dept.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-2.5">
                                                        <CheckSquare size={14} className={dept.isCleared ? "text-emerald-500" : "text-slate-300"} />
                                                        <span className={`text-sm ${dept.isCleared ? "text-slate-400 line-through" : "text-slate-600"}`}>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <Button
                                                className={`w-full h-9 rounded-xl text-xs font-semibold transition-colors
                                                    ${dept.isCleared
                                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100"
                                                        : "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                                                    }`}
                                                disabled={dept.isCleared}
                                                onClick={() => handleApprove(dept.id)}
                                            >
                                                {dept.isCleared ? (
                                                    <><CheckCircle2 size={14} className="mr-1.5" /> Cleared</>
                                                ) : (
                                                    "Approve Clearance"
                                                )}
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Finalize button */}
                            {allCleared && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <Button
                                        className="w-full h-12 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-100"
                                        onClick={handleFinalize}
                                    >
                                        <ShieldCheck size={18} />
                                        Finalize Separation
                                        <ArrowRight size={16} />
                                    </Button>
                                </motion.div>
                            )}
                        </>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12">
                            <ClipboardList size={48} className="text-slate-200 mb-4" />
                            <p className="text-base font-semibold text-slate-400">No employee selected</p>
                            <p className="text-sm text-slate-300 mt-1">Select an employee from the list to manage their clearance</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-sm shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">
                            {confirmAction?.type === "finalize" ? "Finalize Separation" : "Approve Department Clearance"}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-500">
                            {confirmAction?.type === "finalize"
                                ? `Are you sure you want to finalize the separation for ${selectedEmp?.name}? This will move them to exited status.`
                                : `Are you sure you want to approve ${confirmAction?.dept?.toUpperCase()} clearance for ${selectedEmp?.name}?`
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 mt-4">
                        <Button variant="outline" onClick={() => setConfirmDialogOpen(false)} className="rounded-xl font-bold text-slate-400 h-9 px-4 text-xs border border-slate-200">Cancel</Button>
                        <Button
                            onClick={executeAction}
                            className={`rounded-xl font-bold h-9 px-6 text-xs text-white ${confirmAction?.type === "finalize" ? "bg-[#8B5CF6] hover:bg-[#7C3AED]" : "bg-emerald-500 hover:bg-emerald-600"}`}
                        >
                            {confirmAction?.type === "finalize" ? "Finalize" : "Approve"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ClearancePage;
