"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Plus, Trash2, Search, Target, Calendar, MoreVertical, Edit } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { usePerformanceStore, type Goal } from "@/shared/data/performance-store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";

const PerformanceGoalsPage = () => {
    const { toast } = useToast();
    const { goals, addGoal, updateGoal, deleteGoal } = usePerformanceStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeGoal, setActiveGoal] = useState<Goal | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        progress: 0,
        status: "On Track" as Goal['status'],
        dueDate: ""
    });

    const resetForm = () => {
        setFormData({ title: "", progress: 0, status: "On Track", dueDate: "" });
        setActiveGoal(null);
    };

    const handleSave = () => {
        if (!formData.title || !formData.dueDate) {
            toast({ title: "Validation Error", description: "Please fill in all fields.", variant: "destructive" });
            return;
        }

        if (activeGoal) {
            updateGoal(activeGoal.id, formData);
            toast({ title: "Goal Updated", description: "Your goal has been updated successfully." });
        } else {
            addGoal(formData);
            toast({ title: "Goal Created", description: "Your new performance goal has been added." });
        }
        setIsDialogOpen(false);
        resetForm();
    };

    const handleEdit = (goal: Goal) => {
        setActiveGoal(goal);
        setFormData({
            title: goal.title,
            progress: goal.progress,
            status: goal.status,
            dueDate: goal.dueDate
        });
        setIsDialogOpen(true);
    };

    const handleDeleteGoal = (id: string) => {
        if (confirm("Are you sure you want to delete this goal?")) {
            deleteGoal(id);
            toast({ title: "Goal Deleted", description: "The goal has been removed.", variant: "destructive" });
        }
    };

    const filteredGoals = goals.filter(goal =>
        goal.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            "On Track": "bg-blue-100 text-blue-700",
            "Ahead": "bg-green-100 text-green-700",
            "At Risk": "bg-amber-100 text-amber-700",
            "Behind": "bg-red-100 text-red-700",
            "Completed": "bg-emerald-100 text-emerald-700"
        };
        return <Badge className={`border-none ${styles[status]}`}>{status}</Badge>;
    };

    return (
        <div className="flex-1 space-y-8 p-8 h-full flex flex-col bg-[#fcfdff]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Goals & OKRs</h1>
                    <p className="text-slate-500 font-medium">Track your personal and team performance objectives.</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setIsDialogOpen(true); }}
                    className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-2xl h-12 px-8 shadow-xl shadow-purple-100 font-bold border-none transition-all hover:scale-105"
                >
                    <Plus className="mr-2 h-5 w-5" /> Create Goal
                </Button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-[2.5rem] border-none shadow-sm bg-blue-50/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black text-blue-900 uppercase tracking-widest">Active Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-blue-900">{goals.length}</div>
                    </CardContent>
                </Card>
                <Card className="rounded-[2.5rem] border-none shadow-sm bg-emerald-50/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black text-emerald-900 uppercase tracking-widest">Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-emerald-900">{goals.filter(g => g.status === 'Completed').length}</div>
                    </CardContent>
                </Card>
                <Card className="rounded-[2.5rem] border-none shadow-sm bg-purple-50/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black text-purple-900 uppercase tracking-widest">Overall Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-purple-900">
                            {goals.length > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) : 0}%
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search & List */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col flex-1">
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search goals..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 rounded-2xl border-none bg-slate-50 h-12 font-medium focus-visible:ring-2 focus-visible:ring-purple-100"
                    />
                </div>

                <div className="grid gap-4 overflow-y-auto custom-scrollbar pr-2">
                    {filteredGoals.map((goal) => (
                        <div key={goal.id} className="p-6 rounded-[2rem] border border-slate-50 bg-white hover:bg-slate-50/50 transition-all group relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                                        <Target className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 text-lg">{goal.title}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <StatusBadge status={goal.status} />
                                            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                                                <Calendar className="h-3.5 w-3.5" />
                                                Due: {goal.dueDate}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-10 w-10 rounded-xl p-0 text-slate-300 group-hover:text-slate-600 group-hover:bg-white">
                                            <MoreVertical className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 w-48">
                                        <DropdownMenuItem onClick={() => handleEdit(goal)} className="rounded-xl h-11 font-bold">
                                            <Edit className="h-4 w-4 mr-2" /> Edit Goal
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDeleteGoal(goal.id)} className="rounded-xl h-11 font-bold text-red-600 focus:bg-red-50 focus:text-red-600">
                                            <Trash2 className="h-4 w-4 mr-2" /> Delete Goal
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Progress</span>
                                    <span className="text-sm font-black text-slate-900">{goal.progress}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#CB9DF0] rounded-full transition-all duration-1000"
                                        style={{ width: `${goal.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredGoals.length === 0 && (
                        <div className="h-48 flex flex-col items-center justify-center text-slate-400 italic">
                            No matching goals found.
                        </div>
                    )}
                </div>
            </div>

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white rounded-[3rem] border-none p-10 max-w-xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black text-slate-900">
                            {activeGoal ? "Edit Goal" : "Create New Goal"}
                        </DialogTitle>
                        <DialogDescription className="font-bold text-slate-500 text-base mt-2">
                            Define your performance objectives clearly.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-8 py-6">
                        <div className="space-y-3">
                            <Label className="font-black text-slate-900 text-sm ml-1">Goal Title</Label>
                            <Input
                                placeholder="e.g. Complete Advanced React Training"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold px-6"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="font-black text-slate-900 text-sm ml-1">Due Date</Label>
                                <Input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold px-6"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="font-black text-slate-900 text-sm ml-1">Progress (%)</Label>
                                <Input
                                    type="number"
                                    min="0" max="100"
                                    value={formData.progress}
                                    onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                                    className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold px-6"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="font-black text-slate-900 text-sm ml-1">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(val) => setFormData({ ...formData, status: val as any })}
                            >
                                <SelectTrigger className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus:ring-2 focus:ring-purple-100 font-bold px-6">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold">
                                    <SelectItem value="On Track" className="rounded-xl h-11">On Track</SelectItem>
                                    <SelectItem value="Ahead" className="rounded-xl h-11">Ahead</SelectItem>
                                    <SelectItem value="At Risk" className="rounded-xl h-11 text-amber-600">At Risk</SelectItem>
                                    <SelectItem value="Behind" className="rounded-xl h-11 text-red-600">Behind</SelectItem>
                                    <SelectItem value="Completed" className="rounded-xl h-11 text-emerald-600">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="mt-8 gap-4 flex-row sm:justify-start">
                        <Button
                            onClick={handleSave}
                            className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-[1.25rem] h-14 px-10 shadow-2xl shadow-purple-50 font-black border-none flex-1"
                        >
                            {activeGoal ? "Update Objective" : "Establish Goal"}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setIsDialogOpen(false)}
                            className="rounded-[1.25rem] h-14 px-10 font-bold text-slate-400 border-none flex-1 hover:bg-slate-50"
                        >
                            Discard
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PerformanceGoalsPage;
