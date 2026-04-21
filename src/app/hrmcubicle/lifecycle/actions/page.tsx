"use client"

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    TrendingUp,
    ArrowRightLeft,
    DollarSign,
    LogOut,
    Search,
    Filter,
    User,
    ChevronRight,
    ArrowRight,
    History,
    MoreHorizontal,
    Star,
    Users,
    Activity,
    Target,
    RotateCcw,
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useToast } from "@/shared/components/ui/use-toast";
import { useLifecycleStore } from "@/shared/data/lifecycle-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";

type ActionType = 'Promotion' | 'Transfer' | 'Salary' | 'Exit';

const LifecycleActionsPage = () => {
    const { toast } = useToast();
    const { employees, promoteEmployee, transferEmployee, updateSalary, initiateExit, history } = useLifecycleStore();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [actionType, setActionType] = useState<ActionType>('Promotion');
    const [selectedEmpId, setSelectedEmpId] = useState("");
    const [newValue, setNewValue] = useState("");
    const [exitLwd, setExitLwd] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDept, setFilterDept] = useState("All");

    const activeEmployees = useMemo(() => employees.filter(e => {
        const matchesStatus = e.status === 'Active' || e.status === 'Probation';
        const q = searchTerm.toLowerCase();
        const matchesSearch = !q || e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q);
        const matchesDept = filterDept === "All" || e.department === filterDept;
        return matchesStatus && matchesSearch && matchesDept;
    }), [employees, searchTerm, filterDept]);

    const departments = ["All", ...Array.from(new Set(employees.map(e => e.department)))];

    const openActionDialog = (type: ActionType, empId: string = "") => {
        setActionType(type);
        setSelectedEmpId(empId);
        setNewValue("");
        setExitLwd("");
        setIsDialogOpen(true);
    };

    const selectedEmployee = useMemo(() => employees.find(e => e.id === selectedEmpId), [employees, selectedEmpId]);

    const handleSubmit = () => {
        if (!selectedEmpId) {
            toast({ title: "Select an employee", variant: "destructive" });
            return;
        }
        const employee = employees.find(e => e.id === selectedEmpId);
        if (!employee) return;

        if (actionType === 'Promotion') {
            if (!newValue.trim()) { toast({ title: "New designation required", variant: "destructive" }); return; }
            if (newValue.trim() === employee.role) { toast({ title: "Same designation", description: "New role must differ from current.", variant: "destructive" }); return; }
            promoteEmployee(selectedEmpId, newValue.trim());
            toast({ title: "Promotion Successful", description: `${employee.name} is now ${newValue.trim()}.` });
        } else if (actionType === 'Transfer') {
            if (!newValue.trim()) { toast({ title: "New department required", variant: "destructive" }); return; }
            if (newValue.trim() === employee.department) { toast({ title: "Same department", description: "New department must differ from current.", variant: "destructive" }); return; }
            transferEmployee(selectedEmpId, newValue.trim());
            toast({ title: "Transfer Completed", description: `${employee.name} moved to ${newValue.trim()}.` });
        } else if (actionType === 'Salary') {
            if (!newValue.trim()) { toast({ title: "New compensation required", variant: "destructive" }); return; }
            updateSalary(selectedEmpId, newValue.trim());
            toast({ title: "Salary Revised", description: `Compensation updated for ${employee.name}.` });
        } else if (actionType === 'Exit') {
            if (!newValue.trim()) { toast({ title: "Reason required", variant: "destructive" }); return; }
            if (!exitLwd) { toast({ title: "Last working day required", variant: "destructive" }); return; }
            initiateExit(selectedEmpId, newValue.trim(), exitLwd);
            toast({ title: "Exit Initiated", description: `${employee.name} moved to Notice Period.`, variant: "destructive" });
        }

        setIsDialogOpen(false);
        setSelectedEmpId("");
        setNewValue("");
        setExitLwd("");
    };

    const handleReset = () => {
        localStorage.clear();
        window.location.reload();
    };

    const handleExportReport = () => {
        const list = activeEmployees.length > 0 ? activeEmployees : employees;
        const headers = "Employee,Role,Department,Status,Performance";
        const rows = list.map(e => `${e.name},${e.role},${e.department},${e.status},${e.performance}%`).join("\n");
        const summary = `\n\nSummary\nTotal Active,${employees.filter(e => e.status === 'Active').length}\nPromotions Logged,${history.filter(h => h.title.includes('Promotion')).length}\nTransfers Logged,${history.filter(h => h.title.includes('Transfer')).length}\nProbationers,${employees.filter(e => e.status === 'Probation').length}`;
        const csv = `Lifecycle Actions Report\nGenerated: ${new Date().toLocaleDateString()}\nFilter: ${filterDept} / Search: ${searchTerm || 'None'}\n\n${headers}\n${rows}${summary}`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lifecycle_actions_report.csv';
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: "Report Generated", description: "CSV downloaded successfully." });
    };

    const stats = {
        promotions: history.filter(h => h.title.includes('Promotion')).length,
        transfers: history.filter(h => h.title.includes('Transfer')).length,
        probationers: employees.filter(e => e.status === 'Probation').length,
        totalActive: employees.filter(e => e.status === 'Active').length,
    };

    const actionCards = [
        { type: "Promotion", icon: <TrendingUp size={20} />, color: "bg-[#CB9DF0]", desc: "Career Advancement", stat: `${stats.promotions} This Quarter`, action: 'Promotion' as const },
        { type: "Transfer", icon: <ArrowRightLeft size={20} />, color: "bg-[#F0C1E1]", desc: "Structural Change", stat: `${stats.transfers} Moves Done`, action: 'Transfer' as const },
        { type: "Salary Revision", icon: <DollarSign size={20} />, color: "bg-[#FFF9BF]", desc: "Paygrade Update", stat: `${stats.totalActive} Eligible`, action: 'Salary' as const },
        { type: "Exit / Offboarding", icon: <LogOut size={20} />, color: "bg-[#FDDBBB]", desc: "Full Separation", stat: `${employees.filter(e => e.status === 'Notice Period').length} In Notice`, action: 'Exit' as const },
    ];

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-4 space-y-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#CB9DF0] flex items-center justify-center text-white shadow-md shadow-purple-100">
                        <Activity size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Lifecycle Actions</h1>
                        <p className="text-slate-500 font-bold text-[10px] mt-0.5">Stage 4: Execute organizational movements and growth workflows.</p>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" className="rounded-xl font-bold border-slate-200 text-slate-500 hover:bg-slate-50 h-9 px-4 text-[10px]" onClick={() => setIsResetOpen(true)}>
                        <RotateCcw size={14} className="mr-1.5" /> System Reset
                    </Button>
                    <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl font-bold h-9 px-4 shadow-lg shadow-purple-100 text-[10px]" onClick={handleExportReport}>
                        <Target size={14} className="mr-1.5" /> Generate Report
                    </Button>
                </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {actionCards.map((act, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }} className="cursor-pointer group" onClick={() => openActionDialog(act.action)}>
                        <Card className={`border-none ${act.color} rounded-2xl p-5 h-32 relative overflow-hidden shadow-sm transition-all duration-300 group-hover:shadow-lg`}>
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start gap-3">
                                    <div className="space-y-0.5">
                                        <h3 className="text-sm font-bold text-slate-900 leading-tight">{act.type}</h3>
                                        <p className="text-[10px] font-bold text-slate-800/60">{act.desc}</p>
                                    </div>
                                    <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-white/40 backdrop-blur-md text-slate-900 group-hover:rotate-12 transition-transform shrink-0">
                                        {act.icon}
                                    </div>
                                </div>
                                <Badge className="bg-white/30 text-slate-900 font-bold border-none px-2 py-0.5 rounded-full w-fit text-[9px]">{act.stat}</Badge>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Directory */}
                <div className="lg:col-span-2">
                    <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white overflow-hidden">
                        <div className="p-5 pb-0 flex justify-between items-center">
                            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <Users className="text-[#CB9DF0]" size={16} />
                                Active Personnel Directory
                                <Badge className="bg-slate-100 text-slate-400 border-none font-bold px-2 py-0.5 text-[9px]">{activeEmployees.length}</Badge>
                            </h2>
                        </div>
                        <div className="p-5">
                            <div className="flex flex-col md:flex-row gap-3 mb-5">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                    <Input placeholder="Search employee by name or role..." className="h-10 pl-9 rounded-xl bg-slate-50/50 border border-slate-100 font-bold text-xs placeholder:text-slate-300" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                </div>
                                <Select onValueChange={setFilterDept} value={filterDept}>
                                    <SelectTrigger className="w-full md:w-48 h-10 rounded-xl bg-slate-50 border border-slate-100 font-bold px-3 text-xs">
                                        <Filter className="mr-2 text-slate-400" size={14} />
                                        <SelectValue placeholder="All Departments" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl font-bold">
                                        {departments.map(d => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-bold text-slate-300 tracking-widest border-b border-slate-50">
                                            <th className="pb-2 px-3">Personnel</th>
                                            <th className="pb-2 px-3">Performance</th>
                                            <th className="pb-2 px-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50/80">
                                        {activeEmployees.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="py-10 text-center text-slate-300 font-bold text-xs italic">
                                                    {employees.filter(e => e.status === 'Active' || e.status === 'Probation').length === 0 ? 'No active personnel yet.' : 'No matching personnel.'}
                                                </td>
                                            </tr>
                                        ) : activeEmployees.map((emp) => (
                                            <tr key={emp.id} className="group hover:bg-slate-50/50 transition-all">
                                                <td className="py-3 px-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold relative group-hover:bg-[#CB9DF0]/10 group-hover:text-[#CB9DF0] transition-colors">
                                                            {emp.avatar ? <span className="text-[11px] uppercase">{emp.avatar}</span> : <User size={14} />}
                                                            {emp.status === 'Probation' && <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-amber-400 border-2 border-white" />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900 text-xs tracking-tight group-hover:text-indigo-600 transition-colors">{emp.name}</h4>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-slate-500 font-bold text-[10px]">{emp.role}</span>
                                                                <span className="text-slate-200">•</span>
                                                                <span className="text-slate-400 font-bold text-[10px]">{emp.department}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-3">
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between w-32">
                                                            <span className="text-[10px] font-bold text-slate-400">{emp.performance}%</span>
                                                            {emp.performance >= 90 && <Star size={10} className="fill-[#F0C1E1] text-[#F0C1E1]" />}
                                                        </div>
                                                        <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className={`h-full rounded-full transition-all duration-700 ${emp.performance >= 90 ? 'bg-[#CB9DF0]' : emp.performance >= 75 ? 'bg-indigo-300' : emp.performance >= 50 ? 'bg-amber-300' : 'bg-rose-300'}`} style={{ width: `${emp.performance}%` }} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-3 text-right">
                                                    <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <button className="h-8 w-8 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center text-[#CB9DF0] hover:bg-[#CB9DF0] hover:text-white transition-all active:scale-95" title="Promote" onClick={() => openActionDialog('Promotion', emp.id)}>
                                                            <TrendingUp size={13} />
                                                        </button>
                                                        <button className="h-8 w-8 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center text-pink-400 hover:bg-[#F0C1E1] hover:text-white transition-all active:scale-95" title="Transfer" onClick={() => openActionDialog('Transfer', emp.id)}>
                                                            <ArrowRightLeft size={13} />
                                                        </button>
                                                        <button className="h-8 w-8 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center text-amber-500 hover:bg-amber-500 hover:text-white transition-all active:scale-95" title="Salary" onClick={() => openActionDialog('Salary', emp.id)}>
                                                            <DollarSign size={13} />
                                                        </button>
                                                        <button className="h-8 w-8 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white transition-all active:scale-95 ml-2" title="Exit" onClick={() => openActionDialog('Exit', emp.id)}>
                                                            <LogOut size={13} />
                                                        </button>
                                                    </div>
                                                    <MoreHorizontal className="text-slate-200 group-hover:hidden inline-block" size={18} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* History */}
                <div className="h-full">
                    <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white h-full flex flex-col">
                        <div className="p-5 pb-0 flex justify-between items-center">
                            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <History className="text-slate-300" size={16} />
                                Growth Audit
                                <Badge className="bg-slate-100 text-slate-400 border-none font-bold px-2 py-0.5 text-[9px]">{history.length}</Badge>
                            </h2>
                        </div>
                        <div className="p-5 flex-1 max-h-[500px] overflow-y-auto custom-scrollbar">
                            <div className="relative space-y-5">
                                <div className="absolute left-2 top-2 bottom-4 w-0.5 bg-slate-50" />
                                {history.length === 0 ? (
                                    <div className="text-center py-12 space-y-3">
                                        <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-200">
                                            <History size={28} />
                                        </div>
                                        <p className="text-slate-300 font-bold italic text-xs max-w-[180px] mx-auto">Growth history is recorded as you take actions.</p>
                                    </div>
                                ) : history.slice(0, 30).map((log) => (
                                    <div key={log.id} className="relative pl-8 group">
                                        <div className={`absolute left-0.5 top-1 h-3 w-3 rounded-full border-2 border-white shadow z-10 transition-transform group-hover:scale-125 ${log.type === 'growth' ? 'bg-[#CB9DF0]' : log.type === 'warning' ? 'bg-rose-500' : log.type === 'exit' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-bold text-slate-300 tracking-wide">{log.date}</p>
                                            <h4 className="font-bold text-slate-900 text-[11px] leading-snug group-hover:text-indigo-600 transition-colors">{log.title}</h4>
                                            <p className="text-slate-400 font-bold text-[10px] leading-relaxed line-clamp-2">{log.description}</p>
                                        </div>
                                        <Badge className="mt-1.5 bg-slate-50 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded-md border-none">{log.employeeName}</Badge>
                                    </div>
                                ))}
                                {history.length > 30 && (
                                    <p className="text-center text-[10px] font-bold text-slate-300 pt-3 border-t border-slate-50">Showing 30 of {history.length} entries</p>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Unified Action Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-md shadow-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-1">
                            <div className={`h-11 w-11 rounded-xl flex items-center justify-center text-white shadow-md ${actionType === 'Promotion' ? 'bg-[#CB9DF0]' : actionType === 'Transfer' ? 'bg-[#F0C1E1]' : actionType === 'Salary' ? 'bg-amber-500' : 'bg-rose-500'}`}>
                                {actionType === 'Promotion' && <TrendingUp size={20} />}
                                {actionType === 'Transfer' && <ArrowRightLeft size={20} />}
                                {actionType === 'Salary' && <DollarSign size={20} />}
                                {actionType === 'Exit' && <LogOut size={20} />}
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-slate-900">Initiate {actionType}</DialogTitle>
                                <DialogDescription className="text-[10px] font-bold text-slate-400">Personnel management authorization</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 py-3">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide ml-1">Target Personnel</Label>
                            <Select onValueChange={setSelectedEmpId} value={selectedEmpId}>
                                <SelectTrigger className="rounded-xl h-10 bg-slate-50 border border-slate-100 font-bold text-xs"><SelectValue placeholder="Select employee..." /></SelectTrigger>
                                <SelectContent className="rounded-xl font-bold">
                                    {employees.filter(e => e.status !== 'Exited' && e.status !== 'Notice Period').length === 0 ? (
                                        <div className="px-3 py-2 text-xs font-bold text-slate-400">No eligible employees</div>
                                    ) : employees.filter(e => e.status !== 'Exited' && e.status !== 'Notice Period').map(e => (
                                        <SelectItem key={e.id} value={e.id} className="font-bold text-xs">
                                            {e.name} <span className="text-slate-300 mx-1">|</span> <span className="text-slate-400">{e.role}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedEmployee && actionType !== 'Exit' && (
                                <p className="text-[10px] font-bold text-slate-400 ml-1">Current: {actionType === 'Promotion' ? selectedEmployee.role : actionType === 'Transfer' ? selectedEmployee.department : 'Salary data'}</p>
                            )}
                        </div>

                        <AnimatePresence mode="wait">
                            {actionType === 'Exit' ? (
                                <motion.div key="exit-fields" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide ml-1">Reason for Exit</Label>
                                        <textarea value={newValue} onChange={e => setNewValue(e.target.value)} rows={3} placeholder="e.g. Personal reasons, better opportunity..." className="w-full rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs font-medium text-slate-700 outline-none focus:border-indigo-200 resize-none" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide ml-1">Last Working Day</Label>
                                        <Input type="date" min={new Date().toISOString().split('T')[0]} value={exitLwd} onChange={e => setExitLwd(e.target.value)} className="rounded-xl h-10 bg-slate-50 border border-slate-100 font-bold text-xs" />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="normal-fields" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-1.5">
                                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide ml-1">
                                        {actionType === 'Promotion' ? 'New Designation' : actionType === 'Transfer' ? 'New Department' : 'New Compensation'}
                                    </Label>
                                    <div className="relative">
                                        <Input placeholder={actionType === 'Promotion' ? "e.g. Lead Engineer" : actionType === 'Transfer' ? "e.g. Growth / UK" : "e.g. ₹32,00,000"} value={newValue} onChange={e => setNewValue(e.target.value)} className="rounded-xl h-10 bg-slate-50 border border-slate-100 font-bold text-xs pr-10" />
                                        <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-10 px-6 font-bold border-slate-200 text-xs">Cancel</Button>
                        <Button className={`flex-1 text-white rounded-xl font-bold h-10 text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${actionType === 'Exit' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-100' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'}`} onClick={handleSubmit}>
                            Authorize {actionType} <ChevronRight size={14} />
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reset Confirmation */}
            <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-sm shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Reset All Lifecycle Data?</DialogTitle>
                        <DialogDescription className="text-xs font-bold text-slate-400">
                            This clears ALL local storage (candidates, hires, employees, assets, policies, history) and reloads the page. Mock seed data will be restored. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 mt-2">
                        <Button variant="outline" onClick={() => setIsResetOpen(false)} className="rounded-xl h-10 font-bold border-slate-200 text-xs">Cancel</Button>
                        <Button onClick={handleReset} className="bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl h-10 text-xs">Yes, Reset Everything</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LifecycleActionsPage;
