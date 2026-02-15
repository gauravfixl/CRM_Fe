"use client"

import React from "react";
import {
    LayoutDashboard,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    Users,
    TrendingUp,
    BarChart3,
    ArrowDownRight,
    Inbox,
    History,
    ChevronRight,
    Activity
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useHelpdeskStore } from "@/shared/data/helpdesk-store";
import { motion } from "framer-motion";

const HelpdeskDashboard = () => {
    const { tickets, agents } = useHelpdeskStore();

    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === "Open").length,
        inProgress: tickets.filter(t => t.status === "In Progress").length,
        resolved: tickets.filter(t => t.status === "Resolved" || t.status === "Closed").length,
        breached: tickets.filter(t => t.slaStatus === "Breached" && t.status !== "Closed").length,
        warning: tickets.filter(t => t.slaStatus === "Warning" && t.status !== "Closed").length
    };

    const categories = ["Payroll", "Leave", "IT Support", "Admin", "HR Ops"];
    const categoryStats = categories.map(cat => ({
        name: cat,
        count: tickets.filter(t => t.category === cat).length
    }));

    const recentActivity = tickets.slice(0, 5);

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                        <LayoutDashboard size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 leading-tight tracking-tight">Support Metrics</h1>
                        <p className="text-sm font-medium text-slate-500">Real-time operational overview</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-200 text-slate-600 font-bold px-4 gap-2 text-xs uppercase tracking-widest bg-white hover:bg-slate-50">
                        <History size={16} /> History
                    </Button>
                    <Button className="h-10 bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 gap-2 text-xs uppercase tracking-widest shadow-lg shadow-rose-200">
                        <TrendingUp size={16} /> Export Intel
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-8 space-y-8">
                    {/* Primary Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Incoming Queue", val: stats.open, sub: "Action Required", icon: Inbox, color: "text-indigo-600", bg: "bg-indigo-50" },
                            { label: "Active Resolve", val: stats.inProgress, sub: "Work in Progress", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                            { label: "Success Rate", val: `${Math.round((stats.resolved / stats.total) * 100)}%`, sub: "Closed vs Total", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                            { label: "SLA Breaches", val: stats.breached, sub: "Critical Attention", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
                        ].map((stat, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-xl transition-all duration-300">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                                <h2 className={`text-2xl font-bold ${stat.color}`}>{stat.val}</h2>
                                                <p className="text-[11px] font-bold text-slate-400">{stat.sub}</p>
                                            </div>
                                            <div className={`h-11 w-11 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <stat.icon size={22} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* SLA Compliance Section */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Activity size={14} className="text-rose-500" /> Operational Health
                                </h3>
                                <Badge variant="outline" className="text-[10px] font-bold border-slate-200 text-slate-500 uppercase">Live Update</Badge>
                            </div>

                            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-slate-100">
                                        {[
                                            { label: "Healthy", val: stats.total - stats.breached - stats.warning, color: "bg-emerald-500" },
                                            { label: "Warning", val: stats.warning, color: "bg-amber-500" },
                                            { label: "Breached", val: stats.breached, color: "bg-rose-500" },
                                            { label: "Efficiency", val: "94%", color: "bg-indigo-500" }
                                        ].map((item, i) => (
                                            <div key={i} className="p-6 border-r border-slate-100 last:border-r-0 text-center">
                                                <div className={`h-1 w-8 ${item.color} rounded-full mx-auto mb-3`} />
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{item.label}</p>
                                                <h4 className="text-lg font-bold text-slate-900">{item.val}</h4>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-8">
                                        <div className="flex justify-between items-end mb-6">
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-800">SLA Breach Variance</h4>
                                                <p className="text-xs font-medium text-slate-500">Weekly performance compared to previous cycle</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                                                <ArrowUpRight size={16} /> 12% increase
                                            </div>
                                        </div>
                                        <div className="h-32 flex items-end justify-between gap-1">
                                            {[40, 65, 30, 85, 45, 90, 60, 75, 55, 80, 50, 65].map((val, i) => (
                                                <div key={i} className="flex-1 group relative">
                                                    <div
                                                        className="bg-slate-100 group-hover:bg-rose-500 transition-all rounded-t-sm w-full cursor-pointer"
                                                        style={{ height: `${val}%` }}
                                                    />
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                        {val} Tickets
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between mt-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                            <span>Mon</span>
                                            <span>Tue</span>
                                            <span>Wed</span>
                                            <span>Thu</span>
                                            <span>Fri</span>
                                            <span>Sat</span>
                                            <span>Sun</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Ticket Categories & Agents Workload */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border-slate-200 shadow-sm bg-white">
                                    <CardContent className="p-6">
                                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <BarChart3 size={14} className="text-indigo-500" /> Volume by Category
                                        </h4>
                                        <div className="space-y-4">
                                            {categoryStats.map((cat, i) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                                                        <span>{cat.name}</span>
                                                        <span>{cat.count}</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-indigo-500 transition-all duration-1000"
                                                            style={{ width: `${(cat.count / stats.total) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-200 shadow-sm bg-white">
                                    <CardContent className="p-6">
                                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <Users size={14} className="text-emerald-500" /> Agent Workload
                                        </h4>
                                        <div className="space-y-4">
                                            {agents.slice(0, 4).map((agent, i) => (
                                                <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                                            {agent.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold text-slate-800 leading-none">{agent.name}</span>
                                                            <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase leading-none">{agent.assignedQueues[0]}</span>
                                                        </div>
                                                    </div>
                                                    <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] h-5 px-2">
                                                        {agent.status}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Recent Activity Sidebar */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <History size={14} className="text-indigo-500" /> Real-time Feed
                                </h3>
                                <button className="text-[10px] font-bold text-indigo-600 uppercase">View All</button>
                            </div>

                            <div className="space-y-3">
                                {recentActivity.map((tkt, i) => (
                                    <div key={i} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${tkt.priority === 'High' ? 'bg-rose-500' : tkt.priority === 'Medium' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="outline" className="text-[8px] font-extrabold border-slate-100 text-slate-400 uppercase px-1.5 h-4 tracking-tighter shadow-none">{tkt.id}</Badge>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase">{new Date(tkt.createdAt).getHours()}:{new Date(tkt.createdAt).getMinutes()} AM</span>
                                        </div>
                                        <h5 className="text-[13px] font-bold text-slate-800 leading-tight mb-2 group-hover:text-rose-600 transition-colors uppercase">{tkt.subject}</h5>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="h-5 w-5 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400">
                                                    {tkt.requestedBy.name[0]}
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500">{tkt.requestedBy.name}</span>
                                            </div>
                                            <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Card className="bg-slate-900 border-none rounded-3xl p-6 text-white relative overflow-hidden mt-8">
                                <div className="relative z-10 space-y-4">
                                    <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-rose-400">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold mb-1">Critical Escalations</h4>
                                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">3 tickets have bypassed local resolution and require admin override.</p>
                                    </div>
                                    <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold text-[10px] uppercase tracking-widest h-9">
                                        Intervene Now
                                    </Button>
                                </div>
                                <div className="absolute -right-6 -bottom-6 opacity-10">
                                    <AlertCircle size={100} />
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

export default HelpdeskDashboard;
