"use client"

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    AlertCircle,
    Search,
    ChevronRight,
    Calendar,
    Activity,
    Target,
    History,
    Hourglass,
    Zap,
    AlertTriangle,
    TrendingUp,
    MoreHorizontal,
    RotateCcw,
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useToast } from "@/shared/components/ui/use-toast";
import { useLifecycleStore, LifecycleEmployee, HistoryLog } from "@/shared/data/lifecycle-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/components/ui/input";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";

const ProbationManagementPage = () => {
    const { toast } = useToast();
    const { employees, confirmProbation, history, extendProbation, bulkConfirmHighPerformers } = useLifecycleStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [filterDept, setFilterDept] = useState("All");
    const [filterActive, setFilterActive] = useState<"All" | "Critical" | "Top" | "DueSoon">("All");

    const [isArchiveOpen, setIsArchiveOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [isExtendOpen, setIsExtendOpen] = useState(false);
    const [confirmEmpId, setConfirmEmpId] = useState<string | null>(null);

    const [extensionEmpId, setExtensionEmpId] = useState<string | null>(null);
    const [extensionMonths, setExtensionMonths] = useState("3");
    const [extensionReason, setExtensionReason] = useState("");

    const isDueSoon = (endDateStr: string) => {
        const endDate = new Date(endDateStr);
        const diffDays = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7;
    };

    const probationers = useMemo(() => employees.filter((e: LifecycleEmployee) => {
        if (e.status !== 'Probation') return false;
        const q = searchTerm.toLowerCase();
        const matchesSearch = !q || e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q);
        const matchesDept = filterDept === "All" || e.department === filterDept;
        let matchesActive = true;
        if (filterActive === "Critical") matchesActive = (e.performance || 0) < 70;
        if (filterActive === "Top") matchesActive = (e.performance || 0) >= 90;
        if (filterActive === "DueSoon") matchesActive = isDueSoon(e.probationEnd);
        return matchesSearch && matchesDept && matchesActive;
    }), [employees, searchTerm, filterDept, filterActive]);

    const allProbationers = useMemo(() => employees.filter(e => e.status === 'Probation'), [employees]);
    const departments = useMemo(() => ["All", ...Array.from(new Set(employees.map(e => e.department)))], [employees]);

    const confirmEmployee = useMemo(() => employees.find(e => e.id === confirmEmpId), [employees, confirmEmpId]);
    const extendEmployee = useMemo(() => employees.find(e => e.id === extensionEmpId), [employees, extensionEmpId]);

    const topPerformersGlobal = useMemo(() => allProbationers.filter(e => e.performance >= 90), [allProbationers]);

    const handleConfirmClick = (empId: string) => { setConfirmEmpId(empId); setIsConfirmOpen(true); };
    const handleExtendClick = (empId: string) => { setExtensionEmpId(empId); setExtensionMonths("3"); setExtensionReason(""); setIsExtendOpen(true); };

    const executeConfirm = () => {
        if (!confirmEmpId || !confirmEmployee) return;
        confirmProbation(confirmEmpId);
        toast({ title: "Probation Confirmed", description: `${confirmEmployee.name} is now a permanent employee.` });
        setIsConfirmOpen(false);
        setConfirmEmpId(null);
    };

    const executeBulkConfirm = () => {
        if (topPerformersGlobal.length === 0) {
            toast({ title: "No high performers", description: "No probationers have ≥90% performance.", variant: "destructive" });
            setIsBulkConfirmOpen(false);
            return;
        }
        bulkConfirmHighPerformers();
        toast({ title: "Bulk Confirmation Success", description: `Confirmed ${topPerformersGlobal.length} top performers.` });
        setIsBulkConfirmOpen(false);
    };

    const submitExtension = () => {
        if (!extensionEmpId) return;
        if (!extensionReason.trim()) {
            toast({ title: "Reason required", description: "Provide a reason for extension.", variant: "destructive" });
            return;
        }
        extendProbation(extensionEmpId, parseInt(extensionMonths), extensionReason.trim());
        toast({ title: "Probation Extended", description: `Review period updated.` });
        setIsExtendOpen(false);
        setExtensionReason("");
        setExtensionEmpId(null);
    };

    const handleReset = () => { localStorage.clear(); window.location.reload(); };

    const handlePerformanceInsights = () => {
        const avg = allProbationers.length > 0 ? Math.round(allProbationers.reduce((a, c) => a + c.performance, 0) / allProbationers.length) : 0;
        const critical = allProbationers.filter(e => e.performance < 70).length;
        toast({ title: "Performance Insights", description: `Average probationer score: ${avg}%. ${critical} critical case${critical === 1 ? '' : 's'}.` });
    };

    const getPerformanceInfo = (score: number) => {
        if (score >= 90) return { label: "High Flyer", color: "bg-purple-100 text-purple-600 border-purple-200", icon: <Zap size={10} /> };
        if (score >= 70) return { label: "Progressive", color: "bg-blue-100 text-blue-600 border-blue-200", icon: <TrendingUp size={10} /> };
        return { label: "PIP Candidate", color: "bg-rose-100 text-rose-600 border-rose-200", icon: <AlertTriangle size={10} /> };
    };

    const getTenureMonth = (joinDate: string) => {
        const start = new Date(joinDate);
        const now = new Date();
        const diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
        return Math.max(1, diffMonths + 1);
    };

    const stats = useMemo(() => ({
        active: allProbationers.length,
        critical: allProbationers.filter(e => e.performance < 70).length,
        top: allProbationers.filter(e => e.performance >= 90).length,
        dueSoon: allProbationers.filter(e => isDueSoon(e.probationEnd)).length,
    }), [allProbationers]);

    const statCards = [
        { title: "Due Soon", value: stats.dueSoon, icon: <Calendar size={18} />, color: "bg-[#F0C1E1]", desc: "Next 7 days", filter: "DueSoon" as const },
        { title: "Active Probation", value: stats.active, icon: <Hourglass size={18} />, color: "bg-[#CB9DF0]", desc: "Total pipeline", filter: "All" as const },
        { title: "Top Performers", value: stats.top, icon: <Zap size={18} />, color: "bg-[#FFF9BF]", desc: "≥90% score", filter: "Top" as const },
        { title: "Critical Cases", value: stats.critical, icon: <AlertCircle size={18} />, color: "bg-[#FDDBBB]", desc: "<70% score", filter: "Critical" as const },
    ];

    const probationHistory = history.filter((h: HistoryLog) => {
        const t = h.title.toLowerCase();
        return t.includes('probation') || t.includes('bulk confirmation') || t.includes('employee confirmed');
    });

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-4 space-y-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#CB9DF0] flex items-center justify-center text-white shadow-md shadow-purple-100">
                        <Activity size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Probation Management</h1>
                        <p className="text-slate-500 font-bold text-[10px] mt-0.5">Stage 5: High-density performance monitoring and permanent transitions.</p>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" className="rounded-xl font-bold border-slate-200 text-slate-500 hover:bg-slate-50 h-9 px-4 text-[10px]" onClick={() => setIsResetOpen(true)}>
                        <RotateCcw size={14} className="mr-1.5" /> System Reset
                    </Button>
                    <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl font-bold h-9 px-4 shadow-lg shadow-purple-100 text-[10px]" onClick={handlePerformanceInsights}>
                        <Target size={14} className="mr-1.5" /> Performance Insights
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <motion.div key={card.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -3 }} className={`group cursor-pointer transition-all ${filterActive === card.filter ? 'ring-2 ring-purple-300 rounded-2xl' : ''}`} onClick={() => setFilterActive(card.filter)}>
                        <Card className={`border-none ${card.color} rounded-2xl p-4 h-24 relative overflow-hidden shadow-sm`}>
                            <div className="relative z-10 h-full flex items-center gap-4">
                                <div className="text-slate-900/80">{card.icon}</div>
                                <div className="space-y-0.5">
                                    <div className="text-[10px] font-bold text-slate-900/60 uppercase tracking-wide">{card.title}</div>
                                    <div className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Personnel List */}
            <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white overflow-hidden">
                <div className="p-5 border-b border-slate-50 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3 bg-slate-50/20">
                    <div className="flex items-center gap-3 flex-wrap">
                        <Activity className="text-[#CB9DF0]" size={18} />
                        <h2 className="text-sm font-bold text-slate-800">Personnel Probation Queue</h2>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-400 border-none font-bold px-2 py-0.5 text-[9px]">{probationers.length} shown</Badge>
                        <Button variant="outline" onClick={() => setIsBulkConfirmOpen(true)} className="h-9 px-4 rounded-xl border-purple-200 text-purple-600 font-bold hover:bg-purple-50 flex items-center gap-1.5 text-[10px]" disabled={topPerformersGlobal.length === 0}>
                            <Zap size={12} className="fill-purple-600" /> Bulk Confirm Top Performers
                        </Button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                            <Input placeholder="Search name or role..." className="h-9 pl-9 w-56 rounded-xl bg-white border border-slate-100 font-bold text-xs" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                        <Select onValueChange={setFilterDept} value={filterDept}>
                            <SelectTrigger className="w-40 h-9 rounded-xl bg-white border border-slate-100 font-bold px-3 text-xs"><SelectValue placeholder="All Departments" /></SelectTrigger>
                            <SelectContent className="rounded-xl font-bold">
                                {departments.map(d => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {filterActive !== 'All' && (
                            <Button variant="ghost" size="sm" onClick={() => setFilterActive('All')} className="h-9 px-3 text-[10px] font-bold text-slate-500">Clear filter</Button>
                        )}
                    </div>
                </div>

                <div className="p-5 space-y-3">
                    {probationers.length === 0 ? (
                        <div className="py-12 text-center space-y-3">
                            <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-200">
                                <Hourglass size={28} />
                            </div>
                            <p className="text-slate-400 font-bold text-xs max-w-xs mx-auto">{allProbationers.length === 0 ? 'No employees currently on probation.' : 'No personnel match your current filters.'}</p>
                        </div>
                    ) : probationers.map((emp) => {
                        const perf = getPerformanceInfo(emp.performance);
                        const dueSoon = isDueSoon(emp.probationEnd);
                        const month = getTenureMonth(emp.joinDate);

                        return (
                            <motion.div key={emp.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`group relative p-4 rounded-2xl border transition-all hover:bg-white hover:shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${dueSoon ? 'bg-rose-50/20 border-rose-100' : 'bg-slate-50/20 border-slate-100'}`}>
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="relative shrink-0">
                                        <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#CB9DF0] font-bold text-sm border border-slate-100">{emp.avatar || emp.name[0]}</div>
                                        {dueSoon && <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-rose-500 border-2 border-white animate-pulse" />}
                                    </div>
                                    <div className="space-y-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="text-sm font-bold text-slate-900 tracking-tight truncate">{emp.name}</h4>
                                            <Badge variant="outline" className={`font-bold text-[9px] uppercase tracking-wide h-5 flex items-center gap-1 px-2 rounded-full ${perf.color}`}>{perf.icon} {perf.label}</Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px]">
                                            <span>{emp.role}</span>
                                            <span className="h-1 w-1 rounded-full bg-slate-200" />
                                            <span>{emp.department}</span>
                                            <span className="h-1 w-1 rounded-full bg-slate-200" />
                                            <span className="text-[#CB9DF0]">Month {month} of 6</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 flex-wrap lg:flex-nowrap">
                                    <div className="space-y-1.5 min-w-[140px]">
                                        <div className="flex justify-between">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Performance</span>
                                            <span className="text-[10px] font-bold text-slate-700">{emp.performance}%</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${emp.performance}%` }} className={`h-full rounded-full ${emp.performance >= 90 ? 'bg-purple-500' : emp.performance >= 70 ? 'bg-[#CB9DF0]' : 'bg-rose-500'}`} />
                                        </div>
                                    </div>

                                    <div className="text-right space-y-0.5 min-w-[90px]">
                                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-wide flex items-center justify-end gap-1">
                                            {dueSoon && <AlertTriangle size={10} className="text-rose-500" />}
                                            End Date
                                        </p>
                                        <p className={`text-xs font-bold ${dueSoon ? 'text-rose-600' : 'text-slate-800'}`}>{new Date(emp.probationEnd).toLocaleDateString()}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button onClick={() => handleConfirmClick(emp.id)} className="h-9 px-4 rounded-xl bg-[#CB9DF0] hover:bg-[#b580e0] text-white font-bold text-[10px] shadow-md shadow-purple-100 transition-all active:scale-95">
                                            Confirm <ChevronRight className="ml-1" size={12} />
                                        </Button>
                                        <Button variant="outline" onClick={() => handleExtendClick(emp.id)} className="h-9 w-9 rounded-xl border-slate-200 text-slate-400 hover:text-[#CB9DF0] hover:border-[#CB9DF0]/30 hover:bg-slate-50 p-0" title="Extend Probation">
                                            <History size={14} />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </Card>

            {/* Timeline */}
            <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white p-6">
                <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        <History size={16} className="text-[#CB9DF0]" />
                        <h3 className="text-sm font-bold text-slate-900">Probation Audit Log</h3>
                        <Badge className="bg-slate-100 text-slate-400 border-none font-bold px-2 py-0.5 text-[9px]">{probationHistory.length}</Badge>
                    </div>
                    <Button variant="ghost" className="text-[#CB9DF0] font-bold text-xs h-8" onClick={() => setIsArchiveOpen(true)} disabled={probationHistory.length === 0}>
                        View full archive
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {probationHistory.length === 0 ? (
                        <div className="col-span-full py-10 text-center text-slate-300 font-bold text-xs border-2 border-dashed border-slate-50 rounded-2xl">No probation events recorded.</div>
                    ) : probationHistory.slice(0, 6).map((log) => (
                        <motion.div key={log.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 hover:shadow-sm hover:bg-white transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-[9px] font-bold text-slate-300 tracking-wide uppercase">{log.date}</p>
                                <Badge className={`h-2 w-2 rounded-full p-0 min-w-0 ${log.type === 'growth' ? 'bg-[#CB9DF0]' : 'bg-slate-300'}`} />
                            </div>
                            <h4 className="font-bold text-slate-900 text-xs mb-1 leading-tight">{log.title}</h4>
                            <p className="text-slate-400 font-bold text-[10px] leading-relaxed line-clamp-2">{log.description}</p>
                            <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-5 rounded-full bg-white border border-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-400 uppercase">{log.employeeName[0]}</div>
                                    <span className="text-[9px] font-bold text-slate-500">{log.employeeName}</span>
                                </div>
                                <button className="h-6 w-6 rounded-lg bg-white border border-slate-50 flex items-center justify-center text-slate-300 hover:text-[#CB9DF0]" onClick={() => toast({ title: log.title, description: log.description })}>
                                    <MoreHorizontal size={12} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Card>

            {/* Archive Dialog */}
            <Dialog open={isArchiveOpen} onOpenChange={setIsArchiveOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-2xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Probation Lifecycle Archive</DialogTitle>
                        <DialogDescription className="text-[10px] font-bold text-slate-400">Complete history of all probation-related events.</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar space-y-2 pr-2 py-3">
                        {probationHistory.length === 0 ? (
                            <div className="py-10 text-center text-slate-400 font-bold text-xs border-2 border-dashed border-slate-100 rounded-2xl">No probation events recorded.</div>
                        ) : probationHistory.map((log) => (
                            <div key={log.id} className="p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-[9px] font-bold text-slate-300 tracking-wide uppercase">{log.date}</p>
                                    <Badge className={`h-2 w-2 rounded-full p-0 min-w-0 ${log.type === 'growth' ? 'bg-[#CB9DF0]' : 'bg-slate-300'}`} />
                                </div>
                                <h4 className="font-bold text-slate-900 text-xs mb-0.5">{log.title}</h4>
                                <p className="text-slate-400 font-bold text-[10px] leading-relaxed">{log.description}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="h-5 w-5 rounded-full bg-white border border-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-400 uppercase">{log.employeeName[0]}</div>
                                    <span className="text-[9px] font-bold text-slate-500">{log.employeeName}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsArchiveOpen(false)} className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white font-bold rounded-xl h-10 w-full text-xs">Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirm Personnel Dialog */}
            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-sm shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Confirm Probation?</DialogTitle>
                        <DialogDescription className="text-xs font-bold text-slate-400">
                            {confirmEmployee ? `This will mark ${confirmEmployee.name} as a permanent employee (Active). Performance score: ${confirmEmployee.performance}%.` : ''}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 mt-2">
                        <Button variant="outline" onClick={() => setIsConfirmOpen(false)} className="rounded-xl h-10 font-bold border-slate-200 text-xs">Cancel</Button>
                        <Button onClick={executeConfirm} className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white font-bold rounded-xl h-10 text-xs">Yes, Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk Confirm Dialog */}
            <Dialog open={isBulkConfirmOpen} onOpenChange={setIsBulkConfirmOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-md shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Bulk Confirm Top Performers?</DialogTitle>
                        <DialogDescription className="text-xs font-bold text-slate-400">
                            {topPerformersGlobal.length === 0
                                ? "No probationers currently meet the ≥90% threshold."
                                : `${topPerformersGlobal.length} probationer${topPerformersGlobal.length === 1 ? '' : 's'} will be promoted to Active: ${topPerformersGlobal.map(e => e.name).join(', ')}`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 mt-2">
                        <Button variant="outline" onClick={() => setIsBulkConfirmOpen(false)} className="rounded-xl h-10 font-bold border-slate-200 text-xs">Cancel</Button>
                        <Button onClick={executeBulkConfirm} disabled={topPerformersGlobal.length === 0} className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white font-bold rounded-xl h-10 text-xs disabled:opacity-50">Confirm All</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reset Confirm */}
            <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-sm shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Reset All Lifecycle Data?</DialogTitle>
                        <DialogDescription className="text-xs font-bold text-slate-400">This clears ALL local storage and reloads. Mock data will be restored.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 mt-2">
                        <Button variant="outline" onClick={() => setIsResetOpen(false)} className="rounded-xl h-10 font-bold border-slate-200 text-xs">Cancel</Button>
                        <Button onClick={handleReset} className="bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl h-10 text-xs">Yes, Reset</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Extension Side Form */}
            <SideFormSheet
                open={isExtendOpen}
                onOpenChange={setIsExtendOpen}
                title="Extend Review Phase"
                description={extendEmployee ? `Extending probation for ${extendEmployee.name}.` : 'Provide authorization for extension.'}
                icon={<History size={20} />}
                accentColor="#d97706"
                width="md"
                submitLabel="Authorize Extension"
                onSubmit={(e) => { e.preventDefault(); submitExtension(); }}
            >
                <div className="space-y-4">
                    <Field label="Extension Period" required>
                        <Select onValueChange={setExtensionMonths} value={extensionMonths}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1" className="text-xs">1 Month</SelectItem>
                                <SelectItem value="2" className="text-xs">2 Months</SelectItem>
                                <SelectItem value="3" className="text-xs">3 Months</SelectItem>
                                <SelectItem value="6" className="text-xs">6 Months</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Reason for Extension" required>
                        <Textarea placeholder="Briefly describe why this employee needs more time..." className="h-24 resize-none" value={extensionReason} onChange={e => setExtensionReason(e.target.value)} />
                    </Field>
                </div>
            </SideFormSheet>
        </div>
    );
};

export default ProbationManagementPage;
