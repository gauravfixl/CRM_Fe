"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    TrendingUp,
    PieChart,
    Download,
    Calendar,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Target,
    Users,
    Activity,
    ShieldCheck,
    Zap,
    History,
    FilePieChart,
    LineChart,
    Search,
    ChevronDown,
    MoreHorizontal
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

const ReportsPage = () => {
    const [timeRange, setTimeRange] = useState("Year 2026");

    const highlights = [
        { label: "Org Velocity", value: "+18%", trend: "up", desc: "Performance improvement vs last quarter", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Alignment", value: "94%", trend: "up", desc: "Employee goals aligned with 2026 strategy", icon: Target, color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Participation", value: "87%", trend: "down", desc: "Feedback engagement rate (Target: 95%)", icon: Users, color: "text-rose-600", bg: "bg-rose-50" },
        { label: "Top Quartile", value: "22%", trend: "up", desc: "Employees exceeding expectations", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    const chartSections = [
        { title: "Competency Heatmap", type: "Radar Audit", icon: FilePieChart, value: "88% Avg Mastery" },
        { title: "Review Completion", type: "Fulfillment Track", icon: LineChart, value: "92% On Time" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans" style={{ zoom: "80%" }}>
            <header className="py-2.5 px-8 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm rounded-b-3xl">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1 text-start">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Performance Analytics</h1>
                            <Badge className="bg-slate-900 text-white border-none font-bold text-[10px] tracking-widest h-6 px-3">Master Insights</Badge>
                        </div>
                        <p className="text-slate-500 text-sm font-semibold">Data-driven analysis of organizational growth, talent velocity, and objective execution.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="h-11 w-48 rounded-xl bg-white border-slate-100 font-bold text-[10px] tracking-widest shadow-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none shadow-2xl p-1.5 font-bold text-[10px]">
                                <SelectItem value="Year 2026" className="rounded-lg h-10 tracking-wide">Current Year (2026)</SelectItem>
                                <SelectItem value="Q4 2025" className="rounded-lg h-10 tracking-wide">Fourth Quarter 2025</SelectItem>
                                <SelectItem value="Full 2025" className="rounded-lg h-10 tracking-wide">Annual Report 2025</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100 transition-all gap-2 text-[10px] tracking-widest border-none">
                            <Download size={16} /> Export Full PDF
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-8 max-w-[1600px] mx-auto w-full space-y-8">
                {/* Data Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {highlights.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="border border-slate-100 shadow-sm rounded-3xl bg-white group hover:shadow-xl hover:-translate-y-1 transition-all text-start overflow-hidden">
                                <CardContent className="p-7 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className={`h-11 w-11 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner`}>
                                            <item.icon size={20} />
                                        </div>
                                        <div className={`flex items-center gap-1 font-black text-[9px] tracking-widest ${item.trend === 'up' ? 'text-emerald-600' : 'text-rose-500'}`}>
                                            {item.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                            {item.trend === 'up' ? 'Gaining' : 'Reduced'}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 tracking-widest">{item.label}</p>
                                        <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none tabular-nums">{item.value}</h3>
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-bold leading-relaxed tracking-tighter italic">{item.desc}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Large Chart Placeholder Section */}
                    <div className="lg:col-span-2 space-y-8 text-start">
                        <Card className="rounded-[2.5rem] border border-slate-100 shadow-sm bg-white overflow-hidden relative group p-0 text-start">
                            <CardContent className="p-8 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                                            <BarChart3 className="text-indigo-600" size={24} /> Growth Narrative
                                        </h2>
                                        <p className="text-slate-400 text-[10px] font-bold tracking-widest">Aggregate performance across department verticals</p>
                                    </div>
                                    <Button variant="ghost" className="h-9 w-9 rounded-xl hover:bg-slate-50 text-slate-300 transition-colors"><MoreHorizontal size={18} /></Button>
                                </div>

                                <div className="aspect-[16/9] w-full bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-12 transition-all hover:bg-slate-50 group/chart">
                                    <div className="h-20 w-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 ring-1 ring-slate-100 group-hover/chart:scale-110 transition-transform">
                                        <Activity className="text-indigo-600 animate-pulse" size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Real-time Visualization</h3>
                                    <p className="text-slate-500 text-sm font-semibold mt-1 text-center max-w-sm italic">Connecting live data points from appraisals, audits, and completions.</p>
                                    <div className="mt-10 flex gap-3 w-full max-w-md h-32 items-end">
                                        {[1, 2, 3, 4, 5, 6].map(i => (
                                            <div key={i} className="flex-1 space-y-2 flex flex-col items-center">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${20 + i * 15}%` }}
                                                    transition={{ delay: 0.5 + i * 0.1, duration: 1.5, ease: "easeOut" }}
                                                    className="w-full bg-indigo-500/20 rounded-lg group-hover:bg-indigo-600/40 transition-colors relative overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent" />
                                                </motion.div>
                                                <span className="text-[8px] font-black text-slate-300 tracking-tighter">P-{i}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-slate-50">
                                    {['Engineering', 'Design', 'Marketing', 'Sales'].map((dep, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-[9px] font-bold text-slate-400 tracking-widest leading-none">
                                                <span>{dep}</span>
                                                <span className="text-indigo-600 font-black">88%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner font-bold">
                                                <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: '88%' }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Report Widgets Sidebar */}
                    <div className="space-y-8 text-start">
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl space-y-8">
                            <div className="relative z-10 space-y-6">
                                <div className="space-y-4">
                                    <div className="h-11 w-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-110">
                                        <PieChart size={22} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-bold tracking-tight leading-tight">Talent Density</h3>
                                        <p className="text-slate-400 text-xs font-semibold leading-relaxed">Distribution of talent bucketed by performance metrics.</p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    {[
                                        { label: "High Performers", val: "22%", color: "bg-emerald-500" },
                                        { label: "Solid Contributors", val: "65%", color: "bg-indigo-500" },
                                        { label: "Needs Support", val: "13%", color: "bg-rose-500" },
                                    ].map((row, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-black tracking-widest leading-none">
                                                <span className="text-slate-500">{row.label}</span>
                                                <span>{row.val}</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                                <div className={`h-full ${row.color} rounded-full`} style={{ width: row.val }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 rounded-xl h-11 font-bold text-[10px] tracking-widest transition-all border-none">View Demographics</Button>
                            </div>
                            <div className="absolute -bottom-20 -right-20 h-64 w-64 bg-indigo-600/10 rounded-full blur-3xl opacity-50" />
                        </div>

                        {/* Recent Activity Log Preview */}
                        <Card className="rounded-[2.5rem] border border-slate-100 shadow-sm bg-white p-8 space-y-6 overflow-hidden text-start">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-bold text-slate-400 tracking-widest flex items-center gap-2 italic">
                                    <History size={14} className="text-slate-200" /> Audit Trail
                                </h4>
                                <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-[8px] h-5 px-2 rounded-md">Live Feed</Badge>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { msg: "Annual Report 2025 generated", date: "2h ago", dep: "System" },
                                    { msg: "Sales Q4 stats uploaded", date: "5h ago", dep: "Sales" },
                                    { msg: "Audit trail cleanup", date: "1d ago", dep: "Admin" },
                                ].map((log, i) => (
                                    <div key={i} className="flex gap-4 group cursor-pointer">
                                        <div className="w-0.5 bg-slate-100 group-hover:bg-indigo-300 transition-colors relative">
                                            <div className="absolute top-0 -left-[3px] h-2 w-2 rounded-full bg-slate-200 group-hover:bg-indigo-500 transition-colors" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-900 truncate tracking-tight group-hover:text-indigo-600 transition-colors">{log.msg}</p>
                                            <p className="text-[9px] text-slate-400 font-bold tracking-tighter italic">{log.date} · {log.dep}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="link" className="text-indigo-600 font-bold text-[10px] p-0 h-auto hover:no-underline hover:text-slate-900 tracking-widest">Download Detailed Log</Button>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReportsPage;
