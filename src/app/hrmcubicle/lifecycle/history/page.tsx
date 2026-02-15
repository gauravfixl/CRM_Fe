"use client"

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    History,
    Calendar,
    Briefcase,
    User,
    ArrowUpRight,
    CircleDot,
    Search,
    Filter,
    Activity,
    ShieldCheck,
    LogOut,
    CheckCircle2,
    LayoutGrid,
    SearchX
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useLifecycleStore, HistoryLog } from "@/shared/data/lifecycle-store";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

const HistoryPage = () => {
    const { employees, history } = useLifecycleStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<"All" | "growth" | "exit" | "neutral">("All");

    // Default to first employee
    const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || "");
    const selectedEmp = useMemo(() => employees.find(e => e.id === selectedEmpId), [employees, selectedEmpId]);

    // Derived filtering
    const empHistory = useMemo(() => {
        return history
            .filter(h => h.employeeId === selectedEmpId)
            .filter(h => filterType === "All" || h.type === filterType)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [history, selectedEmpId, filterType]);

    const filteredEmployees = useMemo(() => {
        return employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [employees, searchTerm]);

    const getIconForType = (type: string) => {
        switch (type) {
            case 'growth': return <ArrowUpRight size={20} className="text-emerald-500" />;
            case 'exit': return <LogOut size={20} className="text-rose-500" />;
            case 'neutral': return <Activity size={20} className="text-[#CB9DF0]" />;
            default: return <Briefcase size={20} className="text-slate-400" />;
        }
    };

    const getColorForType = (type: string) => {
        switch (type) {
            case 'growth': return 'bg-emerald-50 border-emerald-100';
            case 'exit': return 'bg-rose-50 border-rose-100';
            case 'neutral': return 'bg-purple-50 border-purple-100';
            default: return 'bg-slate-50 border-slate-100';
        }
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
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic capitalize">Lifecycle History</h1>
                        <p className="text-slate-500 font-bold text-base mt-0.5 ml-1">Stage 10: Complete chronological timeline of employee events.</p>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            className={`rounded-xl h-12 px-6 font-black italic shadow-sm border-slate-200 transition-all ${filterType === 'All' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500'}`}
                            onClick={() => setFilterType('All')}
                        >
                            Complete journey
                        </Button>
                        <Button
                            variant="outline"
                            className={`rounded-xl h-12 px-6 font-black italic shadow-sm border-slate-200 transition-all ${filterType === 'growth' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-500'}`}
                            onClick={() => setFilterType('growth')}
                        >
                            Milestones
                        </Button>
                        <Button
                            variant="outline"
                            className={`rounded-xl h-12 px-6 font-black italic shadow-sm border-slate-200 transition-all ${filterType === 'exit' ? 'bg-rose-500 text-white' : 'bg-white text-slate-500'}`}
                            onClick={() => setFilterType('exit')}
                        >
                            Separations
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar: Master List */}
                    <div className="lg:w-1/3">
                        <Card className="border border-slate-200 shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white p-8 h-[calc(100vh-250px)] flex flex-col">
                            <div className="relative mb-8">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                <Input
                                    className="h-14 pl-16 rounded-2xl bg-slate-50 border-none w-full font-bold text-lg placeholder:italic transition-all shadow-inner focus:bg-white focus:ring-2 focus:ring-[#CB9DF0]/20"
                                    placeholder="Search diaries..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-3">
                                {filteredEmployees.length === 0 ? (
                                    <div className="text-center py-10">
                                        <SearchX size={40} className="mx-auto text-slate-100 mb-4" />
                                        <p className="font-bold text-slate-300 uppercase text-xs">No records found</p>
                                    </div>
                                ) : filteredEmployees.map(emp => (
                                    <motion.div
                                        key={emp.id}
                                        whileHover={{ x: 5 }}
                                        onClick={() => setSelectedEmpId(emp.id)}
                                        className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center gap-5
                                            ${selectedEmpId === emp.id ? 'bg-slate-900 border-slate-900 shadow-2xl text-white' : 'bg-white border-slate-50 text-slate-600'}`}
                                    >
                                        <Avatar className={`h-14 w-14 rounded-2xl transition-transform ${selectedEmpId === emp.id ? 'scale-110 shadow-lg ring-4 ring-white/10' : ''}`}>
                                            <AvatarFallback className={selectedEmpId === emp.id ? 'bg-[#9d5ccf] text-white' : 'bg-purple-100 text-purple-600'}>{emp.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h4 className="font-black text-xl tracking-tight leading-none mb-1">{emp.name}</h4>
                                            <p className={`text-[11px] font-bold capitalize ${selectedEmpId === emp.id ? 'text-[#CB9DF0]' : 'text-slate-400'}`}>{emp.role}</p>
                                        </div>
                                        <Badge className={`px-4 py-1.5 rounded-lg font-black text-[9px] italic border-none ${selectedEmpId === emp.id ? 'bg-white/10 text-[#CB9DF0]' : 'bg-slate-50 text-slate-400'
                                            }`}>
                                            {emp.status}
                                        </Badge>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Timeline Container */}
                    <div className="lg:w-2/3">
                        {selectedEmp ? (
                            <Card className="border border-slate-200 shadow-2xl shadow-slate-200/40 rounded-[3rem] bg-white p-12 min-h-[700px]">
                                {/* Timeline Hero */}
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-16 pb-12 border-b-4 border-slate-50 border-dotted">
                                    <div className="relative group">
                                        <Avatar className="h-32 w-32 rounded-[3rem] bg-[#CB9DF0] text-5xl font-black text-white shadow-2xl shadow-[#CB9DF0]/40 ring-[10px] ring-slate-50 group-hover:scale-105 transition-transform duration-500">
                                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">{selectedEmp.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg">
                                            <ShieldCheck size={20} />
                                        </div>
                                    </div>
                                    <div className="space-y-4 text-center md:text-left flex-1">
                                        <div className="space-y-1">
                                            <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">{selectedEmp.name}</h2>
                                            <p className="text-2xl font-bold text-[#9d5ccf] italic opacity-80">{selectedEmp.role} — <span className="text-slate-400">{selectedEmp.department}</span></p>
                                        </div>
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                                            <Badge className="bg-slate-900 text-white rounded-xl px-5 py-2 font-black italic">ID REFERENCE: #{selectedEmp.id}</Badge>
                                            <Badge variant="outline" className="border-slate-200 text-slate-500 rounded-xl px-5 py-2 font-black italic">COMMENCED: {selectedEmp.joinDate}</Badge>
                                            {selectedEmp.lwd && (
                                                <Badge className="bg-rose-100 text-rose-600 border-none rounded-xl px-5 py-2 font-black italic">SEPARATION: {selectedEmp.lwd}</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="h-24 w-24 bg-slate-50 rounded-[2rem] flex flex-col items-center justify-center border border-slate-100">
                                        <span className="text-3xl font-black text-slate-900">{empHistory.length}</span>
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Events</span>
                                    </div>
                                </div>

                                {/* The Actual Timeline */}
                                <div className="relative pl-20 ml-6">
                                    {/* Central Line */}
                                    <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-[#CB9DF0] via-slate-100 to-slate-50 opacity-50" />

                                    <AnimatePresence mode="popLayout">
                                        {empHistory.length === 0 ? (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
                                                <p className="text-slate-300 font-bold italic text-2xl uppercase tracking-tighter">No timeline markers found for this query.</p>
                                            </motion.div>
                                        ) : empHistory.map((event, i) => (
                                            <motion.div
                                                key={event.id}
                                                initial={{ opacity: 0, x: -30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="relative mb-16 last:mb-0"
                                            >
                                                {/* Date Marker */}
                                                <div className="absolute -left-[108px] top-6 w-20 text-right">
                                                    <p className="text-[11px] font-black text-[#9d5ccf] uppercase tracking-tighter">{event.date.split('-')[2]}</p>
                                                    <p className="text-[10px] font-bold text-slate-300 uppercase leading-none">{new Date(event.date).toLocaleString('en-US', { month: 'short' })}</p>
                                                </div>

                                                {/* Connector Dot */}
                                                <div className={`absolute -left-[58px] top-6 h-10 w-10 rounded-2xl border-4 border-white shadow-2xl z-20 flex items-center justify-center transition-transform hover:scale-125 hover:rotate-12
                                                    ${getColorForType(event.type)}`}>
                                                    {getIconForType(event.type)}
                                                </div>

                                                {/* Event Content */}
                                                <Card className="p-8 border-none bg-slate-50/50 hover:bg-slate-50 hover:shadow-2xl hover:shadow-purple-100/30 transition-all rounded-[2.5rem] group cursor-default">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h4 className="text-2xl font-black text-slate-900 italic tracking-tight leading-tight group-hover:text-[#9d5ccf] transition-colors">{event.title}</h4>
                                                        <Badge variant="ghost" className="text-[9px] font-black bg-white/80 px-3 py-1 rounded-lg border border-slate-100 shadow-sm opacity-60">REF: {event.id.slice(0, 6)}</Badge>
                                                    </div>
                                                    <p className="text-slate-500 font-bold text-lg leading-relaxed opacity-80">{event.description}</p>

                                                    <div className="flex gap-4 mt-6">
                                                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-300 border border-slate-100 shadow-sm hover:text-[#CB9DF0] transition-colors cursor-pointer">
                                                            <MoreHorizontal size={18} />
                                                        </div>
                                                        <div className="h-10 px-4 rounded-xl bg-white flex items-center justify-center text-slate-400 font-black text-[10px] uppercase border border-slate-100 shadow-sm">
                                                            Logged by HR System
                                                        </div>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </Card>
                        ) : (
                            <div className="h-full min-h-[700px] flex flex-col items-center justify-center text-slate-300 space-y-6 border-2 border-dashed border-slate-100 rounded-[3rem] p-20 text-center">
                                <History size={80} className="text-slate-100" />
                                <p className="font-black italic text-2xl uppercase tracking-tighter opacity-50">Select a team member to decrypt their chronological lifecycle records.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;
