"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Star, Target, Award, MoreVertical, FileText, Crown, TrendingDown, CheckCircle2, Circle, Trash2, ListChecks } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
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
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/shared/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import {
    createAppraisal,
    createGoal,
    updateGoal,
    deleteGoal,
    getAllAppraisals,
    getAllGoals,
} from "@/modules/hrm/hooks/hrmHooks";
import { validateReviewForm, validateGoalForm, ValidationErrors } from "@/shared/utils/form-validation";

const TeamPerformancePage = () => {
    const { performance, members, addReview, addGoal, toggleGoal, removeGoal } = useTeamStore();
    const { toast } = useToast();

    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isGoalOpen, setIsGoalOpen] = useState(false);
    const [isViewGoalsOpen, setIsViewGoalsOpen] = useState(false);
    const [isViewReviewsOpen, setIsViewReviewsOpen] = useState(false);
    const [activeMember, setActiveMember] = useState<any>(null);
    const [detailPerf, setDetailPerf] = useState<any | null>(null);
    const [backendAvailable, setBackendAvailable] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reviewErrors, setReviewErrors] = useState<ValidationErrors>({});
    const [goalErrors, setGoalErrors] = useState<ValidationErrors>({});

    // Sync performance data from backend on mount
    React.useEffect(() => {
        const sync = async () => {
            try {
                await Promise.all([
                    getAllAppraisals().catch(() => null),
                    getAllGoals().catch(() => null),
                ]);
                setBackendAvailable(true);
            } catch {
                setBackendAvailable(false);
            }
        };
        sync();
    }, []);

    // Form states
    const [rating, setRating] = useState("4.0");
    const [feedback, setFeedback] = useState("");
    const [goalHeading, setGoalHeading] = useState("");
    const [goalPeriod, setGoalPeriod] = useState("q2");
    const [goalPriority, setGoalPriority] = useState("high");

    const performanceData = (members || []).map((m: any) => {
        const perf = (performance || []).find((p: any) => p.empId === m.id);
        return {
            ...m,
            rating: perf?.rating || "0.0",
            goalsCompleted: perf?.goalsCompleted || 0,
            totalGoals: perf?.totalGoals || 0,
            reviews: perf?.reviews || [],
            goals: perf?.goals || [],
        };
    });

    const avgRating = performanceData.length > 0
        ? (performanceData.reduce((sum: number, p: any) => sum + parseFloat(p.rating), 0) / performanceData.length).toFixed(1)
        : "0.0";

    const stats = [
        { label: "Team Avg Rating", value: `${avgRating}/5`, color: "bg-[#CB9DF0]", icon: <Star size={20} className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "High Performers", value: performanceData.filter((p: any) => parseFloat(p.rating) >= 4.5).length, color: "bg-emerald-100", icon: <Award size={20} className="text-emerald-600" />, textColor: "text-emerald-900" },
        {
            label: "Goals Completion",
            value: (() => {
                const totalGoals = performanceData.reduce((s: number, p: any) => s + p.totalGoals, 0);
                const totalCompleted = performanceData.reduce((s: number, p: any) => s + p.goalsCompleted, 0);
                return totalGoals > 0 ? `${Math.round((totalCompleted / totalGoals) * 100)}%` : "0%";
            })(),
            color: "bg-[#FFF9BF]",
            icon: <Target size={20} className="text-slate-800" />,
            textColor: "text-slate-900"
        },
    ];

    const handleOpenReview = (member: any) => {
        setActiveMember(member);
        setRating(member.rating || "4.0");
        setFeedback("");
        setIsReviewOpen(true);
    };

    const handleOpenGoal = (member: any) => {
        setActiveMember(member);
        setGoalHeading("");
        setGoalPeriod("q2");
        setGoalPriority("high");
        setIsGoalOpen(true);
    };

    const handleSaveReview = async () => {
        if (!activeMember) return;
        const errors = validateReviewForm({ rating, feedback });
        if (Object.keys(errors).length > 0) {
            setReviewErrors(errors);
            toast({ title: "Please fix form errors", description: "Feedback needs at least 20 characters.", variant: "destructive" });
            return;
        }
        setReviewErrors({});
        setIsSubmitting(true);

        try {
            if (backendAvailable) {
                await createAppraisal({
                    employee: activeMember.id,
                    period: `Q${Math.floor(new Date().getMonth() / 3) + 1} ${new Date().getFullYear()}`,
                    rating: parseFloat(rating),
                    comments: feedback,
                });
            }
            addReview(activeMember.id, { rating, feedback });
            toast({ title: "Review Submitted", description: `You have successfully reviewed ${activeMember.name}.` });
            setIsReviewOpen(false);
        } catch (err) {
            addReview(activeMember.id, { rating, feedback });
            toast({ title: "Saved Locally", description: "Backend unavailable — review saved locally.", variant: "destructive" });
            setIsReviewOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAssignGoal = async () => {
        if (!activeMember) return;
        const errors = validateGoalForm({ heading: goalHeading, period: goalPeriod, priority: goalPriority });
        if (Object.keys(errors).length > 0) {
            setGoalErrors(errors);
            toast({ title: "Please fix form errors", description: "Goal heading must be at least 5 characters.", variant: "destructive" });
            return;
        }
        setGoalErrors({});
        setIsSubmitting(true);

        try {
            if (backendAvailable) {
                const periodEndDate = new Date();
                periodEndDate.setMonth(periodEndDate.getMonth() + 3);
                await createGoal({
                    employee: activeMember.id,
                    goal: goalHeading,
                    targetDate: periodEndDate.toISOString().split('T')[0],
                });
            }
            addGoal(activeMember.id, { heading: goalHeading, period: goalPeriod, priority: goalPriority });
            toast({ title: "Goal Assigned", description: `New milestone set for ${activeMember.name}.` });
            setIsGoalOpen(false);
        } catch (err) {
            addGoal(activeMember.id, { heading: goalHeading, period: goalPeriod, priority: goalPriority });
            toast({ title: "Saved Locally", description: "Backend unavailable — goal saved locally.", variant: "destructive" });
            setIsGoalOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleExport = () => {
        const csvHeader = "Name,Designation,Department,Rating,Goals Completed,Total Goals,Completion %\n";
        const csvRows = performanceData.map((p: any) =>
            `"${p.name}","${p.designation || ''}","${p.department || ''}","${p.rating}","${p.goalsCompleted}","${p.totalGoals}","${p.totalGoals > 0 ? Math.round((p.goalsCompleted / p.totalGoals) * 100) : 0}%"`
        ).join("\n");
        const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Team_Performance_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast({ title: "Report Downloaded", description: "Team performance CSV has been exported." });
    };

    const handleViewGoals = (member: any) => {
        setActiveMember(member);
        setIsViewGoalsOpen(true);
    };

    const handleViewReviews = (member: any) => {
        setActiveMember(member);
        setIsViewReviewsOpen(true);
    };

    const getActivePerfData = () => {
        if (!activeMember) return null;
        return performanceData.find((p: any) => p.id === activeMember.id);
    };

    const priorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-rose-50 text-rose-600';
            case 'high': return 'bg-amber-50 text-amber-600';
            case 'medium': return 'bg-blue-50 text-blue-600';
            default: return 'bg-slate-50 text-slate-500';
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-[#f8fafc] p-6 space-y-6 text-start" style={{ zoom: "90%" }}>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Team Performance</h1>
                    <p className="text-slate-500 font-medium text-xs mt-2">Evaluate achievements and drive growth through performance management.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl h-10 border-slate-200 font-bold bg-white text-xs px-5 border-none shadow-sm" onClick={handleExport}>
                        <TrendingUp className="mr-2 h-4 w-4 text-indigo-500" /> Export CSV
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

            {/* Main List */}
            <div className="bg-indigo-100 p-6 rounded-[2rem] border border-indigo-200 shadow-inner">
                <div className="flex justify-between items-center mb-6 ml-2">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Personnel Evaluation</h2>
                    <Badge className="bg-white text-indigo-600 border border-indigo-100 font-bold px-3 py-1 rounded-lg text-[10px] tracking-widest shadow-sm">FY 2026 - Q1</Badge>
                </div>

                <div className="space-y-4">
                    {performanceData.length === 0 ? (
                        <div className="text-center py-12 text-xs font-bold text-slate-400">No team members to evaluate yet.</div>
                    ) : performanceData.map((perf: any, i: number) => (
                        <motion.div key={perf.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <Card
                                onClick={() => setDetailPerf(perf)}
                                className="p-3 bg-white rounded-2xl hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group border border-white/50 relative overflow-hidden mb-4 last:mb-0 cursor-pointer"
                            >
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
                                                <span className="font-bold text-sm text-indigo-600 tracking-tight">{perf.totalGoals > 0 ? Math.round((perf.goalsCompleted / perf.totalGoals) * 100) : 0}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50 relative">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.3)]"
                                                    style={{ width: `${perf.totalGoals > 0 ? (perf.goalsCompleted / perf.totalGoals) * 100 : 0}%` }}
                                                />
                                            </div>
                                            <p className="text-[9px] font-bold text-slate-400 text-right">{perf.goalsCompleted} of {perf.totalGoals} goals</p>
                                        </div>

                                        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button className="bg-slate-900 text-white rounded-xl h-9 px-5 font-bold shadow-sm hover:bg-slate-800 transition-colors text-xs border-none">
                                                        Evaluate <MoreVertical className="ml-1.5 h-3.5 w-3.5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl p-1.5 border-none shadow-xl min-w-[200px] bg-white">
                                                    <DropdownMenuItem className="font-bold text-[10px] tracking-widest py-2 rounded-lg cursor-pointer focus:bg-indigo-50" onClick={() => handleOpenReview(perf)}>
                                                        <FileText size={16} className="mr-3 text-indigo-600" /> Write Appraisal
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="font-bold text-[10px] tracking-widest py-2 rounded-lg cursor-pointer focus:bg-purple-50" onClick={() => handleOpenGoal(perf)}>
                                                        <Target size={16} className="mr-3 text-purple-600" /> Assign Goal
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="font-bold text-[10px] tracking-widest py-2 rounded-lg cursor-pointer focus:bg-emerald-50" onClick={() => handleViewGoals(perf)}>
                                                        <ListChecks size={16} className="mr-3 text-emerald-600" /> View Goals ({perf.totalGoals})
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="font-bold text-[10px] tracking-widest py-2 rounded-lg cursor-pointer focus:bg-amber-50" onClick={() => handleViewReviews(perf)}>
                                                        <Award size={16} className="mr-3 text-amber-600" /> Review History ({perf.reviews.length})
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
                <DialogContent className="bg-white rounded-2xl border border-slate-200 p-6 max-w-xl text-start">
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
                                <SelectTrigger className="rounded-xl h-10 bg-slate-50 border border-slate-200 font-bold text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-xl bg-white">
                                    <SelectItem value="5.0" className="font-bold py-2 text-xs">Outstanding (5.0)</SelectItem>
                                    <SelectItem value="4.5" className="font-bold py-2 text-xs">Excellent (4.5)</SelectItem>
                                    <SelectItem value="4.0" className="font-bold py-2 text-xs">Exceeds (4.0)</SelectItem>
                                    <SelectItem value="3.5" className="font-bold py-2 text-xs">Above Avg (3.5)</SelectItem>
                                    <SelectItem value="3.0" className="font-bold py-2 text-xs">Meets (3.0)</SelectItem>
                                    <SelectItem value="2.0" className="font-bold py-2 text-xs">Below (2.0)</SelectItem>
                                    <SelectItem value="1.0" className="font-bold py-2 text-xs">Unacceptable (1.0)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700 text-[10px] tracking-widest ml-1">Feedback * (min 20 chars)</Label>
                            <Textarea
                                placeholder="Detail strengths and areas for improvement..."
                                value={feedback}
                                onChange={(e) => { setFeedback(e.target.value); if (reviewErrors.feedback) setReviewErrors({ ...reviewErrors, feedback: "" }); }}
                                className={`rounded-xl bg-slate-50 min-h-[120px] p-4 text-sm font-medium focus:ring-1 focus:ring-indigo-100 ${reviewErrors.feedback ? 'border-2 border-rose-400' : 'border-none'}`}
                            />
                            {reviewErrors.feedback && <p className="text-[11px] font-medium text-rose-500">{reviewErrors.feedback}</p>}
                            <p className="text-[10px] text-slate-400">{feedback.length} / 20 chars minimum</p>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="rounded-xl h-11 font-bold" onClick={() => { setIsReviewOpen(false); setReviewErrors({}); }}>Cancel</Button>
                        <Button disabled={isSubmitting} className="bg-slate-900 text-white rounded-xl h-11 font-bold text-sm shadow-md hover:bg-slate-800 transition-colors border-none disabled:opacity-50" onClick={handleSaveReview}>
                            {isSubmitting ? "Publishing..." : "Publish Appraisal"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Goal Dialog */}
            <Dialog open={isGoalOpen} onOpenChange={setIsGoalOpen}>
                <DialogContent className="bg-white rounded-2xl border border-slate-200 p-6 max-w-xl text-start">
                    <DialogHeader>
                        <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                            <Target className="text-purple-600" size={24} />
                        </div>
                        <DialogTitle className="text-xl font-bold tracking-tight">Assign Milestone</DialogTitle>
                        <DialogDescription className="text-sm font-medium text-slate-500">Define a strategic goal for <span className="text-purple-600 font-bold">{activeMember?.name}</span>.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-5 py-5">
                        <div className="space-y-1">
                            <Label className="font-bold ml-1 text-[10px] text-slate-400 tracking-widest">Goal Heading * (min 5 chars)</Label>
                            <Input
                                placeholder="e.g. Lead the migration to Microservices"
                                value={goalHeading}
                                onChange={(e) => { setGoalHeading(e.target.value); if (goalErrors.heading) setGoalErrors({ ...goalErrors, heading: "" }); }}
                                className={`rounded-xl h-10 bg-slate-50 border font-bold text-sm ${goalErrors.heading ? 'border-rose-400' : 'border-slate-200'}`}
                            />
                            {goalErrors.heading && <p className="text-[11px] font-medium text-rose-500">{goalErrors.heading}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label className="font-bold ml-1 text-[10px] text-slate-400 tracking-widest">Target Period</Label>
                                <Select value={goalPeriod} onValueChange={setGoalPeriod}>
                                    <SelectTrigger className="rounded-xl h-10 bg-slate-50 border border-slate-200 font-bold text-sm">
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
                                <Select value={goalPriority} onValueChange={setGoalPriority}>
                                    <SelectTrigger className="rounded-xl h-10 bg-slate-50 border border-slate-200 font-bold text-sm">
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
                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="rounded-xl h-11 font-bold" onClick={() => { setIsGoalOpen(false); setGoalErrors({}); }}>Cancel</Button>
                        <Button disabled={isSubmitting} className="bg-slate-900 text-white rounded-xl h-11 font-bold text-sm shadow-md border-none disabled:opacity-50" onClick={handleAssignGoal}>
                            {isSubmitting ? "Assigning..." : "Assign Goal"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Goals Dialog */}
            <Dialog open={isViewGoalsOpen} onOpenChange={setIsViewGoalsOpen}>
                <DialogContent className="bg-white rounded-2xl border border-slate-200 p-6 max-w-xl text-start">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                            <ListChecks className="h-5 w-5 text-emerald-600" /> Goals for {activeMember?.name}
                        </DialogTitle>
                        <DialogDescription className="text-sm font-medium text-slate-500">Click a goal to toggle completion.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
                        {(() => {
                            const perf = getActivePerfData();
                            if (!perf || perf.goals.length === 0) {
                                return <div className="text-center py-12 text-xs font-bold text-slate-400">No goals assigned yet.</div>;
                            }
                            return perf.goals.map((g: any) => (
                                <div key={g.id} className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${g.completed ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                                    <button onClick={async () => {
                                        toggleGoal(activeMember.id, g.id);
                                        if (backendAvailable) {
                                            try { await updateGoal(g.id, { completed: !g.completed }); } catch {}
                                        }
                                    }} className="shrink-0">
                                        {g.completed ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Circle className="h-6 w-6 text-slate-300 hover:text-indigo-400" />}
                                    </button>
                                    <div className="flex-1">
                                        <p className={`text-sm font-bold ${g.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{g.heading}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge className="bg-slate-100 text-slate-600 border-none text-[9px] font-bold">{g.period.toUpperCase()}</Badge>
                                            <Badge className={`${priorityColor(g.priority)} border-none text-[9px] font-bold capitalize`}>{g.priority}</Badge>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50" onClick={async () => {
                                        removeGoal(activeMember.id, g.id);
                                        if (backendAvailable) {
                                            try { await deleteGoal(g.id); } catch {}
                                        }
                                        toast({ title: "Goal Removed", description: `"${g.heading}" deleted.` });
                                    }}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ));
                        })()}
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="rounded-xl h-10 font-bold" onClick={() => setIsViewGoalsOpen(false)}>Close</Button>
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-10 font-bold border-none" onClick={() => { setIsViewGoalsOpen(false); handleOpenGoal(activeMember); }}>
                            <Target className="mr-2 h-4 w-4" /> Add New Goal
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Reviews Dialog */}
            <Dialog open={isViewReviewsOpen} onOpenChange={setIsViewReviewsOpen}>
                <DialogContent className="bg-white rounded-2xl border border-slate-200 p-6 max-w-xl text-start">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                            <Award className="h-5 w-5 text-amber-600" /> Reviews for {activeMember?.name}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
                        {(() => {
                            const perf = getActivePerfData();
                            if (!perf || perf.reviews.length === 0) {
                                return <div className="text-center py-12 text-xs font-bold text-slate-400">No reviews written yet.</div>;
                            }
                            return perf.reviews.map((r: any) => (
                                <div key={r.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                            <span className="font-bold text-amber-600 text-sm">{r.rating}/5</span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-400">{r.date}</span>
                                    </div>
                                    <p className="text-sm text-slate-700 leading-relaxed">{r.feedback}</p>
                                </div>
                            ));
                        })()}
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="rounded-xl h-10 font-bold" onClick={() => setIsViewReviewsOpen(false)}>Close</Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 font-bold border-none" onClick={() => { setIsViewReviewsOpen(false); handleOpenReview(activeMember); }}>
                            <FileText className="mr-2 h-4 w-4" /> Write New Review
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 🪟 Slide-in: Member Performance Details */}
            <Sheet open={!!detailPerf} onOpenChange={(open) => !open && setDetailPerf(null)}>
                <SheetContent side="right" className="w-full sm:max-w-md bg-white rounded-none border-l border-slate-200 p-0 flex flex-col">
                    {detailPerf && (
                        <>
                            <SheetHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-14 w-14 ring-2 ring-white shadow">
                                        <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">{detailPerf.avatar}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-start min-w-0">
                                        <SheetTitle className="text-base font-bold text-slate-900 tracking-tight truncate">{detailPerf.name}</SheetTitle>
                                        <SheetDescription className="text-xs font-medium text-slate-500">{detailPerf.designation}</SheetDescription>
                                    </div>
                                </div>
                            </SheetHeader>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="p-5 bg-amber-50 border border-amber-100 rounded-none flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">Rating</p>
                                        <div className="flex items-baseline gap-1 mt-1">
                                            <Star className="text-amber-500 fill-amber-500" size={16} />
                                            <p className="text-2xl font-bold text-amber-900">{detailPerf.rating}</p>
                                            <span className="text-sm font-bold text-amber-600">/ 5</span>
                                        </div>
                                    </div>
                                    {parseFloat(detailPerf.rating) >= 4.5 && (
                                        <Badge className="bg-amber-200 text-amber-900 border-none text-[10px] font-bold">
                                            <Crown size={10} className="fill-amber-700 mr-1" /> Star Performer
                                        </Badge>
                                    )}
                                </div>
                                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-none">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide">Goals Progress</p>
                                        <p className="text-sm font-bold text-indigo-900">
                                            {detailPerf.goalsCompleted}/{detailPerf.totalGoals}
                                        </p>
                                    </div>
                                    <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-indigo-100">
                                        <div
                                            className="h-full bg-indigo-500"
                                            style={{ width: `${detailPerf.totalGoals > 0 ? (detailPerf.goalsCompleted / detailPerf.totalGoals) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-white border border-slate-100 rounded-none">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Goals</p>
                                        <p className="text-lg font-bold text-slate-800 mt-1">{detailPerf.totalGoals}</p>
                                    </div>
                                    <div className="p-3 bg-white border border-slate-100 rounded-none">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Reviews</p>
                                        <p className="text-lg font-bold text-slate-800 mt-1">{detailPerf.reviews.length}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 h-10 rounded-none border-slate-200 text-slate-700 font-bold text-xs"
                                    onClick={() => { handleViewGoals(detailPerf); setDetailPerf(null); }}
                                >
                                    <ListChecks size={14} className="mr-1.5" /> Goals
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 h-10 rounded-none border-amber-200 text-amber-700 hover:bg-amber-50 font-bold text-xs"
                                    onClick={() => { handleViewReviews(detailPerf); setDetailPerf(null); }}
                                >
                                    <Award size={14} className="mr-1.5" /> Reviews
                                </Button>
                                <Button
                                    className="w-full h-10 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                                    onClick={() => { handleOpenReview(detailPerf); setDetailPerf(null); }}
                                >
                                    <FileText size={14} className="mr-1.5" /> Write Appraisal
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default TeamPerformancePage;
