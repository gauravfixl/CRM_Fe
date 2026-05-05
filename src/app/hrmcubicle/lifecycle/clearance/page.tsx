"use client"

import React, { useState, useMemo, useEffect } from "react";
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
    Calendar,
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

const daysUntil = (dateStr?: string) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return Math.ceil((d.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
};

const ClearancePage = () => {
    const { toast } = useToast();
    const { employees, approveClearance, completeClearance } = useLifecycleStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{ type: "approve" | "finalize" | "approveAll"; dept?: string } | null>(null);
    const [selectedEmpId, setSelectedEmpId] = useState<string>("");

    const noticeEmployees = useMemo(() => employees.filter(e => e.status === "Notice Period"), [employees]);

    const sortedByUrgency = useMemo(() => [...noticeEmployees].sort((a, b) => {
        const da = daysUntil(a.lwd) ?? Infinity;
        const db = daysUntil(b.lwd) ?? Infinity;
        return da - db;
    }), [noticeEmployees]);

    const filteredNoticeEmployees = useMemo(() => sortedByUrgency.filter(e => {
        const q = searchTerm.toLowerCase();
        return !q || e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.department.toLowerCase().includes(q);
    }), [sortedByUrgency, searchTerm]);

    // Auto-select on mount and keep selection valid
    useEffect(() => {
        if (sortedByUrgency.length === 0) {
            if (selectedEmpId) setSelectedEmpId("");
            return;
        }
        if (!selectedEmpId || !sortedByUrgency.some(e => e.id === selectedEmpId)) {
            setSelectedEmpId(sortedByUrgency[0].id);
        }
    }, [sortedByUrgency, selectedEmpId]);

    const selectedEmp = useMemo(() => employees.find(e => e.id === selectedEmpId), [employees, selectedEmpId]);

    const clearanceItems = useMemo(() => {
        if (!selectedEmp?.clearance) return [];
        const c = selectedEmp.clearance;
        return [
            { id: "it" as const, dept: "IT Assets", items: ["Laptop return", "ID card", "Email deactivation"], icon: <Laptop size={16} />, headerBg: "bg-blue-50", headerText: "text-blue-700", isCleared: c.it },
            { id: "finance" as const, dept: "Finance", items: ["Dues clearance", "Loan recovery", "Expense claims"], icon: <DollarSign size={16} />, headerBg: "bg-amber-50", headerText: "text-amber-700", isCleared: c.finance },
            { id: "admin" as const, dept: "Admin", items: ["Drawer keys", "Parking sticker", "Access card"], icon: <Key size={16} />, headerBg: "bg-rose-50", headerText: "text-rose-700", isCleared: c.admin },
            { id: "manager" as const, dept: "Reporting Manager", items: ["KT completion", "Project handover", "Team feedback"], icon: <UserCheck size={16} />, headerBg: "bg-emerald-50", headerText: "text-emerald-700", isCleared: c.manager },
        ];
    }, [selectedEmp]);

    const clearedCount = useMemo(() => {
        if (!selectedEmp?.clearance) return 0;
        const c = selectedEmp.clearance;
        return [c.it, c.finance, c.admin, c.manager].filter(Boolean).length;
    }, [selectedEmp]);

    const progressValue = (clearedCount / 4) * 100;
    const allCleared = clearedCount === 4;
    const remainingDepts = clearanceItems.filter(d => !d.isCleared);

    // Stats
    const totalPending = noticeEmployees.length;
    const totalFullyCleared = noticeEmployees.filter(e => e.clearance && e.clearance.it && e.clearance.finance && e.clearance.admin && e.clearance.manager).length;
    const totalPartial = totalPending - totalFullyCleared;
    const stats = [
        { label: "Pending Clearance", value: totalPending, color: "bg-[#CB9DF0]", icon: <Clock className="text-slate-800" size={18} /> },
        { label: "Partially Cleared", value: totalPartial, color: "bg-[#F0C1E1]", icon: <AlertCircle className="text-slate-800" size={18} /> },
        { label: "Fully Cleared", value: totalFullyCleared, color: "bg-[#FFF9BF]", icon: <CheckCircle2 className="text-slate-800" size={18} /> },
        { label: "Departments", value: 4, color: "bg-[#FDDBBB]", icon: <ClipboardList className="text-slate-800" size={18} /> },
    ];

    const handleApprove = (dept: string) => { setConfirmAction({ type: "approve", dept }); setConfirmDialogOpen(true); };
    const handleApproveAll = () => { setConfirmAction({ type: "approveAll" }); setConfirmDialogOpen(true); };
    const handleFinalize = () => { setConfirmAction({ type: "finalize" }); setConfirmDialogOpen(true); };

    const executeAction = () => {
        if (!selectedEmpId || !confirmAction) return;
        if (confirmAction.type === "approve" && confirmAction.dept) {
            approveClearance(selectedEmpId, confirmAction.dept as keyof ClearanceStatus);
            toast({ title: "Department Cleared", description: `${confirmAction.dept.toUpperCase()} clearance finalized for ${selectedEmp?.name}.` });
        } else if (confirmAction.type === "approveAll") {
            remainingDepts.forEach(d => approveClearance(selectedEmpId, d.id));
            toast({ title: "All Remaining Cleared", description: `${remainingDepts.length} department${remainingDepts.length === 1 ? '' : 's'} cleared for ${selectedEmp?.name}.` });
        } else if (confirmAction.type === "finalize") {
            completeClearance(selectedEmpId);
            toast({ title: "Separation Finalized", description: `${selectedEmp?.name} has been moved to Exited. Proceed to Settlement.` });
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
            `Exit Reason: ${selectedEmp.exitReason || "N/A"}`,
            ``,
            `--- Department Clearance Status ---`,
            `IT Assets: ${selectedEmp.clearance?.it ? "Cleared" : "Pending"}`,
            `Finance: ${selectedEmp.clearance?.finance ? "Cleared" : "Pending"}`,
            `Admin: ${selectedEmp.clearance?.admin ? "Cleared" : "Pending"}`,
            `Reporting Manager: ${selectedEmp.clearance?.manager ? "Cleared" : "Pending"}`,
            ``,
            `Overall: ${clearedCount}/4 departments cleared (${Math.round(progressValue)}%)`,
            `Generated: ${new Date().toLocaleDateString()}`,
        ];
        const blob = new Blob([lines.join("\n")], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `clearance_report_${selectedEmp.name.replace(/\s+/g, "_")}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: "Downloaded", description: "Clearance report saved." });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-4 space-y-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Clearance Checklist</h1>
                    <p className="text-slate-500 font-bold text-[10px] mt-0.5">Stage 8: Department-wise no-due certificate management.</p>
                </div>
                <div className="flex gap-2">
                    {selectedEmp && (
                        <Button variant="outline" className="rounded-xl h-9 px-4 border-slate-200 text-slate-500 font-bold text-[10px] hover:bg-slate-50" onClick={handleExportClearance}>
                            <Download className="mr-1.5 h-3.5 w-3.5" /> Export Report
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <Card className={`border-none shadow-sm rounded-2xl ${stat.color} overflow-hidden hover:shadow-md transition-all`}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-slate-700">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                </div>
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-sm">{stat.icon}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
                {/* Sidebar */}
                <div className="lg:w-1/3">
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-slate-900">Pending Clearance</h3>
                            <Badge variant="outline" className="text-[10px] font-bold border-slate-200">{filteredNoticeEmployees.length}</Badge>
                        </div>
                        <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <Input placeholder="Search name, role, dept..." className="pl-9 rounded-xl h-9 text-xs font-bold border border-slate-200" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar max-h-[520px]">
                            {filteredNoticeEmployees.length === 0 ? (
                                <div className="py-12 text-center flex flex-col items-center gap-3">
                                    <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center"><ShieldCheck size={24} className="text-slate-300" /></div>
                                    <p className="text-xs text-slate-400 max-w-[200px] font-bold">{noticeEmployees.length === 0 ? 'No employees in notice period.' : 'No matches found.'}</p>
                                </div>
                            ) : filteredNoticeEmployees.map(emp => {
                                const empCleared = emp.clearance ? [emp.clearance.it, emp.clearance.finance, emp.clearance.admin, emp.clearance.manager].filter(Boolean).length : 0;
                                const days = daysUntil(emp.lwd);
                                const isUrgent = days !== null && days <= 7;
                                return (
                                    <div key={emp.id} onClick={() => setSelectedEmpId(emp.id)} className={`p-3 rounded-xl border cursor-pointer transition-colors ${selectedEmpId === emp.id ? "bg-[#CB9DF0]/10 border-[#CB9DF0]/30" : isUrgent ? "bg-rose-50/30 border-rose-100 hover:bg-rose-50/60" : "bg-white border-slate-100 hover:bg-slate-50"}`}>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 rounded-xl">
                                                <AvatarFallback className={selectedEmpId === emp.id ? "bg-[#CB9DF0] text-white text-xs font-bold" : "bg-slate-100 text-slate-500 text-xs font-bold"}>{emp.avatar}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-xs text-slate-800 truncate">{emp.name}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold truncate">{emp.role}</p>
                                            </div>
                                            <Badge className="text-[9px] rounded-full bg-slate-100 text-slate-500 border-none px-1.5 font-bold">{empCleared}/4</Badge>
                                        </div>
                                        {emp.lwd && (
                                            <div className="mt-2 flex items-center gap-1.5 text-[9px] font-bold">
                                                <Calendar size={10} className={isUrgent ? 'text-rose-500' : 'text-slate-400'} />
                                                <span className={isUrgent ? 'text-rose-600' : 'text-slate-500'}>
                                                    LWD: {emp.lwd} {days !== null && (days <= 0 ? '(Today)' : days === 1 ? '(Tomorrow)' : `(${days}d left)`)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* Detail */}
                <div className="lg:w-2/3 space-y-4">
                    {selectedEmp ? (
                        <>
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-2">
                                    <div>
                                        <h2 className="text-base font-bold text-slate-900">{selectedEmp.name}</h2>
                                        <p className="text-[10px] text-slate-400 font-bold">{selectedEmp.role} · {selectedEmp.department}</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Badge className="text-[10px] rounded-full bg-slate-100 text-slate-600 border-none font-bold px-2 py-0.5">Last day: {selectedEmp.lwd || "N/A"}</Badge>
                                        <Badge className={`text-[10px] rounded-full border-none font-bold px-2 py-0.5 ${allCleared ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                            {allCleared ? "All Cleared" : "In Progress"}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${progressValue}%` }} className="h-full bg-[#CB9DF0] rounded-full transition-all duration-500 ease-out" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 min-w-[60px] text-right">{clearedCount}/4</span>
                                </div>
                                {remainingDepts.length > 1 && (
                                    <Button variant="outline" size="sm" onClick={handleApproveAll} className="mt-3 h-8 rounded-xl border-slate-200 font-bold text-[10px] hover:bg-slate-50">
                                        <CheckCircle2 className="mr-1.5 h-3 w-3" /> Approve All Remaining ({remainingDepts.length})
                                    </Button>
                                )}
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {clearanceItems.map((dept) => (
                                    <Card key={dept.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                        <div className={`px-5 py-3 ${dept.headerBg} flex items-center justify-between`}>
                                            <div className={`flex items-center gap-2 ${dept.headerText}`}>
                                                {dept.icon}
                                                <span className="font-bold text-xs">{dept.dept}</span>
                                            </div>
                                            <Badge className={`text-[9px] rounded-full border-none font-bold px-2 py-0.5 ${dept.isCleared ? "bg-emerald-100 text-emerald-700" : "bg-white/70 text-slate-500"}`}>{dept.isCleared ? "Cleared" : "Pending"}</Badge>
                                        </div>
                                        <div className="p-5 space-y-3">
                                            <div className="space-y-2">
                                                {dept.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <CheckSquare size={13} className={dept.isCleared ? "text-emerald-500" : "text-slate-300"} />
                                                        <span className={`text-[11px] font-bold ${dept.isCleared ? "text-slate-400 line-through" : "text-slate-600"}`}>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <Button className={`w-full h-9 rounded-xl text-[11px] font-bold transition-colors ${dept.isCleared ? "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100" : "bg-[#CB9DF0] hover:bg-[#b580e0] text-white"}`} disabled={dept.isCleared} onClick={() => handleApprove(dept.id)}>
                                                {dept.isCleared ? (<><CheckCircle2 size={13} className="mr-1.5" /> Cleared</>) : "Approve Clearance"}
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {allCleared && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <Button className="w-full h-11 rounded-xl bg-[#CB9DF0] hover:bg-[#b580e0] text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-100" onClick={handleFinalize}>
                                        <ShieldCheck size={16} />
                                        Finalize Separation
                                        <ArrowRight size={14} />
                                    </Button>
                                </motion.div>
                            )}
                        </>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12">
                            <ClipboardList size={48} className="text-slate-200 mb-3" />
                            <p className="text-sm font-bold text-slate-400">No employee selected</p>
                            <p className="text-xs text-slate-300 mt-1 font-bold">{noticeEmployees.length === 0 ? 'Once you initiate an exit, clearance will appear here.' : 'Select an employee from the list.'}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-md shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">
                            {confirmAction?.type === "finalize" ? "Finalize Separation?" : confirmAction?.type === "approveAll" ? "Approve All Remaining?" : "Approve Department Clearance?"}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-bold text-slate-400">
                            {confirmAction?.type === "finalize"
                                ? `${selectedEmp?.name} will be moved to Exited status. The Full & Final Settlement workflow will then be available.`
                                : confirmAction?.type === "approveAll"
                                    ? `All ${remainingDepts.length} remaining department${remainingDepts.length === 1 ? '' : 's'} will be marked cleared for ${selectedEmp?.name}.`
                                    : `Approve ${confirmAction?.dept?.toUpperCase()} clearance for ${selectedEmp?.name}?`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 mt-2">
                        <Button variant="outline" onClick={() => setConfirmDialogOpen(false)} className="rounded-xl font-bold text-slate-500 h-10 px-5 text-xs border-slate-200">Cancel</Button>
                        <Button onClick={executeAction} className={`rounded-xl font-bold h-10 px-6 text-xs text-white flex-1 ${confirmAction?.type === "finalize" ? "bg-[#CB9DF0] hover:bg-[#b580e0]" : "bg-emerald-500 hover:bg-emerald-600"}`}>
                            {confirmAction?.type === "finalize" ? "Yes, Finalize" : "Yes, Approve"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ClearancePage;
