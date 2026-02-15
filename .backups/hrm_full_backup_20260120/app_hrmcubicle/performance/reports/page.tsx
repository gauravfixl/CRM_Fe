"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { BarChart3, TrendingUp, UserCheck, Star, FileDown, ArrowUpRight, ArrowDownRight, LayoutDashboard, Target, Users, Zap } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { usePerformanceStore } from "@/shared/data/performance-store";
import { motion } from "framer-motion";

const PerformanceReportsPage = () => {
    const [activeTab, setActiveTab] = useState("summary");
    const { toast } = useToast();
    const { goals, appraisals, reviews } = usePerformanceStore();

    const avgRating = appraisals.length > 0
        ? (appraisals.reduce((acc, a) => acc + (a.rating || 0), 0) / appraisals.filter(a => a.rating).length).toFixed(1)
        : "0.0";

    const completionRate = goals.length > 0
        ? Math.round((goals.filter(g => g.status === 'Completed').length / goals.length) * 100)
        : 0;

    const stats = [
        { label: "Avg. Performance Rating", value: `${avgRating} / 5.0`, change: "+0.4", trend: "up", icon: <Star className="h-5 w-5 text-amber-500" />, color: "bg-amber-50" },
        { label: "Goal Completion Rate", value: `${completionRate}%`, change: "+5.2%", trend: "up", icon: <Target className="h-5 w-5 text-emerald-500" />, color: "bg-emerald-50" },
        { label: "Pending Reviews", value: reviews.filter(r => r.status === 'Pending').length, change: "-2", trend: "down", icon: <Users className="h-5 w-5 text-blue-500" />, color: "bg-blue-50" },
        { label: "Company Momentum", value: "High", change: "+12%", trend: "up", icon: <Zap className="h-5 w-5 text-indigo-500" />, color: "bg-indigo-50" },
    ];

    return (
        <div className="flex-1 space-y-8 p-8 h-full flex flex-col bg-[#fcfdff] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Performance Analytics</h1>
                    <p className="text-slate-500 font-medium italic">"Measurement is the first step that leads to control and eventually to improvement."</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold border-slate-200 hover:bg-slate-50" onClick={() => toast({ title: "Export Started", description: "Your performance report is being generated." })}>
                        <FileDown className="mr-2 h-5 w-5" /> Export PDF
                    </Button>
                    <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-2xl h-12 px-8 shadow-xl shadow-purple-100 font-bold border-none transition-all hover:scale-105">
                        Generate Custom Report
                    </Button>
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="rounded-[2.5rem] border-none shadow-sm p-8 hover:scale-[1.02] transition-all cursor-pointer group bg-white">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 ${stat.color} rounded-2xl`}>
                                    {stat.icon}
                                </div>
                                <div className={`flex items-center gap-1 font-black text-xs ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {stat.change} {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                                <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col flex-1">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
                    <div className="px-8 pt-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-0">
                        <TabsList className="bg-slate-100/50 p-1 rounded-2xl h-12">
                            <TabsTrigger value="summary" className="rounded-xl px-6 font-bold">Summary</TabsTrigger>
                            <TabsTrigger value="distribution" className="rounded-xl px-6 font-bold">Distribution</TabsTrigger>
                            <TabsTrigger value="goals" className="rounded-xl px-6 font-bold">Goal Analysis</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="summary" className="p-8 m-0 flex-1 overflow-auto custom-scrollbar">
                        <div className="grid gap-8 md:grid-cols-2">
                            <Card className="rounded-[2.5rem] border-slate-100 shadow-none bg-slate-50/30 p-8">
                                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-purple-400" /> Dept Performance
                                </h3>
                                <div className="space-y-8">
                                    {[
                                        { dept: "Engineering", score: "4.8", progress: 95, color: "bg-indigo-500" },
                                        { dept: "Product", score: "4.6", progress: 91, color: "bg-blue-500" },
                                        { dept: "Design", score: "4.5", progress: 88, color: "bg-purple-500" },
                                        { dept: "Sales", score: "4.2", progress: 82, color: "bg-emerald-500" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="space-y-3">
                                            <div className="flex justify-between items-center text-sm font-black italic">
                                                <span className="text-slate-700">{item.dept}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-indigo-600">{item.score}</span>
                                                    <span className="text-slate-300 font-medium text-[10px] uppercase tracking-tighter">{item.progress}% Progress</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-3">
                                                <div className={`${item.color} h-3 rounded-full transition-all duration-1000`} style={{ width: `${item.progress}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <div className="space-y-6">
                                <h3 className="text-xl font-black text-slate-900 px-4 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-emerald-400" /> Performance Insights
                                </h3>
                                {[
                                    { title: "High Momentum", desc: "Engineering department has exceeded 90% goal completion for 3 consecutive months.", color: "bg-emerald-50", text: "text-emerald-700" },
                                    { title: "Review Bottleneck", desc: "Sales department has 24 pending probation reviews nearing deadline.", color: "bg-amber-50", text: "text-amber-700" },
                                    { title: "Upskilling Required", desc: "Feedback data suggests a need for 'Project Management' workshops in Marketing Team.", color: "bg-blue-50", text: "text-blue-700" }
                                ].map((insight, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ scale: 1.02 }}
                                        className={`p-6 ${insight.color} rounded-[2rem] border-none shadow-none cursor-pointer`}
                                    >
                                        <h4 className={`font-black uppercase tracking-widest text-[10px] mb-2 ${insight.text} opacity-70`}>{insight.title}</h4>
                                        <p className={`font-bold text-sm ${insight.text}`}>{insight.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="distribution" className="p-20 text-center m-0">
                        <BarChart3 className="h-16 w-16 text-slate-100 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Bell Curve Analysis</h3>
                        <p className="text-slate-500 font-bold max-w-md mx-auto mt-4 italic">
                            Charts showing rating distribution across the organization would be rendered here using Recharts or other visualization libraries.
                        </p>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default PerformanceReportsPage;
