"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Target,
    Plus,
    Search,
    Calendar,
    MoreVertical,
    Edit,
    Trash2,
    TrendingUp,
    ShieldCheck,
    ArrowRight,
    Filter,
    Activity,
    CheckCircle2,
    Clock,
    Flame,
    Zap,
    ChevronDown,
    Network,
    Scale
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useToast } from "@/shared/components/ui/use-toast";
import { usePerformanceStore, type Goal } from "@/shared/data/performance-store";
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
import { Textarea } from "@/shared/components/ui/textarea";

const GoalsPage = () => {
    const { toast } = useToast();
    const { goals, addGoal, updateGoal, deleteGoal, approveGoal } = usePerformanceStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
    const [filterCategory, setFilterCategory] = useState<string | 'All'>('All');

    const [formData, setFormData] = useState<Omit<Goal, 'id'>>({
        title: "",
        progress: 0,
        status: "Draft",
        dueDate: "",
        description: "",
        priority: "Medium",
        category: "Technical",
        alignment: "Individual",
        weightage: 20
    });

    const handleSave = () => {
        if (!formData.title || !formData.dueDate) {
            toast({ title: "Validation Error", description: "Title and Due Date are mandatory", variant: "destructive" });
            return;
        }

        if (activeGoal) {
            updateGoal(activeGoal.id, formData);
            toast({ title: "Objective Updated", description: "Goal progress and details updated successfully." });
        } else {
            addGoal(formData);
            toast({ title: "Goal Created", description: "Goal is now in 'Draft' and awaiting approval." });
        }
        setIsDialogOpen(false);
        setActiveGoal(null);
        setFormData({ title: "", progress: 0, status: "Draft", dueDate: "", description: "", priority: "Medium", category: "Technical", alignment: "Individual", weightage: 20 });
    };

    const getStatusStyles = (status: Goal['status']) => {
        const styles = {
            'Draft': 'bg-slate-100 text-slate-500 border-slate-200',
            'Awaiting Approval': 'bg-amber-100 text-amber-700 border-amber-200',
            'On Track': 'bg-indigo-50 text-indigo-600 border-indigo-100',
            'Ahead': 'bg-emerald-50 text-emerald-600 border-emerald-100',
            'At Risk': 'bg-rose-50 text-rose-600 border-rose-100',
            'Behind': 'bg-rose-100 text-rose-800 border-rose-200',
            'Completed': 'bg-slate-900 text-white border-transparent'
        };
        return styles[status];
    };

    const filteredGoals = goals.filter(g => {
        const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = filterCategory === 'All' || g.category === filterCategory;
        return matchesSearch && matchesCat;
    });

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans" style={{ zoom: "80%" }}>
            <header className="py-2.5 px-8 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm rounded-b-3xl">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1 text-start">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Goals & OKRs</h1>
                            <Badge className="bg-amber-100 text-amber-700 border-none font-bold text-[10px] tracking-widest h-6 px-3">HR Control</Badge>
                        </div>
                        <p className="text-slate-500 text-sm font-semibold">Define structure, set weightage, and manage goal approval workflows.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => { setActiveGoal(null); setIsDialogOpen(true); }}
                            className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100 transition-all gap-2 text-[10px] tracking-widest border-none"
                        >
                            <Plus size={16} /> Configure New Goal
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-8 max-w-[1600px] mx-auto w-full space-y-8">
                {/* Visual Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="rounded-3xl bg-indigo-50 border border-indigo-100 p-7 shadow-sm text-start group hover:shadow-md transition-all">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-indigo-400 tracking-widest leading-none">Total Weightage</p>
                            <h3 className="text-4xl font-bold tracking-tight text-indigo-700">{goals.reduce((acc, g) => acc + (g.weightage || 0), 0)}%</h3>
                            <p className="text-[9px] font-bold text-indigo-300 tracking-tight">Across All Active Goals</p>
                        </div>
                    </Card>

                    <Card className="rounded-3xl bg-amber-50 border border-amber-100 p-7 flex flex-col justify-between text-start shadow-sm group hover:shadow-md transition-all">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-amber-500 tracking-widest">Awaiting Approval</p>
                            <h3 className="text-4xl font-bold text-amber-700 tracking-tight">{goals.filter(g => g.status === 'Draft' || g.status === 'Awaiting Approval').length}</h3>
                            <p className="text-[9px] font-bold text-amber-500/60">Action Required</p>
                        </div>
                    </Card>

                    <Card className="rounded-3xl bg-blue-50 border border-blue-100 p-7 flex flex-col justify-between text-start shadow-sm group hover:shadow-md transition-all">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-blue-500 tracking-widest">Alignment (Company)</p>
                            <h3 className="text-4xl font-bold text-blue-700 tracking-tight">{goals.filter(g => g.alignment === 'Company').length}</h3>
                            <p className="text-[9px] font-bold text-blue-500/60">Strategic Focus</p>
                        </div>
                    </Card>

                    <Card className="rounded-3xl bg-emerald-50 border border-emerald-100 p-7 flex flex-col justify-between text-start shadow-sm group hover:shadow-md transition-all">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-emerald-500 tracking-widest">Active Velocity</p>
                            <h3 className="text-4xl font-bold text-emerald-700 tracking-tight">{goals.filter(g => g.status === 'On Track').length}</h3>
                            <p className="text-[9px] font-bold text-emerald-500/60">Execution Rate</p>
                        </div>
                    </Card>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Goal List Header */}
                    <div className="flex items-center justify-between">
                        <div className="relative group max-w-md w-full">
                            <Search className="absolute left-4 top-1/2 -transform -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                            <Input
                                placeholder="Search by outcome or alignment..."
                                className="pl-11 h-12 rounded-xl bg-white border-slate-100 focus:border-indigo-500 shadow-sm font-semibold transition-all text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            {['All', 'Awaiting Approval', 'On Track', 'Completed'].map(status => (
                                <Button
                                    key={status}
                                    variant="ghost"
                                    className={`h-9 px-4 rounded-lg text-[10px] font-bold tracking-widest ${filterCategory === status ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'text-slate-400'}`}
                                    onClick={() => setFilterCategory(status)}
                                >
                                    {status}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="popLayout">
                        <div className="grid grid-cols-1 gap-4">
                            {filteredGoals.map((goal, i) => (
                                <motion.div
                                    key={goal.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card className="group border border-slate-100 shadow-sm hover:shadow-xl transition-all rounded-3xl bg-white overflow-hidden hover:border-indigo-100 p-0">
                                        <CardContent className="p-5 text-start">
                                            <div className="flex flex-col lg:flex-row gap-5">
                                                <div className="flex-1 space-y-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <Badge variant="outline" className={`border-none font-bold text-[9px] h-5 px-3 rounded-md shadow-sm tracking-widest ${getStatusStyles(goal.status)}`}>
                                                                {goal.status}
                                                            </Badge>
                                                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-none font-bold text-[9px] h-5 px-3 rounded-md tracking-widest">
                                                                <Network size={10} className="mr-1.5" /> {goal.alignment} Focus
                                                            </Badge>
                                                            <Badge variant="outline" className="bg-slate-50 text-slate-500 border-none font-bold text-[9px] h-5 px-3 rounded-md tracking-widest shadow-none">
                                                                <Scale size={10} className="mr-1.5" /> Weightage: {goal.weightage}%
                                                            </Badge>
                                                        </div>
                                                        <h3 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">
                                                            {goal.title}
                                                        </h3>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <div className="flex justify-between items-end">
                                                            <span className="text-[10px] font-bold text-slate-400 tracking-widest">Real-Time Progress</span>
                                                            <span className="text-sm font-bold tabular-nums text-slate-900">{goal.progress}%</span>
                                                        </div>
                                                        <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${goal.progress}%` }}
                                                                transition={{ duration: 1.5 }}
                                                                className="h-full bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.4)]"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex lg:flex-col justify-center gap-1.5 shrink-0 lg:border-l border-slate-50 lg:pl-5 min-w-[180px]">
                                                    {(goal.status === 'Draft' || goal.status === 'Awaiting Approval') && (
                                                        <Button
                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-9 px-4 font-bold text-[10px] tracking-widest gap-2 transition-all border-none shadow-md shadow-emerald-100"
                                                            onClick={() => approveGoal(goal.id)}
                                                        >
                                                            <CheckCircle2 size={12} /> Approve Goal
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl h-9 px-4 font-bold text-[10px] tracking-widest gap-2 transition-all border border-transparent hover:border-indigo-100"
                                                        onClick={() => { setActiveGoal(goal); setFormData(goal); setIsDialogOpen(true); }}
                                                    >
                                                        <Edit size={12} /> Edit Config
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl h-9 px-4 font-bold text-[10px] tracking-widest gap-2 transition-all"
                                                        onClick={() => { deleteGoal(goal.id); toast({ title: "Goal Removed", description: "Objective purged from the directory." }); }}
                                                    >
                                                        <Trash2 size={12} /> Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Config Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white rounded-[2.5rem] border border-slate-900 p-0 max-w-4xl shadow-3xl overflow-hidden font-sans" style={{ zoom: "80%" }}>
                    <div className="flex flex-col h-full">
                        <DialogHeader className="p-10 pb-6 space-y-4 text-start bg-slate-50/50">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 flex-shrink-0">
                                    <Target size={28} />
                                </div>
                                <div className="space-y-1">
                                    <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Goal Configuration</DialogTitle>
                                    <DialogDescription className="text-slate-500 font-semibold text-sm">Define alignment, importance weightage, and approval status for the performance cycle.</DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="p-10 pt-0">
                            <div className="rounded-[2rem] bg-white p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-start">
                                    <div className="md:col-span-2 lg:col-span-3 space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-400 tracking-widest ml-1">Goal Outcome / Title *</Label>
                                        <Input
                                            className="rounded-xl h-12 bg-slate-50 border-slate-200 font-bold px-5 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
                                            placeholder="e.g. Increase revenue by 20% in Q1"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-400 tracking-widest ml-1">Alignment Level</Label>
                                        <Select value={formData.alignment} onValueChange={(v) => setFormData({ ...formData, alignment: v as any })}>
                                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold px-5 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-none shadow-2xl p-1.5 font-bold">
                                                <SelectItem value="Company" className="rounded-lg h-10 text-[11px] tracking-wide">Company Objectives</SelectItem>
                                                <SelectItem value="Department" className="rounded-lg h-10 text-[11px] tracking-wide">Departmental Goals</SelectItem>
                                                <SelectItem value="Individual" className="rounded-lg h-10 text-[11px] tracking-wide">Individual Achievements</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-400 tracking-widest ml-1">Goal Weightage (%)</Label>
                                        <Input
                                            type="number"
                                            className="rounded-xl h-12 bg-slate-50 border-slate-200 font-bold px-5 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
                                            value={formData.weightage}
                                            onChange={(e) => setFormData({ ...formData, weightage: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-400 tracking-widest ml-1">Target Due Date</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <Input
                                                type="date"
                                                className="rounded-xl h-12 pl-12 bg-slate-50 border-slate-200 font-bold pr-5 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
                                                value={formData.dueDate}
                                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-400 tracking-widest ml-1">Launch Status</Label>
                                        <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as any })}>
                                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold px-5 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-sm">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-none shadow-2xl p-1.5 font-bold">
                                                <SelectItem value="Draft" className="rounded-lg h-10 text-[11px] tracking-wide">Draft Mode</SelectItem>
                                                <SelectItem value="Awaiting Approval" className="rounded-lg h-10 text-[11px] tracking-wide">Submit for Audit</SelectItem>
                                                <SelectItem value="On Track" className="rounded-lg h-10 text-[11px] tracking-wide">Live (Effective)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="md:col-span-2 lg:col-span-2 space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-400 tracking-widest ml-1">Operational Description</Label>
                                        <Textarea
                                            className="rounded-xl bg-slate-50 border-slate-200 font-semibold p-4 min-h-[80px] text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-inner"
                                            placeholder="Details on key results and success metrics..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="gap-3 mt-8 sm:justify-end">
                                <Button variant="ghost" className="h-12 px-8 rounded-xl font-bold text-[10px] tracking-widest text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all" onClick={() => setIsDialogOpen(false)}>Discard</Button>
                                <Button
                                    className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-12 px-10 font-bold text-[11px] tracking-widest shadow-xl shadow-indigo-100 transition-all border-none"
                                    onClick={handleSave}
                                >
                                    Commit Objective Parameters
                                </Button>
                            </DialogFooter>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default GoalsPage;
