"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Star, Target, Award, Plus, MoreVertical, Edit, FileText, ChevronRight } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { useToast } from "@/shared/components/ui/use-toast";
import { useTeamStore } from "@/shared/data/team-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

const TeamPerformancePage = () => {
    const { members } = useTeamStore();
    const { toast } = useToast();
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isGoalOpen, setIsGoalOpen] = useState(false);
    const [activeMember, setActiveMember] = useState<any>(null);

    const performanceData = members.map(m => ({
        ...m,
        rating: (Math.random() * 2 + 3).toFixed(1),
        goalsCompleted: Math.floor(Math.random() * 5 + 8),
        totalGoals: 12
    }));

    const avgRating = (performanceData.reduce((sum, p) => sum + parseFloat(p.rating), 0) / performanceData.length).toFixed(1);

    const stats = [
        { label: "Team Avg Rating", value: `${avgRating}/5`, color: "bg-[#CB9DF0]", icon: <Star size={24} className="text-slate-800" /> },
        { label: "High Performers", value: performanceData.filter(p => parseFloat(p.rating) >= 4.5).length, color: "bg-emerald-100", icon: <Award size={24} className="text-emerald-600" /> },
        { label: "Goals Completion", value: "85%", color: "bg-[#FFF9BF]", icon: <Target size={24} className="text-slate-800" /> },
    ];

    const handleAction = (type: 'Review' | 'Goal', member: any) => {
        setActiveMember(member);
        if (type === 'Review') setIsReviewOpen(true);
        else setIsGoalOpen(true);
    };

    const handleSaveReview = () => {
        setIsReviewOpen(false);
        toast({ title: "Review Submitted", description: `You have successfully reviewed ${activeMember?.name}.` });
    };

    const handleAssignGoal = () => {
        setIsGoalOpen(false);
        toast({ title: "Goal Assigned", description: `New milestone set for ${activeMember?.name}.` });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Team Performance</h1>
                    <p className="text-slate-500 font-medium">Evaluate achievements and drive growth through performance management.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-xl h-12 border-slate-200 font-bold bg-white">
                        <TrendingUp className="mr-2 h-4 w-4 text-indigo-500" /> Progress Reports
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-lg rounded-[2.5rem] ${stat.color} p-8 relative overflow-hidden group`}>
                            <div className="relative z-10">
                                <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">{stat.value}</h3>
                                <p className="text-sm font-black uppercase tracking-widest text-slate-800 opacity-60">{stat.label}</p>
                            </div>
                            <div className="absolute right-[-20px] bottom-[-20px] text-black/5 opacity-50 group-hover:scale-110 transition-transform duration-500">
                                {React.cloneElement(stat.icon as any, { size: 120 })}
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main List */}
            <Card className="border-none shadow-xl rounded-[3rem] bg-white p-10 mt-8">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-black text-slate-900">Personnel Evaluation</h2>
                    <Badge className="bg-indigo-50 text-indigo-700 border-none font-black px-4 py-2 rounded-xl">FY 2026 - Q1</Badge>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {performanceData.map((perf, i) => (
                        <motion.div key={perf.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <div className="p-8 bg-slate-50 rounded-[2.5rem] hover:bg-slate-100/80 transition-all group border border-transparent hover:border-slate-200 shadow-sm hover:shadow-md">
                                <div className="flex flex-col xl:flex-row items-center justify-between gap-8">
                                    <div className="flex items-center gap-6 w-full xl:w-1/3">
                                        <Avatar className="h-20 w-20 ring-4 ring-white shadow-md bg-indigo-100 text-indigo-700 font-black text-2xl">
                                            <AvatarFallback>{perf.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-black text-2xl text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{perf.name}</h3>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{perf.designation}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center xl:justify-end gap-10 w-full xl:w-2/3">
                                        <div className="text-center group-hover:scale-110 transition-transform">
                                            <div className="flex items-center justify-center gap-2.5 bg-amber-400/10 px-6 py-3 rounded-[1.5rem] border border-amber-400/20 mb-2">
                                                <Star className="text-amber-500 fill-amber-500" size={24} />
                                                <span className="font-black text-3xl text-amber-600 leading-none">{perf.rating}</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Efficiency Rating</p>
                                        </div>

                                        <div className="min-w-[180px] space-y-3">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KPI Progress</span>
                                                <span className="font-black text-xl text-indigo-600">{Math.round((perf.goalsCompleted / perf.totalGoals) * 100)}%</span>
                                            </div>
                                            <Progress value={(perf.goalsCompleted / perf.totalGoals) * 100} className="h-3 bg-white border border-slate-100" />
                                            <p className="text-[10px] font-bold text-slate-400 text-right">{perf.goalsCompleted} of {perf.totalGoals} goals met</p>
                                        </div>

                                        <div className="flex gap-3">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button className="bg-slate-950 text-white rounded-2xl h-14 px-8 font-black shadow-lg hover:scale-[1.05] transition-transform">
                                                        Evaluate <MoreVertical className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-[1.5rem] p-3 border-none shadow-2xl min-w-[200px]">
                                                    <DropdownMenuItem className="font-bold rounded-xl h-12 mb-1 cursor-pointer focus:bg-indigo-50" onClick={() => handleAction('Review', perf)}>
                                                        <FileText size={18} className="mr-3 text-indigo-600" /> Write Appraisal
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="font-bold rounded-xl h-12 cursor-pointer focus:bg-purple-50" onClick={() => handleAction('Goal', perf)}>
                                                        <Target size={18} className="mr-3 text-purple-600" /> Assign Goal
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Card>

            {/* Review Dialog */}
            <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                <DialogContent className="bg-white rounded-[3rem] border-none p-10 max-w-2xl">
                    <DialogHeader>
                        <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                            <FileText className="text-indigo-600" size={32} />
                        </div>
                        <DialogTitle className="text-3xl font-black">Performance Appraisal</DialogTitle>
                        <DialogDescription className="text-lg font-medium text-slate-500">Submit a professional review for <span className="text-indigo-600 font-bold">{activeMember?.name}</span>.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-8 py-8">
                        <div className="space-y-3">
                            <Label className="font-black text-slate-700 uppercase text-[10px] tracking-widest ml-1">Overall Rating (1-5)</Label>
                            <Select defaultValue="4">
                                <SelectTrigger className="rounded-2xl h-14 bg-slate-50 border-none font-bold text-lg">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-xl">
                                    <SelectItem value="5" className="font-bold py-3">⭐⭐⭐⭐⭐ Outstanding (5.0)</SelectItem>
                                    <SelectItem value="4" className="font-bold py-3">⭐⭐⭐⭐ Exceeds (4.0)</SelectItem>
                                    <SelectItem value="3" className="font-bold py-3">⭐⭐⭐ Meets (3.0)</SelectItem>
                                    <SelectItem value="2" className="font-bold py-3">⭐⭐ Below (2.0)</SelectItem>
                                    <SelectItem value="1" className="font-bold py-3">⭐ Unacceptable (1.0)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label className="font-black text-slate-700 uppercase text-[10px] tracking-widest ml-1">Manager's Feedback</Label>
                            <Textarea
                                placeholder="Detail the employee's strengths and areas for improvement..."
                                className="rounded-[2rem] bg-slate-50 border-none min-h-[160px] p-6 text-lg font-medium focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="w-full bg-slate-900 text-white rounded-[1.8rem] h-16 font-black text-xl shadow-2xl hover:scale-[1.02] transition-transform" onClick={handleSaveReview}>
                            Publish Appraisal
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Goal Dialog */}
            <Dialog open={isGoalOpen} onOpenChange={setIsGoalOpen}>
                <DialogContent className="bg-white rounded-[3rem] border-none p-10 max-w-2xl">
                    <DialogHeader>
                        <div className="h-16 w-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                            <Target className="text-purple-600" size={32} />
                        </div>
                        <DialogTitle className="text-3xl font-black">Assign New Milestone</DialogTitle>
                        <DialogDescription className="text-lg font-medium text-slate-500">Define a strategic goal for <span className="text-purple-600 font-bold">{activeMember?.name}</span>.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-6">
                        <div className="space-y-2">
                            <Label className="font-bold ml-1">Goal Heading *</Label>
                            <Input placeholder="e.g. Lead the migration to Microservices" className="rounded-xl h-14 bg-slate-50 border-none font-bold" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="font-bold ml-1">Target Period</Label>
                                <Select defaultValue="q2">
                                    <SelectTrigger className="rounded-xl h-14 bg-slate-50 border-none font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="q1">Q1 Jan-Mar</SelectItem>
                                        <SelectItem value="q2">Q2 Apr-Jun</SelectItem>
                                        <SelectItem value="q3">Q3 Jul-Sep</SelectItem>
                                        <SelectItem value="q4">Q4 Oct-Dec</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold ml-1">Priority</Label>
                                <Select defaultValue="high">
                                    <SelectTrigger className="rounded-xl h-14 bg-slate-50 border-none font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="critical">Critical</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="w-full bg-slate-900 text-white rounded-[1.8rem] h-16 font-black text-xl shadow-2xl" onClick={handleAssignGoal}>
                            Assign Goal
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TeamPerformancePage;
