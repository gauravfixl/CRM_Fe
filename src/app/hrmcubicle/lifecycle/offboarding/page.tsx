"use client"

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LogOut,
    FileText,
    MessageSquare,
    UserCheck,
    AlertCircle,
    Calendar,
    ArrowRight,
    Search,
    Filter,
    Plus,
    History,
    MoreHorizontal,
    LayoutGrid
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { Input } from "@/shared/components/ui/input";
import { useLifecycleStore, LifecycleEmployee } from "@/shared/data/lifecycle-store";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

const ExitManagementPage = () => {
    const { toast } = useToast();
    const { employees, initiateExit, history } = useLifecycleStore();

    // UI State
    const [searchTerm, setSearchTerm] = useState("");
    const [filterActive, setFilterActive] = useState<"All" | "Notice" | "Exited">("All");

    // Initiation State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEmpId, setSelectedEmpId] = useState("");
    const [exitReason, setExitReason] = useState("");
    const [lwd, setLwd] = useState("");

    // Filtered data
    const offboardingList = useMemo(() => {
        return employees.filter(e => {
            const isOffboarding = e.status === 'Notice Period' || e.status === 'Exited';
            const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase());

            let matchesFilter = true;
            if (filterActive === "Notice") matchesFilter = e.status === 'Notice Period';
            if (filterActive === "Exited") matchesFilter = e.status === 'Exited';

            return isOffboarding && matchesSearch && matchesFilter;
        });
    }, [employees, searchTerm, filterActive]);

    const activeEmployees = employees.filter(e => e.status === 'Active' || e.status === 'Probation');

    const stats = useMemo(() => {
        const noticeCount = employees.filter(e => e.status === 'Notice Period').length;
        const exitedCount = employees.filter(e => e.status === 'Exited').length;

        return [
            { label: "Active resignations", value: noticeCount, color: "bg-[#F0C1E1]", icon: <LogOut size={24} />, filter: "Notice" as const },
            { label: "Exits recorded", value: exitedCount, color: "bg-[#CB9DF0]", icon: <UserCheck size={24} />, filter: "Exited" as const },
            { label: "Managed transitions", value: offboardingList.length, color: "bg-[#FDDBBB]", icon: <History size={24} />, filter: "All" as const },
        ];
    }, [employees, offboardingList]);

    const handleInitiateExit = () => {
        if (!selectedEmpId || !exitReason || !lwd) {
            toast({ title: "Incomplete details", description: "Please fill all fields to initiate exit.", variant: "destructive" });
            return;
        }

        const empName = employees.find(e => e.id === selectedEmpId)?.name;
        initiateExit(selectedEmpId, exitReason, lwd);

        setIsDialogOpen(false);
        setSelectedEmpId("");
        setExitReason("");
        setLwd("");

        toast({
            title: "Exit Initiated 🏁",
            description: `${empName} has been moved to Notice Period. Clearance is now active.`
        });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] overflow-x-hidden overflow-y-auto">
            <div style={{
                zoom: '0.75',
                width: '100%',
            }} className="p-12 space-y-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 pb-2 border-b border-slate-100">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic capitalize">Exit Management</h1>
                        <p className="text-slate-500 font-bold text-base mt-0.5 ml-1">Stage 7: Resignation, Notice Period & Separation.</p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="rounded-xl font-bold border-slate-200 text-slate-500 hover:bg-slate-50 h-14 px-8"
                            onClick={() => { localStorage.clear(); window.location.reload(); }}
                        >
                            <LayoutGrid size={18} className="mr-2" /> System reset
                        </Button>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl font-black h-14 px-10 shadow-2xl shadow-purple-200 flex items-center gap-3">
                                    <LogOut size={18} /> Initiate exit
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white rounded-[2.5rem] border-none p-10 max-w-xl shadow-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black text-slate-900 italic tracking-tight uppercase">Initiate separation</DialogTitle>
                                    <DialogDescription className="font-bold text-slate-400">Formalize the offboarding process for an active employee.</DialogDescription>
                                </DialogHeader>

                                <div className="py-6 space-y-6">
                                    <div className="space-y-3">
                                        <Label className="font-black text-xs uppercase tracking-widest ml-1 text-slate-400">Select personnel</Label>
                                        <Select value={selectedEmpId} onValueChange={setSelectedEmpId}>
                                            <SelectTrigger className="h-14 rounded-xl bg-slate-50 border-none font-bold text-base">
                                                <SelectValue placeholder="Identify employee..." />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-slate-100 shadow-2xl font-bold">
                                                {activeEmployees.map(e => (
                                                    <SelectItem key={e.id} value={e.id}>{e.name} — {e.role}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="font-black text-xs uppercase tracking-widest ml-1 text-slate-400">Last working day</Label>
                                        <Input
                                            type="date"
                                            className="h-14 rounded-xl bg-slate-50 border-none font-bold text-base px-4"
                                            value={lwd}
                                            onChange={(e) => setLwd(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="font-black text-xs uppercase tracking-widest ml-1 text-slate-400">Reason for exit</Label>
                                        <Textarea
                                            placeholder="Specify resignation details..."
                                            className="min-h-[120px] rounded-2xl bg-slate-50 border-none font-bold text-base p-6"
                                            value={exitReason}
                                            onChange={(e) => setExitReason(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button className="w-full h-14 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-rose-100" onClick={handleInitiateExit}>Confirm Resignation</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
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
                            className={`group cursor-pointer transition-all ${filterActive === stat.filter ? 'ring-4 ring-[#CB9DF0]/20 scale-105' : ''}`}
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

                {/* Main List */}
                <Card className="border border-slate-200 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.05)] rounded-[2.5rem] bg-white overflow-hidden p-10">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                        <div className="flex items-center gap-4">
                            <LogOut className="text-[#CB9DF0]" size={28} />
                            <h3 className="font-black text-2xl text-slate-900 italic tracking-tight">Separation Queue</h3>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-400 border-none font-bold px-3 py-1 text-xs">
                                {offboardingList.length} personnel
                            </Badge>
                        </div>
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                            <Input
                                className="h-14 pl-16 rounded-2xl bg-slate-50 border-none w-full md:w-80 font-bold text-lg placeholder:italic transition-all shadow-inner focus:bg-white focus:ring-2 focus:ring-[#CB9DF0]/20"
                                placeholder="Filter separation logs..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {offboardingList.length === 0 ? (
                            <div className="text-center py-24 space-y-6">
                                <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-100">
                                    <AlertCircle size={48} />
                                </div>
                                <p className="text-slate-300 font-black italic text-2xl max-w-[400px] mx-auto leading-relaxed tracking-tighter uppercase">No personnel matching your filter criteria.</p>
                            </div>
                        ) : offboardingList.map((emp, i) => (
                            <motion.div
                                key={emp.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <div className={`p-8 rounded-[2rem] border-2 transition-all hover:shadow-2xl hover:bg-white group
                                    ${emp.status === 'Notice Period' ? 'bg-white border-slate-50' : 'bg-slate-50 border-transparent opacity-80'}`}>
                                    <div className="flex flex-col xl:flex-row xl:items-center gap-10">

                                        <div className="flex items-center gap-6 min-w-[300px]">
                                            <Avatar className="h-16 w-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-[#CB9DF0] font-black text-2xl border border-slate-50 group-hover:scale-110 transition-transform">
                                                <AvatarFallback>{emp.avatar}</AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1">
                                                <h4 className="text-2xl font-black text-slate-900 tracking-tight">{emp.name}</h4>
                                                <p className="text-sm font-bold text-slate-400 capitalize">{emp.role} — <span className="text-[#CB9DF0] italic">{emp.department}</span></p>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <span>Reason & Last Day</span>
                                                <span className="text-[#CB9DF0]">{emp.status === 'Notice Period' ? 'In notice period' : 'Separation finalized'}</span>
                                            </div>
                                            <div className="flex items-center gap-10">
                                                <div className="flex items-center gap-3">
                                                    <MessageSquare size={18} className="text-[#CB9DF0]" />
                                                    <span className="font-bold text-slate-600 line-clamp-1">{emp.exitReason}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Calendar size={18} className="text-rose-400" />
                                                    <span className="font-black text-slate-900">{emp.lwd}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Badge className={`px-6 py-2.5 rounded-xl font-black italic shadow-sm border-none ${emp.status === 'Notice Period' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-500'
                                                }`}>
                                                {emp.status}
                                            </Badge>
                                            <Button variant="ghost" className="h-12 w-12 rounded-xl text-slate-300 hover:text-[#CB9DF0] hover:bg-purple-50">
                                                <ArrowRight size={24} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ExitManagementPage;
