"use client"

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldAlert,
    FileCheck,
    BellRing,
    Search,
    CheckCircle2,
    XCircle,
    User,
    Lock,
    Scale,
    TrendingUp,
    Download,
    History,
    MoreHorizontal,
    Plus,
    Settings2,
    Trash2,
    AlertCircle,
    LayoutGrid
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
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
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";

const CompliancePage = () => {
    const { toast } = useToast();
    const {
        employees,
        updateEmployeeCompliance,
        history,
        policies,
        addPolicy,
        removePolicy
    } = useLifecycleStore();

    // Focus on Active/Probation employees for compliance
    const activeEmployees = useMemo(() =>
        employees.filter(e => e.status === 'Active' || e.status === 'Probation'),
        [employees]
    );

    const [searchTerm, setSearchTerm] = useState("");
    const [filterActive, setFilterActive] = useState<"All" | "Compliant" | "Pending">("All");

    // Policy Management State
    const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);
    const [newPolicyName, setNewPolicyName] = useState("");

    const filteredEmployees = useMemo(() => {
        return activeEmployees.filter(e => {
            const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase());
            const isFullyCompliant = (e.complianceDocs?.length || 0) === policies.length;

            let matchesFilter = true;
            if (filterActive === "Compliant") matchesFilter = isFullyCompliant;
            if (filterActive === "Pending") matchesFilter = !isFullyCompliant;

            return matchesSearch && matchesFilter;
        });
    }, [activeEmployees, searchTerm, filterActive, policies]);

    const stats = useMemo(() => {
        const fullyCompliantCount = activeEmployees.filter(e => (e.complianceDocs?.length || 0) === policies.length).length;
        const pendingCount = activeEmployees.length - fullyCompliantCount;
        const rate = Math.round((fullyCompliantCount / activeEmployees.length) * 100) || 0;

        return [
            { label: "Compliance rate", value: `${rate}%`, color: "bg-[#CB9DF0]", icon: <FileCheck size={24} />, filter: "Compliant" as const },
            { label: "Pending actions", value: pendingCount, color: "bg-[#F0C1E1]", icon: <ShieldAlert size={24} />, filter: "Pending" as const },
            { label: "Total policies", value: policies.length, color: "bg-[#FDDBBB]", icon: <Settings2 size={24} />, filter: "All" as const },
        ];
    }, [activeEmployees, policies]);

    const handleNudge = (empName: string) => {
        toast({ title: "Reminder Sent", description: `Compliance nudge sent to ${empName}.` });
    };

    const handleBulkNudge = () => {
        const pending = activeEmployees.filter(e => (e.complianceDocs?.length || 0) < policies.length);
        if (pending.length === 0) {
            toast({ title: "All set!", description: "Everyone is already compliant." });
            return;
        }
        toast({
            title: "Bulk Nudge Sent 🚀",
            description: `Reminders sent to ${pending.length} employees with pending documents.`
        });
    };

    const handleExport = () => {
        toast({
            title: "Generating Report 🖨️",
            description: "Your compliance audit report is being generated and will download shortly."
        });
    };

    const handleAddPolicy = () => {
        if (!newPolicyName) return;
        addPolicy(newPolicyName);
        setNewPolicyName("");
        toast({ title: "Policy Added", description: `"${newPolicyName}" is now mandatory for all employees.` });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] overflow-x-hidden overflow-y-auto">
            <div style={{
                zoom: '0.6',
                width: '100%',
            }} className="p-12 space-y-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 pb-2 border-b border-slate-100">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic capitalize">Compliance & Policies</h1>
                        <p className="text-slate-500 font-bold text-base mt-0.5 ml-1">Stage 6: Manage regulatory acknowledgements and audits.</p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="rounded-xl font-bold border-slate-200 text-slate-500 hover:bg-slate-50 h-14 px-8"
                            onClick={() => { localStorage.clear(); window.location.reload(); }}
                        >
                            <LayoutGrid size={18} className="mr-2" /> System reset
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-xl font-bold border-slate-200 text-slate-500 hover:bg-slate-50 h-14 px-8"
                            onClick={handleExport}
                        >
                            <Download size={18} className="mr-2" /> Export report
                        </Button>
                        <Button
                            className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl font-bold h-14 px-10 shadow-2xl shadow-purple-200"
                            onClick={handleBulkNudge}
                        >
                            <BellRing size={18} className="mr-2" /> Bulk nudge
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className={`group cursor-pointer transition-all ${filterActive === stat.filter ? 'ring-4 ring-[#CB9DF0]/20' : ''}`}
                            onClick={() => setFilterActive(stat.filter)}
                        >
                            <Card className={`border-none shadow-2xl rounded-[2.5rem] ${stat.color} p-8 h-40 flex items-center justify-between overflow-hidden relative`}>
                                <div className="relative z-10">
                                    <p className="text-xl font-bold text-slate-900/60 capitalize leading-tight mb-1">{stat.label}</p>
                                    <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                                </div>
                                <div className="h-20 w-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md shadow-sm relative z-10 text-slate-900">
                                    {stat.icon}
                                </div>
                                <div className="absolute top-4 right-8 opacity-10 transform rotate-12 scale-150 group-hover:rotate-[25deg] transition-transform text-slate-900">
                                    {stat.icon}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <Card className="lg:col-span-2 border border-slate-200 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.05)] rounded-[2.5rem] bg-white overflow-hidden p-10">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <FileCheck className="text-[#CB9DF0]" size={28} />
                                    <h3 className="font-black text-2xl text-slate-900 italic tracking-tight">Employee Compliance Audit</h3>
                                    <Badge variant="secondary" className="bg-slate-100 text-slate-400 border-none font-bold px-3 py-1 text-xs">
                                        {filteredEmployees.length} personnel
                                    </Badge>
                                </div>

                                {/* Policy Manager Trigger */}
                                <Dialog open={isPolicyDialogOpen} onOpenChange={setIsPolicyDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="h-10 px-6 rounded-xl border-purple-100 text-[#CB9DF0] font-bold hover:bg-purple-50 flex items-center gap-2 text-xs">
                                            <Settings2 size={14} /> Configure Policies
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-white rounded-[2.5rem] border-none p-10 max-w-xl shadow-2xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-black text-slate-900 italic">Policy Configuration</DialogTitle>
                                            <DialogDescription className="font-bold text-slate-400">Add or remove mandatory compliance documents.</DialogDescription>
                                        </DialogHeader>

                                        <div className="py-6 space-y-6">
                                            <div className="flex gap-3">
                                                <Input
                                                    placeholder="Enter policy name (e.g. Data Protection)"
                                                    className="h-14 rounded-xl bg-slate-50 border-none font-bold text-base"
                                                    value={newPolicyName}
                                                    onChange={(e) => setNewPolicyName(e.target.value)}
                                                />
                                                <Button className="h-14 w-14 rounded-xl bg-[#CB9DF0] hover:bg-[#b580e0] text-white" onClick={handleAddPolicy}>
                                                    <Plus size={24} />
                                                </Button>
                                            </div>

                                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                                {policies.map(p => (
                                                    <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                                                        <div className="flex items-center gap-3">
                                                            <Lock size={16} className="text-slate-400" />
                                                            <span className="font-bold text-slate-700">{p.name}</span>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                            onClick={() => {
                                                                removePolicy(p.id);
                                                                toast({ title: "Policy Removed", description: `"${p.name}" has been deleted.`, variant: "destructive" });
                                                            }}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="relative w-full md:w-auto">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                <Input
                                    className="h-14 pl-16 rounded-2xl bg-slate-50 border-none w-full md:w-80 font-bold text-lg placeholder:italic transition-all shadow-inner focus:bg-white focus:ring-2 focus:ring-[#CB9DF0]/20"
                                    placeholder="Search by identity..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {filteredEmployees.length === 0 ? (
                                <div className="text-center py-24 space-y-6">
                                    <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-100">
                                        <AlertCircle size={48} />
                                    </div>
                                    <p className="text-slate-300 font-black italic text-2xl max-w-[400px] mx-auto leading-relaxed tracking-tighter uppercase">No personnel matching your filter criteria.</p>
                                </div>
                            ) : filteredEmployees.map((emp, i) => {
                                const signedPolicies = emp.complianceDocs || [];
                                const totalRequired = policies.length;
                                const progress = totalRequired > 0 ? Math.round((signedPolicies.length / totalRequired) * 100) : 100;
                                const isComplete = progress === 100;

                                return (
                                    <motion.div
                                        key={emp.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <div className={`p-8 rounded-[2rem] border transition-all hover:shadow-2xl hover:bg-white group
                                            ${isComplete ? 'bg-white border-slate-100' : 'bg-rose-50/20 border-rose-100'}`}>
                                            <div className="flex flex-col xl:flex-row xl:items-center gap-10">

                                                {/* Employee Info */}
                                                <div className="flex items-center gap-6 min-w-[280px]">
                                                    <Avatar className="h-16 w-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-[#CB9DF0] font-black text-2xl border border-slate-50 group-hover:scale-110 transition-transform">
                                                        <AvatarFallback>{emp.avatar}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="space-y-1">
                                                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">{emp.name}</h4>
                                                        <p className="text-sm font-bold text-[#CB9DF0] italic">{emp.department}</p>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="flex-1 space-y-3 min-w-[200px]">
                                                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        <span>Policy adherence</span>
                                                        <span className={isComplete ? "text-purple-500" : "text-rose-500"}>{signedPolicies.length}/{totalRequired} Documents signed</span>
                                                    </div>
                                                    <div className="h-3 rounded-full bg-slate-100 overflow-hidden shadow-inner">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${progress}%` }}
                                                            className={`h-full rounded-full ${isComplete ? 'bg-purple-500' : 'bg-[#CB9DF0]'}`}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Policies Grid */}
                                                <div className="flex gap-3 flex-wrap max-w-[450px]">
                                                    {policies.map(p => {
                                                        const isSigned = signedPolicies.includes(p.id);
                                                        return (
                                                            <div
                                                                key={p.id}
                                                                onClick={() => !isSigned && updateEmployeeCompliance(emp.id, p.id)}
                                                                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-black cursor-pointer transition-all active:scale-95 border
                                                                    ${isSigned
                                                                        ? 'bg-purple-50 text-purple-600 border-purple-100 shadow-sm shadow-purple-50'
                                                                        : 'bg-white text-slate-300 border-slate-100 hover:border-[#CB9DF0]/30 hover:text-[#CB9DF0]'
                                                                    }`}
                                                                title={isSigned ? "Policy Signed" : "Authorize Signature"}
                                                            >
                                                                {isSigned ? <CheckCircle2 size={16} className="fill-purple-600/20" /> : <XCircle size={16} />}
                                                                <span>{p.name}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex justify-end min-w-[140px]">
                                                    {isComplete ? (
                                                        <Badge className="bg-purple-100 text-purple-700 border-none px-6 py-3 rounded-2xl font-black italic shadow-sm">
                                                            Fully Verified
                                                        </Badge>
                                                    ) : (
                                                        <Button
                                                            className="h-14 px-8 bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-2xl font-black shadow-xl shadow-purple-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                                                            onClick={() => handleNudge(emp.name)}
                                                        >
                                                            <BellRing size={18} /> Nudge
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

                    {/* Timeline History Section */}
                    <div className="space-y-10">
                        <Card className="border border-slate-200 shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white p-10 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <History size={24} className="text-[#CB9DF0]" />
                                    <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">Compliance audit log</h3>
                                </div>
                                <Button variant="ghost" className="text-[#CB9DF0] font-bold text-sm" onClick={() => toast({ title: "Archive View", description: "This feature will be available in the next system update." })}>View full archive</Button>
                            </div>

                            <div className="flex-1 space-y-10 overflow-y-auto no-scrollbar pr-2">
                                {history.filter(h => h.title.includes('Policy')).length === 0 ? (
                                    <div className="py-24 text-center space-y-6">
                                        <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-100">
                                            <ShieldAlert size={48} />
                                        </div>
                                        <p className="text-slate-300 font-black italic text-lg max-w-[200px] mx-auto leading-relaxed tracking-tighter uppercase text-center">No recent compliance events recorded.</p>
                                    </div>
                                ) : history.filter(h => h.title.includes('Policy')).slice(0, 10).map((log: HistoryLog) => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="relative pl-12 group"
                                    >
                                        <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-[#CB9DF0] border-[4px] border-white shadow-xl z-20 group-hover:scale-125 transition-transform" />
                                        <div className="absolute left-1.5 top-6 bottom-[-2.5rem] w-1 bg-slate-50 group-last:hidden" />

                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase">{log.date}</p>
                                            <h4 className="font-black text-slate-900 text-lg leading-tight group-hover:text-[#CB9DF0] transition-colors">{log.title}</h4>
                                            <p className="text-slate-400 font-bold text-xs leading-relaxed line-clamp-2">{log.description}</p>
                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-300 uppercase">
                                                        {log.employeeName[0]}
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{log.employeeName}</span>
                                                </div>
                                                <button
                                                    className="h-8 w-8 rounded-lg bg-white border border-slate-50 flex items-center justify-center text-slate-300 hover:text-[#CB9DF0] transition-colors"
                                                    onClick={() => toast({ title: "Audit Detail", description: log.description })}
                                                >
                                                    <MoreHorizontal size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompliancePage;
