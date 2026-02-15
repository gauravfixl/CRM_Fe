"use client"

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    Award,
    RotateCw,
    Activity as ActivityIcon
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select";
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

const performanceDistributionData = [
    { name: "Top Perf", value: 12, color: "#6366f1", detail: "Exceeding all KRAs" },
    { name: "On Track", value: 45, color: "#10b981", detail: "Meeting expectations" },
    { name: "Needs Focus", value: 8, color: "#f59e0b", detail: "Minor performance gaps" },
    { name: "Action Req", value: 2, color: "#ef4444", detail: "Immediate review needed" },
];

const reportHistory = [
    { id: "REP-902", name: "Q1 Performance Audit", date: "Jan 22, 2026", size: "2.4 MB", type: "PDF" },
    { id: "REP-899", name: "Attendance Variance", date: "Jan 15, 2026", size: "1.1 MB", type: "XLSX" },
    { id: "REP-854", name: "Leave Forecast Map", date: "Jan 10, 2026", size: "850 KB", type: "PDF" },
];

const TeamReportsPage = () => {
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [isExporting, setIsExporting] = useState(false);
    const [timeRange, setTimeRange] = useState("Last 30 Days");
    const [activeChartTab, setActiveChartTab] = useState("attendance");
    const [chartData, setChartData] = useState([
        { name: "Mon", present: 32, late: 2, tasks: 120 },
        { name: "Tue", present: 30, late: 4, tasks: 145 },
        { name: "Wed", present: 33, late: 1, tasks: 132 },
        { name: "Thu", present: 28, late: 6, tasks: 110 },
        { name: "Fri", present: 31, late: 3, tasks: 156 },
    ]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleGlobalExport = () => {
        setIsExporting(true);
        setExportProgress(0);

        const interval = setInterval(() => {
            setExportProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIsExporting(false);
                        toast({
                            title: "Export Success",
                            description: "Global team data has been compiled into 'Team_Vault_2026.zip'",
                        });
                    }, 500);
                    return 100;
                }
                return prev + 5;
            });
        }, 150);
    };

    const refreshData = (range: string) => {
        setIsLoading(true);
        setTimeRange(range);

        // Simulate real data fetching
        setTimeout(() => {
            const newData = chartData.map(d => ({
                ...d,
                present: Math.floor(Math.random() * 10) + 25,
                late: Math.floor(Math.random() * 8),
                tasks: Math.floor(Math.random() * 50) + 100
            }));
            setChartData(newData);
            setIsLoading(false);
            toast({
                title: "Data Updated",
                description: `Reports now reflect data for ${range}.`,
            });
        }, 800);
    };

    if (!mounted) return null;

    return (
        <div className="flex-1 space-y-6 p-6 bg-[#f8fafc] min-h-screen text-start">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-slate-900 leading-none">Analytics Hub</h1>
                    <p className="text-slate-500 font-bold text-xs mt-2 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        Live data synchronization active • Secure Team Vault v4.0
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={timeRange} onValueChange={refreshData}>
                        <SelectTrigger className="w-[160px] h-12 rounded-2xl border-none shadow-sm font-bold text-xs bg-white text-slate-600">
                            <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                            <SelectValue placeholder="Time Range" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-none shadow-2xl rounded-2xl p-2 z-[99]">
                            {["Last 7 Days", "Last 30 Days", "Quarter to Date", "Year to Date"].map(r => (
                                <SelectItem key={r} value={r} className="font-bold text-xs py-3 rounded-xl focus:bg-indigo-50">{r}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        disabled={isExporting}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 px-6 font-black text-[10px] tracking-widest shadow-xl shadow-indigo-200 border-none transition-all active:scale-95 uppercase"
                        onClick={handleGlobalExport}
                    >
                        {isExporting ? <RotateCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                        {isExporting ? `Processing ${exportProgress}%` : "Global Export"}
                    </Button>
                </div>
            </div>

            {/* Insight Stats Grid */}
            <div className="flex flex-wrap gap-5">
                {[
                    { label: "Attendance Compliance", val: "94.2%", drift: "+1.2%", status: "up", sub: "vs Last Week", icon: <ActivityIcon className="text-indigo-600" />, color: "bg-indigo-100" },
                    { label: "Task Velocity", val: "8.5 pts", drift: "+0.4", status: "up", sub: "Avg per dev", icon: <Zap className="text-amber-600" />, color: "bg-amber-100" },
                    { label: "Attrition Rate", val: "2.1%", drift: "-0.5%", status: "down", sub: "Current Quarter", icon: <Users className="text-rose-600" />, color: "bg-rose-100" },
                    { label: "Team Wellness", val: "4.8/5", drift: "Stable", status: "none", sub: "From Pulse Poll", icon: <Award className="text-emerald-600" />, color: "bg-emerald-100" }
                ].map((s, i) => (
                    <motion.div key={i} className="min-w-[240px] flex-1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-sm rounded-2xl ${s.color} p-5 flex items-center gap-4 border border-white/20 h-full`}>
                            <div className="h-11 w-11 bg-white/60 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-sm ring-1 ring-white/30">
                                {React.cloneElement(s.icon as React.ReactElement, { size: 20 })}
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">{s.label}</p>
                                <div className="flex items-center gap-2">
                                    <h4 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{s.val}</h4>
                                    <span className={`text-[10px] font-bold ${s.status === 'up' ? 'text-emerald-600' : s.status === 'down' ? 'text-rose-600' : 'text-slate-400'}`}>
                                        {s.drift}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Interactive Chart Section */}
                <Card className="lg:col-span-8 border-none shadow-sm bg-white rounded-[2.5rem] border border-slate-100/50 overflow-hidden">
                    <div className="p-8 pb-0">
                        <div className="flex justify-between items-start mb-8">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-black tracking-tight text-slate-900">Dynamic Trend Analysis</CardTitle>
                                <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest">Team Performance & Compliance Matrix</CardDescription>
                            </div>
                            <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl shadow-inner">
                                <Button
                                    onClick={() => setActiveChartTab("attendance")}
                                    className={`h-9 px-4 rounded-xl font-bold text-[10px] tracking-widest uppercase transition-all border-none ${activeChartTab === 'attendance' ? 'bg-white shadow-md text-indigo-600' : 'bg-transparent text-slate-400 hover:text-slate-600'}`}
                                >
                                    Attendance
                                </Button>
                                <Button
                                    onClick={() => setActiveChartTab("tasks")}
                                    className={`h-9 px-4 rounded-xl font-bold text-[10px] tracking-widest uppercase transition-all border-none ${activeChartTab === 'tasks' ? 'bg-white shadow-md text-indigo-600' : 'bg-transparent text-slate-400 hover:text-slate-600'}`}
                                >
                                    Task Velocity
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 pb-8 relative">
                        <AnimatePresence mode="wait">
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-[2.5rem]"
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <RotateCw className="h-8 w-8 text-indigo-600 animate-spin" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Recalculating...</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={activeChartTab === 'attendance' ? "#6366f1" : "#8b5cf6"} stopOpacity={0.15} />
                                            <stop offset="95%" stopColor={activeChartTab === 'attendance' ? "#6366f1" : "#8b5cf6"} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        fontSize={10}
                                        stroke="#94a3b8"
                                        tickLine={false}
                                        axisLine={false}
                                        fontFamily="inherit"
                                        fontWeight="bold"
                                        dy={10}
                                    />
                                    <YAxis
                                        fontSize={10}
                                        stroke="#94a3b8"
                                        tickLine={false}
                                        axisLine={false}
                                        fontFamily="inherit"
                                        fontWeight="bold"
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '1.5rem',
                                            border: 'none',
                                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                                            fontSize: '11px',
                                            fontWeight: '900',
                                            padding: '12px 16px'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey={activeChartTab === 'attendance' ? "present" : "tasks"}
                                        stroke={activeChartTab === 'attendance' ? "#6366f1" : "#8b5cf6"}
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorMain)"
                                        animationDuration={1500}
                                    />
                                    {activeChartTab === 'attendance' && (
                                        <Area type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={2} fill="transparent" strokeDasharray="6 6" animationDuration={2000} />
                                    )}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>

                {/* Rating Distribution Bar Chart */}
                <Card className="lg:col-span-4 border-none shadow-sm p-8 bg-white rounded-[2.5rem] border border-slate-100/50">
                    <div className="space-y-1 mb-8 text-start">
                        <CardTitle className="text-xl font-black tracking-tight text-slate-900">Performance Mix</CardTitle>
                        <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team Rating Distribution</CardDescription>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceDistributionData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    fontSize={10}
                                    stroke="#64748b"
                                    tickLine={false}
                                    axisLine={false}
                                    width={80}
                                    fontWeight="900"
                                />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9', radius: 12 }}
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24}>
                                    {performanceDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-50 space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span>Primary KPI</span>
                            <span className="text-indigo-600">92% Target</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "88%" }}
                                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
                            />
                        </div>
                    </div>
                </Card>

                {/* Report Download Grid */}
                <div className="lg:col-span-12 space-y-6">
                    <div className="flex justify-between items-end px-1">
                        <div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none">Download Center</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Generate on-demand compliance files</p>
                        </div>
                        <Button variant="ghost" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-white">View Vault History</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: "Attendance Insights", type: "PDF Bundle", desc: "Heatmaps & clock-in variance logs.", icon: <Clock />, color: "text-indigo-600", bg: "bg-indigo-50" },
                            { title: "Strategy Alignment", type: "XLSX Ledger", desc: "Goal progress and milestone audits.", icon: <Target />, color: "text-rose-600", bg: "bg-rose-50" },
                            { title: "Leave Forecasts", type: "Visual Map", desc: "Upcoming absence clusters and risks.", icon: <FileText />, color: "text-emerald-600", bg: "bg-emerald-50" }
                        ].map((doc, i) => (
                            <Card key={i} className="group border-none shadow-sm hover:shadow-2xl hover:translate-y-[-4px] transition-all bg-white rounded-[2rem] border border-slate-100/50 overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-6 flex items-center gap-5">
                                        <div className={`h-14 w-14 ${doc.bg} ${doc.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 shadow-inner`}>
                                            {React.cloneElement(doc.icon as React.ReactElement, { size: 24 })}
                                        </div>
                                        <div className="flex-1 text-start">
                                            <h4 className="text-sm font-black text-slate-800 leading-tight tracking-tight">{doc.title}</h4>
                                            <p className="text-[10px] font-black text-slate-400 uppercase mt-1.5 tracking-widest">{doc.type}</p>
                                        </div>
                                    </div>
                                    <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center group-hover:bg-white transition-colors">
                                        <p className="text-[10px] font-bold text-slate-400 leading-tight pr-4">{doc.desc}</p>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 bg-white rounded-xl shadow-sm text-slate-400 hover:text-indigo-600 hover:shadow-md transition-all border border-slate-100"
                                            onClick={() => toast({ title: "Generating Asset", description: `${doc.title} is being synchronized...` })}
                                        >
                                            <Download size={16} />
                                        </Button>
                                    </div>
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
