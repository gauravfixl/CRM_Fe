"use client"

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock,
    AlertCircle,
    Search,
    Filter,
    ChevronRight,
    Star,
    LayoutGrid,
    Calendar,
    Activity,
    Target,
    History,
    Hourglass,
    Zap,
    AlertTriangle,
    TrendingUp,
    MoreHorizontal,
    ArrowRight
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useToast } from "@/shared/components/ui/use-toast";
import { useLifecycleStore, LifecycleEmployee, HistoryLog } from "@/shared/data/lifecycle-store";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

const ProbationManagementPage = () => {
    const { toast } = useToast();
    const {
        employees,
        confirmProbation,
        history,
        extendProbation,
        bulkConfirmHighPerformers
    } = useLifecycleStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [filterDept, setFilterDept] = useState("All");
    const [filterActive, setFilterActive] = useState<"All" | "Critical" | "Top">("All");

    // Extension Dialog State
    const [isExtendOpen, setIsExtendOpen] = useState(false);
    const [extensionEmpId, setExtensionEmpId] = useState<string | null>(null);
    const [extensionMonths, setExtensionMonths] = useState("3");
    const [extensionReason, setExtensionReason] = useState("");

    // Filter probationers
    const probationers = useMemo(() => {
        return employees.filter((e: LifecycleEmployee) => {
            const isProbation = e.status === 'Probation';
            const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.role.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = filterDept === "All" || e.department === filterDept;

            let matchesActiveFilter = true;
            if (filterActive === "Critical") matchesActiveFilter = (e.performance || 0) < 70;
            if (filterActive === "Top") matchesActiveFilter = (e.performance || 0) >= 90;

            return isProbation && matchesSearch && matchesDept && matchesActiveFilter;
        });
    }, [employees, searchTerm, filterDept, filterActive]);

    const departments = useMemo(() => {
        return ["All", ...Array.from(new Set(employees.map(e => e.department)))];
    }, [employees]);

    const handleConfirm = (empId: string) => {
        const emp = employees.find(e => e.id === empId);
        if (!emp) return;

        confirmProbation(empId);
        toast({
            title: "Probation confirmed! 🎉",
            description: `${emp.name} is now a permanent member of the team.`,
        });
    };

    const handleBulkConfirm = () => {
        const highPerformers = probationers.filter(e => e.performance >= 90);
        if (highPerformers.length === 0) {
            toast({
                title: "No high performers",
                description: "None of the currently filtered probationers meet the 90% criteria.",
                variant: "destructive"
            });
            return;
        }

        bulkConfirmHighPerformers();
        toast({
            title: "Bulk Confirmation Success! 🚀",
            description: `Successfully confirmed ${highPerformers.length} top performers.`,
        });
    };

    const handlePerformanceInsights = () => {
        const avg = probationers.length > 0
            ? Math.round(probationers.reduce((acc, curr) => acc + curr.performance, 0) / probationers.length)
            : 0;

        toast({
            title: "Performance Insights 📊",
            description: `Current average probationer performance is ${avg}%. ${stats.critical} cases need immediate intervention.`,
        });
    };

    const openExtendDialog = (empId: string) => {
        setExtensionEmpId(empId);
        setIsExtendOpen(true);
    };

    const submitExtension = () => {
        if (!extensionEmpId || !extensionReason) {
            toast({ title: "Error", description: "Please provide a reason for extension.", variant: "destructive" });
            return;
        }

        extendProbation(extensionEmpId, parseInt(extensionMonths), extensionReason);
        toast({
            title: "Probation Extended",
            description: `review period has been updated.`,
        });
        setIsExtendOpen(false);
        setExtensionReason("");
    };

    // Helper: Performance Category
    const getPerformanceInfo = (score: number) => {
        if (score >= 90) return { label: "High Flyer", color: "bg-purple-100 text-purple-600 border-purple-200", icon: <Zap size={10} /> };
        if (score >= 70) return { label: "Progressive", color: "bg-blue-100 text-blue-600 border-blue-200", icon: <TrendingUp size={10} /> };
        return { label: "PIP Candidate", color: "bg-rose-100 text-rose-600 border-rose-200", icon: <AlertTriangle size={10} /> };
    };

    // Helper: Check if Due Soon (7 days)
    const isDueSoon = (endDateStr: string) => {
        const endDate = new Date(endDateStr);
        const diffTime = endDate.getTime() - new Date().getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7;
    };

    // Helper: Get Tenure Month (Assuming 6 month standard)
    const getTenureMonth = (joinDate: string) => {
        const start = new Date(joinDate);
        const now = new Date();
        const diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
        return Math.max(1, diffMonths + 1);
    };

    // Stats
    const stats = useMemo(() => ({
        active: probationers.length,
        critical: probationers.filter(e => (e.performance || 0) < 70).length,
        topPerformers: probationers.filter(e => (e.performance || 0) >= 90).length
    }), [probationers]);

    const statCards = [
        {
            title: "Check-ins due",
            value: stats.topPerformers,
            icon: <Calendar size={20} />,
            color: "bg-[#F0C1E1]",
            desc: "Ready for review",
            filter: "Top" as const
        },
        {
            title: "Active probation",
            value: stats.active,
            icon: <Hourglass size={20} />,
            color: "bg-[#CB9DF0]",
            desc: "Talent pipeline",
            filter: "All" as const
        },
        {
            title: "Critical cases",
            value: stats.critical,
            icon: <AlertCircle size={20} />,
            color: "bg-[#FDDBBB]",
            desc: "Requiring PIPs",
            filter: "Critical" as const
        }
    ];

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] overflow-x-hidden overflow-y-auto">
            <div style={{
                zoom: '0.6',
                width: '100%',
            }} className="p-12 space-y-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 pb-2 border-b border-slate-100">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic capitalize">Probation management</h1>
                        <p className="text-slate-500 font-bold text-base mt-0.5 ml-1">Stage 5: High-density performance monitoring and permanent transitions.</p>
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
                            className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl font-black h-14 px-10 shadow-2xl shadow-purple-200"
                            onClick={handlePerformanceInsights}
                        >
                            <Target size={18} className="mr-2" /> Performance insights
                        </Button>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {statCards.map((card, i) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group cursor-pointer transition-all"
                            onClick={() => setFilterActive(card.filter)}
                        >
                            <Card className={`border-none ${card.color} rounded-[2.5rem] p-8 h-40 relative overflow-hidden shadow-2xl`}>
                                <div className="relative z-10 h-full flex items-center gap-6">
                                    <div className="text-slate-900/80">
                                        {React.cloneElement(card.icon as React.ReactElement, { size: 32 })}
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="text-base font-bold text-slate-900/60 uppercase tracking-wider">{card.title}</div>
                                        <div className="text-4xl font-black text-slate-900 tracking-tighter">{card.value}</div>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-8 opacity-10 transform rotate-12 scale-150 group-hover:rotate-[25deg] transition-transform">
                                    {card.icon}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Main List Section */}
                <div className="space-y-6">
                    <Card className="border border-slate-200 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.05)] rounded-[2rem] bg-white overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <Activity className="text-[#CB9DF0]" size={24} />
                                    <h2 className="text-xl font-extrabold text-slate-800 italic">Personnel probation queue</h2>
                                    <Badge variant="secondary" className="bg-slate-100 text-slate-400 border-none font-bold px-3 py-1 text-xs">
                                        {probationers.length} active
                                    </Badge>
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={handleBulkConfirm}
                                    className="h-10 px-6 rounded-xl border-purple-200 text-purple-600 font-bold hover:bg-purple-50 flex items-center gap-2 text-xs"
                                >
                                    <Zap size={14} className="fill-purple-600" /> Bulk confirm top performers
                                </Button>
                            </div>

                            <div className="flex gap-4">
                                <div className="relative">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                    <input
                                        placeholder="Search by identity..."
                                        className="h-14 pl-16 w-96 rounded-2xl bg-white border border-slate-100 focus:border-[#CB9DF0] outline-none font-bold text-lg placeholder:italic transition-all shadow-sm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Select onValueChange={setFilterDept} value={filterDept}>
                                    <SelectTrigger className="w-56 h-14 rounded-2xl bg-white border border-slate-100 font-bold px-8 text-base">
                                        <SelectValue placeholder="All Clusters" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl p-4">
                                        {departments.map((d: string) => <SelectItem key={d} value={d} className="font-bold text-base border-none rounded-xl">{d}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="p-8 space-y-4">
                            {probationers.length === 0 ? (
                                <div className="py-24 text-center space-y-6">
                                    <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-100">
                                        <Hourglass size={48} />
                                    </div>
                                    <p className="text-slate-300 font-black italic text-2xl max-w-[400px] mx-auto leading-relaxed tracking-tighter uppercase">No personnel matching your filter criteria.</p>
                                </div>
                            ) : probationers.map((emp: LifecycleEmployee) => {
                                const perf = getPerformanceInfo(emp.performance);
                                const dueSoon = isDueSoon(emp.probationEnd);
                                const month = getTenureMonth(emp.joinDate);

                                return (
                                    <motion.div
                                        key={emp.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`group relative p-8 rounded-[2rem] border transition-all hover:bg-white hover:shadow-2xl flex items-center justify-between
                                            ${dueSoon ? 'bg-rose-50/20 border-rose-100' : 'bg-slate-50/20 border-slate-50'}`}
                                    >
                                        <div className="flex items-center gap-8">
                                            <div className="relative">
                                                <div className="h-16 w-16 rounded-[1.2rem] bg-white shadow-xl flex items-center justify-center text-[#CB9DF0] font-black text-2xl group-hover:scale-110 transition-transform">
                                                    {emp.avatar || emp.name[0]}
                                                </div>
                                                {dueSoon && (
                                                    <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-rose-500 border-4 border-white animate-pulse" />
                                                )}
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">{emp.name}</h4>
                                                    <Badge variant="outline" className={`font-bold text-[9px] uppercase tracking-wider h-6 flex items-center gap-1.5 px-3 rounded-full ${perf.color}`}>
                                                        {perf.icon} {perf.label}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-slate-400 font-bold text-sm italic">
                                                    <span>{emp.role}</span>
                                                    <span className="h-1 w-1 rounded-full bg-slate-200" />
                                                    <span className="text-[#CB9DF0]">Month {month} of 6</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-16">
                                            <div className="space-y-3 relative group/perf">
                                                <div className="flex justify-between w-56">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Potential</span>
                                                    <span className="text-sm font-black text-slate-700">{emp.performance}%</span>
                                                </div>
                                                <div className="w-56 h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${emp.performance}%` }}
                                                        className={`h-full rounded-full ${emp.performance >= 90 ? 'bg-purple-500' : emp.performance >= 70 ? 'bg-[#CB9DF0]' : 'bg-rose-500'}`}
                                                    />
                                                </div>

                                                {/* Manager Feedback Tooltip Mockup */}
                                                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 p-3 bg-slate-900 text-white rounded-xl text-[10px] font-medium opacity-0 group-hover/perf:opacity-100 transition-opacity pointer-events-none z-20 shadow-2xl">
                                                    <p className="italic text-slate-300 mb-1">Manager Feedback:</p>
                                                    "Consistently meeting targets. Transition to permanent is recommended."
                                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                                                </div>
                                            </div>

                                            <div className="text-right space-y-1.5 min-w-[120px]">
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center justify-end gap-2">
                                                    {dueSoon && <AlertTriangle size={12} className="text-rose-500 animate-bounce" />}
                                                    End Date
                                                </p>
                                                <p className={`text-xl font-black tracking-tight ${dueSoon ? 'text-rose-600' : 'text-slate-800'}`}>
                                                    {new Date(emp.probationEnd).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <div className="flex gap-4">
                                                <Button
                                                    onClick={() => handleConfirm(emp.id)}
                                                    className="h-14 px-10 rounded-[1.2rem] bg-[#CB9DF0] hover:bg-[#b580e0] text-white font-black text-sm shadow-xl shadow-purple-200 transition-all hover:scale-105 active:scale-95 group/btn"
                                                >
                                                    Confirm Personnel <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => openExtendDialog(emp.id)}
                                                    className="h-14 w-14 rounded-[1.2rem] border-2 border-slate-100 text-slate-300 hover:text-[#CB9DF0] hover:border-[#CB9DF0]/20 hover:bg-slate-50 transition-all active:scale-95"
                                                    title="Extend Probation"
                                                >
                                                    <History size={20} />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Timeline History Section */}
                    <Card className="border border-slate-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] rounded-[2.5rem] bg-white p-12">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <History size={24} className="text-[#CB9DF0]" />
                                <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">Lifecycle auditing log</h3>
                            </div>
                            <Button
                                variant="ghost"
                                className="text-[#CB9DF0] font-bold text-sm"
                                onClick={() => toast({ title: "Archive View", description: "This feature will be available in the next system update." })}
                            >
                                View full archive
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {history.filter((h: HistoryLog) => h.title.toLowerCase().includes('probation')).length === 0 ? (
                                <div className="col-span-full py-16 text-center text-slate-300 font-bold italic border-2 border-dashed border-slate-50 rounded-[2rem]">
                                    No recent probation lifecycle events recorded in the ledger.
                                </div>
                            ) : history.filter((h: HistoryLog) => h.title.toLowerCase().includes('probation')).slice(0, 6).map((log: HistoryLog) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 hover:shadow-xl hover:bg-white transition-all cursor-default group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <p className="text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase">{log.date}</p>
                                        <Badge className={`h-2 w-2 rounded-full p-0 min-w-0 ${log.type === 'growth' ? 'bg-[#CB9DF0]' : 'bg-slate-300'}`} />
                                    </div>
                                    <h4 className="font-black text-slate-900 text-lg mb-2 leading-tight group-hover:text-[#CB9DF0] transition-colors">{log.title}</h4>
                                    <p className="text-slate-400 font-bold text-xs leading-relaxed line-clamp-2">{log.description}</p>
                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-white border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-300 uppercase">
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
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Extension Dialog */}
                <Dialog open={isExtendOpen} onOpenChange={setIsExtendOpen}>
                    <DialogContent className="bg-white rounded-[2.5rem] border-none p-0 max-w-xl shadow-[0_50px_100px_-30px_rgba(0,0,0,0.2)] outline-none overflow-hidden">
                        <div style={{ transform: 'scale(0.85)', transformOrigin: 'center' }} className="p-12">
                            <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-[#FDDBBB]/10 -z-10 blur-[80px]" />

                            <DialogHeader className="mb-8">
                                <div className="flex items-center gap-5 mb-4">
                                    <div className="h-16 w-16 rounded-2xl flex items-center justify-center bg-[#FDDBBB] text-white shadow-xl">
                                        <History size={28} />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight italic">Extend Review Phase</DialogTitle>
                                        <DialogDescription className="text-slate-400 font-bold text-base mt-0.5 italic">Provide authorization for tenure extension</DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <Label className="font-black text-[10px] text-slate-300 uppercase tracking-widest pl-2">Select Extension Period</Label>
                                    <Select onValueChange={setExtensionMonths} value={extensionMonths}>
                                        <SelectTrigger className="rounded-2xl h-16 bg-slate-50 border-none hover:bg-slate-100/80 focus:ring-0 transition-all px-8 font-black text-lg shadow-inner">
                                            <SelectValue placeholder="Duration" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-none shadow-2xl p-3">
                                            <SelectItem value="1" className="font-extrabold text-lg py-3 rounded-xl px-6 my-1">1 Month Extension</SelectItem>
                                            <SelectItem value="3" className="font-extrabold text-lg py-3 rounded-xl px-6 my-1">3 Months Extension</SelectItem>
                                            <SelectItem value="6" className="font-extrabold text-lg py-3 rounded-xl px-6 my-1">6 Months Primary Review</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <Label className="font-black text-[10px] text-slate-300 uppercase tracking-widest pl-2">Reason for Authorization</Label>
                                    <Textarea
                                        placeholder="Briefly describe why this personnel needs more time..."
                                        className="h-32 rounded-2xl bg-slate-50 border-none hover:bg-slate-100/80 focus:ring-0 transition-all p-6 font-bold text-base shadow-inner placeholder:italic"
                                        value={extensionReason}
                                        onChange={(e) => setExtensionReason(e.target.value)}
                                    />
                                </div>
                            </div>

                            <DialogFooter className="mt-12">
                                <Button
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black h-16 text-lg shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-95"
                                    onClick={submitExtension}
                                >
                                    Authorize Extension <ArrowRight size={20} />
                                </Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
};

export default ProbationManagementPage;
