"use client"

import React, { useState } from "react";
import {
    UserPlus,
    Search,
    MoreHorizontal,
    Rocket,
    Clock,
    CheckCircle2,
    AlertCircle,
    List,
    LayoutGrid,
    Plus,
    ChevronRight,
    Edit,
    User,
    Trash2,
    Check,
    X,
    ChevronDown,
    ChevronUp,
    RefreshCcw,
    Trash,
    UserCircle,
    MessageSquare,
    Zap,
    History,
    Settings
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/shared/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { useLifecycleStore, NewHire } from "@/shared/data/lifecycle-store";
import { useToast } from "@/shared/components/ui/use-toast";
import { ListViewItem } from "./list-view-item";

// Sub-component for Kanban Card to handle high volume (Compact & Expandable)
const KanbanCard = ({ hire, index }: { hire: NewHire, index: number }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({ name: hire.name, position: hire.position, mentor: hire.mentor });
    const { updateNewHire, addTaskToHire, updateTaskStatus, completeOnboarding, deleteNewHire, deleteTaskFromHire, startOnboarding, onboardingDuration } = useLifecycleStore();
    const { toast } = useToast();

    const completedTasks = hire.tasks.filter(t => t.status === 'Completed').length;
    const totalTasks = hire.tasks.length;

    // Status-based solid colors with premium shadows
    const getCardStyle = () => {
        if (hire.progress === 100) return {
            bg: 'bg-emerald-50',
            shadow: 'shadow-lg shadow-emerald-100/50 hover:shadow-xl hover:shadow-emerald-200/60',
            border: 'border-l-4 border-emerald-400'
        };
        if (hire.status === 'Pre-boarding') return {
            bg: 'bg-purple-50',
            shadow: 'shadow-lg shadow-purple-100/50 hover:shadow-xl hover:shadow-purple-200/60',
            border: 'border-l-4 border-purple-400'
        };
        return {
            bg: 'bg-blue-50',
            shadow: 'shadow-lg shadow-blue-100/50 hover:shadow-xl hover:shadow-blue-200/60',
            border: 'border-l-4 border-blue-400'
        };
    };

    const cardStyle = getCardStyle();

    const handleAddTask = () => {
        if (!newTaskTitle) return;
        addTaskToHire(hire.id, {
            title: newTaskTitle,
            description: "Custom milestone",
            assignedTo: "HR",
            dueDate: new Date().toISOString().split('T')[0]
        });
        setNewTaskTitle("");
        setIsTaskDialogOpen(false);
        toast({ title: "Milestone Added", description: "Successfully added to path." });
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05 }}
        >
            <Card className={`rounded-xl border-none ${cardStyle.bg} ${cardStyle.shadow} ${cardStyle.border} transition-all duration-300 group overflow-hidden ${isExpanded ? 'ring-2 ring-indigo-200 scale-[1.01]' : ''}`}>
                <CardContent className="p-4">
                    {/* Header: Always Compact */}
                    <div className="flex justify-between items-center mb-2.5">
                        <div className="flex items-center gap-2.5">
                            <div className="relative">
                                <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center font-bold text-slate-400 text-[10px] border border-dashed border-slate-200">
                                    {hire.name.charAt(0)}
                                </div>
                                {hire.mentor !== "TBD" && (
                                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-md bg-indigo-500 border-2 border-white flex items-center justify-center text-[7px] text-white font-bold" title={`Mentor: ${hire.mentor}`}>
                                        {hire.mentor.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-[11px] font-bold text-slate-900 truncate leading-none">{hire.name}</h3>
                                <p className="text-[9px] font-bold text-slate-400 mt-0.5 truncate tracking-tight">{hire.position}</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className={`h-7 w-7 rounded-lg transition-colors ${isExpanded ? 'bg-indigo-50 text-indigo-500' : 'text-slate-300 hover:text-indigo-500'}`}
                        >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </Button>
                    </div>

                    {/* Progress Bar: Always visible */}
                    <div className="space-y-1 px-0.5">
                        <div className="flex justify-between items-center text-[9px] font-bold tracking-tight">
                            <span className="text-slate-400">{hire.progress}% Ready</span>
                            <span className="text-indigo-500">{completedTasks}/{totalTasks} Tasks</span>
                        </div>
                        <Progress value={hire.progress} className="h-1 rounded-full bg-slate-100" />
                    </div>

                    {/* Expanded Section: Tasks & Actions */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-4 mt-4 border-t border-slate-100 space-y-4">
                                    {/* Dynamic Timeline View */}
                                    <div className="bg-white/50 p-2.5 rounded-xl border border-slate-100/50">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1"><History size={10} /> {onboardingDuration}-day Journey</span>
                                            <Badge variant="outline" className="border-none bg-indigo-50 text-indigo-600 text-[8px] px-1.5 h-4 font-bold">In Progress</Badge>
                                        </div>
                                        <div className="flex justify-between items-center px-1">
                                            {[1, Math.floor(onboardingDuration / 3), Math.floor(onboardingDuration * 2 / 3), onboardingDuration].map((day, dIdx) => {
                                                const daysPassed = Math.floor((new Date().getTime() - new Date(hire.startDate).getTime()) / (1000 * 60 * 60 * 24));
                                                const isActive = daysPassed >= (day === 1 ? 0 : day);
                                                return (
                                                    <div key={day} className="flex flex-col items-center gap-1 group/day relative">
                                                        <div className={`h-2 w-2 rounded-full border-2 ${isActive ? 'bg-indigo-500 border-indigo-200' : 'bg-slate-200 border-slate-100'}`} />
                                                        <span className={`text-[8px] font-bold ${isActive ? 'text-slate-600' : 'text-slate-300'}`}>D{day}</span>
                                                        {dIdx < 3 && <div className={`absolute left-2 top-[3px] w-[54px] h-[2px] ${isActive && daysPassed > day ? 'bg-indigo-300' : 'bg-slate-100'}`} />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                                        {hire.tasks.map((task) => {
                                            const isOverdue = new Date(task.dueDate).getTime() < new Date().getTime() && task.status !== 'Completed';
                                            return (
                                                <div
                                                    key={task.id}
                                                    className="group/taskItem flex items-center gap-2"
                                                >
                                                    <div
                                                        onClick={() => updateTaskStatus(hire.id, task.id, task.status === 'Completed' ? 'Pending' : 'Completed')}
                                                        className={`flex-1 flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all border ${task.status === 'Completed' ? 'bg-emerald-50/40 border-emerald-100 text-emerald-700' : 'bg-slate-50/50 border-transparent text-slate-600 hover:border-slate-100'}`}
                                                    >
                                                        <div className={`h-4 w-4 rounded-md flex items-center justify-center border transition-all ${task.status === 'Completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 bg-white'}`}>
                                                            {task.status === 'Completed' && <Check className="h-2.5 w-2.5" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`text-[10px] font-bold truncate ${task.status === 'Completed' ? 'line-through opacity-50' : ''}`}>{task.title}</span>
                                                                {isOverdue && <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" title="Task Overdue" />}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-lg opacity-0 group-hover/taskItem:opacity-100 text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                                                        onClick={() => {
                                                            deleteTaskFromHire(hire.id, task.id);
                                                            toast({ title: "Task Removed", description: "Milestone deleted from path." });
                                                        }}
                                                    >
                                                        <Trash2 size={12} />
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                        {hire.tasks.length === 0 && <p className="text-[10px] text-slate-400 italic text-center p-2">No tasks assigned.</p>}
                                    </div>

                                    {/* Action Row */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="h-9 px-3 rounded-xl border-indigo-100 bg-indigo-50/30 text-indigo-600 font-bold text-[10px] gap-1.5 hover:bg-indigo-50"
                                                onClick={() => toast({ title: "Welcome Sent!", description: `Personalized welcome kit link sent to ${hire.name}.` })}
                                            >
                                                <MessageSquare size={13} /> Say Hello
                                            </Button>
                                            <Button
                                                className={`flex-1 rounded-xl font-bold text-[10px] h-9 gap-1 transition-all ${hire.progress === 100 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                                onClick={() => {
                                                    if (hire.progress === 100) {
                                                        if (hire.status === 'Pre-boarding') {
                                                            // Fallback if they use the finish button
                                                            startOnboarding(hire.id);
                                                            toast({ title: "Promoted", description: "Moved to active onboarding stage." });
                                                        } else {
                                                            completeOnboarding(hire.id);
                                                            toast({ title: "Welcome Home! 🎉", description: "Employee moved to Probation." });
                                                        }
                                                    } else {
                                                        toast({ title: "Tasks Pending", description: "Complete all milestones to finish journey." });
                                                    }
                                                }}
                                            >
                                                {hire.progress === 100 ? (hire.status === 'Pre-boarding' ? 'Promote' : 'Finish') : 'Manage'} <ChevronRight className="h-3 w-3" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl bg-slate-50 text-slate-400"><MoreHorizontal size={14} /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl font-bold p-1 w-40">
                                                    <DropdownMenuItem
                                                        className="rounded-lg text-[10px] h-8 px-2"
                                                        onClick={() => {
                                                            setEditFormData({ name: hire.name, position: hire.position, mentor: hire.mentor });
                                                            setIsEditDialogOpen(true);
                                                        }}
                                                    >
                                                        <Edit size={12} className="mr-2" /> Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="rounded-lg text-[10px] h-8 px-2"
                                                        onClick={() => setIsTaskDialogOpen(true)}
                                                    >
                                                        <Plus size={12} className="mr-2" /> Add Task
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => deleteNewHire(hire.id)}
                                                        className="rounded-lg text-[10px] h-8 px-2 text-rose-500 focus:text-rose-500 focus:bg-rose-50"
                                                    >
                                                        <Trash2 size={12} className="mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>

            {/* Sub-dialog for adding tasks */}
            <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                <DialogContent className="bg-white rounded-2xl border border-slate-100 p-6 max-w-sm shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">New Milestone</DialogTitle>
                        <DialogDescription className="text-[10px] font-bold text-slate-400">
                            Create a goal for {hire.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                        <Input
                            autoFocus
                            placeholder="e.g. System Access Grant"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                            className="rounded-xl h-10 bg-slate-50 border border-slate-100 font-bold px-4 text-xs"
                        />
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setIsTaskDialogOpen(false)} className="rounded-xl font-bold text-slate-400 h-9 px-4 text-xs">Cancel</Button>
                        <Button onClick={handleAddTask} className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl px-6 font-bold shadow-md shadow-purple-50 h-9 text-xs">Add Milestone</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Details Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="bg-white rounded-2xl border border-slate-100 p-6 max-w-sm shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">Edit Profile</DialogTitle>
                        <DialogDescription className="text-[10px] font-bold text-slate-400">Update candidate information.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-1">
                            <Label className="text-[10px] font-bold text-slate-500 ml-1">Full Name</Label>
                            <Input value={editFormData.name} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} className="rounded-xl h-9 bg-slate-50/50 border-slate-100 font-bold px-4 text-xs" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] font-bold text-slate-500 ml-1">Position</Label>
                            <Input value={editFormData.position} onChange={e => setEditFormData({ ...editFormData, position: e.target.value })} className="rounded-xl h-9 bg-slate-50/50 border-slate-100 font-bold px-4 text-xs" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] font-bold text-slate-500 ml-1">Mentor</Label>
                            <select
                                value={editFormData.mentor}
                                onChange={e => setEditFormData({ ...editFormData, mentor: e.target.value })}
                                className="w-full h-9 rounded-xl bg-slate-50/50 border border-slate-100 font-bold px-4 text-xs outline-none"
                            >
                                <option>Sarah Chen</option>
                                <option>David Miller</option>
                                <option>Emily Watson</option>
                                <option value="TBD">No Mentor</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl font-bold text-slate-400 h-9 px-4 text-xs">Cancel</Button>
                        <Button
                            onClick={() => {
                                updateNewHire(hire.id, editFormData);
                                setIsEditDialogOpen(false);
                                toast({ title: "Profile Updated", description: "Changes saved successfully." });
                            }}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-6 font-bold shadow-md shadow-indigo-50 h-9 text-xs"
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};

const OnboardingPage = () => {
    const { newHires, addNewHire, deleteNewHire, completeOnboarding, syncTasks, onboardingDuration, setOnboardingDuration } = useLifecycleStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
    const [activeTab, setActiveTab] = useState("all");
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: "", position: "", department: "Engineering", startDate: "", mentor: "TBD"
    });
    const [searchTerm, setSearchTerm] = useState("");

    const resetForm = () => setFormData({ name: "", position: "", department: "Engineering", startDate: "", mentor: "TBD" });

    const handleSaveHire = () => {
        if (!formData.name || !formData.startDate) {
            toast({ title: "Error", description: "Name and Start Date are required.", variant: "destructive" });
            return;
        }
        addNewHire(formData);
        toast({ title: "Registered", description: `${formData.name} added to pipeline.` });
        setIsDialogOpen(false);
        resetForm();
    };

    const filteredHires = newHires.filter(hire => {
        const matchesSearch = hire.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hire.position.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === "all" ? true :
            activeTab === "action" ? hire.progress < 100 :
                hire.progress === 100;
        return matchesSearch && matchesTab;
    });

    const StatusBadge = ({ status }: { status: NewHire['status'] }) => {
        const colors: Record<string, string> = {
            "Pre-boarding": "bg-blue-50 text-blue-600 border-blue-100",
            "Onboarding": "bg-purple-50 text-purple-600 border-purple-100",
            "Completed": "bg-emerald-50 text-emerald-600 border-emerald-100"
        };
        return <Badge className={`border font-bold rounded-lg px-3 ${colors[status]}`}>{status}</Badge>;
    };

    return (
        <div className="flex-1 space-y-4 p-4 h-screen flex flex-col bg-[#fcfdff] overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Onboarding Hub</h1>
                    <p className="text-slate-500 font-bold text-[10px] mt-0.5">"The first 90 days define the next 9 years."</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex gap-3">
                        <div className="flex items-center bg-slate-100 p-1 rounded-xl h-10">
                            <Button
                                variant="ghost"
                                onClick={() => setViewMode("kanban")}
                                className={`rounded-lg px-3 h-8 font-bold text-[10px] ${viewMode === 'kanban' ? 'bg-white shadow-sm' : 'text-slate-400'}`}
                            >
                                <LayoutGrid className="h-3.5 w-3.5 mr-1.5" /> Kanban
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setViewMode("list")}
                                className={`rounded-lg px-3 h-8 font-bold text-[10px] ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-slate-400'}`}
                            >
                                <List className="h-3.5 w-3.5 mr-1.5" /> List
                            </Button>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                syncTasks();
                                toast({ title: "Hub Synced", description: "Standard tasks applied to all candidates." });
                            }}
                            className="rounded-xl h-10 px-3 font-bold text-slate-400 hover:bg-slate-50 text-[10px]"
                        >
                            <RefreshCcw className="h-3.5 w-3.5 mr-1.5" /> Refresh
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="rounded-xl h-10 w-10 p-0 text-slate-400 hover:bg-slate-50"
                                >
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white rounded-2xl border border-slate-100 p-6 max-w-xs shadow-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-lg font-bold text-slate-900">Hub Settings</DialogTitle>
                                    <DialogDescription className="text-[10px] font-bold text-slate-400">Configure global onboarding parameters.</DialogDescription>
                                </DialogHeader>
                                <div className="py-4 space-y-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-bold text-slate-700">Journey Duration (Days)</Label>
                                        <Input
                                            type="number"
                                            value={onboardingDuration}
                                            onChange={(e) => setOnboardingDuration(Number(e.target.value))}
                                            className="h-10 rounded-xl bg-slate-50 border-slate-100 text-xs font-bold"
                                        />
                                        <p className="text-[9px] text-slate-400 font-bold">Standard framework is 90 days.</p>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Button
                            onClick={() => { resetForm(); setIsDialogOpen(true); }}
                            className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-10 px-4 shadow-lg shadow-purple-100 font-bold border-none text-[10px]"
                        >
                            <UserPlus className="mr-1.5 h-4 w-4" /> Add Hire
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    {
                        label: "Active Onboarding",
                        value: newHires.filter(h => h.status === 'Onboarding').length,
                        bg: "bg-[#CB9DF0]",
                        shadow: "shadow-sm hover:shadow-md",
                        icon: Rocket
                    },
                    {
                        label: "Pre-boarding",
                        value: newHires.filter(h => h.status === 'Pre-boarding').length,
                        bg: "bg-[#F0C1E1]",
                        shadow: "shadow-sm hover:shadow-md",
                        icon: Clock
                    },
                    {
                        label: "Ready to Launch",
                        value: newHires.filter(h => h.progress === 100).length,
                        bg: "bg-[#FDDBBB]",
                        shadow: "shadow-sm hover:shadow-md",
                        icon: CheckCircle2
                    },
                    {
                        label: "In Progress",
                        value: newHires.filter(h => h.progress < 100).length,
                        bg: "bg-[#FFF9BF]",
                        shadow: "shadow-sm hover:shadow-md",
                        icon: AlertCircle
                    }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className={`rounded-2xl border-none ${stat.bg} ${stat.shadow} transition-all duration-300 p-4`}>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-slate-700">{stat.label}</p>
                                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-white/40 backdrop-blur-sm flex items-center justify-center">
                                    <stat.icon className="h-5 w-5 text-slate-800" />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Tabs & Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-4">
                    <TabsList className="bg-slate-100/50 p-1 rounded-xl h-9">
                        <TabsTrigger value="all" className="rounded-lg px-4 font-bold text-[10px]">All candidates</TabsTrigger>
                        <TabsTrigger value="action" className="rounded-lg px-4 font-bold text-[10px]">In progress</TabsTrigger>
                        <TabsTrigger value="ready" className="rounded-lg px-4 font-bold text-[10px]">Ready</TabsTrigger>
                    </TabsList>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-300" />
                        <Input
                            placeholder="Search candidates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="rounded-xl h-9 w-48 bg-white border border-slate-100 pl-8 text-[10px] font-bold"
                        />
                    </div>
                </div>

                <TabsContent value={activeTab} className="flex-1 m-0 overflow-hidden">
                    {viewMode === 'kanban' ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full overflow-hidden">
                            {[
                                {
                                    id: "p1",
                                    title: "Pre-boarding stage",
                                    status: 'Pre-boarding',
                                    dotColor: "bg-blue-500",
                                    bgGradient: "bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-blue-50/80",
                                    borderColor: "border-blue-200/30"
                                },
                                {
                                    id: "p2",
                                    title: "Active Onboarding Hub",
                                    status: 'Onboarding',
                                    dotColor: "bg-purple-500",
                                    bgGradient: "bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-purple-50/80",
                                    borderColor: "border-purple-200/30"
                                },
                                {
                                    id: "p3",
                                    title: "Ready to complete",
                                    status: 'Ready',
                                    dotColor: "bg-emerald-500",
                                    bgGradient: "bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-emerald-50/80",
                                    borderColor: "border-emerald-200/30"
                                }
                            ].map(col => {
                                const items = col.status === 'Ready'
                                    ? filteredHires.filter(h => h.status === 'Onboarding' && h.progress === 100)
                                    : col.status === 'Pre-boarding'
                                        ? filteredHires.filter(h => h.status === 'Pre-boarding')
                                        : filteredHires.filter(h => h.status === col.status && h.progress < 100);

                                return (
                                    <div key={col.id} className={`flex flex-col ${col.bgGradient} border ${col.borderColor} rounded-2xl p-4 min-h-0 shadow-sm`}>
                                        <div className="flex items-center justify-between mb-3 px-1">
                                            <div className="flex items-center gap-2">
                                                <div className={`h-1.5 w-1.5 rounded-full ${col.dotColor}`} />
                                                <h3 className="font-bold text-[10px] text-slate-500">{col.title}</h3>
                                                <Badge className="bg-white text-slate-400 text-[8px] shadow-sm ml-1 px-1.5 h-4">{items.length}</Badge>
                                            </div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                                            <AnimatePresence mode="popLayout">
                                                {items.map((hire, idx) => (
                                                    <KanbanCard key={hire.id} hire={hire} index={idx} />
                                                ))}
                                            </AnimatePresence>
                                            {items.length === 0 && (
                                                <div className="h-16 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-[8px] font-bold text-slate-300">No candidates found</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
                            <CardContent className="p-0">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-400">
                                            <th className="px-8 py-3">Employee</th>
                                            <th className="px-6 py-3">Progress</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-8 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredHires.map((hire) => (
                                            <ListViewItem key={hire.id} hire={hire} />
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl p-8 max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">Manual Candidate Entry</DialogTitle>
                        <DialogDescription className="text-[10px] font-bold text-slate-400">Add a new hire directly to the onboarding pipeline.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-6">
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-700 ml-1">Full Name</Label>
                            <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="rounded-xl h-10 bg-slate-50/50 border-slate-100 font-bold px-4 text-xs" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-700 ml-1">Role / Position</Label>
                            <Input value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} className="rounded-xl h-10 bg-slate-50/50 border-slate-100 font-bold px-4 text-xs" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-700 ml-1">Department</Label>
                            <select
                                value={formData.department}
                                onChange={e => setFormData({ ...formData, department: e.target.value })}
                                className="w-full h-10 rounded-xl bg-slate-50/50 border border-slate-100 font-bold px-4 text-xs outline-none"
                            >
                                <option>Engineering</option>
                                <option>Design</option>
                                <option>Sales</option>
                                <option>HR</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-700 ml-1">Start Date</Label>
                            <Input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="rounded-xl h-10 bg-slate-50/50 border-slate-100 font-bold px-4 text-xs" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveHire} className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-10 px-8 font-bold w-full shadow-lg shadow-purple-100 text-xs">Launch Journey</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default OnboardingPage;
