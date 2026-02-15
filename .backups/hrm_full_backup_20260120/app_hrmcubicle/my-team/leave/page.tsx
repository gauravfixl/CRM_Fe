"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    Filter,
    AlertCircle,
    History,
    Check,
    X,
    MessageSquare,
    ChevronDown,
    MoreHorizontal
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/components/ui/use-toast";
import { useTeamStore } from "@/shared/data/team-store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

const TeamLeavePage = () => {
    const { leaves, members } = useTeamStore();
    const { toast } = useToast();
    const [view, setView] = useState<'pending' | 'history'>('pending');

    const pendingLeaves = leaves.filter(l => l.status === 'Pending');
    const processedLeaves = leaves.filter(l => l.status !== 'Pending');

    const stats = [
        { label: "Pending", value: pendingLeaves.length, color: "bg-amber-100", textColor: "text-amber-700" },
        { label: "On Leave Today", value: leaves.filter(l => l.status === 'Approved' && new Date(l.startDate) <= new Date() && new Date(l.endDate) >= new Date()).length, color: "bg-emerald-100", textColor: "text-emerald-700" },
        { label: "Upcoming", value: leaves.filter(l => l.status === 'Approved' && new Date(l.startDate) > new Date()).length, color: "bg-blue-100", textColor: "text-blue-700" },
    ];

    const handleAction = (id: string, action: 'Approve' | 'Reject') => {
        toast({
            title: `Application ${action}d`,
            description: `The leave request has been ${action.toLowerCase()}ed successfully.`,
            variant: action === 'Approve' ? 'default' : 'destructive'
        });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Team Leave Requests</h1>
                    <p className="text-slate-500 font-medium">Review and manage leave applications from your direct reports.</p>
                </div>
                <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
                    <Button
                        variant={view === 'pending' ? 'default' : 'ghost'}
                        className={`rounded-xl font-black text-xs uppercase tracking-widest ${view === 'pending' ? 'bg-slate-900 shadow-lg' : 'text-slate-500'}`}
                        onClick={() => setView('pending')}
                    >
                        Pending Actions
                    </Button>
                    <Button
                        variant={view === 'history' ? 'default' : 'ghost'}
                        className={`rounded-xl font-black text-xs uppercase tracking-widest ${view === 'history' ? 'bg-slate-900 shadow-lg' : 'text-slate-500'}`}
                        onClick={() => setView('history')}
                    >
                        History
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-lg rounded-[2.5rem] ${stat.color} p-8 group`}>
                            <p className={`text-xs font-black uppercase tracking-[0.2em] ${stat.textColor} opacity-60 mb-2`}>{stat.label}</p>
                            <h3 className={`text-5xl font-black ${stat.textColor}`}>{stat.value}</h3>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {view === 'pending' ? (
                    <motion.div
                        key="pending"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-black text-slate-900 ml-2">Inbox ({pendingLeaves.length})</h2>
                        {pendingLeaves.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {pendingLeaves.map((leave, i) => {
                                    const member = members.find(m => m.id === leave.empId);
                                    return (
                                        <Card key={leave.id} className="border-none shadow-xl rounded-[3rem] bg-white p-8 group overflow-hidden relative">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <div className="flex items-start justify-between mb-8 relative z-10">
                                                <div className="flex items-center gap-5">
                                                    <Avatar className="h-16 w-16 ring-4 ring-slate-50 bg-indigo-100 text-indigo-700 font-black text-xl">
                                                        <AvatarFallback>{member?.avatar}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h3 className="font-black text-2xl text-slate-900">{leave.empName}</h3>
                                                        <Badge className="bg-indigo-50 text-indigo-600 border-none font-black text-[10px] uppercase tracking-widest px-3">
                                                            {leave.type}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-4xl text-slate-900 leading-none">{leave.days}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Days</p>
                                                </div>
                                            </div>

                                            <div className="space-y-6 relative z-10">
                                                <div className="p-6 bg-slate-50 rounded-[2rem] space-y-4">
                                                    <div className="flex items-center gap-3 text-slate-600 font-bold">
                                                        <Calendar size={18} className="text-indigo-400" />
                                                        <span>{new Date(leave.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — {new Date(leave.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <MessageSquare size={18} className="text-slate-400 mt-1 shrink-0" />
                                                        <p className="text-sm text-slate-600 italic">"{leave.reason}"</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4">
                                                    <Button
                                                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl h-14 text-lg shadow-lg hover:shadow-emerald-200 transition-all"
                                                        onClick={() => handleAction(leave.id, 'Approve')}
                                                    >
                                                        <Check className="mr-2 h-6 w-6" /> Approve
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="px-8 border-rose-100 text-rose-500 hover:bg-rose-50 font-black rounded-2xl h-14"
                                                        onClick={() => handleAction(leave.id, 'Reject')}
                                                    >
                                                        <X className="h-6 w-6" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <Card className="border-none shadow-sm rounded-[3rem] bg-white p-20 text-center">
                                <div className="h-24 w-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="text-emerald-500" size={48} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900">All caught up!</h3>
                                <p className="text-slate-400 font-medium">No pending leave requests to review.</p>
                            </Card>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="history"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-black text-slate-900 ml-2">Processed Requests</h2>
                        <Card className="border-none shadow-lg rounded-[3rem] bg-white overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100">
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Employee</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Type</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Dates</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Days</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Status</th>
                                            <th className="px-8 py-6"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {processedLeaves.map((leave, i) => (
                                            <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="h-12 w-12 bg-slate-100 font-bold">
                                                            <AvatarFallback>{leave.empName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-black text-slate-900 text-lg">{leave.empName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="font-bold text-slate-600">{leave.type}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-slate-700 text-sm">{new Date(leave.startDate).toLocaleDateString()}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">to {new Date(leave.endDate).toLocaleDateString()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <span className="font-black text-slate-900 text-xl">{leave.days}</span>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <Badge className={`${leave.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'} border-none font-black px-4 py-1.5 rounded-xl uppercase text-[10px]`}>
                                                        {leave.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreHorizontal size={18} className="text-slate-400" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeamLeavePage;
