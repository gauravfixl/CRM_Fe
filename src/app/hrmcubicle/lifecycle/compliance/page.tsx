"use client"

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    ShieldAlert,
    FileCheck,
    BellRing,
    Search,
    CheckCircle2,
    XCircle,
    Lock,
    Download,
    History,
    MoreHorizontal,
    Plus,
    Settings2,
    Trash2,
    AlertCircle,
    RotateCcw,
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { useToast } from "@/shared/components/ui/use-toast";
import { Input } from "@/shared/components/ui/input";
import { useLifecycleStore, HistoryLog, Policy } from "@/shared/data/lifecycle-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";

const CompliancePage = () => {
    const { toast } = useToast();
    const { employees, updateEmployeeCompliance, history, policies, addPolicy, removePolicy } = useLifecycleStore();

    const activeEmployees = useMemo(() => employees.filter(e => e.status === 'Active' || e.status === 'Probation'), [employees]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterActive, setFilterActive] = useState<"All" | "Compliant" | "Pending">("All");
    const [isArchiveOpen, setIsArchiveOpen] = useState(false);
    const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [isBulkNudgeOpen, setIsBulkNudgeOpen] = useState(false);
    const [policyToDelete, setPolicyToDelete] = useState<Policy | null>(null);
    const [newPolicyName, setNewPolicyName] = useState("");

    const filteredEmployees = useMemo(() => {
        return activeEmployees.filter(e => {
            const q = searchTerm.toLowerCase();
            const matchesSearch = !q || e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q);
            const signed = e.complianceDocs?.length || 0;
            const isFullyCompliant = signed === policies.length && policies.length > 0;
            let matchesFilter = true;
            if (filterActive === "Compliant") matchesFilter = isFullyCompliant;
            if (filterActive === "Pending") matchesFilter = !isFullyCompliant;
            return matchesSearch && matchesFilter;
        });
    }, [activeEmployees, searchTerm, filterActive, policies]);

    const pendingEmployees = useMemo(() => activeEmployees.filter(e => (e.complianceDocs?.length || 0) < policies.length), [activeEmployees, policies]);

    const stats = useMemo(() => {
        const fully = activeEmployees.filter(e => (e.complianceDocs?.length || 0) === policies.length && policies.length > 0).length;
        const rate = activeEmployees.length === 0 ? 0 : Math.round((fully / activeEmployees.length) * 100);
        return [
            { label: "Compliance Rate", value: `${rate}%`, color: "bg-[#CB9DF0]", icon: <FileCheck size={18} />, filter: "Compliant" as const },
            { label: "Pending Actions", value: pendingEmployees.length, color: "bg-[#F0C1E1]", icon: <ShieldAlert size={18} />, filter: "Pending" as const },
            { label: "Total Policies", value: policies.length, color: "bg-[#FDDBBB]", icon: <Settings2 size={18} />, filter: "All" as const },
        ];
    }, [activeEmployees, policies, pendingEmployees]);

    const handleNudge = (empName: string) => {
        toast({ title: "Reminder Sent", description: `Compliance nudge sent to ${empName}.` });
    };

    const confirmBulkNudge = () => {
        if (pendingEmployees.length === 0) {
            toast({ title: "All set!", description: "Everyone is already compliant." });
            setIsBulkNudgeOpen(false);
            return;
        }
        toast({ title: "Bulk Nudge Sent", description: `Reminders sent to ${pendingEmployees.length} employees.` });
        setIsBulkNudgeOpen(false);
    };

    const handleExport = () => {
        const headers = "Employee,Department,Status,Signed Policies,Total Required,Compliance %";
        const rows = activeEmployees.map(e => {
            const signed = e.complianceDocs?.length || 0;
            const pct = policies.length === 0 ? 100 : Math.round((signed / policies.length) * 100);
            const names = e.complianceDocs?.map(id => policies.find(p => p.id === id)?.name).filter(Boolean).join('; ') || 'None';
            return `"${e.name}","${e.department}","${e.status}","${names}",${policies.length},${pct}%`;
        }).join("\n");
        const csv = `Compliance Audit Report\nGenerated: ${new Date().toLocaleDateString()}\n\n${headers}\n${rows}`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compliance_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: "Report Downloaded", description: "Compliance audit report exported as CSV." });
    };

    const handleAddPolicy = () => {
        if (!newPolicyName.trim()) {
            toast({ title: "Name required", description: "Enter a policy name.", variant: "destructive" });
            return;
        }
        if (policies.some(p => p.name.toLowerCase() === newPolicyName.trim().toLowerCase())) {
            toast({ title: "Already exists", description: "A policy with this name already exists.", variant: "destructive" });
            return;
        }
        addPolicy(newPolicyName.trim());
        toast({ title: "Policy Added", description: `"${newPolicyName.trim()}" is now mandatory.` });
        setNewPolicyName("");
    };

    const confirmRemovePolicy = () => {
        if (!policyToDelete) return;
        removePolicy(policyToDelete.id);
        toast({ title: "Policy Removed", description: `"${policyToDelete.name}" has been deleted.`, variant: "destructive" });
        setPolicyToDelete(null);
    };

    const handleReset = () => { localStorage.clear(); window.location.reload(); };

    const handleSignPolicy = (empId: string, empName: string, policyId: string, policyName: string, alreadySigned: boolean) => {
        if (alreadySigned) {
            toast({ title: "Already Signed", description: `${empName} has already signed "${policyName}".` });
            return;
        }
        updateEmployeeCompliance(empId, policyId);
        toast({ title: "Policy Signed", description: `${empName} signed "${policyName}".` });
    };

    const complianceHistory = history.filter(h => h.title.includes('Policy'));

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-4 space-y-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#CB9DF0] flex items-center justify-center text-white shadow-md shadow-purple-100">
                        <Scale />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Compliance & Policies</h1>
                        <p className="text-slate-500 font-bold text-[10px] mt-0.5">Stage 6: Manage regulatory acknowledgements and audits.</p>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" className="rounded-xl font-bold border-slate-200 text-slate-500 hover:bg-slate-50 h-9 px-4 text-[10px]" onClick={() => setIsResetOpen(true)}>
                        <RotateCcw size={14} className="mr-1.5" /> System Reset
                    </Button>
                    <Button variant="outline" className="rounded-xl font-bold border-slate-200 text-slate-500 hover:bg-slate-50 h-9 px-4 text-[10px]" onClick={handleExport}>
                        <Download size={14} className="mr-1.5" /> Export Report
                    </Button>
                    <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl font-bold h-9 px-4 shadow-lg shadow-purple-100 text-[10px]" onClick={() => setIsBulkNudgeOpen(true)} disabled={pendingEmployees.length === 0}>
                        <BellRing size={14} className="mr-1.5" /> Bulk Nudge
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -3 }} className={`group cursor-pointer transition-all ${filterActive === stat.filter ? 'ring-2 ring-[#CB9DF0] rounded-2xl' : ''}`} onClick={() => setFilterActive(stat.filter)}>
                        <Card className={`border-none shadow-sm rounded-2xl ${stat.color} p-5 h-24 flex items-center justify-between overflow-hidden relative`}>
                            <div className="relative z-10">
                                <p className="text-[10px] font-bold text-slate-900/70 uppercase tracking-wide">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                            </div>
                            <div className="h-12 w-12 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-md text-slate-800">
                                {stat.icon}
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Audit list */}
                <Card className="lg:col-span-2 border border-slate-200 shadow-sm rounded-2xl bg-white overflow-hidden p-5">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-5 gap-3">
                        <div className="flex items-center gap-3 flex-wrap">
                            <FileCheck className="text-[#CB9DF0]" size={18} />
                            <h3 className="font-bold text-sm text-slate-900">Employee Compliance Audit</h3>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-400 border-none font-bold px-2 py-0.5 text-[9px]">{filteredEmployees.length} shown</Badge>
                            <Button variant="outline" className="h-9 px-3 rounded-xl border-purple-100 text-[#CB9DF0] font-bold hover:bg-purple-50 flex items-center gap-1.5 text-[10px]" onClick={() => setIsPolicyDialogOpen(true)}>
                                <Settings2 size={12} /> Configure Policies
                            </Button>
                            {filterActive !== 'All' && (
                                <Button variant="ghost" size="sm" onClick={() => setFilterActive('All')} className="h-9 px-3 text-[10px] font-bold text-slate-500">Clear filter</Button>
                            )}
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                            <Input className="h-9 pl-9 rounded-xl bg-slate-50 border border-slate-100 w-full md:w-64 font-bold text-xs" placeholder="Search name or dept..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredEmployees.length === 0 ? (
                            <div className="text-center py-12 space-y-3">
                                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-200">
                                    <AlertCircle size={28} />
                                </div>
                                <p className="text-slate-400 font-bold text-xs max-w-xs mx-auto">{activeEmployees.length === 0 ? 'No active personnel.' : 'No personnel match your filters.'}</p>
                            </div>
                        ) : filteredEmployees.map((emp, i) => {
                            const signedPolicies = emp.complianceDocs || [];
                            const totalRequired = policies.length;
                            const progress = totalRequired > 0 ? Math.round((signedPolicies.length / totalRequired) * 100) : 100;
                            const isComplete = progress === 100;

                            return (
                                <motion.div key={emp.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                                    <div className={`p-4 rounded-2xl border transition-all hover:shadow-md hover:bg-white ${isComplete ? 'bg-white border-slate-100' : 'bg-rose-50/20 border-rose-100'}`}>
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                            <div className="flex items-center gap-3 min-w-[200px]">
                                                <Avatar className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#CB9DF0] font-bold text-sm border border-slate-100">
                                                    <AvatarFallback>{emp.avatar}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-900 tracking-tight">{emp.name}</h4>
                                                    <p className="text-[10px] font-bold text-[#CB9DF0]">{emp.department}</p>
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-1.5 min-w-[150px]">
                                                <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                                                    <span>Policy Adherence</span>
                                                    <span className={isComplete ? "text-purple-500" : "text-rose-500"}>{signedPolicies.length}/{totalRequired} Signed</span>
                                                </div>
                                                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className={`h-full rounded-full ${isComplete ? 'bg-purple-500' : 'bg-[#CB9DF0]'}`} />
                                                </div>
                                            </div>
                                            <div className="flex gap-1.5 flex-wrap max-w-[320px]">
                                                {policies.length === 0 ? (
                                                    <span className="text-[10px] italic text-slate-400 font-bold">No policies configured</span>
                                                ) : policies.map(p => {
                                                    const isSigned = signedPolicies.includes(p.id);
                                                    return (
                                                        <div key={p.id} onClick={() => handleSignPolicy(emp.id, emp.name, p.id, p.name, isSigned)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-bold cursor-pointer transition-all active:scale-95 border ${isSigned ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-white text-slate-400 border-slate-100 hover:border-[#CB9DF0]/30 hover:text-[#CB9DF0]'}`} title={isSigned ? "Signed" : "Click to sign"}>
                                                            {isSigned ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                                                            <span>{p.name}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="flex justify-end min-w-[100px]">
                                                {isComplete ? (
                                                    <Badge className="bg-purple-100 text-purple-700 border-none px-3 py-1.5 rounded-xl font-bold text-[9px]">Fully Verified</Badge>
                                                ) : (
                                                    <Button className="h-8 px-3 bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl font-bold shadow-md shadow-purple-100 flex items-center gap-1.5 text-[10px]" onClick={() => handleNudge(emp.name)}>
                                                        <BellRing size={12} /> Nudge
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

                {/* Audit log */}
                <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white p-5 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <History size={16} className="text-[#CB9DF0]" />
                            <h3 className="text-sm font-bold text-slate-900">Audit Log</h3>
                            <Badge className="bg-slate-100 text-slate-400 border-none font-bold px-2 py-0.5 text-[9px]">{complianceHistory.length}</Badge>
                        </div>
                        <Button variant="ghost" className="text-[#CB9DF0] font-bold text-xs h-8" onClick={() => setIsArchiveOpen(true)} disabled={complianceHistory.length === 0}>View all</Button>
                    </div>
                    <div className="flex-1 space-y-5 overflow-y-auto custom-scrollbar pr-1 max-h-[500px]">
                        {complianceHistory.length === 0 ? (
                            <div className="py-12 text-center space-y-3">
                                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-200">
                                    <ShieldAlert size={28} />
                                </div>
                                <p className="text-slate-400 font-bold text-xs max-w-[160px] mx-auto">No compliance events recorded yet.</p>
                            </div>
                        ) : complianceHistory.slice(0, 15).map((log: HistoryLog) => (
                            <motion.div key={log.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="relative pl-6 group">
                                <div className="absolute left-0 top-1 h-3 w-3 rounded-full bg-[#CB9DF0] border-2 border-white z-20" />
                                <div className="absolute left-1 top-4 bottom-[-1.25rem] w-0.5 bg-slate-100 group-last:hidden" />
                                <div className="space-y-0.5">
                                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-wide">{log.date}</p>
                                    <h4 className="font-bold text-slate-900 text-xs leading-tight">{log.title}</h4>
                                    <p className="text-slate-400 font-bold text-[10px] leading-relaxed line-clamp-2">{log.description}</p>
                                    <div className="flex items-center justify-between pt-1">
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-5 w-5 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-400 uppercase">{log.employeeName[0]}</div>
                                            <span className="text-[9px] font-bold text-slate-500">{log.employeeName}</span>
                                        </div>
                                        <button className="h-6 w-6 rounded-lg bg-white border border-slate-50 flex items-center justify-center text-slate-300 hover:text-[#CB9DF0]" onClick={() => toast({ title: log.title, description: log.description })}>
                                            <MoreHorizontal size={12} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Policy Config Dialog */}
            <Dialog open={isPolicyDialogOpen} onOpenChange={setIsPolicyDialogOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-lg shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Policy Configuration</DialogTitle>
                        <DialogDescription className="text-xs font-bold text-slate-400">Add or remove mandatory compliance documents.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="flex gap-2">
                            <Input placeholder="Enter policy name (e.g. Data Protection)" className="h-10 rounded-xl bg-slate-50 border border-slate-100 font-bold text-xs" value={newPolicyName} onChange={e => setNewPolicyName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddPolicy()} />
                            <Button className="h-10 w-10 rounded-xl bg-[#CB9DF0] hover:bg-[#b580e0] text-white p-0" onClick={handleAddPolicy}>
                                <Plus size={16} />
                            </Button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {policies.length === 0 ? (
                                <p className="text-[10px] text-slate-400 italic text-center py-6 font-bold">No policies configured yet.</p>
                            ) : policies.map(p => (
                                <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                                    <div className="flex items-center gap-2">
                                        <Lock size={14} className="text-slate-400" />
                                        <span className="font-bold text-slate-700 text-xs">{p.name}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg" onClick={() => setPolicyToDelete(p)}>
                                        <Trash2 size={12} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsPolicyDialogOpen(false)} className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white font-bold rounded-xl h-10 w-full text-xs">Done</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Policy Confirm */}
            <Dialog open={!!policyToDelete} onOpenChange={o => !o && setPolicyToDelete(null)}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-sm shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Remove Policy?</DialogTitle>
                        <DialogDescription className="text-xs font-bold text-slate-400">
                            {policyToDelete ? `"${policyToDelete.name}" will no longer be required for any employee. Existing sign-offs remain in history.` : ''}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 mt-2">
                        <Button variant="outline" onClick={() => setPolicyToDelete(null)} className="rounded-xl h-10 font-bold border-slate-200 text-xs">Cancel</Button>
                        <Button onClick={confirmRemovePolicy} className="bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl h-10 text-xs">Yes, Remove</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk Nudge Confirm */}
            <Dialog open={isBulkNudgeOpen} onOpenChange={setIsBulkNudgeOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-sm shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Send Bulk Nudge?</DialogTitle>
                        <DialogDescription className="text-xs font-bold text-slate-400">
                            {pendingEmployees.length} employee{pendingEmployees.length === 1 ? '' : 's'} will receive a compliance reminder.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 mt-2">
                        <Button variant="outline" onClick={() => setIsBulkNudgeOpen(false)} className="rounded-xl h-10 font-bold border-slate-200 text-xs">Cancel</Button>
                        <Button onClick={confirmBulkNudge} className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white font-bold rounded-xl h-10 text-xs">Send Reminders</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reset Confirm */}
            <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-sm shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Reset All Lifecycle Data?</DialogTitle>
                        <DialogDescription className="text-xs font-bold text-slate-400">Clears all local storage and reloads with mock seed data.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 mt-2">
                        <Button variant="outline" onClick={() => setIsResetOpen(false)} className="rounded-xl h-10 font-bold border-slate-200 text-xs">Cancel</Button>
                        <Button onClick={handleReset} className="bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl h-10 text-xs">Yes, Reset</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Archive */}
            <Dialog open={isArchiveOpen} onOpenChange={setIsArchiveOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-2xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Compliance Archive</DialogTitle>
                        <DialogDescription className="text-[10px] font-bold text-slate-400">Full history of compliance-related events.</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar space-y-2 pr-2 py-3">
                        {complianceHistory.length === 0 ? (
                            <div className="py-10 text-center text-slate-400 font-bold text-xs border-2 border-dashed border-slate-100 rounded-2xl">No events in archive.</div>
                        ) : complianceHistory.map((log: HistoryLog) => (
                            <div key={log.id} className="p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-wide">{log.date}</p>
                                    <Badge className="h-2 w-2 rounded-full p-0 min-w-0 bg-[#CB9DF0]" />
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
        </div>
    );
};

// Inline Scale icon (compact, to avoid import churn)
const Scale = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="M7 21h10" />
        <path d="M12 3v18" />
        <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
);

export default CompliancePage;
