"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    History,
    Calendar,
    Briefcase,
    User,
    ArrowUpRight,
    CircleDot,
    Search,
    Filter
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useLifecycleStore, HistoryEvent } from "@/shared/data/lifecycle-store";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";

const HistoryPage = () => {
    const { employees, history } = useLifecycleStore();
    const [searchTerm, setSearchTerm] = useState("");

    // Select first employee by default if available
    const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || "");

    const selectedEmp = employees.find(e => e.id === selectedEmpId);

    // Filter history for selected employee
    const empHistory = history.filter(h => h.employeeId === selectedEmpId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Latest first

    const filteredEmployees = employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const getIconForType = (type: HistoryEvent['type']) => {
        switch (type) {
            case 'start': return <Calendar size={18} />;
            case 'growth': return <ArrowUpRight size={18} />;
            case 'exit': return <CircleDot size={18} />;
            default: return <Briefcase size={18} />;
        }
    };

    const getColorForType = (type: HistoryEvent['type']) => {
        switch (type) {
            case 'start': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'growth': return 'bg-[#CB9DF0]/20 text-[#9d5ccf] border-[#CB9DF0]';
            case 'exit': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-slate-100 text-slate-500 border-slate-200';
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lifecycle History</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">Stage 10: Complete chronological timeline of employee events.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Employee Selector List */}
                <div className="lg:w-1/3 space-y-4">
                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white p-6 h-[calc(100vh-200px)] flex flex-col">
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            <Input placeholder="Search records..." className="pl-10 rounded-xl bg-slate-50 border-none w-full" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                            {filteredEmployees.map(emp => (
                                <div
                                    key={emp.id}
                                    onClick={() => setSelectedEmpId(emp.id)}
                                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${selectedEmpId === emp.id
                                            ? 'bg-slate-900 text-white shadow-lg'
                                            : 'bg-white border-transparent hover:bg-slate-50 text-slate-600'
                                        }`}
                                >
                                    <Avatar className={`h-10 w-10 ${selectedEmpId === emp.id ? 'bg-white/20 text-white' : 'bg-[#F0C1E1] text-white'}`}>
                                        <AvatarFallback>{emp.avatar}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h4 className={`font-bold text-sm ${selectedEmpId === emp.id ? 'text-white' : 'text-slate-900'}`}>{emp.name}</h4>
                                        <p className={`text-[10px] uppercase font-bold tracking-wider ${selectedEmpId === emp.id ? 'opacity-70' : 'text-slate-400'}`}>{emp.role}</p>
                                    </div>
                                    <Badge variant="outline" className={`border-none ${selectedEmpId === emp.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                        }`}>{emp.status}</Badge>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Timeline View */}
                <div className="lg:w-2/3">
                    {selectedEmp ? (
                        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white p-8 min-h-[500px]">
                            <div className="flex items-center gap-6 mb-10 pb-8 border-b border-slate-50">
                                <Avatar className="h-20 w-20 rounded-[2rem] bg-[#CB9DF0] text-3xl font-black text-white shadow-xl shadow-[#CB9DF0]/40">
                                    <AvatarFallback>{selectedEmp.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900">{selectedEmp.name}</h2>
                                    <p className="text-slate-500 font-bold text-lg">{selectedEmp.role} • {selectedEmp.department}</p>
                                    <div className="flex gap-2 mt-3">
                                        <Badge className="bg-slate-900 text-white rounded-lg px-3 py-1 font-bold">ID: {selectedEmp.id}</Badge>
                                        <Badge variant="outline" className="border-slate-200 text-slate-500 rounded-lg px-3 py-1 font-bold">Joined: {selectedEmp.joinDate}</Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="relative pl-8 border-l-2 border-slate-100 space-y-10 ml-4">
                                {empHistory.length === 0 ? (
                                    <div className="text-slate-400 font-medium italic pl-4">No history events recorded properly for this ID.</div>
                                ) : empHistory.map((event, i) => (
                                    <motion.div key={event.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative">
                                        {/* Dot */}
                                        <div className={`absolute -left-[45px] h-8 w-8 rounded-full border-4 border-white shadow-md flex items-center justify-center ${getColorForType(event.type)}`}>
                                            {getIconForType(event.type)}
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-5 hover:bg-slate-100 transition-colors group">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-900 text-lg group-hover:text-[#9d5ccf]">{event.title}</h4>
                                                <span className="text-xs font-bold text-slate-400 font-mono bg-white px-2 py-1 rounded-md shadow-sm">{event.date}</span>
                                            </div>
                                            <p className="text-slate-500 font-medium text-sm leading-relaxed">{event.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10">
                            <History size={48} className="mb-4 opacity-50" />
                            <h3 className="text-lg font-bold">No Employee Selected</h3>
                            <p className="text-sm">Select an employee from the list to view their lifecycle journey.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;
