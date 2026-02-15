"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    CheckCircle2,
    Clock,
    Check,
    X,
    MessageSquare,
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

const TeamLeavePage = () => {
    const { leaves, members } = useTeamStore();
    const { toast } = useToast();
    const [view, setView] = useState<'pending' | 'history'>('pending');

    const pendingLeaves = leaves.filter(l => l.status === 'Pending');
    const processedLeaves = leaves.filter(l => l.status !== 'Pending');

    const stats = [
        { label: "Pending Actions", value: pendingLeaves.length, color: "bg-amber-100", icon: <Clock className="text-amber-600" />, textColor: "text-amber-900" },
        {
            label: "On Leave Today",
            value: leaves.filter(l => l.status === 'Approved' && new Date(l.startDate) <= new Date() && new Date(l.endDate) >= new Date()).length,
            color: "bg-emerald-100",
            icon: <Calendar className="text-emerald-600" />,
            textColor: "text-emerald-900"
        },
        {
            label: "Upcoming Leaves",
            value: leaves.filter(l => l.status === 'Approved' && new Date(l.startDate) > new Date()).length,
            color: "bg-indigo-100",
            icon: <Calendar className="text-indigo-600" />,
            textColor: "text-indigo-900"
        },
    ];

    const handleAction = (id: string, action: 'Approve' | 'Reject') => {
        const { approveLeave, rejectLeave } = useTeamStore.getState();
        if (action === 'Approve') approveLeave(id);
        else rejectLeave(id);

        toast({
            title: `Application ${action}d`,
            description: `The leave request has been ${action.toLowerCase()}ed successfully.`,
            variant: action === 'Approve' ? 'default' : 'destructive'
        });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#f8fafc] p-6 space-y-6 text-start">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Team Leave Requests</h1>
                    <p className="text-slate-500 font-medium text-xs mt-2">Review and manage leave applications from your direct reports.</p>
                </div>
                <div className="flex gap-1.5 bg-slate-100/50 p-1 rounded-xl">
                    <Button
                        variant={view === 'pending' ? 'default' : 'ghost'}
                        className={`rounded-lg h-9 font-bold text-[10px] tracking-widest transition-all ${view === 'pending' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200/50'}`}
                        onClick={() => setView('pending')}
                    >
                        Pending Actions
                    </Button>
                    <Button
                        variant={view === 'history' ? 'default' : 'ghost'}
                        className={`rounded-lg h-9 font-bold text-[10px] tracking-widest transition-all ${view === 'history' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200/50'}`}
                        onClick={() => setView('history')}
                    >
                        History
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap gap-5">
                {stats.map((stat, i) => (
                    <motion.div key={i} className="min-w-[200px] flex-1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-sm rounded-2xl ${stat.color} p-4 flex items-center gap-3 border border-white/20 h-full`}>
                            <div className="h-10 w-10 bg-white/40 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-sm ring-1 ring-white/30">
                                {React.cloneElement(stat.icon as React.ReactElement, { size: 18 })}
                            </div>
                            <div>
                                <p className={`text-[10px] font-bold tracking-widest ${stat.textColor} opacity-60 mb-1`}>{stat.label}</p>
                                <h3 className={`text-xl font-bold ${stat.textColor} tracking-tight leading-none`}>{stat.value}</h3>
                            </div>
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
                        className="space-y-5"
                    >
                        <div className="bg-amber-100 p-6 rounded-[2rem] border border-amber-200 shadow-inner">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 ml-2">Inbox ({pendingLeaves.length})</h2>
                            {pendingLeaves.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {pendingLeaves.map((leave, i) => {
                                        const member = members.find(m => m.id === leave.empId);
                                        return (
                                            <Card key={leave.id} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-white p-6 group overflow-hidden relative border border-white/50">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                                <div className="flex items-start justify-between mb-6 relative z-10">
                                                    <div className="flex items-center gap-4 text-start">
                                                        <Avatar className="h-11 w-11 ring-2 ring-slate-50 shadow-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                                                            <AvatarFallback>{member?.avatar}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <h3 className="font-bold text-lg text-slate-900 leading-tight tracking-tight">{leave.empName}</h3>
                                                            <Badge className="bg-indigo-50 text-indigo-600 border-none font-bold text-[10px] tracking-widest px-3 py-1 mt-1.5 shadow-none rounded-lg">
                                                                {leave.type}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-2xl text-slate-900 leading-none">{leave.days}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1.5 opacity-60">Days</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-5 relative z-10">
                                                    <div className="p-4 bg-slate-50/50 rounded-2xl space-y-3 border border-slate-100/30 text-start">
                                                        <div className="flex items-center gap-3 text-slate-700 font-bold text-[13px]">
                                                            <Calendar size={14} className="text-indigo-500" />
                                                            <span>{new Date(leave.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — {new Date(leave.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <MessageSquare size={14} className="text-slate-400 mt-1 shrink-0" />
                                                            <p className="text-[13px] text-slate-500 font-bold leading-relaxed opacity-80">{leave.reason}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-3 mt-2">
                                                        <Button
                                                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl h-11 text-xs shadow-md border-none transition-all tracking-wide"
                                                            onClick={() => handleAction(leave.id, 'Approve')}
                                                        >
                                                            <Check className="mr-2 h-4 w-4" /> Approve
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            className="px-5 border-rose-100 text-rose-500 hover:bg-rose-50 font-bold rounded-xl h-11 border-none shadow-sm bg-rose-50/50"
                                                            onClick={() => handleAction(leave.id, 'Reject')}
                                                        >
                                                            <X className="h-5 w-5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            ) : (
                                <Card className="border-none shadow-sm rounded-3xl bg-white p-12 text-center border border-white/50">
                                    <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                        <CheckCircle2 className="text-emerald-500" size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">All Caught Up!</h3>
                                    <p className="text-slate-400 font-medium text-xs mt-2">No pending leave requests to review.</p>
                                </Card>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="history"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                    >
                        <div className="bg-indigo-100 p-6 rounded-[2rem] border border-indigo-200 shadow-inner">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 ml-2">Processed Requests</h2>
                            <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden border border-white/50">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-indigo-100/50">
                                                <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500">Employee</th>
                                                <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500">Type</th>
                                                <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500">Dates</th>
                                                <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 text-center">Days</th>
                                                <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-500 text-center">Status</th>
                                                <th className="px-6 py-4"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100/50">
                                            {processedLeaves.map((leave, i) => (
                                                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-9 w-9 ring-2 ring-slate-50 shadow-sm bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                                                                <AvatarFallback>{leave.empName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                            </Avatar>
                                                            <span className="font-bold text-slate-900 text-sm tracking-tight">{leave.empName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <Badge className="bg-slate-100 text-slate-600 border-none font-bold text-[10px] px-2 py-0.5 rounded-md shadow-none">
                                                            {leave.type}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="font-bold text-slate-700 text-xs">{new Date(leave.startDate).toLocaleDateString()}</span>
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">to {new Date(leave.endDate).toLocaleDateString()}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        <span className="font-bold text-slate-900 text-lg">{leave.days}</span>
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        <Badge className={`${leave.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} border-none font-bold px-3 py-1.5 rounded-lg text-[9px] tracking-widest shadow-none`}>
                                                            {leave.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity border-none">
                                                                    <MoreHorizontal size={14} className="text-slate-400" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="rounded-xl p-1.5 border-none shadow-xl bg-white min-w-[170px]">
                                                                <DropdownMenuItem className="font-bold text-[10px] tracking-widest py-2.5 rounded-lg cursor-pointer focus:bg-indigo-50" onClick={() => toast({ title: "Opening Details", description: `Viewing full application for ${leave.empName}` })}>
                                                                    View Application
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="font-bold text-[10px] tracking-widest py-2.5 rounded-lg cursor-pointer focus:bg-indigo-50" onClick={() => toast({ title: "Downloading", description: "Leave certificate is being generated." })}>
                                                                    Download Certificate
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeamLeavePage;
