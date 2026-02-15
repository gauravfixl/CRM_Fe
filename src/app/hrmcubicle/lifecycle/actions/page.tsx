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
    LayoutGrid,
    Users,
    Activity,
    Target
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

const LifecycleActionsPage = () => {
    const { toast } = useToast();
    const { employees, promoteEmployee, transferEmployee, updateSalary, updateEmployeeStatus, history } = useLifecycleStore();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<'Promotion' | 'Transfer' | 'Salary' | 'Exit'>('Promotion');
    const [selectedEmpId, setSelectedEmpId] = useState("");
    const [newValue, setNewValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDept, setFilterDept] = useState("All");

    // Filterable list of employees (Active/Probation)
    const activeEmployees = useMemo(() => {
        return employees.filter(e => {
            const matchesStatus = (e.status === 'Active' || e.status === 'Probation');
            const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.role.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = filterDept === "All" || e.department === filterDept;
            return matchesStatus && matchesSearch && matchesDept;
        });
    }, [employees, searchTerm, filterDept]);

    const departments = ["All", ...Array.from(new Set(employees.map(e => e.department)))];

    const openActionDialog = (type: 'Promotion' | 'Transfer' | 'Salary' | 'Exit', empId: string = "") => {
        setActionType(type);
        setSelectedEmpId(empId);
        setIsDialogOpen(true);
    };

    const handleSubmit = () => {
        if (!selectedEmpId || (actionType !== 'Exit' && !newValue)) {
            toast({ title: "Error", description: "Please complete all fields", variant: "destructive" });
            return;
        }

        const employee = employees.find(e => e.id === selectedEmpId);
        if (!employee) return;

        if (actionType === 'Promotion') {
            promoteEmployee(selectedEmpId, newValue);
            toast({ title: "Promotion successful! 🎉", description: `${employee.name} is now ${newValue}` });
        } else if (actionType === 'Transfer') {
            transferEmployee(selectedEmpId, newValue);
            toast({ title: "Transfer completed", description: `${employee.name} moved to ${newValue}` });
        } else if (actionType === 'Salary') {
            updateSalary(selectedEmpId, newValue);
            toast({ title: "Salary revised", description: `Updated compensation for ${employee.name}` });
        } else if (actionType === 'Exit') {
            updateEmployeeStatus(selectedEmpId, 'Exited');
            toast({ title: "Exit processed", description: `${employee.name} marked as Exited`, variant: "destructive" });
        }

        setIsDialogOpen(false);
        setSelectedEmpId("");
        setNewValue("");
    };

    // Stats
    const stats = {
        promotions: history.filter(h => h.title.includes('Promotion')).length,
        transfers: history.filter(h => h.title.includes('Transfer')).length,
        probationers: employees.filter(e => e.status === 'Probation').length,
        totalActive: employees.filter(e => e.status === 'Active').length
    };

    const actionCards = [
        {
            type: "Promotion",
            icon: <TrendingUp size={24} />,
            color: "bg-[#CB9DF0]",
            desc: "Career Advancement",
            stat: `${stats.promotions} This Quarter`,
            action: 'Promotion' as const,
        },
        {
            type: "Transfer",
            icon: <ArrowRightLeft size={24} />,
            color: "bg-[#F0C1E1]",
            desc: "Structural Change",
            stat: `${stats.transfers} Moves Done`,
            action: 'Transfer' as const,
        },
        {
            type: "Salary Revision",
            icon: <DollarSign size={24} />,
            color: "bg-[#FFF9BF]",
            desc: "Paygrade Update",
            stat: "Next Review Oct",
            action: 'Salary' as const,
        },
        {
            type: "Exit / Offboarding",
            icon: <LogOut size={24} />,
            color: "bg-[#FDDBBB]",
            desc: "Full Separation",
            stat: "Pending Clearances",
            action: 'Exit' as const,
        },
    ];

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] overflow-hidden">
            <div style={{
                zoom: '0.6',
                width: '100%',
            }} className="p-12 space-y-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 pb-2 border-b border-slate-100">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="h-14 w-14 rounded-[1.5rem] bg-[#CB9DF0] flex items-center justify-center text-white shadow-xl shadow-purple-100">
                                <Activity size={32} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Lifecycle Actions</h1>
                                <p className="text-slate-500 font-bold text-lg mt-0.5 pl-1">Stage 4: Execute organizational movements and growth workflows.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            className="rounded-2xl font-black border-slate-200 text-slate-500 hover:bg-slate-50 h-14 px-8"
                            onClick={() => { localStorage.clear(); window.location.reload(); }}
                        >
                            <LayoutGrid size={18} className="mr-2" /> System Reset
                        </Button>
                        <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-2xl font-black h-14 px-10 shadow-2xl shadow-purple-200">
                            <Target size={18} className="mr-2" /> Generate Report
                        </Button>
                    </div>
                </div>

                {/* Performance Highlights Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {actionCards.map((act, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="cursor-pointer group"
                            onClick={() => openActionDialog(act.action)}
                        >
                            <Card className={`border-none ${act.color} rounded-[2.5rem] p-8 h-48 relative overflow-hidden shadow-2xl transition-all duration-500 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]`}>
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-black text-slate-900 leading-tight">{act.type}</h3>
                                            <p className="text-[11px] font-bold text-slate-800/60">{act.desc}</p>
                                        </div>
                                        <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-white/40 backdrop-blur-md text-slate-900 group-hover:rotate-12 transition-transform shrink-0">
                                            {act.icon}
                                        </div>
                                    </div>
                                    <Badge className="bg-white/30 text-slate-900 font-bold border-none px-3 py-1 rounded-full w-fit">
                                        {act.stat}
                                    </Badge>
                                </div>
                                <div className="absolute -bottom-6 -right-6 opacity-5 transform rotate-[25deg] scale-[2] text-slate-900">
                                    {act.icon}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Dynamic Management Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    <div className="lg:col-span-2">
                        <Card className="border border-slate-200 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.05)] rounded-[2rem] bg-white overflow-hidden">
                            <div className="p-8 pb-0 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 italic">
                                    <Users className="text-[#CB9DF0]" size={22} />
                                    Active personnel directory
                                    <Badge className="bg-slate-100 text-slate-400 border-none font-bold px-3 py-0.5 text-xs">{activeEmployees.length}</Badge>
                                </h2>
                            </div>
                            <div className="p-8">
                                <div className="flex flex-col md:flex-row gap-4 mb-8">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                        <Input
                                            placeholder="Find employee by name or role..."
                                            className="h-14 pl-16 rounded-[1.5rem] bg-slate-50/50 border-2 border-transparent focus:border-[#CB9DF0]/30 focus:bg-white font-bold text-lg placeholder:text-slate-300 transition-all shadow-inner"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <Select onValueChange={setFilterDept} value={filterDept}>
                                        <SelectTrigger className="w-56 h-14 rounded-[1.5rem] bg-slate-50 border-2 border-transparent font-bold px-8 text-base shadow-inner">
                                            <Filter className="mr-3 text-slate-400" size={18} />
                                            <SelectValue placeholder="All Clusters" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-none shadow-2xl p-4">
                                            {departments.map(d => <SelectItem key={d} value={d} className="font-bold text-base py-2 rounded-xl">{d}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[12px] font-black text-slate-300 tracking-widest border-b border-slate-50">
                                                <th className="pb-4 px-6">Personnel identity</th>
                                                <th className="pb-4 px-6">Growth potential</th>
                                                <th className="pb-4 px-6 text-right">Execute action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50/50">
                                            {activeEmployees.length === 0 ? (
                                                <tr>
                                                    <td colSpan={3} className="py-20 text-center text-slate-300 font-black text-xl italic">No matching personnel in current cluster.</td>
                                                </tr>
                                            ) : activeEmployees.map((emp) => (
                                                <tr key={emp.id} className="group hover:bg-slate-50/50 transition-all">
                                                    <td className="py-5 px-6">
                                                        <div className="flex items-center gap-5">
                                                            <div className="h-12 w-12 rounded-[1rem] bg-slate-100 flex items-center justify-center text-slate-400 font-bold relative group-hover:bg-[#CB9DF0]/10 group-hover:text-[#CB9DF0] transition-colors">
                                                                {emp.avatar ? <span className="text-lg uppercase">{emp.avatar}</span> : <User size={24} />}
                                                                {emp.status === 'Probation' && (
                                                                    <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-400 border-[2px] border-white shadow-sm" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-slate-900 text-xl tracking-tight group-hover:text-indigo-600 transition-colors">{emp.name}</h4>
                                                                <div className="flex items-center gap-3 mt-1">
                                                                    <Badge variant="outline" className="border-slate-100 text-slate-400 font-bold text-[10px]">{emp.role}</Badge>
                                                                    <span className="text-[10px] font-black text-slate-200">•</span>
                                                                    <span className="text-slate-400 font-bold text-[10px]">{emp.department}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-6">
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between w-40">
                                                                <span className="text-[12px] font-bold text-slate-400">{emp.performance}% Score</span>
                                                                {emp.performance >= 90 && <Star size={14} className="fill-[#F0C1E1] text-[#F0C1E1]" />}
                                                            </div>
                                                            <div className="w-40 h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                                                <div
                                                                    className={`h-full rounded-full transition-all duration-1000 ${emp.performance >= 90 ? 'bg-[#CB9DF0]' : 'bg-slate-300'}`}
                                                                    style={{ width: `${emp.performance}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-6 text-right">
                                                        <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                                            <button
                                                                className="h-10 w-10 rounded-[0.8rem] bg-white border-2 border-slate-50 shadow-sm flex items-center justify-center text-[#CB9DF0] hover:bg-[#CB9DF0] hover:text-white hover:shadow-xl hover:shadow-purple-100 transition-all active:scale-95"
                                                                title="Promote" onClick={() => openActionDialog('Promotion', emp.id)}
                                                            >
                                                                <TrendingUp size={16} />
                                                            </button>
                                                            <button
                                                                className="h-10 w-10 rounded-[0.8rem] bg-white border-2 border-slate-50 shadow-sm flex items-center justify-center text-[#F0C1E1] hover:bg-[#F0C1E1] hover:text-white hover:shadow-xl hover:shadow-pink-100 transition-all active:scale-95"
                                                                title="Transfer" onClick={() => openActionDialog('Transfer', emp.id)}
                                                            >
                                                                <ArrowRightLeft size={16} />
                                                            </button>
                                                            <button
                                                                className="h-10 w-10 rounded-[0.8rem] bg-white border-2 border-slate-50 shadow-sm flex items-center justify-center text-[#FFF9BF] hover:bg-slate-800 hover:text-white hover:shadow-xl transition-all active:scale-95"
                                                                title="Salary Fix" onClick={() => openActionDialog('Salary', emp.id)}
                                                            >
                                                                <DollarSign size={16} />
                                                            </button>
                                                            <button
                                                                className="h-10 w-10 rounded-[0.8rem] bg-white border-2 border-slate-50 shadow-sm flex items-center justify-center text-rose-300 hover:bg-rose-500 hover:text-white hover:shadow-xl hover:shadow-rose-100 transition-all active:scale-95 ml-6"
                                                                title="Mark Exit" onClick={() => openActionDialog('Exit', emp.id)}
                                                            >
                                                                <LogOut size={16} />
                                                            </button>
                                                        </div>
                                                        <MoreHorizontal className="text-slate-200 group-hover:hidden float-right mr-4" size={24} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Timeline / History Log */}
                    <div className="h-full">
                        <Card className="border border-slate-200 shadow-2xl shadow-slate-200/40 rounded-[2rem] bg-white h-full flex flex-col">
                            <div className="p-8 pb-0 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 italic">
                                    <History className="text-slate-300" size={22} />
                                    Growth audit
                                </h2>
                            </div>
                            <div className="p-8 flex-1 max-h-[600px] overflow-y-auto no-scrollbar">
                                <div className="relative space-y-10">
                                    <div className="absolute left-7 top-4 bottom-8 w-0.5 bg-slate-50" />

                                    {history.length === 0 ? (
                                        <div className="text-center py-32 space-y-6">
                                            <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-100">
                                                <History size={48} />
                                            </div>
                                            <p className="text-slate-300 font-black italic text-lg max-w-[200px] mx-auto leading-relaxed tracking-tighter">Growth history is recorded as you take actions.</p>
                                        </div>
                                    ) : history.slice(0, 15).map((log, idx) => (
                                        <div key={log.id} className="relative pl-20 group">
                                            <div className={`absolute left-5 top-1.5 h-6 w-6 rounded-full border-[5px] border-white shadow-xl z-10 transition-transform group-hover:scale-125
                                            ${log.type === 'growth' ? 'bg-[#CB9DF0]' : log.type === 'warning' ? 'bg-rose-500' : 'bg-slate-400'}`}
                                            />
                                            <div className="space-y-2">
                                                <p className="text-[11px] font-bold text-slate-200 tracking-widest">{log.date}</p>
                                                <h4 className="font-black text-slate-900 text-xl leading-snug group-hover:text-indigo-600 transition-colors tracking-tight">{log.title}</h4>
                                                <p className="text-slate-400 font-bold text-base leading-relaxed line-clamp-2">{log.description}</p>
                                            </div>
                                            <div className="mt-4 flex items-center gap-3">
                                                <Badge variant="ghost" className="bg-slate-50 text-slate-400 text-[10px] font-bold px-4 py-1.5 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-400 transition-colors">
                                                    {log.employeeName}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Unified Action Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="bg-white rounded-[2.5rem] border-none p-0 max-w-xl shadow-[0_50px_100px_-30px_rgba(0,0,0,0.2)] outline-none overflow-hidden">
                        <div style={{ transform: 'scale(0.85)', transformOrigin: 'center' }} className="p-12">
                            <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-[#CB9DF0]/10 -z-10 blur-[80px]" />
                            <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-[#F0C1E1]/10 -z-10 blur-[80px]" />

                            <DialogHeader className="mb-8">
                                <div className="flex items-center gap-5 mb-4">
                                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-white shadow-xl transition-transform hover:scale-105
                                    ${actionType === 'Promotion' ? 'bg-[#CB9DF0]' : actionType === 'Transfer' ? 'bg-[#F0C1E1]' : actionType === 'Salary' ? 'bg-slate-900' : 'bg-rose-500'}`}>
                                        {actionType === 'Promotion' && <TrendingUp size={28} />}
                                        {actionType === 'Transfer' && <ArrowRightLeft size={28} />}
                                        {actionType === 'Salary' && <DollarSign size={28} />}
                                        {actionType === 'Exit' && <LogOut size={28} />}
                                    </div>
                                    <div>
                                        <DialogTitle className="text-3xl font-bold text-slate-900 tracking-tight italic">Initiate {actionType.toLowerCase()}</DialogTitle>
                                        <DialogDescription className="text-slate-400 font-medium text-base mt-0.5">Personnel management authorization</DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <Label className="font-semibold text-xs text-slate-400 uppercase tracking-widest pl-2">Target personnel</Label>
                                    <Select onValueChange={setSelectedEmpId} value={selectedEmpId}>
                                        <SelectTrigger className="rounded-2xl h-16 bg-slate-50 border-none hover:bg-slate-100/80 focus:ring-0 transition-all px-8 font-bold text-lg shadow-inner">
                                            <SelectValue placeholder="Select identity..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-none shadow-2xl p-3">
                                            {employees.filter(e => e.status !== 'Exited').map(e => (
                                                <SelectItem key={e.id} value={e.id} className="font-bold text-base py-3 rounded-xl px-6 my-1 focus:bg-[#CB9DF0]/10 focus:text-[#CB9DF0]">
                                                    {e.name} <span className="opacity-20 mx-3">|</span> <span className="text-slate-400 text-xs font-bold uppercase tracking-tighter">{e.role}</span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <AnimatePresence mode="wait">
                                    {actionType !== 'Exit' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-3"
                                        >
                                            <Label className="font-semibold text-xs text-slate-400 uppercase tracking-widest pl-2">
                                                {actionType === 'Promotion' ? 'Designation upgrade' : actionType === 'Transfer' ? 'New ops cluster' : 'Compensation band'}
                                            </Label>
                                            <div className="relative group">
                                                <Input
                                                    placeholder={
                                                        actionType === 'Promotion' ? "e.g. Lead Engineer" :
                                                            actionType === 'Transfer' ? "e.g. Growth Dept / UK" :
                                                                "e.g. ₹32,00,000"
                                                    }
                                                    value={newValue}
                                                    onChange={e => setNewValue(e.target.value)}
                                                    className="rounded-2xl h-16 bg-slate-50 border-none hover:bg-slate-100/80 focus:ring-0 transition-all px-8 font-bold text-lg shadow-inner placeholder:text-slate-300 placeholder:italic"
                                                />
                                                <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200 group-hover:text-[#CB9DF0]/40 transition-colors" size={20} />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <DialogFooter className="mt-12">
                                <Button
                                    className={`w-full text-white rounded-2xl font-bold h-16 text-lg shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3
                                    ${actionType === 'Exit' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'}`}
                                    onClick={handleSubmit}
                                >
                                    Authorize {actionType.toLowerCase()} <ChevronRight size={22} />
                                </Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
};

export default LifecycleActionsPage;
