"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Star, Target, Award, Plus, MoreVertical, Edit, FileText, ChevronRight, Crown, TrendingDown } from "lucide-react";
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
} from "@/shared/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

const TeamPerformancePage = () => {
    const { performance, addReview, updateGoals, members } = useTeamStore();
    const { toast } = useToast();
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isGoalOpen, setIsGoalOpen] = useState(false);
    const [activeMember, setActiveMember] = useState<any>(null);

    // Form states
    const [rating, setRating] = useState("4.0");
    const [feedback, setFeedback] = useState("");
    const [goalHeading, setGoalHeading] = useState("");

    const performanceData = members.map((m: any) => {
        const perf = performance.find((p: any) => p.empId === m.id);
        return {
            ...m,
            rating: perf?.rating || "0.0",
            goalsCompleted: perf?.goalsCompleted || 0,
            totalGoals: perf?.totalGoals || 0
        };
    });

    const avgRating = (performanceData.reduce((sum: number, p: any) => sum + parseFloat(p.rating), 0) / (performanceData.length || 1)).toFixed(1);

    const stats = [
        { label: "Team Avg Rating", value: `${avgRating}/5`, color: "bg-[#CB9DF0]", icon: <Star size={20} className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "High Performers", value: performanceData.filter((p: any) => parseFloat(p.rating) >= 4.5).length, color: "bg-emerald-100", icon: <Award size={20} className="text-emerald-600" />, textColor: "text-emerald-900" },
        { label: "Goals Completion", value: "85%", color: "bg-[#FFF9BF]", icon: <Target size={20} className="text-slate-800" />, textColor: "text-slate-900" },
    ];

    const handleAction = (type: 'Review' | 'Goal', member: any) => {
        setActiveMember(member);
        if (type === 'Review') setIsReviewOpen(true);
        else setIsGoalOpen(true);
    };

    const handleSaveReview = () => {
        if (!activeMember) return;
        addReview(activeMember.id, { rating, feedback });
        setIsReviewOpen(false);
        setFeedback("");
        toast({ title: "Review Submitted", description: `You have successfully reviewed ${activeMember.name}.` });
    };

    const handleAssignGoal = () => {
        if (!activeMember) return;
        // Simple increment for demo purposes, or reset
        updateGoals(activeMember.id, activeMember.goalsCompleted, activeMember.totalGoals + 2);
        setIsGoalOpen(false);
        setGoalHeading("");
        toast({ title: "Goal Assigned", description: `New milestone set for ${activeMember.name}.` });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#f8fafc] p-6 space-y-6 text-start">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Team Performance</h1>
                    <p className="text-slate-500 font-medium text-xs mt-2">Evaluate achievements and drive growth through performance management.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl h-10 border-slate-200 font-bold bg-white text-xs px-5 border-none shadow-sm" onClick={() => toast({ title: "Report Generation", description: "Your team progress report is being compiled and will be available shortly." })}>
                        <TrendingUp className="mr-2 h-4 w-4 text-indigo-500" /> Progress Reports
                    </Button>
                </div>
            </div>

            {/* Stats */}
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

            {/* Main List Container */}
            <div className="bg-indigo-100 p-6 rounded-[2rem] border border-indigo-200 shadow-inner">
                <div className="flex justify-between items-center mb-6 ml-2">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Personnel Evaluation</h2>
                    <Badge className="bg-white text-indigo-600 border border-indigo-100 font-bold px-3 py-1 rounded-lg text-[10px] tracking-widest shadow-sm">FY 2026 - Q1</Badge>
                </div>

                <div className="space-y-4">
                    {performanceData.map((perf, i) => (
                        <motion.div key={perf.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <Card className="p-3 bg-white rounded-2xl hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group border border-white/50 relative overflow-hidden mb-4 last:mb-0">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-indigo-500 transition-all" />
                                <div className="flex flex-col xl:flex-row items-center justify-between gap-4 relative z-10">
                                    <div className="flex items-center gap-4 w-full xl:w-1/3 text-start">
                                        <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm bg-indigo-50 text-indigo-700 font-bold text-sm">
                                            <AvatarFallback>{perf.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-base text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{perf.name}</h3>
                                                {parseFloat(perf.rating) >= 4.5 && (
                                                    <Badge className="bg-amber-100 text-amber-600 border-none p-1 rounded-full px-2 gap-1 text-[8px] font-bold">
                                                        <Crown size={10} className="fill-amber-500" /> Star
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1 tracking-tight">{perf.designation}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center xl:justify-end gap-10 w-full xl:w-2/3">
                                        <div className="text-center group-hover:scale-105 transition-transform">
                                            <div className="flex items-center justify-center gap-2 bg-amber-400/10 px-3 py-1 rounded-lg border border-amber-400/20 mb-1">
                                                <Star className="text-amber-500 fill-amber-500" size={14} />
                                                <span className="font-bold text-base text-amber-600 leading-none">{perf.rating}</span>
                                                {parseFloat(perf.rating) > 4.0 ? (
                                                    <TrendingUp size={12} className="text-emerald-500" />
                                                ) : (
                                                    <TrendingDown size={12} className="text-rose-500" />
                                                )}
                                            </div>
                                            <p className="text-[9px] text-slate-400 font-bold tracking-widest leading-none">Efficiency</p>
                                        </div>

                                        <div className="min-w-[140px] space-y-1.5">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[9px] font-bold text-slate-400 tracking-widest">KPI Progress</span>
                                                <span className="font-bold text-sm text-indigo-600 tracking-tight">{Math.round((perf.goalsCompleted / perf.totalGoals) * 100)}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50 relative">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.3)]"
                                                    style={{ width: `${(perf.goalsCompleted / perf.totalGoals) * 100}%` }}
                                                />
                                            </div>
                                            <p className="text-[9px] font-bold text-slate-400 text-right">{perf.goalsCompleted} of {perf.totalGoals} goals</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button className="bg-slate-900 text-white rounded-xl h-9 px-5 font-bold shadow-sm hover:bg-slate-800 transition-colors text-xs border-none">
                                                        Evaluate <MoreVertical className="ml-1.5 h-3.5 w-3.5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl p-1.5 border-none shadow-xl min-w-[180px] bg-white">
                                                    <DropdownMenuItem className="font-bold text-[10px] tracking-widest py-2 rounded-lg cursor-pointer focus:bg-indigo-50" onClick={() => handleAction('Review', perf)}>
                                                        <FileText size={16} className="mr-3 text-indigo-600" /> Write Appraisal
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="font-bold text-[10px] tracking-widest py-2 rounded-lg cursor-pointer focus:bg-purple-50" onClick={() => handleAction('Goal', perf)}>
                                                        <Target size={16} className="mr-3 text-purple-600" /> Assign Goal
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Review Dialog */}
            <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                <DialogContent className="bg-white rounded-2xl border-none p-6 max-w-xl text-start">
                    <DialogHeader>
                        <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                            <FileText className="text-indigo-600" size={24} />
                        </div>
                        <DialogTitle className="text-xl font-bold tracking-tight">Performance Appraisal</DialogTitle>
                        <DialogDescription className="text-sm font-medium text-slate-500">Submit a professional review for <span className="text-indigo-600 font-bold">{activeMember?.name}</span>.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-6">
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700 text-[10px] tracking-widest ml-1">Overall Rating</Label>
                            <Select value={rating} onValueChange={setRating}>
                                <SelectTrigger className="rounded-xl h-10 bg-slate-50 border-none font-bold text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-xl bg-white">
                                    <SelectItem value="5.0" className="font-bold py-2 text-xs">Outstanding (5.0)</SelectItem>
                                    <SelectItem value="4.0" className="font-bold py-2 text-xs">Exceeds (4.0)</SelectItem>
                                    <SelectItem value="3.0" className="font-bold py-2 text-xs">Meets (3.0)</SelectItem>
                                    <SelectItem value="2.0" className="font-bold py-2 text-xs">Below (2.0)</SelectItem>
                                    <SelectItem value="1.0" className="font-bold py-2 text-xs">Unacceptable (1.0)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700 text-[10px] tracking-widest ml-1">Feedback</Label>
                            <Textarea
                                placeholder="Detail strengths and areas for improvement..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="rounded-xl bg-slate-50 border-none min-h-[120px] p-4 text-sm font-medium focus:ring-1 focus:ring-indigo-100"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="w-full bg-slate-900 text-white rounded-xl h-11 font-bold text-sm shadow-md hover:bg-slate-800 transition-colors border-none" onClick={handleSaveReview}>
                            Publish Appraisal
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Goal Dialog */}
            <Dialog open={isGoalOpen} onOpenChange={setIsGoalOpen}>
                <DialogContent className="bg-white rounded-2xl border-none p-6 max-w-xl text-start">
                    <DialogHeader>
                        <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                            <Target className="text-purple-600" size={24} />
                        </div>
                        <DialogTitle className="text-xl font-bold tracking-tight">Assign Milestone</DialogTitle>
                        <DialogDescription className="text-sm font-medium text-slate-500">Define a strategic goal for <span className="text-purple-600 font-bold">{activeMember?.name}</span>.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-5 py-5">
                        <div className="space-y-2">
                            <Label className="font-bold ml-1 text-[10px] text-slate-400 tracking-widest">Goal Heading</Label>
                            <Input
                                placeholder="e.g. Lead the migration to Microservices"
                                value={goalHeading}
                                onChange={(e) => setGoalHeading(e.target.value)}
                                className="rounded-xl h-10 bg-slate-50 border-none font-bold text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label className="font-bold ml-1 text-[10px] text-slate-400 tracking-widest">Target Period</Label>
                                <Select defaultValue="q2">
                                    <SelectTrigger className="rounded-xl h-10 bg-slate-50 border-none font-bold text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-none shadow-xl rounded-xl">
                                        <SelectItem value="q1" className="text-xs font-bold">Q1 Jan-Mar</SelectItem>
                                        <SelectItem value="q2" className="text-xs font-bold">Q2 Apr-Jun</SelectItem>
                                        <SelectItem value="q3" className="text-xs font-bold">Q3 Jul-Sep</SelectItem>
                                        <SelectItem value="q4" className="text-xs font-bold">Q4 Oct-Dec</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold ml-1 text-[10px] text-slate-400 tracking-widest">Priority</Label>
                                <Select defaultValue="high">
                                    <SelectTrigger className="rounded-xl h-10 bg-slate-50 border-none font-bold text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-none shadow-xl rounded-xl">
                                        <SelectItem value="critical" className="text-xs font-bold">Critical</SelectItem>
                                        <SelectItem value="high" className="text-xs font-bold">High</SelectItem>
                                        <SelectItem value="medium" className="text-xs font-bold">Medium</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="w-full bg-slate-900 text-white rounded-xl h-11 font-bold text-sm shadow-md border-none" onClick={handleAssignGoal}>
                            Assign Goal
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TeamPerformancePage;
