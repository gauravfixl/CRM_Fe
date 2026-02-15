"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { BarChart3, TrendingUp, Users, Clock, CalendarRange, Download, Filter, ArrowUpRight, ArrowDownRight, Briefcase, Zap, PieChart, Target, Rocket } from "lucide-react";
import { useHireStore } from "@/shared/data/hire-store";
import { motion } from "framer-motion";
import { Badge } from "@/shared/components/ui/badge";
import { useToast } from "@/shared/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";

const HiringReportsPage = () => {
    const [timeRange, setTimeRange] = useState("this_month");
    const { jobs, candidates, offerings } = useHireStore();
    const { toast } = useToast();
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

    // Derived Stats
    const totalHires = candidates.filter(c => c.status === "Offered").length;
    const activeJobs = jobs.filter(j => j.status === "Active").length;
    const offerAcceptanceRate = offerings.length > 0 ? Math.round((offerings.filter(o => o.status === 'Accepted').length / offerings.length) * 100) : 0;

    const stats = [
        { title: "Total Hired", value: totalHires, change: "+12%", trend: "up", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Active Openings", value: activeJobs, change: "-2", trend: "down", icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
        { title: "Avg. Time to Hire", value: "22 Days", change: "-4", trend: "up", icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50" },
        { title: "Offer Acceptance", value: `${offerAcceptanceRate}%`, change: "+5%", trend: "up", icon: Target, color: "text-amber-600", bg: "bg-amber-50" }
    ];

    return (
        <div className="flex-1 space-y-8 p-8 h-full flex flex-col bg-[#fcfdff] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hiring Analytics</h1>
                    <p className="text-slate-500 font-medium">Recruitment intelligence & pipeline health monitoring.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Select defaultValue="this_month" onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[200px] h-12 rounded-2xl bg-white border-none shadow-sm font-bold text-slate-600 px-6">
                            <CalendarRange className="mr-2 h-4 w-4 text-slate-400" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-none shadow-2xl font-bold">
                            <SelectItem value="this_month">This Month</SelectItem>
                            <SelectItem value="last_month">Last Month</SelectItem>
                            <SelectItem value="this_quarter">This Quarter</SelectItem>
                            <SelectItem value="this_year">This Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={() => setIsReportDialogOpen(true)}
                        className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-2xl h-12 px-8 shadow-xl shadow-purple-100 font-bold border-none transition-all hover:scale-105"
                    >
                        <Download className="mr-2 h-5 w-5" /> Generate Report
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-8 group hover:shadow-xl hover:shadow-purple-50 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} transition-all group-hover:scale-110`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <Badge className={`border-none rounded-lg font-black text-[10px] ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} italic`}>
                                    {stat.change} {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3 ml-1" /> : <ArrowDownRight className="h-3 w-3 ml-1" />}
                                </Badge>
                            </div>
                            <h3 className="text-slate-400 font-black text-xs uppercase tracking-widest">{stat.title}</h3>
                            <div className="text-4xl font-black text-slate-900 mt-2 tracking-tighter">{stat.value}</div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1">
                {/* Pipeline Analysis */}
                <Card className="lg:col-span-8 rounded-[3rem] border-none shadow-sm bg-white p-10 flex flex-col">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recruitment Pipeline</h2>
                            <p className="text-slate-400 font-bold text-sm italic mt-1">Conversion rates across hiring stages.</p>
                        </div>
                        <Tabs defaultValue="visual" className="w-fit">
                            <TabsList className="bg-slate-50 p-1 rounded-xl h-10 border-none shadow-inner">
                                <TabsTrigger value="visual" className="rounded-lg px-4 font-bold">Pipeline</TabsTrigger>
                                <TabsTrigger value="table" className="rounded-lg px-4 font-bold">List</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="space-y-10 flex-1 flex flex-col justify-center">
                        {[
                            { label: "Applicants", value: candidates.length, color: "bg-blue-400", meta: "Total Volume" },
                            { label: "Shortlisted", value: candidates.filter(c => c.status === 'Screening').length, color: "bg-indigo-400", meta: "High Potential" },
                            { label: "Interviews", value: candidates.filter(c => c.status === 'Interviewing').length, color: "bg-purple-400", meta: "Vetted Talent" },
                            { label: "Offered", value: totalHires, color: "bg-emerald-400", meta: "Final Selection" }
                        ].map((stage, i) => (
                            <motion.div
                                key={i}
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                                className="space-y-4"
                            >
                                <div className="flex justify-between items-end">
                                    <div>
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">{stage.label}</span>
                                        <div className="text-xl font-black text-slate-900">{stage.value}</div>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-300 italic uppercase">{stage.meta}</span>
                                </div>
                                <div className="h-6 w-full bg-slate-50 rounded-2xl overflow-hidden shadow-inner p-1">
                                    <motion.div
                                        className={`h-full ${stage.color} rounded-xl shadow-lg`}
                                        initial={{ width: "0%" }}
                                        animate={{ width: `${Math.max(10, (stage.value / candidates.length) * 100)}%` }}
                                        transition={{ delay: 0.8 + i * 0.1, duration: 1 }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>

                {/* Right Sidebar Analysis */}
                <div className="lg:col-span-4 space-y-10">
                    <Card className="rounded-[3rem] border-none shadow-sm bg-white p-10">
                        <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            <PieChart className="h-5 w-5 text-amber-400" /> Sourcing Channels
                        </h3>
                        <div className="space-y-6">
                            {[
                                { label: "LinkedIn", value: 45, color: "bg-[#0A66C2]" },
                                { label: "Internal Referral", value: 25, color: "bg-emerald-400" },
                                { label: "Direct Apply", value: 20, color: "bg-indigo-400" },
                                { label: "Agencies", value: 10, color: "bg-slate-300" }
                            ].map((channel, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className={`h-3 w-3 rounded-full ${channel.color}`} />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-slate-600">{channel.label}</span>
                                            <span className="text-xs font-black text-slate-900">{channel.value}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <div className={`h-full ${channel.color}`} style={{ width: `${channel.value}%` }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="rounded-[3rem] border-none bg-gradient-to-br from-[#CB9DF0] to-indigo-600 p-10 text-white shadow-2xl shadow-purple-200 overflow-hidden relative group">
                        <div className="relative z-10">
                            <Rocket className="h-10 w-10 mb-6 animate-pulse" />
                            <h3 className="text-2xl font-black tracking-tight leading-tight">AI Insights</h3>
                            <p className="text-white/80 font-bold text-sm mt-4 italic leading-relaxed">
                                "Your time-to-hire has improved by 15% due to proactive screening. Consider increasing Referral bonuses for Engineering roles."
                            </p>
                            <Button className="mt-8 w-full bg-white text-indigo-600 hover:bg-white/90 rounded-2xl h-14 font-black border-none shadow-xl">
                                Improve Hiring Velocity
                            </Button>
                        </div>
                        <Zap className="absolute -bottom-6 -right-6 h-32 w-32 text-white/10 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
                    </Card>
                </div>
            </div>

            {/* Config Dialog */}
            <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                <DialogContent className="bg-white rounded-[3rem] border-none p-10 max-w-2xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-4xl font-black text-slate-900 tracking-tighter">Export Intelligence</DialogTitle>
                        <DialogDescription className="font-bold text-slate-500 text-base mt-2">
                            Data-driven hiring is the only way to scale excellence.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-8 py-8">
                        <div className="space-y-3">
                            <Label className="font-black text-slate-900 text-sm ml-1">Report Format</Label>
                            <div className="grid grid-cols-3 gap-4">
                                {['PDF Executive Summary', 'Excel Raw Data', 'Interactive Slides'].map((format, i) => (
                                    <Button key={i} variant="outline" className="h-20 rounded-2xl border-2 border-slate-50 hover:border-purple-200 hover:bg-purple-50 font-black text-[10px] uppercase flex flex-col gap-2">
                                        {format === 'PDF Executive Summary' ? <Download className="h-5 w-5" /> : format === 'Excel Raw Data' ? <BarChart3 className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
                                        {format}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="font-black text-slate-900 text-sm ml-1">Included Sections</Label>
                            <div className="space-y-3">
                                {['Pipeline Funnel Analysis', 'Cost Per Hire Breakdown', 'Diversity & Inclusion Metrics', 'Interviewer Performance'].map((section, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                                        <input type="checkbox" defaultChecked className="h-5 w-5 accent-[#CB9DF0] rounded-md" />
                                        <span className="text-sm font-bold text-slate-600">{section}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-8 gap-4 flex-row sm:justify-start">
                        <Button
                            onClick={() => {
                                toast({ title: "Compiling Report", description: "Your hiring intelligence bundle is being prepared." });
                                setIsReportDialogOpen(false);
                            }}
                            className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-[1.25rem] h-14 px-10 shadow-2xl shadow-purple-50 font-black border-none flex-1"
                        >
                            Generate Bundle
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setIsReportDialogOpen(false)}
                            className="rounded-[1.25rem] h-14 px-10 font-bold text-slate-400 border-none flex-1 hover:bg-slate-50"
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HiringReportsPage;
