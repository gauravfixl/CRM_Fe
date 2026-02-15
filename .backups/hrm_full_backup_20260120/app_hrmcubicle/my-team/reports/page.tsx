"use client"

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    PieChart,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Calendar,
    Filter,
    Users,
    Clock,
    FileText,
    Zap,
    Target,
    Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from "recharts";
import { useToast } from "@/shared/components/ui/use-toast";

const attendanceOverview = [
    { name: "Mon", present: 32, late: 2 },
    { name: "Tue", present: 30, late: 4 },
    { name: "Wed", present: 33, late: 1 },
    { name: "Thu", present: 28, late: 6 },
    { name: "Fri", present: 31, late: 3 },
];

const performanceDistribution = [
    { name: "Top Perf", value: 12, color: "#6366f1" },
    { name: "On Track", value: 45, color: "#10b981" },
    { name: "Needs Focus", value: 8, color: "#f59e0b" },
    { name: "Action Req", value: 2, color: "#ef4444" },
];

const TeamReportsPage = () => {
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-[#fcfdff] min-h-screen text-start">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Analytics & Insights</h1>
                    <p className="text-slate-500 font-medium">Data-driven performance and compliance reports for your team.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-xl border-slate-200">
                        <Calendar className="h-4 w-4 mr-2" /> Last 30 Days
                    </Button>
                    <Button className="bg-[#1e293b] hover:bg-slate-900 text-white rounded-xl font-bold shadow-lg">
                        <Download className="h-4 w-4 mr-2" /> Global Export
                    </Button>
                </div>
            </div>

            {/* Insight Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Attendance Compliance", val: "94.2%", drift: "+1.2%", status: "up", sub: "vs Last Week" },
                    { label: "Task Velocity", val: "8.5 pts", drift: "+0.4", status: "up", sub: "Avg per dev" },
                    { label: "Attrition Rate", val: "2.1%", drift: "-0.5%", status: "down", sub: "Current Quarter" },
                    { label: "Team Wellness", val: "4.8/5", drift: "Stable", status: "none", sub: "From Pulse Poll" }
                ].map((s, i) => (
                    <Card key={i} className="border-none shadow-sm">
                        <CardContent className="p-6 space-y-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <div className="flex items-end justify-between">
                                <h4 className="text-3xl font-black text-slate-900">{s.val}</h4>
                                <div className={`flex items-center gap-1 text-[11px] font-black ${s.status === 'up' ? 'text-emerald-600' : s.status === 'down' ? 'text-rose-600' : 'text-slate-400'}`}>
                                    {s.status === 'up' ? <TrendingUp size={14} /> : s.status === 'down' ? <TrendingUp size={14} className="rotate-180" /> : null}
                                    {s.drift}
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium italic">{s.sub}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Attendance Trend Chart */}
                <Card className="lg:col-span-8 border-none shadow-sm p-8 bg-white">
                    <div className="flex justify-between items-start mb-8 text-start">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-black">Attendance & Compliance Trend</CardTitle>
                            <CardDescription className="text-xs">Visualizing team's physical and remote presence.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Badge className="bg-indigo-50 text-indigo-600 border-none font-bold">PRESENT</Badge>
                            <Badge className="bg-amber-50 text-amber-600 border-none font-bold">LATE</Badge>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={attendanceOverview}>
                                <defs>
                                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} />
                                <YAxis fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="present" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorPresent)" />
                                <Area type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={3} fill="transparent" strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Rating Distribution Bar Chart */}
                <Card className="lg:col-span-4 border-none shadow-sm p-8 bg-white">
                    <div className="space-y-1 mb-8 text-start">
                        <CardTitle className="text-xl font-black">Performance Mix</CardTitle>
                        <CardDescription className="text-xs">Rating distribution of your current team.</CardDescription>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceDistribution} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    fontSize={10}
                                    stroke="#475569"
                                    tickLine={false}
                                    axisLine={false}
                                    width={80}
                                    fontWeight="bold"
                                />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                                    {performanceDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Report Download Grid */}
                <div className="lg:col-span-12 space-y-6">
                    <h3 className="text-xl font-black text-slate-800">Quick Download Center</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: "Monthly Attendance Summary", type: "PDF/CSV", desc: "Detailed breakdown of daily swipes.", icon: <Clock /> },
                            { title: "Quarterly Goal Report", type: "XLSX", desc: "OKR and KRA progress of each member.", icon: <Target /> },
                            { title: "Leave Utilization Report", type: "PDF", desc: "Analyze team's time-off patterns.", icon: <FileText /> }
                        ].map((doc, i) => (
                            <Card key={i} className="border-none shadow-sm hover:translate-y-[-4px] transition-all cursor-pointer group bg-white">
                                <CardContent className="p-6 flex items-center gap-5">
                                    <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                                        {React.cloneElement(doc.icon as React.ReactElement, { size: 24 })}
                                    </div>
                                    <div className="flex-1 text-start">
                                        <h4 className="text-sm font-black text-slate-900 leading-tight">{doc.title}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{doc.type}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="group-hover:text-indigo-600"><Download size={18} /></Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TeamReportsPage;
