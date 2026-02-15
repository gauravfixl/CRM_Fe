"use client"

import React, { useState, useMemo } from "react";
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    Clock,
    Users,
    CheckCircle2,
    AlertCircle,
    Download,
    Filter,
    Search,
    ChevronDown,
    MoreHorizontal,
    Inbox,
    Target,
    Activity,
    History,
    FileBarChart,
    BrainCircuit,
    Star
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useHelpdeskStore } from "@/shared/data/helpdesk-store";
import { motion } from "framer-motion";

const HelpdeskReportsPage = () => {
    const { tickets, agents } = useHelpdeskStore();
    const [timeRange, setTimeRange] = useState("30");

    const stats = useMemo(() => ({
        totalResolved: tickets.filter(t => t.status === "Resolved" || t.status === "Closed").length,
        avgSlaCompliance: 94.2,
        firstResponseTime: "1.2h",
        resolutionTime: "4.8h",
        csatScore: 4.85
    }), [tickets]);

    const categoryData = [
        { name: "Payroll", count: 124, trend: "+12%" },
        { name: "IT Help", count: 88, trend: "-5%" },
        { name: "HR Policies", count: 210, trend: "+24%" },
        { name: "Facility", count: 45, trend: "+2%" },
    ];

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <BarChart3 size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 leading-tight tracking-tight uppercase">Analytical Intelligence</h1>
                        <p className="text-sm font-medium text-slate-500">Executive decision support & trends</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="h-10 w-48 border-slate-200 font-bold text-xs uppercase tracking-widest bg-white shadow-sm rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100">
                            <SelectItem value="7">Last 7 Days</SelectItem>
                            <SelectItem value="30">Last 30 Days</SelectItem>
                            <SelectItem value="90">Last Quarter</SelectItem>
                            <SelectItem value="365">Full Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 gap-2 text-xs uppercase tracking-widest shadow-lg shadow-slate-200 rounded-xl transition-all">
                        <Download size={16} /> Export Intelligence
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-8 space-y-8 pb-12">
                    {/* Top Level KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[
                            { label: "SLA Compliance", val: "94.2%", trend: "+2.1%", icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
                            { label: "Avg Resolution", val: "4.8h", trend: "-1.5h", icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50" },
                            { label: "Resolved Vol", val: "1,240", trend: "+340", icon: CheckCircle2, color: "text-amber-600", bg: "bg-amber-50" },
                            { label: "Customer SAT", val: "4.8/5", trend: "+0.2", icon: Star, color: "text-rose-600", bg: "bg-rose-50" },
                            { label: "Agent Efficiency", val: "88%", trend: "+12%", icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
                        ].map((stat, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                                <Card className="border-none shadow-sm bg-white hover:shadow-xl transition-all group rounded-2xl">
                                    <CardContent className="p-6">
                                        <div className={`h-10 w-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <stat.icon size={20} />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{stat.label}</span>
                                            <span className="text-2xl font-black text-slate-900 leading-none">{stat.val}</span>
                                            <div className={`flex items-center gap-1 text-[10px] font-bold mt-1 ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {stat.trend.startsWith('+') ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                                {stat.trend} VS LY
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Trend Visualization */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden rounded-3xl">
                                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                            <TrendingUp size={16} className="text-indigo-600" /> Resolution Velocity Trend
                                        </h3>
                                        <p className="text-xs font-medium text-slate-500 mt-1">Daily analysis of ticket throughput</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase">
                                            High Perf
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-8">
                                    <div className="h-[280px] flex items-end justify-between gap-1.5 relative">
                                        {/* Grid Lines */}
                                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 py-1">
                                            {[0, 1, 2, 3, 4].map(l => <div key={l} className="w-full h-px bg-slate-300 border-dashed" />)}
                                        </div>

                                        {[40, 65, 30, 85, 45, 90, 60, 75, 55, 80, 50, 65, 40, 60, 85, 95, 70, 50, 60, 45, 80, 55, 60, 40, 90, 85, 45, 30, 60, 75].map((val, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${val}%` }}
                                                transition={{ delay: i * 0.02, type: 'spring' }}
                                                className="flex-1 relative group"
                                            >
                                                <div className={`w-full rounded-t-sm transition-all duration-300 ${i > 20 ? 'bg-indigo-600' : 'bg-slate-100 group-hover:bg-slate-200'
                                                    }`} />
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl">
                                                    {val} RESOLVED
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-6 px-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Week 01</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Week 02</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-indigo-600 underline underline-offset-4">Today</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="border-slate-200 shadow-sm bg-white rounded-3xl overflow-hidden self-start">
                                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <PieChart size={14} className="text-amber-500" /> Issue Distribution
                                        </h4>
                                        <MoreHorizontal size={14} className="text-slate-300" />
                                    </div>
                                    <CardContent className="p-8 space-y-6">
                                        <div className="flex items-center justify-center py-4 relative">
                                            <div className="h-40 w-40 rounded-full border-[18px] border-emerald-500 border-t-indigo-500 border-r-amber-400 border-l-rose-500 rotate-45 group-hover:scale-105 transition-transform duration-700" />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-lg font-black text-slate-900 leading-none">1.2K</span>
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Tickets</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 pt-4">
                                            {[
                                                { name: "Payroll", val: "35%", color: "bg-indigo-500" },
                                                { name: "IT Tech", val: "25%", color: "bg-emerald-500" },
                                                { name: "HR Ops", val: "20%", color: "bg-amber-400" },
                                                { name: "Admin", val: "20%", color: "bg-rose-500" }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`h-2 w-2 rounded-full ${item.color}`} />
                                                        <span className="text-[11px] font-bold text-slate-600">{item.name}</span>
                                                    </div>
                                                    <span className="text-[11px] font-black text-slate-900">{item.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-200 shadow-sm bg-white rounded-3xl overflow-hidden self-start">
                                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Users size={14} className="text-emerald-500" /> High Performance Agents
                                        </h4>
                                        <button className="text-[10px] font-bold text-indigo-600 uppercase">View All</button>
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {agents.sort((a, b) => b.csatScore - a.csatScore).slice(0, 5).map((agent, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-xl shadow-slate-200">
                                                            {agent.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[11px] font-bold text-slate-800 leading-none">{agent.name}</span>
                                                            <div className="flex items-center gap-1.5 mt-1.5">
                                                                <Star size={10} className="fill-amber-400 text-amber-400" />
                                                                <span className="text-[10px] font-black text-slate-500 uppercase">{agent.csatScore} Rating</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[10px] font-black text-emerald-600 block">{agent.ticketsResolved}</span>
                                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Yield</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Analytics Sidebar */}
                        <div className="space-y-8">
                            <Card className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden group shadow-2xl">
                                <div className="relative z-10 space-y-6">
                                    <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400">
                                        <BrainCircuit size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black tracking-tight uppercase leading-none mb-2">Automated Insights</h4>
                                        <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                                            "Ticket volume for **Payroll** is likely to spike by **18%** next Tuesday based on previous monthly patterns."
                                        </p>
                                    </div>
                                    <Button className="w-full h-11 bg-white text-slate-900 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-400 hover:text-white transition-all gap-2">
                                        Deploy Mitigation <ArrowUpRight size={14} />
                                    </Button>
                                </div>
                                <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                    <TrendingUp size={160} />
                                </div>
                            </Card>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
                                    <AlertCircle size={14} className="text-rose-500" /> SLA Breach Variance
                                </h4>
                                <div className="space-y-3">
                                    {categoryData.map((cat, i) => (
                                        <div key={i} className="p-5 bg-white border border-slate-200 rounded-3xl group hover:border-indigo-100 transition-all cursor-pointer">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{cat.name}</span>
                                                <Badge className={`${cat.trend.startsWith('+') ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'} border-none font-bold text-[9px] h-5`}>{cat.trend}</Badge>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full ${cat.trend.startsWith('+') ? 'bg-rose-500' : 'bg-emerald-500'} w-[${40 + (i * 15)}%]`} />
                                            </div>
                                            <div className="flex justify-between mt-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                <span>{cat.count} Tickets</span>
                                                <span>SLA 94%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-[28px] border-dashed text-center space-y-4">
                                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center mx-auto text-indigo-600 border border-indigo-100 shadow-sm">
                                    <FileBarChart size={20} />
                                </div>
                                <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Monthly Ops Summary</h5>
                                <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic px-4">Generate a full PDF report of this month's support performance for the CEO's review.</p>
                                <Button variant="outline" className="h-9 w-full rounded-xl border-indigo-200 text-indigo-600 text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Generate Summary</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

export default HelpdeskReportsPage;
